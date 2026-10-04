// The site's wordmark and basketball sports brand logo.
import { SITE } from "@aihot/industry/site";

export function Wordmark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} aria-label={SITE.name} role="img">
      {/* 极简现代运动徽标 */}
      <div className="relative flex size-[32px] shrink-0 items-center justify-center rounded-xl bg-[#CE1141] text-white shadow-xs">
        <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="M5.5 5.5c3.8 3.5 3.8 9.5 0 13" />
          <path d="M18.5 5.5c-3.8 3.5-3.8 9.5 0 13" />
        </svg>
      </div>

      {/* 品牌名称排版 */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-baseline gap-0.5">
          <span className="font-black tracking-tight text-ink" style={{ fontSize: size * 0.95 }}>
            Clutch
          </span>
          <span className="font-black italic text-[#CE1141] tracking-tight" style={{ fontSize: size * 0.95 }}>
            Wire
          </span>
        </div>
        <span className="mt-0.5 text-[9.5px] font-bold tracking-[0.18em] text-ink-3">
          火箭队资讯
        </span>
      </div>
    </div>
  );
}

/** A ring with a dot; spinning, it is the loader. */
export function RingMark({ className = "", spinning = false }: { className?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g style={spinning ? { transformOrigin: "12px 12px", animation: "spin-slow 1.1s linear infinite" } : undefined}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="42 15" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="#CE1141" />
    </svg>
  );
}
