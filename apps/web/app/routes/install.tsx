import { useState, useEffect } from "react";
import { Link } from "react-router";
import { pageMeta } from "../lib/seo";
import { SITE } from "@aihot/industry/site";
import {
  IconArrowLeft,
  IconCheck,
  IconCopy,
  IconDownload,
  IconBolt,
  IconExternal,
} from "../components/icons";

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
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [isWeChat, setIsWeChat] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showApkBackup, setShowApkBackup] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone PWA mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect WeChat
    const ua = navigator.userAgent;
    setIsWeChat(/MicroMessenger/i.test(ua));

    // Detect Android or iOS default tab
    if (/iPad|iPhone|iPod/.test(ua)) {
      setTab("ios");
    } else {
      setTab("android");
    }

    // Check if deferredPrompt is already on window
    const checkPrompt = () => {
      const p = (window as unknown as { __pwaDeferredPrompt?: unknown }).__pwaDeferredPrompt;
      if (p) setHasPrompt(true);
    };
    checkPrompt();

    const handlePromptAvail = () => {
      setHasPrompt(true);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __pwaDeferredPrompt?: unknown }).__pwaDeferredPrompt = e;
      setHasPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setInstallSuccess(true);
    };

    window.addEventListener("pwa-prompt-available", handlePromptAvail);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("pwa-prompt-available", handlePromptAvail);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleInstallPwa = async () => {
    const promptEvent = (window as unknown as { __pwaDeferredPrompt?: any }).__pwaDeferredPrompt;
    if (promptEvent && typeof promptEvent.prompt === "function") {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") {
          setInstallSuccess(true);
          setIsStandalone(true);
        }
        (window as unknown as { __pwaDeferredPrompt?: any }).__pwaDeferredPrompt = null;
        setHasPrompt(false);
      } catch {
        setShowManualGuide(true);
      }
    } else {
      // Browser didn't expose beforeinstallprompt (e.g. user in WeChat, custom browser, or already prompted)
      setShowManualGuide(true);
      const manualElem = document.getElementById("manual-guide-section");
      if (manualElem) {
        manualElem.scrollIntoView({ behavior: "smooth" });
      }
    }
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
            安装 ClutchWire 客户端
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
            全屏独立应用体验，极速看球。
          </p>
        </div>
      </header>

      {/* OS Segmented Tabs */}
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
          Android
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
          {/* WeChat Banner Alert if detected */}
          {isWeChat && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-[13.5px] text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2 font-bold">
                <span>⚠️ 当前处于微信内置浏览器</span>
              </div>
              <p className="mt-1 leading-relaxed">
                微信限制了文件直接下载。请点击右上角 <strong>「···」</strong>，选择 <strong>「在浏览器中打开」</strong>，即可下载安装。
              </p>
            </div>
          )}

          {/* Minimalist Android Download Card */}
          <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-bold tracking-tight text-ink">
                  ClutchWire for Android
                </h2>
                <div className="mt-1.5 flex items-center gap-3 text-[12.5px] text-ink-3">
                  <span>版本 v1.2.0</span>
                  <span>·</span>
                  <span>约 12MB</span>
                  <span>·</span>
                  <span>Android 7.0+</span>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href="/download/clutchwire.apk?v=14"
                  download="ClutchWire.apk"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-[14px] font-semibold text-bg shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <IconDownload size={16} />
                  <span>下载安装包 (12MB)</span>
                </a>
              </div>
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
