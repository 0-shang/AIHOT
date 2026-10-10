import { useState, useMemo, useEffect } from "react";
import type { PlayerStatsData, SeasonAverages } from "./rocketsApi";

interface Props {
  player: PlayerStatsData | null;
  onClose: () => void;
}

export function RocketsPlayerModal({ player, onClose }: Props) {
  // 确保 2026-27 总是被视作最新赛季，并按倒序排列（最新赛季排在最前面，杜绝隐藏）
  const regSeasonsList = useMemo(() => {
    if (!player) return [];
    const keys = Object.keys(player.seasons || {});
    return Array.from(new Set([...keys, "2026-27"])).sort().reverse();
  }, [player]);

  const playoffSeasonsList = useMemo(() => {
    if (!player) return [];
    return Object.keys(player.playoffSeasons || {}).sort().reverse();
  }, [player]);

  // 判断 2026-27 是否已有常规赛实战数据或常规赛已开打
  const is2026NewSeason = useMemo(() => {
    const hasData = !!player?.seasons?.["2026-27"] && player.seasons["2026-27"].gp > 0;
    const isSeasonDateStarted = new Date().toISOString() >= "2026-10-22";
    return hasData || isSeasonDateStarted;
  }, [player]);

  // 默认选中：2026-27 赛季开打或有实战数据，打开详情页默认呈现 2026-27；否则展示上一赛季 2025-26
  const defaultSeason = useMemo(() => {
    if (is2026NewSeason && player?.seasons?.["2026-27"]) return "2026-27";
    if (player?.seasons?.["2025-26"]) return "2025-26";
    return player?.currentSeason || "2026-27";
  }, [is2026NewSeason, player]);

  const [selectedSeason, setSelectedSeason] = useState<string>(defaultSeason);

  // 切换球员或进入新赛季后自动重置为新赛季
  useEffect(() => {
    setSelectedSeason(defaultSeason);
  }, [defaultSeason, player?.id]);
  // 常规赛 vs 季后赛 切换模式
  const [competitionType, setCompetitionType] = useState<"regular" | "playoff">("regular");
  // 底下生涯对照表类型
  const [historyTableTab, setHistoryTableTab] = useState<"regular" | "playoff">("regular");

  if (!player) return null;

  // 当前选中赛季的常规赛数据
  const regSeasonData: SeasonAverages | undefined = player.seasons?.[selectedSeason];
  // 当前选中赛季的季后赛数据
  const playoffSeasonData: SeasonAverages | undefined = player.playoffSeasons?.[selectedSeason];

  // 当前展示的数据（根据常规赛/季后赛切换）
  const activeStat: SeasonAverages | undefined =
    competitionType === "regular" ? regSeasonData : playoffSeasonData;

  const hasPlayoffThisSeason = !!playoffSeasonData && playoffSeasonData.gp > 0;
  const isSelectedSeasonUpcoming = selectedSeason === "2026-27" && (!regSeasonData || regSeasonData.gp === 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部球员形象与档案介绍 */}
        <div className="relative bg-slate-50 dark:bg-[#15181e] p-4 sm:p-6 border-b border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/15 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors text-sm"
            title="关闭"
          >
            ✕
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {/* 头像 */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src={player.headshotUrl}
                  alt={player.nameCn}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.2 rounded-full bg-[#CE1141] text-white font-mono font-bold text-xs shadow-sm">
                #{player.number}
              </span>
            </div>

            {/* 球员名号与生理参数 */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {player.nameCn}
                </h2>
                <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-zinc-300 text-xs font-semibold">
                  {player.position}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#CE1141]/10 text-[#CE1141] text-xs font-bold border border-[#CE1141]/20">
                  休斯敦火箭
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3 font-mono">{player.nameEn}</p>

              {/* 资料网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">身高 / 体重</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">{player.height} / {player.weight}</span>
                </div>
                <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">年龄 / 球龄</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">{player.age}岁 ({player.experience})</span>
                </div>
                <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">选秀顺位</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium text-[11px] truncate block" title={player.draftInfo}>
                    {player.draftInfo}
                  </span>
                </div>
                <div className="bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">毕业大学</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-medium truncate block">{player.college}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 赛季选择器工具栏 (全量赛季下拉选择器，纯净利落无冗余胶囊) */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#14161b]">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1 flex-shrink-0">
                切换赛季:
              </span>
              {/* 全量赛季下拉选择器（生涯所有赛季一触即达） */}
              <div className="relative inline-flex items-center">
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="appearance-none text-xs font-bold pl-2.5 pr-7 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#CE1141] hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-2xs"
                >
                  {regSeasonsList.map((seasonKey) => {
                    const isLatest = seasonKey === "2026-27";
                    const isLastSeason = seasonKey === "2025-26";
                    const tag = isLatest ? " (最新赛季)" : isLastSeason ? " (上赛季)" : "";
                    return (
                      <option key={seasonKey} value={seasonKey}>
                        {seasonKey}{tag}
                      </option>
                    );
                  })}
                </select>
                <span className="pointer-events-none absolute right-2 text-[10px] text-slate-400 dark:text-zinc-500">
                  ▼
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
              生涯历年数据 ({regSeasonsList.length} 赛季)
            </span>
          </div>
        </div>

        {/* 核心内容区 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* 常规赛 vs 季后赛 切换栏 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedSeason} 赛季场均表现
              </h3>
              {competitionType === "playoff" && hasPlayoffThisSeason && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#CE1141]/10 text-[#CE1141] border border-[#CE1141]/20">
                  季后赛数据
                </span>
              )}
            </div>

            {/* 常规赛 / 季后赛 切换开关 */}
            <div className="flex items-center bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs self-start sm:self-auto">
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

          {/* 状态 A: 2026-27 最新赛季尚未开赛时的友好说明 */}
          {isSelectedSeasonUpcoming ? (
            <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl p-8 text-center">
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                2026-27 赛季 (最新赛季) 常规赛将于 10月23日 揭幕开打
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed max-w-md mx-auto">
                暂未产生新赛季官方常规赛场均数据。系统每天定时抓取 4 次官方实况，常规赛首战结束后将在此第一时间呈现最新技术统计。
              </p>
              <button
                type="button"
                onClick={() => setSelectedSeason("2025-26")}
                className="mt-4 px-4 py-1.5 rounded-lg bg-[#CE1141] text-white text-xs font-medium hover:bg-[#b00f37] transition-colors"
              >
                查看 2025-26 赛季完整表现
              </button>
            </div>
          ) : competitionType === "playoff" && !hasPlayoffThisSeason ? (
            <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl p-8 text-center">
              <p className="text-slate-800 dark:text-zinc-200 font-semibold text-sm">
                该球员在 {selectedSeason} 赛季未出战季后赛
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                无季后赛出场记录（球队未晋级或因伤病缺席）
              </p>
              <button
                type="button"
                onClick={() => setCompetitionType("regular")}
                className="mt-3.5 px-3.5 py-1.5 rounded-lg bg-[#CE1141] text-white text-xs font-medium hover:bg-[#b00f37] transition-colors"
              >
                查看 {selectedSeason} 常规赛表现
              </button>
            </div>
          ) : activeStat ? (
            <div>
              {/* 四大核心场均数据方块 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    场均得分 (PPG)
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#CE1141] font-mono">
                    {activeStat.pts.toFixed(1)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    场均篮板 (RPG)
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                    {activeStat.reb.toFixed(1)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    场均助攻 (APG)
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                    {activeStat.ast.toFixed(1)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    出场时间 (MPG)
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                    {activeStat.mpg.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* 三项命中率条 */}
              <div className="grid grid-cols-3 gap-2.5 mt-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">投篮命中率 (FG%)</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono block mt-0.5">
                    {activeStat.fgPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{activeStat.fg}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">三分命中率 (3P%)</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono block mt-0.5">
                    {activeStat.threePtPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{activeStat.threePt}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">罚球命中率 (FT%)</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono block mt-0.5">
                    {activeStat.ftPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{activeStat.ft}</span>
                </div>
              </div>

              {/* 防守与出场明细 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mt-3">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">抢断 (STL)</span>
                  <span className="text-slate-900 dark:text-white font-bold">{activeStat.stl.toFixed(1)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">盖帽 (BLK)</span>
                  <span className="text-slate-900 dark:text-white font-bold">{activeStat.blk.toFixed(1)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">失误 (TO)</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-bold">{activeStat.tov.toFixed(1)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">出场 / 首发</span>
                  <span className="text-slate-900 dark:text-white font-bold">{activeStat.gp}场 ({activeStat.gs}先发)</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* 生涯历年赛季对照表 */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                生涯历年赛季数据对照表
              </h4>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setHistoryTableTab("regular")}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    historyTableTab === "regular"
                      ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold"
                      : "text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300"
                  }`}
                >
                  常规赛 ({regSeasonsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryTableTab("playoff")}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    historyTableTab === "playoff"
                      ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold"
                      : "text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300"
                  }`}
                >
                  季后赛 ({playoffSeasonsList.length})
                </button>
              </div>
            </div>

            {/* 紧凑固定表格：桌面端无横拉条 */}
            <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs table-fixed">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 text-[11px] font-semibold">
                    <th className="py-2 px-2.5 w-[22%] sm:w-[18%]">赛季</th>
                    <th className="py-2 px-1 text-center w-[8%] sm:w-[8%]">场次</th>
                    <th className="py-2 px-1 text-center w-[8%] sm:w-[8%]">首发</th>
                    <th className="py-2 px-1 text-center w-[10%] sm:w-[10%]">时间</th>
                    <th className="py-2 px-1 text-center w-[12%] sm:w-[12%] font-bold text-slate-900 dark:text-white">得分</th>
                    <th className="py-2 px-1 text-center w-[10%] sm:w-[11%]">篮板</th>
                    <th className="py-2 px-1 text-center w-[10%] sm:w-[11%]">助攻</th>
                    <th className="py-2 px-1 text-center w-[10%] sm:w-[11%]">命中率</th>
                    <th className="py-2 px-1 text-center w-[10%] sm:w-[11%] hidden sm:table-cell">三分%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                  {(historyTableTab === "regular" ? regSeasonsList : playoffSeasonsList).length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-slate-400 dark:text-zinc-500 font-sans">
                        暂无该类比赛历史记录
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
                              ? "bg-red-50/70 dark:bg-[#CE1141]/15 text-slate-900 dark:text-white font-bold"
                              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                          }`}
                        >
                          <td className="py-2 px-2.5 font-sans truncate">
                            {sKey} {is2026 ? "(最新)" : ""}
                          </td>
                          <td className="py-2 px-1 text-center">{noData ? "待开赛" : s.gp}</td>
                          <td className="py-2 px-1 text-center">{noData ? "--" : s.gs}</td>
                          <td className="py-2 px-1 text-center">{noData ? "--" : s.mpg.toFixed(1)}</td>
                          <td className="py-2 px-1 text-center font-bold text-[#CE1141]">
                            {noData ? "--" : s.pts.toFixed(1)}
                          </td>
                          <td className="py-2 px-1 text-center">{noData ? "--" : s.reb.toFixed(1)}</td>
                          <td className="py-2 px-1 text-center">{noData ? "--" : s.ast.toFixed(1)}</td>
                          <td className="py-2 px-1 text-center">{noData ? "--" : `${s.fgPct.toFixed(1)}%`}</td>
                          <td className="py-2 px-1 text-center hidden sm:table-cell">{noData ? "--" : `${s.threePtPct.toFixed(1)}%`}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 底部关闭栏 */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121418] flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>NBA / ESPN 官方球员数据库</span>
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
