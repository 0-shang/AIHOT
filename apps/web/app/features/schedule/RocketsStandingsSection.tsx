import { useState } from "react";
import type { StandingsData, TeamStandingItem } from "./rocketsApi";

interface Props {
  standings: StandingsData | null;
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export function RocketsStandingsSection({ standings }: Props) {
  const [showHistoryStandings, setShowHistoryStandings] = useState(false);

  return (
    <section className="bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 text-xs transition-colors shadow-xs">
      {/* 季前赛官方阶段状态横幅（精简空间，减少大片空旷文本占用） */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
            NBA
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">西部排名参考</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
              季前赛热身阶段 · 不计入排位
            </span>
            <span className="text-slate-400 dark:text-zinc-500 text-xs hidden md:inline">
              · 10月23日常规赛揭幕后实时刷新官方战绩积分榜
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowHistoryStandings(!showHistoryStandings)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors font-medium text-xs flex items-center gap-1.5"
          >
            <span>{showHistoryStandings ? "收起球队排名" : "查看球队排名"}</span>
            <span className="text-[10px]">{showHistoryStandings ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>

      {/* 折叠参考：西部官方最终排名（科学布局，消除空旷留白，充实多维关键战绩数据） */}
      {showHistoryStandings && standings && standings.entries && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-end gap-3 mb-2 px-0.5 text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              1-6 季后赛直通
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              7-10 附加赛
            </span>
          </div>

          <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs table-fixed">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-zinc-400 border-b border-slate-200 dark:border-white/5 text-[11px] font-semibold select-none">
                  <th className="py-2.5 px-1.5 text-center w-8 sm:w-10">#</th>
                  <th className="py-2.5 px-2 w-[34%] sm:w-[24%] md:w-[20%]">球队</th>
                  <th className="py-2.5 px-1 text-center w-[12%] sm:w-[9%] md:w-[7%] text-slate-900 dark:text-white font-bold">胜</th>
                  <th className="py-2.5 px-1 text-center w-[12%] sm:w-[9%] md:w-[7%]">负</th>
                  <th className="py-2.5 px-1 text-center w-[14%] sm:w-[10%] md:w-[8%]">胜差</th>
                  <th className="py-2.5 px-1.5 text-center hidden sm:table-cell w-[11%] md:w-[8%]">胜率</th>
                  <th className="py-2.5 px-1 text-center hidden md:table-cell w-[7%]">连胜/负</th>
                  <th className="py-2.5 px-1.5 text-center hidden md:table-cell w-[9%]">近10场</th>
                  <th className="py-2.5 px-1.5 text-center hidden lg:table-cell w-[9%]">主场</th>
                  <th className="py-2.5 px-1.5 text-center hidden lg:table-cell w-[9%]">客场</th>
                  <th className="py-2.5 px-1 text-center hidden xl:table-cell w-[7%]">场均得</th>
                  <th className="py-2.5 px-1 text-center hidden xl:table-cell w-[7%]">场均失</th>
                  <th className="py-2.5 px-1 text-center hidden xl:table-cell w-[7%]">净胜分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                {standings.entries.map((team: TeamStandingItem) => {
                  const isRockets = team.isRockets;
                  const isPlayoffDirect = team.rank <= 6;
                  const isPlayIn = team.rank >= 7 && team.rank <= 10;
                  const isUtah =
                    team.name?.toLowerCase().includes("jazz") ||
                    team.name === "Utah Jazz" ||
                    team.abbr?.toUpperCase() === "UTAH" ||
                    team.abbr?.toUpperCase() === "UTA";
                  const displayName = isUtah ? "犹他爵士" : team.name;
                  // ESPN CDN 使用 utah.png 和 no.png 作为对应队标
                  const teamLogoUrl = isUtah
                    ? "https://a.espncdn.com/i/teamlogos/nba/500/utah.png"
                    : team.abbr?.toLowerCase() === "nop"
                    ? "https://a.espncdn.com/i/teamlogos/nba/500/no.png"
                    : `https://a.espncdn.com/i/teamlogos/nba/500/${team.abbr.toLowerCase()}.png`;

                  return (
                    <tr
                      key={team.abbr || team.id}
                      className={
                        isRockets
                          ? "bg-red-50/60 dark:bg-[#CE1141]/10 font-bold border-l-2 border-l-[#CE1141]"
                          : isPlayoffDirect
                          ? "hover:bg-slate-50 dark:hover:bg-white/[0.02] border-l-2 border-l-emerald-500/40"
                          : isPlayIn
                          ? "hover:bg-slate-50 dark:hover:bg-white/[0.02] border-l-2 border-l-amber-500/40"
                          : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/[0.02] border-l-2 border-l-transparent"
                      }
                    >
                      {/* 排名序号 */}
                      <td className="py-2 px-1 text-center text-slate-500 dark:text-zinc-400 text-[11px] font-bold">
                        {team.rank}
                      </td>

                      {/* 队名与官方队标（紧凑协调，无巨幅留白） */}
                      <td className="py-2 px-2 font-sans truncate">
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={teamLogoUrl}
                            alt={displayName}
                            className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain flex-shrink-0"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <span className={`text-xs truncate ${isRockets ? "text-[#CE1141] font-bold" : "text-slate-800 dark:text-zinc-200"}`}>
                            {displayName}
                          </span>
                        </div>
                      </td>

                      <td className="py-2 px-1 text-center text-slate-900 dark:text-zinc-100 font-bold">{team.wins}</td>
                      <td className="py-2 px-1 text-center text-slate-500 dark:text-zinc-400">{team.losses}</td>
                      <td className="py-2 px-1 text-center text-slate-600 dark:text-zinc-300">{team.gamesBehind}</td>
                      <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300 hidden sm:table-cell">{team.winPct}</td>
                      <td className="py-2 px-1 text-center text-slate-600 dark:text-zinc-400 hidden md:table-cell text-[11px]">
                        {team.streak || "-"}
                      </td>
                      <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300 hidden md:table-cell">{team.lastTen}</td>
                      <td className="py-2 px-1.5 text-center text-slate-500 dark:text-zinc-400 hidden lg:table-cell">{team.homeRecord}</td>
                      <td className="py-2 px-1.5 text-center text-slate-500 dark:text-zinc-400 hidden lg:table-cell">{team.awayRecord}</td>
                      <td className="py-2 px-1 text-center text-slate-600 dark:text-zinc-400 hidden xl:table-cell">
                        {team.pointsFor ? team.pointsFor.toFixed(1) : "-"}
                      </td>
                      <td className="py-2 px-1 text-center text-slate-600 dark:text-zinc-400 hidden xl:table-cell">
                        {team.pointsAgainst ? team.pointsAgainst.toFixed(1) : "-"}
                      </td>
                      <td className="py-2 px-1 text-center font-semibold text-slate-700 dark:text-zinc-300 hidden xl:table-cell">
                        {team.diff || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
