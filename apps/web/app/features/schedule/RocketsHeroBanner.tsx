import type { StandingsData } from "./rocketsApi";

interface Props {
  standings: StandingsData | null;
  totalGames: number;
  totalPlayers: number;
}

export function RocketsHeroBanner({
  standings,
  totalGames,
  totalPlayers,
}: Props) {
  // 季前赛官方不计排位，等常规赛正式打响（10月23日常规赛揭幕后）并抓取到真实战绩排名后更新，目前统一呈现 “#”
  const isRegularSeasonStarted = Boolean(
    standings &&
    !standings.isOffseason &&
    standings.season === "2026-27" &&
    typeof standings.rocketsRank === "number" &&
    standings.rocketsRank > 0
  );
  const rankDisplay = isRegularSeasonStarted ? `西部第 ${standings?.rocketsRank}` : "#";

  return (
    <div className="bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 左侧：火箭官方高精队标与主标题 */}
        <div className="flex items-center gap-3.5">
          <img
            src="https://a.espncdn.com/i/teamlogos/nba/500/hou.png"
            alt="休斯敦火箭"
            className="w-12 h-12 object-contain flex-shrink-0 drop-shadow-xs"
            loading="eager"
          />
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              休斯敦火箭 · 赛事战报与技术统计中心
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              全季 83 场官方赛程 · 单场球员技术统计 (Boxscore) · 现役大名单与生涯历史对照
            </p>
          </div>
        </div>

        {/* 右侧：统计指标（大名单、场次、球队排名保持一致并列） */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-zinc-300">
            <span>官方大名单:</span>
            <strong className="text-slate-900 dark:text-white font-mono">{totalPlayers} 人</strong>
            <span className="text-slate-300 dark:text-zinc-700">|</span>
            <span>赛程场次:</span>
            <strong className="text-slate-900 dark:text-white font-mono">{totalGames} 场</strong>
            <span className="text-slate-300 dark:text-zinc-700">|</span>
            <span>球队排名:</span>
            <strong className="text-[#CE1141] font-mono font-bold">{rankDisplay}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
