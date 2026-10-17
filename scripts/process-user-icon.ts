import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function main() {
  const srcPath = 'assets/designs/user_selected_icon.png';
  if (!fs.existsSync(srcPath)) {
    console.error('Source icon not found:', srcPath);
    return;
  }

  // 1. Analyze user_selected_icon.png
  // Image is 500x484. The squircle is roughly at left: 45, top: 65, size 400x400
  // Let's refine the exact crop box
  const crop = await sharp(srcPath)
    .extract({ left: 45, top: 65, width: 400, height: 400 })
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  // Create smooth squircle mask (rx=115 for iOS style 22.5% radius)
  const svgMask = Buffer.from(
    `<svg width="512" height="512">
      <rect x="0" y="0" width="512" height="512" rx="115" ry="115" fill="#ffffff"/>
    </svg>`
  );

  const squircleIcon = await sharp(crop)
    .composite([{ input: svgMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  fs.writeFileSync('assets/designs/masked_squircle.png', squircleIcon);
  console.log('Saved assets/designs/masked_squircle.png');

  // Also create full-bleed icon (with deep obsidian fill #101216 at corners so iOS squircle mask works natively)
  // Let's composite squircle on top of #101216 background
  const fullBleed = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 16, g: 18, b: 22, alpha: 1 }
    }
  })
    .composite([{ input: squircleIcon, top: 0, left: 0 }])
    .png()
    .toBuffer();

  fs.writeFileSync('assets/designs/user_selected_fullbleed.png', fullBleed);
  console.log('Saved assets/designs/user_selected_fullbleed.png');

  // Also create Mobile Splash Screen (1242 x 2688)
  const splashWidth = 1242;
  const splashHeight = 2688;
  const emblemSplashSize = 340;

  const splashEmblem = await sharp(squircleIcon)
    .resize(emblemSplashSize, emblemSplashSize, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const splashSvgText = `
    <svg width="${splashWidth}" height="${splashHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#CE1141" stop-opacity="0.18"/>
          <stop offset="50%" stop-color="#CE1141" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="#05070A" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Background glow -->
      <rect x="0" y="0" width="${splashWidth}" height="${splashHeight}" fill="url(#glow)"/>
      
      <!-- Typography below emblem -->
      <!-- Center Y for emblem is around 1080. Emblem is at top: 910 -->
      <text x="${splashWidth / 2}" y="1360" text-anchor="middle"
            fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
            font-size="64" font-weight="900" letter-spacing="4">
        CLUTCHWIRE
      </text>
      
      <text x="${splashWidth / 2}" y="1430" text-anchor="middle"
            fill="#CE1141" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
            font-size="28" font-weight="700" letter-spacing="10">
        HOUSTON ROCKETS
      </text>

      <text x="${splashWidth / 2}" y="1480" text-anchor="middle"
            fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
            font-size="22" font-weight="500" letter-spacing="3">
        休斯敦火箭前沿资讯
      </text>

      <!-- Bottom footer badge -->
      <text x="${splashWidth / 2}" y="2520" text-anchor="middle"
            fill="#334155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            font-size="20" font-weight="600" letter-spacing="4">
        LIVE WIRE · STATS · ROSTER
      </text>
    </svg>
  `;

  const splashBg = await sharp({
    create: {
      width: splashWidth,
      height: splashHeight,
      channels: 4,
      background: { r: 5, g: 7, b: 10, alpha: 1 }
    }
  })
    .composite([
      { input: Buffer.from(splashSvgText), top: 0, left: 0 },
      { input: splashEmblem, top: 910, left: Math.round((splashWidth - emblemSplashSize) / 2) }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('assets/designs/user_selected_splash.png', splashBg);
  console.log('Saved assets/designs/user_selected_splash.png');
}

main().catch(console.error);
