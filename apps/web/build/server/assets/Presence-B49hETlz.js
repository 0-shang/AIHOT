import { jsx, jsxs } from "react/jsx-runtime";
import { cloneElement, useEffect, useRef, useState } from "react";
//#region ../../industry/site.ts
var SITE = {
	/** 站名：导航、页面标题、分享图、RSS、MCP、后台都用它。 */
	name: "ClutchWire",
	/**
	* 行业词：拼进默认说法里，比如“AI 日报”“AI 动态”。
	* 改成“法律”“HR”“黄金”之类，页面上就会变成“法律日报”“法律动态”。
	*/
	subject: "火箭队资讯",
	/** 首页的完整标题（浏览器标签、搜索结果）。 */
	homeTitle: "ClutchWire — 休斯敦火箭队一手前沿情报与权威专栏",
	/** 一句话介绍：搜索引擎、分享卡片、RSS、llms.txt 会用。 */
	description: "ClutchWire 专注休斯敦火箭队一手权威资讯：全天候追踪随队记者一手推文、深度战术分析、官方伤病与交易流言，赛程日历与全网热点即时汇总。",
	/** 首页左上角和侧边栏下面的一行小字。 */
	tagline: "休斯敦火箭前沿情报站",
	/** 界面语言（HTML lang、og:locale）。 */
	locale: "zh-CN",
	/** 默认域名，只在没设置 SITE_URL 时使用。 */
	defaultUrl: "http://localhost:3000",
	/**
	* MCP 工具名的前缀（小写字母、数字、下划线），工具会叫 myhot_get_latest、myhot_search……
	* 已经有人接入后就不要再改。
	*/
	mcpPrefix: "rocketshot",
	/** 对外联系邮箱（选填）：使用规则、llms.txt、响应头里会写。 */
	contactEmail: null,
	/** 页脚的一行小字（选填）。 */
	footerNote: "ClutchWire · 休斯敦火箭队前沿情报站",
	/** 中国大陆网站的 ICP 备案号（选填），填了就显示在页脚并链接到工信部备案系统。 */
	icp: null,
	/** 结构化数据里的网站运营者（搜索引擎用）。 */
	organization: {
		name: "ClutchWire",
		/** 创始人（选填）：{ name, url, description }。 */
		founder: null
	},
	/** 抓取信源时报上的名字（User-Agent 里用），不要冒用别的站。 */
	crawlerName: "ClutchWireBot"
};
/** 关于页的文案。数字（信源数、收录数、精选数、日报期数）来自站内实时统计，不用写在这里。 */
var ABOUT = {
	kicker: `关于 ${SITE.name}`,
	/** 大标题：第一行正常颜色，第二行强调色。 */
	headline: ["休斯敦火箭全网动态，", "真正值得看的，都在这里。"],
	/** 标题下面的一段话。{sources} 会换成实时的信源数。 */
	lead: `${SITE.name} 替你全天候盯着 {sources} 个休斯敦火箭队与 NBA 优质信源：实时聚合随队名记一手推文、战术深度专栏、官方伤病动态与赛程对决，重要情报即刻直达。`,
	/** 信源河动画下面的四个环节。 */
	steps: {
		collect: "覆盖休斯敦纪事报、The Athletic、ESPN、随队名记 X 推帖与官方原声；高频信源滚动监测。",
		store: "全天候秒级收录，自动结构化归类战报、战术剖析、名记流言与更衣室声音，去噪纯净呈现。",
		select: "多方信源交叉印证，智能提炼焦点事件与赛后关键复盘，结合讨论量实时计算全网热度指数。",
		publish: "无缝整合全赛季常规赛日程日历与主客战报，全维度追踪年轻核心成长与战绩走向。"
	},
	/**
	* 作者块（选填），null 就不显示。
	* avatarSourceId：一个 X 账号信源的 id，头像取它的（选填）。
	* 二维码在后台“设置”里上传，或者放进 industry/brand/contact/；没有二维码就不显示那张卡片。
	*/
	maker: null,
	/** 页面底部的版权与下架说明（结尾会接“反馈页”的链接）。 */
	copyright: `${SITE.name} 是聚合摘要和阅读索引，原文版权归各来源所有。如果你是来源方，希望更正、下架或调整展示方式，可以通过`
};
/** “AI 日报”这类说法：行业词和名词之间，英文词加空格，中文词不加。 */
function withSubject(noun) {
	return /[A-Za-z0-9]$/.test(SITE.subject) ? `${SITE.subject} ${noun}` : `${SITE.subject}${noun}`;
}
//#endregion
//#region app/components/icons.tsx
function Svg({ size = 18, children, ...rest }) {
	return /* @__PURE__ */ jsx("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.7,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		...rest,
		children
	});
}
var IconHeart = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" })
});
var IconApps = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [
		/* @__PURE__ */ jsx("rect", {
			x: "4",
			y: "4",
			width: "6.5",
			height: "6.5",
			rx: "1.2"
		}),
		/* @__PURE__ */ jsx("rect", {
			x: "13.5",
			y: "4",
			width: "6.5",
			height: "6.5",
			rx: "1.2"
		}),
		/* @__PURE__ */ jsx("rect", {
			x: "4",
			y: "13.5",
			width: "6.5",
			height: "6.5",
			rx: "1.2"
		}),
		/* @__PURE__ */ jsx("rect", {
			x: "13.5",
			y: "13.5",
			width: "6.5",
			height: "6.5",
			rx: "1.2"
		})
	]
});
var IconUsers = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M16 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 18.5V20" }),
		/* @__PURE__ */ jsx("circle", {
			cx: "10",
			cy: "8",
			r: "3.5"
		}),
		/* @__PURE__ */ jsx("path", { d: "M20 20v-1.5a3.5 3.5 0 00-2.5-3.35M15.5 4.65a3.5 3.5 0 010 6.7" })
	]
});
var IconDoc = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("rect", {
		x: "5",
		y: "3.5",
		width: "14",
		height: "17",
		rx: "2"
	}), /* @__PURE__ */ jsx("path", { d: "M8.5 8h7M8.5 12h7M8.5 16h4" })]
});
var IconCalendar = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("rect", {
		x: "3",
		y: "4",
		width: "18",
		height: "18",
		rx: "2"
	}), /* @__PURE__ */ jsx("path", { d: "M16 2v4M8 2v4M3 10h18" })]
});
var IconList = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M8 6h13M8 12h13M8 18h13" }),
		/* @__PURE__ */ jsx("circle", {
			cx: "3.5",
			cy: "6",
			r: "1"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "3.5",
			cy: "12",
			r: "1"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "3.5",
			cy: "18",
			r: "1"
		})
	]
});
var IconFlame = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M12 22c4 0 7-2.7 7-7 0-3.6-2.4-6.2-4-8-.5 2-1.6 3.4-3 4 .3-3-1-6-4-8 0 4-4 6.5-4 11 0 4.3 3 8 8 8z" })
});
var IconBookmark = (p) => {
	const { filled, ...rest } = p;
	return /* @__PURE__ */ jsx(Svg, {
		...rest,
		children: /* @__PURE__ */ jsx("path", {
			d: "M6 3.5h12v17l-6-4-6 4z",
			fill: filled ? "currentColor" : "none"
		})
	});
};
var IconChart = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M4 20V10M10 20V4M16 20v-7M22 20H2" })
});
var IconClock = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "12",
		r: "8.5"
	}), /* @__PURE__ */ jsx("path", { d: "M12 7.5V12l3 2" })]
});
var IconInfo = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "12",
		r: "8.5"
	}), /* @__PURE__ */ jsx("path", { d: "M12 11v5M12 8h.01" })]
});
var IconHistory = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M3.5 12a8.5 8.5 0 102.5-6" }),
		/* @__PURE__ */ jsx("path", { d: "M3.5 4v4h4" }),
		/* @__PURE__ */ jsx("path", { d: "M12 8v4l2.5 2" })
	]
});
var IconMessage = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M4 5h16v11H9l-5 4z" })
});
var IconSearch = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "11",
		cy: "11",
		r: "6.5"
	}), /* @__PURE__ */ jsx("path", { d: "M20 20l-4.2-4.2" })]
});
var IconSun = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}), /* @__PURE__ */ jsx("path", { d: "M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" })]
});
var IconMoon = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" })
});
var IconMonitor = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("rect", {
		x: "3",
		y: "4",
		width: "18",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ jsx("path", { d: "M8 20h8M12 16v4" })]
});
var IconArrowLeft = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M19 12H5M11 18l-6-6 6-6" })
});
var IconArrowRight = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M13 6l6 6-6 6" })
});
var IconArrowUpRight = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M7 17L17 7M8 7h9v9" })
});
var IconChevronDown = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" })
});
var IconChevronRight = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M9 6l6 6-6 6" })
});
var IconExternal = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("path", { d: "M14 4h6v6M20 4l-9 9" }), /* @__PURE__ */ jsx("path", { d: "M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" })]
});
var IconDownload = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M12 4v11M7 10l5 5 5-5M5 20h14" })
});
var IconImage = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [
		/* @__PURE__ */ jsx("rect", {
			x: "3.5",
			y: "3.5",
			width: "17",
			height: "17",
			rx: "2.5"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "9",
			r: "1.6"
		}),
		/* @__PURE__ */ jsx("path", { d: "M20.5 15.5l-4.5-4.5-9 9.5" })
	]
});
var IconShare = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [
		/* @__PURE__ */ jsx("circle", {
			cx: "18",
			cy: "5.5",
			r: "2.5"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "6",
			cy: "12",
			r: "2.5"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "18",
			cy: "18.5",
			r: "2.5"
		}),
		/* @__PURE__ */ jsx("path", { d: "M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1" })
	]
});
var IconMenu = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" })
});
var IconClose = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" })
});
var IconArrowUp = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M12 19V5M6 11l6-6 6 6" })
});
var IconCheck = (p) => /* @__PURE__ */ jsx(Svg, {
	...p,
	children: /* @__PURE__ */ jsx("path", { d: "M5 12.5l4.5 4.5L19 7.5" })
});
var IconCopy = (p) => /* @__PURE__ */ jsxs(Svg, {
	...p,
	children: [/* @__PURE__ */ jsx("rect", {
		x: "8",
		y: "8",
		width: "12",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ jsx("path", { d: "M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" })]
});
//#endregion
//#region app/components/ui/Presence.tsx
function Presence({ show, children, enter, exit, duration }) {
	const [phase, setPhase] = useState(show ? "still" : "gone");
	const last = useRef(children);
	if (show) last.current = children;
	const mounted = useRef(false);
	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}
		if (show) {
			setPhase("in");
			return;
		}
		setPhase((p) => p === "gone" ? p : "out");
		const timer = setTimeout(() => setPhase((p) => p === "out" ? "gone" : p), duration);
		return () => clearTimeout(timer);
	}, [show, duration]);
	if (!show && phase === "gone") return null;
	const child = show ? children : last.current;
	const cls = !show ? exit : phase === "in" ? enter : "";
	return cloneElement(child, { className: `${child.props.className ?? ""} ${cls}`.trim() });
}
/** A block that opens to its natural height and closes to nothing (grid rows 0fr ↔ 1fr). */
function Collapse({ open, children, duration = 240, className = "" }) {
	return /* @__PURE__ */ jsx(Presence, {
		show: open,
		enter: "anim-collapse-in",
		exit: "anim-collapse-out",
		duration,
		children: /* @__PURE__ */ jsx("div", {
			className: `grid ${className}`,
			style: { "--anim-ms": `${duration}ms` },
			children: /* @__PURE__ */ jsx("div", {
				className: "min-h-0 overflow-hidden",
				children
			})
		})
	});
}
//#endregion
export { IconSearch as A, IconImage as C, IconMessage as D, IconMenu as E, SITE as F, withSubject as I, IconSun as M, IconUsers as N, IconMonitor as O, ABOUT as P, IconHistory as S, IconList as T, IconDoc as _, IconArrowRight as a, IconFlame as b, IconBookmark as c, IconCheck as d, IconChevronDown as f, IconCopy as g, IconClose as h, IconArrowLeft as i, IconShare as j, IconMoon as k, IconCalendar as l, IconClock as m, Presence as n, IconArrowUp as o, IconChevronRight as p, IconApps as r, IconArrowUpRight as s, Collapse as t, IconChart as u, IconDownload as v, IconInfo as w, IconHeart as x, IconExternal as y };
