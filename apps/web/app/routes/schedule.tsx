import { SITE } from "@aihot/industry/site";
import { ScheduleCalendar } from "../features/schedule/ScheduleCalendar";
import { pageMeta } from "../lib/seo";

export function headers() {
  return { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" };
}

export function meta() {
  return pageMeta({
    title: "火箭赛程战绩 · 比赛日程、战果与球员技术统计",
    description: `${SITE.name} 独家赛程战绩：休斯敦火箭 2026-27 赛季全部赛程安排、比赛战果、实时比分与球员技术统计。`,
    path: "/schedule",
  });
}

export default function SchedulePage() {
  return (
    <div className="pb-8">
      {/* 顶部标题与说明 */}
      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold tracking-tight text-ink lg:text-3xl">
          赛程战绩
        </h1>
        <p className="mt-1 text-sm text-ink-3">
          休斯敦火箭 2026-27 赛季官方赛程战果与全队球员技术统计
        </p>
      </div>

      {/* 赛程日历主体 */}
      <ScheduleCalendar />
    </div>
  );
}
