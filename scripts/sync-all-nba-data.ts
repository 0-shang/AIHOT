import fs from "node:fs/promises";
import path from "node:path";

const DRAFT_MAP: Record<string, string> = {
  "Kevin Durant": "2007年 第1轮第2顺位 (榜眼 · 西雅图超音速)",
  "Alperen Sengun": "2021年 第1轮第16顺位 (俄克拉荷马雷霆选中交易至火箭)",
  "Fred VanVleet": "2016年 NBA落选秀 (多伦多猛龙签约 / 2019总冠军成员)",
  "Amen Thompson": "2023年 第1轮第4顺位 (休斯敦火箭)",
  "Jabari Smith Jr.": "2022年 第1轮第3顺位 (探花 · 休斯敦火箭)",
  "Tari Eason": "2022年 第1轮第17顺位 (休斯敦火箭)",
  "Reed Sheppard": "2024年 第1轮第3顺位 (探花 · 休斯敦火箭)",
  "Marcus Smart": "2014年 第1轮第6顺位 (波士顿凯尔特人 / 2022年DPOY)",
  "Clint Capela": "2014年 第1轮第25顺位 (休斯敦火箭)",
  "Steven Adams": "2013年 第1轮第12顺位 (俄克拉荷马雷霆)",
  "Bogdan Bogdanovic": "2014年 第1轮第27顺位 (菲尼克斯太阳)",
  "Jae'Sean Tate": "2018年 NBA落选秀 (海外历练后签约休斯敦火箭)",
  "Julian Phillips": "2023年 第2轮第35顺位 (波士顿凯尔特人选中交易至公牛)",
  "Oscar Tshiebwe": "2023年 NBA落选秀 (印第安纳步行者双向合同)",
  "Isaiah Crawford": "2024年 NBA落选秀 (萨克拉门托国王双向合同)",
  "Sean Pedulla": "2025年 NBA落选秀",
  "Quadir Copeland": "2025年 NBA落选秀",
  "Bruce Thornton": "2025年 NBA落选秀",
};

const CN_NAME_MAP: Record<string, string> = {
  "Kevin Durant": "凯文·杜兰特",
  "Alperen Sengun": "阿尔佩伦·申京",
  "Fred VanVleet": "弗雷德·范弗里特",
  "Amen Thompson": "阿门·汤普森",
  "Jabari Smith Jr.": "小贾巴里·史密斯",
  "Tari Eason": "塔里·伊森",
  "Reed Sheppard": "里德·谢泼德",
  "Marcus Smart": "马库斯·斯玛特",
  "Clint Capela": "克林特·卡佩拉",
  "Steven Adams": "史蒂文·亚当斯",
  "Bogdan Bogdanovic": "博格丹·博格达诺维奇",
  "Jae'Sean Tate": "杰肖恩·泰特",
  "Julian Phillips": "朱利安·菲利普斯",
  "Oscar Tshiebwe": "奥斯卡·希布韦",
  "Isaiah Crawford": "以赛亚·克劳福德",
  "Quadir Copeland": "夸迪尔·科普兰",
  "Sean Pedulla": "肖恩·佩杜拉",
  "Bruce Thornton": "布鲁斯·桑顿",
};

