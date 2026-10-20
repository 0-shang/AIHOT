import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  Easing,
} from "remotion";
import { RealisticPhone } from "./RealisticPhone";

export const ClutchWirePromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 总长 900 帧 (30秒, 30fps)
  // 分镜设计:
  // 0 - 150 帧 (0s - 5s): 镜头1 · 序幕揭示 (The Reveal - 极简排版与产品定义)
  // 150 - 360 帧 (5s - 12s): 镜头2 · 随队推文 (The Live Feed - 真实微距与固定导航栏滚动)
  // 360 - 560 帧 (12s - 18.6s): 镜头3 · 精密赛程 (Precision Schedule - 战绩与高阶数据)
  // 560 - 720 帧 (18.6s - 24s): 镜头4 · 纯净体验 (Pure Craft - 零弹窗专栏阅读)
  // 720 - 900 帧 (24s - 30s): 镜头5 · 终章发布 (Available Now - 品牌定格与行动)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080a",
        color: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'PingFang SC', sans-serif",
        overflow: "hidden",
      }}
    >
      <CinematicAtmosphere frame={frame} />
      <MinimalNavbar frame={frame} />

      {frame < 165 && <SceneReveal frame={frame} fps={fps} />}
      {frame >= 145 && frame < 375 && <SceneFeed frame={frame - 145} fps={fps} />}
      {frame >= 355 && frame < 575 && <SceneSchedule frame={frame - 355} fps={fps} />}
      {frame >= 555 && frame < 735 && <ScenePure frame={frame - 555} fps={fps} />}
      {frame >= 715 && <SceneOutro frame={frame - 715} fps={fps} />}
    </AbsoluteFill>
  );
};

// ==========================================
// 电影级环境光 (Keynote 柔和聚光灯)
// ==========================================
const CinematicAtmosphere: React.FC<{ frame: number }> = ({ frame }) => {
  const lightBreath = Math.sin(frame * 0.03) * 0.08 + 0.92;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(225, 29, 72, 0.18) 0%, rgba(206, 17, 65, 0.03) 50%, transparent 75%)",
          filter: "blur(100px)",
          opacity: lightBreath,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// 极简常驻导航标
