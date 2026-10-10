import { useState, useMemo } from "react";
import type { PlayerStatsData } from "./rocketsApi";

interface Props {
  players: PlayerStatsData[];
  onSelectPlayer: (player: PlayerStatsData) => void;
}

type SortField =
  | "number"
  | "pts"
  | "reb"
  | "ast"
  | "stl"
  | "blk"
  | "tov"
  | "mpg"
  | "fgPct"
  | "threePtPct"
  | "ftPct"
  | "gp"
  | "age";

export function RocketsRosterSection({ players, onSelectPlayer }: Props) {
  const [filterPos, setFilterPos] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("pts");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleHeaderSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // 默认降序
    }
  };

  // 检查是否已有 2026-27 常规赛数据
  const has2026Stats = useMemo(() => {
    return players.some(
      (p) => p.seasons?.["2026-27"] && p.seasons["2026-27"].gp > 0
    );
  }, [players]);

  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => {
        if (filterPos === "G" && !p.position.includes("G")) return false;
        if (filterPos === "F" && !p.position.includes("F")) return false;
        if (filterPos === "C" && !p.position.includes("C")) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.nameCn.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.number.includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const sA = (has2026Stats && a.seasons?.["2026-27"]?.gp ? a.seasons["2026-27"] : a.seasons?.["2025-26"] || a.stats);
        const sB = (has2026Stats && b.seasons?.["2026-27"]?.gp ? b.seasons["2026-27"] : b.seasons?.["2025-26"] || b.stats);

        let valA = 0;
        let valB = 0;

        switch (sortField) {
          case "number":
            valA = Number(a.number) || 99;
            valB = Number(b.number) || 99;
            break;
          case "pts":
            valA = sA.pts || 0;
            valB = sB.pts || 0;
            break;
          case "reb":
            valA = sA.reb || 0;
            valB = sB.reb || 0;
            break;
          case "ast":
            valA = sA.ast || 0;
            valB = sB.ast || 0;
            break;
          case "stl":
            valA = sA.stl || 0;
            valB = sB.stl || 0;
            break;
          case "blk":
            valA = sA.blk || 0;
            valB = sB.blk || 0;
            break;
          case "tov":
            valA = sA.tov || 0;
            valB = sB.tov || 0;
            break;
          case "mpg":
            valA = sA.mpg || 0;
            valB = sB.mpg || 0;
            break;
          case "fgPct":
            valA = sA.fgPct || 0;
            valB = sB.fgPct || 0;
            break;
          case "threePtPct":
            valA = sA.threePtPct || 0;
            valB = sB.threePtPct || 0;
            break;
          case "ftPct":
            valA = sA.ftPct || 0;
            valB = sB.ftPct || 0;
            break;
          case "gp":
            valA = sA.gp || 0;
            valB = sB.gp || 0;
            break;
          case "age":
            valA = a.age || 0;
            valB = b.age || 0;
            break;
        }

        return sortAsc ? valA - valB : valB - valA;
      });
  }, [players, filterPos, searchQuery, sortField, sortAsc, has2026Stats]);

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return <span className="text-slate-400 dark:text-zinc-600 ml-0.5 text-[10px]">↕</span>;
    return <span className="text-[#CE1141] font-bold ml-0.5 text-[10px]">{sortAsc ? "▲" : "▼"}</span>;
  };

  return (
    <section className="mb-12">
      {/* 头部控制栏：标题、位置筛选、搜索 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#CE1141] rounded-full inline-block"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              2026-27 赛季火箭官方球员名册与技术统计
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400">
              ESPN 大名单 ({players.length}人)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            {has2026Stats
              ? "显示 2026-27 赛季常规赛最新数据 · 点击各表头可多维度排序 · 点击球员查看档案"
              : "当前呈现 2025-26 赛季数据 · 2026-27 常规赛打响后自动切换最新数据 · 支持点击表头排序"}
          </p>
        </div>

        {/* 筛选与搜索控件 */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
            {[
              { id: "ALL", label: "全部" },
              { id: "G", label: "后卫" },
              { id: "F", label: "前锋" },
              { id: "C", label: "中锋" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterPos(tab.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterPos === tab.id
                    ? "bg-[#CE1141] text-white font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索球员或号码..."
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#CE1141] w-36 sm:w-44"
            />
            <span className="absolute left-2 top-1.5 text-slate-400 dark:text-zinc-500 text-xs">🔍</span>
          </div>
        </div>
      </div>

      {/* ===== 1. 桌面端专业高密度数据表：紧凑身份列，充实多维篮球指标 (ZERO horizontal scrollbar) ===== */}
      <div className="hidden md:block bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs transition-colors">
        <table className="w-full text-left text-xs table-fixed">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 text-[11px] font-semibold select-none">
              <th className="py-2.5 px-2.5 w-[16%]">球员 / 号码</th>
              <th
                onClick={() => handleHeaderSort("age")}
                className="py-2.5 px-1 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[5%]"
              >
                年龄 {renderSortArrow("age")}
              </th>
              <th className="py-2.5 px-2 w-[11%]">大学 / 选秀</th>
              <th
                onClick={() => handleHeaderSort("pts")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-[#CE1141] font-bold text-slate-900 dark:text-white bg-slate-100/60 dark:bg-white/[0.02] w-[7%]"
              >
                得分 {renderSortArrow("pts")}
              </th>
              <th
                onClick={() => handleHeaderSort("reb")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[6%]"
              >
                篮板 {renderSortArrow("reb")}
              </th>
              <th
                onClick={() => handleHeaderSort("ast")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[6%]"
              >
                助攻 {renderSortArrow("ast")}
              </th>
              <th
                onClick={() => handleHeaderSort("stl")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[6%]"
              >
                抢断 {renderSortArrow("stl")}
              </th>
              <th
                onClick={() => handleHeaderSort("blk")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[6%]"
              >
                盖帽 {renderSortArrow("blk")}
              </th>
              <th
                onClick={() => handleHeaderSort("tov")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[5%]"
              >
                失误 {renderSortArrow("tov")}
              </th>
              <th
                onClick={() => handleHeaderSort("fgPct")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[7%]"
              >
                投篮% {renderSortArrow("fgPct")}
              </th>
              <th
                onClick={() => handleHeaderSort("threePtPct")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[7%]"
              >
                三分% {renderSortArrow("threePtPct")}
              </th>
              <th
                onClick={() => handleHeaderSort("ftPct")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[7%]"
              >
                罚球% {renderSortArrow("ftPct")}
              </th>
              <th
                onClick={() => handleHeaderSort("mpg")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[6%]"
              >
                时间 {renderSortArrow("mpg")}
              </th>
              <th
                onClick={() => handleHeaderSort("gp")}
                className="py-2.5 px-1.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white w-[5%]"
              >
                场次 {renderSortArrow("gp")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-8 text-center text-slate-400 dark:text-zinc-500 font-sans">
                  未找到匹配球员
                </td>
              </tr>
            ) : (
              filteredPlayers.map((p) => {
                const s = (has2026Stats && p.seasons?.["2026-27"]?.gp ? p.seasons["2026-27"] : p.seasons?.["2025-26"] || p.stats);
                const isTopStar = p.nameEn.includes("Durant") || p.nameEn.includes("Sengun");

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPlayer(p)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] group ${
                      isTopStar ? "bg-red-50/15 dark:bg-[#CE1141]/5" : ""
                    }`}
                  >
                    {/* 球员名、头像与位置 */}
                    <td className="py-2 px-2.5 font-sans truncate">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={p.headshotUrl}
                            alt={p.nameCn}
                            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 object-cover object-top border border-slate-200 dark:border-white/10"
                            loading="lazy"
                          />
                          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-slate-800 text-white font-mono text-[8px] font-bold">
                            #{p.number}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 dark:text-zinc-100 text-xs truncate group-hover:text-[#CE1141] transition-colors">
                              {p.nameCn}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                              {p.position}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono truncate block">
                            {p.height}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 年龄 */}
                    <td className="py-2 px-1 text-center text-slate-600 dark:text-zinc-400 text-xs">
                      {p.age}
                    </td>

                    {/* 选秀/大学背景 */}
                    <td className="py-2 px-2 font-sans text-slate-600 dark:text-zinc-400 text-[11px] truncate">
                      {p.college}
                    </td>

                    {/* 得分 */}
                    <td className="py-2 px-1.5 text-center font-bold text-sm bg-slate-50/60 dark:bg-white/[0.01]">
                      <span className={s.pts >= 20 ? "text-[#CE1141] font-black" : s.pts >= 15 ? "text-slate-900 dark:text-zinc-100" : "text-slate-700 dark:text-zinc-300"}>
                        {s.pts ? s.pts.toFixed(1) : "--"}
                      </span>
                    </td>

                    {/* 篮板 */}
                    <td className="py-2 px-1.5 text-center text-slate-800 dark:text-zinc-200">
                      {s.reb ? s.reb.toFixed(1) : "--"}
                    </td>

                    {/* 助攻 */}
                    <td className="py-2 px-1.5 text-center text-slate-800 dark:text-zinc-200">
                      {s.ast ? s.ast.toFixed(1) : "--"}
                    </td>

                    {/* 抢断 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.stl ? s.stl.toFixed(1) : "--"}
                    </td>

                    {/* 盖帽 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.blk ? s.blk.toFixed(1) : "--"}
                    </td>

                    {/* 失误 */}
                    <td className="py-2 px-1.5 text-center text-slate-500 dark:text-zinc-400">
                      {s.tov ? s.tov.toFixed(1) : "--"}
                    </td>

                    {/* 投篮命中率 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.fgPct ? `${s.fgPct.toFixed(1)}%` : "--"}
                    </td>

                    {/* 三分命中率 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.threePtPct ? `${s.threePtPct.toFixed(1)}%` : "--"}
                    </td>

                    {/* 罚球命中率 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.ftPct ? `${s.ftPct.toFixed(1)}%` : "--"}
                    </td>

                    {/* 出场时间 */}
                    <td className="py-2 px-1.5 text-center text-slate-600 dark:text-zinc-400 text-[11px]">
                      {s.mpg ? `${s.mpg.toFixed(1)}'` : "--"}
                    </td>

                    {/* 出场场次 */}
                    <td className="py-2 px-1.5 text-center text-slate-600 dark:text-zinc-400 text-xs">
                      {s.gp ?? "--"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ===== 2. 手机端卡片流：一体化流线长条展示 (ZERO horizontal scrollbar) ===== */}
      <div className="block md:hidden space-y-2">
        {filteredPlayers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
            未找到匹配球员
          </div>
        ) : (
          filteredPlayers.map((p) => {
            const s = (has2026Stats && p.seasons?.["2026-27"]?.gp ? p.seasons["2026-27"] : p.seasons?.["2025-26"] || p.stats);
            const isHighScorer = s.pts >= 18;

            return (
              <div
                key={p.id}
                onClick={() => onSelectPlayer(p)}
                className="bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs shadow-xs active:scale-[0.99] transition-transform"
              >
                {/* 顶行：头像 + 姓名 + 位置 + 年龄 + 箭头 */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={p.headshotUrl}
                        alt={p.nameCn}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 object-cover object-top border border-slate-200 dark:border-white/10"
                        loading="lazy"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-slate-800 text-white font-mono text-[8px] font-bold">
                        #{p.number}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {p.nameCn}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 font-sans">
                          {p.position}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-sans">
                          {p.age}岁 · {p.college}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-slate-400 dark:text-zinc-500 text-sm">›</span>
                </div>

                {/* 核心数据单体流线长条 (长条设计，非分立方块) */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.04] px-2 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">分</span>
                    <span className={`font-bold text-sm ${isHighScorer ? "text-[#CE1141]" : "text-slate-900 dark:text-white"}`}>
                      {s.pts ? s.pts.toFixed(1) : "--"}
                    </span>
                  </div>
                  <span className="text-slate-200 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">板</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{s.reb ? s.reb.toFixed(1) : "--"}</span>
                  </div>
                  <span className="text-slate-200 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">助</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{s.ast ? s.ast.toFixed(1) : "--"}</span>
                  </div>
                  <span className="text-slate-200 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">断</span>
                    <span className="text-slate-700 dark:text-zinc-300">{s.stl ? s.stl.toFixed(1) : "--"}</span>
                  </div>
                  <span className="text-slate-200 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">帽</span>
                    <span className="text-slate-700 dark:text-zinc-300">{s.blk ? s.blk.toFixed(1) : "--"}</span>
                  </div>
                  <span className="text-slate-200 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">投%</span>
                    <span className="text-slate-700 dark:text-zinc-300 text-[11px]">{s.fgPct ? `${s.fgPct.toFixed(0)}%` : "--"}</span>
                  </div>
                  <span className="text-slate-200 dark:text-zinc-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-sans">3P%</span>
                    <span className="text-slate-700 dark:text-zinc-300 text-[11px]">{s.threePtPct ? `${s.threePtPct.toFixed(0)}%` : "--"}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
