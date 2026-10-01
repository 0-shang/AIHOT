// The report nameplates for Houston Rockets media publications.
// Renders dynamic, vector-crisp sports newspaper logotypes.

const NAMEPLATE_CONFIG = {
  daily: { prefix: "火箭", suffix: "早报", offset: 200, width: 420 },
  weekly: { prefix: "火箭", suffix: "周报", offset: 200, width: 420 },
  monthly: { prefix: "火箭", suffix: "月报", offset: 200, width: 420 },
  archive: { prefix: "火箭", suffix: "专刊合订", offset: 200, width: 620 },
} as const;

export function Nameplate({ which, className = "" }: { which: keyof typeof NAMEPLATE_CONFIG; className?: string }) {
  const item = NAMEPLATE_CONFIG[which] || NAMEPLATE_CONFIG.daily;
  const viewBox = `0 0 ${item.width} 110`;

  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false">
      <text
        x="0"
        y="90"
        className="fill-accent select-none font-black italic tracking-tighter"
        style={{
          fontSize: "94px",
          fontWeight: 900,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif",
        }}
      >
        {item.prefix}
      </text>
      <text
        x={item.offset}
        y="90"
        className="fill-ink select-none font-black tracking-tight"
        style={{
          fontSize: "94px",
          fontWeight: 900,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif",
        }}
      >
        {item.suffix}
      </text>
    </svg>
  );
}
