import { useState, useEffect } from "react";
import { Link } from "react-router";
import { pageMeta } from "../lib/seo";
import { SITE } from "@aihot/industry/site";
import { IconArrowLeft, IconCheck, IconCopy, IconDownload } from "../components/icons";

export function meta() {
  return pageMeta({
    title: `添加到手机桌面 · ${SITE.name}`,
    description: `将 ${SITE.name} 添加到 iPhone 或安卓手机桌面，获得全屏无地址栏的独立 App 体验。`,
    path: "/install",
  });
}

export default function InstallGuidePage() {
  const [tab, setTab] = useState<"android" | "ios">("android");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-[var(--page-max-reading)] pb-24">
      {/* Back Button */}
      <div className="pt-4 lg:pt-1">
        <Link
          to="/more"
          className="-ml-1.5 inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          <IconArrowLeft size={16} /> 返回更多
        </Link>
      </div>

      {/* Header Info */}
      <header className="mt-3 flex items-center gap-4 rounded-card border border-line bg-surface p-5">
        <img
          src="/icon-192.png"
          alt={SITE.name}
          className="size-14 shrink-0 rounded-2xl border border-line-soft bg-black object-contain shadow-xs"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-[19px] font-bold tracking-tight text-ink">
            安装 APP
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
            将 ClutchWire 安装到手机桌面，像原生 App 一样全屏秒开，无浏览器地址栏与杂乱按键干扰。
          </p>
        </div>
      </header>

      {/* OS Segmented Tabs (Android first) */}
      <div className="mt-5 flex rounded-control bg-bg-sunk p-1">
        <button
          type="button"
          onClick={() => setTab("android")}
          className={`flex-1 rounded-[7px] py-2 text-[13.5px] font-semibold transition-all ${
            tab === "android"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-3 hover:text-ink"
          }`}
        >
          Android (安卓)
        </button>
        <button
          type="button"
          onClick={() => setTab("ios")}
          className={`flex-1 rounded-[7px] py-2 text-[13.5px] font-semibold transition-all ${
            tab === "ios"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-3 hover:text-ink"
          }`}
        >
          iPhone (Safari)
        </button>
      </div>

      {/* Tab 1: Android Content */}
      {tab === "android" && (
        <div className="mt-4 space-y-4">
          <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
            <div className="p-5 pb-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                  官方原生独立版
                </span>
                <span className="text-[12px] text-ink-4">Android 8.0+</span>
              </div>
              <h2 className="mt-2 text-[16px] font-bold tracking-tight text-ink">
                ClutchWire 官方 Android 客户端
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                内置原生 WebView 容器，沉浸全屏秒开，无任何浏览器网址栏与杂乱弹窗干扰。
              </p>

              {/* Redesigned Premium Download Card */}
              <div className="mt-4">
                <a
                  href="/download/clutchwire.apk?v=8"
                  download="ClutchWire.apk"
                  className="group flex w-full items-center justify-between rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:border-accent/50 hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-bg-sunk text-accent shadow-xs transition-all duration-200 group-hover:bg-accent group-hover:text-white">
                      <IconDownload size={20} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[14.5px] font-bold text-ink group-hover:text-accent transition-colors">
                          下载 APK 安装包
                        </span>
                        <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                          官方签名
                        </span>
                      </div>
                      <div className="mt-0.5 text-[12px] text-ink-3">
                        约 12MB · 原生全屏容器 · 官方极速直连
                      </div>
                    </div>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full bg-bg-sunk text-ink-3 transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                    <IconArrowLeft size={16} className="rotate-180" />
                  </div>
                </a>
              </div>
            </div>

            {/* Install steps */}
            <div className="border-t border-line-soft bg-bg-sunk/40 px-5 py-4">
              <div className="text-[12px] font-bold text-ink-2">安装指引：</div>
              <ol className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-ink-3">
                <li className="flex items-start gap-2">
                  <span className="mono font-semibold text-accent">1.</span>
                  <span>点击上方按钮下载 APK 文件，下载完成后在手机通知栏点击打开。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mono font-semibold text-accent">2.</span>
                  <span>若系统提示“允许来自此来源的应用安装”，选择允许并点击安装即可。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mono font-semibold text-accent">3.</span>
                  <span>安装完成后即可从手机桌面图标直接启动，全屏纯净浏览。</span>
                </li>
              </ol>
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: iOS Content */}
      {tab === "ios" && (
        <div className="mt-4 card divide-y divide-line-soft overflow-hidden">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5">
            <span className="mono flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-sunk text-[12px] font-bold text-ink-2">
              01
            </span>
            <div className="flex-1">
              <h2 className="text-[14.5px] font-bold text-ink">在 Safari 浏览器中打开本站</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                iOS 仅允许 Safari 浏览器将网页添加到桌面。如果在微信等 App 内浏览，请点击右上角菜单选择“在 Safari 中打开”。
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1 text-[12px] font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent"
              >
                {copied ? <IconCheck size={13} className="text-emerald-600" /> : <IconCopy size={13} />}
                <span>{copied ? "网址已复制" : "复制本站网址"}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5">
            <span className="mono flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-sunk text-[12px] font-bold text-ink-2">
              02
            </span>
            <div className="flex-1">
              <h2 className="text-[14.5px] font-bold text-ink">点击底部工具栏的分享按钮</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                轻触 Safari 底部正中央的分享图标（带有向上箭头的正方形小方框）。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5">
            <span className="mono flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-sunk text-[12px] font-bold text-ink-2">
              03
            </span>
            <div className="flex-1">
              <h2 className="text-[14.5px] font-bold text-ink">向下滚动菜单，点击「添加到主屏幕」</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                在弹出的操作列表中向下滑动，找到并点击「添加到主屏幕」选项。
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5">
            <span className="mono flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-sunk text-[12px] font-bold text-ink-2">
              04
            </span>
            <div className="flex-1">
              <h2 className="text-[14.5px] font-bold text-ink">点击右上角「添加」完成</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                在确认界面点击右上角的“添加”，手机桌面即会生成 ClutchWire 专属图标，随时点击即看。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
