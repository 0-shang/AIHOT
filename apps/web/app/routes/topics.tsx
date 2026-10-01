import { Link, useLoaderData } from "react-router";
import { apiGet } from "../lib/api.server";
import { pageMeta } from "../lib/seo";

interface TopicSummary {
  slug: string;
  name: string;
  group: string;
  definition: string;
  total: number;
  recent: number;
  indexable: boolean;
  latestAt: string | null;
}

export async function loader({ request }: { request: Request }) {
  return apiGet<{ topics: TopicSummary[] }>("/api/site/topics", { signal: request.signal });
}

export function meta() {
  return pageMeta({
    title: "火箭主题专区",
    description: "按核心球员、战术深度、情报形态聚合的休斯敦火箭主题专区，持续汇集近期焦点报道与一手赛况。",
    path: "/topics",
    image: "/og/pages/topics.png",
  });
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}

const GROUPS = [
  { key: "player", name: "核心球员与教练", blurb: "按核心骨干追踪：杜兰特、申京、阿门·汤普森、乌度卡、谢泼德等" },
  { key: "field", name: "战术与高阶数据", blurb: "按战术体系与效率深挖：百回合净胜分、进攻空间、防守换防……" },
  { key: "genre", name: "情报形态与专区", blurb: "按内容类型分类：战报总结、交易签约、名记流言、赛后原声……" },
] as const;

export default function TopicsPage() {
  const { topics } = useLoaderData<typeof loader>();
  return (
    <div className="pb-10">
      <header className="pb-2 pt-5 lg:pt-1">
        <h1 className="text-[24px] font-bold leading-[1.3] text-ink">休斯敦火箭 主题专区</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
          按核心球员、战术体系、情报类型持续汇集休斯敦火箭近期焦点报道。
        </p>
      </header>
      {GROUPS.map((g) => (
        <section key={g.key} aria-labelledby={`topics-${g.key}`} className="pt-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h2 id={`topics-${g.key}`} className="text-[15px] font-bold text-ink">
              {g.name}
            </h2>
            <p className="text-[12px] text-ink-4">{g.blurb}</p>
          </div>
          <ul className="mt-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topics
              .filter((t) => t.group === g.key)
              .map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/topics/${t.slug}`}
                    prefetch="intent"
                    aria-label={`查看${t.name}相关精选文章`}
                    className="card card-hover group flex h-full flex-col px-5 py-[18px]"
                  >
                    <span className="text-[15px] font-bold text-ink transition-colors group-hover:text-accent">{t.name}</span>
                    <span className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-[1.7] text-ink-3">{t.definition}</span>
                    <span className="mono mt-3 text-[11.5px] text-accent">
                      查看 {t.total} 条精选 <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
