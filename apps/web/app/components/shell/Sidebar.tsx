import { SITE } from "@aihot/industry/site";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Wordmark } from "../Logo";
import { useChangelogSeen } from "../../lib/local-state";
import { SIDEBAR, tabIsActive, type NavItem } from "./nav";
import { ThemeSwitch } from "./ThemeSwitch";

/** True while the changelog has an entry newer than the one this reader last opened. */
export function useChangelogDot(latestVersion: string | null): boolean {
  const seen = useChangelogSeen();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !latestVersion) return false;
  return !seen || seen < latestVersion;
}

function SideLink({ item, dot }: { item: NavItem; dot: boolean }) {
  const { pathname } = useLocation();
  // Weekly and monthly reports belong to the daily report entry, as the phone tab bar has it.
  const isActive = tabIsActive(item, pathname);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      prefetch="intent"
      aria-current={isActive ? "page" : undefined}
      className={`flex h-10 items-center gap-2.5 rounded-control px-2.5 text-[14px] transition-all duration-150 ${
        isActive
          ? "bg-gradient-to-r from-[#CE1141]/15 via-[#CE1141]/5 to-transparent border-l-[3px] border-[#CE1141] font-bold text-[#CE1141] dark:text-[#ff3864]"
          : "font-medium text-ink-3 hover:bg-bg-sunk hover:text-ink"
      }`}
    >
      <span className={`flex w-[22px] shrink-0 justify-center ${isActive ? "text-[#CE1141] dark:text-[#ff3864]" : ""}`}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 truncate">{item.label}</span>
      {dot && item.changelog && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-hot" aria-label="有新的更新" />}
    </Link>
  );
}

export function Sidebar({ changelogVersion }: { changelogVersion: string | null }) {
  const dot = useChangelogDot(changelogVersion);
  return (
    <aside className="sticky top-0 hidden h-dvh w-[190px] shrink-0 flex-col border-r border-line bg-sidebar px-3 pb-3.5 pt-5 lg:flex">
      <Link to="/" className="mb-4 flex h-[50px] items-center px-1 text-ink" aria-label={`${SITE.name} 首页`}>
        <Wordmark size={21} />
      </Link>
      <nav className="-mx-1 flex-1 overflow-y-auto px-1" aria-label="主导航">
        {SIDEBAR.map((section) => (
          <div key={section.title}>
            <div className="px-2.5 pb-1 pt-3 text-[11px] font-semibold text-ink-4">{section.title}</div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SideLink key={item.to} item={item} dot={dot} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 赛程快速预告看板卡片 */}
      <Link
        to="/schedule"
        className="group mb-2 mt-auto block rounded-xl border border-line-soft bg-gradient-to-br from-bg-sunk/60 to-surface p-2.5 shadow-2xs transition-all hover:border-[#CE1141]/60 hover:shadow-md"
      >
        <div className="flex items-center justify-between text-[10px] font-bold text-ink-4">
          <span className="flex items-center gap-1 text-[#CE1141]">
            <span className="size-1.5 animate-ping rounded-full bg-[#CE1141]" />
            焦点赛事
          </span>
          <span className="font-mono text-ink-3">10.09 20:00</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[12px] font-black text-ink">
          <span>HOU 火箭</span>
          <span className="font-sans text-[10px] font-semibold text-ink-4">VS</span>
          <span>DAL 独行侠</span>
        </div>
        <div className="mt-0.5 text-[9.5px] font-bold text-amber-600 dark:text-amber-400">
          🇲🇴 NBA 澳门赛 G1
        </div>
      </Link>

      <div className="space-y-2 px-1 pt-1">
        <ThemeSwitch className="mx-1" />
        {SITE.icp && (
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="block px-2 text-[10px] text-ink-4 hover:text-ink-3">
            {SITE.icp}
          </a>
        )}
      </div>
    </aside>
  );
}
