import { SITE } from "@aihot/industry/site";
import { Link } from "react-router";
import { pageMeta } from "../lib/seo";
import { IconCoffee, IconHeart, IconBolt, IconCheck, IconMessage, IconArrowLeft } from "../components/icons";
import sponsorWechat from "../assets/sponsor-wechat.jpg";

export function meta() {
  return pageMeta({
    title: "支持本站 · 请喝咖啡",
    description: `支持 ${SITE.name} 运营维护，请站长喝杯咖啡，共同守护最纯粹的休斯敦火箭资讯空间。`,
    path: "/sponsor",
  });
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" };
}

export default function SponsorPage() {
  return (
    <div className="mx-auto max-w-[var(--page-max-reading)] pb-12 pt-2">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink"
        >
          <IconArrowLeft size={15} />
          返回关于
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#CE1141]/20 bg-[#CE1141]/5 px-3 py-1 text-[12px] font-semibold text-[#CE1141]">
          <IconCoffee size={14} />
          <span>请站长喝杯咖啡</span>
        </div>
        <h1 className="mt-3 text-[26px] font-black tracking-tight text-ink lg:text-3xl">
          支持 {SITE.name} 持续运营
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-3">
          {SITE.name} 是由休斯敦火箭球迷独立搭建并维护的公益资讯索引，全站坚持无商业弹窗广告。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: WeChat Appreciation Code Card */}
        <div className="lg:col-span-6">
          <div className="card overflow-hidden border border-line bg-surface p-6 shadow-sm">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <span>微信赞赏码</span>
              </div>
              <h2 className="mt-3 text-[17px] font-bold text-ink">扫码赞助支持</h2>
              <p className="mt-1 text-[13px] text-ink-4">
                微信扫描下方赞赏码，随意金额皆是心意
              </p>
            </div>

            {/* QR Code Container */}
            <div className="mx-auto my-5 max-w-[280px] overflow-hidden rounded-2xl border-2 border-line-soft bg-white p-3 shadow-inner">
              <img
                src={sponsorWechat}
                alt="微信赞赏码"
                className="h-auto w-full rounded-xl object-contain"
                loading="eager"
              />
              <div className="mt-2 text-center text-[12px] font-medium text-neutral-500">
                one step b... 的赞赏码
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl bg-bg-sunk/60 p-3.5 text-center text-[12.5px] leading-relaxed text-ink-3">
              <p className="hidden lg:block">💻 电脑端：打开微信直接使用“扫一扫”</p>
              <p className="lg:hidden">📱 手机端：长按图片或截屏保存，微信扫码识别</p>
              <p className="mt-1 text-[11.5px] text-ink-4">（赞赏时可在微信附带留言，每一条站长都会认真看）</p>
            </div>
          </div>
        </div>

        {/* Right: Sincere Message & Transparency */}
        <div className="space-y-5 lg:col-span-6">
          {/* Card: Why Support */}
          <div className="card border border-line bg-surface p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
              <IconBolt size={18} className="text-[#CE1141]" />
              为什么需要你的赞助？
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">
              ClutchWire 致力于为火箭球迷提供秒级推特追踪、外媒战术专栏、赛程前瞻与热点归组。为了维持网站的极速响应与全天候滚动，需要持续投入实际的基础设施成本：
            </p>
            <ul className="mt-3.5 space-y-2.5 text-[13px] text-ink-3">
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span><strong className="text-ink">高性能 VPS 云服务器</strong>：全天候 24 小时运行信源采集引擎、数据库与渲染节点。</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span><strong className="text-ink">Cloudflare 全球边缘防护</strong>：提供全球 CDN 加速与高并发 DDoS 流量清洗，确保千人万人同时看球也不卡。</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span><strong className="text-ink">独立域名长期续费</strong>：保障 clutchwire.org 品牌的长期稳定解析。</span>
              </li>
            </ul>
          </div>

          {/* Card: Commitments */}
          <div className="card border border-line bg-surface p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
              <IconHeart size={18} className="text-[#CE1141]" />
              站长的真诚承诺
            </h3>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-ink-2">
              <li>
                ✨ <strong className="text-ink">坚持永久无恶性广告</strong>：绝不投放影响阅读体验的弹窗、信息流软文或牛皮癣广告。
              </li>
              <li>
                🔒 <strong className="text-ink">专款专用</strong>：收到的所有赞赏资金，将 100% 优先用于支付服务器带宽和域名维护费用。
              </li>
              <li>
                🚀 <strong className="text-ink">持续迭代更新</strong>：新赛季将持续跟进火箭每场赛况、球员伤病战报与交易流言，陪伴休斯敦红军每一天！
              </li>
            </ul>
          </div>

          {/* Feedback Card */}
          <div className="card border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[14px] font-bold text-ink">有想看的新信源或功能建议？</h4>
                <p className="mt-1 text-[12.5px] text-ink-4">欢迎随时提交，站长会第一时间回复跟进</p>
              </div>
              <Link
                to="/feedback"
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-[#CE1141] hover:text-[#CE1141]"
              >
                <IconMessage size={14} />
                意见反馈
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
