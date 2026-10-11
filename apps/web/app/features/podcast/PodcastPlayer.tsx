// Podcast Card and Detail Player components.
import { useState, useRef, useEffect, useMemo, memo } from "react";
import { Link } from "react-router";
import type { FeedItemSummary, SiteItemDetail } from "@aihot/contracts/site";

// Helper to format seconds to mm:ss or hh:mm:ss
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function extractEpisodeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/episodes\/(\d+)/i);
  return m ? m[1] : null;
}

// Global active audio manager to ensure only one audio plays at a time
let currentActiveAudio: HTMLAudioElement | null = null;
let currentStopCallback: (() => void) | null = null;

export function registerPlayingAudio(audio: HTMLAudioElement, stop: () => void) {
  if (currentActiveAudio && currentActiveAudio !== audio) {
    currentActiveAudio.pause();
    currentStopCallback?.();
  }
  currentActiveAudio = audio;
  currentStopCallback = stop;
}

/**
 * Inline Card Player for the feed stream (List View - Image 1 style).
 */
export const PodcastCardPlayer = memo(function PodcastCardPlayer({
  item,
  onOpen,
}: {
  item: FeedItemSummary;
  onOpen?: () => void;
}) {
  const p = item.podcast;
  const epId = useMemo(() => extractEpisodeId(item.url || item.links?.original), [item.url, item.links?.original]);
  const [audioUrl, setAudioUrl] = useState<string | null>(p?.audioUrl ?? null);
  const [durationLabel, setDurationLabel] = useState<string | null>(p?.durationLabel ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(typeof p?.duration === "number" ? p.duration : 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const podcastTitle = p?.podcastTitle || "休斯敦火箭播客";
  const author = p?.author || item.source?.name || "";
  const imageUrl = p?.imageUrl || (item.x?.media?.[0]?.url) || "https://d1ng7msft0qysq.cloudfront.net/2403235_podcast.webp";

  const handlePlayToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let targetAudioUrl = audioUrl;
    if (!targetAudioUrl && epId) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/site/podcasts/episodes/${epId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.audioUrl) {
            targetAudioUrl = data.audioUrl;
            setAudioUrl(data.audioUrl);
            if (data.durationLabel) setDurationLabel(data.durationLabel);
            if (data.duration) setDuration(data.duration);
          }
        }
      } catch (err) {
        console.error("Failed to load episode stream:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!targetAudioUrl) {
      // Fallback: open original url in new tab
      window.open(item.links?.original || item.url, "_blank");
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(targetAudioUrl);
      audioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      audio.addEventListener("pause", () => {
        setIsPlaying(false);
      });
      audio.addEventListener("play", () => {
        setIsPlaying(true);
      });
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      registerPlayingAudio(audio, () => setIsPlaying(false));
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex gap-3.5 sm:gap-4 items-start">
      {/* Left: Square Podcast Cover */}
      <Link
        to={`/items/${item.id}`}
        onClick={onOpen}
        className="relative shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-line-soft shadow-sm group/thumb size-[78px] sm:size-[88px]"
      >
        <img
          src={imageUrl}
          alt={item.title}
          className="size-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://d1ng7msft0qysq.cloudfront.net/2403235_podcast.webp";
          }}
        />
        {/* Subtle hover play overlay on thumbnail */}
        <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
          <span className="grid size-8 place-items-center rounded-full bg-white/90 text-black shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Right: Content & Audio Controls */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Metadata */}
          <div className="flex items-center gap-1.5 text-[12px] text-ink-4">
            <span className="font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[160px] sm:max-w-[220px]">
              {podcastTitle}
            </span>
            {author && author !== podcastTitle && (
              <>
                <span>·</span>
                <span className="truncate max-w-[100px]">{author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-1 text-[15.5px] sm:text-[16.5px] font-bold leading-[1.38] text-ink tracking-tight hover:text-accent transition-colors line-clamp-2">
            <Link to={`/items/${item.id}`} onClick={onOpen}>
              {item.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {item.summary && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-3">
              {item.summary}
            </p>
          )}
        </div>

        {/* Bottom Play Action Bar (Image 1 Style) */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePlayToggle}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12.5px] font-semibold transition-all shadow-xs ${
              isPlaying
                ? "bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-500/30"
                : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60"
            }`}
          >
            {isLoading ? (
              <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>{isPlaying ? "暂停" : "PLAY 播放"}</span>
          </button>

          {/* Duration */}
          {(durationLabel || duration > 0) && (
            <span className="text-[12px] font-mono text-ink-4">
              {durationLabel || (duration > 0 ? `${Math.round(duration / 60)} min` : "")}
            </span>
          )}

          {/* Quick Progress Bar when playing */}
          {isPlaying && duration > 0 && (
            <div className="flex-1 min-w-[120px] max-w-[200px] flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration}
                step="1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[11px] font-mono text-ink-4 whitespace-nowrap">
                {formatTime(currentTime)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Full Detail Page Player (Detail View - Image 2 style).
 */
export const PodcastDetailPlayer = memo(function PodcastDetailPlayer({
  item,
}: {
  item: SiteItemDetail;
}) {
  const p = item.podcast;
  const epId = useMemo(() => extractEpisodeId(item.links?.original), [item.links?.original]);
  const [audioUrl, setAudioUrl] = useState<string | null>(p?.audioUrl ?? null);
  const [durationLabel, setDurationLabel] = useState<string | null>(p?.durationLabel ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(typeof p?.duration === "number" ? p.duration : 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const podcastTitle = p?.podcastTitle || "休斯敦火箭播客";
  const author = p?.author || item.author || item.source?.name || "";
  const imageUrl = p?.imageUrl || (item.x?.media?.[0]?.url) || "https://d1ng7msft0qysq.cloudfront.net/2403235_podcast.webp";

  // Auto resolve stream if not present
  useEffect(() => {
    if (!audioUrl && epId) {
      fetch(`/api/site/podcasts/episodes/${epId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.audioUrl) {
            setAudioUrl(data.audioUrl);
            if (data.durationLabel) setDurationLabel(data.durationLabel);
            if (data.duration) setDuration(data.duration);
          }
        })
        .catch(() => {});
    }
  }, [audioUrl, epId]);

  const togglePlay = async () => {
    let targetAudioUrl = audioUrl;
    if (!targetAudioUrl && epId) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/site/podcasts/episodes/${epId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.audioUrl) {
            targetAudioUrl = data.audioUrl;
            setAudioUrl(data.audioUrl);
            if (data.durationLabel) setDurationLabel(data.durationLabel);
            if (data.duration) setDuration(data.duration);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!targetAudioUrl) {
      window.open(item.links?.original, "_blank");
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(targetAudioUrl);
      audioRef.current = audio;
      audio.playbackRate = playbackRate;

      audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
      audio.addEventListener("loadedmetadata", () => {
        if (audio.duration && !isNaN(audio.duration)) setDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("play", () => setIsPlaying(true));
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      registerPlayingAudio(audio, () => setIsPlaying(false));
      await audio.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx] ?? 1;
    setPlaybackRate(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
      {/* Top Header: Cover + Title + Podcast Show Info (Matching Image 2) */}
      <div className="flex gap-4 sm:gap-5 items-start">
        <div className="shrink-0 overflow-hidden rounded-xl border border-line-soft bg-slate-900 shadow-md size-[96px] sm:size-[112px]">
          <img
            src={imageUrl}
            alt={item.title}
            className="size-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://d1ng7msft0qysq.cloudfront.net/2403235_podcast.webp";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-[20px] sm:text-[24px] font-extrabold leading-[1.3] text-ink tracking-tight">
            {item.title}
          </h2>
          <div className="mt-2 text-[14px] font-semibold text-blue-600 dark:text-blue-400">
            {podcastTitle}
          </div>
          <div className="mt-1 text-[12.5px] text-ink-4">
            {author && <span>{author}</span>}
            {durationLabel && <span className="ml-2 font-mono">· {durationLabel}</span>}
          </div>
        </div>
      </div>

      {/* Main Play Action Bar (Matching Image 2 Style) */}
      <div className="mt-6 pt-5 border-t border-line-soft flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {/* Big Circular Blue Play Button */}
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading}
            className="grid size-14 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label={isPlaying ? "暂停播放" : "开始播放"}
          >
            {isLoading ? (
              <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center text-[12.5px] font-mono text-ink-3 mb-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            {/* Scrubber Progress Slider */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="rounded-lg border border-line-strong px-2.5 py-1 text-[12px] font-mono font-medium text-ink-3 hover:text-ink hover:border-ink-4 transition-colors"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
});
