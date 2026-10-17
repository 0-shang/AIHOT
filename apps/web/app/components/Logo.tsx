// The site's wordmark and basketball sports brand logo.
import { SITE } from "@aihot/industry/site";

export function Wordmark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex flex-col text-left select-none ${className}`} aria-label={SITE.name} role="img">
      <div className="flex items-baseline tracking-tight">
        <span className="font-black text-ink font-sans tracking-tight text-[22px] lg:text-[24px]">
          CLUTCH
        </span>
        <span className="font-black text-[#CE1141] font-sans tracking-tight text-[22px] lg:text-[24px] ml-1">
          WIRE
        </span>
      </div>
      <div className="flex items-center gap-1.5 -mt-0.5">
        <span className="text-[10px] font-bold tracking-[0.22em] text-ink-4 uppercase">
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
