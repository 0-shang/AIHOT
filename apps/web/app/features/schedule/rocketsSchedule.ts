export interface GameData {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // 北京时间 HH:mm
  opponent: {
    name: string;
    city: string;
    abbr: string;
    color: string;
    logoText: string;
  };
  isHome: boolean;
  arena: string;
  broadcast: string;
  status: "final" | "upcoming" | "live";
  result?: {
    outcome: "W" | "L";
    rocketsScore: number;
    opponentScore: number;
    topPerformer?: {
      name: string;
      stats: string;
    };
    highlights?: string;
  };
}

export const NBA_TEAMS: Record<string, { name: string; city: string; abbr: string; color: string; logoText: string }> = {
  LAL: { name: "湖人", city: "洛杉矶", abbr: "LAL", color: "#552583", logoText: "LAL" },
  GSW: { name: "勇士", city: "金州", abbr: "GSW", color: "#1D428A", logoText: "GSW" },
  DAL: { name: "独行侠", city: "达拉斯", abbr: "DAL", color: "#00538C", logoText: "DAL" },
  SAS: { name: "马刺", city: "圣安东尼奥", abbr: "SAS", color: "#C4CED4", logoText: "SAS" },
  OKC: { name: "雷霆", city: "俄克拉荷马", abbr: "OKC", color: "#007AC1", logoText: "OKC" },
  DEN: { name: "掘金", city: "丹佛", abbr: "DEN", color: "#0E2240", logoText: "DEN" },
  MEM: { name: "灰熊", city: "孟菲斯", abbr: "MEM", color: "#5D76A9", logoText: "MEM" },
  PHX: { name: "太阳", city: "菲尼克斯", abbr: "PHX", color: "#1D1160", logoText: "PHX" },
  LAC: { name: "快船", city: "洛杉矶", abbr: "LAC", color: "#C8102E", logoText: "LAC" },
  NOP: { name: "鹈鹕", city: "新奥尔良", abbr: "NOP", color: "#0C2340", logoText: "NOP" },
  MIN: { name: "森林狼", city: "明尼苏达", abbr: "MIN", color: "#0C2340", logoText: "MIN" },
  BOS: { name: "凯尔特人", city: "波士顿", abbr: "BOS", color: "#007A33", logoText: "BOS" },
  NYK: { name: "尼克斯", city: "纽约", abbr: "NYK", color: "#F58426", logoText: "NYK" },
  MIA: { name: "热火", city: "迈阿密", abbr: "MIA", color: "#98002E", logoText: "MIA" },
  MIL: { name: "雄鹿", city: "密尔沃基", abbr: "MIL", color: "#00471B", logoText: "MIL" },
  PHI: { name: "76人", city: "费城", abbr: "PHI", color: "#006BB6", logoText: "PHI" },
};

