import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Presence } from "./Presence";
import { IconClose } from "../icons";

export interface VideoModalProps {
  open: boolean;
  videoUrl: string | null;
  poster?: string | null;
  onClose: () => void;
}

export function VideoModal({ open, videoUrl, poster, onClose }: VideoModalProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) {
      setLoading(true);
      setError(false);
      return;
    }
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <Presence show={open && !!videoUrl} enter="anim-fade-in" exit="anim-fade-out" duration={160}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="视频播放器"
        onClick={onClose}
        className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-3 sm:p-8 backdrop-blur-sm"
      >
        <div
          className="relative max-h-[calc(100dvh-4rem)] max-w-full overflow-hidden rounded-2xl bg-black/95 shadow-2xl flex flex-col items-center justify-center border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Indicator */}
          {loading && !error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
              <div className="size-10 rounded-full border-3 border-white/20 border-t-[#CE1141] animate-spin" />
              <span className="mt-3 text-[13px] font-medium text-white/80 tracking-wide">
                视频极速缓冲中…
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 p-6 text-center text-white">
              <span className="text-2xl mb-2">⚠️</span>
              <p className="text-[14px] font-bold text-white/90">视频源加载遇到波动</p>
              <p className="mt-1 text-[12.5px] text-white/60 max-w-xs">
                因原平台跨国节点延迟，可尝试重新缓冲或直接打开原视频链接。
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="rounded-full bg-[#CE1141] px-4 py-1.5 text-[12.5px] font-bold text-white shadow-sm hover:bg-[#b00e36]"
                >
                  重新加载
                </button>
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-white/20"
                  >
                    新窗口播放
                  </a>
                )}
              </div>
            </div>
          )}

          {videoUrl && (
            <video
              ref={videoRef}
              key={videoUrl}
              src={videoUrl}
              poster={poster ?? undefined}
              controls
              autoPlay
              playsInline
              preload="auto"
              onLoadStart={() => { setLoading(true); setError(false); }}
              onWaiting={() => setLoading(true)}
              onCanPlay={() => setLoading(false)}
              onPlaying={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
              className="max-h-[calc(100dvh-5rem)] max-w-[calc(100vw-2rem)] md:max-w-4xl rounded-2xl object-contain shadow-inner"
            />
          )}
        </div>

        {/* Close Button */}
        <button
          ref={closeButton}
          type="button"
          aria-label="关闭视频"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white shadow-lg transition-all hover:bg-white/25 active:scale-95"
        >
          <IconClose size={20} />
        </button>
      </div>
    </Presence>,
    document.body
  );
}
