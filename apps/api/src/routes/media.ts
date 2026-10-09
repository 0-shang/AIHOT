// Signed image and video proxy. Unsigned, badly signed or expired requests are 403 without any upstream fetch.
import type { FastifyInstance } from "fastify";
import http from "node:http";
import https from "node:https";
import { produceImage } from "@aihot/backend/media/images";
import { verifyProxyRequest, verifyVideoProxyRequest } from "@aihot/backend/media/imgproxy";
import { downloadAndCacheVideo, isVideoCached, prefetchVideo, serveLocalVideoFile, videoFilePath } from "@aihot/backend/media/videocache";
import { looseQuery } from "../http/respond.ts";

function streamUpstream(
  urlStr: string,
  method: string,
  headers: Record<string, string>,
  onResponse: (res: http.IncomingMessage) => void,
  onError: (err: Error) => void,
  redirectsLeft = 3
): http.ClientRequest {
  const parsed = new URL(urlStr);
  const client = parsed.protocol === "https:" ? https : http;
  const req = client.request(parsed, { method, headers }, (res) => {
    if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
      const nextUrl = new URL(res.headers.location, urlStr).toString();
      streamUpstream(nextUrl, method, headers, onResponse, onError, redirectsLeft - 1);
      return;
    }
    onResponse(res);
  });
  req.on("error", onError);
  req.end();
  return req;
}

export function registerMedia(app: FastifyInstance) {
  app.get("/api/img-proxy", async (req, reply) => {
    const q = looseQuery(req);
    const verdict = verifyProxyRequest({ u: q.u, mode: q.mode, exp: q.exp, sig: q.sig });
    // A caching proxy (nginx auth_request) can check every request with this HEAD sub-request before it reads its image cache (keyed
    // by url and mode only): signature only, no upstream fetch. 401 = malformed query, 403 = bad or
    // expired signature; a valid answer may be cached for the rest of the signature's life.
    if (req.method === "HEAD" && req.headers["x-aihot-img-proxy-auth"] === "1") {
      if (!verdict.ok) {
        const malformed = verdict.reason === "missing" || verdict.reason === "bad-url";
        return reply.code(malformed ? 401 : 403).header("Cache-Control", "no-store").header("X-Img-Proxy-Sig", verdict.reason === "expired" ? "expired" : "invalid").send();
      }
      const remaining = Math.max(1, Number(q.exp) - Math.floor(Date.now() / 1000));
      return reply.code(204).header("X-Img-Proxy-Sig", "valid").header("X-Accel-Expires", String(remaining)).send();
    }
    if (!verdict.ok) {
      return reply.code(403).header("Cache-Control", "no-store").type("text/plain; charset=utf-8").send("Forbidden");
    }
    try {
      const { body, type } = await produceImage(verdict.url, verdict.mode);
      const maxAge = Math.max(60, Math.min(7 * 86400, Number(q.exp) - Math.floor(Date.now() / 1000)));
      return reply
        .header("Content-Type", type)
        .header("Cache-Control", `public, max-age=${maxAge}, s-maxage=${maxAge}`)
        .header("X-Content-Type-Options", "nosniff")
        .header("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox")
        .send(body);
    } catch (error) {
      req.log.warn({ err: String(error), host: new URL(verdict.url).hostname }, "img-proxy upstream failed");
      return reply.code(502).header("Cache-Control", "public, max-age=300").type("text/plain; charset=utf-8").send("Upstream image unavailable");
    }
  });

  app.route({
    method: ["GET", "HEAD"],
    url: "/api/video-proxy",
    handler: async (req, reply) => {
      const q = looseQuery(req);
      const verdict = verifyVideoProxyRequest({ u: q.u, exp: q.exp, sig: q.sig });
      if (!verdict.ok) {
        return reply.code(403).header("Cache-Control", "no-store").type("text/plain; charset=utf-8").send("Forbidden");
      }

      // If already cached on local disk, serve immediately with ultra-low latency & 206 Range support
      if (await isVideoCached(verdict.url)) {
        await serveLocalVideoFile(videoFilePath(verdict.url), req, reply);
        return;
      }

      // Trigger background download to local disk so subsequent requests/seeks are instant
      prefetchVideo(verdict.url);

      const upstreamHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
      };
      if (req.headers.range) {
        upstreamHeaders["Range"] = req.headers.range;
      }
      if (req.headers["if-range"]) {
        upstreamHeaders["If-Range"] = req.headers["if-range"] as string;
      }

      reply.hijack();

      const activeReq = streamUpstream(
        verdict.url,
        req.method,
        upstreamHeaders,
        (upstreamRes) => {
          const statusCode = upstreamRes.statusCode ?? 200;
          const resHeaders: Record<string, string | string[]> = {
            "Content-Type": upstreamRes.headers["content-type"] || "video/mp4",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
            "X-Content-Type-Options": "nosniff",
          };
          if (upstreamRes.headers["content-length"]) {
            resHeaders["Content-Length"] = upstreamRes.headers["content-length"];
          }
          if (upstreamRes.headers["content-range"]) {
            resHeaders["Content-Range"] = upstreamRes.headers["content-range"];
          }
          if (upstreamRes.headers["etag"]) {
            resHeaders["ETag"] = upstreamRes.headers["etag"];
          }
          if (upstreamRes.headers["last-modified"]) {
            resHeaders["Last-Modified"] = upstreamRes.headers["last-modified"];
          }

          reply.raw.writeHead(statusCode, resHeaders);
          upstreamRes.pipe(reply.raw);
        },
        (err) => {
          req.log.warn({ err: String(err), host: new URL(verdict.url).hostname }, "video-proxy upstream error");
          if (!reply.raw.headersSent) {
            reply.raw.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
            reply.raw.end("Upstream video unavailable");
          } else {
            reply.raw.destroy();
          }
        }
      );

      req.raw.on("close", () => {
        activeReq.destroy();
      });
    },
  });
}

