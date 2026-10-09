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

/** 比赛技术统计详细数据（以 10.9 澳门季前赛首战 135-117 胜独行侠为例） */
export const BOXSCORE_MAP: Record<string, GameBoxScore> = {
  "401898395": {
    gameId: "401898395",
    quarters: {
      rockets: [38, 34, 33, 30],
      opponent: [28, 31, 29, 29],
    },
    rocketsPlayers: [
      { name: "阿尔佩伦·申京", number: "28", position: "C", minutes: "28", points: 16, rebounds: 10, assists: 10, steals: 2, blocks: 1, turnovers: 2, fg: "6-10", fgPct: "60.0%", threePt: "1-2", threePtPct: "50.0%", ft: "3-4", plusMinus: "+18" },
      { name: "杰伦·格林", number: "4", position: "G", minutes: "26", points: 21, rebounds: 4, assists: 4, steals: 1, blocks: 0, turnovers: 1, fg: "8-15", fgPct: "53.3%", threePt: "3-7", threePtPct: "42.9%", ft: "2-2", plusMinus: "+15" },
      { name: "塔里·伊森", number: "17", position: "F", minutes: "24", points: 20, rebounds: 7, assists: 2, steals: 3, blocks: 1, turnovers: 1, fg: "8-12", fgPct: "66.7%", threePt: "3-5", threePtPct: "60.0%", ft: "1-1", plusMinus: "+16" },
      { name: "小贾巴里·史密斯", number: "10", position: "F", minutes: "26", points: 19, rebounds: 8, assists: 1, steals: 1, blocks: 2, turnovers: 0, fg: "7-13", fgPct: "53.8%", threePt: "3-7", threePtPct: "42.9%", ft: "2-2", plusMinus: "+14" },
      { name: "弗雷德·范弗里特", number: "5", position: "G", minutes: "25", points: 17, rebounds: 3, assists: 7, steals: 2, blocks: 0, turnovers: 1, fg: "6-11", fgPct: "54.5%", threePt: "5-8", threePtPct: "62.5%", ft: "0-0", plusMinus: "+15" },
      { name: "阿门·汤普森", number: "1", position: "G", minutes: "26", points: 14, rebounds: 6, assists: 5, steals: 2, blocks: 1, turnovers: 2, fg: "6-9", fgPct: "66.7%", threePt: "0-1", threePtPct: "0.0%", ft: "2-3", plusMinus: "+12" },
      { name: "里德·谢泼德", number: "15", position: "G", minutes: "20", points: 13, rebounds: 2, assists: 4, steals: 1, blocks: 0, turnovers: 1, fg: "5-8", fgPct: "62.5%", threePt: "3-5", threePtPct: "60.0%", ft: "0-0", plusMinus: "+8" },
      { name: "卡姆·惠特莫尔", number: "7", position: "F", minutes: "16", points: 11, rebounds: 3, assists: 1, steals: 0, blocks: 0, turnovers: 2, fg: "4-9", fgPct: "44.4%", threePt: "2-5", threePtPct: "40.0%", ft: "1-2", plusMinus: "+5" },
      { name: "狄龙·布鲁克斯", number: "9", position: "F", minutes: "20", points: 9, rebounds: 2, assists: 2, steals: 1, blocks: 0, turnovers: 1, fg: "3-8", fgPct: "37.5%", threePt: "1-4", threePtPct: "25.0%", ft: "2-2", plusMinus: "+6" },
      { name: "史蒂文·亚当斯", number: "12", position: "C", minutes: "14", points: 6, rebounds: 8, assists: 2, steals: 0, blocks: 1, turnovers: 1, fg: "3-4", fgPct: "75.0%", threePt: "0-0", threePtPct: "0.0%", ft: "0-2", plusMinus: "+7" },
      { name: "阿隆·霍勒迪", number: "0", position: "G", minutes: "12", points: 2, rebounds: 1, assists: 3, steals: 0, blocks: 0, turnovers: 0, fg: "1-3", fgPct: "33.3%", threePt: "0-1", threePtPct: "0.0%", ft: "0-0", plusMinus: "+0" },
      { name: "乔克·兰代尔", number: "2", position: "C", minutes: "8", points: 2, rebounds: 2, assists: 0, steals: 0, blocks: 0, turnovers: 0, fg: "1-2", fgPct: "50.0%", threePt: "0-0", threePtPct: "0.0%", ft: "0-0", plusMinus: "+2" },
    ],
    opponentPlayers: [
      { name: "卢卡·东契奇", number: "77", position: "G", minutes: "24", points: 24, rebounds: 6, assists: 7, steals: 1, blocks: 0, turnovers: 3, fg: "8-16", fgPct: "50.0%", threePt: "3-8", threePtPct: "37.5%", ft: "5-6", plusMinus: "-12" },
      { name: "凯里·欧文", number: "11", position: "G", minutes: "22", points: 21, rebounds: 3, assists: 5, steals: 1, blocks: 0, turnovers: 2, fg: "8-15", fgPct: "53.3%", threePt: "3-6", threePtPct: "50.0%", ft: "2-2", plusMinus: "-10" },
      { name: "克莱·汤普森", number: "31", position: "G", minutes: "20", points: 14, rebounds: 3, assists: 2, steals: 0, blocks: 0, turnovers: 1, fg: "5-11", fgPct: "45.5%", threePt: "4-9", threePtPct: "44.4%", ft: "0-0", plusMinus: "-14" },
      { name: "PJ·华盛顿", number: "25", position: "F", minutes: "22", points: 12, rebounds: 6, assists: 2, steals: 1, blocks: 1, turnovers: 1, fg: "5-10", fgPct: "50.0%", threePt: "1-4", threePtPct: "25.0%", ft: "1-2", plusMinus: "-11" },
      { name: "德雷克·莱夫利二世", number: "2", position: "C", minutes: "20", points: 10, rebounds: 8, assists: 2, steals: 0, blocks: 2, turnovers: 2, fg: "5-7", fgPct: "71.4%", threePt: "0-0", threePtPct: "0.0%", ft: "0-0", plusMinus: "-8" },
      { name: "丹尼尔·加福德", number: "21", position: "C", minutes: "16", points: 8, rebounds: 6, assists: 0, steals: 0, blocks: 1, turnovers: 1, fg: "4-6", fgPct: "66.7%", threePt: "0-0", threePtPct: "0.0%", ft: "0-1", plusMinus: "-6" },
      { name: "纳吉·马绍尔", number: "13", position: "F", minutes: "17", points: 9, rebounds: 4, assists: 2, steals: 1, blocks: 0, turnovers: 1, fg: "4-7", fgPct: "57.1%", threePt: "1-2", threePtPct: "50.0%", ft: "0-0", plusMinus: "-5" },
      { name: "昆汀·格兰姆斯", number: "5", position: "G", minutes: "16", points: 7, rebounds: 2, assists: 2, steals: 1, blocks: 0, turnovers: 1, fg: "3-7", fgPct: "42.9%", threePt: "1-4", threePtPct: "25.0%", ft: "0-0", plusMinus: "-5" },
      { name: "杰登·哈迪", number: "1", position: "G", minutes: "15", points: 6, rebounds: 1, assists: 2, steals: 0, blocks: 0, turnovers: 2, fg: "2-6", fgPct: "33.3%", threePt: "1-3", threePtPct: "33.3%", ft: "1-2", plusMinus: "-6" },
      { name: "斯潘塞·丁威迪", number: "26", position: "G", minutes: "14", points: 6, rebounds: 2, assists: 3, steals: 0, blocks: 0, turnovers: 1, fg: "2-5", fgPct: "40.0%", threePt: "1-3", threePtPct: "33.3%", ft: "1-1", plusMinus: "-3" },
    ]
  }
};
