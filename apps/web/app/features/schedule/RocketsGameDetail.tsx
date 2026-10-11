import { useState } from "react";
import type { GameBreakdownData, PlayerBoxscoreItem } from "./rocketsApi";

interface Props {
  breakdown: GameBreakdownData | null;
  isLoading: boolean;
  onClose: () => void;
}

export function RocketsGameDetail({ breakdown, isLoading, onClose }: Props) {
  const [activeTeamTab, setActiveTeamTab] = useState<"rockets" | "opponent">("rockets");

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-[#14161b] border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl">
          <div className="w-8 h-8 border-2 border-[#CE1141] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-900 dark:text-white text-xs font-semibold">正在载入官方技术统计...</p>
        </div>
      </div>
    );
  }

  if (!breakdown) return null;

  const { game, quarters, rocketsPlayers, opponentPlayers } = breakdown;
  const isFinal = game.status === "final";
  const isLive = game.status === "live";
  const isRocketsWin = game.result?.outcome === "W";
  const rScore = game.result?.rocketsScore ?? 0;
  const oScore = game.result?.opponentScore ?? 0;
  const currentPlayers = activeTeamTab === "rockets" ? rocketsPlayers : opponentPlayers;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部比赛比分大看板：使用官方队徽，摒弃虎扑方块缩写 */}
        <div className="relative bg-slate-50 dark:bg-[#15181e] p-4 sm:p-5 border-b border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/15 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors text-sm"
            title="关闭"
          >
            ✕
          </button>

          {/* 比赛双方与比分对阵 */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* 火箭队 */}
            <div className="flex flex-col items-center flex-1 text-center">
              <img
                src="https://a.espncdn.com/i/teamlogos/nba/500/hou.png"
                alt="休斯敦火箭"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-1 drop-shadow-xs"
                loading="eager"
              />
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">休斯敦火箭</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">{game.isHome ? "主场" : "客场"}</span>
              <span className={`text-2xl sm:text-4xl font-black font-mono mt-0.5 ${rScore > oScore || isLive ? "text-[#CE1141]" : "text-slate-700 dark:text-zinc-300"}`}>
                {rScore}
              </span>
            </div>

            {/* 比分分隔与比赛状态 */}
            <div className="flex flex-col items-center px-4 sm:px-6">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider mb-1 ${
                  isLive
                    ? "bg-[#CE1141] text-white shadow-xs animate-pulse"
                    : isRocketsWin
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                }`}
              >
                {isLive ? `🔴 进行中 · ${game.progress || "实时战况"}` : isRocketsWin ? "火箭胜" : "告负"}
              </span>
              <span className="text-xs text-slate-600 dark:text-zinc-400 font-mono font-medium">{game.date} · {game.time} (北京时间)</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 truncate max-w-[150px]">
                {game.id === "401898395" || game.id === "401898400" || game.arena?.toLowerCase().includes("venetian")
                  ? "澳门威尼斯人综艺馆"
                  : game.arena}
              </span>
            </div>

            {/* 对手球队 */}
            <div className="flex flex-col items-center flex-1 text-center">
              <img
                src={`https://a.espncdn.com/i/teamlogos/nba/500/${game.opponent.abbr.toLowerCase()}.png`}
                alt={game.opponent.name}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-1 drop-shadow-xs"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate max-w-[130px]">
                {game.opponent.city} {game.opponent.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">{game.isHome ? "客场" : "主场"}</span>
              <span className={`text-2xl sm:text-4xl font-black font-mono mt-0.5 ${oScore > rScore ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-zinc-400"}`}>
                {oScore}
              </span>
            </div>
          </div>

          {/* 四节比分拆解 */}
          {quarters && quarters.rockets && quarters.rockets.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-white/5 max-w-md mx-auto">
              <div className="grid grid-cols-6 text-center text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                <span className="text-left font-sans text-slate-400 dark:text-zinc-500">节次</span>
                <span>1节</span>
                <span>2节</span>
                <span>3节</span>
                <span>4节</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">总计</span>
              </div>
              <div className="grid grid-cols-6 text-center text-xs text-slate-900 dark:text-white font-mono mt-1 py-1 px-2 rounded bg-slate-100/70 dark:bg-white/[0.03]">
                <span className="text-left font-sans text-[#CE1141] font-bold">火箭</span>
                <span>{quarters.rockets[0] ?? "-"}</span>
                <span>{quarters.rockets[1] ?? "-"}</span>
                <span>{quarters.rockets[2] ?? "-"}</span>
                <span>{quarters.rockets[3] ?? "-"}</span>
                <span className="font-bold text-[#CE1141]">{rScore}</span>
              </div>
              <div className="grid grid-cols-6 text-center text-xs text-slate-700 dark:text-zinc-300 font-mono mt-0.5 py-1 px-2 rounded bg-slate-100/70 dark:bg-white/[0.03]">
                <span className="text-left font-sans text-slate-700 dark:text-zinc-300 font-medium">{game.opponent.abbr}</span>
                <span>{quarters.opponent[0] ?? "-"}</span>
                <span>{quarters.opponent[1] ?? "-"}</span>
                <span>{quarters.opponent[2] ?? "-"}</span>
                <span>{quarters.opponent[3] ?? "-"}</span>
                <span className="font-bold text-slate-900 dark:text-white">{oScore}</span>
              </div>
            </div>
          )}
        </div>

        {/* 球队技术统计切换 Tab */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#14161b]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTeamTab("rockets")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTeamTab === "rockets"
                  ? "bg-[#CE1141] text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5"
              }`}
            >
              休斯敦火箭 ({rocketsPlayers.length}人)
            </button>
            <button
              type="button"
              onClick={() => setActiveTeamTab("opponent")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTeamTab === "opponent"
                  ? "bg-slate-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-xs font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5"
              }`}
            >
              {game.opponent.name} ({opponentPlayers.length}人)
            </button>
          </div>

          {game.result?.topPerformer && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <span className="font-semibold text-slate-900 dark:text-zinc-200">全场焦点:</span>
              <span className="font-bold text-[#CE1141]">{game.result.topPerformer.name}</span>
              <span className="font-mono text-slate-500 dark:text-zinc-400">({game.result.topPerformer.stats})</span>
            </div>
          )}
        </div>

        {/* 核心内容区 */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {currentPlayers.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-zinc-500 text-xs">
              暂未录入该球队详细出场名单统计
            </div>
          ) : (
            <>
              {/* ===== 1. 桌面端：完整页面全部展示，完全取消横拉杠 (ZERO horizontal scrollbar) ===== */}
              <div className="hidden md:block border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs table-fixed">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 text-[11px] font-semibold">
                      <th className="py-2.5 px-3 w-[20%]">球员</th>
                      <th className="py-2.5 px-2 text-center w-[6%]">位置</th>
                      <th className="py-2.5 px-2 text-center w-[6%]">时间</th>
                      <th className="py-2.5 px-2 text-center w-[8%] font-bold text-slate-900 dark:text-white bg-slate-100/50 dark:bg-white/[0.02]">
                        得分
                      </th>
                      <th className="py-2.5 px-2 text-center w-[7%]">篮板</th>
                      <th className="py-2.5 px-2 text-center w-[7%]">助攻</th>
                      <th className="py-2.5 px-2 text-center w-[10%]">投篮 (FG)</th>
                      <th className="py-2.5 px-2 text-center w-[9%]">三分 (3P)</th>
                      <th className="py-2.5 px-2 text-center w-[9%]">罚球 (FT)</th>
                      <th className="py-2.5 px-2 text-center w-[6%]">抢断</th>
                      <th className="py-2.5 px-2 text-center w-[6%]">盖帽</th>
                      <th className="py-2.5 px-2 text-center w-[6%]">失误</th>
                      <th className="py-2.5 px-2 text-center w-[6%]">+/-</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                    {currentPlayers.map((p: PlayerBoxscoreItem, idx: number) => {
                      const isHighScorer = p.points >= 15;
                      return (
                        <tr key={p.rawName || idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                          <td className="py-2 px-3 font-sans truncate">
                            <span className="text-slate-400 dark:text-zinc-500 font-mono text-[11px] mr-1.5">
                              #{p.number || "--"}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-zinc-100">{p.name}</span>
                          </td>
                          <td className="py-2 px-2 text-center text-slate-500 dark:text-zinc-400 font-sans">{p.position}</td>
                          <td className="py-2 px-2 text-center text-slate-600 dark:text-zinc-300 font-sans">{p.minutes}</td>
                          <td
                            className={`py-2 px-2 text-center font-bold text-sm bg-slate-50/50 dark:bg-white/[0.01] ${
                              isHighScorer ? "text-[#CE1141] font-black" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {p.points}
                          </td>
                          <td className="py-2 px-2 text-center text-slate-800 dark:text-zinc-200">{p.rebounds}</td>
                          <td className="py-2 px-2 text-center text-slate-800 dark:text-zinc-200">{p.assists}</td>
                          <td className="py-2 px-2 text-center text-slate-600 dark:text-zinc-400 text-[11px]">{p.fg}</td>
                          <td className="py-2 px-2 text-center text-slate-600 dark:text-zinc-400 text-[11px]">{p.threePt}</td>
                          <td className="py-2 px-2 text-center text-slate-600 dark:text-zinc-400 text-[11px]">{p.ft}</td>
                          <td className="py-2 px-2 text-center text-slate-700 dark:text-zinc-300">{p.steals}</td>
                          <td className="py-2 px-2 text-center text-slate-700 dark:text-zinc-300">{p.blocks}</td>
                          <td className="py-2 px-2 text-center text-slate-500 dark:text-zinc-400">{p.turnovers}</td>
                          <td className="py-2 px-2 text-center font-bold">
                            <span
                              className={
                                p.plusMinus.startsWith("+")
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : p.plusMinus.startsWith("-")
                                  ? "text-rose-700 dark:text-rose-400"
                                  : "text-slate-500 dark:text-zinc-400"
                              }
                            >
                              {p.plusMinus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ===== 2. 手机端：一体化数据长条（不使用分立方框，流线型长条展示） ===== */}
              <div className="block md:hidden space-y-2">
                {currentPlayers.map((p: PlayerBoxscoreItem, idx: number) => {
                  const isHighScorer = p.points >= 15;
                  return (
                    <div
                      key={p.rawName || idx}
                      className="bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs"
                    >
                      {/* 球员名行 */}
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/60 dark:border-white/5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
                            #{p.number || "--"}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs truncate">{p.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 px-1 py-0.2 rounded bg-slate-200/60 dark:bg-white/5 font-sans">
                            {p.position}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans">
                            {p.minutes}分
                          </span>
                        </div>

                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                            p.plusMinus.startsWith("+")
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : p.plusMinus.startsWith("-")
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                              : "text-slate-500 dark:text-zinc-400"
                          }`}
                        >
                          {p.plusMinus}
                        </span>
                      </div>

                      {/* 球员核心数据单条流线长条 (去除多框，采用专业长条流动布局) */}
                      <div className="flex items-center justify-between bg-white dark:bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/5 font-mono text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">得分</span>
                          <span className={`font-bold text-sm ${isHighScorer ? "text-[#CE1141]" : "text-slate-900 dark:text-white"}`}>
                            {p.points}
                          </span>
                        </div>
                        <span className="text-slate-200 dark:text-zinc-700">|</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">板</span>
                          <span className="font-semibold text-slate-800 dark:text-zinc-200">{p.rebounds}</span>
                        </div>
                        <span className="text-slate-200 dark:text-zinc-700">|</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">助</span>
                          <span className="font-semibold text-slate-800 dark:text-zinc-200">{p.assists}</span>
                        </div>
                        <span className="text-slate-200 dark:text-zinc-700">|</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">投</span>
                          <span className="text-slate-700 dark:text-zinc-300 text-[11px]">{p.fg}</span>
                        </div>
                        <span className="text-slate-200 dark:text-zinc-700">|</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">3P</span>
                          <span className="text-slate-700 dark:text-zinc-300 text-[11px]">{p.threePt}</span>
                        </div>
                        <span className="text-slate-200 dark:text-zinc-700">|</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">断</span>
                          <span className="text-slate-700 dark:text-zinc-300">{p.steals}</span>
                        </div>
                        <span className="text-slate-200 dark:text-zinc-700">|</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">帽</span>
                          <span className="text-slate-700 dark:text-zinc-300">{p.blocks}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 底部信息栏 */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121418] flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>NBA / ESPN 官方实况技术统计</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-medium transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
