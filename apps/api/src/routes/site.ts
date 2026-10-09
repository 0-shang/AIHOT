// First-party site API (/api/site/*). Not public, not versioned, never called /api/v2.
// Reads through the same public read layer as v1; no cookies are read or set.
import { FEATURES } from "@aihot/industry/features";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isCategoryKey, isChannelKey, type CategoryKey, type ChannelKey } from "@aihot/contracts/taxonomy";
import { InvalidCursorError } from "@aihot/backend/lib/cursor";
import { exportMarkdown, loadItemDetail, siteItemDetail } from "@aihot/backend/publication/detail";
import { loadPool, SearchBusyError } from "@aihot/backend/publication/pool";
import { loadTimeline } from "@aihot/backend/publication/timeline";
import { loadStoryFollowups } from "@aihot/backend/publication/followups";
import { loadDevelopments, loadGroupReports } from "@aihot/backend/publication/groups";
import { loadTopicTags } from "@aihot/backend/publication/topics";
import { loadHotStrip } from "@aihot/backend/events/hot-read";
import { loadChangelog, siteMeta } from "@aihot/backend/site/meta";
import { loadContact, loadMakerAvatar } from "@aihot/backend/site/contact";
import { loadSiteStats } from "@aihot/backend/site/stats";
import { itemAvailability } from "@aihot/backend/publication/availability";
import { listTopicSummaries, loadTopicPage } from "@aihot/backend/publication/topics";
import { registerFeedback } from "./feedback.ts";

import { loadHot, loadStoryDetail, resolveStory } from "@aihot/backend/publication/stories";
import { listReports, loadReport, reportNavigation, loadReportNavigation, loadReportMonth, type ReportKind } from "@aihot/backend/publication/reports";
import { loadSiteCodexResetPage, loadSiteCodexResetDay } from "@aihot/backend/publication/monitor";
import { codexResetVersion } from "@aihot/backend/monitor/read";
import { cached } from "@aihot/backend/lib/cache";
import { looseQuery, sendJsonWithEtag, sendProblem } from "../http/respond.ts";

