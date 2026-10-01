// A page of reports grouped by Beijing day with the same rail and rows as the home timeline
// (全部动态, topics, search results, 收藏).
import { useMemo } from "react";
import { Link } from "react-router";
import type { FeedItemSummary } from "@aihot/contracts/site";
import { IconChevronRight } from "../../components/icons";
import { beijingDate } from "../../lib/format";
import { markRead, useReadSet } from "../../lib/local-state";
import { DayHeader, TimelineSlot } from "./Timeline";
import { FeedItem } from "./FeedItem";

export function DayList({ items, todayCount = null, showTags = true, animate = false }: { items: FeedItemSummary[]; todayCount?: number | null; showTags?: boolean; animate?: boolean }) {
  const readSet = useReadSet();
  const today = beijingDate(Date.now());
  const days = useMemo(() => {
    // 渲染层防护去重：若相邻或同一天出现相似/相同报道，只保留一条更优质的条目
    const deduplicated: FeedItemSummary[] = [];
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    for (const it of items) {
      const nt = norm(it.title);
      const dup = deduplicated.some((prev) => {
        const pt = norm(prev.title);
        if (nt === pt) return true;
        if (nt.length >= 8 && pt.length >= 8) {
          if (nt.includes(pt) || pt.includes(nt)) {
            const minLen = Math.min(nt.length, pt.length);
            const maxLen = Math.max(nt.length, pt.length);
            if (minLen / maxLen >= 0.6) return true;
          }
        }
        return false;
      });
      if (!dup) deduplicated.push(it);
    }

    const out: Array<{ day: string; items: FeedItemSummary[] }> = [];
    for (const it of deduplicated) {
      const d = beijingDate(it.timelineAt);
      const last = out[out.length - 1];
      if (last && last.day === d) last.items.push(it);
      else out.push({ day: d, items: [it] });
    }
    return out;
  }, [items]);
  let order = 0;
  return (
    <div>
      {days.map(({ day, items: list }) => (
        <section key={day} aria-label={day}>
          <DayHeader day={day} today={today} count={day === today ? todayCount : null} />
          <ol className="lg:pt-1">
            {list.map((it) => (
              <TimelineSlot key={it.id} at={it.timelineAt} fresh={animate} delay={animate ? Math.min(order++, 12) * 25 : 0}>
                <FeedItem item={it} read={readSet.has(it.id)} onOpen={markRead} showTags={showTags} />
              </TimelineSlot>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

/** Numbered pages (the list stays crawlable), with previous / next at the ends. */
export function Pagination({ page, pageCount, href }: { page: number; pageCount: number; href: (p: number) => string }) {
  if (pageCount <= 1) return null;
  const pages = [...new Set([1, pageCount, page - 2, page - 1, page, page + 1, page + 2].filter((p) => p >= 1 && p <= pageCount))].sort((a, b) => a - b);
  const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-[13px] transition-colors";
  return (
    <nav aria-label="分页" className="mt-6 flex flex-wrap items-center justify-center gap-1">
      {page > 1 && (
        <Link to={href(page - 1)} className={`${btn} border border-line-strong bg-surface px-3 text-ink-3 hover:border-ink-4 hover:text-ink`}>
          上一页
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1">
          {i > 0 && p - pages[i - 1]! > 1 && <span className="px-0.5 text-ink-4">…</span>}
          <Link
            to={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`num ${btn} ${p === page ? "bg-ink font-semibold text-bg" : "text-ink-3 hover:bg-bg-sunk hover:text-ink"}`}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pageCount && (
        <Link to={href(page + 1)} className={`${btn} gap-0.5 border border-line-strong bg-surface px-3 text-ink-3 hover:border-ink-4 hover:text-ink`}>
          下一页 <IconChevronRight size={14} />
        </Link>
      )}
    </nav>
  );
}

