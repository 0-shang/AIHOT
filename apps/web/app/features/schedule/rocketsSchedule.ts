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

export const NBA_TEAMS: Record<string, { name: string; city: string; abbr: string; color: string; logoText: string; star?: string }> = {
  "DAL": {
    "name": "独行侠",
    "city": "达拉斯",
    "abbr": "DAL",
    "color": "#00538C",
    "logoText": "DAL",
    "star": "东契奇 / 欧文"
  },
  "SA": {
    "name": "马刺",
    "city": "圣安东尼奥",
    "abbr": "SAS",
    "color": "#6c757d",
    "logoText": "SAS",
    "star": "文班亚马 / 保罗"
  },
  "SAS": {
    "name": "马刺",
    "city": "圣安东尼奥",
    "abbr": "SAS",
    "color": "#6c757d",
    "logoText": "SAS",
    "star": "文班亚马 / 保罗"
  },
  "ATL": {
    "name": "老鹰",
    "city": "亚特兰大",
    "abbr": "ATL",
    "color": "#C8102E",
    "logoText": "ATL",
    "star": "特雷·杨"
  },
  "MIL": {
    "name": "雄鹿",
    "city": "密尔沃基",
    "abbr": "MIL",
    "color": "#00471B",
    "logoText": "MIL",
    "star": "字母哥 / 利拉德"
  },
  "OKC": {
    "name": "雷霆",
    "city": "俄克拉荷马",
    "abbr": "OKC",
    "color": "#007AC1",
    "logoText": "OKC",
    "star": "亚历山大 / 切特"
  },
  "BOS": {
    "name": "凯尔特人",
    "city": "波士顿",
    "abbr": "BOS",
    "color": "#007A33",
    "logoText": "BOS",
    "star": "塔图姆 / 布朗"
  },
  "MIN": {
    "name": "森林狼",
    "city": "明尼苏达",
    "abbr": "MIN",
    "color": "#236192",
    "logoText": "MIN",
    "star": "爱德华兹 / 兰德尔"
  },
  "PHX": {
    "name": "太阳",
    "city": "菲尼克斯",
    "abbr": "PHX",
    "color": "#E56020",
    "logoText": "PHX",
    "star": "布克 / 比尔"
  },
  "DEN": {
    "name": "掘金",
    "city": "丹佛",
    "abbr": "DEN",
    "color": "#0E2240",
    "logoText": "DEN",
    "star": "约基奇 / 穆雷"
  },
  "GS": {
    "name": "勇士",
    "city": "金州",
    "abbr": "GSW",
    "color": "#1D428A",
    "logoText": "GSW",
    "star": "斯蒂芬·库里"
  },
  "GSW": {
    "name": "勇士",
    "city": "金州",
    "abbr": "GSW",
    "color": "#1D428A",
    "logoText": "GSW",
    "star": "斯蒂芬·库里"
  },
  "UTAH": {
    "name": "爵士",
    "city": "犹他",
    "abbr": "UTA",
    "color": "#002B5C",
    "logoText": "UTA",
    "star": "马尔卡宁"
  },
  "UTA": {
    "name": "爵士",
    "city": "犹他",
    "abbr": "UTA",
    "color": "#002B5C",
    "logoText": "UTA",
    "star": "马尔卡宁"
  },
  "WSH": {
    "name": "奇才",
    "city": "华盛顿",
    "abbr": "WAS",
    "color": "#002B5C",
    "logoText": "WAS",
    "star": "萨尔 / 普尔"
  },
  "WAS": {
    "name": "奇才",
    "city": "华盛顿",
    "abbr": "WAS",
    "color": "#002B5C",
    "logoText": "WAS",
    "star": "萨尔 / 普尔"
  },
  "MIA": {
    "name": "热火",
    "city": "迈阿密",
    "abbr": "MIA",
    "color": "#98002E",
    "logoText": "MIA",
    "star": "巴特勒 / 阿德巴约"
  },
  "IND": {
    "name": "步行者",
    "city": "印第安纳",
    "abbr": "IND",
    "color": "#002D62",
    "logoText": "IND",
    "star": "哈利伯顿 / 西亚卡姆"
  },
  "LAC": {
    "name": "快船",
    "city": "洛杉矶",
    "abbr": "LAC",
    "color": "#C8102E",
    "logoText": "LAC",
    "star": "哈登 / 莱昂纳德"
  },
  "LAL": {
    "name": "湖人",
    "city": "洛杉矶",
    "abbr": "LAL",
    "color": "#552583",
    "logoText": "LAL",
    "star": "勒布朗 / 浓眉"
  },
  "POR": {
    "name": "开拓者",
    "city": "波特兰",
    "abbr": "POR",
    "color": "#E03A3E",
    "logoText": "POR",
    "star": "亨德森 / 西蒙斯"
  },
  "SAC": {
    "name": "国王",
    "city": "萨克拉门托",
    "abbr": "SAC",
    "color": "#5A2D81",
    "logoText": "SAC",
    "star": "福克斯 / 萨博尼斯"
  },
  "MEM": {
    "name": "灰熊",
    "city": "孟菲斯",
    "abbr": "MEM",
    "color": "#5D76A9",
    "logoText": "MEM",
    "star": "莫兰特 / 贝恩"
  },
  "NO": {
    "name": "鹈鹕",
    "city": "新奥尔良",
    "abbr": "NOP",
    "color": "#85714D",
    "logoText": "NOP",
    "star": "锡安 / 英格拉姆"
  },
  "NOP": {
    "name": "鹈鹕",
    "city": "新奥尔良",
    "abbr": "NOP",
    "color": "#85714D",
    "logoText": "NOP",
    "star": "锡安 / 英格拉姆"
  },
  "NY": {
    "name": "尼克斯",
    "city": "纽约",
    "abbr": "NYK",
    "color": "#F58426",
    "logoText": "NYK",
    "star": "布伦森 / 唐斯"
  },
  "NYK": {
    "name": "尼克斯",
    "city": "纽约",
    "abbr": "NYK",
    "color": "#F58426",
    "logoText": "NYK",
    "star": "布伦森 / 唐斯"
  },
  "BKN": {
    "name": "篮网",
    "city": "布鲁克林",
    "abbr": "BKN",
    "color": "#000000",
    "logoText": "BKN",
    "star": "托马斯 / 克拉克斯顿"
  },
  "PHI": {
    "name": "76人",
    "city": "费城",
    "abbr": "PHI",
    "color": "#006BB6",
    "logoText": "PHI",
    "star": "恩比德 / 乔治 / 马克西"
  },
  "TOR": {
    "name": "猛龙",
    "city": "多伦多",
    "abbr": "TOR",
    "color": "#CE1141",
    "logoText": "TOR",
    "star": "巴恩斯 / 奎克利"
  },
  "CHI": {
    "name": "公牛",
    "city": "芝加哥",
    "abbr": "CHI",
    "color": "#CE1141",
    "logoText": "CHI",
    "star": "拉文 / 武切维奇"
  },
  "CLE": {
    "name": "骑士",
    "city": "克利夫兰",
    "abbr": "CLE",
    "color": "#860038",
    "logoText": "CLE",
    "star": "米切尔 / 加兰 / 莫布利"
  },
  "DET": {
    "name": "活塞",
    "city": "底特律",
    "abbr": "DET",
    "color": "#1D42BA",
    "logoText": "DET",
    "star": "康宁汉姆"
  },
  "ORL": {
    "name": "魔术",
    "city": "奥兰多",
    "abbr": "ORL",
    "color": "#0077C0",
    "logoText": "ORL",
    "star": "班凯罗 / 瓦格纳"
  },
  "CHA": {
    "name": "黄蜂",
    "city": "夏洛特",
    "abbr": "CHA",
    "color": "#1D1160",
    "logoText": "CHA",
    "star": "三球鲍尔 / 米勒"
  }
};

