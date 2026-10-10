export interface OpponentInfo {
  name: string;
  city: string;
  abbr: string;
  color: string;
  logoText: string;
}

export interface GameItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  opponent: OpponentInfo;
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

  // 当前默认展示赛季 (2025-26)
  currentSeason: string;
  // 支持切换的历史常规赛及生涯统计
  seasons: Record<string, SeasonAverages>;
  // 支持切换的历史季后赛统计
  playoffSeasons?: Record<string, SeasonAverages>;
  // 当前赛季常规数据快捷访问
  stats: SeasonAverages;
  // 当前赛季季后赛数据快捷访问 (若打进季后赛)
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
