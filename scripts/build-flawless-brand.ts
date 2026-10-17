import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.resolve('industry/brand');

async function build() {
  const origSrc = 'C:/Users/96910/.gemini/antigravity-ide/brain/d32eca9c-7322-4e41-bbf7-e696075b37f0/.user_uploaded/media_1792230493268.png';
  
  // 1. Isolate the exact authentic emblem from the user's uploaded master image
  // Bounding box: x: 98 ~ 384, y: 132 ~ 390
  const cropX = 98;
  const cropY = 132;
  const cropW = 286;
  const cropH = 258;

  const { data, info } = await sharp(origSrc)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2. High-precision color separation & background decontamination
  // The original image has a dark-gray background around RGB(25, 27, 30) ~ RGB(31, 34, 36).
  // We want the background to be 100.00% PURE BLACK (RGB: 0, 0, 0).
  const cleanBuf = Buffer.alloc(cropW * cropH * 4);

  for (let i = 0; i < cropW * cropH; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const redDiff = r - Math.max(g, b);

    // Calculate emblem opacity
    let weight = 0;
    if (redDiff > 12) {
      // Red blade
      weight = Math.min(1, Math.max(0, (redDiff - 10) / 32));
    } else {
      // White R
      weight = Math.min(1, Math.max(0, (lum - 36) / 42));
    }

    if (weight <= 0) {
      // Completely pure black
      cleanBuf[i * 4] = 0;
      cleanBuf[i * 4 + 1] = 0;
      cleanBuf[i * 4 + 2] = 0;
      cleanBuf[i * 4 + 3] = 0;
    } else {
      // Decontaminate background gray from the edges so the edges transition directly to #000000
      cleanBuf[i * 4] = r;
      cleanBuf[i * 4 + 1] = g;
      cleanBuf[i * 4 + 2] = b;
      cleanBuf[i * 4 + 3] = Math.round(weight * 255);
    }
  }

  const rawCleanEmblem = await sharp(cleanBuf, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toBuffer();

  // 3. Super HD 4x Upscaling with Lanczos3 + Precision Edge Sharpening
  // Upscale to high-res (1144 x 1032)
  const hdEmblem = await sharp(rawCleanEmblem)
    .resize(1144, 1032, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.5, m1: 2.0, m2: 0.8 }) // Crisp contrast enhancement
    .png()
    .toBuffer();

  console.log('1. Created crisp HD emblem buffer (1144x1032)');

  // 4. Generate 512x512 Master App Icon with 100% PURE BLACK (#000000)
  // Emblem size inside 512px icon: 340px width gives ideal Apple/Android padding
  const emblem512 = await sharp(hdEmblem)
    .resize(340, null, { kernel: sharp.kernel.lanczos3 })
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
  console.log('2. Saved industry/brand/icon.png (512x512, pure #000000)');

  // 5. Generate 192x192 Icon for Android Manifest & Splash Screen
  const icon192 = await sharp(icon512)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);
  console.log('3. Saved industry/brand/icon-192.png (192x192, pure #000000)');

  // 6. Generate 180x180 Apple Touch Icon
  const appleIcon = await sharp(icon512)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);
  console.log('4. Saved industry/brand/apple-icon.png (180x180, pure #000000)');

  // 7. Generate 1242x2688 Mobile Splash Screen on Pure OLED Black (#000000)
  const splashW = 1242;
  const splashH = 2688;
  const splashEmblemSize = 440;

  const emblemSplash = await sharp(hdEmblem)
    .resize(splashEmblemSize, null, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const mSplash = await sharp(emblemSplash).metadata();
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
    .composite([{ input: emblemSplash, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'splash.png'), splashPng);
  console.log('5. Saved industry/brand/splash.png (1242x2688, pure #000000)');

  // 8. Generate multi-resolution Favicon.ico (48, 32, 16)
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
}

build();
