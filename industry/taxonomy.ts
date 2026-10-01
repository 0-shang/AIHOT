// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "news", label: "球队动态", section: "动态与采访", guide: "官方公告、伤病名单、出战状态、日常训练花絮、发展联盟召回；比赛战报、赛后技术统计与胜负盘点；主教练乌度卡、核心球员及管理层斯通的赛后采访、媒体日言论、更衣室原声采访与新闻发布会；随队记者发布的与火箭队高度正相关的实质新闻（一手采访、重要伤情、队内实质动向，记者日常推文碎碎念严禁归入）" },
  { key: "analysis", label: "深度专栏", section: "战术与专栏", guide: "战术打法剖析、挡拆攻防复盘、高阶数据模型、薪资空间结构、选秀前景及行业深度分析" },
  { key: "trades", label: "交易流言", section: "交易与流言", guide: "正式交易、自由球员签约、转会传闻与谈判动向、名记引援爆料、选秀大会与裁员下放；随队记者发布的涉及火箭队实质引援与交易动向的推文" },
  { key: "beat_tweets", label: "队记推文", section: "队记推文", guide: "随队名记（Jonathan Feigen, Kelly Iko, Adam Spolane 等）在 X/推特发布的日常推文、观赛随感、现场花絮、实时看球动态与互动；默认所有队记推文归入此栏，若内容属于高度实质的球队新闻或采访则归入球队动态，交易爆料则归入交易流言" },
] as const;

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = [
  "game_recap",
  "roster_move",
  "trade_rumor",
  "injury_report",
  "interview_quote",
  "tactical_analysis",
  "general_news",
] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "赛程战报",
  "交易流言",
  "球队动态",
  "深度专栏",
  "队记推文",
  "非火箭/联盟其他",
  "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "常规赛",
  "季后赛",
  "夏季联赛",
  "乌度卡",
  "杰伦·格林",
  "阿尔佩伦·申京",
  "阿门·汤普森",
  "小贾巴里·史密斯",
  "塔里·伊森",
  "里德·谢泼德",
  "弗雷德·范弗里特",
  "史蒂文·亚当斯",
  "卡姆·惠特莫尔",
  "狄龙·布鲁克斯",
  "拉斐尔·斯通",
  "毒蛇队/G联赛",
  "选秀权",
  "薪资空间",
] as const;

/** 可选的实体标签（球队、随队媒体、机构）。 */
export const ENTITY_TAGS = [
  "休斯敦火箭",
  "NBA官方",
  "休斯顿纪事报",
  "ClutchFans",
  "The Athletic",
  "ESPN",
  "毒蛇队",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  战报: "比赛战报",
  赛果: "比赛战报",
  复盘: "深度专栏",
  战术: "深度专栏",
  分析: "深度专栏",
  专栏: "深度专栏",
  交易: "交易流言",
  签约: "交易流言",
  续约: "交易流言",
  裁员: "交易流言",
  流言: "交易流言",
  传闻: "交易流言",
  爆料: "交易流言",
  选秀: "交易流言",
  阵容: "交易流言",
  转会: "交易流言",
  伤病: "球队动态",
  伤情: "球队动态",
  出场: "球队动态",
  出战: "球队动态",
  动态: "球队动态",
  综合: "球队动态",
  训练: "球队动态",
  管理层: "球队动态",
  采访: "球队动态",
  言论: "球队动态",
  声音: "球队动态",
  原声: "球队动态",
  队记: "队记推文",
  推文: "队记推文",
  随队: "队记推文",
};

