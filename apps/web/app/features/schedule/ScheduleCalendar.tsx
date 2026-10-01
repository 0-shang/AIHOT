import { useState, useMemo } from "react";
import { ROCKETS_GAMES, type GameData } from "./rocketsSchedule";

const MONTH_NAMES = [
  { year: 2026, month: 10, label: "10月 (澳门赛/揭幕)", subtitle: "NBA澳门赛热身与常规赛揭幕" },
  { year: 2026, month: 11, label: "11月 (常规赛/NBA杯)", subtitle: "锦标赛小组争夺与密集常规赛" },
  { year: 2026, month: 12, label: "12月 (常规赛/圣诞战)", subtitle: "年终大战与圣诞巅峰对决" },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKDAYS_LONG = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function ScheduleCalendar() {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  // 默认在移动端展示体验最佳的列表卡片模式，在大屏提供平滑切换
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [typeFilter, setTypeFilter] = useState<"all" | "home" | "away" | "macau" | "cup">("all");
  const [activeGame, setActiveGame] = useState<GameData | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("2026-10-09");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentMonth = MONTH_NAMES[selectedMonthIdx]!;

  // 筛选当月比赛
  const monthPrefix = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}`;
  const monthGames = useMemo(() => {
    return ROCKETS_GAMES.filter((g) => g.date.startsWith(monthPrefix));
  }, [monthPrefix]);

  // 按类型过滤比赛
  const filteredGames = useMemo(() => {
    return monthGames.filter((g) => {
      if (typeFilter === "home") return g.isHome;
      if (typeFilter === "away") return !g.isHome;
      if (typeFilter === "macau") return g.arena.includes("澳门");
      if (typeFilter === "cup") return g.stage === "cup";
      return true;
    });
  }, [monthGames, typeFilter]);

  // 焦点赛事：下一场比赛（优先推荐 10月9日 NBA 澳门赛）
  const nextGame = useMemo(() => {
    const macauGame = ROCKETS_GAMES.find((g) => g.date === "2026-10-09");
    if (macauGame) return macauGame;
    const upcoming = ROCKETS_GAMES.filter((g) => g.status === "upcoming" && g.date >= "2026-10-01");
    return upcoming[0] || ROCKETS_GAMES[0]!;
  }, []);

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

    // 下个月补齐
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

  // 手机端选中日期当天的比赛
  const selectedDayGame = useMemo(() => {
    return ROCKETS_GAMES.find((g) => g.date === selectedCalendarDate);
  }, [selectedCalendarDate]);

  const handleCopyReminder = (game: GameData) => {
    const text = `【休斯敦火箭比赛日程提醒】\n对决：${game.isHome ? "休斯敦火箭 VS " + game.opponent.name : "休斯敦火箭 @ " + game.opponent.name}\n时间：${game.date} ${game.time} (北京时间)\n球馆：${game.arena}\n转播平台：${game.broadcast}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(game.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-5">
      {/* ── 顶部火箭赛事中心看板 ── */}
      <div className="relative overflow-hidden rounded-2xl border border-line-soft bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 p-4 text-white shadow-xl sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-[#CE1141]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* 左侧：赛季标题与主队标识 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#CE1141] to-[#8C001A] shadow-md shadow-[#CE1141]/30 ring-1 ring-white/20 sm:size-14">
              <span className="text-xl font-black italic tracking-tighter text-white sm:text-2xl">HOU</span>
              <span className="absolute -bottom-1 -right-1 rounded-full bg-amber-400 px-1 text-[8.5px] font-black text-neutral-950">
                26-27
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 ring-1 ring-amber-400/40">
                  🇲🇴 NBA 澳门赛重磅开启
                </span>
                <span className="text-[11px] text-white/60">2026-27 赛季赛程</span>
              </div>
              <h2 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
                休斯敦火箭 比赛赛程
              </h2>
            </div>
          </div>

          {/* 焦点战役预告（10月9日 澳门赛首战） */}
          {nextGame && (
            <div
              onClick={() => setActiveGame(nextGame)}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-md transition-all hover:border-[#CE1141] hover:bg-white/[0.1] sm:p-3.5"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-white/70">
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="size-2 animate-ping rounded-full bg-amber-400" />
                  焦点战 · 中国澳门站
                </span>
                <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-white/90">
                  {nextGame.date} {nextGame.time}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#CE1141] text-xs font-black text-white">
                    HOU
                  </div>
                  <span className="text-xs font-bold text-white/90">VS</span>
                  <div
                    className="flex size-7 items-center justify-center rounded-lg text-xs font-black text-white"
                    style={{ backgroundColor: nextGame.opponent.color }}
                  >
                    {nextGame.opponent.abbr.slice(0, 3)}
                  </div>
                  <div className="text-xs font-bold text-white sm:text-sm">
                    {nextGame.opponent.name}
                  </div>
                </div>

                <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-black text-neutral-950 transition-transform group-hover:scale-105">
                  对决档案 →
                </span>
              </div>

              <div className="mt-1.5 text-[10.5px] text-white/70">
                📍 {nextGame.arena} · <span className="text-amber-200">{nextGame.keyMatchup}</span>
              </div>
            </div>
          )}
        </div>

        {/* 月份切换与视图筛选 */}
        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 sm:pt-4">
          {/* 月份列表 */}
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {MONTH_NAMES.map((m, idx) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMonthIdx(idx)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all sm:text-sm ${
                  selectedMonthIdx === idx
                    ? "bg-white text-neutral-950 shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* 视图切换：在手机端醒目展示 */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center rounded-lg bg-black/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                  viewMode === "list" ? "bg-white text-neutral-950 shadow-xs" : "text-white/70 hover:text-white"
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                赛程清单
              </button>
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                  viewMode === "calendar" ? "bg-white text-neutral-950 shadow-xs" : "text-white/70 hover:text-white"
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                日历视图
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 视图模式 1：赛程清单卡片流 (List View - 手机端极佳体验) ── */}
      {viewMode === "list" && (
        <div className="space-y-2.5">
          {filteredGames.length === 0 ? (
            <div className="rounded-2xl border border-line-soft bg-surface py-12 text-center text-ink-4">
              当前月份暂无匹配比赛
            </div>
          ) : (
            filteredGames.map((game) => {
              const isMacau = game.arena.includes("澳门");
              return (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game)}
                  className={`group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border bg-surface p-3.5 shadow-xs transition-all hover:border-accent hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-4 ${
                    isMacau ? "border-amber-400/60 ring-1 ring-amber-400/20" : "border-line-soft"
                  }`}
                >
                  {isMacau && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-l from-amber-500 to-amber-600 px-2 py-0.5 text-[9.5px] font-black text-neutral-950 shadow-sm">
                      🇲🇴 澳门赛焦点战
                    </div>
                  )}

                  {/* 左侧：日期块与比赛信息 */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* 日期方块 */}
                    <div
                      className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-xl font-mono text-center sm:size-14 ${
                        isMacau ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200" : "bg-bg-sunk text-ink"
                      }`}
                    >
                      <span className="text-[9.5px] uppercase opacity-75">{game.date.slice(5, 7)}月</span>
                      <span className="text-lg font-black leading-none sm:text-xl">{game.date.slice(8, 10)}</span>
                    </div>

                    {/* 对战双方与赛事属性 */}
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9.5px] font-extrabold uppercase ${
                            game.isHome
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                          }`}
                        >
                          {game.isHome ? "主场 vs" : "客场 @"}
                        </span>
                        {game.stage === "cup" && !isMacau && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9.5px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            🏆 NBA杯
                          </span>
                        )}
                        <span className="font-mono text-[11px] font-semibold text-accent">
                          北京时间 {game.time}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className="flex size-5 shrink-0 items-center justify-center rounded text-[9px] font-black text-white"
                          style={{ backgroundColor: game.opponent.color }}
                        >
                          {game.opponent.abbr.slice(0, 3)}
                        </div>
                        <h3 className="text-sm font-extrabold text-ink sm:text-base">
                          休斯敦火箭 {game.isHome ? "VS" : "@"} {game.opponent.name}
                        </h3>
                      </div>

                      {game.keyMatchup && (
                        <p className="mt-0.5 line-clamp-1 text-[11.5px] text-ink-3">
                          焦点：<span className="text-ink font-medium">{game.keyMatchup}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 右侧：球馆与操作 */}
                  <div className="flex items-center justify-between gap-3 border-t border-line-soft pt-2 sm:border-t-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[11.5px] font-medium text-ink-2">{game.arena}</div>
                      <div className="text-[10.5px] text-ink-4">{game.broadcast}</div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyReminder(game);
                      }}
                      className="rounded-lg border border-line-soft bg-surface px-2.5 py-1 text-xs font-semibold text-ink-2 hover:bg-bg-sunk transition-colors"
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

      {/* ── 视图模式 2：日历网格模式 (大屏完整磁贴 / 移动端点阵日历) ── */}
      {viewMode === "calendar" && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-xs">
            {/* 星期标头 */}
            <div className="grid grid-cols-7 border-b border-line-soft bg-bg-sunk/60 text-center text-xs font-bold uppercase tracking-wider text-ink-3">
              {WEEKDAYS_LONG.map((w, idx) => (
                <div key={w} className={`py-2.5 ${idx === 0 || idx === 6 ? "text-accent font-black" : ""}`}>
                  <span className="hidden sm:inline">{w}</span>
                  <span className="sm:hidden">{WEEKDAYS[idx]}</span>
                </div>
              ))}
            </div>

            {/* 日历格子网格 */}
            <div className="grid grid-cols-7 divide-x divide-y divide-line-soft bg-line-soft">
              {calendarDays.map((cell, idx) => {
                const game = cell.game;
                const isMacau = game?.arena.includes("澳门");
                const isSelected = cell.dateStr === selectedCalendarDate;

                return (
                  <div
                    key={cell.dateStr + idx}
                    onClick={() => {
                      setSelectedCalendarDate(cell.dateStr);
                      if (game) setActiveGame(game);
                    }}
                    className={`relative flex min-h-[58px] cursor-pointer flex-col bg-surface p-1 transition-colors sm:min-h-[115px] sm:p-2 lg:min-h-[125px] ${
                      !cell.isCurrentMonth ? "bg-bg-sunk/40 opacity-30" : "hover:bg-bg-sunk/40"
                    } ${isSelected ? "ring-2 ring-inset ring-accent bg-accent-soft/30" : ""}`}
                  >
                    {/* 日期小角标 */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-xs font-bold ${
                          cell.isCurrentMonth ? "text-ink-2" : "text-ink-4"
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {/* 桌面端胶囊 */}
                      {game && (
                        <span
                          className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                            isMacau
                              ? "bg-amber-100 text-amber-900 ring-1 ring-amber-400 font-black dark:bg-amber-950 dark:text-amber-300"
                              : game.isHome
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                          }`}
                        >
                          {isMacau ? "澳门赛" : game.isHome ? "主场" : "客场"}
                        </span>
                      )}

                      {/* 手机端比赛微缩标识 */}
                      {game && (
                        <div className="sm:hidden mt-0.5 flex flex-col items-center justify-center">
                          <div
                            className="flex size-5 items-center justify-center rounded text-[8px] font-black text-white shadow-xs"
                            style={{ backgroundColor: game.opponent.color }}
                          >
                            {game.opponent.abbr.slice(0, 3)}
                          </div>
                          <span className={`text-[8.5px] font-extrabold mt-0.5 leading-none ${isMacau ? "text-amber-500 font-black" : "text-ink-3"}`}>
                            {isMacau ? "🇲🇴澳门" : game.isHome ? "主场" : "客场"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 桌面端卡片内容 */}
                    {game && (
                      <div className="hidden sm:flex mt-1 flex-1 flex-col justify-between overflow-hidden rounded-xl border border-line-soft p-1.5 text-left bg-raised">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="flex size-4 shrink-0 items-center justify-center rounded text-[8px] font-black text-white"
                              style={{ backgroundColor: game.opponent.color }}
                            >
                              {game.opponent.abbr.slice(0, 3)}
                            </div>
                            <span className="truncate text-[11.5px] font-bold text-ink">
                              {game.isHome ? "vs" : "@"} {game.opponent.name}
                            </span>
                          </div>
                          <div className="mt-0.5 font-mono text-[10.5px] text-ink-3">
                            {game.time}
                          </div>
                        </div>

                        <div className="mt-1 text-[9px] font-medium text-ink-4 truncate">
                          {isMacau ? "威尼斯人金光馆" : game.arena.slice(0, 4)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 手机端点击日期后在下方展示的比赛详情卡片 */}
          {selectedDayGame && (
            <div
              onClick={() => setActiveGame(selectedDayGame)}
              className="sm:hidden rounded-2xl border border-accent/40 bg-accent-soft/20 p-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-accent">
                  {selectedDayGame.date} · 比赛日安排
                </span>
                <span className="font-mono text-ink-3">
                  北京时间 {selectedDayGame.time}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 items-center justify-center rounded text-[10px] font-black text-white"
                    style={{ backgroundColor: selectedDayGame.opponent.color }}
                  >
                    {selectedDayGame.opponent.abbr.slice(0, 3)}
                  </div>
                  <span className="text-sm font-black text-ink">
                    休斯敦火箭 {selectedDayGame.isHome ? "VS" : "@"} {selectedDayGame.opponent.name}
                  </span>
                </div>
                <span className="rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-contrast">
                  详情
                </span>
              </div>
              <div className="mt-1 text-xs text-ink-3">
                📍 {selectedDayGame.arena} · 📺 {selectedDayGame.broadcast}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 比赛详情模态弹窗 ── */}
      {activeGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveGame(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部赛事标签与关闭按钮 */}
            <div className="flex items-center justify-between border-b border-line-soft pb-3.5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    activeGame.arena.includes("澳门")
                      ? "bg-amber-400 text-neutral-950 font-black shadow-xs"
                      : activeGame.stage === "cup"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {activeGame.arena.includes("澳门")
                    ? "🇲🇴 NBA 中国澳门赛"
                    : activeGame.stage === "cup"
                    ? "🏆 Emirates NBA Cup 锦标赛"
                    : "2026-27 常规赛"}
                </span>
                <span className="font-mono text-xs text-ink-3">
                  {activeGame.date} {activeGame.time}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="grid size-8 place-items-center rounded-full text-ink-4 hover:bg-bg-sunk hover:text-ink transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 对战双方大比分 / 队徽 */}
            <div className="my-5 flex items-center justify-around sm:my-6">
              {/* 火箭 */}
              <div className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#CE1141] text-xl font-black text-white shadow-lg shadow-[#CE1141]/20 sm:size-16 sm:text-2xl">
                  HOU
                </div>
                <div className="mt-2 text-sm font-bold text-ink sm:text-base">休斯敦火箭</div>
                <div className="text-[11px] text-ink-4">{activeGame.isHome ? "主队" : "客队"}</div>
              </div>

              <div className="text-center">
                <div className="font-mono text-xl font-black italic text-ink-3 sm:text-2xl">VS</div>
                <div className="mt-1 rounded-full bg-bg-sunk px-2 py-0.5 text-[10.5px] font-semibold text-accent">
                  北京时间 {activeGame.time}
                </div>
              </div>

              {/* 对手 */}
              <div className="text-center">
                <div
                  className="mx-auto flex size-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg sm:size-16 sm:text-2xl"
                  style={{ backgroundColor: activeGame.opponent.color }}
                >
                  {activeGame.opponent.abbr.slice(0, 3)}
                </div>
                <div className="mt-2 text-sm font-bold text-ink sm:text-base">
                  {activeGame.opponent.name}
                </div>
                <div className="text-[11px] text-ink-4">{activeGame.isHome ? "客队" : "主队"}</div>
              </div>
            </div>

            {/* 详细看点与对位信息 */}
            <div className="space-y-2.5 rounded-2xl bg-bg-sunk/60 p-3.5 text-xs leading-relaxed text-ink-2 sm:p-4">
              {activeGame.keyMatchup && (
                <div>
                  <span className="font-bold text-ink">🔥 焦点对决：</span>
                  <span className="font-semibold text-accent">{activeGame.keyMatchup}</span>
                </div>
              )}
              {activeGame.previewNotes && (
                <div>
                  <span className="font-bold text-ink">📋 赛事看点：</span>
                  <span>{activeGame.previewNotes}</span>
                </div>
              )}
              <div className="border-t border-line-soft pt-2 text-ink-3">
                <div>📍 比赛场馆：{activeGame.arena}</div>
                <div>📺 直播平台：{activeGame.broadcast}</div>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="mt-4 flex items-center justify-end gap-2 sm:mt-5">
              <button
                type="button"
                onClick={() => handleCopyReminder(activeGame)}
                className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-contrast shadow-sm hover:bg-accent-ink transition-colors"
              >
                {copiedId === activeGame.id ? "已复制提醒到剪贴板 ✓" : "复制观赛提醒"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
