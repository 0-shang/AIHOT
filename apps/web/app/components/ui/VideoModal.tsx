import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!open) return;
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
        className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-3 sm:p-8"
      >
        <div
          className="relative max-h-[calc(100dvh-4rem)] max-w-full overflow-hidden rounded-tile bg-black shadow-2xl flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {videoUrl && (
            <video
              ref={videoRef}
              key={videoUrl}
              src={videoUrl}
              poster={poster ?? undefined}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[calc(100dvh-5rem)] max-w-[calc(100vw-2rem)] md:max-w-4xl rounded-control object-contain"
            />
          )}
        </div>
        <button
          ref={closeButton}
          type="button"
          aria-label="关闭视频"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <IconClose size={18} />
        </button>
      </div>
    </Presence>,
    document.body
  );
}
