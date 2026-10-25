import { useEffect, useRef, useState } from "react";
import { Link, type LinkProps } from "react-router";

/** Desktop hover prefetch (after 180ms); mobile touch events do not prefetch to avoid request flooding during scrolling. */
export function IntentLink({ onFocus, onBlur, onMouseEnter, onMouseLeave, ...props }: Omit<LinkProps, "prefetch">) {
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const start = () => {
    clear();
    timer.current = setTimeout(() => { timer.current = null; setReady(true); }, 180);
  };
  const cancel = () => { clear(); setReady(false); };
  useEffect(() => { cancel(); return clear; }, [props.to]);
  return <Link {...props} prefetch={ready ? "intent" : "none"}
    onFocus={(e) => { onFocus?.(e); if (!e.defaultPrevented) start(); }}
    onBlur={(e) => { onBlur?.(e); cancel(); }}
    onMouseEnter={(e) => { onMouseEnter?.(e); if (!e.defaultPrevented) start(); }}
    onMouseLeave={(e) => { onMouseLeave?.(e); cancel(); }}
  />;
}
