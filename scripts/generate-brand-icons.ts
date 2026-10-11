import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";

const BRAND_DIR = path.resolve("industry/brand");

// Fresh, Premium Houston Rockets Athletic Brand Logo & Icon
// Clean, high-end sports minimalism without dark AI cyber clutter.
// Bold contrast, elegant geometry for browser favicon (16-32px), mobile home screen (180px), and splash icon (512px).
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Premium Houston Rockets Championship Crimson Gradient -->
    <linearGradient id="brandBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D91642" />
      <stop offset="45%" stop-color="#BA0C2F" />
      <stop offset="100%" stop-color="#8C001C" />
    </linearGradient>

    <!-- Subtle Ceramic Glass Specular Top Highlight -->
    <linearGradient id="specularGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22" />
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Aero White Metallic Fuselage Gradient -->
    <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>

    <!-- Wing Shadow & Depth Gradient -->
    <linearGradient id="wingShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Speed Arc / Orbit Gradient -->
    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.35" />
    </linearGradient>

    <!-- Subtle Inner Border Highlight -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.08" />
    </linearGradient>

    <!-- Soft Drop Shadow for Depth -->
    <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#4A000E" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- iOS / Modern App Squircle Canvas -->
  <rect width="512" height="512" rx="116" fill="url(#brandBg)" />
  <rect width="512" height="512" rx="116" fill="url(#specularGlow)" />
  <rect x="4" y="4" width="504" height="504" rx="112" fill="none" stroke="url(#borderGrad)" stroke-width="4" />

  <!-- Dynamic Basketball Orbit & Kinetic Energy Arc -->
  <g filter="url(#softShadow)" transform="translate(0, -6)">
    <!-- Basketball Orbital Ring (Angle -35 deg) -->
    <g transform="rotate(-35 256 260)">
      <ellipse cx="256" cy="260" rx="195" ry="68" fill="none" stroke="url(#orbitGrad)" stroke-width="12" stroke-linecap="round" />
      <!-- Basketball Seam Notch -->
      <path d="M120 260 C120 240 392 240 392 260" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="3" stroke-dasharray="14 10" />
    </g>

    <!-- Kinetic Speed Stream / Thrust Vapour Trail -->
    <path d="M176 348 C160 372 138 402 120 424 C142 406 172 384 196 368 Z" fill="#FFFFFF" opacity="0.35" />
    <path d="M188 338 C158 376 126 422 108 448 C134 430 180 398 218 368 Z" fill="#FFFFFF" opacity="0.55" />

    <!-- Rocket Emblem Assembly (45° Upward Launch Angle) -->
    <g transform="rotate(45 256 248)">
      <!-- Left Delta Wing -->
      <path d="M228 200 L168 288 C164 294 170 302 178 300 L232 284 Z" fill="url(#wingShadow)" />
      <!-- Right Delta Wing -->
      <path d="M284 200 L344 288 C348 294 342 302 334 300 L280 284 Z" fill="url(#fuselageGrad)" />

      <!-- Main Aerodynamic Fuselage (Bullet Nose to Exhaust) -->
      <!-- Left Shaded Half -->
      <path d="M256 78 C242 124 232 200 232 292 L256 292 Z" fill="url(#wingShadow)" />
      <!-- Right Lit Half -->
      <path d="M256 78 C270 124 280 200 280 292 L256 292 Z" fill="url(#fuselageGrad)" />

      <!-- Center Racing Fin / Dorsal Spine -->
      <polygon points="256,108 252,284 260,284" fill="#FFFFFF" />

      <!-- Rockets Cardinal Red Nose Cone Tip -->
      <path d="M256 78 C250 96 244 116 242 132 L270 132 C268 116 262 96 256 78 Z" fill="#BA0C2F" />

      <!-- Rocket Porthole Window: Clean Basketball Badge -->
      <circle cx="256" cy="188" r="22" fill="#BA0C2F" stroke="#FFFFFF" stroke-width="4" />
      <line x1="234" y1="188" x2="278" y2="188" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
      <path d="M246 169 C251 180 251 196 246 207" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
      <path d="M266 169 C261 180 261 196 266 207" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />

      <!-- Propulsion Nozzle Base -->
      <path d="M240 292 L236 304 C235 307 238 310 242 310 L270 310 C274 310 277 307 276 304 L272 292 Z" fill="#94A3B8" />

      <!-- Modern Crisp Clean Exhaust Flare -->
      <path d="M244 312 C248 334 256 352 256 352 C256 352 264 334 268 312 Z" fill="#FFFFFF" opacity="0.95" />
    </g>
  </g>
</svg>`;

async function main() {
  console.log("Writing logo.svg...");
  writeFileSync(path.join(BRAND_DIR, "logo.svg"), svgContent.trim() + "\n", "utf8");

  const svgBuffer = Buffer.from(svgContent);

  // Generate 512x512 icon.png
  console.log("Generating icon.png (512x512)...");
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "icon.png"));

  // Generate 192x192 icon-192.png
  console.log("Generating icon-192.png (192x192)...");
  await sharp(svgBuffer)
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "icon-192.png"));

  // Generate 180x180 apple-icon.png
  console.log("Generating apple-icon.png (180x180)...");
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "apple-icon.png"));

  // Generate favicon.ico (ICO containing 48x48, 32x32, 16x16 PNG)
  console.log("Generating favicon.ico...");
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

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

  console.log("Brand icons successfully generated in:", BRAND_DIR);
}

main().catch((err) => {
  console.error("Error generating brand icons:", err);
  process.exit(1);
});
