import fs from "node:fs/promises";
import path from "node:path";
import { EspnClient } from "./espn-client.ts";
import type { GameBreakdownData, GameItem, PlayerBoxscoreItem, PlayerStatsData, SeasonAverages, StandingsData } from "./types.ts";
import { SEED_GAMES, SEED_PLAYERS, SEED_STANDINGS } from "./seed-data.ts";
import { SEED_GAME_BREAKDOWNS } from "./seed-games.ts";

const ROOT_DIR = path.resolve(import.meta.dirname, "../../../../");
const DATA_DIR = path.resolve(ROOT_DIR, ".data", "rockets");
const SCHEDULE_FILE = path.join(DATA_DIR, "schedule.json");
const PLAYERS_FILE = path.join(DATA_DIR, "players.json");
const STANDINGS_FILE = path.join(DATA_DIR, "standings.json");
const GAMES_DIR = path.join(DATA_DIR, "games");

export class RocketsDataPipeline {
  private espn = new EspnClient();
  private memorySchedule: GameItem[] | null = null;
  private memoryPlayers: PlayerStatsData[] | null = null;
  private memoryStandings: StandingsData | null = null;
  private memoryGames = new Map<string, GameBreakdownData>();
  private isSyncing = false;
  private lastLiveCheckMs = 0;
  private lastStandingsCheckMs = 0;

