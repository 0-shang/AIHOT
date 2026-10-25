import { useEffect, useState } from "react";
import { IconClose } from "../icons";

const DISMISS_KEY = "clutchwire_pwa_dismissed_at";
const DISMISS_DURATION_DAYS = 14;

export function PwaInstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check if already running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // 2. Check if recently dismissed by user
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const days = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (days < DISMISS_DURATION_DAYS) return;
    }

    // 3. Detect iOS and WeChat
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const wechat = /MicroMessenger/i.test(ua);
    setIsIOS(ios);
    setIsWeChat(wechat);

    // 4. Register service worker if available
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 5. Listen for Android beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaDeferredPrompt = e;
      setDeferredPrompt(e);
      window.dispatchEvent(new CustomEvent("pwa-prompt-available"));
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show banner after brief delay on mobile devices
    const timer = setTimeout(() => {
      // Show on mobile screens
      if (window.innerWidth < 1024) {
        setVisible(true);
      }
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setShowIosGuide(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chrome native prompt
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setVisible(false);
        }
      } catch {}
    } else {
      // iOS Safari or other browsers: show interactive visual guide
      setShowIosGuide(true);
    }
  };

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Floating Prompt Bar */}
      <div className="fixed bottom-[calc(62px+env(safe-area-inset-bottom))] inset-x-3.5 z-40 mx-auto max-w-[480px] lg:hidden anim-slide-up">
        <div className="flex items-center gap-2.5 rounded-2xl border border-line-strong bg-surface/95 px-3 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md">
          {/* Rockets App Icon */}
          <img
            src="/icon-192.png"
            alt="ClutchWire"
            className="size-10 shrink-0 rounded-xl border border-line-soft bg-black object-contain shadow-xs"
          />

          {/* Text Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-ink">添加到手机桌面</span>
              <span className="rounded bg-[#CE1141]/10 px-1 py-0.2 text-[10px] font-semibold text-[#CE1141]">
                秒开
              </span>
            </div>
            <p className="truncate text-[11.5px] text-ink-3">一键查看休斯敦火箭最新一手动态</p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleInstallClick}
            className="shrink-0 rounded-full bg-[#CE1141] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-xs transition-all hover:bg-[#b00e37] active:scale-95"
          >
            立即添加
          </button>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="关闭提示"
            className="grid size-7 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-bg-sunk hover:text-ink active:scale-95"
          >
            <IconClose size={15} />
          </button>
        </div>
      </div>

      {/* iOS / General Step-by-Step Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm p-4 anim-fade-in lg:hidden">
          <button
            type="button"
            aria-label="关闭指南"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowIosGuide(false)}
          />

          <div className="relative z-10 mx-auto w-full max-w-[420px] rounded-3xl border border-line bg-surface p-5 pb-6 shadow-2xl anim-sheet-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/icon-192.png"
                  alt="ClutchWire"
                  className="size-7 rounded-lg object-contain bg-black"
                />
                <span className="text-[15px] font-bold text-ink">添加 ClutchWire 到主屏幕</span>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="grid size-7 place-items-center rounded-full text-ink-3 hover:bg-bg-sunk hover:text-ink"
                aria-label="关闭"
              >
                <IconClose size={16} />
              </button>
            </div>

            {/* WeChat Hint */}
            {isWeChat ? (
              <div className="mt-4 rounded-xl bg-amber-500/10 p-3 text-[13px] leading-relaxed text-amber-700 dark:text-amber-300">
                <p className="font-semibold">⚠️ 当前处于微信内置浏览器</p>
                <p className="mt-1">
                  请点击右上角的 <strong>「···」</strong>，选择 <strong>「在默认浏览器 / Safari 中打开」</strong> 后，即可添加到桌面。
                </p>
              </div>
            ) : (
              /* Safari Steps */
              <div className="mt-4 space-y-3.5 text-[13.5px] text-ink-2">
                <div className="flex items-start gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#CE1141] text-[11px] font-bold text-white">
                    1
                  </span>
                  <div className="flex-1 leading-snug">
                    点击浏览器底部的{" "}
                    <span className="inline-flex items-center gap-1 rounded bg-bg-sunk px-1.5 py-0.5 font-medium text-ink">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                      分享按钮
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#CE1141] text-[11px] font-bold text-white">
                    2
                  </span>
                  <div className="flex-1 leading-snug">
                    在弹出的菜单中向下滚动，选择{" "}
                    <span className="inline-flex items-center gap-1 rounded bg-bg-sunk px-1.5 py-0.5 font-semibold text-ink">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      添加到主屏幕
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#CE1141] text-[11px] font-bold text-white">
                    3
                  </span>
                  <div className="flex-1 leading-snug">
                    点击右上角 <strong>「添加」</strong>，即可像 App 一样在桌面随时一键打开！
                  </div>
                </div>
              </div>
            )}

            {/* Bottom confirmation */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="w-full rounded-full bg-[#CE1141] py-2.5 text-[13.5px] font-semibold text-white shadow-xs transition-colors hover:bg-[#b00e37]"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