/** 模型漏了分类标签时，按内容类型补一个。 */
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  game_recap: "比赛战报",
  roster_move: "交易流言",
  trade_rumor: "交易流言",
  injury_report: "球队动态",
  interview_quote: "球队动态",
  tactical_analysis: "深度专栏",
  general_news: "球队动态",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/** 主体目录：id → 显示名、卡片上显示的标签、别名。 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  rockets: { name: "休斯敦火箭", displayTag: "休斯敦火箭", aliases: ["Houston Rockets", "Rockets", "休斯敦火箭", "火箭队", "航天城"] },
  "jalen-green": { name: "杰伦·格林", displayTag: "杰伦·格林", aliases: ["Jalen Green", "格林"] },
  sengun: { name: "阿尔佩伦·申京", displayTag: "阿尔佩伦·申京", aliases: ["Alperen Sengun", "Alperen Şengün", "申京"] },
  "amen-thompson": { name: "阿门·汤普森", displayTag: "阿门·汤普森", aliases: ["Amen Thompson", "阿门"] },
  "jabari-smith": { name: "小贾巴里·史密斯", displayTag: "小贾巴里·史密斯", aliases: ["Jabari Smith Jr.", "Jabari Smith", "小史密斯"] },
  "tari-eason": { name: "塔里·伊森", displayTag: "塔里·伊森", aliases: ["Tari Eason", "伊森"] },
  "reed-sheppard": { name: "里德·谢泼德", displayTag: "里德·谢泼德", aliases: ["Reed Sheppard", "谢泼德"] },
  "fred-vanvleet": { name: "弗雷德·范弗里特", displayTag: "弗雷德·范弗里特", aliases: ["Fred VanVleet", "范弗里特", "范乔丹"] },
  "dillon-brooks": { name: "狄龙·布鲁克斯", displayTag: "狄龙·布鲁克斯", aliases: ["Dillon Brooks", "狄龙"] },
  "ime-udoka": { name: "艾米·乌度卡", displayTag: "艾米·乌度卡", aliases: ["Ime Udoka", "乌度卡"] },
  "rafael-stone": { name: "拉斐尔·斯通", displayTag: "拉斐尔·斯通", aliases: ["Rafael Stone", "斯通"] },
  "cam-whitmore": { name: "卡姆·惠特莫尔", displayTag: "卡姆·惠特莫尔", aliases: ["Cam Whitmore", "惠特莫尔", "白魔"] },
  "steven-adams": { name: "史蒂文·亚当斯", displayTag: "史蒂文·亚当斯", aliases: ["Steven Adams", "亚当斯", "海王"] },
  clutchfans: { name: "ClutchFans", displayTag: "ClutchFans", aliases: ["ClutchFans"] },
  chronicle: { name: "休斯顿纪事报", displayTag: "休斯顿纪事报", aliases: ["Houston Chronicle", "Feigen"] },
};

/**
 * 身份词典：摘要和标题里出现的人或主体，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "rockets", name: "休斯敦火箭", patterns: [/rockets|houston\s*rockets|休斯[敦顿]火箭|火箭队/i] },
  { id: "jalen-green", name: "杰伦·格林", patterns: [/jalen\s*green|杰伦[·\s]*格林/i] },
  { id: "sengun", name: "阿尔佩伦·申京", patterns: [/alperen\s*[sş]eng[uü]n|申京/i] },
  { id: "amen-thompson", name: "阿门·汤普森", patterns: [/amen\s*thompson|阿门[·\s]*汤普森/i] },
  { id: "jabari-smith", name: "小贾巴里·史密斯", patterns: [/jabari\s*smith|小?贾巴里[·\s]*史密斯/i] },
  { id: "tari-eason", name: "塔里·伊森", patterns: [/tari\s*eason|塔里[·\s]*伊森/i] },
  { id: "reed-sheppard", name: "里德·谢泼德", patterns: [/reed\s*sheppard|里德[·\s]*谢泼德|谢泼德/i] },
  { id: "fred-vanvleet", name: "弗雷德·范弗里特", patterns: [/fred\s*vanvleet|范弗里特|范乔丹/i] },
  { id: "ime-udoka", name: "艾米·乌度卡", patterns: [/ime\s*udoka|乌度卡/i] },
  { id: "cam-whitmore", name: "卡姆·惠特莫尔", patterns: [/cam\s*whitmore|惠特莫尔/i] },
  { id: "steven-adams", name: "史蒂文·亚当斯", patterns: [/steven\s*adams|亚当斯/i] },
  { id: "dillon-brooks", name: "狄龙·布鲁克斯", patterns: [/dillon\s*brooks|狄龙/i] },
  { id: "rafael-stone", name: "拉斐尔·斯通", patterns: [/rafael\s*stone|斯通/i] },
];

/** 这些域名上的文章，发布方就是对应的主体。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "rockets", domains: ["nba.com/rockets", "rockets.com"] },
  { entityId: "clutchfans", domains: ["clutchfans.net"] },
  { entityId: "chronicle", domains: ["houstonchronicle.com"] },
];

/** 原文里的这些写法也算提到了对应主体。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "rockets", pattern: /@HoustonRockets\b/i },
];
