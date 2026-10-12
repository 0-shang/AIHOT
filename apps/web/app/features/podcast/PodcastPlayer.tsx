// High-fidelity Podcast Player & Card Component
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
 * Modern Animated Equalizer Bars when playing
 */
function EqualizerWave() {
  return (
    <span className="flex items-end gap-[2px] h-3.5 px-0.5" aria-hidden="true">
      <span className="w-[2.5px] bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
      <span className="w-[2.5px] bg-white rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.2s] h-3.5" />
      <span className="w-[2.5px] bg-white rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-2.5" />
      <span className="w-[2.5px] bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.1s] h-3" />
    </span>
  );
}

/**
 * Upgraded, Premium Inline Podcast Card Player for the feed stream
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

  // Normalize podcast show name
  const rawTitle = p?.podcastTitle || item.source?.name || "休斯敦火箭播客";
  const podcastTitle = rawTitle.replace(/\(.*\)/, "").trim();
  const author = p?.author || "";
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

  const skipTime = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (audioRef.current) {
      const next = Math.max(0, Math.min(duration || Infinity, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = next;
      setCurrentTime(next);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  return (
    <div className="group/podcast relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-surface border border-line-soft hover:border-[#CE1141]/35 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Left: Enhanced Vinyl / Album Artwork with Hover Action */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Link
          to={`/items/${item.id}`}
          onClick={onOpen}
          className="relative block size-[92px] sm:size-[104px] rounded-xl overflow-hidden shadow-md ring-1 ring-black/10 dark:ring-white/10 group/thumb"
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
          {/* Subtle Vinyl Record Groove Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* Duration tag at bottom-right of artwork */}
          {(durationLabel || duration > 0) && (
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-white/90 backdrop-blur-xs">
              {durationLabel || `${Math.round(duration / 60)}m`}
            </span>
          )}

          {/* Overlay Play Icon */}
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40">
            <span className="grid size-9 place-items-center rounded-full bg-[#CE1141] text-white shadow-lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Content details, player controls */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div>
          {/* Channel / Podcast Badge */}
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1 font-bold text-[#CE1141] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full ring-1 ring-[#CE1141]/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              {podcastTitle}
            </span>
            {author && author !== podcastTitle && (
              <span className="text-ink-4 truncate max-w-[140px]">主播: {author}</span>
            )}
          </div>

          {/* Episode Title */}
          <h3 className="mt-1.5 text-[16px] sm:text-[17px] font-extrabold leading-[1.4] text-ink tracking-tight transition-colors hover:text-[#CE1141] line-clamp-2">
            <Link to={`/items/${item.id}`} onClick={onOpen}>
              {item.title}
            </Link>
          </h3>

          {/* Summary / Notes */}
          {item.summary && (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-3">
              {item.summary}
            </p>
          )}
        </div>

        {/* Player Controls Strip */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
          {/* Main Play / Pause Capsule */}
          <button
            type="button"
            onClick={handlePlayToggle}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold transition-all shadow-sm active:scale-95 ${
              isPlaying
                ? "bg-[#CE1141] text-white shadow-[#CE1141]/30 ring-2 ring-[#CE1141]/20"
                : "bg-surface border border-[#CE1141]/40 text-[#CE1141] hover:bg-red-50 dark:hover:bg-red-950/40"
            }`}
          >
            {isLoading ? (
              <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isPlaying ? (
              <>
                <EqualizerWave />
                <span>暂停收听</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>收听单集</span>
              </>
            )}
          </button>

          {/* Skip buttons when playing */}
          {isPlaying && (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => skipTime(-15, e)}
                title="后退 15 秒"
                className="grid size-7 place-items-center rounded-full bg-bg-sunk hover:bg-line text-ink-3 text-[11px] font-mono transition-colors"
              >
                -15s
              </button>
              <button
                type="button"
                onClick={(e) => skipTime(15, e)}
                title="快进 15 秒"
                className="grid size-7 place-items-center rounded-full bg-bg-sunk hover:bg-line text-ink-3 text-[11px] font-mono transition-colors"
              >
                +15s
              </button>
            </div>
          )}

          {/* Interactive Progress Scrubbing */}
          {isPlaying && duration > 0 ? (
            <div className="flex-1 min-w-[140px] max-w-xs flex items-center gap-2 px-1">
              <input
                type="range"
                min="0"
                max={duration}
                step="1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-line-strong rounded-lg appearance-none cursor-pointer accent-[#CE1141]"
              />
              <span className="text-[11.5px] font-mono font-medium text-ink-3 whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          ) : (
            <span className="text-[12px] font-mono text-ink-4">
              {durationLabel || (duration > 0 ? `${Math.round(duration / 60)} 分钟全集` : "")}
            </span>
          )}

          {/* Direct External Link */}
          <a
            href={item.links?.original || item.url}
            target="_blank"
            rel="noopener noreferrer"
            title="打开原始播客主页"
            className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-ink-4 hover:text-[#CE1141] transition-colors"
          >
            <span>源台收听</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});

/**
 * Full Detail Page Player
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
        console.error("Failed to load episode stream:", err);
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

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const skip = (secs: number) => {
    if (audioRef.current) {
      const next = Math.max(0, Math.min(duration || Infinity, audioRef.current.currentTime + secs));
      audioRef.current.currentTime = next;
      setCurrentTime(next);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-line-soft bg-surface p-5 sm:p-7 shadow-md">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="shrink-0 size-[100px] sm:size-[120px] rounded-2xl overflow-hidden shadow-lg border border-line-soft">
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
          <div className="inline-flex items-center gap-1.5 font-bold text-[#CE1141] text-[13px]">
            <span>{podcastTitle}</span>
            {author && <span className="text-ink-4">· {author}</span>}
          </div>
          <h2 className="mt-1 text-[20px] sm:text-[23px] font-black leading-tight text-ink tracking-tight">
            {item.title}
          </h2>
          {durationLabel && <p className="mt-1 text-[13px] font-mono text-ink-4">节目总长：{durationLabel}</p>}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-line-soft flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-[#CE1141] px-5 py-2 text-[14px] font-bold text-white shadow-md hover:bg-[#b00e36] transition-all"
          >
            {isPlaying ? "暂停播放" : "立即播放"}
          </button>
          <button type="button" onClick={() => skip(-15)} className="px-2.5 py-1 text-[12px] font-mono bg-bg-sunk rounded-full hover:bg-line">
            -15s
          </button>
          <button type="button" onClick={() => skip(15)} className="px-2.5 py-1 text-[12px] font-mono bg-bg-sunk rounded-full hover:bg-line">
            +15s
          </button>
          {[1, 1.25, 1.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => changeRate(r)}
              className={`px-2 py-0.5 text-[11.5px] font-mono rounded-full ${playbackRate === r ? "bg-ink text-bg font-bold" : "text-ink-4 hover:text-ink"}`}
            >
              {r}x
            </button>
          ))}
        </div>
        {duration > 0 && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-[12px] font-mono text-ink-3">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              step="1"
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCurrentTime(val);
                if (audioRef.current) audioRef.current.currentTime = val;
              }}
              className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-[#CE1141]"
            />
            <span className="text-[12px] font-mono text-ink-4">{formatTime(duration)}</span>
          </div>
        )}
      </div>
    </div>
  );
});
