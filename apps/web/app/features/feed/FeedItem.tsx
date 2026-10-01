// One report in a feed. Desktop (≥ 961px): a sleek white card beside the time rail. Mobile: a clean, compact sports wire card.
import { memo, useMemo } from "react";
import { Link } from "react-router";
import { IntentLink } from "../../components/ui/IntentLink";
import type { GroupInfo, FeedItemSummary, TimelineFilters } from "@aihot/contracts/site";
import { CATEGORY_LABELS } from "@aihot/contracts/taxonomy";
import { ScoreLabel } from "../../components/ui/Score";
import { MediaThumbs, SourceLine, StarButton } from "./parts";
import { GroupDevelopments, GroupSources, LatestDevelopment } from "./ReadingGroup";
import { QuotedLine } from "../item/QuotedPost";
import { detectYouTube } from "../../lib/youtube";
import { beijingTime } from "../../lib/format";

export interface FeedItemProps {
  item: FeedItemSummary;
  group?: GroupInfo | null;
  filters?: TimelineFilters;
  read?: boolean;
  onOpen?: (id: string) => void;
  /** Show category and tags under the text (全部动态, topics, search). */
  showTags?: boolean;
}



function cleanSportsText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/\[?&#8230;\]?/g, "...")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export const FeedItem = memo(function FeedItem({ item, group, filters, read = false, onOpen, showTags = false }: FeedItemProps) {
  const isX = item.channel === "x" && !!item.x;
  const isYouTube = detectYouTube(item as any);
  const open = () => onOpen?.(item.id);
  const showSources = !!group && (group.additionalSourceCount > 0 || (group.developmentCount <= 1 && group.reportCount > 1));
  const showDevelopments = !!group?.story && group.developmentCount > 1;

  // 清洗标题与正文
  const cleanTitle = useMemo(() => cleanSportsText(item.title), [item.title]);
  const cleanSummary = useMemo(() => cleanSportsText(item.summary), [item.summary]);

  // 清理并去重标签
  const cleanTags = useMemo(() => {
    const catLabel = item.category ? CATEGORY_LABELS[item.category] : "";
    const rawTags = item.tags || [];
    return Array.from(new Set(rawTags.map((t) => t.trim())))
      .filter((t) => t && t !== catLabel && t !== item.source.name && t !== "休斯敦火箭")
      .slice(0, 3);
  }, [item.tags, item.category, item.source.name]);

  return (
    <article
      className="group/card relative min-w-0 rounded-2xl bg-surface/50 p-3.5 shadow-2xs ring-1 ring-line/50 transition-all duration-200 hover:bg-surface hover:ring-[#CE1141]/30 hover:shadow-xs lg:card lg:card-hover lg:rounded-panel lg:p-4 lg:shadow-none lg:ring-0"
      data-item-id={item.id}
    >
      <header className="flex min-h-[20px] items-center gap-2 text-[12px] leading-none text-ink-4">
        <SourceLine item={item} className="font-semibold text-ink-3" />

        {/* 移动端内联显示发布时间 */}
        <time dateTime={item.timelineAt} className="text-[11px] text-ink-4 lg:hidden">
          · {beijingTime(item.timelineAt)}
        </time>

        {isYouTube && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#FF0000]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#FF0000] ring-1 ring-[#FF0000]/25">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            视讯
          </span>
        )}

        <span className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
          <ScoreLabel score={item.score} compact />
          <span className="-my-1 hidden lg:inline-flex">
            <StarButton item={item} />
          </span>
        </span>
      </header>

      {isX ? (
        <p className={`mt-2 whitespace-pre-line text-[14.5px] leading-[1.65] line-clamp-4 lg:text-[15px] lg:leading-[1.7] ${read ? "text-ink-4" : "font-normal text-ink"}`}>
          <IntentLink to={`/items/${item.id}`} onClick={open} className="after:absolute after:inset-0 after:content-[''] transition-colors hover:text-[#CE1141]">
            {cleanSummary || cleanTitle}
          </IntentLink>
        </p>
      ) : (
        <>
          <h3 className={`mt-2 text-[15.5px] font-bold leading-[1.45] tracking-tight transition-colors group-hover/card:text-[#CE1141] lg:text-[17px] lg:leading-[1.5] ${read ? "text-ink-4" : "text-ink"}`}>
            <IntentLink to={`/items/${item.id}`} onClick={open} className="after:absolute after:inset-0 after:content-['']">
              {cleanTitle}
            </IntentLink>
          </h3>
          {cleanSummary && (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.65] text-ink-3 lg:mt-2 lg:line-clamp-3 lg:text-[14px] lg:leading-[1.7]">
              {cleanSummary}
            </p>
          )}
        </>
      )}

      {isX && item.x!.media.length > 0 && <MediaThumbs media={item.x!.media} className="mt-2.5" />}
      {isX && item.x!.quoted?.text && <QuotedLine quoted={item.x!.quoted} />}

      {(cleanTags.length > 0 || (showTags && item.category)) && (
        <div className="relative z-10 mt-2.5 flex flex-wrap items-center gap-1 text-[11px] text-ink-4">
          {cleanTags.map((t) => (
            <Link
              key={t}
              to={`/all?tag=${encodeURIComponent(t)}`}
              className="rounded bg-bg-sunk/70 px-1.5 py-0.5 font-medium text-ink-4 transition-colors hover:bg-red-50 hover:text-[#CE1141] dark:hover:bg-red-950/40"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {group && <LatestDevelopment group={group} />}
      {(showSources || showDevelopments) && (
        <div className="mt-2.5 flex flex-wrap items-start gap-x-4 gap-y-1">
          {showSources && <GroupSources group={group!} filters={filters} parentId={item.id} />}
          {showDevelopments && <GroupDevelopments group={{ ...group!, story: group!.story! }} filters={filters} parentId={item.id} />}
        </div>
      )}
    </article>
  );
});