// ==========================================
const MinimalNavbar: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progress = Math.min(100, (frame / 900) * 100);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 70px",
        zIndex: 100,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${progress}%`,
          height: 3,
          background: "linear-gradient(90deg, #e11d48, #ff4d6d)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#e11d48", boxShadow: "0 0 14px #e11d48" }} />
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a1a1aa" }}>
          ClutchWire
        </span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#71717a" }}>
        Houston Intelligence
      </div>
    </div>
  );
};

// ==========================================
// SCENE 1: 序幕揭示 (The Reveal)
// ==========================================
const SceneReveal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t1 = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 80 } });
  const t2 = spring({ frame: frame - 28, fps, config: { damping: 20, stiffness: 80 } });
  const t3 = spring({ frame: frame - 48, fps, config: { damping: 20, stiffness: 80 } });
  const sub = spring({ frame: frame - 68, fps, config: { damping: 22, stiffness: 70 } });

  const exitOpacity = interpolate(frame, [135, 160], [1, 0], { extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [135, 160], [1, 0.94], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#e11d48",
          marginBottom: 28,
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [30, 0])}px)`,
        }}
      >
        Designed For Houston
      </div>

      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "#ffffff",
            opacity: t2,
            transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          }}
        >
          每一个休斯顿瞬间，
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "#71717a",
            opacity: t3,
            transform: `translateY(${interpolate(t3, [0, 1], [40, 0])}px)`,
          }}
        >
          分秒不差。
        </div>
      </div>

      <div style={{ width: 80, height: 3, backgroundColor: "#e11d48", marginBottom: 40, opacity: sub }} />

      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#a1a1aa",
          maxWidth: 780,
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [30, 0])}px)`,
        }}
      >
        休斯顿随队名记一手动态、全季赛程与深度专栏。<br />
        告别二手信息，回归纯粹热爱。
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 2: 真实推文流 (顶底完全固定，中间卡片优雅微滑)
// ==========================================
const SceneFeed: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enterSpring = spring({ frame, fps, config: { damping: 22, mass: 1, stiffness: 75 } });
  const cameraScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const cameraY = interpolate(enterSpring, [0, 1], [160, 0]);
  const rotateX = interpolate(enterSpring, [0, 1], [10, 0]);
  const rotateY = interpolate(enterSpring, [0, 1], [-8, 0]);

  // 【真实 iOS 惯性滑动：内容只滑动 90px，顶栏和底栏绝不推跑】
  const scrollOffset = interpolate(
    frame,
    [35, 75, 120, 150],
    [0, 50, 85, 90],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const featureSpring = spring({ frame: frame - 25, fps, config: { damping: 18, stiffness: 90 } });
  const exitOpacity = interpolate(frame, [195, 220], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <ProductHeader
        category="01 / REAL-TIME STREAM"
        headline="随队名记推文 · 秒级同步"
        descriptor="Jonathan Feigen / Kelly Iko / Lachard Binkley 一手编译"
        frame={frame}
        fps={fps}
      />

      <RealisticPhone
        headerImg="feed_header.png"
        headerHeight={125}
        contentImg="feed_content.png"
        tabbarImg="feed_tabbar.png"
        tabbarHeight={72}
        scrollY={scrollOffset}
        phoneScale={cameraScale}
        phoneTranslateY={cameraY}
        rotateX={rotateX}
        rotateY={rotateY}
      />

      <div
        style={{
          position: "absolute",
          top: 1220,
          left: "50%",
          transform: `translateX(-50%) scale(${featureSpring})`,
          opacity: featureSpring,
          display: "flex",
          gap: 24,
        }}
      >
        <MinimalTag text="24H 全网监控" highlight />
        <MinimalTag text="记者官方蓝V认证" />
        <MinimalTag text="完整中文编译" />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 3: 精密赛程与数据
// ==========================================
const SceneSchedule: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enterSpring = spring({ frame, fps, config: { damping: 22, mass: 1, stiffness: 75 } });
  const cameraScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const cameraY = interpolate(enterSpring, [0, 1], [160, 0]);

  const scrollOffset = interpolate(
    frame,
    [30, 70, 115, 145],
    [0, 40, 65, 70],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const featureSpring = spring({ frame: frame - 25, fps, config: { damping: 18, stiffness: 90 } });
  const exitOpacity = interpolate(frame, [195, 220], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <ProductHeader
        category="02 / PRECISION SCHEDULE"
        headline="全季赛程 · 伤病与首发"
        descriptor="实时比分更新、赛前官方伤病名单与球员高阶技术统计"
        frame={frame}
        fps={fps}
      />

      <RealisticPhone
        headerImg="schedule_header.png"
        headerHeight={203}
        contentImg="schedule_content.png"
        tabbarImg="schedule_tabbar.png"
        tabbarHeight={72}
        scrollY={scrollOffset}
        phoneScale={cameraScale}
        phoneTranslateY={cameraY}
      />

      <div
        style={{
          position: "absolute",
          top: 1220,
          left: "50%",
          transform: `translateX(-50%) scale(${featureSpring})`,
          opacity: featureSpring,
          display: "flex",
          gap: 24,
        }}
      >
        <MinimalTag text="82场常规赛日历" />
        <MinimalTag text="官方赛前伤报" highlight />
        <MinimalTag text="单场攻防效率" />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 4: 战术专栏纯净阅读 (顶栏 ←返回 绝不推跑)
// ==========================================
const ScenePure: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enterSpring = spring({ frame, fps, config: { damping: 22, mass: 1, stiffness: 75 } });
  const cameraScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const cameraY = interpolate(enterSpring, [0, 1], [160, 0]);

  const scrollOffset = interpolate(
    frame,
    [30, 75, 115],
    [0, 50, 75],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const featureSpring = spring({ frame: frame - 25, fps, config: { damping: 18, stiffness: 90 } });
  const exitOpacity = interpolate(frame, [155, 175], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <ProductHeader
        category="03 / DISTRACTION-FREE"
        headline="战术专栏 · 零弹窗干扰"
        descriptor="纯净版式排版、无垃圾广告，专注于每一次技战术复盘"
        frame={frame}
        fps={fps}
      />

      <RealisticPhone
        headerImg="detail_header.png"
        headerHeight={64}
        contentImg="detail_content.png"
        scrollY={scrollOffset}
        phoneScale={cameraScale}
        phoneTranslateY={cameraY}
      />

      <div
        style={{
          position: "absolute",
          top: 1220,
          left: "50%",
          transform: `translateX(-50%) scale(${featureSpring})`,
          opacity: featureSpring,
          display: "flex",
          gap: 24,
        }}
      >
        <MinimalTag text="零弹窗广告" highlight />
        <MinimalTag text="极速加载体验" />
        <MinimalTag text="深度战术分析" />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// SCENE 5: 终章发布 (Available Now)
// ==========================================
const SceneOutro: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 80 } });
  const titleSpring = spring({ frame: frame - 22, fps, config: { damping: 20, stiffness: 80 } });
  const btnSpring = spring({ frame: frame - 38, fps, config: { damping: 16, stiffness: 90 } });
  const hintSpring = spring({ frame: frame - 52, fps, config: { damping: 20, stiffness: 80 } });

  const glowPulse = Math.sin(frame * 0.08) * 0.15 + 0.85;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          transform: `scale(${logoSpring})`,
          opacity: logoSpring,
          width: 190,
          height: 190,
          borderRadius: 48,
          background: "#0c0d12",
          border: "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.9), 0 0 ${70 * glowPulse}px rgba(225,29,72,0.45)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 44,
        }}
      >
        <Img src={staticFile("icon.png")} style={{ width: 145, height: 145, objectFit: "contain" }} />
      </div>

      <div
        style={{
          transform: `scale(${titleSpring})`,
          opacity: titleSpring,
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 1 }}>
          ClutchWire
        </div>
        <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#71717a", marginTop: 14 }}>
          Intelligence for Houston Rockets
        </div>
      </div>

      <div
        style={{
          transform: `scale(${btnSpring})`,
          opacity: btnSpring,
          background: "#e11d48",
          boxShadow: "0 16px 40px rgba(225,29,72,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
          borderRadius: 60,
          padding: "20px 72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <span style={{ color: "#ffffff", fontSize: 34, fontWeight: 700, letterSpacing: "0.02em" }}>
          clutchwire.org
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(hintSpring, [0, 1], [20, 0])}px)`,
          opacity: hintSpring,
          color: "#a1a1aa",
          fontSize: 22,
          fontWeight: 400,
          textAlign: "center",
        }}
      >
        手机浏览器直接打开 · 添加至主屏幕体验原生速度
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// 通用工业级标题组件
// ==========================================
const ProductHeader: React.FC<{
  category: string;
  headline: string;
  descriptor: string;
  frame: number;
  fps: number;
}> = ({ category, headline, descriptor, frame, fps }) => {
  const cSpring = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const hSpring = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 80 } });
  const dSpring = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 80 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 50,
        padding: "0 60px",
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#e11d48",
          marginBottom: 14,
          opacity: cSpring,
          transform: `translateY(${interpolate(cSpring, [0, 1], [15, 0])}px)`,
        }}
      >
        {category}
      </div>
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          lineHeight: 1.15,
          marginBottom: 12,
          opacity: hSpring,
          transform: `translateY(${interpolate(hSpring, [0, 1], [25, 0])}px)`,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 400,
          color: "#a1a1aa",
          opacity: dSpring,
          transform: `translateY(${interpolate(dSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        {descriptor}
      </div>
    </div>
  );
};

// ==========================================
// 极简特性标签
// ==========================================
const MinimalTag: React.FC<{ text: string; highlight?: boolean }> = ({ text, highlight }) => (
  <div
    style={{
      background: highlight ? "rgba(225,29,72,0.15)" : "rgba(255,255,255,0.04)",
      border: highlight ? "1.5px solid rgba(225,29,72,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
      borderRadius: 30,
      padding: "10px 24px",
      color: highlight ? "#ff4d6d" : "#e4e4e7",
      fontSize: 18,
      fontWeight: 600,
      backdropFilter: "blur(16px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    }}
  >
    {text}
  </div>
);
