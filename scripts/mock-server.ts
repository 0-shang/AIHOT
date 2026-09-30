import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 3001;

const now = new Date();
const isoNow = now.toISOString();
const todayDate = now.toISOString().slice(0, 10);

function getLiveItems() {
  try {
    const liveScrapedPath = path.join(import.meta.dirname, "../.data/live-scraped.json");
    if (!fs.existsSync(liveScrapedPath)) return [];
    const candidates = JSON.parse(fs.readFileSync(liveScrapedPath, "utf8"));
    return candidates.map((c, idx) => {
      const pubDate = c.publishedAt ? new Date(c.publishedAt) : new Date(Date.now() - idx * 3600 * 1000);
      const pubIso = pubDate.toISOString();
      return {
        id: `item-live-${idx + 1}`,
        revision: 1,
        title: c.title,
        originalTitle: c.title,
        summary: c.excerpt ? c.excerpt.replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"') : (c.title + " (抓取自 " + c.sourceName + ")"),
        reason: `信源抓取真实数据: ${c.sourceName}`,
        source: { id: c.sourceId || "rss-scraped", name: c.sourceName || "实时信源", kind: "rss" as const, firstParty: false, iconUrl: null },
        links: { aihot: `/items/item-live-${idx + 1}`, original: c.url },
        publishedAt: pubIso,
        discoveredAt: isoNow,
        timelineAt: pubIso,
        category: "rumors" as const,
        tags: ["真实抓取", c.sourceName, "火箭队"],
        score: Number((9.6 - (idx * 0.1)).toFixed(1)),
        selected: true,
        channel: "news" as const,
        story: null,
        x: null,
      };
    });
  } catch (err) {
    console.error("Error reading live-scraped.json:", err);
    return [];
  }
}

function getAllItems() {
  return [...getLiveItems(), ...MOCK_ITEMS];
}

