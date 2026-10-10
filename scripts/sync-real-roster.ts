import fs from "node:fs/promises";
import path from "node:path";

const cnMap: Record<string, string> = {
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

async function main() {
  console.log("Fetching official Houston Rockets (Team 10) roster from ESPN...");
  const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/10/roster");
  if (!res.ok) {
    throw new Error(`Failed to fetch roster: ${res.status}`);
  }

  const d = (await res.json()) as any;
  const rawList: any[] = [];
  for (const group of d.athletes || []) {
    for (const p of group.items || [group]) {
      rawList.push(p);
    }
  }

  console.log(`Found ${rawList.length} athletes in official roster.`);
  const players: any[] = [];

  for (const a of rawList) {
    const id = String(a.id);
    const nameEn = a.displayName || "";
    const nameCn = cnMap[nameEn] || nameEn;
    const jersey = a.jersey || "--";
    const pos = a.position?.abbreviation || "F";
    const headshot = a.headshot?.href || `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;

    const seasons: Record<string, any> = {};
    try {
      const sRes = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/stats`);
      if (sRes.ok) {
        const sData = (await sRes.json()) as any;
        const avgCat = sData.categories?.find((c: any) => c.name === "averages");
        const labels: string[] = avgCat?.labels || [];
        for (const row of avgCat?.statistics || []) {
          const yr = row.season?.displayName || row.displayName;
          if (!yr) continue;
          const map: Record<string, string> = {};
          labels.forEach((lbl, i) => {
            map[lbl] = row.stats?.[i] ?? "0";
          });

          seasons[yr] = {
            season: yr,
            gp: Number(map["GP"] || 0),
            gs: Number(map["GS"] || 0),
            mpg: Number(map["MIN"] || 0),
            fg: map["FG"] || "0-0",
            fgPct: Number(map["FG%"] || 0),
            threePt: map["3PT"] || "0-0",
            threePtPct: Number(map["3P%"] || 0),
            ft: map["FT"] || "0-0",
            ftPct: Number(map["FT%"] || 0),
            reb: Number(map["REB"] || 0),
            oReb: Number(map["OR"] || 0),
            dReb: Number(map["DR"] || 0),
            ast: Number(map["AST"] || 0),
            stl: Number(map["STL"] || 0),
            blk: Number(map["BLK"] || 0),
            tov: Number(map["TO"] || 0),
            pf: Number(map["PF"] || 0),
            pts: Number(map["PTS"] || 0),
          };
        }
      }
    } catch (err: any) {
      console.warn(`Could not fetch stats for ${nameEn}:`, err.message);
    }

    const sKeys = Object.keys(seasons);
    const currentSeason = seasons["2025-26"] ? "2025-26" : sKeys.length > 0 ? sKeys[sKeys.length - 1] : "2025-26";
    const stats = seasons[currentSeason] || {
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
      draftInfo: a.draft?.displayPick ? `首轮第${a.draft.displayPick}顺位` : "NBA选秀",
      college: a.college?.name || "职业联赛",
      headshotUrl: headshot,
      currentSeason,
      seasons,
      stats,
    });
  }

  // 按最新场均得分排序
  players.sort((a, b) => (b.stats.pts || 0) - (a.stats.pts || 0));

  const targetDir = path.resolve(process.cwd(), ".data", "rockets");
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, "players.json"), JSON.stringify(players, null, 2), "utf-8");

  console.log(`Successfully saved ${players.length} active Houston Rockets players to .data/rockets/players.json`);
  for (const p of players) {
    console.log(`- #${p.number} ${p.nameCn} (${p.nameEn}) [${p.position}]: ${p.stats.pts} PTS, ${p.stats.reb} REB, ${p.stats.ast} AST (${p.currentSeason})`);
  }
}

main().catch((e) => {
  console.error("Error running sync script:", e);
  process.exit(1);
});
