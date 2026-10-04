// One report in a feed. Desktop (≥ 961px): a sleek white card beside the time rail. Mobile: a clean, compact sports wire card.
import { memo, useMemo } from "react";
import { Link } from "react-router";
import { IntentLink } from "../../components/ui/IntentLink";
import type { GroupInfo, FeedItemSummary, TimelineFilters } from "@aihot/contracts/site";
import { CATEGORY_LABELS } from "@aihot/contracts/taxonomy";
import { MediaThumbs, SourceLine, StarButton } from "./parts";
import { GroupDevelopments, GroupSources, LatestDevelopment } from "./ReadingGroup";
import { QuotedLine } from "../item/QuotedPost";
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
  const open = () => onOpen?.(item.id);
  const showSources = !!group && (group.additionalSourceCount > 0 || (group.developmentCount <= 1 && group.reportCount > 1));
  const showDevelopments = !!group?.story && group.developmentCount > 1;

  // 清洗标题与正文
  const cleanTitle = useMemo(() => cleanSportsText(item.title), [item.title]);
  const cleanSummary = useMemo(() => cleanSportsText(item.summary), [item.summary]);

  // 清理并去重标签：彻底过滤掉后台机器分类标签
  const cleanTags = useMemo(() => {
    const rawTags = item.tags || [];
    const IGNORED = new Set([
      "非火箭/联盟其他", "视频专栏", "其他", "队记推文", "球队动态", 
      "深度专栏", "交易流言", "赛程战报", "休斯敦火箭", "NBA", "NBA官方", "官方动态"
    ]);
    return Array.from(new Set(rawTags.map((t) => t.trim())))
      .filter((t) => t && !IGNORED.has(t) && t !== item.source.name)
      .slice(0, 4);
  }, [item.tags, item.source.name]);

  return (
    <article
      className="group/card relative min-w-0 rounded-2xl bg-surface p-4 shadow-2xs ring-1 ring-line/60 transition-all duration-200 hover:ring-[#CE1141]/40 hover:shadow-xs lg:card lg:card-hover lg:rounded-panel lg:p-4.5 lg:shadow-none"
      data-item-id={item.id}
    >
      <header className="flex min-h-[22px] items-center gap-2 text-[12px] leading-none text-ink-4">
        <SourceLine item={item} className="font-bold text-ink-2" />

        {/* 移动端内联显示发布时间 */}
        <time dateTime={item.timelineAt} className="text-[11.5px] text-ink-4 font-mono lg:hidden">
          · {beijingTime(item.timelineAt)}
        </time>

        <span className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          {item.score && item.score >= 85 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/50 px-2 py-0.5 text-[10.5px] font-bold text-[#CE1141] ring-1 ring-[#CE1141]/25">
              <span className="size-1 rounded-full bg-[#CE1141]" />
              焦点
            </span>
          ) : null}
          <span className="-my-1 inline-flex">
            <StarButton item={item} />
          </span>
        </span>
      </header>

      {isX ? (
        <p className={`mt-2.5 whitespace-pre-line text-[14.5px] leading-[1.68] line-clamp-4 lg:text-[15.5px] lg:leading-[1.72] ${read ? "text-ink-4" : "font-normal text-ink"}`}>
          <IntentLink to={`/items/${item.id}`} onClick={open} className="after:absolute after:inset-0 after:content-[''] transition-colors hover:text-[#CE1141]">
            {cleanSummary || cleanTitle}
          </IntentLink>
        </p>
      ) : (
        <>
          <h3 className={`mt-2.5 text-[16px] font-extrabold leading-[1.45] tracking-tight transition-colors group-hover/card:text-[#CE1141] lg:text-[17.5px] lg:leading-[1.48] ${read ? "text-ink-4" : "text-ink"}`}>
            <IntentLink to={`/items/${item.id}`} onClick={open} className="after:absolute after:inset-0 after:content-['']">
              {cleanTitle}
            </IntentLink>
          </h3>
          {cleanSummary && (
            <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.65] text-ink-3 lg:mt-2.5 lg:line-clamp-3 lg:text-[14px] lg:leading-[1.7]">
              {cleanSummary}
            </p>
          )}
        </>
      )}

      {isX && item.x!.media.length > 0 && <MediaThumbs media={item.x!.media} className="mt-3" />}
      {isX && item.x!.quoted?.text && <QuotedLine quoted={item.x!.quoted} />}

      {cleanTags.length > 0 && (
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-1.5">
          {cleanTags.map((t) => (
            <Link
              key={t}
              to={`/all?tag=${encodeURIComponent(t)}`}
              className="inline-flex items-center rounded-md bg-bg-sunk/80 px-2 py-0.5 text-[11px] font-medium text-ink-3 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-ink"
            >
              {t}
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
