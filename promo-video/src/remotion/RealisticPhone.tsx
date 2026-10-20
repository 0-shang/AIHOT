import React from "react";
import { Img, staticFile } from "remotion";

interface RealisticPhoneProps {
  headerImg: string;
  headerHeight: number; // 基于 580 宽度的像素高 (如 feed 为 125, detail 为 64)
  contentImg: string;
  tabbarImg?: string;
  tabbarHeight?: number; // 默认 72
  scrollY: number; // 惯性向上滑动的距离 (正数)
  phoneScale?: number;
  phoneTranslateY?: number;
  rotateX?: number;
  rotateY?: number;
}

export const RealisticPhone: React.FC<RealisticPhoneProps> = ({
  headerImg,
  headerHeight,
  contentImg,
  tabbarImg,
  tabbarHeight = 72,
  scrollY,
  phoneScale = 1,
  phoneTranslateY = 0,
  rotateX = 0,
  rotateY = 0,
}) => {
  const width = 580;
  const height = 760;

  return (
    <div
      style={{
        position: "absolute",
        top: 390,
        left: "50%",
        transform: `translateX(-50%) translateY(${phoneTranslateY}px) scale(${phoneScale}) perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        width,
        height,
        borderRadius: 56,
        background: "#ffffff",
        border: "4px solid #27272a",
        boxShadow: "0 40px 100px -20px rgba(0,0,0,0.95), 0 0 50px rgba(225, 29, 72, 0.22), inset 0 0 2px rgba(255,255,255,0.35)",
        overflow: "hidden",
        zIndex: 30,
      }}
    >
      {/* 1. 灵动岛 (Dynamic Island) */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 126,
          height: 28,
          background: "#000000",
          borderRadius: 20,
          zIndex: 60,
        }}
      />

      {/* 2. 顶部固定导航栏 (Sticky Header) - 100% 实色纯白遮罩 + 细微投影 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: headerHeight,
          background: "#ffffff",
          zIndex: 40,
          boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Img src={staticFile(headerImg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>

      {/* 3. 中间内容滚动视窗 (Scroll View) - 严格限定在 Header 与 Tabbar 之间 */}
      <div
        style={{
          position: "absolute",
          top: headerHeight,
          left: 0,
          right: 0,
          bottom: tabbarImg ? tabbarHeight : 0,
          overflow: "hidden",
          zIndex: 20,
          background: "#ffffff",
        }}
      >
        <Img
          src={staticFile(contentImg)}
          style={{
            width: "100%",
            transform: `translateY(-${scrollY}px)`,
            willChange: "transform",
          }}
        />
      </div>

      {/* 4. 底部固定导航栏 (Sticky Tabbar) */}
      {tabbarImg && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: tabbarHeight,
            background: "#ffffff",
            zIndex: 40,
            boxShadow: "0 -3px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Img src={staticFile(tabbarImg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom" }} />
        </div>
      )}

      {/* 5. 底部手势横条 (Home Bar) */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          height: 4,
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: 2,
          zIndex: 60,
        }}
      />
    </div>
  );
};
