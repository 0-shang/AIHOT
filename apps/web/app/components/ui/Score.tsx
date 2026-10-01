/**
 * 篮球资讯前线热度评级标签 (纯净、专业体育媒体风格)
 */
export function ScoreLabel({ score, compact = false }: { score: number | null; compact?: boolean }) {
  if (score === null || score === undefined) return null;

  // 兼容 10 分制 (如 9.4) 与 100 分制 (如 88)
  const isTenScale = score <= 10;
  const numDisplay = isTenScale ? (Number.isInteger(score) ? score.toFixed(1) : String(score)) : String(Math.round(score));
  const normalizedValue = isTenScale ? score * 10 : score;

  const isHot = normalizedValue >= 85;

  const colorCls = isHot
    ? "bg-red-50 text-[#CE1141] ring-[#CE1141]/25 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900"
    : "bg-neutral-100 text-ink-3 ring-line dark:bg-neutral-800/60 dark:text-ink-3";

  return (
    <span
      title={`前线热度评级：${numDisplay}`}
      aria-label={`热度评级 ${numDisplay}`}
      className={`inline-flex h-[20px] shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 text-[10.5px] font-medium ring-1 ring-inset ${colorCls}`}
    >
      <span className="font-mono text-[11px] font-black tabular-nums tracking-tight">
        {numDisplay}
      </span>
      {!compact && (
        <span className="text-[10px] font-semibold opacity-80">
          热度
        </span>
      )}
    </span>
  );
}
