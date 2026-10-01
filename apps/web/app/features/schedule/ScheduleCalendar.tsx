import { useState, useMemo } from "react";
import { ROCKETS_GAMES, type GameData } from "./rocketsSchedule";

const MONTH_NAMES = [
  { year: 2026, month: 10, label: "2026年 10月 (季前/揭幕)" },
  { year: 2026, month: 11, label: "2026年 11月 (常规赛)" },
  { year: 2026, month: 12, label: "2026年 12月 (常规赛)" },
];

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function ScheduleCalendar() {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [filter, setFilter] = useState<"all" | "final" | "upcoming">("all");
  const [activeGame, setActiveGame] = useState<GameData | null>(null);

  const currentMonth = MONTH_NAMES[selectedMonthIdx]!;

  // 筛选当月比赛
  const monthPrefix = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}`;
  const monthGames = useMemo(() => {
    return ROCKETS_GAMES.filter((g) => g.date.startsWith(monthPrefix));
  }, [monthPrefix]);

  // 计算本月战绩
  const finishedGames = monthGames.filter((g) => g.status === "final");
  const wins = finishedGames.filter((g) => g.result?.outcome === "W").length;
  const losses = finishedGames.filter((g) => g.result?.outcome === "L").length;

  // 生成当月的日历网格天数
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();
    const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();

    const days: Array<{
      dayNum: number;
      dateStr: string;
      isCurrentMonth: boolean;
      game?: GameData;
    }> = [];

    // 上个月填充
    const prevMonthDays = new Date(currentMonth.year, currentMonth.month - 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevM = currentMonth.month === 1 ? 12 : currentMonth.month - 1;
      const prevY = currentMonth.month === 1 ? currentMonth.year - 1 : currentMonth.year;
      days.push({
        dayNum: d,
        dateStr: `${prevY}-${String(prevM).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: false,
      });
    }

    // 当月每一天
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const game = ROCKETS_GAMES.find((g) => g.date === dateStr);
      days.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true,
        game,
      });
    }

    // 下个月补齐42格
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = currentMonth.month === 12 ? 1 : currentMonth.month + 1;
      const nextY = currentMonth.month === 12 ? currentMonth.year + 1 : currentMonth.year;
      days.push({
        dayNum: d,
        dateStr: `${nextY}-${String(nextM).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  return (
    <div className="space-y-6">
      {/* 2K 游戏风格顶部信息看板 */}
      <div className="overflow-hidden rounded-sheet border border-line bg-gradient-to-r from-[#ce1141] via-[#ba0c2f] to-[#86001d] p-5 text-white shadow-lg lg:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3.5">
            {/* 火箭队标微缩 */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/10 p-2 backdrop-blur-md ring-1 ring-white/20">
              <span className="text-2xl font-black italic tracking-tighter text-white">HOU</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-black/30 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white/90">
                  NBA 2026-27 Season
                </span>
                <span className="text-xs text-white/80">休斯敦火箭赛程日历</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight lg:text-3xl">
                休斯敦火箭 比赛赛程
              </h2>
            </div>
          </div>

          {/* 战绩概览面板 (2K 战绩板) */}
          <div className="flex items-center gap-3 rounded-tile bg-black/30 p-2.5 backdrop-blur-md ring-1 ring-white/10">
            <div className="px-3 text-center">
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/70">本月战绩</div>
              <div className="mt-0.5 font-mono text-xl font-black text-white">
                <span className="text-emerald-400">{wins}W</span>
                <span className="mx-1 text-white/40">-</span>
                <span className="text-rose-300">{losses}L</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="px-3 text-center">
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/70">总胜率</div>
              <div className="mt-0.5 font-mono text-xl font-black text-amber-300">
                {finishedGames.length > 0 ? `${Math.round((wins / finishedGames.length) * 100)}%` : "--"}
              </div>
            </div>
          </div>
        </div>

        {/* 月份切换器与筛选 */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {MONTH_NAMES.map((m, idx) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMonthIdx(idx)}
                className={`rounded-control px-3.5 py-1.5 text-sm font-semibold transition-all ${
                  selectedMonthIdx === idx
                    ? "bg-white text-[#ba0c2f] shadow-md"
                    : "bg-white/10 text-white/90 hover:bg-white/20"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded px-2.5 py-1 transition-colors ${filter === "all" ? "bg-white/25 font-bold text-white" : "text-white/70 hover:text-white"}`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setFilter("final")}
              className={`rounded px-2.5 py-1 transition-colors ${filter === "final" ? "bg-white/25 font-bold text-white" : "text-white/70 hover:text-white"}`}
            >
              已完赛 (比分)
            </button>
            <button
              type="button"
              onClick={() => setFilter("upcoming")}
              className={`rounded px-2.5 py-1 transition-colors ${filter === "upcoming" ? "bg-white/25 font-bold text-white" : "text-white/70 hover:text-white"}`}
            >
              未开赛
            </button>
          </div>
        </div>
      </div>

      {/* 2K 经典月历日历网格 */}
      <div className="overflow-hidden rounded-panel border border-line bg-surface shadow-sm">
        {/* 星期标头 */}
        <div className="grid grid-cols-7 border-b border-line bg-bg-sunk text-center text-xs font-bold uppercase tracking-wider text-ink-3">
          {WEEKDAYS.map((w, idx) => (
            <div
              key={w}
              className={`py-2.5 ${idx === 0 || idx === 6 ? "text-accent font-semibold" : ""}`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* 日历格子网格 */}
        <div className="grid grid-cols-7 divide-x divide-y divide-line-soft bg-line-soft">
          {calendarDays.map((cell, idx) => {
            const hasGame = !!cell.game;
            const game = cell.game;
            const isMatchFilter =
              filter === "all" ||
              (filter === "final" && game?.status === "final") ||
              (filter === "upcoming" && game?.status === "upcoming");

            const showGame = hasGame && isMatchFilter;

            return (
              <div
                key={cell.dateStr + idx}
                className={`relative flex min-h-[110px] flex-col bg-surface p-1.5 transition-colors sm:min-h-[125px] sm:p-2 lg:min-h-[135px] ${
                  !cell.isCurrentMonth ? "bg-bg-sunk/35 opacity-40" : "hover:bg-bg-sunk/50"
                }`}
              >
                {/* 日期小角标 */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      cell.isCurrentMonth ? "text-ink-3" : "text-ink-4"
                    }`}
                  >
                    {cell.dayNum}
                  </span>
                  {showGame && (
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        game!.isHome ? "text-rose-600 dark:text-rose-400" : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {game!.isHome ? "主场" : "客场"}
                    </span>
                  )}
                </div>

                {/* 比赛日卡片 (2K 磁贴风格) */}
                {showGame && game && (
                  <button
                    type="button"
                    onClick={() => setActiveGame(game)}
                    className="group mt-1 flex flex-1 flex-col justify-between overflow-hidden rounded-control border border-line p-1.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:border-white/10"
                    style={{
                      background: game.status === "final"
                        ? game.result?.outcome === "W"
                          ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)"
                          : "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)"
                        : "var(--bg-sunk)",
                    }}
                  >
                    {/* 对手信息 */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-black text-white shadow-xs"
                        style={{ backgroundColor: game.opponent.color }}
                      >
                        {game.opponent.abbr.slice(0, 3)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-bold text-ink">
                          {game.isHome ? "vs" : "@"} {game.opponent.name}
                        </div>
                      </div>
                    </div>

                    {/* 完赛状态：2K 胜负比分板 */}
                    {game.status === "final" && game.result ? (
                      <div className="mt-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white ${
                              game.result.outcome === "W" ? "bg-emerald-600" : "bg-rose-600"
                            }`}
                          >
                            {game.result.outcome}
                          </span>
                          <span className="font-mono text-xs font-bold text-ink">
                            {game.result.rocketsScore} - {game.result.opponentScore}
                          </span>
                        </div>
                        {game.result.topPerformer && (
                          <div className="mt-1 hidden truncate text-[10px] text-ink-4 sm:block">
                            ★ {game.result.topPerformer.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* 未开赛状态：时间与球馆 */
                      <div className="mt-1">
                        <div className="font-mono text-[11px] font-semibold text-accent">
                          {game.time}
                        </div>
                        <div className="truncate text-[10px] text-ink-4">
                          {game.broadcast.split(" ")[0]}
                        </div>
                      </div>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2K 比赛详情弹窗 (Modal) */}
      {activeGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveGame(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-sheet border border-line bg-surface p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="rounded bg-bg-sunk px-2 py-0.5 text-xs font-semibold text-ink-3">
                  {activeGame.date} · {activeGame.time} (北京时间)
                </span>
                <h3 className="mt-2 text-xl font-black text-ink">
                  休斯敦火箭 {activeGame.isHome ? "vs" : "@"} {activeGame.opponent.city} {activeGame.opponent.name}
                </h3>
                <p className="mt-0.5 text-xs text-ink-4">
                  比赛场地：{activeGame.arena} · 转播：{activeGame.broadcast}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="grid size-8 place-items-center rounded-full text-ink-4 hover:bg-bg-sunk hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* 比分及关键球员面板 */}
            {activeGame.status === "final" && activeGame.result ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-around rounded-tile bg-bg-sunk p-4">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-ink-4">休斯敦火箭</div>
                    <div className="font-mono text-3xl font-black text-ink">
                      {activeGame.result.rocketsScore}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-black text-white ${
                        activeGame.result.outcome === "W" ? "bg-emerald-600" : "bg-rose-600"
                      }`}
                    >
                      {activeGame.result.outcome === "W" ? "胜利 VICTORY" : "失利 DEFEAT"}
                    </span>
                    <span className="mt-1 text-[11px] text-ink-4">全场已完赛</span>
                  </div>

                  <div className="text-center">
                    <div className="text-xs font-semibold text-ink-4">
                      {activeGame.opponent.name}
                    </div>
                    <div className="font-mono text-3xl font-black text-ink">
                      {activeGame.result.opponentScore}
                    </div>
                  </div>
                </div>

                {activeGame.result.topPerformer && (
                  <div className="rounded-tile border border-line-soft bg-surface-2 p-3.5">
                    <div className="text-xs font-bold text-ink-3">★ 本场最佳球员 (Top Performer)</div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-bold text-ink">{activeGame.result.topPerformer.name}</span>
                      <span className="font-mono text-sm font-semibold text-accent">
                        {activeGame.result.topPerformer.stats}
                      </span>
                    </div>
                  </div>
                )}

                {activeGame.result.highlights && (
                  <div className="rounded-tile bg-bg-sunk p-3.5">
                    <div className="text-xs font-bold text-ink-3">战报速递</div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">
                      {activeGame.result.highlights}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center py-6">
                <div className="text-sm font-medium text-ink-3">比赛尚未开打</div>
                <div className="mt-2 text-xs text-ink-4">
                  请锁定开赛时间，赛后将第一时间为您更新 2K 战绩比分与高光复盘！
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
