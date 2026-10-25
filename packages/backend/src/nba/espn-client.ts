import type {
  GameBreakdownData,
  GameItem,
  OpponentInfo,
  PlayerBoxscoreItem,
  PlayerStatsData,
  SeasonAverages,
  StandingsData,
  TeamStandingItem,
} from "./types.ts";

export const ROCKETS_TEAM_ID = "10";

export const NBA_TEAMS_INFO: Record<string, OpponentInfo> = {
  "DAL": { name: "独行侠", city: "达拉斯", abbr: "DAL", color: "#00538C", logoText: "DAL" },
  "SAS": { name: "马刺", city: "圣安东尼奥", abbr: "SAS", color: "#6c757d", logoText: "SAS" },
  "SA": { name: "马刺", city: "圣安东尼奥", abbr: "SAS", color: "#6c757d", logoText: "SAS" },
  "OKC": { name: "雷霆", city: "俄克拉荷马", abbr: "OKC", color: "#007AC1", logoText: "OKC" },
  "GSW": { name: "勇士", city: "金州", abbr: "GSW", color: "#1D428A", logoText: "GSW" },
  "GS": { name: "勇士", city: "金州", abbr: "GSW", color: "#1D428A", logoText: "GSW" },
  "LAL": { name: "湖人", city: "洛杉矶", abbr: "LAL", color: "#552583", logoText: "LAL" },
  "LAC": { name: "快船", city: "洛杉矶", abbr: "LAC", color: "#C8102E", logoText: "LAC" },
  "DEN": { name: "掘金", city: "丹佛", abbr: "DEN", color: "#0E2240", logoText: "DEN" },
  "PHX": { name: "太阳", city: "菲尼克斯", abbr: "PHX", color: "#E56020", logoText: "PHX" },
  "MIN": { name: "森林狼", city: "明尼苏达", abbr: "MIN", color: "#236192", logoText: "MIN" },
  "MEM": { name: "灰熊", city: "孟菲斯", abbr: "MEM", color: "#5D76A9", logoText: "MEM" },
  "NOP": { name: "鹈鹕", city: "新奥尔良", abbr: "NOP", color: "#0C2340", logoText: "NOP" },
  "NO": { name: "鹈鹕", city: "新奥尔良", abbr: "NOP", color: "#0C2340", logoText: "NOP" },
  "UTA": { name: "爵士", city: "犹他", abbr: "UTA", color: "#002B5C", logoText: "UTA" },
  "UTAH": { name: "爵士", city: "犹他", abbr: "UTA", color: "#002B5C", logoText: "UTA" },
  "POR": { name: "开拓者", city: "波特兰", abbr: "POR", color: "#E03A3E", logoText: "POR" },
  "SAC": { name: "国王", city: "萨克拉门托", abbr: "SAC", color: "#5A2D81", logoText: "SAC" },
  "BOS": { name: "凯尔特人", city: "波士顿", abbr: "BOS", color: "#007A33", logoText: "BOS" },
  "NYK": { name: "尼克斯", city: "纽约", abbr: "NYK", color: "#006BB6", logoText: "NYK" },
  "NY": { name: "尼克斯", city: "纽约", abbr: "NYK", color: "#006BB6", logoText: "NYK" },
  "MIL": { name: "雄鹿", city: "密尔沃基", abbr: "MIL", color: "#00471B", logoText: "MIL" },
  "CLE": { name: "骑士", city: "克利夫兰", abbr: "CLE", color: "#860038", logoText: "CLE" },
  "IND": { name: "步行者", city: "印第安纳", abbr: "IND", color: "#002D62", logoText: "IND" },
  "ORL": { name: "魔术", city: "奥兰多", abbr: "ORL", color: "#0077C0", logoText: "ORL" },
  "MIA": { name: "热火", city: "迈阿密", abbr: "MIA", color: "#98002E", logoText: "MIA" },
  "PHI": { name: "76人", city: "费城", abbr: "PHI", color: "#006BB6", logoText: "PHI" },
  "ATL": { name: "老鹰", city: "亚特兰大", abbr: "ATL", color: "#C8102E", logoText: "ATL" },
  "CHI": { name: "公牛", city: "芝加哥", abbr: "CHI", color: "#CE1141", logoText: "CHI" },
  "TOR": { name: "猛龙", city: "多伦多", abbr: "TOR", color: "#CE1141", logoText: "TOR" },
  "BKN": { name: "篮网", city: "布鲁克林", abbr: "BKN", color: "#000000", logoText: "BKN" },
  "BK": { name: "篮网", city: "布鲁克林", abbr: "BKN", color: "#000000", logoText: "BKN" },
  "CHA": { name: "黄蜂", city: "夏洛特", abbr: "CHA", color: "#1D1160", logoText: "CHA" },
  "WAS": { name: "奇才", city: "华盛顿", abbr: "WAS", color: "#002B5C", logoText: "WAS" },
  "WSH": { name: "奇才", city: "华盛顿", abbr: "WAS", color: "#002B5C", logoText: "WAS" },
  "DET": { name: "活塞", city: "底特律", abbr: "DET", color: "#1D42BA", logoText: "DET" },
  "HOU": { name: "火箭", city: "休斯敦", abbr: "HOU", color: "#CE1141", logoText: "HOU" },
  "PHO": { name: "太阳", city: "菲尼克斯", abbr: "PHX", color: "#E56020", logoText: "PHX" },
};

