import { useRef, useState, useMemo } from "react";
import type { GameItem } from "./rocketsApi";

interface Props {
  games: GameItem[];
  onSelectGame: (gameId: string) => void;
  selectedGameId: string | null;
}

export function RocketsScheduleRail({ games, onSelectGame, selectedGameId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

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
    <section className="mb-6">
      {/* 头部精炼标题与月份筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#CE1141] rounded-full inline-block"></span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            2026-27 全季赛程与战报
          </h2>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
            ({games.length} 场)
          </span>
        </div>

        {/* 快速月份切换与滑动控制 */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto max-w-full pb-1 sm:pb-0">
          <div className="flex items-center bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setSelectedMonth("ALL")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedMonth === "ALL"
                  ? "bg-[#CE1141] text-white font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              全部
            </button>
            {months.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(m)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedMonth === m
                    ? "bg-[#CE1141] text-white font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {getMonthLabel(m)}
              </button>
            ))}
          </div>

          {/* 左右滑动指示按钮 */}
          <div className="flex items-center gap-1 flex-shrink-0">
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

      {/* 赛程卡片轨道：采用 NBA 官方规范队标 + 现代上下对阵记分牌，彻底摒弃虎扑方块缩写 */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scroll-smooth select-none focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filteredGames.map((g) => {
          const isFinal = g.status === "final";
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

          return (
            <div
              key={g.id}
              onClick={() => isFinal && onSelectGame(g.id)}
              className={`flex-shrink-0 w-60 sm:w-64 rounded-xl p-3.5 border transition-all text-xs flex flex-col justify-between ${
                isFinal
                  ? "cursor-pointer hover:border-[#CE1141]/50 bg-white dark:bg-[#14161b] shadow-xs hover:shadow-md"
                  : "cursor-default bg-slate-50/60 dark:bg-[#111317]"
              } ${
                isSelected
                  ? "border-[#CE1141] ring-1 ring-[#CE1141] bg-red-50/20 dark:bg-[#1c1316]"
                  : "border-slate-200 dark:border-white/10"
              }`}
            >
              {/* 卡片顶部：比赛时间、赛段与状态 */}
              <div className="flex items-center justify-between text-[11px] pb-2 mb-2 border-b border-slate-100 dark:border-white/5">
                <span className="font-mono text-slate-600 dark:text-zinc-400 font-medium">
                  {g.date.slice(5)} {g.time}
                </span>
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
                      isFinal && awayTeam.score !== undefined
                        ? awayTeam.score > (homeTeam.score ?? 0)
                          ? "font-black text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-zinc-500"
                        : "text-slate-400 dark:text-zinc-600"
                    }`}
                  >
                    {isFinal ? awayTeam.score : "--"}
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
                      isFinal && homeTeam.score !== undefined
                        ? homeTeam.score > (awayTeam.score ?? 0)
                          ? "font-black text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-zinc-500"
                        : "text-slate-400 dark:text-zinc-600"
                    }`}
                  >
                    {isFinal ? homeTeam.score : "--"}
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
                    查看统计 ›
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
