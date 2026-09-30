import { useState } from "react";
import type { YouTubeInfo } from "../../lib/youtube";
import { IconExternal } from "../icons";

export interface YouTubeEmbedProps {
  info: YouTubeInfo;
  poster?: string | null;
  className?: string;
  autoPlay?: boolean;
}

export function YouTubeEmbed({ info, poster, className = "", autoPlay = false }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [mode, setMode] = useState<"video" | "playlist">(info.videoId ? "video" : "playlist");

  // Determine current active embed URL
  let currentEmbedUrl = info.embedUrl;
  if (mode === "video" && info.videoId) {
    currentEmbedUrl = `https://www.youtube-nocookie.com/embed/${info.videoId}?autoplay=1&rel=0&modestbranding=1`;
  } else if (mode === "playlist" && info.playlistId) {
    currentEmbedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${info.playlistId}&autoplay=1&rel=0`;
  } else {
    currentEmbedUrl += "?autoplay=1&rel=0";
  }

  // Cover image preference: passed poster -> YouTube hqdefault
  const coverImage =
    poster ?? (info.videoId ? `https://i.ytimg.com/vi/${info.videoId}/hqdefault.jpg` : null);

  return (
    <div
      className={`my-5 overflow-hidden rounded-2xl border border-line-soft bg-black/95 text-white shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px]">
        <div className="flex items-center gap-2 font-medium">
          {/* YouTube Red Icon */}
          <span className="grid size-6 place-items-center rounded bg-[#FF0000] text-white shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </span>
          <span className="text-white/95">
            {info.channelName ? `${info.channelName} · 在线播放` : "YouTube 视频在线播放"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Optional toggle between interview video & channel uploads */}
          {info.videoId && info.playlistId && (
            <div className="hidden sm:flex items-center rounded-lg bg-white/10 p-0.5 text-[11.5px]">
              <button
                type="button"
                onClick={() => {
                  setMode("video");
                  setPlaying(true);
                }}
                className={`rounded px-2 py-0.5 transition-colors ${
                  mode === "video" ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white"
                }`}
              >
                采访原片
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("playlist");
                  setPlaying(true);
                }}
                className={`rounded px-2 py-0.5 transition-colors ${
                  mode === "playlist" ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white"
                }`}
              >
                频道列表
              </button>
            </div>
          )}

          <a
            href={info.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] text-white/60 transition-colors hover:text-white"
          >
            在 YouTube 打开 <IconExternal size={12} />
          </a>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative aspect-video w-full bg-black">
        {playing ? (
          <iframe
            key={currentEmbedUrl}
            src={currentEmbedUrl}
            title="YouTube video player"
            className="size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div
            onClick={() => setPlaying(true)}
            className="group relative size-full cursor-pointer overflow-hidden bg-black select-none"
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="视频预览"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
              />
            ) : (
              <div className="size-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Center Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="grid size-16 sm:size-20 place-items-center rounded-2xl bg-[#FF0000] text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E60000] group-active:scale-95 ring-4 ring-white/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="rounded-full bg-black/60 px-4 py-1.5 text-[13px] font-medium tracking-wide text-white/95 backdrop-blur-md transition-colors group-hover:bg-black/80">
                点击直接播放视频
              </span>
            </div>

            {/* Bottom info */}
            {info.channelName && (
              <div className="absolute bottom-3 left-4 text-[12px] text-white/70">
                来源频道：<span className="font-semibold text-white">{info.channelName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
