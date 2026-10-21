import { useEffect, useRef, useState } from "react";
import { IconArrowUp } from "../icons";

function BasketballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bball-glow" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FA7942" />
          <stop offset="100%" stopColor="#C93F12" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#bball-glow)" stroke="#1A1A1A" strokeWidth="1.5" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="30" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 6.1 6.1 C 12 11 12 21 6.1 25.9" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 25.9 6.1 C 20 11 20 21 25.9 25.9" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Basketball rolling loading indicator when switching tabs/routes */
export function NavigationProgress({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden={!active}
      className={`pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 rounded-full border border-line bg-surface/95 px-3.5 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-md transition-all duration-200 ${
        active ? "translate-y-0 opacity-100 scale-100" : "-translate-y-2 opacity-0 scale-95"
      }`}
    >
      <div className="size-5 shrink-0 animate-spin" style={{ animationDuration: "0.75s" }}>
        <BasketballIcon className="size-full" />
      </div>
      <span className="text-[12px] font-medium text-ink-2 select-none tracking-wide">加载中...</span>
    </div>
  );
}

/** Round "back to top" button once the reader has scrolled a screen or so. */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`fixed bottom-[calc(70px+env(safe-area-inset-bottom))] right-4 z-30 flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-[var(--shadow-soft)] transition-all duration-200 hover:text-ink lg:bottom-6 lg:right-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <IconArrowUp size={18} />
    </button>
  );
}
