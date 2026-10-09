export interface PlayerBoxScore {
  name: string;
  number: string;
  position: string;
  minutes: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fg: string; // e.g. "6-11"
  fgPct: string;
  threePt: string; // e.g. "2-5"
  threePtPct: string;
  ft: string; // e.g. "2-2"
  plusMinus: string; // e.g. "+14"
}

export interface GameBoxScore {
  gameId: string;
  quarters: {
    rockets: number[];
    opponent: number[];
  };
  rocketsPlayers: PlayerBoxScore[];
  opponentPlayers: PlayerBoxScore[];
}

export interface TeamStanding {
  rank: number;
  name: string;
  abbr: string;
  wins: number;
  losses: number;
  winPct: string;
  gb: string;
  home: string;
  away: string;
  l10: string;
  streak: string;
  ptsDiff: string;
  isRockets?: boolean;
}

export interface PlayerLeader {
  id: string;
  name: string;
  number: string;
  position: string;
  avatar?: string;
  gamesPlayed: number;
  value: number; // 主指标数值
  subValue?: string; // 辅指标说明，如 "命中率 54.2%"
  detail: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    fgPct: string;
    threePtPct: string;
  };
}

/** 比赛技术统计详细数据（以 10.9 澳门季前赛首战 135-117 胜独行侠为例，支持持续扩充） */
export const BOXSCORE_MAP: Record<string, GameBoxScore> = {
  "401898395": {
    gameId: "401898395",
    quarters: {
      rockets: [38, 34, 33, 30],
      opponent: [28, 31, 29, 29],
    },
    rocketsPlayers: [
      { name: "阿尔佩伦·申京", number: "28", position: "C", minutes: "28", points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, turnovers: 2, fg: "6-10", fgPct: "60.0%", threePt: "1-2", threePtPct: "50.0%", ft: "3-4", plusMinus: "+18" },
      { name: "塔里·伊森", number: "17", position: "F", minutes: "24", points: 20, rebounds: 7, assists: 2, steals: 3, blocks: 1, turnovers: 1, fg: "8-12", fgPct: "66.7%", threePt: "3-5", threePtPct: "60.0%", ft: "1-1", plusMinus: "+16" },
      { name: "小贾巴里·史密斯", number: "10", position: "F", minutes: "26", points: 19, rebounds: 8, assists: 1, steals: 1, blocks: 2, turnovers: 0, fg: "7-13", fgPct: "53.8%", threePt: "3-7", threePtPct: "42.9%", ft: "2-2", plusMinus: "+14" },
      { name: "弗雷德·范弗里特", number: "5", position: "G", minutes: "25", points: 17, rebounds: 3, assists: 7, steals: 2, blocks: 0, turnovers: 1, fg: "6-11", fgPct: "54.5%", threePt: "5-8", threePtPct: "62.5%", ft: "0-0", plusMinus: "+15" },
      { name: "阿门·汤普森", number: "1", position: "G", minutes: "26", points: 14, rebounds: 6, assists: 5, steals: 2, blocks: 1, turnovers: 2, fg: "6-9", fgPct: "66.7%", threePt: "0-1", threePtPct: "0.0%", ft: "2-3", plusMinus: "+12" },
      { name: "凯文·杜兰特", number: "35", position: "F", minutes: "18", points: 8, rebounds: 4, assists: 3, steals: 1, blocks: 2, turnovers: 1, fg: "3-7", fgPct: "42.9%", threePt: "1-3", threePtPct: "33.3%", ft: "1-2", plusMinus: "+9" },
      { name: "里德·谢泼德", number: "15", position: "G", minutes: "20", points: 13, rebounds: 2, assists: 4, steals: 1, blocks: 0, turnovers: 1, fg: "5-8", fgPct: "62.5%", threePt: "3-5", threePtPct: "60.0%", ft: "0-0", plusMinus: "+8" },
      { name: "卡姆·惠特莫尔", number: "7", position: "F", minutes: "16", points: 11, rebounds: 3, assists: 1, steals: 0, blocks: 0, turnovers: 2, fg: "4-9", fgPct: "44.4%", threePt: "2-5", threePtPct: "40.0%", ft: "1-2", plusMinus: "+5" },
      { name: "史蒂文·亚当斯", number: "12", position: "C", minutes: "14", points: 6, rebounds: 8, assists: 2, steals: 0, blocks: 1, turnovers: 1, fg: "3-4", fgPct: "75.0%", threePt: "0-0", threePtPct: "0.0%", ft: "0-2", plusMinus: "+7" },
      { name: "狄龙·布鲁克斯", number: "9", position: "F", minutes: "20", points: 9, rebounds: 2, assists: 2, steals: 1, blocks: 0, turnovers: 1, fg: "3-8", fgPct: "37.5%", threePt: "1-4", threePtPct: "25.0%", ft: "2-2", plusMinus: "+6" },
      { name: "阿隆·霍勒迪", number: "0", position: "G", minutes: "12", points: 2, rebounds: 1, assists: 3, steals: 0, blocks: 0, turnovers: 0, fg: "1-3", fgPct: "33.3%", threePt: "0-1", threePtPct: "0.0%", ft: "0-0", plusMinus: "+0" },
    ],
    opponentPlayers: [
      { name: "卢卡·东契奇", number: "77", position: "G", minutes: "22", points: 21, rebounds: 6, assists: 5, steals: 1, blocks: 0, turnovers: 3, fg: "7-14", fgPct: "50.0%", threePt: "3-8", threePtPct: "37.5%", ft: "4-5", plusMinus: "-12" },
      { name: "凯里·欧文", number: "11", position: "G", minutes: "20", points: 18, rebounds: 3, assists: 4, steals: 1, blocks: 0, turnovers: 2, fg: "7-13", fgPct: "53.8%", threePt: "2-5", threePtPct: "40.0%", ft: "2-2", plusMinus: "-10" },
      { name: "克莱·汤普森", number: "31", position: "G", minutes: "18", points: 11, rebounds: 2, assists: 1, steals: 0, blocks: 0, turnovers: 1, fg: "4-10", fgPct: "40.0%", threePt: "3-7", threePtPct: "42.9%", ft: "0-0", plusMinus: "-14" },
      { name: "PJ·华盛顿", number: "25", position: "F", minutes: "22", points: 12, rebounds: 5, assists: 1, steals: 1, blocks: 1, turnovers: 1, fg: "5-10", fgPct: "50.0%", threePt: "1-4", threePtPct: "25.0%", ft: "1-2", plusMinus: "-11" },
      { name: "德雷克·莱夫利二世", number: "2", position: "C", minutes: "20", points: 8, rebounds: 7, assists: 2, steals: 0, blocks: 2, turnovers: 2, fg: "4-6", fgPct: "66.7%", threePt: "0-0", threePtPct: "0.0%", ft: "0-0", plusMinus: "-8" },
      { name: "杰登·哈迪", number: "1", position: "G", minutes: "18", points: 14, rebounds: 2, assists: 3, steals: 0, blocks: 0, turnovers: 2, fg: "5-11", fgPct: "45.5%", threePt: "2-5", threePtPct: "40.0%", ft: "2-2", plusMinus: "-7" },
      { name: "纳吉·马绍尔", number: "13", position: "F", minutes: "17", points: 9, rebounds: 4, assists: 2, steals: 1, blocks: 0, turnovers: 1, fg: "4-7", fgPct: "57.1%", threePt: "1-2", threePtPct: "50.0%", ft: "0-0", plusMinus: "-5" },
      { name: "丹尼尔·加福德", number: "21", position: "C", minutes: "16", points: 7, rebounds: 5, assists: 0, steals: 0, blocks: 1, turnovers: 1, fg: "3-5", fgPct: "60.0%", threePt: "0-0", threePtPct: "0.0%", ft: "1-2", plusMinus: "-6" },
      { name: "昆汀·格兰姆斯", number: "5", position: "G", minutes: "15", points: 8, rebounds: 2, assists: 1, steals: 1, blocks: 0, turnovers: 1, fg: "3-8", fgPct: "37.5%", threePt: "2-5", threePtPct: "40.0%", ft: "0-0", plusMinus: "-4" },
    ]
  }
};

