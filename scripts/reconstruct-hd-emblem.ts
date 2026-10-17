import sharp from 'sharp';
import fs from 'node:fs';

async function main() {
  const upscaleFactor = 4; // 279 x 259 -> 1116 x 1036
  const w = 279 * upscaleFactor;
  const h = 259 * upscaleFactor;

  // 1. Load upscaled masks using lanczos3 for maximum edge fidelity
  const upscaledWhite = await sharp('assets/designs/mask_white.png')
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .raw()
    .toBuffer();

  const upscaledRed = await sharp('assets/designs/mask_red.png')
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .raw()
    .toBuffer();

  // 2. High-precision edge sharpening via Sub-pixel Smoothstep
  // This converts blurry upscaled raster edges into razor-sharp, smooth vector curves!
  function smoothstep(edge0: number, edge1: number, x: number) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // Create crisp RGBA buffer for White shape
  const whiteRgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const val = upscaledWhite[i];
    // Threshold around 120 with 24-pixel transition band
    const alpha = Math.round(smoothstep(105, 135, val) * 255);
    whiteRgba[i * 4] = 255;
    whiteRgba[i * 4 + 1] = 255;
    whiteRgba[i * 4 + 2] = 255;
    whiteRgba[i * 4 + 3] = alpha;
  }

  // Create crisp RGBA buffer for Red shape
  // Rockets Crimson: RGB (196, 39, 53) -> #C42735, with subtle top-to-bottom depth
  const redRgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const yRatio = y / h;
    // Subtle gradient from #D62839 to #B81D2D
    const redR = Math.round(214 - yRatio * 20);
    const redG = Math.round(40 - yRatio * 10);
    const redB = Math.round(55 - yRatio * 15);

    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const val = upscaledRed[i];
      const alpha = Math.round(smoothstep(100, 132, val) * 255);
      redRgba[i * 4] = redR;
      redRgba[i * 4 + 1] = redG;
      redRgba[i * 4 + 2] = redB;
      redRgba[i * 4 + 3] = alpha;
    }
  }

  const whitePng = await sharp(whiteRgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const redPng = await sharp(redRgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();

  // Composite: Red on top of White
  const hdEmblem = await sharp(whitePng)
    .composite([{ input: redPng, blend: 'over' }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('assets/designs/emblem_super_hd.png', hdEmblem);
  console.log('Generated emblem_super_hd.png! Size:', w, 'x', h);

  // Now generate the 1242 x 2688 Mobile Splash Screen using this 4K Super HD Emblem!
  const splashW = 1242;
  const splashH = 2688;

  // Hero emblem width on splash screen: 440px
  const splashEmblem = await sharp(hdEmblem)
    .resize(440, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 0.5 }) // Professional micro-sharpening
    .toBuffer();

  const meta = await sharp(splashEmblem).metadata();
  const emblemH = meta.height || 400;

  const emblemTop = Math.round(splashH * 0.44 - emblemH / 2);
  const emblemLeft = Math.round((splashW - 440) / 2);

  const glowSvg = `
    <svg width="${splashW}" height="${splashH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="subtleGlow" cx="50%" cy="44%" r="32%">
          <stop offset="0%" stop-color="#CE1141" stop-opacity="0.12"/>
          <stop offset="65%" stop-color="#CE1141" stop-opacity="0.01"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Pure OLED Black Base -->
      <rect width="${splashW}" height="${splashH}" fill="#000000"/>
      <!-- Ambient aura -->
      <rect width="${splashW}" height="${splashH}" fill="url(#subtleGlow)"/>

      <!-- Typography below emblem -->
      <text x="${splashW / 2}" y="${emblemTop + emblemH + 96}" text-anchor="middle"
            fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
            font-size="64" font-weight="900" letter-spacing="4">
        CLUTCHWIRE
      </text>

      <text x="${splashW / 2}" y="${emblemTop + emblemH + 162}" text-anchor="middle"
            fill="#CE1141" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
            font-size="26" font-weight="700" letter-spacing="10">
        HOUSTON ROCKETS
      </text>

      <text x="${splashW / 2}" y="${emblemTop + emblemH + 212}" text-anchor="middle"
            fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
            font-size="20" font-weight="500" letter-spacing="3">
        休斯敦火箭前沿资讯
      </text>

      <!-- Bottom footer -->
      <text x="${splashW / 2}" y="${splashH - 120}" text-anchor="middle"
            fill="#334155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            font-size="18" font-weight="600" letter-spacing="4">
        LIVE WIRE · STATS · ROSTER
      </text>
    </svg>
  `;

  const newSplash = await sharp(Buffer.from(glowSvg))
    .composite([{ input: splashEmblem, top: emblemTop, left: emblemLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('industry/brand/splash.png', newSplash);
  fs.writeFileSync('assets/designs/seamless_splash_hd.png', newSplash);
  console.log('Saved industry/brand/splash.png with Super HD razor-sharp emblem!');
}

main().catch(console.error);
