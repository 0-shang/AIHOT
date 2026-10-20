import { useRef, useState, useMemo, useEffect } from "react";
import type { GameItem } from "./rocketsApi";

interface Props {
  games: GameItem[];
  onSelectGame: (gameId: string) => void;
  selectedGameId: string | null;
}

export function RocketsScheduleRail({
  games,
  onSelectGame,
  selectedGameId,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitializedMonth = useRef(false);

  // 获取当前系统日期（YYYY-MM-DD）
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  // 寻找下一场比赛：优先检测正在进行的比赛，否则为第一场尚未完赛的场次（下一场比赛）
  const nextGame = useMemo(() => {
    if (!games || games.length === 0) return null;
    const liveGame = games.find((g) => g.status === "live");
    if (liveGame) return liveGame;

    const upcoming = games.find((g) => g.status !== "final");
    if (upcoming) return upcoming;

    return games[games.length - 1];
  }, [games]);

  // 默认月份优先定位至下一场比赛的月份
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

  useEffect(() => {
    if (!hasInitializedMonth.current && nextGame) {
      const focusMonth = nextGame.date.slice(0, 7);
      setSelectedMonth(focusMonth);
      hasInitializedMonth.current = true;
    }
  }, [nextGame]);

  // 月份列表
  const months = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => {
      const m = g.date.slice(0, 7); // YYYY-MM
      if (m) set.add(m);
    });
    return Array.from(set).sort();
  }, [games]);

  const filteredGames = useMemo(() => {
    if (selectedMonth === "ALL") return games;
    return games.filter((g) => g.date.startsWith(selectedMonth));
  }, [games, selectedMonth]);

  // 自动将下一场比赛滚动至视口中央
  useEffect(() => {
    if (nextGame && scrollRef.current) {
      const cardEl = document.getElementById(`schedule-game-${nextGame.id}`);
      if (cardEl) {
        const timer = setTimeout(() => {
          cardEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [nextGame, selectedMonth]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -460 : 460;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const getMonthLabel = (mStr: string) => {
    const parts = mStr.split("-");
    const monthNum = Number(parts[1]);
    return `${monthNum}月`;
  };

  return (
    <section>
      {/* 头部标题与月份单行滑动轨道 */}
      <div className="flex flex-col gap-2.5 mb-3 px-0.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#CE1141] rounded-full inline-block"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              2026-27 全季赛程与战报
            </h2>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              ({games.length} 场)
            </span>
          </div>

          <div className="flex items-center gap-2">

            {/* 桌面端左右翻页按钮 */}
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs transition-colors"
                title="向左滚动"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs transition-colors"
                title="向右滚动"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* 现代移动优先月份胶囊栏：单行横滑、不换行不拥挤 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full -mx-1 px-1 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setSelectedMonth("ALL")}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedMonth === "ALL"
                ? "bg-[#CE1141] text-white shadow-xs font-bold"
                : "bg-surface border border-line-soft text-ink-3 hover:text-ink hover:border-line-strong"
            }`}
          >
            全部
          </button>
          {months.map((m) => {
            const isActive = selectedMonth === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(m)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#CE1141] text-white shadow-xs font-bold"
                    : "bg-surface border border-line-soft text-ink-3 hover:text-ink hover:border-line-strong"
                }`}
              >
                {getMonthLabel(m)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 赛程卡片轨道：采用 NBA 官方规范队标 + 现代上下对阵记分牌 */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scroll-smooth select-none focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1 sm:mx-0 sm:px-0"
      >
        {filteredGames.map((g) => {
          const isFinal = g.status === "final";
          const isLive = g.status === "live";
          const isWin = g.result?.outcome === "W";
          const isSelected = selectedGameId === g.id;

          // 客队与主队判定
          const awayTeam = g.isHome
            ? { name: g.opponent.name, abbr: g.opponent.abbr, score: g.result?.opponentScore }
            : { name: "休斯敦火箭", abbr: "HOU", score: g.result?.rocketsScore };

          const homeTeam = g.isHome
            ? { name: "休斯敦火箭", abbr: "HOU", score: g.result?.rocketsScore }
            : { name: g.opponent.name, abbr: g.opponent.abbr, score: g.result?.opponentScore };

          const isAwayRockets = awayTeam.abbr === "HOU";
          const isHomeRockets = homeTeam.abbr === "HOU";

          const isNextGame = nextGame?.id === g.id;

          return (
            <div
              key={g.id}
              id={`schedule-game-${g.id}`}
              onClick={() => (isFinal || isLive) && onSelectGame(g.id)}
              className={`flex-shrink-0 w-60 sm:w-64 rounded-xl p-3.5 border transition-all text-xs flex flex-col justify-between ${
                isLive
                  ? "cursor-pointer ring-2 ring-[#CE1141] border-[#CE1141] bg-red-50/30 dark:bg-[#1f1013] shadow-md hover:shadow-lg"
                  : isNextGame
                    ? "ring-2 ring-[#CE1141] border-[#CE1141] bg-white dark:bg-[#14161b] shadow-sm"
                    : isFinal
                      ? "cursor-pointer hover:border-[#CE1141]/50 bg-white dark:bg-[#14161b] shadow-xs hover:shadow-md border-slate-200 dark:border-white/10"
                      : "cursor-default bg-slate-50/60 dark:bg-[#111317] border-slate-200 dark:border-white/10"
              } ${
                isSelected ? "border-[#CE1141] ring-2 ring-[#CE1141]" : ""
              }`}
            >
              {/* 卡片顶部：比赛时间与状态（下一场直接红框展示，不使用花哨徽标） */}
              <div className="flex items-center justify-between text-[11px] pb-2 mb-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-slate-600 dark:text-zinc-400 font-medium">
                    {g.date.slice(5)} {g.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {g.stage === "preseason" ? "季前赛" : "常规赛"}
                  </span>
                  {isFinal ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isWin
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}
                    >
                      {isWin ? "胜" : "负"}
                    </span>
                  ) : isLive ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#CE1141] text-white flex items-center gap-1 shadow-xs animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                      {g.progress || "进行中"}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-white/5 px-1.5 py-0.2 rounded font-medium">
                      待开赛
                    </span>
                  )}
                </div>
              </div>

              {/* 卡片中部：客队 vs 主队，使用官方队徽，排版专业干练 */}
              <div className="space-y-2.5 py-1 font-sans">
                {/* 客队行 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={`https://a.espncdn.com/i/teamlogos/nba/500/${awayTeam.abbr.toLowerCase()}.png`}
                      alt={awayTeam.name}
                      className="w-5 h-5 object-contain flex-shrink-0"
                      loading="lazy"
                    />
                    <span
                      className={`text-xs truncate ${
                        isAwayRockets
                          ? "font-bold text-[#CE1141] dark:text-[#ff4d6d]"
                          : "font-medium text-slate-800 dark:text-zinc-200"
                      }`}
                    >
                      {awayTeam.name}
                    </span>
                    {isAwayRockets && (
                      <span className="text-[9px] px-1 rounded bg-[#CE1141]/10 text-[#CE1141] font-bold">客</span>
                    )}
                  </div>
                  <span
                    className={`font-mono text-sm ${
                      (isFinal || isLive) && awayTeam.score !== undefined
                        ? isLive
                          ? "font-black text-[#CE1141] dark:text-[#ff4d6d]"
                          : awayTeam.score > (homeTeam.score ?? 0)
                            ? "font-black text-slate-900 dark:text-white"
                            : "text-slate-400 dark:text-zinc-500"
                        : "text-slate-400 dark:text-zinc-600"
                    }`}
                  >
                    {isFinal || isLive ? awayTeam.score : "--"}
                  </span>
                </div>

                {/* 主队行 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={`https://a.espncdn.com/i/teamlogos/nba/500/${homeTeam.abbr.toLowerCase()}.png`}
                      alt={homeTeam.name}
                      className="w-5 h-5 object-contain flex-shrink-0"
                      loading="lazy"
                    />
                    <span
                      className={`text-xs truncate ${
                        isHomeRockets
                          ? "font-bold text-[#CE1141] dark:text-[#ff4d6d]"
                          : "font-medium text-slate-800 dark:text-zinc-200"
                      }`}
                    >
                      {homeTeam.name}
                    </span>
                    {isHomeRockets && (
                      <span className="text-[9px] px-1 rounded bg-[#CE1141]/10 text-[#CE1141] font-bold">主</span>
                    )}
                  </div>
                  <span
                    className={`font-mono text-sm ${
                      (isFinal || isLive) && homeTeam.score !== undefined
                        ? isLive
                          ? "font-black text-[#CE1141] dark:text-[#ff4d6d]"
                          : homeTeam.score > (awayTeam.score ?? 0)
                            ? "font-black text-slate-900 dark:text-white"
                            : "text-slate-400 dark:text-zinc-500"
                        : "text-slate-400 dark:text-zinc-600"
                    }`}
                  >
                    {isFinal || isLive ? homeTeam.score : "--"}
                  </span>
                </div>
              </div>

              {/* 卡片底部：场馆与跳转动作 */}
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 dark:text-zinc-500 truncate max-w-[130px]">
                  {g.arena.split("·")[0] || g.arena}
                </span>
                {isFinal ? (
                  <span className="text-[#CE1141] font-semibold hover:underline">
                    查看战报 ›
                  </span>
                ) : isLive ? (
                  <span className="text-[#CE1141] font-bold flex items-center gap-1 hover:underline">
                    实时技术统计 ›
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-zinc-600 text-[10px]">
                    {g.isHome ? "主场迎战" : "客场出战"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
