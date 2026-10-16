import fs from "node:fs/promises";
import path from "node:path";
import { EspnClient } from "./espn-client.ts";
import type { GameBreakdownData, GameItem, PlayerStatsData, StandingsData } from "./types.ts";
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

    // 智能检测正在进行或今日有赛程的场次，20秒以上则自动触发微轮询同步
    const nowBeijing = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const [m, d, y] = nowBeijing.split("/");
    const todayStr = `${y}-${m}-${d}`;
    const hasLiveOrPastUpcoming = list.some((g) => g.status === "live" || (g.date <= todayStr && g.status !== "final"));

    if (hasLiveOrPastUpcoming && Date.now() - this.lastLiveCheckMs > 20_000) {
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

    // 优先从静态官方完整种子中瞬间秒开（0 延迟直接返回，无需任何外网 ESPN 请求）
    if (!isLive && SEED_GAME_BREAKDOWNS[gameId]) {
      this.memoryGames.set(gameId, SEED_GAME_BREAKDOWNS[gameId]);
      return SEED_GAME_BREAKDOWNS[gameId];
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
  async getPlayers(): Promise<PlayerStatsData[]> {
    if (this.memoryPlayers && this.memoryPlayers.length > 0) {
      return this.memoryPlayers;
    }

    await this.ensureDir();
    try {
      const content = await fs.readFile(PLAYERS_FILE, "utf-8");
      const list = JSON.parse(content) as PlayerStatsData[];
      if (list && list.length > 0) {
        this.memoryPlayers = list;
        return list;
      }
    } catch {
      // fallback
    }

    this.memoryPlayers = SEED_PLAYERS;
    await this.savePlayers(SEED_PLAYERS);
    return SEED_PLAYERS;
  }

  /** 获取单个球员详情 */
  async getPlayerById(playerId: string): Promise<PlayerStatsData | null> {
    const list = await this.getPlayers();
    return list.find((p) => p.id === playerId) || null;
  }

  /** 获取西部联盟战绩榜 */
  async getStandings(): Promise<StandingsData> {
    if (this.memoryStandings && this.memoryStandings.entries?.length > 0) {
      return this.memoryStandings;
    }

    await this.ensureDir();
    try {
      const content = await fs.readFile(STANDINGS_FILE, "utf-8");
      const data = JSON.parse(content) as StandingsData;
      if (data && data.entries?.length > 0) {
        this.memoryStandings = data;
        return data;
      }
    } catch {
      // fallback
    }

    this.memoryStandings = SEED_STANDINGS;
    await this.saveStandings(SEED_STANDINGS);
    return SEED_STANDINGS;
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
          this.memoryStandings = liveStandings;
          await this.saveStandings(liveStandings);
          standingsUpdated = true;
        }
      } catch {
        // keep existing
      }

      // 3. 同步球员大名单与各赛季数据
      try {
        const livePlayers = await this.espn.fetchRocketsRosterWithStats();
        if (livePlayers && livePlayers.length > 0) {
          this.memoryPlayers = livePlayers;
          await this.savePlayers(livePlayers);
        }
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
