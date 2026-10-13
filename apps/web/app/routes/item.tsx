import { SITE, withSubject } from "@aihot/industry/site";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/item";
import type { SiteItemDetail } from "@aihot/contracts/site";
import { loadOr404 } from "../lib/api.server";
import { breadcrumbLd, pageMeta, siteUrl, titled } from "../lib/seo";
import { fullDateTime, relativeTime, shortSourceName } from "../lib/format";
import { markRead } from "../lib/local-state";
import { SelectedBadge } from "../components/ui/Badge";
import { ScoreLabel } from "../components/ui/Score";
import { PillTabs } from "../components/ui/Tabs";
import { ArticleLayout, RailSection } from "../components/ui/Page";
import { Menu, MenuItem } from "../components/ui/Menu";
import { StarButton } from "../features/feed/parts";
import { GroupSources } from "../features/feed/ReadingGroup";
import { StoryFollowups } from "../features/item/StoryFollowups";
import { MediaGallery } from "../features/item/MediaGallery";
import { QuotedPost } from "../features/item/QuotedPost";
import { YouTubeEmbed } from "../components/ui/YouTubeEmbed";
import { detectYouTube } from "../lib/youtube";
import { PodcastDetailPlayer } from "../features/podcast/PodcastPlayer";
import { IconArrowLeft, IconCopy, IconDownload, IconExternal, IconImage, IconMenu, IconShare } from "../components/icons";

const PosterSheet = lazy(() => import("../features/item/PosterSheet"));

export async function loader({ params, request }: Route.LoaderArgs) {
  const item = await loadOr404<SiteItemDetail>(`/api/site/items/${encodeURIComponent(params.id)}`, { signal: request.signal });
  return { item };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: titled("内容不存在") }, { name: "robots", content: "noindex" }];
  const { item } = loaderData;
  return pageMeta({
    title: item.title,
    description: item.summary ?? undefined,
    path: `/items/${item.id}`,
    image: `/og/items/${item.id}.png`,
    type: "article",
    noindex: !item.indexable,
    jsonLd: breadcrumbLd([
      { name: SITE.name, path: "/" },
      { name: item.selected ? "精选" : "全部动态", path: item.selected ? "/" : "/all" },
      { name: item.title, path: `/items/${item.id}` },
    ]),
  });
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=120" };
}

/** A 2px accent line across the top that follows long bodies. */
function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-150 ease-out" />;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function shareOrCopy(item: Pick<SiteItemDetail, "id" | "title">): Promise<"shared" | "copied" | null> {
  const url = `${siteUrl()}/items/${item.id}`;
  try {
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      await navigator.share({ title: item.title, url });
      return "shared";
    }
    await navigator.clipboard.writeText(`${item.title}\n${url}`);
    return "copied";
  } catch {
    return null;
  }
}