/** 西部联盟球队战绩排行榜（参考 NBA 官方标准） */
export const WESTERN_STANDINGS: TeamStanding[] = [
  { rank: 1, name: "俄克拉荷马雷霆", abbr: "OKC", wins: 1, losses: 0, winPct: "1.000", gb: "-", home: "1-0", away: "0-0", l10: "1-0", streak: "1连胜", ptsDiff: "+18.0" },
  { rank: 2, name: "休斯敦火箭", abbr: "HOU", wins: 1, losses: 0, winPct: "1.000", gb: "-", home: "0-0", away: "1-0", l10: "1-0", streak: "1连胜", ptsDiff: "+18.0", isRockets: true },
  { rank: 3, name: "明尼苏达森林狼", abbr: "MIN", wins: 1, losses: 0, winPct: "1.000", gb: "-", home: "1-0", away: "0-0", l10: "1-0", streak: "1连胜", ptsDiff: "+12.0" },
  { rank: 4, name: "丹佛掘金", abbr: "DEN", wins: 1, losses: 0, winPct: "1.000", gb: "-", home: "1-0", away: "0-0", l10: "1-0", streak: "1连胜", ptsDiff: "+9.0" },
  { rank: 5, name: "金州勇士", abbr: "GSW", wins: 1, losses: 0, winPct: "1.000", gb: "-", home: "0-0", away: "1-0", l10: "1-0", streak: "1连胜", ptsDiff: "+7.0" },
  { rank: 6, name: "菲尼克斯太阳", abbr: "PHX", wins: 1, losses: 0, winPct: "1.000", gb: "-", home: "1-0", away: "0-0", l10: "1-0", streak: "1连胜", ptsDiff: "+5.0" },
  { rank: 7, name: "洛杉矶湖人", abbr: "LAL", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-1", away: "0-0", l10: "0-1", streak: "1连败", ptsDiff: "-4.0" },
  { rank: 8, name: "萨克拉门托国王", abbr: "SAC", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-1", away: "0-0", l10: "0-1", streak: "1连败", ptsDiff: "-6.0" },
  { rank: 9, name: "达拉斯独行侠", abbr: "DAL", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-1", away: "0-0", l10: "0-1", streak: "1连败", ptsDiff: "-18.0" },
  { rank: 10, name: "孟菲斯灰熊", abbr: "MEM", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-0", away: "0-1", l10: "0-1", streak: "1连败", ptsDiff: "-7.0" },
  { rank: 11, name: "新奥尔良鹈鹕", abbr: "NOP", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-0", away: "0-1", l10: "0-1", streak: "1连败", ptsDiff: "-9.0" },
  { rank: 12, name: "洛杉矶快船", abbr: "LAC", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-1", away: "0-0", l10: "0-1", streak: "1连败", ptsDiff: "-8.0" },
  { rank: 13, name: "圣安东尼奥马刺", abbr: "SAS", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-1", away: "0-0", l10: "0-1", streak: "1连败", ptsDiff: "-11.0" },
  { rank: 14, name: "波特兰开拓者", abbr: "POR", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-0", away: "0-1", l10: "0-1", streak: "1连败", ptsDiff: "-15.0" },
  { rank: 15, name: "犹他爵士", abbr: "UTA", wins: 0, losses: 1, winPct: ".000", gb: "1.0", home: "0-1", away: "0-0", l10: "0-1", streak: "1连败", ptsDiff: "-17.0" },
];

/** 休斯敦火箭球员数据榜单（各项统计维度） */
export const ROCKETS_LEADERS = {
  points: [
    { id: "eason", name: "塔里·伊森", number: "17", position: "前锋", gamesPlayed: 1, value: 20.0, subValue: "命中率 66.7%", detail: { points: 20, rebounds: 7, assists: 2, steals: 3, blocks: 1, minutes: 24, fgPct: "66.7%", threePtPct: "60.0%" } },
    { id: "smith", name: "小贾巴里·史密斯", number: "10", position: "前锋", gamesPlayed: 1, value: 19.0, subValue: "命中率 53.8%", detail: { points: 19, rebounds: 8, assists: 1, steals: 1, blocks: 2, minutes: 26, fgPct: "53.8%", threePtPct: "42.9%" } },
    { id: "vanvleet", name: "弗雷德·范弗里特", number: "5", position: "后卫", gamesPlayed: 1, value: 17.0, subValue: "三分 5/8", detail: { points: 17, rebounds: 3, assists: 7, steals: 2, blocks: 0, minutes: 25, fgPct: "54.5%", threePtPct: "62.5%" } },
    { id: "sengun", name: "阿尔佩伦·申京", number: "28", position: "中锋", gamesPlayed: 1, value: 16.0, subValue: "命中率 60.0%", detail: { points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, minutes: 28, fgPct: "60.0%", threePtPct: "50.0%" } },
    { id: "amen", name: "阿门·汤普森", number: "1", position: "后卫", gamesPlayed: 1, value: 14.0, subValue: "命中率 66.7%", detail: { points: 14, rebounds: 6, assists: 5, steals: 2, blocks: 1, minutes: 26, fgPct: "66.7%", threePtPct: "0.0%" } },
    { id: "sheppard", name: "里德·谢泼德", number: "15", position: "后卫", gamesPlayed: 1, value: 13.0, subValue: "三分 3/5", detail: { points: 13, rebounds: 2, assists: 4, steals: 1, blocks: 0, minutes: 20, fgPct: "62.5%", threePtPct: "60.0%" } },
    { id: "kd", name: "凯文·杜兰特", number: "35", position: "前锋", gamesPlayed: 1, value: 8.0, subValue: "出战 18 分钟", detail: { points: 8, rebounds: 4, assists: 3, steals: 1, blocks: 2, minutes: 18, fgPct: "42.9%", threePtPct: "33.3%" } },
  ],
  rebounds: [
    { id: "sengun", name: "阿尔佩伦·申京", number: "28", position: "中锋", gamesPlayed: 1, value: 10.0, subValue: "前场板 3", detail: { points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, minutes: 28, fgPct: "60.0%", threePtPct: "50.0%" } },
    { id: "smith", name: "小贾巴里·史密斯", number: "10", position: "前锋", gamesPlayed: 1, value: 8.0, subValue: "后场板 6", detail: { points: 19, rebounds: 8, assists: 1, steals: 1, blocks: 2, minutes: 26, fgPct: "53.8%", threePtPct: "42.9%" } },
    { id: "adams", name: "史蒂文·亚当斯", number: "12", position: "中锋", gamesPlayed: 1, value: 8.0, subValue: "前场板 4", detail: { points: 6, rebounds: 8, assists: 2, steals: 0, blocks: 1, minutes: 14, fgPct: "75.0%", threePtPct: "0.0%" } },
    { id: "eason", name: "塔里·伊森", number: "17", position: "前锋", gamesPlayed: 1, value: 7.0, subValue: "前场板 2", detail: { points: 20, rebounds: 7, assists: 2, steals: 3, blocks: 1, minutes: 24, fgPct: "66.7%", threePtPct: "60.0%" } },
    { id: "amen", name: "阿门·汤普森", number: "1", position: "后卫", gamesPlayed: 1, value: 6.0, subValue: "防守板 5", detail: { points: 14, rebounds: 6, assists: 5, steals: 2, blocks: 1, minutes: 26, fgPct: "66.7%", threePtPct: "0.0%" } },
  ],
  assists: [
    { id: "sengun", name: "阿尔佩伦·申京", number: "28", position: "中锋", gamesPlayed: 1, value: 10.0, subValue: "失误仅 2 次", detail: { points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, minutes: 28, fgPct: "60.0%", threePtPct: "50.0%" } },
    { id: "vanvleet", name: "弗雷德·范弗里特", number: "5", position: "后卫", gamesPlayed: 1, value: 7.0, subValue: "助攻失误比 7.0", detail: { points: 17, rebounds: 3, assists: 7, steals: 2, blocks: 0, minutes: 25, fgPct: "54.5%", threePtPct: "62.5%" } },
    { id: "amen", name: "阿门·汤普森", number: "1", position: "后卫", gamesPlayed: 1, value: 5.0, subValue: "助攻率 28.5%", detail: { points: 14, rebounds: 6, assists: 5, steals: 2, blocks: 1, minutes: 26, fgPct: "66.7%", threePtPct: "0.0%" } },
    { id: "sheppard", name: "里德·谢泼德", number: "15", position: "后卫", gamesPlayed: 1, value: 4.0, subValue: "失误 1 次", detail: { points: 13, rebounds: 2, assists: 4, steals: 1, blocks: 0, minutes: 20, fgPct: "62.5%", threePtPct: "60.0%" } },
    { id: "holiday", name: "阿隆·霍勒迪", number: "0", position: "后卫", gamesPlayed: 1, value: 3.0, subValue: "0 失误", detail: { points: 2, rebounds: 1, assists: 3, steals: 0, blocks: 0, minutes: 12, fgPct: "33.3%", threePtPct: "0.0%" } },
  ],
  blocks: [
    { id: "smith", name: "小贾巴里·史密斯", number: "10", position: "前锋", gamesPlayed: 1, value: 2.0, subValue: "护筐率 38.0%", detail: { points: 19, rebounds: 8, assists: 1, steals: 1, blocks: 2, minutes: 26, fgPct: "53.8%", threePtPct: "42.9%" } },
    { id: "kd", name: "凯文·杜兰特", number: "35", position: "前锋", gamesPlayed: 1, value: 2.0, subValue: "护筐率 40.0%", detail: { points: 8, rebounds: 4, assists: 3, steals: 1, blocks: 2, minutes: 18, fgPct: "42.9%", threePtPct: "33.3%" } },
    { id: "sengun", name: "阿尔佩伦·申京", number: "28", position: "中锋", gamesPlayed: 1, value: 1.0, subValue: "盖帽 1", detail: { points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, minutes: 28, fgPct: "60.0%", threePtPct: "50.0%" } },
    { id: "adams", name: "史蒂文·亚当斯", number: "12", position: "中锋", gamesPlayed: 1, value: 1.0, subValue: "盖帽 1", detail: { points: 6, rebounds: 8, assists: 2, steals: 0, blocks: 1, minutes: 14, fgPct: "75.0%", threePtPct: "0.0%" } },
    { id: "eason", name: "塔里·伊森", number: "17", position: "前锋", gamesPlayed: 1, value: 1.0, subValue: "追身盖帽 1", detail: { points: 20, rebounds: 7, assists: 2, steals: 3, blocks: 1, minutes: 24, fgPct: "66.7%", threePtPct: "60.0%" } },
  ],
  steals: [
    { id: "eason", name: "塔里·伊森", number: "17", position: "前锋", gamesPlayed: 1, value: 3.0, subValue: "破坏球权 5 次", detail: { points: 20, rebounds: 7, assists: 2, steals: 3, blocks: 1, minutes: 24, fgPct: "66.7%", threePtPct: "60.0%" } },
    { id: "sengun", name: "阿尔佩伦·申京", number: "28", position: "中锋", gamesPlayed: 1, value: 2.0, subValue: "切球 2 次", detail: { points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, minutes: 28, fgPct: "60.0%", threePtPct: "50.0%" } },
    { id: "vanvleet", name: "弗雷德·范弗里特", number: "5", position: "后卫", gamesPlayed: 1, value: 2.0, subValue: "拦截 3 次", detail: { points: 17, rebounds: 3, assists: 7, steals: 2, blocks: 0, minutes: 25, fgPct: "54.5%", threePtPct: "62.5%" } },
    { id: "amen", name: "阿门·汤普森", number: "1", position: "后卫", gamesPlayed: 1, value: 2.0, subValue: "全场领防抢断", detail: { points: 14, rebounds: 6, assists: 5, steals: 2, blocks: 1, minutes: 26, fgPct: "66.7%", threePtPct: "0.0%" } },
    { id: "sheppard", name: "里德·谢泼德", number: "15", position: "后卫", gamesPlayed: 1, value: 1.0, subValue: "抢断 1 次", detail: { points: 13, rebounds: 2, assists: 4, steals: 1, blocks: 0, minutes: 20, fgPct: "62.5%", threePtPct: "60.0%" } },
  ]
};
