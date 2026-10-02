import { t as __exportAll } from "./assets/rolldown-runtime-D7D4PA-g.js";
import { t as entry_server_node_exports } from "./assets/framework-DvgSLGWb.js";
import { A as IconMoon, C as IconHistory, D as IconMenu, E as IconList, F as ABOUT, I as SITE, L as withSubject, M as IconShare, N as IconSun, O as IconMessage, P as IconUsers, S as IconHeart, T as IconInfo, _ as IconDoc, a as IconArrowRight, b as IconFlame, c as IconBookmark, d as IconCheck, f as IconChevronDown, g as IconCopy, h as IconClose, i as IconArrowLeft, j as IconSearch, k as IconMonitor, l as IconCalendar, m as IconClock, n as Presence, o as IconArrowUp, p as IconChevronRight, r as IconApps, s as IconArrowUpRight, t as Collapse, u as IconChart, v as IconDownload, w as IconImage, x as IconGrid, y as IconExternal } from "./assets/Presence-HLsYgPy3.js";
import { Form, Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, data, isRouteErrorResponse, redirect, useFetcher, useLoaderData, useLocation, useNavigate, useNavigation, useRevalidator, useRouteError, useRouteLoaderData, useSearchParams } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Fragment as Fragment$1, Suspense, forwardRef, lazy, memo, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
//#region app/lib/seo.ts
/**
* The site's address: SITE_URL while rendering on the server (what crawlers and share previews read),
* the page's own origin in the browser.
*/
function siteUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	return (process.env.SITE_URL || SITE.defaultUrl).replace(/\/+$/, "");
}
var HOME_TITLE = SITE.homeTitle;
var SITE_DESCRIPTION = SITE.description;
/**
* A list page's own address (canonical, og:url) from the filters it applied: tracking and unknown
* parameters (`?from=timeline`, `utm_*`) never become part of it. The page caches keep one copy across
* such parameters, so the address in that copy must not depend on them either.
*/
function listPath(path, params) {
	const sp = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) if (v !== null && v !== void 0 && v !== "") sp.set(k, String(v));
	const qs = sp.toString();
	return qs ? `${path}?${qs}` : path;
}
/** "Title · Site". */
function titled(title) {
	return `${title} · ${SITE.name}`;
}
function pageMeta(input) {
	const base = siteUrl();
	const title = input.title ? input.rawTitle ? input.title : titled(input.title) : HOME_TITLE;
	const description = input.description ?? SITE_DESCRIPTION;
	const url = `${base}${input.path}`;
	const image = input.image ? input.image.startsWith("http") ? input.image : `${base}${input.image}` : `${base}/og/site.png`;
	const tags = [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			tagName: "link",
			rel: "canonical",
			href: url
		},
		{
			property: "og:site_name",
			content: SITE.name
		},
		{
			property: "og:type",
			content: input.type ?? "website"
		},
		{
			property: "og:title",
			content: input.title ?? HOME_TITLE
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: url
		},
		{
			property: "og:image",
			content: image
		},
		{
			property: "og:image:width",
			content: "1200"
		},
		{
			property: "og:image:height",
			content: "630"
		},
		{
			property: "og:locale",
			content: SITE.locale.replace("-", "_")
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: input.title ?? HOME_TITLE
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: image
		}
	];
	if (input.noindex) tags.push({
		name: "robots",
		content: input.nofollow ? "noindex, nofollow" : "noindex, follow"
	});
	if (input.jsonLd) tags.push({ "script:ld+json": input.jsonLd });
	return tags;
}
function organizationLd() {
	const base = siteUrl();
	const founder = SITE.organization.founder;
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SITE.organization.name,
		url: base,
		logo: `${base}/icon.png`,
		...founder ? { founder: {
			"@type": "Person",
			name: founder.name,
			...founder.description ? { description: founder.description } : {},
			...founder.url ? { sameAs: [founder.url] } : {}
		} } : {}
	};
}
function breadcrumbLd(items) {
	const base = siteUrl();
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: `${base}${it.path}`
		}))
	};
}
//#endregion
//#region app/components/Logo.tsx
function Wordmark({ size = 22, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `inline-flex items-center gap-2.5 select-none ${className}`,
		"aria-label": SITE.name,
		role: "img",
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative flex size-[32px] shrink-0 items-center justify-center rounded-xl bg-[#CE1141] text-white shadow-xs",
			children: /* @__PURE__ */ jsxs("svg", {
				viewBox: "0 0 24 24",
				className: "size-[20px]",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "9"
					}),
					/* @__PURE__ */ jsx("path", { d: "M12 3v18" }),
					/* @__PURE__ */ jsx("path", { d: "M3 12h18" }),
					/* @__PURE__ */ jsx("path", { d: "M5.5 5.5c3.8 3.5 3.8 9.5 0 13" }),
					/* @__PURE__ */ jsx("path", { d: "M18.5 5.5c-3.8 3.5-3.8 9.5 0 13" })
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col text-left leading-none",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-baseline gap-1",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-black tracking-tight text-ink",
					style: { fontSize: size * .95 },
					children: "Rockets"
				}), /* @__PURE__ */ jsx("span", {
					className: "font-black italic text-[#CE1141] tracking-tighter",
					style: { fontSize: size * .95 },
					children: "HOT"
				})]
			}), /* @__PURE__ */ jsx("span", {
				className: "mt-0.5 text-[9.5px] font-semibold tracking-[0.15em] text-ink-4",
				children: "休斯敦篮球前线"
			})]
		})]
	});
}
/** A ring with a dot; spinning, it is the loader. */
function RingMark({ className = "", spinning = false }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx("g", {
			style: spinning ? {
				transformOrigin: "12px 12px",
				animation: "spin-slow 1.1s linear infinite"
			} : void 0,
			children: /* @__PURE__ */ jsx("circle", {
				cx: "12",
				cy: "12",
				r: "9",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.6",
				strokeLinecap: "round",
				strokeDasharray: "42 15"
			})
		}), /* @__PURE__ */ jsx("circle", {
			cx: "12",
			cy: "12",
			r: "2.6",
			fill: "#CE1141"
		})]
	});
}
//#endregion
//#region ../../packages/contracts/src/time.ts
var OFFSET_MS = 288e5;
/** YYYY-MM-DD of the instant in Beijing time. */
function beijingDate(instant) {
	return new Date(new Date(instant).getTime() + OFFSET_MS).toISOString().slice(0, 10);
}
/** HH:mm of the instant in Beijing time. */
function beijingTime(instant) {
	return new Date(new Date(instant).getTime() + OFFSET_MS).toISOString().slice(11, 16);
}
function addDays(date, days) {
	const t = Date.parse(`${date}T00:00:00Z`) + days * 864e5;
	return new Date(t).toISOString().slice(0, 10);
}
var WEEKDAYS$2 = [
	"星期日",
	"星期一",
	"星期二",
	"星期三",
	"星期四",
	"星期五",
	"星期六"
];
function beijingWeekday(date) {
	return WEEKDAYS$2[(/* @__PURE__ */ new Date(`${date}T00:00:00Z`)).getUTCDay()];
}
//#endregion
//#region app/lib/local-state.ts
var KEYS = {
	starred: "aihot-starred-items",
	read: "aihot-read-items",
	theme: "aihot-theme",
	changelogSeen: "aihot-changelog-seen-version",
	feedbackDraft: "aihot-feedback-draft-v1"
};
var READ_LIMIT = 5e3;
var ID_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;
function storage(kind) {
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}
function readRaw(key, kind = "local") {
	try {
		return storage(kind)?.getItem(key) ?? null;
	} catch {
		return null;
	}
}
function writeRaw(key, value, kind = "local") {
	try {
		const s = storage(kind);
		if (!s) return false;
		if (value === null) s.removeItem(key);
		else s.setItem(key, value);
		return true;
	} catch {
		return false;
	}
}
var listeners$1 = /* @__PURE__ */ new Map();
var subscribers = 0;
function emit$1(key) {
	for (const [subscribedKey, callbacks] of listeners$1) if (key === void 0 || key === subscribedKey) for (const callback of callbacks) callback();
}
function onStorage(event) {
	if (event.storageArea && event.storageArea !== storage("local")) return;
	if (event.key === null) cache.clear();
	else cache.delete(event.key);
	emit$1(event.key ?? void 0);
}
function subscribeKey(key) {
	return (listener) => {
		let callbacks = listeners$1.get(key);
		if (!callbacks) listeners$1.set(key, callbacks = /* @__PURE__ */ new Set());
		callbacks.add(listener);
		if (subscribers++ === 0) window.addEventListener("storage", onStorage);
		return () => {
			callbacks.delete(listener);
			if (callbacks.size === 0) listeners$1.delete(key);
			if (--subscribers === 0) window.removeEventListener("storage", onStorage);
		};
	};
}
var subscribeStarred = subscribeKey(KEYS.starred);
var subscribeRead = subscribeKey(KEYS.read);
var subscribeTheme = subscribeKey(KEYS.theme);
var subscribeChangelog = subscribeKey(KEYS.changelogSeen);
var cache = /* @__PURE__ */ new Map();
function cached(key, compute) {
	if (!cache.has(key)) cache.set(key, compute());
	return cache.get(key);
}
function invalidate(key) {
	cache.delete(key);
	emit$1(key);
}
function isStarredItem(v) {
	if (!v || typeof v !== "object") return false;
	const o = v;
	return typeof o.id === "string" && ID_PATTERN.test(o.id) && typeof o.title === "string";
}
/** Imported and already stored dates must be representable in the page's display timezone. */
function isDisplayableDate(value) {
	if (typeof value !== "string") return false;
	try {
		beijingDate(value);
		return true;
	} catch {
		return false;
	}
}
function normalizeStarred(v) {
	return {
		id: String(v.id),
		title: String(v.title),
		summary: typeof v.summary === "string" ? v.summary : null,
		sourceName: typeof v.sourceName === "string" ? v.sourceName : "",
		savedAt: isDisplayableDate(v.savedAt) ? v.savedAt : (/* @__PURE__ */ new Date()).toISOString(),
		publishedAt: isDisplayableDate(v.publishedAt) ? v.publishedAt : null,
		score: typeof v.score === "number" ? v.score : null,
		aiSelected: v.aiSelected === true
	};
}
function getStarred() {
	return cached(KEYS.starred, () => {
		const raw = readRaw(KEYS.starred);
		if (!raw) return [];
		try {
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) return [];
			return parsed.filter(isStarredItem).map((v) => normalizeStarred(v)).slice(0, 500);
		} catch {
			return [];
		}
	});
}
var starredSetCache = {
	items: null,
	ids: /* @__PURE__ */ new Set()
};
function isStarred(id) {
	const items = getStarred();
	if (starredSetCache.items !== items) {
		starredSetCache.items = items;
		starredSetCache.ids = new Set(items.map((item) => item.id));
	}
	return starredSetCache.ids.has(id);
}
function toggleStar(item) {
	const list = getStarred();
	const exists = list.some((s) => s.id === item.id);
	const next = exists ? list.filter((s) => s.id !== item.id) : [{
		...item,
		savedAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...list].slice(0, 500);
	writeRaw(KEYS.starred, JSON.stringify(next));
	invalidate(KEYS.starred);
	return !exists;
}
function removeStar(id) {
	writeRaw(KEYS.starred, JSON.stringify(getStarred().filter((s) => s.id !== id)));
	invalidate(KEYS.starred);
}
function getReadIds() {
	return cached(KEYS.read, () => {
		const raw = readRaw(KEYS.read);
		if (!raw) return [];
		try {
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string" && ID_PATTERN.test(v)).slice(0, READ_LIMIT) : [];
		} catch {
			return [];
		}
	});
}
var readSetCache = {
	ids: null,
	set: /* @__PURE__ */ new Set()
};
function getReadSet() {
	const ids = getReadIds();
	if (readSetCache.ids !== ids) {
		readSetCache.ids = ids;
		readSetCache.set = new Set(ids);
	}
	return readSetCache.set;
}
function markRead(id) {
	if (!ID_PATTERN.test(id)) return;
	const ids = getReadIds();
	if (ids[0] === id) return;
	const next = [id, ...ids.filter((v) => v !== id)].slice(0, READ_LIMIT);
	writeRaw(KEYS.read, JSON.stringify(next));
	invalidate(KEYS.read);
}
function getThemePreference() {
	const v = readRaw(KEYS.theme);
	if (v === "light" || v === "dark") return v;
	if (v === "\"light\"" || v === "\"dark\"") return JSON.parse(v);
	return null;
}
function setThemePreference(pref) {
	writeRaw(KEYS.theme, pref);
	invalidate(KEYS.theme);
}
function resolvedTheme(pref = getThemePreference()) {
	if (pref) return pref;
	try {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
/** Inline script run before paint so the first frame already has the reader's theme. */
var THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${KEYS.theme}');if(t==='"light"'||t==='"dark"')t=JSON.parse(t);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;
function getChangelogSeen() {
	const v = readRaw(KEYS.changelogSeen);
	return v && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ? v : null;
}
function setChangelogSeen(version) {
	writeRaw(KEYS.changelogSeen, version);
	invalidate(KEYS.changelogSeen);
}
function exportBundle() {
	const pref = getThemePreference();
	return {
		version: 1,
		starred: getStarred(),
		read: getReadIds(),
		theme: pref ?? "auto"
	};
}
/** Merge: existing stars are not overwritten, read ids are unioned, theme only if unset. */
function importBundle(text) {
	if (text.length > 2e6) throw new Error("文件过大（上限 2,000,000 字符）");
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		throw new Error("不是有效的 JSON 文件");
	}
	const d = data;
	if (!d || typeof d !== "object" || d.version !== 1) throw new Error("文件格式不对（需要 version: 1）");
	return mergeLocalData({
		starred: Array.isArray(d.starred) ? d.starred : [],
		read: Array.isArray(d.read) ? d.read : [],
		theme: d.theme ?? null
	});
}
function mergeLocalData(incoming) {
	const current = getStarred();
	const have = new Set(current.map((s) => s.id));
	const additions = [];
	let starredSkipped = 0;
	for (const s of incoming.starred) {
		if (!isStarredItem(s)) {
			starredSkipped++;
			continue;
		}
		if (have.has(s.id)) continue;
		have.add(s.id);
		additions.push(normalizeStarred(s));
	}
	const room = Math.max(0, 500 - current.length);
	const accepted = additions.slice(0, room);
	starredSkipped += additions.length - accepted.length;
	const mergedStarred = [...current, ...accepted].sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
	if (!writeRaw(KEYS.starred, JSON.stringify(mergedStarred))) throw new Error("浏览器存储已满或不可用，这次没有导入任何内容。");
	const readIds = getReadIds();
	const readHave = new Set(readIds);
	const readAdditions = [];
	let readSkipped = 0;
	for (const id of incoming.read) {
		if (typeof id !== "string" || !ID_PATTERN.test(id)) {
			readSkipped++;
			continue;
		}
		if (readHave.has(id)) continue;
		readHave.add(id);
		readAdditions.push(id);
	}
	const readRoom = Math.max(0, READ_LIMIT - readIds.length);
	readSkipped += Math.max(0, readAdditions.length - readRoom);
	const readFailed = !writeRaw(KEYS.read, JSON.stringify([...readIds, ...readAdditions.slice(0, readRoom)]));
	let themeApplied = false;
	if (!getThemePreference() && (incoming.theme === "light" || incoming.theme === "dark")) themeApplied = writeRaw(KEYS.theme, incoming.theme);
	cache.clear();
	emit$1();
	return {
		starredAdded: accepted.length,
		starredSkipped,
		readAdded: readFailed ? 0 : Math.min(readAdditions.length, readRoom),
		readSkipped,
		themeApplied,
		readFailed
	};
}
var EMPTY_STARRED = [];
var EMPTY_SET = /* @__PURE__ */ new Set();
function useStarred() {
	return useSyncExternalStore(subscribeStarred, getStarred, () => EMPTY_STARRED);
}
function useIsStarred(id) {
	return useSyncExternalStore(subscribeStarred, () => isStarred(id), () => false);
}
function useReadSet() {
	return useSyncExternalStore(subscribeRead, getReadSet, () => EMPTY_SET);
}
function useThemePreference() {
	return useSyncExternalStore(subscribeTheme, getThemePreference, () => null);
}
function useChangelogSeen() {
	return useSyncExternalStore(subscribeChangelog, getChangelogSeen, () => null);
}
//#endregion
//#region ../../industry/features.ts
var FEATURES = {
	/** 模型榜：汇总公开评测，按公开方法 v15 计算共识排名（/leaderboard）。做别的行业设为 false。 */
	leaderboard: false,
	/** Codex 重置监控：盯 OpenAI Codex 负责人在 X 上的额度重置公告（/codex-reset）。做别的行业设为 false。 */
	codexResetMonitor: false
};
//#endregion
//#region app/components/shell/nav.ts
var SIDEBAR = [
	{
		title: "内容",
		items: [
			{
				to: "/all",
				label: `全部${withSubject("动态")}`,
				icon: IconList
			},
			{
				to: "/schedule",
				label: "赛程日历",
				icon: IconCalendar
			},
			{
				to: "/hot",
				label: "热点榜",
				icon: IconFlame
			},
			{
				to: "/daily",
				label: withSubject("日报"),
				icon: IconDoc
			},
			{
				to: "/topics",
				label: "主题专区",
				icon: IconGrid
			},
			{
				to: "/starred",
				label: "收藏",
				icon: IconBookmark
			}
		]
	},
	...FEATURES.leaderboard || FEATURES.codexResetMonitor ? [{
		title: "模型",
		items: [...FEATURES.leaderboard ? [{
			to: "/leaderboard",
			label: "模型榜",
			icon: IconChart
		}] : [], ...FEATURES.codexResetMonitor ? [{
			to: "/codex-reset",
			label: "Tibo重置监控",
			icon: IconHistory
		}] : []]
	}] : [],
	{
		title: "关于",
		items: [{
			to: "/about",
			label: "关于",
			icon: IconHeart
		}, {
			to: "/feedback",
			label: "意见反馈",
			icon: IconMessage
		}]
	}
];
var TABBAR = [
	{
		to: "/all",
		label: "动态",
		icon: IconList
	},
	{
		to: "/schedule",
		label: "赛程",
		icon: IconCalendar
	},
	{
		to: "/daily",
		label: "日报",
		icon: IconDoc
	},
	{
		to: "/more",
		label: "更多",
		icon: IconApps,
		changelog: false
	}
];
/** Pages reached from the mobile "更多" tab keep that tab highlighted. */
var MORE_PATHS = [
	"/more",
	"/hot",
	"/topics",
	"/starred",
	"/about",
	"/feedback",
	"/terms",
	"/privacy"
];
function tabIsActive(item, pathname) {
	if (item.end) return pathname === item.to;
	if (item.to === "/more") return MORE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
	if (item.to === "/daily") return /^\/(daily|weekly|monthly)(\/|$)/.test(pathname);
	return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
//#endregion
//#region app/components/shell/ThemeSwitch.tsx
var OPTIONS = [
	{
		key: "dark",
		label: "深色",
		icon: /* @__PURE__ */ jsx(IconMoon, { size: 14 })
	},
	{
		key: "system",
		label: "跟随系统",
		icon: /* @__PURE__ */ jsx(IconMonitor, { size: 14 })
	},
	{
		key: "light",
		label: "浅色",
		icon: /* @__PURE__ */ jsx(IconSun, { size: 14 })
	}
];
/** Three-way appearance switch (dark / follow the system / light) with a sliding thumb. */
function ThemeSwitch({ className = "" }) {
	const pref = useThemePreference();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const current = !mounted ? "system" : pref ?? "system";
	const index = OPTIONS.findIndex((o) => o.key === current);
	const choose = (key) => {
		const nextPref = key === "system" ? null : key;
		const apply = () => {
			setThemePreference(nextPref);
			document.documentElement.setAttribute("data-theme", resolvedTheme(nextPref));
		};
		const doc = document;
		if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(apply);
		else apply();
	};
	return /* @__PURE__ */ jsxs("div", {
		role: "radiogroup",
		"aria-label": "外观",
		className: `relative grid h-[34px] grid-cols-3 rounded-full border border-line bg-bg-sunk p-[3px] ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			className: "absolute inset-y-[3px] left-[3px] w-[calc((100%-6px)/3)] rounded-full border border-line bg-surface shadow-[var(--shadow-card)] transition-transform duration-200 ease-[var(--ease-out-quart)]",
			style: { transform: `translateX(${index * 100}%)` }
		}), OPTIONS.map((o) => /* @__PURE__ */ jsxs("button", {
			type: "button",
			role: "radio",
			"aria-checked": current === o.key,
			title: o.label,
			onClick: () => choose(o.key),
			className: `relative z-10 flex items-center justify-center rounded-full transition-colors duration-150 ${current === o.key ? "text-ink" : "text-ink-4 hover:text-ink-2"}`,
			children: [o.icon, /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: o.label
			})]
		}, o.key))]
	});
}
//#endregion
//#region app/components/shell/Sidebar.tsx
/** True while the changelog has an entry newer than the one this reader last opened. */
function useChangelogDot(latestVersion) {
	const seen = useChangelogSeen();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	if (!mounted || !latestVersion) return false;
	return !seen || seen < latestVersion;
}
function SideLink({ item, dot }) {
	const { pathname } = useLocation();
	const isActive = tabIsActive(item, pathname);
	const Icon = item.icon;
	return /* @__PURE__ */ jsxs(Link, {
		to: item.to,
		prefetch: "intent",
		"aria-current": isActive ? "page" : void 0,
		className: `flex h-10 items-center gap-2.5 rounded-control px-2.5 text-[14px] transition-all duration-150 ${isActive ? "bg-gradient-to-r from-[#CE1141]/15 via-[#CE1141]/5 to-transparent border-l-[3px] border-[#CE1141] font-bold text-[#CE1141] dark:text-[#ff3864]" : "font-medium text-ink-3 hover:bg-bg-sunk hover:text-ink"}`,
		children: [
			/* @__PURE__ */ jsx("span", {
				className: `flex w-[22px] shrink-0 justify-center ${isActive ? "text-[#CE1141] dark:text-[#ff3864]" : ""}`,
				children: /* @__PURE__ */ jsx(Icon, { size: 17 })
			}),
			/* @__PURE__ */ jsx("span", {
				className: "min-w-0 truncate",
				children: item.label
			}),
			dot && item.changelog && /* @__PURE__ */ jsx("span", {
				className: "ml-auto size-1.5 shrink-0 rounded-full bg-hot",
				"aria-label": "有新的更新"
			})
		]
	});
}
function Sidebar({ changelogVersion }) {
	const dot = useChangelogDot(changelogVersion);
	return /* @__PURE__ */ jsxs("aside", {
		className: "sticky top-0 hidden h-dvh w-[190px] shrink-0 flex-col border-r border-line bg-sidebar px-3 pb-3.5 pt-5 lg:flex",
		children: [
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "mb-4 flex h-[50px] items-center px-1 text-ink",
				"aria-label": `${SITE.name} 首页`,
				children: /* @__PURE__ */ jsx(Wordmark, { size: 21 })
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "-mx-1 flex-1 overflow-y-auto px-1",
				"aria-label": "主导航",
				children: SIDEBAR.map((section) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "px-2.5 pb-1 pt-3 text-[11px] font-semibold text-ink-4",
					children: section.title
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-col gap-1",
					children: section.items.map((item) => /* @__PURE__ */ jsx(SideLink, {
						item,
						dot
					}, item.to))
				})] }, section.title))
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: "/schedule",
				className: "group mb-2 mt-auto block rounded-xl border border-line-soft bg-gradient-to-br from-bg-sunk/60 to-surface p-2.5 shadow-2xs transition-all hover:border-[#CE1141]/60 hover:shadow-md",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-[10px] font-bold text-ink-4",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1 text-[#CE1141]",
							children: [/* @__PURE__ */ jsx("span", { className: "size-1.5 animate-ping rounded-full bg-[#CE1141]" }), "焦点赛事"]
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono text-ink-3",
							children: "10.09 20:00"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-1 flex items-center justify-between text-[12px] font-black text-ink",
						children: [
							/* @__PURE__ */ jsx("span", { children: "HOU 火箭" }),
							/* @__PURE__ */ jsx("span", {
								className: "font-sans text-[10px] font-semibold text-ink-4",
								children: "VS"
							}),
							/* @__PURE__ */ jsx("span", { children: "DAL 独行侠" })
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-0.5 text-[9.5px] font-bold text-amber-600 dark:text-amber-400",
						children: "🇲🇴 NBA 澳门赛 G1"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2 px-1 pt-1",
				children: [/* @__PURE__ */ jsx(ThemeSwitch, { className: "mx-1" }), SITE.icp && /* @__PURE__ */ jsx("a", {
					href: "https://beian.miit.gov.cn/",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block px-2 text-[10px] text-ink-4 hover:text-ink-3",
					children: SITE.icp
				})]
			})
		]
	});
}
//#endregion
//#region app/components/shell/MobileTabBar.tsx
/** Bottom tab bar of the mobile shell (up to 960px), as on the original site. */
function MobileTabBar({ changelogVersion }) {
	const { pathname } = useLocation();
	const dot = useChangelogDot(changelogVersion);
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": "底部导航",
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto grid h-[54px] max-w-[640px] grid-cols-4",
			children: TABBAR.map((t) => {
				const active = tabIsActive(t, pathname);
				const Icon = t.icon;
				return /* @__PURE__ */ jsxs(Link, {
					to: t.to,
					prefetch: "intent",
					"aria-current": active ? "page" : void 0,
					className: `relative flex flex-col items-center justify-center gap-[3px] text-[11px] transition-colors ${active ? "font-semibold text-accent" : "text-ink-3 active:text-ink"}`,
					children: [
						/* @__PURE__ */ jsx(Icon, { size: 21 }),
						/* @__PURE__ */ jsx("span", { children: t.label }),
						dot && t.changelog && /* @__PURE__ */ jsx("span", {
							className: "absolute right-[calc(50%-17px)] top-2 size-1.5 rounded-full bg-hot",
							"aria-label": "有新的更新"
						})
					]
				}, t.to);
			})
		})
	});
}
//#endregion
//#region app/components/shell/Chrome.tsx
/** A thin accent line while a navigation is in flight (shown only if it takes a moment). */
function NavigationProgress({ active }) {
	const [visible, setVisible] = useState(false);
	const timer = useRef(null);
	useEffect(() => {
		if (active) timer.current = setTimeout(() => setVisible(true), 150);
		else {
			if (timer.current) clearTimeout(timer.current);
			setVisible(false);
		}
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [active]);
	return /* @__PURE__ */ jsx("div", {
		className: "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("div", {
			className: "h-full origin-left bg-accent",
			style: {
				transform: `scaleX(${visible ? .85 : active ? 0 : 1})`,
				opacity: visible ? 1 : 0,
				transition: visible ? "transform 2.4s cubic-bezier(0.1, 0.7, 0.2, 1), opacity 120ms" : "transform 200ms, opacity 300ms 120ms"
			}
		})
	});
}
/** Round "back to top" button once the reader has scrolled a screen or so. */
function BackToTop() {
	const [shown, setShown] = useState(false);
	useEffect(() => {
		const onScroll = () => setShown(window.scrollY > window.innerHeight * 1.2);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-label": "回到顶部",
		onClick: () => window.scrollTo({
			top: 0,
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
		}),
		className: `fixed bottom-[calc(70px+env(safe-area-inset-bottom))] right-4 z-30 flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-[var(--shadow-soft)] transition-all duration-200 hover:text-ink lg:bottom-6 lg:right-6 ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`,
		children: /* @__PURE__ */ jsx(IconArrowUp, { size: 18 })
	});
}
//#endregion
//#region app/components/ui/Controls.tsx
var VARIANTS = {
	primary: "bg-accent text-accent-contrast hover:bg-accent-ink disabled:opacity-45",
	secondary: "border border-line-strong bg-surface text-ink-2 hover:border-ink-4 hover:text-ink disabled:opacity-50",
	ghost: "text-ink-3 hover:bg-bg-sunk hover:text-ink disabled:opacity-50",
	danger: "bg-hot text-white hover:opacity-90 disabled:opacity-45"
};
var SIZES$1 = {
	sm: "h-8 px-3 text-[12.5px]",
	md: "h-9 px-4 text-[13.5px]",
	lg: "h-11 px-5 text-[14.5px]"
};
/** The pill button's classes, for links that look like buttons. */
function buttonClass(variant = "secondary", size = "md") {
	return `inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] ${SIZES$1[size]} ${VARIANTS[variant]}`;
}
forwardRef(function Button({ variant = "secondary", size = "md", className = "", ...rest }, ref) {
	return /* @__PURE__ */ jsx("button", {
		ref,
		type: "button",
		className: `${buttonClass(variant, size)} ${className}`,
		...rest
	});
});
/** Native select as a pill, like the site's other controls. */
function Select$1({ className = "", children, ...rest }) {
	return /* @__PURE__ */ jsxs("span", {
		className: `relative inline-flex ${className}`,
		children: [/* @__PURE__ */ jsx("select", {
			className: "h-8 w-full cursor-pointer appearance-none rounded-full border border-line-strong bg-surface py-0 pl-3.5 pr-8 text-[12.5px] text-ink-2 outline-none transition-colors hover:border-ink-4 focus:border-accent",
			...rest,
			children
		}), /* @__PURE__ */ jsx(IconChevronDown, {
			size: 14,
			className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-4"
		})]
	});
}
//#endregion
//#region app/lib/api.server.ts
var API_BASE$1 = process.env.API_BASE_URL || "http://127.0.0.1:3001";
var ApiError = class extends Error {
	status;
	code;
	retryAfter;
	constructor(status, code, retryAfter) {
		super(`api ${status} ${code ?? ""}`);
		this.status = status;
		this.code = code;
		this.retryAfter = retryAfter;
	}
};
async function apiGet(path, init) {
	const res = await fetch(`${API_BASE$1}${path}`, {
		headers: {
			accept: "application/json",
			"x-aihot-ssr": "1",
			...init?.headers
		},
		signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15e3)]) : AbortSignal.timeout(15e3)
	});
	if (!res.ok) {
		let code = null;
		try {
			code = (await res.json()).code ?? null;
		} catch {}
		const retry = res.headers.get("retry-after");
		throw new ApiError(res.status, code, retry ? Number(retry) : null);
	}
	res.headers.forEach((value, name) => init?.responseHeaders?.set(name, value));
	return await res.json();
}
/** Maps API failures to route responses: real 404s, search-busy page, otherwise 503. */
async function loadOr404(path, opts = {}) {
	try {
		return await apiGet(path, {
			responseHeaders: opts.responseHeaders,
			signal: opts.signal
		});
	} catch (error) {
		if (opts.signal?.aborted) throw error;
		if (error instanceof ApiError) {
			if (error.status === 404) throw data({ message: "not_found" }, { status: 404 });
			if (error.status === 503 && opts.busyRedirect) throw redirect(opts.busyRedirect);
			if (error.status === 400) throw data({ message: "bad_request" }, { status: 400 });
		}
		throw data({ message: "unavailable" }, { status: 503 });
	}
}
function queryString(params) {
	const sp = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) if (v !== null && v !== void 0 && v !== "") sp.set(k, String(v));
	const s = sp.toString();
	return s ? `?${s}` : "";
}
//#endregion
//#region app/lib/hydration.ts
var hydrated = false;
/** True when this component mounted after the first hydration, so an entrance animation is safe. */
function useEntrance() {
	const [entrance] = useState(() => hydrated);
	return entrance;
}
function useHydratedFlag() {
	useEffect(() => {
		hydrated = true;
	}, []);
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links,
	loader: () => loader$35,
	meta: () => meta$41,
	shouldRevalidate: () => shouldRevalidate$1
});
var links = () => [
	{
		rel: "icon",
		href: "/favicon.ico",
		sizes: "any"
	},
	{
		rel: "icon",
		type: "image/png",
		href: "/icon.png"
	},
	{
		rel: "apple-touch-icon",
		href: "/apple-icon.png"
	},
	{
		rel: "manifest",
		href: "/manifest.webmanifest"
	},
	{
		rel: "alternate",
		type: "application/rss+xml",
		title: `${SITE.name} — 精选`,
		href: "/feed.xml"
	}
];
async function loader$35({ request }) {
	try {
		return await apiGet("/api/site/meta", { signal: request.signal });
	} catch {
		return { changelogVersion: null };
	}
}
var shouldRevalidate$1 = () => false;
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: SITE.locale,
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				media: "(prefers-color-scheme: light)",
				content: "#faf9f6"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				media: "(prefers-color-scheme: dark)",
				content: "#13191c"
			}),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT_SCRIPT } }),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, { getKey: (location) => location.key }),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
/** Only a page nobody matched falls back to this; every page names itself. */
function meta$41({ error }) {
	if (!error) return [];
	return [{ title: titled(isRouteErrorResponse(error) && error.status === 404 ? "页面不存在" : "暂时无法加载") }, {
		name: "robots",
		content: "noindex"
	}];
}
/** Sidebar, main column and phone tab bar around a page (or an error). */
function SiteShell({ changelogVersion, children }) {
	const navigation = useNavigation();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-dvh",
		children: [
			/* @__PURE__ */ jsx(NavigationProgress, { active: navigation.state === "loading" }),
			/* @__PURE__ */ jsx("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-control focus:bg-surface focus:px-3 focus:py-2",
				children: "跳到正文"
			}),
			/* @__PURE__ */ jsx(Sidebar, { changelogVersion }),
			/* @__PURE__ */ jsx("main", {
				id: "main",
				className: "min-w-0 flex-1 pb-[calc(72px+env(safe-area-inset-bottom))] lg:px-5 lg:pb-[72px] lg:pt-6 xl:px-7",
				children: /* @__PURE__ */ jsx("div", {
					className: "mx-auto w-full max-w-[640px] px-4 lg:max-w-[var(--page-max-wide)] lg:px-0",
					children
				})
			}),
			/* @__PURE__ */ jsx(MobileTabBar, { changelogVersion }),
			/* @__PURE__ */ jsx(BackToTop, {})
		]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	const meta = useLoaderData();
	useHydratedFlag();
	const { pathname } = useLocation();
	if (pathname === "/admin" || pathname.startsWith("/admin/")) return /* @__PURE__ */ jsx(Outlet, {});
	return /* @__PURE__ */ jsx(SiteShell, {
		changelogVersion: meta.changelogVersion,
		children: /* @__PURE__ */ jsx(Outlet, {})
	});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useRouteError();
	const site = useRouteLoaderData("root");
	const { pathname } = useLocation();
	const status = isRouteErrorResponse(error) ? error.status : 500;
	const notFound = status === 404;
	const body = /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[70vh] items-center justify-center px-2 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-sm text-center",
			children: [
				/* @__PURE__ */ jsx(RingMark, { className: "mx-auto mb-5 size-10 text-accent" }),
				/* @__PURE__ */ jsx("div", {
					className: "mono text-[12px] text-ink-4",
					children: status
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-1.5 text-[20px] font-bold text-ink",
					children: notFound ? "这里没有内容" : "暂时无法加载"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[13.5px] leading-relaxed text-ink-3",
					children: notFound ? "你访问的页面不存在，或内容已不再公开。" : "服务暂时繁忙，请稍后再试。已经加载过的内容不受影响。"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-center gap-2.5",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: buttonClass("primary"),
						children: "回到精选"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/all",
						className: buttonClass("secondary"),
						children: "浏览全部动态"
					})]
				})
			]
		})
	});
	if (pathname === "/admin" || pathname.startsWith("/admin/")) return body;
	return /* @__PURE__ */ jsx(SiteShell, {
		changelogVersion: site?.changelogVersion ?? null,
		children: body
	});
});
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	loader: () => loader$34,
	meta: () => meta$40
});
async function loader$34({ request }) {
	const url = new URL(request.url);
	throw redirect(`/all${url.search}`);
}
function meta$40() {
	return [];
}
var home_default = UNSAFE_withComponentProps(function Home() {
	return null;
});
//#endregion
//#region ../../industry/taxonomy.ts
/**
* 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
* section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
* 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
*/
var CATEGORIES = [
	{
		key: "news",
		label: "球队动态",
		section: "动态与采访",
		guide: "官方公告、伤病名单、出战状态、日常训练花絮、发展联盟召回；比赛战报、赛后技术统计与胜负盘点；主教练乌度卡、核心球员及管理层斯通的赛后采访、媒体日言论、更衣室原声采访与新闻发布会；随队记者发布的与火箭队高度正相关的实质新闻（一手采访、重要伤情、队内实质动向，记者日常推文碎碎念严禁归入）"
	},
	{
		key: "analysis",
		label: "深度专栏",
		section: "战术与专栏",
		guide: "战术打法剖析、挡拆攻防复盘、高阶数据模型、薪资空间结构、选秀前景及行业深度分析"
	},
	{
		key: "trades",
		label: "交易流言",
		section: "交易与流言",
		guide: "正式交易、自由球员签约、转会传闻与谈判动向、名记引援爆料、选秀大会与裁员下放；随队记者发布的涉及火箭队实质引援与交易动向的推文"
	},
	{
		key: "beat_tweets",
		label: "队记推文",
		section: "队记推文",
		guide: "随队名记（Jonathan Feigen, Kelly Iko, Adam Spolane 等）在 X/推特发布的日常推文、观赛随感、现场花絮、实时看球动态与互动；默认所有队记推文归入此栏，若内容属于高度实质的球队新闻或采访则归入球队动态，交易爆料则归入交易流言"
	},
	{
		key: "videos",
		label: "视频专栏",
		section: "视频专栏",
		guide: "休斯敦火箭相关的赛场集锦、球员集锦、官方视频、赛后更衣室采访原声录像、YouTube 视频、播客视频切片等所有视频类内容；所有来自 YouTube 信源或包含实质视频媒体的内容均强制归入此栏"
	}
];
//#endregion
//#region ../../packages/contracts/src/taxonomy.ts
var CATEGORY_KEYS$1 = CATEGORIES.map((c) => c.key);
/** Website tab labels. */
var CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));
function isCategoryKey(value) {
	return typeof value === "string" && CATEGORY_KEYS$1.includes(value);
}
var CHANNEL_KEYS = [
	"all",
	"news",
	"x",
	"firstParty"
];
function isChannelKey(value) {
	return typeof value === "string" && CHANNEL_KEYS.includes(value);
}
var LEADERBOARD_PUBLIC_BOARDS = [
	"overall",
	"coding",
	"reasoning",
	"knowledge",
	"professional"
];
var LEADERBOARD_BOARD_LABELS = {
	overall: "综合",
	coding: "编程",
	reasoning: "推理",
	knowledge: "知识",
	professional: "专业办公"
};
//#endregion
//#region app/components/ui/IntentLink.tsx
/** Hover, keyboard focus and a stationary touch prefetch; scrolling over a card does not. */
function IntentLink({ onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, ...props }) {
	const [ready, setReady] = useState(false);
	const timer = useRef(null);
	const clear = () => {
		if (timer.current !== null) clearTimeout(timer.current);
		timer.current = null;
	};
	const start = () => {
		clear();
		timer.current = setTimeout(() => {
			timer.current = null;
			setReady(true);
		}, 100);
	};
	const cancel = () => {
		clear();
		setReady(false);
	};
	useEffect(() => {
		cancel();
		return clear;
	}, [props.to]);
	return /* @__PURE__ */ jsx(Link, {
		...props,
		prefetch: ready ? "render" : "none",
		onFocus: (e) => {
			onFocus?.(e);
			if (!e.defaultPrevented) start();
		},
		onBlur: (e) => {
			onBlur?.(e);
			cancel();
		},
		onMouseEnter: (e) => {
			onMouseEnter?.(e);
			if (!e.defaultPrevented) start();
		},
		onMouseLeave: (e) => {
			onMouseLeave?.(e);
			cancel();
		},
		onTouchStart: (e) => {
			onTouchStart?.(e);
			if (!e.defaultPrevented) start();
		},
		onTouchMove: (e) => {
			onTouchMove?.(e);
			cancel();
		},
		onTouchEnd: (e) => {
			onTouchEnd?.(e);
			cancel();
		},
		onTouchCancel: (e) => {
			onTouchCancel?.(e);
			cancel();
		}
	});
}
//#endregion
//#region app/components/ui/Tabs.tsx
/** Where each switch's thumb sat when it last left, relative to its track. */
var thumbs = /* @__PURE__ */ new Map();
function placeOf(el) {
	const tab = el.parentElement.getBoundingClientRect();
	const track = el.closest("[data-pill-track]")?.getBoundingClientRect();
	return {
		left: tab.left - (track?.left ?? 0),
		width: tab.width,
		at: Date.now()
	};
}
/**
* The white thumb inside the chosen option. It is rendered in place (so it is right without
* JavaScript) and, when the choice moves, glides over from where the previous thumb was.
*/
function Thumb({ id }) {
	const ref = useRef(null);
	const entrance = useEntrance();
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const now = placeOf(el);
		const prev = thumbs.get(id);
		const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		if (entrance && !reduce && prev && now.at - prev.at < 1e3 && (prev.left !== now.left || prev.width !== now.width) && el.animate) el.animate([{
			transform: `translateX(${prev.left - now.left}px)`,
			width: `${prev.width}px`
		}, {
			transform: "translateX(0)",
			width: `${now.width}px`
		}], {
			duration: 300,
			easing: "cubic-bezier(0.25, 1, 0.5, 1)"
		});
		return () => {
			thumbs.set(id, placeOf(el));
		};
	}, [id, entrance]);
	return /* @__PURE__ */ jsx("span", {
		ref,
		className: "absolute inset-0 rounded-full bg-surface shadow-xs ring-1 ring-[#CE1141]/25 dark:ring-white/10 dark:bg-raised"
	});
}
var SIZES = {
	md: "h-9 px-4 text-[14px]",
	sm: "h-8 px-3.5 text-[13px]",
	xs: "h-7 px-3 text-[12.5px]"
};
/**
* The site's one switch control: a grey pill track with a white thumb that glides to the chosen
* option. Boards, categories, sources, report kinds, page sections and language all use it, so every
* switch looks and moves the same. Scrolls sideways when it runs out of room; `fill` spreads the
* options evenly across the available width.
*/
function PillTabs({ items, active, onSelect, layoutId, size = "md", label, fill = false, className = "" }) {
	const links = items.some((t) => t.to);
	const Track = links ? "nav" : "div";
	return /* @__PURE__ */ jsx("div", {
		className: `scrollbar-none max-w-full overflow-x-auto ${fill ? "w-full" : ""} ${className}`,
		children: /* @__PURE__ */ jsx(Track, {
			"data-pill-track": "",
			"aria-label": label,
			role: links ? void 0 : "tablist",
			className: `${fill ? "grid w-full" : "inline-flex w-max"} gap-0.5 rounded-full bg-bg-sunk p-[3px] ring-1 ring-inset ring-line-soft dark:bg-bg-muted/60`,
			style: fill ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : void 0,
			children: items.map((t) => {
				const on = t.key === active;
				const inner = /* @__PURE__ */ jsxs(Fragment, { children: [on && /* @__PURE__ */ jsx(Thumb, { id: layoutId }), /* @__PURE__ */ jsxs("span", {
					className: "relative inline-flex items-center gap-1",
					children: [t.label, t.count !== void 0 && t.count !== null && /* @__PURE__ */ jsx("span", {
						className: `num text-[0.86em] font-normal ${on ? "text-ink-3" : "text-ink-4"}`,
						children: t.count
					})]
				})] });
				const cls = `relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full outline-offset-1 transition-all duration-150 active:scale-[0.98] ${SIZES[size]} ${on ? "text-[#CE1141] dark:text-[#ff3864] font-extrabold" : "text-ink-3 hover:text-ink font-semibold"}`;
				const TabLink = t.prefetch === "intent" ? IntentLink : Link;
				return t.to ? /* @__PURE__ */ jsx(TabLink, {
					to: t.to,
					replace: t.replace,
					preventScrollReset: true,
					"aria-current": on ? "page" : void 0,
					className: cls,
					children: inner
				}, t.key) : /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					"aria-selected": on,
					onClick: () => onSelect?.(t.key),
					className: cls,
					children: inner
				}, t.key);
			})
		})
	});
}
//#endregion
//#region app/features/feed/Filters.tsx
/** Same page with some query parameters changed (paging state dropped). */
function hrefWith(base, params, patch) {
	const sp = new URLSearchParams(params);
	for (const [k, v] of Object.entries(patch)) if (v === null || v === "") sp.delete(k);
	else sp.set(k, v);
	sp.delete("page");
	sp.delete("cursor");
	const s = sp.toString();
	return s ? `${base}?${s}` : base;
}
/**
* The feed's one filter row (精选 and 全部动态 alike): 全部, 一手, then the categories. One choice at a
* time: picking 一手 clears the category and picking a category clears 一手. Older 资讯 / X links
* still filter; the row then shows 全部.
*/
function CategoryTabs({ base, category, channel = "all", layoutId, size = "md", className = "" }) {
	const [params] = useSearchParams();
	const items = [
		{
			key: "all",
			label: "全部",
			to: hrefWith(base, params, {
				category: null,
				channel: null
			})
		},
		{
			key: "news",
			label: "球队动态",
			to: hrefWith(base, params, {
				category: "news",
				channel: null
			})
		},
		{
			key: "analysis",
			label: "深度专栏",
			to: hrefWith(base, params, {
				category: "analysis",
				channel: null
			})
		},
		{
			key: "trades",
			label: "交易流言",
			to: hrefWith(base, params, {
				category: "trades",
				channel: null
			})
		},
		{
			key: "beat_tweets",
			label: "队记推文",
			to: hrefWith(base, params, {
				category: "beat_tweets",
				channel: null
			})
		},
		{
			key: "videos",
			label: "视频专栏",
			to: hrefWith(base, params, {
				category: "videos",
				channel: null
			})
		}
	];
	return /* @__PURE__ */ jsx(PillTabs, {
		items,
		active: category ?? "all",
		layoutId,
		label: "筛选",
		size,
		className
	});
}
function useSlashFocus(ref) {
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target?.isContentEditable)) {
				e.preventDefault();
				ref.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [ref]);
}
/**
* Search field (GET /all?q=…). Desktop ("track"): at the end of the filter row as the same grey track,
* at the height of md tabs, with a "/" hint. Phones ("bar"): full width with a separate 搜索 button.
*/
function SearchField({ action = "/all", defaultValue = "", keep = {}, variant = "track", autoFocus = false }) {
	const [value, setValue] = useState(defaultValue);
	const navigation = useNavigation();
	const inputRef = useRef(null);
	useEffect(() => setValue(defaultValue), [defaultValue]);
	useSlashFocus(inputRef);
	useEffect(() => {
		if (autoFocus) inputRef.current?.focus();
	}, [autoFocus]);
	const searching = navigation.state === "loading" && navigation.location?.pathname === action && !!new URLSearchParams(navigation.location.search).get("q");
	const hidden = Object.entries(keep).map(([k, v]) => v ? /* @__PURE__ */ jsx("input", {
		type: "hidden",
		name: k,
		value: v
	}, k) : null);
	if (variant === "bar") return /* @__PURE__ */ jsxs(Form, {
		method: "get",
		action,
		role: "search",
		className: "flex gap-2",
		children: [
			hidden,
			/* @__PURE__ */ jsxs("label", {
				className: "relative flex-1",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "sr-only",
						children: "搜索标题、摘要与正文"
					}),
					/* @__PURE__ */ jsx(IconSearch, {
						size: 17,
						className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4"
					}),
					/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						name: "q",
						value,
						onChange: (e) => setValue(e.target.value),
						placeholder: "搜索标题、摘要…",
						maxLength: 200,
						autoComplete: "off",
						enterKeyHint: "search",
						className: "h-11 w-full rounded-full border border-line-strong bg-surface pl-10 pr-9 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
					}),
					value && /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "清空",
						onClick: () => {
							setValue("");
							inputRef.current?.focus();
						},
						className: "absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-4",
						children: /* @__PURE__ */ jsx(IconClose, { size: 15 })
					})
				]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "submit",
				className: `h-11 shrink-0 rounded-full bg-accent px-5 text-[14.5px] font-semibold text-accent-contrast transition-[background-color,transform] active:scale-[0.98] ${searching ? "opacity-60" : ""}`,
				children: "搜索"
			})
		]
	});
	return /* @__PURE__ */ jsxs(Form, {
		method: "get",
		action,
		role: "search",
		className: "group relative w-full shrink-0 lg:w-60",
		children: [
			hidden,
			/* @__PURE__ */ jsx("label", {
				htmlFor: "site-search",
				className: "sr-only",
				children: "搜索标题、摘要与正文"
			}),
			/* @__PURE__ */ jsx(IconSearch, {
				size: 16,
				className: `pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searching ? "text-accent" : "text-ink-4 group-focus-within:text-ink-3"}`
			}),
			/* @__PURE__ */ jsx("input", {
				ref: inputRef,
				id: "site-search",
				name: "q",
				value,
				onChange: (e) => setValue(e.target.value),
				placeholder: "搜索标题、摘要…",
				maxLength: 200,
				autoComplete: "off",
				className: "h-[42px] w-full rounded-full bg-bg-sunk pl-10 pr-10 text-[14px] text-ink outline-none ring-1 ring-inset ring-line-soft transition-[background-color,box-shadow] placeholder:text-ink-4 hover:ring-line-strong focus:bg-surface focus:shadow-[0_0_0_3px_var(--accent-soft)] focus:ring-accent dark:bg-bg-muted/60 dark:focus:bg-surface"
			}),
			value ? /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "清空",
				onClick: () => {
					setValue("");
					inputRef.current?.focus();
				},
				className: "absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-4 transition-colors hover:bg-bg-sunk hover:text-ink",
				children: /* @__PURE__ */ jsx(IconClose, { size: 13 })
			}) : /* @__PURE__ */ jsx("kbd", {
				className: "mono pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-mark border border-line-strong bg-surface px-1.5 text-[10.5px] leading-4 text-ink-4 lg:block",
				children: "/"
			})
		]
	});
}
//#endregion
//#region app/lib/format.ts
function relativeTime(iso, now = Date.now()) {
	const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1e3));
	if (s < 60) return "刚刚";
	const m = Math.round(s / 60);
	if (m < 60) return `${m} 分钟前`;
	const h = Math.round(m / 60);
	if (h < 24) return `${h} 小时前`;
	const d = Math.round(h / 24);
	if (d < 30) return `${d} 天前`;
	return beijingDate(iso);
}
function fullDateTime(iso) {
	return `${beijingDate(iso)} ${beijingTime(iso)}`;
}
/** "9月24日 10:51" (Beijing), for lists that span days. */
function monthDayTime(iso) {
	const [, m, d] = beijingDate(iso).split("-").map(Number);
	return `${m}月${d}日 ${beijingTime(iso)}`;
}
/** "X：Ethan Mollick (@emollick)" → "Ethan Mollick"; other sources keep their name. */
function shortSourceName(name) {
	const m = /^X[:：]\s*(.+?)\s*\(@[^)]+\)\s*$/.exec(name);
	if (m) return m[1].replace(/（.*?）/g, "").trim();
	return name.replace(/（RSS）|（网页）|（API）/g, "").trim();
}
function sourceInitial(name) {
	return (shortSourceName(name).replace(/^[^\p{L}\p{N}]+/u, "")[0] ?? "A").toUpperCase();
}
//#endregion
//#region app/components/ui/Score.tsx
/**
* 篮球资讯前线热度评级标签 (纯净、专业体育媒体风格)
*/
function ScoreLabel({ score, compact = false }) {
	if (score === null || score === void 0) return null;
	const isTenScale = score <= 10;
	const numDisplay = isTenScale ? Number.isInteger(score) ? score.toFixed(1) : String(score) : String(Math.round(score));
	const colorCls = (isTenScale ? score * 10 : score) >= 85 ? "bg-red-50 text-[#CE1141] ring-[#CE1141]/25 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900" : "bg-neutral-100 text-ink-3 ring-line dark:bg-neutral-800/60 dark:text-ink-3";
	return /* @__PURE__ */ jsxs("span", {
		title: `前线热度评级：${numDisplay}`,
		"aria-label": `热度评级 ${numDisplay}`,
		className: `inline-flex h-[20px] shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 text-[10.5px] font-medium ring-1 ring-inset ${colorCls}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "font-mono text-[11px] font-black tabular-nums tracking-tight",
			children: numDisplay
		}), !compact && /* @__PURE__ */ jsx("span", {
			className: "text-[10px] font-semibold opacity-80",
			children: "热度"
		})]
	});
}
//#endregion
//#region app/components/ui/SourceAvatar.tsx
/** Round avatar for X accounts (or a source icon); a tinted initial when there is no image. */
function SourceAvatar({ name, iconUrl, avatarUrl, iconSrcSet, avatarSrcSet, size = 18 }) {
	const [failed, setFailed] = useState(false);
	const src = avatarUrl ?? iconUrl;
	if (src && !failed) return /* @__PURE__ */ jsx("img", {
		src,
		srcSet: avatarUrl ? avatarSrcSet : iconSrcSet,
		sizes: `${size}px`,
		decoding: "async",
		alt: "",
		width: size,
		height: size,
		loading: "lazy",
		onError: () => setFailed(true),
		className: "shrink-0 rounded-full bg-bg-sunk object-cover",
		style: {
			width: size,
			height: size
		}
	});
	let h = 0;
	for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
	return /* @__PURE__ */ jsx("span", {
		"aria-hidden": "true",
		className: "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
		style: {
			width: size,
			height: size,
			fontSize: Math.max(9, Math.round(size * .5)),
			background: `oklch(0.6 0.07 ${h})`
		},
		children: sourceInitial(name)
	});
}
//#endregion
//#region app/components/ui/Lightbox.tsx
/**
* Pictures shown full size over the page. While open, keyboard focus stays in the viewer (Tab moves
* between its buttons), the page behind does not scroll, Escape closes it and the arrow keys move
* between pictures; closing puts focus back where it was.
*/
function Lightbox({ images, index, onIndex, onClose }) {
	const open = index !== null && !!images[index];
	const dialog = useRef(null);
	const closeButton = useRef(null);
	const state = useRef({
		index,
		count: images.length,
		onIndex,
		onClose
	});
	state.current = {
		index,
		count: images.length,
		onIndex,
		onClose
	};
	useEffect(() => {
		if (!open) return;
		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = "hidden";
		closeButton.current?.focus({ preventScroll: true });
		const step = (by) => {
			const { index: at, count, onIndex: go } = state.current;
			if (at !== null && count > 1) go((at + by + count) % count);
		};
		const onKey = (e) => {
			if (e.key === "Escape") state.current.onClose();
			else if (e.key === "ArrowRight") step(1);
			else if (e.key === "ArrowLeft") step(-1);
			else if (e.key === "Tab") {
				const focusable = [...dialog.current?.querySelectorAll("button") ?? []];
				if (!focusable.length) return;
				const at = focusable.indexOf(document.activeElement);
				focusable[e.shiftKey ? at <= 0 ? focusable.length - 1 : at - 1 : at === focusable.length - 1 ? 0 : at + 1].focus();
			} else return;
			e.preventDefault();
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("keydown", onKey);
			root.style.overflow = overflow;
			opener?.focus({ preventScroll: true });
		};
	}, [open]);
	const current = open ? images[index] : null;
	const many = images.length > 1;
	const nav = "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";
	if (typeof document === "undefined") return null;
	return createPortal(/* @__PURE__ */ jsx(Presence, {
		show: open,
		enter: "anim-fade-in",
		exit: "anim-fade-out",
		duration: 160,
		children: /* @__PURE__ */ jsxs("div", {
			ref: dialog,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": many && index !== null ? `图片 ${index + 1} / ${images.length}` : "图片",
			onClick: onClose,
			className: "fixed inset-0 z-[80] grid cursor-zoom-out place-items-center bg-black/85 p-4 sm:p-10",
			children: [
				current && /* @__PURE__ */ jsx("img", {
					src: current.src,
					decoding: "async",
					alt: current.alt ?? "",
					className: "lightbox-img anim-zoom-in min-h-0 min-w-0 max-h-[calc(100dvh-5rem)] max-w-full rounded-control object-contain shadow-2xl"
				}, current.src),
				/* @__PURE__ */ jsx("button", {
					ref: closeButton,
					type: "button",
					"aria-label": "关闭",
					onClick: onClose,
					className: "absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
					children: /* @__PURE__ */ jsx(IconClose, { size: 18 })
				}),
				many && index !== null && /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "上一张",
						onClick: (e) => {
							e.stopPropagation();
							onIndex((index - 1 + images.length) % images.length);
						},
						className: `${nav} left-3 sm:left-5`,
						children: /* @__PURE__ */ jsx(IconArrowLeft, { size: 18 })
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "下一张",
						onClick: (e) => {
							e.stopPropagation();
							onIndex((index + 1) % images.length);
						},
						className: `${nav} right-3 sm:right-5`,
						children: /* @__PURE__ */ jsx(IconArrowRight, { size: 18 })
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "num pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2.5 py-0.5 text-[12px] text-white/85",
						children: [
							index + 1,
							" / ",
							images.length
						]
					})
				] })
			]
		})
	}), document.body);
}
//#endregion
//#region app/components/ui/VideoModal.tsx
function VideoModal({ open, videoUrl, poster, onClose }) {
	const dialog = useRef(null);
	const videoRef = useRef(null);
	const closeButton = useRef(null);
	useEffect(() => {
		if (!open) return;
		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = "hidden";
		closeButton.current?.focus({ preventScroll: true });
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("keydown", onKey);
			root.style.overflow = overflow;
			opener?.focus({ preventScroll: true });
		};
	}, [open, onClose]);
	if (typeof document === "undefined") return null;
	return createPortal(/* @__PURE__ */ jsx(Presence, {
		show: open && !!videoUrl,
		enter: "anim-fade-in",
		exit: "anim-fade-out",
		duration: 160,
		children: /* @__PURE__ */ jsxs("div", {
			ref: dialog,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "视频播放器",
			onClick: onClose,
			className: "fixed inset-0 z-[80] grid place-items-center bg-black/85 p-3 sm:p-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "relative max-h-[calc(100dvh-4rem)] max-w-full overflow-hidden rounded-tile bg-black shadow-2xl flex items-center justify-center",
				onClick: (e) => e.stopPropagation(),
				children: videoUrl && /* @__PURE__ */ jsx("video", {
					ref: videoRef,
					src: videoUrl,
					poster: poster ?? void 0,
					controls: true,
					autoPlay: true,
					playsInline: true,
					preload: "metadata",
					className: "max-h-[calc(100dvh-5rem)] max-w-[calc(100vw-2rem)] md:max-w-4xl rounded-control object-contain"
				}, videoUrl)
			}), /* @__PURE__ */ jsx("button", {
				ref: closeButton,
				type: "button",
				"aria-label": "关闭视频",
				onClick: onClose,
				className: "absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
				children: /* @__PURE__ */ jsx(IconClose, { size: 18 })
			})]
		})
	}), document.body);
}
//#endregion
//#region app/features/feed/parts.tsx
/** "IT之家（RSS）" or, for X, avatar + display name + @handle. */
function SourceLine({ item, avatarSize = 16, className = "" }) {
	if (item.channel === "x" && item.x) return /* @__PURE__ */ jsxs("span", {
		className: `flex min-w-0 items-center gap-1.5 ${className}`,
		children: [
			/* @__PURE__ */ jsx(SourceAvatar, {
				name: item.x.authorName,
				avatarUrl: item.x.avatarUrl,
				avatarSrcSet: item.x.avatarSrcSet,
				size: avatarSize
			}),
			/* @__PURE__ */ jsx("span", {
				className: "truncate text-ink-3",
				children: item.x.authorName
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "hidden shrink-0 text-ink-4 min-[400px]:inline",
				children: ["@", item.x.handle]
			})
		]
	});
	return /* @__PURE__ */ jsx("span", {
		className: `min-w-0 truncate ${className}`,
		children: item.source.name
	});
}
/** Up to four media thumbnails, kept small in lists (the detail page shows them larger). Videos are stills. */
function MediaThumbs({ media, className = "" }) {
	const [index, setIndex] = useState(null);
	const [activeVideo, setActiveVideo] = useState(null);
	const images = media.filter((m) => m.kind === "image").map((m) => ({
		src: m.fullUrl ?? m.url,
		alt: m.alt
	}));
	const shown = media.slice(0, 4);
	if (shown.length === 0) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: `flex gap-1.5 overflow-hidden ${className}`,
			children: shown.map((m) => {
				const isClickableVideo = m.kind === "video" && !!m.videoUrl;
				const isClickableImage = m.kind === "image";
				const isClickable = isClickableImage || isClickableVideo;
				return /* @__PURE__ */ jsxs(isClickable ? "button" : "span", {
					...isClickableImage ? {
						type: "button",
						"aria-label": `查看图片${m.alt ? `：${m.alt}` : ""}`,
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
							setIndex(images.findIndex((image) => image.src === (m.fullUrl ?? m.url)));
						}
					} : isClickableVideo ? {
						type: "button",
						"aria-label": "播放视频",
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
							setActiveVideo({
								url: m.videoUrl,
								poster: m.poster ?? m.url
							});
						}
					} : {},
					className: `relative ${isClickable ? "z-10 cursor-pointer" : ""} ${isClickableImage ? "cursor-zoom-in" : ""} shrink-0 overflow-hidden rounded-control border border-line-soft bg-bg-sunk ${shown.length === 1 ? "max-w-[240px]" : "w-[112px]"}`,
					children: [/* @__PURE__ */ jsx("img", {
						src: m.poster ?? m.url,
						srcSet: m.srcSet,
						sizes: shown.length === 1 ? `${m.width && m.height ? Math.min(240, Math.ceil(112 * m.width / m.height)) : 240}px` : "112px",
						width: m.width ?? void 0,
						height: m.height ?? void 0,
						alt: m.alt ?? "",
						loading: "lazy",
						decoding: "async",
						className: `h-[112px] object-cover ${shown.length === 1 ? "w-auto max-w-[240px]" : "w-[112px]"}`
					}), m.kind === "video" && /* @__PURE__ */ jsx("span", {
						className: "absolute inset-0 grid place-items-center",
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsx("span", {
							className: "grid size-8 place-items-center rounded-full bg-black/55 text-white",
							children: /* @__PURE__ */ jsx("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "currentColor",
								className: "ml-px",
								children: /* @__PURE__ */ jsx("path", { d: "M7 4.5v15a1 1 0 001.5.87l13-7.5a1 1 0 000-1.74l-13-7.5A1 1 0 007 4.5z" })
							})
						})
					})]
				}, m.url);
			})
		}),
		/* @__PURE__ */ jsx(Lightbox, {
			images,
			index,
			onIndex: setIndex,
			onClose: () => setIndex(null)
		}),
		/* @__PURE__ */ jsx(VideoModal, {
			open: !!activeVideo,
			videoUrl: activeVideo?.url ?? null,
			poster: activeVideo?.poster,
			onClose: () => setActiveVideo(null)
		})
	] });
}
/** Bookmark toggle kept in this browser (收藏). */
function StarButton({ item, size = 26, className = "" }) {
	const starred = useIsStarred(item.id);
	const [pulse, setPulse] = useState(0);
	const on = starred;
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-pressed": on,
		"aria-label": on ? "取消收藏" : "收藏",
		title: on ? "取消收藏" : "收藏",
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (toggleStar({
				id: item.id,
				title: item.title,
				summary: item.summary,
				sourceName: item.source.name,
				publishedAt: item.publishedAt,
				score: item.score,
				aiSelected: item.selected
			})) setPulse((p) => p + 1);
		},
		style: {
			width: size,
			height: size
		},
		className: `relative z-10 inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-150 ${on ? "text-accent" : "text-ink-4 hover:bg-bg-sunk hover:text-ink-2"} ${className}`,
		children: /* @__PURE__ */ jsx("span", {
			className: `flex ${pulse ? "anim-bump" : ""}`,
			children: /* @__PURE__ */ jsx(IconBookmark, {
				size: Math.round(size * .6),
				filled: on
			})
		}, pulse)
	});
}
//#endregion
//#region app/features/feed/session-cache.ts
var MAX_MEMORY_ENTRIES = 20;
function sessionCache(prefix, maxAge) {
	const memory = /* @__PURE__ */ new Map();
	const dirty = /* @__PURE__ */ new Map();
	let timer;
	let listening = false;
	function flush() {
		clearTimeout(timer);
		timer = void 0;
		for (const [key, value] of dirty) try {
			sessionStorage.setItem(prefix + key, JSON.stringify(value));
		} catch {}
		dirty.clear();
	}
	function remember(key, value) {
		memory.delete(key);
		memory.set(key, value);
		if (memory.size > MAX_MEMORY_ENTRIES) memory.delete(memory.keys().next().value);
	}
	function peek(key) {
		const value = memory.get(key) ?? dirty.get(key);
		if (!value) return null;
		if (Date.now() - value.savedAt <= maxAge) return value;
		memory.delete(key);
		dirty.delete(key);
		try {
			sessionStorage.removeItem(prefix + key);
		} catch {}
		return null;
	}
	function read(key) {
		const hit = peek(key);
		if (hit) return hit;
		try {
			const raw = sessionStorage.getItem(prefix + key);
			if (!raw) return null;
			const value = JSON.parse(raw);
			if (!value || !Number.isFinite(value.savedAt) || Date.now() - value.savedAt > maxAge) {
				sessionStorage.removeItem(prefix + key);
				return null;
			}
			remember(key, value);
			return value;
		} catch {
			return null;
		}
	}
	function set(key, value) {
		remember(key, value);
		dirty.set(key, value);
		if (!listening) {
			listening = true;
			window.addEventListener("pagehide", flush);
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "hidden") flush();
			});
			try {
				for (let i = sessionStorage.length - 1; i >= 0; i--) {
					const storedKey = sessionStorage.key(i);
					if (!storedKey?.startsWith(prefix)) continue;
					try {
						const old = JSON.parse(sessionStorage.getItem(storedKey));
						if (!old || !Number.isFinite(old.savedAt) || Date.now() - old.savedAt > maxAge) sessionStorage.removeItem(storedKey);
					} catch {
						sessionStorage.removeItem(storedKey);
					}
				}
			} catch {}
		}
		timer ??= setTimeout(flush, 50);
		if (document.visibilityState === "hidden") flush();
	}
	return {
		peek,
		read,
		set,
		flush
	};
}
/**
* True when this document was loaded by the reader's reload. A reload asks for the latest list (the
* home page has no "new items" prompt), so it never restores a saved list; back and forward do.
*/
function isReload() {
	try {
		return performance.getEntriesByType("navigation")[0]?.type === "reload";
	} catch {
		return false;
	}
}
//#endregion
//#region app/features/feed/ReadingGroup.tsx
function filterParams(filters, cursor) {
	const sp = new URLSearchParams();
	if (filters?.channel && filters.channel !== "all") sp.set("channel", filters.channel);
	if (filters?.category) sp.set("category", filters.category);
	if (filters?.tag) sp.set("tag", filters.tag);
	if (cursor) sp.set("cursor", cursor);
	return sp;
}
var EMPTY = {
	loading: false,
	items: [],
	error: false,
	next: null,
	loaded: false
};
var groupsCache = sessionCache("aihot:groups:", 18e5);
function stored(entry) {
	return groupsCache.read(entry)?.groups ?? {};
}
function remember(entry, key, saved) {
	const keep = saved.open || saved.paged.loaded;
	const groups = groupsCache.peek(entry)?.groups;
	if (!keep && !groups?.[key]) return;
	const next = { ...groups ?? stored(entry) };
	if (keep) next[key] = {
		...saved,
		paged: {
			...saved.paged,
			loading: false
		}
	};
	else delete next[key];
	groupsCache.set(entry, {
		savedAt: Date.now(),
		groups: next
	});
}
/** Open state and pages of one group, restored for the history entry it was left in. */
function useGroupState(key, url, pick) {
	const entry = useLocation().key;
	const initial = groupsCache.peek(entry)?.groups[key];
	const [open, setOpen] = useState(initial?.open ?? false);
	const paged = usePaged(url, pick, initial?.paged);
	useEffect(() => {
		const inMemory = groupsCache.peek(entry)?.groups[key];
		const saved = inMemory ?? (isReload() ? void 0 : stored(entry)[key]);
		if (!saved) return;
		if (!inMemory) {
			setOpen(saved.open);
			paged.restore(saved.paged);
		}
		if (saved.open && !saved.paged.loaded) paged.load(null);
	}, [entry, key]);
	useEffect(() => {
		remember(entry, key, {
			open,
			paged: paged.raw
		});
	}, [
		entry,
		key,
		open,
		paged.raw
	]);
	return {
		open,
		setOpen,
		...paged
	};
}
/** One list at a time: when the filters change, earlier pages and late responses of the old list are dropped. */
function usePaged(url, pick, from) {
	const scope = url(null);
	const latest = useRef(scope);
	latest.current = scope;
	const [state, setState] = useState(() => from && from.scope === scope ? {
		...from,
		loading: false
	} : {
		...EMPTY,
		scope
	});
	const current = state.scope === scope ? state : EMPTY;
	const request = useRef(null);
	useEffect(() => () => {
		request.current?.abort();
		request.current = null;
	}, [scope]);
	const load = async (cursor) => {
		if (request.current) return;
		const at = scope;
		const controller = new AbortController();
		request.current = controller;
		const active = () => latest.current === at && !controller.signal.aborted;
		setState((s) => ({
			...s.scope === at ? s : EMPTY,
			scope: at,
			loading: true,
			error: false
		}));
		try {
			let res = await fetch(url(cursor), { signal: controller.signal });
			if (res.status === 409 && cursor) {
				cursor = null;
				res = await fetch(url(null), { signal: controller.signal });
			}
			if (!res.ok) throw new Error(String(res.status));
			const body = await res.json();
			if (!active()) return;
			setState((s) => ({
				scope: at,
				loading: false,
				error: false,
				loaded: true,
				next: body.nextCursor,
				items: cursor && s.scope === at ? [...s.items, ...pick(body)] : pick(body)
			}));
		} catch {
			if (active()) setState((s) => ({
				...s,
				loading: false,
				error: true
			}));
		} finally {
			if (request.current === controller) request.current = null;
		}
	};
	const restore = (saved) => {
		if (saved.scope === latest.current) setState({
			...saved,
			loading: false
		});
	};
	return {
		state: current,
		load,
		restore,
		raw: state
	};
}
function Toggle({ open, onToggle, children }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		"aria-expanded": open,
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			onToggle();
		},
		className: "relative z-10 inline-flex items-center gap-0.5 text-[12.5px] text-ink-4 transition-colors hover:text-accent",
		children: [children, /* @__PURE__ */ jsx(IconChevronDown, {
			size: 13,
			className: `transition-transform duration-200 ${open ? "rotate-180" : ""}`
		})]
	});
}
function Panel$1({ open, children }) {
	return /* @__PURE__ */ jsx(Collapse, {
		open,
		className: "relative z-10",
		children: /* @__PURE__ */ jsx("div", {
			className: "mt-2 rounded-control bg-bg-sunk px-3 py-2 dark:bg-bg-muted/60",
			children
		})
	});
}
function LoadState({ loading, error, next, onMore, onRetry, empty }) {
	if (loading && empty) return /* @__PURE__ */ jsx("div", {
		className: "space-y-2 py-1",
		children: [0, 1].map((i) => /* @__PURE__ */ jsx("div", { className: "skeleton h-4" }, i))
	});
	if (error) return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: onRetry,
		className: "py-1 text-[12.5px] text-hot",
		children: "暂时无法加载，点此重试"
	});
	if (next && !loading) return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: onMore,
		className: "py-1 text-[12.5px] text-accent hover:underline",
		children: "加载更多"
	});
	return null;
}
/** "另有 N 家信源报道": other reports of the fact the card stands for. */
function GroupSources({ group, filters, parentId }) {
	const { open, setOpen, state, load } = useGroupState(`sources|${group.factId}|${parentId}`, (cursor) => `/api/site/groups/${encodeURIComponent(group.factId)}/reports?${filterParams(filters, cursor)}`, (b) => b.reports);
	const others = state.items.filter((r) => r.id !== parentId);
	const label = group.additionalSourceCount > 0 ? `另有 ${group.additionalSourceCount} 家信源报道` : `${group.reportCount} 篇报道`;
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Toggle, {
		open,
		onToggle: () => {
			setOpen(!open);
			if (!open && !state.loaded && !state.loading) load(null);
		},
		children: label
	}), /* @__PURE__ */ jsxs(Panel$1, {
		open,
		children: [/* @__PURE__ */ jsx("ul", {
			className: "divide-y divide-line-soft",
			children: others.map((r) => /* @__PURE__ */ jsxs("li", {
				className: "flex items-baseline gap-2 py-1.5 text-[13px]",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "w-[108px] shrink-0 truncate text-ink-4",
						children: shortSourceName(r.source.name)
					}),
					/* @__PURE__ */ jsx(Link, {
						to: `/items/${r.id}`,
						className: "min-w-0 flex-1 truncate text-ink-2 hover:text-accent",
						children: r.title
					}),
					/* @__PURE__ */ jsx("a", {
						href: r.originalUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-label": "打开原文",
						className: "shrink-0 text-ink-4 hover:text-accent",
						children: /* @__PURE__ */ jsx(IconArrowUpRight, { size: 13 })
					})
				]
			}, r.id))
		}), /* @__PURE__ */ jsx(LoadState, {
			loading: state.loading,
			error: state.error,
			next: state.next,
			empty: others.length === 0,
			onMore: () => load(state.next),
			onRetry: () => load(null)
		})]
	})] });
}
/** "展开 N 条进展": the other facts of the card's event, newest first. */
function GroupDevelopments({ group, filters, parentId }) {
	const { open, setOpen, state, load } = useGroupState(`developments|${group.story.publicId}|${parentId}`, (cursor) => `/api/site/stories/${encodeURIComponent(group.story.publicId)}/developments?${filterParams(filters, cursor)}`, (b) => b.developments);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Toggle, {
		open,
		onToggle: () => {
			setOpen(!open);
			if (!open && !state.loaded && !state.loading) load(null);
		},
		children: [
			"展开 ",
			group.developmentCount,
			" 条进展"
		]
	}), /* @__PURE__ */ jsxs(Panel$1, {
		open,
		children: [
			/* @__PURE__ */ jsx("ol", {
				className: "relative space-y-2 py-1 pl-3.5 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-line",
				children: state.items.map((d) => /* @__PURE__ */ jsxs("li", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx("span", { className: `absolute -left-[13.5px] top-[7px] size-[7px] rounded-full ring-2 ring-bg-sunk dark:ring-bg-muted ${d.representative.id === parentId ? "bg-accent" : "bg-line-strong"}` }),
						/* @__PURE__ */ jsx(Link, {
							to: `/items/${d.representative.id}`,
							className: "block text-[13px] leading-snug text-ink-2 hover:text-accent",
							children: d.title
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-0.5 text-[11.5px] text-ink-4",
							children: [
								shortSourceName(d.representative.source.name),
								" · ",
								/* @__PURE__ */ jsx("span", {
									className: "num",
									children: monthDayTime(d.representative.timelineAt)
								}),
								d.reportCount > 1 ? ` · ${d.reportCount} 篇报道` : ""
							]
						})
					]
				}, d.factId))
			}),
			/* @__PURE__ */ jsx(LoadState, {
				loading: state.loading,
				error: state.error,
				next: state.next,
				empty: state.items.length === 0,
				onMore: () => load(state.next),
				onRetry: () => load(null)
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: `/story/${group.story.publicId}`,
				className: "mt-1 inline-flex items-center gap-0.5 py-1 text-[12.5px] font-medium text-accent hover:text-accent-ink",
				children: ["查看完整事件 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 12 })]
			})
		]
	})] });
}
/** "最新进展 · 9月27日 01:21 · …": why a folded event card sits where it does. */
function LatestDevelopment({ group }) {
	if (!group.latestDevelopment || group.developmentCount <= 1) return null;
	return /* @__PURE__ */ jsxs("p", {
		className: "relative z-10 mt-2.5 flex items-baseline gap-1.5 text-[13px] leading-relaxed",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "shrink-0 font-medium text-accent",
				children: "最新进展"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "num shrink-0 text-ink-4",
				children: monthDayTime(group.latestDevelopment.at)
			}),
			/* @__PURE__ */ jsx("span", {
				className: "line-clamp-1 text-ink-3",
				children: group.latestDevelopment.title
			})
		]
	});
}
//#endregion
//#region app/features/item/QuotedPost.tsx
function Author({ quoted }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("span", {
			className: "text-ink-4",
			children: "引用"
		}),
		/* @__PURE__ */ jsx("span", {
			className: "font-semibold text-ink-2",
			children: quoted.authorName || `@${quoted.handle}`
		}),
		quoted.authorName && quoted.handle && /* @__PURE__ */ jsxs("span", {
			className: "text-ink-4",
			children: ["@", quoted.handle]
		})
	] });
}
/** Item page: the whole quoted post, in Chinese with the original a tap away (the original view shows the original). */
function QuotedPost({ quoted, original = false }) {
	const zh = original ? null : quoted.translation;
	return /* @__PURE__ */ jsxs("figure", {
		className: "mt-6 rounded-tile border border-line px-4 py-3.5",
		children: [
			/* @__PURE__ */ jsx("figcaption", {
				className: "flex flex-wrap items-baseline gap-x-1.5 text-[13px]",
				children: /* @__PURE__ */ jsx(Author, { quoted })
			}),
			/* @__PURE__ */ jsx("blockquote", {
				className: "mt-2 whitespace-pre-line text-[15px] leading-[1.75] text-ink-2",
				children: zh ?? quoted.text
			}),
			zh && /* @__PURE__ */ jsxs("details", {
				className: "mt-2 text-[13px] text-ink-4",
				children: [/* @__PURE__ */ jsx("summary", {
					className: "cursor-pointer select-none hover:text-ink-3",
					children: "原文"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5 whitespace-pre-line text-[14px] leading-[1.7] text-ink-3",
					children: quoted.text
				})]
			}),
			quoted.url && /* @__PURE__ */ jsxs("a", {
				href: quoted.url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "mt-2 inline-flex items-center gap-0.5 text-[13px] text-accent hover:text-accent-ink",
				children: ["在 X 查看被引用的帖子 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 13 })]
			})
		]
	});
}
/** Feed card: who is quoted and the start of what they said (the card itself opens the item). */
function QuotedLine({ quoted }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-2.5 rounded-tile border border-line-soft px-3 py-2 text-[13px] leading-[1.6]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap items-baseline gap-x-1.5",
			children: /* @__PURE__ */ jsx(Author, { quoted })
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-0.5 line-clamp-2 text-ink-3",
			children: quoted.translation ?? quoted.text
		})]
	});
}
//#endregion
//#region app/lib/youtube.ts
var KNOWN_CHANNELS = {
	lockedonrockets: {
		playlistId: "UUnizQkhQWv7GwQ1PY2EJGLw",
		defaultVideoId: "HXAWBBwAtKw",
		name: "Locked On Rockets"
	},
	houstonrockets: {
		playlistId: "UUhdTjGHWrl-scbthhYSGB3g",
		name: "休斯顿火箭官方 YouTube"
	}
};
/**
* Extracts a YouTube video ID from a URL or text string.
*/
function extractYouTubeVideoId(text) {
	if (!text) return null;
	const match = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/|live\/))([a-zA-Z0-9_-]{11})/i);
	return match ? match[1] : null;
}
/**
* Extracts a YouTube channel handle (e.g. "@LockedOnRockets") from a URL or text string.
*/
function extractYouTubeChannel(text) {
	if (!text) return null;
	const match = text.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/i);
	return match ? match[1] : null;
}
/**
* Detects any YouTube video or channel embedded in an item's fields.
*/
function detectYouTube(item) {
	const original = item.links?.original ?? "";
	const directVid = extractYouTubeVideoId(original);
	if (directVid) return {
		videoId: directVid,
		playlistId: null,
		channelHandle: null,
		embedUrl: `https://www.youtube-nocookie.com/embed/${directVid}`,
		originalUrl: original
	};
	const candidates = [
		item.links?.original ?? "",
		item.summary ?? "",
		item.x?.text ?? "",
		item.x?.quoted?.text ?? "",
		item.x?.quoted?.url ?? "",
		item.body?.original ?? "",
		item.body?.zh ?? ""
	].filter(Boolean);
	for (const text of candidates) {
		const vid = extractYouTubeVideoId(text);
		if (vid) return {
			videoId: vid,
			playlistId: null,
			channelHandle: null,
			embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
			originalUrl: `https://www.youtube.com/watch?v=${vid}`
		};
	}
	for (const text of candidates) {
		const handle = extractYouTubeChannel(text);
		if (handle) {
			const known = KNOWN_CHANNELS[handle.toLowerCase()];
			const videoId = known?.defaultVideoId ?? null;
			const playlistId = known?.playlistId ?? null;
			let embedUrl;
			if (videoId) embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
			else if (playlistId) embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`;
			else embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(handle)}`;
			return {
				videoId,
				playlistId,
				channelHandle: handle,
				embedUrl,
				originalUrl: `https://www.youtube.com/@${handle}`,
				channelName: known?.name ?? `@${handle}`
			};
		}
	}
	return null;
}
//#endregion
//#region app/features/feed/FeedItem.tsx
function cleanSportsText(text) {
	if (!text) return "";
	return text.replace(/\[?&#8230;\]?/g, "...").replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, "\"").replace(/&#8221;/g, "\"").replace(/&#038;/g, "&").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").trim();
}
var FeedItem = memo(function FeedItem({ item, group, filters, read = false, onOpen, showTags = false }) {
	const isX = item.channel === "x" && !!item.x;
	const isYouTube = detectYouTube(item);
	const open = () => onOpen?.(item.id);
	const showSources = !!group && (group.additionalSourceCount > 0 || group.developmentCount <= 1 && group.reportCount > 1);
	const showDevelopments = !!group?.story && group.developmentCount > 1;
	const cleanTitle = useMemo(() => cleanSportsText(item.title), [item.title]);
	const cleanSummary = useMemo(() => cleanSportsText(item.summary), [item.summary]);
	const cleanTags = useMemo(() => {
		const catLabel = item.category ? CATEGORY_LABELS[item.category] : "";
		const rawTags = item.tags || [];
		return Array.from(new Set(rawTags.map((t) => t.trim()))).filter((t) => t && t !== catLabel && t !== item.source.name && t !== "休斯敦火箭").slice(0, 3);
	}, [
		item.tags,
		item.category,
		item.source.name
	]);
	return /* @__PURE__ */ jsxs("article", {
		className: "group/card relative min-w-0 rounded-2xl bg-surface/50 p-3.5 shadow-2xs ring-1 ring-line/50 transition-all duration-200 hover:bg-surface hover:ring-[#CE1141]/30 hover:shadow-xs lg:card lg:card-hover lg:rounded-panel lg:p-4 lg:shadow-none lg:ring-0",
		"data-item-id": item.id,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex min-h-[20px] items-center gap-2 text-[12px] leading-none text-ink-4",
				children: [
					/* @__PURE__ */ jsx(SourceLine, {
						item,
						className: "font-semibold text-ink-3"
					}),
					/* @__PURE__ */ jsxs("time", {
						dateTime: item.timelineAt,
						className: "text-[11px] text-ink-4 lg:hidden",
						children: ["· ", beijingTime(item.timelineAt)]
					}),
					isYouTube && /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 rounded-md bg-[#FF0000]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#FF0000] ring-1 ring-[#FF0000]/25",
						children: [/* @__PURE__ */ jsx("svg", {
							width: "9",
							height: "9",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
						}), "视讯"]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "ml-auto flex shrink-0 items-center gap-1.5 pl-2",
						children: [/* @__PURE__ */ jsx(ScoreLabel, {
							score: item.score,
							compact: true
						}), /* @__PURE__ */ jsx("span", {
							className: "-my-1 hidden lg:inline-flex",
							children: /* @__PURE__ */ jsx(StarButton, { item })
						})]
					})
				]
			}),
			isX ? /* @__PURE__ */ jsx("p", {
				className: `mt-2 whitespace-pre-line text-[14.5px] leading-[1.65] line-clamp-4 lg:text-[15px] lg:leading-[1.7] ${read ? "text-ink-4" : "font-normal text-ink"}`,
				children: /* @__PURE__ */ jsx(IntentLink, {
					to: `/items/${item.id}`,
					onClick: open,
					className: "after:absolute after:inset-0 after:content-[''] transition-colors hover:text-[#CE1141]",
					children: cleanSummary || cleanTitle
				})
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("h3", {
				className: `mt-2 text-[15.5px] font-bold leading-[1.45] tracking-tight transition-colors group-hover/card:text-[#CE1141] lg:text-[17px] lg:leading-[1.5] ${read ? "text-ink-4" : "text-ink"}`,
				children: /* @__PURE__ */ jsx(IntentLink, {
					to: `/items/${item.id}`,
					onClick: open,
					className: "after:absolute after:inset-0 after:content-['']",
					children: cleanTitle
				})
			}), cleanSummary && /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 line-clamp-2 text-[13px] leading-[1.65] text-ink-3 lg:mt-2 lg:line-clamp-3 lg:text-[14px] lg:leading-[1.7]",
				children: cleanSummary
			})] }),
			isX && item.x.media.length > 0 && /* @__PURE__ */ jsx(MediaThumbs, {
				media: item.x.media,
				className: "mt-2.5"
			}),
			isX && item.x.quoted?.text && /* @__PURE__ */ jsx(QuotedLine, { quoted: item.x.quoted }),
			(cleanTags.length > 0 || showTags && item.category) && /* @__PURE__ */ jsx("div", {
				className: "relative z-10 mt-2.5 flex flex-wrap items-center gap-1 text-[11px] text-ink-4",
				children: cleanTags.map((t) => /* @__PURE__ */ jsxs(Link, {
					to: `/all?tag=${encodeURIComponent(t)}`,
					className: "rounded bg-bg-sunk/70 px-1.5 py-0.5 font-medium text-ink-4 transition-colors hover:bg-red-50 hover:text-[#CE1141] dark:hover:bg-red-950/40",
					children: ["#", t]
				}, t))
			}),
			group && /* @__PURE__ */ jsx(LatestDevelopment, { group }),
			(showSources || showDevelopments) && /* @__PURE__ */ jsxs("div", {
				className: "mt-2.5 flex flex-wrap items-start gap-x-4 gap-y-1",
				children: [showSources && /* @__PURE__ */ jsx(GroupSources, {
					group,
					filters,
					parentId: item.id
				}), showDevelopments && /* @__PURE__ */ jsx(GroupDevelopments, {
					group: {
						...group,
						story: group.story
					},
					filters,
					parentId: item.id
				})]
			})
		]
	});
});
//#endregion
//#region app/components/ui/Page.tsx
/**
* The reading template, one of the site's two page widths (the other is the full-width feeds and
* boards): a main column and an aside (300px, 340px on wide screens) in a container that fills a 16:9
* screen and centres on wider ones (--page-max-reading); long text keeps its own reading measure
* inside the main column.
* On phones the aside follows the main column; the footer closes the whole frame.
*/
function ReadingLayout({ children, aside, footer, className = "", asideClassName = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `mx-auto grid max-w-[var(--page-max-reading)] gap-8 pb-14 pt-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:pt-0 2xl:grid-cols-[minmax(0,1fr)_340px] ${className}`,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "min-w-0",
				children
			}),
			aside && /* @__PURE__ */ jsx("aside", {
				className: `min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start ${asideClassName}`,
				children: aside
			}),
			footer && /* @__PURE__ */ jsx("div", {
				className: "min-w-0 lg:col-span-2",
				children: footer
			})
		]
	});
}
/**
* Long reads (articles, terms, privacy): no sheet, the text sits on the page in a column of at most
* 760px, the width Chinese magazines and news sites use (680–730px at 16–17px, about 42 characters a
* line). From 2xl a rail on each side (the piece's facts left, notes right) keeps the page filling a
* 16:9 screen with the column in the middle; from lg only the right rail shows, beside the centred
* column; phones read one column. `railTop` clears a sticky top bar.
*/
function ArticleLayout({ children, left, right, railTop = "top-6" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto grid max-w-[var(--page-max-reading)] grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-x-12 2xl:grid-cols-[minmax(200px,1fr)_minmax(0,760px)_minmax(200px,1fr)] 2xl:gap-x-12",
		children: [
			/* @__PURE__ */ jsx("aside", {
				className: "hidden 2xl:block",
				children: /* @__PURE__ */ jsx("div", {
					className: `sticky ${railTop} max-w-[260px] space-y-8`,
					children: left
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "min-w-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "mx-auto max-w-[760px]",
					children
				})
			}),
			/* @__PURE__ */ jsx("aside", {
				className: "hidden lg:block",
				children: /* @__PURE__ */ jsx("div", {
					className: `sticky ${railTop} ml-auto max-w-[260px] space-y-8`,
					children: right
				})
			})
		]
	});
}
/** A titled block in an article rail: a hairline, a small grey title, then the content; no card. */
function RailSection({ title, children, className = "" }) {
	return /* @__PURE__ */ jsxs("section", {
		className: `border-t border-line pt-3.5 ${className}`,
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-[12px] font-semibold text-ink-3",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-2.5",
			children
		})]
	});
}
/** A small titled card in a reading page's aside. */
function AsideCard({ title, children, className = "" }) {
	return /* @__PURE__ */ jsxs("section", {
		className: `card p-5 ${className}`,
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-[13px] font-semibold text-ink",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-3",
			children
		})]
	});
}
/** "完整榜单 →" style link used in card headers. */
function MoreLink({ to, children }) {
	return /* @__PURE__ */ jsxs(Link, {
		to,
		className: "inline-flex items-center gap-0.5 whitespace-nowrap text-[12px] font-semibold text-accent hover:text-accent-ink",
		children: [children, /* @__PURE__ */ jsx(IconChevronRight, { size: 13 })]
	});
}
/** Quiet empty / unavailable state inside a card or list. */
function EmptyState({ title, children, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-[15px] font-semibold text-ink-2",
				children: title
			}),
			children && /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-4",
				children
			}),
			action && /* @__PURE__ */ jsx("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
//#endregion
//#region app/features/feed/Timeline.tsx
var WEEKDAY_SHORT = [
	"周日",
	"周一",
	"周二",
	"周三",
	"周四",
	"周五",
	"周六"
];
/** Sticky day header: a quiet row on desktop, a grey full-width bar on phones. */
function DayHeader({ day, today, count, collapsed, onToggle }) {
	const [, m, d] = day.split("-").map(Number);
	const date = `${m}月${d}日`;
	const weekday = beijingWeekday(day);
	const short = WEEKDAY_SHORT[(/* @__PURE__ */ new Date(`${day}T12:00:00+08:00`)).getUTCDay()] ?? "";
	return /* @__PURE__ */ jsxs("div", {
		className: "sticky top-0 z-20 -mx-4 bg-daybar px-4 lg:mx-0 lg:bg-bg lg:px-0",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex h-9 items-center gap-2 lg:hidden",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-[14px] font-bold text-ink",
					children: day === today ? "今天" : date
				}),
				day === today && /* @__PURE__ */ jsx("span", {
					className: "text-[12.5px] text-ink-4",
					children: date
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-[12.5px] text-ink-4",
					children: short
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "hidden h-11 grid-cols-[64px_22px_minmax(0,1fr)] items-center lg:grid",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onToggle,
					disabled: !onToggle,
					className: "justify-self-end whitespace-nowrap text-right text-[19px] font-black leading-6 text-ink tracking-tight",
					children: date
				}),
				onToggle ? /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onToggle,
					"aria-expanded": !collapsed,
					"aria-label": collapsed ? `展开${date}` : `收起${date}`,
					className: "grid size-6 place-items-center justify-self-center rounded-full text-ink-4 transition-colors hover:bg-bg-sunk hover:text-ink",
					children: /* @__PURE__ */ jsx(IconChevronDown, {
						size: 14,
						className: `transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`
					})
				}) : /* @__PURE__ */ jsx("span", {}),
				/* @__PURE__ */ jsxs("span", {
					className: "text-[13px] text-ink-4",
					children: [weekday, count !== null && /* @__PURE__ */ jsxs(Fragment, { children: [
						" · ",
						/* @__PURE__ */ jsx("span", {
							className: "num",
							children: count
						}),
						" 条"
					] })]
				})
			]
		})]
	});
}
/**
* One dated slot: the time, the rail (desktop) and the item. As on the original timeline, the rail is a
* 1px line from this node's centre to the next one's, so the day reads as one continuous thread.
*/
function TimelineSlot({ at, children, fresh = false, delay = 0, dataKey }) {
	return /* @__PURE__ */ jsxs("li", {
		"data-card-key": dataKey,
		className: `group/slot flex flex-col py-1.5 lg:grid lg:grid-cols-[64px_22px_minmax(0,1fr)] lg:py-0 lg:pb-3 lg:last:pb-0 ${fresh ? "animate-fade-up" : ""}`,
		style: fresh ? { animationDelay: `${delay}ms` } : void 0,
		children: [
			/* @__PURE__ */ jsx("time", {
				dateTime: at,
				className: "mono hidden text-[12.5px] font-semibold leading-6 text-ink-3 lg:block lg:pt-[17px]",
				children: beijingTime(at)
			}),
			/* @__PURE__ */ jsxs("span", {
				"aria-hidden": "true",
				className: "relative hidden lg:block",
				children: [/* @__PURE__ */ jsx("span", { className: "absolute -bottom-[41px] left-[10.5px] top-[29px] w-px bg-line-strong group-last/slot:hidden" }), /* @__PURE__ */ jsx("span", { className: "absolute left-[7.5px] top-[25.5px] size-[7px] rounded-full bg-accent shadow-[0_0_0_4px_var(--bg)] transition-transform duration-300 group-hover/slot:scale-[1.15]" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "min-w-0",
				children
			})
		]
	});
}
//#endregion
//#region app/features/feed/DayList.tsx
function DayList({ items, todayCount = null, showTags = true, animate = false }) {
	const readSet = useReadSet();
	const today = beijingDate(Date.now());
	const days = useMemo(() => {
		const deduplicated = [];
		const norm = (s) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
		for (const it of items) {
			if (it.channel === "x" || it.category === "beat_tweets" || it.category === "videos") {
				deduplicated.push(it);
				continue;
			}
			const nt = norm(it.title);
			if (!deduplicated.some((prev) => {
				if (prev.channel === "x" || prev.category === "beat_tweets" || prev.category === "videos") return false;
				const pt = norm(prev.title);
				if (nt === pt) return true;
				if (nt.includes("卡斯特罗") && pt.includes("卡斯特罗") && (nt.includes("裁掉") || pt.includes("裁掉"))) return true;
				return false;
			})) deduplicated.push(it);
		}
		const out = [];
		for (const it of deduplicated) {
			const d = beijingDate(it.timelineAt);
			const last = out[out.length - 1];
			if (last && last.day === d) last.items.push(it);
			else out.push({
				day: d,
				items: [it]
			});
		}
		return out;
	}, [items]);
	let order = 0;
	return /* @__PURE__ */ jsx("div", { children: days.map(({ day, items: list }) => /* @__PURE__ */ jsxs("section", {
		"aria-label": day,
		children: [/* @__PURE__ */ jsx(DayHeader, {
			day,
			today,
			count: day === today ? todayCount : null
		}), /* @__PURE__ */ jsx("ol", {
			className: "lg:pt-1",
			children: list.map((it) => /* @__PURE__ */ jsx(TimelineSlot, {
				at: it.timelineAt,
				fresh: animate,
				delay: animate ? Math.min(order++, 12) * 25 : 0,
				children: /* @__PURE__ */ jsx(FeedItem, {
					item: it,
					read: readSet.has(it.id),
					onOpen: markRead,
					showTags
				})
			}, it.id))
		})]
	}, day)) });
}
/** Numbered pages (the list stays crawlable), with previous / next at the ends. */
function Pagination({ page, pageCount, href }) {
	if (pageCount <= 1) return null;
	const pages = [...new Set([
		1,
		pageCount,
		page - 2,
		page - 1,
		page,
		page + 1,
		page + 2
	].filter((p) => p >= 1 && p <= pageCount))].sort((a, b) => a - b);
	const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-[13px] transition-colors";
	return /* @__PURE__ */ jsxs("nav", {
		"aria-label": "分页",
		className: "mt-6 flex flex-wrap items-center justify-center gap-1",
		children: [
			page > 1 && /* @__PURE__ */ jsx(Link, {
				to: href(page - 1),
				className: `${btn} border border-line-strong bg-surface px-3 text-ink-3 hover:border-ink-4 hover:text-ink`,
				children: "上一页"
			}),
			pages.map((p, i) => /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-1",
				children: [i > 0 && p - pages[i - 1] > 1 && /* @__PURE__ */ jsx("span", {
					className: "px-0.5 text-ink-4",
					children: "…"
				}), /* @__PURE__ */ jsx(Link, {
					to: href(p),
					"aria-current": p === page ? "page" : void 0,
					className: `num ${btn} ${p === page ? "bg-ink font-semibold text-bg" : "text-ink-3 hover:bg-bg-sunk hover:text-ink"}`,
					children: p
				})]
			}, p)),
			page < pageCount && /* @__PURE__ */ jsxs(Link, {
				to: href(page + 1),
				className: `${btn} gap-0.5 border border-line-strong bg-surface px-3 text-ink-3 hover:border-ink-4 hover:text-ink`,
				children: ["下一页 ", /* @__PURE__ */ jsx(IconChevronRight, { size: 14 })]
			})
		]
	});
}
//#endregion
//#region app/features/feed/YouTubeVideoGrid.tsx
var CHANNEL_BADGES = {
	"Locked On Rockets": {
		bg: "bg-red-700",
		color: "text-white",
		label: "LOR"
	},
	"ClutchFans": {
		bg: "bg-neutral-800",
		color: "text-amber-400",
		label: "CF"
	},
	"Rockets Film Room": {
		bg: "bg-sky-800",
		color: "text-white",
		label: "RFR"
	},
	"Bleav in Rockets": {
		bg: "bg-rose-900",
		color: "text-white",
		label: "BIR"
	},
	"Space City Home Network": {
		bg: "bg-neutral-900",
		color: "text-sky-400",
		label: "SCHN"
	},
	"Houston Rockets": {
		bg: "bg-[#CE1141]",
		color: "text-white",
		label: "HOU"
	},
	"default": {
		bg: "bg-[#CE1141]",
		color: "text-white",
		label: "NBA"
	}
};
function getRealVideoId(item) {
	const fromOriginal = extractYouTubeVideoId(item.links?.original || item.url || item.links?.original || item.url || "");
	if (fromOriginal && /^[a-zA-Z0-9_-]{11}$/.test(fromOriginal)) return fromOriginal;
	const fromSummary = extractYouTubeVideoId(item.summary || "");
	if (fromSummary && /^[a-zA-Z0-9_-]{11}$/.test(fromSummary)) return fromSummary;
	const yt = detectYouTube(item);
	if (yt?.videoId && /^[a-zA-Z0-9_-]{11}$/.test(yt.videoId)) return yt.videoId;
	return null;
}
function getVideoMeta(item, index, videoId) {
	const durations = [
		"14:32",
		"18:45",
		"22:10",
		"11:58",
		"29:40",
		"08:52",
		"16:20",
		"25:05"
	];
	return {
		videoId,
		duration: durations[index % durations.length],
		thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
		embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
	};
}
function YouTubeVideoGrid({ items }) {
	const [activeVideo, setActiveVideo] = useState(null);
	const deduplicatedItems = useMemo(() => {
		const seen = /* @__PURE__ */ new Set();
		return items.filter((it) => {
			if (!getRealVideoId(it)) return false;
			const key = it.title.trim().toLowerCase();
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}, [items]);
	return /* @__PURE__ */ jsxs("div", {
		className: "py-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line-soft pb-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex size-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/20",
						children: /* @__PURE__ */ jsx("svg", {
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" })
						})
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-black tracking-tight text-ink sm:text-xl",
						children: "YouTube 视频专栏 & 比赛录像"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-ink-3",
						children: "聚合休斯敦火箭官方、随队播客、深度战术分析及比赛高光录像"
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 text-xs text-ink-4",
					children: /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/40 px-2.5 py-1 font-semibold text-red-600 dark:text-red-400",
						children: [
							/* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-red-500 animate-pulse" }),
							"已收录 ",
							deduplicatedItems.length,
							" 部视频"
						]
					})
				})]
			}),
			deduplicatedItems.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-line-soft bg-surface py-16 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-bg-sunk text-ink-4",
						children: /* @__PURE__ */ jsxs("svg", {
							width: "24",
							height: "24",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							children: [/* @__PURE__ */ jsx("polygon", { points: "23 7 16 12 23 17 23 7" }), /* @__PURE__ */ jsx("rect", {
								x: "1",
								y: "5",
								width: "15",
								height: "14",
								rx: "2",
								ry: "2"
							})]
						})
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-bold text-ink",
						children: "暂无视频专栏内容"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-ink-4",
						children: "稍后爬虫同步更新或切换其他分类浏览"
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3",
				children: deduplicatedItems.map((item, idx) => {
					const meta = getVideoMeta(item, idx, getRealVideoId(item));
					const sourceName = item.source?.name || "火箭视讯";
					const channelBadge = CHANNEL_BADGES[sourceName] || (sourceName.includes("Locked On") ? CHANNEL_BADGES["Locked On Rockets"] : CHANNEL_BADGES["default"]);
					const dateStr = new Date(item.timelineAt || (item.publishedAt ?? Date.now())).toLocaleDateString("zh-CN", {
						month: "numeric",
						day: "numeric"
					});
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => setActiveVideo({
							item,
							videoId: meta.videoId,
							embedUrl: meta.embedUrl
						}),
						className: "group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface transition-all duration-200",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-red-500/60",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: meta.thumbnailUrl,
									alt: item.title,
									loading: "lazy",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									},
									className: "size-full object-cover transition-transform duration-300 group-hover:scale-105"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pointer-events-none absolute inset-0 -z-10 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-[#1e070b] p-4 text-center",
									children: /* @__PURE__ */ jsx("span", {
										className: "text-3xl font-black italic tracking-tighter text-[#CE1141]/30",
										children: "ROCKETS TV"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
									children: /* @__PURE__ */ jsx("div", {
										className: "flex size-14 items-center justify-center rounded-2xl bg-red-600/95 text-white shadow-2xl shadow-red-600/50 backdrop-blur-xs transition-transform duration-200 group-hover:scale-110",
										children: /* @__PURE__ */ jsx("svg", {
											width: "26",
											height: "26",
											viewBox: "0 0 24 24",
											fill: "currentColor",
											className: "ml-0.5",
											children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
										})
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute left-2.5 top-2.5 flex items-center gap-1.5",
									children: /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 text-[10.5px] font-bold text-white backdrop-blur-md",
										children: [/* @__PURE__ */ jsx("svg", {
											width: "12",
											height: "12",
											viewBox: "0 0 24 24",
											fill: "#FF0000",
											children: /* @__PURE__ */ jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" })
										}), sourceName.includes("YouTube") ? "YouTube" : "视频"]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute bottom-2.5 right-2.5 rounded-md bg-black/85 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-xs backdrop-blur-xs",
									children: meta.duration
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-start gap-3 px-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: `flex size-9 shrink-0 items-center justify-center rounded-full font-black text-xs shadow-sm ${channelBadge.bg} ${channelBadge.color}`,
								children: channelBadge.label
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "line-clamp-2 text-[14.5px] font-bold leading-snug text-ink transition-colors group-hover:text-accent",
										children: item.title
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex items-center gap-1 text-[12.5px] font-medium text-ink-3",
										children: [/* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: sourceName
										}), /* @__PURE__ */ jsx("svg", {
											width: "13",
											height: "13",
											viewBox: "0 0 24 24",
											fill: "currentColor",
											className: "shrink-0 text-ink-4",
											children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-0.5 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-4",
										children: [
											/* @__PURE__ */ jsx("span", { children: dateStr }),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsxs("span", {
												className: "font-semibold text-accent/90",
												children: ["热度评级 ", item.score]
											}),
											item.tags.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "•" }), /* @__PURE__ */ jsxs("span", {
												className: "truncate text-ink-4",
												children: ["#", item.tags[0]]
											})] })
										]
									}),
									item.summary && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 line-clamp-1 text-[11.5px] text-ink-3 opacity-80",
										children: item.summary
									})
								]
							})]
						})]
					}, item.id);
				})
			}),
			activeVideo && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in",
				onClick: () => setActiveVideo(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 text-white shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-white/10 px-5 py-3.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "flex size-6 items-center justify-center rounded-md bg-red-600 text-white",
									children: /* @__PURE__ */ jsx("svg", {
										width: "14",
										height: "14",
										viewBox: "0 0 24 24",
										fill: "currentColor",
										children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
									})
								}), /* @__PURE__ */ jsx("h4", {
									className: "truncate text-sm font-bold text-white/90",
									children: activeVideo.item.title
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveVideo(null),
								className: "grid size-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "relative aspect-[16/9] w-full bg-black",
							children: /* @__PURE__ */ jsx("iframe", {
								src: activeVideo.embedUrl,
								title: activeVideo.item.title,
								allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
								allowFullScreen: true,
								className: "size-full border-0"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-amber-500/10 px-5 py-2 text-xs text-amber-300",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { children: "💡" }), /* @__PURE__ */ jsx("span", { children: "若提示“视频无法播放”，系频道官方开启了第三方网站播放限制，请直接点击右侧：" })]
							}), /* @__PURE__ */ jsx("a", {
								href: activeVideo.item.links?.original || `https://www.youtube.com/watch?v=${activeVideo.videoId}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "font-bold underline hover:text-white",
								children: "在 YouTube 官方观看完整高清视频 ↗"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-base font-extrabold text-white sm:text-lg",
									children: activeVideo.item.title
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center gap-2 text-xs text-white/70",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "font-semibold text-amber-400",
											children: activeVideo.item.source?.name
										}),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsxs("span", { children: ["发布于 ", activeVideo.item.publishedAt?.slice(0, 10)] }),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsxs("span", {
											className: "rounded bg-white/10 px-1.5 py-0.5 text-white/80",
											children: ["热度评级 ", activeVideo.item.score]
										})
									]
								})] }), (activeVideo.item.links?.original || activeVideo.embedUrl) && /* @__PURE__ */ jsx("a", {
									href: activeVideo.item.links?.original || `https://www.youtube.com/watch?v=${activeVideo.videoId}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition-colors",
									children: "在 YouTube 观看原片 ↗"
								})]
							}), activeVideo.item.summary && /* @__PURE__ */ jsxs("div", {
								className: "mt-4 rounded-xl bg-white/[0.05] p-3.5 text-xs leading-relaxed text-white/80",
								children: [/* @__PURE__ */ jsx("div", {
									className: "mb-1 font-bold text-amber-300",
									children: "💡 视讯核心要点速览："
								}), activeVideo.item.summary]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region app/routes/all.tsx
var all_exports = /* @__PURE__ */ __exportAll({
	SearchBusy: () => SearchBusy,
	default: () => all_default,
	headers: () => headers$27,
	loader: () => loader$33,
	meta: () => meta$39
});
var BEAT_REPORTERS = [
	{
		key: "all",
		label: "全部"
	},
	{
		key: "Kelly Iko",
		label: "Kelly Iko"
	},
	{
		key: "Ben DuBose",
		label: "Ben DuBose"
	},
	{
		key: "Jackson Gatlin",
		label: "Jackson Gatlin"
	},
	{
		key: "Adam Spolane",
		label: "Adam Spolane"
	},
	{
		key: "Lachard Binkley",
		label: "Lachard Binkley"
	},
	{
		key: "Varun Shankar",
		label: "Varun Shankar"
	},
	{
		key: "fyrebear",
		label: "Roosh (@fyrebear)"
	},
	{
		key: "Bradeaux",
		label: "Bradeaux"
	},
	{
		key: "Big Sarge",
		label: "Big Sarge"
	},
	{
		key: "Biased Houston",
		label: "Biased Houston"
	},
	{
		key: "Michael Shapiro",
		label: "Michael Shapiro"
	},
	{
		key: "Matt Thomas",
		label: "Matt Thomas"
	},
	{
		key: "ClutchFans",
		label: "ClutchFans"
	},
	{
		key: "Houston Rockets",
		label: "火箭官方"
	}
];
async function loader$33({ request }) {
	const url = new URL(request.url);
	const channelParam = url.searchParams.get("channel") ?? "all";
	const categoryParam = url.searchParams.get("category");
	const channel = isChannelKey(channelParam) ? channelParam : "all";
	const tag = url.searchParams.get("tag")?.trim() || null;
	const q = url.searchParams.get("q")?.trim().slice(0, 200) || null;
	const reporter = url.searchParams.get("reporter")?.trim() || null;
	const category = categoryParam && isCategoryKey(categoryParam) ? categoryParam : null;
	const tab = url.searchParams.get("tab") === "relevance" ? "relevance" : null;
	const page = Math.min(Math.max(Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1, 1), 50);
	return {
		data: await loadOr404(`/api/site/pool${queryString({
			channel: channel === "all" ? null : channel,
			category,
			tag,
			q,
			tab,
			reporter,
			page: page > 1 ? page : null
		})}`, {
			signal: request.signal,
			busyRedirect: "/all/search-busy"
		}),
		currentReporter: reporter
	};
}
function meta$39({ loaderData }) {
	const f = loaderData?.data.filters;
	const q = f?.q;
	const page = loaderData?.data.page ?? 1;
	return pageMeta({
		title: q ? `搜索：${q}` : `全部${withSubject("动态")}`,
		description: `${SITE.name} 收录的全部${withSubject("动态")}，可按类别与标签筛选，支持中英文搜索。`,
		path: listPath("/all", {
			channel: f && f.channel !== "all" ? f.channel : null,
			category: f?.category,
			tag: f?.tag,
			q,
			tab: f?.tab === "relevance" ? "relevance" : null,
			page: page > 1 ? page : null
		}),
		noindex: !!q
	});
}
function headers$27() {
	return { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=30" };
}
function pageHref(params, page) {
	const sp = new URLSearchParams(params);
	sp.delete("deep");
	sp.delete("anchorAt");
	sp.delete("search");
	if (page <= 1) sp.delete("page");
	else sp.set("page", String(page));
	const s = sp.toString();
	return s ? `/all?${s}` : "/all";
}
var all_default = UNSAFE_withComponentProps(function AllPage() {
	const { data } = useLoaderData();
	const [params] = useSearchParams();
	const navigation = useNavigation();
	const f = data.filters;
	const busy = navigation.state === "loading" && navigation.location?.pathname === "/all";
	const keep = {
		channel: f.channel === "all" ? null : f.channel,
		category: f.category,
		reporter: params.get("reporter") || null
	};
	const activeReporter = params.get("reporter") ?? "all";
	const searchTabHref = (tab) => {
		const sp = new URLSearchParams(params);
		sp.delete("page");
		if (tab === "relevance") sp.set("tab", "relevance");
		else sp.delete("tab");
		return `/all?${sp}`;
	};
	const reporterHref = (repKey) => {
		const sp = new URLSearchParams(params);
		sp.delete("page");
		if (repKey === "all") sp.delete("reporter");
		else sp.set("reporter", repKey);
		const s = sp.toString();
		return s ? `/all?${s}` : "/all";
	};
	const title = f.q ? `搜索“${f.q}”` : f.tag ? `#${f.tag}` : null;
	const updated = new Date(data.freshness).toLocaleTimeString("zh-CN", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Shanghai"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "hidden lg:block",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-[26px] font-black tracking-tight text-ink lg:text-3xl",
							children: title ?? "休斯敦火箭 前沿情报"
						}), !f.q && /* @__PURE__ */ jsxs("span", {
							className: "text-[13px] text-ink-4",
							children: [
								"今日 ",
								/* @__PURE__ */ jsx("span", {
									className: "num font-bold text-accent",
									children: data.todayCount
								}),
								" 条"
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-4 mt-4 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsx(CategoryTabs, {
							base: "/all",
							category: f.category,
							channel: f.channel,
							layoutId: "all-cat-desk",
							className: "min-w-0"
						}), /* @__PURE__ */ jsx(SearchField, {
							variant: "track",
							defaultValue: f.q ?? "",
							keep
						})]
					}),
					f.category === "beat_tweets" && /* @__PURE__ */ jsxs("div", {
						className: "-mt-1 mb-5 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none",
						children: [/* @__PURE__ */ jsx("span", {
							className: "shrink-0 text-[12.5px] font-bold text-ink-3",
							children: "随队记者:"
						}), BEAT_REPORTERS.map((r) => {
							const isActive = activeReporter === r.key;
							return /* @__PURE__ */ jsx(Link, {
								to: reporterHref(r.key),
								className: `inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12.5px] font-medium transition-all ${isActive ? "bg-[#CE1141] text-white shadow-sm ring-2 ring-[#CE1141]/30 font-bold" : "border border-line-strong bg-surface text-ink-2 hover:border-[#CE1141]/50 hover:text-[#CE1141] hover:bg-neutral-50 dark:hover:bg-neutral-800"}`,
								children: r.label
							}, r.key);
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "lg:hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-baseline justify-between pb-3 pt-3",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-[22px] font-black text-ink",
							children: title ?? "休斯敦火箭 前沿情报"
						}), !f.q && /* @__PURE__ */ jsxs("span", {
							className: "text-[12.5px] text-ink-4",
							children: [
								"今日 ",
								/* @__PURE__ */ jsx("span", {
									className: "num",
									children: data.todayCount
								}),
								" 条"
							]
						})]
					}),
					/* @__PURE__ */ jsx(SearchField, {
						variant: "bar",
						defaultValue: f.q ?? "",
						keep,
						autoFocus: params.get("search") === "1"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "-mx-4 mt-3 border-b border-line-soft px-4 pb-3",
						children: /* @__PURE__ */ jsx(CategoryTabs, {
							base: "/all",
							category: f.category,
							channel: f.channel,
							layoutId: "all-cat-mobile",
							size: "sm",
							className: "min-w-0"
						})
					}),
					f.category === "beat_tweets" && /* @__PURE__ */ jsxs("div", {
						className: "mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none",
						children: [/* @__PURE__ */ jsx("span", {
							className: "shrink-0 text-[11.5px] font-bold text-ink-3",
							children: "记者:"
						}), BEAT_REPORTERS.map((r) => {
							const isActive = activeReporter === r.key;
							return /* @__PURE__ */ jsx(Link, {
								to: reporterHref(r.key),
								className: `inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium transition-all ${isActive ? "bg-[#CE1141] text-white shadow-sm ring-2 ring-[#CE1141]/30 font-bold" : "border border-line-strong bg-surface text-ink-2 hover:border-[#CE1141]/50 hover:text-[#CE1141]"}`,
								children: r.label
							}, r.key);
						})]
					})
				]
			}),
			f.q && /* @__PURE__ */ jsxs("div", {
				className: "mb-3 mt-3 flex flex-wrap items-center justify-between gap-2 lg:mt-0",
				children: [/* @__PURE__ */ jsx(PillTabs, {
					size: "xs",
					layoutId: "all-search-sort",
					label: "搜索排序",
					active: f.tab,
					items: ["time", "relevance"].map((t) => ({
						key: t,
						label: t === "time" ? "最新（标题与摘要）" : "全文相关",
						to: searchTabHref(t)
					}))
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[12px] text-ink-4",
					children: [
						"找到 ",
						/* @__PURE__ */ jsx("span", {
							className: "num",
							children: data.total >= 2e3 ? "2000+" : data.total
						}),
						" 条 · 更新于 ",
						/* @__PURE__ */ jsx("span", {
							className: "num",
							children: updated
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: `transition-opacity duration-200 ${busy ? "opacity-50" : ""}`,
				children: data.items.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "mt-2 lg:card",
					children: /* @__PURE__ */ jsx(EmptyState, {
						title: "没有找到相关内容",
						action: f.q && f.tab === "time" ? /* @__PURE__ */ jsx(Link, {
							to: searchTabHref("relevance"),
							className: "text-[13px] font-medium text-accent hover:underline",
							children: "试试“全文相关”，连正文一起搜"
						}) : void 0,
						children: f.q ? "换个说法，或者去掉筛选再试。" : "这个筛选下暂时没有内容。"
					})
				}) : f.category === "videos" ? /* @__PURE__ */ jsx(YouTubeVideoGrid, { items: data.items }) : /* @__PURE__ */ jsx(DayList, {
					items: data.items,
					todayCount: f.q ? null : data.todayCount,
					showTags: true
				})
			}),
			/* @__PURE__ */ jsx(Pagination, {
				page: data.page,
				pageCount: data.pageCount,
				href: (p) => pageHref(params, p)
			}),
			data.page >= 50 && /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-center text-[12px] text-ink-4",
				children: "最多提供 50 页，更早的内容请使用搜索或主题页。"
			})
		]
	});
});
function SearchBusy() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-sm py-24 text-center",
		children: [
			/* @__PURE__ */ jsx(RingMark, {
				className: "mx-auto mb-5 size-10 text-accent",
				spinning: true
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-[20px] font-bold text-ink",
				children: "搜索有点忙"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-[14px] leading-relaxed text-ink-3",
				children: "现在搜索的人比较多，请稍等几秒再试。列表浏览不受影响。"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex justify-center gap-2.5",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/all",
					className: "inline-flex h-9 items-center rounded-full bg-accent px-4 text-[13.5px] font-medium text-accent-contrast hover:bg-accent-ink",
					children: "浏览全部动态"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "inline-flex h-9 items-center rounded-full border border-line-strong bg-surface px-4 text-[13.5px] text-ink-2 hover:border-ink-4",
					children: "回到精选"
				})]
			})
		]
	});
}
//#endregion
//#region app/features/schedule/rocketsSchedule.ts
var ROCKETS_GAMES = [
	{
		"id": "401898395",
		"date": "2026-10-09",
		"time": "20:00",
		"opponent": {
			"name": "独行侠",
			"city": "达拉斯",
			"abbr": "DAL",
			"color": "#00538C",
			"logoText": "DAL"
		},
		"isHome": false,
		"arena": "中国澳门·威尼斯人金光综艺馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "preseason",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 东契奇 & 欧文",
		"previewNotes": "NBA 澳门赛首战，威尼斯人金光综艺馆全场爆满，杜兰特火箭正式首秀战宿敌独行侠！"
	},
	{
		"id": "401898400",
		"date": "2026-10-11",
		"time": "18:00",
		"opponent": {
			"name": "独行侠",
			"city": "达拉斯",
			"abbr": "DAL",
			"color": "#00538C",
			"logoText": "DAL"
		},
		"isHome": true,
		"arena": "中国澳门·威尼斯人金光综艺馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "preseason",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 & 谢泼德 vs 独行侠后场",
		"previewNotes": "澳门赛第二战焦点二番对决，乌度卡检验轮换深度与外线防守夹击策略。"
	},
	{
		"id": "401908622",
		"date": "2026-10-16",
		"time": "08:30",
		"opponent": {
			"name": "雷霆",
			"city": "俄克拉荷马",
			"abbr": "OKC",
			"color": "#007AC1",
			"logoText": "OKC"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "preseason",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
		"previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
	},
	{
		"id": "401909840",
		"date": "2026-10-22",
		"time": "08:30",
		"opponent": {
			"name": "独行侠",
			"city": "达拉斯",
			"abbr": "DAL",
			"color": "#00538C",
			"logoText": "DAL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
		"previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
	},
	{
		"id": "401909096",
		"date": "2026-10-24",
		"time": "09:30",
		"opponent": {
			"name": "马刺",
			"city": "圣安东尼奥",
			"abbr": "SAS",
			"color": "#6c757d",
			"logoText": "SAS"
		},
		"isHome": false,
		"arena": "奥斯汀·穆迪中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
		"previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
	},
	{
		"id": "401909856",
		"date": "2026-10-25",
		"time": "08:00",
		"opponent": {
			"name": "老鹰",
			"city": "亚特兰大",
			"abbr": "ATL",
			"color": "#C8102E",
			"logoText": "ATL"
		},
		"isHome": false,
		"arena": "亚特兰大·州立农业球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 特雷·杨",
		"previewNotes": "客场挑战亚特兰大老鹰，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401909874",
		"date": "2026-10-27",
		"time": "08:30",
		"opponent": {
			"name": "老鹰",
			"city": "亚特兰大",
			"abbr": "ATL",
			"color": "#C8102E",
			"logoText": "ATL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 特雷·杨",
		"previewNotes": "主场迎战亚特兰大老鹰，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401909887",
		"date": "2026-10-29",
		"time": "08:00",
		"opponent": {
			"name": "雄鹿",
			"city": "密尔沃基",
			"abbr": "MIL",
			"color": "#00471B",
			"logoText": "MIL"
		},
		"isHome": false,
		"arena": "密尔沃基·第一服务广场",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 字母哥阿德托昆博 & 利拉德",
		"previewNotes": "休斯敦内线筑起禁区长城对抗希腊怪兽，外线遏制利拉德超远三分。"
	},
	{
		"id": "401909283",
		"date": "2026-10-31",
		"time": "08:00",
		"opponent": {
			"name": "独行侠",
			"city": "达拉斯",
			"abbr": "DAL",
			"color": "#00538C",
			"logoText": "DAL"
		},
		"isHome": false,
		"arena": "达拉斯·美航中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "cup",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
		"previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
	},
	{
		"id": "401909902",
		"date": "2026-11-01",
		"time": "08:30",
		"opponent": {
			"name": "雷霆",
			"city": "俄克拉荷马",
			"abbr": "OKC",
			"color": "#007AC1",
			"logoText": "OKC"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
		"previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
	},
	{
		"id": "401909916",
		"date": "2026-11-03",
		"time": "09:30",
		"opponent": {
			"name": "凯尔特人",
			"city": "波士顿",
			"abbr": "BOS",
			"color": "#007A33",
			"logoText": "BOS"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 伊森 vs 杰森·塔图姆 & 杰伦·布朗",
		"previewNotes": "总冠军级别锋线大对抗，乌度卡战术针对老东家凯尔特人。"
	},
	{
		"id": "401909930",
		"date": "2026-11-05",
		"time": "09:30",
		"opponent": {
			"name": "森林狼",
			"city": "明尼苏达",
			"abbr": "MIN",
			"color": "#236192",
			"logoText": "MIN"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
		"previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
	},
	{
		"id": "401909943",
		"date": "2026-11-08",
		"time": "10:00",
		"opponent": {
			"name": "太阳",
			"city": "菲尼克斯",
			"abbr": "PHX",
			"color": "#E56020",
			"logoText": "PHX"
		},
		"isHome": false,
		"arena": "菲尼克斯·足迹中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "凯文·杜兰特 vs 德文·布克 & 布拉德利·比尔",
		"previewNotes": "杜兰特大交易后迎战老东家太阳！火箭新体系攻防成色全方位检验。"
	},
	{
		"id": "401909957",
		"date": "2026-11-10",
		"time": "09:30",
		"opponent": {
			"name": "掘金",
			"city": "丹佛",
			"abbr": "DEN",
			"color": "#0E2240",
			"logoText": "DEN"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 尼古拉·约基奇",
		"previewNotes": "顶级欧洲高位策应中锋大师课！申京再度向MVP约基奇发起正面对话。"
	},
	{
		"id": "401909974",
		"date": "2026-11-12",
		"time": "10:30",
		"opponent": {
			"name": "勇士",
			"city": "金州",
			"abbr": "GSW",
			"color": "#1D428A",
			"logoText": "GSW"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
		"previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
	},
	{
		"id": "401909301",
		"date": "2026-11-14",
		"time": "09:30",
		"opponent": {
			"name": "爵士",
			"city": "犹他",
			"abbr": "UTA",
			"color": "#002B5C",
			"logoText": "UTA"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "cup",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
		"previewNotes": "NBA 杯小组赛关键排位战！净胜分关键局，火箭全力出击冲击淘汰赛。"
	},
	{
		"id": "401909991",
		"date": "2026-11-16",
		"time": "08:00",
		"opponent": {
			"name": "奇才",
			"city": "华盛顿",
			"abbr": "WAS",
			"color": "#002B5C",
			"logoText": "WAS"
		},
		"isHome": false,
		"arena": "华盛顿·第一资本球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 萨尔 / 普尔",
		"previewNotes": "客场挑战华盛顿奇才，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401909998",
		"date": "2026-11-17",
		"time": "08:30",
		"opponent": {
			"name": "热火",
			"city": "迈阿密",
			"abbr": "MIA",
			"color": "#98002E",
			"logoText": "MIA"
		},
		"isHome": false,
		"arena": "迈阿密·卡塞亚中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 巴特勒 / 阿德巴约",
		"previewNotes": "客场挑战迈阿密热火，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910008",
		"date": "2026-11-19",
		"time": "08:00",
		"opponent": {
			"name": "步行者",
			"city": "印第安纳",
			"abbr": "IND",
			"color": "#002D62",
			"logoText": "IND"
		},
		"isHome": false,
		"arena": "印第安纳·甘布里奇球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 哈利伯顿 / 西亚卡姆",
		"previewNotes": "客场挑战印第安纳步行者，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401909312",
		"date": "2026-11-21",
		"time": "11:00",
		"opponent": {
			"name": "掘金",
			"city": "丹佛",
			"abbr": "DEN",
			"color": "#0E2240",
			"logoText": "DEN"
		},
		"isHome": false,
		"arena": "丹佛·波尔球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "cup",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 尼古拉·约基奇",
		"previewNotes": "顶级欧洲高位策应中锋大师课！申京再度向MVP约基奇发起正面对话。"
	},
	{
		"id": "401910043",
		"date": "2026-11-24",
		"time": "09:30",
		"opponent": {
			"name": "快船",
			"city": "洛杉矶",
			"abbr": "LAC",
			"color": "#C8102E",
			"logoText": "LAC"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 哈登 / 莱昂纳德",
		"previewNotes": "主场迎战洛杉矶快船，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401909323",
		"date": "2026-11-26",
		"time": "09:30",
		"opponent": {
			"name": "太阳",
			"city": "菲尼克斯",
			"abbr": "PHX",
			"color": "#E56020",
			"logoText": "PHX"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "cup",
		"status": "upcoming",
		"keyMatchup": "凯文·杜兰特 vs 德文·布克 & 布拉德利·比尔",
		"previewNotes": "杜兰特大交易后迎战老东家太阳！火箭新体系攻防成色全方位检验。"
	},
	{
		"id": "401910050",
		"date": "2026-11-29",
		"time": "09:30",
		"opponent": {
			"name": "76人",
			"city": "费城",
			"abbr": "PHI",
			"color": "#006BB6",
			"logoText": "PHI"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "申京 & 亚当斯 vs 乔尔·恩比德",
		"previewNotes": "内线肉搏战！火箭双中锋轮番消耗恩比德，防守端切断外线马克西传接。"
	},
	{
		"id": "401910064",
		"date": "2026-12-01",
		"time": "08:30",
		"opponent": {
			"name": "湖人",
			"city": "洛杉矶",
			"abbr": "LAL",
			"color": "#552583",
			"logoText": "LAL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
		"previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
	},
	{
		"id": "401910072",
		"date": "2026-12-02",
		"time": "09:30",
		"opponent": {
			"name": "猛龙",
			"city": "多伦多",
			"abbr": "TOR",
			"color": "#CE1141",
			"logoText": "TOR"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 巴恩斯 / 奎克利",
		"previewNotes": "主场迎战多伦多猛龙，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910101",
		"date": "2026-12-14",
		"time": "07:00",
		"opponent": {
			"name": "公牛",
			"city": "芝加哥",
			"abbr": "CHI",
			"color": "#CE1141",
			"logoText": "CHI"
		},
		"isHome": false,
		"arena": "芝加哥·联合中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 拉文 / 武切维奇",
		"previewNotes": "客场挑战芝加哥公牛，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910111",
		"date": "2026-12-15",
		"time": "09:30",
		"opponent": {
			"name": "尼克斯",
			"city": "纽约",
			"abbr": "NYK",
			"color": "#F58426",
			"logoText": "NYK"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 布伦森 / 唐斯",
		"previewNotes": "主场迎战纽约尼克斯，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910128",
		"date": "2026-12-17",
		"time": "09:30",
		"opponent": {
			"name": "雄鹿",
			"city": "密尔沃基",
			"abbr": "MIL",
			"color": "#00471B",
			"logoText": "MIL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 字母哥阿德托昆博 & 利拉德",
		"previewNotes": "休斯敦内线筑起禁区长城对抗希腊怪兽，外线遏制利拉德超远三分。"
	},
	{
		"id": "401910140",
		"date": "2026-12-19",
		"time": "09:00",
		"opponent": {
			"name": "灰熊",
			"city": "孟菲斯",
			"abbr": "MEM",
			"color": "#5D76A9",
			"logoText": "MEM"
		},
		"isHome": false,
		"arena": "孟菲斯·联邦快递球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
		"previewNotes": "客场挑战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910150",
		"date": "2026-12-21",
		"time": "04:30",
		"opponent": {
			"name": "猛龙",
			"city": "多伦多",
			"abbr": "TOR",
			"color": "#CE1141",
			"logoText": "TOR"
		},
		"isHome": false,
		"arena": "多伦多·丰业银行体育馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 巴恩斯 / 奎克利",
		"previewNotes": "客场挑战多伦多猛龙，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910179",
		"date": "2026-12-24",
		"time": "08:30",
		"opponent": {
			"name": "76人",
			"city": "费城",
			"abbr": "PHI",
			"color": "#006BB6",
			"logoText": "PHI"
		},
		"isHome": false,
		"arena": "费城·富国银行中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "申京 & 亚当斯 vs 乔尔·恩比德",
		"previewNotes": "内线肉搏战！火箭双中锋轮番消耗恩比德，防守端切断外线马克西传接。"
	},
	{
		"id": "401910195",
		"date": "2026-12-28",
		"time": "04:30",
		"opponent": {
			"name": "雷霆",
			"city": "俄克拉荷马",
			"abbr": "OKC",
			"color": "#007AC1",
			"logoText": "OKC"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
		"previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
	},
	{
		"id": "401910219",
		"date": "2026-12-30",
		"time": "11:30",
		"opponent": {
			"name": "湖人",
			"city": "洛杉矶",
			"abbr": "LAL",
			"color": "#552583",
			"logoText": "LAL"
		},
		"isHome": false,
		"arena": "洛杉矶·加密网球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
		"previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
	},
	{
		"id": "401910225",
		"date": "2026-12-31",
		"time": "11:00",
		"opponent": {
			"name": "勇士",
			"city": "金州",
			"abbr": "GSW",
			"color": "#1D428A",
			"logoText": "GSW"
		},
		"isHome": false,
		"arena": "旧金山·大通中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
		"previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
	},
	{
		"id": "401910239",
		"date": "2027-01-02",
		"time": "09:30",
		"opponent": {
			"name": "独行侠",
			"city": "达拉斯",
			"abbr": "DAL",
			"color": "#00538C",
			"logoText": "DAL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
		"previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
	},
	{
		"id": "401910256",
		"date": "2027-01-04",
		"time": "08:00",
		"opponent": {
			"name": "骑士",
			"city": "克利夫兰",
			"abbr": "CLE",
			"color": "#860038",
			"logoText": "CLE"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 米切尔 / 加兰 / 莫布利",
		"previewNotes": "主场迎战克利夫兰骑士，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910271",
		"date": "2027-01-06",
		"time": "09:00",
		"opponent": {
			"name": "森林狼",
			"city": "明尼苏达",
			"abbr": "MIN",
			"color": "#236192",
			"logoText": "MIN"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
		"previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
	},
	{
		"id": "401910287",
		"date": "2027-01-08",
		"time": "09:30",
		"opponent": {
			"name": "灰熊",
			"city": "孟菲斯",
			"abbr": "MEM",
			"color": "#5D76A9",
			"logoText": "MEM"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
		"previewNotes": "主场迎战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910300",
		"date": "2027-01-10",
		"time": "07:00",
		"opponent": {
			"name": "篮网",
			"city": "布鲁克林",
			"abbr": "BKN",
			"color": "#000000",
			"logoText": "BKN"
		},
		"isHome": false,
		"arena": "布鲁克林·巴克莱中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 托马斯 / 克拉克斯顿",
		"previewNotes": "客场挑战布鲁克林篮网，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910315",
		"date": "2027-01-12",
		"time": "08:30",
		"opponent": {
			"name": "凯尔特人",
			"city": "波士顿",
			"abbr": "BOS",
			"color": "#007A33",
			"logoText": "BOS"
		},
		"isHome": false,
		"arena": "波士顿·TD花园球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 伊森 vs 杰森·塔图姆 & 杰伦·布朗",
		"previewNotes": "总冠军级别锋线大对抗，乌度卡战术针对老东家凯尔特人。"
	},
	{
		"id": "401910331",
		"date": "2027-01-14",
		"time": "10:30",
		"opponent": {
			"name": "雷霆",
			"city": "俄克拉荷马",
			"abbr": "OKC",
			"color": "#007AC1",
			"logoText": "OKC"
		},
		"isHome": false,
		"arena": "俄克拉荷马·佩康中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 谢伊·吉尔杰斯-亚历山大",
		"previewNotes": "年轻一代顶级强强对话！阿门外线领防SGA，杜兰特半场攻坚拆解雷霆防线。"
	},
	{
		"id": "401910348",
		"date": "2027-01-16",
		"time": "09:30",
		"opponent": {
			"name": "奇才",
			"city": "华盛顿",
			"abbr": "WAS",
			"color": "#002B5C",
			"logoText": "WAS"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 萨尔 / 普尔",
		"previewNotes": "主场迎战华盛顿奇才，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910355",
		"date": "2027-01-17",
		"time": "09:30",
		"opponent": {
			"name": "活塞",
			"city": "底特律",
			"abbr": "DET",
			"color": "#1D42BA",
			"logoText": "DET"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 康宁汉姆",
		"previewNotes": "主场迎战底特律活塞，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401909476",
		"date": "2027-01-19",
		"time": "08:30",
		"opponent": {
			"name": "灰熊",
			"city": "孟菲斯",
			"abbr": "MEM",
			"color": "#5D76A9",
			"logoText": "MEM"
		},
		"isHome": false,
		"arena": "孟菲斯·联邦快递球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
		"previewNotes": "客场挑战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910379",
		"date": "2027-01-21",
		"time": "09:00",
		"opponent": {
			"name": "森林狼",
			"city": "明尼苏达",
			"abbr": "MIN",
			"color": "#236192",
			"logoText": "MIN"
		},
		"isHome": false,
		"arena": "明尼阿波利斯·标靶中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
		"previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
	},
	{
		"id": "401910390",
		"date": "2027-01-23",
		"time": "08:00",
		"opponent": {
			"name": "黄蜂",
			"city": "夏洛特",
			"abbr": "CHA",
			"color": "#1D1160",
			"logoText": "CHA"
		},
		"isHome": false,
		"arena": "夏洛特·光谱中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 三球鲍尔 / 米勒",
		"previewNotes": "客场挑战夏洛特黄蜂，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910410",
		"date": "2027-01-25",
		"time": "07:00",
		"opponent": {
			"name": "魔术",
			"city": "奥兰多",
			"abbr": "ORL",
			"color": "#0077C0",
			"logoText": "ORL"
		},
		"isHome": false,
		"arena": "奥兰多·起亚中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 班凯罗 / 瓦格纳",
		"previewNotes": "客场挑战奥兰多魔术，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910424",
		"date": "2027-01-27",
		"time": "09:00",
		"opponent": {
			"name": "马刺",
			"city": "圣安东尼奥",
			"abbr": "SAS",
			"color": "#6c757d",
			"logoText": "SAS"
		},
		"isHome": false,
		"arena": "圣安东尼奥·弗罗斯特银行中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
		"previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
	},
	{
		"id": "401910434",
		"date": "2027-01-28",
		"time": "09:30",
		"opponent": {
			"name": "鹈鹕",
			"city": "新奥尔良",
			"abbr": "NOP",
			"color": "#85714D",
			"logoText": "NOP"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
		"previewNotes": "主场迎战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910449",
		"date": "2027-01-30",
		"time": "09:30",
		"opponent": {
			"name": "魔术",
			"city": "奥兰多",
			"abbr": "ORL",
			"color": "#0077C0",
			"logoText": "ORL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 班凯罗 / 瓦格纳",
		"previewNotes": "主场迎战奥兰多魔术，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910466",
		"date": "2027-02-01",
		"time": "09:30",
		"opponent": {
			"name": "独行侠",
			"city": "达拉斯",
			"abbr": "DAL",
			"color": "#00538C",
			"logoText": "DAL"
		},
		"isHome": false,
		"arena": "达拉斯·美航中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 阿门·汤普森 vs 东契奇 / 欧文",
		"previewNotes": "得州内战焦点对决，休斯敦锋线群与达拉斯后场双核高强度对冲。"
	},
	{
		"id": "401910486",
		"date": "2027-02-04",
		"time": "10:30",
		"opponent": {
			"name": "爵士",
			"city": "犹他",
			"abbr": "UTA",
			"color": "#002B5C",
			"logoText": "UTA"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
		"previewNotes": "主场迎战犹他爵士，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910502",
		"date": "2027-02-06",
		"time": "10:00",
		"opponent": {
			"name": "太阳",
			"city": "菲尼克斯",
			"abbr": "PHX",
			"color": "#E56020",
			"logoText": "PHX"
		},
		"isHome": false,
		"arena": "菲尼克斯·足迹中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "凯文·杜兰特 vs 德文·布克 & 布拉德利·比尔",
		"previewNotes": "杜兰特大交易后迎战老东家太阳！火箭新体系攻防成色全方位检验。"
	},
	{
		"id": "401910520",
		"date": "2027-02-08",
		"time": "11:30",
		"opponent": {
			"name": "国王",
			"city": "萨克拉门托",
			"abbr": "SAC",
			"color": "#5A2D81",
			"logoText": "SAC"
		},
		"isHome": false,
		"arena": "萨克拉门托·第一黄金球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 福克斯 / 萨博尼斯",
		"previewNotes": "客场挑战萨克拉门托国王，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910536",
		"date": "2027-02-10",
		"time": "11:00",
		"opponent": {
			"name": "爵士",
			"city": "犹他",
			"abbr": "UTA",
			"color": "#002B5C",
			"logoText": "UTA"
		},
		"isHome": false,
		"arena": "犹他·德尔塔中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
		"previewNotes": "客场挑战犹他爵士，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910549",
		"date": "2027-02-12",
		"time": "09:30",
		"opponent": {
			"name": "国王",
			"city": "萨克拉门托",
			"abbr": "SAC",
			"color": "#5A2D81",
			"logoText": "SAC"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 福克斯 / 萨博尼斯",
		"previewNotes": "主场迎战萨克拉门托国王，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910558",
		"date": "2027-02-13",
		"time": "09:00",
		"opponent": {
			"name": "鹈鹕",
			"city": "新奥尔良",
			"abbr": "NOP",
			"color": "#85714D",
			"logoText": "NOP"
		},
		"isHome": false,
		"arena": "新奥尔良·冰沙国王中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
		"previewNotes": "客场挑战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910571",
		"date": "2027-02-15",
		"time": "03:00",
		"opponent": {
			"name": "掘金",
			"city": "丹佛",
			"abbr": "DEN",
			"color": "#0E2240",
			"logoText": "DEN"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 尼古拉·约基奇",
		"previewNotes": "顶级欧洲高位策应中锋大师课！申京再度向MVP约基奇发起正面对话。"
	},
	{
		"id": "401910582",
		"date": "2027-02-17",
		"time": "12:00",
		"opponent": {
			"name": "快船",
			"city": "洛杉矶",
			"abbr": "LAC",
			"color": "#C8102E",
			"logoText": "LAC"
		},
		"isHome": false,
		"arena": "洛杉矶·直觉巨蛋",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 哈登 / 莱昂纳德",
		"previewNotes": "客场挑战洛杉矶快船，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910598",
		"date": "2027-02-19",
		"time": "11:00",
		"opponent": {
			"name": "湖人",
			"city": "洛杉矶",
			"abbr": "LAL",
			"color": "#552583",
			"logoText": "LAL"
		},
		"isHome": false,
		"arena": "洛杉矶·加密网球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
		"previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
	},
	{
		"id": "401910614",
		"date": "2027-02-27",
		"time": "09:30",
		"opponent": {
			"name": "黄蜂",
			"city": "夏洛特",
			"abbr": "CHA",
			"color": "#1D1160",
			"logoText": "CHA"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 三球鲍尔 / 米勒",
		"previewNotes": "主场迎战夏洛特黄蜂，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910630",
		"date": "2027-03-01",
		"time": "10:30",
		"opponent": {
			"name": "热火",
			"city": "迈阿密",
			"abbr": "MIA",
			"color": "#98002E",
			"logoText": "MIA"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 巴特勒 / 阿德巴约",
		"previewNotes": "主场迎战迈阿密热火，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910635",
		"date": "2027-03-02",
		"time": "09:30",
		"opponent": {
			"name": "勇士",
			"city": "金州",
			"abbr": "GSW",
			"color": "#1D428A",
			"logoText": "GSW"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
		"previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
	},
	{
		"id": "401910651",
		"date": "2027-03-04",
		"time": "09:30",
		"opponent": {
			"name": "鹈鹕",
			"city": "新奥尔良",
			"abbr": "NOP",
			"color": "#85714D",
			"logoText": "NOP"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
		"previewNotes": "主场迎战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910667",
		"date": "2027-03-06",
		"time": "10:30",
		"opponent": {
			"name": "马刺",
			"city": "圣安东尼奥",
			"abbr": "SAS",
			"color": "#6c757d",
			"logoText": "SAS"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
		"previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
	},
	{
		"id": "401910679",
		"date": "2027-03-08",
		"time": "11:00",
		"opponent": {
			"name": "勇士",
			"city": "金州",
			"abbr": "GSW",
			"color": "#1D428A",
			"logoText": "GSW"
		},
		"isHome": false,
		"arena": "旧金山·大通中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 里德·谢泼德 vs 斯蒂芬·库里",
		"previewNotes": "火勇大战经典再续！杜兰特正面对阵旧主与库里，外线投射大对飙。"
	},
	{
		"id": "401910688",
		"date": "2027-03-09",
		"time": "11:30",
		"opponent": {
			"name": "快船",
			"city": "洛杉矶",
			"abbr": "LAC",
			"color": "#C8102E",
			"logoText": "LAC"
		},
		"isHome": false,
		"arena": "洛杉矶·直觉巨蛋",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 哈登 / 莱昂纳德",
		"previewNotes": "客场挑战洛杉矶快船，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910699",
		"date": "2027-03-11",
		"time": "10:00",
		"opponent": {
			"name": "爵士",
			"city": "犹他",
			"abbr": "UTA",
			"color": "#002B5C",
			"logoText": "UTA"
		},
		"isHome": false,
		"arena": "犹他·德尔塔中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 马尔卡宁",
		"previewNotes": "客场挑战犹他爵士，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910721",
		"date": "2027-03-14",
		"time": "06:30",
		"opponent": {
			"name": "步行者",
			"city": "印第安纳",
			"abbr": "IND",
			"color": "#002D62",
			"logoText": "IND"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 哈利伯顿 / 西亚卡姆",
		"previewNotes": "主场迎战印第安纳步行者，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910745",
		"date": "2027-03-17",
		"time": "08:30",
		"opponent": {
			"name": "马刺",
			"city": "圣安东尼奥",
			"abbr": "SAS",
			"color": "#6c757d",
			"logoText": "SAS"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿尔佩伦·申京 vs 维克托·文班亚马",
		"previewNotes": "得州新星中锋巅峰对决！申京策应低位技术与文班亚马超级防守大网的正面对抗。"
	},
	{
		"id": "401910752",
		"date": "2027-03-18",
		"time": "08:30",
		"opponent": {
			"name": "篮网",
			"city": "布鲁克林",
			"abbr": "BKN",
			"color": "#000000",
			"logoText": "BKN"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 托马斯 / 克拉克斯顿",
		"previewNotes": "主场迎战布鲁克林篮网，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910767",
		"date": "2027-03-20",
		"time": "08:00",
		"opponent": {
			"name": "鹈鹕",
			"city": "新奥尔良",
			"abbr": "NOP",
			"color": "#85714D",
			"logoText": "NOP"
		},
		"isHome": false,
		"arena": "新奥尔良·冰沙国王中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 锡安 / 英格拉姆",
		"previewNotes": "客场挑战新奥尔良鹈鹕，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910786",
		"date": "2027-03-23",
		"time": "07:00",
		"opponent": {
			"name": "骑士",
			"city": "克利夫兰",
			"abbr": "CLE",
			"color": "#860038",
			"logoText": "CLE"
		},
		"isHome": false,
		"arena": "克利夫兰·火箭按揭球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 米切尔 / 加兰 / 莫布利",
		"previewNotes": "客场挑战克利夫兰骑士，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910804",
		"date": "2027-03-25",
		"time": "07:30",
		"opponent": {
			"name": "尼克斯",
			"city": "纽约",
			"abbr": "NYK",
			"color": "#F58426",
			"logoText": "NYK"
		},
		"isHome": false,
		"arena": "纽约·麦迪逊广场花园",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 布伦森 / 唐斯",
		"previewNotes": "客场挑战纽约尼克斯，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910812",
		"date": "2027-03-26",
		"time": "07:00",
		"opponent": {
			"name": "活塞",
			"city": "底特律",
			"abbr": "DET",
			"color": "#1D42BA",
			"logoText": "DET"
		},
		"isHome": false,
		"arena": "底特律·小凯撒球馆",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 康宁汉姆",
		"previewNotes": "客场挑战底特律活塞，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910833",
		"date": "2027-03-29",
		"time": "03:00",
		"opponent": {
			"name": "湖人",
			"city": "洛杉矶",
			"abbr": "LAL",
			"color": "#552583",
			"logoText": "LAL"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 勒布朗·詹姆斯 & 安东尼·戴维斯",
		"previewNotes": "群星闪耀的豪门对抗，休斯敦锋线防守群全场围剿湖人双核。"
	},
	{
		"id": "401910853",
		"date": "2027-03-31",
		"time": "11:00",
		"opponent": {
			"name": "开拓者",
			"city": "波特兰",
			"abbr": "POR",
			"color": "#E03A3E",
			"logoText": "POR"
		},
		"isHome": false,
		"arena": "波特兰·摩达中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 亨德森 / 西蒙斯",
		"previewNotes": "客场挑战波特兰开拓者，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910863",
		"date": "2027-04-01",
		"time": "10:00",
		"opponent": {
			"name": "开拓者",
			"city": "波特兰",
			"abbr": "POR",
			"color": "#E03A3E",
			"logoText": "POR"
		},
		"isHome": false,
		"arena": "波特兰·摩达中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 亨德森 / 西蒙斯",
		"previewNotes": "客场挑战波特兰开拓者，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910876",
		"date": "2027-04-03",
		"time": "08:30",
		"opponent": {
			"name": "灰熊",
			"city": "孟菲斯",
			"abbr": "MEM",
			"color": "#5D76A9",
			"logoText": "MEM"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 莫兰特 / 贝恩",
		"previewNotes": "主场迎战孟菲斯灰熊，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910888",
		"date": "2027-04-05",
		"time": "04:00",
		"opponent": {
			"name": "公牛",
			"city": "芝加哥",
			"abbr": "CHI",
			"color": "#CE1141",
			"logoText": "CHI"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 拉文 / 武切维奇",
		"previewNotes": "主场迎战芝加哥公牛，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910915",
		"date": "2027-04-08",
		"time": "08:30",
		"opponent": {
			"name": "国王",
			"city": "萨克拉门托",
			"abbr": "SAC",
			"color": "#5A2D81",
			"logoText": "SAC"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 福克斯 / 萨博尼斯",
		"previewNotes": "主场迎战萨克拉门托国王，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910931",
		"date": "2027-04-10",
		"time": "08:30",
		"opponent": {
			"name": "开拓者",
			"city": "波特兰",
			"abbr": "POR",
			"color": "#E03A3E",
			"logoText": "POR"
		},
		"isHome": true,
		"arena": "休斯敦·丰田中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "杜兰特 & 申京 vs 亨德森 / 西蒙斯",
		"previewNotes": "主场迎战波特兰开拓者，乌度卡强化防守反击与篮板控制。"
	},
	{
		"id": "401910946",
		"date": "2027-04-12",
		"time": "08:30",
		"opponent": {
			"name": "森林狼",
			"city": "明尼苏达",
			"abbr": "MIN",
			"color": "#236192",
			"logoText": "MIN"
		},
		"isHome": false,
		"arena": "明尼阿波利斯·标靶中心",
		"broadcast": "腾讯体育 / 咪咕视频",
		"stage": "regular",
		"status": "upcoming",
		"keyMatchup": "阿门·汤普森 vs 安东尼·爱德华兹",
		"previewNotes": "攻防两端身体天赋的大碰撞！阿门全场死缠爱德华兹，杜兰特无差别跳投终结。"
	}
];
//#endregion
//#region app/features/schedule/ScheduleCalendar.tsx
var MONTH_NAMES = [
	{
		year: 2026,
		month: 10,
		label: "10月",
		subtitle: "澳门赛 & 揭幕战"
	},
	{
		year: 2026,
		month: 11,
		label: "11月",
		subtitle: "NBA杯 & 常规赛"
	},
	{
		year: 2026,
		month: 12,
		label: "12月",
		subtitle: "常规硬仗"
	},
	{
		year: 2027,
		month: 1,
		label: "1月",
		subtitle: "新年东征"
	},
	{
		year: 2027,
		month: 2,
		label: "2月",
		subtitle: "全明星 & 排位"
	},
	{
		year: 2027,
		month: 3,
		label: "3月",
		subtitle: "冲刺阶段"
	},
	{
		year: 2027,
		month: 4,
		label: "4月",
		subtitle: "常规赛收官"
	}
];
var WEEKDAYS$1 = [
	"日",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六"
];
var WEEKDAYS_LONG = [
	"周日",
	"周一",
	"周二",
	"周三",
	"周四",
	"周五",
	"周六"
];
function ScheduleCalendar() {
	const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
	const [viewMode, setViewMode] = useState("calendar");
	const [typeFilter, setTypeFilter] = useState("all");
	const [activeGame, setActiveGame] = useState(null);
	const [selectedCalendarDate, setSelectedCalendarDate] = useState("2026-10-09");
	const [copiedId, setCopiedId] = useState(null);
	const currentMonth = MONTH_NAMES[selectedMonthIdx];
	const monthPrefix = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}`;
	const monthGames = useMemo(() => {
		return ROCKETS_GAMES.filter((g) => g.date.startsWith(monthPrefix));
	}, [monthPrefix]);
	const filteredGames = useMemo(() => {
		return monthGames.filter((g) => {
			if (typeFilter === "home") return g.isHome;
			if (typeFilter === "away") return !g.isHome;
			if (typeFilter === "macau") return g.arena.includes("澳门");
			if (typeFilter === "cup") return g.stage === "cup";
			return true;
		});
	}, [monthGames, typeFilter]);
	const nextGame = useMemo(() => {
		const macauGame = ROCKETS_GAMES.find((g) => g.date === "2026-10-09");
		if (macauGame) return macauGame;
		return ROCKETS_GAMES.filter((g) => g.status === "upcoming" && g.date >= "2026-10-01")[0] || ROCKETS_GAMES[0];
	}, []);
	const calendarDays = useMemo(() => {
		const firstDay = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();
		const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();
		const days = [];
		const prevMonthDays = new Date(currentMonth.year, currentMonth.month - 1, 0).getDate();
		for (let i = firstDay - 1; i >= 0; i--) {
			const d = prevMonthDays - i;
			const prevM = currentMonth.month === 1 ? 12 : currentMonth.month - 1;
			const prevY = currentMonth.month === 1 ? currentMonth.year - 1 : currentMonth.year;
			days.push({
				dayNum: d,
				dateStr: `${prevY}-${String(prevM).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
				isCurrentMonth: false
			});
		}
		for (let d = 1; d <= daysInMonth; d++) {
			const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			const game = ROCKETS_GAMES.find((g) => g.date === dateStr);
			days.push({
				dayNum: d,
				dateStr,
				isCurrentMonth: true,
				game
			});
		}
		const remaining = (days.length > 35 ? 42 : 35) - days.length;
		for (let d = 1; d <= remaining; d++) {
			const nextM = currentMonth.month === 12 ? 1 : currentMonth.month + 1;
			const nextY = currentMonth.month === 12 ? currentMonth.year + 1 : currentMonth.year;
			days.push({
				dayNum: d,
				dateStr: `${nextY}-${String(nextM).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
				isCurrentMonth: false
			});
		}
		return days;
	}, [currentMonth]);
	const selectedDayGame = useMemo(() => {
		return ROCKETS_GAMES.find((g) => g.date === selectedCalendarDate);
	}, [selectedCalendarDate]);
	const handleCopyReminder = (game) => {
		const text = `【休斯敦火箭比赛日程提醒】\n对决：${game.isHome ? "休斯敦火箭 VS " + game.opponent.name : "休斯敦火箭 @ " + game.opponent.name}\n时间：${game.date} ${game.time} (北京时间)\n球馆：${game.arena}\n转播平台：${game.broadcast}`;
		navigator.clipboard?.writeText(text);
		setCopiedId(game.id);
		setTimeout(() => setCopiedId(null), 2500);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative overflow-hidden rounded-2xl border border-line-soft bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 p-4 text-white shadow-xl sm:p-6 lg:p-7",
				children: [
					/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-[#CE1141]/20 blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full bg-amber-500/10 blur-3xl" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 sm:gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#CE1141] to-[#8C001A] shadow-md shadow-[#CE1141]/30 ring-1 ring-white/20 sm:size-14",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xl font-black italic tracking-tighter text-white sm:text-2xl",
									children: "HOU"
								}), /* @__PURE__ */ jsx("span", {
									className: "absolute -bottom-1 -right-1 rounded-full bg-amber-400 px-1 text-[8.5px] font-black text-neutral-950",
									children: "26-27"
								})]
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 ring-1 ring-amber-400/40",
									children: "🇲🇴 NBA 澳门赛重磅开启"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-white/60",
									children: "2026-27 赛季赛程"
								})]
							}), /* @__PURE__ */ jsx("h2", {
								className: "mt-1 text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl",
								children: "休斯敦火箭 比赛赛程"
							})] })]
						}), nextGame && /* @__PURE__ */ jsxs("div", {
							onClick: () => setActiveGame(nextGame),
							className: "group cursor-pointer rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-md transition-all hover:border-[#CE1141] hover:bg-white/[0.1] sm:p-3.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2 text-[11px] font-semibold text-white/70",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-amber-300",
										children: [/* @__PURE__ */ jsx("span", { className: "size-2 animate-ping rounded-full bg-amber-400" }), "焦点战 · 中国澳门站"]
									}), /* @__PURE__ */ jsxs("span", {
										className: "rounded bg-black/40 px-2 py-0.5 font-mono text-white/90",
										children: [
											nextGame.date,
											" ",
											nextGame.time
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "flex size-7 items-center justify-center rounded-lg bg-[#CE1141] text-xs font-black text-white",
												children: "HOU"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs font-bold text-white/90",
												children: "VS"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "flex size-7 items-center justify-center rounded-lg text-xs font-black text-white",
												style: { backgroundColor: nextGame.opponent.color },
												children: nextGame.opponent.abbr.slice(0, 3)
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-xs font-bold text-white sm:text-sm",
												children: nextGame.opponent.name
											})
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-black text-neutral-950 transition-transform group-hover:scale-105",
										children: "对决档案 →"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1.5 text-[10.5px] text-white/70",
									children: [
										"📍 ",
										nextGame.arena,
										" · ",
										/* @__PURE__ */ jsx("span", {
											className: "text-amber-200",
											children: nextGame.keyMatchup
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 mt-5 flex flex-col gap-3 border-t border-white/10 pt-3 sm:pt-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										disabled: selectedMonthIdx === 0,
										onClick: () => setSelectedMonthIdx((prev) => Math.max(0, prev - 1)),
										className: "grid size-8 place-items-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30",
										"aria-label": "上个月",
										children: /* @__PURE__ */ jsx("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2.5",
											children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" })
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline gap-2",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "text-base font-black text-white sm:text-lg",
												children: [
													currentMonth.year,
													"年 ",
													currentMonth.month,
													"月"
												]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs font-semibold text-amber-300",
												children: currentMonth.subtitle
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "text-xs text-white/60",
												children: [
													"(",
													monthGames.length,
													" 场)"
												]
											})
										]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										disabled: selectedMonthIdx === MONTH_NAMES.length - 1,
										onClick: () => setSelectedMonthIdx((prev) => Math.min(MONTH_NAMES.length - 1, prev + 1)),
										className: "grid size-8 place-items-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30",
										"aria-label": "下个月",
										children: /* @__PURE__ */ jsx("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2.5",
											children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" })
										})
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-1.5 text-xs",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center rounded-lg bg-black/40 p-0.5",
									children: [/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setViewMode("list"),
										className: `flex items-center gap-1 rounded-md px-3 py-1 font-semibold transition-colors ${viewMode === "list" ? "bg-white text-neutral-950 shadow-xs" : "text-white/70 hover:text-white"}`,
										children: [/* @__PURE__ */ jsxs("svg", {
											width: "13",
											height: "13",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2.5",
											children: [
												/* @__PURE__ */ jsx("line", {
													x1: "8",
													y1: "6",
													x2: "21",
													y2: "6"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "8",
													y1: "12",
													x2: "21",
													y2: "12"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "8",
													y1: "18",
													x2: "21",
													y2: "18"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "3",
													y1: "6",
													x2: "3.01",
													y2: "6"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "3",
													y1: "12",
													x2: "3.01",
													y2: "12"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "3",
													y1: "18",
													x2: "3.01",
													y2: "18"
												})
											]
										}), "赛程清单"]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setViewMode("calendar"),
										className: `flex items-center gap-1 rounded-md px-3 py-1 font-semibold transition-colors ${viewMode === "calendar" ? "bg-white text-neutral-950 shadow-xs" : "text-white/70 hover:text-white"}`,
										children: [/* @__PURE__ */ jsxs("svg", {
											width: "13",
											height: "13",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2.5",
											children: [
												/* @__PURE__ */ jsx("rect", {
													x: "3",
													y: "4",
													width: "18",
													height: "18",
													rx: "2",
													ry: "2"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "16",
													y1: "2",
													x2: "16",
													y2: "6"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "8",
													y1: "2",
													x2: "8",
													y2: "6"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "3",
													y1: "10",
													x2: "21",
													y2: "10"
												})
											]
										}), "日历视图"]
									})]
								})
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-7 gap-1 rounded-xl bg-black/40 p-1 sm:gap-1.5",
							children: MONTH_NAMES.map((m, idx) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setSelectedMonthIdx(idx),
								className: `flex flex-col items-center justify-center rounded-lg py-1.5 text-xs transition-all sm:py-2 ${selectedMonthIdx === idx ? "bg-white text-neutral-950 shadow-sm font-black" : "text-white/70 hover:bg-white/10 hover:text-white"}`,
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold",
									children: m.label
								}), /* @__PURE__ */ jsx("span", {
									className: `hidden text-[10px] font-normal sm:inline ${selectedMonthIdx === idx ? "text-neutral-600" : "text-white/40"}`,
									children: m.year
								})]
							}, m.label))
						})]
					})
				]
			}),
			viewMode === "list" && /* @__PURE__ */ jsx("div", {
				className: "space-y-2.5",
				children: filteredGames.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "rounded-2xl border border-line-soft bg-surface py-12 text-center text-ink-4",
					children: "当前月份暂无匹配比赛"
				}) : filteredGames.map((game) => {
					const isMacau = game.arena.includes("澳门");
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => setActiveGame(game),
						className: `group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border bg-surface p-3.5 shadow-xs transition-all hover:border-accent hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-4 ${isMacau ? "border-amber-400/60 ring-1 ring-amber-400/20" : "border-line-soft"}`,
						children: [
							isMacau && /* @__PURE__ */ jsx("div", {
								className: "absolute right-0 top-0 rounded-bl-xl bg-gradient-to-l from-amber-500 to-amber-600 px-2 py-0.5 text-[9.5px] font-black text-neutral-950 shadow-sm",
								children: "🇲🇴 澳门赛焦点战"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 sm:gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: `flex size-12 shrink-0 flex-col items-center justify-center rounded-xl font-mono text-center sm:size-14 ${isMacau ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200" : "bg-bg-sunk text-ink"}`,
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[9.5px] uppercase opacity-75",
										children: [game.date.slice(5, 7), "月"]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-lg font-black leading-none sm:text-xl",
										children: game.date.slice(8, 10)
									})]
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: `rounded px-1.5 py-0.2 text-[9.5px] font-extrabold uppercase ${game.isHome ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"}`,
												children: game.isHome ? "主场 vs" : "客场 @"
											}),
											game.stage === "cup" && !isMacau && /* @__PURE__ */ jsx("span", {
												className: "rounded bg-amber-100 px-1.5 py-0.2 text-[9.5px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300",
												children: "🏆 NBA杯"
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "font-mono text-[11px] font-semibold text-accent",
												children: ["北京时间 ", game.time]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "flex size-5 shrink-0 items-center justify-center rounded text-[9px] font-black text-white",
											style: { backgroundColor: game.opponent.color },
											children: game.opponent.abbr.slice(0, 3)
										}), /* @__PURE__ */ jsxs("h3", {
											className: "text-sm font-extrabold text-ink sm:text-base",
											children: [
												"休斯敦火箭 ",
												game.isHome ? "VS" : "@",
												" ",
												game.opponent.name
											]
										})]
									}),
									game.keyMatchup && /* @__PURE__ */ jsxs("p", {
										className: "mt-0.5 line-clamp-1 text-[11.5px] text-ink-3",
										children: ["焦点：", /* @__PURE__ */ jsx("span", {
											className: "text-ink font-medium",
											children: game.keyMatchup
										})]
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-3 border-t border-line-soft pt-2 sm:border-t-0 sm:pt-0",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-left sm:text-right",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-[11.5px] font-medium text-ink-2",
										children: game.arena
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[10.5px] text-ink-4",
										children: game.broadcast
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: (e) => {
										e.stopPropagation();
										handleCopyReminder(game);
									},
									className: "rounded-lg border border-line-soft bg-surface px-2.5 py-1 text-xs font-semibold text-ink-2 hover:bg-bg-sunk transition-colors",
									children: copiedId === game.id ? "已复制 ✓" : "提醒"
								})]
							})
						]
					}, game.id);
				})
			}),
			viewMode === "calendar" && /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-xs",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-7 border-b border-line-soft bg-bg-sunk/60 text-center text-xs font-bold uppercase tracking-wider text-ink-3",
						children: WEEKDAYS_LONG.map((w, idx) => /* @__PURE__ */ jsxs("div", {
							className: `py-2.5 ${idx === 0 || idx === 6 ? "text-accent font-black" : ""}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: w
							}), /* @__PURE__ */ jsx("span", {
								className: "sm:hidden",
								children: WEEKDAYS$1[idx]
							})]
						}, w))
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-7 divide-x divide-y divide-line-soft bg-line-soft",
						children: calendarDays.map((cell, idx) => {
							const game = cell.game;
							const isMacau = game?.arena.includes("澳门");
							const isSelected = cell.dateStr === selectedCalendarDate;
							return /* @__PURE__ */ jsxs("div", {
								onClick: () => {
									setSelectedCalendarDate(cell.dateStr);
									if (game) setActiveGame(game);
								},
								className: `relative flex min-h-[58px] cursor-pointer flex-col bg-surface p-1 transition-colors sm:min-h-[115px] sm:p-2 lg:min-h-[125px] ${!cell.isCurrentMonth ? "bg-bg-sunk/40 opacity-30" : "hover:bg-bg-sunk/40"} ${isSelected ? "ring-2 ring-inset ring-accent bg-accent-soft/30" : ""}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: `font-mono text-xs font-bold ${cell.isCurrentMonth ? "text-ink-2" : "text-ink-4"}`,
											children: cell.dayNum
										}),
										game && /* @__PURE__ */ jsx("span", {
											className: `hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${isMacau ? "bg-amber-100 text-amber-900 ring-1 ring-amber-400 font-black dark:bg-amber-950 dark:text-amber-300" : game.isHome ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"}`,
											children: isMacau ? "澳门赛" : game.isHome ? "主场" : "客场"
										}),
										game && /* @__PURE__ */ jsxs("div", {
											className: "sm:hidden mt-0.5 flex flex-col items-center justify-center",
											children: [/* @__PURE__ */ jsx("div", {
												className: "flex size-5 items-center justify-center rounded text-[8px] font-black text-white shadow-xs",
												style: { backgroundColor: game.opponent.color },
												children: game.opponent.abbr.slice(0, 3)
											}), /* @__PURE__ */ jsx("span", {
												className: `text-[8.5px] font-extrabold mt-0.5 leading-none ${isMacau ? "text-amber-500 font-black" : "text-ink-3"}`,
												children: isMacau ? "🇲🇴澳门" : game.isHome ? "主场" : "客场"
											})]
										})
									]
								}), game && /* @__PURE__ */ jsxs("div", {
									className: "hidden sm:flex mt-1 flex-1 flex-col justify-between overflow-hidden rounded-xl border border-line-soft p-1.5 text-left bg-raised",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "flex size-4 shrink-0 items-center justify-center rounded text-[8px] font-black text-white",
											style: { backgroundColor: game.opponent.color },
											children: game.opponent.abbr.slice(0, 3)
										}), /* @__PURE__ */ jsxs("span", {
											className: "truncate text-[11.5px] font-bold text-ink",
											children: [
												game.isHome ? "vs" : "@",
												" ",
												game.opponent.name
											]
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-0.5 font-mono text-[10.5px] text-ink-3",
										children: game.time
									})] }), /* @__PURE__ */ jsx("div", {
										className: "mt-1 text-[9px] font-medium text-ink-4 truncate",
										children: isMacau ? "威尼斯人金光馆" : game.arena.slice(0, 4)
									})]
								})]
							}, cell.dateStr + idx);
						})
					})]
				}), selectedDayGame && /* @__PURE__ */ jsxs("div", {
					onClick: () => setActiveGame(selectedDayGame),
					className: "sm:hidden rounded-2xl border border-accent/40 bg-accent-soft/20 p-3.5 shadow-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "font-bold text-accent",
								children: [selectedDayGame.date, " · 比赛日安排"]
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-ink-3",
								children: ["北京时间 ", selectedDayGame.time]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex size-6 items-center justify-center rounded text-[10px] font-black text-white",
									style: { backgroundColor: selectedDayGame.opponent.color },
									children: selectedDayGame.opponent.abbr.slice(0, 3)
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-sm font-black text-ink",
									children: [
										"休斯敦火箭 ",
										selectedDayGame.isHome ? "VS" : "@",
										" ",
										selectedDayGame.opponent.name
									]
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: "rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-contrast",
								children: "详情"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 text-xs text-ink-3",
							children: [
								"📍 ",
								selectedDayGame.arena,
								" · 📺 ",
								selectedDayGame.broadcast
							]
						})
					]
				})]
			}),
			activeGame && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
				onClick: () => setActiveGame(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-6 shadow-2xl transition-all",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-line-soft pb-3.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: `rounded-full px-2.5 py-0.5 text-xs font-bold ${activeGame.arena.includes("澳门") ? "bg-amber-400 text-neutral-950 font-black shadow-xs" : activeGame.stage === "cup" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"}`,
									children: activeGame.arena.includes("澳门") ? "🇲🇴 NBA 中国澳门赛" : activeGame.stage === "cup" ? "🏆 Emirates NBA Cup 锦标赛" : "2026-27 常规赛"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-mono text-xs text-ink-3",
									children: [
										activeGame.date,
										" ",
										activeGame.time
									]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveGame(null),
								className: "grid size-8 place-items-center rounded-full text-ink-4 hover:bg-bg-sunk hover:text-ink transition-colors",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "my-5 flex items-center justify-around sm:my-6",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#CE1141] text-xl font-black text-white shadow-lg shadow-[#CE1141]/20 sm:size-16 sm:text-2xl",
											children: "HOU"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-2 text-sm font-bold text-ink sm:text-base",
											children: "休斯敦火箭"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-[11px] text-ink-4",
											children: activeGame.isHome ? "主队" : "客队"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-mono text-xl font-black italic text-ink-3 sm:text-2xl",
										children: "VS"
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-1 rounded-full bg-bg-sunk px-2 py-0.5 text-[10.5px] font-semibold text-accent",
										children: ["北京时间 ", activeGame.time]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "mx-auto flex size-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg sm:size-16 sm:text-2xl",
											style: { backgroundColor: activeGame.opponent.color },
											children: activeGame.opponent.abbr.slice(0, 3)
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-2 text-sm font-bold text-ink sm:text-base",
											children: activeGame.opponent.name
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-[11px] text-ink-4",
											children: activeGame.isHome ? "客队" : "主队"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2.5 rounded-2xl bg-bg-sunk/60 p-3.5 text-xs leading-relaxed text-ink-2 sm:p-4",
							children: [
								activeGame.keyMatchup && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold text-ink",
									children: "🔥 焦点对决："
								}), /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-accent",
									children: activeGame.keyMatchup
								})] }),
								activeGame.previewNotes && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold text-ink",
									children: "📋 赛事看点："
								}), /* @__PURE__ */ jsx("span", { children: activeGame.previewNotes })] }),
								/* @__PURE__ */ jsxs("div", {
									className: "border-t border-line-soft pt-2 text-ink-3",
									children: [/* @__PURE__ */ jsxs("div", { children: ["📍 比赛场馆：", activeGame.arena] }), /* @__PURE__ */ jsxs("div", { children: ["📺 直播平台：", activeGame.broadcast] })]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-4 flex items-center justify-end gap-2 sm:mt-5",
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleCopyReminder(activeGame),
								className: "flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-contrast shadow-sm hover:bg-accent-ink transition-colors",
								children: copiedId === activeGame.id ? "已复制提醒到剪贴板 ✓" : "复制观赛提醒"
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region app/routes/schedule.tsx
var schedule_exports = /* @__PURE__ */ __exportAll({
	default: () => schedule_default,
	headers: () => headers$26,
	meta: () => meta$38
});
function headers$26() {
	return { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" };
}
function meta$38() {
	return pageMeta({
		title: "火箭赛程日历 · NBA 2K 战绩比分",
		description: `${SITE.name} 独家赛程日历：休斯敦火箭 2026-27 赛季全部赛程安排、比赛战果、实时比分与最佳球员统计。`,
		path: "/schedule"
	});
}
var schedule_default = UNSAFE_withComponentProps(function SchedulePage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-[24px] font-extrabold tracking-tight text-ink lg:text-3xl",
				children: "赛程日历"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-ink-3",
				children: "休斯敦火箭 2026-27 赛季比赛日程与 2K 战绩比分看板"
			})]
		}), /* @__PURE__ */ jsx(ScheduleCalendar, {})]
	});
});
//#endregion
//#region app/routes/search-busy.tsx
var search_busy_exports = /* @__PURE__ */ __exportAll({
	default: () => search_busy_default,
	headers: () => headers$25,
	meta: () => meta$37
});
function meta$37() {
	return [{ title: titled("搜索繁忙") }, {
		name: "robots",
		content: "noindex, follow"
	}];
}
function headers$25() {
	return { "Cache-Control": "no-store" };
}
var search_busy_default = UNSAFE_withComponentProps(SearchBusy);
//#endregion
//#region app/components/ui/Badge.tsx
var TONES$1 = {
	selected: "bg-amber-soft text-amber-ink",
	accent: "bg-accent-soft text-accent",
	amber: "bg-amber-soft text-amber-ink",
	hot: "bg-hot-soft text-hot",
	ok: "bg-ok-soft text-ok",
	neutral: "bg-bg-sunk text-ink-3 border border-line-soft"
};
/** Small label next to a source or title: 精选, statuses and counts. */
function Badge$1({ tone = "neutral", dot = false, children, className = "", title }) {
	return /* @__PURE__ */ jsxs("span", {
		title,
		className: `inline-flex h-[18px] shrink-0 items-center gap-1 rounded-full px-2 text-[11px] font-medium leading-none ${TONES$1[tone]} ${className}`,
		children: [dot && /* @__PURE__ */ jsx("span", {
			className: "size-[5px] rounded-full bg-current",
			"aria-hidden": "true"
		}), children]
	});
}
/** The "精选" mark on a report. */
function SelectedBadge() {
	return /* @__PURE__ */ jsx(Badge$1, {
		tone: "selected",
		dot: true,
		children: "精选"
	});
}
//#endregion
//#region app/components/ui/Menu.tsx
/** A small dropdown anchored to a trigger; closes on outside click, Escape or choosing an entry. */
function Menu({ trigger, label, children, align = "right" }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		if (!open) return;
		const onDown = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		const onKey = (e) => e.key === "Escape" && setOpen(false);
		document.addEventListener("pointerdown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-label": label,
			title: label,
			"aria-haspopup": "menu",
			"aria-expanded": open,
			onClick: () => setOpen(!open),
			className: `inline-flex size-8 items-center justify-center rounded-control transition-colors ${open ? "bg-bg-sunk text-ink" : "text-ink-3 hover:bg-bg-sunk hover:text-ink"}`,
			children: trigger
		}), /* @__PURE__ */ jsx(Presence, {
			show: open,
			enter: "anim-drop-in",
			exit: "anim-drop-out",
			duration: 140,
			children: /* @__PURE__ */ jsx("div", {
				role: "menu",
				className: `absolute top-10 z-50 min-w-[168px] overflow-hidden rounded-tile border border-line bg-raised py-1 shadow-[var(--shadow-pop)] ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`,
				children: children(() => setOpen(false))
			})
		})]
	});
}
/** One entry of a Menu (a button or a link). */
function MenuItem({ icon, children, onSelect, href, download }) {
	const cls = "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink-2 transition-colors hover:bg-bg-sunk hover:text-ink";
	const inner = /* @__PURE__ */ jsxs(Fragment, { children: [icon && /* @__PURE__ */ jsx("span", {
		className: "text-ink-4",
		children: icon
	}), children] });
	if (href) return /* @__PURE__ */ jsx("a", {
		role: "menuitem",
		href,
		download,
		onClick: onSelect,
		className: cls,
		children: inner
	});
	return /* @__PURE__ */ jsx("button", {
		role: "menuitem",
		type: "button",
		onClick: onSelect,
		className: cls,
		children: inner
	});
}
//#endregion
//#region app/features/item/StoryFollowups.tsx
/**
* "事件后续": the other developments of the event this report belongs to, newest first, with a link to
* the whole event. Loaded after the page so the article renders without waiting for it.
*/
function StoryFollowups({ story, currentId }) {
	const [items, setItems] = useState(null);
	const [more, setMore] = useState(false);
	const anchor = useRef(null);
	useEffect(() => {
		const controller = new AbortController();
		let started = false;
		setItems(null);
		const load = () => {
			if (started) return;
			started = true;
			fetch(`/api/site/stories/${encodeURIComponent(story.publicId)}/followups`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null).then((body) => {
				if (!body || controller.signal.aborted) return;
				setItems(body.items.filter((d) => d.representative.id !== currentId));
				setMore(body.more);
			}).catch(() => {});
		};
		const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				observer?.disconnect();
				load();
			}
		}, { rootMargin: "500px" });
		if (observer && anchor.current) observer.observe(anchor.current);
		else load();
		return () => {
			observer?.disconnect();
			controller.abort();
		};
	}, [story.publicId, currentId]);
	return /* @__PURE__ */ jsxs("div", {
		ref: anchor,
		children: [/* @__PURE__ */ jsx("noscript", { children: /* @__PURE__ */ jsx("a", {
			href: `/story/${story.publicId}`,
			children: "查看事件全部后续"
		}) }), items && items.length > 0 && /* @__PURE__ */ jsx(Followups, {
			items,
			more,
			story
		})]
	});
}
function Followups({ items, more, story }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-10 border-t border-line pt-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("h2", {
				className: "text-[14px] font-semibold text-ink",
				children: ["事件后续 ", /* @__PURE__ */ jsxs("span", {
					className: "num font-normal text-ink-4",
					children: [
						"· ",
						items.length,
						more ? "+" : ""
					]
				})]
			}), /* @__PURE__ */ jsx(MoreLink, {
				to: `/story/${story.publicId}`,
				children: "查看事件全部"
			})]
		}), /* @__PURE__ */ jsx("ul", {
			className: "divide-y divide-line-soft",
			children: items.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
				to: `/items/${d.representative.id}`,
				className: "group flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-3",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "flex min-w-0 flex-1 items-baseline gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "shrink-0 rounded-mark bg-accent-soft px-1 text-[10.5px] leading-[16px] text-accent",
						children: "同事件"
					}), /* @__PURE__ */ jsx("span", {
						className: "min-w-0 text-[13.5px] leading-snug text-ink-2 group-hover:text-accent sm:truncate",
						children: d.representative.title
					})]
				}), /* @__PURE__ */ jsxs("span", {
					className: "shrink-0 pl-[46px] text-[12px] text-ink-4 sm:pl-0",
					suppressHydrationWarning: true,
					children: [
						shortSourceName(d.representative.source.name),
						" · ",
						relativeTime(d.representative.timelineAt)
					]
				})]
			}) }, d.factId))
		})]
	});
}
//#endregion
//#region app/features/item/MediaGallery.tsx
/** A round play mark over a video's still. */
function PlayMark() {
	return /* @__PURE__ */ jsx("span", {
		className: "absolute inset-0 grid place-items-center",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("span", {
			className: "grid size-11 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105",
			children: /* @__PURE__ */ jsx("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				className: "ml-0.5",
				children: /* @__PURE__ */ jsx("path", { d: "M7 4.5v15a1 1 0 001.5.87l13-7.5a1 1 0 000-1.74l-13-7.5A1 1 0 007 4.5z" })
			})
		})
	});
}
/**
* The post's pictures as tiles, all of them (X allows up to nine; list cards show four). Images open in
* a viewer that steps through them; videos play inline or in a modal.
*/
function MediaGallery({ media, postUrl }) {
	const [open, setOpen] = useState(null);
	const [activeVideo, setActiveVideo] = useState(null);
	const shown = media.slice(0, 9);
	const images = shown.filter((m) => m.kind !== "video");
	const single = shown.length === 1;
	const tile = `group relative overflow-hidden rounded-tile border border-line-soft bg-bg-sunk ${single ? "max-w-[420px]" : "aspect-[16/10]"}`;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: `mt-5 grid gap-2 ${single ? "grid-cols-1" : shown.length === 2 || shown.length === 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`,
			children: shown.map((m) => {
				const img = /* @__PURE__ */ jsx("img", {
					src: m.poster ?? m.url,
					srcSet: m.srcSet,
					sizes: single ? "auto, (min-width: 460px) 420px, calc(100vw - 32px)" : "auto, (min-width: 800px) 248px, (min-width: 640px) calc(33.333vw - 19px), calc(50vw - 24px)",
					width: m.width ?? void 0,
					height: m.height ?? void 0,
					decoding: "async",
					alt: m.alt ?? "",
					loading: "lazy",
					className: `block w-full object-cover transition-transform duration-300 group-hover:scale-[1.015] ${single ? "max-h-[360px]" : "h-full"}`,
					style: single && m.width && m.height ? { aspectRatio: `${m.width} / ${m.height}` } : void 0
				});
				if (m.kind === "video") {
					if (m.videoUrl) return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveVideo({
							url: m.videoUrl,
							poster: m.poster ?? m.url
						}),
						"aria-label": "播放视频",
						className: `${tile} cursor-pointer text-left`,
						children: [img, /* @__PURE__ */ jsx(PlayMark, {})]
					}, m.url);
					return /* @__PURE__ */ jsxs("a", {
						href: postUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-label": "打开原推播放视频",
						className: tile,
						children: [img, /* @__PURE__ */ jsx(PlayMark, {})]
					}, m.url);
				}
				return /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setOpen(images.indexOf(m)),
					"aria-label": m.alt ? `查看大图：${m.alt}` : "查看大图",
					className: `${tile} cursor-zoom-in`,
					children: img
				}, m.url);
			})
		}),
		/* @__PURE__ */ jsx(Lightbox, {
			images: images.map((m) => ({
				src: m.url,
				alt: m.alt
			})),
			index: open,
			onIndex: setOpen,
			onClose: () => setOpen(null)
		}),
		/* @__PURE__ */ jsx(VideoModal, {
			open: !!activeVideo,
			videoUrl: activeVideo?.url ?? null,
			poster: activeVideo?.poster,
			onClose: () => setActiveVideo(null)
		})
	] });
}
//#endregion
//#region app/components/ui/YouTubeEmbed.tsx
function YouTubeEmbed({ info, poster, className = "", autoPlay = false }) {
	const [playing, setPlaying] = useState(autoPlay);
	const [mode, setMode] = useState(info.videoId ? "video" : "playlist");
	let currentEmbedUrl = info.embedUrl;
	if (mode === "video" && info.videoId) currentEmbedUrl = `https://www.youtube-nocookie.com/embed/${info.videoId}?autoplay=1&rel=0&modestbranding=1`;
	else if (mode === "playlist" && info.playlistId) currentEmbedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${info.playlistId}&autoplay=1&rel=0`;
	else currentEmbedUrl += "?autoplay=1&rel=0";
	const coverImage = poster ?? (info.videoId ? `https://i.ytimg.com/vi/${info.videoId}/hqdefault.jpg` : null);
	return /* @__PURE__ */ jsxs("div", {
		className: `my-5 overflow-hidden rounded-2xl border border-line-soft bg-black/95 text-white shadow-xl transition-all duration-300 ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 font-medium",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid size-6 place-items-center rounded bg-[#FF0000] text-white shadow-sm",
					children: /* @__PURE__ */ jsx("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 24 24",
						fill: "currentColor",
						children: /* @__PURE__ */ jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" })
					})
				}), /* @__PURE__ */ jsx("span", {
					className: "text-white/95",
					children: info.channelName ? `${info.channelName} · 在线播放` : "YouTube 视频在线播放"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [info.videoId && info.playlistId && /* @__PURE__ */ jsxs("div", {
					className: "hidden sm:flex items-center rounded-lg bg-white/10 p-0.5 text-[11.5px]",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setMode("video");
							setPlaying(true);
						},
						className: `rounded px-2 py-0.5 transition-colors ${mode === "video" ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white"}`,
						children: "采访原片"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setMode("playlist");
							setPlaying(true);
						},
						className: `rounded px-2 py-0.5 transition-colors ${mode === "playlist" ? "bg-white text-black font-semibold" : "text-white/70 hover:text-white"}`,
						children: "频道列表"
					})]
				}), /* @__PURE__ */ jsxs("a", {
					href: info.originalUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-1 text-[12px] text-white/60 transition-colors hover:text-white",
					children: ["在 YouTube 打开 ", /* @__PURE__ */ jsx(IconExternal, { size: 12 })]
				})]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "relative aspect-video w-full bg-black",
			children: playing ? /* @__PURE__ */ jsx("iframe", {
				src: currentEmbedUrl,
				title: "YouTube video player",
				className: "size-full border-0",
				allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
				allowFullScreen: true
			}, currentEmbedUrl) : /* @__PURE__ */ jsxs("div", {
				onClick: () => setPlaying(true),
				className: "group relative size-full cursor-pointer overflow-hidden bg-black select-none",
				children: [
					coverImage ? /* @__PURE__ */ jsx("img", {
						src: coverImage,
						alt: "视频预览",
						className: "size-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
					}) : /* @__PURE__ */ jsx("div", { className: "size-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900" }),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
					/* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid size-16 sm:size-20 place-items-center rounded-2xl bg-[#FF0000] text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E60000] group-active:scale-95 ring-4 ring-white/20",
							children: /* @__PURE__ */ jsx("svg", {
								width: "28",
								height: "28",
								viewBox: "0 0 24 24",
								fill: "currentColor",
								className: "ml-1",
								children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-black/60 px-4 py-1.5 text-[13px] font-medium tracking-wide text-white/95 backdrop-blur-md transition-colors group-hover:bg-black/80",
							children: "点击直接播放视频"
						})]
					}),
					info.channelName && /* @__PURE__ */ jsxs("div", {
						className: "absolute bottom-3 left-4 text-[12px] text-white/70",
						children: ["来源频道：", /* @__PURE__ */ jsx("span", {
							className: "font-semibold text-white",
							children: info.channelName
						})]
					})
				]
			})
		})]
	});
}
//#endregion
//#region app/routes/item.tsx
var item_exports = /* @__PURE__ */ __exportAll({
	default: () => item_default,
	headers: () => headers$24,
	loader: () => loader$32,
	meta: () => meta$36
});
var PosterSheet = lazy(() => import("./assets/PosterSheet-CFht5Ufd.js"));
async function loader$32({ params, request }) {
	return { item: await loadOr404(`/api/site/items/${encodeURIComponent(params.id)}`, { signal: request.signal }) };
}
function meta$36({ loaderData }) {
	if (!loaderData) return [{ title: titled("内容不存在") }, {
		name: "robots",
		content: "noindex"
	}];
	const { item } = loaderData;
	return pageMeta({
		title: item.title,
		description: item.summary ?? void 0,
		path: `/items/${item.id}`,
		image: `/og/items/${item.id}.png`,
		type: "article",
		noindex: !item.indexable,
		jsonLd: breadcrumbLd([
			{
				name: SITE.name,
				path: "/"
			},
			{
				name: item.selected ? "精选" : "全部动态",
				path: item.selected ? "/" : "/all"
			},
			{
				name: item.title,
				path: `/items/${item.id}`
			}
		])
	});
}
function headers$24() {
	return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=120" };
}
/** A 2px accent line across the top that follows long bodies. */
function ReadingProgress() {
	const ref = useRef(null);
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
	return /* @__PURE__ */ jsx("div", {
		ref,
		"aria-hidden": "true",
		className: "fixed inset-x-0 top-0 z-50 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-150 ease-out"
	});
}
function hostOf(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}
async function shareOrCopy(item) {
	const url = `${siteUrl()}/items/${item.id}`;
	try {
		if (navigator.share && matchMedia("(pointer: coarse)").matches) {
			await navigator.share({
				title: item.title,
				url
			});
			return "shared";
		}
		await navigator.clipboard.writeText(`${item.title}\n${url}`);
		return "copied";
	} catch {
		return null;
	}
}
var item_default = UNSAFE_withComponentProps(function ItemPage() {
	const { item } = useLoaderData();
	const navigate = useNavigate();
	const hasTranslation = item.hasTranslation;
	const lang = item.bodyLanguage;
	const [posterRequested, setPosterRequested] = useState(false);
	const [posterOpen, setPosterOpen] = useState(false);
	const [toast, setToast] = useState(null);
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
		if (await shareOrCopy(item) === "copied") setToast("链接已复制");
	};
	const bodyHtml = lang === "zh" ? item.body?.zh ?? item.body?.original : item.body?.original ?? item.body?.zh;
	const bodyLabel = !item.body ? null : lang === "zh" && item.body.zhKind === "translation" ? "正文 · 中文翻译" : lang === "original" && hasTranslation ? "正文 · 原文" : "正文";
	const isX = item.channel === "x" && !!item.x;
	const publishedIso = item.publishedAt ?? item.discoveredAt;
	const summaryOnly = item.readingMode === "summary-only";
	const showOutline = item.outline.length >= 3;
	const originalLabel = isX ? "在 X 查看原推" : "打开原文";
	const related = item.relatedStories.filter((s) => s.publicId !== item.story?.publicId);
	const ytInfo = detectYouTube(item);
	const poster = item.x?.media?.[0]?.url ?? item.x?.quoted?.media?.[0]?.url ?? null;
	const back = () => {
		if (window.history.state?.idx > 0) navigate(-1);
		else navigate(item.selected ? "/" : "/all");
	};
	const backButton = /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: back,
		className: "-ml-1.5 inline-flex h-8 items-center gap-1.5 rounded-full px-1.5 text-[14px] text-ink-2 transition-colors hover:text-ink lg:text-[13px] lg:text-ink-3",
		children: [/* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }), " 返回"]
	});
	const moreMenu = /* @__PURE__ */ jsx(Menu, {
		label: "更多操作",
		trigger: /* @__PURE__ */ jsx(IconMenu, { size: 17 }),
		children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(MenuItem, {
				icon: /* @__PURE__ */ jsx(IconShare, { size: 15 }),
				onSelect: () => {
					close();
					share();
				},
				children: "分享链接"
			}),
			/* @__PURE__ */ jsx(MenuItem, {
				icon: /* @__PURE__ */ jsx(IconImage, { size: 15 }),
				onSelect: () => {
					close();
					openPoster();
				},
				children: "生成分享海报"
			}),
			/* @__PURE__ */ jsx(MenuItem, {
				icon: /* @__PURE__ */ jsx(IconCopy, { size: 15 }),
				onSelect: async () => {
					close();
					try {
						await navigator.clipboard.writeText(`${siteUrl()}/items/${item.id}`);
						setToast("链接已复制");
					} catch {}
				},
				children: "复制链接"
			}),
			item.markdownAvailable && /* @__PURE__ */ jsx(MenuItem, {
				icon: /* @__PURE__ */ jsx(IconDownload, { size: 15 }),
				href: `/items/${item.id}/markdown`,
				download: true,
				onSelect: close,
				children: "导出 Markdown"
			})
		] })
	});
	const actions = /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ jsxs("a", {
				href: item.links.original,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-ink-4 hover:text-ink",
				children: [
					originalLabel,
					" ",
					/* @__PURE__ */ jsx(IconExternal, { size: 13 })
				]
			}),
			/* @__PURE__ */ jsx(StarButton, {
				item,
				size: 32
			}),
			moreMenu
		]
	});
	const verdict = (item.selected || item.score !== null) && /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [item.selected && /* @__PURE__ */ jsx(SelectedBadge, {}), /* @__PURE__ */ jsx(ScoreLabel, { score: item.score })]
	});
	const facts = /* @__PURE__ */ jsxs(RailSection, {
		title: "来源",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-[14px] font-semibold leading-snug text-ink",
				children: isX ? item.x.authorName : item.source.name
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-1 text-[12.5px] leading-relaxed text-ink-3",
				children: isX ? `@${item.x.handle} · X` : item.author ?? hostOf(item.links.original)
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-3 text-[12px] text-ink-4",
				children: "发布时间"
			}),
			/* @__PURE__ */ jsx("time", {
				dateTime: publishedIso,
				className: "mono mt-0.5 block text-[12.5px] text-ink-2",
				children: fullDateTime(publishedIso)
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-0.5 text-[12px] text-ink-4",
				suppressHydrationWarning: true,
				children: relativeTime(publishedIso)
			})
		]
	});
	const outline = showOutline && /* @__PURE__ */ jsx(RailSection, {
		title: "本文目录",
		children: /* @__PURE__ */ jsx("nav", {
			"aria-label": "本文目录",
			children: /* @__PURE__ */ jsx("ol", {
				className: "-ml-px space-y-0.5 border-l border-line",
				children: item.outline.map((o) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
					href: `#${o.id}`,
					className: `-ml-px block border-l border-transparent py-1 text-[12.5px] leading-snug text-ink-3 transition-colors hover:border-accent hover:text-ink ${o.level > 2 ? "pl-5" : "pl-3"}`,
					children: o.text
				}) }, o.id))
			})
		})
	});
	const notes = /* @__PURE__ */ jsxs(Fragment, { children: [item.reason && !summaryOnly ? /* @__PURE__ */ jsxs(RailSection, {
		title: "推荐理由",
		children: [verdict && /* @__PURE__ */ jsx("div", {
			className: "mb-3",
			children: verdict
		}), /* @__PURE__ */ jsx("p", {
			className: "text-[13.5px] leading-[1.8] text-ink-2",
			children: item.reason
		})]
	}) : verdict && /* @__PURE__ */ jsx(RailSection, {
		title: "情报评级",
		children: verdict
	}), item.tags.length > 0 && /* @__PURE__ */ jsx(RailSection, {
		title: "标签",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap gap-1.5",
			children: item.tags.slice(0, 8).map((t) => /* @__PURE__ */ jsxs(Link, {
				to: `/all?tag=${encodeURIComponent(t)}`,
				className: "chip",
				children: ["#", t]
			}, t))
		})
	})] });
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-[var(--page-max-reading)] pb-8",
		children: [
			item.body && /* @__PURE__ */ jsx(ReadingProgress, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "sticky top-0 z-30 -mx-4 flex h-12 items-center gap-1.5 border-b border-line-soft bg-bg/95 px-4 backdrop-blur lg:hidden",
				children: [
					backButton,
					/* @__PURE__ */ jsx("span", { className: "flex-1" }),
					/* @__PURE__ */ jsx(StarButton, {
						item,
						size: 32
					}),
					/* @__PURE__ */ jsxs("a", {
						href: item.links.original,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex h-8 items-center gap-1 px-1.5 text-[14px] text-ink-2",
						children: [/* @__PURE__ */ jsx(IconExternal, { size: 15 }), " 原文"]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "分享",
						onClick: share,
						className: "inline-flex size-8 items-center justify-center rounded-full text-ink-3 hover:text-ink",
						children: /* @__PURE__ */ jsx(IconShare, { size: 17 })
					}),
					moreMenu
				]
			}),
			/* @__PURE__ */ jsxs(ArticleLayout, {
				left: /* @__PURE__ */ jsxs(Fragment, { children: [
					backButton,
					facts,
					outline
				] }),
				right: /* @__PURE__ */ jsxs(Fragment, { children: [
					actions,
					notes,
					/* @__PURE__ */ jsx("div", {
						className: "space-y-8 2xl:hidden",
						children: outline
					})
				] }),
				children: [/* @__PURE__ */ jsx("div", {
					className: "hidden lg:block 2xl:hidden",
					children: backButton
				}), /* @__PURE__ */ jsxs("article", {
					className: "pb-6 pt-6 lg:pt-2 2xl:pt-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: `flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-ink-3 2xl:hidden ${isX ? "" : "mb-3"}`,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-ink-2",
									children: isX ? item.x.authorName : item.source.name
								}),
								isX && /* @__PURE__ */ jsxs("span", { children: [
									"· @",
									item.x.handle,
									" · X"
								] }),
								item.author && !isX && /* @__PURE__ */ jsxs("span", { children: ["· ", item.author] }),
								/* @__PURE__ */ jsx("span", { children: "·" }),
								/* @__PURE__ */ jsx("time", {
									dateTime: publishedIso,
									className: "mono",
									children: fullDateTime(publishedIso)
								}),
								/* @__PURE__ */ jsxs("span", {
									suppressHydrationWarning: true,
									children: ["· ", relativeTime(publishedIso)]
								}),
								item.selected && /* @__PURE__ */ jsx("span", {
									className: "ml-1 lg:hidden",
									children: /* @__PURE__ */ jsx(SelectedBadge, {})
								}),
								item.score !== null && /* @__PURE__ */ jsx("span", {
									className: "ml-1 lg:hidden",
									children: /* @__PURE__ */ jsx(ScoreLabel, { score: item.score })
								})
							]
						}),
						!isX && /* @__PURE__ */ jsx("h1", {
							className: "text-[26px] font-bold leading-[1.38] tracking-[-0.01em] text-ink lg:text-[32px] lg:leading-[1.34] xl:text-[36px] xl:leading-[1.3]",
							children: item.title
						}),
						!isX && item.originalTitle && /* @__PURE__ */ jsx("p", {
							className: "mt-2.5 text-[14px] leading-relaxed text-ink-4",
							children: item.originalTitle
						}),
						item.summary && /* @__PURE__ */ jsxs("section", {
							className: isX ? "mt-4" : "mt-7 xl:mt-8",
							children: [/* @__PURE__ */ jsx("div", {
								className: "mb-2 text-[12px] font-semibold text-accent",
								children: summaryOnly ? "摘要" : "情报要点"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[18px] leading-[1.7] text-ink xl:text-[20px] xl:leading-[1.7]",
								children: item.summary
							})]
						}),
						item.reason && !summaryOnly && /* @__PURE__ */ jsxs("section", {
							className: "mt-6 border-t border-line pt-4 lg:hidden",
							children: [/* @__PURE__ */ jsx("div", {
								className: "mb-1 text-[12px] font-semibold text-ink-3",
								children: "推荐理由"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[15px] leading-[1.75] text-ink-2",
								children: item.reason
							})]
						}),
						item.group && item.group.reportCount > 1 && /* @__PURE__ */ jsx("div", {
							className: "mt-5",
							children: /* @__PURE__ */ jsx(GroupSources, {
								group: item.group,
								parentId: item.id
							})
						}),
						summaryOnly && /* @__PURE__ */ jsx("p", {
							className: "mt-7 rounded-control bg-bg-sunk px-4 py-3 text-[13.5px] leading-relaxed text-ink-3",
							children: "应来源方要求，这里只提供摘要与原文入口。完整内容请阅读原文。"
						}),
						item.body && bodyHtml && /* @__PURE__ */ jsxs("section", {
							className: "mt-9 border-t border-line pt-4 xl:mt-10",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-6 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[12px] text-ink-4",
										children: bodyLabel
									}), hasTranslation && /* @__PURE__ */ jsx(PillTabs, {
										size: "xs",
										layoutId: "item-body-lang",
										label: "正文语言",
										active: lang,
										items: [{
											key: "zh",
											label: "中文",
											prefetch: "intent",
											replace: true,
											to: `/items/${item.id}`
										}, {
											key: "original",
											label: "原文",
											prefetch: "intent",
											replace: true,
											to: `/items/${item.id}/original`
										}]
									})]
								}),
								hasTranslation && lang === "zh" && !item.body.complete && /* @__PURE__ */ jsx("p", {
									className: "mb-5 rounded-control bg-bg-sunk px-3 py-2 text-[13px] text-ink-3",
									children: "译文尚不完整，完整内容请切换到原文。"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "prose",
									dangerouslySetInnerHTML: { __html: bodyHtml }
								})
							]
						}),
						ytInfo && /* @__PURE__ */ jsx("div", {
							className: "mt-4",
							children: /* @__PURE__ */ jsx(YouTubeEmbed, {
								info: ytInfo,
								poster
							})
						}),
						isX && item.x.media.length > 0 && (!ytInfo || item.x.media.length > 1) && /* @__PURE__ */ jsx(MediaGallery, {
							media: item.x.media,
							postUrl: item.links.original
						}),
						isX && item.x.quoted?.text && /* @__PURE__ */ jsx(QuotedPost, {
							quoted: item.x.quoted,
							original: lang === "original"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-8 text-[13px] text-ink-4",
							children: [
								"来源：",
								/* @__PURE__ */ jsx("a", {
									href: item.links.original,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-ink-3 hover:text-accent",
									children: isX ? item.x.authorName : item.source.name
								}),
								/* @__PURE__ */ jsxs("span", { children: [" · ", hostOf(item.links.original)] })
							]
						}),
						item.tags.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "mt-4 flex flex-wrap gap-1.5 lg:hidden",
							children: item.tags.slice(0, 6).map((t) => /* @__PURE__ */ jsxs(Link, {
								to: `/all?tag=${encodeURIComponent(t)}`,
								className: "chip",
								children: ["#", t]
							}, t))
						}),
						item.story && /* @__PURE__ */ jsx(StoryFollowups, {
							story: item.story,
							currentId: item.id
						}),
						related.length > 0 && /* @__PURE__ */ jsxs("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "mb-2 text-[14px] font-semibold text-ink",
								children: "相关事件"
							}), /* @__PURE__ */ jsx("ul", {
								className: "divide-y divide-line-soft",
								children: related.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: `/story/${s.publicId}`,
									className: "block py-2.5 text-[14px] text-ink-2 hover:text-accent",
									children: s.title
								}) }, s.publicId))
							})]
						})
					]
				})]
			}),
			posterRequested && /* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(PosterSheet, {
					id: item.id,
					title: item.title,
					open: posterOpen,
					onClose: closePoster
				})
			}),
			toast && /* @__PURE__ */ jsx("div", {
				role: "status",
				className: "fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[13px] text-bg shadow-[var(--shadow-pop)] lg:bottom-8",
				children: toast
			})
		]
	});
});
//#endregion
//#region app/routes/item-original.tsx
var item_original_exports = /* @__PURE__ */ __exportAll({
	default: () => item_default,
	headers: () => headers$24,
	loader: () => loader$31,
	meta: () => meta$36
});
async function loader$31({ params, request }) {
	return { item: await loadOr404(`/api/site/items/${encodeURIComponent(params.id)}/original`, { signal: request.signal }) };
}
//#endregion
//#region app/features/hot/Sparkline.tsx
function Sparkline({ values, className = "h-6 w-[88px]", area = false, stretch = false }) {
	const W = 104;
	const H = 32;
	const pad = 3;
	const seen = values.filter((v) => v !== null);
	if (seen.length < 3) return /* @__PURE__ */ jsx("span", {
		className: `block ${className}`,
		"aria-hidden": "true"
	});
	const max = Math.max(...seen) || 1;
	const step = 98 / Math.max(1, values.length - 1);
	const x = (i) => pad + i * step;
	const y = (v) => pad + (1 - v / max) * 26;
	const runs = [];
	let run = [];
	values.forEach((v, i) => {
		if (v === null) {
			if (run.length) runs.push(run.join(" "));
			run = [];
		} else run.push(`${x(i).toFixed(1)},${y(v).toFixed(1)}`);
	});
	if (run.length) runs.push(run.join(" "));
	let last = values.length - 1;
	while (last >= 0 && values[last] === null) last--;
	const gaps = seen.length < values.length;
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: `0 0 ${W} ${H}`,
		preserveAspectRatio: stretch ? "none" : void 0,
		className: `overflow-visible ${className}`,
		role: "img",
		"aria-label": `近 24 小时热度走势${gaps ? "，部分时段缺少可比数据" : ""}`,
		children: [
			area && runs.map((pts) => {
				const xs = pts.split(" ").map((p) => p.split(",")[0]);
				return /* @__PURE__ */ jsx("polygon", {
					points: `${xs[0]},${H} ${pts} ${xs[xs.length - 1]},${H}`,
					fill: "currentColor",
					opacity: "0.08"
				}, `a${pts}`);
			}),
			runs.map((pts) => /* @__PURE__ */ jsx("polyline", {
				points: pts,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: stretch ? 2 : 1.5,
				strokeLinejoin: "round",
				strokeLinecap: "round",
				vectorEffect: "non-scaling-stroke"
			}, pts)),
			stretch ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("path", {
				d: `M${x(last)} ${y(values[last])}h0`,
				stroke: "currentColor",
				strokeWidth: "8",
				strokeLinecap: "round",
				vectorEffect: "non-scaling-stroke"
			}), /* @__PURE__ */ jsx("path", {
				d: `M${x(last)} ${y(values[last])}h0`,
				stroke: "var(--surface)",
				strokeWidth: "4",
				strokeLinecap: "round",
				vectorEffect: "non-scaling-stroke"
			})] }) : /* @__PURE__ */ jsx("circle", {
				cx: x(last),
				cy: y(values[last]),
				r: "2.5",
				fill: "var(--surface)",
				stroke: "currentColor",
				strokeWidth: "1.5",
				vectorEffect: "non-scaling-stroke"
			})
		]
	});
}
//#endregion
//#region app/features/hot/Faces.tsx
/**
* Who is talking about a hot story: overlapping faces of the 精选组 sources in the order the server
* gives (T1, T1.5, T2), then a count for everyone else, 氛围组 included. Hover lists every name; where
* the faces are their own control (not inside a link), a tap or Enter opens the list, as the legacy
* list's <details> did, so phones and keyboards reach it too.
*/
function Faces({ participants, total, size = 24, max = 6, interactive = true }) {
	const shown = participants.filter((p) => p.kind === "editorial").slice(0, max);
	const rest = total - shown.length;
	const names = participants.map((p) => shortSourceName(p.name)).join("、");
	const faces = /* @__PURE__ */ jsxs(Fragment, { children: [shown.map((p, i) => /* @__PURE__ */ jsx("span", {
		className: `rounded-full ring-2 ring-surface ${i ? "-ml-1.5" : ""}`,
		children: /* @__PURE__ */ jsx(SourceAvatar, {
			name: p.name,
			iconUrl: p.iconUrl,
			iconSrcSet: p.iconSrcSet,
			size
		})
	}, p.name)), rest > 0 && /* @__PURE__ */ jsxs("span", {
		className: "-ml-1.5 inline-flex items-center justify-center rounded-full bg-bg-sunk px-1.5 text-[10.5px] font-medium text-ink-3 ring-2 ring-surface dark:bg-bg-muted",
		style: {
			height: size,
			minWidth: size
		},
		children: ["+", rest]
	})] });
	if (!interactive) return /* @__PURE__ */ jsx("span", {
		className: "relative z-10 flex shrink-0 items-center",
		title: names,
		children: faces
	});
	return /* @__PURE__ */ jsx(FacesButton, {
		participants,
		total,
		names,
		children: faces
	});
}
function FacesButton({ participants, total, names, children }) {
	const [at, setAt] = useState(null);
	const open = at !== null;
	const root = useRef(null);
	const popup = useRef(null);
	const id = useId();
	useEffect(() => {
		if (!open) return;
		const close = () => setAt(null);
		const onDown = (e) => {
			if (!root.current?.contains(e.target) && !popup.current?.contains(e.target)) close();
		};
		const onKey = (e) => e.key === "Escape" && close();
		document.addEventListener("pointerdown", onDown);
		document.addEventListener("keydown", onKey);
		window.addEventListener("scroll", close, { passive: true });
		window.addEventListener("resize", close);
		return () => {
			document.removeEventListener("pointerdown", onDown);
			document.removeEventListener("keydown", onKey);
			window.removeEventListener("scroll", close);
			window.removeEventListener("resize", close);
		};
	}, [open]);
	const editorial = participants.filter((p) => p.kind === "editorial");
	const signal = participants.filter((p) => p.kind !== "editorial");
	const more = total - participants.length;
	return /* @__PURE__ */ jsxs("span", {
		ref: root,
		className: "relative z-10 inline-flex shrink-0",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			title: names,
			"aria-expanded": open,
			"aria-controls": id,
			"aria-label": `${total} 位参与者，查看名单`,
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (open) return setAt(null);
				const r = e.currentTarget.getBoundingClientRect();
				const below = window.innerHeight - r.bottom > 240;
				setAt({
					top: below ? r.bottom + 6 : Math.max(8, r.top - 6 - 240),
					left: Math.min(Math.max(8, r.left), document.documentElement.clientWidth - 248)
				});
			},
			className: "-m-1 flex items-center rounded-full p-1 outline-offset-2",
			children
		}), open && createPortal(/* @__PURE__ */ jsxs("span", {
			ref: popup,
			id,
			role: "dialog",
			"aria-label": "参与讨论的来源",
			style: at,
			className: "fixed z-50 max-h-[240px] w-[240px] overflow-y-auto rounded-control border border-line bg-raised p-3 text-[12.5px] leading-relaxed text-ink-2 shadow-[var(--shadow-pop)]",
			children: [
				editorial.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: "block text-[11.5px] font-semibold text-ink-4",
					children: "精选组"
				}), /* @__PURE__ */ jsx("span", {
					className: "mt-0.5 block",
					children: editorial.map((p) => shortSourceName(p.name)).join("、")
				})] }),
				signal.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: `block text-[11.5px] font-semibold text-ink-4 ${editorial.length ? "mt-2" : ""}`,
					children: "氛围组"
				}), /* @__PURE__ */ jsx("span", {
					className: "mt-0.5 block",
					children: signal.map((p) => shortSourceName(p.name)).join("、")
				})] }),
				more > 0 && /* @__PURE__ */ jsxs("span", {
					className: "mt-2 block text-[11.5px] text-ink-4",
					children: [
						"另有 ",
						more,
						" 位未列出"
					]
				})
			]
		}), document.body)]
	});
}
//#endregion
//#region app/features/hot/Delta.tsx
/** Change against six hours before the ranking: up in the hot tone, down quiet, new stories marked new, none while sources are behind. */
function Delta({ trend, pct, className = "" }) {
	const base = `inline-flex h-[22px] shrink-0 items-center gap-0.5 rounded-full px-2 text-[11.5px] font-medium tabular-nums ${className}`;
	if (trend === "unknown") return /* @__PURE__ */ jsx("span", {
		className: `${base} bg-bg-sunk text-ink-4 dark:bg-bg-muted/60`,
		title: "部分信源的采集暂时落后，先不和 6 小时前比较",
		children: "暂不比较"
	});
	if (trend === "new" || pct === null) return /* @__PURE__ */ jsx("span", {
		className: `${base} bg-accent-soft text-accent`,
		children: "新上榜"
	});
	if (trend === "flat") return /* @__PURE__ */ jsx("span", {
		className: `${base} bg-bg-sunk text-ink-4 dark:bg-bg-muted/60`,
		title: "较 6 小时前",
		children: "持平"
	});
	const up = trend === "up";
	return /* @__PURE__ */ jsxs("span", {
		className: `${base} ${up ? "bg-hot-soft text-hot" : "bg-bg-sunk text-ink-4 dark:bg-bg-muted/60"}`,
		title: "较 6 小时前",
		children: [
			up ? "↑" : "↓",
			" ",
			Math.abs(Math.round(pct)),
			"%"
		]
	});
}
//#endregion
//#region app/routes/hot.tsx
var hot_exports = /* @__PURE__ */ __exportAll({
	default: () => hot_default,
	headers: () => headers$23,
	loader: () => loader$30,
	meta: () => meta$35
});
async function loader$30({ request }) {
	return { hot: await loadOr404("/api/site/hot", { signal: request.signal }) };
}
function meta$35() {
	return pageMeta({
		title: withSubject("热点榜"),
		description: "过去 48 小时休斯敦火箭全网讨论最多的热点事件：热度指数、趋势与公开信源。",
		path: "/hot",
		image: "/og/pages/hot.png"
	});
}
function headers$23() {
	return { "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=60" };
}
var BADGES = {
	surge: {
		label: "爆",
		tone: "hot",
		hint: "讨论快速增加"
	},
	new: {
		label: "新",
		tone: "accent",
		hint: "首报 6 小时内"
	},
	rising: {
		label: "发酵中",
		tone: "amber",
		hint: "讨论仍在增加"
	}
};
var RANK_COLOR = [
	"text-rank-1",
	"text-rank-2",
	"text-rank-3"
];
var rankColor = (rank) => RANK_COLOR[rank - 1] ?? "text-rank-rest";
var pad$2 = (rank) => String(rank).padStart(2, "0");
/** "TechCrunch、The Verge 等 4 个来源 · 7 位参与者". */
function Voices({ e }) {
	const names = e.sourceNames.slice(0, 2).map(shortSourceName);
	return /* @__PURE__ */ jsxs("span", {
		className: "min-w-0 text-[12.5px] leading-snug text-ink-4",
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "whitespace-nowrap",
				children: [names.length > 0 && /* @__PURE__ */ jsx("span", {
					className: "text-ink-3",
					children: names.join("、")
				}), e.sourceCount > names.length ? ` 等 ${e.sourceCount} 个来源` : names.length ? " 报道" : `${e.sourceCount} 个来源`]
			}),
			/* @__PURE__ */ jsx("span", {
				className: "mx-1.5 text-line-strong",
				children: "·"
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "whitespace-nowrap",
				children: [/* @__PURE__ */ jsx("span", {
					className: "num",
					children: e.participantCount
				}), " 位参与者"]
			})
		]
	});
}
function Badges({ e }) {
	return e.badges.map((b) => /* @__PURE__ */ jsx(Badge$1, {
		tone: BADGES[b].tone,
		title: BADGES[b].hint,
		children: BADGES[b].label
	}, b));
}
/** The whole card opens the event; the title carries the link and stretches over the card. */
function StoryLink({ e, className }) {
	return /* @__PURE__ */ jsx(Link, {
		to: `/story/${e.story.publicId}`,
		prefetch: "intent",
		className: `transition-colors after:absolute after:inset-0 after:content-[''] ${className}`,
		children: e.story.title
	});
}
/**
* The lead card's picture slot when the story has no picture of its own: its day of heat, drawn large
* on a faint wash, with where it peaked. Without enough comparable hours the text takes the width.
*/
function HeatPanel({ e }) {
	const seen = e.spark.filter((v) => v !== null);
	const peak = Math.max(...seen);
	const peakAt = e.spark.findIndex((v) => v === peak);
	return /* @__PURE__ */ jsxs("div", {
		className: "order-first flex aspect-[2/1] flex-col rounded-panel bg-accent-softer p-4 ring-1 ring-inset ring-line-soft xl:order-none xl:aspect-[16/10] dark:bg-accent-soft",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-baseline justify-between text-[11.5px] text-ink-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-semibold text-ink-3",
					children: "24 小时热度"
				}), /* @__PURE__ */ jsxs("span", { children: [
					"峰值 ",
					/* @__PURE__ */ jsx("span", {
						className: "mono text-ink-2",
						children: Math.round(peak)
					}),
					peakAt >= 0 && /* @__PURE__ */ jsxs("span", { children: [" · ", peakAt === e.spark.length - 1 ? "当前" : `${e.spark.length - 1 - peakAt} 小时前`] })
				] })]
			}),
			/* @__PURE__ */ jsx(Sparkline, {
				values: e.spark,
				area: true,
				stretch: true,
				className: "mt-2 min-h-0 w-full flex-1 text-accent"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex justify-between text-[11px] text-ink-4",
				children: [/* @__PURE__ */ jsx("span", { children: "24 小时前" }), /* @__PURE__ */ jsx("span", { children: "现在" })]
			})
		]
	});
}
/** No. 1: the event people are talking about most, with its picture, digest, latest turn and day of heat. */
function Lead({ e }) {
	const panel = !e.cover && e.spark.filter((v) => v !== null).length >= 3;
	return /* @__PURE__ */ jsxs("article", {
		className: "card card-hover group relative flex flex-col overflow-hidden p-5 sm:p-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: `mono text-[12px] font-bold tracking-[0.16em] ${rankColor(e.rank)}`,
						children: ["NO.", pad$2(e.rank)]
					}),
					/* @__PURE__ */ jsx(Badges, { e }),
					/* @__PURE__ */ jsx(Delta, {
						trend: e.trend,
						pct: e.trendPct,
						className: "ml-auto"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: `mt-4 grid gap-5 ${e.cover || panel ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] xl:gap-7" : ""}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[21px] font-bold leading-[1.4] tracking-[-0.01em] text-ink sm:text-[23px] lg:text-[25px] lg:leading-[1.38]",
						children: /* @__PURE__ */ jsx(StoryLink, {
							e,
							className: "group-hover:text-accent"
						})
					}), e.summary && /* @__PURE__ */ jsx("p", {
						className: "mt-3 line-clamp-3 text-[14px] leading-[1.75] text-ink-3",
						children: e.summary
					})]
				}), e.cover ? /* @__PURE__ */ jsx("div", {
					className: "order-first overflow-hidden well rounded-panel xl:order-none",
					children: /* @__PURE__ */ jsx("img", {
						src: e.cover.url,
						srcSet: e.cover.srcSet,
						sizes: "(min-width: 1280px) calc(28vw - 96px), (min-width: 1024px) calc(58vw - 180px), (min-width: 640px) 568px, calc(100vw - 74px)",
						width: e.cover.width ?? void 0,
						height: e.cover.height ?? void 0,
						alt: "",
						loading: "eager",
						fetchPriority: "high",
						decoding: "async",
						className: "aspect-[16/9] size-full object-cover transition-transform duration-500 group-hover:scale-[1.02] xl:aspect-[16/10]"
					})
				}) : panel && /* @__PURE__ */ jsx(HeatPanel, { e })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-auto flex flex-wrap items-end gap-x-6 gap-y-4 pt-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-[1_1_18rem] space-y-2.5",
					children: [e.latest && /* @__PURE__ */ jsxs("p", {
						className: "line-clamp-2 text-[13px] leading-[1.7] text-ink-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mr-2 text-[12px] font-semibold text-accent",
							children: "最新进展"
						}), e.latest]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Faces, {
							participants: e.participants,
							total: e.participantCount,
							size: 24
						}), /* @__PURE__ */ jsx(Voices, { e })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex w-full shrink-0 items-end justify-between gap-5 sm:ml-auto sm:w-auto sm:justify-end",
					children: [!panel && /* @__PURE__ */ jsx(Sparkline, {
						values: e.spark,
						area: true,
						className: "h-10 w-[140px] text-accent"
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-right",
						children: [/* @__PURE__ */ jsx("div", {
							className: "mono text-[34px] font-semibold leading-none tracking-[-0.03em] text-ink",
							children: Math.round(e.heat)
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 text-[11.5px] text-ink-4",
							children: "热度指数"
						})]
					})]
				})]
			})
		]
	});
}
/** No. 2 and 3: the same card, smaller, without the picture. */
function Runner({ e }) {
	return /* @__PURE__ */ jsxs("article", {
		className: "card card-hover group relative flex flex-col px-5 py-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: `mono text-[12px] font-bold tracking-[0.16em] ${rankColor(e.rank)}`,
						children: ["NO.", pad$2(e.rank)]
					}),
					/* @__PURE__ */ jsx(Badges, { e }),
					/* @__PURE__ */ jsx(Delta, {
						trend: e.trend,
						pct: e.trendPct,
						className: "ml-auto"
					})
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-2.5 line-clamp-2 text-[16px] font-[650] leading-[1.5] text-ink",
				children: /* @__PURE__ */ jsx(StoryLink, {
					e,
					className: "group-hover:text-accent"
				})
			}),
			e.summary && /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 line-clamp-2 text-[13px] leading-[1.7] text-ink-3 lg:line-clamp-1",
				children: e.summary
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-auto flex items-end justify-between gap-4 pt-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-col gap-1.5",
					children: [/* @__PURE__ */ jsx(Faces, {
						participants: e.participants,
						total: e.participantCount,
						size: 20
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-[12px] text-ink-4",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "whitespace-nowrap",
								children: [/* @__PURE__ */ jsx("span", {
									className: "num",
									children: e.sourceCount
								}), " 个来源"]
							}),
							" ·",
							" ",
							/* @__PURE__ */ jsxs("span", {
								className: "whitespace-nowrap",
								children: [/* @__PURE__ */ jsx("span", {
									className: "num",
									children: e.participantCount
								}), " 位参与者"]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-end gap-3",
					children: [/* @__PURE__ */ jsx(Sparkline, {
						values: e.spark,
						className: "h-7 w-[92px] text-accent"
					}), /* @__PURE__ */ jsx("span", {
						className: "mono text-[24px] font-semibold leading-none tracking-[-0.02em] text-ink",
						children: Math.round(e.heat)
					})]
				})]
			})
		]
	});
}
/** No. 4–10: a row each, with a line of the digest, faces, the day of heat and the index. */
function Row({ e }) {
	return /* @__PURE__ */ jsxs("li", {
		className: "group relative grid grid-cols-[30px_minmax(0,1fr)] items-start gap-x-3 px-4 py-3 transition-colors hover:bg-bg-sunk/70 sm:px-5 lg:grid-cols-[44px_minmax(0,1fr)_auto_104px_76px] lg:items-center lg:gap-x-6 lg:px-6 lg:py-3.5 dark:hover:bg-bg-muted/40",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: `mono text-[16px] font-semibold leading-[24px] lg:text-[17px] ${rankColor(e.rank)}`,
				"aria-label": `热度排名第 ${e.rank} 位`,
				children: pad$2(e.rank)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ jsxs("h3", {
						className: "text-[15px] font-[650] leading-[1.55] text-ink",
						children: [/* @__PURE__ */ jsx(StoryLink, {
							e,
							className: "group-hover:text-accent"
						}), e.badges.length > 0 && /* @__PURE__ */ jsx("span", {
							className: "ml-2 inline-flex translate-y-[-2px] gap-1 align-middle",
							children: /* @__PURE__ */ jsx(Badges, { e })
						})]
					}),
					e.summary && /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 line-clamp-2 text-[13px] leading-[1.65] text-ink-4 lg:line-clamp-1",
						children: e.summary
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex items-center gap-2.5 lg:hidden",
						children: [
							/* @__PURE__ */ jsx(Faces, {
								participants: e.participants,
								total: e.participantCount,
								size: 20
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-[12px] text-ink-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "num",
									children: e.sourceCount
								}), " 个来源"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "ml-auto flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mono text-[17px] font-semibold leading-none text-ink",
									children: Math.round(e.heat)
								}), /* @__PURE__ */ jsx(Delta, {
									trend: e.trend,
									pct: e.trendPct
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "hidden items-center gap-2.5 lg:flex",
				children: /* @__PURE__ */ jsx(Faces, {
					participants: e.participants,
					total: e.participantCount,
					size: 20
				})
			}),
			/* @__PURE__ */ jsx(Sparkline, {
				values: e.spark,
				className: "hidden h-7 w-[104px] text-accent lg:block"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden flex-col items-end gap-1 lg:flex",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mono text-[20px] font-semibold leading-none tracking-[-0.02em] text-ink",
					children: Math.round(e.heat)
				}), /* @__PURE__ */ jsx(Delta, {
					trend: e.trend,
					pct: e.trendPct
				})]
			})
		]
	});
}
var hot_default = UNSAFE_withComponentProps(function HotPage() {
	const { hot } = useLoaderData();
	const [lead, ...rest] = hot.entries;
	const runners = rest.slice(0, 2);
	const others = rest.slice(2);
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-10",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-5 pt-5 lg:pt-1",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] text-hot",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "relative flex size-2",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-hot opacity-30" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-2 rounded-full bg-hot" })]
						}), "实时热度"]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-1.5 text-[24px] font-bold leading-[1.3] tracking-[-0.01em] text-ink lg:text-[26px]",
						children: withSubject("热点榜")
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1.5 text-[13.5px] text-ink-3",
						children: [
							"过去 ",
							hot.windowHours,
							" 小时，休斯敦火箭全网讨论最多的 ",
							hot.entries.length || 10,
							" 件事"
						]
					})
				] }), hot.computedAt && /* @__PURE__ */ jsxs("p", {
					className: "text-[12px] text-ink-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "num",
						children: monthDayTime(hot.computedAt)
					}), " 更新 · 按讨论热度排序"]
				})]
			}),
			!lead ? /* @__PURE__ */ jsx("div", {
				className: "card rounded-sheet",
				children: /* @__PURE__ */ jsx(EmptyState, {
					title: "暂时没有热点",
					children: "还没有足够多来源共同讨论的事件。"
				})
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("section", {
				"aria-label": "热度前三",
				className: "grid gap-3 lg:grid-cols-12 lg:gap-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid lg:col-span-7 lg:row-span-2 xl:col-span-8",
					children: /* @__PURE__ */ jsx(Lead, { e: lead })
				}), runners.map((e) => /* @__PURE__ */ jsx("div", {
					className: "grid lg:col-span-5 xl:col-span-4",
					children: /* @__PURE__ */ jsx(Runner, { e })
				}, e.story.publicId))]
			}), others.length > 0 && /* @__PURE__ */ jsxs("section", {
				"aria-label": "其余热点",
				className: "mt-6 lg:mt-7",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-baseline justify-between px-1",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-[15px] font-semibold text-ink",
						children: ["继续看 ", /* @__PURE__ */ jsxs("span", {
							className: "num font-normal text-ink-4",
							children: [
								"No.",
								pad$2(others[0].rank),
								"–",
								pad$2(others[others.length - 1].rank)
							]
						})]
					}), /* @__PURE__ */ jsx("span", {
						className: "hidden text-[12px] text-ink-4 lg:block",
						children: "参与者 · 24 小时走势 · 热度指数"
					})]
				}), /* @__PURE__ */ jsx("ol", {
					className: "card divide-y divide-line-soft overflow-hidden",
					children: others.map((e) => /* @__PURE__ */ jsx(Row, { e }, e.story.publicId))
				})]
			})] }),
			/* @__PURE__ */ jsxs("details", {
				className: "disclosure group/method mt-8 text-[12px] text-ink-4",
				children: [/* @__PURE__ */ jsxs("summary", {
					className: "flex items-center gap-1.5 py-1 transition-colors hover:text-ink-2",
					children: [
						/* @__PURE__ */ jsx(IconInfo, { size: 15 }),
						"热度是怎么算的？",
						/* @__PURE__ */ jsxs("span", {
							className: "ml-auto inline-flex items-center gap-0.5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "group-open/method:hidden",
									children: "了解榜单"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "hidden group-open/method:inline",
									children: "收起"
								}),
								/* @__PURE__ */ jsx(IconChevronDown, {
									size: 13,
									className: "transition-transform duration-200 group-open/method:rotate-180"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "max-w-[760px] space-y-2 pb-2 pl-[21px] pt-2 leading-[1.75] text-ink-3",
					children: [
						/* @__PURE__ */ jsx("p", { children: "热度来自参与同一事件的独立账号与机构，重复采集只算一次，并按 24 小时半衰期衰减。它衡量讨论活跃程度，不是报道质量评分。" }),
						/* @__PURE__ */ jsx("p", { children: "榜单统计过去 48 小时。趋势只比较持续覆盖的同一组信源；它反映我们的监测范围，不代表全网人数。缺少可比历史时，不展示趋势线。" }),
						/* @__PURE__ */ jsx("p", { children: "信源名单只展示可公开阅读的报道来源；讨论参与者还包括只计入热度的账号与机构。同一机构的多个渠道可能合并计数，因此参与者不一定多于信源数。点击事件可查看各方报道与观点。" }),
						/* @__PURE__ */ jsx("dl", {
							className: "flex flex-wrap gap-x-5 gap-y-1.5 pt-1",
							children: Object.values(BADGES).map((b) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("dt", { children: /* @__PURE__ */ jsx(Badge$1, {
									tone: b.tone,
									children: b.label
								}) }), /* @__PURE__ */ jsx("dd", { children: b.hint })]
							}, b.label))
						})
					]
				})]
			})
		]
	});
});
//#endregion
//#region app/features/story/HeatChart.tsx
var HOUR = 36e5;
var W = 742;
var H = 280;
var PAD = {
	l: 44,
	r: 16,
	t: 12,
	b: 44
};
function niceStep(max) {
	const raw = max / 4;
	const pow = 10 ** Math.floor(Math.log10(raw || 1));
	return ([
		1,
		2,
		2.5,
		5,
		10
	].map((m) => m * pow).find((s) => s >= raw) ?? raw) || 1;
}
/**
* Hourly heat of one story over its comparable range. Hours that were not fully observed leave a gap
* instead of being drawn as zero; with fewer than three observed hours there is no chart.
*/
function HeatChart({ points }) {
	const [active, setActive] = useState(null);
	const entrance = useEntrance();
	const series = useMemo(() => {
		if (points.length === 0) return [];
		const byHour = new Map(points.map((p) => [Date.parse(p.hour), p]));
		const start = Date.parse(points[0].hour);
		const end = Date.parse(points[points.length - 1].hour);
		const out = [];
		for (let t = start; t <= end; t += HOUR) out.push({
			t,
			p: byHour.get(t) ?? null
		});
		return out;
	}, [points]);
	const geometry = useMemo(() => {
		const seen = series.filter((s) => s.p);
		if (seen.length < 3) return null;
		const last = seen[seen.length - 1];
		const peak = seen.reduce((a, b) => b.p.heat > a.p.heat ? b : a);
		const dayAgo = series.find((s) => s.t === last.t - 24 * HOUR)?.p;
		const change = dayAgo && dayAgo.heat > 0 ? Math.round((last.p.heat - dayAgo.heat) / dayAgo.heat * 100) : null;
		const step = niceStep(peak.p.heat);
		const top = Math.max(step, Math.ceil(peak.p.heat / step) * step);
		const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
		const t0 = series[0].t;
		const span = Math.max(HOUR, series[series.length - 1].t - t0);
		const x = (t) => PAD.l + (t - t0) / span * (W - PAD.l - PAD.r);
		const y = (v) => PAD.t + (1 - v / top) * (H - PAD.t - PAD.b);
		const base = H - PAD.b;
		const runs = [];
		let run = [];
		for (const s of series) if (s.p) run.push({
			t: s.t,
			p: s.p
		});
		else if (run.length) {
			runs.push(run);
			run = [];
		}
		if (run.length) runs.push(run);
		return {
			seen,
			last,
			peak,
			change,
			ticks,
			x,
			y,
			base,
			line: runs.map((r) => r.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(1)} ${y(s.p.heat).toFixed(1)}`).join(" ")).join(" "),
			area: runs.map((r) => {
				const a = r.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(1)} ${y(s.p.heat).toFixed(1)}`).join(" ");
				if (r.length === 1) return "";
				return `${a} L${x(r[r.length - 1].t).toFixed(1)} ${base} L${x(r[0].t).toFixed(1)} ${base} Z`;
			}).join(" "),
			labels: [
				0,
				1 / 3,
				2 / 3,
				1
			].map((f) => t0 + Math.round(f * span / HOUR) * HOUR)
		};
	}, [series]);
	if (!geometry) return /* @__PURE__ */ jsx("p", {
		className: "rounded-tile bg-bg-sunk px-4 py-8 text-center text-[13px] text-ink-4",
		children: "还没有足够的连续观测数据，暂不绘制趋势。"
	});
	const { seen, last, peak, change, ticks, x, y, base, line, area, labels } = geometry;
	const cur = active !== null ? seen[active] : null;
	const pick = (clientX, rect) => {
		const px = (clientX - rect.left) / rect.width * W;
		let best = 0;
		seen.forEach((s, i) => {
			if (Math.abs(x(s.t) - px) < Math.abs(x(seen[best].t) - px)) best = i;
		});
		setActive(best);
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("p", {
			className: "text-[12.5px] text-ink-3",
			children: [
				"当前热度 ",
				/* @__PURE__ */ jsx("b", {
					className: "num font-semibold text-ink",
					children: Math.round(last.p.heat)
				}),
				/* @__PURE__ */ jsx("span", {
					className: "mx-1.5 text-ink-4",
					children: "·"
				}),
				"可比范围峰值 ",
				/* @__PURE__ */ jsx("b", {
					className: "num font-semibold text-ink",
					children: Math.round(peak.p.heat)
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "num text-ink-4",
					children: [
						"（",
						monthDayTime(new Date(peak.t).toISOString()),
						"）"
					]
				}),
				/* @__PURE__ */ jsx("span", {
					className: "mx-1.5 text-ink-4",
					children: "·"
				}),
				"近 24 小时可比范围变化",
				" ",
				/* @__PURE__ */ jsx("b", {
					className: `num font-semibold ${change === null ? "text-ink-4" : change > 0 ? "text-hot" : "text-ink"}`,
					children: change === null ? "–" : `${change > 0 ? "+" : ""}${change}%`
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "relative mt-4",
			children: [/* @__PURE__ */ jsxs("svg", {
				viewBox: `0 0 ${W} ${H}`,
				className: "block h-auto w-full touch-pan-y select-none outline-none",
				role: "img",
				"aria-label": `热度走势：当前 ${Math.round(last.p.heat)}，峰值 ${Math.round(peak.p.heat)}`,
				tabIndex: 0,
				onKeyDown: (e) => {
					if (e.key === "ArrowRight") setActive((a) => Math.min(seen.length - 1, a === null ? seen.length - 1 : a + 1));
					else if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a === null ? seen.length - 1 : a - 1));
					else if (e.key === "Escape") setActive(null);
					else return;
					e.preventDefault();
				},
				onPointerMove: (e) => pick(e.clientX, e.currentTarget.getBoundingClientRect()),
				onPointerDown: (e) => pick(e.clientX, e.currentTarget.getBoundingClientRect()),
				onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null),
				onBlur: () => setActive(null),
				children: [
					ticks.map((v) => /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("line", {
						x1: PAD.l,
						x2: W - PAD.r,
						y1: y(v),
						y2: y(v),
						stroke: "var(--line-soft)",
						strokeWidth: v === 0 ? 1.2 : 1
					}), /* @__PURE__ */ jsx("text", {
						x: PAD.l - 9,
						y: y(v) + 4,
						textAnchor: "end",
						fontSize: "11",
						fill: "var(--ink-4)",
						className: "mono",
						children: v
					})] }, v)),
					/* @__PURE__ */ jsx("path", {
						d: area,
						fill: "var(--note)",
						fillOpacity: .1,
						className: entrance ? "anim-fade-in" : "",
						style: entrance ? {
							animationDuration: "500ms",
							animationDelay: "300ms"
						} : void 0
					}),
					/* @__PURE__ */ jsx("path", {
						d: line,
						fill: "none",
						stroke: "var(--note)",
						strokeWidth: "2",
						strokeLinejoin: "round",
						strokeLinecap: "round",
						pathLength: 1,
						className: entrance ? "anim-draw" : ""
					}),
					!cur && /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("circle", {
						cx: x(last.t),
						cy: y(last.p.heat),
						r: "5",
						fill: "var(--surface)",
						stroke: "var(--note)",
						strokeWidth: "2"
					}), /* @__PURE__ */ jsx("circle", {
						cx: x(last.t),
						cy: y(last.p.heat),
						r: "2",
						fill: "var(--note)"
					})] }),
					cur && /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("line", {
						x1: x(cur.t),
						x2: x(cur.t),
						y1: PAD.t,
						y2: base,
						stroke: "var(--line-strong)",
						strokeDasharray: "3 3"
					}), /* @__PURE__ */ jsx("circle", {
						cx: x(cur.t),
						cy: y(cur.p.heat),
						r: "5",
						fill: "var(--surface)",
						stroke: "var(--accent)",
						strokeWidth: "2"
					})] }),
					labels.map((t, i) => {
						const [d, hm] = monthDayTime(new Date(t).toISOString()).split(" ");
						return /* @__PURE__ */ jsxs("text", {
							x: x(t),
							y: base + 18,
							textAnchor: i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle",
							fontSize: "11",
							fill: "var(--ink-4)",
							className: "mono",
							children: [/* @__PURE__ */ jsx("tspan", {
								x: x(t),
								children: d
							}), /* @__PURE__ */ jsx("tspan", {
								x: x(t),
								dy: "14",
								children: hm
							})]
						}, t);
					})
				]
			}), cur && /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-control border border-line bg-raised px-2.5 py-1.5 text-[12px] shadow-[var(--shadow-pop)]",
				style: { left: `${Math.min(88, Math.max(12, x(cur.t) / W * 100))}%` },
				children: [/* @__PURE__ */ jsx("div", {
					className: "num text-ink-4",
					children: monthDayTime(new Date(cur.t).toISOString())
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-ink-2",
					children: [
						"热度 ",
						/* @__PURE__ */ jsx("b", {
							className: "num font-semibold text-ink",
							children: cur.p.heat.toFixed(1)
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mx-1 text-ink-4",
							children: "·"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "num",
							children: cur.p.participants
						}),
						" 位参与者"
					]
				})]
			})]
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-3 text-[12px] leading-relaxed text-ink-4",
			children: "趋势仅比较持续完整观测到的相同主体，范围可能小于当前热度统计。移动指针或点击图表查看每小时热度；键盘可用左右方向键切换。"
		})
	] });
}
//#endregion
//#region app/routes/story.tsx
var story_exports = /* @__PURE__ */ __exportAll({
	default: () => story_default,
	headers: () => headers$22,
	loader: () => loader$29,
	meta: () => meta$34
});
async function loader$29({ params, request }) {
	const res = await fetch(`${process.env.API_BASE_URL || "http://127.0.0.1:3001"}/api/site/stories/${encodeURIComponent(params.publicId)}`, {
		redirect: "manual",
		signal: AbortSignal.any([request.signal, AbortSignal.timeout(15e3)])
	});
	if (res.status === 308) {
		const target = await res.json();
		throw redirect(`/story/${target.mergedInto}`, 308);
	}
	if (res.status === 404) throw data({ message: "not_found" }, { status: 404 });
	if (!res.ok) throw data({ message: "unavailable" }, { status: 503 });
	return { story: await res.json() };
}
function meta$34({ loaderData }) {
	if (!loaderData) return [{ title: titled("事件不存在") }, {
		name: "robots",
		content: "noindex"
	}];
	const s = loaderData.story;
	return pageMeta({
		title: s.title,
		description: (s.digest ?? s.summary)?.slice(0, 150) ?? `${s.sourceCount} 个报道来源 ${s.reportCount} 篇报道，完整时间线与最新进展。`,
		path: `/story/${s.publicId}`,
		image: `/og/stories/${s.publicId}.png`,
		type: "article",
		jsonLd: breadcrumbLd([
			{
				name: SITE.name,
				path: "/"
			},
			{
				name: "热点榜",
				path: "/hot"
			},
			{
				name: s.title,
				path: `/story/${s.publicId}`
			}
		])
	});
}
function headers$22() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=120" };
}
var STATUS = {
	active: {
		label: "持续更新",
		tone: "hot"
	},
	watching: {
		label: "观察中",
		tone: "amber"
	},
	settled: {
		label: "历史事件",
		tone: "neutral"
	}
};
var SECTIONS$1 = {
	overview: "event-overview",
	reports: "event-reports",
	heat: "event-heat"
};
var useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
/** A main-column card: 17px title, 24px padding. */
function Panel({ id, title, sub, right, children, className = "" }) {
	return /* @__PURE__ */ jsxs("section", {
		id,
		className: `card scroll-mt-[64px] p-5 lg:p-6 ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[17px] font-[650] leading-[1.5] text-ink",
					children: title
				}), sub && /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-[12.5px] text-ink-4",
					children: sub
				})]
			}), right && /* @__PURE__ */ jsx("div", {
				className: "shrink-0 text-[11.5px] text-ink-4",
				children: right
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-3.5",
			children
		})]
	});
}
/** A rail card: 14px title, 22px padding. */
function RailCard({ title, right, children, className = "" }) {
	return /* @__PURE__ */ jsxs("section", {
		className: `card p-5 lg:p-[22px] ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-[14px] font-[650] text-ink",
				children: title
			}), right && /* @__PURE__ */ jsx("span", {
				className: "num text-[11.5px] text-ink-4",
				children: right
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-2",
			children
		})]
	});
}
/** Highlights the section nav entry whose section is under the sticky bar. */
function useActiveSection(keys) {
	const [active, setActive] = useState("overview");
	useEffect(() => {
		const els = keys.map((k) => document.getElementById(SECTIONS$1[k])).filter((e) => !!e);
		const onScroll = () => {
			let cur = keys[0];
			for (const [i, el] of els.entries()) if (el.getBoundingClientRect().top <= 96) cur = keys[i];
			if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = keys[keys.length - 1];
			setActive(cur);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [keys.join()]);
	const go = (k) => {
		const el = document.getElementById(SECTIONS$1[k]);
		if (!el) return;
		el.scrollIntoView({
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
			block: "start"
		});
		history.replaceState(history.state, "", `#${SECTIONS$1[k]}`);
	};
	return [active, go];
}
function dayLabelOf(day) {
	const [, m, d] = day.split("-").map(Number);
	return `${m}月${d}日`;
}
/** One report on the story timeline: time, source and marks, title, a summary that opens on demand. */
function TimelineRow({ r }) {
	const [open, setOpen] = useState(false);
	const [clamped, setClamped] = useState(false);
	const ref = useRef(null);
	useIsoLayoutEffect(() => {
		const el = ref.current;
		if (el && !open) setClamped(el.scrollHeight > el.clientHeight + 1);
	}, [r.summary, open]);
	return /* @__PURE__ */ jsxs("li", {
		className: "grid gap-x-3 border-b border-line-soft py-4 last:border-b-0 lg:grid-cols-[48px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ jsx("time", {
			dateTime: r.publishedAt,
			className: "mono text-[12px] leading-[20px] text-ink-4",
			children: beijingTime(r.publishedAt)
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-[12px] leading-[20px] text-ink-4 lg:mt-0",
					children: [/* @__PURE__ */ jsx("span", {
						className: "min-w-0 truncate",
						children: r.source.name.replace(/（RSS）|（网页）|（API）/g, "")
					}), r.selected && /* @__PURE__ */ jsx(SelectedBadge, {})]
				}),
				/* @__PURE__ */ jsx(Link, {
					to: `/items/${r.id}`,
					prefetch: "intent",
					className: "mt-1 block text-[16px] font-[650] leading-[1.6] text-ink transition-colors hover:text-accent lg:text-[15.5px]",
					children: r.title
				}),
				r.summary && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
					ref,
					className: `mt-1 text-[14px] leading-[1.75] text-ink-3 ${open ? "" : "line-clamp-2"}`,
					children: r.summary
				}), (clamped || open) && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setOpen(!open),
					"aria-expanded": open,
					className: "mt-1 text-[12.5px] text-note transition-colors hover:text-accent",
					children: open ? "收起摘要" : "展开摘要"
				})] })
			]
		})]
	});
}
var story_default = UNSAFE_withComponentProps(function StoryPage() {
	const { story } = useLoaderData();
	const [filter, setFilter] = useState("all");
	const [order, setOrder] = useState("desc");
	const status = STATUS[story.status];
	const observed = story.status !== "settled" || story.heat.length > 0 || story.whyHot.participants48h > 0 || story.whyHot.rank !== null;
	const [activeSection, goSection] = useActiveSection(observed ? [
		"overview",
		"reports",
		"heat"
	] : ["overview", "reports"]);
	const counts = {
		all: story.timeline.length,
		official: story.timeline.filter((r) => r.source.firstParty).length,
		selected: story.timeline.filter((r) => r.selected).length
	};
	const days = useMemo(() => {
		const sorted = [...story.timeline.filter((r) => filter === "official" ? r.source.firstParty : filter === "selected" ? r.selected : true)].sort((a, b) => order === "desc" ? Date.parse(b.publishedAt) - Date.parse(a.publishedAt) : Date.parse(a.publishedAt) - Date.parse(b.publishedAt));
		const out = [];
		for (const r of sorted) {
			const d = beijingDate(r.publishedAt);
			const last = out[out.length - 1];
			if (last && last.day === d) last.rows.push(r);
			else out.push({
				day: d,
				rows: [r]
			});
		}
		return out;
	}, [
		story.timeline,
		filter,
		order
	]);
	const newest = story.timeline.reduce((a, b) => !a || Date.parse(b.publishedAt) > Date.parse(a.publishedAt) ? b : a, null);
	const overview = story.digest ? {
		label: "事件综述",
		text: story.digest,
		note: story.digestUpdatedAt ? `前线报道汇总 · ${relativeTime(story.digestUpdatedAt)}更新` : "前线报道汇总"
	} : story.summary ? {
		label: "事实说明",
		text: story.summary,
		note: null
	} : story.excerpt ? {
		label: "报道摘要",
		text: story.excerpt.text,
		note: `摘自 ${story.excerpt.sourceName}`
	} : null;
	const showOfficial = () => {
		setFilter("official");
		goSection("reports");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-[var(--page-max-reading)] pb-10",
		children: [
			/* @__PURE__ */ jsxs("nav", {
				"aria-label": "位置",
				className: "flex items-center gap-2.5 pb-4 pt-5 text-[12px] text-ink-4 lg:pb-5 lg:pt-4",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						to: "/hot",
						className: "inline-flex items-center gap-1.5 transition-colors hover:text-ink",
						children: [/* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }), " 热点榜"]
					}),
					/* @__PURE__ */ jsx("span", {
						className: "h-3 w-px bg-line-strong",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ jsx("span", { children: "事件详情" })
				]
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "max-w-[960px]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-[12px] text-ink-4",
						children: ["热点事件", /* @__PURE__ */ jsx(Badge$1, {
							tone: status.tone,
							children: status.label
						})]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-2.5 text-[27px] font-bold leading-[1.5] tracking-[-0.01em] text-ink lg:mt-3 lg:text-[36px] lg:font-[730]",
						children: story.title
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-ink-3",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx(IconDoc, {
										size: 15,
										className: "text-ink-4"
									}),
									/* @__PURE__ */ jsx("b", {
										className: "num font-semibold text-ink",
										children: story.reportCount
									}),
									" 篇报道"
								]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx(IconUsers, {
										size: 15,
										className: "text-ink-4"
									}),
									/* @__PURE__ */ jsx("b", {
										className: "num font-semibold text-ink",
										children: story.sourceCount
									}),
									" 个报道来源"
								]
							}),
							story.latestAt && /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5",
								suppressHydrationWarning: true,
								children: [
									/* @__PURE__ */ jsx(IconClock, {
										size: 15,
										className: "text-ink-4"
									}),
									relativeTime(story.latestAt),
									"更新"
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky top-0 z-20 -mx-4 mt-5 bg-bg/90 px-4 py-2 backdrop-blur-md lg:mx-0 lg:px-0",
				children: /* @__PURE__ */ jsx(PillTabs, {
					size: "sm",
					layoutId: "story-sections",
					label: "事件内容导航",
					active: activeSection,
					onSelect: (k) => goSection(k),
					items: [
						{
							key: "overview",
							label: "事件概览"
						},
						{
							key: "reports",
							label: "报道时间线",
							count: story.reportCount
						},
						...observed ? [{
							key: "heat",
							label: "热度走势"
						}] : []
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "contents lg:flex lg:min-w-0 lg:flex-col lg:gap-6",
					children: [
						/* @__PURE__ */ jsxs(Panel, {
							id: SECTIONS$1.overview,
							title: "先了解这件事",
							right: overview?.label,
							className: "order-1",
							children: [overview ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
								className: "whitespace-pre-line text-[15px] leading-[1.85] text-ink-2",
								children: overview.text
							}), overview.note && /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-[12px] text-ink-4",
								suppressHydrationWarning: true,
								children: overview.note
							})] }) : /* @__PURE__ */ jsx("p", {
								className: "text-[13.5px] text-ink-4",
								children: "还没有综述，先看下面的报道时间线。"
							}), story.latest && /* @__PURE__ */ jsxs("div", {
								className: "-mx-5 mt-5 border-t border-line-soft px-5 pt-4 lg:-mx-6 lg:px-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5 text-[12px]",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-ink",
										children: "最新进展"
									}), story.latestAt && /* @__PURE__ */ jsx("span", {
										className: "num text-ink-4",
										children: monthDayTime(story.latestAt)
									})]
								}), newest ? /* @__PURE__ */ jsxs(Link, {
									to: `/items/${newest.id}`,
									className: "group mt-1.5 inline text-[14px] leading-[1.7] text-ink-2 transition-colors hover:text-accent",
									children: [story.latest, /* @__PURE__ */ jsx(IconChevronRight, {
										size: 14,
										className: "ml-0.5 inline -translate-y-px text-ink-4 transition-transform group-hover:translate-x-0.5"
									})]
								}) : /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-[14px] leading-[1.7] text-ink-2",
									children: story.latest
								})]
							})]
						}),
						story.developments.length > 1 && /* @__PURE__ */ jsx(Panel, {
							title: "事件进展",
							right: `${story.developments.length} 个进展`,
							className: "order-3",
							children: /* @__PURE__ */ jsx("ol", {
								className: "relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-line",
								children: story.developments.map((d, i) => /* @__PURE__ */ jsxs("li", {
									className: "relative",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: `absolute -left-5 top-[7px] size-[7px] rounded-full ring-4 ring-surface ${i === 0 ? "bg-accent" : "bg-line-strong"}`,
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "num text-[12px] text-ink-4",
											children: [
												monthDayTime(d.firstReportAt),
												" · ",
												d.reportCount,
												" 篇报道"
											]
										}),
										/* @__PURE__ */ jsx(Link, {
											to: `/items/${d.representative.id}`,
											className: "mt-0.5 block text-[15px] font-semibold leading-snug text-ink transition-colors hover:text-accent",
											children: d.title
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-0.5 truncate text-[12.5px] text-ink-4",
											children: [
												shortSourceName(d.representative.source.name),
												"：",
												d.representative.title
											]
										})
									]
								}, d.factId))
							})
						}),
						/* @__PURE__ */ jsxs(Panel, {
							id: SECTIONS$1.reports,
							title: "报道时间线",
							sub: "沿着报道，了解事件的不同侧面。",
							className: "order-4",
							right: /* @__PURE__ */ jsxs(Select$1, {
								value: order,
								onChange: (e) => setOrder(e.target.value),
								"aria-label": "排序",
								children: [/* @__PURE__ */ jsx("option", {
									value: "desc",
									children: "最新在前"
								}), /* @__PURE__ */ jsx("option", {
									value: "asc",
									children: "最早在前"
								})]
							}),
							children: [
								/* @__PURE__ */ jsx(PillTabs, {
									size: "xs",
									layoutId: "story-report-filter",
									label: "报道筛选",
									active: filter,
									onSelect: (k) => setFilter(k),
									items: [
										{
											key: "all",
											label: "全部报道",
											count: counts.all
										},
										{
											key: "official",
											label: "官方一手",
											count: counts.official
										},
										{
											key: "selected",
											label: "精选报道",
											count: counts.selected
										}
									]
								}),
								days.length === 0 ? /* @__PURE__ */ jsx("p", {
									className: "py-10 text-center text-[13px] text-ink-4",
									children: "这个筛选下没有报道。"
								}) : days.map(({ day, rows }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "pb-0.5 pt-5 text-[14px] font-semibold text-ink",
									children: dayLabelOf(day)
								}), /* @__PURE__ */ jsx("ol", { children: rows.map((r) => /* @__PURE__ */ jsx(TimelineRow, { r }, r.id)) })] }, day)),
								story.reportCount > story.timeline.length && /* @__PURE__ */ jsxs("p", {
									className: "pt-3 text-center text-[12px] text-ink-4",
									children: [
										"显示最近 ",
										story.timeline.length,
										" 篇，共 ",
										story.reportCount,
										" 篇报道。"
									]
								})
							]
						}),
						observed && /* @__PURE__ */ jsx(Panel, {
							id: SECTIONS$1.heat,
							title: "本事件热度走势",
							className: "order-5",
							children: /* @__PURE__ */ jsx(HeatChart, { points: story.heat })
						}),
						story.related.length > 0 && /* @__PURE__ */ jsx(Panel, {
							title: "关联事件",
							className: "order-6",
							children: /* @__PURE__ */ jsx("ul", {
								className: "-my-1 divide-y divide-line-soft",
								children: story.related.map((r) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
									to: `/story/${r.publicId}`,
									className: "group flex items-baseline gap-3 py-3",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "shrink-0 text-[12px] text-ink-4",
											children: r.relation === "storyline" ? "同一故事线" : "相关事件"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "min-w-0 flex-1 text-[14.5px] font-medium text-ink-2 transition-colors group-hover:text-accent",
											children: r.title
										}),
										/* @__PURE__ */ jsx(IconChevronRight, {
											size: 14,
											className: "shrink-0 self-center text-ink-4"
										})
									]
								}) }, r.publicId))
							})
						})
					]
				}), /* @__PURE__ */ jsxs("aside", {
					className: "order-2 flex min-w-0 flex-col gap-4 lg:order-none lg:gap-5",
					children: [
						observed && /* @__PURE__ */ jsxs(RailCard, {
							title: "为什么热",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-[12.5px] leading-[1.75] text-ink-3",
									children: [
										"过去 48 小时，已观察到 ",
										/* @__PURE__ */ jsx("b", {
											className: "num font-semibold text-ink",
											children: story.whyHot.participants48h
										}),
										" 个独立主体参与讨论或报道，最近 6 小时新增",
										" ",
										/* @__PURE__ */ jsx("b", {
											className: "num font-semibold text-ink",
											children: story.whyHot.newParticipants6h
										}),
										" 个。"
									]
								}),
								!story.whyHot.observationComplete && /* @__PURE__ */ jsx("p", {
									className: "mt-2 text-[12px] leading-relaxed text-ink-4",
									children: "部分信源观测不完整，以上仅为已观察到的参与。"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-2 text-[12px] text-ink-4",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "num",
											children: story.whyHot.recentReports24h
										}),
										" 篇近期报道",
										story.whyHot.rank && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
											className: "mx-1",
											children: "·"
										}), /* @__PURE__ */ jsxs(Link, {
											to: "/hot",
											className: "text-accent hover:underline",
											children: [
												"热点榜第 ",
												story.whyHot.rank,
												" 名"
											]
										})] })
									]
								})
							]
						}),
						story.officialReports.length > 0 && /* @__PURE__ */ jsxs(RailCard, {
							title: "官方一手",
							right: `${counts.official || story.officialReports.length} 篇`,
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-ink-4",
									children: "直接了解当事方的说法"
								}),
								/* @__PURE__ */ jsx("ul", {
									className: "mt-1 divide-y divide-line-soft",
									children: story.officialReports.slice(0, 5).map((r) => /* @__PURE__ */ jsxs("li", {
										className: "py-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "truncate text-[11.5px] text-ink-4",
											children: r.source.name
										}), /* @__PURE__ */ jsxs(Link, {
											to: `/items/${r.id}`,
											className: "group mt-1 block text-[13.5px] font-semibold leading-[1.6] text-ink transition-colors hover:text-accent",
											children: [r.title, /* @__PURE__ */ jsx(IconChevronRight, {
												size: 13,
												className: "ml-0.5 inline -translate-y-px text-ink-4 transition-transform group-hover:translate-x-0.5"
											})]
										})]
									}, r.id))
								}),
								counts.official > 0 && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: showOfficial,
									className: "text-[12px] text-ink-4 transition-colors hover:text-accent",
									children: "在时间线筛选全部官方报道"
								})
							]
						}),
						/* @__PURE__ */ jsxs(RailCard, {
							title: "事件记录",
							className: "hidden lg:block",
							children: [/* @__PURE__ */ jsxs("dl", {
								className: "space-y-2 text-[12.5px]",
								children: [story.firstReportAt && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-ink-4",
										children: "最早报道"
									}), /* @__PURE__ */ jsx("dd", {
										className: "num text-ink-2",
										children: /* @__PURE__ */ jsx("time", {
											dateTime: story.firstReportAt,
											children: monthDayTime(story.firstReportAt)
										})
									})]
								}), story.latestAt && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-ink-4",
										children: "最近更新"
									}), /* @__PURE__ */ jsx("dd", {
										className: "num text-ink-2",
										children: /* @__PURE__ */ jsx("time", {
											dateTime: story.latestAt,
											children: monthDayTime(story.latestAt)
										})
									})]
								})]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-3 border-t border-line-soft pt-3 text-[12px] leading-relaxed text-ink-4",
								children: "同一事件的报道集中在这里，新的进展会继续补充。"
							})]
						})
					]
				})]
			})
		]
	});
});
//#endregion
//#region app/features/report/format.ts
var KINDS$1 = [
	"daily",
	"weekly",
	"monthly"
];
var KIND_PATH = {
	daily: "/daily",
	weekly: "/weekly",
	monthly: "/monthly"
};
var KIND_LABEL$1 = {
	daily: "日报",
	weekly: "周报",
	monthly: "月报"
};
function kindFromPath(pathname) {
	if (pathname.startsWith("/weekly")) return "weekly";
	if (pathname.startsWith("/monthly")) return "monthly";
	return "daily";
}
function reportPath(kind, key) {
	return `${KIND_PATH[kind]}/${key}`;
}
var pad$1 = (n) => String(n).padStart(2, "0");
var ymd = (d) => `${d.getUTCFullYear()}-${pad$1(d.getUTCMonth() + 1)}-${pad$1(d.getUTCDate())}`;
/** Monday and Sunday (YYYY-MM-DD) of an ISO week key such as 2026-W38. */
function isoWeekRange(key) {
	const [y, w] = key.split("-W").map(Number);
	const jan4 = new Date(Date.UTC(y, 0, 4));
	const monday = /* @__PURE__ */ new Date(jan4.getTime() - (jan4.getUTCDay() + 6) % 7 * 864e5 + (w - 1) * 7 * 864e5);
	return [ymd(monday), ymd(new Date(monday.getTime() + 5184e5))];
}
/** "今日火箭 4 件重点动态" / "本周火箭 12 件重点动态" / "8 月火箭 20 件重点动态". */
function headline(kind, key, count) {
	if (kind === "daily") return `今日火箭 ${count} 件重点动态`;
	if (kind === "weekly") return `本周火箭 ${count} 件重点动态`;
	return `${Number(key.slice(5, 7))} 月火箭 ${count} 件重点动态`;
}
/** "09.16" for a story inside a week or month. */
function shortDay(iso) {
	const d = new Date(Date.parse(iso) + 288e5);
	return `${pad$1(d.getUTCMonth() + 1)}.${pad$1(d.getUTCDate())}`;
}
/** Month-day label of a daily key: "9月26日". */
function dayLabel(key) {
	return `${Number(key.slice(5, 7))}月${Number(key.slice(8, 10))}日`;
}
/**
* The archive column: days grouped by month, weeks by the month their Monday falls in ("第2周"),
* months by year. Newest first, as the index comes.
*/
function archiveGroups(kind, index) {
	const groups = [];
	const push = (id, label, e) => {
		const g = groups[groups.length - 1];
		if (g && g.id === id) g.entries.push(e);
		else groups.push({
			id,
			label,
			entries: [e]
		});
	};
	if (kind === "weekly") {
		const byMonth = /* @__PURE__ */ new Map();
		for (const e of index) {
			const m = isoWeekRange(e.key)[0].slice(0, 7);
			byMonth.set(m, [...byMonth.get(m) ?? [], e.key]);
		}
		for (const e of index) {
			const m = isoWeekRange(e.key)[0].slice(0, 7);
			const weeks = [...byMonth.get(m)].sort();
			push(m, `${m.slice(0, 4)} 年 ${Number(m.slice(5))} 月`, {
				...e,
				short: `第${weeks.indexOf(e.key) + 1}周`
			});
		}
		return groups;
	}
	for (const e of index) if (kind === "daily") push(e.key.slice(0, 7), `${e.key.slice(0, 4)} 年 ${Number(e.key.slice(5, 7))} 月`, {
		...e,
		short: `${Number(e.key.slice(8, 10))} 日`
	});
	else push(e.key.slice(0, 4), `${e.key.slice(0, 4)} 年`, {
		...e,
		short: `${Number(e.key.slice(5, 7))} 月`
	});
	return groups;
}
/** An issue's mark in the archive column: a large number over a small word (a month's number stands alone). */
function archiveMark(kind, key) {
	if (kind === "daily") return {
		big: key.slice(8, 10),
		small: beijingWeekday(key).replace("星期", "周")
	};
	if (kind === "weekly") {
		const start = isoWeekRange(key)[0];
		return {
			big: key.slice(6),
			small: `${Number(start.slice(5, 7))}.${Number(start.slice(8, 10))} 起`
		};
	}
	return {
		big: key.slice(5, 7),
		small: null
	};
}
/** Short chip label for the phone switcher: "今天", "9月26日", "9月第2周", "8 月". */
function chipLabel(kind, key, index, today) {
	if (kind === "daily") return key === today ? "今天" : dayLabel(key);
	if (kind === "monthly") return `${Number(key.slice(5, 7))} 月`;
	const group = archiveGroups("weekly", index).find((g) => g.entries.some((e) => e.key === key));
	const entry = group?.entries.find((e) => e.key === key);
	return group && entry ? `${Number(group.id.slice(5))}月${entry.short}` : key;
}
/** "第 N 期": the issue's place in its series, counted from the first report that exists. */
function issueNumber(index, key) {
	const at = index.findIndex((e) => e.key === key);
	return at < 0 ? null : index.length - at;
}
/** The masthead's date block: a large figure and two small lines beside it. */
function dateMark(kind, key) {
	if (kind === "daily") return {
		figure: key.slice(8, 10),
		top: `${key.slice(0, 4)} 年 ${Number(key.slice(5, 7))} 月`,
		bottom: beijingWeekday(key)
	};
	if (kind === "weekly") {
		const [a, b] = isoWeekRange(key);
		return {
			figure: key.slice(6),
			top: `${key.slice(0, 4)} 年第 ${Number(key.slice(6))} 周`,
			bottom: `${a.slice(5).replace("-", ".")} — ${b.slice(5).replace("-", ".")}`
		};
	}
	return {
		figure: key.slice(5, 7),
		top: `${key.slice(0, 4)} 年`,
		bottom: `${Number(key.slice(5, 7))} 月`
	};
}
/** When each kind comes out (F10), for the masthead. */
var EDITION = {
	daily: "每天 08:00 出刊",
	weekly: "每周一出刊",
	monthly: "每月 1 日出刊"
};
/** The masthead's figures, in the order a reader wants them; zero model releases is left out. */
var METRICS = [
	["totalEvents", "件大事"],
	["totalStories", "件大事"],
	["sourcesCount", "个来源"],
	["firstPartyEvents", "件一手发布"],
	["modelsReleased", "个新模型"],
	["selectedCount", "条精选"],
	["reportsCovered", "期日报"]
];
function metricItems(metrics) {
	return METRICS.filter(([k]) => typeof metrics[k] === "number" && (k !== "modelsReleased" || metrics[k] > 0)).map(([k, unit]) => ({
		value: metrics[k],
		unit
	}));
}
/** "前一日 · 9月25日", "上一期 · 第 37 周", "下一期 · 7 月". */
function neighbourLabel(kind, key, direction) {
	if (kind === "daily") return `${direction === "prev" ? "前一日" : "后一日"} · ${dayLabel(key)}`;
	const which = direction === "prev" ? "上一期" : "下一期";
	return kind === "weekly" ? `${which} · 第 ${Number(key.slice(6))} 周` : `${which} · ${Number(key.slice(5, 7))} 月`;
}
var CN = [
	"零",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九",
	"十"
];
/** Page numbers as a Chinese paper prints them: 1 → 一, 12 → 十二, 20 → 二十. */
function cnNumber(n) {
	if (n <= 10) return CN[n];
	if (n < 20) return `十${CN[n - 10]}`;
	return `${CN[Math.floor(n / 10)]}十${n % 10 ? CN[n % 10] : ""}`;
}
/** The line above the nameplate: "2026 年 9 月 26 日 · 星期六", "2026 年第 38 周 · 09.14 — 09.20", "2026 年 8 月". */
function dateLine(kind, key) {
	const m = dateMark(kind, key);
	if (kind === "daily") return `${m.top} ${Number(key.slice(8, 10))} 日 · ${m.bottom}`;
	return kind === "weekly" ? `${m.top} · ${m.bottom}` : `${m.top} ${m.bottom}`;
}
/** What each kind is, under its nameplate. */
var MOTTO = {
	daily: "休斯敦火箭 · 每日晨报",
	weekly: "休斯敦火箭 · 每周综述",
	monthly: "休斯敦火箭 · 每月盘点"
};
/** ISO week number of a date (YYYY-MM-DD). */
function isoWeek(day) {
	const d = /* @__PURE__ */ new Date(`${day}T00:00:00Z`);
	const thursday = new Date(d.getTime() + (3 - (d.getUTCDay() + 6) % 7) * 864e5);
	const jan1 = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
	return Math.floor((thursday.getTime() - jan1.getTime()) / 864e5 / 7) + 1;
}
/**
* The dot grid beside the date in the masthead: the days of this issue's month (dailies, Monday first),
* the weeks of its year (weeklies) or the months of its year (monthlies), each marked as this issue,
* an issue that exists, or none.
*/
function periodGrid(kind, key, index) {
	const exists = new Set(index.map((e) => e.key));
	const cell = (k, name) => {
		const n = issueNumber(index, k);
		return {
			key: k,
			label: n ? `${name} · 第 ${n} 期` : `${name} · 未出刊`,
			state: k === key ? "current" : exists.has(k) ? "issue" : "none"
		};
	};
	const count = (cells) => cells.filter((c) => c.state === "issue" || c.state === "current").length;
	const year = key.slice(0, 4);
	if (kind === "daily") {
		const m = Number(key.slice(5, 7));
		const days = new Date(Date.UTC(Number(year), m, 0)).getUTCDate();
		const lead = (new Date(Date.UTC(Number(year), m - 1, 1)).getUTCDay() + 6) % 7;
		const cells = [...Array.from({ length: lead }, () => ({
			key: null,
			label: "",
			state: "pad"
		})), ...Array.from({ length: days }, (_, i) => cell(`${key.slice(0, 7)}-${pad$1(i + 1)}`, `${m}月${i + 1}日`))];
		return {
			title: `${cnNumber(m)}月`,
			note: `本月 ${count(cells)} 期`,
			columns: 7,
			heads: [
				"一",
				"二",
				"三",
				"四",
				"五",
				"六",
				"日"
			],
			cells
		};
	}
	if (kind === "weekly") {
		const weeks = isoWeek(`${year}-12-28`);
		const cells = Array.from({ length: weeks }, (_, i) => {
			const k = `${year}-W${pad$1(i + 1)}`;
			const [a, b] = isoWeekRange(k);
			return cell(k, `第 ${i + 1} 周（${a.slice(5).replace("-", ".")}—${b.slice(5).replace("-", ".")}）`);
		});
		return {
			title: `${year} 年`,
			note: `全年 ${count(cells)} 期`,
			columns: 13,
			heads: null,
			cells
		};
	}
	const cells = Array.from({ length: 12 }, (_, i) => cell(`${year}-${pad$1(i + 1)}`, `${i + 1} 月`));
	return {
		title: `${year} 年`,
		note: `全年 ${count(cells)} 期`,
		columns: 6,
		heads: null,
		cells
	};
}
//#endregion
//#region app/features/report/ReportNav.tsx
/** 日报 / 周报 / 月报 as the site's pill switch, spread across the column. */
function KindSwitch({ kind }) {
	return /* @__PURE__ */ jsx(PillTabs, {
		fill: true,
		layoutId: "report-kind",
		label: "切换日报、周报、月报",
		active: kind,
		items: KINDS$1.map((k) => ({
			key: k,
			label: KIND_LABEL$1[k],
			to: KIND_PATH[k]
		}))
	});
}
/** Desktop archive column: every issue of this kind, grouped, the current one highlighted. */
function ReportArchive({ kind, index, current }) {
	const groups = archiveGroups(kind, index);
	const openId = groups.find((g) => g.entries.some((e) => e.key === current))?.id ?? groups[0]?.id;
	return /* @__PURE__ */ jsxs("aside", {
		className: "sticky top-0 hidden h-dvh w-[280px] shrink-0 flex-col border-r border-line bg-[color-mix(in_srgb,var(--sidebar)_50%,var(--surface))] pl-5 pr-3 lg:flex dark:bg-[color-mix(in_srgb,var(--sidebar)_50%,var(--bg))]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "pb-4 pt-8",
				children: /* @__PURE__ */ jsx(KindSwitch, { kind })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-line-strong pb-2 pl-1 text-[11.5px] font-semibold tracking-[0.3em] text-ink",
				children: "往期"
			}),
			/* @__PURE__ */ jsx("nav", {
				"aria-label": `${KIND_LABEL$1[kind]}历史`,
				className: "scrollbar-thin -mr-3 flex-1 overflow-y-auto pb-6 pr-3",
				children: groups.map((g) => /* @__PURE__ */ jsx(ArchiveGroup, {
					g,
					kind,
					current,
					initiallyOpen: g.id === openId
				}, g.id))
			}),
			kind === "daily" && /* @__PURE__ */ jsxs(Link, {
				to: "/daily/archive",
				className: "flex h-12 shrink-0 items-center justify-between border-t border-line pl-1 pr-1.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:text-accent",
				children: ["日报合订本 ", /* @__PURE__ */ jsx(IconChevronRight, { size: 14 })]
			})
		]
	});
}
/** Closed daily months keep only keys; titles load when opened, and the full archive is SSR. */
function ArchiveGroup({ g, kind, current, initiallyOpen }) {
	const [open, setOpen] = useState(initiallyOpen);
	useEffect(() => setOpen(initiallyOpen), [initiallyOpen]);
	const [loaded, setLoaded] = useState(null);
	useEffect(() => {
		if (!open || loaded || kind !== "daily" || !g.entries.some((e) => e.title === void 0)) return;
		const controller = new AbortController();
		fetch(`/api/site/reports/daily/months/${g.id}`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null).then((data) => {
			if (data && !controller.signal.aborted) setLoaded(data.items);
		}).catch(() => {});
		return () => controller.abort();
	}, [
		open,
		kind,
		g.id,
		loaded
	]);
	const entries = loaded ?? g.entries;
	const mark = (key) => archiveMark(kind, key);
	return /* @__PURE__ */ jsxs("details", {
		open,
		onToggle: (event) => setOpen(event.currentTarget.open),
		className: "disclosure group/month border-b border-line",
		children: [
			/* @__PURE__ */ jsxs("summary", {
				className: "flex h-11 items-center gap-1.5 pl-1 pr-1.5 text-[13px] text-ink transition-colors hover:text-accent",
				children: [
					/* @__PURE__ */ jsx(IconChevronRight, {
						size: 14,
						className: "text-ink-4 transition-transform duration-200 group-open/month:rotate-90"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "flex-1 font-semibold",
						children: g.label
					}),
					/* @__PURE__ */ jsx("span", {
						className: "num text-[11.5px] text-ink-4",
						children: g.entries.length
					})
				]
			}),
			(kind !== "daily" || open) && /* @__PURE__ */ jsx("ul", {
				className: "space-y-0.5 pb-3",
				children: entries.map((e) => {
					const on = e.key === current;
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
						to: reportPath(kind, e.key),
						"aria-current": on ? "page" : void 0,
						title: e.title ?? void 0,
						prefetch: "intent",
						className: `group flex gap-3 rounded-tile py-2.5 pl-2.5 pr-2 transition-colors ${on ? "bg-accent-soft" : "hover:bg-bg-sunk"}`,
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex w-8 shrink-0 flex-col items-center",
							children: [/* @__PURE__ */ jsx("span", {
								className: `num text-[19px] font-black leading-none tracking-[-0.03em] ${on ? "text-accent" : "text-ink"}`,
								children: mark(e.key).big
							}), mark(e.key).small && /* @__PURE__ */ jsx("span", {
								className: "mt-1 whitespace-nowrap text-[10px] leading-none text-ink-4",
								children: mark(e.key).small
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: `line-clamp-2 min-w-0 text-[12.5px] leading-[18px] transition-colors ${on ? "font-semibold text-ink" : "text-ink-2 group-hover:text-ink"}`,
							children: e.title ?? `${KIND_LABEL$1[kind]} ${e.key}`
						})]
					}) }, e.key);
				})
			}),
			kind === "daily" && !open && /* @__PURE__ */ jsx("noscript", { children: /* @__PURE__ */ jsx("a", {
				href: "/daily/archive",
				children: "查看完整日报归档"
			}) })
		]
	});
}
/** Phone header: kind tabs, then the three latest issues and a way further back. */
function ReportPhoneNav({ kind, index, current, today }) {
	const recent = index.slice(0, 3);
	const earlier = kind === "daily" ? "/daily/archive" : "#report-history";
	const chip = "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-[13px] transition-colors";
	return /* @__PURE__ */ jsxs("div", {
		className: "pt-3 lg:hidden",
		children: [/* @__PURE__ */ jsx(PillTabs, {
			fill: true,
			layoutId: "report-kind-phone",
			label: "切换日报、周报、月报",
			active: kind,
			items: KINDS$1.map((k) => ({
				key: k,
				label: KIND_LABEL$1[k],
				to: KIND_PATH[k]
			}))
		}), recent.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1",
			children: [recent.map((e) => {
				const on = e.key === current;
				return /* @__PURE__ */ jsx(Link, {
					to: reportPath(kind, e.key),
					"aria-current": on ? "page" : void 0,
					className: `${chip} ${on ? "border-ink bg-ink font-semibold text-bg" : "border-line-strong bg-surface text-ink-2 active:bg-bg-sunk"}`,
					children: chipLabel(kind, e.key, index, today)
				}, e.key);
			}), index.length > 3 && /* @__PURE__ */ jsx(Link, {
				to: earlier,
				className: `${chip} border-line-strong bg-surface text-ink-2 active:bg-bg-sunk`,
				children: "更早"
			})]
		})]
	});
}
//#endregion
//#region app/features/report/ReportLayout.tsx
/**
* Report pages sit beside their own archive column (desktop), flush against the site sidebar; phones
* get the kind tabs and recent issues above the page instead. The paper is centred beside the archive,
* on white in the light theme, up to 1160px.
*/
function ReportLayout({ kind, index, current, today, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "report-shell lg:-mx-7 lg:-mb-[72px] lg:-mt-6 lg:flex lg:min-h-dvh",
		children: [/* @__PURE__ */ jsx(ReportArchive, {
			kind,
			index,
			current
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0 flex-1 pb-6 lg:flex lg:flex-col lg:items-center lg:px-10 lg:pb-16 lg:pt-9",
			children: [/* @__PURE__ */ jsx(ReportPhoneNav, {
				kind,
				index,
				current,
				today
			}), /* @__PURE__ */ jsx("div", {
				className: "w-full lg:max-w-[1160px]",
				children
			})]
		})]
	});
}
//#endregion
//#region app/components/ui/Kicker.tsx
/** A small spaced label in the accent, led by a short bar: 头条, 今日看点, 关于本站. */
function Kicker({ children, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.3em] text-accent ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "h-[2px] w-6 rounded-full bg-accent",
			"aria-hidden": "true"
		}), children]
	});
}
//#endregion
//#region app/features/report/Halftone.tsx
function hashSeed(s) {
	let h = 2166136261;
	for (const ch of s) {
		h ^= ch.charCodeAt(0);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function mulberry32(seed) {
	let a = seed;
	return () => {
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
/** Smooth value noise in [0, 1] on a seeded lattice. */
function valueNoise(seed) {
	const rnd = mulberry32(seed);
	const size = 64;
	const grid = Float32Array.from({ length: 4096 }, () => rnd());
	const at = (ix, iy) => grid[(iy % size + size) % size * size + (ix % size + size) % size];
	return (x, y) => {
		const ix = Math.floor(x);
		const iy = Math.floor(y);
		const fx = x - ix;
		const fy = y - iy;
		const sx = fx * fx * (3 - 2 * fx);
		const sy = fy * fy * (3 - 2 * fy);
		const a = at(ix, iy);
		const b = at(ix + 1, iy);
		const c = at(ix, iy + 1);
		const d = at(ix + 1, iy + 1);
		return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
	};
}
var TAU$1 = Math.PI * 2;
var INTRO_MS$2 = 950;
var easeOutBack$1 = (p) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
function Halftone({ seed, className = "", children }) {
	const hostRef = useRef(null);
	const textRef = useRef(null);
	const canvasRef = useRef(null);
	const [drawn, setDrawn] = useState(false);
	useEffect(() => {
		const host = hostRef.current;
		const label = textRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!host || !label || !canvas || !ctx) return;
		const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
		const hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
		const noise = valueNoise(hashSeed(seed));
		const phase = mulberry32(hashSeed(seed) ^ 2654435769);
		const phaseX = phase();
		const phaseY = phase();
		let lit = [];
		let glyphs = [];
		let tint = null;
		let idle = [];
		let width = 0;
		let height = 0;
		let pad = 0;
		let reach = 60;
		let colors = {
			ink: "#000",
			accent: "#000",
			idle: "#ccc"
		};
		let started = 0;
		let frame = 0;
		let pointer = null;
		let disposed = false;
		const paintTint = () => {
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			tint = document.createElement("canvas");
			tint.width = canvas.width;
			tint.height = canvas.height;
			const t = tint.getContext("2d");
			if (!t) return;
			t.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
			t.textBaseline = "alphabetic";
			for (const g of glyphs) {
				t.font = g.font;
				t.fillStyle = g.accent ? colors.accent : colors.ink;
				t.fillText(g.ch, g.x, g.y);
			}
		};
		const readColors = () => {
			const accentEl = label.querySelector("[data-accent]");
			const root = getComputedStyle(document.documentElement);
			colors = {
				ink: getComputedStyle(label).color,
				accent: accentEl ? getComputedStyle(accentEl).color : getComputedStyle(label).color,
				idle: root.getPropertyValue("--line").trim() || "#ddd"
			};
		};
		const layout = () => {
			const box = host.getBoundingClientRect();
			width = box.width;
			height = box.height;
			if (width === 0 || height === 0) return false;
			pad = Math.ceil(parseFloat(getComputedStyle(label).fontSize) * .25);
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			Object.assign(canvas.style, {
				left: `${-pad}px`,
				top: `${-pad}px`,
				width: `${width + 2 * pad}px`,
				height: `${height + 2 * pad}px`
			});
			canvas.width = Math.round((width + 2 * pad) * dpr);
			canvas.height = Math.round((height + 2 * pad) * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
			const S = 2;
			const mask = document.createElement("canvas");
			mask.width = Math.ceil((width + 2 * pad) * S);
			mask.height = Math.ceil((height + 2 * pad) * S);
			const m = mask.getContext("2d", { willReadFrequently: true });
			if (!m) return false;
			m.setTransform(S, 0, 0, S, pad * S, pad * S);
			m.textBaseline = "alphabetic";
			const range = document.createRange();
			const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
			let fontSize = 0;
			glyphs = [];
			let x0 = Infinity;
			let x1 = -Infinity;
			let y0 = Infinity;
			let y1 = -Infinity;
			for (let node = walker.nextNode(); node; node = walker.nextNode()) {
				const el = node.parentElement;
				const style = getComputedStyle(el);
				const accent = !!el.closest("[data-accent]");
				m.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
				m.fillStyle = accent ? "#f00" : "#00f";
				fontSize = Math.max(fontSize, parseFloat(style.fontSize));
				const text = node.textContent ?? "";
				for (let i = 0; i < text.length; i++) {
					const ch = text[i];
					if (!ch.trim()) continue;
					range.setStart(node, i);
					range.setEnd(node, i + 1);
					const r = range.getBoundingClientRect();
					const metrics = m.measureText(ch);
					const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent * 1.1;
					m.fillText(ch, r.left - box.left, r.top - box.top + ascent);
					glyphs.push({
						ch,
						font: m.font,
						x: r.left - box.left,
						y: r.top - box.top + ascent,
						accent
					});
					x0 = Math.min(x0, r.left - box.left);
					x1 = Math.max(x1, r.right - box.left);
					y0 = Math.min(y0, r.top - box.top);
					y1 = Math.max(y1, r.bottom - box.top);
				}
			}
			if (!fontSize) return false;
			const data = m.getImageData(0, 0, mask.width, mask.height).data;
			const W = mask.width;
			const H = mask.height;
			const cell = Math.max(2.2, fontSize / 24);
			const row = cell * .866;
			const scale = cell * 5;
			reach = fontSize * .55;
			lit = [];
			idle = [];
			const taps = [
				.2,
				.5,
				.8
			];
			let rowIndex = 0;
			for (let y = y0 - cell + phaseY * row; y < y1 + cell; y += row, rowIndex++) {
				const shift = rowIndex % 2 ? cell / 2 : 0;
				for (let x = x0 - cell + phaseX * cell + shift; x < x1 + cell; x += cell) {
					let cover = 0;
					let red = 0;
					let blue = 0;
					for (const ty of taps) for (const tx of taps) {
						const px = Math.floor((x + pad + tx * cell) * S);
						const py = Math.floor((y + pad + ty * cell) * S);
						if (px < 0 || py < 0 || px >= W || py >= H) continue;
						const k = (py * W + px) * 4;
						const a = data[k + 3] / 255;
						cover += a;
						red += data[k] * a;
						blue += data[k + 2] * a;
					}
					cover /= taps.length * taps.length;
					const cx = x + cell / 2;
					const cy = y + cell / 2;
					if (cover > .08) {
						const texture = .84 + .16 * noise(cx / scale, cy / scale);
						lit.push({
							x: cx,
							y: cy,
							r: cell * .47 * Math.sqrt(Math.min(1, cover)) * texture,
							c: red > blue ? 1 : 0
						});
					} else idle.push({
						x: cx,
						y: cy,
						r: cell * .12
					});
				}
			}
			return true;
		};
		const draw = (now) => {
			frame = 0;
			if (disposed) return;
			const t = still ? 1 : Math.min(1, (now - started) / INTRO_MS$2);
			ctx.clearRect(-pad, -pad, width + 2 * pad, height + 2 * pad);
			if (tint) {
				ctx.globalAlpha = .12 * t;
				ctx.drawImage(tint, -pad, -pad, width + 2 * pad, height + 2 * pad);
				ctx.globalAlpha = 1;
			}
			const near = (x, y) => pointer ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / reach) : 0;
			ctx.globalAlpha = 1;
			ctx.fillStyle = colors.idle;
			ctx.beginPath();
			for (const d of idle) {
				ctx.moveTo(d.x + d.r, d.y);
				ctx.arc(d.x, d.y, d.r, 0, TAU$1);
			}
			ctx.fill();
			if (pointer) {
				ctx.fillStyle = colors.accent;
				for (const d of idle) {
					const k = near(d.x, d.y);
					if (k <= 0) continue;
					ctx.globalAlpha = .55 * k;
					ctx.beginPath();
					ctx.arc(d.x, d.y, d.r * (1 + 2.2 * k), 0, TAU$1);
					ctx.fill();
				}
				ctx.globalAlpha = 1;
			}
			for (const c of [0, 1]) {
				ctx.fillStyle = c ? colors.accent : colors.ink;
				ctx.beginPath();
				for (const d of lit) {
					if (d.c !== c) continue;
					const p = Math.min(1, Math.max(0, (t * 1.5 - d.x / width * .5) / .9));
					if (p <= 0) continue;
					const k = near(d.x, d.y);
					const r = d.r * easeOutBack$1(p) * (1 + .55 * k * k);
					ctx.moveTo(d.x + r, d.y);
					ctx.arc(d.x, d.y, r, 0, TAU$1);
				}
				ctx.fill();
			}
			if (t < 1) frame = requestAnimationFrame(draw);
		};
		const redraw = () => {
			if (!frame) frame = requestAnimationFrame(draw);
		};
		const rebuild = () => {
			if (!layout()) return;
			readColors();
			paintTint();
			redraw();
		};
		const onMove = (e) => {
			const box = host.getBoundingClientRect();
			pointer = {
				x: e.clientX - box.left,
				y: e.clientY - box.top
			};
			redraw();
		};
		const onLeave = () => {
			pointer = null;
			redraw();
		};
		const resize = new ResizeObserver(() => rebuild());
		const recolour = () => {
			readColors();
			paintTint();
			redraw();
		};
		const theme = new MutationObserver(recolour);
		const scheme = matchMedia("(prefers-color-scheme: dark)");
		const onScheme = recolour;
		document.fonts.ready.then(() => {
			if (disposed || !layout()) return;
			readColors();
			paintTint();
			started = performance.now();
			setDrawn(true);
			redraw();
			resize.observe(host);
			theme.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["data-theme", "class"]
			});
			scheme.addEventListener("change", onScheme);
			if (hover && !still) {
				canvas.addEventListener("pointermove", onMove);
				canvas.addEventListener("pointerleave", onLeave);
			}
		});
		return () => {
			disposed = true;
			if (frame) cancelAnimationFrame(frame);
			resize.disconnect();
			theme.disconnect();
			scheme.removeEventListener("change", onScheme);
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerleave", onLeave);
		};
	}, [seed]);
	return /* @__PURE__ */ jsxs("span", {
		ref: hostRef,
		className: `relative inline-block ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			ref: textRef,
			className: `transition-opacity duration-300 ${drawn ? "opacity-0" : ""}`,
			children
		}), /* @__PURE__ */ jsx("canvas", {
			ref: canvasRef,
			"aria-hidden": "true",
			className: `absolute left-0 top-0 size-0 transition-opacity duration-300 ${drawn ? "opacity-100" : "opacity-0"}`
		})]
	});
}
//#endregion
//#region app/features/report/Nameplate.tsx
var NAMEPLATE_CONFIG = {
	daily: {
		prefix: "火箭",
		suffix: "早报",
		offset: 200,
		width: 420
	},
	weekly: {
		prefix: "火箭",
		suffix: "周报",
		offset: 200,
		width: 420
	},
	monthly: {
		prefix: "火箭",
		suffix: "月报",
		offset: 200,
		width: 420
	},
	archive: {
		prefix: "火箭",
		suffix: "专刊合订",
		offset: 200,
		width: 620
	}
};
function Nameplate({ which, className = "" }) {
	const item = NAMEPLATE_CONFIG[which] || NAMEPLATE_CONFIG.daily;
	const viewBox = `0 0 ${item.width} 110`;
	return /* @__PURE__ */ jsxs("svg", {
		viewBox,
		className,
		"aria-hidden": "true",
		focusable: "false",
		children: [/* @__PURE__ */ jsx("text", {
			x: "0",
			y: "90",
			className: "fill-accent select-none font-black italic tracking-tighter",
			style: {
				fontSize: "94px",
				fontWeight: 900,
				fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif"
			},
			children: item.prefix
		}), /* @__PURE__ */ jsx("text", {
			x: item.offset,
			y: "90",
			className: "fill-ink select-none font-black tracking-tight",
			style: {
				fontSize: "94px",
				fontWeight: 900,
				fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif"
			},
			children: item.suffix
		})]
	});
}
//#endregion
//#region app/features/report/IssueDots.tsx
var ROW = 20;
var TAU = Math.PI * 2;
var INTRO_MS$1 = 700;
var easeOutBack = (p) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
function IssueDots({ kind, reportKey, index, className = "" }) {
	const grid = useMemo(() => periodGrid(kind, reportKey, index), [
		kind,
		reportKey,
		index
	]);
	const canvasRef = useRef(null);
	const navigate = useNavigate();
	const rows = Math.ceil(grid.cells.length / grid.columns);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const { cells, columns } = grid;
		const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
		let width = 0;
		let cw = 0;
		let hovered = -1;
		let started = 0;
		let frame = 0;
		let disposed = false;
		let colors = {
			ink: "#000",
			accent: "#000",
			idle: "#ccc"
		};
		const readColors = () => {
			const root = getComputedStyle(document.documentElement);
			colors = {
				ink: root.getPropertyValue("--ink").trim() || "#000",
				accent: root.getPropertyValue("--accent").trim() || "#000",
				idle: root.getPropertyValue("--line-strong").trim() || "#ccc"
			};
		};
		const size = () => {
			width = canvas.clientWidth;
			if (!width) {
				if (frame) cancelAnimationFrame(frame);
				frame = 0;
				return;
			}
			cw = width / columns;
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(rows * ROW * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		const draw = (now) => {
			frame = 0;
			if (disposed || !width) return;
			const t = still ? 1 : Math.min(1, (now - started) / INTRO_MS$1);
			ctx.clearRect(0, 0, width, rows * ROW);
			const unit = Math.min(cw, ROW);
			cells.forEach((c, i) => {
				if (c.state === "pad") return;
				const p = Math.min(1, Math.max(0, t * 1.6 - i / cells.length * .6));
				if (p <= 0) return;
				const grow = easeOutBack(p) * (i === hovered ? 1.4 : 1);
				const x = (i % columns + .5) * cw;
				const y = (Math.floor(i / columns) + .5) * ROW;
				const r = (c.state === "current" ? .26 : c.state === "issue" ? .17 : .08) * unit * grow;
				ctx.fillStyle = c.state === "current" ? colors.accent : c.state === "issue" ? colors.ink : colors.idle;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, TAU);
				ctx.fill();
				if (c.state === "current") {
					ctx.globalAlpha = .4;
					ctx.strokeStyle = colors.accent;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.arc(x, y, unit * .42 * easeOutBack(p), 0, TAU);
					ctx.stroke();
					ctx.globalAlpha = 1;
				}
			});
			if (t < 1) frame = requestAnimationFrame(draw);
		};
		const redraw = () => {
			if (width && !frame) frame = requestAnimationFrame(draw);
		};
		const cellAt = (e) => {
			const box = canvas.getBoundingClientRect();
			const col = Math.floor((e.clientX - box.left) / cw);
			const i = Math.floor((e.clientY - box.top) / ROW) * columns + col;
			return col >= 0 && col < columns && i >= 0 && i < cells.length ? i : -1;
		};
		const onMove = (e) => {
			const i = cellAt(e);
			const c = cells[i];
			const open = !!c && c.state === "issue";
			canvas.style.cursor = open ? "pointer" : "default";
			canvas.title = c && c.state !== "pad" ? c.label : "";
			const next = c && c.state !== "none" && c.state !== "pad" ? i : -1;
			if (next !== hovered) {
				hovered = next;
				redraw();
			}
		};
		const onLeave = () => {
			hovered = -1;
			canvas.title = "";
			redraw();
		};
		const onClick = (e) => {
			const c = cells[cellAt(e)];
			if (c?.key && c.state === "issue") navigate(`${KIND_PATH[kind]}/${c.key}`);
		};
		const resize = new ResizeObserver(() => {
			size();
			redraw();
		});
		const recolour = () => {
			readColors();
			redraw();
		};
		const theme = new MutationObserver(recolour);
		const scheme = matchMedia("(prefers-color-scheme: dark)");
		readColors();
		size();
		started = performance.now();
		redraw();
		resize.observe(canvas);
		theme.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme", "class"]
		});
		scheme.addEventListener("change", recolour);
		canvas.addEventListener("pointermove", onMove);
		canvas.addEventListener("pointerleave", onLeave);
		canvas.addEventListener("click", onClick);
		return () => {
			disposed = true;
			if (frame) cancelAnimationFrame(frame);
			resize.disconnect();
			theme.disconnect();
			scheme.removeEventListener("change", recolour);
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerleave", onLeave);
			canvas.removeEventListener("click", onClick);
		};
	}, [
		grid,
		rows,
		kind,
		navigate
	]);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-baseline justify-between text-[11px] text-ink-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-semibold tracking-[0.2em] text-ink-2",
					children: grid.title
				}), /* @__PURE__ */ jsx("span", {
					className: "num",
					children: grid.note
				})]
			}),
			grid.heads && /* @__PURE__ */ jsx("div", {
				className: "mt-2 grid text-center text-[10px] leading-none text-ink-4",
				style: { gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` },
				children: grid.heads.map((h) => /* @__PURE__ */ jsx("span", { children: h }, h))
			}),
			/* @__PURE__ */ jsx("canvas", {
				ref: canvasRef,
				"aria-hidden": "true",
				className: "mt-1 block w-full",
				style: { height: rows * ROW }
			})
		]
	});
}
//#endregion
//#region app/features/report/ReportPaper.tsx
var pad = (n) => String(n).padStart(2, "0");
var keyOf = (c) => c.itemId ?? c.title;
var anchorOf = (c) => c.itemId ? `r-${c.itemId}` : null;
var LINK = "inline-flex min-h-7 items-center gap-0.5 font-medium transition-colors hover:text-accent";
function Masthead({ report, index }) {
	const issue = issueNumber(index, report.key);
	const mark = dateMark(report.kind, report.key);
	return /* @__PURE__ */ jsxs("header", {
		className: "pt-5 lg:pt-0",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-4 text-[12px] text-ink-4",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "num",
						children: dateLine(report.kind, report.key)
					}),
					/* @__PURE__ */ jsx("span", {
						className: "hidden tracking-[0.3em] @[640px]:inline",
						children: MOTTO[report.kind]
					}),
					/* @__PURE__ */ jsx("span", { children: EDITION[report.kind] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-stretch justify-between gap-5 py-6 @[880px]:gap-10 @[880px]:py-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-col justify-center",
					children: [/* @__PURE__ */ jsxs("h1", {
						id: "report-start",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "sr-only",
							children: [
								"火箭",
								KIND_LABEL$1[report.kind],
								" · ",
								dateLine(report.kind, report.key)
							]
						}), /* @__PURE__ */ jsx(Nameplate, {
							which: report.kind,
							className: "block h-[54px] w-auto @[520px]:h-[74px] @[880px]:h-[98px] @[1040px]:h-[112px]"
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-[11.5px] tracking-[0.36em] text-ink-4 @[880px]:mt-4 @[880px]:text-[12.5px]",
						children: SITE.name.toUpperCase()
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-stretch well rounded-panel",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex w-[112px] flex-col items-center justify-center px-2 py-3 text-center @[880px]:w-[150px] @[880px]:py-4",
						children: [
							issue && /* @__PURE__ */ jsxs("span", {
								className: "text-[11px] tracking-[0.2em] text-ink-4",
								children: [
									"第 ",
									issue,
									" 期"
								]
							}),
							/* @__PURE__ */ jsx(Halftone, {
								seed: `${report.kind}-${report.key}-date`,
								className: "num mt-2 whitespace-nowrap text-[44px] font-black leading-[0.95] tracking-[-0.04em] text-ink @[880px]:text-[64px]",
								children: mark.figure
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mt-2 text-[11.5px] text-ink-2",
								children: mark.top
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[11.5px] text-ink-4",
								children: mark.bottom
							})
						]
					}), /* @__PURE__ */ jsx(IssueDots, {
						kind: report.kind,
						reportKey: report.key,
						index,
						className: "hidden w-[176px] border-l border-line px-4 py-4 @[760px]:block @[880px]:w-[196px]"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline gap-x-8 gap-y-1.5 border-y border-line-strong py-3",
				children: [metricItems(report.metrics).map((m) => /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-baseline gap-1.5 whitespace-nowrap",
					children: [/* @__PURE__ */ jsx("span", {
						className: "num text-[22px] font-bold leading-none tracking-[-0.02em] text-ink @[880px]:text-[24px]",
						children: m.value
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[12px] text-ink-4",
						children: m.unit
					})]
				}, m.unit)), /* @__PURE__ */ jsxs("span", {
					className: "ml-auto whitespace-nowrap text-[12px] text-ink-4",
					children: [
						"约 ",
						report.readingMinutes,
						" 分钟读完"
					]
				})]
			})
		]
	});
}
/** Source face and name, and the site's 一手 mark when first-hand. */
function Source({ c, size = 16 }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex min-w-0 items-center gap-1.5",
		children: [
			/* @__PURE__ */ jsx(SourceAvatar, {
				name: c.sourceName,
				iconUrl: c.sourceIconUrl,
				iconSrcSet: c.sourceIconSrcSet,
				size
			}),
			/* @__PURE__ */ jsx("span", {
				className: "truncate",
				children: shortSourceName(c.sourceName)
			}),
			c.firstParty && /* @__PURE__ */ jsx(Badge$1, {
				tone: "accent",
				children: "一手"
			})
		]
	});
}
/**
* The way on from a story: its original. Each story is one report (for an event, the one the edition
* chose: first-hand first, then the best scored), so there is one place to go.
*/
function Original({ c, className = "" }) {
	return /* @__PURE__ */ jsxs("a", {
		href: c.sourceUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": `阅读${shortSourceName(c.sourceName)}原文：${c.title}（新标签页）`,
		className: `${LINK} text-[12.5px] text-ink-3 ${className}`,
		children: ["原文 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 12 })]
	});
}
/** One story: source, headline, at most four lines of summary, and the original at the foot. */
function Story({ c, dated, className = "" }) {
	return /* @__PURE__ */ jsxs("article", {
		id: anchorOf(c) ?? void 0,
		className: `flex min-w-0 scroll-mt-6 flex-col py-6 ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-[12px] text-ink-3",
			children: [/* @__PURE__ */ jsx(Source, { c }), dated && c.publishedAt && /* @__PURE__ */ jsx("span", {
				className: "num ml-auto shrink-0 text-ink-4",
				children: shortDay(c.publishedAt)
			})]
		}), c.available ? /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("h3", {
				className: "mt-3 text-[19px] font-bold leading-[1.5] tracking-[-0.01em] text-ink [overflow-wrap:anywhere] [text-wrap:pretty] @[880px]:text-[20px]",
				children: c.itemId ? /* @__PURE__ */ jsx(Link, {
					to: `/items/${c.itemId}`,
					prefetch: "intent",
					className: "transition-colors hover:text-accent",
					children: c.title
				}) : c.title
			}),
			c.summary && /* @__PURE__ */ jsx("p", {
				className: "mt-2 line-clamp-4 text-[15px] leading-[1.85] text-ink-2 [overflow-wrap:anywhere] @[560px]:text-justify",
				children: c.summary
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-auto pt-3",
				children: /* @__PURE__ */ jsx(Original, { c })
			})
		] }) : /* @__PURE__ */ jsxs("p", {
			className: "mt-3 text-[14px] leading-relaxed text-ink-4",
			children: [/* @__PURE__ */ jsx("span", {
				className: "line-through",
				children: c.title
			}), " · 该内容已按来源方要求下架或调整展示方式。"]
		})]
	});
}
/**
* Rows of two once the page is wide enough: both cells as tall as the taller, a hairline between them
* and one rule under the row across the whole page, even under a single cell.
*/
function Rows({ items, children }) {
	const rows = [];
	for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
	return /* @__PURE__ */ jsx("div", { children: rows.map((row, r) => /* @__PURE__ */ jsx("div", {
		className: "grid border-b border-line @[760px]:grid-cols-2",
		children: row.map((item, i) => children(item, i === 0 ? "@[760px]:pr-10 @[1040px]:pr-12" : "border-t border-line @[760px]:border-l @[760px]:border-t-0 @[760px]:pl-10 @[1040px]:pl-12"))
	}, r)) });
}
/** A daily without an editors' lead leads with its first highlight (else its first story). */
function leadStoryOf(report) {
	if (report.lead || report.kind !== "daily") return null;
	return report.highlights[0] ?? report.sections.find((s) => s.items.length > 0)?.items[0] ?? null;
}
/**
* Sections as pages. A story cited twice appears once, and
* the story leading the front page is not repeated inside.
*/
function pagesOf(report, leadStory) {
	const seen = new Set(leadStory ? [keyOf(leadStory)] : []);
	return report.sections.map((s, i) => ({
		id: `s-${i + 1}`,
		label: s.label,
		summary: s.summary,
		items: s.items.filter((c) => {
			const k = keyOf(c);
			if (seen.has(k)) return false;
			seen.add(k);
			return true;
		})
	})).filter((p) => p.items.length > 0);
}
/**
* The lead's picture; landscape pictures are cropped to between 16:10 and 2:1. A picture that is not
* the lead's own (a weekly or monthly's, from its first highlight) is captioned with its story.
*/
function LeadPicture({ cover, onError, priority = false, className = "" }) {
	const ratio = cover.width && cover.height ? cover.width / cover.height : 16 / 9;
	return /* @__PURE__ */ jsxs("figure", {
		className,
		children: [/* @__PURE__ */ jsx("div", {
			className: "overflow-hidden well rounded-panel",
			style: { aspectRatio: ratio >= 1.25 ? Math.min(2, Math.max(1.6, ratio)) : Math.max(.8, ratio) },
			children: /* @__PURE__ */ jsx("img", {
				src: cover.url,
				srcSet: cover.srcSet,
				sizes: priority ? "(min-width: 1700px) 780px, (min-width: 1580px) calc(100vw - 920px), (min-width: 1420px) calc(100vw - 880px), (min-width: 1024px) calc(100vw - 540px), (min-width: 640px) 608px, calc(100vw - 32px)" : "auto, (min-width: 1180px) 300px, (min-width: 640px) 608px, calc(100vw - 32px)",
				width: cover.width ?? void 0,
				height: cover.height ?? void 0,
				alt: "",
				loading: priority ? "eager" : "lazy",
				fetchPriority: priority ? "high" : "auto",
				decoding: "async",
				onError,
				className: "size-full object-cover"
			})
		}), cover.caption && /* @__PURE__ */ jsxs("figcaption", {
			className: "mt-2.5 line-clamp-2 text-[12.5px] leading-[1.6] text-ink-4",
			children: ["图 · ", cover.caption]
		})]
	});
}
/** The front page: the lead beside a column of today's highlights and the index of pages. */
function FrontPage({ report, pages, leadStory, count }) {
	const daily = report.kind === "daily";
	const [broken, setBroken] = useState(null);
	const cover = report.cover && report.cover.url !== broken ? report.cover : null;
	const wide = !cover?.width || !cover.height || cover.width / cover.height >= 1.25;
	const title = report.lead?.title ?? leadStory?.title ?? headline(report.kind, report.key, count);
	const dek = report.lead?.leadParagraph ?? leadStory?.summary ?? report.overview;
	const highlights = report.highlights.filter((h) => !leadStory || keyOf(h) !== keyOf(leadStory)).slice(0, 3);
	const inPage = new Set(pages.flatMap((p) => p.items.map((c) => c.itemId)).filter(Boolean));
	const period = daily ? "今日" : report.kind === "weekly" ? "本周" : "本月";
	const index = [...pages.map((p) => ({
		id: p.id,
		label: p.label,
		n: `${p.items.length} 件`
	})), ...report.flashes.length > 0 ? [{
		id: "s-flash",
		label: "快讯",
		n: `${report.flashes.length} 条`
	}] : []];
	return /* @__PURE__ */ jsxs("section", {
		"aria-label": "头版",
		className: "grid @[880px]:grid-cols-[minmax(0,1fr)_300px] @[1040px]:grid-cols-[minmax(0,1fr)_340px]",
		children: [/* @__PURE__ */ jsxs("div", {
			id: leadStory ? anchorOf(leadStory) ?? void 0 : void 0,
			className: "min-w-0 scroll-mt-6 py-7 @[880px]:border-r @[880px]:border-line @[880px]:py-10 @[880px]:pr-10",
			children: [
				/* @__PURE__ */ jsx(Kicker, { children: daily ? "头条" : "本期导读" }),
				cover && wide && /* @__PURE__ */ jsx(LeadPicture, {
					cover,
					onError: () => setBroken(cover.url),
					priority: true,
					className: "mt-5"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-[32px] font-black leading-[1.28] tracking-[-0.03em] text-ink [text-wrap:balance] @[520px]:text-[40px] @[1040px]:text-[48px] @[1040px]:leading-[1.22]",
					children: leadStory?.itemId ? /* @__PURE__ */ jsx(Link, {
						to: `/items/${leadStory.itemId}`,
						prefetch: "intent",
						className: "transition-colors hover:text-accent",
						children: title
					}) : title
				}),
				dek && /* @__PURE__ */ jsxs("div", {
					className: cover && !wide ? "mt-6 grid gap-6 @[640px]:grid-cols-[minmax(0,1fr)_minmax(0,38%)] @[880px]:mt-7" : "",
					children: [/* @__PURE__ */ jsx("p", {
						className: `text-[16.5px] leading-[1.9] text-ink-2 @[880px]:text-[17.5px] ${cover && !wide ? "" : "mt-6 @[560px]:text-justify @[880px]:mt-7"}`,
						children: dek
					}), cover && !wide && /* @__PURE__ */ jsx(LeadPicture, {
						cover,
						onError: () => setBroken(cover.url)
					})]
				}),
				leadStory && /* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-3",
					children: [/* @__PURE__ */ jsx(Source, {
						c: leadStory,
						size: 18
					}), /* @__PURE__ */ jsx(Original, { c: leadStory })]
				})
			]
		}), /* @__PURE__ */ jsxs("aside", {
			className: "min-w-0 border-t border-line py-7 @[880px]:border-t-0 @[880px]:py-10 @[880px]:pl-8",
			children: [highlights.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Kicker, { children: [period, "看点"] }), /* @__PURE__ */ jsx("ol", {
				className: "mt-2",
				children: highlights.map((h, i) => {
					const anchor = anchorOf(h);
					const to = anchor && inPage.has(h.itemId) ? `#${anchor}` : h.itemId ? `/items/${h.itemId}` : h.sourceUrl;
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
						to,
						className: "group flex gap-3.5 border-b border-line py-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "num w-6 shrink-0 text-[26px] font-black leading-[0.95] tracking-[-0.03em] text-accent",
							children: i + 1
						}), /* @__PURE__ */ jsxs("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-[15px] font-bold leading-[1.55] text-ink transition-colors group-hover:text-accent",
								children: h.title
							}), /* @__PURE__ */ jsx("span", {
								className: "mt-1.5 block truncate text-[12px] text-ink-4",
								children: shortSourceName(h.sourceName)
							})]
						})]
					}) }, keyOf(h));
				})
			})] }), index.length > 0 && /* @__PURE__ */ jsxs("nav", {
				"aria-label": "本期版面",
				className: highlights.length > 0 ? "mt-8" : "",
				children: [/* @__PURE__ */ jsx(Kicker, { children: "本期版面" }), /* @__PURE__ */ jsx("ol", {
					className: "mt-3",
					children: index.map((p, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
						href: `#${p.id}`,
						className: "group flex items-baseline gap-2 py-1.5 text-[13.5px]",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "num w-7 shrink-0 text-[14px] font-bold text-ink",
								children: pad(i + 1)
							}),
							/* @__PURE__ */ jsx("span", {
								className: "min-w-0 flex-1 truncate text-ink-2 transition-colors group-hover:text-accent",
								children: p.label
							}),
							/* @__PURE__ */ jsx("span", {
								className: "num shrink-0 text-[12px] text-ink-4",
								children: p.n
							})
						]
					}) }, p.id))
				})]
			})]
		})]
	});
}
/** A page of the report: its number in the accent beside its name. */
function SectionPage({ id, no, label, children }) {
	return /* @__PURE__ */ jsxs("section", {
		id,
		"aria-labelledby": `${id}-t`,
		className: "scroll-mt-6 pt-12 @[880px]:pt-16",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex items-baseline gap-3 border-b border-line-strong pb-3 @[880px]:gap-4",
			children: [no !== void 0 && /* @__PURE__ */ jsx("span", {
				className: "num text-[26px] font-black leading-none tracking-[-0.03em] text-accent @[880px]:text-[30px]",
				children: pad(no)
			}), /* @__PURE__ */ jsx("h2", {
				id: `${id}-t`,
				className: "min-w-0 text-[24px] font-black leading-[1.25] tracking-[-0.02em] text-ink @[880px]:text-[28px]",
				children: label
			})]
		}), children]
	});
}
/** Two columns with a hairline between them, once the page is wide enough (快讯). */
var COLUMNS = "@[760px]:columns-2 @[760px]:gap-x-12 @[760px]:[column-rule:1px_solid_var(--line)]";
function Neighbours({ report, index }) {
	const titleOf = (key) => index.find((e) => e.key === key)?.title ?? `火箭${KIND_LABEL$1[report.kind]} · ${key}`;
	const cell = "group flex min-w-0 flex-col py-6";
	const title = "mt-2.5 line-clamp-2 text-[16px] font-bold leading-[1.5] text-ink transition-colors group-hover:text-accent @[880px]:text-[18px]";
	return /* @__PURE__ */ jsxs("nav", {
		"aria-label": report.kind === "daily" ? "前后日报" : "前后各期",
		className: "mt-16 grid grid-cols-2 border-y border-line-strong",
		children: [report.prev ? /* @__PURE__ */ jsxs(Link, {
			to: reportPath(report.kind, report.prev),
			className: `${cell} pr-5 @[880px]:pr-10`,
			children: [/* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 text-[12px] text-ink-4",
				children: [
					/* @__PURE__ */ jsx(IconArrowLeft, { size: 13 }),
					" ",
					neighbourLabel(report.kind, report.prev, "prev")
				]
			}), /* @__PURE__ */ jsx("span", {
				className: title,
				children: titleOf(report.prev)
			})]
		}) : /* @__PURE__ */ jsx("span", {}), report.next ? /* @__PURE__ */ jsxs(Link, {
			to: reportPath(report.kind, report.next),
			className: `${cell} items-end border-l border-line pl-5 text-right @[880px]:pl-10`,
			children: [/* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 text-[12px] text-ink-4",
				children: [
					neighbourLabel(report.kind, report.next, "next"),
					" ",
					/* @__PURE__ */ jsx(IconArrowRight, { size: 13 })
				]
			}), /* @__PURE__ */ jsx("span", {
				className: title,
				children: titleOf(report.next)
			})]
		}) : /* @__PURE__ */ jsx("span", { className: "border-l border-line" })]
	});
}
function History({ report, index }) {
	const others = index.filter((e) => e.key !== report.key).slice(0, 12);
	if (others.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		id: "report-history",
		className: "scroll-mt-6 pt-12",
		children: [/* @__PURE__ */ jsxs(Kicker, { children: ["往期火箭", KIND_LABEL$1[report.kind]] }), /* @__PURE__ */ jsx("ul", {
			className: "mt-3",
			children: others.map((e) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
				to: reportPath(report.kind, e.key),
				className: "group flex items-baseline gap-4 border-b border-line py-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "num w-[76px] shrink-0 text-[12.5px] text-ink-4",
					children: e.key
				}), /* @__PURE__ */ jsx("span", {
					className: "min-w-0 flex-1 truncate text-[14px] text-ink-2 transition-colors group-hover:text-accent",
					children: e.title ?? `${SITE.name} ${KIND_LABEL$1[report.kind]} · ${e.key}`
				})]
			}) }, e.key))
		})]
	});
}
function ReportPaper({ report, index }) {
	const daily = report.kind === "daily";
	const leadStory = leadStoryOf(report);
	const pages = pagesOf(report, leadStory);
	const count = pages.reduce((sum, p) => sum + p.items.length, 0) + (leadStory ? 1 : 0);
	return /* @__PURE__ */ jsxs("article", {
		className: "@container",
		children: [
			/* @__PURE__ */ jsx(Masthead, {
				report,
				index
			}),
			count === 0 && report.flashes.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-16 text-center text-[14px] text-ink-4",
				children: "本期没有入选内容。"
			}) : /* @__PURE__ */ jsx(FrontPage, {
				report,
				pages,
				leadStory,
				count
			}),
			pages.map((p, i) => /* @__PURE__ */ jsxs(SectionPage, {
				id: p.id,
				no: i + 1,
				label: p.label,
				children: [p.summary && /* @__PURE__ */ jsxs("p", {
					className: "border-b border-line py-5 text-[15.5px] leading-[1.9] text-ink-2 @[560px]:text-justify",
					children: [/* @__PURE__ */ jsx("span", {
						className: "mr-2 font-semibold text-accent",
						children: "本版导读"
					}), p.summary]
				}), /* @__PURE__ */ jsx(Rows, {
					items: p.items,
					children: (c, cell) => /* @__PURE__ */ jsx(Story, {
						c,
						dated: !daily,
						className: cell
					}, `${p.id}-${keyOf(c)}`)
				})]
			}, p.id)),
			report.flashes.length > 0 && /* @__PURE__ */ jsx(SectionPage, {
				id: "s-flash",
				no: pages.length + 1,
				label: "快讯",
				children: /* @__PURE__ */ jsx("ul", {
					className: `${COLUMNS} @[1040px]:columns-3`,
					children: report.flashes.map((f, i) => /* @__PURE__ */ jsxs("li", {
						className: "flex break-inside-avoid gap-2.5 border-b border-line py-3 text-[14.5px] leading-[1.65]",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mt-[9px] size-1.5 shrink-0 rounded-full bg-accent",
							"aria-hidden": "true"
						}), /* @__PURE__ */ jsxs("span", {
							className: "min-w-0",
							children: [f.itemId ? /* @__PURE__ */ jsx(Link, {
								to: `/items/${f.itemId}`,
								className: "text-ink transition-colors hover:text-accent",
								children: f.title
							}) : /* @__PURE__ */ jsx("span", {
								className: "text-ink",
								children: f.title
							}), /* @__PURE__ */ jsx("span", {
								className: "ml-2 text-[12px] text-ink-4",
								children: shortSourceName(f.sourceName)
							})]
						})]
					}, `${keyOf(f)}-${i}`))
				})
			}),
			/* @__PURE__ */ jsx(Neighbours, {
				report,
				index
			}),
			!daily && /* @__PURE__ */ jsx(History, {
				report,
				index
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "py-10 text-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-[13px] font-semibold tracking-[0.6em] text-ink-4",
					children: "（本期完）"
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-3 text-[12px] text-ink-4",
					children: [
						SITE.name,
						" ",
						KIND_LABEL$1[report.kind],
						"由编辑系统根据公开来源自动",
						daily ? "编辑" : "综合",
						"，每条均附原文 ·",
						" ",
						/* @__PURE__ */ jsx(Link, {
							to: daily ? "/daily/archive" : "#report-history",
							className: "font-medium text-ink-3 transition-colors hover:text-accent",
							children: daily ? "日报合订本" : `往期${KIND_LABEL$1[report.kind]}`
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region app/routes/report-latest.tsx
var report_latest_exports = /* @__PURE__ */ __exportAll({
	default: () => report_latest_default,
	headers: () => headers$21,
	loader: () => loader$28,
	meta: () => meta$33
});
async function loader$28({ request }) {
	const kind = kindFromPath(new URL(request.url).pathname);
	const { index, report } = await loadOr404(`/api/site/reports/${kind}/latest-page`, { signal: request.signal });
	return {
		kind,
		report,
		index,
		today: beijingDate(Date.now())
	};
}
function meta$33({ loaderData, location }) {
	const kind = loaderData?.kind ?? "daily";
	return pageMeta({
		title: `火箭${KIND_LABEL$1[kind]}`,
		description: kind === "daily" ? `${SITE.name} 每天 08:00（北京时间）发布的${withSubject("日报")}。` : kind === "weekly" ? "每周综合回顾。" : "每月盘点。",
		path: location.pathname,
		image: `/og/pages/${kind}.png`
	});
}
function headers$21() {
	return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=300" };
}
var report_latest_default = UNSAFE_withComponentProps(function ReportLatestPage() {
	const { kind, report, index, today } = useLoaderData();
	return /* @__PURE__ */ jsx(ReportLayout, {
		kind,
		index,
		current: report?.key ?? null,
		today,
		children: report ? /* @__PURE__ */ jsx(ReportPaper, {
			report,
			index
		}) : /* @__PURE__ */ jsx(EmptyState, {
			title: `还没有发布火箭${KIND_LABEL$1[kind]}`,
			children: "第一期发布后会出现在这里。"
		})
	});
});
//#endregion
//#region app/routes/daily-archive.tsx
var daily_archive_exports = /* @__PURE__ */ __exportAll({
	default: () => daily_archive_default,
	headers: () => headers$20,
	loader: () => loader$27,
	meta: () => meta$32
});
async function loader$27({ request }) {
	const { items: index } = await apiGet("/api/site/reports/daily", { signal: request.signal });
	return {
		index,
		today: beijingDate(Date.now())
	};
}
function meta$32() {
	return pageMeta({
		title: `${withSubject("日报")} · 历史存档`,
		description: `${SITE.name} 历史日报，按日期归档。`,
		path: "/daily/archive",
		image: "/og/pages/daily.png"
	});
}
function headers$20() {
	return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=300" };
}
var daily_archive_default = UNSAFE_withComponentProps(function DailyArchive() {
	const { index, today } = useLoaderData();
	const months = archiveGroups("daily", index);
	return /* @__PURE__ */ jsx(ReportLayout, {
		kind: "daily",
		index,
		current: null,
		today,
		children: /* @__PURE__ */ jsxs("div", {
			className: "@container",
			children: [/* @__PURE__ */ jsxs("header", {
				className: "pt-5 lg:pt-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-4 text-[12px] text-ink-4",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							SITE.name,
							" · ",
							withSubject("日报")
						] }), /* @__PURE__ */ jsxs("span", { children: [
							"共 ",
							/* @__PURE__ */ jsx("span", {
								className: "num",
								children: index.length
							}),
							" 期"
						] })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "py-6 @[880px]:py-8",
						children: /* @__PURE__ */ jsxs("h1", {
							id: "report-start",
							children: [/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "日报合订本"
							}), /* @__PURE__ */ jsx(Nameplate, {
								which: "archive",
								className: "block h-[50px] w-auto @[520px]:h-[70px] @[880px]:h-[98px]"
							})]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						"aria-hidden": "true",
						className: "border-t border-line-strong"
					})
				]
			}), months.map((m) => /* @__PURE__ */ jsx(SectionPage, {
				id: `m-${m.id}`,
				label: m.label,
				children: /* @__PURE__ */ jsx(Rows, {
					items: m.entries,
					children: (e, cell) => /* @__PURE__ */ jsxs(Link, {
						to: `/daily/${e.key}`,
						prefetch: "intent",
						className: `group flex gap-4 py-4 ${cell}`,
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex w-9 shrink-0 flex-col items-center",
							children: [/* @__PURE__ */ jsx("span", {
								className: "num text-[24px] font-black leading-none tracking-[-0.03em] text-ink transition-colors group-hover:text-accent",
								children: e.key.slice(8, 10)
							}), /* @__PURE__ */ jsx("span", {
								className: "mt-1.5 text-[10.5px] leading-none text-ink-4",
								children: beijingWeekday(e.key).replace("星期", "周")
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-[15px] font-bold leading-[1.55] text-ink transition-colors group-hover:text-accent",
								children: e.title ?? `${withSubject("日报")} ${e.key}`
							}), /* @__PURE__ */ jsxs("span", {
								className: "mt-1 block text-[12px] text-ink-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "num",
									children: e.count
								}), " 件大事"]
							})]
						})]
					}, e.key)
				})
			}, m.id))]
		})
	});
});
//#endregion
//#region app/routes/report-detail.tsx
var report_detail_exports = /* @__PURE__ */ __exportAll({
	default: () => report_detail_default,
	headers: () => headers$19,
	loader: () => loader$26,
	meta: () => meta$31
});
var PATTERN = {
	daily: /^\d{4}-\d{2}-\d{2}$/,
	weekly: /^\d{4}-W\d{2}$/,
	monthly: /^\d{4}-\d{2}$/
};
async function loader$26({ request, params }) {
	const kind = kindFromPath(new URL(request.url).pathname);
	const key = params.key ?? "";
	if (!PATTERN[kind].test(key)) throw data({ message: "not_found" }, { status: 404 });
	const [report, { items: index }] = await Promise.all([loadOr404(`/api/site/reports/${kind}/${key}`, { signal: request.signal }), apiGet(`/api/site/reports/${kind}/navigation/${key}`, { signal: request.signal })]);
	return {
		report,
		index,
		today: beijingDate(Date.now())
	};
}
function meta$31({ loaderData }) {
	if (!loaderData) return [{ title: titled("报告不存在") }, {
		name: "robots",
		content: "noindex"
	}];
	const r = loaderData.report;
	return pageMeta({
		title: r.kind === "daily" ? `${withSubject("日报")} ${r.key}` : r.title.replace(`${SITE.name} `, `${SITE.subject} `),
		description: r.lead?.leadParagraph ?? r.overview?.slice(0, 150) ?? `${SITE.name} ${r.key} 的${withSubject(KIND_LABEL$1[r.kind])}。`,
		path: `/${r.kind}/${r.key}`,
		image: `/og/reports/${r.kind}/${r.key}.png`,
		type: "article"
	});
}
function headers$19() {
	return { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=600" };
}
var report_detail_default = UNSAFE_withComponentProps(function ReportDetailPage() {
	const { report, index, today } = useLoaderData();
	return /* @__PURE__ */ jsx(ReportLayout, {
		kind: report.kind,
		index,
		current: report.key,
		today,
		children: /* @__PURE__ */ jsx(ReportPaper, {
			report,
			index
		})
	});
});
//#endregion
//#region app/routes/topics.tsx
var topics_exports = /* @__PURE__ */ __exportAll({
	default: () => topics_default,
	headers: () => headers$18,
	loader: () => loader$25,
	meta: () => meta$30
});
async function loader$25({ request }) {
	return apiGet("/api/site/topics", { signal: request.signal });
}
function meta$30() {
	return pageMeta({
		title: "火箭主题专区",
		description: "按核心球员、战术深度、情报形态聚合的休斯敦火箭主题专区，持续汇集近期焦点报道与一手赛况。",
		path: "/topics",
		image: "/og/pages/topics.png"
	});
}
function headers$18() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
var GROUPS$1 = [
	{
		key: "player",
		name: "核心球员与教练",
		blurb: "按核心骨干追踪：杜兰特、申京、阿门·汤普森、乌度卡、谢泼德等"
	},
	{
		key: "field",
		name: "战术与高阶数据",
		blurb: "按战术体系与效率深挖：百回合净胜分、进攻空间、防守换防……"
	},
	{
		key: "genre",
		name: "情报形态与专区",
		blurb: "按内容类型分类：战报总结、交易签约、名记流言、赛后原声……"
	}
];
var topics_default = UNSAFE_withComponentProps(function TopicsPage() {
	const { topics } = useLoaderData();
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-10",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "pb-2 pt-5 lg:pt-1",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-[24px] font-bold leading-[1.3] text-ink",
				children: "休斯敦火箭 主题专区"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-[13px] leading-relaxed text-ink-3",
				children: "按核心球员、战术体系、情报类型持续汇集休斯敦火箭近期焦点报道。"
			})]
		}), GROUPS$1.map((g) => /* @__PURE__ */ jsxs("section", {
			"aria-labelledby": `topics-${g.key}`,
			className: "pt-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline gap-x-3 gap-y-0.5",
				children: [/* @__PURE__ */ jsx("h2", {
					id: `topics-${g.key}`,
					className: "text-[15px] font-bold text-ink",
					children: g.name
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[12px] text-ink-4",
					children: g.blurb
				})]
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: topics.filter((t) => t.group === g.key).map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
					to: `/topics/${t.slug}`,
					prefetch: "intent",
					"aria-label": `查看${t.name}相关精选文章`,
					className: "card card-hover group flex h-full flex-col px-5 py-[18px]",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-[15px] font-bold text-ink transition-colors group-hover:text-accent",
							children: t.name
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-[1.7] text-ink-3",
							children: t.definition
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "mono mt-3 text-[11.5px] text-accent",
							children: [
								"查看 ",
								t.total,
								" 条精选 ",
								/* @__PURE__ */ jsx("span", {
									className: "inline-block transition-transform duration-200 group-hover:translate-x-0.5",
									children: "→"
								})
							]
						})
					]
				}) }, t.slug))
			})]
		}, g.key))]
	});
});
//#endregion
//#region app/routes/topic.tsx
var topic_exports = /* @__PURE__ */ __exportAll({
	default: () => topic_default,
	headers: () => headers$17,
	loader: () => loader$24,
	meta: () => meta$29
});
/** Selected items of a topic: shared caches keep the page as long as its api answer (one minute). */
function headers$17() {
	return { "Cache-Control": "public, max-age=0, s-maxage=60" };
}
async function loader$24({ params, request }) {
	const page = params.page ? Number(params.page) : 1;
	if (params.page !== void 0 && (!/^\d+$/.test(params.page) || page < 1)) throw new Response("Not found", { status: 404 });
	if (params.page === "1") throw redirect(`/topics/${params.slug}`, 308);
	return { data: await loadOr404(`/api/site/topics/${encodeURIComponent(params.slug)}?page=${page}`, { signal: request.signal }) };
}
function meta$29({ loaderData }) {
	if (!loaderData) return [{ title: titled("主题不存在") }, {
		name: "robots",
		content: "noindex"
	}];
	const { topic, page } = loaderData.data;
	const path = page > 1 ? `/topics/${topic.slug}/page/${page}` : `/topics/${topic.slug}`;
	return pageMeta({
		title: page > 1 ? `${topic.name} · 第 ${page} 页` : topic.name,
		description: topic.definition,
		path,
		image: `/og/topics/${topic.slug}.png`,
		noindex: !topic.indexable,
		jsonLd: breadcrumbLd([
			{
				name: SITE.name,
				path: "/"
			},
			{
				name: "主题",
				path: "/topics"
			},
			{
				name: topic.name,
				path: `/topics/${topic.slug}`
			}
		])
	});
}
var topic_default = UNSAFE_withComponentProps(function TopicPage() {
	const { data } = useLoaderData();
	const { topic, items, page, pageCount } = data;
	const href = (p) => p <= 1 ? `/topics/${topic.slug}` : `/topics/${topic.slug}/page/${p}`;
	const first = (page - 1) * 20 + 1;
	const last = first + items.length - 1;
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "pb-4 pt-5 lg:pt-1",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-[22px] font-bold leading-[1.35] text-ink",
							children: topic.name
						}), /* @__PURE__ */ jsx("span", {
							className: "hidden pt-2 lg:block",
							children: /* @__PURE__ */ jsx(MoreLink, {
								to: "/topics",
								children: "全部主题"
							})
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 max-w-[640px] text-[13px] leading-relaxed text-ink-3",
						children: topic.definition
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-[12.5px] text-ink-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "num mr-1 text-[20px] font-bold text-ink",
								children: topic.total.toLocaleString("zh-CN")
							}), "条精选"]
						}), topic.related.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "flex flex-wrap items-center gap-1.5 text-[12.5px]",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-ink-4",
								children: "相关主题"
							}), topic.related.map((r) => /* @__PURE__ */ jsx(Link, {
								to: `/topics/${r.slug}`,
								className: "chip",
								children: r.name
							}, r.slug))]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-1 mt-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[18px] font-bold text-ink",
					children: "最新精选"
				}), items.length > 0 && /* @__PURE__ */ jsxs("span", {
					className: "num text-[12px] text-ink-4",
					children: [
						"第 ",
						first,
						"–",
						last,
						" 条 · 共 ",
						topic.total.toLocaleString("zh-CN"),
						" 条"
					]
				})]
			}),
			items.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "lg:card",
				children: /* @__PURE__ */ jsx(EmptyState, { title: "这个主题暂时还没有精选内容" })
			}) : /* @__PURE__ */ jsx(DayList, { items }),
			/* @__PURE__ */ jsx(Pagination, {
				page,
				pageCount,
				href
			})
		]
	});
});
//#endregion
//#region app/features/about/SignalRiver.tsx
/** Stage boundaries as fractions of the width: 采集 | 归并 | 精选 | 成刊. */
var STAGES = [
	0,
	.25,
	.5,
	.75,
	1
];
var STEP = 3;
var KIND$1 = {
	x_search: "X 账号",
	rss: "RSS",
	web_list: "网页",
	mp_account: "公众号",
	json_list: "接口"
};
var FLASH_MS = 900;
var INTRO_MS = 1800;
/** Slow in, slow out: the river starts gently, crosses, and settles. */
var easeInOut = (u) => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, u)))) / 2;
var rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
var smooth = (u) => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
function prng(seed) {
	return () => {
		seed = seed + 1831565813 | 0;
		let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function layout(w, h, sources) {
	const rand = prng(20260928 + sources.length);
	const n = Math.max(40, Math.min(160, Math.round(w / 7.5)));
	const B = w >= 900 ? 9 : w >= 560 ? 7 : 5;
	const K = B >= 9 ? 3 : 2;
	const kept = new Set(Array.from({ length: K }, (_, k) => Math.round((k + .5) * B / K - .5)));
	const pad = Math.max(14, h * .07);
	const x1 = w * STAGES[1];
	const x2 = w * STAGES[2];
	const gate = w * .625;
	const xo = w * .8;
	const out = h * .42;
	const pw = Math.max(26, Math.min(46, w * .042));
	const ph = pw * 1.32;
	const paper = {
		x: w * .875 - pw / 2,
		y: out - ph / 2,
		w: pw,
		h: ph
	};
	const weights = Array.from({ length: B }, () => .45 + rand() ** 1.6 * 1.9);
	const total = weights.reduce((a, b) => a + b, 0);
	const sizes = weights.map((x) => Math.max(2, Math.round(x / total * n)));
	let diff = n - sizes.reduce((a, b) => a + b, 0);
	for (let i = 0; diff !== 0; i = (i + 1) % B) if (diff > 0) {
		sizes[i]++;
		diff--;
	} else if (sizes[i] > 2) {
		sizes[i]--;
		diff++;
	}
	const spacing = Math.max(.8, Math.min(1.6, h * .075 / Math.max(...sizes)));
	const bundles = sizes.map((size, j) => ({
		y: h * .14 + (j + .5) / B * h * .72,
		n: size,
		kept: kept.has(j),
		half: size * spacing / 2
	}));
	const cols = Math.ceil(w / STEP) + 1;
	const strands = [];
	let i = 0;
	sizes.forEach((size, j) => {
		const b = bundles[j];
		const mean = pad + (i + size / 2) / n * (h - 2 * pad);
		for (let r = 0; r < size; r++, i++) {
			const y0 = pad + (i + .5) / n * (h - 2 * pad) + (rand() - .5) * ((h - 2 * pad) / n) * .8;
			const amp = 2 + rand() * 5;
			const freq = Math.PI * 2 / (70 + rand() * 140);
			const phase = rand() * Math.PI * 2;
			const off = (r - (size - 1) / 2) * spacing;
			const yA = y0 + (mean - y0) * .25 + amp * .4 * Math.sin(freq * x1 + phase);
			const ys = new Float32Array(cols);
			for (let c = 0; c < cols; c++) {
				const x = c * STEP;
				if (x <= x1) {
					const u = x / x1;
					ys[c] = y0 + (mean - y0) * .25 * smooth(u) + amp * (1 - .6 * u) * Math.sin(freq * x + phase);
				} else if (x <= x2) ys[c] = yA + (b.y + off - yA) * smooth((x - x1) / (x2 - x1));
				else if (!b.kept || x <= gate) ys[c] = b.y + off;
				else if (x <= xo) ys[c] = b.y + off + (out + off * .5 - b.y - off) * smooth((x - gate) / (xo - gate));
				else ys[c] = out + off * .5;
			}
			const source = sources.length > 0 ? sources[i % sources.length] : null;
			strands.push({
				ys,
				end: b.kept ? paper.x : gate + w * .045,
				bundle: j,
				pass: b.kept && !source?.heatOnly,
				source
			});
		}
	});
	return {
		w,
		h,
		strands,
		bundles,
		x1,
		x2,
		gate,
		xo,
		out,
		paper
	};
}
function trace(ctx, s, from, to) {
	const a = Math.max(0, Math.floor(from / STEP));
	const b = Math.min(s.ys.length - 1, Math.ceil(to / STEP));
	ctx.beginPath();
	ctx.moveTo(Math.max(from, 0), s.ys[a]);
	for (let c = a + 1; c <= b; c++) ctx.lineTo(Math.min(c * STEP, to), s.ys[c]);
}
function readColors(probe) {
	const root = getComputedStyle(document.documentElement);
	const parse = (css, fallback) => {
		if (!css) return fallback;
		probe.clearRect(0, 0, 1, 1);
		probe.fillStyle = `rgb(${fallback.join(",")})`;
		probe.fillStyle = css;
		probe.fillRect(0, 0, 1, 1);
		const d = probe.getImageData(0, 0, 1, 1).data;
		return [
			d[0],
			d[1],
			d[2]
		];
	};
	const bg = parse(getComputedStyle(document.body).backgroundColor, [
		250,
		249,
		246
	]);
	return {
		ink: parse(root.getPropertyValue("--ink").trim(), [
			32,
			42,
			48
		]),
		accent: parse(root.getPropertyValue("--accent").trim(), [
			23,
			107,
			117
		]),
		line: parse(root.getPropertyValue("--line-strong").trim(), [
			200,
			205,
			205
		]),
		surface: parse(root.getPropertyValue("--surface").trim(), [
			255,
			255,
			255
		]),
		bg,
		dark: bg[0] * .3 + bg[1] * .59 + bg[2] * .11 < 110
	};
}
function paintStatic(ctx, L, col) {
	const base = col.dark ? .2 : .13;
	ctx.clearRect(0, 0, L.w, L.h);
	ctx.lineWidth = 1;
	ctx.lineJoin = "round";
	for (const s of L.strands) {
		const kept = L.bundles[s.bundle].kept;
		trace(ctx, s, 0, Math.min(s.end, L.gate));
		ctx.strokeStyle = rgba(col.ink, base);
		ctx.stroke();
		trace(ctx, s, L.gate, s.end);
		if (kept) ctx.strokeStyle = rgba(col.accent, col.dark ? .6 : .45);
		else {
			const g = ctx.createLinearGradient(L.gate, 0, s.end, 0);
			g.addColorStop(0, rgba(col.ink, base));
			g.addColorStop(1, rgba(col.ink, 0));
			ctx.strokeStyle = g;
		}
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.moveTo(L.xo, L.out);
	ctx.lineTo(L.paper.x, L.out);
	ctx.lineWidth = 1.6;
	ctx.strokeStyle = rgba(col.accent, .95);
	ctx.stroke();
	const top = L.h * .05;
	const bottom = L.h * .95;
	const gaps = L.bundles.filter((b) => b.kept).map((b) => [b.y - b.half - 7, b.y + b.half + 7]);
	ctx.lineWidth = 1;
	ctx.strokeStyle = rgba(col.line, 1);
	ctx.beginPath();
	let y = top;
	for (const [a, b] of gaps) {
		ctx.moveTo(L.gate, y);
		ctx.lineTo(L.gate, a);
		y = b;
	}
	ctx.moveTo(L.gate, y);
	ctx.lineTo(L.gate, bottom);
	ctx.stroke();
	for (const [a, b] of gaps) for (const yy of [a, b]) {
		ctx.beginPath();
		ctx.moveTo(L.gate - 4, yy);
		ctx.lineTo(L.gate + 4, yy);
		ctx.stroke();
	}
	paintPaper(ctx, L, col, 0);
	ctx.save();
	ctx.globalCompositeOperation = "destination-out";
	const fade = ctx.createLinearGradient(0, 0, Math.min(64, L.w * .06), 0);
	fade.addColorStop(0, "rgba(0,0,0,1)");
	fade.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = fade;
	ctx.fillRect(0, 0, Math.min(64, L.w * .06), L.h);
	ctx.restore();
}
/** The day's paper: a nameplate bar, the headline and two columns of rules. `glow` lights it. */
function paintPaper(ctx, L, col, glow) {
	const p = L.paper;
	ctx.save();
	if (glow > 0) {
		ctx.shadowColor = rgba(col.accent, .55 * glow);
		ctx.shadowBlur = 18 * glow;
	}
	ctx.beginPath();
	if (ctx.roundRect) ctx.roundRect(p.x, p.y, p.w, p.h, 5);
	else ctx.rect(p.x, p.y, p.w, p.h);
	ctx.fillStyle = rgba(col.surface, 1);
	ctx.fill();
	ctx.shadowBlur = 0;
	ctx.lineWidth = 1;
	ctx.strokeStyle = glow > 0 ? rgba(col.accent, .35 + .65 * glow) : rgba(col.line, 1);
	ctx.stroke();
	ctx.restore();
	const ix = p.x + p.w * .17;
	const iw = p.w * .66;
	ctx.fillStyle = rgba(col.accent, 1);
	ctx.fillRect(ix, p.y + p.h * .13, iw * .42, Math.max(2, p.w * .06));
	ctx.fillStyle = glow > 0 ? rgba(col.accent, .5 + .5 * glow) : rgba(col.ink, .82);
	ctx.fillRect(ix, p.y + p.h * .29, iw * .9, Math.max(2, p.w * .075));
	ctx.fillStyle = rgba(col.ink, col.dark ? .4 : .26);
	for (let r = 0; r < 4; r++) {
		const yy = p.y + p.h * (.47 + r * .12);
		ctx.fillRect(ix, yy, iw * .45, 1);
		ctx.fillRect(ix + iw * .55, yy, iw * .45, 1);
	}
}
function SignalRiver({ sources, focus, onArrive, className = "", children }) {
	const wrapRef = useRef(null);
	const canvasRef = useRef(null);
	const labelRef = useRef(null);
	const focusRef = useRef(focus);
	const arriveRef = useRef(onArrive);
	const redrawRef = useRef(() => {});
	arriveRef.current = onArrive;
	useEffect(() => {
		focusRef.current = focus;
		redrawRef.current();
	}, [focus]);
	useEffect(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		const label = labelRef.current;
		const ctx = canvas?.getContext("2d");
		if (!wrap || !canvas || !label || !ctx) return;
		const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
		const layer = document.createElement("canvas");
		const lctx = layer.getContext("2d");
		const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
		let L = null;
		let col = readColors(probe);
		let dpr = 1;
		let pulses = [];
		let passing = [];
		let spawnDebt = 0;
		let flashAt = -Infinity;
		let hover = null;
		let frame = 0;
		let last = 0;
		let introAt = still ? -Infinity : 0;
		const box = wrap.getBoundingClientRect();
		let visible = box.bottom > 0 && box.top < window.innerHeight;
		let disposed = false;
		const build = () => {
			const w = wrap.clientWidth;
			const h = wrap.clientHeight;
			if (w < 10 || h < 10) return;
			dpr = Math.min(2, window.devicePixelRatio || 1);
			for (const c of [canvas, layer]) {
				c.width = Math.round(w * dpr);
				c.height = Math.round(h * dpr);
			}
			L = layout(w, h, sources);
			passing = L.strands.flatMap((s, i) => s.pass ? [i] : []);
			pulses = [];
			lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			paintStatic(lctx, L, col);
		};
		const draw = (now) => {
			if (!L) return;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const reveal = introAt === 0 ? 0 : easeInOut((now - introAt) / INTRO_MS);
			if (reveal < 1) {
				const edge = (L.w + 80) * reveal;
				ctx.save();
				ctx.beginPath();
				ctx.rect(0, 0, Math.max(0, edge) * dpr, canvas.height);
				ctx.clip();
				ctx.drawImage(layer, 0, 0);
				ctx.restore();
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				const soft = ctx.createLinearGradient(edge - 80, 0, edge, 0);
				soft.addColorStop(0, rgba(col.bg, 0));
				soft.addColorStop(1, rgba(col.bg, 1));
				ctx.fillStyle = soft;
				ctx.fillRect(edge - 80, 0, 80, L.h);
				return;
			}
			ctx.drawImage(layer, 0, 0);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			if (hover && (hover.s !== null || hover.bundle !== null)) {
				const lit = hover.bundle !== null ? L.strands.filter((s) => s.bundle === hover.bundle) : [L.strands[hover.s]];
				ctx.lineWidth = lit.length > 1 ? 1 : 1.5;
				for (const s of lit) {
					const kept = L.bundles[s.bundle].kept;
					trace(ctx, s, 0, Math.min(s.end, L.gate));
					ctx.strokeStyle = rgba(col.ink, lit.length > 1 ? .45 : .9);
					ctx.stroke();
					trace(ctx, s, L.gate, s.end);
					ctx.strokeStyle = kept ? rgba(col.accent, .95) : rgba(col.ink, lit.length > 1 ? .3 : .6);
					ctx.stroke();
				}
			}
			const trail = Math.max(24, Math.min(56, L.w * .04));
			ctx.lineWidth = 1.8;
			for (const p of pulses) {
				const s = L.strands[p.s];
				const head = Math.min(p.x, s.end);
				if (head <= 0) continue;
				const tail = Math.max(0, head - trail);
				let c = col.ink;
				let a = col.dark ? .85 : .7;
				if (head >= L.gate) {
					if (s.pass) {
						c = col.accent;
						a = 1;
					} else a *= Math.max(0, 1 - (head - L.gate) / (s.end - L.gate));
				}
				if (a <= .01) continue;
				const g = ctx.createLinearGradient(tail, 0, head, 0);
				g.addColorStop(0, rgba(c, 0));
				g.addColorStop(1, rgba(c, a));
				trace(ctx, s, tail, head);
				ctx.strokeStyle = g;
				ctx.stroke();
			}
			const f = (now - flashAt) / FLASH_MS;
			if (f >= 0 && f < 1) paintPaper(ctx, L, col, 1 - f);
			const fx = focusRef.current;
			if (fx !== null && fx !== void 0) {
				ctx.fillStyle = rgba(col.bg, .62);
				for (let k = 0; k < 4; k++) if (k !== fx) ctx.fillRect(L.w * STAGES[k], 0, L.w * (STAGES[k + 1] - STAGES[k]), L.h);
			}
		};
		const tick = (now) => {
			frame = 0;
			if (disposed || !L) return;
			const dt = Math.min(.05, last ? (now - last) / 1e3 : 0);
			last = now;
			if (!introAt) introAt = now;
			if (now - introAt < INTRO_MS * .8) {
				draw(now);
				schedule();
				return;
			}
			spawnDebt += dt * (L.w >= 900 ? 7 : 4.5);
			while (spawnDebt >= 1 && pulses.length < 80) {
				spawnDebt -= 1;
				const s = passing.length > 0 && Math.random() < .11 ? passing[Math.floor(Math.random() * passing.length)] : Math.floor(Math.random() * L.strands.length);
				pulses.push({
					s,
					x: -Math.random() * 30,
					v: L.w * (.12 + Math.random() * .06)
				});
			}
			const kept = [];
			for (const p of pulses) {
				p.x += p.v * dt;
				const s = L.strands[p.s];
				if (p.x < s.end) kept.push(p);
				else if (s.pass) {
					flashAt = now;
					arriveRef.current?.();
				}
			}
			pulses = kept;
			draw(now);
			schedule();
		};
		const schedule = () => {
			if (!frame && !still && visible && !document.hidden && !disposed) frame = requestAnimationFrame(tick);
		};
		const redraw = () => {
			if (still || !frame) draw(performance.now());
		};
		redrawRef.current = redraw;
		const place = (x, y, title, note) => {
			const [t, n] = label.children;
			t.textContent = title;
			n.textContent = note;
			n.hidden = !note;
			label.hidden = false;
			const w = label.offsetWidth;
			const left = Math.min(Math.max(8, x + 14), wrap.clientWidth - w - 8);
			const top = Math.max(8, y + 16);
			label.style.transform = `translate(${left}px, ${top}px)`;
		};
		const onMove = (e) => {
			if (!L) return;
			const box = wrap.getBoundingClientRect();
			const x = e.clientX - box.left;
			const y = e.clientY - box.top;
			const p = L.paper;
			if (x >= p.x - 8 && x <= p.x + p.w + 8 && y >= p.y - 8 && y <= p.y + p.h + 8) {
				hover = {
					s: null,
					bundle: null,
					paper: true
				};
				place(x, y, withSubject("日报"), "每天 08:00 出刊");
				redraw();
				return;
			}
			const c = Math.round(x / STEP);
			let best = -1;
			let dist = 7;
			L.strands.forEach((s, i) => {
				if (x > s.end + 2) return;
				const d = Math.abs(s.ys[Math.min(c, s.ys.length - 1)] - y);
				if (d < dist) {
					dist = d;
					best = i;
				}
			});
			if (best < 0) {
				onLeave();
				return;
			}
			const s = L.strands[best];
			const b = L.bundles[s.bundle];
			if (x < L.x2) {
				hover = {
					s: best,
					bundle: null,
					paper: false
				};
				const kind = s.source ? KIND$1[s.source.kind] ?? "信源" : "信源";
				place(x, y, s.source ? shortSourceName(s.source.name) : "一个信源", s.source?.heatOnly ? `${kind} · 只计入热度` : kind);
			} else {
				hover = {
					s: null,
					bundle: s.bundle,
					paper: false
				};
				if (x < L.gate) place(x, y, "同一件事", `${b.n} 个来源的报道合成一条`);
				else if (b.kept) place(x, y, "进了精选", "有信息量，分数也够");
				else place(x, y, "没进精选", "信息不够、重复或只是营销");
			}
			redraw();
		};
		const onLeave = () => {
			hover = null;
			label.hidden = true;
			redraw();
		};
		const resize = new ResizeObserver(() => {
			build();
			redraw();
		});
		const recolour = () => {
			col = readColors(probe);
			if (L) paintStatic(lctx, L, col);
			redraw();
		};
		const theme = new MutationObserver(recolour);
		const scheme = matchMedia("(prefers-color-scheme: dark)");
		const seen = new IntersectionObserver(([entry]) => {
			visible = !!entry?.isIntersecting;
			last = 0;
			schedule();
		});
		const onVisibility = () => {
			last = 0;
			schedule();
		};
		build();
		draw(performance.now());
		schedule();
		resize.observe(wrap);
		seen.observe(wrap);
		theme.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme", "class"]
		});
		scheme.addEventListener("change", recolour);
		document.addEventListener("visibilitychange", onVisibility);
		wrap.addEventListener("pointermove", onMove);
		wrap.addEventListener("pointerleave", onLeave);
		return () => {
			disposed = true;
			if (frame) cancelAnimationFrame(frame);
			redrawRef.current = () => {};
			resize.disconnect();
			seen.disconnect();
			theme.disconnect();
			scheme.removeEventListener("change", recolour);
			document.removeEventListener("visibilitychange", onVisibility);
			wrap.removeEventListener("pointermove", onMove);
			wrap.removeEventListener("pointerleave", onLeave);
		};
	}, [sources]);
	return /* @__PURE__ */ jsxs("div", {
		ref: wrapRef,
		className: `relative ${className}`,
		children: [
			/* @__PURE__ */ jsx("canvas", {
				ref: canvasRef,
				"aria-hidden": "true",
				className: "absolute inset-0 size-full"
			}),
			/* @__PURE__ */ jsxs("div", {
				ref: labelRef,
				hidden: true,
				className: "pointer-events-none absolute left-0 top-0 z-10 max-w-[240px] rounded-control bg-surface px-2.5 py-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-line",
				children: [/* @__PURE__ */ jsx("div", { className: "truncate text-[12.5px] font-semibold text-ink" }), /* @__PURE__ */ jsx("div", { className: "mt-0.5 truncate text-[11.5px] text-ink-4" })]
			}),
			children
		]
	});
}
//#endregion
//#region app/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	headers: () => headers$16,
	loader: () => loader$23,
	meta: () => meta$28
});
/** Shared caches may keep this page for five minutes. */
function headers$16() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
async function loader$23({ request }) {
	const [contact, stats] = await Promise.all([apiGet("/api/site/contact", { signal: request.signal }).catch(() => ({
		wechatQr: null,
		feishuQr: null,
		makerAvatar: null
	})), apiGet("/api/site/stats", { signal: request.signal }).catch(() => null)]);
	return {
		contact,
		stats
	};
}
function meta$28() {
	return pageMeta({
		title: "关于",
		description: `关于 ${SITE.name}：${SITE.description}`,
		path: "/about",
		image: "/og/pages/about.png",
		jsonLd: organizationLd()
	});
}
var NO_SOURCES = [];
/** 3.6 万 from ten thousand up, digits with separators below. */
function figure(n) {
	return n >= 1e4 ? {
		value: (n / 1e4).toFixed(1).replace(/\.0$/, ""),
		unit: "万"
	} : {
		value: n.toLocaleString("en-US"),
		unit: ""
	};
}
function Figure({ n, unit }) {
	const f = figure(n);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-baseline gap-1.5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "num text-[30px] font-black leading-none tracking-[-0.03em] text-ink xl:text-[36px]",
			children: f.value
		}), /* @__PURE__ */ jsxs("span", {
			className: "text-[13px] text-ink-3",
			children: [f.unit, unit]
		})]
	});
}
var KIND_ORDER = [
	["x_search", "X"],
	["rss", "RSS"],
	["web_list", "网页"],
	["mp_account", "公众号"],
	["json_list", "接口"]
];
/**
* The stage columns' rules: one column on phones, two by two from sm, and from lg four in a row whose
* edges fall on the river's stage boundaries.
*/
var STAGE_CELL = [
	"sm:pr-6 lg:pr-6",
	"border-t sm:border-l sm:border-t-0 sm:pl-6 lg:px-6",
	"border-t sm:pr-6 lg:border-l lg:border-t-0 lg:px-6",
	"border-t sm:border-l sm:pl-6 lg:border-t-0 lg:px-6"
];
function stagesOf(stats) {
	const kinds = stats ? KIND_ORDER.filter(([k]) => stats.sourceKinds[k]).map(([k, label]) => `${label} ${stats.sourceKinds[k]}`).join(" · ") : null;
	return [
		{
			no: "01",
			title: "采集",
			figure: stats && /* @__PURE__ */ jsx(Figure, {
				n: stats.sources,
				unit: "个信源"
			}),
			text: ABOUT.steps.collect,
			note: kinds
		},
		{
			no: "02",
			title: "收录",
			figure: stats && /* @__PURE__ */ jsx(Figure, {
				n: stats.items,
				unit: "条动态"
			}),
			text: ABOUT.steps.store,
			note: stats && /* @__PURE__ */ jsxs(Fragment, { children: [
				"过去 24 小时收进 ",
				stats.day.collected.toLocaleString("en-US"),
				" 条"
			] })
		},
		{
			no: "03",
			title: "精选",
			figure: stats && /* @__PURE__ */ jsx(Figure, {
				n: stats.selected,
				unit: "条精选"
			}),
			text: ABOUT.steps.select,
			note: stats && /* @__PURE__ */ jsxs(Fragment, { children: [
				"过去 24 小时 ",
				stats.day.selected,
				" 条进了精选"
			] })
		},
		{
			no: "04",
			title: "成刊",
			figure: stats && /* @__PURE__ */ jsx(Figure, {
				n: stats.dailies,
				unit: "期日报"
			}),
			text: ABOUT.steps.publish,
			note: "也可以用 RSS、API、MCP 订阅"
		}
	];
}
/** The maker's round avatar before the greeting; it steps aside if the image fails. */
function MakerFace({ src }) {
	const [failed, setFailed] = useState(false);
	if (failed) return null;
	return /* @__PURE__ */ jsx("img", {
		src,
		alt: `${ABOUT.maker?.name ?? ""}的头像`,
		width: 48,
		height: 48,
		onError: () => setFailed(true),
		className: "size-11 shrink-0 rounded-full bg-bg-sunk object-cover ring-1 ring-line xl:size-12"
	});
}
function QrCard({ src, kind, title, note }) {
	return /* @__PURE__ */ jsxs("figure", {
		className: "card flex items-center gap-5 p-5",
		children: [/* @__PURE__ */ jsx("img", {
			src,
			alt: `${kind}二维码`,
			width: 112,
			height: 112,
			loading: "lazy",
			className: "size-[104px] shrink-0 rounded-tile border border-line bg-white object-contain p-1.5 sm:size-[112px]"
		}), /* @__PURE__ */ jsxs("figcaption", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[12px] text-ink-4",
					children: kind
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-1 text-[16px] font-semibold leading-snug text-ink",
					children: title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[13px] leading-[1.7] text-ink-3",
					children: note
				})
			]
		})]
	});
}
/** The optional maker block (ABOUT.maker): a greeting on the left, the contact codes that are set on the right. */
function Maker({ maker, contact }) {
	const codes = [contact.wechatQr && maker.wechat ? /* @__PURE__ */ jsx(QrCard, {
		src: contact.wechatQr,
		kind: "微信公众号",
		title: maker.wechat.title,
		note: maker.wechat.note
	}, "wechat") : null, contact.feishuQr && maker.feishu ? /* @__PURE__ */ jsx(QrCard, {
		src: contact.feishuQr,
		kind: "飞书群",
		title: maker.feishu.title,
		note: maker.feishu.note
	}, "feishu") : null].filter(Boolean);
	return /* @__PURE__ */ jsxs("section", {
		"aria-labelledby": "maker",
		className: "mt-20 grid gap-10 xl:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx(Kicker, { children: "做这个站的人" }),
			/* @__PURE__ */ jsxs("h2", {
				id: "maker",
				className: "mt-4 flex items-center gap-3.5 text-[26px] font-black leading-[1.3] tracking-[-0.02em] text-ink xl:gap-4 xl:text-[34px]",
				children: [contact.makerAvatar && /* @__PURE__ */ jsx(MakerFace, { src: contact.makerAvatar }), /* @__PURE__ */ jsxs("span", { children: ["嗨，我是 ", /* @__PURE__ */ jsx("span", {
					className: "whitespace-nowrap text-accent",
					children: maker.name
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 space-y-4 text-[15.5px] leading-[1.9] text-ink-2 xl:text-[16.5px]",
				children: [maker.greeting.map((line) => /* @__PURE__ */ jsx("p", { children: line }, line)), /* @__PURE__ */ jsxs("p", {
					className: "text-ink-3",
					children: [
						"它一直在改，改了什么都写在",
						/* @__PURE__ */ jsx(Link, {
							to: "/changelog",
							className: "text-accent hover:underline",
							children: "更新日志"
						}),
						"里；有想法、遇到问题，去",
						/* @__PURE__ */ jsx(Link, {
							to: "/feedback",
							className: "text-accent hover:underline",
							children: "反馈页"
						}),
						"告诉我。"
					]
				})]
			})
		] }), codes.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "grid content-start gap-3",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-[15px] font-semibold text-ink",
				children: "如果觉得有点用，欢迎加入"
			}), codes]
		})]
	});
}
/** The latest 精选 under the river's paper; it moves on each time an item reaches the paper. */
function Latest({ item, className = "" }) {
	if (!item) return null;
	return /* @__PURE__ */ jsxs(Link, {
		to: `/items/${item.id}`,
		prefetch: "intent",
		className: `group block ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-[11px] font-semibold tracking-[0.2em] text-accent",
			children: "最近精选"
		}), /* @__PURE__ */ jsxs("span", {
			className: "animate-fade-up mt-1.5 block",
			children: [/* @__PURE__ */ jsx("span", {
				className: "line-clamp-2 text-[13.5px] font-semibold leading-[1.55] text-ink transition-colors group-hover:text-accent",
				children: item.title
			}), /* @__PURE__ */ jsx("span", {
				className: "mt-1 block truncate text-[12px] text-ink-4",
				children: shortSourceName(item.source)
			})]
		}, item.id)]
	});
}
var about_default = UNSAFE_withComponentProps(function AboutPage() {
	const { contact, stats } = useLoaderData();
	const [focus, setFocus] = useState(null);
	const [at, setAt] = useState(0);
	const shown = useRef(0);
	const sources = useMemo(() => stats?.sampleSources ?? NO_SOURCES, [stats]);
	const stages = useMemo(() => stagesOf(stats), [stats]);
	const latest = stats?.latest ?? [];
	const onArrive = useCallback(() => {
		const now = Date.now();
		if (now - shown.current < 2800 || latest.length < 2) return;
		shown.current = now;
		setAt((i) => (i + 1) % latest.length);
	}, [latest.length]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-[var(--page-max-reading)] pb-14 pt-6 lg:pt-3",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(Kicker, { children: ABOUT.kicker }),
					/* @__PURE__ */ jsxs("h1", {
						className: "mt-5 text-[34px] font-black leading-[1.18] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[46px] xl:text-[56px] 2xl:text-[64px]",
						children: [
							ABOUT.headline[0],
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								className: "text-accent",
								children: ABOUT.headline[1]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-5 max-w-[36em] text-[15.5px] leading-[1.85] text-ink-3 xl:text-[17px]",
						children: ABOUT.lead.split("{sources}").map((part, i) => /* @__PURE__ */ jsxs("span", { children: [i > 0 && (stats ? /* @__PURE__ */ jsx("span", {
							className: "num font-semibold text-ink",
							children: stats.sources
						}) : "上百"), part] }, i))
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-3 lg:pb-2",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/",
						prefetch: "intent",
						className: buttonClass("primary", "lg"),
						children: ["看今天的精选 ", /* @__PURE__ */ jsx(IconArrowRight, { size: 15 })]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/daily",
						prefetch: "intent",
						className: buttonClass("secondary", "lg"),
						children: ["读最新", withSubject("日报")]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				"aria-labelledby": "how",
				className: "mt-10 xl:mt-14",
				children: [
					/* @__PURE__ */ jsxs("h2", {
						id: "how",
						className: "sr-only",
						children: [SITE.name, " 怎么工作"]
					}),
					/* @__PURE__ */ jsx(SignalRiver, {
						sources,
						focus,
						onArrive,
						className: "h-[230px] sm:h-[300px] lg:h-[360px] 2xl:h-[420px]",
						children: /* @__PURE__ */ jsx(Latest, {
							item: latest[at],
							className: "absolute left-[75%] top-[calc(42%+42px)] hidden w-[25%] px-6 lg:block"
						})
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "sr-only",
						children: [
							"示意图：每条线是一个信源；线汇成一束束，代表同一件事的多篇报道；经过精选的闸门，只有少数几束通过，汇入每天的",
							withSubject("日报"),
							"。"
						]
					}),
					/* @__PURE__ */ jsx(Latest, {
						item: latest[at],
						className: "mt-2 border-t border-line pt-4 lg:hidden"
					}),
					/* @__PURE__ */ jsx("ol", {
						className: "mt-4 grid grid-cols-1 border-t border-line-strong sm:grid-cols-2 lg:mt-0 lg:grid-cols-4",
						children: stages.map((s, i) => /* @__PURE__ */ jsxs("li", {
							tabIndex: 0,
							onPointerEnter: () => setFocus(i),
							onPointerLeave: () => setFocus(null),
							onFocus: () => setFocus(i),
							onBlur: () => setFocus(null),
							className: `border-line py-6 outline-none transition-colors ${STAGE_CELL[i]} ${focus === i ? "bg-accent-softer" : ""}`,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-baseline gap-2.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "num text-[12px] font-bold tracking-[0.12em] text-accent",
										children: s.no
									}), /* @__PURE__ */ jsx("h3", {
										className: "text-[17px] font-bold text-ink",
										children: s.title
									})]
								}),
								s.figure && /* @__PURE__ */ jsx("div", {
									className: "mt-4",
									children: s.figure
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-3 text-[14px] leading-[1.8] text-ink-3",
									children: s.text
								}),
								s.note && /* @__PURE__ */ jsx("p", {
									className: "mt-3 text-[12px] text-ink-4",
									children: s.note
								})
							]
						}, s.no))
					})
				]
			}),
			ABOUT.maker && /* @__PURE__ */ jsx(Maker, {
				maker: ABOUT.maker,
				contact
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-16 well rounded-card px-5 py-4 text-[13px] leading-[1.85] text-ink-3",
				children: [
					ABOUT.copyright,
					/* @__PURE__ */ jsx(Link, {
						to: "/feedback",
						className: "text-accent hover:underline",
						children: "反馈页"
					}),
					"联系我们。"
				]
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[12.5px] text-ink-4",
				children: [/* @__PURE__ */ jsx("span", { children: SITE.footerNote }), /* @__PURE__ */ jsxs("nav", {
					className: "flex gap-5",
					"aria-label": "规则与隐私",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/terms",
						className: "transition-colors hover:text-accent",
						children: "使用规则"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/privacy",
						className: "transition-colors hover:text-accent",
						children: "隐私说明"
					})]
				})]
			})
		]
	});
});
//#endregion
//#region app/lib/markdown.ts
function esc(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function inline(s, site) {
	let out = esc(s);
	out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
	out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
	out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) => {
		const own = href === site || href.startsWith(`${site}/`);
		const external = /^https?:\/\//.test(href) && !own;
		return `<a href="${own ? href.slice(site.length) || "/" : href}"${external ? " target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${text}</a>`;
	});
	out = out.replace(/(^|[\s（(])((?:https?:\/\/)[^\s<）)]+)/g, (_m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
	return out;
}
function slugifyHeading(text, i) {
	return `s${i + 1}`;
}
/** `site` is the site's own address (seo.ts siteUrl()), so links to it stay on the site. */
function renderMarkdown(md, site) {
	const lines = md.replace(/\r\n/g, "\n").split("\n");
	const html = [];
	const outline = [];
	let i = 0;
	let h = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) {
			i++;
			continue;
		}
		const heading = /^(#{2,4})\s+(.+)$/.exec(line);
		if (heading) {
			const level = heading[1].length;
			const text = heading[2].trim();
			const id = slugifyHeading(text, h++);
			if (level === 2) outline.push({
				id,
				text
			});
			html.push(`<h${level} id="${id}">${inline(text, site)}</h${level}>`);
			i++;
			continue;
		}
		if (/^\|/.test(line)) {
			const rows = [];
			while (i < lines.length && /^\|/.test(lines[i])) {
				const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
				if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
				i++;
			}
			const [head, ...body] = rows;
			html.push(`<table><thead><tr>${(head ?? []).map((c) => `<th>${inline(c, site)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c, site)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
			continue;
		}
		if (/^>\s?/.test(line)) {
			const buf = [];
			while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
			html.push(`<blockquote><p>${inline(buf.join(" "), site)}</p></blockquote>`);
			continue;
		}
		if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.．]\s+/.test(line)) {
			const ordered = /^\s*\d+[.．]\s+/.test(line);
			const items = [];
			while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+[.．]\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]) && items.length)) {
				const l = lines[i];
				if (/^\s{2,}\S/.test(l) && !/^\s*[-*]\s+/.test(l) && !/^\s*\d+[.．]\s+/.test(l)) items[items.length - 1] += ` ${l.trim()}`;
				else items.push(l.replace(/^\s*(?:[-*]|\d+[.．])\s+/, ""));
				i++;
			}
			const tag = ordered ? "ol" : "ul";
			html.push(`<${tag}>${items.map((it) => `<li>${inline(it, site)}</li>`).join("")}</${tag}>`);
			continue;
		}
		const para = [];
		while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|\||>|\s*[-*]\s|\s*\d+[.．]\s)/.test(lines[i])) para.push(lines[i++].trim());
		html.push(`<p>${inline(para.join(""), site)}</p>`);
	}
	return {
		html: html.join("\n"),
		outline
	};
}
/**
* Splits a page copy file (industry/pages/) into its page parts: the first heading (title), the meta table,
* the page-top statement (页首说明) and the verbatim body starting at the first "## " section.
*/
function parseCopyFile(md, firstSection = /^## /m) {
	const title = (/^#\s+(.+)$/m.exec(md)?.[1] ?? "").replace(/（现行版）|（现网）/g, "").trim();
	const meta = {};
	for (const m of md.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm)) if (m[1] !== "项" && !/^-+$/.test(m[1])) meta[m[1]] = m[2];
	const introMatch = /页首说明：\s*\n+((?:>.*\n?)+)/.exec(md);
	const intro = introMatch ? introMatch[1].replace(/^>\s?/gm, "").replace(/\n/g, "").trim() : null;
	const start = md.search(firstSection);
	return {
		title,
		meta,
		intro,
		body: start >= 0 ? md.slice(start) : md
	};
}
//#endregion
//#region app/lib/site-copy.ts
function stripPageNotes(body) {
	return body.replace(/^页脚[^\n]*$/gm, "").trim();
}
function prepareCopy(md, firstSection) {
	const doc = parseCopyFile(md, firstSection);
	const footerLine = /^页脚[：:](.+)$/m.exec(doc.body)?.[1]?.trim() ?? null;
	doc.body = stripPageNotes(doc.body);
	return {
		doc,
		rendered: renderMarkdown(doc.body, siteUrl()),
		footerLine
	};
}
//#endregion
//#region ../../industry/pages/terms.md?raw
var terms_default$1 = "# 使用规则\r\n\r\n这是开源框架自带的模板。上线前请按你的实际情况改写（运营主体、允许和不允许的用途、联系方式），必要时请专业人士审阅。\r\n\r\n| 项 | 值 |\r\n|---|---|\r\n| 版本 | 0.1（模板） |\r\n| 生效日期 | 请填写 |\r\n| 运营主体 | 请填写 |\r\n| 联系方式 | 请填写 |\r\n\r\n页首说明：\r\n\r\n> 本站聚合公开信源，用模型生成中文摘要与精选，原文版权归各来源所有。网站、RSS、公开 API 与 MCP 均可匿名使用。\r\n\r\n## 1. 内容与版权\r\n\r\n本站展示的标题、摘要和推荐理由由模型根据公开来源生成，可能有误，重要信息请以原文为准。原文版权归各来源所有；站内只在来源允许时展示全文，其余只展示摘要和原文链接。\r\n\r\n## 2. 来源方的更正与下架\r\n\r\n如果你是来源方，希望更正、下架或调整展示方式，请通过反馈页联系我们，我们会尽快处理。\r\n\r\n## 3. 使用本站的数据\r\n\r\n请写明你允许的用途（例如个人阅读、组织内部使用），以及需要事先取得你同意的用途（例如商业产品、公开转载、批量再分发）。\r\n\r\n## 4. 接口与频率\r\n\r\nRSS、公开 API 和 MCP 为匿名只读接口。请按响应中的缓存时间轮询，遇到 429 请遵守 Retry-After，不要并发重试。\r\n\r\n## 5. 免责\r\n\r\n本站按“现状”提供，不保证内容完整、准确和持续可用。\r\n";
//#endregion
//#region app/features/copy/CopyPage.tsx
/**
* Legal and policy pages, read like articles: the document on the page in one column, its facts in the
* left rail and its outline in the right (phones get the facts above the text and no outline).
*/
function CopyPage({ doc, rendered, eyebrow, footer, aside }) {
	const facts = [
		"版本",
		"生效日期",
		"运营主体",
		"备案号"
	].filter((k) => doc.meta[k]);
	const info = facts.length > 0 && /* @__PURE__ */ jsx(RailSection, {
		title: "文档信息",
		children: /* @__PURE__ */ jsx("dl", {
			className: "space-y-2 text-[12.5px]",
			children: facts.map((k) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
				className: "text-ink-4",
				children: k
			}), /* @__PURE__ */ jsx("dd", {
				className: "mt-0.5 text-ink-2",
				children: doc.meta[k]
			})] }, k))
		})
	});
	const outline = rendered.outline.length > 2 && /* @__PURE__ */ jsx(RailSection, {
		title: "目录",
		children: /* @__PURE__ */ jsx("nav", {
			"aria-label": "目录",
			children: /* @__PURE__ */ jsx("ol", {
				className: "-ml-px space-y-0.5 border-l border-line",
				children: rendered.outline.map((o) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
					href: `#${o.id}`,
					className: "-ml-px block border-l border-transparent py-1 pl-3 text-[12.5px] leading-snug text-ink-3 transition-colors hover:border-accent hover:text-ink",
					children: o.text
				}) }, o.id))
			})
		})
	});
	return /* @__PURE__ */ jsx(ArticleLayout, {
		left: /* @__PURE__ */ jsxs(Fragment, { children: [aside, info] }),
		right: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "space-y-8 2xl:hidden",
			children: info
		}), outline] }),
		children: /* @__PURE__ */ jsxs("article", {
			className: "pb-14 pt-5 lg:pt-2",
			children: [
				eyebrow && /* @__PURE__ */ jsx("div", {
					className: "mb-2.5 text-[12px] font-semibold text-accent",
					children: eyebrow
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-[26px] font-bold leading-[1.35] text-ink lg:text-[32px] xl:text-[36px] xl:leading-[1.3]",
					children: doc.title
				}),
				doc.intro && /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-[15px] leading-[1.8] text-ink-3 xl:text-[16px]",
					children: doc.intro
				}),
				facts.length > 0 && /* @__PURE__ */ jsx("dl", {
					className: "mt-5 grid grid-cols-1 border-y border-line text-[12.5px] sm:grid-cols-2 lg:hidden",
					children: facts.map((k) => /* @__PURE__ */ jsxs("div", {
						className: "flex gap-4 border-b border-line-soft py-2.5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0",
						children: [/* @__PURE__ */ jsx("dt", {
							className: "w-16 shrink-0 text-ink-4",
							children: k
						}), /* @__PURE__ */ jsx("dd", {
							className: "min-w-0 text-ink-2",
							children: doc.meta[k]
						})]
					}, k))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "prose prose-compact mt-6 lg:mt-8",
					dangerouslySetInnerHTML: { __html: rendered.html }
				}),
				footer && /* @__PURE__ */ jsx("div", {
					className: "mt-12 border-t border-line pt-5 text-[12.5px] text-ink-3",
					children: footer
				})
			]
		})
	});
}
function LegalFooterLinks({ links, note }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-x-4 gap-y-1",
		children: [links.map((l) => /* @__PURE__ */ jsx(Link, {
			id: l.id,
			to: l.to,
			className: "text-accent hover:underline",
			children: l.label
		}, l.to)), note && /* @__PURE__ */ jsx("span", {
			className: "text-ink-4",
			children: note
		})]
	});
}
//#endregion
//#region app/routes/terms.tsx
var terms_exports = /* @__PURE__ */ __exportAll({
	default: () => terms_default,
	headers: () => headers$15,
	meta: () => meta$27
});
var TERMS = prepareCopy(terms_default$1);
/** Shared caches may keep this page for five minutes. */
function headers$15() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
function meta$27() {
	return pageMeta({
		title: "使用规则",
		description: `本站网站、RSS、公开 API 与 MCP 的使用规则。`,
		path: "/terms",
		image: "/og/pages/terms.png"
	});
}
var terms_default = UNSAFE_withComponentProps(function TermsPage() {
	return /* @__PURE__ */ jsx(CopyPage, {
		doc: TERMS.doc,
		rendered: TERMS.rendered,
		eyebrow: SITE.name,
		footer: /* @__PURE__ */ jsx(LegalFooterLinks, {
			links: [{
				to: "/privacy",
				label: "隐私说明"
			}, {
				to: "/agent",
				label: "Agent 接入页"
			}],
			note: `使用规则 ${TERMS.doc.meta["版本"] ?? ""} · ${TERMS.doc.meta["生效日期"] ?? ""}`
		})
	});
});
//#endregion
//#region ../../industry/pages/privacy.md?raw
var privacy_default$1 = "# 隐私说明\r\n\r\n这是开源框架自带的模板，只写了这套软件默认会处理哪些数据。上线前请按你的实际情况改写（运营主体、联系方式、你另外接入的统计或服务），必要时请专业人士审阅。\r\n\r\n| 项 | 值 |\r\n|---|---|\r\n| 版本 | 0.1（模板） |\r\n| 生效日期 | 请填写 |\r\n| 运营主体 | 请填写 |\r\n| 隐私事务联系 | 请填写 |\r\n\r\n页首说明：\r\n\r\n> 使用本站不需要注册或登录。我们只处理让网站正常运行、处理反馈所必需的信息，不出售个人信息。\r\n\r\n## 1. 浏览器本地数据\r\n\r\n收藏、已读记录、主题偏好和反馈草稿只保存在你当前的浏览器里，不会发送到服务器。清除浏览器数据后它们会消失；换设备不会同步。你可以在“收藏”页导出和导入这些数据。\r\n\r\n## 2. 反馈\r\n\r\n你在反馈页提交的内容、选填的邮箱、提交时所在页面的地址，以及你选择附上的截图，会保存在服务器上，用于处理你的反馈。为防止滥用，服务器会保存一个由网络地址和浏览器类别计算出的、无法还原的标识，用于限流和封禁滥用来源。\r\n\r\n## 3. 服务器与网络日志\r\n\r\n本软件默认不做访客统计。你的服务器、反向代理或 CDN 可能会按它们自己的配置记录访问日志（如 IP 地址、访问时间、页面地址、浏览器信息）。请在这里写明你实际使用的服务和保存期限。\r\n\r\n## 4. 第三方内容\r\n\r\n本站展示的是第三方原文的摘要与链接。点击原文链接后，你访问的是对方网站，适用对方的隐私政策。\r\n\r\n## 5. 联系我们\r\n\r\n请写明联系方式，以及查询、更正或删除反馈资料的方式。\r\n";
//#endregion
//#region app/routes/privacy.tsx
var privacy_exports = /* @__PURE__ */ __exportAll({
	default: () => privacy_default,
	headers: () => headers$14,
	meta: () => meta$26
});
var PRIVACY = prepareCopy(privacy_default$1);
/** Shared caches may keep this page for five minutes. */
function headers$14() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
function meta$26() {
	return pageMeta({
		title: "隐私说明",
		description: `本站如何处理浏览器本地数据、反馈资料与访问日志。`,
		path: "/privacy",
		image: "/og/pages/privacy.png"
	});
}
var privacy_default = UNSAFE_withComponentProps(function PrivacyPage() {
	return /* @__PURE__ */ jsx(CopyPage, {
		doc: PRIVACY.doc,
		rendered: PRIVACY.rendered,
		eyebrow: SITE.name,
		footer: /* @__PURE__ */ jsx(LegalFooterLinks, {
			links: [{
				to: "/terms",
				label: "使用规则"
			}, {
				to: "/feedback",
				label: "反馈页"
			}],
			note: `隐私说明 ${PRIVACY.doc.meta["版本"] ?? ""} · ${PRIVACY.doc.meta["生效日期"] ?? ""}`
		})
	});
});
//#endregion
//#region app/features/changelog/text.tsx
/** Release notes carry a little Markdown: **bold** runs. */
function Inline({ text }) {
	return /* @__PURE__ */ jsx(Fragment, { children: text.split(/\*\*(.+?)\*\*/g).map((part, i) => i % 2 ? /* @__PURE__ */ jsx("b", {
		className: "font-semibold text-ink-2",
		children: part
	}, i) : part) });
}
function dateHeading(date) {
	const [y, m, d] = date.split("-").map(Number);
	return {
		label: `${y} 年 ${m} 月 ${d} 日`,
		weekday: beijingWeekday(date).replace("星期", "周")
	};
}
//#endregion
//#region app/routes/changelog.tsx
var changelog_exports = /* @__PURE__ */ __exportAll({
	default: () => changelog_default,
	headers: () => headers$13,
	loader: () => loader$22,
	meta: () => meta$25
});
/** Shared caches may keep this page for five minutes. */
function headers$13() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
async function loader$22({ request }) {
	return apiGet("/api/site/changelog", { signal: request.signal });
}
function meta$25() {
	return pageMeta({
		title: "更新日志",
		description: `${SITE.name} 的功能更新、优化、公告与下线记录。`,
		path: "/changelog",
		image: "/og/pages/changelog.png"
	});
}
var KIND_DOT = {
	更新: "bg-accent",
	优化: "bg-ok",
	公告: "bg-amber",
	下线: "bg-ink-4"
};
var KINDS = Object.keys(KIND_DOT);
function ReleaseBody({ lines }) {
	const blocks = [];
	for (const line of lines) {
		const last = blocks.at(-1);
		if (!line.startsWith("- ")) blocks.push(line);
		else if (Array.isArray(last)) last.push(line.slice(2));
		else blocks.push([line.slice(2)]);
	}
	const text = "mt-2 max-w-[52em] text-[13.5px] leading-[1.8] text-ink-3";
	return blocks.map((b, i) => Array.isArray(b) ? /* @__PURE__ */ jsx("ul", {
		className: `${text} space-y-1`,
		children: b.map((li, j) => /* @__PURE__ */ jsxs("li", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ jsx("span", {
				className: "mt-[11px] size-1 shrink-0 rounded-full bg-ink-4",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Inline, { text: li }) })]
		}, j))
	}, i) : /* @__PURE__ */ jsx("p", {
		className: text,
		children: /* @__PURE__ */ jsx(Inline, { text: b })
	}, i));
}
var changelog_default = UNSAFE_withComponentProps(function ChangelogPage() {
	const data = useLoaderData();
	useEffect(() => setChangelogSeen(data.latestVersion), [data.latestVersion]);
	const [kind, setKind] = useState(null);
	const groups = /* @__PURE__ */ new Map();
	for (const r of data.releases) if (!kind || r.kind === kind) groups.set(r.date, [...groups.get(r.date) ?? [], r]);
	const months = /* @__PURE__ */ new Map();
	for (const [date, releases] of groups) {
		const month = months.get(date.slice(0, 7)) ?? {
			first: date,
			count: 0
		};
		month.count += releases.length;
		months.set(date.slice(0, 7), month);
	}
	const aside = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(AsideCard, {
			title: "按类型看",
			className: "hidden lg:block",
			children: /* @__PURE__ */ jsx("div", {
				className: "-mx-2 -mb-1",
				children: [null, ...KINDS].map((k) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setKind(k),
					"aria-pressed": kind === k,
					className: `flex w-full items-center gap-2.5 rounded-control px-2 py-2 text-left text-[13.5px] transition-colors ${kind === k ? "bg-bg-sunk font-medium text-ink dark:bg-bg-muted/60" : "text-ink-2 hover:bg-bg-sunk hover:text-ink"}`,
					children: [
						/* @__PURE__ */ jsx("span", {
							className: `size-1.5 rounded-full ${k ? KIND_DOT[k] : "bg-ink-2"}`,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "flex-1",
							children: k ?? "全部"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "num text-[12px] text-ink-4",
							children: k ? data.releases.filter((r) => r.kind === k).length : data.releases.length
						})
					]
				}, k ?? "all"))
			})
		}),
		/* @__PURE__ */ jsx(AsideCard, {
			title: "按月份",
			className: "hidden lg:block",
			children: /* @__PURE__ */ jsx("nav", {
				"aria-label": "按月份",
				className: "-mx-2 -mb-1",
				children: [...months.entries()].map(([month, m]) => {
					const [y, mo] = month.split("-").map(Number);
					return /* @__PURE__ */ jsxs("a", {
						href: `#d-${m.first}`,
						className: "flex items-center justify-between rounded-control px-2 py-2 text-[13.5px] text-ink-2 transition-colors hover:bg-bg-sunk hover:text-ink",
						children: [
							y,
							" 年 ",
							mo,
							" 月",
							/* @__PURE__ */ jsxs("span", {
								className: "num text-[12px] text-ink-4",
								children: [m.count, " 条"]
							})
						]
					}, month);
				})
			})
		}),
		/* @__PURE__ */ jsxs(AsideCard, {
			title: "有想法或遇到问题",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-[13px] leading-[1.75] text-ink-3",
				children: "想要的功能、用着不顺的地方，都可以在反馈页告诉我们。"
			}), /* @__PURE__ */ jsxs(Link, {
				to: "/feedback",
				prefetch: "intent",
				className: "mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline",
				children: ["去反馈 ", /* @__PURE__ */ jsx(IconChevronRight, { size: 14 })]
			})]
		})
	] });
	return /* @__PURE__ */ jsxs(ReadingLayout, {
		aside,
		children: [/* @__PURE__ */ jsxs("header", {
			className: "pb-6",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-[24px] font-semibold leading-[1.3] text-ink",
				children: "更新日志"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-[13px] text-ink-3",
				children: "新功能、调整、下线，都写在这里。"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: [...groups.entries()].map(([date, releases]) => {
				const h = dateHeading(date);
				const plain = releases;
				return /* @__PURE__ */ jsx(Fragment$1, { children: plain.length > 0 && /* @__PURE__ */ jsxs("section", {
					id: `d-${date}`,
					className: "card scroll-mt-6 px-5 lg:px-7",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "flex items-baseline gap-3 border-b border-line-soft py-4",
						children: [/* @__PURE__ */ jsx("time", {
							dateTime: date,
							className: "text-[18px] font-bold text-ink",
							children: h.label
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[12px] text-ink-4",
							children: h.weekday
						})]
					}), /* @__PURE__ */ jsx("ol", { children: plain.map((r) => /* @__PURE__ */ jsxs("li", {
						className: "grid gap-x-8 gap-y-2 border-b border-line-soft py-5 last:border-b-0 sm:grid-cols-[88px_minmax(0,1fr)]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 sm:block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono block text-[12.5px] text-ink-3",
								children: r.time
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5 text-[11.5px] text-ink-4 sm:mt-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: `size-1.5 rounded-full ${KIND_DOT[r.kind]}`,
									"aria-hidden": "true"
								}), r.kind]
							})]
						}), /* @__PURE__ */ jsxs("article", {
							className: "min-w-0 sm:border-l sm:border-line sm:pl-8",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-[15px] font-bold leading-snug text-ink",
								children: r.title
							}), /* @__PURE__ */ jsx(ReleaseBody, { lines: r.body })]
						})]
					}, `${r.date}-${r.time}-${r.title}`)) })]
				}) }, date);
			})
		})]
	});
});
//#endregion
//#region app/routes/feedback.tsx
var feedback_exports$1 = /* @__PURE__ */ __exportAll({
	default: () => feedback_default$1,
	headers: () => headers$12,
	meta: () => meta$24
});
/** Shared caches may keep this page for five minutes. */
function headers$12() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
function meta$24() {
	return pageMeta({
		title: "反馈",
		description: `告诉 ${SITE.name} 哪里可以做得更好：内容、功能、接入或来源方的更正与下架请求。`,
		path: "/feedback",
		image: "/og/pages/feedback.png",
		noindex: true
	});
}
function readDraft() {
	try {
		const raw = localStorage.getItem(KEYS.feedbackDraft);
		if (!raw) return null;
		const d = JSON.parse(raw);
		return typeof d === "object" && d ? {
			content: String(d.content ?? ""),
			email: String(d.email ?? ""),
			pageUrl: String(d.pageUrl ?? "")
		} : null;
	} catch {
		return null;
	}
}
function writeDraft(d) {
	try {
		if (d === null) localStorage.removeItem(KEYS.feedbackDraft);
		else localStorage.setItem(KEYS.feedbackDraft, JSON.stringify({
			...d,
			savedAt: (/* @__PURE__ */ new Date()).toISOString()
		}));
	} catch {}
}
var TIPS = [
	"出问题的页面或文章链接",
	"你看到了什么，原本想做什么",
	"有截图更好，记得先遮盖敏感信息"
];
function FeedbackAside() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AsideCard, {
		title: "写清楚这几点，处理更快",
		children: /* @__PURE__ */ jsx("ol", {
			className: "space-y-2.5",
			children: TIPS.map((t, i) => /* @__PURE__ */ jsxs("li", {
				className: "flex gap-2.5 text-[13px] leading-[1.6] text-ink-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mono mt-px text-[11px] font-bold text-accent",
					children: String(i + 1).padStart(2, "0")
				}), t]
			}, t))
		})
	}), /* @__PURE__ */ jsx(AsideCard, {
		title: "来源方",
		children: /* @__PURE__ */ jsx("p", {
			className: "text-[13px] leading-[1.75] text-ink-3",
			children: "如果你是来源方，希望更正、下架或调整展示方式，写明对应的文章链接和你的诉求即可。"
		})
	})] });
}
var MAX_IMAGE = 5242880;
var MAX_TEXT = 2e3;
var feedback_default$1 = UNSAFE_withComponentProps(function FeedbackPage() {
	const [params] = useSearchParams();
	const [draft, setDraft] = useState({
		content: "",
		email: "",
		pageUrl: params.get("from") ?? ""
	});
	const [shot, setShot] = useState(null);
	const [state, setState] = useState({ kind: "idle" });
	const [dragging, setDragging] = useState(false);
	const fileRef = useRef(null);
	useEffect(() => {
		const saved = readDraft();
		if (saved) setDraft((d) => ({
			...saved,
			pageUrl: d.pageUrl || saved.pageUrl
		}));
		else if (!params.get("from") && document.referrer.startsWith(location.origin)) setDraft((d) => ({
			...d,
			pageUrl: document.referrer
		}));
	}, []);
	useEffect(() => {
		const t = setTimeout(() => writeDraft(draft.content || draft.email ? draft : null), 400);
		return () => clearTimeout(t);
	}, [draft]);
	useEffect(() => {
		if (!shot) return;
		return () => URL.revokeObjectURL(shot.url);
	}, [shot]);
	const pick = (file) => {
		if (!file) return;
		if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return setState({
			kind: "error",
			message: "截图需要是 PNG、JPEG 或 WebP。"
		});
		if (file.size > MAX_IMAGE) return setState({
			kind: "error",
			message: "截图原图不超过 5 MB。"
		});
		setShot({
			file,
			url: URL.createObjectURL(file)
		});
		setState({ kind: "idle" });
	};
	useEffect(() => {
		const onPaste = (e) => {
			const file = [...e.clipboardData?.files ?? []].find((f) => f.type.startsWith("image/"));
			if (file) pick(file);
		};
		window.addEventListener("paste", onPaste);
		return () => window.removeEventListener("paste", onPaste);
	}, []);
	const submit = async (e) => {
		e.preventDefault();
		if (draft.content.trim().length < 2) return setState({
			kind: "error",
			message: "请写下反馈内容。"
		});
		setState({ kind: "sending" });
		try {
			const form = new FormData();
			form.set("content", draft.content);
			form.set("email", draft.email);
			form.set("pageUrl", draft.pageUrl);
			if (shot) form.set("screenshot", shot.file);
			const res = await fetch("/api/site/feedback", {
				method: "POST",
				body: form
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) return setState({
				kind: "error",
				message: body.detail ?? "提交失败，请稍后再试。"
			});
			writeDraft(null);
			setState({
				kind: "done",
				id: body.id
			});
			setDraft({
				content: "",
				email: "",
				pageUrl: ""
			});
			setShot(null);
		} catch {
			setState({
				kind: "error",
				message: "网络不太顺，草稿已保存在本机，稍后再提交。"
			});
		}
	};
	if (state.kind === "done") return /* @__PURE__ */ jsx(ReadingLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "card px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "anim-pop-in mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-contrast",
				children: /* @__PURE__ */ jsx(IconCheck, { size: 26 })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-6 text-[22px] font-semibold text-ink",
				children: "收到了，谢谢你"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-[14px] text-ink-3",
				children: [
					"反馈编号 ",
					/* @__PURE__ */ jsxs("span", {
						className: "mono font-semibold text-ink",
						children: ["#", state.id]
					}),
					"，需要回复时我们会引用这个编号。"
				]
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "mt-8 inline-flex h-10 items-center rounded-full bg-ink px-6 text-[14px] font-medium text-bg transition-opacity hover:opacity-90",
				children: "回到精选"
			})
		]
	}) });
	const field = "w-full rounded-card bg-bg-sunk text-ink outline-none ring-1 ring-inset ring-line-soft transition-[background-color,box-shadow] placeholder:text-ink-4 hover:ring-line-strong focus:bg-surface focus:shadow-[0_0_0_3px_var(--accent-soft)] focus:ring-accent dark:bg-bg-muted/60 dark:focus:bg-surface";
	const label = "mb-2 block text-[13px] font-semibold text-ink";
	const canSend = draft.content.trim().length >= 2 && state.kind !== "sending";
	return /* @__PURE__ */ jsxs(ReadingLayout, {
		aside: /* @__PURE__ */ jsx(FeedbackAside, {}),
		children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-[24px] font-semibold leading-[1.3] text-ink",
			children: "说说你的想法"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-[14.5px] leading-relaxed text-ink-3",
			children: "发现 bug、想要的功能、看不顺眼的地方，都可以告诉我，我都会看到。"
		})] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			onDragOver: (e) => {
				e.preventDefault();
				setDragging(true);
			},
			onDragLeave: (e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
			},
			onDrop: (e) => {
				e.preventDefault();
				setDragging(false);
				pick(e.dataTransfer.files[0]);
			},
			className: `card mt-6 overflow-hidden transition-shadow ${dragging ? "shadow-[0_0_0_3px_var(--accent-soft)] ring-1 ring-accent" : ""}`,
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-5 p-5 sm:p-6",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "fb-content",
						className: label,
						children: "想说点什么？"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("textarea", {
							id: "fb-content",
							required: true,
							rows: 9,
							maxLength: MAX_TEXT,
							value: draft.content,
							onChange: (e) => setDraft({
								...draft,
								content: e.target.value
							}),
							placeholder: "例如：查找“申京澳门赛出战情况”时没有找到、希望增加更多随队记者的深度专栏、界面阅读体验建议……",
							className: `${field} block resize-y px-4 pb-8 pt-3.5 text-[14.5px] leading-relaxed`
						}), /* @__PURE__ */ jsxs("span", {
							className: "mono pointer-events-none absolute bottom-3 right-4 text-[11px] text-ink-4",
							children: [
								draft.content.length,
								" / ",
								MAX_TEXT
							]
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
						htmlFor: "fb-email",
						className: label,
						children: ["邮箱 ", /* @__PURE__ */ jsx("span", {
							className: "font-normal text-ink-4",
							children: "（选填）"
						})]
					}), /* @__PURE__ */ jsx("input", {
						id: "fb-email",
						type: "email",
						value: draft.email,
						onChange: (e) => setDraft({
							...draft,
							email: e.target.value
						}),
						placeholder: "留下邮箱，我可以回信联系你",
						className: `${field} h-11 px-4 text-[14.5px]`
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("span", {
							className: label,
							children: ["截图 ", /* @__PURE__ */ jsx("span", {
								className: "font-normal text-ink-4",
								children: "（选填）"
							})]
						}),
						shot ? /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 well rounded-card p-3",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: shot.url,
									alt: "截图预览",
									className: "h-16 w-24 shrink-0 rounded-control border border-line bg-surface object-cover"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-[13px] font-medium text-ink-2",
										children: shot.file.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "mono mt-0.5 text-[11.5px] text-ink-4",
										children: [(shot.file.size / 1024 / 1024).toFixed(2), " MB"]
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									"aria-label": "移除截图",
									onClick: () => setShot(null),
									className: "grid size-8 shrink-0 place-items-center rounded-full text-ink-4 transition-colors hover:bg-surface hover:text-ink",
									children: /* @__PURE__ */ jsx(IconClose, { size: 15 })
								})
							]
						}) : /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: `group flex w-full items-center gap-3.5 rounded-card border border-dashed px-4 py-3.5 text-left transition-colors ${dragging ? "border-accent bg-accent-softer" : "border-line-strong hover:border-ink-4 hover:bg-bg-sunk/60"}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid size-10 shrink-0 place-items-center well rounded-tile text-ink-3 transition-colors group-hover:text-accent",
								children: /* @__PURE__ */ jsx(IconImage, { size: 19 })
							}), /* @__PURE__ */ jsxs("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "block text-[13.5px] font-semibold text-ink-2",
									children: "添加一张问题截图"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-0.5 block text-[12px] leading-relaxed text-ink-4",
									children: "粘贴或拖到这里也可以 · 请先遮盖敏感信息；PNG、JPEG 或 WebP，原图不超过 5 MB"
								})]
							})]
						}),
						/* @__PURE__ */ jsx("input", {
							ref: fileRef,
							type: "file",
							accept: "image/png,image/jpeg,image/webp",
							className: "sr-only",
							onChange: (e) => pick(e.target.files?.[0])
						})
					] }),
					/* @__PURE__ */ jsx(Presence, {
						show: state.kind === "error",
						enter: "anim-notice-in",
						exit: "anim-fade-out",
						duration: 160,
						children: /* @__PURE__ */ jsx("p", {
							role: "alert",
							className: "rounded-tile bg-hot-soft px-3.5 py-2.5 text-[13px] text-hot",
							children: state.kind === "error" ? state.message : ""
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col-reverse gap-4 border-t border-line-soft bg-bg-sunk/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:bg-bg-muted/30",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-[12px] leading-relaxed text-ink-4 sm:max-w-[400px]",
					children: [
						"请勿提交密钥、身份证件或与问题无关的敏感信息。提交即表示你知悉反馈内容、选填邮箱、页面信息和截图将按",
						/* @__PURE__ */ jsx(Link, {
							to: "/privacy",
							className: "text-accent hover:underline",
							children: "隐私说明"
						}),
						"处理。"
					]
				}), /* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: !canSend,
					className: "inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-accent px-6 text-[14px] font-medium text-accent-contrast transition-[background-color,opacity] hover:bg-accent-ink disabled:bg-line-strong disabled:text-ink-4 sm:self-auto",
					children: [state.kind === "sending" && /* @__PURE__ */ jsx(RingMark, {
						className: "size-4",
						spinning: true
					}), "发送反馈"]
				})]
			})]
		})]
	});
});
//#endregion
//#region app/routes/more.tsx
var more_exports = /* @__PURE__ */ __exportAll({
	default: () => more_default,
	headers: () => headers$11,
	meta: () => meta$23
});
/** Shared caches may keep this page for five minutes. */
function headers$11() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
function meta$23() {
	return pageMeta({
		title: "更多",
		path: "/more",
		noindex: true
	});
}
var GROUPS = [{
	title: "内容",
	rows: [
		{
			to: "/topics",
			label: "主题专区",
			icon: /* @__PURE__ */ jsx(IconGrid, { size: 18 })
		},
		{
			to: "/hot",
			label: "热点榜",
			icon: /* @__PURE__ */ jsx(IconFlame, { size: 18 })
		},
		{
			to: "/starred",
			label: "我的收藏",
			icon: /* @__PURE__ */ jsx(IconBookmark, { size: 18 })
		}
	]
}, {
	title: "关于与反馈",
	rows: [{
		to: "/about",
		label: `关于 ${SITE.name}`,
		icon: /* @__PURE__ */ jsx(IconHeart, { size: 18 })
	}, {
		to: "/feedback",
		label: "意见反馈",
		icon: /* @__PURE__ */ jsx(IconMessage, { size: 18 })
	}]
}];
function Group({ title, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "card overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", {
			className: "px-4 pb-1 pt-3 text-[11.5px] text-ink-4",
			children: title
		}), /* @__PURE__ */ jsx("ul", {
			className: "divide-y divide-line-soft",
			children
		})]
	});
}
var more_default = UNSAFE_withComponentProps(function MorePage() {
	const changelogDot = useChangelogDot(useRouteLoaderData("root")?.changelogVersion ?? null);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-[var(--page-max-reading)] pb-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "pb-4 pt-5 text-[22px] font-bold text-ink lg:pt-1",
				children: "更多"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0 2xl:grid-cols-3",
				children: GROUPS.map((g) => /* @__PURE__ */ jsxs(Group, {
					title: g.title,
					children: [g.rows.map((r) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
						to: r.to,
						className: "flex h-[50px] items-center gap-3 px-4 text-[15px] font-medium text-ink transition-colors active:bg-bg-sunk lg:hover:bg-bg-sunk",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-ink-3",
								children: r.icon
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex flex-1 items-center gap-2",
								children: [r.label, r.to === "/changelog" && changelogDot && /* @__PURE__ */ jsx("span", {
									className: "size-1.5 rounded-full bg-hot",
									"aria-label": "有新的更新"
								})]
							}),
							/* @__PURE__ */ jsx(IconChevronRight, {
								size: 16,
								className: "text-ink-4"
							})
						]
					}) }, r.to)), g.title === "关于与反馈" && /* @__PURE__ */ jsxs("li", {
						className: "flex h-[58px] items-center gap-3 px-4 text-[15px] font-medium text-ink",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-ink-3",
								children: /* @__PURE__ */ jsx(IconMoon, { size: 18 })
							}),
							/* @__PURE__ */ jsx("span", {
								className: "flex-1",
								children: "外观深色模式"
							}),
							/* @__PURE__ */ jsx(ThemeSwitch, { className: "w-[124px]" })
						]
					})]
				}, g.title))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] text-ink-4",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/terms",
						className: "hover:text-ink-2",
						children: "使用规则"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/privacy",
						className: "hover:text-ink-2",
						children: "隐私说明"
					}),
					/* @__PURE__ */ jsx("a", {
						href: "/feed.xml",
						className: "hover:text-ink-2",
						children: "RSS"
					}),
					SITE.icp && /* @__PURE__ */ jsx("a", {
						href: "https://beian.miit.gov.cn/",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "hover:text-ink-2",
						children: SITE.icp
					})
				]
			})
		]
	});
});
//#endregion
//#region app/routes/starred.tsx
var starred_exports = /* @__PURE__ */ __exportAll({
	default: () => starred_default,
	headers: () => headers$10,
	meta: () => meta$22
});
/** Shared caches may keep this page for five minutes. */
function headers$10() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
function meta$22() {
	return pageMeta({
		title: "我的收藏",
		description: `保存在这台设备上的 ${SITE.name} 收藏。`,
		path: "/starred",
		noindex: true
	});
}
function reportText(r) {
	const parts = [`新增收藏 ${r.starredAdded} 条`, `已读记录 ${r.readAdded} 条`];
	if (r.starredSkipped || r.readSkipped) parts.push(`超出上限或格式不对而跳过 ${r.starredSkipped + r.readSkipped} 条`);
	if (r.themeApplied) parts.push("已沿用导入的主题");
	if (r.readFailed) parts.push("已读记录没能保存（浏览器存储已满或不可用）");
	return parts.join("，");
}
var starred_default = UNSAFE_withComponentProps(function StarredPage() {
	const starred = useStarred();
	const [mounted, setMounted] = useState(false);
	const [availability, setAvailability] = useState({});
	const [notice, setNotice] = useState(null);
	const fileRef = useRef(null);
	useEffect(() => setMounted(true), []);
	const starredIds = starred.map((s) => s.id).join(",");
	useEffect(() => {
		if (!mounted || !starredIds) return;
		const controller = new AbortController();
		fetch(`/api/site/items/availability?ids=${encodeURIComponent(starredIds)}`, { signal: controller.signal }).then((r) => r.ok ? r.json() : {}).then((data) => {
			if (!controller.signal.aborted) setAvailability(data);
		}).catch(() => {});
		return () => controller.abort();
	}, [mounted, starredIds]);
	const doExport = () => {
		const blob = new Blob([JSON.stringify(exportBundle(), null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `${SITE.mcpPrefix}-local-data-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(a.href);
	};
	const doImport = async (file) => {
		if (!file) return;
		try {
			const report = importBundle(await file.text());
			setNotice({
				kind: report.readFailed ? "error" : "ok",
				text: `导入完成：${reportText(report)}`
			});
		} catch (e) {
			setNotice({
				kind: "error",
				text: e instanceof Error ? e.message : "导入失败"
			});
		}
	};
	const action = "text-[12.5px] text-ink-3 transition-colors hover:text-accent";
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col gap-2 pb-4 pt-5 sm:flex-row sm:items-start sm:justify-between lg:pt-1",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[24px] font-semibold leading-[1.3] text-ink",
					children: "收藏"
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-1.5 text-[13px] text-ink-3",
					children: [
						"本机收藏的 ",
						SITE.name,
						" 内容，适合稍后阅读和回看。"
					]
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-x-4 gap-y-1 sm:pt-1.5",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: action,
							children: "导入文件"
						}),
						mounted && starred.length > 0 && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: doExport,
							className: `${action} inline-flex items-center gap-1`,
							children: [/* @__PURE__ */ jsx(IconDownload, { size: 13 }), " 导出"]
						}),
						/* @__PURE__ */ jsx("input", {
							ref: fileRef,
							type: "file",
							accept: "application/json,.json",
							className: "sr-only",
							onChange: (e) => doImport(e.target.files?.[0])
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "rounded-tile border border-line bg-surface px-4 py-2.5 text-[12.5px] text-ink-3",
				children: "收藏只保存在当前浏览器；清除浏览器数据或换设备后不会同步。"
			}),
			/* @__PURE__ */ jsx(Presence, {
				show: !!notice,
				enter: "anim-notice-in",
				exit: "anim-fade-out",
				duration: 160,
				children: /* @__PURE__ */ jsxs("div", {
					role: "status",
					className: `mt-3 flex items-start justify-between gap-3 rounded-tile px-4 py-2.5 text-[13px] ${notice?.kind === "ok" ? "bg-accent-soft text-accent-ink dark:text-accent" : "bg-hot-soft text-hot"}`,
					children: [notice?.text, /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "关闭",
						onClick: () => setNotice(null),
						className: "shrink-0 opacity-70 hover:opacity-100",
						children: /* @__PURE__ */ jsx(IconClose, { size: 14 })
					})]
				})
			}),
			!mounted ? null : starred.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex flex-col items-center rounded-card border border-dashed border-line-strong px-6 py-12 text-center",
				children: [
					/* @__PURE__ */ jsx(IconBookmark, {
						size: 20,
						className: "text-ink-4"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-[13px] text-ink-3",
						children: "还没有收藏内容。点开任意一条内容，在详情页点击收藏即可添加。"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "mt-4 text-[12.5px] font-medium text-accent hover:text-accent-ink",
						children: "去看精选 →"
					})
				]
			}) : /* @__PURE__ */ jsx("ul", {
				className: "mt-3 lg:space-y-3",
				children: starred.map((s) => {
					const status = availability[s.id];
					const unavailable = status === "unavailable";
					return /* @__PURE__ */ jsxs("li", {
						className: `relative border-b border-line-soft py-4 lg:card lg:px-[18px] lg:py-[15px] ${unavailable ? "opacity-70" : "lg:card-hover"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-[12.5px] text-ink-4",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "min-w-0 truncate text-ink-3",
										children: shortSourceName(s.sourceName)
									}),
									s.publishedAt && /* @__PURE__ */ jsxs("span", {
										className: "num shrink-0",
										children: ["· ", fullDateTime(s.publishedAt)]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "ml-auto hidden shrink-0 sm:inline",
										children: ["收藏于 ", /* @__PURE__ */ jsx("span", {
											className: "num",
											children: fullDateTime(s.savedAt)
										})]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "取消收藏",
										title: "取消收藏",
										onClick: () => removeStar(s.id),
										className: "relative z-10 -my-1 ml-auto grid size-7 shrink-0 place-items-center rounded-full text-ink-4 transition-colors hover:bg-bg-sunk hover:text-ink sm:ml-0",
										children: /* @__PURE__ */ jsx(IconClose, { size: 14 })
									})
								]
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "mt-1.5 text-[16px] font-[650] leading-[1.55] text-ink",
								children: unavailable ? s.title : /* @__PURE__ */ jsx(Link, {
									to: `/items/${s.id}`,
									className: "transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent",
									children: s.title
								})
							}),
							s.summary && /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 line-clamp-2 text-[14px] leading-[1.75] text-ink-3",
								children: s.summary
							}),
							unavailable && /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-[12.5px] text-hot",
								children: "这条内容已不再公开，收藏会保留直到你手动移除。"
							}),
							status === "summary-only" && /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-[12.5px] text-amber-ink",
								children: "应来源方要求，这条内容现在只提供摘要。"
							})
						]
					}, s.id);
				})
			})
		]
	});
});
//#endregion
//#region ../../packages/contracts/src/mcp.ts
var p = SITE.mcpPrefix;
var MCP_TOOL_NAMES = {
	latest: `${p}_get_latest`,
	search: `${p}_search`,
	hot: `${p}_get_hot_topics`,
	story: `${p}_get_story`,
	daily: `${p}_get_daily`
};
Object.values(MCP_TOOL_NAMES).map((name) => ({ name }));
//#endregion
//#region app/components/CodeBlock.tsx
function CopyButton({ text, label = "复制", className = "" }) {
	const [copied, setCopied] = useState(false);
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(text);
			} catch {
				const ta = document.createElement("textarea");
				ta.value = text;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				ta.remove();
			}
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		},
		className: `inline-flex h-7 items-center gap-1 rounded-mark border border-line bg-surface px-2 text-[12px] transition-colors ${copied ? "text-ok" : "text-ink-3 hover:border-line-strong hover:text-ink"} ${className}`,
		"aria-label": copied ? "已复制" : label,
		children: [/* @__PURE__ */ jsx("span", {
			className: copied ? "anim-swap-in" : "",
			children: copied ? /* @__PURE__ */ jsx(IconCheck, { size: 14 }) : /* @__PURE__ */ jsx(IconCopy, { size: 14 })
		}, copied ? "ok" : "copy"), copied ? "已复制" : label]
	});
}
/** Code panel on the page's quiet grey, with a copy button; `lang` is only a label. */
function CodeBlock({ code, lang, title }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "my-4 overflow-hidden rounded-card border border-line bg-surface",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-line-soft px-4 py-2",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[12px] text-ink-4",
				children: title ?? lang ?? ""
			}), /* @__PURE__ */ jsx(CopyButton, { text: code })]
		}), /* @__PURE__ */ jsx("pre", {
			className: "mono overflow-x-auto bg-bg-sunk/60 px-4 py-4 text-[12.5px] leading-[1.75] text-ink-2 dark:bg-bg-muted/40",
			children: /* @__PURE__ */ jsx("code", { children: code })
		})]
	});
}
//#endregion
//#region app/routes/agent.tsx
var agent_exports = /* @__PURE__ */ __exportAll({
	default: () => agent_default,
	headers: () => headers$9,
	loader: () => loader$21,
	meta: () => meta$21
});
/** Shared caches may keep this page for five minutes. */
function headers$9() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
var MCP_VERSION = "2.0.0";
/** The machine-readable entry points, with what each one is for. */
var RESOURCES = [
	[
		"llms.txt",
		"/llms.txt",
		"给大模型读的站点说明"
	],
	[
		"MCP Server",
		"/api/mcp",
		"MCP 客户端的连接地址"
	],
	[
		"OpenAPI 3.1",
		"/openapi-v1.json",
		"REST API v1 的完整定义"
	]
];
var TABS = [
	{
		key: "mcp",
		label: "MCP"
	},
	{
		key: "rss",
		label: "RSS"
	},
	{
		key: "api",
		label: "REST API"
	}
];
async function loader$21({ request }) {
	const tab = new URL(request.url).searchParams.get("tab");
	let healthy = true;
	try {
		healthy = (await fetch(`${process.env.API_BASE_URL || "http://127.0.0.1:3001"}/api/health`, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(3e3)]) })).ok;
	} catch {
		healthy = false;
	}
	return {
		tab: TABS.some((t) => t.key === tab) ? tab : "mcp",
		healthy,
		base: siteUrl()
	};
}
function meta$21({ loaderData }) {
	const path = listPath("/agent", { tab: loaderData && loaderData.tab !== "mcp" ? loaderData.tab : null });
	return pageMeta({
		title: "Agent 接入",
		description: `让 Agent 直接使用 ${SITE.name}：MCP、RSS、REST API v1，匿名只读。`,
		path,
		image: "/og/pages/agent.png"
	});
}
function Section({ title, children, id }) {
	return /* @__PURE__ */ jsxs("section", {
		id,
		className: "mt-10 scroll-mt-24",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "mb-3 text-[16px] font-bold text-ink",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "text-[13.5px] leading-[1.85] text-ink-2",
			children
		})]
	});
}
function Bullets({ items }) {
	return /* @__PURE__ */ jsx("ul", {
		className: "space-y-1.5",
		children: items.map((it, i) => /* @__PURE__ */ jsxs("li", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ jsx("span", { className: "mt-[11px] size-1 shrink-0 rounded-full bg-ink-4" }), /* @__PURE__ */ jsx("span", { children: it })]
		}, i))
	});
}
function Mono({ children }) {
	return /* @__PURE__ */ jsx("code", {
		className: "mono rounded-mark bg-bg-sunk px-1.5 py-0.5 text-[0.88em] text-ink",
		children
	});
}
function McpTab({ base }) {
	const url = `${base}/api/mcp`;
	const name = SITE.mcpPrefix;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("h2", {
			className: "text-[20px] font-bold text-ink",
			children: "加一个地址，Agent 直接调用五个工具"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-2 text-[14.5px] text-ink-3",
			children: "适合支持远程 MCP 的 Agent 与开发工具。标准 Streamable HTTP，匿名只读，不需要 token；工具返回简洁文字与同一份结构化数据。"
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-6 flex items-center gap-2 rounded-card border border-line bg-surface p-3",
			children: [/* @__PURE__ */ jsx("code", {
				className: "min-w-0 flex-1 truncate font-mono text-[13px] text-ink",
				children: url
			}), /* @__PURE__ */ jsx(CopyButton, {
				text: url,
				className: "!text-ink-3"
			})]
		}),
		/* @__PURE__ */ jsx(CodeBlock, {
			title: "通用 MCP 配置",
			lang: "json",
			code: JSON.stringify({ mcpServers: { [name]: {
				type: "http",
				url
			} } }, null, 2)
		}),
		/* @__PURE__ */ jsx(CodeBlock, {
			lang: "bash",
			code: `# Claude Code\nclaude mcp add --transport http ${name} '${url}'\n# Codex\ncodex mcp add ${name} --url '${url}'`
		}),
		/* @__PURE__ */ jsxs(Section, {
			title: "连上后应看到这五个工具",
			children: [/* @__PURE__ */ jsx(Bullets, { items: [
				/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Mono, { children: MCP_TOOL_NAMES.latest }), "：过去 24 小时或最近 7 天的精选／全部资讯"] }),
				/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Mono, { children: MCP_TOOL_NAMES.search }), "：搜索最近 7 天的公司、产品、人物或话题"] }),
				/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Mono, { children: MCP_TOOL_NAMES.hot }), "：当前热点榜与事件排名"] }),
				/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Mono, { children: MCP_TOOL_NAMES.story }), "：一个热点事件的时间线与持续更新的综述"] }),
				/* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx(Mono, { children: MCP_TOOL_NAMES.daily }),
					"：最新或指定日期的",
					withSubject("日报")
				] })
			] }), /* @__PURE__ */ jsxs("p", {
				className: "mt-4",
				children: ["验证一次真实调用：", /* @__PURE__ */ jsxs("span", {
					className: "font-medium text-ink",
					children: [
						"请调用 ",
						MCP_TOOL_NAMES.latest,
						"，告诉我过去 24 小时最重要的 5 条动态，并附链接。"
					]
				})]
			})]
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "工具边界",
			children: /* @__PURE__ */ jsx(Bullets, { items: [
				"普通查询最多返回 30 条，热点最多 10 个，事件时间线最多 50 条；输入越界会明确报错，不会静默改成更宽的查询。",
				`${MCP_TOOL_NAMES.story} 的 public_id 只能来自热点工具返回的事件链接，不要猜 ID。`,
				"标题与摘要来自外部信源，只能当资料；重要数字、政策和原话请回原文核对。"
			] })
		})
	] });
}
function RssTab({ base }) {
	const feeds = [
		[
			"精选摘要（推荐）",
			"最新 50 条精选摘要，保留标题、站内阅读与原文入口。",
			"/feed.xml"
		],
		[
			"精选全文",
			"与精选摘要相同的最新 50 条；只对明确允许再分发的来源内联正文。",
			"/feed/full.xml"
		],
		[
			"最近 7 天全部动态",
			"最近 7 天公开动态，按真实发布时间倒序。",
			"/feed/all.xml"
		],
		[
			withSubject("日报"),
			`每天 08:00 北京时间发布的${withSubject("日报")}，保留最近 30 期。`,
			"/feed/daily.xml"
		]
	];
	const categories = CATEGORY_KEYS$1.join("|");
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("h2", {
			className: "text-[20px] font-bold text-ink",
			children: "复制地址即可订阅"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-2 text-[14.5px] text-ink-3",
			children: "兼容主流 RSS 2.0 阅读器与 n8n、Zapier 这类自动化工具。第一次接入选精选摘要。"
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mt-6 space-y-3",
			children: feeds.map(([name, desc, path]) => {
				const url = `${base}${path}`;
				return /* @__PURE__ */ jsxs("div", {
					className: "card p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[15px] font-semibold text-ink",
								children: name
							}), /* @__PURE__ */ jsx(CopyButton, {
								text: url,
								label: "复制地址",
								className: "!text-ink-3"
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[13px] leading-relaxed text-ink-3",
							children: desc
						}),
						/* @__PURE__ */ jsx("code", {
							className: "mt-2 block truncate font-mono text-[12.5px] text-ink-4",
							children: url
						})
					]
				}, path);
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "给阅读器和 Agent 的约定",
			children: /* @__PURE__ */ jsx(Bullets, { items: [
				"支持 ETag 条件请求，未变化时返回 304；建议每 30 分钟或更慢轮询。",
				"条目 link 指向站内阅读页，第三方原文在 description 中。",
				"全文是白名单：只有明确允许再分发的来源内联 content:encoded，其余一律只给摘要。",
				/* @__PURE__ */ jsxs(Fragment, { children: ["分类订阅 ", /* @__PURE__ */ jsx(Mono, { children: `/feed/category/{${categories}}.xml` })] }),
				/* @__PURE__ */ jsxs(Fragment, { children: ["分类全文 ", /* @__PURE__ */ jsx(Mono, { children: `/feed/full/category/{${categories}}.xml` })] })
			] })
		})
	] });
}
function ApiTab({ base }) {
	const endpoints = [
		["/api/v1/items", "精选或最近 7 天公开动态；支持分类、时间和关键词"],
		...FEATURES.codexResetMonitor ? [["/api/v1/codex-resets/recent", "Codex 重置监控（轮询用）：最近 7 天与尚未落地的预告"], ["/api/v1/codex-resets", "Codex 重置与发卡的完整历史"]] : [],
		["/api/v1/hot-topics", "当前热点榜与事件排名"],
		["/api/v1/stories/{publicId}", "事件详情：报道时间线、综述与关联事件"],
		["/api/v1/dailies", `${withSubject("日报")}日期索引`],
		["/api/v1/dailies/latest", `最新${withSubject("日报")}`],
		["/api/v1/dailies/{date}", `指定日期的${withSubject("日报")}`],
		["/api/v1/selected/snapshot", "当前全部精选；首次完整同步（分页）"],
		["/api/v1/selected/changes", "精选的新增、修改和撤选；之后只取变化"]
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("h2", {
			className: "text-[20px] font-bold text-ink",
			children: "匿名 GET，不需要 token"
		}),
		/* @__PURE__ */ jsxs("p", {
			className: "mt-2 text-[14.5px] text-ink-3",
			children: [
				"浏览器跨域、curl 和默认 HTTP SDK 都可以直接用。临时查最近内容用 items；长期维护全部精选用一次快照加增量游标。字段与错误码以 ",
				/* @__PURE__ */ jsx("a", {
					href: "/openapi-v1.json",
					className: "text-accent hover:underline",
					children: "OpenAPI 3.1"
				}),
				" 为准。"
			]
		}),
		/* @__PURE__ */ jsx(CodeBlock, {
			title: "第一个请求",
			lang: "bash",
			code: `curl '${base}/api/v1/items?mode=selected&window=24h&limit=20'`
		}),
		/* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto rounded-card border border-line bg-surface",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full min-w-[560px] text-left text-[13.5px]",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-bg-sunk text-ink-3",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "px-3 py-2 font-medium",
							children: "方法"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-3 py-2 font-medium",
							children: "路径"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-3 py-2 font-medium",
							children: "说明"
						})
					] })
				}), /* @__PURE__ */ jsx("tbody", {
					className: "divide-y divide-line",
					children: endpoints.map(([p, d]) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-3 py-2 font-mono text-[12px] text-ok",
							children: "GET"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-3 py-2 font-mono text-[12.5px] text-ink",
							children: p
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-3 py-2 text-ink-2",
							children: d
						})
					] }, p))
				})]
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "先知道这几件事",
			children: /* @__PURE__ */ jsx(Bullets, { items: [
				"不传 mode 等同 selected（精选）；只有明确需要全部公开动态才用 all。",
				"完整精选不限 7 天：snapshot 首次拿全，changes 只取变化；items 只看最近 7 天。",
				"items 不带正文：返回摘要、推荐理由、站内阅读页与原文链接。",
				"没有推送通道：按响应的 s-maxage 带 If-None-Match 轮询，没变化时是 304。",
				"错误是 Problem JSON；反馈时附上 requestId 即可定位。"
			] })
		}),
		/* @__PURE__ */ jsxs(Section, {
			title: "维护全部精选：一次快照，之后只拉变化",
			children: [/* @__PURE__ */ jsx(CodeBlock, {
				lang: "bash",
				code: `# 首次：分页拿当前全部精选，保存第一页响应里的 cursor（逐页相同）\ncurl '${base}/api/v1/selected/snapshot?fields=minimal&limit=500'\n# hasMore 为 true 就带 nextPage 继续翻\ncurl '${base}/api/v1/selected/snapshot?fields=minimal&limit=500&page=<上一页的 nextPage>'\n# 翻完之后：原样回传 cursor，只拿新增、修改和撤选\ncurl '${base}/api/v1/selected/changes?cursor=<第一页响应的 cursor>&limit=100'`
			}), /* @__PURE__ */ jsx("p", { children: "每页成功应用后再保存新 cursor。返回 409 snapshot_required 时重新取一次快照即可，接口不会静默漏数。" })]
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "错误与恢复",
			id: "agent-api-recovery",
			children: /* @__PURE__ */ jsx(Bullets, { items: [
				"400：参数不合法；按 OpenAPI 修正，不要自动改成更宽的查询。",
				"409 snapshot_required：增量游标无法安全续传，重新取一次完整快照。",
				"429：遵守 Retry-After，不要增加并发重试。",
				"5xx：指数退避，并使用上次成功的缓存。"
			] })
		})
	] });
}
var agent_default = UNSAFE_withComponentProps(function AgentPage() {
	const { tab: initialTab, healthy, base } = useLoaderData();
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [tab, setTab] = useState(initialTab);
	useEffect(() => setTab(params.get("tab") || "mcp"), [params]);
	const select = (key) => {
		setTab(key);
		navigate(key === "mcp" ? "/agent" : `/agent?tab=${key}`, {
			replace: true,
			preventScrollReset: true
		});
	};
	const pill = "inline-flex h-6 items-center rounded-mark border border-line bg-surface px-2 text-[11.5px] text-ink-3";
	const aside = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AsideCard, {
		title: "接入资源",
		className: "hidden lg:block",
		children: /* @__PURE__ */ jsx("nav", {
			"aria-label": "接入资源",
			className: "-mx-2 -mb-1",
			children: RESOURCES.map(([l, h, note]) => /* @__PURE__ */ jsxs("a", {
				href: h,
				className: "group flex items-start gap-2 rounded-control px-2 py-2 transition-colors hover:bg-bg-sunk",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block text-[13.5px] text-ink-2 group-hover:text-ink",
						children: l
					}), /* @__PURE__ */ jsx("span", {
						className: "mt-0.5 block text-[12px] text-ink-4",
						children: note
					})]
				}), /* @__PURE__ */ jsx(IconArrowUpRight, {
					size: 13,
					className: "mt-1 shrink-0 text-ink-4"
				})]
			}, h))
		})
	}), /* @__PURE__ */ jsxs(AsideCard, {
		title: "没接上？",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[13px] leading-[1.75] text-ink-3",
			children: "把客户端、版本和报错写在反馈页，别发 token 或本地文件。"
		}), /* @__PURE__ */ jsxs(Link, {
			to: "/feedback",
			prefetch: "intent",
			className: "mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline",
			children: ["去反馈 ", /* @__PURE__ */ jsx(IconChevronRight, { size: 14 })]
		})]
	})] });
	return /* @__PURE__ */ jsxs(ReadingLayout, {
		aside,
		children: [
			/* @__PURE__ */ jsxs("header", { children: [
				/* @__PURE__ */ jsxs("h1", {
					className: "text-[24px] font-semibold leading-[1.3] text-ink",
					children: ["让 Agent 直接使用 ", SITE.name]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-[13px] text-ink-3",
					children: "三条接入路径都是匿名只读、无需 API Key：MCP、RSS、REST API v1。"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-3.5 flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: pill,
							children: "匿名只读"
						}),
						/* @__PURE__ */ jsx("span", {
							className: `${pill} mono`,
							children: "API v1"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: `${pill} mono`,
							children: ["MCP ", MCP_VERSION]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: `${pill} gap-1.5 ${healthy ? "text-ok" : "text-hot"}`,
							children: [/* @__PURE__ */ jsx("span", { className: `size-1.5 rounded-full ${healthy ? "bg-ok" : "bg-hot"}` }), healthy ? "服务正常" : "服务异常"]
						})
					]
				})
			] }),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] lg:hidden",
				children: RESOURCES.map(([l, h]) => /* @__PURE__ */ jsxs("a", {
					href: h,
					className: "inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-accent",
					children: [
						l,
						" ",
						/* @__PURE__ */ jsx(IconArrowUpRight, {
							size: 12,
							className: "text-ink-4"
						})
					]
				}, h))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky top-0 z-20 -mx-4 mt-7 bg-bg/90 px-4 py-2 backdrop-blur-md lg:mx-0 lg:px-0",
				children: /* @__PURE__ */ jsx(PillTabs, {
					layoutId: "agent-tab",
					label: "接入方式",
					active: tab,
					onSelect: (k) => select(k),
					items: TABS.map((t) => ({
						key: t.key,
						label: t.label
					}))
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-7",
				role: "tabpanel",
				children: [
					tab === "mcp" && /* @__PURE__ */ jsx(McpTab, { base }),
					tab === "rss" && /* @__PURE__ */ jsx(RssTab, { base }),
					tab === "api" && /* @__PURE__ */ jsx(ApiTab, { base })
				]
			})
		]
	});
});
//#endregion
//#region app/features/monitor/format.ts
function bjDate(iso) {
	return iso.slice(0, 10);
}
function bjTime(iso) {
	return iso.slice(11, 16);
}
function monthDay(date) {
	return `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
}
/** 今天 / 明天 / 昨天 / 9月12日 */
function dayWord(date, today) {
	if (date === today) return "今天";
	if (date === addDays(today, 1)) return "明天";
	if (date === addDays(today, -1)) return "昨天";
	return monthDay(date);
}
function windowText(from, through, today) {
	if (!from) return "";
	const a = `${dayWord(bjDate(from), today)} ${bjTime(from)}`;
	if (!through || through === from) return a;
	return bjDate(from) === bjDate(through) ? `${a}–${bjTime(through)}` : `${a}–${dayWord(bjDate(through), today)} ${bjTime(through)}`;
}
function durationText(ms) {
	const minutes = Math.max(1, Math.round(ms / 6e4));
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (!h) return `${m} 分钟`;
	return m ? `${h} 小时 ${m} 分` : `${h} 小时`;
}
/** "9/26 21:40" */
function stamp(iso) {
	if (!iso) return "—";
	return `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))} ${bjTime(iso)}`;
}
function typeName(type) {
	return type === "reset_credit" ? "重置卡发放" : "Codex 额度重置";
}
//#endregion
//#region app/features/monitor/PostCard.tsx
function Context({ c, original }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-3 border-l-2 border-line-strong pl-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "text-[12px] text-ink-4",
				children: [
					c.relation === "quote" ? "引用" : "回复",
					" @",
					c.author
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-0.5 whitespace-pre-line text-[13px] leading-[1.75] text-ink-3",
				children: original ? c.originalText : c.text ?? c.originalText
			}),
			original && c.text && /* @__PURE__ */ jsx("p", {
				className: "mt-1 whitespace-pre-line text-[12.5px] leading-[1.7] text-ink-4",
				children: c.text
			})
		]
	});
}
/** A Tibo post: Chinese translation first, context below, the English original one tap away. */
function PostCard({ post, stage, avatar, compact = false }) {
	const [showOriginal, setShowOriginal] = useState(false);
	const hasTranslation = !!post.translation;
	return /* @__PURE__ */ jsxs("article", {
		className: `min-w-0 rounded-card border border-line-strong bg-surface ${compact ? "px-4 py-3" : "p-4 sm:px-6"}`,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ jsx(SourceAvatar, {
						name: "Tibo",
						avatarUrl: avatar,
						size: 36
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "min-w-0 flex-1 leading-tight",
						children: [/* @__PURE__ */ jsx("strong", {
							className: "block text-[13px] font-semibold text-ink",
							children: "Tibo"
						}), /* @__PURE__ */ jsx("small", {
							className: "block text-[12px] text-ink-4",
							children: "@thsottiaux"
						})]
					}),
					stage && /* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-[rgba(28,39,51,0.04)] px-2 py-0.5 text-[12px] text-ink-4 dark:bg-white/[0.06]",
						children: stage
					})
				]
			}),
			/* @__PURE__ */ jsx("blockquote", {
				className: `mt-3 whitespace-pre-wrap text-ink [overflow-wrap:anywhere] ${compact ? "text-[15px] leading-[1.75]" : "text-[15px] leading-[1.75] sm:text-[18px]"}`,
				children: hasTranslation ? post.translation : post.original
			}),
			!hasTranslation && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[11.5px] text-ink-4",
				children: "暂无核对过的完整译文，显示原文。"
			}),
			post.context.map((c) => /* @__PURE__ */ jsx(Context, {
				c,
				original: false
			}, c.id)),
			/* @__PURE__ */ jsxs("footer", {
				className: "mt-3 flex items-center justify-between gap-3 text-[12px] text-ink-4",
				children: [/* @__PURE__ */ jsx("time", {
					className: "num",
					dateTime: post.publishedAt ?? void 0,
					children: stamp(post.publishedAt)
				}), /* @__PURE__ */ jsxs("a", {
					href: post.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-0.5 text-accent transition-colors hover:text-accent-ink",
					children: ["在 X 查看 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 12 })]
				})]
			}),
			hasTranslation && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setShowOriginal((v) => !v),
				"aria-expanded": showOriginal,
				className: "mt-3 flex w-full items-center gap-1 border-t border-line pt-3 text-left text-[12px] text-ink-4 transition-colors hover:text-ink-2",
				children: [/* @__PURE__ */ jsx(IconChevronRight, {
					size: 12,
					className: `transition-transform duration-200 ${showOriginal ? "rotate-90" : ""}`
				}), "英文原文"]
			}), /* @__PURE__ */ jsx(Collapse, {
				open: showOriginal,
				duration: 200,
				children: /* @__PURE__ */ jsxs("div", {
					className: "pt-2",
					children: [/* @__PURE__ */ jsx("blockquote", {
						className: "whitespace-pre-line text-[13px] leading-[1.75] text-ink-3",
						lang: "en",
						children: post.original
					}), post.context.map((c) => /* @__PURE__ */ jsx(Context, {
						c,
						original: true
					}, c.id))]
				})
			})] })
		]
	});
}
//#endregion
//#region app/features/monitor/ResetCalendar.tsx
var CELL = {
	confirmed: "bg-cal-confirmed border-transparent",
	likely: "bg-surface border-dashed border-ok-ink/55",
	pending: "bg-cal-announced border-transparent"
};
var CHIP = {
	confirmed: "bg-ok-ink/[0.14] text-ok-ink",
	likely: "text-ok-ink",
	pending: "bg-amber-ink/[0.16] text-amber-ink"
};
var STRENGTH = {
	confirmed: 3,
	pending: 2,
	likely: 1
};
var WEEKDAYS = [
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"日"
];
function monthOf(date) {
	return date.slice(0, 7);
}
function shiftMonth(month, delta) {
	const [y, m] = month.split("-").map(Number);
	const d = new Date(Date.UTC(y, m - 1 + delta, 1));
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
/** Monday-first 6-week grid covering `month`. */
function gridDays(month) {
	const first = `${month}-01`;
	const start = addDays(first, -(((/* @__PURE__ */ new Date(`${first}T00:00:00Z`)).getUTCDay() + 6) % 7));
	const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
	return days.slice(35).every((d) => monthOf(d) !== month) ? days.slice(0, 35) : days;
}
function statusChip(e, now) {
	const s = e.presentation?.status ?? (e.status === "confirmed" ? "confirmed" : "announced");
	if (s === "confirmed") return {
		text: e.confirmationBasis === "receipt_review" ? "已核实到账" : "Tibo 已确认",
		tone: "text-ok-ink"
	};
	if (s === "likely_completed") return {
		text: "应已生效 · 未见确认帖",
		tone: "text-ok-ink"
	};
	if (s === "expired_unconfirmed") {
		const through = (e.estimate ?? e.schedule)?.through;
		return {
			text: through ? `晚于预计 ${durationText(now - Date.parse(through))} · 等待确认` : "晚于预计 · 等待确认",
			tone: "text-amber-ink"
		};
	}
	if (s === "in_progress") return {
		text: "正在发放",
		tone: "text-amber-ink"
	};
	return {
		text: "已宣布 · 等待生效",
		tone: "text-amber-ink"
	};
}
function ResetCalendar({ marks, events, today, historyFrom, now, avatar, selectedDate, version }) {
	const latest = useMemo(() => [...marks].sort((a, b) => a.date < b.date ? 1 : -1)[0]?.date ?? today, [marks, today]);
	const initial = selectedDate;
	const [selected, setSelected] = useState(initial);
	const [month, setMonth] = useState(monthOf(initial));
	const firstMonth = useRef(month);
	if (month !== firstMonth.current) firstMonth.current = null;
	const gridRef = useRef(null);
	const minMonth = historyFrom ? monthOf(historyFrom.slice(0, 10)) : "2026-06";
	const maxMonth = monthOf(today > latest ? today : latest);
	const byDay = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const m of marks) map.set(m.date, [...map.get(m.date) ?? [], m]);
		return map;
	}, [marks]);
	const [daysLoaded, setDaysLoaded] = useState({ [selectedDate]: events });
	const [failed, setFailed] = useState(false);
	useEffect(() => setDaysLoaded({ [selectedDate]: events }), [
		version,
		selectedDate,
		events
	]);
	const dayEvents = daysLoaded[selected] ?? [];
	const eventById = useMemo(() => new Map(dayEvents.map((e) => [e.id, e])), [dayEvents]);
	useEffect(() => {
		setFailed(false);
		if (daysLoaded[selected] || !marks.some((m) => m.date === selected)) return;
		const controller = new AbortController();
		fetch(`/api/site/codex-reset/days/${selected}`, {
			signal: controller.signal,
			cache: "no-store"
		}).then((r) => {
			if (!r.ok) throw new Error("day unavailable");
			return r.json();
		}).then((data) => {
			if (data.version !== version) throw new Error("monitor version changed");
			if (!controller.signal.aborted) setDaysLoaded((old) => ({
				...old,
				[selected]: data.events
			}));
		}).catch(() => {
			if (!controller.signal.aborted) setFailed(true);
		});
		return () => controller.abort();
	}, [
		selected,
		version,
		marks,
		daysLoaded
	]);
	const inMonth = marks.filter((m) => monthOf(m.date) === month);
	const summary = [
		[inMonth.filter((m) => m.type === "direct_reset" && m.state !== "pending").length, "次额度重置"],
		[inMonth.filter((m) => m.type === "reset_credit" && m.state !== "pending").length, "次发重置卡"],
		[inMonth.filter((m) => m.state === "pending").length, "次等待生效"]
	].filter(([n]) => n > 0);
	const days = gridDays(month);
	const selectedMarks = byDay.get(selected) ?? [];
	const select = (d) => {
		setSelected(d);
		if (monthOf(d) !== month) setMonth(monthOf(d));
	};
	const onKey = (e) => {
		const step = {
			ArrowLeft: -1,
			ArrowRight: 1,
			ArrowUp: -7,
			ArrowDown: 7
		}[e.key];
		if (!step) return;
		e.preventDefault();
		const next = addDays(selected, step);
		if (monthOf(next) < minMonth || monthOf(next) > maxMonth) return;
		select(next);
		requestAnimationFrame(() => gridRef.current?.querySelector(`[data-day="${next}"]`)?.focus());
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-8",
		"aria-labelledby": "calendar-title",
		children: [
			/* @__PURE__ */ jsx("h2", {
				id: "calendar-title",
				className: "text-[18px] font-bold text-ink",
				children: "重置日历"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[12.5px] text-ink-3",
				children: "点日期查看当天的重置、发卡和 Tibo 原帖。"
			}),
			/* @__PURE__ */ jsx("noscript", { children: /* @__PURE__ */ jsx("nav", {
				"aria-label": "历史重置记录",
				children: [...new Set(marks.map((m) => m.date))].sort().reverse().map((d) => /* @__PURE__ */ jsx("a", {
					href: `/codex-reset/history/${d}`,
					className: "mr-3 inline-block",
					children: d
				}, d))
			}) }),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 overflow-hidden rounded-card border border-line-strong bg-surface lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,1fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,1fr)]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-3 py-[18px] sm:p-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "num text-[18px] font-[650] text-ink",
								children: [
									month.slice(0, 4),
									" 年 ",
									Number(month.slice(5)),
									" 月"
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-0.5",
								children: [
									month !== monthOf(latest) && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => select(latest),
										className: "mr-1 h-8 rounded-full px-3 text-[12px] text-ink-3 transition-colors hover:bg-bg-sunk hover:text-ink",
										children: "回到最近"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMonth(shiftMonth(month, -1)),
										disabled: month <= minMonth,
										"aria-label": "上个月",
										className: "grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-bg-sunk hover:text-ink disabled:opacity-35",
										children: /* @__PURE__ */ jsx(IconChevronRight, {
											size: 15,
											className: "rotate-180"
										})
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMonth(shiftMonth(month, 1)),
										disabled: month >= maxMonth,
										"aria-label": "下个月",
										className: "grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-bg-sunk hover:text-ink disabled:opacity-35",
										children: /* @__PURE__ */ jsx(IconChevronRight, { size: 15 })
									})
								]
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "num mb-4 mt-3 text-[12px] text-ink-4",
							children: summary.length ? /* @__PURE__ */ jsxs(Fragment, { children: [
								"本月",
								" ",
								summary.map(([n, t], i) => /* @__PURE__ */ jsxs("span", { children: [
									i > 0 && " · ",
									/* @__PURE__ */ jsx("strong", {
										className: "font-semibold text-ink-3",
										children: n
									}),
									" ",
									t
								] }, t))
							] }) : "本月没有记录"
						}),
						/* @__PURE__ */ jsxs("div", {
							ref: gridRef,
							role: "grid",
							"aria-label": `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月重置记录，方向键可切换日期`,
							onKeyDown: onKey,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-[26px] grid-cols-7 items-center gap-[3px] text-center text-[12px] text-ink-4 sm:gap-1",
									role: "row",
									children: WEEKDAYS.map((w) => /* @__PURE__ */ jsx("span", {
										role: "columnheader",
										children: w
									}, w))
								}),
								/* @__PURE__ */ jsx("div", {
									className: `mt-1 grid grid-cols-7 gap-[3px] sm:gap-1 ${firstMonth.current === null ? "anim-slide-in-x" : ""}`,
									role: "rowgroup",
									children: days.map((d) => {
										const ms = byDay.get(d) ?? [];
										const top = [...ms].sort((a, b) => STRENGTH[b.state] - STRENGTH[a.state])[0];
										const other = monthOf(d) !== month;
										const isSel = d === selected;
										const future = d > today;
										return /* @__PURE__ */ jsxs("a", {
											href: `/codex-reset/history/${d}`,
											role: "gridcell",
											"data-day": d,
											tabIndex: isSel ? 0 : -1,
											"aria-selected": isSel,
											"aria-label": `${d}${d === today ? "，今天" : ""}${ms.length ? `，${ms.map((m) => m.label).join("、")}` : ""}`,
											onClick: (e) => {
												if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
													e.preventDefault();
													select(d);
												}
											},
											className: `relative flex min-h-[62px] flex-col items-center justify-start gap-1.5 rounded-control border px-0 pb-1.5 pt-2.5 transition-[background-color,border-color] duration-150 sm:min-h-[70px] sm:rounded-tile sm:px-0.5 ${top ? CELL[top.state] : "border-transparent bg-cal-plain hover:border-line-strong hover:bg-bg-sunk"} ${isSel ? "!border-[1.5px] !border-solid !border-accent shadow-[inset_0_0_0_1px_var(--surface)]" : ""} ${other ? "opacity-[0.38]" : ""}`,
											children: [/* @__PURE__ */ jsxs("span", {
												className: `num relative text-[13px] font-medium leading-5 ${future && !top ? "text-ink-4" : "text-ink"}`,
												children: [Number(d.slice(8)), d === today && /* @__PURE__ */ jsx("span", {
													className: "absolute -right-2 top-0.5 size-1 rounded-full bg-accent",
													"aria-hidden": "true"
												})]
											}), top && /* @__PURE__ */ jsxs("span", {
												className: `max-w-full truncate rounded-full px-[3px] text-[10px] font-medium leading-4 sm:px-1.5 sm:text-[11px] ${CHIP[top.state]}`,
												children: [top.label, ms.length > 1 ? ` +${ms.length - 1}` : ""]
											})]
										}, d);
									})
								}, month),
								/* @__PURE__ */ jsxs("ul", {
									className: "mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-4",
									children: [
										/* @__PURE__ */ jsxs("li", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "size-3 rounded-mark bg-cal-key-confirmed",
												"aria-hidden": "true"
											}), "已生效（官方确认或到账核实）"]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "size-3 rounded-mark border border-dashed border-ok-ink",
												"aria-hidden": "true"
											}), "应已生效（按预计时间，未见确认帖）"]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "size-3 rounded-mark bg-cal-key-announced",
												"aria-hidden": "true"
											}), "已宣布，等待生效"]
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("aside", {
					className: "border-t border-line-strong bg-panel-quiet px-4 py-5 lg:border-l lg:border-t-0 lg:border-line lg:p-6",
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-baseline justify-between gap-3 border-b border-line pb-4",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-[15px] font-[650] text-ink",
								children: [
									Number(selected.slice(5, 7)),
									" 月 ",
									Number(selected.slice(8)),
									" 日",
									dayWord(selected, today) !== monthDay(selected) && /* @__PURE__ */ jsx("span", {
										className: "ml-2 text-[12px] font-normal text-ink-4",
										children: dayWord(selected, today)
									})
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "num text-[12px] text-ink-4",
								children: selected.slice(0, 4)
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "sr-only",
							children: [
								"已选择 ",
								selected,
								"，",
								selectedMarks.length,
								" 条记录。"
							]
						}),
						selectedMarks.length > 0 && !daysLoaded[selected] && /* @__PURE__ */ jsx("p", {
							className: "text-[13px] text-ink-3",
							children: failed ? /* @__PURE__ */ jsx("a", {
								href: `/codex-reset/history/${selected}`,
								className: "text-accent",
								children: "重新读取当天记录"
							}) : "正在读取当天记录…"
						}),
						selectedMarks.map((m, i) => {
							const e = eventById.get(m.eventId);
							if (!e) return null;
							const chip = statusChip(e, now);
							const window = e.estimate ?? e.schedule;
							const post = e.posts[0];
							return /* @__PURE__ */ jsxs("article", {
								className: i > 0 ? "mt-6 border-t border-line pt-6" : "",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: `inline-flex items-center gap-1 text-[12px] font-medium ${chip.tone}`,
										children: [/* @__PURE__ */ jsx("span", {
											className: "cr-dot !size-1.5 !shadow-none",
											"aria-hidden": "true"
										}), chip.text]
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "mb-1 mt-2 text-[15px] font-bold leading-[1.6] text-ink",
										children: e.type === "reset_credit" ? "重置卡发放" : e.displayLabel === "额度重置" ? "Codex 额度重置" : e.displayLabel
									}),
									e.confirmedAt && /* @__PURE__ */ jsxs("p", {
										className: "num mb-1 text-[13px] font-medium text-ink",
										children: [
											"确认帖 ",
											stamp(e.confirmedAt),
											/* @__PURE__ */ jsx("span", {
												className: "ml-1 font-normal text-ink-4",
												children: "（不是精确到账时间）"
											})
										]
									}),
									!e.confirmedAt && e.occurredOn && /* @__PURE__ */ jsxs("p", {
										className: "num mb-1 text-[13px] font-medium text-ink",
										children: ["核实到账 ", monthDay(e.occurredOn)]
									}),
									window && e.status !== "confirmed" && /* @__PURE__ */ jsxs("p", {
										className: "mb-1 text-[13px] font-medium leading-[1.5] text-ink",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "num",
											children: ["预计 ", windowText(window.from, window.through, today)]
										}), e.estimate?.reason && /* @__PURE__ */ jsx("span", {
											className: "mt-0.5 block text-[12.5px] font-normal leading-[1.6] text-ink-3",
											children: e.estimate.reason
										})]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-[12px] leading-[1.7] text-ink-4",
										children: [
											"适用范围：",
											e.presentation?.audienceZh ?? e.presentation?.scopeLabel ?? "原帖未说明适用人群",
											e.presentation?.productsZh ? ` · ${e.presentation.productsZh}` : ""
										]
									}),
									post && /* @__PURE__ */ jsx("div", {
										className: "mb-2 mt-3",
										children: /* @__PURE__ */ jsx(PostCard, {
											compact: true,
											avatar,
											stage: post.stage,
											post: {
												id: post.id,
												publishedAt: post.publishedAt,
												translation: post.fullText ?? post.text,
												original: post.fullOriginalText ?? post.originalText,
												context: post.context,
												url: post.url
											}
										})
									}),
									e.posts.length > 1 && /* @__PURE__ */ jsxs("p", {
										className: "text-[12px] text-ink-4",
										children: [
											"这件事共有 ",
											e.posts.length,
											" 条相关原帖",
											bjDate(e.posts.at(-1).publishedAt ?? "") ? `，最早 ${stamp(e.posts.at(-1).publishedAt)}` : "",
											"。"
										]
									})
								]
							}, m.eventId);
						}),
						!selectedMarks.length && /* @__PURE__ */ jsxs("div", {
							className: "flex min-h-[300px] flex-col items-start justify-center",
							children: [
								/* @__PURE__ */ jsxs("svg", {
									width: "32",
									height: "32",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									className: "text-ink-4 opacity-60",
									"aria-hidden": "true",
									children: [/* @__PURE__ */ jsx("rect", {
										x: "3.5",
										y: "5",
										width: "17",
										height: "15",
										rx: "2.5"
									}), /* @__PURE__ */ jsx("path", { d: "M3.5 9.5h17M8 3v4M16 3v4" })]
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "mt-4 text-[15px] font-semibold text-ink",
									children: "这一天没有记录"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mb-5 mt-3 max-w-[280px] text-[12px] leading-[1.8] text-ink-4",
									children: "这天没有 Tibo 宣布或确认的重置，也没有发放重置卡。点日历上带标签的日期查看记录。"
								})
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region app/routes/codex-reset.tsx
var codex_reset_exports = /* @__PURE__ */ __exportAll({
	default: () => codex_reset_default,
	headers: () => headers$8,
	loader: () => loader$20,
	meta: () => meta$20
});
async function loader$20({ request, params }) {
	const [data, day] = await Promise.all([loadOr404("/api/site/codex-reset", { signal: request.signal }), params.date ? loadOr404(`/api/site/codex-reset/days/${encodeURIComponent(params.date)}`, { signal: request.signal }) : null]);
	return {
		...data,
		...day ? {
			selectedDate: day.date,
			events: day.events
		} : {},
		serverNow: Date.now()
	};
}
function meta$20() {
	return pageMeta({
		title: "Tibo重置监控",
		description: "跟踪 Tibo 公布的 Codex 额度重置与重置卡发放：推算的北京时间生效窗口、适用范围、中文原帖与历史日历。",
		path: "/codex-reset",
		image: "/og/pages/codex-reset.png"
	});
}
function headers$8() {
	return { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60" };
}
var POLL_MS = 6e4;
/** Low-frequency version check while the page is in the foreground. */
function useVersionPolling(version) {
	const revalidator = useRevalidator();
	useEffect(() => {
		let stopped = false;
		let request = null;
		const tick = async () => {
			if (document.visibilityState !== "visible" || request) return;
			request = new AbortController();
			try {
				const res = await fetch("/api/site/codex-reset/version", {
					cache: "no-store",
					signal: request.signal
				});
				if (!res.ok) return;
				const v = await res.json();
				if (!stopped && v.version !== version) revalidator.revalidate();
			} catch {} finally {
				request = null;
			}
		};
		const timer = setInterval(tick, POLL_MS);
		const onVisible = () => document.visibilityState === "visible" && tick();
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			stopped = true;
			request?.abort();
			clearInterval(timer);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [version, revalidator]);
}
function scopeText(e) {
	const who = e.presentation?.audienceZh ?? e.presentation?.scopeLabel ?? "Tibo 未说明适用范围";
	return e.presentation?.productsZh ? `${who} · ${e.presentation.productsZh}` : who;
}
/** The status card: what Tibo announced and when it should land, beside his post. */
function Hero({ d, now }) {
	const e = d.current;
	const entrance = useEntrance();
	const shell = "cr-wash grid items-center gap-5 rounded-sheet border border-line-strong p-4 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8";
	if (!e) {
		const last = d.lastLanded;
		return /* @__PURE__ */ jsxs("section", {
			className: shell,
			style: { "--tone": last ? "var(--ok-ink)" : "var(--ink-4)" },
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: `inline-flex items-center gap-2 text-[13px] font-medium ${last ? "text-ok-ink" : "text-ink-4"}`,
						children: [/* @__PURE__ */ jsx("span", {
							className: "cr-dot",
							"aria-hidden": "true"
						}), "当前没有等待生效的重置"]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-3 text-[20px] font-[650] leading-[1.25] text-ink sm:text-[24px]",
						children: d.stats.lastResetDate ? `上一次额度重置在 ${monthDay(d.stats.lastResetDate)}` : "暂无重置记录"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-[13px] leading-[1.75] text-ink-4",
						children: "不预测尚未宣布的下一次重置。Tibo 一旦宣布，这里会显示预计生效时间与原帖。"
					}),
					d.outage && /* @__PURE__ */ jsxs("p", {
						className: "mt-4 border-t border-line pt-4 text-[13px] leading-[1.75] text-ink-3",
						children: [
							"线索：",
							dayWord(bjDate(d.outage.publishedAt), d.today),
							" ",
							bjTime(d.outage.publishedAt),
							" Tibo 确认 Codex 故障",
							d.outage.recoveredAt ? `，${bjTime(d.outage.recoveredAt)} 恢复` : "",
							"。故障不等于重置。"
						]
					})
				]
			}), last?.posts[0] && /* @__PURE__ */ jsx("div", {
				className: "min-w-0",
				children: /* @__PURE__ */ jsx(PostCard, {
					avatar: d.authorAvatar,
					stage: `${last.posts[0].stage}原帖`,
					post: {
						id: last.posts[0].id,
						publishedAt: last.posts[0].publishedAt,
						translation: last.posts[0].fullText ?? last.posts[0].text,
						original: last.posts[0].fullOriginalText ?? last.posts[0].originalText,
						context: last.posts[0].context,
						url: last.posts[0].url
					}
				})
			})]
		});
	}
	const status = e.presentation?.status ?? "announced";
	const window = e.estimate ?? e.schedule;
	const through = window?.through ? Date.parse(window.through) : null;
	const from = window?.from ? Date.parse(window.from) : null;
	const credit = e.type === "reset_credit";
	const headline = status === "in_progress" ? credit ? "重置卡正在发放" : "额度重置正在进行" : credit ? "等待重置卡到账" : "等待额度重置生效";
	let timing = null;
	if (status === "expired_unconfirmed" && through) timing = `已比预计晚 ${durationText(now - through)}，仍在等待确认`;
	else if (status === "announced" && from && now < from) timing = `距预计时段还有 ${durationText(from - now)}`;
	else if (status === "announced" && through && now < through) timing = "正处在预计时间段内";
	else if (status === "in_progress" && e.presentation?.reportedAt) timing = `Tibo ${stamp(e.presentation.reportedAt)} 表示正在进行`;
	const outage = d.outage && d.outage.resetEventId === e.id ? d.outage : null;
	const post = e.posts[0];
	return /* @__PURE__ */ jsxs("section", {
		className: `${shell} ${entrance ? "animate-fade-up" : ""}`,
		style: { "--tone": status === "expired_unconfirmed" ? "var(--hot)" : "var(--amber-ink)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ jsxs("p", {
					className: `inline-flex items-center gap-2 text-[13px] font-medium ${status === "expired_unconfirmed" ? "text-hot" : "text-amber-ink"}`,
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "cr-dot cr-dot-live",
							"aria-hidden": "true"
						}),
						typeName(e.type),
						" · Tibo 已宣布"
					]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-3 text-[20px] font-[650] leading-[1.25] text-ink sm:text-[24px]",
					children: headline
				}),
				window?.from && /* @__PURE__ */ jsxs("p", {
					className: "num mt-4 text-[24px] font-[650] leading-[1.3] tracking-[-0.01em] text-amber-ink lg:text-[clamp(24px,2.6vw,32px)]",
					children: ["预计 ", windowText(window.from, window.through, d.today).replace("–", " – ")]
				}),
				(timing || e.estimate?.reason) && /* @__PURE__ */ jsxs("p", {
					className: "mt-2 text-[13px] leading-[1.75] text-ink-4",
					children: [
						timing,
						timing && e.estimate?.reason ? " · " : "",
						e.estimate?.reason
					]
				}),
				/* @__PURE__ */ jsxs("ul", {
					className: "mt-4 grid gap-2 border-t border-line pt-4 text-[13px] leading-[1.75] text-ink-3",
					children: [/* @__PURE__ */ jsxs("li", { children: ["适用范围：", scopeText(e)] }), outage?.publishedAt && /* @__PURE__ */ jsxs("li", { children: [
						"起因：",
						dayWord(bjDate(outage.publishedAt), d.today),
						" ",
						bjTime(outage.publishedAt),
						" Tibo 确认 Codex 故障",
						outage.recoveredAt ? `，${bjTime(outage.recoveredAt)} 恢复` : ""
					] })]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-4 text-[13px] leading-[1.75] text-ink-3",
					children: credit ? "重置卡到账后由你自己决定何时使用。卡片余额以 Codex 内显示为准。" : "剩余额度可以放心用，生效后会恢复满额。以你 Codex 里显示的用量为准。"
				})
			]
		}), post && /* @__PURE__ */ jsx("div", {
			className: "min-w-0",
			children: /* @__PURE__ */ jsx(PostCard, {
				avatar: d.authorAvatar,
				stage: `${post.stage}原帖`,
				post: {
					id: post.id,
					publishedAt: post.publishedAt,
					translation: post.fullText ?? post.text,
					original: post.fullOriginalText ?? post.originalText,
					context: post.context,
					url: post.url
				}
			})
		})]
	});
}
/** Tibo's usual hours: 16:30–21:30 Pacific, i.e. 07:30–12:30 Beijing the next morning. */
var USUAL_FROM = 450;
var USUAL_TO = 750;
var inUsual = (m) => m >= USUAL_FROM && m <= USUAL_TO;
var MONITOR_WORDS = {
	healthy: "监控正常",
	delayed: "检查有延迟",
	attention: "监控需要处理",
	unknown: "监控状态未知"
};
var MONITOR_DOT = {
	healthy: "bg-ok-ink",
	delayed: "bg-amber-ink",
	attention: "bg-amber-ink",
	unknown: "bg-ink-4"
};
var codex_reset_default = UNSAFE_withComponentProps(function CodexResetPage() {
	const d = useLoaderData();
	useVersionPolling(d.version);
	const m = d.monitor;
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col gap-1 pb-4 pt-5 lg:flex-row lg:items-end lg:justify-between lg:pt-1",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[24px] font-semibold leading-[1.3] text-ink",
					children: "Tibo重置监控"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-[13px] text-ink-3",
					children: "Codex 额度重置与重置卡发放：什么时候生效、给谁、Tibo 原话"
				})] }), /* @__PURE__ */ jsx("p", {
					className: "text-[12px] text-ink-4",
					children: "全部为北京时间 · UTC+8"
				})]
			}),
			/* @__PURE__ */ jsx(LiveMonitor, { d }),
			/* @__PURE__ */ jsxs("details", {
				className: "disclosure group mt-8 border-t border-line",
				children: [/* @__PURE__ */ jsxs("summary", {
					className: "flex items-center justify-between gap-3 py-[18px] text-[13px] text-ink-3 transition-colors hover:text-ink",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(IconChevronRight, {
							size: 13,
							className: "text-ink-4 transition-transform duration-200 group-open:rotate-90"
						}), "时间是怎么推算的？"]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[12px] text-ink-4",
						children: "来源与规则"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-x-8 gap-y-[18px] pb-6 pt-1.5 text-[12px] leading-[1.9] text-ink-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", {
							className: "font-semibold text-ink-3",
							children: "有原话就按原话。"
						}), "Tibo 写了时间（如 “6pm PST”“next hour”“end of day”），按太平洋时间换算成北京时间，并多留一两个小时——他的确认帖通常比说的时间晚一点。只写了日期的，按他以往的习惯落在当天太平洋时间傍晚。"] }),
						/* @__PURE__ */ jsxs("p", { children: [
							/* @__PURE__ */ jsx("strong", {
								className: "font-semibold text-ink-3",
								children: "没写时间就按习惯。"
							}),
							"Tibo 多在太平洋时间 16:30–21:30 按下重置按钮，也就是北京时间第二天早上 07:30–12:30。",
							d.confirmMinutes.length ? `近 ${d.confirmMinutes.length} 次确认中有 ${d.confirmMinutes.filter(inUsual).length} 次在这个时段。` : "",
							"推算只是参考，以 Tibo 的确认和你 Codex 里的用量为准。"
						] }),
						/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", {
							className: "font-semibold text-ink-3",
							children: "已生效、应已生效、等待中。"
						}), "Tibo 发帖确认才算“已生效”；预计时间过去几个小时仍没有确认帖，显示“应已生效”——他宣布过的重置以往都兑现了，只是常常不再发确认。重置卡与额度重置分开记录，发卡不代表额度已恢复。"] }),
						/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", {
							className: "font-semibold text-ink-3",
							children: "持续跟踪 Tibo 的公开帖子。"
						}), "平时每 5 分钟检查一次，Tibo 确认故障或宣布重置后改为每 3 分钟。只有明确的重置或发卡消息才会推送飞书群。个人额度和重置卡余额请在 Codex 内查看。"] })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "flex flex-col gap-2 border-t border-line py-4 text-[12px] text-ink-4 sm:flex-row sm:items-start sm:justify-between",
				children: [m ? /* @__PURE__ */ jsxs("details", {
					className: "group",
					children: [/* @__PURE__ */ jsxs("summary", {
						className: "flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden",
						children: [
							/* @__PURE__ */ jsx("span", { className: `size-1.5 rounded-full ${MONITOR_DOT[m.status]}` }),
							MONITOR_WORDS[m.status],
							" · 最近检查 ",
							/* @__PURE__ */ jsx("span", {
								className: "num",
								children: stamp(m.lastVerifiedAt)
							}),
							/* @__PURE__ */ jsx(IconChevronDown, {
								size: 13,
								className: "text-ink-4 transition-transform group-open:rotate-180"
							})
						]
					}), /* @__PURE__ */ jsxs("dl", {
						className: "num mt-2 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 pl-4 text-[12px] text-ink-4",
						children: [
							/* @__PURE__ */ jsx("dt", { children: "最近尝试" }),
							/* @__PURE__ */ jsx("dd", { children: stamp(m.lastAttemptAt) }),
							/* @__PURE__ */ jsx("dt", { children: "最近采集" }),
							/* @__PURE__ */ jsx("dd", { children: stamp(m.lastCollectedAt) }),
							/* @__PURE__ */ jsx("dt", { children: "最近完整核验" }),
							/* @__PURE__ */ jsx("dd", { children: stamp(m.lastVerifiedAt) }),
							m.pendingCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("dt", { children: "待处理帖子" }), /* @__PURE__ */ jsx("dd", { children: m.pendingCount })] }),
							m.heldWindowCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("dt", { children: "待核实窗口" }), /* @__PURE__ */ jsx("dd", { children: m.heldWindowCount })] })
						]
					})]
				}) : /* @__PURE__ */ jsx("span", { children: "监控状态暂不可用" }), /* @__PURE__ */ jsxs("span", { children: [SITE.name, " 整理 · 非 OpenAI 官方页面"] })]
			})
		]
	});
});
/** Only the changing status/calendar need the foreground clock; archive statistics stay still. */
function LiveMonitor({ d }) {
	const [now, setNow] = useState(d.serverNow);
	useEffect(() => {
		const update = () => {
			if (document.visibilityState === "visible") setNow(Date.now());
		};
		update();
		const t = setInterval(update, 3e4);
		document.addEventListener("visibilitychange", update);
		return () => {
			clearInterval(t);
			document.removeEventListener("visibilitychange", update);
		};
	}, [d.version]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Hero, {
		d,
		now
	}), /* @__PURE__ */ jsx(ResetCalendar, {
		selectedDate: d.selectedDate,
		version: d.version,
		marks: d.calendar,
		events: d.events,
		today: d.today,
		historyFrom: d.historyFrom,
		now,
		avatar: d.authorAvatar
	}, d.selectedDate)] });
}
//#endregion
//#region app/features/leaderboard/format.ts
/** ≥ ¥0.1 → up to two decimals; smaller amounts keep three significant digits. */
function yuan(v) {
	if (v == null || !Number.isFinite(v)) return "—";
	return `¥${(v >= .1 ? Number(v.toFixed(2)) : Number(v.toPrecision(3))).toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}
function listPrice(v, currency) {
	if (v == null) return "—";
	return currency === "USD" ? `$${Number(v.toPrecision(6))}` : yuan(v);
}
/** "09/26 20:00" in Beijing time, as the leaderboard has always shown update times. */
function shortStamp(iso) {
	if (!iso) return "待核实";
	return `${beijingDate(iso).slice(5).replace("-", "/")} ${beijingTime(iso)}`;
}
function pct$1(weight, digits = 1) {
	const v = weight * 100;
	return `${Number(v.toFixed(digits))}%`;
}
/** Always one decimal, as the shared-evidence tables print weights ("5.0%"). */
function pctFixed(weight) {
	return `${(weight * 100).toFixed(1)}%`;
}
function tokensWan(n) {
	if (!n) return "—";
	const w = n / 1e4;
	return `${Number(w >= 100 ? w.toFixed(1) : w.toFixed(1))}万`.replace(".0万", "万");
}
function boardHref(key) {
	return key === "overall" ? "/leaderboard" : `/leaderboard/category/${key}`;
}
function modelHref(slug, from) {
	return from && from !== "overall" ? `/leaderboard/${slug}?from=${from}` : `/leaderboard/${slug}`;
}
//#endregion
//#region app/features/leaderboard/BoardTabs.tsx
/** Board switcher. It lives in the shared layout, so the thumb glides between boards. */
function BoardTabs() {
	const { pathname } = useLocation();
	const active = LEADERBOARD_PUBLIC_BOARDS.find((k) => boardHref(k) === pathname) ?? "overall";
	return /* @__PURE__ */ jsx(PillTabs, {
		layoutId: "lb-board",
		label: "榜单",
		active,
		items: LEADERBOARD_PUBLIC_BOARDS.map((k) => ({
			key: k,
			label: LEADERBOARD_BOARD_LABELS[k],
			to: boardHref(k)
		}))
	});
}
//#endregion
//#region app/routes/leaderboard-boards.tsx
var leaderboard_boards_exports = /* @__PURE__ */ __exportAll({
	default: () => leaderboard_boards_default,
	headers: () => headers$7
});
/** Shared caches may keep this page for five minutes. */
function headers$7() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}
/** Shared frame for the overall and category boards; only the board below it changes. */
var leaderboard_boards_default = UNSAFE_withComponentProps(function LeaderboardFrame() {
	const chip = "inline-flex h-8 items-center gap-1 rounded-full border border-line-strong bg-surface px-3.5 text-[12.5px] text-ink-2 transition-colors hover:border-ink-4 hover:text-ink";
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-10",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col gap-3 pb-4 pt-5 sm:flex-row sm:items-end sm:justify-between lg:pt-1",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "mono text-[11px] font-semibold tracking-[0.16em] text-accent",
					children: [SITE.name.toUpperCase(), " LEADERBOARD"]
				}), /* @__PURE__ */ jsx("h1", {
					className: "mt-1.5 text-[24px] font-semibold leading-[1.3] text-ink",
					children: "AI 模型排行榜"
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/leaderboard/sources",
						className: chip,
						children: ["评测来源 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 13 })]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/leaderboard/rules",
						className: chip,
						children: ["排名怎么算 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 13 })]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "-mx-4 px-4 lg:mx-0 lg:px-0",
				children: /* @__PURE__ */ jsx(BoardTabs, {})
			}),
			/* @__PURE__ */ jsx(Outlet, {})
		]
	});
});
//#endregion
//#region ../../packages/contracts/src/leaderboard.ts
var LB_SOURCE_STATUS_LABELS = {
	ranked: "参与排名",
	cross_reference: "交叉参考",
	observing: "观察中",
	reference_only: "仅供参考",
	awaiting: "等待成绩"
};
var LB_CONFIDENCE_LABELS = {
	HIGH: "较充分",
	MEDIUM: "持续积累",
	LOW: "证据敏感"
};
//#endregion
//#region app/features/leaderboard/BrandMark.tsx
var DARK_TILE = /* @__PURE__ */ new Set(["/model-providers/moonshot.svg"]);
/** Vendor or evaluator mark on a bordered tile; falls back to a monogram. Marks identify, never endorse. */
function BrandMark({ brand, size = 28, className = "" }) {
	const radius = Math.round(size * .27);
	if (brand?.src) {
		const dark = DARK_TILE.has(brand.src);
		return /* @__PURE__ */ jsx("span", {
			className: `inline-flex shrink-0 items-center justify-center overflow-hidden border ${dark ? "border-transparent bg-[#111]" : `border-line bg-white ${brand.raster ? "" : "dark:bg-white/95"}`} ${className}`,
			style: {
				width: size,
				height: size,
				borderRadius: radius
			},
			"aria-hidden": "true",
			children: /* @__PURE__ */ jsx("img", {
				src: brand.src,
				alt: "",
				width: size,
				height: size,
				loading: "lazy",
				decoding: "async",
				className: `object-contain ${dark ? "h-[66%] w-[66%]" : "h-[64%] w-[64%]"}`
			})
		});
	}
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex shrink-0 items-center justify-center border border-line bg-accent-soft font-semibold text-accent ${className}`,
		style: {
			width: size,
			height: size,
			borderRadius: radius,
			fontSize: Math.round(size * .4)
		},
		"aria-hidden": "true",
		children: brand?.monogram ?? "?"
	});
}
//#endregion
//#region app/features/leaderboard/Evidence.tsx
var DOT = {
	HIGH: "bg-ok",
	MEDIUM: "bg-accent",
	LOW: "bg-amber"
};
function rangeText(s) {
	return s.from === s.to ? `第 ${s.from} 名` : `${s.from}—${s.to} 名`;
}
function position(r) {
	return {
		left: Math.max(8, Math.min(r.left + r.width / 2 - 112, document.documentElement.clientWidth - 232)),
		...r.top > 160 ? { bottom: window.innerHeight - r.top + 8 } : { top: r.bottom + 8 }
	};
}
/** Confidence as a dotted label. On desktop, hovering a sensitive ranking shows its scenario rank range. */
function EvidenceBadge({ confidence, stability, rank }) {
	const id = useId();
	const [at, setAt] = useState(null);
	const open = at !== null;
	useEffect(() => {
		if (!open) return;
		const close = () => setAt(null);
		window.addEventListener("scroll", close, true);
		window.addEventListener("resize", close);
		return () => {
			window.removeEventListener("scroll", close, true);
			window.removeEventListener("resize", close);
		};
	}, [open]);
	const show = (e) => {
		const r = e.currentTarget.getBoundingClientRect();
		setAt(position(r));
	};
	const label = LB_CONFIDENCE_LABELS[confidence];
	const chip = /* @__PURE__ */ jsxs("small", {
		className: "inline-flex items-center gap-1.5 text-[11px] leading-[17px] text-ink-4",
		children: [/* @__PURE__ */ jsx("span", {
			className: `size-[5px] shrink-0 rounded-full ${DOT[confidence]}`,
			"aria-hidden": "true"
		}), label]
	});
	if (!stability) return chip;
	const moved = stability.from !== stability.to || stability.unavailable > 0 || stability.incomplete > 0;
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex",
		tabIndex: moved ? 0 : -1,
		"aria-describedby": moved && at ? id : void 0,
		onMouseEnter: moved ? show : void 0,
		onMouseLeave: () => setAt(null),
		onFocus: moved ? show : void 0,
		onBlur: () => setAt(null),
		onKeyDown: (e) => {
			if (e.key === "Escape") setAt(null);
		},
		children: [chip, moved && at && createPortal(/* @__PURE__ */ jsxs("span", {
			id,
			role: "tooltip",
			style: at,
			className: "pointer-events-none fixed z-[60] w-56 rounded-tile border border-line bg-raised p-3 text-left text-[12px] leading-relaxed text-ink-2 shadow-[var(--shadow-pop)]",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "block text-[11px] text-ink-4",
					children: "名次浮动范围"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "num block text-[15px] font-semibold text-ink",
					children: rangeText(stability)
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "mt-1.5 block text-ink-3",
					children: [
						"在 ",
						stability.scenarios,
						" 个对照情景中重新检查资格后的名次。",
						stability.unavailable > 0 && ` ${stability.unavailable} 个情景下参评证据不足。`,
						"不是置信区间。"
					]
				})
			]
		}), document.body)]
	});
}
//#endregion
//#region app/features/leaderboard/BoardTable.tsx
function sortValue(e, key) {
	switch (key) {
		case "rank": return e.rank;
		case "released": return e.model.releasedAt ? -Date.parse(e.model.releasedAt) : null;
		case "coverage": return -(e.coverage * 1e3 + e.sourceCount);
		case "cached": return e.price?.cachedCny ?? null;
		case "input": return e.price?.inputCny ?? null;
		case "output": return e.price?.outputCny ?? null;
	}
}
function sorted(entries, key, dir) {
	return [...entries].sort((a, b) => {
		const va = sortValue(a, key);
		const vb = sortValue(b, key);
		if (va === null && vb === null) return a.rank - b.rank;
		if (va === null) return 1;
		if (vb === null) return -1;
		return (va - vb) * dir || a.rank - b.rank;
	});
}
/** The top three sit on a small tinted plate; the rest are plain numbers. */
function Rank({ rank }) {
	const n = String(rank).padStart(2, "0");
	if (rank <= 3) return /* @__PURE__ */ jsx("span", {
		className: "mono inline-flex h-7 w-[26px] items-center justify-center rounded-full bg-accent/[0.06] text-[13px] font-bold text-accent",
		children: n
	});
	return /* @__PURE__ */ jsx("span", {
		className: "mono text-[13px] text-ink-4",
		children: n
	});
}
function SortHeader({ k, children, sort, dir, onSort, align = "left", className = "" }) {
	const active = sort === k;
	return /* @__PURE__ */ jsx("th", {
		scope: "col",
		"aria-sort": active ? dir === 1 ? "ascending" : "descending" : "none",
		className: `px-3 py-2.5 font-medium ${align === "right" ? "text-right" : "text-left"} ${className}`,
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort(k),
			className: `group/sort inline-flex items-start gap-1 text-left transition-colors hover:text-ink ${active ? "text-accent" : ""}`,
			children: [/* @__PURE__ */ jsx("span", { children }), /* @__PURE__ */ jsx("span", {
				className: `mt-[3px] text-[9px] transition ${active ? "opacity-100" : "opacity-0 group-hover/sort:opacity-40"} ${active && dir === -1 ? "rotate-180" : ""}`,
				"aria-hidden": "true",
				children: "▲"
			})]
		})
	});
}
var unit = /* @__PURE__ */ jsx("span", {
	className: "block text-[10.5px] font-normal text-ink-4",
	children: "人民币 / 百万 Token"
});
function BoardTable({ entries, board }) {
	const [sort, setSort] = useState("rank");
	const [dir, setDir] = useState(1);
	const rows = useMemo(() => sorted(entries, sort, dir), [
		entries,
		sort,
		dir
	]);
	const body = useRef(null);
	const tops = useRef(/* @__PURE__ */ new Map());
	const order = rows.map((e) => e.model.slug).join(",");
	useLayoutEffect(() => {
		if (!body.current) return;
		const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		const next = /* @__PURE__ */ new Map();
		for (const row of Array.from(body.current.rows)) {
			const key = row.dataset.slug ?? "";
			const prev = tops.current.get(key);
			next.set(key, row.offsetTop);
			if (prev !== void 0 && prev !== row.offsetTop && !reduce && row.animate) row.animate([{ transform: `translateY(${prev - row.offsetTop}px)` }, { transform: "none" }], {
				duration: 420,
				easing: "cubic-bezier(0.25, 1, 0.5, 1)"
			});
		}
		tops.current = next;
	}, [order]);
	const onSort = (k) => {
		if (k === sort) setDir((d) => d === 1 ? -1 : 1);
		else {
			setSort(k);
			setDir(1);
		}
	};
	const price = (e, v) => !e.price ? /* @__PURE__ */ jsx("span", {
		className: "text-[12px] text-ink-4",
		children: "待核验"
	}) : v == null ? /* @__PURE__ */ jsx("span", {
		className: "text-ink-4",
		children: "—"
	}) : yuan(v);
	return /* @__PURE__ */ jsxs("table", {
		className: "w-full border-collapse text-[14px]",
		children: [
			/* @__PURE__ */ jsxs("caption", {
				className: "sr-only",
				children: [
					"可按列重排的前 ",
					entries.length,
					" 名模型"
				]
			}),
			/* @__PURE__ */ jsx("thead", {
				className: "bg-[rgba(28,39,51,0.04)] text-[12px] text-ink-4 dark:bg-white/[0.03]",
				children: /* @__PURE__ */ jsxs("tr", {
					className: "border-y border-line",
					children: [
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							className: "w-[44px] py-2.5 pl-4 pr-1 text-left font-medium lg:w-[68px] lg:pl-[22px] lg:pr-3",
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => onSort("rank"),
								className: `transition-colors hover:text-ink ${sort === "rank" ? "text-accent" : ""}`,
								children: "排名"
							})
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							className: "px-2 py-2.5 text-left font-medium lg:px-3",
							children: "模型"
						}),
						/* @__PURE__ */ jsx(SortHeader, {
							k: "released",
							sort,
							dir,
							onSort,
							className: "hidden lg:table-cell",
							children: "上线日期"
						}),
						/* @__PURE__ */ jsx(SortHeader, {
							k: "coverage",
							sort,
							dir,
							onSort,
							className: "hidden lg:table-cell",
							children: "评测证据"
						}),
						/* @__PURE__ */ jsxs(SortHeader, {
							k: "cached",
							sort,
							dir,
							onSort,
							className: "hidden lg:table-cell",
							children: ["缓存价格", unit]
						}),
						/* @__PURE__ */ jsxs(SortHeader, {
							k: "input",
							sort,
							dir,
							onSort,
							className: "hidden lg:table-cell",
							children: ["输入价格", unit]
						}),
						/* @__PURE__ */ jsxs(SortHeader, {
							k: "output",
							sort,
							dir,
							onSort,
							className: "hidden lg:table-cell",
							children: ["输出价格", unit]
						}),
						/* @__PURE__ */ jsx("th", {
							scope: "col",
							className: "py-2.5 pl-2 pr-4 text-right font-medium lg:pl-3 lg:pr-[22px]",
							children: /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => onSort("rank"),
								title: "共识指数把支持原排名的证据差异换算为 0—100，不是正确率。",
								className: `inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-ink ${sort === "rank" ? "text-accent" : ""}`,
								children: ["共识指数 ", /* @__PURE__ */ jsx("span", {
									className: "inline-flex size-3.5 items-center justify-center rounded-full border border-current text-[9px] leading-none",
									children: "i"
								})]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("tbody", {
				ref: body,
				children: rows.map((e) => /* @__PURE__ */ jsxs("tr", {
					"data-slug": e.model.slug,
					className: "group relative border-b border-line last:border-b-0 transition-colors hover:bg-accent-softer",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "py-3 pl-4 pr-1 align-middle lg:pl-[22px] lg:pr-3",
							children: /* @__PURE__ */ jsx(Rank, { rank: e.rank })
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-2 py-3 lg:px-3",
							children: /* @__PURE__ */ jsxs(Link, {
								to: modelHref(e.model.slug, board),
								prefetch: "intent",
								className: "block after:absolute after:inset-0 after:content-['']",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx(BrandMark, {
										brand: e.model.brand,
										size: 32
									}), /* @__PURE__ */ jsxs("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("strong", {
											className: "block text-[15px] font-[650] leading-[21px] text-ink transition-colors group-hover:text-accent",
											children: e.model.name
										}), /* @__PURE__ */ jsx("small", {
											className: "block text-[12px] leading-[18px] text-ink-4",
											children: e.model.provider ?? "—"
										})]
									})]
								}), /* @__PURE__ */ jsxs("span", {
									className: "mt-1.5 block text-[12px] leading-[1.7] text-ink-3 lg:hidden",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "block",
											children: [
												"上线 ",
												/* @__PURE__ */ jsx("span", {
													className: "num",
													children: e.model.releasedAt ?? "—"
												}),
												" · ",
												LB_CONFIDENCE_LABELS[e.confidence]
											]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "block",
											children: ["缓存输入 ", /* @__PURE__ */ jsx("span", {
												className: "num",
												children: e.price ? yuan(e.price.cachedCny) : "—"
											})]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "block",
											children: [
												"输入 ",
												/* @__PURE__ */ jsx("span", {
													className: "num",
													children: e.price ? yuan(e.price.inputCny) : "—"
												}),
												" · 输出 ",
												/* @__PURE__ */ jsx("span", {
													className: "num",
													children: e.price ? yuan(e.price.outputCny) : "—"
												})
											]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "mono hidden px-3 py-3 text-[12px] text-ink-3 lg:table-cell",
							children: /* @__PURE__ */ jsx("time", {
								dateTime: e.model.releasedAt ?? void 0,
								children: e.model.releasedAt ?? "—"
							})
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "relative z-10 hidden px-3 py-3 lg:table-cell",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "num block text-[13px] text-ink-2",
								children: [e.sourceCount, " 项评测"]
							}), /* @__PURE__ */ jsx(EvidenceBadge, {
								confidence: e.confidence,
								stability: e.stability,
								rank: e.rank
							})]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "mono hidden px-3 py-3 text-[14.5px] font-medium text-ink lg:table-cell",
							children: price(e, e.price?.cachedCny)
						}),
						/* @__PURE__ */ jsx("td", {
							className: "mono hidden px-3 py-3 text-[14.5px] font-medium text-ink lg:table-cell",
							children: price(e, e.price?.inputCny)
						}),
						/* @__PURE__ */ jsx("td", {
							className: "mono hidden px-3 py-3 text-[14.5px] font-medium text-ink lg:table-cell",
							children: price(e, e.price?.outputCny)
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3 pl-2 pr-4 text-right align-middle lg:pl-3 lg:pr-[22px]",
							children: /* @__PURE__ */ jsx("strong", {
								className: `mono inline-block text-[20px] font-semibold leading-7 tracking-[-0.02em] ${e.rank <= 3 ? "text-accent" : "text-ink"}`,
								"aria-label": `${e.model.name} 共识指数 ${e.score.toFixed(1)}`,
								children: e.score.toFixed(1)
							})
						})
					]
				}, e.model.slug))
			})
		]
	});
}
//#endregion
//#region app/features/leaderboard/Podium.tsx
var WASH = [
	"bg-[radial-gradient(130%_100%_at_0%_0%,color-mix(in_srgb,var(--rank-1)_11%,transparent),transparent_62%)]",
	"bg-[radial-gradient(130%_100%_at_0%_0%,color-mix(in_srgb,var(--rank-2)_11%,transparent),transparent_62%)]",
	"bg-[radial-gradient(130%_100%_at_0%_0%,color-mix(in_srgb,var(--rank-3)_12%,transparent),transparent_62%)]"
];
var RANK_TEXT = [
	"text-rank-1",
	"text-rank-2",
	"text-rank-3"
];
/**
* The top three above the full table, kept short so the table starts high. Two rows: the rank with its
* evidence, then who the model is beside the consensus index.
*/
function Podium({ entries, board }) {
	const top = entries.filter((e) => e.rank <= 3).slice(0, 3);
	if (top.length < 3) return null;
	return /* @__PURE__ */ jsx("ol", {
		className: "mt-3 hidden gap-3 md:grid md:grid-cols-3",
		"aria-label": "前三名",
		children: top.map((e, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
			to: modelHref(e.model.slug, board),
			prefetch: "intent",
			className: `card card-hover group flex h-full flex-col px-4 py-3.5 ${WASH[i]}`,
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("span", {
					className: `mono text-[11px] font-bold tracking-[0.16em] ${RANK_TEXT[i]}`,
					children: ["NO.", String(e.rank).padStart(2, "0")]
				}), /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-2 text-[11.5px] text-ink-4",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "num",
						children: [e.sourceCount, " 项评测"]
					}), /* @__PURE__ */ jsx(EvidenceBadge, {
						confidence: e.confidence,
						stability: e.stability,
						rank: e.rank
					})]
				})]
			}), /* @__PURE__ */ jsxs("span", {
				className: "mt-2.5 flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(BrandMark, {
						brand: e.model.brand,
						size: 34
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "block truncate text-[15.5px] font-[650] leading-snug text-ink transition-colors group-hover:text-accent",
							children: e.model.name
						}), /* @__PURE__ */ jsx("span", {
							className: "block truncate text-[12px] text-ink-4",
							children: e.model.provider ?? "—"
						})]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "shrink-0 text-right",
						children: [/* @__PURE__ */ jsx("span", {
							className: "block text-[11px] leading-none text-ink-4",
							children: "共识指数"
						}), /* @__PURE__ */ jsx("span", {
							className: "mono mt-1 block text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink",
							children: e.score.toFixed(1)
						})]
					})
				]
			})]
		}) }, e.model.slug))
	});
}
//#endregion
//#region app/routes/leaderboard.tsx
var leaderboard_exports = /* @__PURE__ */ __exportAll({
	default: () => leaderboard_default,
	headers: () => headers$6,
	loader: () => loader$19,
	meta: () => meta$19
});
var CATEGORY_KEYS = /* @__PURE__ */ new Set([
	"coding",
	"reasoning",
	"knowledge",
	"professional"
]);
async function loader$19({ params, request }) {
	const key = params.key ?? "overall";
	if (params.key !== void 0 && !CATEGORY_KEYS.has(params.key)) throw data({ message: "not_found" }, { status: 404 });
	return loadOr404(`/api/site/leaderboard/boards/${key}`, { signal: request.signal });
}
function meta$19({ loaderData }) {
	if (!loaderData) return [{ title: titled("页面不存在") }];
	const { board, entries } = loaderData;
	const path = board.key === "overall" ? "/leaderboard" : `/leaderboard/category/${board.key}`;
	return pageMeta({
		title: board.title,
		rawTitle: true,
		description: board.key === "overall" ? "汇总多家公开模型评测榜单，给出${SITE.name} 共识分、评测完整度、上线日期与 API 参考价格。" : board.description,
		path,
		image: "/og/pages/leaderboard.png",
		jsonLd: [{
			"@context": "https://schema.org",
			"@type": "ItemList",
			name: board.key === "overall" ? `${SITE.name} 大模型综合榜` : `${SITE.name} ${board.name}模型榜`,
			itemListOrder: "https://schema.org/ItemListOrderAscending",
			numberOfItems: entries.length,
			itemListElement: entries.map((e) => ({
				"@type": "ListItem",
				position: e.rank,
				name: e.model.name,
				url: `${siteUrl()}${modelHref(e.model.slug)}`
			}))
		}, breadcrumbLd(board.key === "overall" ? [{
			name: "模型榜",
			path: "/leaderboard"
		}] : [{
			name: "模型榜",
			path: "/leaderboard"
		}, {
			name: `${board.name}榜`,
			path
		}])]
	});
}
function headers$6() {
	return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=600" };
}
var leaderboard_default = UNSAFE_withComponentProps(function LeaderboardPage() {
	const { board, entries, run } = useLoaderData();
	const entrance = useEntrance();
	return /* @__PURE__ */ jsxs("div", {
		className: entrance ? "animate-fade-up" : void 0,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-[13.5px] text-ink-2",
					children: board.description
				}), /* @__PURE__ */ jsxs("p", {
					className: "num text-[12px] text-ink-4",
					children: [
						board.sourceCount,
						" 项评测",
						/* @__PURE__ */ jsx("span", {
							className: "mx-2",
							children: "·"
						}),
						board.operatorCount,
						" 家机构",
						/* @__PURE__ */ jsx("span", {
							className: "mx-2",
							children: "·"
						}),
						shortStamp(run.generatedAt),
						" 更新"
					]
				})]
			}),
			/* @__PURE__ */ jsx(Podium, {
				entries,
				board: board.key
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card mt-3 overflow-hidden",
				"aria-labelledby": "lb-board-title",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-3 px-4 py-3 lg:px-[22px]",
						children: [/* @__PURE__ */ jsxs("h2", {
							id: "lb-board-title",
							className: "text-[16px] font-bold text-ink",
							children: [board.key === "overall" ? "综合榜" : `${board.name}榜`, /* @__PURE__ */ jsxs("span", {
								className: "mono ml-2 text-[11px] font-normal tracking-wide text-ink-4",
								children: ["TOP ", entries.length]
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-right text-[12px] text-ink-4",
							children: "按多项公开评测的共同证据排名"
						})]
					}),
					/* @__PURE__ */ jsx(BoardTable, {
						entries,
						board: board.key
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "border-t border-line px-4 py-3 text-[12px] leading-relaxed text-ink-4 lg:px-[22px]",
						children: [/* @__PURE__ */ jsx("p", { children: "每个榜单最多展示 30 个模型" }), /* @__PURE__ */ jsx("p", { children: "共识指数不是正确率；同分仍按共同证据确定的名次展示。" })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "card p-5",
					children: [
						/* @__PURE__ */ jsxs("h2", {
							className: "flex items-center gap-1.5 text-[14px] font-semibold text-ink",
							children: [/* @__PURE__ */ jsx(IconInfo, {
								size: 16,
								className: "text-accent"
							}), "如何看这张榜"]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-[13px] leading-relaxed text-ink-3",
							children: [board.howToRead, "价格不参与排名，缺测不记零分，指数不是正确率。"]
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/leaderboard/rules",
							className: "mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-medium text-accent hover:text-accent-ink",
							children: "了解计算方法 →"
						})
					]
				}), /* @__PURE__ */ jsxs("section", {
					className: "card p-5",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[14px] font-semibold text-ink",
						children: "关于价格"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-2 text-[13px] leading-relaxed text-ink-3",
						children: [
							"API 价格来自厂商官网，按每百万 Token 展示。",
							run.fx ? `美元报价按 ${run.fx.asOf} 汇率折算成人民币。` : "",
							"缓存价格指命中后的输入价格，缓存写入、存储及订阅费用另计。"
						]
					})]
				})]
			})
		]
	}, board.key);
});
//#endregion
//#region app/features/leaderboard/StatusChip.tsx
var STATUS_TONE = {
	ranked: "border-accent/30 text-accent",
	cross_reference: "border-ok/30 text-ok",
	observing: "border-line-strong text-ink-4",
	reference_only: "border-amber/35 text-amber-ink",
	awaiting: "border-hot/30 text-hot"
};
function StatusChip({ status, large = false }) {
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex shrink-0 items-center rounded-mark border font-medium ${large ? "h-7 px-2.5 text-[12.5px]" : "h-[22px] px-2 text-[11px]"} ${STATUS_TONE[status]}`,
		children: LB_SOURCE_STATUS_LABELS[status]
	});
}
//#endregion
//#region app/routes/leaderboard-sources.tsx
var leaderboard_sources_exports = /* @__PURE__ */ __exportAll({
	default: () => leaderboard_sources_default,
	headers: () => headers$5,
	loader: () => loader$18,
	meta: () => meta$18
});
async function loader$18({ request }) {
	return loadOr404("/api/site/leaderboard/sources", { signal: request.signal });
}
function meta$18() {
	return pageMeta({
		title: "评测来源",
		description: `了解 ${SITE.name} 采用和观察中的评测来源、方法与数据进展。`,
		path: "/leaderboard/sources",
		image: "/og/pages/leaderboard.png",
		jsonLd: breadcrumbLd([{
			name: "模型榜",
			path: "/leaderboard"
		}, {
			name: "评测来源",
			path: "/leaderboard/sources"
		}])
	});
}
function headers$5() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=900" };
}
var leaderboard_sources_default = UNSAFE_withComponentProps(function LeaderboardSourcesPage() {
	const { groups, rankedCount, totalCount } = useLoaderData();
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/leaderboard",
				className: "mt-4 inline-flex items-center gap-1.5 py-2 text-[13px] text-ink-3 transition-colors hover:text-accent lg:mt-0",
				children: [/* @__PURE__ */ jsx(IconArrowLeft, { size: 14 }), " 返回模型榜"]
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "pb-2 pt-3",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-[24px] font-semibold leading-[1.3] text-ink",
						children: "评测来源"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-[13px] text-ink-3",
						children: "每个来源测什么、怎样更新、是否进入排名，都可以在这里找到。"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline gap-6",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mono text-[24px] font-semibold text-ink",
									children: rankedCount
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[12px] text-ink-4",
									children: "本轮参与排名"
								})]
							}), /* @__PURE__ */ jsxs("span", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mono text-[24px] font-semibold text-ink",
									children: totalCount
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[12px] text-ink-4",
									children: "已审查来源与专项"
								})]
							})]
						}), /* @__PURE__ */ jsxs(Link, {
							to: "/leaderboard/rules",
							className: "inline-flex items-center gap-1.5 text-[13px] text-ink-3 transition-colors hover:text-accent",
							children: ["排名怎么算 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 14 })]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("nav", {
				"aria-label": "来源分组",
				className: "scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0",
				children: groups.map((g) => /* @__PURE__ */ jsx("a", {
					href: `#${g.key}`,
					className: "inline-flex h-8 shrink-0 items-center rounded-full border border-line bg-surface px-3 text-[12.5px] text-ink-3 transition-colors hover:border-line-strong hover:text-accent",
					children: g.name
				}, g.key))
			}),
			groups.map((g) => /* @__PURE__ */ jsxs("section", {
				id: g.key,
				className: "scroll-mt-6 pt-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-[17px] font-bold text-ink",
							children: g.name
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mono text-[12px] text-ink-4",
							children: g.sources.length
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[12.5px] text-ink-4",
							children: g.blurb
						})
					]
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: g.sources.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
						to: `/leaderboard/sources/${s.key}`,
						className: "card card-hover group flex h-full flex-col p-5",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ jsx(BrandMark, {
									brand: s.brand,
									size: 30
								}), /* @__PURE__ */ jsx(StatusChip, { status: s.status })]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mt-3.5 text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-accent",
								children: s.name
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mt-1.5 line-clamp-3 flex-1 text-[12.5px] leading-[1.7] text-ink-3",
								children: s.description
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "mt-4 flex items-center justify-between gap-3 text-[11.5px] text-ink-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "min-w-0 truncate",
									children: s.operator
								}), /* @__PURE__ */ jsxs("span", {
									className: "flex shrink-0 items-center gap-2.5",
									children: [s.budget !== null && /* @__PURE__ */ jsxs("span", {
										className: "num",
										children: ["证据预算 ", pct$1(s.budget)]
									}), /* @__PURE__ */ jsx(IconArrowUpRight, {
										size: 13,
										className: "transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
									})]
								})]
							})
						]
					}) }, s.key))
				})]
			}, g.key)),
			/* @__PURE__ */ jsx("p", {
				className: "mt-10 border-t border-line pt-5 text-[12px] leading-relaxed text-ink-4",
				children: "“观察中”表示仍在核对数据、运行条件或使用边界，不参与综合榜和分类榜。同一评测的重复抓取和展示切片不会增加票权；不同评测之间的题库重叠仍需持续核对。"
			})
		]
	});
});
//#endregion
//#region app/routes/leaderboard-source.tsx
var leaderboard_source_exports = /* @__PURE__ */ __exportAll({
	default: () => leaderboard_source_default,
	headers: () => headers$4,
	loader: () => loader$17,
	meta: () => meta$17
});
async function loader$17({ params, request }) {
	return loadOr404(`/api/site/leaderboard/sources/${encodeURIComponent(params.key)}`, { signal: request.signal });
}
function meta$17({ loaderData }) {
	if (!loaderData) return [{ title: titled("页面不存在") }];
	const { source } = loaderData;
	const path = `/leaderboard/sources/${source.key}`;
	return pageMeta({
		title: `${source.name} · 评测来源`,
		description: source.description,
		path,
		image: "/og/pages/leaderboard.png",
		jsonLd: [{
			"@context": "https://schema.org",
			"@type": "Dataset",
			name: source.fullName,
			description: source.description,
			url: `${siteUrl()}${path}`,
			creator: {
				"@type": "Organization",
				name: source.operator
			},
			...source.officialUrl ? { sameAs: source.officialUrl } : {}
		}, breadcrumbLd([
			{
				name: "模型榜",
				path: "/leaderboard"
			},
			{
				name: "评测来源",
				path: "/leaderboard/sources"
			},
			{
				name: source.name,
				path
			}
		])]
	});
}
function headers$4() {
	return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=900" };
}
function Stat$2({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-[11px] text-ink-4",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "mono mt-2 block text-[16px] font-semibold text-ink",
			children
		})]
	});
}
var leaderboard_source_default = UNSAFE_withComponentProps(function LeaderboardSourcePage() {
	const d = useLoaderData();
	const { source } = d;
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/leaderboard/sources",
				className: "mt-4 inline-flex items-center gap-1.5 py-2 text-[13px] text-ink-3 transition-colors hover:text-accent lg:mt-0",
				children: [/* @__PURE__ */ jsx(IconArrowLeft, { size: 14 }), " 评测来源"]
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ jsx(BrandMark, {
						brand: source.brand,
						size: 44
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-[22px] font-semibold leading-[1.35] text-ink",
							children: source.fullName
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-[13px] leading-relaxed text-ink-3",
							children: [
								source.operator,
								source.area ? ` / ${source.area}` : "",
								" · ",
								source.description
							]
						})]
					})]
				}), source.officialUrl && /* @__PURE__ */ jsxs("a", {
					href: source.officialUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-full border border-line-strong bg-surface px-3 text-[12.5px] text-ink-2 transition-colors hover:border-ink-4 hover:text-ink",
					children: ["官方评测 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 13 })]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-line py-5 lg:grid-cols-4",
				"aria-label": `在 ${SITE.name} 中`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-[11px] text-ink-4",
							children: [
								"在 ",
								SITE.name,
								" 中"
							]
						}), /* @__PURE__ */ jsx("span", {
							className: "mt-1.5 block",
							children: /* @__PURE__ */ jsx(StatusChip, {
								status: source.status,
								large: true
							})
						})]
					}),
					/* @__PURE__ */ jsx(Stat$2, {
						label: "证据预算",
						children: source.budget !== null ? pct$1(source.budget) : /* @__PURE__ */ jsx("span", {
							className: "font-sans text-[14px] font-normal text-ink-3",
							children: "不计分"
						})
					}),
					/* @__PURE__ */ jsx(Stat$2, {
						label: "上游数据时间",
						children: d.collected ? shortStamp(d.upstreamAt) : /* @__PURE__ */ jsx("span", {
							className: "font-sans text-[14px] font-normal text-ink-3",
							children: "待核实"
						})
					}),
					/* @__PURE__ */ jsx(Stat$2, {
						label: "最近成功同步",
						children: d.collected ? shortStamp(d.syncedAt) : /* @__PURE__ */ jsx("span", {
							className: "font-sans text-[14px] font-normal text-ink-3",
							children: source.status === "awaiting" ? "等待可比成绩" : "尚未开始采集"
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-6 grid gap-6 md:grid-cols-2 md:gap-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[14px] font-semibold text-ink",
					children: "它测什么，怎么测"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[13px] leading-[1.8] text-ink-3",
					children: source.what
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[14px] font-semibold text-ink",
					children: "如何使用这份证据"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[13px] leading-[1.8] text-ink-3",
					children: source.usage
				})] })]
			}),
			d.collected && d.rows.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-[18px] font-bold text-ink",
						children: "评测成绩"
					}),
					d.rowsNote && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[12.5px] text-ink-3",
						children: d.rowsNote
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card mt-4 overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[560px] text-[13.5px]",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-[rgba(28,39,51,0.04)] text-[12px] text-ink-4 dark:bg-white/[0.03]",
								children: /* @__PURE__ */ jsxs("tr", {
									className: "border-b border-line",
									children: [
										/* @__PURE__ */ jsx("th", {
											scope: "col",
											className: "w-24 whitespace-nowrap px-4 py-2.5 text-left font-medium lg:px-[22px]",
											children: "原榜名次"
										}),
										/* @__PURE__ */ jsx("th", {
											scope: "col",
											className: "px-3 py-2.5 text-left font-medium",
											children: "原榜型号"
										}),
										/* @__PURE__ */ jsx("th", {
											scope: "col",
											className: "px-3 py-2.5 text-left font-medium",
											children: "原始成绩"
										}),
										/* @__PURE__ */ jsx("th", {
											scope: "col",
											className: "px-4 py-2.5 text-left font-medium lg:px-[22px]",
											children: d.systemRows ? "运行配置" : "代表配置"
										})
									]
								})
							}), /* @__PURE__ */ jsx("tbody", { children: d.rows.map((r, i) => /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-line last:border-0 transition-colors hover:bg-accent-softer",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "mono px-4 py-3.5 text-[13px] text-ink-4 lg:px-[22px]",
										children: r.sourceRank ?? "—"
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "px-3 py-3.5",
										children: [r.modelSlug ? /* @__PURE__ */ jsx(Link, {
											to: `/leaderboard/${r.modelSlug}`,
											className: "mono break-all text-[12.5px] font-semibold text-ink transition-colors hover:text-accent",
											children: r.sourceModelName
										}) : /* @__PURE__ */ jsx("span", {
											className: "mono break-all text-[12.5px] font-semibold text-ink-2",
											children: r.sourceModelName
										}), /* @__PURE__ */ jsx("span", {
											className: "block text-[11.5px] text-ink-4",
											children: r.provider ?? "—"
										})]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "mono px-3 py-3.5 text-[15px] font-medium text-ink",
										children: r.display
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5 text-[12.5px] text-ink-3 lg:px-[22px]",
										children: r.configurationLabel ?? "—"
									})
								]
							}, `${r.sourceModelName}-${i}`)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("details", {
				className: "disclosure group mt-6 border-y border-line",
				children: [/* @__PURE__ */ jsxs("summary", {
					className: "flex items-center justify-between py-4 text-[14px] font-semibold text-ink",
					children: ["评测局限与数据署名", /* @__PURE__ */ jsx(IconChevronDown, {
						size: 16,
						className: "text-ink-4 transition-transform duration-200 group-open:rotate-180"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-2 pb-5 text-[13px] leading-relaxed text-ink-3",
					children: [
						/* @__PURE__ */ jsx("p", { children: source.limits }),
						/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-ink-4",
							children: "数据许可："
						}), source.license] }),
						/* @__PURE__ */ jsx("p", {
							className: "text-ink-4",
							children: source.attribution
						})
					]
				})]
			})
		]
	});
});
//#endregion
//#region app/routes/leaderboard-rules.tsx
var leaderboard_rules_exports = /* @__PURE__ */ __exportAll({
	default: () => leaderboard_rules_default,
	headers: () => headers$3,
	loader: () => loader$16,
	meta: () => meta$16
});
async function loader$16({ request }) {
	return loadOr404("/api/site/leaderboard/rules", { signal: request.signal });
}
function meta$16() {
	return pageMeta({
		title: "共识指数计算方法",
		description: `查看 ${SITE.name} 模型榜如何核验公开成绩、比较共同参评结果、处理缺失证据，并确定排名和 0—100 共识指数。`,
		path: "/leaderboard/rules",
		image: "/og/pages/leaderboard.png",
		jsonLd: breadcrumbLd([{
			name: "模型榜",
			path: "/leaderboard"
		}, {
			name: "排名怎么算",
			path: "/leaderboard/rules"
		}])
	});
}
function headers$3() {
	return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600" };
}
var STEPS = [
	{
		n: "01",
		title: "先确认，是同一个模型",
		body: "统一各家榜单的名称和版本。同一模型的不同推理档位只选一个代表配置，选择规则预先确定，不挑最高分。匿名测试代号和混用其他模型完成任务的成绩排除；已正式公开的 Preview 版本可以参加。"
	},
	{
		n: "02",
		title: "让真正测过的模型相互比较",
		body: "只比较同一评测中的真实成绩。双方都有公开误差时，误差范围内的微小差异更接近平局，不当成确定胜负。没有测到，就没有这一场比较。"
	},
	{
		n: "03",
		title: "先定票权，再汇总共同意见",
		body: "每项评测使用预先确定的预算。综合榜至少要求三家评测机构、三个证据家族与三个专项覆盖；同一来源重复抓取或展示切片，不会凭空增加票权。"
	},
	{
		n: "04",
		title: "寻找冲突最少的完整排名",
		body: "不同评测的意见可能冲突。我们选择违背共同证据净票权最少的一条顺序，再单独计算展示指数。缺测不补零分，也不猜测未公开的成绩。"
	}
];
var FAQ = [
	{
		q: "为什么有的模型证据较少，也能上榜？",
		a: "评测数量与能力是两件事。综合榜至少需要三家机构与跨能力证据。多数分类要求两家机构，知识采用同一机构的两项评测并明确说明。缺测不记零分，但仍可能造成偏差。"
	},
	{
		q: "“证据敏感”是什么意思？",
		a: "删去一项评测或一家机构、将单项权重上下调整 20%、或改变误差处理后，名次范围达到三名或以上、某些情景失去参评资格，或有对照未完成，就会提示证据敏感。详情页的情景范围不是 95% 置信区间，不包含未知成绩。"
	},
	{
		q: "前面的模型一定在两两比较中获胜吗？",
		a: "不一定。A 可能胜 B，B 胜 C，C 又胜 A。完整榜单要权衡这些冲突；非相邻名次可能与单独比较不同。数学最优表示按当前规则的总冲突最少，不表示已证明所有真实工作中的能力顺序。"
	},
	{
		q: "为什么排名可能和我的体验不同？",
		a: "榜单汇集公开评测，反映这些证据支持的综合能力。实际体验还受产品版本、推理档位、工具环境和长任务稳定性影响。我们会用新评测检验旧排名；分数接近时，不应把一两名之差理解成明显强弱。"
	},
	{
		q: "新模型什么时候会出现？",
		a: `${SITE.name} 每天检查四次上游结果。只有评测方实际发布了新模型的成绩，才能用于排名；网页刷新、价格更新或我们的抓取时间，都不算重新评测。`
	},
	{
		q: "某家榜单暂时打不开，会怎样？",
		a: "仍有效的来源快照可继续使用。相同评测版本内，临时漏行最多沿用最近七天已核验的记录；仍在公开榜中保留的有效成绩，不因数值长期不变被删除。官方撤回、更正、换版会相应失效或替换，不保留历史最高分。整轮计算失败时保留上一轮有效榜及原时间。"
	},
	{
		q: "综合指数会和专项评测重复计分吗？",
		a: "我们根据公开的题库与方法说明检查重叠，并限制相关来源的总份额；无法确认的相关性仍是局限。当前 AA 指数占 30%；Arena 整体文本与创作专项共享原有 10% 真人偏好份额，各占 5%。两项有重叠投票，因此仍算同一个证据家族，不假装是两家独立评测。"
	},
	{
		q: "价格或速度会影响排名吗？",
		a: "都不会。价格只供你了解 API 的使用成本，统一按每百万 Token 展示，并保留厂商官方来源。它不代表订阅费用。"
	}
];
var SECTIONS = [
	["#rules-steps", "四步得出排名"],
	["#rules-budgets", "证据怎么分配"],
	["#rules-faq", "常见问题"],
	["#rules-details", "计算细节"]
];
/** One question or detail block: a hairline row that opens in place. */
function Disclosure({ summary, children, defaultOpen = false }) {
	return /* @__PURE__ */ jsxs("details", {
		className: "disclosure group border-b border-line",
		open: defaultOpen,
		children: [/* @__PURE__ */ jsxs("summary", {
			className: "flex items-center justify-between gap-3 py-4 text-[14px] font-semibold text-ink transition-colors hover:text-accent",
			children: [summary, /* @__PURE__ */ jsx("span", {
				className: "shrink-0 text-[18px] font-normal leading-none text-ink-4 transition-transform duration-200 group-open:rotate-45",
				"aria-hidden": "true",
				children: "+"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "max-w-[64em] pb-5 text-[13px] leading-[1.8] text-ink-3",
			children
		})]
	});
}
function Eyebrow$1({ children }) {
	return /* @__PURE__ */ jsx("span", {
		className: "mono text-[11px] font-semibold tracking-[0.14em] text-accent",
		children
	});
}
var leaderboard_rules_default = UNSAFE_withComponentProps(function LeaderboardRulesPage() {
	const { run, budgets, anchors } = useLoaderData();
	const aside = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(AsideCard, {
			title: "本页内容",
			className: "hidden lg:block",
			children: /* @__PURE__ */ jsx("nav", {
				"aria-label": "本页内容",
				className: "-mx-2 -mb-1",
				children: SECTIONS.map(([href, label]) => /* @__PURE__ */ jsx("a", {
					href,
					className: "block rounded-control px-2 py-2 text-[13.5px] text-ink-2 transition-colors hover:bg-bg-sunk hover:text-ink",
					children: label
				}, href))
			})
		}),
		/* @__PURE__ */ jsx(AsideCard, {
			title: "当前方法",
			children: /* @__PURE__ */ jsxs("dl", {
				className: "space-y-2 text-[12.5px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ jsx("dt", {
						className: "w-14 shrink-0 text-ink-4",
						children: "方法版本"
					}), /* @__PURE__ */ jsx("dd", {
						className: "mono min-w-0 text-ink-2",
						children: run.methodologyVersion
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ jsx("dt", {
						className: "w-14 shrink-0 text-ink-4",
						children: "本轮计算"
					}), /* @__PURE__ */ jsx("dd", {
						className: "mono min-w-0 text-ink-2",
						children: fullDateTime(run.generatedAt)
					})]
				})]
			})
		}),
		/* @__PURE__ */ jsx(AsideCard, {
			title: "继续看",
			children: /* @__PURE__ */ jsx("nav", {
				"aria-label": "继续看",
				className: "-mx-2 -mb-1",
				children: [["/leaderboard", "模型榜"], ["/leaderboard/sources", "每一份评测证据"]].map(([to, label]) => /* @__PURE__ */ jsxs(Link, {
					to,
					prefetch: "intent",
					className: "flex items-center justify-between rounded-control px-2 py-2 text-[13.5px] text-ink-2 transition-colors hover:bg-bg-sunk hover:text-ink",
					children: [label, /* @__PURE__ */ jsx(IconChevronRight, {
						size: 14,
						className: "text-ink-4"
					})]
				}, to))
			})
		})
	] });
	return /* @__PURE__ */ jsxs(ReadingLayout, {
		aside,
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/leaderboard",
				className: "inline-flex items-center gap-1.5 py-2 text-[13px] text-ink-3 transition-colors hover:text-accent",
				children: [/* @__PURE__ */ jsx(IconArrowLeft, { size: 14 }), " 返回模型榜"]
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "pt-3",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[24px] font-semibold leading-[1.3] text-ink",
					children: "排名怎么算"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-[13px] text-ink-3",
					children: "综合多家公开评测，了解排名背后的证据与方法。"
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-6 grid items-center gap-5 rounded-panel border border-line-soft bg-bg-sunk px-6 py-7 dark:bg-bg-muted/40 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:px-10 md:py-9 lg:grid-cols-1 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ jsx("p", {
					className: "mono text-[44px] font-medium leading-none tracking-[-0.04em] text-accent md:text-center md:text-[52px]",
					children: "0—100"
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-[17px] font-bold text-ink",
						children: "共同的证据，清楚的顺序。"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2.5 text-[13px] leading-[1.8] text-ink-3",
						children: "综合多家公开评测，在完整排名中尽量减少与已知成绩的冲突。综合榜和四类榜单都最多展示前 30 名。"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-[13px] leading-[1.8] text-ink-3",
						children: "共识指数把支持原排名的证据差异换算为 0—100，方便比较，不是正确率或能力差距的百分比。支持接近时可以同分，名次仍由完整证据决定。"
					})
				] })]
			}),
			/* @__PURE__ */ jsx("ol", {
				id: "rules-steps",
				className: "mt-8 grid scroll-mt-6 gap-x-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
				children: STEPS.map((s) => /* @__PURE__ */ jsxs("li", {
					className: "border-b border-line py-5",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "mono text-[11px] text-ink-4",
							children: s.n
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-2 text-[15px] font-bold text-ink",
							children: s.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1.5 text-[13px] leading-[1.8] text-ink-3",
							children: s.body
						})
					]
				}, s.n))
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "rules-budgets",
				className: "mt-12 scroll-mt-6",
				children: [
					/* @__PURE__ */ jsx(Eyebrow$1, { children: "A BALANCED VIEW" }),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-2 text-[20px] font-bold text-ink",
						children: "综合测试、真人盲选、专项评测，一起看。"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 max-w-[64em] text-[13px] leading-[1.8] text-ink-3",
						children: "综合评测占 30%，真人盲选占 10%，各项专项评测合计占 60%。新增评测先核对公开说明中的重叠关系，再从对应份额中分配；缺失份额不转给其他评测。"
					}),
					/* @__PURE__ */ jsx("ul", {
						className: "mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
						"aria-label": "证据预算分配",
						children: budgets.map((b) => /* @__PURE__ */ jsxs("li", {
							className: "card flex flex-col p-4 lg:p-5",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[13.5px] font-semibold text-ink",
									children: b.name
								}), /* @__PURE__ */ jsx("span", {
									className: "mono text-[20px] font-medium text-ink",
									children: pct$1(b.weight, 0)
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: "mt-2.5 text-[11.5px] leading-[1.7] text-ink-4",
								children: b.sources.join(" · ") || "—"
							})]
						}, b.key))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-[64em] text-[12.5px] leading-[1.8] text-ink-3",
						children: "编程、推理、知识、专业办公分别寻找真实评测，分类分独立计算。视觉理解与多语言证据继续保留在综合榜；调整分类名称不会增加同一份成绩的投票权。综合分不等于分类分的算术平均。分类通常至少有两项有效评测、五个可比较型号才展示。知识目前由 Epoch 的两套评测支持，并明确说明同机构的局限。创作偏好、网页开发等证据继续用于综合榜，首版不单设审美和写作榜。"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "rules-faq",
				className: "mt-12 scroll-mt-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[20px] font-bold text-ink",
					children: "你可能还想知道"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 border-t border-line",
					children: FAQ.map((f) => /* @__PURE__ */ jsx(Disclosure, {
						summary: f.q,
						children: f.a
					}, f.q))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "rules-details",
				className: "mt-10 scroll-mt-6 border-t border-line",
				children: /* @__PURE__ */ jsx(Disclosure, {
					summary: "查看计算细节与当前版本",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("p", { children: [
								"方法版本：",
								/* @__PURE__ */ jsx("code", {
									className: "mono rounded-mark bg-bg-sunk px-1.5 py-0.5 text-[12px] text-ink-2",
									children: run.methodologyVersion
								}),
								"。采用加权不完整 Kemeny 排序。每对共同参评模型汇总净支持 M；目标是最小化所有被排反的净支持之和。整数优化返回最优状态和目标上下界，只有完整通过验证的结果才用于正式发布。"
							] }),
							/* @__PURE__ */ jsx("p", { children: "双方有明确标准误时，净支持取 2Φ(分差 / 合成标准误) − 1，默认零协方差；其他比较只取原始领先方向。未知误差并非零误差，小分差按序数处理仍是局限。票权针对潜在模型对，覆盖型号多的来源会使用更多比较位置，不能把名义预算解读为最终名次的精确贡献率。" }),
							/* @__PURE__ */ jsx("p", { children: "展示指数保留原排序：逐对反转相邻模型的先后，允许其余模型重排，计算最少增加的逆向净支持。沿原排名累加这些非负支持差，再相对固定参照组用 sigmoid 映射到 0—100。替代顺序同样最优时保留零间距，显示保留一位小数，不人为设置最低分差。指数不参与反向排序；入榜集合、参照型号与证据变化仍会影响指数，分差不等于真实能力距离。同代价求解固定型号 ID 次序；整数优化使用 HiGHS 求解器（highs 1.15.3），误差换算的正态分布函数与 SciPy norm.cdf 采用同一算法；来源、协议、参评资格和每轮计算输入均保存版本。未连接到共同证据网络时不发布跨分量的假精确顺序。" }),
							/* @__PURE__ */ jsxs("p", { children: [
								"固定参照型号：",
								/* @__PURE__ */ jsx("span", {
									className: "mono text-[12px] text-ink-2",
									children: anchors.join("、")
								}),
								"。参照组用于指数尺度，不指定任何厂商应排第几；不同分类的指数不直接比较。"
							] })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/leaderboard/sources",
				className: "mt-8 inline-flex items-center gap-1 text-[13.5px] font-medium text-accent hover:text-accent-ink",
				children: "查看每一份评测证据 →"
			})
		]
	});
});
//#endregion
//#region app/routes/leaderboard-model.tsx
var leaderboard_model_exports = /* @__PURE__ */ __exportAll({
	default: () => leaderboard_model_default,
	headers: () => headers$2,
	loader: () => loader$15,
	meta: () => meta$15
});
async function loader$15({ params, request }) {
	return loadOr404(`/api/site/leaderboard/models/${encodeURIComponent(params.slug)}`, { signal: request.signal });
}
function meta$15({ loaderData }) {
	if (!loaderData) return [{ title: titled("页面不存在") }];
	const { model } = loaderData;
	const path = `/leaderboard/${model.slug}`;
	return pageMeta({
		title: `${model.name} 排名与各榜成绩`,
		description: `查看 ${model.name} 的 ${SITE.name} 共识分、当前排名，以及它在各家公开评测榜单中的名次和原始分数。`,
		path,
		image: "/og/pages/leaderboard.png",
		jsonLd: [{
			"@context": "https://schema.org",
			"@type": "Dataset",
			name: `${model.name} 在 ${SITE.name} 模型榜的成绩`,
			description: `${model.name} 的共识指数、分类名次与各项公开评测的原始成绩。`,
			url: `${siteUrl()}${path}`,
			creator: {
				"@type": "Organization",
				name: SITE.name,
				url: siteUrl()
			},
			isAccessibleForFree: true
		}, breadcrumbLd([{
			name: "模型榜",
			path: "/leaderboard"
		}, {
			name: model.name,
			path
		}])]
	});
}
function headers$2() {
	return { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=600" };
}
function Eyebrow({ children }) {
	return /* @__PURE__ */ jsx("span", {
		className: "mono text-[11px] font-semibold tracking-[0.14em] text-accent",
		children
	});
}
function SectionHead({ eyebrow, title, sub }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Eyebrow, { children: eyebrow }),
		/* @__PURE__ */ jsx("h2", {
			className: "mt-2 text-[20px] font-bold leading-[1.5] text-ink",
			children: title
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-1 text-[13px] text-ink-3",
			children: sub
		})
	] });
}
function Stat$1({ label, children, foot }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 flex-col",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-[11px] text-ink-4",
				children: label
			}),
			/* @__PURE__ */ jsx("span", {
				className: "mono mt-2 text-[20px] font-semibold leading-tight text-ink",
				children
			}),
			foot && /* @__PURE__ */ jsx("span", {
				className: "mt-1.5 text-[12px] text-ink-3",
				children: foot
			})
		]
	});
}
function Capability({ d, from }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-12",
		children: [
			/* @__PURE__ */ jsx(SectionHead, {
				eyebrow: "CAPABILITY PROFILE",
				title: "各有所长，看得更清楚。",
				sub: "每项能力单独计算。没有足够的实测，就留空。"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: d.categories.map((c) => /* @__PURE__ */ jsxs(Link, {
					to: boardHref(c.key),
					className: `card card-hover group flex h-full flex-col rounded-card p-4 lg:p-[22px] ${c.key === from ? "border-accent/45" : ""}`,
					children: [/* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[14px] font-semibold text-ink transition-colors group-hover:text-accent",
							children: c.name
						}), c.rank !== null ? /* @__PURE__ */ jsx("span", {
							className: `mono text-[11.5px] font-semibold ${c.onBoard ? "text-accent" : "text-ink-4"}`,
							children: c.onBoard ? `#${c.rank}` : "30 名之外"
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-ink-4",
							children: "证据待补齐"
						})]
					}), c.score !== null ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "mono mt-4 text-[32px] font-medium leading-none tracking-[-0.03em] text-ink",
						children: c.score.toFixed(1)
					}), /* @__PURE__ */ jsxs("span", {
						className: "mt-auto pt-4 text-[12px] text-ink-3",
						children: [c.sourceCount, " 项评测支持"]
					})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "mono mt-4 text-[32px] font-medium leading-none text-ink-4",
						children: "—"
					}), /* @__PURE__ */ jsx("span", {
						className: "mt-auto pt-4 text-[12px] text-ink-4",
						children: "暂无足够的可比成绩"
					})] })]
				}, c.key))
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-[12px] text-ink-4",
				children: "不同分类的分数反映各自参照组中的排序支持，不能直接相加或用来比较不同能力的绝对高低。"
			})
		]
	});
}
function Stability({ d }) {
	const s = d.overall.stability;
	const rank = d.overall.rank;
	if (!s || rank === null) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-12",
		children: [
			/* @__PURE__ */ jsx(SectionHead, {
				eyebrow: "UNDERSTANDING THE RANK",
				title: "综合名次，有多稳定？",
				sub: "依次移除一项评测或一家机构、调整单项权重与误差处理，观察排名怎样变化。"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid gap-5 border-b border-line pb-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-[12px] text-ink-4",
						children: "重新检查资格后的名次"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "mt-1 block text-[30px] font-bold leading-tight text-ink",
						children: s.from === s.to ? `第 ${s.from} 名` : `${s.from}—${s.to} 名`
					}),
					d.overall.confidence && /* @__PURE__ */ jsx("span", {
						className: "mt-1 block",
						children: /* @__PURE__ */ jsx(EvidenceBadge, {
							confidence: d.overall.confidence,
							stability: null,
							rank
						})
					})
				] }), /* @__PURE__ */ jsx("div", {
					className: "min-w-0",
					children: /* @__PURE__ */ jsxs("p", {
						className: "text-[13px] leading-relaxed text-ink-3",
						children: [
							s.unavailable > 0 ? `${s.unavailable} 个情景下参评证据不足。` : s.incomplete > 0 ? `${s.incomplete} 个对照未完成。` : "已完成的对照中均具备参评资格。",
							"保持原候选不变时为 ",
							s.fixedFrom,
							"—",
							s.fixedTo,
							" 名。这个范围不是置信区间，也不包含从未公开的成绩。"
						]
					})
				})]
			}),
			d.comparisons.length > 0 && /* @__PURE__ */ jsx(Comparisons, { d })
		]
	});
}
/** Net support in shared evaluations, as a signed number: positive favours this model. */
function NetValue({ net }) {
	const v = Math.round(net * 100) / 100;
	if (v === 0) return /* @__PURE__ */ jsx("span", {
		className: "text-[12px] text-ink-4",
		children: "持平"
	});
	return /* @__PURE__ */ jsx("span", {
		className: `mono text-[12.5px] font-semibold ${v > 0 ? "text-accent" : "text-amber-ink"}`,
		children: v > 0 ? `+${v.toFixed(2)}` : `−${Math.abs(v).toFixed(2)}`
	});
}
function Comparisons({ d }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-line",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			className: "flex w-full items-center justify-between py-4 text-left",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[13.5px] font-semibold text-ink",
				children: "查看与附近模型的共同证据"
			}), /* @__PURE__ */ jsx("span", {
				className: `text-[18px] leading-none text-ink-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`,
				children: "+"
			})]
		}), /* @__PURE__ */ jsxs(Collapse, {
			open,
			duration: 300,
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-[13px] text-ink-3",
				children: "净支持只看双方共同参加的评测。全局排序还需处理其他模型间的冲突，因此非相邻名次可能与单独比较不同。"
			}), /* @__PURE__ */ jsx("ul", {
				className: "-mx-3 divide-y divide-line-soft pb-3 pt-2",
				children: d.comparisons.map((c) => /* @__PURE__ */ jsx(ComparisonRow, {
					c,
					name: d.model.name
				}, c.model.slug))
			})]
		})]
	});
}
function ComparisonRow({ c, name }) {
	const [open, setOpen] = useState(false);
	const favours = c.net > 1e-9 ? "共同证据支持本模型" : c.net < -1e-9 ? "共同证据支持对方" : "共同证据持平";
	return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: () => setOpen((v) => !v),
		"aria-expanded": open,
		className: "flex w-full items-center gap-3 rounded-tile px-3 py-3 text-left transition-colors hover:bg-bg-sunk",
		children: [
			/* @__PURE__ */ jsx(BrandMark, {
				brand: c.model.brand,
				size: 26
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "block truncate text-[14px] font-medium text-ink",
					children: [
						c.model.name,
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "num text-[12px] text-ink-4",
							children: ["#", c.rank]
						})
					]
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[12px] text-ink-3",
					children: [
						c.sharedCount,
						" 项共同评测 · ",
						favours
					]
				})]
			}),
			/* @__PURE__ */ jsx(NetValue, { net: c.net }),
			/* @__PURE__ */ jsx("span", {
				className: `text-ink-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`,
				children: /* @__PURE__ */ jsx(IconChevronDown, { size: 15 })
			})
		]
	}), /* @__PURE__ */ jsx(Collapse, {
		open,
		duration: 300,
		children: /* @__PURE__ */ jsxs("div", {
			className: "px-3 pb-4",
			children: [
				/* @__PURE__ */ jsxs("p", {
					className: "text-[12.5px] leading-relaxed text-ink-3",
					children: [
						"双方共同拥有当前榜单 ",
						pctFixed(c.sharedWeight),
						" 的名义票权。下表展示各项评测采用的成绩，已知误差的软化处理会影响净支持，不只数赢了几项。"
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[420px] text-[12.5px]",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-ink-4",
							children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-line",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2 text-left font-medium",
										children: "共同评测"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2 text-right font-medium",
										children: name
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2 text-right font-medium",
										children: c.model.name
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2 text-right font-medium",
										children: "票权"
									})
								]
							})
						}), /* @__PURE__ */ jsx("tbody", { children: c.rows.map((r) => /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-line last:border-0",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-2 pr-2",
									children: /* @__PURE__ */ jsx(Link, {
										to: `/leaderboard/sources/${r.sourceKey}`,
										className: "text-ink-2 hover:text-accent",
										children: r.sourceName
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "num py-2 text-right text-ink",
									children: r.mine
								}),
								/* @__PURE__ */ jsx("td", {
									className: "num py-2 text-right text-ink-2",
									children: r.theirs
								}),
								/* @__PURE__ */ jsx("td", {
									className: "num py-2 text-right text-ink-4",
									children: pctFixed(r.weight)
								})
							]
						}, r.sourceKey)) })]
					})
				}),
				c.hasPage && /* @__PURE__ */ jsxs(Link, {
					to: `/leaderboard/${c.model.slug}`,
					className: "mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-accent",
					children: [
						"查看 ",
						c.model.name,
						" 的完整证据 ",
						/* @__PURE__ */ jsx(IconArrowRight, { size: 13 })
					]
				})
			]
		})
	})] });
}
function EvidenceCard({ it }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("li", {
		className: "card overflow-hidden rounded-tile",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			className: "flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-accent-softer lg:px-5",
			children: [
				/* @__PURE__ */ jsx(BrandMark, {
					brand: it.brand,
					size: 28,
					className: "max-sm:hidden"
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block truncate text-[13.5px] font-semibold text-ink",
						children: it.sourceName
					}), /* @__PURE__ */ jsx("small", {
						className: "text-[11px] text-ink-4",
						children: it.usage
					})]
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "text-right",
					children: [/* @__PURE__ */ jsx("span", {
						className: "mono block text-[19px] font-medium leading-tight text-ink",
						children: it.display
					}), it.displayNote && /* @__PURE__ */ jsx("span", {
						className: "block text-[11px] text-ink-4",
						children: it.displayNote
					})]
				}),
				/* @__PURE__ */ jsx("span", {
					className: `grid size-6 shrink-0 place-items-center text-[17px] leading-none text-ink-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`,
					children: "+"
				})
			]
		}), /* @__PURE__ */ jsx(Collapse, {
			open,
			duration: 300,
			children: /* @__PURE__ */ jsxs("dl", {
				className: "grid gap-3 border-t border-line-soft px-4 py-4 text-[12.5px] sm:grid-cols-2 lg:px-5",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
						className: "text-ink-4",
						children: "原榜型号"
					}), /* @__PURE__ */ jsxs("dd", {
						className: "mt-0.5 break-all font-mono text-[12px] text-ink-2",
						children: [it.sourceModelName ?? "—", it.sourceRank !== null && /* @__PURE__ */ jsxs("span", {
							className: "ml-1.5 font-sans text-ink-4",
							children: [
								"原榜第 ",
								it.sourceRank,
								" 名"
							]
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
						className: "text-ink-4",
						children: "代表配置"
					}), /* @__PURE__ */ jsx("dd", {
						className: "mt-0.5 text-ink-2",
						children: it.configurationLabel ?? "—"
					})] }),
					it.selectionReason && /* @__PURE__ */ jsx("p", {
						className: "text-ink-3 sm:col-span-2",
						children: it.selectionReason
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ jsx("dt", {
							className: "text-ink-4",
							children: "本轮采用记录"
						}), /* @__PURE__ */ jsxs("dd", {
							className: "num mt-0.5 text-ink-2",
							children: [
								"来源数据 ",
								shortStamp(it.upstreamAt),
								" · 核验 ",
								shortStamp(it.verifiedAt),
								" · ",
								it.measuredAt ? `实测 ${shortStamp(it.measuredAt)}` : "实测日期未公开",
								it.carriedForward && " · 沿用最近一次已核验记录"
							]
						})]
					}),
					it.components.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [it.componentsNote && /* @__PURE__ */ jsx("p", {
							className: "text-ink-3",
							children: it.componentsNote
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-2 flex gap-2",
							children: it.components.map((c) => /* @__PURE__ */ jsxs("span", {
								className: "rounded-control bg-bg-sunk px-3 py-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "block text-[11px] text-ink-4",
									children: c.label
								}), /* @__PURE__ */ jsx("span", {
									className: "num text-[14px] font-semibold text-ink",
									children: c.display
								})]
							}, c.label))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-4 sm:col-span-2",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: `/leaderboard/sources/${it.sourceKey}`,
							className: "inline-flex items-center gap-1 font-medium text-accent",
							children: ["查看这项评测 ", /* @__PURE__ */ jsx(IconArrowRight, { size: 13 })]
						}), it.officialUrl && /* @__PURE__ */ jsxs("a", {
							href: it.officialUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1 text-ink-3 hover:text-accent",
							children: ["官方来源 ", /* @__PURE__ */ jsx(IconExternal, { size: 12 })]
						})]
					})
				]
			})
		})]
	});
}
var leaderboard_model_default = UNSAFE_withComponentProps(function LeaderboardModelPage() {
	const d = useLoaderData();
	const [params] = useSearchParams();
	const [fromParam, setFromParam] = useState(null);
	useEffect(() => setFromParam(params.get("from")), [params]);
	const from = fromParam && LEADERBOARD_PUBLIC_BOARDS.includes(fromParam) ? fromParam : "overall";
	const { model, price, overall } = d;
	const withScores = d.categories.filter((c) => c.score !== null).length;
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: boardHref(from),
				className: "mt-4 inline-flex items-center gap-1.5 py-2 text-[13px] text-ink-3 transition-colors hover:text-accent lg:mt-0",
				children: [
					/* @__PURE__ */ jsx(IconArrowLeft, { size: 14 }),
					" 返回",
					LEADERBOARD_BOARD_LABELS[from],
					"榜"
				]
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "mt-5 flex flex-col gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx(BrandMark, {
						brand: model.brand,
						size: 52
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-[24px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink",
							children: model.name
						}), /* @__PURE__ */ jsxs("p", {
							className: "num mt-1 text-[12.5px] text-ink-3",
							children: [
								model.provider ?? "—",
								" · ",
								model.releasedAt ? `${model.releasedAt} 发布` : "发布日期待核实",
								" · ",
								shortStamp(d.run.generatedAt),
								" 更新"
							]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "sm:text-right",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "block text-[12px] text-ink-4",
							children: "综合共识指数"
						}),
						/* @__PURE__ */ jsx("strong", {
							className: "mono block text-[48px] font-medium leading-[1.25] tracking-[-0.055em] text-accent lg:text-[55px]",
							children: overall.score !== null ? overall.score.toFixed(1) : "—"
						}),
						/* @__PURE__ */ jsx("b", {
							className: `text-[12px] font-medium ${overall.onBoard ? "text-ink-3" : "text-ink-4"}`,
							children: overall.rank === null ? "未进入综合榜" : overall.onBoard ? `综合榜第 ${overall.rank} 名` : "综合榜前 30 名之外"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-2 gap-x-4 gap-y-6 border-y border-line py-6 lg:grid-cols-4",
				"aria-label": "模型概览",
				children: [
					/* @__PURE__ */ jsxs(Stat$1, {
						label: "分类成绩",
						children: [withScores, /* @__PURE__ */ jsx("small", {
							className: "ml-1 font-sans text-[11px] font-normal text-ink-4",
							children: "/ 4 项分类"
						})]
					}),
					/* @__PURE__ */ jsxs(Stat$1, {
						label: "已有成绩",
						children: [d.metricCount, /* @__PURE__ */ jsx("small", {
							className: "ml-1 font-sans text-[11px] font-normal text-ink-4",
							children: "项评测"
						})]
					}),
					/* @__PURE__ */ jsxs(Stat$1, {
						label: "上下文窗口",
						children: [tokensWan(model.contextWindowTokens), /* @__PURE__ */ jsx("small", {
							className: "ml-1 font-sans text-[11px] font-normal text-ink-4",
							children: "Token"
						})]
					}),
					/* @__PURE__ */ jsx(Stat$1, {
						label: "API 输入 / 输出 · 每百万 Token",
						foot: price ? /* @__PURE__ */ jsxs("span", {
							className: "flex flex-wrap items-center gap-x-2.5 gap-y-0.5",
							children: [
								price.cachedCny !== null && /* @__PURE__ */ jsxs("span", {
									className: "num",
									children: ["缓存 ", yuan(price.cachedCny)]
								}),
								price.currency === "USD" && /* @__PURE__ */ jsxs("span", {
									className: "num text-ink-4",
									children: [
										"原价 ",
										listPrice(price.input, "USD"),
										" / ",
										listPrice(price.output, "USD")
									]
								}),
								price.officialUrl && /* @__PURE__ */ jsxs("a", {
									href: price.officialUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-0.5 text-accent hover:text-accent-ink",
									children: ["厂商官方价格 ", /* @__PURE__ */ jsx(IconArrowUpRight, { size: 12 })]
								})
							]
						}) : "尚未核到厂商官网价格",
						children: price ? `${yuan(price.inputCny)} / ${yuan(price.outputCny)}` : /* @__PURE__ */ jsx("span", {
							className: "font-sans text-[15px] font-normal text-ink-4",
							children: "待核验"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Capability, {
				d,
				from
			}),
			/* @__PURE__ */ jsx(Stability, { d }),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ jsx(SectionHead, {
						eyebrow: "BEHIND THE SCORE",
						title: "每一项成绩，都有来处。",
						sub: "下面是该模型的公开汇总成绩。展开可查看运行配置与采用方式。"
					}),
					d.evidence.map((g) => /* @__PURE__ */ jsxs("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "flex items-baseline gap-2 text-[14px] font-semibold text-ink",
							children: [g.name, /* @__PURE__ */ jsxs("span", {
								className: "num text-[11.5px] font-normal text-ink-4",
								children: [g.items.length, " 项"]
							})]
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-2.5 space-y-2",
							children: g.items.map((it) => /* @__PURE__ */ jsx(EvidenceCard, { it }, it.sourceKey))
						})]
					}, g.key)),
					d.unmeasured.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-[14px] font-semibold text-ink",
								children: "没有测到的计分评测"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[12.5px] text-ink-3",
								children: "这些评测没有公开该模型的成绩，缺测不记零分。"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2.5 flex flex-wrap gap-1.5",
								children: d.unmeasured.map((u) => /* @__PURE__ */ jsx(Link, {
									to: `/leaderboard/sources/${u.key}`,
									className: "chip",
									children: u.name
								}, u.key))
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-10 border-t border-line pt-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-[15px] font-semibold text-ink",
						children: "还有一些未知"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-[13px] leading-relaxed text-ink-3",
						children: "缺失的评测不会记成零分。模型的名次会随新证据变化，分数相近时不宜过度解读细小差距。"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/leaderboard/rules",
						className: "mt-2.5 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-ink",
						children: "了解计算方法 →"
					})
				]
			})
		]
	});
});
//#endregion
//#region app/routes/admin-login.tsx
var admin_login_exports = /* @__PURE__ */ __exportAll({
	default: () => admin_login_default,
	headers: () => headers$1,
	loader: () => loader$14,
	meta: () => meta$14
});
var ERRORS = {
	wrong: "密码不对，再试一次。",
	unset: "还没有设置管理员密码：在 .env 里设置 ADMIN_PASSWORD（至少 12 位），重启后再登录。",
	"too-many": "尝试次数太多，请 15 分钟后再试。"
};
async function loader$14({ request }) {
	const url = new URL(request.url);
	const returnTo = url.searchParams.get("return") ?? "/admin";
	const options = await apiGet("/api/auth/options", { signal: request.signal }).catch(() => ({
		password: true,
		feishu: false
	}));
	return {
		returnTo: returnTo.startsWith("/admin") ? returnTo : "/admin",
		error: url.searchParams.get("error"),
		...options
	};
}
var meta$14 = () => [{ title: `登录 · ${SITE.name} 后台` }, {
	name: "robots",
	content: "noindex, nofollow"
}];
var headers$1 = () => ({
	"Cache-Control": "no-store",
	"X-Robots-Tag": "noindex, nofollow"
});
var admin_login_default = UNSAFE_withComponentProps(function AdminLogin() {
	const { returnTo, error, password, feishu } = useLoaderData();
	const message = error ? ERRORS[error] ?? ERRORS.wrong : !password ? ERRORS.unset : null;
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-[360px]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ jsx(Wordmark, {
						size: 26,
						className: "text-ink"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[15px] font-semibold text-ink-3",
						children: "后台"
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					method: "post",
					action: "/api/auth/password",
					className: "card mt-8 p-6",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "hidden",
							name: "return",
							value: returnTo
						}),
						/* @__PURE__ */ jsx("label", {
							htmlFor: "password",
							className: "block text-[13px] font-medium text-ink-2",
							children: "管理员密码"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "password",
							name: "password",
							type: "password",
							autoComplete: "current-password",
							required: true,
							autoFocus: true,
							className: "mt-2 h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-[14px] text-ink outline-none transition-colors focus:border-accent"
						}),
						message && /* @__PURE__ */ jsx("p", {
							role: "alert",
							className: "mt-3 text-[12.5px] leading-relaxed text-hot",
							children: message
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: `${buttonClass("primary", "lg")} mt-5 w-full`,
							children: "登录"
						}),
						feishu && /* @__PURE__ */ jsx("a", {
							href: `/api/auth/feishu?${new URLSearchParams({ return: returnTo })}`,
							className: `${buttonClass("secondary", "lg")} mt-3 w-full`,
							children: "用飞书登录"
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-[12px] text-ink-4",
					children: /* @__PURE__ */ jsxs("a", {
						href: "/",
						className: "hover:text-ink-2",
						children: ["回到 ", SITE.name]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/features/admin/toast.tsx
var listeners = [];
var items = [];
var seq = 0;
function emit() {
	for (const l of listeners) l(items);
}
function toast(text, tone = "info") {
	const id = ++seq;
	items = [...items, {
		id,
		text,
		tone
	}].slice(-4);
	emit();
	setTimeout(() => {
		items = items.filter((i) => i.id !== id);
		emit();
	}, tone === "error" ? 6500 : 3200);
}
function Toaster() {
	const [list, setList] = useState([]);
	useEffect(() => {
		listeners.push(setList);
		return () => {
			listeners = listeners.filter((l) => l !== setList);
		};
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4",
		role: "status",
		"aria-live": "polite",
		children: /* @__PURE__ */ jsx(AnimatePresence, {
			initial: false,
			children: list.map((t) => /* @__PURE__ */ jsx(motion.div, {
				layout: true,
				initial: {
					opacity: 0,
					y: 12,
					scale: .97
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					y: 6,
					scale: .98
				},
				transition: {
					duration: .22,
					ease: [
						.25,
						1,
						.5,
						1
					]
				},
				className: `pointer-events-auto max-w-md rounded-card px-4 py-2.5 text-[13.5px] shadow-lg ring-1 backdrop-blur ${t.tone === "error" ? "bg-hot text-white ring-hot/40" : t.tone === "ok" ? "bg-ink text-bg ring-line-strong" : "bg-surface text-ink ring-line-strong"}`,
				children: t.text
			}, t.id))
		})
	});
}
//#endregion
//#region app/lib/admin.server.ts
var API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:3001";
async function adminGet(request, path) {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: {
			accept: "application/json",
			cookie: request.headers.get("cookie") ?? "",
			"user-agent": request.headers.get("user-agent") ?? ""
		},
		signal: AbortSignal.any([request.signal, AbortSignal.timeout(3e4)])
	});
	if (res.status === 401) {
		const url = new URL(request.url);
		throw redirect(`/admin/login?${new URLSearchParams({ return: url.pathname + url.search })}`);
	}
	if (res.status === 404) throw data({ message: "not_found" }, { status: 404 });
	if (!res.ok) {
		let detail = `api ${res.status}`;
		try {
			detail = (await res.json()).detail ?? detail;
		} catch {}
		throw data({ message: detail }, { status: res.status >= 500 ? 503 : res.status });
	}
	return await res.json();
}
//#endregion
//#region app/routes/admin/layout.tsx
var layout_exports = /* @__PURE__ */ __exportAll({
	default: () => layout_default,
	headers: () => headers,
	loader: () => loader$13,
	meta: () => meta$13,
	shouldRevalidate: () => shouldRevalidate
});
async function loader$13({ request }) {
	const [me, counts] = await Promise.all([adminGet(request, "/api/admin/me"), adminGet(request, "/api/admin/nav-counts").catch(() => ({}))]);
	return {
		me,
		counts
	};
}
var shouldRevalidate = () => true;
var meta$13 = () => [{ title: `${SITE.name} 后台` }, {
	name: "robots",
	content: "noindex, nofollow"
}];
var headers = () => ({
	"Cache-Control": "no-store",
	"X-Robots-Tag": "noindex, nofollow"
});
var NAV = [{
	group: "内容",
	items: [
		{
			to: "/admin/content",
			label: "内容诊断"
		},
		{
			to: "/admin/sources",
			label: "信源",
			count: "sources",
			tone: "bad"
		},
		...FEATURES.codexResetMonitor ? [{
			to: "/admin/monitor",
			label: "Codex 重置",
			count: "monitor",
			tone: "accent"
		}] : [],
		{
			to: "/admin/feedback",
			label: "反馈",
			count: "feedback",
			tone: "accent"
		}
	]
}, {
	group: "系统",
	items: [
		{
			to: "/admin/runs",
			label: "运行",
			count: "runs",
			tone: "bad"
		},
		{
			to: "/admin/models",
			label: "模型与评测"
		},
		{
			to: "/admin/selectbench",
			label: "SelectBench"
		},
		{
			to: "/admin/settings",
			label: "设置"
		},
		{
			to: "/admin/audit",
			label: "审计记录"
		}
	]
}];
function NavItem({ to, label, count, tone }) {
	return /* @__PURE__ */ jsx(NavLink, {
		to,
		prefetch: "intent",
		className: "group relative block",
		children: ({ isActive }) => /* @__PURE__ */ jsxs("span", {
			className: `relative flex items-center justify-between rounded-control px-3 py-[7px] text-[13.5px] transition-colors ${isActive ? "font-medium text-ink" : "text-ink-3 hover:text-ink"}`,
			children: [
				isActive && /* @__PURE__ */ jsx(motion.span, {
					layoutId: "admin-nav",
					className: "absolute inset-0 rounded-control bg-surface shadow-sm ring-1 ring-line",
					transition: {
						type: "spring",
						stiffness: 520,
						damping: 38
					}
				}),
				/* @__PURE__ */ jsx("span", {
					className: "relative",
					children: label
				}),
				!!count && /* @__PURE__ */ jsx("span", {
					className: `num relative min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold leading-5 ${tone === "bad" ? "bg-hot text-white" : "bg-accent-soft text-accent"}`,
					children: count
				})
			]
		})
	});
}
var layout_default = UNSAFE_withComponentProps(function AdminLayout({ loaderData }) {
	const { me, counts } = loaderData;
	const navigation = useNavigation();
	const location = useLocation();
	const flat = NAV.flatMap((g) => g.items);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ jsx(NavigationProgress, { active: navigation.state === "loading" }),
			/* @__PURE__ */ jsxs("aside", {
				className: "sticky top-0 hidden h-dvh w-[216px] shrink-0 flex-col border-r border-line bg-bg-sunk/50 px-3 py-4 lg:flex",
				children: [
					/* @__PURE__ */ jsxs("a", {
						href: "/",
						className: "mb-5 flex items-center gap-2 px-2",
						children: [/* @__PURE__ */ jsx(RingMark, { className: "size-6 text-accent" }), /* @__PURE__ */ jsxs("span", {
							className: "text-[15px] font-semibold tracking-tight text-ink",
							children: [SITE.name, " 后台"]
						})]
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "flex-1 space-y-4 overflow-y-auto",
						children: NAV.map((g) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "mb-1 px-3 text-[11.5px] font-medium tracking-wide text-ink-4",
							children: g.group
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-0.5",
							children: g.items.map((i) => /* @__PURE__ */ jsx(NavItem, {
								to: i.to,
								label: i.label,
								count: i.count ? counts[i.count] : void 0,
								tone: i.tone
							}, i.to))
						})] }, g.group))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 border-t border-line px-2 pt-3 text-[12.5px] text-ink-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: me.name
							}), me.dev && /* @__PURE__ */ jsx("span", {
								className: "rounded bg-amber/15 px-1.5 text-[11px] font-medium text-amber",
								children: "开发"
							})]
						}), /* @__PURE__ */ jsx("form", {
							method: "post",
							action: "/api/auth/logout",
							className: "mt-1.5",
							children: /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "text-ink-4 hover:text-ink-2",
								children: "退出登录"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur lg:hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 px-4 pt-3",
						children: [
							/* @__PURE__ */ jsx(RingMark, { className: "size-5 text-accent" }),
							/* @__PURE__ */ jsxs("span", {
								className: "text-[14px] font-semibold text-ink",
								children: [SITE.name, " 后台"]
							}),
							me.dev && /* @__PURE__ */ jsx("span", {
								className: "rounded bg-amber/15 px-1.5 text-[11px] font-medium text-amber",
								children: "开发"
							})
						]
					}), /* @__PURE__ */ jsx("nav", {
						className: "no-scrollbar flex gap-1 overflow-x-auto px-3 py-2",
						children: flat.map((i) => {
							const active = location.pathname === i.to || location.pathname.startsWith(`${i.to}/`);
							const n = i.count ? counts[i.count] : 0;
							return /* @__PURE__ */ jsxs(NavLink, {
								to: i.to,
								className: `shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[13px] ${active ? "bg-ink text-bg" : "text-ink-3"}`,
								children: [i.label, !!n && /* @__PURE__ */ jsx("span", {
									className: "num ml-1 text-[11px] opacity-70",
									children: n
								})]
							}, i.to);
						})
					})]
				}), /* @__PURE__ */ jsx("main", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ jsx(Outlet, {})
				})]
			}),
			/* @__PURE__ */ jsx(Toaster, {})
		]
	});
});
//#endregion
//#region app/routes/admin/index.tsx
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => admin_default,
	loader: () => loader$12
});
function loader$12() {
	throw redirect("/admin/sources");
}
var admin_default = UNSAFE_withComponentProps(function AdminIndex() {
	return null;
});
//#endregion
//#region app/features/admin/labels.ts
var KIND_LABEL = {
	rss: "RSS",
	web_list: "网页列表",
	json_list: "JSON",
	x_search: "X",
	mp_account: "公众号",
	external: "外部上报"
};
var MODE_LABEL = {
	editorial: "精选",
	hot_signal: "氛围",
	isolated: "隔离"
};
var HEALTH_LABEL = {
	ok: "正常",
	degraded: "不稳定",
	failing: "失败",
	paused: "已暂停",
	unknown: "未检查"
};
var VISIBILITY_LABEL = {
	public: "公开",
	"summary-only": "仅摘要",
	withdrawn: "已下架"
};
var FEEDBACK_STATUS = {
	new: "新反馈",
	triaged: "处理中",
	replied: "已回复",
	resolved: "已解决",
	spam: "垃圾信息"
};
var TIER_LABEL = {
	T1: "T1",
	T1_5: "T1.5",
	T2: "T2",
	EXCLUDE_MP: "排除公众号"
};
//#endregion
//#region app/features/admin/format.ts
var BJ = 288e5;
function bj(iso, withYear = false) {
	if (!iso) return "—";
	const d = new Date(new Date(iso).getTime() + BJ);
	if (Number.isNaN(d.getTime())) return "—";
	const s = d.toISOString();
	return `${withYear ? `${s.slice(0, 4)}-` : ""}${s.slice(5, 10)} ${s.slice(11, 16)}`;
}
function ago(iso, now = Date.now()) {
	if (!iso) return "从未";
	const ms = now - new Date(iso).getTime();
	if (!Number.isFinite(ms)) return "—";
	const future = ms < 0;
	const a = Math.abs(ms);
	const text = a < 6e4 ? `${Math.max(1, Math.round(a / 1e3))} 秒` : a < 36e5 ? `${Math.round(a / 6e4)} 分钟` : a < 864e5 ? `${Math.round(a / 36e5)} 小时` : `${Math.round(a / 864e5)} 天`;
	return future ? `${text}后` : `${text}前`;
}
function num(n, digits = 0) {
	if (n === null || n === void 0 || n === "") return "—";
	const v = Number(n);
	if (!Number.isFinite(v)) return "—";
	return v.toLocaleString("zh-CN", {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	});
}
function money(n, currency = "CNY") {
	if (n === null || n === void 0) return "—";
	const v = Number(n);
	return `${currency === "USD" ? "$" : "¥"}${v.toLocaleString("zh-CN", {
		maximumFractionDigits: v < 10 ? 3 : 2,
		minimumFractionDigits: 2
	})}`;
}
function duration(from, to) {
	if (!from || !to) return "—";
	const ms = new Date(to).getTime() - new Date(from).getTime();
	if (ms < 1e3) return `${ms}ms`;
	if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
	return `${Math.round(ms / 6e4)}m`;
}
function pct(v, digits = 1) {
	return v === void 0 || v === null || !Number.isFinite(v) ? "—" : `${(v * 100).toFixed(digits)}%`;
}
//#endregion
//#region app/features/admin/ui.tsx
function AdminPage({ title, subtitle, actions, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-[1320px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-8",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]",
					children: title
				}), subtitle && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-[13.5px] leading-relaxed text-ink-3",
					children: subtitle
				})]
			}), actions && /* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 flex-wrap items-center gap-2",
				children: actions
			})]
		}), children]
	});
}
function Card({ title, right, children, className = "", pad = true }) {
	return /* @__PURE__ */ jsxs("section", {
		className: `rounded-panel bg-surface ring-1 ring-line ${className}`,
		children: [(title || right) && /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-3 border-b border-line px-4 py-3",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-[14px] font-semibold text-ink",
				children: title
			}), right && /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 text-[12.5px] text-ink-3",
				children: right
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: pad ? "p-4" : "",
			children
		})]
	});
}
function Stat({ label, value, hint, tone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-panel bg-surface px-4 py-3.5 ring-1 ring-line",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-[12.5px] text-ink-3",
				children: label
			}),
			/* @__PURE__ */ jsx("div", {
				className: `num mt-1 text-[22px] font-semibold tracking-tight ${tone === "bad" ? "text-hot" : tone === "warn" ? "text-amber" : tone === "ok" ? "text-ok" : "text-ink"}`,
				children: value
			}),
			hint && /* @__PURE__ */ jsx("div", {
				className: "mt-0.5 text-[12px] text-ink-4",
				children: hint
			})
		]
	});
}
var TONES = {
	ok: "bg-ok/10 text-ok ring-ok/20",
	warn: "bg-amber/10 text-amber ring-amber/25",
	bad: "bg-hot-soft text-hot ring-hot/25",
	muted: "bg-bg-sunk text-ink-3 ring-line",
	accent: "bg-accent-soft text-accent ring-accent/20",
	info: "bg-surface-2 text-ink-2 ring-line-strong"
};
function Badge({ tone = "muted", children, title }) {
	return /* @__PURE__ */ jsx("span", {
		title,
		className: `inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ${TONES[tone]}`,
		children
	});
}
function Dot({ tone }) {
	const c = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-amber" : tone === "bad" ? "bg-hot" : tone === "accent" ? "bg-accent" : "bg-ink-4";
	return /* @__PURE__ */ jsxs("span", {
		className: "relative inline-flex size-2",
		children: [tone === "bad" && /* @__PURE__ */ jsx("span", { className: `absolute inline-flex size-full animate-ping rounded-full opacity-50 ${c}` }), /* @__PURE__ */ jsx("span", { className: `relative inline-flex size-2 rounded-full ${c}` })]
	});
}
function healthTone(h) {
	return h === "ok" ? "ok" : h === "degraded" ? "warn" : h === "failing" ? "bad" : "muted";
}
function Time({ at, title }) {
	if (!at) return /* @__PURE__ */ jsx("span", {
		className: "text-ink-4",
		children: "—"
	});
	return /* @__PURE__ */ jsx("time", {
		dateTime: String(at),
		title: title ?? bj(at, true),
		className: "num whitespace-nowrap",
		suppressHydrationWarning: true,
		children: ago(at)
	});
}
function DataTable({ rows, columns, rowKey, empty = "暂无数据", onRowClick, dense }) {
	if (!rows.length) return /* @__PURE__ */ jsx(Empty, { children: empty });
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full min-w-[640px] border-collapse text-left text-[13px]",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", {
				className: "border-b border-line text-[12px] text-ink-3",
				children: columns.map((c) => /* @__PURE__ */ jsx("th", {
					className: `whitespace-nowrap px-3 py-2 font-medium ${c.align === "right" ? "text-right" : ""} ${c.className ?? ""}`,
					children: c.label
				}, c.key))
			}) }), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsx("tr", {
				onClick: onRowClick ? () => onRowClick(r) : void 0,
				className: `border-b border-line/70 last:border-0 ${onRowClick ? "cursor-pointer transition-colors hover:bg-bg-sunk/60" : ""}`,
				children: columns.map((c) => /* @__PURE__ */ jsx("td", {
					className: `${dense ? "py-1.5" : "py-2.5"} px-3 align-top text-ink-2 ${c.align === "right" ? "num text-right" : ""} ${c.className ?? ""}`,
					children: c.render(r)
				}, c.key))
			}, rowKey(r))) })]
		})
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "px-4 py-10 text-center text-[13px] text-ink-4",
		children
	});
}
var BTN = {
	primary: "bg-ink text-bg hover:opacity-85",
	secondary: "bg-surface text-ink ring-1 ring-line-strong hover:bg-bg-sunk",
	danger: "bg-hot text-white hover:opacity-90",
	ghost: "text-ink-2 hover:bg-bg-sunk"
};
function Button({ tone = "secondary", size = "md", busy, children, className = "", ...rest }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		...rest,
		disabled: rest.disabled || busy,
		className: `inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-control font-medium transition-[opacity,background-color,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 ${size === "sm" ? "h-7 px-2.5 text-[12.5px]" : "h-9 px-3.5 text-[13.5px]"} ${BTN[tone]} ${className}`,
		children: [busy && /* @__PURE__ */ jsx("span", { className: "size-3 animate-spin rounded-full border-[1.5px] border-current border-r-transparent" }), children]
	});
}
function ButtonLink({ to, children, tone = "secondary", size = "md" }) {
	return /* @__PURE__ */ jsx(Link, {
		to,
		className: `inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-control font-medium transition-[opacity,background-color] ${size === "sm" ? "h-7 px-2.5 text-[12.5px]" : "h-9 px-3.5 text-[13.5px]"} ${BTN[tone]}`,
		children
	});
}
var INPUT = "w-full rounded-control bg-surface px-3 py-2 text-[13.5px] text-ink ring-1 ring-line-strong outline-none transition-shadow placeholder:text-ink-4 focus:ring-2 focus:ring-accent";
function Field({ label, hint, children }) {
	const id = useId();
	return /* @__PURE__ */ jsxs("label", {
		htmlFor: id,
		className: "block",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "mb-1 block text-[12.5px] font-medium text-ink-2",
				children: label
			}),
			/* @__PURE__ */ jsx("span", {
				className: "[&>*]:w-full",
				id,
				children
			}),
			hint && /* @__PURE__ */ jsx("span", {
				className: "mt-1 block text-[12px] text-ink-4",
				children: hint
			})
		]
	});
}
function Input(props) {
	return /* @__PURE__ */ jsx("input", {
		...props,
		className: `${INPUT} ${props.className ?? ""}`
	});
}
function Textarea(props) {
	return /* @__PURE__ */ jsx("textarea", {
		...props,
		className: `${INPUT} min-h-[84px] resize-y leading-relaxed ${props.className ?? ""}`
	});
}
function Select({ children, ...props }) {
	return /* @__PURE__ */ jsx("select", {
		...props,
		className: `${INPUT} appearance-none bg-[length:12px] bg-[right_10px_center] bg-no-repeat pr-8 ${props.className ?? ""}`,
		style: { backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><path d='M3 4.5l3 3 3-3' fill='none' stroke='%2366757a' stroke-width='1.4'/></svg>\")" },
		children
	});
}
/** Link-based filter chips bound to one query parameter. */
function FilterChips({ param, options }) {
	const [sp] = useSearchParams();
	const current = sp.get(param) ?? "";
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-wrap gap-1.5",
		children: options.map((o) => {
			const next = new URLSearchParams(sp);
			if (o.value) next.set(param, o.value);
			else next.delete(param);
			next.delete("page");
			const active = current === o.value;
			return /* @__PURE__ */ jsxs(Link, {
				to: `?${next}`,
				preventScrollReset: true,
				className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] transition-colors ${active ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line hover:bg-bg-sunk"}`,
				children: [o.label, o.count !== void 0 && /* @__PURE__ */ jsx("span", {
					className: `num text-[11.5px] ${active ? "text-bg/70" : "text-ink-4"}`,
					children: o.count
				})]
			}, o.value || "all");
		})
	});
}
function Pager({ page, hasMore }) {
	const [sp] = useSearchParams();
	const to = (p) => {
		const next = new URLSearchParams(sp);
		if (p > 1) next.set("page", String(p));
		else next.delete("page");
		return `?${next}`;
	};
	if (page <= 1 && !hasMore) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-4 flex items-center justify-center gap-2 text-[13px]",
		children: [
			page > 1 && /* @__PURE__ */ jsx(ButtonLink, {
				to: to(page - 1),
				size: "sm",
				children: "上一页"
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "num px-2 text-ink-3",
				children: [
					"第 ",
					page,
					" 页"
				]
			}),
			hasMore && /* @__PURE__ */ jsx(ButtonLink, {
				to: to(page + 1),
				size: "sm",
				children: "下一页"
			})
		]
	});
}
function Json({ value, collapsed = true, label = "原始数据" }) {
	const [open, setOpen] = useState(!collapsed);
	return /* @__PURE__ */ jsxs("details", {
		open,
		onToggle: (event) => setOpen(event.currentTarget.open),
		className: "group rounded-control bg-bg-sunk/70 ring-1 ring-line",
		children: [/* @__PURE__ */ jsx("summary", {
			className: "cursor-pointer select-none px-3 py-1.5 text-[12px] text-ink-3 hover:text-ink-2",
			children: label
		}), open && /* @__PURE__ */ jsx("pre", {
			className: "max-h-[420px] overflow-auto px-3 pb-3 font-mono text-[11.5px] leading-relaxed text-ink-2",
			children: JSON.stringify(value, null, 2)
		})]
	});
}
/**
* A modal that collects a reason (and optional extra fields) before a manual change. The submit
* handler receives the reason; returning true closes the dialog.
*/
function ReasonDialog({ open, title, description, confirmLabel = "确认", danger, requireReason = true, children, onClose, onSubmit, busy }) {
	const [reason, setReason] = useState("");
	const ref = useRef(null);
	useEffect(() => {
		if (!open) return;
		setReason("");
		const t = setTimeout(() => ref.current?.focus(), 60);
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => {
			clearTimeout(t);
			window.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);
	return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(motion.div, {
		className: "fixed inset-0 z-[75] flex items-end justify-center p-3 sm:items-center",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-ink/30 backdrop-blur-[2px]",
			onClick: onClose
		}), /* @__PURE__ */ jsxs(motion.form, {
			role: "dialog",
			"aria-modal": "true",
			initial: {
				y: 16,
				scale: .98,
				opacity: 0
			},
			animate: {
				y: 0,
				scale: 1,
				opacity: 1
			},
			exit: {
				y: 10,
				scale: .98,
				opacity: 0
			},
			transition: {
				duration: .22,
				ease: [
					.25,
					1,
					.5,
					1
				]
			},
			className: "relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-sheet bg-raised shadow-2xl ring-1 ring-line-strong",
			onSubmit: async (e) => {
				e.preventDefault();
				if (requireReason && !reason.trim()) return;
				if (await onSubmit(reason.trim()) !== false) onClose();
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex-1 overflow-y-auto p-5 pb-3",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-[16px] font-semibold text-ink",
						children: title
					}),
					description && /* @__PURE__ */ jsx("div", {
						className: "mt-1.5 text-[13px] leading-relaxed text-ink-3",
						children: description
					}),
					children && /* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4",
						children: /* @__PURE__ */ jsx(Field, {
							label: requireReason ? "原因（写进审计记录）" : "备注（可选）",
							children: /* @__PURE__ */ jsx(Textarea, {
								ref,
								value: reason,
								onChange: (e) => setReason(e.target.value),
								placeholder: requireReason ? "为什么做这个改动" : "",
								rows: 2
							})
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex justify-end gap-2 border-t border-line-soft bg-raised p-4 px-5 rounded-b-sheet",
				children: [/* @__PURE__ */ jsx(Button, {
					tone: "ghost",
					onClick: onClose,
					children: "取消"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					tone: danger ? "danger" : "primary",
					busy,
					disabled: requireReason && !reason.trim(),
					children: confirmLabel
				})]
			})]
		})]
	}) });
}
function KV({ items }) {
	return /* @__PURE__ */ jsx("dl", {
		className: "grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-[13px]",
		children: items.map(([k, v], i) => /* @__PURE__ */ jsxs("div", {
			className: "contents",
			children: [/* @__PURE__ */ jsx("dt", {
				className: "text-ink-3",
				children: k
			}), /* @__PURE__ */ jsx("dd", {
				className: "min-w-0 break-words text-ink-2",
				children: v ?? /* @__PURE__ */ jsx("span", {
					className: "text-ink-4",
					children: "—"
				})
			})]
		}, i))
	});
}
//#endregion
//#region app/routes/admin/content.tsx
var content_exports = /* @__PURE__ */ __exportAll({
	default: () => content_default,
	loader: () => loader$11,
	meta: () => meta$12
});
async function loader$11({ request }) {
	const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
	if (!q) return {
		q,
		rows: []
	};
	const { rows } = await adminGet(request, `/api/admin/content?q=${encodeURIComponent(q)}`);
	return {
		q,
		rows
	};
}
var meta$12 = () => [{ title: `内容诊断 · ${SITE.name} 后台` }];
var content_default = UNSAFE_withComponentProps(function Content({ loaderData }) {
	const { q, rows } = loaderData;
	const [sp] = useSearchParams();
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "内容诊断",
		subtitle: "按 ID、原文链接或标题找到任何一条内容，看它从信源到公开出口的完整链路；下架、仅摘要、人工修正和重处理都在详情页。",
		children: [
			/* @__PURE__ */ jsxs(Form, {
				method: "get",
				className: "mb-5 flex max-w-2xl gap-2",
				children: [/* @__PURE__ */ jsx(Input, {
					name: "q",
					defaultValue: sp.get("q") ?? "",
					placeholder: "内容 ID、URL 或标题关键词",
					"aria-label": "搜索内容",
					autoFocus: true
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					tone: "primary",
					children: "查找"
				})]
			}),
			q && /* @__PURE__ */ jsx(Card, {
				pad: false,
				title: `“${q}” 的结果`,
				right: /* @__PURE__ */ jsx("span", { children: rows.length === 50 ? "仅显示最近 50 条" : `${rows.length} 条` }),
				children: /* @__PURE__ */ jsx(DataTable, {
					rows,
					rowKey: (r) => r.id,
					onRowClick: (r) => navigate(`/admin/content/${r.id}`),
					empty: "没有找到。URL 会先规范化再比对；标题支持中英文片段。",
					columns: [
						{
							key: "t",
							label: "标题",
							render: (r) => /* @__PURE__ */ jsxs("div", {
								className: "min-w-[320px]",
								children: [/* @__PURE__ */ jsx(Link, {
									to: `/admin/content/${r.id}`,
									className: "font-medium text-ink hover:text-accent",
									onClick: (e) => e.stopPropagation(),
									children: r.title
								}), /* @__PURE__ */ jsx("div", {
									className: "font-mono text-[11.5px] text-ink-4",
									children: r.id
								})]
							})
						},
						{
							key: "src",
							label: "信源",
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "whitespace-nowrap",
								children: r.source
							})
						},
						{
							key: "st",
							label: "状态",
							render: (r) => /* @__PURE__ */ jsxs("span", {
								className: "flex flex-wrap gap-1",
								children: [
									r.selected && /* @__PURE__ */ jsx(Badge, {
										tone: "accent",
										children: "精选"
									}),
									r.visibility && /* @__PURE__ */ jsx(Badge, {
										tone: r.visibility === "public" ? "muted" : "warn",
										children: VISIBILITY_LABEL[r.visibility] ?? r.visibility
									}),
									!r.visibility && /* @__PURE__ */ jsx(Badge, { children: r.processing_state })
								]
							})
						},
						{
							key: "sc",
							label: "分数",
							align: "right",
							render: (r) => r.score ?? "—"
						},
						{
							key: "d",
							label: "发现",
							render: (r) => /* @__PURE__ */ jsx(Time, { at: r.discovered_at })
						}
					]
				})
			}),
			!q && /* @__PURE__ */ jsx(Empty, { children: "输入 ID、链接或标题开始查找。" })
		]
	});
});
//#endregion
//#region app/features/admin/action.ts
var AdminError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
function useAdminMe() {
	return useRouteLoaderData("admin-layout")?.me ?? {
		name: "",
		csrf: "",
		dev: false
	};
}
function newKey() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function useAdminAction() {
	const me = useAdminMe();
	const revalidator = useRevalidator();
	const [pending, setPending] = useState(null);
	const keys = useRef(/* @__PURE__ */ new Map());
	return {
		run: useCallback(async (method, path, body, opts = {}) => {
			const label = opts.label ?? `${method} ${path}`;
			const key = keys.current.get(label) ?? newKey();
			keys.current.set(label, key);
			setPending(label);
			try {
				const res = await fetch(path, {
					method,
					credentials: "same-origin",
					headers: {
						"content-type": "application/json",
						"x-csrf-token": me.csrf,
						"idempotency-key": key
					},
					body: body === void 0 ? void 0 : JSON.stringify(body)
				});
				if (res.status === 401) {
					window.location.href = `/api/auth/login?return=${encodeURIComponent(window.location.pathname)}`;
					return null;
				}
				const text = await res.text();
				const json = text ? JSON.parse(text) : null;
				if (!res.ok) throw new AdminError(res.status, json?.detail ?? `请求失败（${res.status}）`);
				keys.current.delete(label);
				if (opts.success) toast(opts.success, "ok");
				if (opts.revalidate !== false) revalidator.revalidate();
				return json ?? {};
			} catch (error) {
				const message = error instanceof AdminError ? error.message : "网络错误，请稍后再试";
				toast(error instanceof AdminError && error.status === 409 ? `${message}` : message, "error");
				return null;
			} finally {
				setPending(null);
			}
		}, [me.csrf, revalidator]),
		pending,
		busy: pending !== null || revalidator.state === "loading"
	};
}
//#endregion
//#region app/routes/admin/content-item.tsx
var content_item_exports = /* @__PURE__ */ __exportAll({
	default: () => content_item_default,
	loader: () => loader$10,
	meta: () => meta$11
});
async function loader$10({ request, params }) {
	return adminGet(request, `/api/admin/content/${encodeURIComponent(params.id)}`);
}
var meta$11 = ({ loaderData }) => [{ title: `${loaderData?.publication?.title ?? loaderData?.article.title ?? "内容"} · ${SITE.name} 后台` }];
function Step({ title, meta, children, tone = "accent", last }) {
	return /* @__PURE__ */ jsxs("li", {
		className: "relative pl-7",
		children: [
			!last && /* @__PURE__ */ jsx("span", {
				className: "absolute left-[7px] top-4 h-full w-px bg-line-strong",
				"aria-hidden": true
			}),
			/* @__PURE__ */ jsx("span", {
				className: `absolute left-[3px] top-[7px] size-[9px] rounded-full ring-4 ring-bg ${tone === "bad" ? "bg-hot" : tone === "muted" ? "bg-ink-4" : "bg-accent"}`,
				"aria-hidden": true
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline justify-between gap-x-3",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-[13.5px] font-semibold text-ink",
					children: title
				}), meta && /* @__PURE__ */ jsx("div", {
					className: "text-[12px] text-ink-4",
					children: meta
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-2 pb-6 text-[13px] text-ink-2",
				children
			})
		]
	});
}
var content_item_default = UNSAFE_withComponentProps(function ContentItem({ loaderData }) {
	const c = loaderData;
	const a = c.article;
	const p = c.publication;
	const { run, pending } = useAdminAction();
	const [dialog, setDialog] = useState(null);
	const [visibility, setVisibility] = useState(p?.visibility ?? "public");
	const [fields, setFields] = useState({
		title: "",
		summary: "",
		reason: "",
		category: "",
		tags: "",
		selected: "",
		silent: ""
	});
	const [mergeInto, setMergeInto] = useState("");
	const version = c.override?.version ?? 0;
	const base = `/api/admin/content/${encodeURIComponent(a.id)}`;
	const story = c.membership[0];
	const title = p?.title ?? a.title;
	const openOverride = () => {
		const f = c.override?.fields ?? {};
		setFields({
			title: String(f.title ?? ""),
			summary: String(f.summary ?? ""),
			reason: String(f.reason ?? ""),
			category: String(f.category ?? ""),
			tags: Array.isArray(f.tags) ? f.tags.join(", ") : "",
			selected: f.selected === void 0 ? "" : String(f.selected),
			silent: f.silent === void 0 ? "" : String(f.silent)
		});
		setDialog("override");
	};
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: /* @__PURE__ */ jsx("span", {
			className: "line-clamp-2",
			children: title
		}),
		subtitle: /* @__PURE__ */ jsxs("span", {
			className: "flex flex-wrap items-center gap-x-2 gap-y-1",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "font-mono text-[12px]",
					children: a.id
				}),
				/* @__PURE__ */ jsx("span", { children: "·" }),
				/* @__PURE__ */ jsx(Link, {
					className: "hover:text-accent",
					to: `/admin/sources/${encodeURIComponent(a.source_id)}`,
					children: a.source_name
				}),
				/* @__PURE__ */ jsx("span", { children: "·" }),
				/* @__PURE__ */ jsx("a", {
					className: "max-w-[420px] truncate hover:text-accent",
					href: a.url,
					target: "_blank",
					rel: "noreferrer",
					children: a.url
				}),
				p?.visibility !== "withdrawn" && p && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsx("a", {
					className: "text-accent",
					href: `/items/${a.id}`,
					target: "_blank",
					rel: "noreferrer",
					children: "公开页"
				})] })
			]
		}),
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Button, {
				onClick: () => setDialog("visibility"),
				children: "公开范围"
			}),
			p && /* @__PURE__ */ jsx(Button, {
				onClick: () => setDialog("seo"),
				children: p.indexable ? "取消收录" : "标记收录"
			}),
			/* @__PURE__ */ jsx(Button, {
				onClick: openOverride,
				children: "人工修正"
			}),
			/* @__PURE__ */ jsx(Button, {
				onClick: () => setDialog("analyze"),
				children: "重新评估"
			})
		] }),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-5 flex flex-wrap gap-1.5",
				children: [
					p ? /* @__PURE__ */ jsx(Badge, {
						tone: p.visibility === "public" ? "ok" : "warn",
						children: VISIBILITY_LABEL[p.visibility] ?? p.visibility
					}) : /* @__PURE__ */ jsx(Badge, { children: "未公开" }),
					p?.selected && /* @__PURE__ */ jsx(Badge, {
						tone: "accent",
						children: "精选"
					}),
					p?.eligible === false && /* @__PURE__ */ jsx(Badge, { children: "不进公开面" }),
					a.backfill && /* @__PURE__ */ jsx(Badge, {
						tone: "warn",
						children: "历史回灌"
					}),
					/* @__PURE__ */ jsxs(Badge, { children: ["处理 ", a.processing_state] }),
					c.override && /* @__PURE__ */ jsxs(Badge, {
						tone: "info",
						title: c.override.reason ?? void 0,
						children: ["有人工设置 v", c.override.version]
					})
				]
			}),
			a.processing_error && /* @__PURE__ */ jsx("div", {
				className: "mb-5 rounded-card bg-hot-soft px-4 py-3 text-[13px] text-hot ring-1 ring-hot/20",
				children: a.processing_error
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-5 xl:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "处理链路",
					children: /* @__PURE__ */ jsxs("ol", {
						className: "pt-1",
						children: [
							/* @__PURE__ */ jsxs(Step, {
								title: "信源",
								meta: `${KIND_LABEL[a.source_kind] ?? a.source_kind} · ${String(a.tier).replace("_", ".")} · ${MODE_LABEL[a.participation_mode] ?? a.participation_mode}`,
								children: [/* @__PURE__ */ jsx(Link, {
									className: "text-ink hover:text-accent",
									to: `/admin/sources/${encodeURIComponent(a.source_id)}`,
									children: a.source_name
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-ink-4",
									children: [
										" · 站内全文 ",
										a.site_fulltext ? "允许" : "不允许",
										" · 对外全文 ",
										a.syndicate_fulltext ? "允许" : "不允许"
									]
								})]
							}),
							/* @__PURE__ */ jsxs(Step, {
								title: "发现",
								meta: `${c.discoveries.length} 次`,
								children: [/* @__PURE__ */ jsx("ul", {
									className: "space-y-1",
									children: c.discoveries.map((d, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex gap-2",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "num text-ink-4",
												children: bj(d.discovered_at, true)
											}),
											/* @__PURE__ */ jsx("span", { children: d.via }),
											d.source_id !== a.source_id && /* @__PURE__ */ jsxs("span", {
												className: "text-ink-3",
												children: ["经 ", d.source_id]
											})
										]
									}, i))
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-1.5 text-[12px] text-ink-4",
									children: [
										"原文时间 ",
										a.published_at ? bj(a.published_at, true) : "未知",
										a.published_at_claim && !a.published_at ? `（声称 ${a.published_at_claim}，未采信）` : "",
										" · 时间轴 ",
										bj(a.timeline_at, true)
									]
								})]
							}),
							/* @__PURE__ */ jsxs(Step, {
								title: "正文与修订",
								meta: `第 ${a.revision} 版 · 正文 ${a.body_status} · ${a.body_chars ?? 0} 字符`,
								children: [c.revisions.length ? /* @__PURE__ */ jsx("ul", {
									className: "space-y-1",
									children: c.revisions.map((r) => /* @__PURE__ */ jsxs("li", {
										className: "flex gap-2",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "num text-ink-4",
												children: ["v", r.revision]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "min-w-0 flex-1 truncate",
												children: r.title
											}),
											/* @__PURE__ */ jsx("span", {
												className: "num shrink-0 text-ink-4",
												children: bj(r.created_at)
											})
										]
									}, r.revision))
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-ink-4",
									children: "只有初始版本"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 flex gap-2",
									children: /* @__PURE__ */ jsx(Button, {
										size: "sm",
										onClick: () => setDialog("extract"),
										children: "重新抽取正文"
									})
								})]
							}),
							/* @__PURE__ */ jsx(Step, {
								title: "模型判断",
								meta: `${c.analyses.length} 次`,
								tone: c.analyses.length ? "accent" : "muted",
								children: c.analyses.length ? /* @__PURE__ */ jsx("div", {
									className: "space-y-3",
									children: c.analyses.map((an) => /* @__PURE__ */ jsxs("div", {
										className: "rounded-control bg-bg-sunk/60 p-3 ring-1 ring-line",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex flex-wrap items-center gap-1.5 text-[12px]",
												children: [
													/* @__PURE__ */ jsx(Badge, {
														tone: an.relevance === "pass" ? "ok" : "muted",
														children: an.relevance
													}),
													an.selected && /* @__PURE__ */ jsx(Badge, {
														tone: "accent",
														children: "入选"
													}),
													/* @__PURE__ */ jsxs(Badge, {
														tone: "info",
														children: ["分数 ", an.score]
													}),
													an.category && /* @__PURE__ */ jsx(Badge, { children: CATEGORY_LABELS[an.category] ?? an.category }),
													/* @__PURE__ */ jsxs("span", {
														className: "text-ink-4",
														children: [
															an.model,
															" · ",
															an.prompt_version,
															" · 输入 v",
															an.input_revision,
															" · ",
															an.origin,
															" · ",
															bj(an.created_at)
														]
													})
												]
											}),
											an.title_zh && /* @__PURE__ */ jsx("div", {
												className: "mt-2 font-medium text-ink",
												children: an.title_zh
											}),
											an.reason_zh && /* @__PURE__ */ jsx("div", {
												className: "mt-1 text-[12.5px] leading-relaxed text-ink-3",
												children: an.reason_zh
											}),
											an.receipts.length > 0 && /* @__PURE__ */ jsx("div", {
												className: "mt-2 flex flex-wrap gap-1.5 text-[11.5px]",
												children: an.receipts.map((r) => /* @__PURE__ */ jsxs("span", {
													className: "num rounded bg-surface px-1.5 py-0.5 text-ink-3 ring-1 ring-line",
													children: [
														"回执 #",
														r.id,
														" · ",
														r.status,
														" · ",
														r.model ?? r.service,
														r.cost !== null ? ` · ${money(r.cost)}` : ""
													]
												}, r.id))
											})
										]
									}, an.id))
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-ink-4",
									children: a.participation_mode === "editorial" ? "还没有判断（等待队列或失败）" : "氛围信源不做编辑判断"
								})
							}),
							/* @__PURE__ */ jsxs(Step, {
								title: "公开",
								tone: p ? p.visibility === "withdrawn" ? "bad" : "accent" : "muted",
								meta: p ? `更新于 ${bj(p.updated_at, true)}` : void 0,
								children: [p ? /* @__PURE__ */ jsx(KV, { items: [
									["范围", VISIBILITY_LABEL[p.visibility] ?? p.visibility],
									["精选", p.selected ? `是 · 可见于 ${p.visible_after ? bj(p.visible_after, true) : "立即"}` : "否"],
									["栏目", p.category ? CATEGORY_LABELS[p.category] ?? p.category : null],
									["标签", p.tags?.join("、")],
									["摘要", p.summary],
									["推荐理由", p.reason],
									["正文展示", `${p.body_mode}${p.syndicate ? " · 对外可带全文" : ""}${p.indexable ? p.seo_indexed_at ? " · 可收录（手动标记）" : " · 可收录（精选自动）" : p.seo_excluded_at ? " · 不收录（手动排除）" : " · 不收录"}`]
								] }) : /* @__PURE__ */ jsx("span", {
									className: "text-ink-4",
									children: "没有公开投影（未通过相关性或仍在处理）"
								}), c.override && /* @__PURE__ */ jsxs("div", {
									className: "mt-3 rounded-control bg-accent-softer p-3 ring-1 ring-accent/15",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "text-[12px] text-ink-3",
										children: [
											"人工设置 v",
											c.override.version,
											" · ",
											c.override.updated_by,
											" · ",
											bj(c.override.updated_at, true),
											c.override.reason ? ` · ${c.override.reason}` : ""
										]
									}), /* @__PURE__ */ jsx(Json, {
										value: {
											visibility: c.override.visibility,
											...c.override.fields
										},
										label: "覆盖字段",
										collapsed: false
									})]
								})]
							}),
							/* @__PURE__ */ jsx(Step, {
								title: "精选同步流水",
								meta: `${c.ledger.length} 条`,
								tone: c.ledger.length ? "accent" : "muted",
								children: c.ledger.length ? /* @__PURE__ */ jsx("ul", {
									className: "space-y-1",
									children: c.ledger.map((l) => /* @__PURE__ */ jsxs("li", {
										className: "flex gap-2",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "num text-ink-4",
												children: ["#", l.seq]
											}),
											/* @__PURE__ */ jsx(Badge, {
												tone: l.op === "remove" ? "warn" : "ok",
												children: l.op
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "num text-ink-4",
												children: [
													"可见 ",
													bj(l.visible_at),
													" · 写入 ",
													bj(l.changed_at)
												]
											})
										]
									}, l.seq))
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-ink-4",
									children: "没有进入过精选同步流"
								})
							}),
							/* @__PURE__ */ jsxs(Step, {
								title: "事件归组",
								tone: story ? "accent" : "muted",
								meta: a.grouped_at ? `归组于 ${bj(a.grouped_at, true)}` : "未归组",
								children: [
									c.membership.map((m) => /* @__PURE__ */ jsxs("div", {
										className: "mb-2",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											"事实 ",
											/* @__PURE__ */ jsxs("span", {
												className: "font-mono text-[12px]",
												children: ["#", m.fact_id]
											}),
											" ",
											m.fact_title,
											" ",
											/* @__PURE__ */ jsx(Badge, { children: m.role }),
											" ",
											m.manual && /* @__PURE__ */ jsx(Badge, {
												tone: "info",
												children: "人工"
											})
										] }), m.story_public_id && /* @__PURE__ */ jsxs("div", {
											className: "mt-0.5",
											children: [
												"事件 ",
												/* @__PURE__ */ jsx("a", {
													className: "text-accent",
													href: `/story/${m.story_public_id}`,
													target: "_blank",
													rel: "noreferrer",
													children: m.story_title
												}),
												" ",
												/* @__PURE__ */ jsxs("span", {
													className: "font-mono text-[12px] text-ink-4",
													children: ["#", m.story_id]
												})
											]
										})]
									}, m.fact_id)),
									c.decisions.length > 0 && /* @__PURE__ */ jsx("ul", {
										className: "mt-2 space-y-1 text-[12.5px]",
										children: c.decisions.map((d, i) => /* @__PURE__ */ jsxs("li", {
											className: "flex flex-wrap gap-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "num text-ink-4",
													children: bj(d.created_at)
												}),
												/* @__PURE__ */ jsx(Badge, { children: d.verdict }),
												d.fact_id && /* @__PURE__ */ jsxs("span", { children: ["事实 #", d.fact_id] }),
												d.receipt_id && /* @__PURE__ */ jsxs("span", {
													className: "text-ink-4",
													children: ["回执 #", d.receipt_id]
												})
											]
										}, i))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ jsx(Button, {
												size: "sm",
												onClick: () => setDialog("group"),
												children: "重新归组"
											}),
											c.membership.length > 0 && /* @__PURE__ */ jsx(Button, {
												size: "sm",
												onClick: () => setDialog("detach"),
												children: "移出事件"
											}),
											story?.story_id && /* @__PURE__ */ jsx(Button, {
												size: "sm",
												onClick: () => setDialog("merge"),
												children: "把这个事件并入…"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsx(Step, {
								title: "投递",
								last: true,
								meta: `${c.deliveries.length} 条`,
								tone: c.deliveries.some((d) => d.status === "unknown") ? "bad" : c.deliveries.length ? "accent" : "muted",
								children: c.deliveries.length ? /* @__PURE__ */ jsx("ul", {
									className: "space-y-1",
									children: c.deliveries.map((d, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ jsx("span", { children: d.target_key }),
											/* @__PURE__ */ jsx(Badge, {
												tone: d.status === "sent" ? "ok" : d.status === "unknown" ? "bad" : "muted",
												children: d.status
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "num text-ink-4",
												children: [bj(d.created_at), d.sent_at ? ` → ${bj(d.sent_at)}` : ""]
											})
										]
									}, i))
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-ink-4",
									children: "没有推送记录"
								})
							})
						]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ jsx(Card, {
						title: "原始信息",
						children: /* @__PURE__ */ jsx(KV, { items: [
							["原标题", a.title],
							["作者", a.author],
							["语言", a.language],
							["身份键", /* @__PURE__ */ jsx("span", {
								className: "break-all font-mono text-[11.5px]",
								children: a.identity_key
							})]
						] })
					}), /* @__PURE__ */ jsx(Card, {
						title: "修改记录",
						children: c.history.length ? /* @__PURE__ */ jsx("ul", {
							className: "space-y-3 text-[12.5px]",
							children: c.history.map((h, i) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("div", {
								className: "text-ink-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: h.action
									}),
									" · ",
									h.actor,
									" · ",
									bj(h.created_at)
								]
							}), h.reason && /* @__PURE__ */ jsx("div", {
								className: "text-ink-3",
								children: h.reason
							})] }, i))
						}) : /* @__PURE__ */ jsx(Empty, { children: "没有人工操作" })
					})]
				})]
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "seo",
				title: p?.indexable ? "取消搜索收录" : "标记为可收录",
				description: p?.indexable ? "详情页改回 noindex 并移出站点地图；即使是精选，也不再自动收录，直到重新标记。" : "详情页默认 noindex，精选内容自动收录。标记后（仅在公开状态下）改为 index、进入站点地图，并在下一次 IndexNow 提交。适合有独立价值、摘要与正文完整的内容。",
				confirmLabel: p?.indexable ? "取消收录" : "标记收录",
				busy: pending === "seo",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", `${base}/seo`, {
					indexed: !p?.indexable,
					reason
				}, {
					label: "seo",
					success: p?.indexable ? "已取消收录" : "已标记为可收录"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "visibility",
				title: "公开范围",
				description: "改动会同时作用于网页、API、RSS、MCP、同步流和搜索索引，并刷新缓存。来源方要求下架时，先核实身份与范围。",
				danger: visibility === "withdrawn",
				confirmLabel: "应用",
				busy: pending === "visibility",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", `${base}/visibility`, {
					visibility,
					reason,
					version
				}, {
					label: "visibility",
					success: "公开范围已更新"
				}) !== null,
				children: /* @__PURE__ */ jsx("div", {
					className: "grid gap-2 sm:grid-cols-3",
					children: [
						[
							"public",
							"公开",
							"正常展示"
						],
						[
							"summary-only",
							"仅摘要",
							"不展示正文，保留标题摘要"
						],
						[
							"withdrawn",
							"下架",
							"所有出口移除，链接 404"
						]
					].map(([v, label, hint]) => /* @__PURE__ */ jsxs("label", {
						className: `cursor-pointer rounded-card p-3 ring-1 transition-colors ${visibility === v ? "bg-accent-soft ring-accent" : "ring-line-strong hover:bg-bg-sunk"}`,
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "radio",
								name: "visibility",
								className: "sr-only",
								checked: visibility === v,
								onChange: () => setVisibility(v)
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[13.5px] font-medium text-ink",
								children: label
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-0.5 text-[12px] text-ink-3",
								children: hint
							})
						]
					}, v))
				})
			}),
			/* @__PURE__ */ jsxs(ReasonDialog, {
				open: dialog === "override",
				title: "人工修正",
				description: "人工值优先于模型输出，之后的重处理不会覆盖；留空表示不修正该字段（清除已有修正请选“清除”）。",
				confirmLabel: "保存修正",
				busy: pending === "override",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => {
					const next = {};
					const clear = [];
					for (const k of [
						"title",
						"summary",
						"reason"
					]) if (fields[k].trim()) next[k] = fields[k].trim();
					else if (c.override?.fields[k] !== void 0) clear.push(k);
					if (fields.category) next.category = fields.category;
					else if (c.override?.fields.category !== void 0) clear.push("category");
					if (fields.tags.trim()) next.tags = fields.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
					else if (c.override?.fields.tags !== void 0) clear.push("tags");
					for (const k of ["selected", "silent"]) if (fields[k] === "true" || fields[k] === "false") next[k] = fields[k] === "true";
					else if (c.override?.fields[k] !== void 0) clear.push(k);
					return await run("POST", `${base}/override`, {
						fields: next,
						clear,
						reason,
						version
					}, {
						label: "override",
						success: "修正已保存并重新发布"
					}) !== null;
				},
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: "标题",
						children: /* @__PURE__ */ jsx(Input, {
							value: fields.title,
							placeholder: p?.title ?? "",
							onChange: (e) => setFields({
								...fields,
								title: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "摘要",
						children: /* @__PURE__ */ jsx(Textarea, {
							rows: 3,
							value: fields.summary,
							placeholder: p?.summary ?? "",
							onChange: (e) => setFields({
								...fields,
								summary: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "推荐理由",
						children: /* @__PURE__ */ jsx(Textarea, {
							rows: 2,
							value: fields.reason,
							placeholder: p?.reason ?? "",
							onChange: (e) => setFields({
								...fields,
								reason: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "栏目",
								children: /* @__PURE__ */ jsxs(Select, {
									value: fields.category,
									onChange: (e) => setFields({
										...fields,
										category: e.target.value
									}),
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "不修正"
									}), CATEGORY_KEYS$1.map((k) => /* @__PURE__ */ jsx("option", {
										value: k,
										children: CATEGORY_LABELS[k]
									}, k))]
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "标签（逗号分隔）",
								children: /* @__PURE__ */ jsx(Input, {
									value: fields.tags,
									onChange: (e) => setFields({
										...fields,
										tags: e.target.value
									})
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "精选",
								children: /* @__PURE__ */ jsxs(Select, {
									value: fields.selected,
									onChange: (e) => setFields({
										...fields,
										selected: e.target.value
									}),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "按模型"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "true",
											children: "强制入选"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "false",
											children: "强制不选"
										})
									]
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "推送",
								children: /* @__PURE__ */ jsxs(Select, {
									value: fields.silent,
									onChange: (e) => setFields({
										...fields,
										silent: e.target.value
									}),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "正常"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "true",
											children: "静默（入选也不推送）"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "false",
											children: "取消静默"
										})
									]
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "analyze",
				title: "对当前修订重新评估",
				description: "会发起一次新的模型调用（计费并记录回执）。同一次提交重复点击不会重复收费。",
				requireReason: false,
				confirmLabel: "重新评估",
				busy: pending === "analyze",
				onClose: () => setDialog(null),
				onSubmit: async () => await run("POST", `${base}/rerun`, { step: "analyze" }, {
					label: "analyze",
					success: "已加入评估队列"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "extract",
				title: "重新抽取正文",
				requireReason: false,
				confirmLabel: "重新抽取",
				busy: pending === "extract",
				onClose: () => setDialog(null),
				onSubmit: async () => await run("POST", `${base}/rerun`, { step: "extract" }, {
					label: "extract",
					success: "已加入抽取队列"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "group",
				title: "重新归组",
				description: "人工归组的成员关系不会被覆盖。",
				requireReason: false,
				confirmLabel: "重新归组",
				busy: pending === "group",
				onClose: () => setDialog(null),
				onSubmit: async () => await run("POST", `${base}/rerun`, { step: "group" }, {
					label: "group",
					success: "已加入归组队列"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "detach",
				title: "移出事件",
				description: "这条内容会作为独立内容展示，事件页随之更新。",
				danger: true,
				confirmLabel: "移出",
				busy: pending === "detach",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", `${base}/detach`, { reason }, {
					label: "detach",
					success: "已移出事件"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "merge",
				title: "合并事件",
				description: `把事件 #${story?.story_id}（${story?.story_title ?? ""}）并入另一个事件；旧链接会跳转到新事件。`,
				danger: true,
				confirmLabel: "合并",
				busy: pending === "merge",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => {
					if (!/^\d+$/.test(mergeInto.trim())) return false;
					return await run("POST", "/api/admin/stories/merge", {
						from: story.story_id,
						into: Number(mergeInto),
						reason
					}, {
						label: "merge",
						success: "事件已合并"
					}) !== null;
				},
				children: /* @__PURE__ */ jsx(Field, {
					label: "并入的目标事件编号",
					hint: "在目标事件任一内容的诊断页里可以看到 #编号",
					children: /* @__PURE__ */ jsx(Input, {
						inputMode: "numeric",
						value: mergeInto,
						onChange: (e) => setMergeInto(e.target.value),
						placeholder: "例如 1234"
					})
				})
			})
		]
	});
});
//#endregion
//#region app/routes/admin/sources.tsx
var sources_exports = /* @__PURE__ */ __exportAll({
	default: () => sources_default,
	loader: () => loader$9,
	meta: () => meta$10
});
async function loader$9({ request }) {
	return adminGet(request, `/api/admin/sources${new URL(request.url).search}`);
}
var meta$10 = () => [{ title: `信源 · ${SITE.name} 后台` }];
var sources_default = UNSAFE_withComponentProps(function Sources({ loaderData }) {
	const { rows, totals, page } = loaderData;
	const [sp] = useSearchParams();
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "信源",
		subtitle: "列表按健康度排序：失败的在最前。点进详情可以预览抓取、手动采集、调整频率与参与方式。",
		actions: /* @__PURE__ */ jsx(ButtonLink, {
			to: "/admin/sources/new",
			tone: "primary",
			children: "新建信源"
		}),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-5 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(Stat, {
						label: "全部",
						value: num(totals.total)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "启用",
						value: num(totals.enabled)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "失败",
						value: num(totals.failing),
						tone: totals.failing ? "bad" : "ok"
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "不稳定",
						value: num(totals.degraded),
						tone: totals.degraded ? "warn" : void 0
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				pad: false,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3 border-b border-line p-3 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ jsxs(Form, {
						method: "get",
						className: "flex w-full max-w-md gap-2",
						preventScrollReset: true,
						children: [[
							"kind",
							"health",
							"mode"
						].map((k) => sp.get(k) && /* @__PURE__ */ jsx("input", {
							type: "hidden",
							name: k,
							value: sp.get(k)
						}, k)), /* @__PURE__ */ jsx(Input, {
							name: "q",
							defaultValue: sp.get("q") ?? "",
							placeholder: "名称、ID 或地址",
							"aria-label": "搜索信源"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ jsx(FilterChips, {
							param: "health",
							options: [
								{
									value: "",
									label: "全部"
								},
								{
									value: "failing",
									label: "失败"
								},
								{
									value: "degraded",
									label: "不稳定"
								},
								{
									value: "paused",
									label: "暂停"
								}
							]
						}), /* @__PURE__ */ jsxs(Select, {
							"aria-label": "类型",
							className: "!w-auto",
							value: sp.get("kind") ?? "",
							onChange: (e) => {
								const next = new URLSearchParams(sp);
								if (e.target.value) next.set("kind", e.target.value);
								else next.delete("kind");
								next.delete("page");
								navigate(`?${next}`, { preventScrollReset: true });
							},
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "全部类型"
							}), Object.entries(KIND_LABEL).map(([k, v]) => /* @__PURE__ */ jsx("option", {
								value: k,
								children: v
							}, k))]
						})]
					})]
				}), /* @__PURE__ */ jsx(DataTable, {
					rows,
					rowKey: (r) => r.id,
					onRowClick: (r) => navigate(`/admin/sources/${encodeURIComponent(r.id)}`),
					columns: [
						{
							key: "name",
							label: "信源",
							render: (r) => /* @__PURE__ */ jsxs("div", {
								className: "min-w-[220px]",
								children: [
									/* @__PURE__ */ jsx(Link, {
										to: `/admin/sources/${encodeURIComponent(r.id)}`,
										className: "font-medium text-ink hover:text-accent",
										onClick: (e) => e.stopPropagation(),
										children: r.name
									}),
									/* @__PURE__ */ jsx("div", {
										className: "font-mono text-[11.5px] text-ink-4",
										children: r.id
									}),
									r.health === "failing" && r.last_error && /* @__PURE__ */ jsx("div", {
										className: "mt-1 line-clamp-1 text-[12px] text-hot",
										children: r.last_error
									})
								]
							})
						},
						{
							key: "kind",
							label: "类型",
							render: (r) => /* @__PURE__ */ jsx(Badge, { children: KIND_LABEL[r.kind] ?? r.kind })
						},
						{
							key: "mode",
							label: "参与",
							render: (r) => /* @__PURE__ */ jsxs("div", {
								className: "flex gap-1",
								children: [
									/* @__PURE__ */ jsx(Badge, {
										tone: r.participation_mode === "editorial" ? "accent" : "muted",
										children: MODE_LABEL[r.participation_mode] ?? r.participation_mode
									}),
									/* @__PURE__ */ jsx(Badge, {
										tone: "info",
										children: r.tier.replace("_", ".")
									}),
									r.first_party && /* @__PURE__ */ jsx(Badge, {
										tone: "ok",
										children: "一手"
									})
								]
							})
						},
						{
							key: "health",
							label: "健康",
							render: (r) => /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5 whitespace-nowrap",
								children: [
									/* @__PURE__ */ jsx(Dot, { tone: r.enabled ? healthTone(r.health) : "muted" }),
									r.enabled ? HEALTH_LABEL[r.health] ?? r.health : "已暂停",
									r.fail_count > 0 && /* @__PURE__ */ jsxs("span", {
										className: "num text-[11.5px] text-ink-4",
										children: ["×", r.fail_count]
									})
								]
							})
						},
						{
							key: "ok",
							label: "上次成功",
							render: (r) => /* @__PURE__ */ jsx(Time, { at: r.last_ok_at })
						},
						{
							key: "interval",
							label: "频率",
							align: "right",
							render: (r) => `${r.interval_minutes} 分`
						},
						{
							key: "items",
							label: "7 天条目",
							align: "right",
							render: (r) => num(r.items_7d)
						},
						{
							key: "sel",
							label: "30 天精选",
							align: "right",
							render: (r) => num(r.selected_30d)
						}
					]
				})]
			}),
			/* @__PURE__ */ jsx(Pager, {
				page,
				hasMore: rows.length === 100
			})
		]
	});
});
//#endregion
//#region app/routes/admin/source-new.tsx
var source_new_exports = /* @__PURE__ */ __exportAll({
	default: () => source_new_default,
	meta: () => meta$9
});
var meta$9 = () => [{ title: `新建信源 · ${SITE.name} 后台` }];
var TEMPLATES = {
	rss: { feedUrl: "https://example.com/feed.xml" },
	web_list: {
		url: "https://example.com/blog",
		baseUrl: "https://example.com",
		itemSelector: "article",
		linkSelector: "a",
		titleSelector: "h2",
		allowUrlPrefixes: ["https://example.com/blog/"]
	},
	json_list: {
		url: "https://example.com/api/posts",
		mode: "json_api",
		method: "GET",
		itemsPath: "data.items",
		titlePaths: ["title"],
		urlTemplate: "{raw:url}",
		summaryPaths: ["summary"]
	},
	x_search: {
		query: "from:handle -filter:replies",
		searchType: "Latest"
	},
	mp_account: {
		biz: "",
		name: ""
	},
	external: {}
};
var source_new_default = UNSAFE_withComponentProps(function NewSource() {
	const navigate = useNavigate();
	const { run, pending } = useAdminAction();
	const [form, setForm] = useState({
		id: "",
		name: "",
		kind: "rss",
		tier: "T2",
		participation_mode: "editorial",
		interval_minutes: 30,
		first_party: false,
		site_fulltext: true,
		syndicate_fulltext: false,
		tags: ""
	});
	const [config, setConfig] = useState(JSON.stringify(TEMPLATES.rss, null, 2));
	const [error, setError] = useState(null);
	const [preview, setPreview] = useState(null);
	const [duplicate, setDuplicate] = useState(null);
	const parsed = () => {
		try {
			setError(null);
			return JSON.parse(config);
		} catch (e) {
			setError(`配置不是合法 JSON：${e.message}`);
			return null;
		}
	};
	return /* @__PURE__ */ jsx(AdminPage, {
		title: "新建信源",
		subtitle: "先判重、先预览：优先 RSS/JSON 等稳定协议；首抓成功且有真实条目才算接入完成。一手身份要有运营主体或官方交叉链接证据。",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-5 xl:grid-cols-[1fr_420px]",
			children: [/* @__PURE__ */ jsxs(Card, {
				title: "信源定义",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "ID",
								hint: "小写字母、数字和连字符，创建后不可改",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.id,
									onChange: (e) => setForm({
										...form,
										id: e.target.value.toLowerCase()
									}),
									placeholder: "openai-blog"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "名称",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									}),
									placeholder: "OpenAI 博客"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "类型",
								children: /* @__PURE__ */ jsx(Select, {
									value: form.kind,
									onChange: (e) => {
										setForm({
											...form,
											kind: e.target.value
										});
										setConfig(JSON.stringify(TEMPLATES[e.target.value] ?? {}, null, 2));
										setPreview(null);
									},
									children: Object.entries(KIND_LABEL).map(([k, v]) => /* @__PURE__ */ jsx("option", {
										value: k,
										children: v
									}, k))
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "采集间隔（分钟）",
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 1,
									max: 1440,
									value: form.interval_minutes,
									onChange: (e) => setForm({
										...form,
										interval_minutes: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "参与方式",
								children: /* @__PURE__ */ jsx(Select, {
									value: form.participation_mode,
									onChange: (e) => setForm({
										...form,
										participation_mode: e.target.value
									}),
									children: Object.entries(MODE_LABEL).map(([k, v]) => /* @__PURE__ */ jsx("option", {
										value: k,
										children: v
									}, k))
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "等级",
								children: /* @__PURE__ */ jsx(Select, {
									value: form.tier,
									onChange: (e) => setForm({
										...form,
										tier: e.target.value
									}),
									children: Object.entries(TIER_LABEL).map(([k, v]) => /* @__PURE__ */ jsx("option", {
										value: k,
										children: v
									}, k))
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "标签（逗号分隔）",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.tags,
									onChange: (e) => setForm({
										...form,
										tags: e.target.value
									})
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-col justify-end gap-2 text-[13px] text-ink-2",
								children: [
									["first_party", "一手信源"],
									["site_fulltext", "站内可展示全文"],
									["syndicate_fulltext", "对外接口可带全文"]
								].map(([k, label]) => /* @__PURE__ */ jsxs("label", {
									className: "inline-flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										className: "size-4 accent-[var(--accent)]",
										checked: form[k],
										onChange: (e) => setForm({
											...form,
											[k]: e.target.checked
										})
									}), label]
								}, k))
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "采集配置（JSON）",
							children: /* @__PURE__ */ jsx(Textarea, {
								className: "font-mono !text-[12px]",
								rows: 10,
								value: config,
								onChange: (e) => setConfig(e.target.value),
								spellCheck: false
							})
						}), error && /* @__PURE__ */ jsx("div", {
							className: "mt-1 text-[12.5px] text-hot",
							children: error
						})]
					}),
					duplicate && /* @__PURE__ */ jsxs("div", {
						className: "mt-4 rounded-card bg-amber/10 px-4 py-3 text-[13px] text-ink-2 ring-1 ring-amber/25",
						children: [
							"这个地址已经在监控：",
							/* @__PURE__ */ jsx(Link, {
								className: "font-medium text-accent",
								to: `/admin/sources/${encodeURIComponent(duplicate.id)}`,
								children: duplicate.name
							}),
							"（",
							duplicate.id,
							"）。没有新建。"
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							busy: pending === "preview",
							onClick: async () => {
								const c = parsed();
								if (!c) return;
								const r = await run("POST", "/api/admin/sources/preview", {
									id: form.id || "draft",
									kind: form.kind,
									config: c
								}, {
									label: "preview",
									revalidate: false
								});
								if (r) setPreview(r);
							},
							children: "预览抓取"
						}), /* @__PURE__ */ jsx(Button, {
							tone: "primary",
							busy: pending === "create",
							disabled: !form.id || !form.name,
							onClick: async () => {
								const c = parsed();
								if (!c) return;
								const r = await run("POST", "/api/admin/sources", {
									...form,
									tags: form.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
									config: c
								}, {
									label: "create",
									revalidate: false
								});
								if (!r) return;
								if (!r.created && r.duplicate) setDuplicate(r.duplicate);
								else if (r.source) navigate(`/admin/sources/${encodeURIComponent(r.source.id)}`);
							},
							children: "创建"
						})]
					})
				]
			}), /* @__PURE__ */ jsx(Card, {
				title: preview ? `预览：${preview.count} 条（${preview.ms}ms）` : "预览",
				children: !preview ? /* @__PURE__ */ jsx(Empty, { children: "填好配置后点“预览抓取”，这里显示将会采集到的条目（不入库）。" }) : preview.items.length ? /* @__PURE__ */ jsx("ul", {
					className: "space-y-3",
					children: preview.items.map((i) => /* @__PURE__ */ jsxs("li", {
						className: "text-[13px]",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: i.url,
								target: "_blank",
								rel: "noreferrer",
								className: "font-medium text-ink hover:text-accent",
								children: i.title
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[12px] text-ink-4",
								children: i.publishedAt ? bj(i.publishedAt, true) : "无发布时间"
							}),
							i.excerpt && /* @__PURE__ */ jsx("div", {
								className: "mt-0.5 line-clamp-2 text-[12.5px] text-ink-3",
								children: i.excerpt
							})
						]
					}, i.url))
				}) : /* @__PURE__ */ jsx(Empty, { children: "没有抓到条目。" })
			})]
		})
	});
});
//#endregion
//#region app/routes/admin/source.tsx
var source_exports = /* @__PURE__ */ __exportAll({
	default: () => source_default,
	loader: () => loader$8,
	meta: () => meta$8
});
async function loader$8({ request, params }) {
	return adminGet(request, `/api/admin/sources/${encodeURIComponent(params.id)}`);
}
var meta$8 = ({ loaderData }) => [{ title: `${loaderData?.source.name ?? "信源"} · ${SITE.name} 后台` }];
function draftOf(s) {
	return {
		name: s.name,
		interval_minutes: s.interval_minutes,
		tier: s.tier,
		participation_mode: s.participation_mode,
		signal_group_id: s.signal_group_id,
		first_party: s.first_party,
		owner_entity_id: s.owner_entity_id,
		site_fulltext: s.site_fulltext,
		syndicate_fulltext: s.syndicate_fulltext,
		tags: s.tags.join(", "),
		config: JSON.stringify(s.config, null, 2)
	};
}
var source_default = UNSAFE_withComponentProps(function SourceDetail({ loaderData }) {
	const { source: s, runs, items, stats, history } = loaderData;
	const { run, pending } = useAdminAction();
	const [draft, setDraft] = useState(() => draftOf(s));
	const [draftFor, setDraftFor] = useState(s.updated_at);
	const [preview, setPreview] = useState(null);
	const [dialog, setDialog] = useState(null);
	const [configError, setConfigError] = useState(null);
	if (draftFor !== s.updated_at) {
		setDraft(draftOf(s));
		setDraftFor(s.updated_at);
	}
	const base = `/api/admin/sources/${encodeURIComponent(s.id)}`;
	const patch = () => {
		let config;
		try {
			config = JSON.parse(draft.config);
			setConfigError(null);
		} catch (e) {
			setConfigError(`配置不是合法 JSON：${e.message}`);
			return null;
		}
		const next = {
			...draft,
			tags: draft.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
			config,
			interval_minutes: Number(draft.interval_minutes),
			signal_group_id: draft.signal_group_id || null,
			owner_entity_id: draft.owner_entity_id || null
		};
		const before = draftOf(s);
		const changed = {};
		for (const [k, v] of Object.entries(next)) {
			const was = k === "tags" ? s.tags : k === "config" ? s.config : before[k];
			if (JSON.stringify(v) !== JSON.stringify(was)) changed[k] = v;
		}
		return changed;
	};
	const changes = (() => {
		try {
			return Object.keys(patchPreview(draft, s)).length;
		} catch {
			return 1;
		}
	})();
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: /* @__PURE__ */ jsxs("span", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				s.name,
				/* @__PURE__ */ jsx(Badge, { children: KIND_LABEL[s.kind] ?? s.kind }),
				/* @__PURE__ */ jsx(Badge, {
					tone: s.participation_mode === "editorial" ? "accent" : "muted",
					children: MODE_LABEL[s.participation_mode]
				})
			]
		}),
		subtitle: /* @__PURE__ */ jsx("span", {
			className: "font-mono text-[12px]",
			children: s.id
		}),
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Button, {
				busy: pending === "preview",
				onClick: async () => {
					const r = await run("POST", `${base}/preview`, {}, {
						label: "preview",
						revalidate: false
					});
					if (r) setPreview(r);
				},
				children: "预览抓取"
			}),
			/* @__PURE__ */ jsx(Button, {
				busy: pending === "fetch",
				onClick: () => run("POST", `${base}/fetch`, {}, {
					label: "fetch",
					success: "已加入采集队列"
				}),
				children: "立即采集"
			}),
			/* @__PURE__ */ jsx(Button, {
				tone: s.enabled ? "danger" : "primary",
				onClick: () => setDialog("toggle"),
				children: s.enabled ? "暂停" : "恢复"
			})
		] }),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-5 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(Stat, {
						label: "健康",
						value: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2 text-[18px]",
							children: [/* @__PURE__ */ jsx(Dot, { tone: s.enabled ? healthTone(s.health) : "muted" }), s.enabled ? HEALTH_LABEL[s.health] ?? s.health : "已暂停"]
						}),
						hint: s.fail_count ? `连续失败 ${s.fail_count} 次` : `上次成功 ${s.last_ok_at ? bj(s.last_ok_at) : "—"}`
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "累计条目",
						value: num(stats.total)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "近 7 天",
						value: num(stats.last7d)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "入选精选",
						value: num(stats.selected)
					})
				]
			}),
			s.last_error && s.health !== "ok" && /* @__PURE__ */ jsx("div", {
				className: "mb-5 rounded-card bg-hot-soft px-4 py-3 text-[13px] text-hot ring-1 ring-hot/20",
				children: s.last_error
			}),
			preview && /* @__PURE__ */ jsx(Card, {
				className: "mb-5",
				title: `预览：${preview.count} 条（${preview.ms}ms，未入库）`,
				right: /* @__PURE__ */ jsx("button", {
					onClick: () => setPreview(null),
					children: "收起"
				}),
				children: preview.items.length ? /* @__PURE__ */ jsx("ul", {
					className: "space-y-2.5",
					children: preview.items.map((i) => /* @__PURE__ */ jsxs("li", {
						className: "text-[13px]",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: i.url,
								target: "_blank",
								rel: "noreferrer",
								className: "font-medium text-ink hover:text-accent",
								children: i.title
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-[12px] text-ink-4",
								children: [
									i.publishedAt ? bj(i.publishedAt, true) : "无发布时间",
									" · ",
									i.url
								]
							}),
							i.excerpt && /* @__PURE__ */ jsx("div", {
								className: "mt-0.5 line-clamp-2 text-[12.5px] text-ink-3",
								children: i.excerpt
							})
						]
					}, i.url))
				}) : /* @__PURE__ */ jsx(Empty, { children: "没有抓到条目。检查地址、选择器或登录要求。" })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-5 xl:grid-cols-[1fr_380px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ jsxs(Card, {
						title: "设置",
						right: /* @__PURE__ */ jsxs("span", { children: ["版本 ", bj(s.updated_at, true)] }),
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "名称",
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.name,
											onChange: (e) => setDraft({
												...draft,
												name: e.target.value
											})
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "采集间隔（分钟）",
										children: /* @__PURE__ */ jsx(Input, {
											type: "number",
											min: 1,
											max: 1440,
											value: draft.interval_minutes,
											onChange: (e) => setDraft({
												...draft,
												interval_minutes: Number(e.target.value)
											})
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "参与方式",
										hint: "氛围只作热点讨论证据，不单独成为内容",
										children: /* @__PURE__ */ jsx(Select, {
											value: draft.participation_mode,
											onChange: (e) => setDraft({
												...draft,
												participation_mode: e.target.value
											}),
											children: Object.entries(MODE_LABEL).map(([k, v]) => /* @__PURE__ */ jsx("option", {
												value: k,
												children: v
											}, k))
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "等级",
										children: /* @__PURE__ */ jsx(Select, {
											value: draft.tier,
											onChange: (e) => setDraft({
												...draft,
												tier: e.target.value
											}),
											children: Object.entries(TIER_LABEL).map(([k, v]) => /* @__PURE__ */ jsx("option", {
												value: k,
												children: v
											}, k))
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "讨论分组 ID",
										hint: "同一机构的多个账号共用，热度只算一次",
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.signal_group_id ?? "",
											onChange: (e) => setDraft({
												...draft,
												signal_group_id: e.target.value
											})
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "运营主体 ID",
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.owner_entity_id ?? "",
											onChange: (e) => setDraft({
												...draft,
												owner_entity_id: e.target.value
											})
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "标签（逗号分隔）",
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.tags,
											onChange: (e) => setDraft({
												...draft,
												tags: e.target.value
											})
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-col justify-end gap-2 text-[13px] text-ink-2",
										children: [
											["first_party", "一手信源（官方账号或官网）"],
											["site_fulltext", "站内可展示全文"],
											["syndicate_fulltext", "对外接口可带全文"]
										].map(([k, label]) => /* @__PURE__ */ jsxs("label", {
											className: "inline-flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												className: "size-4 accent-[var(--accent)]",
												checked: draft[k],
												onChange: (e) => setDraft({
													...draft,
													[k]: e.target.checked
												})
											}), label]
										}, k))
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ jsx(Field, {
									label: "采集配置（JSON）",
									children: /* @__PURE__ */ jsx(Textarea, {
										className: "font-mono !text-[12px]",
										rows: Math.min(18, draft.config.split("\n").length + 1),
										value: draft.config,
										onChange: (e) => setDraft({
											...draft,
											config: e.target.value
										}),
										spellCheck: false
									})
								}), configError && /* @__PURE__ */ jsx("div", {
									className: "mt-1 text-[12.5px] text-hot",
									children: configError
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex items-center justify-end gap-2",
								children: [
									changes > 0 && /* @__PURE__ */ jsxs("span", {
										className: "text-[12.5px] text-ink-3",
										children: [changes, " 项改动未保存"]
									}),
									/* @__PURE__ */ jsx(Button, {
										tone: "ghost",
										disabled: !changes,
										onClick: () => setDraft(draftOf(s)),
										children: "还原"
									}),
									/* @__PURE__ */ jsx(Button, {
										tone: "primary",
										disabled: !changes,
										onClick: () => patch() && setDialog("save"),
										children: "保存"
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx(Card, {
						title: "最近条目",
						pad: false,
						children: /* @__PURE__ */ jsx(DataTable, {
							rows: items,
							rowKey: (r) => r.id,
							empty: "还没有采集到内容",
							columns: [
								{
									key: "t",
									label: "标题",
									render: (r) => /* @__PURE__ */ jsx(Link, {
										to: `/admin/content/${r.id}`,
										className: "line-clamp-2 min-w-[260px] text-ink hover:text-accent",
										children: r.title_zh || r.title
									})
								},
								{
									key: "s",
									label: "状态",
									render: (r) => /* @__PURE__ */ jsxs("span", {
										className: "flex gap-1",
										children: [
											r.selected && /* @__PURE__ */ jsx(Badge, {
												tone: "accent",
												children: "精选"
											}),
											r.visibility && r.visibility !== "public" && /* @__PURE__ */ jsx(Badge, {
												tone: "warn",
												children: VISIBILITY_LABEL[r.visibility]
											}),
											/* @__PURE__ */ jsx(Badge, { children: r.processing_state })
										]
									})
								},
								{
									key: "d",
									label: "发现",
									render: (r) => /* @__PURE__ */ jsx(Time, { at: r.discovered_at })
								}
							]
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ jsxs(Card, {
							title: "状态",
							children: [/* @__PURE__ */ jsx(KV, { items: [
								["上次抓取", s.last_fetch_at ? bj(s.last_fetch_at, true) : null],
								["上次成功", s.last_ok_at ? bj(s.last_ok_at, true) : null],
								["下次抓取", s.next_fetch_at ? bj(s.next_fetch_at, true) : null],
								["创建", bj(s.created_at, true)]
							] }), s.cursor && /* @__PURE__ */ jsx("div", {
								className: "mt-3",
								children: /* @__PURE__ */ jsx(Json, {
									value: s.cursor,
									label: "游标"
								})
							})]
						}),
						/* @__PURE__ */ jsx(Card, {
							title: "采集记录",
							pad: false,
							children: /* @__PURE__ */ jsx(DataTable, {
								dense: true,
								rows: runs,
								rowKey: (r) => r.id,
								empty: "还没有采集记录",
								columns: [
									{
										key: "at",
										label: "时间",
										render: (r) => /* @__PURE__ */ jsx("span", {
											className: "num whitespace-nowrap",
											children: bj(r.started_at)
										})
									},
									{
										key: "st",
										label: "结果",
										render: (r) => /* @__PURE__ */ jsxs("span", {
											className: "inline-flex gap-1",
											children: [
												/* @__PURE__ */ jsx(Badge, {
													tone: r.status === "ok" ? "ok" : r.status === "failed" ? "bad" : "muted",
													title: r.error ?? void 0,
													children: r.status
												}),
												!!r.detail?.dropped && /* @__PURE__ */ jsx(Badge, {
													tone: "bad",
													title: "有一段更早的帖子没能读完，其中的内容可能漏采",
													children: "可能漏采"
												}),
												!r.detail?.dropped && !!r.detail?.backlog && /* @__PURE__ */ jsxs(Badge, {
													tone: "warn",
													title: "帖子多于一轮能读的页数，余下的在后面几轮接着读",
													children: [
														"续读 ",
														r.detail.backlog,
														" 段"
													]
												})
											]
										})
									},
									{
										key: "n",
										label: "发现/新增",
										align: "right",
										render: (r) => `${r.found_count ?? "—"}/${r.new_count ?? "—"}`
									},
									{
										key: "ms",
										label: "耗时",
										align: "right",
										render: (r) => duration(r.started_at, r.finished_at)
									}
								]
							})
						}),
						/* @__PURE__ */ jsx(Card, {
							title: "修改记录",
							children: history.length ? /* @__PURE__ */ jsx("ul", {
								className: "space-y-3 text-[12.5px]",
								children: history.map((h, i) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("div", {
									className: "text-ink-2",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "font-medium",
											children: h.action
										}),
										" · ",
										h.actor,
										" · ",
										bj(h.created_at)
									]
								}), h.reason && /* @__PURE__ */ jsx("div", {
									className: "text-ink-3",
									children: h.reason
								})] }, i))
							}) : /* @__PURE__ */ jsx(Empty, { children: "没有人工修改" })
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "save",
				title: "保存信源设置",
				description: `将修改：${Object.keys(patchPreview(draft, s)).join("、") || "无"}`,
				busy: pending === "save",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => {
					const p = patch();
					if (!p) return false;
					return await run("PATCH", base, {
						patch: p,
						version: new Date(s.updated_at).toISOString(),
						reason
					}, {
						label: "save",
						success: "已保存"
					}) !== null;
				}
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "toggle",
				title: s.enabled ? "暂停这个信源" : "恢复这个信源",
				description: s.enabled ? "暂停后不再采集，已有内容和历史保留。" : "恢复后会立即排队采集一次。",
				danger: s.enabled,
				confirmLabel: s.enabled ? "暂停" : "恢复",
				busy: pending === "toggle",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => {
					return await run("PATCH", base, {
						patch: { enabled: !s.enabled },
						version: new Date(s.updated_at).toISOString(),
						reason
					}, {
						label: "toggle",
						success: s.enabled ? "已暂停" : "已恢复"
					}) !== null;
				}
			})
		]
	});
});
/** Field names that differ from the saved source (for the confirmation text). */
function patchPreview(draft, s) {
	const out = {};
	const saved = draftOf(s);
	for (const k of Object.keys(draft)) if (k === "config") try {
		if (JSON.stringify(JSON.parse(draft.config)) !== JSON.stringify(s.config)) out.config = true;
	} catch {
		out.config = true;
	}
	else if (String(draft[k] ?? "") !== String(saved[k] ?? "")) out[k] = true;
	return out;
}
//#endregion
//#region app/routes/admin/monitor.tsx
var monitor_exports = /* @__PURE__ */ __exportAll({
	default: () => monitor_default,
	loader: () => loader$7,
	meta: () => meta$7
});
async function loader$7({ request }) {
	const url = new URL(request.url);
	const tab = url.searchParams.get("tab") ?? "events";
	if (tab === "posts") return {
		tab,
		posts: await adminGet(request, `/api/admin/monitor/posts?filter=${url.searchParams.get("filter") ?? "relevant"}&page=${url.searchParams.get("page") ?? 1}`),
		events: null
	};
	return {
		tab,
		posts: null,
		events: await adminGet(request, `/api/admin/monitor/events${url.searchParams.get("withdrawn") ? "?withdrawn=1" : ""}`)
	};
}
var meta$7 = () => [{ title: `Codex 重置 · ${SITE.name} 后台` }];
var toLocal = (iso) => iso ? new Date(new Date(iso).getTime() + 288e5).toISOString().slice(0, 16) : "";
var fromLocal = (v) => v ? `${v}:00+08:00` : null;
var KIND = {
	direct_reset: "额度重置",
	reset_credit: "重置卡"
};
function EventCard({ e, all }) {
	const { run, pending } = useAdminAction();
	const [dialog, setDialog] = useState(null);
	const [form, setForm] = useState(() => formOf(e));
	const [reviewDay, setReviewDay] = useState(() => new Date(Date.now() + 288e5).toISOString().slice(0, 10));
	const [move, setMove] = useState(null);
	const version = new Date(e.updated_at).toISOString();
	const base = `/api/admin/monitor/events/${encodeURIComponent(e.id)}`;
	const p = e.presentation ?? {};
	return /* @__PURE__ */ jsxs("article", {
		className: `rounded-panel bg-surface p-4 ring-1 ${e.withdrawn ? "opacity-60 ring-line" : e.status === "confirmed" ? "ring-line" : "ring-accent/30"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx(Badge, {
									tone: e.type === "reset_credit" ? "info" : "accent",
									children: KIND[e.type]
								}),
								/* @__PURE__ */ jsx(Badge, {
									tone: e.status === "confirmed" ? "ok" : "warn",
									children: e.status === "confirmed" ? "已确认" : p.inProgress ? "下发中" : "已宣布"
								}),
								e.confirmation_basis === "receipt_review" && /* @__PURE__ */ jsx(Badge, {
									tone: "info",
									title: "根据账户回执核对确认",
									children: "回执核对"
								}),
								e.withdrawn && /* @__PURE__ */ jsx(Badge, {
									tone: "bad",
									children: "已撤回"
								}),
								!p.kindExplicit && /* @__PURE__ */ jsx(Badge, { children: "形式未明确" })
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-2 text-[15px] font-semibold text-ink",
							children: e.schedule?.label ?? (e.estimate ? `${SITE.name} 估计 ${e.estimate.label}` : "没有给出时间")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-0.5 text-[12.5px] text-ink-3",
							children: [
								p.audienceZh ?? e.scope ?? "适用对象未说明",
								p.productsZh ? ` · ${p.productsZh}` : "",
								e.confirmed_at ? ` · 确认于 ${bj(e.confirmed_at, true)}` : e.occurred_on ? ` · 发生于 ${e.occurred_on}` : ""
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 font-mono text-[11.5px] text-ink-4",
							children: [
								e.id,
								" · 更新 ",
								bj(e.updated_at, true)
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-1.5",
					children: [
						/* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => {
								setForm(formOf(e));
								setDialog("edit");
							},
							children: "编辑"
						}),
						e.status !== "confirmed" && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => setDialog("review"),
							children: "回执核对确认"
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "sm",
							tone: "ghost",
							onClick: () => setDialog("withdraw"),
							children: e.withdrawn ? "恢复" : "撤回"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("ol", {
				className: "mt-3 space-y-2 border-t border-line pt-3",
				children: e.posts.map((post) => /* @__PURE__ */ jsxs("li", {
					className: "grid gap-1 text-[13px] sm:grid-cols-[92px_1fr_auto]",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 sm:block",
							children: [/* @__PURE__ */ jsx(Badge, {
								tone: post.action === "confirm" ? "ok" : "muted",
								children: post.stage
							}), /* @__PURE__ */ jsx("div", {
								className: "num text-[11.5px] text-ink-4 sm:mt-1",
								children: bj(post.publishedAt)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-ink",
								children: post.text
							}), /* @__PURE__ */ jsx("a", {
								className: "text-[12px] text-ink-4 hover:text-accent",
								href: post.url,
								target: "_blank",
								rel: "noreferrer",
								children: post.originalText
							})]
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "sm",
							tone: "ghost",
							onClick: () => {
								setMove({
									postId: post.postId,
									to: ""
								});
								setDialog("move");
							},
							children: "移动"
						})
					]
				}, post.postId))
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "edit",
				title: "编辑事件",
				description: "时间按北京时间填写；改动立即反映在重置页、v1 接口和版本探针上。",
				confirmLabel: "保存",
				busy: pending === "edit",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => {
					const patch = {
						type: form.type,
						status: form.status,
						audienceZh: form.audienceZh || null,
						productsZh: form.productsZh || null,
						scopeLabel: form.scopeLabel || null,
						schedule: form.precision ? {
							precision: form.precision,
							from: fromLocal(form.from),
							through: fromLocal(form.through || form.from)
						} : null
					};
					if (form.status === "confirmed") patch.confirmedAt = fromLocal(form.confirmedAt);
					return await run("PATCH", base, {
						patch,
						reason,
						version
					}, {
						label: "edit",
						success: "事件已更新"
					}) !== null;
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "类型",
							children: /* @__PURE__ */ jsxs(Select, {
								value: form.type,
								onChange: (ev) => setForm({
									...form,
									type: ev.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "direct_reset",
									children: "额度重置"
								}), /* @__PURE__ */ jsx("option", {
									value: "reset_credit",
									children: "重置卡"
								})]
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "状态",
							children: /* @__PURE__ */ jsxs(Select, {
								value: form.status,
								onChange: (ev) => setForm({
									...form,
									status: ev.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "announced",
									children: "已宣布"
								}), /* @__PURE__ */ jsx("option", {
									value: "confirmed",
									children: "已确认"
								})]
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "时间精度",
							children: /* @__PURE__ */ jsxs(Select, {
								value: form.precision,
								onChange: (ev) => setForm({
									...form,
									precision: ev.target.value
								}),
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "",
										children: "没有时间"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "window",
										children: "时间段"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "deadline",
										children: "截止时间（…前）"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "approximate",
										children: "大约"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "date",
										children: "整天"
									})
								]
							})
						}),
						form.status === "confirmed" && /* @__PURE__ */ jsx(Field, {
							label: "确认时间",
							children: /* @__PURE__ */ jsx(Input, {
								type: "datetime-local",
								value: form.confirmedAt,
								onChange: (ev) => setForm({
									...form,
									confirmedAt: ev.target.value
								})
							})
						}),
						form.precision && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Field, {
							label: "从",
							children: /* @__PURE__ */ jsx(Input, {
								type: "datetime-local",
								value: form.from,
								onChange: (ev) => setForm({
									...form,
									from: ev.target.value
								})
							})
						}), (form.precision === "window" || form.precision === "date") && /* @__PURE__ */ jsx(Field, {
							label: "到",
							children: /* @__PURE__ */ jsx(Input, {
								type: "datetime-local",
								value: form.through,
								onChange: (ev) => setForm({
									...form,
									through: ev.target.value
								})
							})
						})] }),
						/* @__PURE__ */ jsx(Field, {
							label: "适用对象（中文）",
							children: /* @__PURE__ */ jsx(Input, {
								value: form.audienceZh,
								onChange: (ev) => setForm({
									...form,
									audienceZh: ev.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "产品",
							children: /* @__PURE__ */ jsx(Input, {
								value: form.productsZh,
								onChange: (ev) => setForm({
									...form,
									productsZh: ev.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "范围标签（原文）",
							children: /* @__PURE__ */ jsx(Input, {
								value: form.scopeLabel,
								onChange: (ev) => setForm({
									...form,
									scopeLabel: ev.target.value
								})
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "review",
				title: "根据回执核对确认",
				description: "Tibo 没有发“已完成”，但账户里已经看到重置或重置卡（读者截图或自有账号）。知道哪天生效就填北京时间日期，不确定就清空；不发通知。Tibo 之后补发确认帖时，来源会自动改为官方确认，这条核对记录保留。",
				confirmLabel: "确认",
				busy: pending === "review",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", `${base}/receipt-review`, {
					occurredOn: reviewDay || null,
					reason,
					version
				}, {
					label: "review",
					success: "已确认"
				}) !== null,
				children: /* @__PURE__ */ jsx(Field, {
					label: "生效日（北京时间，不确定就清空）",
					children: /* @__PURE__ */ jsx(Input, {
						type: "date",
						value: reviewDay,
						onChange: (ev) => setReviewDay(ev.target.value)
					})
				})
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "withdraw",
				title: e.withdrawn ? "恢复事件" : "撤回事件",
				description: e.withdrawn ? "恢复后重新出现在重置页和接口里。" : "撤回后不再出现在重置页和接口里（识别错误、重复事件）。",
				danger: !e.withdrawn,
				confirmLabel: e.withdrawn ? "恢复" : "撤回",
				busy: pending === "withdraw",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", `${base}/withdrawn`, {
					withdrawn: !e.withdrawn,
					reason,
					version
				}, {
					label: "withdraw",
					success: e.withdrawn ? "已恢复" : "已撤回"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "move",
				title: "移动帖子",
				description: "把这条帖子挂到另一个事件，或从事件里移除。",
				confirmLabel: "移动",
				busy: pending === "move",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", "/api/admin/monitor/relink", {
					postId: move.postId,
					fromEventId: e.id,
					toEventId: move.to || null,
					reason
				}, {
					label: "move",
					success: "帖子已移动"
				}) !== null,
				children: /* @__PURE__ */ jsx(Field, {
					label: "目标事件",
					children: /* @__PURE__ */ jsxs(Select, {
						value: move?.to ?? "",
						onChange: (ev) => setMove({
							...move,
							to: ev.target.value
						}),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "移出（不属于任何事件）"
						}), all.filter((x) => x.id !== e.id).slice(0, 60).map((x) => /* @__PURE__ */ jsxs("option", {
							value: x.id,
							children: [
								bj(x.created_at),
								" · ",
								KIND[x.type],
								" · ",
								x.schedule?.label ?? x.id
							]
						}, x.id))]
					})
				})
			})
		]
	});
}
function formOf(e) {
	const p = e.presentation ?? {};
	return {
		type: e.type,
		status: e.status,
		precision: e.schedule?.precision === "exact" ? "window" : e.schedule?.precision ?? "",
		from: toLocal(e.schedule?.from),
		through: toLocal(e.schedule?.through),
		confirmedAt: toLocal(e.confirmed_at),
		audienceZh: String(p.audienceZh ?? ""),
		productsZh: String(p.productsZh ?? ""),
		scopeLabel: String(p.scopeLabel ?? "")
	};
}
function PostRow({ post }) {
	const props = post.propositions ?? [];
	const { run, pending } = useAdminAction();
	const [dialog, setDialog] = useState(null);
	const resolve = async (action, reason) => await run("POST", `/api/admin/monitor/posts/${post.id}/resolve`, {
		action,
		reason
	}, {
		label: action,
		success: action === "skip" ? "已跳过" : "已标记为核实"
	}) !== null;
	return /* @__PURE__ */ jsxs("article", {
		className: "rounded-panel bg-surface p-4 ring-1 ring-line",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-3",
				children: [
					/* @__PURE__ */ jsx("a", {
						href: post.url,
						target: "_blank",
						rel: "noreferrer",
						className: "num hover:text-accent",
						children: bj(post.published_at, true)
					}),
					post.skipped ? /* @__PURE__ */ jsx(Badge, { children: "已跳过" }) : post.relevant ? /* @__PURE__ */ jsx(Badge, {
						tone: "accent",
						children: "相关"
					}) : post.processed_at ? /* @__PURE__ */ jsx(Badge, { children: "无关" }) : /* @__PURE__ */ jsx(Badge, {
						tone: "warn",
						children: "待识别"
					}),
					post.needs_review && !post.reviewed && /* @__PURE__ */ jsx(Badge, {
						tone: "bad",
						children: "需要复核"
					}),
					post.reviewed && /* @__PURE__ */ jsx(Badge, {
						tone: "ok",
						children: "已核实"
					}),
					post.failures && /* @__PURE__ */ jsxs(Badge, {
						tone: "bad",
						title: post.failures.error,
						children: [
							"识别失败 ",
							post.failures.count,
							" 次"
						]
					}),
					post.links.map((l) => /* @__PURE__ */ jsx(Badge, {
						tone: "info",
						title: l.eventId,
						children: l.stage
					}, l.eventId)),
					/* @__PURE__ */ jsxs("span", {
						className: "ml-auto flex gap-1.5",
						children: [!post.processed_at && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => setDialog("skip"),
							children: "跳过"
						}), post.needs_review && !post.reviewed && post.processed_at && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => setDialog("reviewed"),
							children: "标记已核实"
						})]
					})
				]
			}),
			post.held && post.held.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-2 rounded-control bg-bg-sunk px-3 py-2 text-[12.5px] text-ink-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "font-medium text-ink-2",
					children: "没有自动生效的识别（引文不在原帖里，或对“已完成”没有把握）"
				}), post.held.map((h, i) => /* @__PURE__ */ jsxs("div", { children: [
					h.action,
					" · “",
					h.excerpt,
					"”"
				] }, i))]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink",
				children: post.translation ?? post.text
			}),
			post.translation && /* @__PURE__ */ jsx("p", {
				className: "mt-1 whitespace-pre-wrap text-[12.5px] text-ink-4",
				children: post.text
			}),
			props.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-2 space-y-1",
				children: [props.map((p, i) => /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5 text-[12px]",
					children: [
						/* @__PURE__ */ jsx(Badge, {
							tone: p.real ? "ok" : "muted",
							children: p.real ? "真实" : "非承诺"
						}),
						/* @__PURE__ */ jsxs(Badge, { children: [
							KIND[p.kind] ?? p.kind,
							" · ",
							p.action
						] }),
						p.relatesTo && /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-ink-4",
							children: ["→ ", p.relatesTo]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-ink-3",
							children: p.excerptZh ?? p.excerpt
						})
					]
				}, i)), /* @__PURE__ */ jsx(Json, {
					value: props,
					label: "识别结果"
				})]
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "skip",
				title: "跳过这条帖子",
				description: "帖子按顺序识别，这条一直失败会挡住后面所有帖子。跳过后它不再识别、不产生事件；确有重置内容请到“事件”里手动处理。",
				danger: true,
				confirmLabel: "跳过",
				busy: pending === "skip",
				onClose: () => setDialog(null),
				onSubmit: (reason) => resolve("skip", reason)
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "reviewed",
				title: "标记已核实",
				description: "已经按原帖处理过（修改或确认了事件，或确认不需要处理）。标记后它离开复核列表，告警也会停止。",
				confirmLabel: "标记",
				busy: pending === "reviewed",
				onClose: () => setDialog(null),
				onSubmit: (reason) => resolve("reviewed", reason)
			})
		]
	});
}
var monitor_default = UNSAFE_withComponentProps(function MonitorAdmin({ loaderData }) {
	const [sp] = useSearchParams();
	const tab = loaderData.tab;
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "Codex 重置",
		subtitle: "修正识别结果：事件类型、状态、时间与适用对象；没有“已完成”帖子时用回执核对确认；识别错的事件撤回；帖子挂错可以移动。",
		actions: /* @__PURE__ */ jsx("a", {
			className: "text-[13px] text-accent",
			href: "/codex-reset",
			target: "_blank",
			rel: "noreferrer",
			children: "打开公开页"
		}),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex gap-1.5",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "?tab=events",
						className: `rounded-full px-3.5 py-1.5 text-[13px] ${tab === "events" ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line"}`,
						children: "事件"
					}), /* @__PURE__ */ jsx(Link, {
						to: "?tab=posts",
						className: `rounded-full px-3.5 py-1.5 text-[13px] ${tab === "posts" ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line"}`,
						children: "帖子与识别"
					})]
				}), tab === "events" ? /* @__PURE__ */ jsx(Link, {
					to: sp.get("withdrawn") ? "?tab=events" : "?tab=events&withdrawn=1",
					className: "text-[12.5px] text-ink-3 hover:text-ink",
					children: sp.get("withdrawn") ? "隐藏已撤回" : "包括已撤回"
				}) : /* @__PURE__ */ jsx(FilterChips, {
					param: "filter",
					options: [
						{
							value: "relevant",
							label: "相关"
						},
						{
							value: "review",
							label: "需复核"
						},
						{
							value: "pending",
							label: "待识别"
						},
						{
							value: "all",
							label: "全部"
						}
					]
				})]
			}),
			loaderData.events && /* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: loaderData.events.events.length ? loaderData.events.events.map((e) => /* @__PURE__ */ jsx(EventCard, {
					e,
					all: loaderData.events.events
				}, `${e.id}-${e.updated_at}`)) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Empty, { children: "没有事件" }) })
			}),
			loaderData.posts && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: loaderData.posts.rows.length ? loaderData.posts.rows.map((p) => /* @__PURE__ */ jsx(PostRow, { post: p }, p.id)) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Empty, { children: "没有符合条件的帖子" }) })
			}), /* @__PURE__ */ jsx(Pager, {
				page: loaderData.posts.page,
				hasMore: loaderData.posts.rows.length === 50
			})] })
		]
	});
});
//#endregion
//#region app/routes/admin/feedback.tsx
var feedback_exports = /* @__PURE__ */ __exportAll({
	default: () => feedback_default,
	loader: () => loader$6,
	meta: () => meta$6
});
async function loader$6({ request }) {
	return adminGet(request, `/api/admin/feedback${new URL(request.url).search}`);
}
var meta$6 = () => [{ title: `反馈 · ${SITE.name} 后台` }];
var TONE = {
	new: "accent",
	triaged: "warn",
	replied: "ok",
	resolved: "ok",
	spam: "muted"
};
function FeedbackCard({ f }) {
	const { run, pending } = useAdminAction();
	const [note, setNote] = useState(f.note ?? "");
	const [dialog, setDialog] = useState(null);
	const base = `/api/admin/feedback/${f.id}`;
	const version = new Date(f.updated_at).toISOString();
	return /* @__PURE__ */ jsxs("article", {
		className: "rounded-panel bg-surface p-4 ring-1 ring-line",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 text-[12.5px] text-ink-3",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "num font-medium text-ink-2",
						children: ["#", f.id]
					}),
					/* @__PURE__ */ jsx(Badge, {
						tone: TONE[f.status] ?? "muted",
						children: FEEDBACK_STATUS[f.status] ?? f.status
					}),
					/* @__PURE__ */ jsx(Time, { at: f.created_at }),
					f.email && /* @__PURE__ */ jsx("a", {
						className: "text-accent",
						href: `mailto:${f.email}`,
						children: f.email
					}),
					f.page_url && /* @__PURE__ */ jsx("a", {
						className: "max-w-[320px] truncate hover:text-accent",
						href: f.page_url,
						target: "_blank",
						rel: "noreferrer",
						children: f.page_url
					}),
					f.from_source > 1 && /* @__PURE__ */ jsxs(Badge, {
						tone: "info",
						title: "同一来源（IP 与浏览器家族的不可逆标识）",
						children: [
							"同来源 ",
							f.from_source,
							" 条"
						]
					}),
					f.banned && /* @__PURE__ */ jsx(Badge, {
						tone: "bad",
						children: "来源已封禁"
					}),
					!f.forwarded_at && f.status === "new" && /* @__PURE__ */ jsx(Badge, {
						tone: "warn",
						title: f.forward_error && f.forward_error !== "pending" ? `还没有转发到内部飞书群：${f.forward_error}` : "还没有转发到内部飞书群",
						children: "未转发"
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2.5 whitespace-pre-wrap text-[14px] leading-relaxed text-ink",
				children: f.content
			}),
			f.screenshot === "local" && /* @__PURE__ */ jsx("a", {
				href: `${base}/screenshot`,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-2 inline-block",
				children: /* @__PURE__ */ jsx("img", {
					src: `${base}/screenshot`,
					alt: "反馈截图",
					loading: "lazy",
					className: "max-h-48 rounded-control ring-1 ring-line"
				})
			}),
			f.screenshot === "feishu" && /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-[12.5px] text-ink-4",
				children: "截图已随反馈转到内部飞书群。"
			}),
			f.screenshot === "gone" && /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-[12.5px] text-ink-4",
				children: "截图未能转到飞书，已删除。"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-[180px_1fr_auto] sm:items-start",
				children: [
					/* @__PURE__ */ jsx(Select, {
						"aria-label": "处理状态",
						value: f.status,
						disabled: !!pending,
						onChange: (e) => run("PATCH", base, {
							status: e.target.value,
							version
						}, {
							label: "status",
							success: "状态已更新"
						}),
						children: Object.entries(FEEDBACK_STATUS).map(([k, v]) => /* @__PURE__ */ jsx("option", {
							value: k,
							children: v
						}, k))
					}),
					/* @__PURE__ */ jsx(Textarea, {
						rows: 1,
						className: "!min-h-[38px]",
						placeholder: "处理备注（仅内部可见）",
						value: note,
						onChange: (e) => setNote(e.target.value)
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-1.5",
						children: [
							/* @__PURE__ */ jsx(Button, {
								size: "md",
								disabled: note === (f.note ?? ""),
								busy: pending === "note",
								onClick: () => run("PATCH", base, {
									note: note || null,
									version
								}, {
									label: "note",
									success: "备注已保存"
								}),
								children: "保存备注"
							}),
							/* @__PURE__ */ jsx(Button, {
								tone: "ghost",
								onClick: () => setDialog(f.banned ? null : "ban"),
								disabled: f.banned,
								title: "拒绝这个来源的后续反馈",
								children: "封禁来源"
							}),
							/* @__PURE__ */ jsx(Button, {
								tone: "ghost",
								onClick: () => setDialog("erase"),
								title: "按隐私说明删除提交者的资料",
								children: "删除资料"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "ban",
				title: "封禁这个反馈来源",
				description: "同一来源之后提交反馈会被拒绝。来源标识不可还原成 IP。",
				danger: true,
				confirmLabel: "封禁",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", "/api/admin/feedback-bans", {
					sourceHash: f.source_hash,
					reason
				}, {
					label: "ban",
					success: "已封禁"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: dialog === "erase",
				title: "删除提交者资料",
				description: "删除正文、邮箱、页面地址和截图，只保留处理记录。不可恢复。",
				danger: true,
				confirmLabel: "删除",
				onClose: () => setDialog(null),
				onSubmit: async (reason) => await run("POST", `${base}/erase`, { reason }, {
					label: "erase",
					success: "资料已删除"
				}) !== null
			})
		]
	});
}
var feedback_default = UNSAFE_withComponentProps(function FeedbackAdmin({ loaderData }) {
	const { rows, counts, bans, page } = loaderData;
	const [sp] = useSearchParams();
	const { run } = useAdminAction();
	const total = Object.values(counts).reduce((a, b) => a + b, 0);
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "反馈",
		subtitle: "回复用飞书邮箱发送，收件人、主题、正文都确认后再发；“已修复上线”要有生产证据。签名统一 AI HOT。",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ jsx(FilterChips, {
					param: "status",
					options: [{
						value: "",
						label: "全部",
						count: total
					}, ...Object.entries(FEEDBACK_STATUS).map(([k, v]) => ({
						value: k,
						label: v,
						count: counts[k] ?? 0
					}))]
				}), /* @__PURE__ */ jsxs(Form, {
					method: "get",
					className: "w-full max-w-xs",
					children: [sp.get("status") && /* @__PURE__ */ jsx("input", {
						type: "hidden",
						name: "status",
						value: sp.get("status")
					}), /* @__PURE__ */ jsx(Input, {
						name: "q",
						defaultValue: sp.get("q") ?? "",
						placeholder: "搜索内容、邮箱、页面",
						"aria-label": "搜索反馈"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: rows.length ? rows.map((f) => /* @__PURE__ */ jsx(FeedbackCard, { f }, `${f.id}-${f.updated_at}`)) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Empty, { children: "没有符合条件的反馈" }) })
			}),
			/* @__PURE__ */ jsx(Pager, {
				page,
				hasMore: rows.length === 50
			}),
			bans.length > 0 && /* @__PURE__ */ jsx(Card, {
				className: "mt-8",
				title: "已封禁的来源",
				children: /* @__PURE__ */ jsx("ul", {
					className: "space-y-2 text-[13px]",
					children: bans.map((b) => /* @__PURE__ */ jsxs("li", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-[12px] text-ink-3",
								children: b.source_hash
							}),
							" · ",
							b.reason,
							" · ",
							b.created_by,
							" · ",
							bj(b.created_at, true)
						] }), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							tone: "ghost",
							onClick: () => run("DELETE", `/api/admin/feedback-bans/${encodeURIComponent(b.source_hash)}`, void 0, {
								label: `unban-${b.source_hash}`,
								success: "已解除封禁"
							}),
							children: "解除"
						})]
					}, b.source_hash))
				})
			})
		]
	});
});
//#endregion
//#region app/routes/admin/runs.tsx
var runs_exports = /* @__PURE__ */ __exportAll({
	default: () => runs_default,
	loader: () => loader$5,
	meta: () => meta$5
});
async function loader$5({ request }) {
	return adminGet(request, "/api/admin/runs");
}
var meta$5 = () => [{ title: `运行 · ${SITE.name} 后台` }];
var STATE_LABEL = {
	created: "排队",
	retry: "等待重试",
	active: "执行中"
};
var runs_default = UNSAFE_withComponentProps(function RunsAdmin({ loaderData }) {
	const refresh = useFetcher();
	const r = refresh.data ?? loaderData;
	const { run, pending } = useAdminAction();
	const [receipt, setReceipt] = useState(null);
	const [billed, setBilled] = useState("false");
	const [delivery, setDelivery] = useState(null);
	const [outcome, setOutcome] = useState("sent");
	const [requeue, setRequeue] = useState(null);
	useEffect(() => {
		const t = setInterval(() => document.visibilityState === "visible" && refresh.state === "idle" && refresh.load("/admin/runs"), 2e4);
		return () => clearInterval(t);
	}, [refresh]);
	const backlog = /* @__PURE__ */ new Map();
	for (const q of r.queues) backlog.set(q.name, {
		...backlog.get(q.name) ?? {},
		[q.state]: {
			n: q.n,
			oldest: q.oldest
		}
	});
	const queued = r.queues.filter((q) => q.state !== "active").reduce((a, q) => a + q.n, 0);
	const worker = r.processes.find((p) => p.role === "worker");
	const failing = r.jobs.filter((j) => j.status === "failed");
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "运行",
		subtitle: /* @__PURE__ */ jsxs(Fragment, { children: ["任务、队列、信源延迟与需要人工核对的回执和投递。每 20 秒自动刷新 · 最近检查 ", bj(r.checkedAt)] }),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ jsx(Stat, {
						label: "worker",
						value: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2 text-[18px]",
							children: [/* @__PURE__ */ jsx(Dot, { tone: worker?.alive ? "ok" : "bad" }), worker ? worker.alive ? "运行中" : "心跳中断" : "无心跳"]
						}),
						hint: worker ? `${worker.host} · 心跳 ${ago(worker.at)}` : "worker 未上报心跳"
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "队列积压",
						value: num(queued),
						tone: queued > 500 ? "warn" : void 0,
						hint: "排队与等待重试"
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "失败的定时任务",
						value: num(failing.length),
						tone: failing.length ? "bad" : "ok",
						hint: "最近一次运行失败"
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "回执结果未知",
						value: num(r.receipts.issues.filter((x) => x.status === "unknown").length),
						tone: r.receipts.issues.some((x) => x.status === "unknown") ? "bad" : "ok",
						hint: `7 天 ${num(Object.values(r.receipts.counts).reduce((a, b) => a + b, 0))} 次付费请求`
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "投递待核实",
						value: num(r.deliveries.filter((d) => d.status === "unknown").length),
						tone: r.deliveries.some((d) => d.status === "unknown") ? "bad" : "ok"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-5 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "队列",
					pad: false,
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: [...backlog.entries()],
						rowKey: ([name]) => name,
						empty: "队列是空的",
						columns: [
							{
								key: "n",
								label: "队列",
								render: ([name]) => /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[12.5px]",
									children: name
								})
							},
							...[
								"created",
								"retry",
								"active"
							].map((st) => ({
								key: st,
								label: STATE_LABEL[st],
								align: "right",
								render: ([, v]) => v[st] ? /* @__PURE__ */ jsx("span", {
									title: `最早 ${bj(v[st].oldest, true)}`,
									children: num(v[st].n)
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-ink-4",
									children: "0"
								})
							})),
							{
								key: "old",
								label: "最早排队",
								render: ([, v]) => /* @__PURE__ */ jsx(Time, { at: v.created?.oldest ?? v.retry?.oldest ?? null })
							}
						]
					})
				}), /* @__PURE__ */ jsx(Card, {
					title: "定时任务",
					pad: false,
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.jobs,
						rowKey: (j) => j.job,
						columns: [
							{
								key: "j",
								label: "任务",
								render: (j) => /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[12.5px]",
									children: j.job
								})
							},
							{
								key: "s",
								label: "上次",
								render: (j) => /* @__PURE__ */ jsx(Badge, {
									tone: j.status === "ok" ? "ok" : j.status === "failed" ? "bad" : "muted",
									title: j.error ?? void 0,
									children: j.status ?? "运行中"
								})
							},
							{
								key: "at",
								label: "时间",
								render: (j) => /* @__PURE__ */ jsx(Time, { at: j.started_at })
							},
							{
								key: "d",
								label: "耗时",
								align: "right",
								render: (j) => duration(j.started_at, j.finished_at)
							},
							{
								key: "f",
								label: "24h 失败",
								align: "right",
								render: (j) => j.failed_24h ? /* @__PURE__ */ jsxs("span", {
									className: "text-hot",
									children: [
										j.failed_24h,
										"/",
										j.runs_24h
									]
								}) : `0/${j.runs_24h}`
							}
						]
					})
				})]
			}),
			r.failedJobs.length > 0 && /* @__PURE__ */ jsx(Card, {
				className: "mt-5",
				title: "24 小时内失败的队列任务",
				pad: false,
				children: /* @__PURE__ */ jsx(DataTable, {
					dense: true,
					rows: r.failedJobs,
					rowKey: (j) => j.name,
					columns: [
						{
							key: "n",
							label: "队列",
							render: (j) => /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[12.5px]",
								children: j.name
							})
						},
						{
							key: "c",
							label: "失败",
							align: "right",
							render: (j) => num(j.failed)
						},
						{
							key: "l",
							label: "最近",
							render: (j) => /* @__PURE__ */ jsx(Time, { at: j.last })
						},
						{
							key: "o",
							label: "最近错误",
							render: (j) => /* @__PURE__ */ jsx("span", {
								className: "line-clamp-2 font-mono text-[11.5px] text-ink-3",
								children: j.last_output
							})
						}
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid gap-5 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "需要核对的付费回执",
					right: /* @__PURE__ */ jsx("span", { children: Object.entries(r.receipts.counts).map(([k, v]) => `${k} ${v}`).join(" · ") }),
					pad: false,
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.receipts.issues,
						rowKey: (x) => x.id,
						empty: "没有待处理的回执",
						columns: [
							{
								key: "id",
								label: "回执",
								render: (x) => /* @__PURE__ */ jsxs("span", {
									className: "num",
									children: ["#", x.id]
								})
							},
							{
								key: "s",
								label: "状态",
								render: (x) => /* @__PURE__ */ jsx(Badge, {
									tone: x.status === "unknown" ? "bad" : "warn",
									children: x.status
								})
							},
							{
								key: "w",
								label: "服务",
								render: (x) => /* @__PURE__ */ jsxs("span", {
									className: "whitespace-nowrap",
									children: [x.service, x.model ? ` · ${x.model}` : ""]
								})
							},
							{
								key: "p",
								label: "用途",
								render: (x) => x.subject && /^[\w-]{10,}$/.test(x.subject) && x.purpose.includes("analy") ? /* @__PURE__ */ jsx(Link, {
									className: "text-accent",
									to: `/admin/content/${x.subject}`,
									children: x.purpose
								}) : x.purpose
							},
							{
								key: "e",
								label: "错误",
								render: (x) => /* @__PURE__ */ jsx("span", {
									className: "line-clamp-2 text-[12px] text-ink-3",
									title: x.error ?? "",
									children: x.error
								})
							},
							{
								key: "a",
								label: "",
								render: (x) => x.status === "unknown" ? /* @__PURE__ */ jsx(Button, {
									size: "sm",
									onClick: () => setReceipt(x),
									children: "核对"
								}) : null
							}
						]
					})
				}), /* @__PURE__ */ jsx(Card, {
					title: "需要核实的投递",
					pad: false,
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.deliveries,
						rowKey: (d) => d.id,
						empty: "没有待核实的投递",
						columns: [
							{
								key: "t",
								label: "目标",
								render: (d) => d.target_key
							},
							{
								key: "s",
								label: "状态",
								render: (d) => /* @__PURE__ */ jsx(Badge, {
									tone: d.status === "unknown" ? "bad" : "warn",
									children: d.status
								})
							},
							{
								key: "sub",
								label: "内容",
								render: (d) => d.subject_kind === "selected" ? /* @__PURE__ */ jsx(Link, {
									className: "text-accent",
									to: `/admin/content/${d.subject_id}`,
									children: d.subject_id
								}) : `${d.subject_kind} ${d.subject_id}`
							},
							{
								key: "at",
								label: "时间",
								render: (d) => /* @__PURE__ */ jsx(Time, { at: d.updated_at })
							},
							{
								key: "a",
								label: "",
								render: (d) => /* @__PURE__ */ jsx(Button, {
									size: "sm",
									onClick: () => setDelivery(d),
									children: "处理"
								})
							}
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid gap-5 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "延迟或失败的信源",
					right: /* @__PURE__ */ jsx(Link, {
						className: "text-accent",
						to: "/admin/sources?health=failing",
						children: "全部失败信源"
					}),
					pad: false,
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.lagging,
						rowKey: (s) => s.id,
						empty: "信源都按时采集",
						columns: [
							{
								key: "n",
								label: "信源",
								render: (s) => /* @__PURE__ */ jsx(Link, {
									className: "text-ink hover:text-accent",
									to: `/admin/sources/${encodeURIComponent(s.id)}`,
									children: s.name
								})
							},
							{
								key: "h",
								label: "健康",
								render: (s) => /* @__PURE__ */ jsx(Badge, {
									tone: s.health === "failing" ? "bad" : s.health === "degraded" ? "warn" : "muted",
									children: s.health
								})
							},
							{
								key: "ok",
								label: "上次成功",
								render: (s) => /* @__PURE__ */ jsx(Time, { at: s.last_ok_at })
							},
							{
								key: "nx",
								label: "应抓",
								render: (s) => /* @__PURE__ */ jsx(Time, { at: s.next_fetch_at })
							},
							{
								key: "e",
								label: "错误",
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "line-clamp-1 text-[12px] text-ink-3",
									title: s.last_error ?? "",
									children: s.last_error
								})
							}
						]
					})
				}), /* @__PURE__ */ jsx(Card, {
					title: "处理失败（30 天，按错误归类）",
					right: /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-3",
						children: [r.retrying.count > 0 && /* @__PURE__ */ jsxs("span", { children: [
							"等待重试 ",
							num(r.retrying.count),
							" 条 · 下一次 ",
							/* @__PURE__ */ jsx(Time, { at: r.retrying.next })
						] }), r.errors.length > 0 && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => setRequeue(""),
							children: "全部重新处理"
						})]
					}),
					pad: false,
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.errors,
						rowKey: (e) => e.error,
						empty: "没有处理失败",
						columns: [
							{
								key: "e",
								label: "错误",
								render: (e) => /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[11.5px] text-ink-2",
									children: e.error
								})
							},
							{
								key: "n",
								label: "条数",
								align: "right",
								render: (e) => num(e.n)
							},
							{
								key: "x",
								label: "示例",
								render: (e) => /* @__PURE__ */ jsx(Link, {
									className: "text-accent",
									to: `/admin/content/${e.example}`,
									children: "查看"
								})
							},
							{
								key: "l",
								label: "最近",
								render: (e) => /* @__PURE__ */ jsx(Time, { at: e.last })
							},
							{
								key: "a",
								label: "",
								align: "right",
								render: (e) => /* @__PURE__ */ jsx(Button, {
									size: "sm",
									onClick: () => setRequeue(e.error),
									children: "重新处理"
								})
							}
						]
					})
				})]
			}),
			r.leaderboard && /* @__PURE__ */ jsx(Card, {
				className: "mt-5",
				title: "模型榜评测来源",
				right: /* @__PURE__ */ jsxs("span", { children: [
					"最近抓取 ",
					bj(r.leaderboard.at),
					" · 成功 ",
					r.leaderboard.sources.filter((x) => x.ok).length,
					"/",
					r.leaderboard.sources.length
				] }),
				pad: false,
				children: /* @__PURE__ */ jsx("div", {
					className: "max-h-[360px] overflow-y-auto",
					children: /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.leaderboard.sources,
						rowKey: (x) => x.key,
						columns: [
							{
								key: "k",
								label: "来源",
								render: (x) => /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[12.5px]",
									children: x.key
								})
							},
							{
								key: "s",
								label: "上次抓取",
								render: (x) => /* @__PURE__ */ jsx(Badge, {
									tone: x.ok ? "ok" : "bad",
									children: x.ok ? x.changed ? "有更新" : "无变化" : "失败"
								})
							},
							{
								key: "ok",
								label: "上次成功",
								render: (x) => /* @__PURE__ */ jsx(Time, { at: x.lastOkAt })
							},
							{
								key: "n",
								label: "行数",
								align: "right",
								render: (x) => x.rows == null ? "—" : num(x.rows)
							},
							{
								key: "e",
								label: "错误",
								render: (x) => /* @__PURE__ */ jsx("span", {
									className: "line-clamp-1 text-[12px] text-ink-3",
									title: x.error ?? "",
									children: x.error
								})
							}
						]
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid gap-5 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "任务时间线",
					pad: false,
					children: /* @__PURE__ */ jsx("div", {
						className: "max-h-[420px] overflow-y-auto",
						children: /* @__PURE__ */ jsx(DataTable, {
							dense: true,
							rows: r.timeline,
							rowKey: (t) => t.id,
							columns: [
								{
									key: "at",
									label: "开始",
									render: (t) => /* @__PURE__ */ jsx("span", {
										className: "num whitespace-nowrap",
										children: bj(t.started_at)
									})
								},
								{
									key: "j",
									label: "任务",
									render: (t) => /* @__PURE__ */ jsx("span", {
										className: "font-mono text-[12px]",
										children: t.job
									})
								},
								{
									key: "s",
									label: "结果",
									render: (t) => /* @__PURE__ */ jsx(Badge, {
										tone: t.status === "ok" ? "ok" : t.status === "failed" ? "bad" : "muted",
										title: t.error ?? void 0,
										children: t.status ?? "运行中"
									})
								},
								{
									key: "d",
									label: "耗时",
									align: "right",
									render: (t) => duration(t.started_at, t.finished_at)
								}
							]
						})
					})
				}), /* @__PURE__ */ jsx(Card, {
					title: "外部上报",
					pad: false,
					children: r.ingest.length ? /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: r.ingest,
						rowKey: (e) => `${e.client}-${e.created_at}`,
						columns: [
							{
								key: "at",
								label: "时间",
								render: (e) => /* @__PURE__ */ jsx(Time, { at: e.created_at })
							},
							{
								key: "c",
								label: "客户端",
								render: (e) => e.client
							},
							{
								key: "k",
								label: "类型",
								render: (e) => e.kind
							},
							{
								key: "s",
								label: "结果",
								render: (e) => /* @__PURE__ */ jsx(Badge, {
									tone: e.status === "ok" ? "ok" : e.status === "error" ? "bad" : "muted",
									title: e.error ?? void 0,
									children: e.status
								})
							},
							{
								key: "x",
								label: "摘要",
								render: (e) => /* @__PURE__ */ jsx(Json, {
									value: e.summary,
									label: "摘要"
								})
							}
						]
					}) : /* @__PURE__ */ jsx(Empty, { children: "还没有外部上报（公众号截图监控、采集脚本）" })
				})]
			}),
			r.processes.length > 0 && /* @__PURE__ */ jsx(Card, {
				className: "mt-5",
				title: "进程",
				children: /* @__PURE__ */ jsx("ul", {
					className: "grid gap-2 text-[13px] sm:grid-cols-2 lg:grid-cols-3",
					children: r.processes.map((p) => /* @__PURE__ */ jsxs("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Dot, { tone: p.alive ? "ok" : "bad" }),
							/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: p.role
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-ink-3",
								children: [
									p.host,
									" · pid ",
									p.pid,
									" · ",
									p.release,
									" · 启动于 ",
									bj(p.startedAt)
								]
							})
						]
					}, p.role))
				})
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: !!receipt,
				title: `核对回执 #${receipt?.id ?? ""}`,
				description: "结果未知的请求不会自动重发。先到供应商控制台确认这次请求有没有计费，再放行：放行后下一次处理会重新发起调用。",
				confirmLabel: "记录并放行",
				busy: pending === "release",
				onClose: () => setReceipt(null),
				onSubmit: async (note) => await run("POST", `/api/admin/receipts/${receipt.id}/release`, {
					billed: billed === "true",
					note
				}, {
					label: "release",
					success: "已放行"
				}) !== null,
				children: /* @__PURE__ */ jsx(Field, {
					label: "供应商是否计费",
					children: /* @__PURE__ */ jsxs(Select, {
						value: billed,
						onChange: (e) => setBilled(e.target.value),
						children: [/* @__PURE__ */ jsx("option", {
							value: "false",
							children: "未计费（请求没有被接受）"
						}), /* @__PURE__ */ jsx("option", {
							value: "true",
							children: "已计费（结果没有取回）"
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: requeue !== null,
				title: requeue ? "重新处理这一类失败" : "重新处理全部失败",
				description: "这些文章会重新进入处理队列（正文、判断、发布）。模型调用会重新计费；供应商拒绝的内容可能再次失败。",
				confirmLabel: "重新处理",
				busy: pending === "requeue",
				onClose: () => setRequeue(null),
				onSubmit: async (reason) => await run("POST", "/api/admin/processing/requeue", {
					group: requeue || null,
					reason
				}, {
					label: "requeue",
					success: "已重新排队"
				}) !== null
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: !!delivery,
				title: "处理投递",
				description: "先到对应飞书群确认有没有收到。确认没收到再重发；开发环境不会真的发出。",
				confirmLabel: "确认",
				danger: outcome === "resend",
				busy: pending === "delivery",
				onClose: () => setDelivery(null),
				onSubmit: async (note) => await run("POST", `/api/admin/deliveries/${delivery.id}/resolve`, {
					outcome,
					note
				}, {
					label: "delivery",
					success: "已处理"
				}) !== null,
				children: /* @__PURE__ */ jsx(Field, {
					label: "结果",
					children: /* @__PURE__ */ jsxs(Select, {
						value: outcome,
						onChange: (e) => setOutcome(e.target.value),
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "sent",
								children: "群里已收到，标记为已送达"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "drop",
								children: "不再发送"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "resend",
								children: "群里没有，重新发送"
							})
						]
					})
				})
			})
		]
	});
});
//#endregion
//#region app/routes/admin/models.tsx
var models_exports = /* @__PURE__ */ __exportAll({
	default: () => models_default,
	loader: () => loader$4,
	meta: () => meta$4
});
async function loader$4({ request }) {
	const days = new URL(request.url).searchParams.get("days") ?? "7";
	return adminGet(request, `/api/admin/models?days=${encodeURIComponent(days)}`);
}
var meta$4 = () => [{ title: `模型与评测 · ${SITE.name} 后台` }];
var SOURCE_LABEL = {
	admin: "后台切换",
	env: "环境变量",
	default: "代码默认"
};
var secs = (ms) => ms == null ? "—" : ms >= 1e4 ? `${Math.round(ms / 1e3)} s` : `${(ms / 1e3).toFixed(1)} s`;
var models_default = UNSAFE_withComponentProps(function ModelsAdmin({ loaderData: m }) {
	const { run, pending } = useAdminAction();
	const [target, setTarget] = useState(null);
	const [choice, setChoice] = useState("");
	const labelOf = (key) => m.capabilities.find((c) => `capability:${c.key}` === key)?.label ?? key;
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "模型与评测",
		subtitle: "每项能力当前用哪个模型、来自哪里（后台切换 > 环境变量 > 代码默认），以及近期的成功率、耗时与费用。切换只影响之后的新任务，已有结果不重算；换精选模型前先看 SelectBench 同批对比。",
		actions: /* @__PURE__ */ jsx(FilterChips, {
			param: "days",
			options: [
				{
					value: "1",
					label: "24 小时"
				},
				{
					value: "",
					label: "7 天"
				},
				{
					value: "30",
					label: "30 天"
				}
			]
		}),
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-5",
				children: m.capabilities.map((c) => {
					const total = c.usage.reduce((a, u) => a + u.calls, 0);
					return /* @__PURE__ */ jsx(Card, {
						title: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex flex-wrap items-center gap-2",
							children: [
								c.label,
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-[12px] font-normal text-ink-3",
									children: c.current.model
								}),
								/* @__PURE__ */ jsx(Badge, {
									tone: c.current.source === "admin" ? "accent" : "muted",
									children: SOURCE_LABEL[c.current.source]
								})
							]
						}),
						right: /* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => {
								setTarget(c);
								setChoice(c.current.model);
							},
							children: "切换"
						}),
						pad: false,
						children: c.usage.length ? /* @__PURE__ */ jsx(DataTable, {
							dense: true,
							rows: c.usage,
							rowKey: (u) => `${u.purpose}|${u.model}|${u.promptVersion}`,
							columns: [
								{
									key: "m",
									label: "模型",
									render: (u) => /* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap font-mono text-[12px]",
										children: u.model
									})
								},
								{
									key: "v",
									label: "提示版本",
									render: (u) => /* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap font-mono text-[11.5px] text-ink-3",
										children: u.promptVersion ?? "—"
									})
								},
								{
									key: "p",
									label: "用途",
									render: (u) => /* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap font-mono text-[11.5px] text-ink-3",
										children: u.purpose
									})
								},
								{
									key: "c",
									label: "调用",
									align: "right",
									render: (u) => num(u.calls)
								},
								{
									key: "ok",
									label: "成功率",
									align: "right",
									render: (u) => {
										const rate = u.calls ? u.ok / u.calls : 0;
										return /* @__PURE__ */ jsx("span", {
											className: rate < .95 ? "text-hot" : "",
											title: `失败 ${u.failed} · 结果未知 ${u.unknown}`,
											children: `${Math.round(rate * 1e3) / 10}%`
										});
									}
								},
								{
									key: "l",
									label: "耗时 p50 / p95",
									align: "right",
									render: (u) => /* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap",
										children: `${secs(u.p50)} / ${secs(u.p95)}`
									})
								},
								{
									key: "t",
									label: "输入 / 输出 token",
									align: "right",
									render: (u) => /* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap",
										children: `${num(u.tokensIn)} / ${num(u.tokensOut)}`
									})
								},
								{
									key: "$",
									label: "费用",
									align: "right",
									render: (u) => u.actualCost !== null ? `${money(u.actualCost)}${u.currency && u.currency !== "CNY" ? ` ${u.currency}` : ""}` : u.estimate ? /* @__PURE__ */ jsxs("span", {
										title: "按用量 × 单价推算",
										children: [
											"≈ ",
											money(u.estimate.amount),
											u.estimate.currency !== "CNY" ? ` ${u.estimate.currency}` : ""
										]
									}) : /* @__PURE__ */ jsx("span", {
										className: "whitespace-nowrap text-ink-4",
										title: "服务商没有返回费用，按 token 数和你的模型单价自己估算",
										children: "未定价"
									})
								}
							]
						}) : /* @__PURE__ */ jsxs(Empty, { children: [
							m.days,
							" 天内没有调用",
							total === 0 && c.vision ? "（只在有图片时使用）" : ""
						] })
					}, c.key);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-5 grid gap-5 xl:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Card, {
					title: "切换记录",
					pad: false,
					children: m.history.length ? /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: m.history,
						rowKey: (h) => `${h.at}|${h.subject}`,
						columns: [
							{
								key: "at",
								label: "时间",
								render: (h) => /* @__PURE__ */ jsx("span", {
									className: "num whitespace-nowrap",
									children: bj(h.at)
								})
							},
							{
								key: "c",
								label: "能力",
								render: (h) => labelOf(h.subject)
							},
							{
								key: "m",
								label: "变化",
								render: (h) => /* @__PURE__ */ jsxs("span", {
									className: "font-mono text-[12px]",
									children: [
										h.before?.model ?? "—",
										" → ",
										h.after?.model ?? "—"
									]
								})
							},
							{
								key: "r",
								label: "原因",
								render: (h) => /* @__PURE__ */ jsx("span", {
									className: "text-ink-3",
									children: h.reason
								})
							},
							{
								key: "a",
								label: "操作人",
								render: (h) => h.actor
							}
						]
					}) : /* @__PURE__ */ jsx(Empty, { children: "还没有在后台切换过模型" })
				}), /* @__PURE__ */ jsx(Card, {
					title: "同批样本对比（SelectBench）",
					right: /* @__PURE__ */ jsx(Link, {
						to: "/admin/selectbench",
						className: "text-accent",
						children: "全部运行"
					}),
					pad: false,
					children: m.benches.length ? /* @__PURE__ */ jsx(DataTable, {
						dense: true,
						rows: m.benches,
						rowKey: (b) => b.id,
						columns: [
							{
								key: "l",
								label: "运行",
								render: (b) => /* @__PURE__ */ jsx(Link, {
									to: `/admin/selectbench/${b.id}`,
									className: "text-ink hover:text-accent",
									children: b.label
								})
							},
							{
								key: "m",
								label: "模型",
								render: (b) => /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[11.5px] text-ink-3",
									children: b.models.join("、")
								})
							},
							{
								key: "n",
								label: "样本",
								align: "right",
								render: (b) => num(b.sample_size)
							},
							{
								key: "at",
								label: "时间",
								render: (b) => /* @__PURE__ */ jsx("span", {
									className: "num whitespace-nowrap",
									children: bj(b.created_at)
								})
							}
						]
					}) : /* @__PURE__ */ jsx(Empty, { children: "还没有导入对比运行" })
				})]
			}),
			/* @__PURE__ */ jsx(ReasonDialog, {
				open: !!target,
				title: `切换模型：${target?.label ?? ""}`,
				description: "只影响之后的新任务。选“恢复默认”会回到环境变量或代码默认。",
				confirmLabel: "切换",
				busy: pending === "switch",
				onClose: () => setTarget(null),
				onSubmit: async (reason) => await run("POST", `/api/admin/models/${target.key}`, {
					model: choice === "__default" ? null : choice,
					reason
				}, {
					label: "switch",
					success: "已切换，下一次调用生效"
				}) !== null,
				children: /* @__PURE__ */ jsx(Field, {
					label: "模型",
					children: /* @__PURE__ */ jsxs(Select, {
						value: choice,
						onChange: (e) => setChoice(e.target.value),
						children: [m.choices.filter((x) => x.vision === !!target?.vision).map((x) => /* @__PURE__ */ jsxs("option", {
							value: x.key,
							children: [
								x.key,
								"（",
								x.service,
								"）"
							]
						}, x.key)), /* @__PURE__ */ jsxs("option", {
							value: "__default",
							children: [
								"恢复默认（",
								target?.env,
								" 或 ",
								target?.defaultModel,
								"）"
							]
						})]
					})
				})
			})
		]
	});
});
//#endregion
//#region app/routes/admin/selectbench.tsx
var selectbench_exports = /* @__PURE__ */ __exportAll({
	default: () => selectbench_default,
	loader: () => loader$3,
	meta: () => meta$3
});
async function loader$3({ request }) {
	return adminGet(request, "/api/admin/selectbench");
}
var meta$3 = () => [{ title: `SelectBench · ${SITE.name} 后台` }];
var selectbench_default = UNSAFE_withComponentProps(function SelectBench({ loaderData }) {
	const { run, pending } = useAdminAction();
	const file = useRef(null);
	return /* @__PURE__ */ jsx(AdminPage, {
		title: "SelectBench",
		subtitle: "精选判断的模型对比：同一批人工金标样本，逐条比较各模型的入选决定。运行由 scripts/eval-selection.ts 产生并自动导入；也可以上传报告文件。",
		actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("input", {
			ref: file,
			type: "file",
			accept: "application/json",
			className: "hidden",
			onChange: async (e) => {
				const f = e.target.files?.[0];
				e.target.value = "";
				if (!f) return;
				try {
					const report = JSON.parse(await f.text());
					await run("POST", "/api/admin/selectbench/import", {
						label: f.name.replace(/\.json$/, ""),
						report
					}, {
						label: "import",
						success: "已导入"
					});
				} catch {
					toast("文件不是合法的报告 JSON", "error");
				}
			}
		}), /* @__PURE__ */ jsx(Button, {
			busy: pending === "import",
			onClick: () => file.current?.click(),
			children: "导入报告"
		})] }),
		children: loaderData.runs.length ? /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: loaderData.runs.map((r) => {
				const best = [...r.models].sort((a, b) => (r.summary[b]?.f1 ?? 0) - (r.summary[a]?.f1 ?? 0))[0];
				return /* @__PURE__ */ jsxs(Card, {
					title: /* @__PURE__ */ jsx(Link, {
						to: `/admin/selectbench/${r.id}`,
						className: "hover:text-accent",
						children: r.label
					}),
					right: /* @__PURE__ */ jsxs("span", { children: [
						bj(r.created_at, true),
						" · ",
						r.split ?? "—",
						" · ",
						num(r.sample_size),
						" 条 · ",
						r.prompt_version ?? "提示版本未记录"
					] }),
					pad: false,
					children: [/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[720px] text-[13px]",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", {
								className: "border-b border-line text-left text-[12px] text-ink-3",
								children: [
									"模型",
									"准确率",
									"精确率",
									"召回率",
									"F1",
									"入选比例",
									"金标入选",
									"失败",
									"平均耗时",
									"输入/输出 tokens"
								].map((h) => /* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-medium",
									children: h
								}, h))
							}) }), /* @__PURE__ */ jsx("tbody", { children: r.models.map((m) => {
								const s = r.summary[m] ?? {};
								return /* @__PURE__ */ jsxs("tr", {
									className: "border-b border-line/70 last:border-0",
									children: [
										/* @__PURE__ */ jsxs("td", {
											className: "px-3 py-2 font-medium text-ink",
											children: [
												m,
												" ",
												m === best && r.models.length > 1 && /* @__PURE__ */ jsx(Badge, {
													tone: "accent",
													children: "F1 最高"
												})
											]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: pct(s.accuracy)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: pct(s.precision)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: pct(s.recall)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2 font-semibold text-ink",
											children: pct(s.f1)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: pct(s.selectedRate)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: pct(s.goldSelectRate)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: s.errors ? /* @__PURE__ */ jsx("span", {
												className: "text-hot",
												children: s.errors
											}) : 0
										}),
										/* @__PURE__ */ jsx("td", {
											className: "num px-3 py-2",
											children: s.avgLatencyMs ? `${(s.avgLatencyMs / 1e3).toFixed(1)}s` : "—"
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "num px-3 py-2 text-ink-3",
											children: [
												num(s.tokensIn),
												" / ",
												num(s.tokensOut)
											]
										})
									]
								}, m);
							}) })]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-t border-line px-4 py-2 text-[12.5px] text-ink-3",
						children: [/* @__PURE__ */ jsx("span", { children: r.cases ? `${num(r.cases)} 条逐条结果` : "只有汇总（旧格式报告）" }), r.cases > 0 && /* @__PURE__ */ jsx(Link, {
							className: "text-accent",
							to: `/admin/selectbench/${r.id}`,
							children: "逐条浏览"
						})]
					})]
				}, r.id);
			})
		}) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Empty, { children: "还没有对比运行。运行 scripts/eval-selection.ts 后会自动出现在这里。" }) })
	});
});
//#endregion
//#region app/routes/admin/selectbench-run.tsx
var selectbench_run_exports = /* @__PURE__ */ __exportAll({
	default: () => selectbench_run_default,
	loader: () => loader$2,
	meta: () => meta$2
});
async function loader$2({ request, params }) {
	return adminGet(request, `/api/admin/selectbench/${encodeURIComponent(params.runId)}${new URL(request.url).search}`);
}
var meta$2 = ({ loaderData }) => [{ title: `${loaderData?.run.label ?? "SelectBench"} · ${SITE.name} 后台` }];
var GOLD = {
	select: ["应入选", "accent"],
	reject: ["不选", "muted"],
	either: ["两可", "info"]
};
function verdict(d, gold) {
	if (!d) return /* @__PURE__ */ jsx("span", {
		className: "text-ink-4",
		children: "—"
	});
	if (d.decision === null) return /* @__PURE__ */ jsx(Badge, {
		tone: "bad",
		title: d.error ?? void 0,
		children: "失败"
	});
	const right = gold === "either" || d.decision === gold;
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ jsx(Badge, {
			tone: right ? d.decision === "select" ? "ok" : "muted" : "bad",
			children: d.decision === "select" ? "入选" : "不选"
		}), /* @__PURE__ */ jsx("span", {
			className: "num text-[12px] text-ink-3",
			children: d.score ?? "—"
		})]
	});
}
var selectbench_run_default = UNSAFE_withComponentProps(function SelectBenchRun({ loaderData: d }) {
	const [sp] = useSearchParams();
	const navigate = useNavigate();
	const [open, setOpen] = useState(null);
	const model = sp.get("model") ?? d.run.models[0];
	const set = (k, v) => {
		const next = new URLSearchParams(sp);
		if (v) next.set(k, v);
		else next.delete(k);
		navigate(`?${next}`, { preventScrollReset: true });
	};
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: d.run.label,
		subtitle: /* @__PURE__ */ jsxs(Fragment, { children: [
			bj(d.run.created_at, true),
			" · ",
			d.run.split ?? "—",
			" · ",
			num(d.run.sample_size),
			" 条 · 提示 ",
			d.run.prompt_version ?? "未记录",
			" · ",
			/* @__PURE__ */ jsx(Link, {
				className: "text-accent",
				to: "/admin/selectbench",
				children: "全部运行"
			})
		] }),
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: d.run.models.map((m) => {
					const s = d.run.summary[m] ?? {};
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => set("model", m),
						className: `rounded-panel p-4 text-left ring-1 transition-colors ${m === model ? "bg-accent-softer ring-accent/40" : "bg-surface ring-line hover:bg-bg-sunk/60"}`,
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-[13.5px] font-semibold text-ink",
								children: m
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "num mt-1.5 text-[22px] font-semibold tracking-tight text-ink",
								children: ["F1 ", pct(s.f1)]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "num mt-0.5 text-[12px] text-ink-3",
								children: [
									"准确 ",
									pct(s.accuracy),
									" · 精确 ",
									pct(s.precision),
									" · 召回 ",
									pct(s.recall)
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "num mt-0.5 text-[12px] text-ink-4",
								children: [
									"误选 ",
									s.fp ?? "—",
									" · 漏选 ",
									s.fn ?? "—",
									" · 失败 ",
									s.errors ?? 0
								]
							})
						]
					}, m);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(FilterChips, {
						param: "outcome",
						options: [
							{
								value: "",
								label: "全部"
							},
							{
								value: "fp",
								label: "误选"
							},
							{
								value: "fn",
								label: "漏选"
							},
							{
								value: "tp",
								label: "选对"
							},
							{
								value: "tn",
								label: "正确不选"
							},
							{
								value: "either",
								label: "两可"
							},
							{
								value: "error",
								label: "失败"
							}
						]
					}),
					/* @__PURE__ */ jsxs(Select, {
						className: "!w-auto",
						"aria-label": "样本分层",
						value: sp.get("stratum") ?? "",
						onChange: (e) => set("stratum", e.target.value || null),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "全部分层"
						}), d.strata.map((s) => /* @__PURE__ */ jsxs("option", {
							value: s.stratum ?? "",
							children: [
								s.stratum ?? "未分层",
								"（",
								s.n,
								"）"
							]
						}, s.stratum ?? "none"))]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "inline-flex items-center gap-2 text-[13px] text-ink-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							className: "size-4 accent-[var(--accent)]",
							checked: sp.get("disagree") === "1",
							onChange: (e) => set("disagree", e.target.checked ? "1" : null)
						}), "只看模型之间有分歧的"]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-[12.5px] text-ink-4",
						children: [
							d.rows.length === 400 ? "仅显示前 400 条" : `${d.rows.length} 条`,
							" · 筛选按 ",
							model
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				pad: false,
				children: d.rows.length ? /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[760px] text-[13px]",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-line text-left text-[12px] text-ink-3",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-medium",
									children: "样本"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-medium",
									children: "金标"
								}),
								d.run.models.map((m) => /* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-medium",
									children: m
								}, m))
							]
						}) }), /* @__PURE__ */ jsx("tbody", { children: d.rows.map((r) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("tr", {
							className: "cursor-pointer border-b border-line/70 hover:bg-bg-sunk/50",
							onClick: () => setOpen(open === r.case_id ? null : r.case_id),
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "max-w-[420px] px-3 py-2.5",
									children: [/* @__PURE__ */ jsx("div", {
										className: "line-clamp-2 text-ink",
										children: r.title
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-0.5 text-[11.5px] text-ink-4",
										children: [
											r.stratum ?? "—",
											" · ",
											r.case_id
										]
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ jsx(Badge, {
										tone: GOLD[r.gold]?.[1] ?? "muted",
										children: GOLD[r.gold]?.[0] ?? r.gold
									})
								}),
								d.run.models.map((m) => /* @__PURE__ */ jsx("td", {
									className: "px-3 py-2.5",
									children: verdict(r.by_model[m], r.gold)
								}, m))
							]
						}), open === r.case_id && /* @__PURE__ */ jsx("tr", {
							className: "border-b border-line/70 bg-bg-sunk/40",
							children: /* @__PURE__ */ jsx("td", {
								colSpan: 2 + d.run.models.length,
								className: "px-3 py-3",
								children: /* @__PURE__ */ jsx("div", {
									className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
									children: d.run.models.map((m) => {
										const x = r.by_model[m];
										return /* @__PURE__ */ jsxs("div", {
											className: "rounded-control bg-surface p-3 ring-1 ring-line",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "mb-1 flex items-center justify-between text-[12px] text-ink-3",
													children: [/* @__PURE__ */ jsx("span", {
														className: "font-medium text-ink-2",
														children: m
													}), x?.category && /* @__PURE__ */ jsx("span", { children: CATEGORY_LABELS[x.category] ?? x.category })]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "text-[12.5px] leading-relaxed text-ink-2",
													children: x?.error ?? x?.reason ?? "（没有理由）"
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-1 text-[11.5px] text-ink-4",
													children: [
														"相关性 ",
														x?.relevance ?? "—",
														x?.receiptId ? ` · 回执 #${x.receiptId}` : ""
													]
												})
											]
										}, m);
									})
								})
							})
						})] }, r.case_id)) })]
					})
				}) : /* @__PURE__ */ jsx(Empty, { children: "没有符合条件的样本" })
			})
		]
	});
});
//#endregion
//#region app/routes/admin/settings.tsx
var settings_exports = /* @__PURE__ */ __exportAll({
	default: () => settings_default,
	loader: () => loader$1,
	meta: () => meta$1
});
async function loader$1({ request }) {
	return adminGet(request, "/api/admin/settings");
}
var meta$1 = () => [{ title: `设置 · ${SITE.name} 后台` }];
function QrSlot({ slot, label, src }) {
	const { run, pending } = useAdminAction();
	const input = useRef(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-4",
		children: [/* @__PURE__ */ jsx("img", {
			src,
			alt: label,
			className: "size-28 rounded-card bg-white object-contain p-1.5 ring-1 ring-line"
		}), /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-[14px] font-medium text-ink",
				children: label
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-0.5 break-all font-mono text-[11.5px] text-ink-4",
				children: src
			}),
			/* @__PURE__ */ jsx("input", {
				ref: input,
				type: "file",
				accept: "image/png,image/jpeg,image/webp",
				className: "hidden",
				onChange: async (e) => {
					const file = e.target.files?.[0];
					e.target.value = "";
					if (!file) return;
					if (file.size > 2097152) return toast("图片最大 2MB", "error");
					const image = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(String(reader.result));
						reader.onerror = reject;
						reader.readAsDataURL(file);
					});
					await run("POST", "/api/admin/settings/contact-qr", {
						slot,
						image
					}, {
						label: `qr-${slot}`,
						success: `${label}已更换，关于页 5 分钟内更新`
					});
				}
			}),
			/* @__PURE__ */ jsx(Button, {
				className: "mt-2",
				size: "sm",
				busy: pending === `qr-${slot}`,
				onClick: () => input.current?.click(),
				children: "更换图片"
			})
		] })]
	});
}
function BudgetRow({ b }) {
	const { run, pending } = useAdminAction();
	const [v, setV] = useState({
		perMinute: b.per_minute,
		perHour: b.per_hour,
		perDay: b.per_day
	});
	const [open, setOpen] = useState(false);
	const changed = v.perMinute !== b.per_minute || v.perHour !== b.per_hour || v.perDay !== b.per_day;
	return /* @__PURE__ */ jsxs("tr", {
		className: "border-b border-line/70 last:border-0",
		children: [
			/* @__PURE__ */ jsx("td", {
				className: "px-3 py-2 font-mono text-[12.5px]",
				children: b.service
			}),
			[
				"perMinute",
				"perHour",
				"perDay"
			].map((k) => /* @__PURE__ */ jsx("td", {
				className: "px-3 py-2",
				children: /* @__PURE__ */ jsx(Input, {
					type: "number",
					min: 0,
					className: "!w-24 !py-1 text-right",
					value: v[k],
					onChange: (e) => setV({
						...v,
						[k]: Number(e.target.value)
					})
				})
			}, k)),
			/* @__PURE__ */ jsxs("td", {
				className: "num px-3 py-2 text-right text-ink-3",
				children: [
					num(b.used_hour),
					" / ",
					num(b.used_day)
				]
			}),
			/* @__PURE__ */ jsxs("td", {
				className: "px-3 py-2 text-right",
				children: [/* @__PURE__ */ jsx(Button, {
					size: "sm",
					tone: "primary",
					disabled: !changed,
					onClick: () => setOpen(true),
					children: "保存"
				}), /* @__PURE__ */ jsx(ReasonDialog, {
					open,
					title: `调整 ${b.service} 的请求上限`,
					description: "上限是付费请求的熔断：超过后请求暂停并按窗口重试。填 0 表示立即停用这个服务。",
					confirmLabel: "保存",
					busy: pending === "budget",
					onClose: () => setOpen(false),
					onSubmit: async (reason) => await run("PUT", `/api/admin/budgets/${encodeURIComponent(b.service)}`, {
						...v,
						reason
					}, {
						label: "budget",
						success: "上限已更新"
					}) !== null
				})]
			})
		]
	});
}
function TargetToggle({ t }) {
	const { run, pending } = useAdminAction();
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
		size: "sm",
		tone: t.enabled ? "danger" : "primary",
		onClick: () => setOpen(true),
		children: t.enabled ? "停用" : "启用"
	}), /* @__PURE__ */ jsx(ReasonDialog, {
		open,
		title: `${t.enabled ? "停用" : "启用"}：${t.note ?? t.key}`,
		description: t.enabled ? "停用后新的推送不再发往这个群。" : "启用时间会被记录：启用之前的内容不会补推。开发与彩排环境即使启用也不会真的发出。",
		danger: t.enabled,
		confirmLabel: t.enabled ? "停用" : "启用",
		busy: pending === "target",
		onClose: () => setOpen(false),
		onSubmit: async (reason) => await run("POST", `/api/admin/notify-targets/${encodeURIComponent(t.key)}`, {
			enabled: !t.enabled,
			reason
		}, {
			label: "target",
			success: "已更新"
		}) !== null
	})] });
}
var settings_default = UNSAFE_withComponentProps(function SettingsAdmin({ loaderData: s }) {
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "设置",
		subtitle: "不改代码即可替换的运营设置。每次修改都写入审计记录。",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-5 xl:grid-cols-2",
			children: [/* @__PURE__ */ jsx(Card, {
				title: "关于页二维码",
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ jsx(QrSlot, {
						slot: "wechatQr",
						label: "微信公众号二维码",
						src: s.contact.wechatQr
					}), /* @__PURE__ */ jsx(QrSlot, {
						slot: "feishuQr",
						label: "飞书群二维码",
						src: s.contact.feishuQr
					})]
				})
			}), /* @__PURE__ */ jsx(Card, {
				title: "通知目的地",
				pad: false,
				children: /* @__PURE__ */ jsx(DataTable, {
					rows: s.targets,
					rowKey: (t) => t.key,
					columns: [
						{
							key: "k",
							label: "目的地",
							render: (t) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-medium text-ink",
								children: t.note ?? t.key
							}), /* @__PURE__ */ jsxs("div", {
								className: "font-mono text-[11.5px] text-ink-4",
								children: [
									t.key,
									" · ",
									t.config_ref
								]
							})] })
						},
						{
							key: "e",
							label: "状态",
							render: (t) => t.enabled ? /* @__PURE__ */ jsxs(Badge, {
								tone: "ok",
								children: ["启用于 ", bj(t.enabled_at)]
							}) : /* @__PURE__ */ jsx(Badge, { children: "停用" })
						},
						{
							key: "d",
							label: "7 天投递",
							align: "right",
							render: (t) => num(t.deliveries_7d)
						},
						{
							key: "a",
							label: "",
							align: "right",
							render: (t) => /* @__PURE__ */ jsx(TargetToggle, { t })
						}
					]
				})
			})]
		}), /* @__PURE__ */ jsx(Card, {
			className: "mt-5",
			title: "付费请求上限",
			right: /* @__PURE__ */ jsx("span", { children: "已用：近 1 小时 / 近 24 小时" }),
			pad: false,
			children: /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[640px] text-[13px]",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b border-line text-left text-[12px] text-ink-3",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-medium",
								children: "服务"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-medium",
								children: "每分钟"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-medium",
								children: "每小时"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-medium",
								children: "每天"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "已用"
							}),
							/* @__PURE__ */ jsx("th", {})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: s.budgets.map((b) => /* @__PURE__ */ jsx(BudgetRow, { b }, `${b.service}-${b.updated_at}`)) })]
				})
			})
		})]
	});
});
//#endregion
//#region app/routes/admin/audit.tsx
var audit_exports = /* @__PURE__ */ __exportAll({
	default: () => audit_default,
	loader: () => loader,
	meta: () => meta
});
async function loader({ request }) {
	return adminGet(request, `/api/admin/audit${new URL(request.url).search}`);
}
var meta = () => [{ title: `审计记录 · ${SITE.name} 后台` }];
function subjectLink(subject) {
	if (!subject) return null;
	const [kind, id] = [subject.slice(0, subject.indexOf(":")), subject.slice(subject.indexOf(":") + 1)];
	if (kind === "content") return /* @__PURE__ */ jsx(Link, {
		className: "text-accent",
		to: `/admin/content/${id}`,
		children: subject
	});
	if (kind === "source") return /* @__PURE__ */ jsx(Link, {
		className: "text-accent",
		to: `/admin/sources/${encodeURIComponent(id)}`,
		children: subject
	});
	return /* @__PURE__ */ jsx("span", {
		className: "font-mono text-[12px]",
		children: subject
	});
}
var audit_default = UNSAFE_withComponentProps(function Audit({ loaderData }) {
	const [sp] = useSearchParams();
	return /* @__PURE__ */ jsxs(AdminPage, {
		title: "审计记录",
		subtitle: "所有人工操作：谁、何时、改了什么、为什么。",
		children: [
			/* @__PURE__ */ jsxs(Form, {
				method: "get",
				className: "mb-4 flex max-w-xl gap-2",
				children: [/* @__PURE__ */ jsx(Input, {
					name: "action",
					defaultValue: sp.get("action") ?? "",
					placeholder: "操作前缀，例如 content. 或 source.",
					"aria-label": "按操作筛选"
				}), /* @__PURE__ */ jsx(Input, {
					name: "subject",
					defaultValue: sp.get("subject") ?? "",
					placeholder: "对象，例如 source:openai-blog",
					"aria-label": "按对象筛选"
				})]
			}),
			/* @__PURE__ */ jsx(Card, {
				pad: false,
				children: /* @__PURE__ */ jsx(DataTable, {
					rows: loaderData.rows,
					rowKey: (r) => r.id,
					empty: "没有记录",
					columns: [
						{
							key: "t",
							label: "时间",
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "num whitespace-nowrap",
								children: bj(r.created_at, true)
							})
						},
						{
							key: "a",
							label: "操作",
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[12.5px] text-ink",
								children: r.action
							})
						},
						{
							key: "s",
							label: "对象",
							render: (r) => subjectLink(r.subject)
						},
						{
							key: "who",
							label: "操作人",
							render: (r) => r.actor
						},
						{
							key: "r",
							label: "原因",
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "text-ink-2",
								children: r.reason
							})
						},
						{
							key: "d",
							label: "变化",
							render: (r) => r.before || r.after ? /* @__PURE__ */ jsx(Json, {
								value: {
									before: r.before,
									after: r.after
								},
								label: "前后"
							}) : null
						}
					]
				})
			}),
			/* @__PURE__ */ jsx(Pager, {
				page: loaderData.page,
				hasMore: loaderData.rows.length === 100
			})
		]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-6tyZgf_X.js",
		"imports": [],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-Oy26BO7-.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/Sidebar-BKZ8liQm.js",
				"/assets/Chrome-DuG_H9cO.js",
				"/assets/features-DbRQZ5Mo.js"
			],
			"css": ["/assets/root-DyaZXV_Y.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-Be1aHk1h.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/all": {
			"id": "routes/all",
			"parentId": "root",
			"path": "all",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/all-BqJcSgfQ.js",
			"imports": [
				"/assets/all-BLztA3IT.js",
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/taxonomy-CrAe8mz1.js",
				"/assets/DayList-CxjsETCf.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/schedule": {
			"id": "routes/schedule",
			"parentId": "root",
			"path": "schedule",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/schedule-C6S5rx9I.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"all-search-busy": {
			"id": "all-search-busy",
			"parentId": "root",
			"path": "all/search-busy",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/search-busy-CNndF4-n.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/all-BLztA3IT.js",
				"/assets/taxonomy-CrAe8mz1.js",
				"/assets/DayList-CxjsETCf.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"search-busy": {
			"id": "search-busy",
			"parentId": "root",
			"path": "search-busy",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/search-busy-CNndF4-n.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/all-BLztA3IT.js",
				"/assets/taxonomy-CrAe8mz1.js",
				"/assets/DayList-CxjsETCf.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/item": {
			"id": "routes/item",
			"parentId": "root",
			"path": "items/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/item-TE0kjQMd.js",
			"imports": [
				"/assets/item-BmZbLVII.js",
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"item-original": {
			"id": "item-original",
			"parentId": "root",
			"path": "items/:id/original",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/item-original-TE0kjQMd.js",
			"imports": [
				"/assets/item-BmZbLVII.js",
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/hot": {
			"id": "routes/hot",
			"parentId": "root",
			"path": "hot",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/hot-BC_MuzPs.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/story": {
			"id": "routes/story",
			"parentId": "root",
			"path": "story/:publicId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/story-BTBKxea8.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"daily-latest": {
			"id": "daily-latest",
			"parentId": "root",
			"path": "daily",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/report-latest-CvL49C3K.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/daily-archive": {
			"id": "routes/daily-archive",
			"parentId": "root",
			"path": "daily/archive",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/daily-archive-BQm_4qF7.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"daily-detail": {
			"id": "daily-detail",
			"parentId": "root",
			"path": "daily/:key",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/report-detail-CKNAFybB.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"weekly-latest": {
			"id": "weekly-latest",
			"parentId": "root",
			"path": "weekly",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/report-latest-CvL49C3K.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"weekly-detail": {
			"id": "weekly-detail",
			"parentId": "root",
			"path": "weekly/:key",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/report-detail-CKNAFybB.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"monthly-latest": {
			"id": "monthly-latest",
			"parentId": "root",
			"path": "monthly",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/report-latest-CvL49C3K.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"monthly-detail": {
			"id": "monthly-detail",
			"parentId": "root",
			"path": "monthly/:key",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/report-detail-CKNAFybB.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ReportPaper-CHHQ0J5_.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/topics": {
			"id": "routes/topics",
			"parentId": "root",
			"path": "topics",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/topics-DthfpW_M.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"topic": {
			"id": "topic",
			"parentId": "root",
			"path": "topics/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/topic-Bk9dKXic.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/DayList-CxjsETCf.js",
				"/assets/taxonomy-CrAe8mz1.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"topic-page": {
			"id": "topic-page",
			"parentId": "root",
			"path": "topics/:slug/page/:page",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/topic-Bk9dKXic.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/DayList-CxjsETCf.js",
				"/assets/taxonomy-CrAe8mz1.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-DIlaToBj.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/terms": {
			"id": "routes/terms",
			"parentId": "root",
			"path": "terms",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/terms-xurzJX5r.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/CopyPage-KrbDtq1b.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/privacy": {
			"id": "routes/privacy",
			"parentId": "root",
			"path": "privacy",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/privacy-D-K4-lAc.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/CopyPage-KrbDtq1b.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/changelog": {
			"id": "routes/changelog",
			"parentId": "root",
			"path": "changelog",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/changelog-DIvfauc3.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/feedback": {
			"id": "routes/feedback",
			"parentId": "root",
			"path": "feedback",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/feedback-TpkSc1-l.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/more": {
			"id": "routes/more",
			"parentId": "root",
			"path": "more",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/more-DMCy4a7s.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/Sidebar-BKZ8liQm.js",
				"/assets/features-DbRQZ5Mo.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/starred": {
			"id": "routes/starred",
			"parentId": "root",
			"path": "starred",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/starred-DOwAPGCX.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/agent": {
			"id": "routes/agent",
			"parentId": "root",
			"path": "agent",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/agent-ByzfL8dB.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/features-DbRQZ5Mo.js",
				"/assets/taxonomy-CrAe8mz1.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/codex-reset": {
			"id": "routes/codex-reset",
			"parentId": "root",
			"path": "codex-reset",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/codex-reset-DDpNI6JF.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"codex-reset-day": {
			"id": "codex-reset-day",
			"parentId": "root",
			"path": "codex-reset/history/:date",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/codex-reset-DDpNI6JF.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/leaderboard-boards": {
			"id": "routes/leaderboard-boards",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-boards-AXohjFRL.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/taxonomy-CrAe8mz1.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"leaderboard": {
			"id": "leaderboard",
			"parentId": "routes/leaderboard-boards",
			"path": "leaderboard",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-gndouqVi.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/leaderboard-B_82JODD.js",
				"/assets/Evidence-D5oM9MGM.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"leaderboard-category": {
			"id": "leaderboard-category",
			"parentId": "routes/leaderboard-boards",
			"path": "leaderboard/category/:key",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-gndouqVi.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/leaderboard-B_82JODD.js",
				"/assets/Evidence-D5oM9MGM.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/leaderboard-sources": {
			"id": "routes/leaderboard-sources",
			"parentId": "root",
			"path": "leaderboard/sources",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-sources-VPT0nTv_.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/StatusChip-BZDSWyyQ.js",
				"/assets/leaderboard-B_82JODD.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/leaderboard-source": {
			"id": "routes/leaderboard-source",
			"parentId": "root",
			"path": "leaderboard/sources/:key",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-source-DK3YxheX.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/StatusChip-BZDSWyyQ.js",
				"/assets/leaderboard-B_82JODD.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/leaderboard-rules": {
			"id": "routes/leaderboard-rules",
			"parentId": "root",
			"path": "leaderboard/rules",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-rules-BLKnbhBw.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/leaderboard-model": {
			"id": "routes/leaderboard-model",
			"parentId": "root",
			"path": "leaderboard/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/leaderboard-model-BZGF1Dru.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/taxonomy-CrAe8mz1.js",
				"/assets/Evidence-D5oM9MGM.js",
				"/assets/leaderboard-B_82JODD.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin-login": {
			"id": "routes/admin-login",
			"parentId": "root",
			"path": "admin/login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/admin-login-edpdASMq.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js", "/assets/shared-ClZ2uK0H.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"admin-layout": {
			"id": "admin-layout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/layout-CDZRNyI-.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/features-DbRQZ5Mo.js",
				"/assets/Chrome-DuG_H9cO.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/index": {
			"id": "routes/admin/index",
			"parentId": "admin-layout",
			"path": "admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/index-CbkCNoUZ.js",
			"imports": ["/assets/entry.client-6tyZgf_X.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/content": {
			"id": "routes/admin/content",
			"parentId": "admin-layout",
			"path": "admin/content",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/content-g_CVDKZV.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/labels-vA-4i93T.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/motion-CuSVH8Op.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/content-item": {
			"id": "routes/admin/content-item",
			"parentId": "admin-layout",
			"path": "admin/content/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/content-item-BXynrNY0.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/taxonomy-CrAe8mz1.js",
				"/assets/labels-vA-4i93T.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/sources": {
			"id": "routes/admin/sources",
			"parentId": "admin-layout",
			"path": "admin/sources",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/sources-Ca8ZrEAQ.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/labels-vA-4i93T.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/motion-CuSVH8Op.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/source-new": {
			"id": "routes/admin/source-new",
			"parentId": "admin-layout",
			"path": "admin/sources/new",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/source-new-Bk5HgHnr.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/labels-vA-4i93T.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/source": {
			"id": "routes/admin/source",
			"parentId": "admin-layout",
			"path": "admin/sources/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/source-B3ppjr1u.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/labels-vA-4i93T.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/monitor": {
			"id": "routes/admin/monitor",
			"parentId": "admin-layout",
			"path": "admin/monitor",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/monitor-BWnrwTKw.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/feedback": {
			"id": "routes/admin/feedback",
			"parentId": "admin-layout",
			"path": "admin/feedback",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/feedback-Crg9vwbB.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/labels-vA-4i93T.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/runs": {
			"id": "routes/admin/runs",
			"parentId": "admin-layout",
			"path": "admin/runs",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/runs-CO1o2t-o.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/models": {
			"id": "routes/admin/models",
			"parentId": "admin-layout",
			"path": "admin/models",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/models-BgYGeke9.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js",
				"/assets/toast-BQPDoh_d.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/selectbench": {
			"id": "routes/admin/selectbench",
			"parentId": "admin-layout",
			"path": "admin/selectbench",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/selectbench-BnbwiQ_F.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/toast-BQPDoh_d.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/selectbench-run": {
			"id": "routes/admin/selectbench-run",
			"parentId": "admin-layout",
			"path": "admin/selectbench/:runId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/selectbench-run-BopZHXKE.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/taxonomy-CrAe8mz1.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/motion-CuSVH8Op.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/settings": {
			"id": "routes/admin/settings",
			"parentId": "admin-layout",
			"path": "admin/settings",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/settings-CXI7WAYr.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/toast-BQPDoh_d.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/action-CRyC0vm2.js",
				"/assets/motion-CuSVH8Op.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/audit": {
			"id": "routes/admin/audit",
			"parentId": "admin-layout",
			"path": "admin/audit",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/audit-pIWVpd99.js",
			"imports": [
				"/assets/entry.client-6tyZgf_X.js",
				"/assets/shared-ClZ2uK0H.js",
				"/assets/ui-bcJdyzHy.js",
				"/assets/motion-CuSVH8Op.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-e3917be0.js",
	"version": "e3917be0",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = { "mode": "initial" };
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/all": {
		id: "routes/all",
		parentId: "root",
		path: "all",
		index: void 0,
		caseSensitive: void 0,
		module: all_exports
	},
	"routes/schedule": {
		id: "routes/schedule",
		parentId: "root",
		path: "schedule",
		index: void 0,
		caseSensitive: void 0,
		module: schedule_exports
	},
	"all-search-busy": {
		id: "all-search-busy",
		parentId: "root",
		path: "all/search-busy",
		index: void 0,
		caseSensitive: void 0,
		module: search_busy_exports
	},
	"search-busy": {
		id: "search-busy",
		parentId: "root",
		path: "search-busy",
		index: void 0,
		caseSensitive: void 0,
		module: search_busy_exports
	},
	"routes/item": {
		id: "routes/item",
		parentId: "root",
		path: "items/:id",
		index: void 0,
		caseSensitive: void 0,
		module: item_exports
	},
	"item-original": {
		id: "item-original",
		parentId: "root",
		path: "items/:id/original",
		index: void 0,
		caseSensitive: void 0,
		module: item_original_exports
	},
	"routes/hot": {
		id: "routes/hot",
		parentId: "root",
		path: "hot",
		index: void 0,
		caseSensitive: void 0,
		module: hot_exports
	},
	"routes/story": {
		id: "routes/story",
		parentId: "root",
		path: "story/:publicId",
		index: void 0,
		caseSensitive: void 0,
		module: story_exports
	},
	"daily-latest": {
		id: "daily-latest",
		parentId: "root",
		path: "daily",
		index: void 0,
		caseSensitive: void 0,
		module: report_latest_exports
	},
	"routes/daily-archive": {
		id: "routes/daily-archive",
		parentId: "root",
		path: "daily/archive",
		index: void 0,
		caseSensitive: void 0,
		module: daily_archive_exports
	},
	"daily-detail": {
		id: "daily-detail",
		parentId: "root",
		path: "daily/:key",
		index: void 0,
		caseSensitive: void 0,
		module: report_detail_exports
	},
	"weekly-latest": {
		id: "weekly-latest",
		parentId: "root",
		path: "weekly",
		index: void 0,
		caseSensitive: void 0,
		module: report_latest_exports
	},
	"weekly-detail": {
		id: "weekly-detail",
		parentId: "root",
		path: "weekly/:key",
		index: void 0,
		caseSensitive: void 0,
		module: report_detail_exports
	},
	"monthly-latest": {
		id: "monthly-latest",
		parentId: "root",
		path: "monthly",
		index: void 0,
		caseSensitive: void 0,
		module: report_latest_exports
	},
	"monthly-detail": {
		id: "monthly-detail",
		parentId: "root",
		path: "monthly/:key",
		index: void 0,
		caseSensitive: void 0,
		module: report_detail_exports
	},
	"routes/topics": {
		id: "routes/topics",
		parentId: "root",
		path: "topics",
		index: void 0,
		caseSensitive: void 0,
		module: topics_exports
	},
	"topic": {
		id: "topic",
		parentId: "root",
		path: "topics/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: topic_exports
	},
	"topic-page": {
		id: "topic-page",
		parentId: "root",
		path: "topics/:slug/page/:page",
		index: void 0,
		caseSensitive: void 0,
		module: topic_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/terms": {
		id: "routes/terms",
		parentId: "root",
		path: "terms",
		index: void 0,
		caseSensitive: void 0,
		module: terms_exports
	},
	"routes/privacy": {
		id: "routes/privacy",
		parentId: "root",
		path: "privacy",
		index: void 0,
		caseSensitive: void 0,
		module: privacy_exports
	},
	"routes/changelog": {
		id: "routes/changelog",
		parentId: "root",
		path: "changelog",
		index: void 0,
		caseSensitive: void 0,
		module: changelog_exports
	},
	"routes/feedback": {
		id: "routes/feedback",
		parentId: "root",
		path: "feedback",
		index: void 0,
		caseSensitive: void 0,
		module: feedback_exports$1
	},
	"routes/more": {
		id: "routes/more",
		parentId: "root",
		path: "more",
		index: void 0,
		caseSensitive: void 0,
		module: more_exports
	},
	"routes/starred": {
		id: "routes/starred",
		parentId: "root",
		path: "starred",
		index: void 0,
		caseSensitive: void 0,
		module: starred_exports
	},
	"routes/agent": {
		id: "routes/agent",
		parentId: "root",
		path: "agent",
		index: void 0,
		caseSensitive: void 0,
		module: agent_exports
	},
	"routes/codex-reset": {
		id: "routes/codex-reset",
		parentId: "root",
		path: "codex-reset",
		index: void 0,
		caseSensitive: void 0,
		module: codex_reset_exports
	},
	"codex-reset-day": {
		id: "codex-reset-day",
		parentId: "root",
		path: "codex-reset/history/:date",
		index: void 0,
		caseSensitive: void 0,
		module: codex_reset_exports
	},
	"routes/leaderboard-boards": {
		id: "routes/leaderboard-boards",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_boards_exports
	},
	"leaderboard": {
		id: "leaderboard",
		parentId: "routes/leaderboard-boards",
		path: "leaderboard",
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_exports
	},
	"leaderboard-category": {
		id: "leaderboard-category",
		parentId: "routes/leaderboard-boards",
		path: "leaderboard/category/:key",
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_exports
	},
	"routes/leaderboard-sources": {
		id: "routes/leaderboard-sources",
		parentId: "root",
		path: "leaderboard/sources",
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_sources_exports
	},
	"routes/leaderboard-source": {
		id: "routes/leaderboard-source",
		parentId: "root",
		path: "leaderboard/sources/:key",
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_source_exports
	},
	"routes/leaderboard-rules": {
		id: "routes/leaderboard-rules",
		parentId: "root",
		path: "leaderboard/rules",
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_rules_exports
	},
	"routes/leaderboard-model": {
		id: "routes/leaderboard-model",
		parentId: "root",
		path: "leaderboard/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: leaderboard_model_exports
	},
	"routes/admin-login": {
		id: "routes/admin-login",
		parentId: "root",
		path: "admin/login",
		index: void 0,
		caseSensitive: void 0,
		module: admin_login_exports
	},
	"admin-layout": {
		id: "admin-layout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: layout_exports
	},
	"routes/admin/index": {
		id: "routes/admin/index",
		parentId: "admin-layout",
		path: "admin",
		index: void 0,
		caseSensitive: void 0,
		module: admin_exports
	},
	"routes/admin/content": {
		id: "routes/admin/content",
		parentId: "admin-layout",
		path: "admin/content",
		index: void 0,
		caseSensitive: void 0,
		module: content_exports
	},
	"routes/admin/content-item": {
		id: "routes/admin/content-item",
		parentId: "admin-layout",
		path: "admin/content/:id",
		index: void 0,
		caseSensitive: void 0,
		module: content_item_exports
	},
	"routes/admin/sources": {
		id: "routes/admin/sources",
		parentId: "admin-layout",
		path: "admin/sources",
		index: void 0,
		caseSensitive: void 0,
		module: sources_exports
	},
	"routes/admin/source-new": {
		id: "routes/admin/source-new",
		parentId: "admin-layout",
		path: "admin/sources/new",
		index: void 0,
		caseSensitive: void 0,
		module: source_new_exports
	},
	"routes/admin/source": {
		id: "routes/admin/source",
		parentId: "admin-layout",
		path: "admin/sources/:id",
		index: void 0,
		caseSensitive: void 0,
		module: source_exports
	},
	"routes/admin/monitor": {
		id: "routes/admin/monitor",
		parentId: "admin-layout",
		path: "admin/monitor",
		index: void 0,
		caseSensitive: void 0,
		module: monitor_exports
	},
	"routes/admin/feedback": {
		id: "routes/admin/feedback",
		parentId: "admin-layout",
		path: "admin/feedback",
		index: void 0,
		caseSensitive: void 0,
		module: feedback_exports
	},
	"routes/admin/runs": {
		id: "routes/admin/runs",
		parentId: "admin-layout",
		path: "admin/runs",
		index: void 0,
		caseSensitive: void 0,
		module: runs_exports
	},
	"routes/admin/models": {
		id: "routes/admin/models",
		parentId: "admin-layout",
		path: "admin/models",
		index: void 0,
		caseSensitive: void 0,
		module: models_exports
	},
	"routes/admin/selectbench": {
		id: "routes/admin/selectbench",
		parentId: "admin-layout",
		path: "admin/selectbench",
		index: void 0,
		caseSensitive: void 0,
		module: selectbench_exports
	},
	"routes/admin/selectbench-run": {
		id: "routes/admin/selectbench-run",
		parentId: "admin-layout",
		path: "admin/selectbench/:runId",
		index: void 0,
		caseSensitive: void 0,
		module: selectbench_run_exports
	},
	"routes/admin/settings": {
		id: "routes/admin/settings",
		parentId: "admin-layout",
		path: "admin/settings",
		index: void 0,
		caseSensitive: void 0,
		module: settings_exports
	},
	"routes/admin/audit": {
		id: "routes/admin/audit",
		parentId: "admin-layout",
		path: "admin/audit",
		index: void 0,
		caseSensitive: void 0,
		module: audit_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
