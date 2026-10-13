// Public read layer, item level. Every exit (site API, v1, RSS, MCP, sitemap) reads
// items through these functions; visibility, release gate and body licences are applied here.
import type { CategoryKey, ChannelKey } from "@aihot/contracts/taxonomy";
import type { FeedItemSummary, ItemSummary, MediaView, PodcastView, SourceKind, XPostView } from "@aihot/contracts/site";
import { sql, type Db } from "../db.ts";
import { proxiedImage, proxiedImageSet, proxiedVideo } from "../media/imgproxy.ts";
import { displayTags } from "./rules.ts";

export interface ItemRow {
  id: string;
  revision: number;
  title: string;
  original_title: string | null;
  summary: string | null;
  reason: string | null;
  category: string | null;
  tags: string[];
  score: number | null;
  selected: boolean;
  eligible: boolean;
  channel: "news" | "x";
  url: string;
  published_at: Date | null;
  discovered_at: Date;
  timeline_at: Date;
  /** Reading-group anchor for a selected item (timeline_at otherwise). */
  sort_at: Date;
  first_party: boolean;
  visibility: string;
  body_mode: "full" | "summary";
  syndicate: boolean;
  indexable: boolean;
  visible_after: Date | null;
  backfill: boolean;
  fact_id: number | null;
  story_id: number | null;
  source_id: string;
  source_name: string;
  source_kind: SourceKind;
  /** Participation mode of the source now (editorial, hot_signal, isolated). */
  source_mode: string;
  source_icon: string | null;
  x_post: Record<string, any> | null;
  author: string | null;
  language: string | null;
  story_public_id: string | null;
  story_title: string | null;
  zh_text: string | null;
  /** Chinese translation of the post an X post quotes. */
  quoted_zh: string | null;
  media?: Array<{ kind: string; url: string; poster?: string; alt?: string; width?: number; height?: number }> | null;
  raw?: Record<string, any> | null;
}

/** Columns every item listing selects. Internal judgement details never leave this layer. */
export const ITEM_COLUMNS = sql`
  p.article_id AS id, p.revision, p.title, p.original_title, p.summary, p.reason, p.category, p.tags, p.score,
  p.selected, p.eligible, p.channel, p.url, p.published_at, p.discovered_at, p.timeline_at, p.sort_at, p.first_party, p.visibility,
  p.body_mode, p.syndicate, p.indexable, p.visible_after, p.backfill, p.fact_id, p.story_id,
  s.id AS source_id, s.name AS source_name, s.kind AS source_kind, s.participation_mode AS source_mode, s.icon_url AS source_icon,
  a.x_post, a.author, a.language, a.media, a.raw,
  st.public_id::text AS story_public_id, st.title AS story_title,
  CASE WHEN p.channel = 'x' THEN tr.body_text END AS zh_text, qt.text_zh AS quoted_zh`;

/** Public API listings never render article bodies, X media or story metadata. */
export type ApiItemRow = Pick<ItemRow, "id" | "title" | "original_title" | "summary" | "source_name" | "url" | "published_at" | "discovered_at" | "category" | "score" | "selected" | "reason">;
export const API_ITEM_COLUMNS = sql`
  p.article_id AS id, p.title, p.original_title, p.summary, s.name AS source_name, p.url,
  p.published_at, p.discovered_at, p.category, p.score, p.selected, p.reason`;
export const API_ITEM_FROM = sql`FROM publications p JOIN sources s ON s.id = p.source_id`;

/** A translation of an older revision is left out: the original changed after it (the worker translates it again). */
export const ITEM_FROM = sql`
  FROM publications p
  JOIN sources s ON s.id = p.source_id
  JOIN articles a ON a.id = p.article_id
  LEFT JOIN stories st ON st.id = p.story_id AND st.merged_into IS NULL
  LEFT JOIN translations tr ON tr.article_id = p.article_id AND tr.lang = 'zh' AND tr.revision >= a.revision
  LEFT JOIN quote_translations qt ON p.channel = 'x' AND qt.tweet_id = substring(a.x_post->'quoted'->>'url' from '/status/([0-9]+)')`;

