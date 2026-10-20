import fs from 'node:fs';
import sharp from 'sharp';

async function main() {
  let svg = fs.readFileSync('temp_master_emblem.svg', 'utf8');

  // Exact bounds measured in temp_master_emblem.svg:
  // minX: 184, maxX: 1297 -> width = 1113, centerX = 740.5
  // minY: 267, maxY: 1294 -> height = 1027, centerY = 780.5

  const centerX = 740.5;
  const centerY = 780.5;

  // For app icon (512x512):
  // We want the emblem to occupy ~65% of the icon (safe zone against circular/squircle masks),
  // which is ~332px inside 512px.
  // With emblem width = 1113, height = 1027:
  // Let the bounding box size S be such that 1113 / S = 332 / 512 => S = 1113 * 512 / 332 ≈ 1716.
  const iconBoxSize = 1716;
  const iconVbX = centerX - iconBoxSize / 2;
  const iconVbY = centerY - iconBoxSize / 2;

  const iconSvg = svg
    .replace(/viewBox="[^"]+"/, `viewBox="${iconVbX} ${iconVbY} ${iconBoxSize} ${iconBoxSize}"`)
    .replace(/width="[^"]+"/, 'width="512"')
    .replace(/height="[^"]+"/, 'height="512"');

  fs.writeFileSync('temp_icon_centered.svg', iconSvg);

  const iconPng = await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toBuffer();

  const { data, info } = await sharp(iconPng)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r > 30 || g > 30 || b > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Icon centering verification:');
  console.log({
    minX, maxX, minY, maxY,
    leftMargin: minX,
    rightMargin: 512 - 1 - maxX,
    topMargin: minY,
    bottomMargin: 512 - 1 - maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    canvasCenter: 256
  });
}

main().catch(console.error);
