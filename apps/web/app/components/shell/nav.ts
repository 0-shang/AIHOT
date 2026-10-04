// Site navigation, one place for the desktop sidebar, the mobile tab bar and the mobile "更多" page.
import { withSubject } from "@aihot/industry/site";
import { FEATURES } from "@aihot/industry/features";
import type { ReactNode } from "react";
import {
  IconApps, IconBolt, IconBookmark, IconCalendar, IconChart, IconDoc, IconFlame, IconGrid, IconHeart, IconHistory, IconList, IconMessage, IconPlug,
} from "../icons";

export interface NavItem {
  to: string;
  label: string;
  icon: (p: { size?: number }) => ReactNode;
  /** Match the path exactly (the home page). */
  end?: boolean;
  /** Shows the unread dot while the changelog has news. */
  changelog?: boolean;
}

export const SIDEBAR: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "内容",
    items: [
      { to: "/all", label: `全部${withSubject("动态")}`, icon: IconList },
      { to: "/schedule", label: "赛程日历", icon: IconCalendar },
      { to: "/hot", label: "热点榜", icon: IconFlame },
      { to: "/starred", label: "收藏", icon: IconBookmark },
    ],
  },
  // The optional AI-only modules (industry/features.ts).
  ...(FEATURES.leaderboard || FEATURES.codexResetMonitor
    ? [
        {
          title: "模型",
          items: [
            ...(FEATURES.leaderboard ? [{ to: "/leaderboard", label: "模型榜", icon: IconChart }] : []),
            ...(FEATURES.codexResetMonitor ? [{ to: "/codex-reset", label: "Tibo重置监控", icon: IconHistory }] : []),
          ],
        },
      ]
    : []),
  {
    title: "关于",
    items: [
      { to: "/about", label: "关于", icon: IconHeart },
      { to: "/feedback", label: "意见反馈", icon: IconMessage },
    ],
  },
];

export const TABBAR: NavItem[] = [
  { to: "/all", label: "动态", icon: IconList },
  { to: "/hot", label: "热点", icon: IconFlame },
  { to: "/schedule", label: "赛程", icon: IconCalendar },
  { to: "/more", label: "更多", icon: IconApps, changelog: false },
];

/** Pages reached from the mobile "更多" tab keep that tab highlighted. */
export const MORE_PATHS = ["/more", "/starred", "/about", "/feedback", "/terms", "/privacy"];

export function tabIsActive(item: NavItem, pathname: string): boolean {
  if (item.end) return pathname === item.to;
  if (item.to === "/more") return MORE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
