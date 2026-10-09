import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";

const BRAND_DIR = path.resolve("industry/brand");

// Professional Houston Rockets themed Brand Logo & Icon
// Bold athletic silhouette, high contrast for browser tabs (16-32px) and mobile home screens (180-512px)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient: Deep Space Charcoal & Obsidian -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161B26" />
      <stop offset="100%" stop-color="#080A0F" />
    </linearGradient>

    <!-- Rockets Crimson Gradient -->
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ED174C" />
      <stop offset="100%" stop-color="#B30832" />
    </linearGradient>

    <!-- Rockets Deep Wine Shading -->
    <linearGradient id="darkRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9C0A2D" />
      <stop offset="100%" stop-color="#6E021C" />
    </linearGradient>

    <!-- Fire Exhaust Propulsion Gradient -->
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FFB703" />
      <stop offset="65%" stop-color="#FB5607" />
      <stop offset="100%" stop-color="#CE1141" />
    </linearGradient>

    <!-- Chrome / Aero White Fuselage -->
    <linearGradient id="aeroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EDF2F7" />
      <stop offset="45%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <!-- Ambient Crimson Energy Glow -->
    <radialGradient id="ambientGlow" cx="50%" cy="52%" r="48%">
      <stop offset="0%" stop-color="#CE1141" stop-opacity="0.4" />
      <stop offset="70%" stop-color="#CE1141" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#CE1141" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Squircle Base for App Icon & Favicon -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="496" height="496" rx="108" fill="none" stroke="#CE1141" stroke-width="3.5" stroke-opacity="0.35" />

  <!-- Ambient Energy Glow behind Rocket -->
  <circle cx="256" cy="265" r="190" fill="url(#ambientGlow)" />

  <!-- Basketball Trajectory Orbit Ring (Angle -24 deg) -->
  <g transform="rotate(-24 256 256)">
    <!-- Outer Orbit Ellipse -->
    <ellipse cx="256" cy="256" rx="205" ry="65" fill="none" stroke="#CE1141" stroke-width="9" stroke-dasharray="16 11" stroke-opacity="0.8" />
    <!-- Secondary Speed Arc -->
    <ellipse cx="256" cy="256" rx="180" ry="52" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-opacity="0.35" />
  </g>

  <!-- Exhaust Flare Blast Propulsion -->
  <!-- Outer Flame -->
  <path d="M256 322 C218 355 208 418 256 468 C304 418 294 355 256 322 Z" fill="url(#flameGrad)" />
  <!-- Inner Super-hot Flame (Intense White-Yellow Core) -->
  <path d="M256 338 C236 370 236 414 256 438 C276 414 276 370 256 338 Z" fill="#FFFDF0" />

  <!-- Left Booster Flame -->
  <path d="M190 348 C178 372 176 402 192 420 C202 402 204 372 190 348 Z" fill="url(#flameGrad)" opacity="0.9" />
  <!-- Right Booster Flame -->
  <path d="M322 348 C334 372 336 402 320 420 C310 402 308 372 322 348 Z" fill="url(#flameGrad)" opacity="0.9" />

  <!-- Rocket Body Assembly -->
  <!-- Left Wing Fin -->
  <path d="M202 250 L136 336 C134 341 138 348 145 348 L204 336 Z" fill="url(#redGrad)" />
  <path d="M136 336 L145 348 L204 336 L200 320 Z" fill="url(#darkRedGrad)" />

  <!-- Right Wing Fin -->
  <path d="M310 250 L376 336 C378 341 374 348 367 348 L308 336 Z" fill="url(#redGrad)" />
  <path d="M376 336 L367 348 L308 336 L312 320 Z" fill="url(#darkRedGrad)" />

  <!-- Rocket Fuselage (Main Body) -->
  <!-- Main Aero White Shell -->
  <path d="M256 62 C222 130 196 230 198 342 L314 342 C316 230 290 130 256 62 Z" fill="url(#aeroGrad)" />

  <!-- Left Shading / Dimensional Volume -->
  <path d="M256 62 C222 130 196 230 198 342 L224 342 C222 230 240 130 256 62 Z" fill="#CBD5E1" opacity="0.55" />

  <!-- Rockets Crimson Center Spine / Racing Stripe -->
  <path d="M256 62 C250 130 242 230 242 342 L270 342 C270 230 262 130 256 62 Z" fill="url(#redGrad)" />

  <!-- Rocket Nose Cone Cap (Sharp Arrowhead) -->
  <path d="M256 62 C246 88 236 122 234 146 L278 146 C276 122 266 88 256 62 Z" fill="url(#redGrad)" />

  <!-- Circular Porthole / Basketball Emblem Badge -->
  <circle cx="256" cy="214" r="32" fill="#10141E" stroke="#FFFFFF" stroke-width="4.5" />
  <!-- Basketball Seams in Porthole -->
  <line x1="225" y1="214" x2="287" y2="214" stroke="#ED174C" stroke-width="3.5" stroke-linecap="round" />
  <path d="M241 187 C248 202 248 226 241 241" fill="none" stroke="#ED174C" stroke-width="3.5" stroke-linecap="round" />
  <path d="M271 187 C264 202 264 226 271 241" fill="none" stroke="#ED174C" stroke-width="3.5" stroke-linecap="round" />

  <!-- Engine Nozzle Base -->
  <rect x="228" y="342" width="56" height="13" rx="4" fill="#64748B" />
  <rect x="236" y="351" width="40" height="8" rx="2" fill="#334155" />
  <!-- Side Booster Nozzles -->
  <rect x="182" y="340" width="20" height="9" rx="2.5" fill="#475569" />
  <rect x="310" y="340" width="20" height="9" rx="2.5" fill="#475569" />

  <!-- Houston Stars / Sparkles -->
  <path d="M396 115 Q396 132 413 132 Q396 132 396 149 Q396 132 379 132 Q396 132 396 115 Z" fill="#FFFFFF" opacity="0.95" />
  <path d="M116 175 Q116 186 127 186 Q116 186 116 197 Q116 186 105 186 Q116 186 116 175 Z" fill="#FFFFFF" opacity="0.8" />
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
