import { useState, useMemo } from "react";
import { ROCKETS_GAMES, type GameData } from "./rocketsSchedule";
import { BOXSCORE_MAP, type GameBoxScore } from "./nbaData";
import { IconCalendar, IconClose } from "../../components/icons";

const MONTHS = [
  { year: 2026, month: 10, label: "10月", subtitle: "季前赛 & 揭幕战" },
  { year: 2026, month: 11, label: "11月", subtitle: "常规赛 & NBA杯" },
  { year: 2026, month: 12, label: "12月", subtitle: "常规赛征程" },
  { year: 2027, month: 1, label: "1月", subtitle: "得州内战焦点月" },
  { year: 2027, month: 2, label: "2月", subtitle: "全明星周末" },
  { year: 2027, month: 3, label: "3月", subtitle: "季后赛卡位战" },
  { year: 2027, month: 4, label: "4月", subtitle: "常规赛收官" },
];

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
function getWeekday(dateStr: string) {
  return WEEKDAYS[new Date(dateStr).getDay()] || "";
}

export function ScheduleCalendar() {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [filterType, setFilterType] = useState<"all" | "final" | "upcoming" | "home" | "away" | "cup">("all");
  const [activeBoxScore, setActiveBoxScore] = useState<GameBoxScore | null>(null);
  const [activeGame, setActiveGame] = useState<GameData | null>(null);
  const [activeTeamTab, setActiveTeamTab] = useState<"rockets" | "opponent">("rockets");

  const currentMonth = MONTHS[selectedMonthIdx]!;
  const monthPrefix = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}`;

  // 当月比赛
  const monthGames = useMemo(() => {
    return ROCKETS_GAMES.filter((g) => g.date.startsWith(monthPrefix));
  }, [monthPrefix]);

  // 按类型过滤比赛
  const filteredGames = useMemo(() => {
    return monthGames.filter((g) => {
      if (filterType === "final") return g.status === "final";
      if (filterType === "upcoming") return g.status === "upcoming";
      if (filterType === "home") return g.isHome;
      if (filterType === "away") return !g.isHome;
      if (filterType === "cup") return g.stage === "cup";
      return true;
    });
  }, [monthGames, filterType]);

  // 最新已完赛焦点战报
  const featuredGame = useMemo(() => {
    return ROCKETS_GAMES.find((g) => g.status === "final") || ROCKETS_GAMES[0]!;
  }, []);

  const handleOpenDetail = (game: GameData) => {
    if (game.status !== "final") return; // 仅完赛比赛可查看技术统计
    setActiveGame(game);
    setActiveTeamTab("rockets");
    const box = BOXSCORE_MAP[game.id];
    if (box) {
      setActiveBoxScore(box);
    } else {
      setActiveBoxScore(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部状态与筛选胶囊 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft pb-4">
        <div className="flex items-center gap-2 text-sm font-black text-ink">
          <IconCalendar size={18} className="text-[#CE1141]" />
          <span>休斯敦火箭 2026-27 赛季赛程战报流</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none sm:pb-0">
          {[
            { key: "all", label: "全部" },
            { key: "final", label: "已完赛" },
            { key: "upcoming", label: "未开赛" },
            { key: "home", label: "主场" },
            { key: "away", label: "客场" },
            { key: "cup", label: "NBA杯" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterType(f.key as any)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                filterType === f.key
                  ? "bg-[#CE1141] text-white shadow-xs font-bold"
                  : "border border-line-soft bg-surface text-ink-3 hover:border-line hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 最新焦点战报置顶卡片 */}
      {featuredGame && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#CE1141]/20 bg-surface p-5 shadow-sm transition-all hover:border-[#CE1141]/40">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-[#CE1141] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
            {featuredGame.status === "final" ? "最新战报" : "下轮预告"}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-ink-3">
                <span className="font-bold text-accent">
                  {featuredGame.arena.includes("澳门") ? "NBA 澳门季前赛" : featuredGame.stage === "cup" ? "NBA 杯赛" : "常规赛"}
                </span>
                <span>·</span>
                <span className="font-mono">{featuredGame.date} {getWeekday(featuredGame.date)} · 北京时间 {featuredGame.time}</span>
              </div>

              {featuredGame.status === "final" && featuredGame.result ? (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-ink">休斯敦火箭</span>
                    <span className="font-mono text-3xl font-black text-[#CE1141]">{featuredGame.result.rocketsScore}</span>
                    <span className="text-lg font-bold text-ink-4">-</span>
                    <span className="font-mono text-2xl font-black text-ink-2">{featuredGame.result.opponentScore}</span>
                    <span className="text-2xl font-black text-ink-2">{featuredGame.opponent.name}</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {featuredGame.result.outcome === "W" ? "胜 WIN" : "负 LOSS"}
                  </span>
                </div>
              ) : (
                <h2 className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                  休斯敦火箭 {featuredGame.isHome ? "VS" : "@"} {featuredGame.opponent.name}
                </h2>
              )}

              {featuredGame.result?.topPerformer && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ★ 全场最佳：{featuredGame.result.topPerformer.name} · {featuredGame.result.topPerformer.stats}
                </p>
              )}
            </div>

            {featuredGame.status === "final" && (
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(featuredGame)}
                  className="rounded-xl bg-[#CE1141] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#b00e36]"
                >
                  查看双方球员技术统计 Boxscore →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 月份快捷标签 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MONTHS.map((m, idx) => (
          <button
            key={m.label}
            type="button"
            onClick={() => setSelectedMonthIdx(idx)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedMonthIdx === idx
                ? "bg-ink text-bg font-bold shadow-xs"
                : "border border-line-soft bg-surface text-ink-3 hover:border-line hover:text-ink"
            }`}
          >
            <span>{m.label}</span>
            <span className="text-[11px] opacity-75">{m.subtitle}</span>
          </button>
        ))}
      </div>

      {/* 瀑布流比赛卡片列表 */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredGames.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-line-soft bg-surface py-16 text-center text-xs text-ink-4">
            当前筛选下暂无比赛安排
          </div>
        ) : (
          filteredGames.map((game) => {
            const isFinal = game.status === "final" && game.result;
            const isWin = isFinal && game.result?.outcome === "W";
            return (
              <div
                key={game.id}
                onClick={() => isFinal && handleOpenDetail(game)}
                className={`group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-2xs transition-all ${
                  isFinal
                    ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#CE1141]/50 hover:shadow-sm"
                    : "cursor-default"
                }`}
              >
                {/* 卡片头部：时间与状态 */}
                <div className="flex items-center justify-between border-b border-line-soft pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">
                      {game.date.slice(5)} {getWeekday(game.date)}
                    </span>
                    <span className="font-mono text-ink-3">{game.time}</span>
                  </div>
                  {isFinal ? (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-black ${
                        isWin
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isWin ? "胜 W" : "负 L"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-ink-3">
                      {game.stage === "cup" ? "NBA杯" : game.isHome ? "主场" : "客场"}
                    </span>
                  )}
                </div>

                {/* 卡片主体：对战球队与比分 */}
                <div className="my-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#CE1141]" />
                        <span className="text-sm font-extrabold text-ink sm:text-base">
                          休斯敦火箭
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-slate-400" />
                        <span className="text-sm font-extrabold text-ink-2 sm:text-base">
                          {game.opponent.name}
                        </span>
                      </div>
                    </div>

                    {/* 比分展示 */}
                    {isFinal ? (
                      <div className="text-right">
                        <div className="font-mono text-lg font-black text-[#CE1141]">
                          {game.result!.rocketsScore}
                        </div>
                        <div className="font-mono text-lg font-black text-ink-2">
                          {game.result!.opponentScore}
                        </div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-ink-4">VS</span>
                      </div>
                    )}
                  </div>

                  {/* 仅完赛比赛显示最佳球员 */}
                  {isFinal && game.result?.topPerformer && (
                    <div className="rounded-xl bg-bg-sunk/60 p-2 text-[11.5px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                      ★ 最佳：{game.result.topPerformer.name} · {game.result.topPerformer.stats}
                    </div>
                  )}
                </div>

                {/* 卡片底部：场馆与转播 / 详情提示 */}
                <div className="flex items-center justify-between border-t border-line-soft pt-2 text-[11.5px] text-ink-4">
                  <span className="truncate max-w-[200px]">{game.arena}</span>
                  {isFinal ? (
                    <span className="font-semibold text-accent group-hover:underline">
                      技术统计 →
                    </span>
                  ) : (
                    <span className="text-ink-4">{game.broadcast}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 比赛球员技术统计 Boxscore 弹窗 */}
      {activeGame && activeBoxScore && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-xs sm:p-6"
          onClick={() => setActiveGame(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部：对阵与比分 */}
            <div className="flex items-center justify-between border-b border-line bg-bg-sunk/30 px-5 py-3.5">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-ink-4">
                  {activeGame.date} {getWeekday(activeGame.date)} · {activeGame.arena}
                </span>
                <h3 className="text-base font-black text-ink sm:text-lg">
                  休斯敦火箭 {activeGame.isHome ? "VS" : "@"} {activeGame.opponent.name}
                  {activeGame.result && (
                    <span className="ml-3 font-mono text-[#CE1141]">
                      {activeGame.result.rocketsScore} - {activeGame.result.opponentScore}
                    </span>
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="grid size-8 place-items-center rounded-full text-ink-4 transition-colors hover:bg-bg-sunk hover:text-ink"
              >
                <IconClose size={18} />
              </button>
            </div>

            {/* 内容区：滚动展示详细数据 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* 单节比分明细表 */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-ink-3">四节比分明细</h4>
                <div className="overflow-hidden rounded-xl border border-line">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-bg-sunk/50 font-semibold text-ink-3">
                      <tr>
                        <th className="py-2 pl-3 text-left">球队</th>
                        <th className="py-2">第一节</th>
                        <th className="py-2">第二节</th>
                        <th className="py-2">第三节</th>
                        <th className="py-2">第四节</th>
                        <th className="py-2 pr-3 font-bold text-ink">总分</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-soft font-mono">
                      <tr className="font-bold text-[#CE1141]">
                        <td className="py-2 pl-3 text-left">休斯敦火箭</td>
                        {activeBoxScore.quarters.rockets.map((q, i) => (
                          <td key={i} className="py-2">{q}</td>
                        ))}
                        <td className="py-2 pr-3 font-black text-base">
                          {activeGame.result?.rocketsScore}
                        </td>
                      </tr>
                      <tr className="text-ink-2">
                        <td className="py-2 pl-3 text-left">{activeGame.opponent.name}</td>
                        {activeBoxScore.quarters.opponent.map((q, i) => (
                          <td key={i} className="py-2">{q}</td>
                        ))}
                        <td className="py-2 pr-3 font-black text-base text-ink">
                          {activeGame.result?.opponentScore}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 球队技术统计切换 Tab：火箭队 VS 对方球队 */}
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex rounded-xl bg-bg-sunk p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTeamTab("rockets")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        activeTeamTab === "rockets"
                          ? "bg-surface text-[#CE1141] shadow-xs"
                          : "text-ink-3 hover:text-ink"
                      }`}
                    >
                      <span className="size-2 rounded-full bg-[#CE1141]" />
                      休斯敦火箭 技术统计
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTeamTab("opponent")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        activeTeamTab === "opponent"
                          ? "bg-surface text-ink shadow-xs"
                          : "text-ink-3 hover:text-ink"
                      }`}
                    >
                      <span className="size-2 rounded-full bg-slate-400" />
                      {activeGame.opponent.name} 技术统计
                    </button>
                  </div>
                  <span className="text-[11px] text-ink-4">MIN: 出场时间 · +/-: 正负值</span>
                </div>

                {/* 球员数据表格 */}
                <div className="overflow-x-auto rounded-xl border border-line">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-line bg-bg-sunk/50 text-[11px] font-bold text-ink-3">
                      <tr>
                        <th className="py-2.5 pl-3">球员</th>
                        <th className="py-2.5 px-2 text-center">位置</th>
                        <th className="py-2.5 px-2 text-right">时间</th>
                        <th className="py-2.5 px-2 text-right font-black text-[#CE1141]">得分</th>
                        <th className="py-2.5 px-2 text-right font-bold text-ink">篮板</th>
                        <th className="py-2.5 px-2 text-right font-bold text-ink">助攻</th>
                        <th className="py-2.5 px-2 text-right">抢断</th>
                        <th className="py-2.5 px-2 text-right">盖帽</th>
                        <th className="py-2.5 px-2 text-right">投篮</th>
                        <th className="py-2.5 px-2 text-right">命中率</th>
                        <th className="py-2.5 px-2 text-right">三分</th>
                        <th className="py-2.5 pl-2 pr-3 text-right">+/-</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-soft font-mono">
                      {(activeTeamTab === "rockets"
                        ? activeBoxScore.rocketsPlayers
                        : activeBoxScore.opponentPlayers
                      ).map((p) => (
                        <tr key={p.name} className="hover:bg-bg-sunk/30">
                          <td className="py-2 pl-3 font-sans font-bold text-ink flex items-center gap-1">
                            {p.name}
                            <span className="text-[10px] text-ink-4">#{p.number}</span>
                          </td>
                          <td className="py-2 px-2 text-center text-ink-4">{p.position}</td>
                          <td className="py-2 px-2 text-right text-ink-3">{p.minutes}</td>
                          <td className="py-2 px-2 text-right font-black text-[#CE1141]">{p.points}</td>
                          <td className="py-2 px-2 text-right font-bold text-ink">{p.rebounds}</td>
                          <td className="py-2 px-2 text-right font-bold text-ink">{p.assists}</td>
                          <td className="py-2 px-2 text-right text-ink-3">{p.steals}</td>
                          <td className="py-2 px-2 text-right text-ink-3">{p.blocks}</td>
                          <td className="py-2 px-2 text-right text-ink-4">{p.fg}</td>
                          <td className="py-2 px-2 text-right text-ink-3">{p.fgPct}</td>
                          <td className="py-2 px-2 text-right text-ink-4">{p.threePt}</td>
                          <td className={`py-2 pl-2 pr-3 text-right font-bold ${p.plusMinus.startsWith("+") ? "text-emerald-600" : p.plusMinus.startsWith("-") ? "text-red-500" : "text-ink-3"}`}>
                            {p.plusMinus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 弹窗底部：关闭按钮 */}
            <div className="flex items-center justify-end border-t border-line bg-bg-sunk/30 px-5 py-3">
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="rounded-full border border-line-strong bg-surface px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-bg-sunk"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
