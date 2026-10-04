// The site's wordmark and basketball sports brand logo.
import { SITE } from "@aihot/industry/site";

export function Wordmark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} aria-label={SITE.name} role="img">
      {/* 极简火箭先锋徽标：C字防御弧圈 + 金色电报光速飞箭 */}
      <div className="relative flex size-[34px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#CE1141] to-[#A60D34] text-white shadow-xs">
        <svg viewBox="0 0 32 32" className="size-[22px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* C - Clutch 专属弧线 */}
          <path d="M22 8.5C20.2 7 17.5 6 14.5 6C9.25 6 5 10.48 5 16C5 21.52 9.25 26 14.5 26C17.8 26 20.6 24.8 22.5 23" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
          {/* Wire - 金色前沿电报/火箭喷射箭头 */}
          <path d="M12 16H26.5M26.5 16L21 11.5M26.5 16L21 20.5" stroke="#FDB927" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 品牌名称排版 */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center tracking-tight">
          <span className="font-black text-ink font-sans tracking-tight" style={{ fontSize: size * 0.96 }}>
            CLUTCH
          </span>
          <span className="font-black text-[#CE1141] font-sans tracking-tight ml-0.5" style={{ fontSize: size * 0.96 }}>
            WIRE
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            火箭队资讯
          </span>
          <span className="size-1 rounded-full bg-[#CE1141]" />
          <span className="text-[9px] font-bold text-ink-4 tracking-wider">
            INSIDER
          </span>
        </div>
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