const MOCK_ITEMS = [
  {
    id: "item-rockets-1",
    revision: 1,
    title: "申京 28+12+7 全能表现，休斯敦火箭终结连败力克太阳",
    originalTitle: "Alperen Sengun's near triple-double leads Rockets past Suns",
    summary: "阿尔佩伦·申京在内线全面爆发，全场 18 投 12 中高效轰下 28 分 12 篮板 7 助攻 2 抢断。杰伦·格林在末节关键时刻连续命中高难度三分锁定胜局。乌度卡赛后特别表扬了球队在第四节对杜兰特的防守包夹策略。",
    reason: "核心球员高光战报与赛果",
    source: { id: "rss-clutchfans", name: "ClutchFans 火箭资讯", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-1", original: "https://clutchfans.net" },
    publishedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    category: "games" as const,
    tags: ["比赛战报", "阿尔佩伦·申京", "杰伦·格林", "常规赛"],
    score: 9.4,
    selected: true,
    channel: "news" as const,
    story: { publicId: "story-suns-game", title: "火箭力克太阳战报与赛后" },
    x: null,
  },
  {
    id: "item-rockets-2",
    revision: 1,
    title: "名记 Iko：火箭管理层高度信任乌度卡，休赛期将全力提前续约年轻核心群",
    originalTitle: "Kelly Iko on Rockets offseason strategy and Udoka leadership",
    summary: "The Athletic 随队名记 Kelly Iko 撰文透露，火箭总经理拉斐尔·斯通与管理层对目前的建队进度非常满意。球队休赛期的首要任务是确立年轻核心的长期合同架构，不会为短期全明星球员牺牲未来薪资空间与年轻轮换。",
    reason: "随队知名记者一手流言追踪",
    source: { id: "rss-thedreamshake", name: "The Dream Shake (SB Nation)", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-2", original: "https://www.thedreamshake.com" },
    publishedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    category: "rumors" as const,
    tags: ["转会流言", "随队专栏", "管理层/选秀"],
    score: 8.9,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-3",
    revision: 1,
    title: "深度复盘：阿门·汤普森与伊森同场时，火箭防守效率为何领跑联盟",
    originalTitle: "Why the Rockets defense suffocates opponents with Amen and Eason",
    summary: "高阶数据分析显示，当阿门·汤普森与塔里·伊森同时在场时，休斯敦火箭的百回合失分仅为 102.3 分，排在联盟同期首位。两人凭借历史级别的横移速度、对球压迫能力和长臂干扰，彻底盘活了火箭的外线换防弹性。",
    reason: "战术打法剖析与高阶数据模型",
    source: { id: "rss-rocketswire", name: "Rockets Wire (USA Today)", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-3", original: "https://rocketswire.usatoday.com" },
    publishedAt: new Date(Date.now() - 14400 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 14400 * 1000).toISOString(),
    category: "industry" as const,
    tags: ["战术分析", "阿门·汤普森", "塔里·伊森", "战术与综合"],
    score: 8.7,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-4",
    revision: 1,
    title: "火箭官方伤病报告：塔里·伊森已恢复全对抗训练，范弗利特小腿轻微拉伤大概率缺席下场",
    originalTitle: "Houston Rockets Official Injury Update",
    summary: "休斯敦火箭今日官方公布了最新伤病进展：前锋塔里·伊森已经完成连续两天的全场 5 对 5 对抗训练，预计将在下周的主场系列赛中迎来复出。后卫弗雷德·范弗利特受右小腿紧张困扰，下一场客场对阵开拓者大概率休战。",
    reason: "官方伤病与出战状态更新",
    source: { id: "rss-chron", name: "Houston Chronicle 火箭专栏", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-4", original: "https://www.houstonchronicle.com" },
    publishedAt: new Date(Date.now() - 21600 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 21600 * 1000).toISOString(),
    category: "injury" as const,
    tags: ["伤病报告", "塔里·伊森", "伤病与出战"],
    score: 8.5,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-5",
    revision: 1,
    title: "乌度卡赛后专访：年轻球员正在学会在逆境中执行战术，防守专注度是赢球唯一基石",
    originalTitle: "Ime Udoka Postgame Press Conference",
    summary: "主帅伊梅·乌度卡在新闻发布会上重点谈到了杰伦·格林的防守成长：“如果放在一年前，当他投篮不进时防守端也会走神；而今晚他在三分球 8 投 2 中的情况下，依然抢下 6 个防守篮板并制造了对手两次带球撞人，这正是冠军级别球员的蜕变过程。”",
    reason: "主教练赛后深度原声采访",
    source: { id: "rss-clutchfans", name: "ClutchFans 火箭资讯", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-5", original: "https://clutchfans.net" },
    publishedAt: new Date(Date.now() - 28800 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 28800 * 1000).toISOString(),
    category: "interviews" as const,
    tags: ["赛后采访", "乌度卡", "杰伦·格林", "声音"],
    score: 8.8,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  }
];

const MOCK_HOT = [
  {
    rank: 1,
    title: "申京 28+12+7 统治内线，火箭逆转力克强敌",
    heat: 98,
    trend: "up" as const,
    storyPublicId: "story-suns-game",
    itemId: "item-rockets-1",
    participants: [{ name: "ClutchFans", avatarUrl: null, handle: null }],
    participantCount: 4,
  },
  {
    rank: 2,
    title: "随队名记：火箭休赛期拒绝盲目全明星交易，全力绑定核心班底",
    heat: 88,
    trend: "up" as const,
    storyPublicId: "story-summer-plan",
    itemId: "item-rockets-2",
    participants: [{ name: "Kelly Iko", avatarUrl: null, handle: "KellyIko" }],
    participantCount: 3,
  },
  {
    rank: 3,
    title: "塔里·伊森全对抗训练恢复，下周重回轮换",
    heat: 81,
    trend: "new" as const,
    storyPublicId: "story-injury-eason",
    itemId: "item-rockets-4",
    participants: [{ name: "Houston Chronicle", avatarUrl: null, handle: null }],
    participantCount: 2,
  },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host || "127.0.0.1:3001"}`);
  const pathname = url.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (pathname === "/api/site/meta") {
    res.writeHead(200);
    return res.end(JSON.stringify({ changelogVersion: "1.0.0" }));
  }

  if (pathname === "/api/site/contact") {
    res.writeHead(200);
    return res.end(JSON.stringify({ wechatQr: null, feishuQr: null, makerAvatar: null }));
  }

  if (pathname === "/api/site/stats") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      sourcesCount: 12,
      itemsTotal: 256,
      selectedTotal: 184,
      dailyIssuesCount: 30,
      runningDays: 45,
    }));
  }

  if (pathname === "/api/site/topics") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      topics: [
        { slug: "sengun", name: "阿尔佩伦·申京", description: "火箭内线核心，全能组织中锋", count: 42 },
        { slug: "green", name: "杰伦·格林", description: "外线得分后卫，爆发力极佳", count: 38 },
        { slug: "amen", name: "阿门·汤普森", description: "全能锋卫摇摆人，防守大闸", count: 31 },
        { slug: "udoka", name: "乌度卡", description: "火箭主教练，治军严谨重铸铁血防守", count: 29 },
      ]
    }));
  }

  if (pathname === "/api/site/hot") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      computedAt: isoNow,
      ruleVersion: "v1",
      windowHours: 48,
      entries: MOCK_HOT.map((h, i) => ({
        rank: h.rank,
        title: h.title,
        heat: h.heat,
        trend: h.trend,
        trendPct: 15,
        badges: i === 0 ? ["surge"] : i === 2 ? ["new"] : ["rising"],
        sourceNames: ["ClutchFans", "Houston Chronicle", "The Athletic"],
        participantCount: h.participantCount,
        sourceCount: 3,
        signalCount: 12,
        reportCount: 5,
        spark: [20, 35, 45, 60, 78, h.heat],
        story: { publicId: h.storyPublicId || `story-${h.rank}`, title: h.title },
        itemId: h.itemId,
        representative: { id: h.itemId, url: `/items/${h.itemId}`, sourceName: "ClutchFans" },
        participants: [],
        firstReportAt: new Date(Date.now() - 3600 * 6000).toISOString(),
        latestAt: isoNow,
        summary: h.title + "，全网随队记者与主流体育媒体持续跟进报道。",
        latest: "赛后最新进展与官方通报发布",
        cover: null,
      })),
    }));
  }

  if (pathname === "/api/site/timeline") {
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");

    const allItems = getAllItems();
    let filtered = allItems;
    if (category && category !== "all") {
      filtered = filtered.filter(i => i.category === category);
    }
    if (tag) {
      filtered = filtered.filter(i => i.tags.includes(tag));
    }

    const cards = filtered.map((item) => ({
      key: `card-${item.id}`,
      anchorAt: item.timelineAt,
      item: {
        id: item.id,
        title: item.title,
        summary: item.summary,
        reason: item.reason,
        publishedAt: item.publishedAt,
        timelineAt: item.timelineAt,
        category: item.category,
        tags: item.tags,
        score: item.score,
        selected: item.selected,
        channel: item.channel,
        source: { name: item.source.name },
        x: null,
      },
      group: null,
    }));

    res.writeHead(200);
    return res.end(JSON.stringify({
      filters: {
        channel: "all",
        category: category as any || null,
        tag: tag || null,
        topic: null,
      },
      cards,
      nextCursor: null,
      refreshAt: null,
      hot: MOCK_HOT,
      dayCounts: { [todayDate]: cards.length },
      generatedAt: isoNow,
    }));
  }

  if (pathname === "/api/site/pool") {
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");
    const q = url.searchParams.get("q");

    const allItems = getAllItems();
    let filtered = allItems;
    if (category && category !== "all") filtered = filtered.filter(i => i.category === category);
    if (tag) filtered = filtered.filter(i => i.tags.includes(tag));
    if (q) filtered = filtered.filter(i => i.title.includes(q) || (i.summary && i.summary.includes(q)));

    res.writeHead(200);
    return res.end(JSON.stringify({
      filters: { channel: "all", category: category || null, tag: tag || null, topic: null, q: q || null, tab: "time" },
      items: filtered.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        reason: item.reason,
        publishedAt: item.publishedAt,
        timelineAt: item.timelineAt,
        category: item.category,
        tags: item.tags,
        score: item.score,
        selected: item.selected,
        channel: item.channel,
        source: { name: item.source.name },
        x: null,
      })),
      page: 1,
      pageCount: 1,
      total: filtered.length,
      todayCount: filtered.length,
      freshness: isoNow,
      generatedAt: isoNow,
    }));
  }

  if (pathname.startsWith("/api/site/items/")) {
    const id = pathname.replace("/api/site/items/", "");
    const all = getAllItems();
    const found = all.find(i => i.id === id) || all[0];
    res.writeHead(200);
    return res.end(JSON.stringify({
      ...found,
      readingMode: "summary-only",
      author: "休斯敦随队报道组",
      language: "zh-CN",
      body: {
        zh: `<p>${found.summary}</p><p>本条资讯由 RocketsHOT 智能信源流水线自动聚合抓取与提炼，原文详见来源报道。</p>`,
        original: found.summary,
        zhKind: "original",
        complete: true,
      },
      outline: [],
      relatedStories: [],
      indexable: true,
      markdownAvailable: false,
      group: null,
    }));
  }

  if (pathname.startsWith("/api/site/story/")) {
    const id = pathname.replace("/api/site/story/", "");
    res.writeHead(200);
    return res.end(JSON.stringify({
      story: { publicId: id, title: "火箭近期重点动态追踪" },
      digest: "休斯敦火箭在乌度卡执教下展现强劲防守与青年军活力，申京、格林、阿门领衔的轮换正在季后赛争夺中占据主动。",
      generatedAt: isoNow,
      reports: MOCK_ITEMS.slice(0, 3).map(m => ({
        id: m.id,
        title: m.title,
        summary: m.summary,
        source: m.source,
        timelineAt: m.timelineAt,
        originalUrl: m.links.original,
        selected: true,
      })),
    }));
  }

  // Fallback 404
  res.writeHead(404);
  res.end(JSON.stringify({ code: "not_found", message: "Not Found" }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Mock RocketsHOT API server listening at http://127.0.0.1:${PORT}`);
});
