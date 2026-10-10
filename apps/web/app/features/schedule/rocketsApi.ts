export interface GameItem {
  id: string;
  date: string;
  time: string;
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
  stage: "preseason" | "regular" | "cup";
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

export interface PlayerBoxscoreItem {
  name: string;
  rawName: string;
  number: string;
  position: string;
  minutes: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fg: string;
  fgPct: string;
  threePt: string;
  ft: string;
  plusMinus: string;
}

export interface GameBreakdownData {
  game: GameItem;
  quarters: {
    rockets: number[];
    opponent: number[];
  };
  rocketsPlayers: PlayerBoxscoreItem[];
  opponentPlayers: PlayerBoxscoreItem[];
}

export interface SeasonAverages {
  season: string;
  gp: number;
  gs: number;
  mpg: number;
  fg: string;
  fgPct: number;
  threePt: string;
  threePtPct: number;
  ft: string;
  ftPct: number;
  reb: number;
  oReb: number;
  dReb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  pts: number;
}

export interface PlayerStatsData {
  id: string;
  nameCn: string;
  nameEn: string;
  number: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  experience: string;
  draftInfo: string;
  college: string;
  headshotUrl: string;

  currentSeason: string;
  seasons: Record<string, SeasonAverages>;
  playoffSeasons?: Record<string, SeasonAverages>;
  stats: SeasonAverages;
  playoffStats?: SeasonAverages;
}

export interface TeamStandingItem {
  id: string;
  rank: number;
  name: string;
  city: string;
  abbr: string;
  logo: string;
  wins: number;
  losses: number;
  winPct: string;
  gamesBehind: string;
  streak: string;
  lastTen: string;
  homeRecord: string;
  awayRecord: string;
  pointsFor: number;
  pointsAgainst: number;
  diff: string;
  isRockets?: boolean;
}

export interface StandingsData {
  conference: string;
  season: string;
  updatedAt: string;
  isOffseason: boolean;
  rocketsRank?: number;
  entries: TeamStandingItem[];
}

/** 从后端 API 拉取火箭全季赛程 */
export async function fetchRocketsSchedule(): Promise<GameItem[]> {
  try {
    const res = await fetch("/api/site/rockets/schedule");
    if (res.ok) {
      return (await res.json()) as GameItem[];
    }
  } catch {
    // ignore
  }
  return [];
}

/** 从后端 API 拉取单场比赛比分与全场技术统计 (Boxscore) */
export async function fetchGameBreakdown(gameId: string): Promise<GameBreakdownData | null> {
  try {
    const res = await fetch(`/api/site/rockets/games/${encodeURIComponent(gameId)}`);
    if (res.ok) {
      return (await res.json()) as GameBreakdownData;
    }
  } catch {
    // ignore
  }
  return null;
}

/** 从后端 API 拉取全队球员及其多赛季数据 */
export async function fetchRocketsPlayers(): Promise<PlayerStatsData[]> {
  try {
    const res = await fetch("/api/site/rockets/players");
    if (res.ok) {
      return (await res.json()) as PlayerStatsData[];
    }
  } catch {
    // ignore
  }
  return [];
}

/** 从后端 API 拉取单球员详细档案 */
export async function fetchPlayerDetail(playerId: string): Promise<PlayerStatsData | null> {
  try {
    const res = await fetch(`/api/site/rockets/players/${encodeURIComponent(playerId)}`);
    if (res.ok) {
      return (await res.json()) as PlayerStatsData;
    }
  } catch {
    // ignore
  }
  return null;
}

/** 从后端 API 拉取西部联盟排名 */
export async function fetchRocketsStandings(): Promise<StandingsData | null> {
  try {
    const res = await fetch("/api/site/rockets/standings");
    if (res.ok) {
      return (await res.json()) as StandingsData;
    }
  } catch {
    // ignore
  }
  return null;
}

/** 触发后端实时抓取与同步 */
export async function triggerRocketsSync(): Promise<{ success: boolean; scheduleCount?: number; standingsUpdated?: boolean }> {
  try {
    const res = await fetch("/api/site/rockets/sync", { method: "POST" });
    if (res.ok) {
      return (await res.json()) as { success: boolean; scheduleCount?: number; standingsUpdated?: boolean };
    }
  } catch {
    // ignore
  }
  return { success: false };
}
