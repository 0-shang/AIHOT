// Share poster (1080×1920 PNG) for the trending / hot ranking list, designed for mobile sharing
// (Hupu, WeChat groups, Xiaohongshu, Weibo). Renders server-side with Satori and Sharp.
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import satori from "satori";
import sharp from "sharp";
import { renderSVG } from "uqr";
import type { HotResponse, HotEntryView } from "@aihot/contracts/site";
import { SITE } from "@aihot/industry/site";
import { config } from "@aihot/backend/config";
import { fonts, h, nameMark, OG_PNG, SITE_HOST, type Node } from "./render.ts";

export const HOT_POSTER_TEMPLATE_VERSION = "hot-poster-2026-10-21.1";
const WIDTH = 1080;
const HEIGHT = 1920;
const CACHE_DIR = path.join(config.dataDir, "ogcache");

const INK = "#0e191b";
const ACCENT = "#CE1141"; // Rockets Red
const ACCENT_SOFT = "rgba(206,17,65,0.08)";

function clamp(text: string, max: number) {
  const chars = [...text.replace(/\s+/g, " ").trim()];
  return chars.length > max ? `${chars.slice(0, max - 1).join("")}…` : chars.join("");
}

function formatTime(isoString: string | null): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${m}月${day}日 ${h}:${min} 更新`;
  } catch {
    return "";
  }
}

async function buildTree(data: HotResponse): Promise<Node> {
  const entries = data.entries || [];
  const lead: HotEntryView | undefined = entries[0];
  const runners: HotEntryView[] = entries.slice(1, 3);
  const others: HotEntryView[] = entries.slice(3, 10);

  const qrUrl = `${config.siteUrl}/hot`;
  const qrSvg = `data:image/svg+xml;base64,${Buffer.from(
    renderSVG(qrUrl, { border: 0, ecc: "M", blackColor: INK, whiteColor: "#ffffff" })
  ).toString("base64")}`;

  const timeText = formatTime(data.computedAt);

  return h(
    "div",
    {
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      flexDirection: "column",
      padding: "52px 60px 44px",
      fontFamily: "Noto Sans SC",
      color: INK,
      backgroundColor: "#f6f7f8",
      backgroundImage:
        "radial-gradient(circle at 95% 4%, rgba(206,17,65,0.12), rgba(246,247,248,0) 45%), radial-gradient(circle at 5% 95%, rgba(206,17,65,0.06), rgba(246,247,248,0) 40%)",
    },
    [
      // 1. Top Brand Header
      h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        h("div", { display: "flex", alignItems: "center" }, [
          nameMark(38, INK, ACCENT),
          h(
            "div",
            {
              display: "flex",
              fontSize: 22,
              color: "#738084",
              marginLeft: 18,
              borderLeft: "2px solid #dde2e4",
              paddingLeft: 16,
            },
            "休斯敦火箭前沿情报站"
          ),
        ]),
        timeText
          ? h("div", { display: "flex", fontSize: 22, color: "#829094", fontWeight: 500 }, timeText)
          : null,
      ].filter(Boolean)),

      // 2. Title Section
      h("div", { display: "flex", flexDirection: "column", marginTop: 28 }, [
        h("div", { display: "flex", alignItems: "center" }, [
          h("div", {
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: ACCENT,
            marginRight: 10,
          }),
          h(
            "div",
            { display: "flex", fontSize: 22, fontWeight: 700, color: ACCENT, letterSpacing: 1 },
            `实时热度 · 过去 ${data.windowHours || 48} 小时`
          ),
        ]),
        h(
          "div",
          {
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            color: INK,
            marginTop: 10,
            letterSpacing: -0.5,
          },
          "休斯敦火箭 · 全网热度榜"
        ),
        h(
          "div",
          { display: "flex", fontSize: 23, color: "#66757a", marginTop: 8 },
          `全网讨论最多的 ${entries.length || 10} 件事 · 多源交叉印证与讨论量计算`
        ),
      ]),

      // 3. Lead Story (NO. 01)
      lead
        ? h(
            "div",
            {
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
              borderRadius: 26,
              padding: "28px 34px",
              marginTop: 26,
              boxShadow: "0 2px 4px rgba(14,25,27,0.04), 0 10px 24px rgba(14,25,27,0.05)",
            },
            [
              h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
                h("div", { display: "flex", alignItems: "center" }, [
                  h(
                    "div",
                    { display: "flex", fontSize: 24, fontWeight: 700, color: ACCENT, letterSpacing: 1 },
                    "NO.01"
                  ),
                  h(
                    "div",
                    {
                      display: "flex",
                      marginLeft: 14,
                      padding: "4px 14px",
                      borderRadius: 999,
                      backgroundColor: "rgba(206,17,65,0.09)",
                      fontSize: 20,
                      fontWeight: 700,
                      color: ACCENT,
                    },
                    "🔥 焦点热议"
                  ),
                ]),
                h(
                  "div",
                  { display: "flex", alignItems: "baseline", fontSize: 22, color: "#66757a" },
                  [
                    h("span", { fontSize: 20, marginRight: 6 }, "热度指数"),
                    h(
                      "span",
                      { fontSize: 32, fontWeight: 700, color: INK, fontFamily: "Noto Sans SC" },
                      String(Math.round(lead.heat))
                    ),
                  ]
                ),
              ]),
              h(
                "div",
                {
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: INK,
                  marginTop: 14,
                },
                clamp(lead.story.title, 42)
              ),
              lead.summary
                ? h(
                    "div",
                    {
                      display: "flex",
                      fontSize: 23,
                      lineHeight: 1.6,
                      color: "#465356",
                      marginTop: 12,
                    },
                    clamp(lead.summary, 98)
                  )
                : null,
              lead.latest
                ? h(
                    "div",
                    {
                      display: "flex",
                      backgroundColor: "rgba(206,17,65,0.05)",
                      borderRadius: 12,
                      padding: "10px 16px",
                      fontSize: 21,
                      color: "#8e1631",
                      marginTop: 14,
                      lineHeight: 1.45,
                    },
                    `最新进展：${clamp(lead.latest, 54)}`
                  )
                : null,
              h(
                "div",
                {
                  display: "flex",
                  alignItems: "center",
                  fontSize: 20,
                  color: "#829094",
                  marginTop: 16,
                  borderTop: "1px solid #f0f2f3",
                  paddingTop: 14,
                },
                [
                  h(
                    "div",
                    { display: "flex", color: "#566467", fontWeight: 500 },
                    lead.sourceNames.slice(0, 2).join("、")
                  ),
                  h(
                    "div",
                    { display: "flex", marginLeft: 6 },
                    `等 ${lead.sourceCount} 个来源 · ${lead.participantCount} 位参与者共同讨论`
                  ),
                ]
              ),
            ].filter(Boolean)
          )
        : null,

      // 4. Runners (NO. 02 & NO. 03)
      runners.length > 0
        ? h(
            "div",
            { display: "flex", gap: 20, marginTop: 20 },
            runners.map((r) =>
              h(
                "div",
                {
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: 22,
                  padding: "22px 26px",
                  boxShadow: "0 2px 4px rgba(14,25,27,0.03), 0 6px 18px rgba(14,25,27,0.04)",
                },
                [
                  h(
                    "div",
                    { display: "flex", alignItems: "center", justifyContent: "space-between" },
                    [
                      h(
                        "div",
                        {
                          display: "flex",
                          fontSize: 22,
                          fontWeight: 700,
                          color: r.rank === 2 ? "#d0421a" : "#ca6e1b",
                        },
                        `NO.0${r.rank}`
                      ),
                      h(
                        "div",
                        { display: "flex", fontSize: 24, fontWeight: 700, color: INK },
                        String(Math.round(r.heat))
                      ),
                    ]
                  ),
                  h(
                    "div",
                    {
                      display: "flex",
                      fontSize: 26,
                      fontWeight: 700,
                      lineHeight: 1.35,
                      color: INK,
                      marginTop: 10,
                    },
                    clamp(r.story.title, 26)
                  ),
                  r.summary
                    ? h(
                        "div",
                        {
                          display: "flex",
                          fontSize: 20,
                          lineHeight: 1.5,
                          color: "#5b696c",
                          marginTop: 8,
                        },
                        clamp(r.summary, 42)
                      )
                    : null,
                  h(
                    "div",
                    { display: "flex", fontSize: 18, color: "#8a979a", marginTop: 12 },
                    `${r.sourceCount} 个来源 · ${r.participantCount} 位参与者`
                  ),
                ].filter(Boolean)
              )
            )
          )
        : null,

      // 5. Rest of Hot Stories (NO. 04 - NO. 10)
      others.length > 0
        ? h(
            "div",
            {
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
              borderRadius: 24,
              padding: "10px 28px",
              marginTop: 20,
              boxShadow: "0 2px 4px rgba(14,25,27,0.03), 0 6px 18px rgba(14,25,27,0.04)",
            },
            others.map((item, idx) =>
              h(
                "div",
                {
                  display: "flex",
                  alignItems: "center",
                  padding: "13px 0",
                  borderBottom: idx < others.length - 1 ? "1px solid #f2f4f4" : "none",
                },
                [
                  h(
                    "div",
                    {
                      display: "flex",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#93a0a3",
                      width: 52,
                    },
                    item.rank < 10 ? `0${item.rank}` : String(item.rank)
                  ),
                  h(
                    "div",
                    {
                      display: "flex",
                      flex: 1,
                      fontSize: 23,
                      fontWeight: 700,
                      color: INK,
                      lineHeight: 1.3,
                    },
                    clamp(item.story.title, 32)
                  ),
                  h(
                    "div",
                    { display: "flex", fontSize: 19, color: "#8a979a", marginRight: 24 },
                    `${item.sourceCount}来源`
                  ),
                  h(
                    "div",
                    {
                      display: "flex",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#2f3d40",
                      width: 44,
                      justifyContent: "flex-end",
                    },
                    String(Math.round(item.heat))
                  ),
                ]
              )
            )
          )
        : null,

      // Flexible spacer to balance layout
      h("div", { display: "flex", flex: 1 }),

      // 6. Footer QR Code Card
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          padding: "24px 34px",
          borderRadius: 24,
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(14,25,27,0.05), 0 10px 28px rgba(14,25,27,0.06)",
        },
        [
          h(
            "img",
            { width: 130, height: 130 },
            undefined,
            { src: qrSvg, width: 130, height: 130 }
          ),
          h("div", { display: "flex", flexDirection: "column", marginLeft: 32, flex: 1 }, [
            h(
              "div",
              { display: "flex", fontSize: 26, fontWeight: 700, color: INK },
              "扫码直达 ClutchWire 查看热榜"
            ),
            h(
              "div",
              { display: "flex", marginTop: 8, fontSize: 20, color: "#66757a", lineHeight: 1.4 },
              "全网信源追踪 · 随队名记一手推帖 · 赛程战报 · 深度专栏"
            ),
            h(
              "div",
              { display: "flex", marginTop: 8, fontSize: 21, fontWeight: 700, color: ACCENT },
              `${SITE_HOST}/hot`
            ),
          ]),
        ]
      ),

      // 7. Very bottom copyright / tagline
      h(
        "div",
        {
          display: "flex",
          justifyContent: "center",
          marginTop: 22,
          fontSize: 20,
          color: "#98a4a7",
        },
        `${SITE.name} · ${SITE.homeTitle}`
      ),
    ].filter(Boolean)
  );
}

export function hotPosterEtag(data: HotResponse): string {
  const digest = {
    v: HOT_POSTER_TEMPLATE_VERSION,
    computedAt: data.computedAt,
    entries: (data.entries || []).map((e) => ({
      r: e.rank,
      t: e.story.title,
      h: Math.round(e.heat),
      s: e.sourceCount,
    })),
  };
  return createHash("sha256").update(JSON.stringify(digest)).digest("hex").slice(0, 24);
}

const inflight = new Map<string, Promise<{ png: Buffer; etag: string }>>();

export function renderHotPoster(data: HotResponse): Promise<{ png: Buffer; etag: string }> {
  const etag = hotPosterEtag(data);
  let job = inflight.get(etag);
  if (!job) {
    job = render(data, etag).finally(() => inflight.delete(etag));
    inflight.set(etag, job);
  }
  return job;
}

async function render(data: HotResponse, etag: string): Promise<{ png: Buffer; etag: string }> {
  const file = path.join(CACHE_DIR, `hot-poster-${etag}.png`);
  try {
    return { png: await readFile(file), etag };
  } catch {
    // not cached yet
  }
  const svg = await satori((await buildTree(data)) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: await fonts(),
  });
  const png = await sharp(Buffer.from(svg)).png(OG_PNG).toBuffer();
  await mkdir(CACHE_DIR, { recursive: true });
  const tmp = `${file}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(tmp, png);
  await rename(tmp, file);
  return { png, etag };
}
