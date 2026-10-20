import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const BRAND_DIR = path.resolve('industry/brand');
const ARTIFACT_DIR = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c';

async function main() {
  const masterSvgPath = 'temp_master_emblem.svg';
  if (!fs.existsSync(masterSvgPath)) {
    throw new Error('Master SVG not found!');
  }
  const rawSvg = fs.readFileSync(masterSvgPath, 'utf8');

  // Exact mathematical center of the emblem elements
  const centerX = 740.5;
  const centerY = 780.5;

  // Infinite coverage black background rect
  const cleanSvg = rawSvg.replace(
    /<rect[^>]*fill="#000000"[^>]*\/>/,
    '<rect x="-5000" y="-5000" width="10000" height="10000" fill="#000000" />'
  );

  // 1. Generate Mobile Splash Screen (1242 x 2688) with 100% OLED Pure Black #000000
  const splashW = 1242;
  const splashH = 2688;
  const splashEmblemSize = 650;

  const splashBoxSize = 1140;
  const splashVbX = centerX - splashBoxSize / 2;
  const splashVbY = centerY - splashBoxSize / 2;

  const splashEmblemSvg = cleanSvg
    .replace(/viewBox="[^"]+"/, `viewBox="${splashVbX} ${splashVbY} ${splashBoxSize} ${splashBoxSize}"`)
    .replace(/width="[^"]+"/, `width="${splashEmblemSize}"`)
    .replace(/height="[^"]+"/, `height="${splashEmblemSize}"`);

  const renderedSplashEmblem = await sharp(Buffer.from(splashEmblemSvg))
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
    .composite([{ input: renderedSplashEmblem, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'splash.png'), splashPng);
  console.log('1. Saved industry/brand/splash.png (1242x2688, razor-sharp vector render, 100% OLED black, horizontally centered)');

  // 2. Generate Master App Icon (512x512) on 100% OLED Pure Black #000000
  // Centered viewBox with safe margins: emblem fits within 332px inside 512px
  const iconBoxSize = 1716;
  const iconVbX = centerX - iconBoxSize / 2;
  const iconVbY = centerY - iconBoxSize / 2;

  const iconSvg = cleanSvg
    .replace(/viewBox="[^"]+"/, `viewBox="${iconVbX} ${iconVbY} ${iconBoxSize} ${iconBoxSize}"`)
    .replace(/width="[^"]+"/, 'width="512"')
    .replace(/height="[^"]+"/, 'height="512"');

  const icon512Png = await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'icon.png'), icon512Png);
  console.log('2. Saved industry/brand/icon.png (512x512, razor-sharp vector render, perfectly centered)');

  // 3. Android PWA Icon (192x192)
  const icon192 = await sharp(icon512Png)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);
  console.log('3. Saved industry/brand/icon-192.png (192x192)');

  // 4. Apple Touch Icon (180x180)
  const appleIcon = await sharp(icon512Png)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);
  console.log('4. Saved industry/brand/apple-icon.png (180x180)');

  // 5. Favicon.ico
  const png48 = await sharp(icon512Png).resize(48, 48).png().toBuffer();
  const png32 = await sharp(icon512Png).resize(32, 32).png().toBuffer();
  const png16 = await sharp(icon512Png).resize(16, 16).png().toBuffer();

  const icoBuf = createMultiSizeIco([
    { size: 48, buffer: png48 },
    { size: 32, buffer: png32 },
    { size: 16, buffer: png16 }
  ]);
  fs.writeFileSync(path.join(BRAND_DIR, 'favicon.ico'), icoBuf);
  console.log('5. Saved industry/brand/favicon.ico');

  // 6. SVG Logo
  fs.writeFileSync(path.join(BRAND_DIR, 'logo.svg'), Buffer.from(iconSvg));
  console.log('6. Saved industry/brand/logo.svg (centered pure SVG vector)');

  // 7. Preview artifacts for the user
  // Mobile Splash Preview
  const splashPreview = await sharp(splashPng)
    .resize(360, 780, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_vector_splash.png'), splashPreview);

  // Splash Closeup
  const splashCloseup = await sharp(splashPng)
    .extract({ left: 240, top: 900, width: 760, height: 800 })
    .resize(400, null)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_vector_splash_closeup.png'), splashCloseup);

  // App Icon Masks
  const circleMask = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#fff"/></svg>');
  const squircleMask = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" rx="115" ry="115" fill="#fff"/></svg>');

  const circle512 = await sharp(icon512Png)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const circle256 = await sharp(circle512).resize(256, 256).png().toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_vector_circle.png'), circle256);

  const squircle512 = await sharp(icon512Png)
    .composite([{ input: squircleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const squircle256 = await sharp(squircle512).resize(256, 256).png().toBuffer();
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'preview_vector_squircle.png'), squircle256);

  console.log('All vector brand assets and previews created successfully!');
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
