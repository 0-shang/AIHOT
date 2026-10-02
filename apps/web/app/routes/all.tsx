import { SITE, withSubject } from "@aihot/industry/site";
import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router";
import type { Route } from "./+types/all";
import type { PoolResponse } from "@aihot/contracts/site";
import { isCategoryKey, isChannelKey } from "@aihot/contracts/taxonomy";
import { loadOr404, queryString } from "../lib/api.server";
import { listPath, pageMeta } from "../lib/seo";
import { CategoryTabs, SearchField } from "../features/feed/Filters";
import { PillTabs } from "../components/ui/Tabs";
import { DayList, Pagination } from "../features/feed/DayList";
import { YouTubeVideoGrid } from "../features/feed/YouTubeVideoGrid";
import { EmptyState } from "../components/ui/Page";
import { RingMark } from "../components/Logo";

const BEAT_REPORTERS = [
  { key: "all", label: "全部" },
  { key: "Feigen", label: "Jonathan Feigen" },
  { key: "Kelly Iko", label: "Kelly Iko" },
  { key: "Danielle Lerner", label: "Danielle Lerner" },
  { key: "Ben DuBose", label: "Ben DuBose" },
  { key: "Jackson Gatlin", label: "Jackson Gatlin" },
  { key: "Adam Spolane", label: "Adam Spolane" },
  { key: "Salman Ali", label: "Salman Ali" },
  { key: "Lachard Binkley", label: "Lachard Binkley" },
  { key: "Michael Shapiro", label: "Michael Shapiro" },
  { key: "Matt Thomas", label: "Matt Thomas" },
  { key: "Bradeaux", label: "Bradeaux" },
  { key: "ClutchFans", label: "ClutchFans" },
  { key: "Houston Rockets", label: "火箭官方" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const channelParam = url.searchParams.get("channel") ?? "all";
  const categoryParam = url.searchParams.get("category");
  const channel = isChannelKey(channelParam) ? channelParam : "all";
  const tag = url.searchParams.get("tag")?.trim() || null;
  const q = url.searchParams.get("q")?.trim().slice(0, 200) || null;
  const reporter = url.searchParams.get("reporter")?.trim() || null;
  const category = categoryParam && isCategoryKey(categoryParam) ? categoryParam : null;
  const tab = url.searchParams.get("tab") === "relevance" ? "relevance" : null;
  // Legacy deep-paging parameters (deep, anchorAt) still open a normal page.
  const page = Math.min(Math.max(Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1, 1), 50);
  const data = await loadOr404<PoolResponse>(
    `/api/site/pool${queryString({ channel: channel === "all" ? null : channel, category, tag, q, tab, reporter, page: page > 1 ? page : null })}`,
    { signal: request.signal, busyRedirect: "/all/search-busy" },
  );
  return { data, currentReporter: reporter };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const f = loaderData?.data.filters;
  const q = f?.q;
  const page = loaderData?.data.page ?? 1;
  return pageMeta({
    title: q ? `搜索：${q}` : `全部${withSubject("动态")}`,
    description: `${SITE.name} 收录的全部${withSubject("动态")}，可按类别与标签筛选，支持中英文搜索。`,
    path: listPath("/all", { channel: f && f.channel !== "all" ? f.channel : null, category: f?.category, tag: f?.tag, q, tab: f?.tab === "relevance" ? "relevance" : null, page: page > 1 ? page : null }),
    noindex: !!q,
  });
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=30" };
}

function pageHref(params: URLSearchParams, page: number) {
  const sp = new URLSearchParams(params);
  sp.delete("deep");
  sp.delete("anchorAt");
  sp.delete("search");
  if (page <= 1) sp.delete("page");
  else sp.set("page", String(page));
  const s = sp.toString();
  return s ? `/all?${s}` : "/all";
}

export default function AllPage() {
  const { data } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const navigation = useNavigation();
  const f = data.filters;
  const busy = navigation.state === "loading" && navigation.location?.pathname === "/all";
  const keep = { channel: f.channel === "all" ? null : f.channel, category: f.category, reporter: params.get("reporter") || null };
  const activeReporter = params.get("reporter") ?? "all";
  const searchTabHref = (tab: "time" | "relevance") => {
    const sp = new URLSearchParams(params);
    sp.delete("page");
    if (tab === "relevance") sp.set("tab", "relevance");
    else sp.delete("tab");
    return `/all?${sp}`;
  };
  const reporterHref = (repKey: string) => {
    const sp = new URLSearchParams(params);
    sp.delete("page");
    if (repKey === "all") sp.delete("reporter");
    else sp.set("reporter", repKey);
    const s = sp.toString();
    return s ? `/all?${s}` : "/all";
  };
  const title = f.q ? `搜索“${f.q}”` : f.tag ? `#${f.tag}` : null;
  const updated = new Date(data.freshness).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Shanghai" });

  return (
    <div className="pb-6">

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex items-baseline justify-between">
          <h1 className="text-[26px] font-black tracking-tight text-ink lg:text-3xl">{title ?? "休斯敦火箭 前沿情报"}</h1>
          {!f.q && (
            <span className="text-[13px] text-ink-4">
              今日 <span className="num font-bold text-accent">{data.todayCount}</span> 条
            </span>
          )}
        </div>
        <div className="mb-4 mt-4 flex flex-wrap items-center justify-between gap-3">
          <CategoryTabs base="/all" category={f.category} channel={f.channel} layoutId="all-cat-desk" className="min-w-0" />
          <SearchField variant="track" defaultValue={f.q ?? ""} keep={keep} />
        </div>
        {f.category === "beat_tweets" && (
          <div className="-mt-1 mb-5 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            <span className="shrink-0 text-[12.5px] font-bold text-ink-3">随队记者:</span>
            {BEAT_REPORTERS.map((r) => {
              const isActive = activeReporter === r.key;
              return (
                <Link
                  key={r.key}
                  to={reporterHref(r.key)}
                  className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12.5px] font-medium transition-all ${
                    isActive
                      ? "bg-[#CE1141] text-white shadow-sm ring-2 ring-[#CE1141]/30 font-bold"
                      : "border border-line-strong bg-surface text-ink-2 hover:border-[#CE1141]/50 hover:text-[#CE1141] hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  {r.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Phones: title with today's count, the search bar, then the same filter row */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between pb-3 pt-3">
          <h1 className="text-[22px] font-black text-ink">{title ?? "休斯敦火箭 前沿情报"}</h1>
          {!f.q && (
            <span className="text-[12.5px] text-ink-4">
              今日 <span className="num">{data.todayCount}</span> 条
            </span>
          )}
        </div>
        <SearchField variant="bar" defaultValue={f.q ?? ""} keep={keep} autoFocus={params.get("search") === "1"} />
        <div className="-mx-4 mt-3 border-b border-line-soft px-4 pb-3">
          <CategoryTabs base="/all" category={f.category} channel={f.channel} layoutId="all-cat-mobile" size="sm" className="min-w-0" />
        </div>
        {f.category === "beat_tweets" && (
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="shrink-0 text-[11.5px] font-bold text-ink-3">记者:</span>
            {BEAT_REPORTERS.map((r) => {
              const isActive = activeReporter === r.key;
              return (
                <Link
                  key={r.key}
                  to={reporterHref(r.key)}
                  className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium transition-all ${
                    isActive
                      ? "bg-[#CE1141] text-white shadow-sm ring-2 ring-[#CE1141]/30 font-bold"
                      : "border border-line-strong bg-surface text-ink-2 hover:border-[#CE1141]/50 hover:text-[#CE1141]"
                  }`}
                >
                  {r.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {f.q && (
        <div className="mb-3 mt-3 flex flex-wrap items-center justify-between gap-2 lg:mt-0">
          <PillTabs
            size="xs"
            layoutId="all-search-sort"
            label="搜索排序"
            active={f.tab}
            items={(["time", "relevance"] as const).map((t) => ({ key: t, label: t === "time" ? "最新（标题与摘要）" : "全文相关", to: searchTabHref(t) }))}
          />
          <span className="text-[12px] text-ink-4">
            找到 <span className="num">{data.total >= 2000 ? "2000+" : data.total}</span> 条 · 更新于 <span className="num">{updated}</span>
          </span>
        </div>
      )}

      <div className={`transition-opacity duration-200 ${busy ? "opacity-50" : ""}`}>
        {data.items.length === 0 ? (
          <div className="mt-2 lg:card">
            <EmptyState
              title="没有找到相关内容"
              action={
                f.q && f.tab === "time" ? (
                  <Link to={searchTabHref("relevance")} className="text-[13px] font-medium text-accent hover:underline">
                    试试“全文相关”，连正文一起搜
                  </Link>
                ) : undefined
              }
            >
              {f.q ? "换个说法，或者去掉筛选再试。" : "这个筛选下暂时没有内容。"}
            </EmptyState>
          </div>
        ) : f.category === "videos" ? (
          <YouTubeVideoGrid items={data.items} />
        ) : (
          <DayList items={data.items} todayCount={f.q ? null : data.todayCount} showTags />
        )}
      </div>
      <Pagination page={data.page} pageCount={data.pageCount} href={(p) => pageHref(params, p)} />
      {data.page >= 50 && <p className="mt-4 text-center text-[12px] text-ink-4">最多提供 50 页，更早的内容请使用搜索或主题页。</p>}
    </div>
  );
}

export function SearchBusy() {
  return (
    <div className="mx-auto max-w-sm py-24 text-center">
      <RingMark className="mx-auto mb-5 size-10 text-accent" spinning />
      <h1 className="text-[20px] font-bold text-ink">搜索有点忙</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-3">现在搜索的人比较多，请稍等几秒再试。列表浏览不受影响。</p>
      <div className="mt-6 flex justify-center gap-2.5">
        <Link to="/all" className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-[13.5px] font-medium text-accent-contrast hover:bg-accent-ink">浏览全部动态</Link>
        <Link to="/" className="inline-flex h-9 items-center rounded-full border border-line-strong bg-surface px-4 text-[13.5px] text-ink-2 hover:border-ink-4">回到精选</Link>
      </div>
    </div>
  );
}
