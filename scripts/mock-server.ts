import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 3001;

const now = new Date();
const isoNow = now.toISOString();
const todayDate = now.toISOString().slice(0, 10);

function deduplicateFeedItems<T extends { id: string; title: string; summary?: string | null; score?: number | null; publishedAt?: string | null; timelineAt?: string | null }>(items: T[]): T[] {
  const result: T[] = [];
  const normalize = (str: string) => (str || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const similarity = (a: string, b: string) => {
    if (!a || !b) return 0;
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) {
      const minLen = Math.min(a.length, b.length);
      const maxLen = Math.max(a.length, b.length);
      if (minLen / maxLen >= 0.55) return 0.88;
    }
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
    const normTitle = normalize(item.title);
    let isDuplicate = false;

    for (let i = 0; i < result.length; i++) {
      const existing = result[i]!;
      const existingNormTitle = normalize(existing.title);
      const sim = similarity(normTitle, existingNormTitle);
      if (sim >= 0.65) {
        isDuplicate = true;
        const currentScore = item.score ?? 0;
        const existingScore = existing.score ?? 0;
        const currentLen = (item.summary?.length ?? 0) + item.title.length;
        const existingLen = (existing.summary?.length ?? 0) + existing.title.length;
        if (currentScore > existingScore + 5 || (Math.abs(currentScore - existingScore) <= 5 && currentLen > existingLen + 15)) {
          result[i] = item;
        }
        break;
      }
    }
    if (!isDuplicate) result.push(item);
  }
  return result;
}

