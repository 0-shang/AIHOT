import { SITE } from "@aihot/industry/site";
import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router";
import type { Route } from "./+types/videos";
import type { PoolResponse } from "@aihot/contracts/site";
import { loadOr404, queryString } from "../lib/api.server";
import { pageMeta } from "../lib/seo";
import { DayList, Pagination } from "../features/feed/DayList";
import { EmptyState } from "../components/ui/Page";
import { IconVideo } from "../components/icons";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim().slice(0, 200) || null;
  const page = Math.min(Math.max(Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1, 1), 50);

  const data = await loadOr404<PoolResponse>(
    `/api/site/pool${queryString({ category: "videos", q, page: page > 1 ? page : null })}`,
    { signal: request.signal, busyRedirect: q ? "/all/search-busy" : undefined }
  );
  return { data };
}

export function meta() {
  return pageMeta({
    title: "火箭视频专栏 · 比赛集锦与更衣室采访",
    description: `${SITE.name} 火箭视频专栏：收录休斯敦火箭比赛精彩集锦、赛后采访原声、战术录像剪辑。`,
    path: "/videos",
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
  return s ? `/videos?${s}` : "/videos";
}

export default function VideosPage() {
  const { data } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const navigation = useNavigation();
  const busy = navigation.state === "loading" && navigation.location?.pathname === "/videos";

  return (
    <div className="pb-10">
      <div className="py-4 lg:py-6 border-b border-line-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-black text-ink lg:text-3xl lg:tracking-tight">
              休斯敦火箭精选视频
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-3">
              比赛高清集锦、赛后将帅新闻发布会原声录像与战术复盘切片
            </p>
          </div>
          <div className="text-[13px] text-ink-4">
            共收录 <span className="font-bold text-accent num">{data.total}</span> 条视频
          </div>
        </div>
      </div>

      <div className={`mt-6 transition-opacity duration-200 ${busy ? "opacity-50" : ""}`}>
        {data.items.length === 0 ? (
          <div className="card mt-4 p-8 text-center">
            <EmptyState title="暂时没有视频">
              正在同步最新精彩视频，请稍后再试。
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