const NBA_TEAMS_INFO: Record<string, { name: string; city: string; abbr: string; color: string; logoText: string }> = {
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
  "UTA": { name: "爵士", city: "犹他", abbr: "UTA", color: "#002B5C", logoText: "UTA" },
  "UTAH": { name: "爵士", city: "犹他", abbr: "UTA", color: "#002B5C", logoText: "UTA" },
  "POR": { name: "开拓者", city: "波特兰", abbr: "POR", color: "#E03A3E", logoText: "POR" },
  "SAC": { name: "国王", city: "萨克拉门托", abbr: "SAC", color: "#5A2D81", logoText: "SAC" },
  "BOS": { name: "凯尔特人", city: "波士顿", abbr: "BOS", color: "#007A33", logoText: "BOS" },
  "NYK": { name: "尼克斯", city: "纽约", abbr: "NYK", color: "#006BB6", logoText: "NYK" },
  "NY": { name: "尼克斯", city: "纽约", abbr: "NYK", color: "#006BB6", logoText: "NYK" },
  "PHO": { name: "太阳", city: "菲尼克斯", abbr: "PHX", color: "#E56020", logoText: "PHX" },
  "WSH": { name: "奇才", city: "华盛顿", abbr: "WAS", color: "#002B5C", logoText: "WAS" },
  "BK": { name: "篮网", city: "布鲁克林", abbr: "BKN", color: "#000000", logoText: "BKN" },
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
  "CHA": { name: "黄蜂", city: "夏洛特", abbr: "CHA", color: "#1D1160", logoText: "CHA" },
  "WAS": { name: "奇才", city: "华盛顿", abbr: "WAS", color: "#002B5C", logoText: "WAS" },
  "DET": { name: "活塞", city: "底特律", abbr: "DET", color: "#1D42BA", logoText: "DET" },
  "HOU": { name: "火箭", city: "休斯敦", abbr: "HOU", color: "#CE1141", logoText: "HOU" },
};

async function fetchSeasonCategory(athleteId: string, seasonType: number) {
  try {
    const url = `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${athleteId}/stats?seasontype=${seasonType}`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const d = (await res.json()) as any;
    const avgCat = d.categories?.find((c: any) => c.name === "averages");
    if (!avgCat || !avgCat.statistics) return {};

    const labels: string[] = avgCat.labels || [];
    const seasonsMap: Record<string, any> = {};

    for (const row of avgCat.statistics) {
      const yr = row.season?.displayName || row.displayName;
      if (!yr) continue;
      const m: Record<string, string> = {};
      labels.forEach((lbl, idx) => {
        m[lbl] = row.stats?.[idx] ?? "0";
      });

      seasonsMap[yr] = {
        season: yr,
        gp: Number(m["GP"] || 0),
        gs: Number(m["GS"] || 0),
        mpg: Number(m["MIN"] || 0),
        fg: m["FG"] || "0-0",
        fgPct: Number(m["FG%"] || 0),
        threePt: m["3PT"] || "0-0",
        threePtPct: Number(m["3P%"] || 0),
        ft: m["FT"] || "0-0",
        ftPct: Number(m["FT%"] || 0),
        reb: Number(m["REB"] || 0),
        oReb: Number(m["OR"] || 0),
        dReb: Number(m["DR"] || 0),
        ast: Number(m["AST"] || 0),
        stl: Number(m["STL"] || 0),
        blk: Number(m["BLK"] || 0),
        tov: Number(m["TO"] || 0),
        pf: Number(m["PF"] || 0),
        pts: Number(m["PTS"] || 0),
      };
    }
    return seasonsMap;
  } catch {
    return {};
  }
}