export const ROCKETS_GAMES: GameData[] = [
  {
    "id": "401898395",
    "date": "2026-10-09",
    "time": "20:00",
    "opponent": {
      "name": "独行侠",
      "city": "达拉斯",
      "abbr": "DAL",
      "color": "#00538C",
      "logoText": "DAL"
    },
    "isHome": false,
    "arena": "中国澳门·威尼斯人金光综艺馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "preseason",
    "status": "final",
    "keyMatchup": "杜兰特 & 申京 vs 东契奇 & 欧文",
    "previewNotes": "NBA 澳门赛首战，威尼斯人金光综艺馆全场爆满，杜兰特火箭正式首秀战宿敌独行侠！",
    "result": {
      "outcome": "W",
      "rocketsScore": 135,
      "opponentScore": 117,
      "topPerformer": {
        "name": "阿尔佩伦·申京",
        "stats": "16分 10篮板 10助攻 (三双)"
      },
      "highlights": "伊森狂砍20分7板3断，申京轻取三双，范弗里特5记三分，火箭末节一波流135-117大胜独行侠！"
    }
  },
  {
    "id": "401898400",
    "date": "2026-10-11",
    "time": "18:00",
    "opponent": {
      "name": "独行侠",
      "city": "达拉斯",
      "abbr": "DAL",
      "color": "#00538C",
      "logoText": "DAL"
    },
    "isHome": true,
    "arena": "中国澳门·威尼斯人金光综艺馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "preseason",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 & 谢泼德 vs 独行侠后场",
    "previewNotes": "澳门赛第二战焦点二番对决，乌度卡检验轮换深度与外线防守夹击策略。"
  },
  {
    "id": "401908622",
    "date": "2026-10-16",
    "time": "08:30",
    "opponent": {
      "name": "雷霆",
      "city": "俄克拉荷马",
      "abbr": "OKC",
      "color": "#007AC1",
      "logoText": "OKC"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "preseason",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
    "previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
  },
  {
    "id": "401909840",
    "date": "2026-10-22",
    "time": "08:30",
    "opponent": {
      "name": "独行侠",
      "city": "达拉斯",
      "abbr": "DAL",
      "color": "#00538C",
      "logoText": "DAL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
    "previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
  },
  {
    "id": "401909096",
    "date": "2026-10-24",
    "time": "09:30",
    "opponent": {
      "name": "马刺",
      "city": "圣安东尼奥",
      "abbr": "SAS",
      "color": "#6c757d",
      "logoText": "SAS"
    },
    "isHome": false,
    "arena": "奥斯汀·穆迪中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
    "previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
  },
  {
    "id": "401909856",
    "date": "2026-10-25",
    "time": "08:00",
    "opponent": {
      "name": "老鹰",
      "city": "亚特兰大",
      "abbr": "ATL",
      "color": "#C8102E",
      "logoText": "ATL"
    },
    "isHome": false,
    "arena": "亚特兰大·州立农业球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 特雷·杨",
    "previewNotes": "客场挑战亚特兰大老鹰，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401909874",
    "date": "2026-10-27",
    "time": "08:30",
    "opponent": {
      "name": "老鹰",
      "city": "亚特兰大",
      "abbr": "ATL",
      "color": "#C8102E",
      "logoText": "ATL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 特雷·杨",
    "previewNotes": "主场迎战亚特兰大老鹰，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401909887",
    "date": "2026-10-29",
    "time": "08:00",
    "opponent": {
      "name": "雄鹿",
      "city": "密尔沃基",
      "abbr": "MIL",
      "color": "#00471B",
      "logoText": "MIL"
    },
    "isHome": false,
    "arena": "密尔沃基·第一服务广场",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 字母哥阿德托昆博 & 利拉德",
    "previewNotes": "休斯敦内线筑起禁区长城对抗希腊怪兽，外线遏制利拉德超远三分。"
  },
  {
    "id": "401909283",
    "date": "2026-10-31",
    "time": "08:00",
    "opponent": {
      "name": "独行侠",
      "city": "达拉斯",
      "abbr": "DAL",
      "color": "#00538C",
      "logoText": "DAL"
    },
    "isHome": false,
    "arena": "达拉斯·美航中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "cup",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
    "previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
  },
  {
    "id": "401909902",
    "date": "2026-11-01",
    "time": "08:30",
    "opponent": {
      "name": "雷霆",
      "city": "俄克拉荷马",
      "abbr": "OKC",
      "color": "#007AC1",
      "logoText": "OKC"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
    "previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
  },
  {
    "id": "401909916",
    "date": "2026-11-03",
    "time": "09:30",
    "opponent": {
      "name": "凯尔特人",
      "city": "波士顿",
      "abbr": "BOS",
      "color": "#007A33",
      "logoText": "BOS"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 伊森 vs 杰森·塔图姆 & 杰伦·布朗",
    "previewNotes": "总冠军级别锋线大对抗，乌度卡战术针对老东家凯尔特人。"
  },
  {
    "id": "401909930",
    "date": "2026-11-05",
    "time": "09:30",
    "opponent": {
      "name": "森林狼",
      "city": "明尼苏达",
      "abbr": "MIN",
      "color": "#236192",
      "logoText": "MIN"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
    "previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
  },
  {
    "id": "401909943",
    "date": "2026-11-08",
    "time": "10:00",
    "opponent": {
      "name": "太阳",
      "city": "菲尼克斯",
      "abbr": "PHX",
      "color": "#E56020",
      "logoText": "PHX"
    },
    "isHome": false,
    "arena": "菲尼克斯·足迹中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "凯文·杜兰特 vs 德文·布克 & 布拉德利·比尔",
    "previewNotes": "杜兰特大交易后迎战老东家太阳！火箭新体系攻防成色全方位检验。"
  },
  {
    "id": "401909957",
    "date": "2026-11-10",
    "time": "09:30",
    "opponent": {
      "name": "掘金",
      "city": "丹佛",
      "abbr": "DEN",
      "color": "#0E2240",
      "logoText": "DEN"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 尼古拉·约基奇",
    "previewNotes": "顶级欧洲高位策应中锋大师课！申京再度向MVP约基奇发起正面对话。"
  },
  {
    "id": "401909974",
    "date": "2026-11-12",
    "time": "10:30",
    "opponent": {
      "name": "勇士",
      "city": "金州",
      "abbr": "GSW",
      "color": "#1D428A",
      "logoText": "GSW"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
    "previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
  },
  {
    "id": "401909301",
    "date": "2026-11-14",
    "time": "09:30",
    "opponent": {
      "name": "爵士",
      "city": "犹他",
      "abbr": "UTA",
      "color": "#002B5C",
      "logoText": "UTA"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "cup",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
    "previewNotes": "NBA 杯小组赛关键排位战！净胜分关键局，火箭全力出击冲击淘汰赛。"
  },
  {
    "id": "401909991",
    "date": "2026-11-16",
    "time": "08:00",
    "opponent": {
      "name": "奇才",
      "city": "华盛顿",
      "abbr": "WAS",
      "color": "#002B5C",
      "logoText": "WAS"
    },
    "isHome": false,
    "arena": "华盛顿·第一资本球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 萨尔 / 普尔",
    "previewNotes": "客场挑战华盛顿奇才，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401909998",
    "date": "2026-11-17",
    "time": "08:30",
    "opponent": {
      "name": "热火",
      "city": "迈阿密",
      "abbr": "MIA",
      "color": "#98002E",
      "logoText": "MIA"
    },
    "isHome": false,
    "arena": "迈阿密·卡塞亚中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 巴特勒 / 阿德巴约",
    "previewNotes": "客场挑战迈阿密热火，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910008",
    "date": "2026-11-19",
    "time": "08:00",
    "opponent": {
      "name": "步行者",
      "city": "印第安纳",
      "abbr": "IND",
      "color": "#002D62",
      "logoText": "IND"
    },
    "isHome": false,
    "arena": "印第安纳·甘布里奇球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 哈利伯顿 / 西亚卡姆",
    "previewNotes": "客场挑战印第安纳步行者，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401909312",
    "date": "2026-11-21",
    "time": "11:00",
    "opponent": {
      "name": "掘金",
      "city": "丹佛",
      "abbr": "DEN",
      "color": "#0E2240",
      "logoText": "DEN"
    },
    "isHome": false,
    "arena": "丹佛·波尔球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "cup",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 尼古拉·约基奇",
    "previewNotes": "顶级欧洲高位策应中锋大师课！申京再度向MVP约基奇发起正面对话。"
  },
  {
    "id": "401910043",
    "date": "2026-11-24",
    "time": "09:30",
    "opponent": {
      "name": "快船",
      "city": "洛杉矶",
      "abbr": "LAC",
      "color": "#C8102E",
      "logoText": "LAC"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 哈登 / 莱昂纳德",
    "previewNotes": "主场迎战洛杉矶快船，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401909323",
    "date": "2026-11-26",
    "time": "09:30",
    "opponent": {
      "name": "太阳",
      "city": "菲尼克斯",
      "abbr": "PHX",
      "color": "#E56020",
      "logoText": "PHX"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "cup",
    "status": "upcoming",
    "keyMatchup": "凯文·杜兰特 vs 德文·布克 & 布拉德利·比尔",
    "previewNotes": "杜兰特大交易后迎战老东家太阳！火箭新体系攻防成色全方位检验。"
  },
  {
    "id": "401910050",
    "date": "2026-11-29",
    "time": "09:30",
    "opponent": {
      "name": "76人",
      "city": "费城",
      "abbr": "PHI",
      "color": "#006BB6",
      "logoText": "PHI"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "申京 & 亚当斯 vs 乔尔·恩比德",
    "previewNotes": "内线肉搏战！火箭双中锋轮番消耗恩比德，防守端切断外线马克西传接。"
  },
  {
    "id": "401910064",
    "date": "2026-12-01",
    "time": "08:30",
    "opponent": {
      "name": "湖人",
      "city": "洛杉矶",
      "abbr": "LAL",
      "color": "#552583",
      "logoText": "LAL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
    "previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
  },
  {
    "id": "401910072",
    "date": "2026-12-02",
    "time": "09:30",
    "opponent": {
      "name": "猛龙",
      "city": "多伦多",
      "abbr": "TOR",
      "color": "#CE1141",
      "logoText": "TOR"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 巴恩斯 / 奎克利",
    "previewNotes": "主场迎战多伦多猛龙，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910101",
    "date": "2026-12-14",
    "time": "07:00",
    "opponent": {
      "name": "公牛",
      "city": "芝加哥",
      "abbr": "CHI",
      "color": "#CE1141",
      "logoText": "CHI"
    },
    "isHome": false,
    "arena": "芝加哥·联合中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 拉文 / 武切维奇",
    "previewNotes": "客场挑战芝加哥公牛，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910111",
    "date": "2026-12-15",
    "time": "09:30",
    "opponent": {
      "name": "尼克斯",
      "city": "纽约",
      "abbr": "NYK",
      "color": "#F58426",
      "logoText": "NYK"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 布伦森 / 唐斯",
    "previewNotes": "主场迎战纽约尼克斯，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910128",
    "date": "2026-12-17",
    "time": "09:30",
    "opponent": {
      "name": "雄鹿",
      "city": "密尔沃基",
      "abbr": "MIL",
      "color": "#00471B",
      "logoText": "MIL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 字母哥阿德托昆博 & 利拉德",
    "previewNotes": "休斯敦内线筑起禁区长城对抗希腊怪兽，外线遏制利拉德超远三分。"
  },
  {
    "id": "401910140",
    "date": "2026-12-19",
    "time": "09:00",
    "opponent": {
      "name": "灰熊",
      "city": "孟菲斯",
      "abbr": "MEM",
      "color": "#5D76A9",
      "logoText": "MEM"
    },
    "isHome": false,
    "arena": "孟菲斯·联邦快递球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
    "previewNotes": "客场挑战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910150",
    "date": "2026-12-21",
    "time": "04:30",
    "opponent": {
      "name": "猛龙",
      "city": "多伦多",
      "abbr": "TOR",
      "color": "#CE1141",
      "logoText": "TOR"
    },
    "isHome": false,
    "arena": "多伦多·丰业银行体育馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 巴恩斯 / 奎克利",
    "previewNotes": "客场挑战多伦多猛龙，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910179",
    "date": "2026-12-24",
    "time": "08:30",
    "opponent": {
      "name": "76人",
      "city": "费城",
      "abbr": "PHI",
      "color": "#006BB6",
      "logoText": "PHI"
    },
    "isHome": false,
    "arena": "费城·富国银行中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "申京 & 亚当斯 vs 乔尔·恩比德",
    "previewNotes": "内线肉搏战！火箭双中锋轮番消耗恩比德，防守端切断外线马克西传接。"
  },
  {
    "id": "401910195",
    "date": "2026-12-28",
    "time": "04:30",
    "opponent": {
      "name": "雷霆",
      "city": "俄克拉荷马",
      "abbr": "OKC",
      "color": "#007AC1",
      "logoText": "OKC"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
    "previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
  },
  {
    "id": "401910219",
    "date": "2026-12-30",
    "time": "11:30",
    "opponent": {
      "name": "湖人",
      "city": "洛杉矶",
      "abbr": "LAL",
      "color": "#552583",
      "logoText": "LAL"
    },
    "isHome": false,
    "arena": "洛杉矶·加密网球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
    "previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
  },
  {
    "id": "401910225",
    "date": "2026-12-31",
    "time": "11:00",
    "opponent": {
      "name": "勇士",
      "city": "金州",
      "abbr": "GSW",
      "color": "#1D428A",
      "logoText": "GSW"
    },
    "isHome": false,
    "arena": "旧金山·大通中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
    "previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
  },
  {
    "id": "401910239",
    "date": "2027-01-02",
    "time": "09:30",
    "opponent": {
      "name": "独行侠",
      "city": "达拉斯",
      "abbr": "DAL",
      "color": "#00538C",
      "logoText": "DAL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
    "previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
  },
  {
    "id": "401910256",
    "date": "2027-01-04",
    "time": "08:00",
    "opponent": {
      "name": "骑士",
      "city": "克利夫兰",
      "abbr": "CLE",
      "color": "#860038",
      "logoText": "CLE"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 米切尔 / 加兰 / 莫布利",
    "previewNotes": "主场迎战克利夫兰骑士，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910271",
    "date": "2027-01-06",
    "time": "09:00",
    "opponent": {
      "name": "森林狼",
      "city": "明尼苏达",
      "abbr": "MIN",
      "color": "#236192",
      "logoText": "MIN"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
    "previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
  },
  {
    "id": "401910287",
    "date": "2027-01-08",
    "time": "09:30",
    "opponent": {
      "name": "灰熊",
      "city": "孟菲斯",
      "abbr": "MEM",
      "color": "#5D76A9",
      "logoText": "MEM"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
    "previewNotes": "主场迎战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910300",
    "date": "2027-01-10",
    "time": "07:00",
    "opponent": {
      "name": "篮网",
      "city": "布鲁克林",
      "abbr": "BKN",
      "color": "#000000",
      "logoText": "BKN"
    },
    "isHome": false,
    "arena": "布鲁克林·巴克莱中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 托马斯 / 克拉克斯顿",
    "previewNotes": "客场挑战布鲁克林篮网，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910315",
    "date": "2027-01-12",
    "time": "08:30",
    "opponent": {
      "name": "凯尔特人",
      "city": "波士顿",
      "abbr": "BOS",
      "color": "#007A33",
      "logoText": "BOS"
    },
    "isHome": false,
    "arena": "波士顿·TD花园球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 伊森 vs 杰森·塔图姆 & 杰伦·布朗",
    "previewNotes": "总冠军级别锋线大对抗，乌度卡战术针对老东家凯尔特人。"
  },
  {
    "id": "401910331",
    "date": "2027-01-14",
    "time": "10:30",
    "opponent": {
      "name": "雷霆",
      "city": "俄克拉荷马",
      "abbr": "OKC",
      "color": "#007AC1",
      "logoText": "OKC"
    },
    "isHome": false,
    "arena": "俄克拉荷马·佩康中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
    "previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
  },
  {
    "id": "401910348",
    "date": "2027-01-16",
    "time": "09:30",
    "opponent": {
      "name": "奇才",
      "city": "华盛顿",
      "abbr": "WAS",
      "color": "#002B5C",
      "logoText": "WAS"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 萨尔 / 普尔",
    "previewNotes": "主场迎战华盛顿奇才，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910355",
    "date": "2027-01-17",
    "time": "09:30",
    "opponent": {
      "name": "活塞",
      "city": "底特律",
      "abbr": "DET",
      "color": "#1D42BA",
      "logoText": "DET"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 康宁汉姆",
    "previewNotes": "主场迎战底特律活塞，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401909476",
    "date": "2027-01-19",
    "time": "08:30",
    "opponent": {
      "name": "灰熊",
      "city": "孟菲斯",
      "abbr": "MEM",
      "color": "#5D76A9",
      "logoText": "MEM"
    },
    "isHome": false,
    "arena": "孟菲斯·联邦快递球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
    "previewNotes": "客场挑战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910379",
    "date": "2027-01-21",
    "time": "09:00",
    "opponent": {
      "name": "森林狼",
      "city": "明尼苏达",
      "abbr": "MIN",
      "color": "#236192",
      "logoText": "MIN"
    },
    "isHome": false,
    "arena": "明尼阿波利斯·标靶中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
    "previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
  },
  {
    "id": "401910390",
    "date": "2027-01-23",
    "time": "08:00",
    "opponent": {
      "name": "黄蜂",
      "city": "夏洛特",
      "abbr": "CHA",
      "color": "#1D1160",
      "logoText": "CHA"
    },
    "isHome": false,
    "arena": "夏洛特·光谱中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 三球鲍尔 / 米勒",
    "previewNotes": "客场挑战夏洛特黄蜂，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910410",
    "date": "2027-01-25",
    "time": "07:00",
    "opponent": {
      "name": "魔术",
      "city": "奥兰多",
      "abbr": "ORL",
      "color": "#0077C0",
      "logoText": "ORL"
    },
    "isHome": false,
    "arena": "奥兰多·起亚中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 班凯罗 / 瓦格纳",
    "previewNotes": "客场挑战奥兰多魔术，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910424",
    "date": "2027-01-27",
    "time": "09:00",
    "opponent": {
      "name": "马刺",
      "city": "圣安东尼奥",
      "abbr": "SAS",
      "color": "#6c757d",
      "logoText": "SAS"
    },
    "isHome": false,
    "arena": "圣安东尼奥·弗罗斯特银行中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
    "previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
  },
  {
    "id": "401910434",
    "date": "2027-01-28",
    "time": "09:30",
    "opponent": {
      "name": "鹈鹕",
      "city": "新奥尔良",
      "abbr": "NOP",
      "color": "#85714D",
      "logoText": "NOP"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
    "previewNotes": "主场迎战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910449",
    "date": "2027-01-30",
    "time": "09:30",
    "opponent": {
      "name": "魔术",
      "city": "奥兰多",
      "abbr": "ORL",
      "color": "#0077C0",
      "logoText": "ORL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 班凯罗 / 瓦格纳",
    "previewNotes": "主场迎战奥兰多魔术，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910466",
    "date": "2027-02-01",
    "time": "09:30",
    "opponent": {
      "name": "独行侠",
      "city": "达拉斯",
      "abbr": "DAL",
      "color": "#00538C",
      "logoText": "DAL"
    },
    "isHome": false,
    "arena": "达拉斯·美航中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
    "previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
  },
  {
    "id": "401910486",
    "date": "2027-02-04",
    "time": "10:30",
    "opponent": {
      "name": "爵士",
      "city": "犹他",
      "abbr": "UTA",
      "color": "#002B5C",
      "logoText": "UTA"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
    "previewNotes": "主场迎战犹他爵士，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910502",
    "date": "2027-02-06",
    "time": "10:00",
    "opponent": {
      "name": "太阳",
      "city": "菲尼克斯",
      "abbr": "PHX",
      "color": "#E56020",
      "logoText": "PHX"
    },
    "isHome": false,
    "arena": "菲尼克斯·足迹中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "凯文·杜兰特 vs 德文·布克 & 布拉德利·比尔",
    "previewNotes": "杜兰特大交易后迎战老东家太阳！火箭新体系攻防成色全方位检验。"
  },
  {
    "id": "401910520",
    "date": "2027-02-08",
    "time": "11:30",
    "opponent": {
      "name": "国王",
      "city": "萨克拉门托",
      "abbr": "SAC",
      "color": "#5A2D81",
      "logoText": "SAC"
    },
    "isHome": false,
    "arena": "萨克拉门托·第一黄金球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 福克斯 / 萨博尼斯",
    "previewNotes": "客场挑战萨克拉门托国王，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910536",
    "date": "2027-02-10",
    "time": "11:00",
    "opponent": {
      "name": "爵士",
      "city": "犹他",
      "abbr": "UTA",
      "color": "#002B5C",
      "logoText": "UTA"
    },
    "isHome": false,
    "arena": "犹他·德尔塔中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
    "previewNotes": "客场挑战犹他爵士，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910549",
    "date": "2027-02-12",
    "time": "09:30",
    "opponent": {
      "name": "国王",
      "city": "萨克拉门托",
      "abbr": "SAC",
      "color": "#5A2D81",
      "logoText": "SAC"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 福克斯 / 萨博尼斯",
    "previewNotes": "主场迎战萨克拉门托国王，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910558",
    "date": "2027-02-13",
    "time": "09:00",
    "opponent": {
      "name": "鹈鹕",
      "city": "新奥尔良",
      "abbr": "NOP",
      "color": "#85714D",
      "logoText": "NOP"
    },
    "isHome": false,
    "arena": "新奥尔良·冰沙国王中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
    "previewNotes": "客场挑战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910571",
    "date": "2027-02-15",
    "time": "03:00",
    "opponent": {
      "name": "掘金",
      "city": "丹佛",
      "abbr": "DEN",
      "color": "#0E2240",
      "logoText": "DEN"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 尼古拉·约基奇",
    "previewNotes": "顶级欧洲高位策应中锋大师课！申京再度向MVP约基奇发起正面对话。"
  },
  {
    "id": "401910582",
    "date": "2027-02-17",
    "time": "12:00",
    "opponent": {
      "name": "快船",
      "city": "洛杉矶",
      "abbr": "LAC",
      "color": "#C8102E",
      "logoText": "LAC"
    },
    "isHome": false,
    "arena": "洛杉矶·直觉巨蛋",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 哈登 / 莱昂纳德",
    "previewNotes": "客场挑战洛杉矶快船，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910598",
    "date": "2027-02-19",
    "time": "11:00",
    "opponent": {
      "name": "湖人",
      "city": "洛杉矶",
      "abbr": "LAL",
      "color": "#552583",
      "logoText": "LAL"
    },
    "isHome": false,
    "arena": "洛杉矶·加密网球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
    "previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
  },
  {
    "id": "401910614",
    "date": "2027-02-27",
    "time": "09:30",
    "opponent": {
      "name": "黄蜂",
      "city": "夏洛特",
      "abbr": "CHA",
      "color": "#1D1160",
      "logoText": "CHA"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 三球鲍尔 / 米勒",
    "previewNotes": "主场迎战夏洛特黄蜂，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910630",
    "date": "2027-03-01",
    "time": "10:30",
    "opponent": {
      "name": "热火",
      "city": "迈阿密",
      "abbr": "MIA",
      "color": "#98002E",
      "logoText": "MIA"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 巴特勒 / 阿德巴约",
    "previewNotes": "主场迎战迈阿密热火，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910635",
    "date": "2027-03-02",
    "time": "09:30",
    "opponent": {
      "name": "勇士",
      "city": "金州",
      "abbr": "GSW",
      "color": "#1D428A",
      "logoText": "GSW"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
    "previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
  },
  {
    "id": "401910651",
    "date": "2027-03-04",
    "time": "09:30",
    "opponent": {
      "name": "鹈鹕",
      "city": "新奥尔良",
      "abbr": "NOP",
      "color": "#85714D",
      "logoText": "NOP"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
    "previewNotes": "主场迎战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910667",
    "date": "2027-03-06",
    "time": "10:30",
    "opponent": {
      "name": "马刺",
      "city": "圣安东尼奥",
      "abbr": "SAS",
      "color": "#6c757d",
      "logoText": "SAS"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
    "previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
  },
  {
    "id": "401910679",
    "date": "2027-03-08",
    "time": "11:00",
    "opponent": {
      "name": "勇士",
      "city": "金州",
      "abbr": "GSW",
      "color": "#1D428A",
      "logoText": "GSW"
    },
    "isHome": false,
    "arena": "旧金山·大通中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
    "previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
  },
  {
    "id": "401910688",
    "date": "2027-03-09",
    "time": "11:30",
    "opponent": {
      "name": "快船",
      "city": "洛杉矶",
      "abbr": "LAC",
      "color": "#C8102E",
      "logoText": "LAC"
    },
    "isHome": false,
    "arena": "洛杉矶·直觉巨蛋",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 哈登 / 莱昂纳德",
    "previewNotes": "客场挑战洛杉矶快船，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910699",
    "date": "2027-03-11",
    "time": "10:00",
    "opponent": {
      "name": "爵士",
      "city": "犹他",
      "abbr": "UTA",
      "color": "#002B5C",
      "logoText": "UTA"
    },
    "isHome": false,
    "arena": "犹他·德尔塔中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
    "previewNotes": "客场挑战犹他爵士，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910721",
    "date": "2027-03-14",
    "time": "06:30",
    "opponent": {
      "name": "步行者",
      "city": "印第安纳",
      "abbr": "IND",
      "color": "#002D62",
      "logoText": "IND"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 哈利伯顿 / 西亚卡姆",
    "previewNotes": "主场迎战印第安纳步行者，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910745",
    "date": "2027-03-17",
    "time": "08:30",
    "opponent": {
      "name": "马刺",
      "city": "圣安东尼奥",
      "abbr": "SAS",
      "color": "#6c757d",
      "logoText": "SAS"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
    "previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
  },
  {
    "id": "401910752",
    "date": "2027-03-18",
    "time": "08:30",
    "opponent": {
      "name": "篮网",
      "city": "布鲁克林",
      "abbr": "BKN",
      "color": "#000000",
      "logoText": "BKN"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 托马斯 / 克拉克斯顿",
    "previewNotes": "主场迎战布鲁克林篮网，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910767",
    "date": "2027-03-20",
    "time": "08:00",
    "opponent": {
      "name": "鹈鹕",
      "city": "新奥尔良",
      "abbr": "NOP",
      "color": "#85714D",
      "logoText": "NOP"
    },
    "isHome": false,
    "arena": "新奥尔良·冰沙国王中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
    "previewNotes": "客场挑战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910786",
    "date": "2027-03-23",
    "time": "07:00",
    "opponent": {
      "name": "骑士",
      "city": "克利夫兰",
      "abbr": "CLE",
      "color": "#860038",
      "logoText": "CLE"
    },
    "isHome": false,
    "arena": "克利夫兰·火箭按揭球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 米切尔 / 加兰 / 莫布利",
    "previewNotes": "客场挑战克利夫兰骑士，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910804",
    "date": "2027-03-25",
    "time": "07:30",
    "opponent": {
      "name": "尼克斯",
      "city": "纽约",
      "abbr": "NYK",
      "color": "#F58426",
      "logoText": "NYK"
    },
    "isHome": false,
    "arena": "纽约·麦迪逊广场花园",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 布伦森 / 唐斯",
    "previewNotes": "客场挑战纽约尼克斯，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910812",
    "date": "2027-03-26",
    "time": "07:00",
    "opponent": {
      "name": "活塞",
      "city": "底特律",
      "abbr": "DET",
      "color": "#1D42BA",
      "logoText": "DET"
    },
    "isHome": false,
    "arena": "底特律·小凯撒球馆",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 康宁汉姆",
    "previewNotes": "客场挑战底特律活塞，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910833",
    "date": "2027-03-29",
    "time": "03:00",
    "opponent": {
      "name": "湖人",
      "city": "洛杉矶",
      "abbr": "LAL",
      "color": "#552583",
      "logoText": "LAL"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
    "previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
  },
  {
    "id": "401910853",
    "date": "2027-03-31",
    "time": "11:00",
    "opponent": {
      "name": "开拓者",
      "city": "波特兰",
      "abbr": "POR",
      "color": "#E03A3E",
      "logoText": "POR"
    },
    "isHome": false,
    "arena": "波特兰·摩达中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 亨德森 / 西蒙斯",
    "previewNotes": "客场挑战波特兰开拓者，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910863",
    "date": "2027-04-01",
    "time": "10:00",
    "opponent": {
      "name": "开拓者",
      "city": "波特兰",
      "abbr": "POR",
      "color": "#E03A3E",
      "logoText": "POR"
    },
    "isHome": false,
    "arena": "波特兰·摩达中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 亨德森 / 西蒙斯",
    "previewNotes": "客场挑战波特兰开拓者，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910876",
    "date": "2027-04-03",
    "time": "08:30",
    "opponent": {
      "name": "灰熊",
      "city": "孟菲斯",
      "abbr": "MEM",
      "color": "#5D76A9",
      "logoText": "MEM"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
    "previewNotes": "主场迎战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910888",
    "date": "2027-04-05",
    "time": "04:00",
    "opponent": {
      "name": "公牛",
      "city": "芝加哥",
      "abbr": "CHI",
      "color": "#CE1141",
      "logoText": "CHI"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 拉文 / 武切维奇",
    "previewNotes": "主场迎战芝加哥公牛，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910915",
    "date": "2027-04-08",
    "time": "08:30",
    "opponent": {
      "name": "国王",
      "city": "萨克拉门托",
      "abbr": "SAC",
      "color": "#5A2D81",
      "logoText": "SAC"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 福克斯 / 萨博尼斯",
    "previewNotes": "主场迎战萨克拉门托国王，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910931",
    "date": "2027-04-10",
    "time": "08:30",
    "opponent": {
      "name": "开拓者",
      "city": "波特兰",
      "abbr": "POR",
      "color": "#E03A3E",
      "logoText": "POR"
    },
    "isHome": true,
    "arena": "休斯敦·丰田中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "杜兰特 & 申京 vs 亨德森 / 西蒙斯",
    "previewNotes": "主场迎战波特兰开拓者，乌度卡强化防守反击与篮板控制。"
  },
  {
    "id": "401910946",
    "date": "2027-04-12",
    "time": "08:30",
    "opponent": {
      "name": "森林狼",
      "city": "明尼苏达",
      "abbr": "MIN",
      "color": "#236192",
      "logoText": "MIN"
    },
    "isHome": false,
    "arena": "明尼阿波利斯·标靶中心",
    "broadcast": "腾讯体育 / 咪咕视频",
    "stage": "regular",
    "status": "upcoming",
    "keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
    "previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
  }
];
