// 站点身份和读者看得到的文案。换成你的行业时，先改这个文件。
// 网页和后端都读它；改完重新构建（docker compose up --build）即可生效。
// 域名不在这里：部署时用环境变量 SITE_URL 设置。

export const SITE = {
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
  contactEmail: null as string | null,
  /** 页脚的一行小字（选填）。 */
  footerNote: "ClutchWire · 休斯敦火箭队前沿情报站",
  /** 中国大陆网站的 ICP 备案号（选填），填了就显示在页脚并链接到工信部备案系统。 */
  icp: null as string | null,
  /** 结构化数据里的网站运营者（搜索引擎用）。 */
  organization: {
    name: "ClutchWire",
    /** 创始人（选填）：{ name, url, description }。 */
    founder: null as null | { name: string; url?: string; description?: string },
  },
  /** 抓取信源时报上的名字（User-Agent 里用），不要冒用别的站。 */
  crawlerName: "ClutchWireBot",
} as const;

/** 关于页的文案。数字（信源数、收录数、精选数、日报期数）来自站内实时统计，不用写在这里。 */
export const ABOUT = {
  kicker: `关于 ${SITE.name}`,
  /** 大标题：第一行正常颜色，第二行强调色。 */
  headline: ["休斯敦火箭全网动态，", "真正值得看的，都在这里。"] as [string, string],
  /** 标题下面的一段话。{sources} 会换成实时的信源数。 */
  lead: `${SITE.name} 替你全天候盯着 {sources} 个休斯敦火箭队与 NBA 优质信源：实时聚合随队名记一手推文、战术深度专栏、官方伤病动态与赛程对决，重要情报即刻直达。`,
  /** 信源河动画下面的四个环节。 */
  steps: {
    collect: "覆盖休斯敦纪事报、The Athletic、ESPN、随队名记 X 推帖与官方原声；高频信源滚动监测。",
    store: "全天候秒级收录，自动结构化归类战报、战术剖析、名记流言与更衣室声音，去噪纯净呈现。",
    select: "多方信源交叉印证，智能提炼焦点事件与赛后关键复盘，结合讨论量实时计算全网热度指数。",
    publish: "无缝整合全赛季常规赛日程日历与主客战报，全维度追踪年轻核心成长与战绩走向。",
  },
  /**
   * 作者块（选填），null 就不显示。
   * avatarSourceId：一个 X 账号信源的 id，头像取它的（选填）。
   * 二维码在后台“设置”里上传，或者放进 industry/brand/contact/；没有二维码就不显示那张卡片。
   */
  maker: null as null | {
    name: string;
    greeting: string[];
    avatarSourceId?: string | null;
    wechat?: { title: string; note: string };
    feishu?: { title: string; note: string };
  },
  /** 页面底部的版权与下架说明（结尾会接“反馈页”的链接）。 */
  copyright: `${SITE.name} 是聚合摘要和阅读索引，原文版权归各来源所有。如果你是来源方，希望更正、下架或调整展示方式，可以通过`,
} as const;

/** “AI 日报”这类说法：行业词和名词之间，英文词加空格，中文词不加。 */
export function withSubject(noun: string): string {
  return /[A-Za-z0-9]$/.test(SITE.subject) ? `${SITE.subject} ${noun}` : `${SITE.subject}${noun}`;
}