export const PLAYER_CN_DICT: Record<string, string> = {
  "Alperen Sengun": "阿尔佩伦·申京",
  "Alperen Şengün": "阿尔佩伦·申京",
  "Amen Thompson": "阿门·汤普森",
  "Jalen Green": "杰伦·格林",
  "Tari Eason": "塔里·伊森",
  "Jabari Smith Jr.": "小贾巴里·史密斯",
  "Fred VanVleet": "弗雷德·范弗里特",
  "Reed Sheppard": "里德·谢泼德",
  "Dillon Brooks": "狄龙·布鲁克斯",
  "Cam Whitmore": "卡姆·惠特莫尔",
  "Steven Adams": "史蒂文·亚当斯",
  "Aaron Holiday": "阿隆·霍勒迪",
  "Jock Landale": "乔克·兰代尔",
  "Jeff Green": "杰夫·格林",
  "Kevin Durant": "凯文·杜兰特",
  "Bogdan Bogdanovic": "博格丹·博格达诺维奇",
  "Clint Capela": "克林特·卡佩拉",
  "Marcus Smart": "马库斯·斯玛特",
  "Jae'Sean Tate": "杰肖恩·泰特",
  "Julian Phillips": "朱利安·菲利普斯",
  "Quadir Copeland": "夸迪尔·科普兰",
  "Isaiah Crawford": "以赛亚·克劳福德",
  "Sean Pedulla": "肖恩·佩杜拉",
  "Bruce Thornton": "布鲁斯·桑顿",
  "Oscar Tshiebwe": "奥斯卡·希布韦",
};

