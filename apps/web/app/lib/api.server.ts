// Server-side HTTP client for route loaders. The web process never touches the database;
// SSR reads the api over loopback with keep-alive, one or two requests per page.
import { data, redirect } from "react-router";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:3001";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly retryAfter: number | null;
  constructor(status: number, code: string | null, retryAfter: number | null) {
    super(`api ${status} ${code ?? ""}`);
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

interface ApiCacheEntry {
  data: any;
  cachedAt: number;
  headers: [string, string][];
}

const apiCache = new Map<string, ApiCacheEntry>();
const apiPending = new Map<string, Promise<{ data: any; headers: [string, string][] }>>();

const FRESH_TTL_MS = 25_000;
const ITEM_DETAIL_FRESH_TTL_MS = 300_000;
const MAX_STALE_MS = 600_000;

export async function apiGet<T>(path: string, init?: { signal?: AbortSignal; headers?: Record<string, string>; responseHeaders?: Headers }): Promise<T> {
  const isSiteGet = path.startsWith("/api/site/") && !path.includes("/admin");

  if (isSiteGet) {
    const hit = apiCache.get(path);
    const now = Date.now();
    const freshTtl = path.startsWith("/api/site/items/") ? ITEM_DETAIL_FRESH_TTL_MS : FRESH_TTL_MS;
    if (hit) {
      if (now - hit.cachedAt < freshTtl) {
        if (init?.responseHeaders) {
          for (const [k, v] of hit.headers) init.responseHeaders.set(k, v);
        }
        return hit.data as T;
      }
      // Stale-While-Revalidate: trigger background revalidation if not already in flight
      if (now - hit.cachedAt < MAX_STALE_MS) {
        if (!apiPending.has(path)) {
          fetchFresh<T>(path, init).catch(() => {});
        }
        if (init?.responseHeaders) {
          for (const [k, v] of hit.headers) init.responseHeaders.set(k, v);
        }
        return hit.data as T;
      }
    }

    const pending = apiPending.get(path);
    if (pending) {
      const res = await pending;
      if (init?.responseHeaders) {
        for (const [k, v] of res.headers) init.responseHeaders.set(k, v);
      }
      return res.data as T;
    }
  }

  try {
    const res = await fetchFresh<T>(path, init);
    return res;
  } catch (err) {
    // Resilient fallback: if upstream API fails or times out, serve stale cache if we have one
    const staleHit = apiCache.get(path);
    if (staleHit) {
      if (init?.responseHeaders) {
        for (const [k, v] of staleHit.headers) init.responseHeaders.set(k, v);
      }
      return staleHit.data as T;
    }
    throw err;
  }
}

async function fetchFresh<T>(path: string, init?: { signal?: AbortSignal; headers?: Record<string, string>; responseHeaders?: Headers }): Promise<T> {
  const isSiteGet = path.startsWith("/api/site/") && !path.includes("/admin");
  const perform = async (): Promise<{ data: T; headers: [string, string][] }> => {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { accept: "application/json", "x-aihot-ssr": "1", ...init?.headers },
      signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15_000)]) : AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      let code: string | null = null;
      try {
        code = ((await res.json()) as { code?: string }).code ?? null;
      } catch {
        // not JSON
      }
      const retry = res.headers.get("retry-after");
      throw new ApiError(res.status, code, retry ? Number(retry) : null);
    }
    const headersList: [string, string][] = [];
    res.headers.forEach((value, name) => {
      headersList.push([name, value]);
      init?.responseHeaders?.set(name, value);
    });
    const json = (await res.json()) as T;
    return { data: json, headers: headersList };
  };

  if (!isSiteGet) {
    const { data } = await perform();
    return data;
  }

  const p = perform().then((res) => {
    if (apiCache.size >= 300) apiCache.delete(apiCache.keys().next().value!);
    apiCache.set(path, { data: res.data, cachedAt: Date.now(), headers: res.headers });
    return res;
  });

  apiPending.set(path, p);
  try {
    const result = await p;
    return result.data;
  } finally {
    apiPending.delete(path);
  }
}

/** Maps API failures to route responses: real 404s, search-busy page, otherwise 503. */
export async function loadOr404<T>(path: string, opts: { busyRedirect?: string; responseHeaders?: Headers; signal?: AbortSignal } = {}): Promise<T> {
  try {
    return await apiGet<T>(path, { responseHeaders: opts.responseHeaders, signal: opts.signal });
  } catch (error) {
    if (opts.signal?.aborted) throw error;
    if (error instanceof ApiError) {
      if (error.status === 404) throw data({ message: "not_found" }, { status: 404 });
      if (error.status === 503 && opts.busyRedirect) throw redirect(opts.busyRedirect);
      if (error.status === 400) throw data({ message: "bad_request" }, { status: 400 });
    }
    throw data({ message: "unavailable" }, { status: 503 });
  }
}

export function queryString(params: Record<string, string | number | null | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== null && v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * Cache headers for a page of selected items: shared caches keep it at most `maxSeconds`, and never
 * past the next pending release in its scope, the same absolute deadline the api gives a proxy or
 * CDN in front. No stale-while-revalidate: a released item must not wait behind a stale copy.
 */
export function releaseBoundCache(refreshAt: string | null, maxSeconds: number, now = Date.now(), upstream?: Headers): Record<string, string> {
  let deadline = Math.floor(now / 1000) + maxSeconds;
  if (refreshAt) deadline = Math.min(deadline, Math.floor(Date.parse(refreshAt) / 1000));
  const sourceDeadline = upstream?.get("X-Accel-Expires");
  if (sourceDeadline?.startsWith("@")) deadline = Math.min(deadline, Number(sourceDeadline.slice(1)));
  if (sourceDeadline === "0" || /(?:no-cache|no-store)/i.test(upstream?.get("Cache-Control") ?? "")) deadline = Math.floor(now / 1000);
  const seconds = Math.max(0, Math.floor(deadline - now / 1000));
  return {
    "Cache-Control": seconds > 0 ? `public, max-age=0, s-maxage=${seconds}` : "no-cache",
    "X-Accel-Expires": seconds > 0 ? `@${deadline}` : "0",
  };
}