/** Listed items: public, not a reply tweet, exclude withdrawn/deleted items, and a selected item only after its release gate. */
export function listedCondition(now: Date) {
  return sql`p.visibility = 'public'
    AND p.source_id NOT LIKE '%sportspyder%'
    AND p.url NOT LIKE '%sportspyder.com%'
    AND p.title NOT LIKE '%卡斯特罗%'
    AND NOT (p.tags && ARRAY['非火箭/联盟其他', '非火箭', '联盟其他']::text[])
    AND NOT (
      p.title ~* '(德州人|太空人|油人队|迪纳摩|texans|astros|oilers|dynamo|stroud|斯特劳德|棒球|橄榄球|全垒打|安打|三振)'
      AND NOT p.title ~* '(rockets|houston rockets|火箭|休斯敦火箭|休斯顿火箭|udoka|乌度卡|sengun|申京|durant|杜兰特)'
    )
    AND (
      p.source_id != 'rss-podcast-sportstalk790'
      OR p.title ~* '(rockets|houston rockets|火箭|休斯敦火箭|休斯顿火箭|udoka|乌度卡|sengun|申京|amen|thompson|eason|伊森|sheppard|谢泼德|kevin durant|durant|杜兰特|stone|斯通|vanvleet|范弗里特|jalen green|whitmore|惠特莫尔|jabari|史密斯|adams|亚当斯|nba|preseason|draft|training camp|media day)'
    )
    AND NOT (p.channel = 'x' AND (p.title LIKE '@%' OR p.original_title LIKE '@%'))
    AND (NOT p.selected OR p.visible_after IS NULL OR p.visible_after <= ${now})`;
}

/** Selected set as shown on the home timeline, v1 selected mode and RSS. */
export function selectedCondition(now: Date) {
  return sql`p.visibility = 'public'
    AND p.source_id NOT LIKE 'yt-%'
    AND p.source_id NOT LIKE '%youtube%'
    AND p.source_id NOT LIKE '%sportspyder%'
    AND p.url NOT LIKE '%sportspyder.com%'
    AND p.title NOT LIKE '%卡斯特罗%'
    AND NOT (p.tags && ARRAY['非火箭/联盟其他', '非火箭', '联盟其他']::text[])
    AND NOT (
      p.title ~* '(德州人|太空人|油人队|迪纳摩|texans|astros|oilers|dynamo|stroud|斯特劳德|棒球|橄榄球|全垒打|安打|三振)'
      AND NOT p.title ~* '(rockets|houston rockets|火箭|休斯敦火箭|休斯顿火箭|udoka|乌度卡|sengun|申京|durant|杜兰特)'
    )
    AND NOT (p.channel = 'x' AND (p.title LIKE '@%' OR p.original_title LIKE '@%'))
    AND p.selected
    AND (p.visible_after IS NULL OR p.visible_after <= ${now})
    AND (
      p.channel = 'x'
      OR p.category IN ('podcasts', 'videos')
      OR p.source_id LIKE 'rss-podcast-%'
      OR p.source_id LIKE 'yt-%'
      OR p.body_mode = 'full'
    )
    AND p.category != 'podcasts'
    AND p.source_id NOT LIKE '%podcast%'`;
}

export function channelCondition(channel: ChannelKey | null | undefined) {
  if (!channel || channel === "all") return sql``;
  if (channel === "firstParty") return sql`AND p.first_party`;
  return sql`AND p.channel = ${channel}`;
}

