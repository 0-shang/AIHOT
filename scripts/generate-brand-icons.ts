import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

const BRAND_DIR = path.resolve("industry/brand");

async function main() {
  console.log("Generating brand assets from user-selected rocket 'R' emblem...");

  const squircleIconPath = path.resolve("assets/designs/masked_squircle.png");
  const fullBleedIconPath = path.resolve("assets/designs/user_selected_fullbleed.png");
  const splashPath = path.resolve("assets/designs/user_selected_splash.png");

  // 1. Load icon buffer
  const iconBuffer = readFileSync(squircleIconPath);
  const fullBleedBuffer = readFileSync(fullBleedIconPath);

  // Generate 512x512 icon.png
  console.log("1. Generating icon.png (512x512)...");
  await sharp(iconBuffer)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "icon.png"));

  // Generate 192x192 icon-192.png
  console.log("2. Generating icon-192.png (192x192)...");
  await sharp(iconBuffer)
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "icon-192.png"));

  // Generate 180x180 apple-icon.png (using fullbleed for iOS native mask)
  console.log("3. Generating apple-icon.png (180x180)...");
  await sharp(fullBleedBuffer)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "apple-icon.png"));

  // Generate favicon.ico (multi-resolution 48, 32, 16)
  console.log("4. Generating favicon.ico...");
  const png48 = await sharp(iconBuffer).resize(48, 48).png().toBuffer();
  const png32 = await sharp(iconBuffer).resize(32, 32).png().toBuffer();
  const png16 = await sharp(iconBuffer).resize(16, 16).png().toBuffer();

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
  writeFileSync(path.join(BRAND_DIR, "favicon.ico"), icoBuffer);

  // Generate logo.svg
  console.log("5. Generating logo.svg (512x512)...");
  const iconBase64 = iconBuffer.toString("base64");
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${iconBase64}" width="512" height="512" />
</svg>`;
  writeFileSync(path.join(BRAND_DIR, "logo.svg"), logoSvg, "utf-8");

  // Generate mobile startup splash screen (1242x2688)
  console.log("6. Generating mobile splash.png (1242x2688)...");
  await sharp(splashPath)
    .resize(1242, 2688)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "splash.png"));

  console.log("All brand icons and splash screen successfully generated!");
}

main().catch((err) => {
  console.error("Error generating brand icons:", err);
  process.exit(1);
});
