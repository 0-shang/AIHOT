import { useState } from "react";
import type { MediaView } from "@aihot/contracts/site";
import { Lightbox } from "../../components/ui/Lightbox";
import { VideoModal } from "../../components/ui/VideoModal";

/** A round play mark over a video's still. */
function PlayMark() {
  return (
    <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <span className="grid size-11 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
          <path d="M7 4.5v15a1 1 0 001.5.87l13-7.5a1 1 0 000-1.74l-13-7.5A1 1 0 007 4.5z" />
        </svg>
      </span>
    </span>
  );
}

/** An expand icon indicating fullscreen / lightbox video modal */
function ExpandMark() {
  return (
    <span className="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur-xs ring-1 ring-white/20 transition-transform group-hover:scale-110" title="全屏大屏播放">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    </span>
  );
}

/**
 * The post's pictures as tiles, all of them (X allows up to nine; list cards show four). Images open in
 * a viewer that steps through them; videos play inline or in a modal.
 */
export function MediaGallery({ media, postUrl }: { media: MediaView[]; postUrl: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [modalVideo, setModalVideo] = useState<{ url: string; poster?: string | null } | null>(null);

  const shown = media.slice(0, 9);
  const images = shown.filter((m) => m.kind !== "video");
  const single = shown.length === 1;

  return (
    <>
      <div className={`mt-5 grid gap-2.5 ${single ? "grid-cols-1" : shown.length === 2 || shown.length === 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {shown.map((m) => {
          const isPortrait = !!(m.width && m.height && m.height > m.width);
          const currentTile = single
            ? `group relative overflow-hidden rounded-tile border border-line-soft bg-bg-sunk ${isPortrait ? "max-w-[320px]" : "max-w-[540px]"} w-fit`
            : "group relative overflow-hidden rounded-tile border border-line-soft bg-bg-sunk aspect-[16/10]";

          const img = (
            <img
              src={m.poster ?? m.url}
              srcSet={m.srcSet}
              sizes={single ? (isPortrait ? "auto, 320px" : "auto, 540px") : "auto, (min-width: 800px) 248px, (min-width: 640px) calc(33.333vw - 19px), calc(50vw - 24px)"}
              width={m.width ?? undefined}
              height={m.height ?? undefined}
              decoding="async"
              alt={m.alt ?? ""}
              loading="lazy"
              className={`block transition-transform duration-300 group-hover:scale-[1.015] ${single ? "w-auto h-auto max-h-[500px] max-w-full object-contain" : "w-full h-full object-cover"}`}
              style={single && m.width && m.height ? { aspectRatio: `${m.width} / ${m.height}` } : undefined}
            />
          );

          if (m.kind === "video") {
            if (m.videoUrl) {
              // 多个视频时：直接唤起大屏视频播放弹层，保证手机端拥有完整的全屏、放大按钮和舒适观看体验
              if (!single) {
                return (
                  <button
                    key={m.url}
                    type="button"
                    onClick={() => setModalVideo({ url: m.videoUrl!, poster: m.poster ?? m.url })}
                    aria-label="大屏全屏播放视频"
                    className={`${currentTile} cursor-pointer text-left focus:outline-none`}
                  >
                    {img}
                    <PlayMark />
                    <ExpandMark />
                  </button>
                );
              }

              // 单个视频时：支持原地自适应播放，右上角提供一键放大弹层
              const isPlaying = playingVideoUrl === m.videoUrl;
              if (isPlaying) {
                return (
                  <div
                    key={m.url}
                    className={`relative overflow-hidden rounded-tile border border-line-soft bg-black w-fit max-w-full ${single ? "" : "aspect-[16/10]"}`}
                    style={single && m.width && m.height ? { aspectRatio: `${m.width} / ${m.height}` } : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => setModalVideo({ url: m.videoUrl!, poster: m.poster ?? m.url })}
                      className="absolute top-2.5 right-2.5 z-20 grid size-8 place-items-center rounded-full bg-black/70 text-white hover:bg-black/90 ring-1 ring-white/30 backdrop-blur-sm"
                      title="大屏全屏播放"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </button>
                    <video
                      src={m.videoUrl}
                      poster={m.poster ?? m.url}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      className="block max-h-[520px] max-w-full w-auto h-auto object-contain rounded-tile"
                    />
                  </div>
                );
              }

              return (
                <button
                  key={m.url}
                  type="button"
                  onClick={() => setPlayingVideoUrl(m.videoUrl!)}
                  aria-label="在当前页面播放视频"
                  className={`${currentTile} cursor-pointer text-left focus:outline-none`}
                >
                  {img}
                  <PlayMark />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalVideo({ url: m.videoUrl!, poster: m.poster ?? m.url });
                    }}
                  >
                    <ExpandMark />
                  </span>
                </button>
              );
            }

            return (
              <a key={m.url} href={postUrl} target="_blank" rel="noopener noreferrer" aria-label="打开原推播放视频" className={currentTile}>
                {img}
                <PlayMark />
              </a>
            );
          }

          return (
            <button key={m.url} type="button" onClick={() => setOpen(images.indexOf(m))} aria-label={m.alt ? `查看大图：${m.alt}` : "查看大图"} className={`${currentTile} cursor-zoom-in`}>
              {img}
            </button>
          );
        })}
      </div>

      <Lightbox images={images.map((m) => ({ src: m.url, alt: m.alt }))} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />

      <VideoModal
        open={!!modalVideo}
        videoUrl={modalVideo?.url ?? null}
        poster={modalVideo?.poster ?? null}
        onClose={() => setModalVideo(null)}
      />
    </>
  );
}
