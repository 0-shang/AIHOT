/**
 * YouTube URL detection, ID extraction, and embed URL generators.
 */

export interface YouTubeInfo {
  videoId: string | null;
  playlistId: string | null;
  channelHandle: string | null;
  embedUrl: string;
  originalUrl: string;
  channelName?: string;
}

// Known channels for Houston Rockets beat and media
const KNOWN_CHANNELS: Record<string, { playlistId?: string; defaultVideoId?: string; name: string }> = {
  lockedonrockets: {
    playlistId: "UUnizQkhQWv7GwQ1PY2EJGLw",
    defaultVideoId: "HXAWBBwAtKw", // Alperen Sengun & Training Camp interviews
    name: "Locked On Rockets",
  },
  houstonrockets: {
    playlistId: "UUhdTjGHWrl-scbthhYSGB3g",
    name: "休斯顿火箭官方 YouTube",
  },
};

/**
 * Extracts a YouTube video ID from a URL or text string.
 */
export function extractYouTubeVideoId(text: string): string | null {
  if (!text) return null;
  const match = text.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/|live\/))([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Extracts a YouTube channel handle (e.g. "@LockedOnRockets") from a URL or text string.
 */
export function extractYouTubeChannel(text: string): string | null {
  if (!text) return null;
  const match = text.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/i);
  return match ? match[1] : null;
}

/**
 * Detects any YouTube video or channel embedded in an item's fields.
 */
export function detectYouTube(item: {
  links?: { original?: string };
  summary?: string | null;
  title?: string;
  body?: { zh?: string | null; original?: string | null } | null;
  x?: {
    text?: string;
    quoted?: { text?: string; url?: string } | null;
  } | null;
}): YouTubeInfo | null {
  // 1. Check original link
  const original = item.links?.original ?? "";
  const directVid = extractYouTubeVideoId(original);
  if (directVid) {
    return {
      videoId: directVid,
      playlistId: null,
      channelHandle: null,
      embedUrl: `https://www.youtube-nocookie.com/embed/${directVid}`,
      originalUrl: original,
    };
  }

  // 2. Gather all candidate text sources
  const candidates = [
    item.links?.original ?? "",
    item.summary ?? "",
    item.x?.text ?? "",
    item.x?.quoted?.text ?? "",
    item.x?.quoted?.url ?? "",
    item.body?.original ?? "",
    item.body?.zh ?? "",
  ].filter(Boolean);

  // Search for any video ID first
  for (const text of candidates) {
    const vid = extractYouTubeVideoId(text);
    if (vid) {
      return {
        videoId: vid,
        playlistId: null,
        channelHandle: null,
        embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
        originalUrl: `https://www.youtube.com/watch?v=${vid}`,
      };
    }
  }

  // Search for channel handles
  for (const text of candidates) {
    const handle = extractYouTubeChannel(text);
    if (handle) {
      const lower = handle.toLowerCase();
      const known = KNOWN_CHANNELS[lower];
      const videoId = known?.defaultVideoId ?? null;
      const playlistId = known?.playlistId ?? null;

      let embedUrl: string;
      if (videoId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      } else if (playlistId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`;
      } else {
        embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(handle)}`;
      }

      return {
        videoId,
        playlistId,
        channelHandle: handle,
        embedUrl,
        originalUrl: `https://www.youtube.com/@${handle}`,
        channelName: known?.name ?? `@${handle}`,
      };
    }
  }

  return null;
}
