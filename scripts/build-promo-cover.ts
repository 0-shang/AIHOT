import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ARTIFACT_DIR = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c';

async function main() {
  const W = 1080;
  const H = 1920;

  // Read screenshots
  const homeShotPath = path.join(ARTIFACT_DIR, 'mobile_feed_scrolled_1792516156301.png');
  const iconPath = path.resolve('industry/brand/icon.png');

  // Resize icon for badge
  const iconBuf = await sharp(iconPath).resize(120, 120).png().toBuffer();

  // Resize phone screen content: 540 x 1150
  const phoneW = 540;
  const phoneH = 1150;
  const screenBuf = await sharp(homeShotPath)
    .resize(phoneW, phoneH, { fit: 'cover' })
    .png()
    .toBuffer();

  // Make phone container with border & rounded corners
  const phoneMask = Buffer.from(`
    <svg width="${phoneW}" height="${phoneH}">
      <rect width="${phoneW}" height="${phoneH}" rx="40" ry="40" fill="#fff"/>
    </svg>
  `);

  const phoneRounded = await sharp(screenBuf)
    .composite([{ input: phoneMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Phone frame with glowing stroke
  const phoneFrame = Buffer.from(`
    <svg width="${phoneW + 16}" height="${phoneH + 16}">
      <rect x="8" y="8" width="${phoneW}" height="${phoneH}" rx="40" ry="40" fill="none" stroke="#CE1141" stroke-width="4" opacity="0.8"/>
      <rect x="6" y="6" width="${phoneW + 4}" height="${phoneH + 4}" rx="42" ry="42" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
    </svg>
  `);

  // Phone composite
  const phoneComp = await sharp({
    create: {
      width: phoneW + 16,
      height: phoneH + 16,
      channels: 4,
      background: { r: 10, g: 10, b: 12, alpha: 1 }
    }
  })
    .composite([
      { input: phoneRounded, left: 8, top: 8 },
      { input: phoneFrame, left: 0, top: 0 }
    ])
    .png()
    .toBuffer();

  // Background SVG with gradient and bold typography
  const bgSvg = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#3d0a14" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#140608" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#050505" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#CE1141"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bgGlow)"/>

      <!-- Header Tag -->
      <rect x="360" y="90" width="360" height="48" rx="24" fill="#CE1141" fill-opacity="0.2" stroke="#CE1141" stroke-width="1.5"/>
      <text x="540" y="122" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#FF4D6D" text-anchor="middle" letter-spacing="2">休斯敦火箭专属情报站</text>

      <!-- Main Headline -->
      <text x="540" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">看球不被营销号忽悠</text>
      <text x="540" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="url(#textGrad)" text-anchor="middle" letter-spacing="1">随队名记一手动态秒同步</text>

      <!-- Features Tag Bar -->
      <g transform="translate(140, 335)">
        <rect x="0" y="0" width="240" height="42" rx="21" fill="#1e1e24" stroke="#333" stroke-width="1"/>
        <text x="120" y="28" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#ddd" text-anchor="middle">⚡ 随队名记推文</text>

        <rect x="270" y="0" width="240" height="42" rx="21" fill="#1e1e24" stroke="#333" stroke-width="1"/>
        <text x="390" y="28" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#ddd" text-anchor="middle">📖 战术深度专栏</text>

        <rect x="540" y="0" width="260" height="42" rx="21" fill="#1e1e24" stroke="#333" stroke-width="1"/>
        <text x="670" y="28" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#ddd" text-anchor="middle">🚫 纯净零广告干货</text>
      </g>

      <!-- Bottom Domain Banner -->
      <rect x="140" y="1720" width="800" height="110" rx="30" fill="#18181c" stroke="#CE1141" stroke-width="2"/>
      <text x="540" y="1768" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="#aaa" text-anchor="middle">手机浏览器访问并添加到主屏幕</text>
      <text x="540" y="1808" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">clutchwire.org</text>
    </svg>
  `);

  const poster = await sharp(bgSvg)
    .composite([
      { input: phoneComp, left: Math.round((W - (phoneW + 16)) / 2), top: 460 },
      { input: iconBuf, left: 160, top: 1715 }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  const outPath = path.join(ARTIFACT_DIR, 'clutchwire_promo_cover.png');
  fs.writeFileSync(outPath, poster);
  console.log('Cover saved to', outPath);
}

main().catch(console.error);
