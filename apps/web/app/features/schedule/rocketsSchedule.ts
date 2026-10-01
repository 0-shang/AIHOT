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
  stage: "preseason" | "regular" | "cup"; // 季前赛 / 常规赛 / NBA杯赛
  status: "final" | "upcoming" | "live";
  keyMatchup?: string; // 焦点对位
  previewNotes?: string; // 核心看点
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
  SAS: { name: "马刺", city: "圣安东尼奥", abbr: "SAS", color: "#6c757d", logoText: "SAS" },
  OKC: { name: "雷霆", city: "俄克拉荷马", abbr: "OKC", color: "#007AC1", logoText: "OKC" },
  DEN: { name: "掘金", city: "丹佛", abbr: "DEN", color: "#0E2240", logoText: "DEN" },
  MEM: { name: "灰熊", city: "孟菲斯", abbr: "MEM", color: "#5D76A9", logoText: "MEM" },
  PHX: { name: "太阳", city: "菲尼克斯", abbr: "PHX", color: "#E56020", logoText: "PHX" },
  LAC: { name: "快船", city: "洛杉矶", abbr: "LAC", color: "#C8102E", logoText: "LAC" },
  NOP: { name: "鹈鹕", city: "新奥尔良", abbr: "NOP", color: "#85714D", logoText: "NOP" },
  MIN: { name: "森林狼", city: "明尼苏达", abbr: "MIN", color: "#236192", logoText: "MIN" },
  BOS: { name: "凯尔特人", city: "波士顿", abbr: "BOS", color: "#007A33", logoText: "BOS" },
  NYK: { name: "尼克斯", city: "纽约", abbr: "NYK", color: "#F58426", logoText: "NYK" },
  MIA: { name: "热火", city: "迈阿密", abbr: "MIA", color: "#98002E", logoText: "MIA" },
  MIL: { name: "雄鹿", city: "密尔沃基", abbr: "MIL", color: "#00471B", logoText: "MIL" },
  PHI: { name: "76人", city: "费城", abbr: "PHI", color: "#006BB6", logoText: "PHI" },
  UTA: { name: "爵士", city: "犹他", abbr: "UTA", color: "#002B5C", logoText: "UTA" },
  POR: { name: "开拓者", city: "波特兰", abbr: "POR", color: "#E03A3E", logoText: "POR" },
  SAC: { name: "国王", city: "萨克拉门托", abbr: "SAC", color: "#5A2D81", logoText: "SAC" },
  IND: { name: "步行者", city: "印第安纳", abbr: "IND", color: "#002D62", logoText: "IND" },
  CHA: { name: "黄蜂", city: "夏洛特", abbr: "CHA", color: "#1D1160", logoText: "CHA" },
  CHI: { name: "公牛", city: "芝加哥", abbr: "CHI", color: "#CE1141", logoText: "CHI" },
  DET: { name: "活塞", city: "底特律", abbr: "DET", color: "#1D42BA", logoText: "DET" },
  TOR: { name: "猛龙", city: "多伦多", abbr: "TOR", color: "#CE1141", logoText: "TOR" },
};