function getLiveItems() {
  try {
    const liveScrapedPath = path.join(import.meta.dirname, "../.data/live-scraped.json");
    if (!fs.existsSync(liveScrapedPath)) return [];
    const candidates = JSON.parse(fs.readFileSync(liveScrapedPath, "utf8"));
    return candidates
      .filter((c: any) => {
        const isYt = c.sourceId?.startsWith("yt-") || c.sourceName?.includes("YouTube") || c.url?.includes("youtube.com") || c.url?.includes("youtu.be");
        return !isYt;
      })
      .map((c: any, idx: number) => {
        const pubDate = c.publishedAt ? new Date(c.publishedAt) : new Date(Date.now() - idx * 3600 * 1000);
        const pubIso = pubDate.toISOString();
        const category = c.category || "news";
        const cleanExcerpt = (c.excerpt || "")
          .replace(/\[?&#8230;\]?/g, "...")
          .replace(/&#8217;/g, "'")
          .replace(/&#8216;/g, "'")
          .replace(/&#8220;/g, '"')
          .replace(/&#8221;/g, '"')
          .replace(/&#038;/g, "&")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .trim();

        const summary = cleanExcerpt || `${c.title} — 来自随队媒体 ${c.sourceName} 的最新前线深度报道。`;
        const reason = `随队核心媒体 ${c.sourceName} 重点前线报道`;

        return {
          id: `item-live-${idx + 1}`,
          revision: 1,
          title: c.title.replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"'),
          originalTitle: c.title,
          summary,
          reason,
          source: { id: c.sourceId || "rss-scraped", name: c.sourceName || "实时信源", kind: "rss" as const, firstParty: false, iconUrl: null },
          links: { aihot: `/items/item-live-${idx + 1}`, original: c.url },
          publishedAt: pubIso,
          discoveredAt: isoNow,
          timelineAt: pubIso,
          category,
          tags: [c.sourceName, "赛季动态"],
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
  const merged = [...getLiveItems(), ...MOCK_ITEMS];
  return deduplicateFeedItems(merged);
}

const MOCK_ITEMS = [
  {
    id: "item-rockets-1",
    revision: 1,
    title: "申京 28+12+7 全能表现，杜兰特关键跳投率火箭终结连败力克强敌",
    originalTitle: "Alperen Sengun's near triple-double & KD clutch jumper leads Rockets to victory",
    summary: "阿尔佩伦·申京在内线全面爆发，全场 18 投 12 中高效轰下 28 分 12 篮板 7 助攻 2 抢断。凯文·杜兰特在末节决胜时刻连续命中无解急停跳投锁定胜局。乌度卡赛后特别表扬了杜兰特与申京的高低位挡拆配合。",
    reason: "核心球员高光战报与赛果",
    source: { id: "rss-clutchfans", name: "ClutchFans 火箭资讯", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-1", original: "https://clutchfans.net" },
    publishedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    category: "news" as const,
    tags: ["比赛战报", "阿尔佩伦·申京", "凯文·杜兰特", "常规赛"],
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
    category: "trades" as const,
    tags: ["交易流言", "随队专栏", "管理层/选秀"],
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
    category: "analysis" as const,
    tags: ["深度专栏", "阿门·汤普森", "塔里·伊森"],
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
    category: "news" as const,
    tags: ["球队动态", "塔里·伊森", "伤病报告"],
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
    summary: "主帅伊梅·乌度卡在新闻发布会上重点谈到了阿门·汤普森的防守成长：“阿门具备全联盟最顶级的防守嗅觉，今晚他在外线领防中让对手核心后卫出现 5 次失误，同时杜兰特在防守端的协防保护让我们的防守体系固若金汤。”",
    reason: "主教练赛后深度原声采访",
    source: { id: "rss-clutchfans", name: "ClutchFans 火箭资讯", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-5", original: "https://clutchfans.net" },
    publishedAt: new Date(Date.now() - 28800 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 28800 * 1000).toISOString(),
    category: "news" as const,
    tags: ["球队动态", "乌度卡", "阿门·汤普森", "凯文·杜兰特"],
    score: 8.8,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-6",
    revision: 1,
    title: "Jonathan Feigen：丰田中心赛前投篮观察，惠特莫尔底角三分手感火热连中10球",
    originalTitle: "Cam Whitmore getting shots up pregame at Toyota Center",
    summary: "休斯顿纪事报随队名记 Feigen 发推报道：赛前热身中看到卡姆·惠特莫尔一直在底角加练接球急停三分，命中率极高且状态非常专注。助理教练与他针对跑位掩护进行了专门沟通。",
    reason: "随队名记现场日常推特观察",
    source: { id: "x-jonathan-feigen", name: "Jonathan Feigen", kind: "x_search" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-6", original: "https://x.com/Jonathan_Feigen" },
    publishedAt: new Date(Date.now() - 32400 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 32400 * 1000).toISOString(),
    category: "beat_tweets" as const,
    tags: ["队记推文", "卡姆·惠特莫尔"],
    score: 7.6,
    selected: true,
    channel: "x" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-7",
    revision: 1,
    title: "休斯敦纪事报：火箭全队开展首日训练营对抗，乌度卡重点演练防守换防细节",
    originalTitle: "Houston Rockets Day 1 Training Camp: Udoka emphasizes defensive switching",
    summary: "休斯敦纪事报随队记者报道：火箭训练营首日正式打响，主帅乌度卡强调防守换防细节与无球压迫，阿门·汤普森与谢泼德同组展现精妙传切配合，杜兰特在半场阵地单打中连续命中高难度跳投。",
    reason: "随队主流权威媒体现场训练营报道",
    source: { id: "rss-houstonchronicle-rockets", name: "休斯敦纪事报", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-7", original: "https://www.houstonchronicle.com/sports/rockets/" },
    publishedAt: new Date(Date.now() - 18000 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 18000 * 1000).toISOString(),
    category: "news" as const,
    tags: ["球队动态", "乌度卡", "凯文·杜兰特", "阿门·汤普森"],
    score: 9.2,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-8",
    revision: 1,
    title: "The Dream Shake 专栏：申京高位策应与谢泼德跑位配合如何重塑半场阵地战",
    originalTitle: "Rockets Tactical Room: Alperen Sengun & Reed Sheppard 2-Man Chemistry Breakdown",
    summary: "The Dream Shake 资深专栏深度分析：详细拆解了申京在肘区支配球时与谢泼德的掩护手递手配合（DHO），对手无论是选择夹击还是挤过掩护都会付出沉重防守代价，空间利用率大幅跃升。",
    reason: "战术专栏深度剖析",
    source: { id: "rss-thedreamshake", name: "The Dream Shake", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-8", original: "https://www.thedreamshake.com/" },
    publishedAt: new Date(Date.now() - 25000 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 25000 * 1000).toISOString(),
    category: "analysis" as const,
    tags: ["深度专栏", "阿尔佩伦·申京", "里德·谢泼德"],
    score: 8.9,
    selected: true,
    channel: "news" as const,
    story: null,
    x: null,
  },
  {
    id: "item-rockets-9",
    revision: 1,
    title: "Space City Scoop：阿门·汤普森新赛季进攻角色定位分析，挡拆发起与空切双核驱动",
    originalTitle: "Space City Scoop: Amen Thompson Sophomore Leap & Playmaking Breakdown",
    summary: "Space City Scoop 深度剖析阿门·汤普森的休赛期进化。当阿门作为挡拆持球人发起进攻时，他的首步爆发力结合高位视野能制造极佳外线空位投篮机会，防守转换进攻也是火箭核心武器。",
    reason: "随队媒体球员深度前瞻",
    source: { id: "rss-spacecityscoop", name: "Space City Scoop", kind: "rss" as const, firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-rockets-9", original: "https://spacecityscoop.com/" },
    publishedAt: new Date(Date.now() - 36000 * 1000).toISOString(),
    discoveredAt: isoNow,
    timelineAt: new Date(Date.now() - 36000 * 1000).toISOString(),
    category: "analysis" as const,
    tags: ["深度专栏", "阿门·汤普森"],
    score: 9.1,
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
      sources: 42,
      sourceKinds: { rss: 20, x_search: 22 },
      heatOnlySources: 0,
      items: 1456,
      selected: 184,
      dailies: 11,
      day: { collected: 138, selected: 12 },
      sampleSources: [
        { name: "休斯敦纪事报", kind: "rss", heatOnly: false },
        { name: "The Dream Shake", kind: "rss", heatOnly: false },
        { name: "Jonathan Feigen", kind: "x_search", heatOnly: false },
        { name: "Kelly Iko", kind: "x_search", heatOnly: false },
        { name: "ClutchFans", kind: "rss", heatOnly: false },
      ],
      latest: [
        { id: "item-rockets-1", title: "申京 28+12+7 全能表现，杜兰特关键跳投率火箭终结连败力克强敌", source: "ClutchFans" },
        { id: "item-rockets-2", title: "随队名记：火箭休赛期拒绝盲目全明星交易，全力绑定年轻核心班底", source: "The Athletic" },
      ],
    }));
  }

  if (pathname === "/api/site/topics") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      topics: [
        { slug: "durant", name: "凯文·杜兰特", group: "player", definition: "超级巨星，历史级无解单打、关键决胜进球与领袖核心", total: 48, recent: 9, indexable: true, latestAt: isoNow },
        { slug: "sengun", name: "阿尔佩伦·申京", group: "player", definition: "内线组织核心，高位策应与禁区攻防表现追踪", total: 42, recent: 6, indexable: true, latestAt: isoNow },
        { slug: "amen-thompson", name: "阿门·汤普森", group: "player", definition: "全能防守大闸，突破快攻反击与窒息换防", total: 35, recent: 5, indexable: true, latestAt: isoNow },
        { slug: "vanvleet", name: "弗雷德·范弗利特", group: "player", definition: "后场控场指挥官与老将领袖，关键控场与外线三分", total: 31, recent: 4, indexable: true, latestAt: isoNow },
        { slug: "udoka", name: "艾米·乌度卡 (主教练)", group: "player", definition: "铁血治军主帅，重塑球队高强度防守战术体系", total: 29, recent: 3, indexable: true, latestAt: isoNow },
        { slug: "bogdanovic", name: "博格丹·博格达诺维奇", group: "player", definition: "欧洲顶级神射手，外线火力牵引与替补得分枢纽", total: 26, recent: 4, indexable: true, latestAt: isoNow },
        { slug: "reed-sheppard", name: "里德·谢泼德", group: "player", definition: "优质神射手，外线空间拉开与高智商控球", total: 24, recent: 4, indexable: true, latestAt: isoNow },
        { slug: "tari-eason", name: "塔里·伊森", group: "player", definition: "拼抢尖兵，前场篮板冲抢与防守能量转换", total: 22, recent: 2, indexable: true, latestAt: isoNow },
        { slug: "tactics", name: "战术深度与高阶数据", group: "field", definition: "百回合进攻/防守效率、挡拆空间与轮换阵容分析", total: 18, recent: 3, indexable: true, latestAt: isoNow },
        { slug: "game-recaps", name: "比赛战报与赛果", group: "genre", definition: "常规赛与季后赛赛果、比分、胜负走势与赛后盘点", total: 56, recent: 8, indexable: true, latestAt: isoNow },
        { slug: "trade-roster", name: "交易、签约与阵容", group: "genre", definition: "球队引援签约、双向合同转正、球员买断裁员及选秀大会操作", total: 28, recent: 4, indexable: true, latestAt: isoNow },
        { slug: "rumors", name: "随队名记与转会流言", group: "genre", definition: "Jonathan Feigen、Kelly Iko、Shams 等名记透露的火箭引援谈判传闻", total: 25, recent: 5, indexable: true, latestAt: isoNow },
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
    let filtered = allItems.filter(i => {
      const srcId = String(i.source?.id || "").toLowerCase();
      const srcName = String(i.source?.name || "");
      const orig = String(i.links?.original || "").toLowerCase();
      const cat = String(i.category || "");
      const title = String(i.title || "");
      return !srcId.startsWith("yt-") && !srcId.includes("youtube") && !srcName.includes("YouTube") && !orig.includes("youtube.com") && !orig.includes("youtu.be") && !orig.includes("youtube") && !title.includes("YouTube") && cat !== "videos";
    });
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
    if (category && category !== "all") {
      if (category === "videos") {
        filtered = filtered.filter(i => i.category === "videos" || i.source.id.startsWith("yt-") || i.source.name.toLowerCase().includes("youtube") || (i.links.original && (i.links.original.includes("youtube.com") || i.links.original.includes("youtu.be"))));
      } else {
        filtered = filtered.filter(i => i.category === category);
      }
    }
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

  if (pathname.startsWith("/api/site/reports/")) {
    const reportNav = [
      { key: "2026-10-01", title: "火箭每日快报：乌度卡敲定核心轮换，澳门赛对决独行侠在即" },
      { key: "2026-09-30", title: "火箭每日快报：申京内线高光爆发，媒体日年轻核心表态" },
      { key: "2026-09-29", title: "火箭每日快报：训练营首日防守对抗，谢泼德手感火热" },
    ];

    const reportIndex = [
      { key: "2026-10-01", title: "火箭每日快报：乌度卡敲定核心轮换，澳门赛对决独行侠在即", generatedAt: isoNow, count: 8 },
      { key: "2026-09-30", title: "火箭每日快报：申京内线高光爆发，媒体日年轻核心表态", generatedAt: isoNow, count: 7 },
      { key: "2026-09-29", title: "火箭每日快报：训练营首日防守对抗，谢泼德手感火热", generatedAt: isoNow, count: 6 },
    ];

    const buildMockReport = (kind: string = "daily", key: string = "2026-10-01") => {
      const all = getAllItems();
      const formatCitation = (it: any) => ({
        itemId: it.id,
        title: it.title,
        summary: it.summary,
        sourceName: it.source?.name || "火箭随队",
        sourceUrl: it.links?.original || "https://clutchfans.net",
        sourceId: it.source?.id || null,
        sourceIconUrl: null,
        firstParty: it.source?.firstParty ?? false,
        role: null,
        storyPublicId: it.story?.publicId ?? null,
        publishedAt: it.publishedAt,
        available: true,
      });

      const newsItems = all.filter(i => i.category === "news" || !i.category).slice(0, 4);
      const analysisItems = all.filter(i => i.category === "analysis" || i.category === "videos").slice(0, 3);
      const tradeItems = all.filter(i => i.category === "trades" || i.category === "beat_tweets").slice(0, 3);

      const highlights = [
        formatCitation(all[0] || MOCK_ITEMS[0]),
        formatCitation(all[1] || MOCK_ITEMS[1]),
        formatCitation(all[2] || MOCK_ITEMS[2]),
      ];

      const sections = [
        {
          label: "球队动态",
          summary: "训练营高强度防守演练与轮换深度调试，重点关注年轻阵容换防默契。",
          items: (newsItems.length > 0 ? newsItems : all.slice(0, 3)).map(formatCitation),
        },
        {
          label: "深度与战术",
          summary: "高阶数据拆解：申京高位发牌与阿门·汤普森弱侧空切破坏力。",
          items: (analysisItems.length > 0 ? analysisItems : all.slice(3, 5)).map(formatCitation),
        },
        {
          label: "交易与随队动向",
          summary: "斯通明确休赛期续约路径，随队名记一线爆料汇编。",
          items: (tradeItems.length > 0 ? tradeItems : all.slice(5, 7)).map(formatCitation),
        },
      ];

      const allSectionItems = sections.flatMap(s => s.items.map(it => ({ ...it, label: s.label })));

      return {
        kind,
        key,
        title: `休斯敦火箭${kind === "daily" ? "早报" : kind === "weekly" ? "周报" : "月报"} · ${key}`,
        windowStart: `${key}T00:00:00.000Z`,
        windowEnd: `${key}T23:59:59.999Z`,
        generatedAt: isoNow,
        revision: 1,
        lead: {
          title: "乌度卡敲定训练营核心轮换，澳门赛对决独行侠在即",
          leadParagraph: "休斯敦火箭今日结束在丰田中心的高强度分组对抗。主帅伊梅·乌度卡在媒体日后首次透露了季前赛出场时间安排：申京、杜兰特、阿门将组成新赛季进攻发动力轴心。球队定于下周启程直飞中国澳门，在威尼斯人金光综艺馆两战达拉斯独行侠，展开得州宿敌黄金档巅峰对决。",
        },
        overview: "火箭训练营高强度防守演练进入白热化，澳门赛对阵独行侠与年轻后场磨合备受全联盟瞩目。",
        highlights,
        sections,
        stories: allSectionItems,
        flashes: [
          {
            itemId: null,
            title: "火箭启程中国澳门包机行程敲定，全员健康出战 10月9日 澳门赛",
            summary: null,
            sourceName: "随队专机航讯",
            sourceUrl: "https://clutchfans.net",
            sourceId: null,
            sourceIconUrl: null,
            firstParty: true,
            role: null,
            storyPublicId: null,
            publishedAt: isoNow,
            available: true,
          },
          {
            itemId: null,
            title: "小贾巴里·史密斯休赛期增肌 5 公斤，三分定点投篮命中率超 42%",
            summary: null,
            sourceName: "休斯顿纪事报",
            sourceUrl: "https://houstonchronicle.com",
            sourceId: null,
            sourceIconUrl: null,
            firstParty: false,
            role: null,
            storyPublicId: null,
            publishedAt: isoNow,
            available: true,
          },
          {
            itemId: null,
            title: "NBA 澳门赛两战金光综艺馆门票开票即售罄，中国球迷热情引爆",
            summary: null,
            sourceName: "NBA 官方新闻",
            sourceUrl: "https://nba.com",
            sourceId: null,
            sourceIconUrl: null,
            firstParty: true,
            role: null,
            storyPublicId: null,
            publishedAt: isoNow,
            available: true,
          },
        ],
        cover: null,
        metrics: {
          totalEvents: 8,
          totalStories: 5,
          sourcesCount: 14,
          firstPartyEvents: 3,
        },
        readingMinutes: 3,
        prev: key === "2026-10-01" ? "2026-09-30" : "2026-09-29",
        next: key === "2026-10-01" ? null : "2026-10-01",
      };
    };

    // 1. 最新出刊页面 (latest-page)
    if (pathname.includes("/latest-page")) {
      const match = pathname.match(/\/api\/site\/reports\/([^/]+)\/latest-page/);
      const kind = match ? match[1]! : "daily";
      res.writeHead(200);
      return res.end(JSON.stringify({
        index: reportNav,
        report: buildMockReport(kind, "2026-10-01"),
      }));
    }

    // 2. 导航历史接口
    if (pathname.includes("/navigation/")) {
      res.writeHead(200);
      return res.end(JSON.stringify({ items: reportNav }));
    }

    // 3. 按月份归档接口
    if (pathname.includes("/months/")) {
      res.writeHead(200);
      return res.end(JSON.stringify({ items: reportNav }));
    }

    // 4. 全部合订本列表接口 (/api/site/reports/daily)
    if (pathname === "/api/site/reports/daily" || pathname === "/api/site/reports/daily/") {
      res.writeHead(200);
      return res.end(JSON.stringify({ items: reportIndex }));
    }

    // 5. 详情页接口 (/api/site/reports/:kind/:key)
    const detailMatch = pathname.match(/\/api\/site\/reports\/([^/]+)\/([^/]+)/);
    if (detailMatch) {
      const [, kind, key] = detailMatch;
      res.writeHead(200);
      return res.end(JSON.stringify(buildMockReport(kind!, key!)));
    }
  }

  // Fallback 404
  res.writeHead(404);
  res.end(JSON.stringify({ code: "not_found", message: "Not Found" }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Mock RocketsHOT API server listening at http://127.0.0.1:${PORT}`);
});
