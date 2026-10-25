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
  const [seasonView, setSeasonView] = useState<"2026-27" | "2025-26">("2026-27");
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

  const getPlayerSeasonStat = (p: PlayerStatsData) => {
    if (seasonView === "2026-27") {
      return (
        p.seasons?.["2026-27"] || {
          season: "2026-27",
          gp: 0,
          gs: 0,
          mpg: 0,
          pts: 0,
          reb: 0,
          ast: 0,
          stl: 0,
          blk: 0,
          tov: 0,
          fgPct: 0,
          threePtPct: 0,
          ftPct: 0,
          fg: "0-0",
          threePt: "0-0",
          ft: "0-0",
          oReb: 0,
          dReb: 0,
          pf: 0,
        }
      );
    }
    return p.seasons?.["2025-26"] || p.stats;
  };

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
        const sA = getPlayerSeasonStat(a);
        const sB = getPlayerSeasonStat(b);

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
  }, [players, filterPos, searchQuery, sortField, sortAsc, seasonView]);

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return <span className="text-slate-400 dark:text-zinc-600 ml-0.5 text-[10px]">↕</span>;
    return <span className="text-[#CE1141] font-bold ml-0.5 text-[10px]">{sortAsc ? "▲" : "▼"}</span>;
  };

  return (
    <section>
      {/* 头部控制栏：标题、赛季切换、位置筛选、搜索 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 px-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-1.5 h-4 bg-[#CE1141] rounded-full inline-block"></span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {seasonView} 赛季火箭官方球员名单与技术统计
          </h2>
          {seasonView === "2026-27" ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[10.5px] border border-emerald-500/20">
              新赛季揭幕战已完赛 · 场均表现实时同步
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-400 font-medium text-[10.5px]">
              上赛季完整战绩对照
            </span>
          )}
        </div>

        {/* 筛选与搜索控件 */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          {/* 赛季快速切换 */}
          <div className="flex items-center bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSeasonView("2026-27")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                seasonView === "2026-27"
                  ? "bg-[#CE1141] text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              2026-27 (新赛季)
            </button>
            <button
              type="button"
              onClick={() => setSeasonView("2025-26")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                seasonView === "2025-26"
                  ? "bg-[#CE1141] text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              2025-26 (上赛季)
            </button>
          </div>

          {/* 位置筛选 */}
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
                    ? "bg-slate-800 dark:bg-white/20 text-white font-bold"
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
                const s = getPlayerSeasonStat(p);
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
                        {s.gp > 0 && s.pts ? s.pts.toFixed(1) : "--"}
                      </span>
                    </td>

                    {/* 篮板 */}
                    <td className="py-2 px-1.5 text-center text-slate-800 dark:text-zinc-200">
                      {s.gp > 0 && s.reb !== undefined ? s.reb.toFixed(1) : "--"}
                    </td>

                    {/* 助攻 */}
                    <td className="py-2 px-1.5 text-center text-slate-800 dark:text-zinc-200">
                      {s.gp > 0 && s.ast !== undefined ? s.ast.toFixed(1) : "--"}
                    </td>

                    {/* 抢断 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.stl !== undefined ? s.stl.toFixed(1) : "--"}
                    </td>

                    {/* 盖帽 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.blk !== undefined ? s.blk.toFixed(1) : "--"}
                    </td>

                    {/* 失误 */}
                    <td className="py-2 px-1.5 text-center text-slate-500 dark:text-zinc-400">
                      {s.gp > 0 && s.tov !== undefined ? s.tov.toFixed(1) : "--"}
                    </td>

                    {/* 投篮命中率 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.fgPct ? `${s.fgPct.toFixed(1)}%` : "--"}
                    </td>

                    {/* 三分命中率 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.threePtPct ? `${s.threePtPct.toFixed(1)}%` : "--"}
                    </td>

                    {/* 罚球命中率 */}
                    <td className="py-2 px-1.5 text-center text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.ftPct ? `${s.ftPct.toFixed(1)}%` : "--"}
                    </td>

                    {/* 出场时间 */}
                    <td className="py-2 px-1.5 text-center text-slate-600 dark:text-zinc-400 text-[11px]">
                      {s.gp > 0 && s.mpg ? `${s.mpg.toFixed(1)}'` : "--"}
                    </td>

                    {/* 出场场次 */}
                    <td className="py-2 px-1.5 text-center text-slate-600 dark:text-zinc-400 text-xs font-bold">
                      {s.gp > 0 ? s.gp : "0"}
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
            const s = getPlayerSeasonStat(p);
            const isHighScorer = s.pts >= 18;

            return (
              <div
                key={p.id}
                onClick={() => onSelectPlayer(p)}
                className="bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs shadow-xs active:scale-[0.99] transition-transform"
              >
                {/* 顶行：头像 + 姓名 + 位置 + 年龄 + 场次 + 箭头 */}
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
                          {p.age}岁 · {s.gp > 0 ? `${s.gp}场` : "未出战"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-slate-400 dark:text-zinc-500 text-sm">›</span>
                </div>

                {/* 核心数据流线长条：网格化均分，严密适配各种手机屏幕宽度，三分命中率及全部数值永不溢出 */}
                <div className="grid grid-cols-6 gap-0.5 rounded-lg bg-slate-50 dark:bg-white/[0.04] p-1.5 border border-slate-200/60 dark:border-white/5 text-center font-mono">
                  <div className="flex flex-col items-center justify-center min-w-0">
                    <span className="text-[10px] font-sans text-slate-400 dark:text-zinc-500">得分</span>
                    <span className={`text-xs font-bold leading-tight ${isHighScorer ? "text-[#CE1141]" : "text-slate-900 dark:text-white"}`}>
                      {s.gp > 0 && s.pts ? s.pts.toFixed(1) : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 border-l border-slate-200/50 dark:border-white/5">
                    <span className="text-[10px] font-sans text-slate-400 dark:text-zinc-500">篮板</span>
                    <span className="text-xs font-semibold leading-tight text-slate-800 dark:text-zinc-200">
                      {s.gp > 0 && s.reb !== undefined ? s.reb.toFixed(1) : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 border-l border-slate-200/50 dark:border-white/5">
                    <span className="text-[10px] font-sans text-slate-400 dark:text-zinc-500">助攻</span>
                    <span className="text-xs font-semibold leading-tight text-slate-800 dark:text-zinc-200">
                      {s.gp > 0 && s.ast !== undefined ? s.ast.toFixed(1) : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 border-l border-slate-200/50 dark:border-white/5">
                    <span className="text-[10px] font-sans text-slate-400 dark:text-zinc-500">抢断</span>
                    <span className="text-xs font-medium leading-tight text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.stl !== undefined ? s.stl.toFixed(1) : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 border-l border-slate-200/50 dark:border-white/5">
                    <span className="text-[10px] font-sans text-slate-400 dark:text-zinc-500">投篮</span>
                    <span className="text-xs font-medium leading-tight text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.fgPct ? `${s.fgPct.toFixed(0)}%` : "--"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 border-l border-slate-200/50 dark:border-white/5">
                    <span className="text-[10px] font-sans text-slate-400 dark:text-zinc-500">三分</span>
                    <span className="text-xs font-medium leading-tight text-slate-700 dark:text-zinc-300">
                      {s.gp > 0 && s.threePtPct ? `${s.threePtPct.toFixed(0)}%` : "--"}
                    </span>
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