export const DRAFT_DICT: Record<string, string> = {
  "Kevin Durant": "2007年 第1轮第2顺位 (榜眼 · 西雅图超音速)",
  "Alperen Sengun": "2021年 第1轮第16顺位 (休斯敦火箭)",
  "Fred VanVleet": "2016年 NBA落选秀 (多伦多猛龙 / 2019冠军)",
  "Amen Thompson": "2023年 第1轮第4顺位 (休斯敦火箭)",
  "Jabari Smith Jr.": "2022年 第1轮第3顺位 (探花 · 休斯敦火箭)",
  "Tari Eason": "2022年 第1轮第17顺位 (休斯敦火箭)",
  "Reed Sheppard": "2024年 第1轮第3顺位 (探花 · 休斯敦火箭)",
  "Marcus Smart": "2014年 第1轮第6顺位 (波士顿凯尔特人 / 2022年DPOY)",
  "Clint Capela": "2014年 第1轮第25顺位 (休斯敦火箭)",
  "Steven Adams": "2013年 第1轮第12顺位 (俄克拉荷马雷霆)",
  "Bogdan Bogdanovic": "2014年 第1轮第27顺位 (菲尼克斯太阳)",
  "Jae'Sean Tate": "2018年 NBA落选秀 (休斯敦火箭)",
  "Julian Phillips": "2023年 第2轮第35顺位 (波士顿凯尔特人)",
  "Oscar Tshiebwe": "2023年 NBA落选秀 (印第安纳步行者)",
  "Isaiah Crawford": "2024年 NBA落选秀",
  "Sean Pedulla": "2025年 NBA落选秀",
  "Quadir Copeland": "2025年 NBA落选秀",
  "Bruce Thornton": "2025年 NBA落选秀",
};

export function toBeijingDateTime(dateIsoStr: string): { date: string; time: string } {
  const d = new Date(dateIsoStr);
  if (isNaN(d.getTime())) return { date: "2026-10-01", time: "08:00" };
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(d);
  const m: Record<string, string> = {};
  for (const p of parts) m[p.type] = p.value;
  let hour = m.hour || "00";
  if (hour === "24") hour = "00";
  return {
    date: `${m.year}-${m.month}-${m.day}`,
    time: `${hour}:${m.minute}`,
  };
}

export function formatGameProgress(status: any): string {
  if (!status) return "进行中";
  const type = status.type || {};
  const short = (type.shortDetail || type.detail || "").toLowerCase();
  if (type.name === "STATUS_HALFTIME" || short.includes("half") || short.includes("halftime")) return "中场休息";
  if (short.includes("end of 1st") || short.includes("end 1st")) return "第1节结束";
  if (short.includes("end of 2nd") || short.includes("end 2nd")) return "半场结束";
  if (short.includes("end of 3rd") || short.includes("end 3rd")) return "第3节结束";
  if (short.includes("end of 4th") || short.includes("end 4th")) return "第4节结束";

  const period = Number(status.period || 1);
  const periodName = period <= 4 ? `第${period}节` : period === 5 ? "加时1" : `加时${period - 4}`;
  const clock = status.displayClock || "";
  return clock ? `${periodName} ${clock}` : `${periodName} 进行中`;
}

export class EspnClient {
  private timeoutMs = 8000;

