export interface PlayerBoxScore {
  name: string;
  rawName?: string;
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
  threePtPct?: string;
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

export const PLAYER_NAME_CN: Record<string, string> = {
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

/** 真实抓取数据备份（从 ESPN 官方 summary 接口 2026-10-09 澳门赛真实数据提取） */
export const BOXSCORE_MAP: Record<string, GameBoxScore> = {
  "401898395": {
    gameId: "401898395",
    quarters: {
      rockets: [27, 38, 34, 36],
      opponent: [19, 26, 35, 37],
    },
    rocketsPlayers: [
      { name: "凯文·杜兰特", rawName: "Kevin Durant", number: "7", position: "F", minutes: "23", points: 15, rebounds: 2, assists: 1, steals: 1, blocks: 0, turnovers: 0, fg: "7-12", fgPct: "58.3%", threePt: "1-1", ft: "0-1", plusMinus: "+11" },
      { name: "小贾巴里·史密斯", rawName: "Jabari Smith Jr.", number: "10", position: "F", minutes: "22", points: 12, rebounds: 1, assists: 0, steals: 0, blocks: 2, turnovers: 2, fg: "4-8", fgPct: "50.0%", threePt: "2-3", ft: "2-4", plusMinus: "+12" },
      { name: "阿尔佩伦·申京", rawName: "Alperen Sengun", number: "28", position: "C", minutes: "22", points: 16, rebounds: 10, assists: 10, steals: 0, blocks: 4, turnovers: 6, fg: "6-9", fgPct: "66.7%", threePt: "0-2", ft: "4-5", plusMinus: "+22" },
      { name: "弗雷德·范弗里特", rawName: "Fred VanVleet", number: "5", position: "G", minutes: "24", points: 17, rebounds: 7, assists: 1, steals: 0, blocks: 0, turnovers: 2, fg: "5-12", fgPct: "41.7%", threePt: "5-12", ft: "2-3", plusMinus: "+15" },
      { name: "阿门·汤普森", rawName: "Amen Thompson", number: "1", position: "G", minutes: "24", points: 8, rebounds: 2, assists: 6, steals: 1, blocks: 3, turnovers: 4, fg: "4-8", fgPct: "50.0%", threePt: "0-0", ft: "0-0", plusMinus: "+7" },
      { name: "塔里·伊森", rawName: "Tari Eason", number: "17", position: "F", minutes: "24", points: 20, rebounds: 2, assists: 0, steals: 0, blocks: 3, turnovers: 6, fg: "6-10", fgPct: "60.0%", threePt: "2-2", ft: "6-7", plusMinus: "+17" },
      { name: "里德·谢泼德", rawName: "Reed Sheppard", number: "15", position: "G", minutes: "19", points: 16, rebounds: 1, assists: 1, steals: 0, blocks: 0, turnovers: 1, fg: "6-10", fgPct: "60.0%", threePt: "4-7", ft: "0-0", plusMinus: "+12" },
      { name: "布鲁斯·桑顿", rawName: "Bruce Thornton", number: "2", position: "G", minutes: "9", points: 13, rebounds: 2, assists: 2, steals: 1, blocks: 0, turnovers: 0, fg: "4-6", fgPct: "66.7%", threePt: "3-3", ft: "2-2", plusMinus: "-8" },
      { name: "以赛亚·克劳福德", rawName: "Isaiah Crawford", number: "27", position: "F", minutes: "12", points: 4, rebounds: 0, assists: 1, steals: 1, blocks: 1, turnovers: 0, fg: "1-3", fgPct: "33.3%", threePt: "1-2", ft: "1-2", plusMinus: "+7" },
      { name: "奥斯卡·希布韦", rawName: "Oscar Tshiebwe", number: "9", position: "C", minutes: "12", points: 5, rebounds: 1, assists: 2, steals: 0, blocks: 1, turnovers: 2, fg: "2-2", fgPct: "100.0%", threePt: "0-0", ft: "1-2", plusMinus: "-1" },
      { name: "博格丹·博格达诺维奇", rawName: "Bogdan Bogdanovic", number: "31", position: "G", minutes: "16", points: 4, rebounds: 4, assists: 1, steals: 0, blocks: 0, turnovers: 2, fg: "1-4", fgPct: "25.0%", threePt: "0-3", ft: "2-2", plusMinus: "+16" },
      { name: "夸迪尔·科普兰", rawName: "Quadir Copeland", number: "25", position: "G", minutes: "9", points: 3, rebounds: 1, assists: 2, steals: 0, blocks: 1, turnovers: 0, fg: "0-0", fgPct: "0.0%", threePt: "0-0", ft: "3-4", plusMinus: "-8" },
      { name: "史蒂文·亚当斯", rawName: "Steven Adams", number: "12", position: "C", minutes: "14", points: 2, rebounds: 1, assists: 1, steals: 0, blocks: 1, turnovers: 2, fg: "1-1", fgPct: "100.0%", threePt: "0-0", ft: "0-0", plusMinus: "-3" },
      { name: "朱利安·菲利普斯", rawName: "Julian Phillips", number: "3", position: "F", minutes: "7", points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fg: "0-0", fgPct: "0.0%", threePt: "0-0", ft: "0-0", plusMinus: "-5" },
      { name: "肖恩·佩杜拉", rawName: "Sean Pedulla", number: "0", position: "G", minutes: "4", points: 0, rebounds: 2, assists: 0, steals: 0, blocks: 0, turnovers: 0, fg: "0-1", fgPct: "0.0%", threePt: "0-1", ft: "0-0", plusMinus: "-4" },
    ],
    opponentPlayers: [
      { name: "库珀·弗拉格", rawName: "Cooper Flagg", number: "32", position: "F", minutes: "19", points: 19, rebounds: 3, assists: 2, steals: 1, blocks: 2, turnovers: 4, fg: "7-14", fgPct: "50.0%", threePt: "1-5", ft: "4-4", plusMinus: "-15" },
      { name: "纳吉·马绍尔", rawName: "Naji Marshall", number: "3", position: "F", minutes: "24", points: 16, rebounds: 3, assists: 2, steals: 0, blocks: 1, turnovers: 1, fg: "7-14", fgPct: "50.0%", threePt: "1-5", ft: "1-2", plusMinus: "-13" },
      { name: "马克斯·克里斯蒂", rawName: "Max Christie", number: "0", position: "G", minutes: "24", points: 14, rebounds: 2, assists: 0, steals: 0, blocks: 1, turnovers: 1, fg: "5-12", fgPct: "41.7%", threePt: "4-11", ft: "0-0", plusMinus: "-12" },
      { name: "托比·拉瓦尔", rawName: "Tobi Lawal", number: "33", position: "F", minutes: "15", points: 13, rebounds: 0, assists: 2, steals: 0, blocks: 1, turnovers: 0, fg: "5-6", fgPct: "83.3%", threePt: "0-1", ft: "3-3", plusMinus: "+2" },
      { name: "塞尔吉奥·德拉雷亚", rawName: "Sergio de Larrea", number: "55", position: "F", minutes: "24", points: 11, rebounds: 6, assists: 4, steals: 0, blocks: 0, turnovers: 2, fg: "4-6", fgPct: "66.7%", threePt: "3-3", ft: "0-0", plusMinus: "-3" },
      { name: "扎卡里·里萨谢", rawName: "Zaccharie Risacher", number: "10", position: "F", minutes: "24", points: 9, rebounds: 1, assists: 1, steals: 0, blocks: 3, turnovers: 5, fg: "4-9", fgPct: "44.4%", threePt: "1-3", ft: "0-0", plusMinus: "-13" },
      { name: "塔里克·比贝罗维奇", rawName: "Tarik Biberovic", number: "13", position: "F", minutes: "19", points: 9, rebounds: 2, assists: 0, steals: 0, blocks: 2, turnovers: 1, fg: "3-9", fgPct: "33.3%", threePt: "3-8", ft: "0-0", plusMinus: "-3" },
      { name: "杰特·霍华德", rawName: "Jett Howard", number: "9", position: "G", minutes: "16", points: 8, rebounds: 3, assists: 1, steals: 0, blocks: 0, turnovers: 1, fg: "3-6", fgPct: "50.0%", threePt: "1-3", ft: "1-2", plusMinus: "-2" },
      { name: "丹尼尔·加福德", rawName: "Daniel Gafford", number: "21", position: "F", minutes: "8", points: 7, rebounds: 0, assists: 1, steals: 0, blocks: 0, turnovers: 3, fg: "3-4", fgPct: "75.0%", threePt: "1-1", ft: "0-0", plusMinus: "-3" },
      { name: "莫雷兹·约翰逊", rawName: "Morez Johnson Jr.", number: "14", position: "F", minutes: "12", points: 4, rebounds: 1, assists: 0, steals: 0, blocks: 1, turnovers: 1, fg: "1-3", fgPct: "33.3%", threePt: "1-3", ft: "1-2", plusMinus: "-7" },
      { name: "赛斯·伦迪", rawName: "Seth Lundy", number: "31", position: "G", minutes: "14", points: 3, rebounds: 0, assists: 1, steals: 0, blocks: 0, turnovers: 1, fg: "1-4", fgPct: "25.0%", threePt: "1-4", ft: "0-2", plusMinus: "-8" },
      { name: "约翰·普拉基达斯", rawName: "John Poulakidas", number: "1", position: "G", minutes: "14", points: 3, rebounds: 2, assists: 1, steals: 0, blocks: 0, turnovers: 0, fg: "1-3", fgPct: "33.3%", threePt: "1-3", ft: "0-0", plusMinus: "-5" },
      { name: "德怀特·鲍威尔", rawName: "Dwight Powell", number: "7", position: "F", minutes: "13", points: 1, rebounds: 8, assists: 1, steals: 1, blocks: 1, turnovers: 0, fg: "0-1", fgPct: "0.0%", threePt: "0-1", ft: "1-2", plusMinus: "0" },
      { name: "穆萨·西塞", rawName: "Moussa Cisse", number: "30", position: "C", minutes: "14", points: 0, rebounds: 3, assists: 2, steals: 0, blocks: 2, turnovers: 4, fg: "0-3", fgPct: "0.0%", threePt: "0-0", ft: "0-0", plusMinus: "-8" },
    ],
  },
};

/** 客户端向数据站发起真实抓取，优先请求本地服务端抓取接口，网络失败时平滑降级 */
export async function fetchLiveBoxscore(gameId: string): Promise<GameBoxScore | null> {
  try {
    const res = await fetch(`/api/site/boxscore?gameId=${encodeURIComponent(gameId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.rocketsPlayers && data.rocketsPlayers.length > 0) {
        return data as GameBoxScore;
      }
    }
  } catch {
    // network or api fallback
  }

  // 尝试直接抓取 ESPN NBA 数据源
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${encodeURIComponent(gameId)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
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
          const displayName = cnName || rawName;
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

      if (rocketsPlayers.length > 0) {
        return {
          gameId,
          quarters,
          rocketsPlayers,
          opponentPlayers,
        };
      }
    }
  } catch {
    // fallback
  }

  return BOXSCORE_MAP[gameId] ?? null;
}