export function categoryCondition(category: CategoryKey | null | undefined, v1 = false) {
  if (!category) {
    // 默认全局动态流：排除播客，且图文报道必须具备实质完整正文
    return sql`AND p.category != 'podcasts' AND p.source_id NOT LIKE '%podcast%'
      AND (p.channel = 'x' OR p.category = 'videos' OR p.source_id LIKE 'yt-%' OR p.body_mode = 'full')`;
  }
  if (category === "news") {
    // 动态栏目：球队官方动态、伤病、战报与全网快讯（含 DunkCentral, HoopCentral 等聚合快讯），以及专注休斯敦火箭的博主与社区，图文必须具备正文
    return sql`AND (
      p.category = 'news'
      OR p.source_id IN (
        'x-houston-rockets', 'x-clutchfans', 'x-sleeper-rockets', 'x-spacecity-hn', 'x-rocketsnation-cp', 'x-rockets-wire',
        'x-thedunkcentral-rockets', 'x-thehoopcentral-rockets'
      )
      OR (p.category IS NULL AND (p.channel = 'news' OR p.first_party))
    )
    AND (p.channel = 'x' OR p.body_mode = 'full')
    AND p.category != 'podcasts'
    AND p.source_id NOT LIKE '%podcast%'`;
  }
  if (category === "podcasts") {
    // 播客栏目：官方与随队播客，针对综合电台 SportsTalk 790 必须严格限定包含火箭核心内容
    return sql`AND (
      p.category = 'podcasts'
      OR p.source_id LIKE 'rss-podcast-%'
      OR p.source_id IN ('rss-podcast-lockedon', 'rss-podcast-launchpod', 'rss-podcast-rocketfuel', 'rss-podcast-rocketsdaily')
    )
    AND (
      p.source_id != 'rss-podcast-sportstalk790'
      OR p.title ~* '(rockets|houston rockets|火箭|休斯敦火箭|休斯顿火箭|udoka|乌度卡|sengun|申京|amen|thompson|eason|伊森|sheppard|谢泼德|kevin durant|durant|杜兰特|stone|斯通|vanvleet|范弗里特|jalen green|whitmore|惠特莫尔|jabari|史密斯|adams|亚当斯|nba|preseason|draft|training camp|media day)'
    )`;
  }
  if (category === "videos") {
    // 视频栏目：官方与随队精彩视频录像（已通过数据库和发布器进行休斯敦火箭专项标记）
    return sql`AND (
      p.category = 'videos'
      OR p.source_id LIKE 'yt-%'
      OR p.tags && ARRAY['视频', '精彩视频', '集锦', 'Videos', 'Video']::text[]
    )`;
  }
  if (category === "beat_tweets") {
    // 队记推文栏目：随队名记推文流，排除官方推特与全网快讯账号（DunkCentral, HoopCentral 等已归入动态）
    return sql`AND (
      p.category = 'beat_tweets'
      OR (
        (p.channel = 'x' OR p.source_id LIKE 'x-%')
        AND p.source_id NOT IN ('x-houston-rockets', 'x-thedunkcentral-rockets', 'x-thehoopcentral-rockets')
      )
    )`;
  }
  if (category === "analysis") {
    // 专栏：长文深度报道、战术剖析，必须具备实质完整正文
    return sql`AND (
      p.category = 'analysis'
      OR p.tags && ARRAY['深度专栏', '战术分析', '球员前瞻', '战术拆解', '高阶战术', '战术复盘', '深度分析', '战术剖析', '专栏', '深度']::text[]
    )
    AND p.body_mode = 'full'
    AND p.channel != 'x'`;
  }
  if (category === "trades") {
    // 流言栏目：仅展示实质交易、签约、买断、合同谈判等交易流言，排除排名与非交易内容
    return sql`AND p.category = 'trades'
    AND (p.channel = 'x' OR p.body_mode = 'full')`;
  }
  // v1 and RSS publish opinion as tip.
  if (v1 && (category as string) === "tip") return sql`AND p.category IN ('tip', 'opinion')`;
  return sql`AND p.category = ${category}`;
}


