import { beijingDate, beijingTime, beijingWeekday } from "@aihot/contracts/time";

export { beijingDate, beijingTime, beijingWeekday };

export function dayLabel(date: string, today: string): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const base = `${m}月${d}日`;
  if (date === today) return `今天 · ${base}`;
  const diff = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / 86400000);
  if (diff === 1) return `昨天 · ${base}`;
  if (y !== Number(today.slice(0, 4))) return `${y}年${base}`;
  return base;
}

export function relativeTime(iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return "刚刚";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} 分钟前`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} 天前`;
  return beijingDate(iso);
}

export function fullDateTime(iso: string): string {
  return `${beijingDate(iso)} ${beijingTime(iso)}`;
}

/** "9月24日 10:51" (Beijing), for lists that span days. */
export function monthDayTime(iso: string): string {
  const [, m, d] = beijingDate(iso).split("-").map(Number) as [number, number, number];
  return `${m}月${d}日 ${beijingTime(iso)}`;
}

/** "X：Ethan Mollick (@emollick)" → "Ethan Mollick"; other sources keep their name, or resolve from URL if aggregator. */
export function shortSourceName(name: string, url?: unknown): string {
  if (typeof url === "string" && /google\s*news|全网|sportspyder/i.test(name)) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      if (host.includes("bleacherreport")) return "Bleacher Report";
      if (host.includes("yahoo")) return "Yahoo Sports";
      if (host.includes("rocketswire") || host.includes("usatoday")) return "Rockets Wire";
      if (host.includes("chronicle") || host.includes("chron.com")) return "Houston Chronicle";
      if (host.includes("marca.com")) return "MARCA";
      if (host.includes("clutchpoints")) return "ClutchPoints";
      if (host.includes("theathletic")) return "The Athletic";
      if (host.includes("espn")) return "ESPN";
      if (host.includes("si.com")) return "Sports Illustrated";
      if (host.includes("hoopshype")) return "HoopsHype";
      if (host.includes("hoopsrumors")) return "Hoops Rumors";
      if (host.includes("realgm")) return "RealGM";
      if (host.includes("thedreamshake")) return "The Dream Shake";
      if (host.includes("spacecityscoop")) return "Space City Scoop";
      if (host.includes("yardbarker")) return "Yardbarker";
      if (host.includes("theringer")) return "The Ringer";
      const parts = host.split(".");
      if (parts.length >= 2) return parts[parts.length - 2]!;
      return host;
    } catch {}
  }
  const m = /^X[:：]\s*(.+?)\s*\(@[^)]+\)\s*$/.exec(name);
  if (m) return m[1]!.replace(/（.*?）/g, "").trim();
  return name.replace(/（RSS）|（网页）|（API）/g, "").trim();
}

export function sourceInitial(name: string): string {
  const s = shortSourceName(name).replace(/^[^\p{L}\p{N}]+/u, "");
  return (s[0] ?? "A").toUpperCase();
}
