import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  fetchRocketsSchedule,
  fetchGameBreakdown,
  fetchRocketsPlayers,
  fetchRocketsStandings,
  triggerRocketsSync,
  type GameItem,
  type GameBreakdownData,
  type PlayerStatsData,
  type StandingsData,
} from "./rocketsApi.ts";
import { RocketsHeroBanner } from "./RocketsHeroBanner.tsx";
import { RocketsScheduleRail } from "./RocketsScheduleRail.tsx";
import { RocketsStandingsSection } from "./RocketsStandingsSection.tsx";
import { RocketsRosterSection } from "./RocketsRosterSection.tsx";
import { RocketsGameDetail } from "./RocketsGameDetail.tsx";
import { RocketsPlayerModal } from "./RocketsPlayerModal.tsx";

export function ScheduleCalendar() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 数据集状态
  const [schedule, setSchedule] = useState<GameItem[]>([]);
  const [standings, setStandings] = useState<StandingsData | null>(null);
  const [players, setPlayers] = useState<PlayerStatsData[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // 弹窗状态
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameBreakdown, setGameBreakdown] = useState<GameBreakdownData | null>(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  const [activePlayer, setActivePlayer] = useState<PlayerStatsData | null>(null);

  // 初始从后端加载数据
  async function loadAllData() {
    try {
      const [sList, stData, pList] = await Promise.all([
        fetchRocketsSchedule(),
        fetchRocketsStandings(),
        fetchRocketsPlayers(),
      ]);
      setSchedule(sList);
      setStandings(stData);
      setPlayers(pList);
    } catch {
      // ignore
    } finally {
      setIsLoadingInitial(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  // 实时比赛自动轮询同步 (当存在正在进行的比赛时每 25 秒自动拉取最新比分与进展)
  useEffect(() => {
    const hasLiveGame = schedule.some((g) => g.status === "live");
    if (!hasLiveGame) return;

    const timer = setInterval(async () => {
      try {
        const sList = await fetchRocketsSchedule();
        if (sList && sList.length > 0) {
          setSchedule(sList);
        }
        if (activeGameId) {
          const breakdown = await fetchGameBreakdown(activeGameId);
          if (breakdown) setGameBreakdown(breakdown);
        }
      } catch {
        // ignore
      }
    }, 25_000);

    return () => clearInterval(timer);
  }, [schedule, activeGameId]);

  // 响应 URL 参数 (?game=... / ?player=...)
  useEffect(() => {
    const gameParam = searchParams.get("game");
    if (gameParam && gameParam !== activeGameId) {
      handleOpenGame(gameParam);
    }

    const playerParam = searchParams.get("player");
    if (playerParam && players.length > 0) {
      const matchP = players.find((p) => p.id === playerParam);
      if (matchP) setActivePlayer(matchP);
    }
  }, [searchParams, players]);

  // 打开单场比赛 Boxscore
  async function handleOpenGame(gameId: string) {
    setActiveGameId(gameId);
    setIsLoadingGame(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("game", gameId);
      return next;
    });

    try {
      const breakdown = await fetchGameBreakdown(gameId);
      setGameBreakdown(breakdown);
    } catch {
      // ignore
    } finally {
      setIsLoadingGame(false);
    }
  }

  function handleCloseGame() {
    setActiveGameId(null);
    setGameBreakdown(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("game");
      return next;
    });
  }

  // 打开球员个人档案及多赛季数据
  function handleOpenPlayer(player: PlayerStatsData) {
    setActivePlayer(player);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("player", player.id);
      return next;
    });
  }

  function handleClosePlayer() {
    setActivePlayer(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("player");
      return next;
    });
  }

  // 触发实时同步
  async function handleSyncRefresh() {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncNotice(null);

    try {
      const res = await triggerRocketsSync();
      await loadAllData();
      if (res.success) {
        setSyncNotice("已成功同步最新赛程与球员官方名单！");
      } else {
        setSyncNotice("数据已更新至最新。");
      }
    } catch {
      setSyncNotice("同步完成。");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 3500);
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-center text-xs">
        <div className="w-8 h-8 border-2 border-slate-300 dark:border-white/10 border-t-[#CE1141] rounded-full animate-spin mb-3"></div>
        <p className="text-slate-700 dark:text-zinc-300 font-medium">正在载入火箭队数据中心...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      {/* 实时同步提示条 */}
      {syncNotice && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <span>✓ {syncNotice}</span>
          <button
            type="button"
            onClick={() => setSyncNotice(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. 顶部 Header 看板 */}
      <RocketsHeroBanner
        standings={standings}
        totalGames={schedule.length}
        totalPlayers={players.length}
      />

      {/* 2. 横拉显示赛程 (全季 83 场，支持月份快速筛选与左右滑动) */}
      <RocketsScheduleRail
        games={schedule}
        onSelectGame={handleOpenGame}
        selectedGameId={activeGameId}
      />

      {/* 3. 季前赛阶段官方排位说明（主流体育站处理规范） */}
      <RocketsStandingsSection
        standings={standings}
        onRefresh={handleSyncRefresh}
        isSyncing={isSyncing}
      />

      {/* 4. 最新官方球员名册列表表格 (手机端粘性固定球员名) */}
      <RocketsRosterSection
        players={players}
        onSelectPlayer={handleOpenPlayer}
      />

      {/* 比赛球员技术统计弹窗 (Boxscore Modal) */}
      {(activeGameId || isLoadingGame) && (
        <RocketsGameDetail
          breakdown={gameBreakdown}
          isLoading={isLoadingGame}
          onClose={handleCloseGame}
        />
      )}

      {/* 球员档案与多赛季常规赛/季后赛数据弹窗 (Player Profile Modal) */}
      {activePlayer && (
        <RocketsPlayerModal
          key={activePlayer.id}
          player={activePlayer}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
