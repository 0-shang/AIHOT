import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function main() {
  const svg = fs.readFileSync('temp_master_emblem.svg', 'utf8');

  const centerX = 740.5;
  const centerY = 780.5;

  // Replace black rect with infinite coverage rect
  let cleanSvg = svg.replace(/<rect[^>]*fill="#000000"[^>]*\/>/, '<rect x="-5000" y="-5000" width="10000" height="10000" fill="#000000" />');

  // 1. Perfectly centered 512x512 Master Icon SVG
  const iconBoxSize = 1716;
  const iconVbX = centerX - iconBoxSize / 2;
  const iconVbY = centerY - iconBoxSize / 2;

  const iconSvg = cleanSvg
    .replace(/viewBox="[^"]+"/, `viewBox="${iconVbX} ${iconVbY} ${iconBoxSize} ${iconBoxSize}"`)
    .replace(/width="[^"]+"/, 'width="512"')
    .replace(/height="[^"]+"/, 'height="512"');

  const icon512Png = await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toBuffer();

  // Test with Android squircle mask
  const squircleMask = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" rx="115" ry="115" fill="#fff"/></svg>');
  const circleMask = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#fff"/></svg>');

  const squirclePng = await sharp(icon512Png)
    .composite([{ input: squircleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const circlePng = await sharp(icon512Png)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  fs.writeFileSync('temp_centered_squircle.png', squirclePng);
  fs.writeFileSync('temp_centered_circle.png', circlePng);

  // 2. Mobile Splash Screen (1242x2688)
  const splashW = 1242;
  const splashH = 2688;
  const splashEmblemSize = 650; // crisp vector render

  // We want the emblem inside splash to be centered horizontally
  // The emblem box is size 1140 x 1140 centered at (centerX, centerY)
  const splashBoxSize = 1140;
  const splashVbX = centerX - splashBoxSize / 2;
  const splashVbY = centerY - splashBoxSize / 2;

  const splashEmblemSvg = svg
    .replace(/viewBox="[^"]+"/, `viewBox="${splashVbX} ${splashVbY} ${splashBoxSize} ${splashBoxSize}"`)
    .replace(/width="[^"]+"/, `width="${splashEmblemSize}"`)
    .replace(/height="[^"]+"/, `height="${splashEmblemSize}"`);

  const splashEmblemPng = await sharp(Buffer.from(splashEmblemSvg))
    .resize(splashEmblemSize, splashEmblemSize)
    .png()
    .toBuffer();

  const splashTop = Math.round((splashH - splashEmblemSize) * 0.44);
  const splashLeft = Math.round((splashW - splashEmblemSize) / 2);

  const splashPng = await sharp({
    create: {
      width: splashW,
      height: splashH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: splashEmblemPng, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('temp_centered_splash.png', splashPng);

  // Verify splash horizontal centering
  const { data, info } = await sharp(splashPng).raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, maxX = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      if (data[idx] > 30 || data[idx+1] > 30 || data[idx+2] > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }

  console.log('Splash centering verification:');
  console.log({
    leftMargin: minX,
    rightMargin: splashW - 1 - maxX,
    centerX: (minX + maxX) / 2,
    canvasCenterX: splashW / 2
  });
}

main().catch(console.error);