/** 智能去重算法：仅针对新闻报道多源同一事件去重，队记推文、社交推帖与视频内容全量保留 */
export function deduplicateFeedItems<T extends { id: string; title: string; summary?: string | null; score?: number | null; publishedAt?: string | null; timelineAt?: string | null; channel?: string | null; category?: string | null }>(items: T[]): T[] {
  const result: T[] = [];
  const normalize = (str: string) => str.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  
  const similarity = (a: string, b: string) => {
    if (!a || !b) return 0;
    if (a === b) return 1;
    const getGrams = (text: string) => {
      const grams = new Set<string>();
      for (let i = 0; i < text.length - 1; i++) grams.add(text.slice(i, i + 2));
      return grams;
    };
    const setA = getGrams(a);
    const setB = getGrams(b);
    if (!setA.size || !setB.size) return 0;
    let intersect = 0;
    for (const g of setA) if (setB.has(g)) intersect++;
    return (2 * intersect) / (setA.size + setB.size);
  };

  for (const item of items) {
    // 队记推文、推特流以及视频专栏绝不进行模糊去重，保留每位记者的所有实时推文
    if ((item as any).channel === "x" || (item as any).category === "beat_tweets" || (item as any).category === "videos") {
      result.push(item);
      continue;
    }

    const normTitle = normalize(item.title);
    let isDuplicate = false;

    for (let i = 0; i < result.length; i++) {
      const existing = result[i]!;
      if ((existing as any).channel === "x" || (existing as any).category === "beat_tweets" || (existing as any).category === "videos") {
        continue;
      }
      const existingNormTitle = normalize(existing.title);
      
      const t1 = new Date(item.timelineAt || item.publishedAt || 0).getTime();
      const t2 = new Date(existing.timelineAt || existing.publishedAt || 0).getTime();
      if (Math.abs(t1 - t2) > 48 * 3600 * 1000) continue;

      if (normTitle === existingNormTitle) {
        isDuplicate = true;
      } else {
        const sim = similarity(normTitle, existingNormTitle);
        if (sim >= 0.68) {
          isDuplicate = true;
        }
      }

      if (isDuplicate) {
        const itemIsAggregator = /google\s*news|全网|sportspyder/i.test((item as any).source?.name ?? (item as any).source_name ?? "");
        const existingIsAggregator = /google\s*news|全网|sportspyder/i.test((existing as any).source?.name ?? (existing as any).source_name ?? "");
        if (existingIsAggregator && !itemIsAggregator) {
          // 正主/一手信源优先，替换掉二次聚合的二手信源
          result[i] = item;
        } else if (!existingIsAggregator && itemIsAggregator) {
          // 已有一手正主信源，丢弃二次聚合内容
        } else {
          const currentScore = item.score ?? 0;
          const existingScore = existing.score ?? 0;
          const currentLen = (item.summary?.length ?? 0) + item.title.length;
          const existingLen = (existing.summary?.length ?? 0) + existing.title.length;
          if (currentScore > existingScore || (currentScore === existingScore && currentLen > existingLen)) {
            result[i] = item;
          }
        }
        break;
      }
    }

    if (!isDuplicate) {
      result.push(item);
    }
  }

  return result;
}

export function tagCondition(tag: string | null | undefined) {
  if (!tag) return sql``;
  return sql`AND p.tags @> ${[tag]}::text[]`;
}

const REPORTER_SOURCE_MAP: Record<string, string[]> = {
  "kelly iko": ["x-kelly-iko"],
  "will guillory": ["x-will-guillory"],
  "ben dubose": ["x-ben-dubose"],
  "jackson gatlin": ["x-jackson-gatlin"],
  "adam spolane": ["x-adam-spolane"],
  "lachard binkley": ["x-lachard-binkley"],
  "varun shankar": ["x-varun-shankar"],
  "fyrebear": ["x-roosh-williams"],
  "roosh": ["x-roosh-williams"],
  "bradeaux": ["x-bradeaux"],
  "big sarge": ["x-big-sarge"],
  "biased houston": ["x-biased-houston"],
  "michael shapiro": ["x-michael-shapiro"],
  "matt thomas": ["x-matt-thomas"],
  "clutchfans": ["x-clutchfans", "rss-clutchfans", "rss-clutchfans-news"],
  "houston rockets": ["x-houston-rockets"],
};

export function reporterCondition(reporter: string | null | undefined) {
  if (!reporter || reporter === "all") return sql``;
  const raw = reporter.trim().toLowerCase();
  const known = REPORTER_SOURCE_MAP[raw];
  if (known && known.length > 0) {
    return sql`AND p.source_id = ANY(${known}::text[])`;
  }
  const slug = raw.replace(/\s+/g, "-");
  const slugTerm = "%" + slug + "%";
  return sql`AND p.source_id LIKE ${slugTerm}`;
}

export function sourceCondition(source: string | null | undefined) {
  if (!source || source === "all") return sql``;
  if (source.includes("%")) return sql`AND p.source_id LIKE ${source}`;
  return sql`AND p.source_id = ${source}`;
}

export function topicCondition(topicTags: string[] | null | undefined) {
  if (!topicTags || topicTags.length === 0) return sql``;
  return sql`AND p.tags && ${topicTags}::text[]`;
}

