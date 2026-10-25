import { useState, useMemo, useEffect } from "react";
import type { PlayerStatsData, SeasonAverages } from "./rocketsApi";

interface Props {
  player: PlayerStatsData | null;
  onClose: () => void;
}

export function RocketsPlayerModal({ player, onClose }: Props) {
  // 确保 2026-27 在最前，并按年份倒序
  const regSeasonsList = useMemo(() => {
    if (!player) return [];
    const keys = Object.keys(player.seasons || {});
    return Array.from(new Set([...keys, "2026-27"])).sort().reverse();
  }, [player]);

  const playoffSeasonsList = useMemo(() => {
    if (!player) return [];
    return Object.keys(player.playoffSeasons || {}).sort().reverse();
  }, [player]);

  // 判断是否有 2026-27 实际比赛数据
  const has2026RealStats = useMemo(() => {
    return !!player?.seasons?.["2026-27"] && player.seasons["2026-27"].gp > 0;
  }, [player]);

  // 默认选中：若有 2026-27 则展示，否则默认展示最新已完成的 2025-26 赛季
  const defaultSeason = useMemo(() => {
    if (has2026RealStats) return "2026-27";
    if (player?.seasons?.["2025-26"]) return "2025-26";
    return player?.currentSeason || "2025-26";
  }, [has2026RealStats, player]);

  const [selectedSeason, setSelectedSeason] = useState<string>(defaultSeason);

  useEffect(() => {
    setSelectedSeason(defaultSeason);
  }, [defaultSeason, player?.id]);

  // 常规赛 vs 季后赛
  const [competitionType, setCompetitionType] = useState<"regular" | "playoff">("regular");
  // 生涯对照表 tab
  const [historyTableTab, setHistoryTableTab] = useState<"regular" | "playoff">("regular");

  if (!player) return null;

  const regSeasonData: SeasonAverages | undefined = player.seasons?.[selectedSeason];
  const playoffSeasonData: SeasonAverages | undefined = player.playoffSeasons?.[selectedSeason];

  const activeStat: SeasonAverages | undefined =
    competitionType === "regular" ? regSeasonData : playoffSeasonData;

  const hasPlayoffThisSeason = !!playoffSeasonData && playoffSeasonData.gp > 0;
  const isSelectedSeasonUpcoming = selectedSeason === "2026-27" && (!regSeasonData || regSeasonData.gp === 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#121418] border border-slate-200/90 dark:border-white/10 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 固定右上角关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white flex items-center justify-center transition-all text-xs backdrop-blur-md"
          title="关闭"
        >
          ✕
        </button>

        {/* 整个 Modal 内部平滑纵向滚动，彻底杜绝手机端头部覆盖或截断问题 */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {/* 1. 球员 Hero 档案头部：浅色模式下通透明亮，与整张白卡自然融合；暗色模式下深色高级 */}
          <div className="relative bg-gradient-to-br from-red-50/70 via-slate-50 to-white dark:from-[#15171c] dark:via-[#1c1a20] dark:to-[#221217] border-b border-slate-200/80 dark:border-white/10 p-4 sm:p-6 overflow-hidden transition-colors">
            {/* 背景球衣号码超大水印 */}
            <span className="absolute -right-2 -bottom-4 text-7xl sm:text-8xl font-black font-mono text-slate-900/[0.04] dark:text-white/[0.04] select-none pointer-events-none">
              #{player.number}
            </span>
            <div className="absolute top-0 right-1/3 w-40 h-40 bg-[#CE1141]/5 dark:bg-[#CE1141]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex items-center gap-3.5 sm:gap-5 pr-8">
              {/* 头像 */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/20 p-1 flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-[#CE1141]/20">
                  <img
                    src={player.headshotUrl}
                    alt={player.nameCn}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-[#CE1141] text-white font-mono font-black text-[10px] shadow border border-white/40 dark:border-white/20">
                  #{player.number}
                </span>
              </div>

              {/* 姓名与关键基本面（单行流式排版，手机端绝不遮挡） */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {player.nameCn}
                  </h2>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/15 text-slate-700 dark:text-white/90 text-[10.5px] font-bold border border-slate-300/60 dark:border-transparent">
                    {player.position}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#CE1141] text-white text-[10.5px] font-bold shadow-xs">
                    休斯敦火箭
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-white/60 font-mono mb-2 truncate">
                  {player.nameEn}
                </p>

                {/* 紧凑档案参数 */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-700 dark:text-white/80">
                  <span>
                    <strong className="text-slate-400 dark:text-white/50 font-normal">身高/体重: </strong>
                    <span className="font-mono">{player.height} · {player.weight}</span>
                  </span>
                  <span className="text-slate-300 dark:text-white/30 hidden sm:inline">|</span>
                  <span>
                    <strong className="text-slate-400 dark:text-white/50 font-normal">年龄/球龄: </strong>
                    {player.age}岁 ({player.experience})
                  </span>
                  <span className="text-slate-300 dark:text-white/30 hidden sm:inline">|</span>
                  <span className="truncate max-w-full">
                    <strong className="text-slate-400 dark:text-white/50 font-normal">选秀: </strong>
                    {player.draftInfo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 赛季切换与赛事类型过滤栏 */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#16181e] flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                赛季:
              </span>
              <div className="relative inline-flex items-center">
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="appearance-none text-xs font-bold pl-2.5 pr-6 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#CE1141]"
                >
                  {regSeasonsList.map((seasonKey) => (
                    <option key={seasonKey} value={seasonKey} className="dark:bg-[#16181e]">
                      {seasonKey} 赛季
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 text-[9px] text-slate-400 dark:text-zinc-500">
                  ▼
                </span>
              </div>
            </div>

            {/* 常规赛 / 季后赛 Tab */}
            <div className="flex items-center bg-slate-200/80 dark:bg-white/10 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setCompetitionType("regular")}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  competitionType === "regular"
                    ? "bg-white dark:bg-[#CE1141] text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                常规赛
              </button>
              <button
                type="button"
                onClick={() => setCompetitionType("playoff")}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  competitionType === "playoff"
                    ? "bg-white dark:bg-[#CE1141] text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                季后赛
              </button>
            </div>
          </div>

          {/* 3. 统计数据呈现区 */}
          <div className="p-4 sm:p-6 space-y-4">
            {isSelectedSeasonUpcoming ? (
              <div className="border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center bg-slate-50 dark:bg-white/[0.02]">
                <p className="text-slate-800 dark:text-zinc-200 font-bold text-sm">
                  2026-27 赛季暂未出战
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  该球员出场产生官方技术统计后将自动同步更新。
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSeason("2025-26")}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#CE1141] text-white text-xs font-semibold hover:bg-[#b00f37] transition-all shadow-xs"
                >
                  查看 2025-26 赛季数据
                </button>
              </div>
            ) : competitionType === "playoff" && !hasPlayoffThisSeason ? (
              <div className="border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center bg-slate-50 dark:bg-white/[0.02]">
                <p className="text-slate-800 dark:text-zinc-200 font-semibold text-xs">
                  {selectedSeason} 赛季暂无季后赛记录
                </p>
                <button
                  type="button"
                  onClick={() => setCompetitionType("regular")}
                  className="mt-2.5 px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-medium"
                >
                  切换至常规赛
                </button>
              </div>
            ) : activeStat ? (
              <div className="space-y-3.5">
                {/* 场次概括 */}
                <div className="flex items-center justify-between text-xs px-0.5">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-[#CE1141] rounded-full"></span>
                    {selectedSeason} 赛季场均表现
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                    出战 {activeStat.gp} 场 · 先发 {activeStat.gs} 场
                  </span>
                </div>

                {/* A. 核心四大基础指标：一体化连通卡片，消除原本空旷塑料感 */}
                <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] overflow-hidden shadow-2xs">
                  <div className="grid grid-cols-4 divide-x divide-slate-200 dark:divide-white/10 text-center py-3.5 sm:py-4">
                    <div className="px-1.5">
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#CE1141] block mb-0.5 tracking-tight">
                        得分 PTS
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#CE1141] tracking-tight">
                        {activeStat.pts.toFixed(1)}
                      </span>
                    </div>
                    <div className="px-1.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-0.5 tracking-tight">
                        篮板 REB
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                        {activeStat.reb.toFixed(1)}
                      </span>
                    </div>
                    <div className="px-1.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-0.5 tracking-tight">
                        助攻 AST
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                        {activeStat.ast.toFixed(1)}
                      </span>
                    </div>
                    <div className="px-1.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-0.5 tracking-tight">
                        时间 MIN
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                        {activeStat.mpg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* B. 三项投篮命中率：现代进度条与真实出手比可视化矩阵 */}
                <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/[0.02] p-3.5 sm:p-4 shadow-2xs space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {/* 投篮 FG% */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-zinc-400 text-[11px]">投篮 FG%</span>
                        <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                          {activeStat.fgPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 dark:bg-zinc-200 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, activeStat.fgPct))}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 block text-right">
                        {activeStat.fg} 命中/出手
                      </span>
                    </div>

                    {/* 三分 3P% */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-zinc-400 text-[11px]">三分 3P%</span>
                        <span className="font-mono font-black text-[#CE1141] text-sm">
                          {activeStat.threePtPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#CE1141] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, activeStat.threePtPct))}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 block text-right">
                        {activeStat.threePt} 命中/出手
                      </span>
                    </div>

                    {/* 罚球 FT% */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-zinc-400 text-[11px]">罚球 FT%</span>
                        <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                          {activeStat.ftPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 dark:bg-zinc-200 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, activeStat.ftPct))}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 block text-right">
                        {activeStat.ft} 命中/出手
                      </span>
                    </div>
                  </div>
                </div>

                {/* C. 防守与组织进阶参数：紧凑一体式信息条 */}
                <div className="border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] p-2.5">
                  <div className="grid grid-cols-4 divide-x divide-slate-200 dark:divide-white/5 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">抢断 STL</span>
                      <strong className="font-mono text-slate-900 dark:text-white text-sm">{activeStat.stl.toFixed(1)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">盖帽 BLK</span>
                      <strong className="font-mono text-slate-900 dark:text-white text-sm">{activeStat.blk.toFixed(1)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">失误 TO</span>
                      <strong className="font-mono text-slate-700 dark:text-zinc-300 text-sm">{activeStat.tov.toFixed(1)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">先发率 GS/GP</span>
                      <strong className="font-mono text-slate-900 dark:text-white text-xs">
                        {activeStat.gs}/{activeStat.gp}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* 4. 生涯历史赛季对照表 */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-[#CE1141] rounded-full"></span>
                  生涯历年赛季数据对照
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setHistoryTableTab("regular")}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                      historyTableTab === "regular"
                        ? "bg-[#CE1141] text-white font-bold"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    常规赛 ({regSeasonsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryTableTab("playoff")}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                      historyTableTab === "playoff"
                        ? "bg-[#CE1141] text-white font-bold"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    季后赛 ({playoffSeasonsList.length})
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs table-fixed">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 text-[10.5px] font-semibold select-none">
                      <th className="py-2 px-2.5 w-[24%] sm:w-[20%]">赛季</th>
                      <th className="py-2 px-1 text-center w-[8%]">场次</th>
                      <th className="py-2 px-1 text-center w-[8%]">首发</th>
                      <th className="py-2 px-1 text-center w-[10%]">时间</th>
                      <th className="py-2 px-1 text-center w-[12%] font-bold text-slate-900 dark:text-white">得分</th>
                      <th className="py-2 px-1 text-center w-[11%]">篮板</th>
                      <th className="py-2 px-1 text-center w-[11%]">助攻</th>
                      <th className="py-2 px-1 text-center w-[11%]">命中率</th>
                      <th className="py-2 px-1 text-center w-[11%] hidden sm:table-cell">三分%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {(historyTableTab === "regular" ? regSeasonsList : playoffSeasonsList).length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-5 text-center text-slate-400 dark:text-zinc-500 font-sans">
                          暂无记录
                        </td>
                      </tr>
                    ) : (
                      (historyTableTab === "regular" ? regSeasonsList : playoffSeasonsList).map((sKey) => {
                        const s = historyTableTab === "regular" ? player.seasons?.[sKey] : player.playoffSeasons?.[sKey];
                        const isCurrent = sKey === selectedSeason;
                        const is2026 = sKey === "2026-27";
                        const noData = !s || s.gp === 0;

                        return (
                          <tr
                            key={sKey}
                            onClick={() => {
                              setSelectedSeason(sKey);
                              setCompetitionType(historyTableTab);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-[#CE1141]/10 text-slate-900 dark:text-white font-bold"
                                : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                            }`}
                          >
                            <td className="py-2 px-2.5 font-sans truncate">
                              <span className="flex items-center gap-1">
                                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#CE1141]"></span>}
                                {sKey} {is2026 ? "(最新)" : ""}
                              </span>
                            </td>
                            <td className="py-2 px-1 text-center">{noData ? "未登场" : s.gp}</td>
                            <td className="py-2 px-1 text-center">{noData ? "--" : s.gs}</td>
                            <td className="py-2 px-1 text-center">{noData ? "--" : s.mpg.toFixed(1)}</td>
                            <td className="py-2 px-1 text-center font-bold text-[#CE1141]">
                              {noData ? "--" : s.pts.toFixed(1)}
                            </td>
                            <td className="py-2 px-1 text-center">{noData ? "--" : s.reb.toFixed(1)}</td>
                            <td className="py-2 px-1 text-center">{noData ? "--" : s.ast.toFixed(1)}</td>
                            <td className="py-2 px-1 text-center">{noData ? "--" : `${s.fgPct.toFixed(1)}%`}</td>
                            <td className="py-2 px-1 text-center hidden sm:table-cell">
                              {noData ? "--" : `${s.threePtPct.toFixed(1)}%`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 5. 纯净底部：去除任何每日抓取文字，仅保留简洁关闭按钮 */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121418] flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-all shadow-2xs"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