export default function ItemPage() {
  const { item } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const hasTranslation = item.hasTranslation;
  const lang = item.bodyLanguage;
  const [posterRequested, setPosterRequested] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => markRead(item.id), [item.id]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);
  const closePoster = useCallback(() => setPosterOpen(false), []);
  const openPoster = () => {
    setPosterRequested(true);
    setPosterOpen(true);
  };
  const share = async () => {
    const r = await shareOrCopy(item);
    if (r === "copied") setToast("链接已复制");
  };

  const [translatedData, setTranslatedData] = useState<{ title?: string; summary?: string | null; bodyHtml?: string } | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translating, setTranslating] = useState(false);

  const bodyHtml = lang === "zh" ? (item.body?.zh ?? item.body?.original) : (item.body?.original ?? item.body?.zh);

  const handleFreeTranslate = async () => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }
    if (translatedData) {
      setShowTranslation(true);
      return;
    }
    setTranslating(true);
    try {
      const isZhTitle = /[一-鿿]/.test(item.title);
      const titleToTranslate = !isZhTitle ? (item.originalTitle || item.title) : "";
      const isZhSummary = item.summary ? /[一-鿿]/.test(item.summary) : true;
      const summaryToTranslate = !isZhSummary ? (item.summary || "") : "";

      const dummy = document.createElement("div");
      dummy.innerHTML = bodyHtml || "";
      const textNodes: Text[] = [];
      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          textNodes.push(node as Text);
        } else {
          node.childNodes.forEach(walk);
        }
      };
      walk(dummy);
      const textsToTranslate = textNodes.map((n) => n.textContent || "").filter((t) => /[a-zA-Z]{2,}/.test(t));

      const payload = [titleToTranslate, summaryToTranslate, ...textsToTranslate].filter(Boolean);
      if (payload.length === 0) {
        setShowTranslation(true);
        return;
      }
      const res = await fetch("/api/site/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleToTranslate || undefined,
          summary: summaryToTranslate || undefined,
          texts: textsToTranslate,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { title?: string; summary?: string; translations?: string[] };
        const transTitle = data.title || item.title;
        const transSummary = data.summary || item.summary;
        const translations = data.translations || [];

        let idx = 0;
        for (const node of textNodes) {
          if (/[a-zA-Z]{2,}/.test(node.textContent || "")) {
            if (idx < translations.length && translations[idx]) {
              node.textContent = translations[idx++];
            }
          }
        }
        setTranslatedData({
          title: transTitle,
          summary: transSummary,
          bodyHtml: dummy.innerHTML,
        });
        setShowTranslation(true);
      }
    } catch {
      // ignore
    } finally {
      setTranslating(false);
    }
  };

  const translateButton = (
    <button
      type="button"
      onClick={handleFreeTranslate}
      disabled={translating}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium transition-all ${
        showTranslation
          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
          : "border border-line-strong bg-surface text-ink-2 hover:border-accent hover:text-accent shadow-xs active:scale-95"
      }`}
      title="翻译为中文"
    >
      <span className="text-[12px]">{translating ? "🔄" : showTranslation ? "✓" : "🌐"}</span>
      <span>
        {translating
          ? "翻译中..."
          : showTranslation
          ? "查看原文"
          : "英译中"}
      </span>
    </button>
  );

  const displayedTitle = showTranslation && translatedData?.title ? translatedData.title : item.title;
  const displayedSummary = showTranslation && translatedData?.summary ? translatedData.summary : item.summary;
  const displayedBodyHtml = (showTranslation && translatedData?.bodyHtml ? translatedData.bodyHtml : bodyHtml) || "";

  const bodyLabel = !item.body ? null : lang === "zh" && item.body.zhKind === "translation" ? "正文 · 中文翻译" : lang === "original" && hasTranslation ? "正文 · 原文" : "正文";
  const isX = item.channel === "x" && !!item.x;
  const publishedIso = item.publishedAt ?? item.discoveredAt;
  const summaryOnly = item.readingMode === "summary-only";
  const isPodcast = item.category === "podcasts" || !!item.podcast || (!!item.links?.original && item.links.original.includes("/episodes/"));
  const showOutline = item.outline.length >= 3;
  const originalLabel = isX ? "在 X 查看原推" : "打开原文";

  const related = item.relatedStories.filter((s) => s.publicId !== item.story?.publicId);
  const ytInfo = detectYouTube(item);
  const poster = item.x?.media?.[0]?.url ?? (item.x as any)?.quoted?.media?.[0]?.url ?? null;

  const back = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(item.selected ? "/" : "/all");
  };
  const backButton = (
    <button type="button" onClick={back} className="-ml-1.5 inline-flex h-8 items-center gap-1.5 rounded-full px-1.5 text-[14px] text-ink-2 transition-colors hover:text-ink lg:text-[13px] lg:text-ink-3">
      <IconArrowLeft size={16} /> 返回
    </button>
  );
  const moreMenu = (
    <Menu label="更多操作" trigger={<IconMenu size={17} />}>
      {(close) => (
        <>
          <MenuItem icon={<IconShare size={15} />} onSelect={() => { close(); void share(); }}>分享链接</MenuItem>
          <MenuItem icon={<IconImage size={15} />} onSelect={() => { close(); openPoster(); }}>生成分享海报</MenuItem>
          <MenuItem
            icon={<IconCopy size={15} />}
            onSelect={async () => {
              close();
              try {
                await navigator.clipboard.writeText(`${siteUrl()}/items/${item.id}`);
                setToast("链接已复制");
              } catch {
                // clipboard unavailable
              }
            }}
          >
            复制链接
          </MenuItem>
          {item.markdownAvailable && (
            <MenuItem icon={<IconDownload size={15} />} href={`/items/${item.id}/markdown`} download onSelect={close}>
              导出 Markdown
            </MenuItem>
          )}
        </>
      )}
    </Menu>
  );
  // Desktop actions head the right rail, one row as tall as 返回 at the head of the left one.
  const actions = (
    <div className="flex items-center gap-1">
      <a
        href={item.links.original}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-ink-4 hover:text-ink"
      >
        {originalLabel} <IconExternal size={13} />
      </a>
      <StarButton item={item} size={32} />
      {moreMenu}
    </div>
  );
  const verdict = (item.selected || item.score !== null) && (
    <div className="flex items-center gap-2">
      {item.selected && <SelectedBadge />}
      <ScoreLabel score={item.score} />
    </div>
  );

  // Rails: the piece's facts on the left (wide screens), the editor's notes on the right, the outline
  // under the facts (or under the notes when only the right rail shows).
  const facts = (
    <RailSection title="来源">
      <div className="text-[14px] font-semibold leading-snug text-ink">{isX ? item.x!.authorName : shortSourceName(item.source.name, item.links.original)}</div>
      <div className="mt-1 text-[12.5px] leading-relaxed text-ink-3">
        {isX ? `@${item.x!.handle} · X` : item.author ?? hostOf(item.links.original)}
      </div>
      <div className="mt-3 text-[12px] text-ink-4">发布时间</div>
      <time dateTime={publishedIso} className="mono mt-0.5 block text-[12.5px] text-ink-2">
        {fullDateTime(publishedIso)}
      </time>
      <div className="mt-0.5 text-[12px] text-ink-4" suppressHydrationWarning>
        {relativeTime(publishedIso)}
      </div>
    </RailSection>
  );
  const outline = showOutline && (
    <RailSection title="本文目录">
      <nav aria-label="本文目录">
        <ol className="-ml-px space-y-0.5 border-l border-line">
          {item.outline.map((o) => (
            <li key={o.id}>
              <a href={`#${o.id}`} className={`-ml-px block border-l border-transparent py-1 text-[12.5px] leading-snug text-ink-3 transition-colors hover:border-accent hover:text-ink ${o.level > 2 ? "pl-5" : "pl-3"}`}>
                {o.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </RailSection>
  );
  const notes = (
    <>
      {item.reason && !summaryOnly ? (
        <RailSection title="推荐理由">
          {verdict && <div className="mb-3">{verdict}</div>}
          <p className="text-[13.5px] leading-[1.8] text-ink-2">{item.reason}</p>
        </RailSection>
      ) : (
        verdict && <RailSection title="情报评级">{verdict}</RailSection>
      )}
      {item.tags.length > 0 && (
        <RailSection title="标签">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 8).map((t) => (
              <Link key={t} to={`/all?tag=${encodeURIComponent(t)}`} className="chip">
                #{t}
              </Link>
            ))}
          </div>
        </RailSection>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-[var(--page-max-reading)] pb-8">
      {item.body && <ReadingProgress />}

      {/* Phones: a sticky bar with back, 收藏, the original, share and more. Desktop puts these in the rails. */}
      <div className="sticky top-0 z-30 -mx-4 flex h-12 items-center gap-1.5 border-b border-line-soft bg-bg/95 px-4 backdrop-blur lg:hidden">
        {backButton}
        <span className="flex-1" />
        <StarButton item={item} size={32} />
        <a href={item.links.original} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1 px-1.5 text-[14px] text-ink-2">
          <IconExternal size={15} /> 原文
        </a>
        <button type="button" aria-label="分享" onClick={share} className="inline-flex size-8 items-center justify-center rounded-full text-ink-3 hover:text-ink">
          <IconShare size={17} />
        </button>
        {moreMenu}
      </div>

      {/* The text on the page in one column; back and the facts in the left rail, actions and notes in the right. */}
      <ArticleLayout
        left={
          <>
            {backButton}
            {facts}
            {outline}
          </>
        }
        right={
          <>
            {actions}
            {notes}
            <div className="space-y-8 2xl:hidden">{outline}</div>
          </>
        }
      >
        <div className="hidden lg:block 2xl:hidden">{backButton}</div>
        <article className="pb-6 pt-6 lg:pt-2 2xl:pt-1">
          <div className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-ink-3 2xl:hidden ${isX ? "" : "mb-3"}`}>
            <span className="font-semibold text-ink-2">{isX ? item.x!.authorName : shortSourceName(item.source.name, item.links.original)}</span>
            {isX && <span>· @{item.x!.handle} · X</span>}
            {item.author && !isX && <span>· {item.author}</span>}
            <span>·</span>
            <time dateTime={publishedIso} className="mono">{fullDateTime(publishedIso)}</time>
            <span suppressHydrationWarning>· {relativeTime(publishedIso)}</span>
            {item.selected && (
              <span className="ml-1 lg:hidden">
                <SelectedBadge />
              </span>
            )}
            {item.score !== null && (
              <span className="ml-1 lg:hidden">
                <ScoreLabel score={item.score} />
              </span>
            )}
          </div>
          {isPodcast ? (
            <PodcastDetailPlayer item={item} />
          ) : (
            <>
              {!isX && <h1 className="text-[26px] font-bold leading-[1.38] tracking-[-0.01em] text-ink lg:text-[32px] lg:leading-[1.34] xl:text-[36px] xl:leading-[1.3]">{displayedTitle}</h1>}
              {!isX && item.originalTitle && <p className="mt-2.5 text-[14px] leading-relaxed text-ink-4">{item.originalTitle}</p>}
            </>
          )}

          {item.summary && !isPodcast && (
            <section className={isX ? "mt-4" : "mt-6 xl:mt-7"}>
              <div className="mb-2 text-[12px] font-semibold text-accent">{summaryOnly ? "摘要" : "情报要点"}</div>
              <p className="text-[18px] leading-[1.7] text-ink xl:text-[20px] xl:leading-[1.7]">{displayedSummary}</p>
            </section>
          )}

          {item.reason && !summaryOnly && (
            <section className="mt-6 border-t border-line pt-4 lg:hidden">
              <div className="mb-1 text-[12px] font-semibold text-ink-3">推荐理由</div>
              <p className="text-[15px] leading-[1.75] text-ink-2">{item.reason}</p>
            </section>
          )}

          {item.group && item.group.reportCount > 1 && (
            <div className="mt-5">
              <GroupSources group={item.group} parentId={item.id} />
            </div>
          )}

          {summaryOnly && !isPodcast && <p className="mt-7 rounded-control bg-bg-sunk px-4 py-3 text-[13.5px] leading-relaxed text-ink-3">应来源方要求，这里只提供摘要与原文入口。完整内容请阅读原文。</p>}

          {item.body && bodyHtml && (
            <section className="mt-9 border-t border-line pt-4 xl:mt-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[14px] font-bold text-ink">{isPodcast ? "单集介绍 Episode Description" : bodyLabel}</span>
                <div className="flex items-center gap-2">
                  {translateButton}
                  {hasTranslation && (
                    <PillTabs
                      size="xs"
                      layoutId="item-body-lang"
                      label="正文语言"
                      active={lang}
                      items={[
                        { key: "zh", label: "中文", prefetch: "intent", replace: true, to: `/items/${item.id}` },
                        { key: "original", label: "原文", prefetch: "intent", replace: true, to: `/items/${item.id}/original` },
                      ]}
                    />
                  )}
                </div>
              </div>
              {hasTranslation && lang === "zh" && !item.body.complete && (
                <p className="mb-5 rounded-control bg-bg-sunk px-3 py-2 text-[13px] text-ink-3">译文尚不完整，完整内容请切换到原文。</p>
              )}
              <div className="prose" dangerouslySetInnerHTML={{ __html: displayedBodyHtml }} />
            </section>
          )}

          {/* Embed YouTube player directly on page if detected */}
          {ytInfo && (
            <div className="mt-4">
              <YouTubeEmbed info={ytInfo} poster={poster} />
            </div>
          )}

          {isX && item.x!.media.length > 0 && (!ytInfo || item.x!.media.length > 1) && (
            <MediaGallery media={item.x!.media} postUrl={item.links.original} />
          )}
          {isX && item.x!.quoted?.text && <QuotedPost quoted={item.x!.quoted} original={lang === "original"} />}

          <p className="mt-8 text-[13px] text-ink-4">
            来源：
            <a href={item.links.original} target="_blank" rel="noopener noreferrer" className="text-ink-3 hover:text-accent">
              {isX ? item.x!.authorName : shortSourceName(item.source.name, item.links.original)}
            </a>
            <span> · {hostOf(item.links.original)}</span>
          </p>

          {item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 lg:hidden">
              {item.tags.slice(0, 6).map((t) => (
                <Link key={t} to={`/all?tag=${encodeURIComponent(t)}`} className="chip">
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {item.story && <StoryFollowups story={item.story} currentId={item.id} />}

          {related.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-2 text-[14px] font-semibold text-ink">相关事件</h2>
              <ul className="divide-y divide-line-soft">
                {related.map((s) => (
                  <li key={s.publicId}>
                    <Link to={`/story/${s.publicId}`} className="block py-2.5 text-[14px] text-ink-2 hover:text-accent">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </ArticleLayout>

      {posterRequested && (
        <Suspense fallback={null}>
          <PosterSheet id={item.id} title={item.title} open={posterOpen} onClose={closePoster} />
        </Suspense>
      )}
      {toast && (
        <div role="status" className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[13px] text-bg shadow-[var(--shadow-pop)] lg:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}
