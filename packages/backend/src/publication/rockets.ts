import { rocketsPipeline } from "../nba/pipeline.ts";
import type { GameBreakdownData, GameItem, PlayerStatsData, StandingsData } from "../nba/types.ts";

export async function loadRocketsSchedule(): Promise<GameItem[]> {
  return await rocketsPipeline.getSchedule();
}

export async function loadRocketsGameBreakdown(gameId: string): Promise<GameBreakdownData | null> {
  return await rocketsPipeline.getGameBreakdown(gameId);
}

export async function loadRocketsPlayers(): Promise<PlayerStatsData[]> {
  return await rocketsPipeline.getPlayers();
}

export async function loadRocketsPlayerDetail(playerId: string): Promise<PlayerStatsData | null> {
  return await rocketsPipeline.getPlayerById(playerId);
}

export async function loadRocketsStandings(): Promise<StandingsData> {
  return await rocketsPipeline.getStandings();
}

export async function triggerRocketsSync(): Promise<{ success: boolean; scheduleCount: number; standingsUpdated: boolean }> {
  return await rocketsPipeline.sync();
}
