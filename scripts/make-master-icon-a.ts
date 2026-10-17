import sharp from 'sharp';

async function main() {
  // Extract the emblem without any artificial letterbox padding
  const emblem = await sharp('assets/designs/pure_flat_minimal.jpg')
    .extract({ left: 104, top: 252, width: 186, height: 218 })
    .resize(312, 366)
    .toBuffer();

  // Create an ultra-clean 512x512 canvas with squircle
  const squircleSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="1">
          <stop offset="0%" stop-color="#141822" />
          <stop offset="100%" stop-color="#0B0D13" />
        </linearGradient>
        <linearGradient id="rim" x1="0%" y1="0%" x2="0%" y2="1">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#bg)" />
      <rect x="3" y="3" width="506" height="506" rx="113" fill="none" stroke="url(#rim)" stroke-width="3" />
    </svg>
  `);

  await sharp(squircleSvg)
    .composite([
      { input: emblem, top: 73, left: 100 }
    ])
    .png()
    .toFile('assets/designs/option_a_master_icon.png');

  // Also create a mobile splash screen mockup for Option A (1242x2688)
  const splashEmblem = await sharp('assets/designs/pure_flat_minimal.jpg')
    .extract({ left: 104, top: 252, width: 186, height: 218 })
    .resize(410, 480)
    .toBuffer();

  const splashSvg = Buffer.from(`
    <svg width="1242" height="2688" viewBox="0 0 1242 2688" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="splashBg" x1="0%" y1="0%" x2="0%" y2="1">
          <stop offset="0%" stop-color="#141822" />
          <stop offset="35%" stop-color="#0A0C12" />
          <stop offset="100%" stop-color="#040507" />
        </linearGradient>
      </defs>
      <rect width="1242" height="2688" fill="url(#splashBg)" />
      <g text-anchor="middle">
        <text x="621" y="1480" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="64" font-weight="900" letter-spacing="8" fill="#FFFFFF">
          CLUTCH<tspan fill="#CE1141">WIRE</tspan>
        </text>
        <text x="621" y="1556" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', sans-serif" font-size="28" font-weight="600" letter-spacing="14" fill="#94A3B8">
          休斯敦火箭前沿情报站
        </text>
        <text x="621" y="2490" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-size="20" font-weight="600" letter-spacing="8" fill="#334155">
          HOUSTON ROCKETS INTEL
        </text>
      </g>
    </svg>
  `);

  await sharp(splashSvg)
    .composite([
      { input: splashEmblem, top: 880, left: 416 }
    ])
    .png()
    .toFile('assets/designs/option_a_mobile_splash.png');

  console.log('Clean master icon and mobile splash generated with zero letterboxing!');
}

main().catch(console.error);