function mediaView(m: Record<string, any>, mode: "card" | "thumb" | "full" = "thumb", responsive = false): MediaView | null {
  const url = proxiedImage(m.url, mode);
  if (!url) return null;
  const rawVideo = (m.videoUrl && typeof m.videoUrl === "string") ? m.videoUrl : (m.kind === "video" && typeof m.url === "string" && m.url.includes(".mp4") ? m.url : null);
  return {
    kind: m.kind === "video" ? "video" : "image",
    url,
    videoUrl: rawVideo ? proxiedVideo(rawVideo) : null,
    ...(responsive && mode !== "full" ? { fullUrl: proxiedImage(m.url, "full")! } : {}),
    ...(responsive && proxiedImageSet(m.poster ?? m.url, mode === "full" ? "body" : "card") ? { srcSet: proxiedImageSet(m.poster ?? m.url, mode === "full" ? "body" : "card")! } : {}),
    width: typeof m.width === "number" ? m.width : null,
    height: typeof m.height === "number" ? m.height : null,
    alt: m.alt ?? null,
    poster: m.poster ? proxiedImage(m.poster, mode === "card" ? "card" : "thumb") : null,
  };
}

export function xView(row: Pick<ItemRow, "x_post" | "zh_text"> & Partial<Pick<ItemRow, "quoted_zh">>, compact = false, responsive = compact): XPostView | null {
  const x = typeof row.x_post === "string" ? JSON.parse(row.x_post) : row.x_post;
  if (!x) return null;
  const quoted = x.quoted && typeof x.quoted === "object"
    ? {
      authorName: String(x.quoted.authorName ?? ""), handle: String(x.quoted.handle ?? ""), text: String(x.quoted.text ?? ""), url: String(x.quoted.url ?? ""),
      translation: row.quoted_zh && row.quoted_zh.trim() !== String(x.quoted.text ?? "").trim() ? row.quoted_zh : null,
    }
    : null;
  const media = ((x.media ?? []) as Array<Record<string, any>>)
    .map((raw) => ({ raw, view: mediaView(raw, compact || !responsive ? "thumb" : "full", responsive) }))
    .filter((entry): entry is { raw: Record<string, any>; view: MediaView } => entry.view !== null);
  return {
    authorName: String(x.authorName ?? x.handle ?? ""),
    handle: String(x.handle ?? ""),
    avatarUrl: proxiedImage(x.avatarUrl, "avatar"),
    ...(responsive && proxiedImageSet(x.avatarUrl, "avatar") ? { avatarSrcSet: proxiedImageSet(x.avatarUrl, "avatar")! } : {}),
    text: String(x.text ?? ""),
    translation: row.zh_text && row.zh_text.trim() !== String(x.text ?? "").trim() ? row.zh_text : null,
    quoted,
    // A multi-image list grid is 112 CSS px wide; one image can be 240 px. Keep 3x pixels for both.
    // Detail retains full media for the lightbox; srcSet bounds the displayed image.
    media: media.map(({ raw, view }) => compact && media.length > 1 ? mediaView(raw, "card", responsive)! : view),
  };
}

export function cleanPublisherName(sourceName: string, url?: string | null): string {
  if (!url) return sourceName;
  if (/google\s*news|全网|sportspyder/i.test(sourceName)) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      if (host.includes("bleacherreport")) return "Bleacher Report";
      if (host.includes("yahoo")) return "Yahoo Sports";
      if (host.includes("rocketswire") || host.includes("usatoday")) return "Rockets Wire";
      if (host.includes("chronicle") || host.includes("chron.com")) return "Houston Chronicle";
      if (host.includes("marca.com")) return "MARCA";
      if (host.includes("clutchpoints")) return "ClutchPoints";
      if (host.includes("theathletic")) return "The Athletic";
      if (host.includes("espn")) return "ESPN";
      if (host.includes("si.com")) return "Sports Illustrated";
      if (host.includes("hoopshype")) return "HoopsHype";
      if (host.includes("hoopsrumors")) return "Hoops Rumors";
      if (host.includes("realgm")) return "RealGM";
      if (host.includes("thedreamshake")) return "The Dream Shake";
      if (host.includes("spacecityscoop")) return "Space City Scoop";
      if (host.includes("yardbarker")) return "Yardbarker";
      if (host.includes("theringer")) return "The Ringer";
      const parts = host.split(".");
      if (parts.length >= 2) return parts[parts.length - 2]!;
      return host;
    } catch {
      return sourceName;
    }
  }
  return sourceName;
}

