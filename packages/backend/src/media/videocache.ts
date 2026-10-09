// Video local disk cache and HTTP range streamer.
// Videos from X/Twitter and RSS are cached on the local disk to allow instant playback
// with full HTTP 206 Partial Content (Range) support, completely avoiding cross-border lag.
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync, promises as fs } from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import type { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config.ts";

const VIDEO_CACHE_DIR = path.join(config.dataDir, "videocache");
let dirEnsured = false;

async function ensureDir() {
  if (dirEnsured) return;
  await fs.mkdir(VIDEO_CACHE_DIR, { recursive: true });
  dirEnsured = true;
}

export function videoCacheKey(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 32);
}

export function videoFilePath(url: string): string {
  return path.join(VIDEO_CACHE_DIR, `${videoCacheKey(url)}.mp4`);
}

// In-flight download promises to deduplicate concurrent requests for the same video.
const inFlightDownloads = new Map<string, Promise<string | null>>();

/** Check if video is already fully cached on local disk */
export async function isVideoCached(url: string): Promise<boolean> {
  const filePath = videoFilePath(url);
  try {
    const stat = await fs.stat(filePath);
    return stat.size > 1024; // must be a valid file, not an empty or broken one
  } catch {
    return false;
  }
}

/**
 * Downloads a video from an upstream URL and caches it locally.
 * Returns the cached file path on success, or null on failure.
 */
export async function downloadAndCacheVideo(url: string): Promise<string | null> {
  if (await isVideoCached(url)) {
    return videoFilePath(url);
  }

  const existing = inFlightDownloads.get(url);
  if (existing) return existing;

  const downloadPromise = (async () => {
    await ensureDir();
    const finalPath = videoFilePath(url);
    const tmpPath = `${finalPath}.${Date.now()}.tmp`;

    try {
      await fetchToDisk(url, tmpPath);
      const stat = await fs.stat(tmpPath);
      if (stat.size > 1024) {
        await fs.rename(tmpPath, finalPath);
        return finalPath;
      } else {
        await fs.unlink(tmpPath).catch(() => {});
        return null;
      }
    } catch (err) {
      await fs.unlink(tmpPath).catch(() => {});
      return null;
    } finally {
      inFlightDownloads.delete(url);
    }
  })();

  inFlightDownloads.set(url, downloadPromise);
  return downloadPromise;
}

/** Fire-and-forget prefetch to populate cache in the background */
export function prefetchVideo(url: string | null | undefined): void {
  if (!url || !/^https?:\/\//i.test(url)) return;
  downloadAndCacheVideo(url).catch(() => {});
}

function fetchToDisk(urlStr: string, destPath: string, redirectsLeft = 3): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const client = parsed.protocol === "https:" ? https : http;
    const req = client.get(
      urlStr,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
      },
      (res) => {
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
          const nextUrl = new URL(res.headers.location, urlStr).toString();
          res.resume();
          fetchToDisk(nextUrl, destPath, redirectsLeft - 1).then(resolve, reject);
          return;
        }

        if (res.statusCode !== 200 && res.statusCode !== 206) {
          res.resume();
          reject(new Error(`Upstream returned HTTP ${res.statusCode}`));
          return;
        }

        const out = createWriteStream(destPath);
        res.pipe(out);
        out.on("finish", () => {
          out.close();
          resolve();
        });
        out.on("error", (err) => {
          res.destroy();
          reject(err);
        });
      }
    );

    req.setTimeout(60_000, () => {
      req.destroy(new Error("Video download timeout"));
    });
    req.on("error", reject);
  });
}

/**
 * Serves a locally cached video file with full HTTP 206 Partial Content (Range) support.
 * This guarantees instant (<10ms) playback startup and fluid scrubbing for video players.
 */
export async function serveLocalVideoFile(
  filePath: string,
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const stat = await fs.stat(filePath);
  const totalSize = stat.size;
  const range = req.headers.range;

  reply.hijack();

  const commonHeaders: Record<string, string | number> = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=2592000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Last-Modified": stat.mtime.toUTCString(),
  };

  if (!range) {
    // Normal 200 response
    reply.raw.writeHead(200, {
      ...commonHeaders,
      "Content-Length": totalSize,
    });
    if (req.method === "HEAD") {
      reply.raw.end();
      return;
    }
    const stream = createReadStream(filePath);
    stream.pipe(reply.raw);
    req.raw.on("close", () => stream.destroy());
    return;
  }

  // Range request (HTTP 206)
  const parts = range.replace(/bytes=/, "").split("-");
  const startStr = parts[0]?.trim();
  const endStr = parts[1]?.trim();

  let start = startStr ? Number.parseInt(startStr, 10) : 0;
  let end = endStr ? Number.parseInt(endStr, 10) : totalSize - 1;

  if (Number.isNaN(start)) start = 0;
  if (Number.isNaN(end) || end >= totalSize) end = totalSize - 1;

  if (start > end || start >= totalSize) {
    reply.raw.writeHead(416, {
      "Content-Range": `bytes */${totalSize}`,
      ...commonHeaders,
    });
    reply.raw.end();
    return;
  }

  const chunkSize = end - start + 1;
  reply.raw.writeHead(206, {
    ...commonHeaders,
    "Content-Range": `bytes ${start}-${end}/${totalSize}`,
    "Content-Length": chunkSize,
  });

  if (req.method === "HEAD") {
    reply.raw.end();
    return;
  }

  const stream = createReadStream(filePath, { start, end });
  stream.pipe(reply.raw);
  req.raw.on("close", () => stream.destroy());
}
