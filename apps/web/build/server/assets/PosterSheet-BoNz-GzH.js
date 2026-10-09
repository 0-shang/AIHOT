import { L as SITE, N as IconShare, b as IconDownload, g as IconClose, n as Presence } from "./Presence-gkduGZJ4.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region app/features/item/PosterSheet.tsx
function PosterSheet({ id, title, open, onClose }) {
	const src = `/og/posters/${id}.png`;
	const [loaded, setLoaded] = useState(false);
	const [failed, setFailed] = useState(false);
	const [canShareFile, setCanShareFile] = useState(false);
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && onClose();
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		try {
			setCanShareFile(!!navigator.canShare?.({ files: [new File([], "p.png", { type: "image/png" })] }));
		} catch {
			setCanShareFile(false);
		}
		return () => {
			document.body.style.overflow = overflow;
			window.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);
	async function share() {
		try {
			const blob = await (await fetch(src)).blob();
			await navigator.share({
				files: [new File([blob], `${SITE.mcpPrefix}-${id}.png`, { type: "image/png" })],
				title
			});
		} catch {}
	}
	return /* @__PURE__ */ jsx(Presence, {
		show: open,
		enter: "anim-fade-in",
		exit: "anim-fade-out",
		duration: 220,
		children: /* @__PURE__ */ jsxs("div", {
			className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "关闭",
				className: "absolute inset-0 bg-[rgba(8,14,15,0.55)] backdrop-blur-[3px]",
				onClick: onClose
			}), /* @__PURE__ */ jsxs("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "分享海报",
				className: "poster-sheet anim-sheet-in relative flex max-h-[92dvh] w-full flex-col items-center rounded-t-sheet bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] sm:w-auto sm:rounded-sheet sm:px-7 sm:pb-6 sm:pt-5",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "mb-3 h-1 w-10 rounded-full bg-line-strong sm:hidden",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-3 flex w-full items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[14px] font-semibold text-ink",
							children: "分享海报"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-bg-sunk hover:text-ink",
							"aria-label": "关闭",
							children: /* @__PURE__ */ jsx(IconClose, { size: 16 })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative aspect-[3/4] w-full max-w-[min(360px,calc((92dvh-190px)*0.75))] overflow-hidden rounded-card border border-line bg-bg-sunk",
						children: [!loaded && !failed && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] bg-[length:200%_100%]" }), failed ? /* @__PURE__ */ jsx("p", {
							className: "absolute inset-0 grid place-items-center px-6 text-center text-[13px] text-ink-3",
							children: "海报生成失败，请稍后再试。"
						}) : /* @__PURE__ */ jsx("img", {
							src,
							alt: `${title} · 分享海报`,
							className: `size-full object-contain transition-[opacity,transform] duration-[250ms] ${loaded ? "scale-100 opacity-100" : "scale-[0.985] opacity-0"}`,
							onLoad: () => setLoaded(true),
							onError: () => setFailed(true)
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-[12.5px] text-ink-3",
						children: "长按图片可保存或发送给朋友"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex w-full max-w-[360px] gap-2",
						children: [/* @__PURE__ */ jsxs("a", {
							href: src,
							download: `${SITE.mcpPrefix}-${id}.png`,
							className: "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-accent text-[13.5px] font-medium text-accent-contrast transition-colors hover:bg-accent-ink",
							children: [/* @__PURE__ */ jsx(IconDownload, { size: 15 }), " 保存图片"]
						}), canShareFile && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: share,
							className: "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-surface text-[13.5px] font-medium text-ink transition-colors hover:border-ink-4",
							children: [/* @__PURE__ */ jsx(IconShare, { size: 15 }), " 分享"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { PosterSheet as default };
