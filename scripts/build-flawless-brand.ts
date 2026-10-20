import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.resolve('industry/brand');

async function build() {
  const masterSrc = 'C:/Users/96910/.gemini/antigravity-ide/brain/ef2c7ac5-0df2-4ff2-90ea-b56fda83b591/hd_emblem_preview_1792492512500.jpg';
  
  console.log('Loading 4K HD master emblem...');
  const { data, info } = await sharp(masterSrc)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;

  // Ensure absolute OLED pure black (#000000) for background pixels
  const cleanedBuf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // If lum is very dark, snap to pure black [0, 0, 0, 255]
    if (lum < 15 && Math.max(r, g, b) < 22) {
      cleanedBuf[i * 4] = 0;
      cleanedBuf[i * 4 + 1] = 0;
      cleanedBuf[i * 4 + 2] = 0;
      cleanedBuf[i * 4 + 3] = 255;
    } else {
      cleanedBuf[i * 4] = r;
      cleanedBuf[i * 4 + 1] = g;
      cleanedBuf[i * 4 + 2] = b;
      cleanedBuf[i * 4 + 3] = 255;
    }
  }

  const cleanMasterPng = await sharp(cleanedBuf, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // 1. Generate 512x512 Master App Icon
  const icon512 = await sharp(cleanMasterPng)
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon.png'), icon512);
  console.log('1. Saved industry/brand/icon.png (512x512)');

  // 2. Generate 192x192 Android PWA Icon
  const icon192 = await sharp(cleanMasterPng)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);
  console.log('2. Saved industry/brand/icon-192.png (192x192)');

  // 3. Generate 180x180 Apple Touch Icon
  const appleIcon = await sharp(cleanMasterPng)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);
  console.log('3. Saved industry/brand/apple-icon.png (180x180)');

  // 4. Generate 1242x2688 Mobile Splash Screen on Pure OLED Black (#000000)
  const splashW = 1242;
  const splashH = 2688;
  const splashEmblemSize = 520; // Crisp, generous display size

  const emblemSplash = await sharp(cleanMasterPng)
    .resize(splashEmblemSize, splashEmblemSize, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
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
    .composite([{ input: emblemSplash, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'splash.png'), splashPng);
  console.log('4. Saved industry/brand/splash.png (1242x2688, pure #000000)');

  // 5. Generate Multi-resolution Favicon.ico (48, 32, 16)
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
  console.log('5. Saved industry/brand/favicon.ico');

  // 6. Generate logo.svg
  const base64Png = icon512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${base64Png}" width="512" height="512" />
</svg>`;
  fs.writeFileSync(path.join(BRAND_DIR, 'logo.svg'), svgContent, 'utf8');
  console.log('6. Saved industry/brand/logo.svg');

  console.log('All brand assets successfully built with 4K clarity!');
}

build().catch(console.error);