export function toItemSummary(row: ItemRow): ItemSummary {
  const x = row.channel === "x" ? xView(row, true) : null;
  const rawPodcast = (row.raw as any)?.podcast;
  const isPodcast = row.category === "podcasts" || row.source_id.includes("podcast") || /episodes\/\d+/.test(row.url);
  const imageMedia = Array.isArray(row.media) ? row.media.find((m: any) => m.kind === "image") : null;
  const audioMedia = Array.isArray(row.media) ? row.media.find((m: any) => m.kind === "audio") : null;
  let podcast: PodcastView | null = null;
  if (isPodcast || rawPodcast || audioMedia) {
    podcast = {
      audioUrl: rawPodcast?.audioUrl ?? (audioMedia as any)?.url ?? null,
      duration: rawPodcast?.duration ?? null,
      durationLabel: rawPodcast?.durationLabel ?? (rawPodcast?.duration ? `${Math.round(rawPodcast.duration / 60)} min` : null),
      imageUrl: rawPodcast?.imageUrl ?? imageMedia?.url ?? null,
      podcastTitle: rawPodcast?.podcastTitle ?? (row.source_id.includes("podcast") ? row.source_name : null),
      author: rawPodcast?.author ?? row.author ?? null,
    };
  }
  return {
    id: row.id,
    revision: row.revision,
    title: row.title,
    originalTitle: row.original_title,
    summary: row.summary,
    reason: row.selected ? row.reason : null,
    source: {
      id: row.source_id,
      name: cleanPublisherName(row.source_name, row.url),
      kind: row.source_kind,
      firstParty: row.first_party,
      iconUrl: proxiedImage(row.source_icon, "avatar"),
      ...(proxiedImageSet(row.source_icon, "avatar") ? { iconSrcSet: proxiedImageSet(row.source_icon, "avatar")! } : {}),
    },
    links: { aihot: `/items/${row.id}`, original: row.url },
    publishedAt: row.published_at?.toISOString() ?? null,
    discoveredAt: row.discovered_at.toISOString(),
    timelineAt: row.timeline_at.toISOString(),
    category: (row.category as CategoryKey | null) ?? null,
    tags: displayTags(row.tags),
    score: row.score === null ? null : Math.round(Number(row.score)),
    selected: row.selected,
    channel: row.channel,
    story: row.story_public_id ? { publicId: row.story_public_id, title: row.story_title ?? "" } : null,
    x,
    podcast,
  };
}

/** Project the shared public article into the exact fields a site card renders. */
export function toFeedItemSummary(row: ItemRow): FeedItemSummary {
  const item = toItemSummary(row);
  return {
    id: item.id, title: item.title, summary: item.summary, reason: item.reason,
    source: { name: item.source.name }, publishedAt: item.publishedAt, timelineAt: item.timelineAt,
    category: item.category, tags: item.tags, score: item.score, selected: item.selected, channel: item.channel,
    links: item.links,
    url: row.url,
    podcast: item.podcast,
    x: item.x ? {
      authorName: item.x.authorName, handle: item.x.handle, avatarUrl: item.x.avatarUrl,
      ...(item.x.avatarSrcSet ? { avatarSrcSet: item.x.avatarSrcSet } : {}), media: item.x.media,
      quoted: item.x.quoted ? { authorName: item.x.quoted.authorName, handle: item.x.quoted.handle, text: item.x.quoted.text, translation: item.x.quoted.translation } : null,
    } : null,
  };
}

export async function fetchItemsByIds(ids: string[], db: Db = sql): Promise<Map<string, ItemRow>> {
  if (ids.length === 0) return new Map();
  const rows = await db<ItemRow[]>`SELECT ${ITEM_COLUMNS} ${ITEM_FROM} WHERE p.article_id IN ${db(ids)}`;
  return new Map(rows.map((r) => [r.id, r]));
}