export const ROCKETS_GAMES: GameData[] = [
  // ─── 2026年 10月：季前赛热身与常规赛揭幕战 ───
  {
    id: "game-2026-10-05",
    date: "2026-10-05",
    time: "08:00",
    opponent: NBA_TEAMS.MEM,
    isHome: false,
    arena: "联邦快递球馆 (FedExForum)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "preseason",
    status: "upcoming",
    keyMatchup: "阿门·汤普森 vs 贾·莫兰特",
    previewNotes: "2026-27 赛季首场季前赛热身，乌度卡调试年轻轮换阵容与外线防守施压。"
  },
  {
    id: "game-2026-10-09",
    date: "2026-10-09",
    time: "20:00",
    opponent: NBA_TEAMS.DAL,
    isHome: false,
    arena: "中国澳门 · 威尼斯人金光综艺馆",
    broadcast: "CCTV5 / 腾讯体育 / 咪咕视频 / SCHN / NBA TV",
    stage: "cup",
    status: "upcoming",
    keyMatchup: "杰伦·格林 & 阿门·汤普森 vs 卢卡·东契奇 & 凯里·欧文",
    previewNotes: "🇲🇴🔥【NBA 澳门赛 G1】休斯敦火箭空降中国澳门！黄金档黄金时间 20:00 开球，中国球迷家门口见证得州死敌巅峰对决！"
  },
  {
    id: "game-2026-10-11",
    date: "2026-10-11",
    time: "19:30",
    opponent: NBA_TEAMS.DAL,
    isHome: true,
    arena: "中国澳门 · 威尼斯人金光综艺馆",
    broadcast: "CCTV5 / 腾讯体育 / 咪咕视频 / SCHN / NBA TV",
    stage: "cup",
    status: "upcoming",
    keyMatchup: "阿尔佩伦·申京 vs 莱夫利 & 加福德",
    previewNotes: "🇲🇴🔥【NBA 澳门赛 G2 决战】澳门站收官二番战！申京全能策应碰撞独行侠内线双塔，乌度卡演练决胜终结阵容！"
  },
  {
    id: "game-2026-10-15",
    date: "2026-10-15",
    time: "08:00",
    opponent: NBA_TEAMS.NOP,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "preseason",
    status: "upcoming",
    keyMatchup: "小贾巴里·史密斯 vs 锡安·威廉森",
    previewNotes: "结束澳门赛返美主场季前赛，史密斯与亚当斯联手镇守篮下禁区。"
  },
  {
    id: "game-2026-10-18",
    date: "2026-10-18",
    time: "08:00",
    opponent: NBA_TEAMS.SAS,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "preseason",
    status: "upcoming",
    keyMatchup: "阿尔佩伦·申京 vs 维克托·文班亚马",
    previewNotes: "季前赛收官战得州内战，乌度卡调试常规赛首发五虎，文班亚马与申京技术流对决引爆关注。"
  },
  {
    id: "game-2026-10-24",
    date: "2026-10-24",
    time: "08:00",
    opponent: NBA_TEAMS.CHA,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN / ESPN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "阿门·汤普森 vs 拉梅洛·鲍尔",
    previewNotes: "🔥【2026-27 常规赛揭幕战】火箭坐镇主场迎来新赛季开门红之战，全主力阵容正式出击冲刺开门红！"
  },
  {
    id: "game-2026-10-26",
    date: "2026-10-26",
    time: "08:30",
    opponent: NBA_TEAMS.MEM,
    isHome: false,
    arena: "联邦快递球馆 (FedExForum)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "杰伦·格林 vs 戴斯蒙德·贝恩",
    previewNotes: "新赛季常规赛客场首秀，西南赛区宿敌碰撞，后卫线攻防节奏转换决定比赛走势。"
  },
  {
    id: "game-2026-10-28",
    date: "2026-10-28",
    time: "08:00",
    opponent: NBA_TEAMS.SAS,
    isHome: false,
    arena: "弗罗斯特银行中心 (Frost Bank Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "塔里·伊森 vs 索汉",
    previewNotes: "圣安东尼奥客场硬仗，锋线换防对位绞杀，双方将在防守端展开高强度拉锯。"
  },
  {
    id: "game-2026-10-31",
    date: "2026-10-31",
    time: "08:30",
    opponent: NBA_TEAMS.DAL,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN / TNT",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "狄龙·布鲁克斯 vs 卢卡·东契奇",
    previewNotes: "万圣节焦点战！全美直播得州顶级德比，乌度卡防守策略能否遏制东欧组合全场挡拆。"
  },

  // ─── 2026年 11月：常规赛深入 + Emirates NBA Cup 锦标赛 ───
  {
    id: "game-2026-11-03",
    date: "2026-11-03",
    time: "09:00",
    opponent: NBA_TEAMS.GSW,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "范弗里特 vs 斯蒂芬·库里",
    previewNotes: "宿敌再聚首！火箭主场面对勇士外线传切风暴，考验年轻外线防守专注度与退防速度。"
  },
  {
    id: "game-2026-11-05",
    date: "2026-11-05",
    time: "09:00",
    opponent: NBA_TEAMS.NYK,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "阿尔佩伦·申京 vs 卡尔-安东尼·唐斯",
    previewNotes: "全明星级别内线直接交火，申京低位脚步与背身单打挑战尼克斯重组内线防线。"
  },
  {
    id: "game-2026-11-07",
    date: "2026-11-07",
    time: "09:00",
    opponent: NBA_TEAMS.SAS,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "小贾巴里·史密斯 vs 维克托·文班亚马",
    previewNotes: "10天内两队第二次常规赛交手，双方彼此毫无秘密，胜负看临场替补轮换调整。"
  },
  {
    id: "game-2026-11-09",
    date: "2026-11-09",
    time: "09:00",
    opponent: NBA_TEAMS.OKC,
    isHome: false,
    arena: "佩康中心 (Paycom Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "杰伦·格林 vs 切特·霍姆格伦",
    previewNotes: "客场背靠背艰难战役，面对雷霆极高攻防效率，火箭必须保护好后场篮板降低失误。"
  },
  {
    id: "game-2026-11-13",
    date: "2026-11-13",
    time: "09:00",
    opponent: NBA_TEAMS.LAC,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN / ESPN",
    stage: "cup",
    status: "upcoming",
    keyMatchup: "塔里·伊森 vs 科怀·伦纳德",
    previewNotes: "🏆【Emirates NBA Cup 季中锦标赛小组赛首战】定制球场亮相，关乎小组头名出线资格的必争之战！"
  },
  {
    id: "game-2026-11-16",
    date: "2026-11-16",
    time: "09:00",
    opponent: NBA_TEAMS.LAC,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "范弗里特 vs 詹姆斯·哈登",
    previewNotes: "连战快船第二场，哈登重回休斯敦丰田中心，主场球迷与年轻后场双向检阅。"
  },
  {
    id: "game-2026-11-19",
    date: "2026-11-19",
    time: "09:00",
    opponent: NBA_TEAMS.MIL,
    isHome: false,
    arena: "第一塞尔夫论坛球馆 (Fiserv Forum)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "小贾巴里·史密斯 vs 扬尼斯·阿德托昆博",
    previewNotes: "东部客场魔鬼赛程，面对字母哥大步冲击禁区，火箭内线群建立防空围剿防线。"
  },
  {
    id: "game-2026-11-21",
    date: "2026-11-21",
    time: "09:00",
    opponent: NBA_TEAMS.IND,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "阿门·汤普森 vs 泰瑞斯·哈利伯顿",
    previewNotes: "极致防守体系对战全联盟最快进攻节奏，火箭能否将比赛拖入半场阵地战成胜负手。"
  },
  {
    id: "game-2026-11-23",
    date: "2026-11-23",
    time: "09:00",
    opponent: NBA_TEAMS.POR,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "cup",
    status: "upcoming",
    keyMatchup: "里德·谢泼德 vs 斯科特·亨德森",
    previewNotes: "🏆【Emirates NBA Cup 季中锦标赛小组赛第二场】高顺位控卫正面对碰，火箭剑指杯赛小组连胜。"
  },
  {
    id: "game-2026-11-27",
    date: "2026-11-27",
    time: "09:00",
    opponent: NBA_TEAMS.MIN,
    isHome: false,
    arena: "标靶中心 (Target Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN / TNT",
    stage: "cup",
    status: "upcoming",
    keyMatchup: "杰伦·格林 vs 安东尼·爱德华兹",
    previewNotes: "🏆【Emirates NBA Cup 锦标赛生死出线战】客场挑战森林狼双塔，格林与华子顶峰分卫对决！"
  },
  {
    id: "game-2026-11-29",
    date: "2026-11-29",
    time: "09:00",
    opponent: NBA_TEAMS.PHI,
    isHome: false,
    arena: "富国银行中心 (Wells Fargo Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "阿尔佩伦·申京 vs 乔尔·恩比德",
    previewNotes: "感恩节客场征程，面对顶级中锋的进攻技巧，火箭内线犯规控制至关重要。"
  },

  // ─── 2026年 12月：年终大战与圣诞巅峰对决 ───
  {
    id: "game-2026-12-02",
    date: "2026-12-02",
    time: "09:00",
    opponent: NBA_TEAMS.OKC,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "申京 vs 霍姆格伦",
    previewNotes: "12月首战坐镇主场，西部榜首争夺战关键卡位战，全队攻防节奏迎大考。"
  },
  {
    id: "game-2026-12-06",
    date: "2026-12-06",
    time: "11:00",
    opponent: NBA_TEAMS.GSW,
    isHome: false,
    arena: "大通中心 (Chase Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN / ESPN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "狄龙·布鲁克斯 vs 库里",
    previewNotes: "周六黄金档旧金山客场之战，全美关注焦点，火箭防守群能否持续压迫大通中心主场声浪。"
  },
  {
    id: "game-2026-12-09",
    date: "2026-12-09",
    time: "09:00",
    opponent: NBA_TEAMS.DEN,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "阿尔佩伦·申京 vs 尼古拉·约基奇",
    previewNotes: "🔥【重磅中锋教学局】“小约基奇”申京正面对话两届 MVP 约基奇，高位发牌与禁区终结技艺全面对决！"
  },
  {
    id: "game-2026-12-16",
    date: "2026-12-16",
    time: "10:00",
    opponent: NBA_TEAMS.LAC,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "杰伦·格林 vs 诺曼·鲍威尔",
    previewNotes: "主场迎战快船，两队本赛季第三度相逢，防守针对性与转换快攻将决定比分差距。"
  },
  {
    id: "game-2026-12-20",
    date: "2026-12-20",
    time: "09:00",
    opponent: NBA_TEAMS.NOP,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "阿门·汤普森 vs 赫伯特·琼斯",
    previewNotes: "全联盟最窒息外线防守者正面角力，双方拼抢每一个地板球与反击球权。"
  },
  {
    id: "game-2026-12-23",
    date: "2026-12-23",
    time: "09:00",
    opponent: NBA_TEAMS.TOR,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "小贾巴里·史密斯 vs 斯科蒂·巴恩斯",
    previewNotes: "全能前锋对飙，史密斯外线高炮台与巴恩斯全能突击交相辉映。"
  },
  {
    id: "game-2026-12-26",
    date: "2026-12-26",
    time: "09:00",
    opponent: NBA_TEAMS.LAL,
    isHome: false,
    arena: "Crypto.com 球馆 (Crypto.com Arena)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN / ABC / ESPN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "申京 & 杰伦·格林 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
    previewNotes: "⭐🎄【NBA 圣诞大战年终盛宴】火箭重回全美圣诞大战黄金档！洛杉矶湖人主场，新老两代球星巅峰对话！"
  },
  {
    id: "game-2026-12-28",
    date: "2026-12-28",
    time: "09:00",
    opponent: NBA_TEAMS.PHX,
    isHome: false,
    arena: "足迹中心 (Footprint Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "狄龙·布鲁克斯 vs 凯文·杜兰特",
    previewNotes: "客场西征第二站，狄龙与杜兰特的经典攻防对峙，全场高对抗强度。"
  },
  {
    id: "game-2026-12-30",
    date: "2026-12-30",
    time: "09:00",
    opponent: NBA_TEAMS.UTA,
    isHome: true,
    arena: "丰田中心 (Toyota Center)",
    broadcast: "腾讯体育 / 咪咕视频 / SCHN",
    stage: "regular",
    status: "upcoming",
    keyMatchup: "范弗里特 vs 塞克斯顿",
    previewNotes: "2026 岁末封年之战，火箭坐镇丰田中心主场，力争用胜利为 2026 年画上完美句号！"
  }
];
