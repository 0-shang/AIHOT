import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.resolve('industry/brand');
const ARTIFACT_DIR = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c';

async function main() {
  const origSrc = 'assets/designs/user_selected_icon.png';
  if (!fs.existsSync(origSrc)) {
    throw new Error('Source icon not found: ' + origSrc);
  }

  // 1. Isolate the exact authentic original emblem
  const cropX = 98;
  const cropY = 132;
  const cropW = 286;
  const cropH = 258;

  const { data, info } = await sharp(origSrc)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2. High-precision background decontamination:
  // Convert any dark gray / squircle background pixels (around RGB 25~36) to 100% transparent.
  // The emblem pixels (white and red) keep their exact colors with smooth anti-aliased alpha.
  const cleanBuf = Buffer.alloc(cropW * cropH * 4);

  for (let i = 0; i < cropW * cropH; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const redDiff = r - Math.max(g, b);

    let weight = 0;
    if (redDiff > 12) {
      // Red ribbon
      weight = Math.min(1, Math.max(0, (redDiff - 10) / 30));
    } else {
      // White R
      weight = Math.min(1, Math.max(0, (lum - 36) / 40));
    }

    if (weight <= 0) {
      // Completely transparent / pure black
      cleanBuf[i * 4] = 0;
      cleanBuf[i * 4 + 1] = 0;
      cleanBuf[i * 4 + 2] = 0;
      cleanBuf[i * 4 + 3] = 0;
    } else {
      cleanBuf[i * 4] = r;
      cleanBuf[i * 4 + 1] = g;
      cleanBuf[i * 4 + 2] = b;
      cleanBuf[i * 4 + 3] = Math.round(weight * 255);
    }
  }

  const rawCleanEmblem = await sharp(cleanBuf, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toBuffer();

  // 3. Super HD 4x Upscaling with Lanczos3 + Crisp edge enhancement
  const hdEmblem = await sharp(rawCleanEmblem)
    .resize(1144, 1032, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.2, m1: 1.8, m2: 0.6 })
    .png()
    .toBuffer();

  console.log('1. Generated seamless HD authentic emblem (1144x1032)');

  // 4. Generate Mobile Splash Screen (1242x2688) with 100% OLED Pure Black (#000000)
  // Absolutely NO squircle container! The emblem floats directly on pure #000000 black!
  const splashW = 1242;
  const splashH = 2688;
  const splashEmblemSize = 460;

  const splashEmblem = await sharp(hdEmblem)
    .resize(splashEmblemSize, null, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const mSplash = await sharp(splashEmblem).metadata();
  const splashTop = Math.round((splashH - mSplash.height!) * 0.44);
  const splashLeft = Math.round((splashW - mSplash.width!) / 2);

  const splashPng = await sharp({
    create: {
      width: splashW,
      height: splashH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: splashEmblem, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'splash.png'), splashPng);
  console.log('2. Saved industry/brand/splash.png (1242x2688, 100% seamless OLED black, no squircle box)');

  // 5. Generate Master App Icon (512x512) on 100% OLED Pure Black (#000000)
  // With 64.5% safe zone padding (emblem width 330px inside 512px)
  // This guarantees seamless pure black background and zero clipping on phone launcher
  const emblem512 = await sharp(hdEmblem)
    .resize(330, null, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const m512 = await sharp(emblem512).metadata();
  const top512 = Math.round((512 - m512.height!) / 2);
  const left512 = Math.round((512 - m512.width!) / 2);

  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: emblem512, top: top512, left: left512 }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon.png'), icon512);
  console.log('3. Saved industry/brand/icon.png (512x512, pure #000000, safe margin)');

  // 6. Android PWA Icon (192x192)
  const icon192 = await sharp(icon512)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);
  console.log('4. Saved industry/brand/icon-192.png (192x192)');

  // 7. Apple Touch Icon (180x180)
  const appleIcon = await sharp(icon512)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);
  console.log('5. Saved industry/brand/apple-icon.png (180x180)');

  // 8. Favicon.ico
  const png48 = await sharp(icon512).resize(48, 48).sharpen().png().toBuffer();
  const png32 = await sharp(icon512).resize(32, 32).sharpen().png().toBuffer();
  const png16 = await sharp(icon512).resize(16, 16).sharpen().png().toBuffer();

  const images = [
    { width: 48, height: 48, buffer: png48 },
    { width: 32, height: 32, buffer: png32 },
    { width: 16, height: 16, buffer: png16 },
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const dirBuffers: Buffer[] = [];
  const imgBuffers: Buffer[] = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirBuffers.push(entry);
    imgBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  const icoBuf = Buffer.concat([header, ...dirBuffers, ...imgBuffers]);
  fs.writeFileSync(path.join(BRAND_DIR, 'favicon.ico'), icoBuf);
  console.log('6. Saved industry/brand/favicon.ico');

  // 9. Generate preview files for Artifact
  const squircleMask = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" rx="115" fill="#ffffff"/></svg>');
  const circleMask = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="230" fill="#ffffff"/></svg>');

  const squircleIcon = await sharp(icon512).composite([{ input: squircleMask, blend: 'dest-in' }]).png().toBuffer();
  const circleIcon = await sharp(icon512).composite([{ input: circleMask, blend: 'dest-in' }]).png().toBuffer();

  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_seamless_splash.png'), splashPng);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_seamless_icon_squircle.png'), squircleIcon);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_seamless_icon_circle.png'), circleIcon);

  console.log('7. Generated preview_seamless_splash.png and icons in artifact directory!');
}

main().catch(console.error);
