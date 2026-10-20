import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import cv2 from 'node:child_process';

const BRAND_DIR = path.resolve('industry/brand');
const ARTIFACT_DIR = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c';

async function main() {
  // First, verify python script make-pristine-brand.py ran and generated master files:
  if (!fs.existsSync('temp_pristine_splash.png') || !fs.existsSync('temp_pristine_icon512.png')) {
    throw new Error('Master pristine files not found!');
  }

  // 1. Copy splash.png (1242x2688)
  const splashBuf = fs.readFileSync('temp_pristine_splash.png');
  fs.writeFileSync(path.join(BRAND_DIR, 'splash.png'), splashBuf);
  console.log('1. Saved industry/brand/splash.png (1242x2688, seamless pure OLED black, razor-sharp HD emblem)');

  // 2. Save icon.png (512x512)
  const icon512Buf = fs.readFileSync('temp_pristine_icon512.png');
  fs.writeFileSync(path.join(BRAND_DIR, 'icon.png'), icon512Buf);
  console.log('2. Saved industry/brand/icon.png (512x512, pure #000000, safe-zone padded)');

  // 3. Android PWA Icon (192x192)
  const icon192 = await sharp(icon512Buf)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);
  console.log('3. Saved industry/brand/icon-192.png (192x192)');

  // 4. Apple Touch Icon (180x180)
  const appleIcon = await sharp(icon512Buf)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);
  console.log('4. Saved industry/brand/apple-icon.png (180x180)');

  // 5. Favicon.ico
  const png48 = await sharp(icon512Buf).resize(48, 48).sharpen().png().toBuffer();
  const png32 = await sharp(icon512Buf).resize(32, 32).sharpen().png().toBuffer();
  const png16 = await sharp(icon512Buf).resize(16, 16).sharpen().png().toBuffer();

  const icoBuf = createMultiSizeIco([
    { size: 48, buffer: png48 },
    { size: 32, buffer: png32 },
    { size: 16, buffer: png16 }
  ]);

  fs.writeFileSync(path.join(BRAND_DIR, 'favicon.ico'), icoBuf);
  console.log('5. Saved industry/brand/favicon.ico');

  // 6. SVG wrapper
  const b64 = icon512Buf.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${b64}" width="512" height="512" />
</svg>`;
  fs.writeFileSync(path.join(BRAND_DIR, 'logo.svg'), svgContent, 'utf8');
  console.log('6. Saved industry/brand/logo.svg');

  // 7. Generate preview artifacts for user review
  // Mobile Splash Preview (phone mock frame)
  const splashPreview = await sharp(splashBuf)
    .resize(360, 780, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_pristine_splash.png'), splashPreview);

  // App Icon Masks
  const circleMask = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#fff"/></svg>');
  const squircleMask = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" rx="115" ry="115" fill="#fff"/></svg>');

  const circle512 = await sharp(icon512Buf)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const circle256 = await sharp(circle512).resize(256, 256).png().toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_pristine_circle.png'), circle256);

  const squircle512 = await sharp(icon512Buf)
    .composite([{ input: squircleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const squircle256 = await sharp(squircle512).resize(256, 256).png().toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_pristine_squircle.png'), squircle256);

  // Close-up crop of the splash screen emblem
  const splashCrop = await sharp(splashBuf)
    .extract({ left: 300, top: 1000, width: 642, height: 750 })
    .resize(400, null)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_pristine_splash_closeup.png'), splashCrop);

  console.log('All brand assets and preview artifacts generated successfully!');
}

function createMultiSizeIco(images: { size: number; buffer: Buffer }[]): Buffer {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries: Buffer[] = [];
  const imageBuffers: Buffer[] = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

main().catch(console.error);
