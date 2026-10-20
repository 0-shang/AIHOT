import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.resolve('industry/brand');
const ARTIFACT_DIR = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c';

async function main() {
  const squirclePath = 'assets/designs/masked_squircle.png';
  if (!fs.existsSync(squirclePath)) {
    throw new Error('Squircle icon not found: ' + squirclePath);
  }

  // Load the authentic original squircle icon (exact match to user screenshot)
  const squircleBuf = fs.readFileSync(squirclePath);

  // Sharpen with fine unsharp mask to boost clarity and eliminate any blur
  const sharpSquircle = await sharp(squircleBuf)
    .sharpen({ sigma: 1.2, m1: 2.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // 1. Master App Icon (512x512)
  const icon512 = await sharp(sharpSquircle)
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon.png'), icon512);
  console.log('1. Saved industry/brand/icon.png (512x512)');

  // 2. Android PWA Icon (192x192)
  const icon192 = await sharp(sharpSquircle)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);
  console.log('2. Saved industry/brand/icon-192.png (192x192)');

  // 3. Apple Touch Icon (180x180)
  const appleIcon = await sharp(sharpSquircle)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);
  console.log('3. Saved industry/brand/apple-icon.png (180x180)');

  // 4. Mobile Splash Screen (1242x2688) with pure OLED Black background and centered squircle icon
  // Exactly matching the user's screenshot!
  const splashSize = 400;
  const splashSquircle = await sharp(sharpSquircle)
    .resize(splashSize, splashSize, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const splashTop = Math.round((2688 - splashSize) * 0.44);
  const splashLeft = Math.round((1242 - splashSize) / 2);

  const splashPng = await sharp({
    create: {
      width: 1242,
      height: 2688,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: splashSquircle, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'splash.png'), splashPng);
  console.log('4. Saved industry/brand/splash.png (1242x2688)');

  // 5. Favicon.ico
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

  // 6. Generate preview files for artifact
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_clean_squircle.png'), icon512);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_clean_splash.png'), splashPng);

  console.log('Done! All assets generated strictly matching user screenshot.');
}

main().catch(console.error);