async function syncAll() {
  const targetDir = path.resolve(process.cwd(), ".data", "rockets");
  await fs.mkdir(targetDir, { recursive: true });

  console.log("1. Fetching full schedule (Preseason + Regular season 80+ games)...");
  const [preRes, regRes] = await Promise.all([
    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/10/schedule?seasontype=1"),
    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/10/schedule?seasontype=2"),
  ]);

  const preData = (await preRes.json()) as any;
  const regData = (await regRes.json()) as any;

  const rawEvents = [...(preData.events || []), ...(regData.events || [])];
  console.log(`Retrieved total ${rawEvents.length} raw schedule events.`);

function toBeijingDateTime(dateIsoStr: string): { date: string; time: string } {
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

  const games: any[] = [];
  const eventIdsSeen = new Set<string>();

  for (const ev of rawEvents) {
    if (eventIdsSeen.has(ev.id)) continue;
    eventIdsSeen.add(ev.id);

    const comp = ev.competitions?.[0];
    if (!comp) continue;
    const competitors = comp.competitors || [];
    const rocketsComp = competitors.find((c: any) => c.team?.id === "10");
    const oppComp = competitors.find((c: any) => c.team?.id !== "10");
    if (!rocketsComp || !oppComp) continue;

    const oppAbbr = (oppComp.team?.abbreviation || "OPP").toUpperCase();
    const oppInfo = NBA_TEAMS_INFO[oppAbbr] || {
      name: oppComp.team?.name || "对手",
      city: oppComp.team?.location || "",
      abbr: oppAbbr,
      color: oppComp.team?.color ? `#${oppComp.team.color}` : "#475569",
      logoText: oppAbbr,
    };

    const isHome = rocketsComp.homeAway === "home";
    const { date: dateStr, time: timeStr } = toBeijingDateTime(ev.date);

    const isCompleted = comp.status?.type?.completed === true || comp.status?.type?.state === "post";
    let result: any = undefined;

    if (isCompleted) {
      const rScore = Number(rocketsComp.score?.value ?? rocketsComp.score ?? 0);
      const oScore = Number(oppComp.score?.value ?? oppComp.score ?? 0);
      result = {
        outcome: rScore >= oScore ? "W" : "L",
        rocketsScore: rScore,
        opponentScore: oScore,
      };
    }

    games.push({
      id: ev.id,
      date: dateStr,
      time: timeStr,
      opponent: oppInfo,
      isHome,
      arena: comp.venue?.fullName || (isHome ? "休斯敦·丰田中心" : "客场球馆"),
      broadcast: comp.broadcasts?.[0]?.names?.[0] || "腾讯体育 / 咪咕",
      stage: ev.seasonType === 1 ? "preseason" : "regular",
      status: isCompleted ? "final" : "upcoming",
      result,
    });
  }

  // 按日期排序
  games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  await fs.writeFile(path.join(targetDir, "schedule.json"), JSON.stringify(games, null, 2), "utf-8");
  console.log(`Saved ${games.length} full-season games to schedule.json`);

  console.log("\n2. Fetching roster and multi-season Regular + Playoff stats...");
  const rosterRes = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/10/roster");
  const rosterData = (await rosterRes.json()) as any;
  const rawAthletes: any[] = [];
  for (const group of rosterData.athletes || []) {
    for (const p of group.items || [group]) rawAthletes.push(p);
  }

  const players: any[] = [];

  for (const a of rawAthletes) {
    const id = String(a.id);
    const nameEn = a.displayName || "";
    const nameCn = CN_NAME_MAP[nameEn] || nameEn;
    const jersey = a.jersey || "--";
    const pos = a.position?.abbreviation || "F";
    const headshot = a.headshot?.href || `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;
    const draftInfo = DRAFT_MAP[nameEn] || (a.draft?.displayPick ? `首轮第${a.draft.displayPick}顺位` : "NBA选秀");

    console.log(`- Fetching regular + playoff stats for ${nameCn} (${nameEn})...`);
    const [regSeasons, playoffSeasons] = await Promise.all([
      fetchSeasonCategory(id, 2), // Regular Season
      fetchSeasonCategory(id, 3), // Playoff / Postseason
    ]);

    const regKeys = Object.keys(regSeasons);
    const currentSeason = regSeasons["2025-26"]
      ? "2025-26"
      : regKeys.length > 0
      ? regKeys[regKeys.length - 1]!
      : "2025-26";

    const stats = regSeasons[currentSeason] || {
      season: currentSeason,
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

    const playoffStats = playoffSeasons[currentSeason] || undefined;

    players.push({
      id,
      nameCn,
      nameEn,
      number: jersey,
      position: pos,
      age: a.age || 25,
      height: a.displayHeight || "6' 7\"",
      weight: a.displayWeight || "220 lbs",
      experience: a.experience?.years !== undefined ? `${a.experience.years}年` : "现役",
      draftInfo,
      college: a.college?.name || "职业联赛",
      headshotUrl: headshot,
      currentSeason,
      seasons: regSeasons,
      playoffSeasons,
      stats,
      playoffStats,
    });
  }

  // 排序
  players.sort((a, b) => (b.stats.pts || 0) - (a.stats.pts || 0));

  await fs.writeFile(path.join(targetDir, "players.json"), JSON.stringify(players, null, 2), "utf-8");
  console.log(`Saved ${players.length} active players with regular & playoff stats to players.json`);
}

syncAll().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