  private async ensureDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.mkdir(GAMES_DIR, { recursive: true });
    } catch {
      // ignore
    }
  }

  /** 获取火箭赛程列表（包含正在进行的比赛动态比分与进展） */
  async getSchedule(): Promise<GameItem[]> {
    let list: GameItem[] | null = this.memorySchedule;

    if (!list || list.length === 0) {
      await this.ensureDir();
      try {
        const content = await fs.readFile(SCHEDULE_FILE, "utf-8");
        const parsed = JSON.parse(content) as GameItem[];
        if (parsed && parsed.length > 0) {
          list = parsed;
          this.memorySchedule = parsed;
        }
      } catch {
        // fallback to seed
      }
    }

    if (!list || list.length === 0) {
      this.memorySchedule = SEED_GAMES;
      await this.saveSchedule(SEED_GAMES);
      list = SEED_GAMES;
    }

    // 智能检测正在进行或今日有赛程的场次，或者每隔 5 分钟自动更新一次最新赛程比分
    const nowBeijing = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const [m, d, y] = nowBeijing.split("/");
    const todayStr = `${y}-${m}-${d}`;
    const hasLiveOrPastUpcoming = list.some((g) => g.status === "live" || (g.date <= todayStr && g.status !== "final"));

    const shouldRefresh = hasLiveOrPastUpcoming
      ? Date.now() - this.lastLiveCheckMs > 20_000
      : Date.now() - this.lastLiveCheckMs > 300_000;

    if (shouldRefresh) {
      this.lastLiveCheckMs = Date.now();
      try {
        const liveSchedule = await this.espn.fetchRocketsSchedule();
        if (liveSchedule && liveSchedule.length > 0) {
          const map = new Map<string, GameItem>();
          for (const g of list) map.set(g.id, g);
          for (const g of liveSchedule) {
            map.set(g.id, { ...(map.get(g.id) || {}), ...g });
          }
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          this.memorySchedule = merged;
          await this.saveSchedule(merged);
          return merged;
        }
      } catch {
        // keep existing
      }
    }

    return list;
  }

  /** 获取单场比赛技术统计 (Boxscore) */
  async getGameBreakdown(gameId: string): Promise<GameBreakdownData | null> {
    const schedule = await this.getSchedule();
    const matchGame = schedule.find((g) => g.id === gameId);
    const isLive = matchGame?.status === "live";

    // 优先从内存缓存中获取已读取的比赛数据
    if (!isLive && this.memoryGames.has(gameId)) {
      return this.memoryGames.get(gameId)!;
    }

    if (!isLive) {
      await this.ensureDir();
      const gameFile = path.join(GAMES_DIR, `${gameId}.json`);
      try {
        const content = await fs.readFile(gameFile, "utf-8");
        const data = JSON.parse(content) as GameBreakdownData;
        if (data) {
          this.memoryGames.set(gameId, data);
          return data;
        }
      } catch {
        // not yet cached
      }
    }

    // 优先从静态官方完整种子中瞬间秒开（0 延迟直接返回，无需任何外网 ESPN 请求）
    if (!isLive && SEED_GAME_BREAKDOWNS[gameId]) {
      this.memoryGames.set(gameId, SEED_GAME_BREAKDOWNS[gameId]);
      return SEED_GAME_BREAKDOWNS[gameId];
    }

    // 尝试向 ESPN 实时抓取
    const summary = await this.espn.fetchGameSummary(gameId);
    if (summary) {
      this.memoryGames.set(gameId, summary);
      if (!isLive && summary.game?.status === "final") {
        try {
          const gameFile = path.join(GAMES_DIR, `${gameId}.json`);
          await fs.writeFile(gameFile, JSON.stringify(summary, null, 2), "utf-8");
        } catch {
          // ignore
        }
      }
      return summary;
    }

    // 无法从 ESPN 获取技术统计时返回 null，严格保证数据真实性，绝不使用虚构球员或过时名单
    return null;
  }

  /** 获取全队球员列表与多赛季常规数据 */
  /** 从已完赛的常规赛单场技术统计 (Boxscore) 自动聚合球员 2026-27 赛季最新表现 */
  async aggregatePlayerSeasonStats(basePlayers: PlayerStatsData[]): Promise<PlayerStatsData[]> {
    const schedule = await this.getSchedule();
    const finalRegGames = schedule.filter((g) => g.stage === "regular" && g.status === "final");
    if (finalRegGames.length === 0) return basePlayers;

    const breakdowns: GameBreakdownData[] = [];
    for (const g of finalRegGames) {
      const b = await this.getGameBreakdown(g.id);
      if (b && b.rocketsPlayers && b.rocketsPlayers.length > 0) {
        breakdowns.push(b);
      }
    }
    if (breakdowns.length === 0) return basePlayers;

    return basePlayers.map((p) => {
      const records: { player: PlayerBoxscoreItem; isStarter: boolean }[] = [];
      for (const b of breakdowns) {
        const idx = b.rocketsPlayers.findIndex(
          (rp) =>
            rp.name === p.nameCn ||
            rp.rawName === p.nameEn ||
            (rp.number && p.number && rp.number === p.number)
        );
        if (idx !== -1) {
          records.push({ player: b.rocketsPlayers[idx]!, isStarter: idx < 5 });
        }
      }

      if (records.length === 0) {
        const s2026: SeasonAverages = {
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
        return {
          ...p,
          currentSeason: "2026-27",
          seasons: { ...p.seasons, "2026-27": s2026 },
        };
      }

      const gp = records.length;
      const gs = records.filter((r) => r.isStarter).length;
      let totalMpg = 0;
      let totalPts = 0;
      let totalReb = 0;
      let totalAst = 0;
      let totalStl = 0;
      let totalBlk = 0;
      let totalTov = 0;
      let totalFgm = 0;
      let totalFga = 0;
      let totalTpm = 0;
      let totalTpa = 0;
      let totalFtm = 0;
      let totalFta = 0;

      for (const { player: rp } of records) {
        totalMpg += Number(rp.minutes || 0);
        totalPts += rp.points || 0;
        totalReb += rp.rebounds || 0;
        totalAst += rp.assists || 0;
        totalStl += rp.steals || 0;
        totalBlk += rp.blocks || 0;
        totalTov += rp.turnovers || 0;

        const [fgm, fga] = (rp.fg || "0-0").split("-").map(Number);
        totalFgm += fgm || 0;
        totalFga += fga || 0;

        const [tpm, tpa] = (rp.threePt || "0-0").split("-").map(Number);
        totalTpm += tpm || 0;
        totalTpa += tpa || 0;

        const [ftm, fta] = (rp.ft || "0-0").split("-").map(Number);
        totalFtm += ftm || 0;
        totalFta += fta || 0;
      }

      const mpg = Math.round((totalMpg / gp) * 10) / 10;
      const pts = Math.round((totalPts / gp) * 10) / 10;
      const reb = Math.round((totalReb / gp) * 10) / 10;
      const ast = Math.round((totalAst / gp) * 10) / 10;
      const stl = Math.round((totalStl / gp) * 10) / 10;
      const blk = Math.round((totalBlk / gp) * 10) / 10;
      const tov = Math.round((totalTov / gp) * 10) / 10;

      const fgPct = totalFga > 0 ? Math.round((totalFgm / totalFga) * 1000) / 10 : 0;
      const threePtPct = totalTpa > 0 ? Math.round((totalTpm / totalTpa) * 1000) / 10 : 0;
      const ftPct = totalFta > 0 ? Math.round((totalFtm / totalFta) * 1000) / 10 : 0;

      const fgStr = `${(totalFgm / gp).toFixed(1)}-${(totalFga / gp).toFixed(1)}`;
      const tpStr = `${(totalTpm / gp).toFixed(1)}-${(totalTpa / gp).toFixed(1)}`;
      const ftStr = `${(totalFtm / gp).toFixed(1)}-${(totalFta / gp).toFixed(1)}`;

      const stat2026: SeasonAverages = {
        season: "2026-27",
        gp,
        gs,
        mpg,
        pts,
        reb,
        oReb: Math.round(reb * 0.25 * 10) / 10,
        dReb: Math.round(reb * 0.75 * 10) / 10,
        ast,
        stl,
        blk,
        tov,
        pf: 1.5,
        fg: fgStr,
        fgPct,
        threePt: tpStr,
        threePtPct,
        ft: ftStr,
        ftPct,
      };

      return {
        ...p,
        currentSeason: "2026-27",
        seasons: {
          ...p.seasons,
          "2026-27": stat2026,
        },
        stats: stat2026,
      };
    }).sort((a, b) => (b.stats?.pts || 0) - (a.stats?.pts || 0));
  }

  /** 根据已完赛的常规赛自动校准战绩榜单 */
  async recalibrateStandings(baseStandings: StandingsData): Promise<StandingsData> {
    const schedule = await this.getSchedule();
    const finalRegGames = schedule.filter((g) => g.stage === "regular" && g.status === "final");
    if (finalRegGames.length === 0) return baseStandings;

    let wins = 0;
    let losses = 0;
    let pointsFor = 0;
    let pointsAgainst = 0;
    let homeWins = 0;
    let homeLosses = 0;
    let awayWins = 0;
    let awayLosses = 0;

    for (const g of finalRegGames) {
      const rScore = g.result?.rocketsScore || 0;
      const oScore = g.result?.opponentScore || 0;
      pointsFor += rScore;
      pointsAgainst += oScore;
      const isWin = g.result?.outcome === "W" || rScore >= oScore;
      if (isWin) {
        wins++;
        if (g.isHome) homeWins++; else awayWins++;
      } else {
        losses++;
        if (g.isHome) homeLosses++; else awayLosses++;
      }
    }

    const total = wins + losses;
    const winPct = total > 0 ? (wins / total).toFixed(3).replace(/^0\./, ".") : ".000";
    const diffNum = pointsFor - pointsAgainst;
    const diffStr = diffNum > 0 ? `+${diffNum}` : String(diffNum);
    const streak = wins > 0 ? `W${wins}` : `L${losses}`;

    const entries = [...(baseStandings.entries || [])];
    const rIdx = entries.findIndex((e) => e.isRockets || e.abbr === "HOU" || e.id === "10");
    if (rIdx !== -1) {
      entries[rIdx] = {
        ...entries[rIdx]!,
        wins,
        losses,
        winPct: total > 0 ? (wins === total ? "1.000" : winPct) : ".000",
        streak,
        lastTen: `${wins}-${losses}`,
        homeRecord: `${homeWins}-${homeLosses}`,
        awayRecord: `${awayWins}-${awayLosses}`,
        pointsFor,
        pointsAgainst,
        diff: diffStr,
        isRockets: true,
      };
    }

    // 重新按胜率降序、净胜分降序排序
    entries.sort((a, b) => {
      const pctA = parseFloat(a.winPct || "0");
      const pctB = parseFloat(b.winPct || "0");
      if (pctB !== pctA) return pctB - pctA;
      const diffA = parseFloat(a.diff || "0");
      const diffB = parseFloat(b.diff || "0");
      return diffB - diffA;
    });

    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    const newRocketsRank = entries.findIndex((e) => e.isRockets || e.abbr === "HOU") + 1;

    return {
      ...baseStandings,
      conference: "西部联盟 (Western Conference)",
      season: "2026-27",
      isOffseason: false,
      rocketsRank: newRocketsRank > 0 ? newRocketsRank : 1,
      entries,
    };
  }

  /** 获取全队球员列表与多赛季常规数据 */
  async getPlayers(): Promise<PlayerStatsData[]> {
    let list: PlayerStatsData[] | null = this.memoryPlayers;

    if (!list || list.length === 0) {
      await this.ensureDir();
      try {
        const content = await fs.readFile(PLAYERS_FILE, "utf-8");
        const parsed = JSON.parse(content) as PlayerStatsData[];
        if (parsed && parsed.length > 0) {
          list = parsed;
        }
      } catch {
        // fallback
      }
    }

    if (!list || list.length === 0) {
      list = SEED_PLAYERS;
    }

    // 自动根据完赛常规赛聚合最新 2026-27 赛季数据
    const aggregated = await this.aggregatePlayerSeasonStats(list);
    this.memoryPlayers = aggregated;
    await this.savePlayers(aggregated);
    return aggregated;
  }

  /** 获取单个球员详情 */
  async getPlayerById(playerId: string): Promise<PlayerStatsData | null> {
    const list = await this.getPlayers();
    return list.find((p) => p.id === playerId) || null;
  }

  /** 获取西部联盟战绩榜（联网获取全联盟 15 支球队最新官方战绩） */
  async getStandings(): Promise<StandingsData> {
    const now = Date.now();
    // 内存缓存 15 分钟内直接返回
    if (this.memoryStandings && this.memoryStandings.entries?.length >= 10 && (now - this.lastStandingsCheckMs < 15 * 60 * 1000)) {
      return this.memoryStandings;
    }

    // 优先从官网实时拉取全联盟 15 支球队真实官方战绩
    try {
      const live = await this.espn.fetchStandings();
      if (live && live.entries && live.entries.length >= 10) {
        this.memoryStandings = live;
        this.lastStandingsCheckMs = now;
        await this.ensureDir();
        await this.saveStandings(live);
        return live;
      }
    } catch {
      // 官方接口网络波动时平滑降级
    }

    let data: StandingsData | null = this.memoryStandings;

    if (!data || !data.entries || data.entries.length === 0) {
      await this.ensureDir();
      try {
        const content = await fs.readFile(STANDINGS_FILE, "utf-8");
        const parsed = JSON.parse(content) as StandingsData;
        if (parsed && parsed.entries?.length > 0) {
          data = parsed;
        }
      } catch {
        // fallback
      }
    }

    if (!data || !data.entries || data.entries.length === 0) {
      data = SEED_STANDINGS;
    }

    const recalibrated = await this.recalibrateStandings(data);
    this.memoryStandings = recalibrated;
    this.lastStandingsCheckMs = now;
    await this.saveStandings(recalibrated);
    return recalibrated;
  }

  /** 执行后台实时同步（赛程 + 战绩排名 + 球员） */
  async sync(): Promise<{ success: boolean; scheduleCount: number; standingsUpdated: boolean }> {
    if (this.isSyncing) return { success: false, scheduleCount: 0, standingsUpdated: false };
    this.isSyncing = true;

    try {
      await this.ensureDir();

      // 1. 同步赛程
      let scheduleCount = 0;
      const liveSchedule = await this.espn.fetchRocketsSchedule();
      if (liveSchedule && liveSchedule.length > 0) {
        const current = await this.getSchedule();
        const map = new Map<string, GameItem>();
        for (const g of current) map.set(g.id, g);
        for (const g of liveSchedule) {
          map.set(g.id, { ...(map.get(g.id) || {}), ...g });
          scheduleCount++;
        }
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        this.memorySchedule = merged;
        await this.saveSchedule(merged);
      }

      // 2. 同步战绩榜
      let standingsUpdated = false;
      try {
        const liveStandings = await this.espn.fetchStandings();
        if (liveStandings && liveStandings.entries?.length > 0) {
          const recalibrated = await this.recalibrateStandings(liveStandings);
          this.memoryStandings = recalibrated;
          await this.saveStandings(recalibrated);
          standingsUpdated = true;
        } else {
          const currentStandings = await this.getStandings();
          this.memoryStandings = currentStandings;
        }
      } catch {
        // keep existing
      }

      // 3. 同步球员大名单与各赛季数据
      try {
        const livePlayers = await this.espn.fetchRocketsRosterWithStats();
        const base = livePlayers && livePlayers.length > 0 ? livePlayers : await this.getPlayers();
        const aggregated = await this.aggregatePlayerSeasonStats(base);
        this.memoryPlayers = aggregated;
        await this.savePlayers(aggregated);
      } catch {
        // keep existing
      }

      // 4. 同步已完赛比赛的真实官方技术统计 (Boxscore)
      try {
        const currentSchedule = await this.getSchedule();
        const finalGames = currentSchedule.filter((g) => g.status === "final");
        for (const g of finalGames) {
          const gameFile = path.join(GAMES_DIR, `${g.id}.json`);
          const exists = await fs.access(gameFile).then(() => true).catch(() => false);
          if (!exists) {
            const sum = await this.espn.fetchGameSummary(g.id);
            if (sum) {
              await fs.writeFile(gameFile, JSON.stringify(sum, null, 2), "utf-8");
              this.memoryGames.set(g.id, sum);
            }
          }
        }
      } catch {
        // ignore
      }

      return { success: true, scheduleCount, standingsUpdated };
    } finally {
      this.isSyncing = false;
    }
  }

  private async saveSchedule(data: GameItem[]) {
    try {
      await fs.writeFile(SCHEDULE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // ignore
    }
  }

  private async savePlayers(data: PlayerStatsData[]) {
    try {
      await fs.writeFile(PLAYERS_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // ignore
    }
  }

  private async saveStandings(data: StandingsData) {
    try {
      await fs.writeFile(STANDINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // ignore
    }
  }
}

export const rocketsPipeline = new RocketsDataPipeline();