type Handler = (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>;

const codexVersion = cached(() => codexResetVersion(), { freshMs: 5_000, maxStaleMs: 5_000 });

class BadRequest extends Error {}

/** Cache until the earliest pending release in scope (an absolute deadline shared with any proxy or CDN in front). */
export function cacheUntil(reply: FastifyReply, defaultSeconds: number, refreshAt: string | null, now = Date.now()) {
  let seconds = defaultSeconds;
  if (refreshAt) seconds = Math.max(0, Math.min(seconds, Math.floor((Date.parse(refreshAt) - now) / 1000)));
  reply.header("Cache-Control", seconds > 0 ? `public, max-age=${seconds}, s-maxage=${seconds}` : "no-cache");
  reply.header("X-Accel-Expires", `@${Math.floor(now / 1000) + seconds}`);
  return `public, max-age=${seconds}, s-maxage=${seconds}`;
}

export function siteHandler(fn: Handler): Handler {
  return async (req, reply) => {
    try {
      return await fn(req, reply);
    } catch (error) {
      if (error instanceof BadRequest) return sendProblem(req, reply, { status: 400, code: "invalid_request", detail: error.message });
      if (error instanceof InvalidCursorError) return sendProblem(req, reply, { status: 400, code: "invalid_cursor", detail: error.message });
      if (error instanceof SearchBusyError) {
        return sendProblem(req, reply, { status: 503, code: "temporarily_unavailable", detail: "search busy", retryAfter: error.retryAfter });
      }
      req.log.error({ err: error, path: req.url.split("?")[0] }, "site api error");
      return sendProblem(req, reply, { status: 503, code: "temporarily_unavailable", detail: "temporarily unavailable", retryAfter: 10 });
    }
  };
}

export interface FilterParams {
  channel: ChannelKey;
  category: CategoryKey | null;
  tag: string | null;
  topic: string | null;
  topicTags: string[] | null;
}

export async function parseFilters(q: Record<string, string>): Promise<FilterParams> {
  const channel = q.channel ?? "all";
  if (!isChannelKey(channel)) throw new BadRequest("invalid channel");
  const category = q.category ?? null;
  if (category !== null && !isCategoryKey(category)) throw new BadRequest("invalid category");
  const tag = q.tag?.trim() ? q.tag.trim().slice(0, 60) : null;
  const topic = q.topic?.trim() || null;
  let topicTags: string[] | null = null;
  if (topic) {
    topicTags = await loadTopicTags(topic);
    if (!topicTags) throw new BadRequest("unknown topic");
  }
  return { channel, category: category as CategoryKey | null, tag, topic, topicTags };
}

export function registerSite(app: FastifyInstance) {
  app.get("/api/site/meta", siteHandler(async (req, reply) => {
    return sendJsonWithEtag(req, reply, siteMeta(), { etagPrefix: "meta", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  if (FEATURES.codexResetMonitor) registerCodexReset(app);

  app.get("/api/site/timeline", siteHandler(async (req, reply) => {
    const q = looseQuery(req);
    const filters = await parseFilters(q);
    const limit = Math.min(Math.max(Number(q.limit) || 20, 1), 40);
    const unfiltered = filters.channel === "all" && !filters.category && !filters.tag && !filters.topic && !q.cursor;
    const [data, hot] = await Promise.all([
      loadTimeline({ ...filters, cursor: q.cursor || null, limit }),
      unfiltered ? loadHotStrip() : null,
    ]);
    const body = { ...data, hot, generatedAt: new Date().toISOString() };
    const cc = cacheUntil(reply, 60, data.refreshAt);
    return sendJsonWithEtag(req, reply, body, { etagPrefix: "tl", cacheControl: cc, etagOf: { ...data, hot } });
  }));

  app.get("/api/site/pool", siteHandler(async (req, reply) => {
    const q = looseQuery(req);
    const filters = await parseFilters(q);
    const page = Math.min(Math.max(Number(q.page) || 1, 1), 50);
    const search = q.q?.trim() ? q.q.trim().slice(0, 200) : null;
    const reporter = q.reporter?.trim() ? q.reporter.trim().slice(0, 80) : null;
    const tab = q.tab === "relevance" ? "relevance" : "time";
    const data = await loadPool({ ...filters, reporter, q: search, tab, page });
    const { generatedAt: _, ...content } = data;
    return sendJsonWithEtag(req, reply, data, { etagPrefix: "pool", cacheControl: "public, max-age=60, s-maxage=60", etagOf: content });
  }));

  app.get("/api/site/items/:id", siteHandler(async (req, reply) => {
    const id = (req.params as { id: string }).id;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "item not found" });
    const result = await loadItemDetail(id);
    if (result.kind === "not_found") return sendProblem(req, reply, { status: 404, code: "not_found", detail: "item not found", cacheControl: "public, max-age=60" });
    return sendJsonWithEtag(req, reply, siteItemDetail(result.detail), { etagPrefix: "item", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  app.get("/api/site/items/:id/original", siteHandler(async (req, reply) => {
    const id = (req.params as { id: string }).id;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "item not found" });
    const result = await loadItemDetail(id);
    if (result.kind === "not_found") return sendProblem(req, reply, { status: 404, code: "not_found", detail: "item not found", cacheControl: "public, max-age=60" });
    return sendJsonWithEtag(req, reply, siteItemDetail(result.detail, true), { etagPrefix: "item-original", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  app.get("/api/site/stories/:publicId/followups", siteHandler(async (req, reply) => {
    const result = await loadStoryFollowups((req.params as { publicId: string }).publicId);
    if (!result) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "story not found" });
    return reply.header("Cache-Control", "no-store").send(result);
  }));

  app.get("/api/site/groups/:factId/reports", siteHandler(async (req, reply) => {
    const q = looseQuery(req);
    const filters = await parseFilters(q);
    const take = Math.min(Math.max(Number(q.take) || 20, 1), 40);
    const data = await loadGroupReports({ factPublicId: (req.params as { factId: string }).factId, ...filters, cursor: q.cursor || null, take, revision: q.revision || null });
    if (data.kind === "not_found") return sendProblem(req, reply, { status: 404, code: "not_found", detail: "reading group unavailable" });
    if (data.kind === "changed") return sendProblem(req, reply, { status: 409, code: "group_changed", detail: "reading group changed; reload it" });
    reply.header("Cache-Control", "no-store");
    return reply.send(data.body);
  }));

  app.get("/api/site/stories/:publicId/developments", siteHandler(async (req, reply) => {
    const q = looseQuery(req);
    const filters = await parseFilters(q);
    const take = Math.min(Math.max(Number(q.take) || 10, 1), 20);
    const data = await loadDevelopments({ storyPublicId: (req.params as { publicId: string }).publicId, ...filters, cursor: q.cursor || null, take, revision: q.revision || null });
    if (data.kind === "not_found") return sendProblem(req, reply, { status: 404, code: "not_found", detail: "reading group unavailable" });
    if (data.kind === "changed") return sendProblem(req, reply, { status: 409, code: "group_changed", detail: "reading group changed; reload it" });
    reply.header("Cache-Control", "no-store");
    return reply.send(data.body);
  }));

  app.get("/api/site/contact", siteHandler(async (req, reply) => {
    const [contact, makerAvatar] = await Promise.all([loadContact(), loadMakerAvatar()]);
    return sendJsonWithEtag(req, reply, { ...contact, makerAvatar }, { etagPrefix: "contact", cacheControl: "public, max-age=300, s-maxage=300" });
  }));

  app.get("/api/site/stats", siteHandler(async (req, reply) => {
    return sendJsonWithEtag(req, reply, await loadSiteStats(), { etagPrefix: "stats", cacheControl: "public, max-age=300, s-maxage=300" });
  }));

  app.get("/api/site/changelog", siteHandler(async (req, reply) => {
    return sendJsonWithEtag(req, reply, loadChangelog(), { etagPrefix: "changelog", cacheControl: "public, max-age=300, s-maxage=300" });
  }));

  app.get("/api/site/items/availability", siteHandler(async (req, reply) => {
    const ids = (looseQuery(req).ids ?? "").split(",").filter(Boolean);
    reply.header("Cache-Control", "no-store");
    return reply.send(await itemAvailability(ids));
  }));

  app.get("/api/site/topics", siteHandler(async (req, reply) => {
    return sendJsonWithEtag(req, reply, { topics: await listTopicSummaries() }, { etagPrefix: "topics", cacheControl: "public, max-age=300, s-maxage=300" });
  }));

  app.get("/api/site/topics/:slug", siteHandler(async (req, reply) => {
    const slug = (req.params as { slug: string }).slug;
    const page = Number(looseQuery(req).page ?? 1);
    const data = Number.isInteger(page) ? await loadTopicPage(slug, page) : null;
    if (!data) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "topic page not found", cacheControl: "public, max-age=60" });
    return sendJsonWithEtag(req, reply, data, { etagPrefix: "topic", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  registerFeedback(app);


  app.get("/api/site/hot", siteHandler(async (req, reply) => {
    const data = await loadHot();
    return sendJsonWithEtag(req, reply, data, { etagPrefix: "hot", cacheControl: "public, max-age=30, s-maxage=30" });
  }));

  app.get("/api/site/stories/:publicId", siteHandler(async (req, reply) => {
    const publicId = (req.params as { publicId: string }).publicId;
    const found = await resolveStory(publicId);
    if (found.kind === "merged") {
      return reply.code(308).header("Location", `/api/site/stories/${found.target}`).header("Cache-Control", "public, max-age=300").send({ mergedInto: found.target });
    }
    if (found.kind === "not_found") return sendProblem(req, reply, { status: 404, code: "not_found", detail: "story not found", cacheControl: "public, max-age=60" });
    const data = await loadStoryDetail(found.storyId);
    if (!data) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "story not public", cacheControl: "public, max-age=60" });
    return sendJsonWithEtag(req, reply, data, { etagPrefix: "story", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  app.get("/api/site/reports/:kind", siteHandler(async (req, reply) => {
    const kind = (req.params as { kind: string }).kind;
    if (!["daily", "weekly", "monthly"].includes(kind)) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "unknown report kind" });
    const data = await listReports(kind as ReportKind);
    return sendJsonWithEtag(req, reply, { kind, items: data }, { etagPrefix: "reports", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  // The latest report page needs its archive selector and the report in one HTTP request.
  app.get("/api/site/reports/:kind/latest-page", siteHandler(async (req, reply) => {
    const kind = (req.params as { kind: string }).kind;
    if (!["daily", "weekly", "monthly"].includes(kind)) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "unknown report kind" });
    const index = await listReports(kind as ReportKind);
    const report = index[0] ? await loadReport(kind as ReportKind, index[0].key) : null;
    return sendJsonWithEtag(req, reply, { index: reportNavigation(kind as ReportKind, index, report?.key ?? ""), report }, { etagPrefix: "report-latest", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  app.get("/api/site/reports/:kind/navigation/:key", siteHandler(async (req, reply) => {
    const { kind, key } = req.params as { kind: string; key: string };
    if (!["daily", "weekly", "monthly"].includes(kind) || !/^\d{4}-(\d{2}(-\d{2})?|W\d{2})$/.test(key)) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "report not found" });
    return sendJsonWithEtag(req, reply, { items: await loadReportNavigation(kind as ReportKind, key) }, { etagPrefix: "report-navigation", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  app.get("/api/site/reports/daily/months/:month", siteHandler(async (req, reply) => {
    const { month } = req.params as { month: string };
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "month not found" });
    return sendJsonWithEtag(req, reply, { items: await loadReportMonth("daily", month) }, { etagPrefix: "report-month", cacheControl: "public, max-age=60, s-maxage=60" });
  }));

  app.get("/api/site/reports/:kind/:key", siteHandler(async (req, reply) => {
    const { kind, key } = req.params as { kind: string; key: string };
    if (!["daily", "weekly", "monthly"].includes(kind) || !/^\d{4}-(\d{2}(-\d{2})?|W\d{2})$/.test(key)) {
      return sendProblem(req, reply, { status: 404, code: "not_found", detail: "report not found" });
    }
    const data = await loadReport(kind as ReportKind, key);
    if (!data) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "report not found", cacheControl: "public, max-age=60" });
    return sendJsonWithEtag(req, reply, data, { etagPrefix: "report", cacheControl: "public, max-age=120, s-maxage=120" });
  }));

  // Live NBA Boxscore fetched directly from ESPN NBA summary API
  app.get("/api/site/boxscore", siteHandler(async (req, reply) => {
    const q = req.query as { gameId?: string };
    const gameId = q.gameId?.trim() || "401898395";
    if (!/^[0-9]{5,15}$/.test(gameId)) {
      return sendProblem(req, reply, { status: 400, code: "invalid_request", detail: "Invalid gameId" });
    }
    const data = await fetchEspnBoxscoreData(gameId);
    reply.header("Cache-Control", "public, max-age=180, s-maxage=300");
    return data;
  }));

  // Markdown export: attachment, 404 when there is nothing to export (same predicate as the button).
  app.get("/items/:id/markdown", siteHandler(async (req, reply) => {
    const id = (req.params as { id: string }).id;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return reply.code(404).type("text/plain; charset=utf-8").send("Not found");
    const md = await exportMarkdown(id);
    if (!md) return reply.code(404).header("Cache-Control", "public, max-age=60").type("text/plain; charset=utf-8").send("Not found");
    return reply
      .header("Content-Type", "text/markdown; charset=utf-8")
      .header("Content-Disposition", `attachment; filename="${md.filename}"`)
      .header("Cache-Control", "public, max-age=300, s-maxage=300")
      .header("X-Robots-Tag", "noindex")
      .send(md.body);
  }));
}

const PLAYER_NAME_CN: Record<string, string> = {
  "Alperen Sengun": "阿尔佩伦·申京",
  "Kevin Durant": "凯文·杜兰特",
  "Fred VanVleet": "弗雷德·范弗里特",
  "Tari Eason": "塔里·伊森",
  "Jabari Smith Jr.": "小贾巴里·史密斯",
  "Reed Sheppard": "里德·谢泼德",
  "Amen Thompson": "阿门·汤普森",
  "Steven Adams": "史蒂文·亚当斯",
  "Oscar Tshiebwe": "奥斯卡·希布韦",
  "Bogdan Bogdanovic": "博格丹·博格达诺维奇",
  "Bruce Thornton": "布鲁斯·桑顿",
  "Julian Phillips": "朱利安·菲利普斯",
  "Isaiah Crawford": "以赛亚·克劳福德",
  "Quadir Copeland": "夸迪尔·科普兰",
  "Sean Pedulla": "肖恩·佩杜拉",
  "Cooper Flagg": "库珀·弗拉格",
  "Naji Marshall": "纳吉·马绍尔",
  "Max Christie": "马克斯·克里斯蒂",
  "Zaccharie Risacher": "扎卡里·里萨谢",
  "Daniel Gafford": "丹尼尔·加福德",
  "Dwight Powell": "德怀特·鲍威尔",
  "Tobi Lawal": "托比·拉瓦尔",
  "Tarik Biberovic": "塔里克·比贝罗维奇",
  "Sergio de Larrea": "塞尔吉奥·德拉雷亚",
  "Moussa Cisse": "穆萨·西塞",
  "Seth Lundy": "赛斯·伦迪",
  "John Poulakidas": "约翰·普拉基达斯",
  "Jett Howard": "杰特·霍华德",
  "Morez Johnson Jr.": "莫雷兹·约翰逊",
};

const boxscoreCache = new Map<string, { data: unknown; savedAt: number }>();

async function fetchEspnBoxscoreData(gameId: string) {
  const cached = boxscoreCache.get(gameId);
  if (cached && Date.now() - cached.savedAt < 300_000) {
    return cached.data;
  }
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`ESPN API returned ${res.status}`);
  const data = (await res.json()) as any;
  const comp = data.header?.competitions?.[0];
  const competitors = comp?.competitors || [];

  const rocketsComp = competitors.find((c: any) => c.team?.id === "10" || c.team?.displayName?.includes("Rockets"));
  const oppComp = competitors.find((c: any) => c !== rocketsComp);

  const quarters = {
    rockets: (rocketsComp?.linescores || []).map((l: any) => Number(l.displayValue)),
    opponent: (oppComp?.linescores || []).map((l: any) => Number(l.displayValue)),
  };

  const parsePlayers = (teamKeyword: string) => {
    const teamSection = (data.boxscore?.players || []).find((p: any) => p.team?.displayName?.toLowerCase().includes(teamKeyword.toLowerCase()));
    if (!teamSection) return [];
    const statItem = teamSection.statistics?.[0];
    if (!statItem) return [];
    return (statItem.athletes || []).map((ath: any) => {
      const s = ath.stats || [];
      const rawName = ath.athlete?.displayName || "";
      const cnName = PLAYER_NAME_CN[rawName];
      const displayName = cnName ? `${cnName} (${rawName})` : rawName;
      const fgParts = (s[2] || "0-0").split("-");
      const fgPct = fgParts[1] && Number(fgParts[1]) > 0 ? (Math.round((Number(fgParts[0]) / Number(fgParts[1])) * 1000) / 10).toFixed(1) + "%" : "0.0%";
      return {
        name: displayName,
        rawName,
        number: ath.athlete?.jersey || "",
        position: ath.athlete?.position?.abbreviation || "F",
        minutes: s[0] || "0",
        points: Number(s[1]) || 0,
        rebounds: Number(s[5]) || 0,
        assists: Number(s[6]) || 0,
        turnovers: Number(s[7]) || 0,
        steals: Number(s[8]) || 0,
        blocks: Number(s[9]) || 0,
        fg: s[2] || "0-0",
        fgPct,
        threePt: s[3] || "0-0",
        ft: s[4] || "0-0",
        plusMinus: s[13] || "0",
      };
    }).filter((p: any) => p.minutes !== "DNP" && p.minutes !== "0");
  };

  const rocketsPlayers = parsePlayers("Rockets");
  const opponentPlayers = parsePlayers(oppComp?.team?.name || "Opponent");

  const result = {
    gameId,
    quarters,
    rocketsPlayers,
    opponentPlayers,
  };

  boxscoreCache.set(gameId, { data: result, savedAt: Date.now() });
  return result;
}

/** The Codex reset monitor's page data (an optional module, industry/features.ts). */
function registerCodexReset(app: FastifyInstance) {
  app.get("/api/site/codex-reset", siteHandler(async (req, reply) => {
    return sendJsonWithEtag(req, reply, await loadSiteCodexResetPage(), { etagPrefix: "codex-page", cacheControl: "public, max-age=30, s-maxage=30" });
  }));

  app.get("/api/site/codex-reset/days/:date", siteHandler(async (req, reply) => {
    const { date } = req.params as { date: string };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) return sendProblem(req, reply, { status: 404, code: "not_found", detail: "date not found" });
    return sendJsonWithEtag(req, reply, await loadSiteCodexResetDay(date), { etagPrefix: "codex-day", cacheControl: "no-store" });
  }));

  // Foreground polling from /codex-reset (every open tab, once a minute): the edge answers the tabs
  // of the same 15 s, and the process reads the database at most every 5 s.
  app.get("/api/site/codex-reset/version", siteHandler(async (req, reply) => {
    return sendJsonWithEtag(req, reply, await codexVersion.get(), { etagPrefix: "codex-version", cacheControl: "public, max-age=0, s-maxage=15" });
  }));
}
