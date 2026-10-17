import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.resolve('industry/brand');

async function main() {
  const emblemPath = 'assets/designs/emblem_super_hd.png';
  const emblemBuf = fs.readFileSync(emblemPath);

  // 1. Generate 512x512 Master App Icon with 100% pure OLED black (#000000) squircle
  // Icon canvas: 512x512
  // Emblem size: ~320px inside 512px gives ideal optical margin (Apple Human Interface Guidelines)
  const iconEmblem = await sharp(emblemBuf)
    .resize(320, null, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const iconMeta = await sharp(iconEmblem).metadata();
  const iconH = iconMeta.height || 320;
  const iconW = iconMeta.width || 320;

  // Squircle rounded rectangle (rx=115 for iOS squircle style) on transparent canvas
  const squircleBaseSvg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="iconGlow" cx="50%" cy="48%" r="48%">
          <stop offset="0%" stop-color="#CE1141" stop-opacity="0.16"/>
          <stop offset="65%" stop-color="#CE1141" stop-opacity="0.02"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Base Pure Black Squircle -->
      <rect width="512" height="512" rx="116" fill="#000000"/>
      <!-- Soft ambient aura -->
      <rect width="512" height="512" rx="116" fill="url(#iconGlow)"/>
    </svg>
  `;

  const masterSquircleIcon = await sharp(Buffer.from(squircleBaseSvg))
    .composite([
      {
        input: iconEmblem,
        top: Math.round((512 - iconH) / 2),
        left: Math.round((512 - iconW) / 2)
      }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Full-bleed for iOS apple-touch-icon (iOS automatically crops with its own squircle mask)
  const fullBleedSvg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="iconGlow2" cx="50%" cy="48%" r="48%">
          <stop offset="0%" stop-color="#CE1141" stop-opacity="0.16"/>
          <stop offset="65%" stop-color="#CE1141" stop-opacity="0.02"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="512" height="512" fill="#000000"/>
      <rect width="512" height="512" fill="url(#iconGlow2)"/>
    </svg>
  `;

  const masterFullBleedIcon = await sharp(Buffer.from(fullBleedSvg))
    .composite([
      {
        input: iconEmblem,
        top: Math.round((512 - iconH) / 2),
        left: Math.round((512 - iconW) / 2)
      }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Save to industry/brand
  fs.writeFileSync(path.join(BRAND_DIR, 'icon.png'), masterSquircleIcon);
  
  const icon192 = await sharp(masterSquircleIcon).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(BRAND_DIR, 'icon-192.png'), icon192);

  const appleIcon = await sharp(masterFullBleedIcon).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(BRAND_DIR, 'apple-icon.png'), appleIcon);

  // Favicon.ico
  const png48 = await sharp(masterSquircleIcon).resize(48, 48).png().toBuffer();
  const png32 = await sharp(masterSquircleIcon).resize(32, 32).png().toBuffer();
  const png16 = await sharp(masterSquircleIcon).resize(16, 16).png().toBuffer();

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
  const entries: Buffer[] = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
  fs.writeFileSync(path.join(BRAND_DIR, 'favicon.ico'), icoBuffer);

  // logo.svg
  const iconBase64 = masterSquircleIcon.toString('base64');
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${iconBase64}" width="512" height="512" />
</svg>`;
  fs.writeFileSync(path.join(BRAND_DIR, 'logo.svg'), logoSvg, 'utf-8');

  console.log('All brand icons updated with pure seamless OLED black (#000000)!');
}

main().catch(console.error);
