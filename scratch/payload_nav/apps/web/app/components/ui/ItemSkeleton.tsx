import { IconArrowLeft } from "../icons";

export function ItemDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[var(--page-max-reading)] animate-pulse pb-16 pt-3">
      {/* 顶栏返回 */}
      <div className="-ml-1.5 mb-3 flex h-8 items-center gap-1.5 text-[14px] text-ink-3">
        <IconArrowLeft size={16} /> <span>返回</span>
      </div>

      {/* 来源与时间条 */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-28 rounded bg-line-soft" />
        <div className="h-4 w-16 rounded bg-line-soft" />
      </div>

      {/* 标题骨架 */}
      <div className="mt-3.5 space-y-2.5">
        <div className="h-7 w-11/12 rounded-lg bg-line-strong" />
        <div className="h-7 w-3/5 rounded-lg bg-line-strong" />
      </div>

      {/* 摘要骨架 */}
      <div className="mt-4 space-y-2 rounded-2xl border border-line-soft bg-surface/60 p-4.5">
        <div className="h-4 w-full rounded bg-line-soft" />
        <div className="h-4 w-4/5 rounded bg-line-soft" />
      </div>

      {/* 视频 / 主视觉媒体占位框 */}
      <div className="mt-5 aspect-video w-full rounded-2xl border border-line-soft bg-bg-sunk flex flex-col items-center justify-center gap-3">
        <div className="size-7 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
        <span className="text-[12.5px] font-medium text-ink-3 tracking-wide">正在加载详情内容...</span>
      </div>

      {/* 正文段落骨架 */}
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-line-soft" />
        <div className="h-4 w-11/12 rounded bg-line-soft" />
        <div className="h-4 w-3/4 rounded bg-line-soft" />
      </div>
    </div>
  );
}
