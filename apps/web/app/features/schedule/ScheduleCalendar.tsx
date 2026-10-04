import { useState, useMemo } from "react";
import { ROCKETS_GAMES, type GameData } from "./rocketsSchedule";

const MONTHS = [
  { year: 2026, month: 10, label: "10月", subtitle: "季前赛 & 揭幕战" },
  { year: 2026, month: 11, label: "11月", subtitle: "常规赛 & NBA杯" },
  { year: 2026, month: 12, label: "12月", subtitle: "常规赛" },
  { year: 2027, month: 1, label: "1月", subtitle: "常规赛" },
  { year: 2027, month: 2, label: "2月", subtitle: "全明星周末" },
  { year: 2027, month: 3, label: "3月", subtitle: "常规赛排位" },
  { year: 2027, month: 4, label: "4月", subtitle: "常规赛收官" },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKDAYS_LONG = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function getWeekday(dateStr: string): string {
  const d = new Date(dateStr);
  return WEEKDAYS_LONG[d.getDay()] || "";
}

export function ScheduleCalendar() {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [stageFilter, setStageFilter] = useState<"all" | "home" | "away" | "cup">("all");
  const [activeGame, setActiveGame] = useState<GameData | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("2026-10-09");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentMonth = MONTHS[selectedMonthIdx]!;
  const monthPrefix = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}`;

  // 当月全部赛事
  const monthGames = useMemo(() => {
    return ROCKETS_GAMES.filter((g) => g.date.startsWith(monthPrefix));
  }, [monthPrefix]);

  // 按主客场或杯赛过滤
  const filteredGames = useMemo(() => {
    return monthGames.filter((g) => {
      if (stageFilter === "home") return g.isHome;
      if (stageFilter === "away") return !g.isHome;
      if (stageFilter === "cup") return g.stage === "cup";
      return true;
    });
  }, [monthGames, stageFilter]);

  // 下一场焦点比赛
  const featuredGame = useMemo(() => {
    const macau = ROCKETS_GAMES.find((g) => g.date === "2026-10-09");
    if (macau) return macau;
    return monthGames[0] || ROCKETS_GAMES[0]!;
  }, [monthGames]);

  // 日历网格数据
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();
    const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();

    const days: Array<{
      dayNum: number;
      dateStr: string;
      isCurrentMonth: boolean;
      game?: GameData;
    }> = [];

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

    const totalSlots = days.length > 35 ? 42 : 35;
    const remaining = totalSlots - days.length;
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

  const selectedDayGame = useMemo(() => {
    return ROCKETS_GAMES.find((g) => g.date === selectedCalendarDate);
  }, [selectedCalendarDate]);

  const handleCopyReminder = (game: GameData) => {
    const text = `【休斯敦火箭比赛日程提醒】\n对阵：${game.isHome ? "休斯敦火箭 VS " + game.opponent.name : "休斯敦火箭 @ " + game.opponent.name}\n时间：${game.date} ${game.time} (北京时间)\n场馆：${game.arena}\n直播：${game.broadcast}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(game.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* ── 焦点战役看板（专业体育比赛中心风格） ── */}
      {featuredGame && (
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-4.5 shadow-xs sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* 赛事属性与时间 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#CE1141] px-2 py-0.5 text-[10.5px] font-bold text-white tracking-wide">
                  {featuredGame.arena.includes("澳门") ? "NBA 澳门季前赛" : featuredGame.stage === "cup" ? "NBA 杯赛" : "2026-27 赛季"}
                </span>
                <span className="font-mono text-xs font-semibold text-ink-3">
                  {featuredGame.date} {getWeekday(featuredGame.date)} · 北京时间 {featuredGame.time}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">
                休斯敦火箭 {featuredGame.isHome ? "VS" : "@"} {featuredGame.opponent.name}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-ink-4">
                <span>📍 {featuredGame.arena}</span>
                <span>📺 {featuredGame.broadcast}</span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-medium text-ink-3">
                  {featuredGame.isHome ? "休斯敦主场" : "火箭客场远征"}
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
              <button
                type="button"
                onClick={() => handleCopyReminder(featuredGame)}
                className="rounded-xl bg-[#CE1141] text-white px-4 py-2 text-xs font-bold shadow-xs transition-opacity hover:opacity-90 inline-flex items-center gap-1.5"
              >
                <span>{copiedId === featuredGame.id ? "已添加日程备忘 ✓" : "添加到日历提醒"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 月份选择与视图筛选控制栏 ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line-soft pb-3">
        {/* 月份切换 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:pb-0">
          {MONTHS.map((m, idx) => {
            const active = selectedMonthIdx === idx;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMonthIdx(idx)}
                className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[13px] font-bold transition-colors ${
                  active
                    ? "bg-[#CE1141] text-white shadow-xs"
                    : "bg-bg-sunk text-ink-3 hover:text-ink hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* 筛选与模式切换 */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          {/* 筛选：全部 / 主场 / 客场 / 杯赛 */}
          <div className="flex items-center rounded-lg border border-line-soft bg-surface p-0.5">
            {[
              { key: "all", label: "全部" },
              { key: "home", label: "主场" },
              { key: "away", label: "客场" },
              { key: "cup", label: "杯赛" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setStageFilter(f.key as any)}
                className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
                  stageFilter === f.key ? "bg-bg-sunk font-bold text-ink" : "text-ink-4 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 视图模式：赛程清单 vs 日历 */}
          <div className="flex items-center rounded-lg border border-line-soft bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                viewMode === "list" ? "bg-[#CE1141] text-white shadow-xs" : "text-ink-3 hover:text-ink"
              }`}
            >
              清单
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                viewMode === "calendar" ? "bg-[#CE1141] text-white shadow-xs" : "text-ink-3 hover:text-ink"
              }`}
            >
              日历
            </button>
          </div>
        </div>
      </div>

      {/* ── 视图 1：清晰专业赛程清单 (List View - 无论手机还是电脑都极为纯粹自然) ── */}
      {viewMode === "list" && (
        <div className="space-y-2.5">
          {filteredGames.length === 0 ? (
            <div className="rounded-2xl border border-line-soft bg-surface py-14 text-center text-xs text-ink-4">
              该筛选下当月暂无比赛安排
            </div>
          ) : (
            filteredGames.map((game) => {
              const isMacau = game.arena.includes("澳门");
              return (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game)}
                  className="group flex cursor-pointer flex-col justify-between gap-3 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs transition-all hover:border-[#CE1141]/50 hover:shadow-xs sm:flex-row sm:items-center sm:p-4"
                >
                  {/* 左侧：日期与对阵核心 */}
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    {/* 日期块 */}
                    <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-bg-sunk text-center">
                      <span className="text-[10px] font-bold text-ink-4 uppercase">
                        {game.date.slice(5, 7)}.{game.date.slice(8, 10)}
                      </span>
                      <span className="text-[11px] font-extrabold text-ink leading-tight">
                        {getWeekday(game.date).replace("周", "")}
                      </span>
                    </div>

                    {/* 比赛信息 */}
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            game.isHome
                              ? "bg-red-50 text-[#CE1141] dark:bg-red-950/40"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          }`}
                        >
                          {game.isHome ? "主场 vs" : "客场 @"}
                        </span>
                        {isMacau && (
                          <span className="rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 text-[10px] font-black text-amber-800 dark:text-amber-300">
                            澳门站
                          </span>
                        )}
                        {game.stage === "cup" && (
                          <span className="rounded bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                            NBA杯
                          </span>
                        )}
                        <span className="font-mono text-xs font-bold text-ink-2">
                          {game.time} (北京时间)
                        </span>
                      </div>

                      <div className="mt-1">
                        <h3 className="text-sm font-bold text-ink transition-colors group-hover:text-[#CE1141] sm:text-base">
                          休斯敦火箭 {game.isHome ? "VS" : "@"} {game.opponent.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* 右侧：场馆、转播与提醒 */}
                  <div className="flex items-center justify-between border-t border-line-soft pt-2 text-xs sm:border-t-0 sm:pt-0 sm:text-right">
                    <div className="text-ink-3">
                      <div className="font-medium text-ink-2">{game.arena}</div>
                      <div className="text-[11px] text-ink-4">{game.broadcast}</div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyReminder(game);
                      }}
                      className="ml-3 rounded-lg border border-line-soft bg-surface px-2.5 py-1 text-xs font-semibold text-ink-3 transition-colors hover:border-[#CE1141] hover:text-[#CE1141]"
                    >
                      {copiedId === game.id ? "已复制 ✓" : "提醒"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── 视图 2：极简清晰日历模式 (Calendar Grid) ── */}
      {viewMode === "calendar" && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
            {/* 星期行标 */}
            <div className="grid grid-cols-7 border-b border-line bg-bg-sunk/40 text-center text-xs font-bold text-ink-3">
              {WEEKDAYS.map((w, idx) => (
                <div key={w} className={`py-2 ${idx === 0 || idx === 6 ? "text-[#CE1141]" : ""}`}>
                  周{w}
                </div>
              ))}
            </div>

            {/* 格子矩阵 */}
            <div className="grid grid-cols-7 divide-x divide-y divide-line-soft bg-line-soft">
              {calendarDays.map((cell, idx) => {
                const game = cell.game;
                const isSelected = cell.dateStr === selectedCalendarDate;

                return (
                  <div
                    key={cell.dateStr + idx}
                    onClick={() => {
                      setSelectedCalendarDate(cell.dateStr);
                      if (game) setActiveGame(game);
                    }}
                    className={`relative flex min-h-[64px] cursor-pointer flex-col bg-surface p-1.5 transition-colors sm:min-h-[110px] sm:p-2 ${
                      !cell.isCurrentMonth ? "bg-bg-sunk/40 opacity-30" : "hover:bg-bg-sunk/50"
                    } ${isSelected ? "ring-2 ring-inset ring-[#CE1141] bg-red-50/10" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-bold ${cell.isCurrentMonth ? "text-ink-2" : "text-ink-4"}`}>
                        {cell.dayNum}
                      </span>
                      {game && (
                        <span
                          className={`rounded px-1 text-[9px] font-bold ${
                            game.isHome ? "bg-red-50 text-[#CE1141] dark:bg-red-950/40" : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          }`}
                        >
                          {game.isHome ? "主" : "客"}
                        </span>
                      )}
                    </div>

                    {game && (
                      <div className="mt-1 flex-1 flex flex-col justify-center">
                        <span className="truncate text-[11px] font-extrabold text-ink">
                          {game.isHome ? "vs" : "@"} {game.opponent.name}
                        </span>
                        <div className="mt-0.5 font-mono text-[10px] text-ink-4">
                          {game.time}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 移动端选中当天的卡片提示 */}
          {selectedDayGame && (
            <div
              onClick={() => setActiveGame(selectedDayGame)}
              className="sm:hidden rounded-xl border border-line bg-surface p-3 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between font-bold text-ink">
                <span>{selectedDayGame.date} · {selectedDayGame.isHome ? "主场 vs" : "客场 @"} {selectedDayGame.opponent.name}</span>
                <span className="font-mono text-ink-3">{selectedDayGame.time}</span>
              </div>
              <div className="mt-1 text-ink-4">
                📍 {selectedDayGame.arena} · 📺 {selectedDayGame.broadcast}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 比赛详情弹窗 ── */}
      {activeGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveGame(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <span className="text-xs font-bold text-ink-3">
                {activeGame.date} {getWeekday(activeGame.date)} · {activeGame.time} (北京时间)
              </span>
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="grid size-7 place-items-center rounded-full text-ink-4 hover:bg-bg-sunk hover:text-ink transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="my-5 flex items-center justify-around">
              {/* 火箭 */}
              <div className="text-center">
                <div className="text-base font-black text-ink">休斯敦火箭</div>
                <div className="mt-1 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-ink-3">
                  {activeGame.isHome ? "休斯敦主场" : "客场作战"}
                </div>
              </div>

              <div className="font-mono text-sm font-bold text-[#CE1141]">VS</div>

              {/* 对手 */}
              <div className="text-center">
                <div className="text-base font-black text-ink">{activeGame.opponent.name}</div>
                <div className="mt-1 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-ink-3">
                  {activeGame.isHome ? "客队挑战" : "对手主场"}
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 text-xs text-ink-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-4">比赛场馆</span>
                <span className="font-semibold text-ink">{activeGame.arena}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-4">转播平台</span>
                <span className="font-semibold text-ink">{activeGame.broadcast}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleCopyReminder(activeGame)}
                className="rounded-full bg-[#CE1141] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                {copiedId === activeGame.id ? "已复制提醒到剪贴板 ✓" : "复制比赛日程提醒"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
