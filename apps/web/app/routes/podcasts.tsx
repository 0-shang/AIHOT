import { SITE } from "@aihot/industry/site";
import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router";
import type { Route } from "./+types/podcasts";
import type { PoolResponse } from "@aihot/contracts/site";
import { loadOr404, queryString } from "../lib/api.server";
import { pageMeta } from "../lib/seo";
import { DayList, Pagination } from "../features/feed/DayList";
import { EmptyState } from "../components/ui/Page";
import { IconPodcast, IconSearch } from "../components/icons";
import { UnderlineTabs } from "../components/ui/Tabs";

const PODCAST_SHOWS = [
  { key: "all", label: "全部播客", source: null },
  { key: "Locked On Rockets", label: "Locked On Rockets", source: "rss-podcast-lockedon" },
  { key: "Rockets LaunchPod", label: "LaunchPod", source: "rss-podcast-launchpod" },
  { key: "Rocket Fuel", label: "Rocket Fuel", source: "rss-podcast-rocketfuel" },
  { key: "Rockets Daily", label: "Rockets Daily", source: "rss-podcast-rocketsdaily" },
  { key: "SportsTalk 790", label: "SportsTalk 790", source: "rss-podcast-sportstalk790%" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim().slice(0, 200) || null;
  const show = url.searchParams.get("show")?.trim() || null;
  const page = Math.min(Math.max(Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1, 1), 50);

  const matched = PODCAST_SHOWS.find((s) => s.key === show || s.label === show);
  const source = matched?.source ?? null;

  const data = await loadOr404<PoolResponse>(
    `/api/site/pool${queryString({ category: "podcasts", source, q, page: page > 1 ? page : null })}`,
    { signal: request.signal, busyRedirect: q ? "/all/search-busy" : undefined }
  );

  // 防御性过滤：确保仅包含专属火箭播客节目，杜绝市政新闻或非体育内容
  if (data && Array.isArray(data.items)) {
    data.items = data.items.filter((item: any) => {
      const title = item.title || "";
      const summary = item.summary || "";
      if (/ICE|执法事件|去世多年|Ken Paxton|参议员竞选/i.test(`${title} ${summary}`)) return false;
      const srcId = item.source?.id || "";
      if (srcId && !srcId.startsWith("rss-podcast-") && srcId !== "podcasts") return false;
      return true;
    });
  }

  return { data, currentShow: show ?? "all" };
}

export function meta() {
  return pageMeta({
    title: "火箭播客专区 · 每日电台与赛后复盘",
    description: `${SITE.name} 独家火箭播客专区：聚合 Locked On Rockets、LaunchPod、Rocket Fuel、Rockets Daily 与 SportsTalk 790 等权威随队电台。`,
    path: "/podcasts",
  });
}

export function headers() {
  return { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=120" };
}

function pageHref(params: URLSearchParams, page: number) {
  const sp = new URLSearchParams(params);
  if (page <= 1) sp.delete("page");
  else sp.set("page", String(page));
  const s = sp.toString();
  return s ? `/podcasts?${s}` : "/podcasts";
}

export default function PodcastsPage() {
  const { data, currentShow } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const navigation = useNavigation();
  const busy = navigation.state === "loading" && navigation.location?.pathname === "/podcasts";

  const showHref = (showKey: string) => {
    const sp = new URLSearchParams(params);
    sp.delete("page");
    if (showKey === "all") sp.delete("show");
    else sp.set("show", showKey);
    const s = sp.toString();
    return s ? `/podcasts?${s}` : "/podcasts";
  };

  const podcastTabItems = PODCAST_SHOWS.map((s) => ({
    key: s.key,
    label: s.label,
    to: showHref(s.key),
    prefetch: "intent" as const,
  }));

  return (
    <div className="pb-10">
      {/* Header Banner */}
      <div className="py-4 lg:py-6 border-b border-line-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-black text-ink lg:text-3xl lg:tracking-tight">
              休斯敦火箭播客
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-3">
              实时收听 Locked On Rockets、LaunchPod、Rocket Fuel 等原声单集与深度复盘
            </p>
          </div>
          <div className="text-[13px] text-ink-4">
            共收录 <span className="font-bold text-accent num">{data.total}</span> 期节目
          </div>
        </div>

        {/* Shows filter tabs (Desktop) */}
        <div className="mt-5 hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PODCAST_SHOWS.map((s) => {
            const active = currentShow === s.key;
            return (
              <Link
                key={s.key}
                to={showHref(s.key)}
                className={`inline-flex shrink-0 items-center rounded-full px-3.5 py-1 text-[12.5px] font-bold transition-all ${
                  active
                    ? "bg-[#CE1141] text-white shadow-sm ring-2 ring-[#CE1141]/25"
                    : "border border-line-strong bg-surface text-ink-2 hover:border-[#CE1141]/50 hover:text-[#CE1141]"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Shows filter tabs (Mobile Sticky Bar) */}
      <div className="lg:hidden sticky top-0 z-30 -mx-4 px-4 pt-3 pb-2.5 bg-surface/95 backdrop-blur-md border-b border-line-soft shadow-xs transition-colors">
        <UnderlineTabs items={podcastTabItems} active={currentShow} layoutId="podcasts-mobile" className="w-full" />
      </div>

      {/* Episodes Stream */}
      <div className={`mt-6 transition-opacity duration-200 ${busy ? "opacity-50" : ""}`}>
        {data.items.length === 0 ? (
          <div className="card mt-4 p-8 text-center">
            <EmptyState title="暂时没有单集">
              正在同步最新播客音频源，请稍后再试。
            </EmptyState>
          </div>
        ) : (
          <DayList items={data.items} showTags={true} />
        )}
      </div>

      <Pagination page={data.page} pageCount={data.pageCount} href={(p) => pageHref(params, p)} />
    </div>
  );
}