export const ROCKETS_GAMES: GameData[] = [
  // 10月季前赛与常规赛开季
  {
    id: "game-pre-1",
    date: "2026-10-06",
    time: "08:00",
    opponent: NBA_TEAMS.MEM,
    isHome: true,
    arena: "丰田中心",
    broadcast: "SCHN",
    status: "final",
    result: {
      outcome: "W",
      rocketsScore: 118,
      opponentScore: 98,
      topPerformer: { name: "杰伦·格林", stats: "21分 4篮板 3助攻" },
      highlights: "格林首节独揽12分，谢泼德替补送出6次助攻，火箭季前赛揭幕战取得大胜。"
    }
  },
  {
    id: "game-pre-2",
    date: "2026-10-10",
    time: "09:00",
    opponent: NBA_TEAMS.OKC,
    isHome: false,
    arena: "切萨皮克能源公司球馆",
    broadcast: "SCHN / NBA TV",
    status: "final",
    result: {
      outcome: "W",
      rocketsScore: 122,
      opponentScore: 113,
      topPerformer: { name: "阿门·汤普森", stats: "18分 9篮板 7助攻 3抢断" },
      highlights: "阿门全能防守锁死亚历山大，火箭关键时刻连续前场篮板锁定客场胜利。"
    }
  },
  {
    id: "game-pre-3",
    date: "2026-10-14",
    time: "08:00",
    opponent: NBA_TEAMS.NOP,
    isHome: true,
    arena: "丰田中心",
    broadcast: "SCHN",
    status: "final",
    result: {
      outcome: "L",
      rocketsScore: 104,
      opponentScore: 110,
      topPerformer: { name: "阿尔佩伦·申京", stats: "19分 12篮板 5助攻" },
      highlights: "末节轮换阵容出现失误，锡安末节连得8分带走比赛。"
    }
  },
  {
    id: "game-pre-4",
    date: "2026-10-18",
    time: "08:30",
    opponent: NBA_TEAMS.SAS,
    isHome: false,
    arena: "AT&T中心",
    broadcast: "SCHN",
    status: "final",
    result: {
      outcome: "W",
      rocketsScore: 115,
      opponentScore: 107,
      topPerformer: { name: "小贾巴里·史密斯", stats: "24分 8篮板 4记三分" },
      highlights: "小贾巴里外线三分手感滚烫，乌度卡战术针对文班亚马内线强攻见效。"
    }
  },
  // 常规赛揭幕战与初期关键赛程
  {
    id: "game-reg-1",
    date: "2026-10-23",
    time: "08:00",
    opponent: NBA_TEAMS.DAL,
    isHome: true,
    arena: "丰田中心",
    broadcast: "ESPN / SCHN",
    status: "final",
    result: {
      outcome: "W",
      rocketsScore: 114,
      opponentScore: 108,
      topPerformer: { name: "杰伦·格林", stats: "32分 6篮板 4助攻" },
      highlights: "常规赛揭幕战德州德比！格林末节独得14分对飙东契奇，范弗里特两罚全中锁定首胜。"
    }
  },
  {
    id: "game-reg-2",
    date: "2026-10-26",
    time: "10:30",
    opponent: NBA_TEAMS.GSW,
    isHome: false,
    arena: "大通中心",
    broadcast: "TNT / NBCS BA",
    status: "final",
    result: {
      outcome: "L",
      rocketsScore: 112,
      opponentScore: 117,
      topPerformer: { name: "阿门·汤普森", stats: "20分 11篮板 8助攻 2盖帽" },
      highlights: "客场苦战加时，库里第四节命中压哨扳平三分，火箭惜败大通中心。"
    }
  },
  {
    id: "game-reg-3",
    date: "2026-10-29",
    time: "08:00",
    opponent: NBA_TEAMS.SAS,
    isHome: true,
    arena: "丰田中心",
    broadcast: "SCHN",
    status: "final",
    result: {
      outcome: "W",
      rocketsScore: 106,
      opponentScore: 101,
      topPerformer: { name: "阿尔佩伦·申京", stats: "25分 14篮板 7助攻" },
      highlights: "申京内线梦幻脚步连打文班，伊森最后10秒抢断快攻暴扣锁定胜利。"
    }
  },
  // 11月赛程
  {
    id: "game-reg-4",
    date: "2026-11-02",
    time: "08:00",
    opponent: NBA_TEAMS.LAL,
    isHome: true,
    arena: "丰田中心",
    broadcast: "ESPN / SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-5",
    date: "2026-11-05",
    time: "09:00",
    opponent: NBA_TEAMS.DEN,
    isHome: false,
    arena: "球馆波尔中心",
    broadcast: "Altitude / SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-6",
    date: "2026-11-08",
    time: "08:00",
    opponent: NBA_TEAMS.LAC,
    isHome: true,
    arena: "丰田中心",
    broadcast: "SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-7",
    date: "2026-11-11",
    time: "10:00",
    opponent: NBA_TEAMS.PHX,
    isHome: false,
    arena: "足迹中心",
    broadcast: "AZFamily / SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-8",
    date: "2026-11-15",
    time: "08:00",
    opponent: NBA_TEAMS.MIN,
    isHome: true,
    arena: "丰田中心",
    broadcast: "SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-9",
    date: "2026-11-18",
    time: "08:30",
    opponent: NBA_TEAMS.BOS,
    isHome: false,
    arena: "TD花园",
    broadcast: "TNT / NBCS Boston",
    status: "upcoming",
  },
  {
    id: "game-reg-10",
    date: "2026-11-22",
    time: "08:00",
    opponent: NBA_TEAMS.MIA,
    isHome: true,
    arena: "丰田中心",
    broadcast: "SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-11",
    date: "2026-11-26",
    time: "09:00",
    opponent: NBA_TEAMS.OKC,
    isHome: false,
    arena: "切萨皮克能源公司球馆",
    broadcast: "NBA TV / SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-12",
    date: "2026-11-29",
    time: "08:00",
    opponent: NBA_TEAMS.NYK,
    isHome: true,
    arena: "丰田中心",
    broadcast: "MSG / SCHN",
    status: "upcoming",
  },
  // 12月赛程
  {
    id: "game-reg-13",
    date: "2026-12-03",
    time: "08:00",
    opponent: NBA_TEAMS.DAL,
    isHome: false,
    arena: "美航中心",
    broadcast: "SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-14",
    date: "2026-12-07",
    time: "08:00",
    opponent: NBA_TEAMS.GSW,
    isHome: true,
    arena: "丰田中心",
    broadcast: "ESPN / SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-15",
    date: "2026-12-12",
    time: "09:30",
    opponent: NBA_TEAMS.LAL,
    isHome: false,
    arena: "Crypto.com球馆",
    broadcast: "Spectrum SN / SCHN",
    status: "upcoming",
  },
  {
    id: "game-reg-16",
    date: "2026-12-25",
    time: "09:00",
    opponent: NBA_TEAMS.SAS,
    isHome: true,
    arena: "丰田中心",
    broadcast: "ABC / ESPN 圣诞大战",
    status: "upcoming",
  },
];
