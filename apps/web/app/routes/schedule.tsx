import { SITE } from "@aihot/industry/site";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/schedule";
import { ScheduleCalendar } from "../features/schedule/ScheduleCalendar";
import { pageMeta } from "../lib/seo";
import { apiGet } from "../lib/api.server";
import type { GameItem, PlayerStatsData, StandingsData } from "../features/schedule/rocketsApi";

export async function loader({ request }: Route.LoaderArgs) {
  const [schedule, standings, players] = await Promise.all([
    apiGet<GameItem[]>("/api/site/rockets/schedule", { signal: request.signal }).catch(() => []),
    apiGet<StandingsData>("/api/site/rockets/standings", { signal: request.signal }).catch(() => null),
    apiGet<PlayerStatsData[]>("/api/site/rockets/players", { signal: request.signal }).catch(() => []),
  ]);
  return { schedule, standings, players };
}

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
  const { schedule, standings, players } = useLoaderData<typeof loader>();

  return (
    <div className="pb-10 pt-3 sm:pt-5">
      {/* 顶部标题与说明 */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-[22px] font-black tracking-tight text-ink sm:text-[26px] lg:text-3xl">
          赛程战绩
        </h1>
        <p className="mt-1 text-xs text-ink-3 sm:text-sm">
          休斯敦火箭 2026-27 赛季官方赛程战果与全队球员技术统计
        </p>
      </div>

      {/* 赛程日历主体：注入服务端数据，秒级直开 */}
      <ScheduleCalendar
        initialSchedule={schedule}
        initialStandings={standings}
        initialPlayers={players}
      />
    </div>
  );
}