  /** 获取火箭队完整赛程与战果 */
  async fetchRocketsSchedule(): Promise<GameItem[]> {
    try {
      const [preRes, regRes, scoreRes] = await Promise.all([
        fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${ROCKETS_TEAM_ID}/schedule?seasontype=1`, { signal: AbortSignal.timeout(this.timeoutMs) }).catch(() => null),
        fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${ROCKETS_TEAM_ID}/schedule?seasontype=2`, { signal: AbortSignal.timeout(this.timeoutMs) }).catch(() => null),
        fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`, { signal: AbortSignal.timeout(this.timeoutMs) }).catch(() => null),
      ]);

      const preData = (preRes && preRes.ok ? await preRes.json() : { events: [] }) as any;
      const regData = (regRes && regRes.ok ? await regRes.json() : { events: [] }) as any;
      const scoreData = (scoreRes && scoreRes.ok ? await scoreRes.json() : { events: [] }) as any;

      // 实时比分优先字典 (来自 scoreboard)
      const liveEventMap = new Map<string, any>();
      for (const ev of scoreData.events || []) {
        if (ev && ev.id) liveEventMap.set(ev.id, ev);
      }

      const events = [...(preData.events || []), ...(regData.events || [])];
      const games: GameItem[] = [];
      const seenIds = new Set<string>();

      for (const rawEv of events) {
        if (!rawEv || !rawEv.id || seenIds.has(rawEv.id)) continue;
        seenIds.add(rawEv.id);

        // 如果 scoreboard 中有当场比赛的最新实时进展，使用 scoreboard 的最新状态
        const ev = liveEventMap.get(rawEv.id) || rawEv;
        const comp = ev.competitions?.[0];
        if (!comp) continue;

        const competitors = comp.competitors || [];
        const rocketsComp = competitors.find((c: any) => c.team?.id === ROCKETS_TEAM_ID);
        const oppComp = competitors.find((c: any) => c.team?.id !== ROCKETS_TEAM_ID);
        if (!rocketsComp || !oppComp) continue;

        const oppAbbr = (oppComp.team?.abbreviation || "OPP").toUpperCase();
        const opponent: OpponentInfo = NBA_TEAMS_INFO[oppAbbr] || {
          name: oppComp.team?.name || "对手",
          city: oppComp.team?.location || "",
          abbr: oppAbbr,
          color: oppComp.team?.color ? `#${oppComp.team.color}` : "#6b7280",
          logoText: oppAbbr,
        };

        const isHome = rocketsComp.homeAway === "home";
        // 统一转换为北京时间 (Asia/Shanghai)
        const { date: dateStr, time: timeStr } = toBeijingDateTime(ev.date);

        const state = comp.status?.type?.state; // "pre" | "in" | "post"
        const isCompleted = comp.status?.type?.completed === true || state === "post";
        const isLive = state === "in";

        let status: GameItem["status"] = "upcoming";
        if (isCompleted) {
          status = "final";
        } else if (isLive) {
          status = "live";
        }

        let result: GameItem["result"] | undefined;
        let progress: string | undefined;

        if (isCompleted || isLive) {
          const rocketsScore = Number(rocketsComp.score?.value ?? rocketsComp.score ?? 0);
          const oppScore = Number(oppComp.score?.value ?? oppComp.score ?? 0);
          const outcome = rocketsScore >= oppScore ? "W" : "L";
          result = {
            outcome,
            rocketsScore,
            opponentScore: oppScore,
          };
          if (isLive) {
            progress = formatGameProgress(comp.status);
          }
        }

        const rawArena = comp.venue?.fullName || "";
        const arena = rawArena.toLowerCase().includes("venetian") || rawArena.includes("Macau") || ev.id === "401898395" || ev.id === "401898400"
          ? "澳门威尼斯人综艺馆"
          : rawArena || (isHome ? "丰田中心" : "客场球馆");
        const isPre = ev.seasonType === 1 || ev.season?.type === 1 || dateStr < "2026-10-22";

        games.push({
          id: ev.id,
          date: dateStr,
          time: timeStr,
          opponent,
          isHome,
          arena,
          broadcast: comp.broadcasts?.[0]?.names?.[0] || "腾讯体育 / 咪咕",
          stage: isPre ? "preseason" : "regular",
          status,
          progress,
          result,
        });
      }

      return games;
    } catch {
      return [];
    }
  }

  /** 获取单场比赛比分与双方球员详细技术统计 (Boxscore) */
  async fetchGameSummary(gameId: string): Promise<GameBreakdownData | null> {
    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${encodeURIComponent(gameId)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(this.timeoutMs) });
      if (!res.ok) return null;

      const data = (await res.json()) as any;
      const comp = data.header?.competitions?.[0];
      const competitors = comp?.competitors || [];
      const rocketsComp = competitors.find((c: any) => c.team?.id === ROCKETS_TEAM_ID || c.team?.displayName?.includes("Rockets"));
      const oppComp = competitors.find((c: any) => c !== rocketsComp);

      const quarters = {
        rockets: (rocketsComp?.linescores || []).map((l: any) => Number(l.displayValue)),
        opponent: (oppComp?.linescores || []).map((l: any) => Number(l.displayValue)),
      };

      const parseTeamAthletes = (teamDisplayName: string): PlayerBoxscoreItem[] => {
        const teamSec = (data.boxscore?.players || []).find((p: any) =>
          p.team?.displayName?.toLowerCase().includes(teamDisplayName.toLowerCase())
        );
        if (!teamSec) return [];
        const statsRow = teamSec.statistics?.[0];
        if (!statsRow) return [];

        return (statsRow.athletes || [])
          .map((ath: any) => {
            const s = ath.stats || [];
            const rawName = ath.athlete?.displayName || "";
            const cnName = PLAYER_CN_DICT[rawName] || rawName;
            const fgParts = (s[2] || "0-0").split("-");
            const fgPct =
              fgParts[1] && Number(fgParts[1]) > 0
                ? (Math.round((Number(fgParts[0]) / Number(fgParts[1])) * 1000) / 10).toFixed(1) + "%"
                : "0.0%";

            return {
              name: cnName,
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
          })
          .filter((p: PlayerBoxscoreItem) => p.minutes !== "DNP" && p.minutes !== "0");
      };

      const rocketsPlayers = parseTeamAthletes("Rockets");
      const opponentPlayers = parseTeamAthletes(oppComp?.team?.name || "Opponent");

      const oppAbbr = (oppComp?.team?.abbreviation || "OPP").toUpperCase();
      const oppInfo: OpponentInfo = NBA_TEAMS_INFO[oppAbbr] || {
        name: oppComp?.team?.name || "对手",
        city: oppComp?.team?.location || "",
        abbr: oppAbbr,
        color: oppComp?.team?.color ? `#${oppComp.team.color}` : "#6b7280",
        logoText: oppAbbr,
      };

      const { date: dateStr, time: timeStr } = toBeijingDateTime(comp?.date || new Date().toISOString());
      const rScore = Number(rocketsComp?.score || 0);
      const oScore = Number(oppComp?.score || 0);

      const rawArena = comp?.venue?.fullName || "";
      const arena = rawArena.toLowerCase().includes("venetian") || rawArena.includes("Macau") || gameId === "401898395" || gameId === "401898400"
        ? "澳门威尼斯人综艺馆"
        : rawArena || "丰田中心";
      const isPre = data.header?.season?.type === 1 || dateStr < "2026-10-22";

      const state = comp?.status?.type?.state;
      const isCompleted = comp?.status?.type?.completed === true || state === "post";
      const isLive = state === "in";
      const status: GameItem["status"] = isCompleted ? "final" : isLive ? "live" : "upcoming";
      const progress = isLive ? formatGameProgress(comp?.status) : undefined;

      const gameItem: GameItem = {
        id: gameId,
        date: dateStr,
        time: timeStr,
        opponent: oppInfo,
        isHome: rocketsComp?.homeAway === "home",
        arena,
        broadcast: "腾讯体育 / 咪咕",
        stage: isPre ? "preseason" : "regular",
        status,
        progress,
        result: {
          outcome: rScore >= oScore ? "W" : "L",
          rocketsScore: rScore,
          opponentScore: oScore,
        },
      };

      return {
        game: gameItem,
        quarters,
        rocketsPlayers,
        opponentPlayers,
      };
    } catch {
      return null;
    }
  }

  /** 获取西部联盟战绩排名 */
  async fetchStandings(): Promise<StandingsData> {
    try {
      const url = "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings";
      const res = await fetch(url, { signal: AbortSignal.timeout(this.timeoutMs) });
      if (!res.ok) throw new Error("Standings fetch failed");

      const data = (await res.json()) as any;
      const west = data.children?.find((c: any) => c.name?.includes("Western"));
      const entries: TeamStandingItem[] = [];

      let rocketsRank: number | undefined;

      (west?.standings?.entries || []).forEach((e: any, idx: number) => {
        const statsMap: Record<string, string> = {};
        for (const s of e.stats || []) {
          statsMap[s.name] = s.displayValue ?? String(s.value ?? "");
        }

        const abbr = (e.team?.abbreviation || "").toUpperCase();
        const isRockets = abbr === "HOU" || e.team?.id === ROCKETS_TEAM_ID;
        const rank = idx + 1;
        if (isRockets) rocketsRank = rank;

        const info = NBA_TEAMS_INFO[abbr];
        const teamName = info ? `${info.city}${info.name}` : e.team?.displayName || abbr;

        entries.push({
          id: e.team?.id || String(idx),
          rank,
          name: teamName,
          city: info?.city || e.team?.location || "",
          abbr,
          logo: e.team?.logos?.[0]?.href || `https://a.espncdn.com/i/teamlogos/nba/500/${abbr.toLowerCase()}.png`,
          wins: Number(statsMap["wins"] || 0),
          losses: Number(statsMap["losses"] || 0),
          winPct: statsMap["winPercent"] || ".000",
          gamesBehind: statsMap["gamesBehind"] || "-",
          streak: statsMap["streak"] || "-",
          lastTen: statsMap["Last Ten Games"] || "-",
          homeRecord: statsMap["Home"] || "-",
          awayRecord: statsMap["Road"] || "-",
          pointsFor: Number(statsMap["pointsFor"] || 0),
          pointsAgainst: Number(statsMap["pointsAgainst"] || 0),
          diff: statsMap["pointDifferential"] || statsMap["differential"] || "0",
          isRockets,
        });
      });
      entries.sort((a, b) => {
        const pctA = a.wins + a.losses > 0 ? a.wins / (a.wins + a.losses) : 0;
        const pctB = b.wins + b.losses > 0 ? b.wins / (b.wins + b.losses) : 0;
        if (pctB !== pctA) return pctB - pctA;
        return parseFloat(b.diff || "0") - parseFloat(a.diff || "0");
      });
      entries.forEach((e, i) => {
        e.rank = i + 1;
      });

      const isRegularSeason = new Date().getTime() >= new Date("2026-10-21T00:00:00Z").getTime();
      const rocketsIdx = entries.findIndex((e) => e.isRockets || e.abbr === "HOU");
      if (rocketsIdx !== -1) rocketsRank = rocketsIdx + 1;

      return {
        conference: "西部联盟 (Western Conference)",
        season: isRegularSeason ? "2026-27" : "2025-26",
        updatedAt: new Date().toISOString(),
        isOffseason: !isRegularSeason,
        rocketsRank,
        entries,
      };
    } catch {
      return {
        conference: "西部联盟",
        season: "2025-26",
        updatedAt: new Date().toISOString(),
        isOffseason: true,
        entries: [],
      };
    }
  }

  /** 获取单个球员的多赛季统计数据 (seasonType: 2为常规赛，3为季后赛) */
  async fetchAthleteSeasonStats(athleteId: string, seasonType = 2): Promise<Record<string, SeasonAverages>> {
    try {
      const url = `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${athleteId}/stats?seasontype=${seasonType}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(this.timeoutMs) });
      if (!res.ok) return {};

      const data = (await res.json()) as any;
      const avgCat = data.categories?.find((c: any) => c.name === "averages");
      if (!avgCat || !avgCat.statistics) return {};

      const labels = (avgCat.labels || []) as string[];
      const seasons: Record<string, SeasonAverages> = {};

      for (const row of avgCat.statistics) {
        const yr = row.season?.displayName || row.displayName;
        if (!yr) continue;

        const valMap: Record<string, string> = {};
        labels.forEach((lbl, i) => {
          valMap[lbl] = row.stats?.[i] ?? "0";
        });

        seasons[yr] = {
          season: yr,
          gp: Number(valMap["GP"] || 0),
          gs: Number(valMap["GS"] || 0),
          mpg: Number(valMap["MIN"] || 0),
          fg: valMap["FG"] || "0-0",
          fgPct: Number(valMap["FG%"] || 0),
          threePt: valMap["3PT"] || "0-0",
          threePtPct: Number(valMap["3P%"] || 0),
          ft: valMap["FT"] || "0-0",
          ftPct: Number(valMap["FT%"] || 0),
          reb: Number(valMap["REB"] || 0),
          oReb: Number(valMap["OR"] || 0),
          dReb: Number(valMap["DR"] || 0),
          ast: Number(valMap["AST"] || 0),
          stl: Number(valMap["STL"] || 0),
          blk: Number(valMap["BLK"] || 0),
          tov: Number(valMap["TO"] || 0),
          pf: Number(valMap["PF"] || 0),
          pts: Number(valMap["PTS"] || 0),
        };
      }

      return seasons;
    } catch {
      return {};
    }
  }

  /** 获取火箭队完整阵容及其最新与历史赛季数据 */
  async fetchRocketsRosterWithStats(): Promise<PlayerStatsData[]> {
    try {
      const rosterUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${ROCKETS_TEAM_ID}/roster`;
      const res = await fetch(rosterUrl, { signal: AbortSignal.timeout(this.timeoutMs) });
      if (!res.ok) return [];

      const data = (await res.json()) as any;
      const rawAthletes: any[] = [];
      for (const group of data.athletes || []) {
        for (const item of group.items || [group]) {
          rawAthletes.push(item);
        }
      }

      const players: PlayerStatsData[] = [];

      // 并发请求多位球员的赛季统计
      for (const a of rawAthletes) {
        const id = String(a.id);
        const nameEn = a.displayName || "";
        const nameCn = PLAYER_CN_DICT[nameEn] || nameEn;
        const jersey = a.jersey || "--";
        const position = a.position?.abbreviation || "F";
        const headshot =
          a.headshot?.href || `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;

        let seasons: Record<string, SeasonAverages> = {};
        let playoffSeasons: Record<string, SeasonAverages> = {};
        try {
          [seasons, playoffSeasons] = await Promise.all([
            this.fetchAthleteSeasonStats(id, 2),
            this.fetchAthleteSeasonStats(id, 3),
          ]);
        } catch {
          // ignore error
        }

        const seasonKeys = Object.keys(seasons);
        const currentSeason = "2026-27";

        // 如果 2026-27 常规赛已有数据，直接采用 2026-27；否则回退展示最新具备数据的赛季 (2025-26)
        const has2026 = seasons["2026-27"] && seasons["2026-27"].gp > 0;
        const fallbackSeasonKey = seasons["2025-26"]
          ? "2025-26"
          : seasonKeys.length > 0
          ? seasonKeys[seasonKeys.length - 1]!
          : "2026-27";

        if (!seasons["2026-27"]) {
          seasons["2026-27"] = {
            season: "2026-27",
            gp: 0,
            gs: 0,
            mpg: 0,
            fg: "0-0",
            fgPct: 0,
            threePt: "0-0",
            threePtPct: 0,
            ft: "0-0",
            ftPct: 0,
            reb: 0,
            oReb: 0,
            dReb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            tov: 0,
            pf: 0,
            pts: 0,
          };
        }

        const activeSeasonKey = has2026 ? "2026-27" : fallbackSeasonKey;
        const stats: SeasonAverages = seasons[activeSeasonKey] || seasons["2026-27"];

        const draftInfo = DRAFT_DICT[nameEn] || (a.draft?.displayPick ? `第${a.draft.displayPick}顺位` : "NBA选秀");

        players.push({
          id,
          nameCn,
          nameEn,
          number: jersey,
          position,
          age: a.age || 24,
          height: a.displayHeight || "6' 7\"",
          weight: a.displayWeight || "220 lbs",
          experience: a.experience?.years !== undefined ? `${a.experience.years}年` : "现役",
          draftInfo,
          college: a.college?.name || "职业联赛",
          headshotUrl: headshot,
          currentSeason,
          seasons,
          playoffSeasons,
          stats,
          playoffStats: playoffSeasons[currentSeason],
        });
      }

      // 按出场时间 / 得分降序排序主力球员在前面
      players.sort((a, b) => (b.stats.pts || 0) - (a.stats.pts || 0));

      return players;
    } catch {
      return [];
    }
  }
}
