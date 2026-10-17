import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";

const BRAND_DIR = path.resolve("industry/brand");

// 1. Kinetic "R" Launch - Master SVG for App Icon, Logo, and Favicon (512x512)
export const masterIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Deep Obsidian / Stealth Space Slate -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#151923" />
      <stop offset="50%" stop-color="#0C0F16" />
      <stop offset="100%" stop-color="#05070A" />
    </linearGradient>

    <!-- Center Ambient Crimson Aura -->
    <radialGradient id="auraGlow" cx="50%" cy="46%" r="55%">
      <stop offset="0%" stop-color="#E11D48" stop-opacity="0.42" />
      <stop offset="55%" stop-color="#CE1141" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#CE1141" stop-opacity="0" />
    </radialGradient>

    <!-- Rockets Crimson - High Lit Gradient -->
    <linearGradient id="crimsonLit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2E55" />
      <stop offset="45%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#BA0C2F" />
    </linearGradient>

    <!-- Rockets Crimson - Deep Shaded Gradient -->
    <linearGradient id="crimsonShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#BA0C2F" />
      <stop offset="100%" stop-color="#6B0014" />
    </linearGradient>

    <!-- Titanium Chrome White -->
    <linearGradient id="titaniumLit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <linearGradient id="titaniumShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Exhaust Thrust Plume Gradient -->
    <linearGradient id="thrustPlume" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E11D48" stop-opacity="0" />
      <stop offset="35%" stop-color="#E11D48" stop-opacity="0.7" />
      <stop offset="75%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>

    <!-- Precision Ceramic Rim Highlight -->
    <linearGradient id="rimBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#E11D48" stop-opacity="0.35" />
    </linearGradient>

    <!-- Deep Drop Shadow -->
    <filter id="monogramShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000000" flood-opacity="0.85" />
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#800018" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Squircle App Canvas (iOS standard radius) -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />
  <!-- Radiant Core Glow -->
  <rect width="512" height="512" rx="116" fill="url(#auraGlow)" />
  <!-- Crisp Subtle Edge Rim -->
  <rect x="3" y="3" width="506" height="506" rx="113" fill="none" stroke="url(#rimBorder)" stroke-width="3" />

  <!-- Monogram Lockup with Multi-layer Depth -->
  <g filter="url(#monogramShadow)" transform="translate(6, 4)">

    <!-- LAYER 1: Base Athletic 'R' Chiseled Geometry -->
    <g id="letterR_Base">
      <!-- Left Vertical Stem - Clean Athletic Beveled Column -->
      <!-- Left Lit Facet -->
      <path d="M102,142 L128,112 L166,88 L166,416 L102,416 Z" fill="url(#crimsonLit)" />
      <!-- Right Shadow Facet -->
      <path d="M166,88 L206,114 L206,416 L166,416 Z" fill="url(#crimsonShadow)" />
      <!-- Top Left Chiseled Spur -->
      <polygon points="102,142 128,112 166,88 166,128 128,146 102,146" fill="#FF5C7F" />

      <!-- Top Loop of 'R' -->
      <!-- Main Upper Arc -->
      <path d="M166,88 L304,88 C374,88 416,130 416,198 C416,252 380,288 324,300 L206,300 L206,244 L312,244 C342,244 358,226 358,198 C358,166 336,144 294,144 L166,144 Z" fill="url(#crimsonLit)" />
      <!-- Top Loop Bevel Shadow -->
      <path d="M166,128 L294,128 C334,128 358,154 358,198 C358,212 352,224 340,234 L312,244 L206,244 L206,218 L296,218 C314,218 326,208 326,198 C326,182 314,170 292,170 L166,170 Z" fill="url(#crimsonShadow)" opacity="0.4" />

      <!-- Right Diagonal Leg of 'R' -->
      <!-- Right Shadow Leg -->
      <polygon points="262,284 326,284 424,416 356,416" fill="url(#crimsonShadow)" />
      <!-- Right Lit Highlight Stripe on Leg -->
      <polygon points="282,284 326,284 424,416 392,416" fill="url(#crimsonLit)" />
    </g>

    <!-- LAYER 2: Aerodynamic Tapered Speed Thrust Plume -->
    <!-- Sweeps dynamically from bottom-left to the rocket nozzle -->
    <path d="M136,412 C152,364 186,312 238,272 C270,248 304,222 334,196 L344,208 C314,234 278,262 248,288 C202,328 170,374 154,416 Z" fill="url(#thrustPlume)" />
    <!-- Radiant Inner White Thrust Stream -->
    <path d="M148,406 C166,356 200,308 248,272 C278,250 310,226 338,202 L344,210 C316,234 284,258 256,280 C212,316 182,360 166,408 Z" fill="#FFFFFF" opacity="0.95" />

    <!-- LAYER 3: Supersonic Rocket Launch Assembly (45° Upward-Right) -->
    <g transform="translate(348, 196) rotate(45)">
      <!-- Left Delta Wing -->
      <path d="M-18,36 L-56,76 C-59,80 -55,85 -50,84 L-16,74 Z" fill="url(#titaniumShadow)" />
      <!-- Right Delta Wing -->
      <path d="M18,36 L56,76 C59,80 55,85 50,84 L16,74 Z" fill="url(#titaniumLit)" />

      <!-- Fuselage Main Body: Aerodynamic Bullet Silhouette -->
      <!-- Left Shaded Half -->
      <path d="M0,-54 C-14,-14 -22,34 -22,76 L0,76 Z" fill="url(#titaniumShadow)" />
      <!-- Right Lit Half -->
      <path d="M0,-54 C14,-14 22,34 22,76 L0,76 Z" fill="url(#titaniumLit)" />

      <!-- High-Gloss Crimson Rocket Nose Cone -->
      <path d="M0,-54 C-5,-38 -10,-22 -12,-8 L12,-8 C10,-22 5,-38 0,-54 Z" fill="#E11D48" />
      <path d="M0,-54 C2,-42 6,-24 8,-8 L12,-8 C10,-22 5,-38 0,-54 Z" fill="#FF476B" />

      <!-- Dorsal Center Spine Fin -->
      <polygon points="0,-28 -2.5,70 2.5,70" fill="#FFFFFF" />

      <!-- Propulsion Exhaust Nozzle -->
      <path d="M-10,76 L-7,86 C-6,88 -3,90 0,90 C3,90 6,88 7,86 L10,76 Z" fill="#64748B" />

      <!-- Glowing White Rocket Exhaust Flame -->
      <polygon points="-7,88 0,116 7,88" fill="#FFFFFF" />
      <polygon points="-4,88 0,106 4,88" fill="#FF5277" />
    </g>
  </g>
</svg>`;

// 2. Full-Screen Mobile Launch Splash Screen (1242x2688 Retina Portrait)
export const masterSplashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1242 2688" width="1242" height="2688">
  <defs>
    <!-- OLED Obsidian Background Gradient -->
    <linearGradient id="splashBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0E1219" />
      <stop offset="35%" stop-color="#090B10" />
      <stop offset="70%" stop-color="#06070B" />
      <stop offset="100%" stop-color="#030406" />
    </linearGradient>

    <!-- Center Crimson Radiant Aura -->
    <radialGradient id="splashAura" cx="50%" cy="44%" r="42%">
      <stop offset="0%" stop-color="#E11D48" stop-opacity="0.38" />
      <stop offset="45%" stop-color="#CE1141" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#CE1141" stop-opacity="0" />
    </radialGradient>

    <!-- Rockets Crimson - High Lit Gradient -->
    <linearGradient id="crimsonLit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2E55" />
      <stop offset="45%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#BA0C2F" />
    </linearGradient>

    <!-- Rockets Crimson - Deep Shaded Gradient -->
    <linearGradient id="crimsonShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#BA0C2F" />
      <stop offset="100%" stop-color="#6B0014" />
    </linearGradient>

    <!-- Titanium Chrome White -->
    <linearGradient id="titaniumLit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <linearGradient id="titaniumShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Exhaust Thrust Plume Gradient -->
    <linearGradient id="thrustPlume" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E11D48" stop-opacity="0" />
      <stop offset="35%" stop-color="#E11D48" stop-opacity="0.7" />
      <stop offset="75%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>

    <!-- Deep Drop Shadow -->
    <filter id="splashShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000000" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#800018" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Full-bleed background -->
  <rect width="1242" height="2688" fill="url(#splashBg)" />
  <!-- Radiant Core Aura -->
  <rect width="1242" height="2688" fill="url(#splashAura)" />

  <!-- Center Emblem (Centered at x=621, y=1080, scale=0.88) -->
  <g transform="translate(621, 1060) scale(0.92) translate(-256, -256)" filter="url(#splashShadow)">
    <!-- Base Athletic 'R' Chiseled Geometry -->
    <g id="letterR_Base">
      <!-- Left Vertical Stem -->
      <path d="M102,142 L128,112 L166,88 L166,416 L102,416 Z" fill="url(#crimsonLit)" />
      <path d="M166,88 L206,114 L206,416 L166,416 Z" fill="url(#crimsonShadow)" />
      <polygon points="102,142 128,112 166,88 166,128 128,146 102,146" fill="#FF5C7F" />

      <!-- Top Loop of 'R' -->
      <path d="M166,88 L304,88 C374,88 416,130 416,198 C416,252 380,288 324,300 L206,300 L206,244 L312,244 C342,244 358,226 358,198 C358,166 336,144 294,144 L166,144 Z" fill="url(#crimsonLit)" />
      <path d="M166,128 L294,128 C334,128 358,154 358,198 C358,212 352,224 340,234 L312,244 L206,244 L206,218 L296,218 C314,218 326,208 326,198 C326,182 314,170 292,170 L166,170 Z" fill="url(#crimsonShadow)" opacity="0.4" />

      <!-- Right Diagonal Leg of 'R' -->
      <polygon points="262,284 326,284 424,416 356,416" fill="url(#crimsonShadow)" />
      <polygon points="282,284 326,284 424,416 392,416" fill="url(#crimsonLit)" />
    </g>

    <!-- Aerodynamic Thrust Plume -->
    <path d="M136,412 C152,364 186,312 238,272 C270,248 304,222 334,196 L344,208 C314,234 278,262 248,288 C202,328 170,374 154,416 Z" fill="url(#thrustPlume)" />
    <path d="M148,406 C166,356 200,308 248,272 C278,250 310,226 338,202 L344,210 C316,234 284,258 256,280 C212,316 182,360 166,408 Z" fill="#FFFFFF" opacity="0.95" />

    <!-- Supersonic Rocket Assembly (45° Upward-Right) -->
    <g transform="translate(348, 196) rotate(45)">
      <path d="M-18,36 L-56,76 C-59,80 -55,85 -50,84 L-16,74 Z" fill="url(#titaniumShadow)" />
      <path d="M18,36 L56,76 C59,80 55,85 50,84 L16,74 Z" fill="url(#titaniumLit)" />

      <!-- Fuselage -->
      <path d="M0,-54 C-14,-14 -22,34 -22,76 L0,76 Z" fill="url(#titaniumShadow)" />
      <path d="M0,-54 C14,-14 22,34 22,76 L0,76 Z" fill="url(#titaniumLit)" />

      <!-- Crimson Nose Tip -->
      <path d="M0,-54 C-5,-38 -10,-22 -12,-8 L12,-8 C10,-22 5,-38 0,-54 Z" fill="#E11D48" />
      <path d="M0,-54 C2,-42 6,-24 8,-8 L12,-8 C10,-22 5,-38 0,-54 Z" fill="#FF476B" />

      <!-- Dorsal Fin -->
      <polygon points="0,-28 -2.5,70 2.5,70" fill="#FFFFFF" />

      <!-- Engine -->
      <path d="M-10,76 L-7,86 C-6,88 -3,90 0,90 C3,90 6,88 7,86 L10,76 Z" fill="#64748B" />
      <polygon points="-7,88 0,116 7,88" fill="#FFFFFF" />
      <polygon points="-4,88 0,106 4,88" fill="#FF5277" />
    </g>
  </g>

  <!-- Typography Lockup -->
  <!-- Brand Wordmark -->
  <g text-anchor="middle">
    <!-- CLUTCHWIRE -->
    <text x="621" y="1420" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" font-size="64" font-weight="900" letter-spacing="6" fill="#FFFFFF">
      CLUTCH<tspan fill="#E11D48">WIRE</tspan>
    </text>
    <!-- Tagline: 休斯敦火箭前沿情报站 -->
    <text x="621" y="1496" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Hiragino Sans GB', sans-serif" font-size="28" font-weight="600" letter-spacing="14" fill="#94A3B8">
      休斯敦火箭前沿情报站
    </text>
  </g>

  <!-- Bottom Elegant Footer Stamp -->
  <g text-anchor="middle">
    <text x="621" y="2490" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-size="20" font-weight="600" letter-spacing="8" fill="#334155">
      HOUSTON ROCKETS INTEL
    </text>
  </g>
</svg>`;

async function main() {
  console.log("1. Writing master logo.svg to:", BRAND_DIR);
  writeFileSync(path.join(BRAND_DIR, "logo.svg"), masterIconSvg.trim() + "\n", "utf8");

  const iconBuffer = Buffer.from(masterIconSvg);

  // Generate 512x512 icon.png
  console.log("2. Generating icon.png (512x512)...");
  await sharp(iconBuffer)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "icon.png"));

  // Generate 192x192 icon-192.png
  console.log("3. Generating icon-192.png (192x192)...");
  await sharp(iconBuffer)
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "icon-192.png"));

  // Generate 180x180 apple-icon.png
  console.log("4. Generating apple-icon.png (180x180)...");
  await sharp(iconBuffer)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "apple-icon.png"));

  // Generate favicon.ico (multi-resolution 48, 32, 16)
  console.log("5. Generating favicon.ico...");
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

  // Generate mobile startup splash screen
  console.log("6. Generating mobile splash.png (1242x2688)...");
  const splashBuffer = Buffer.from(masterSplashSvg);
  await sharp(splashBuffer)
    .resize(1242, 2688)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "splash.png"));

  console.log("All brand icons and splash screen successfully generated!");
}

main().catch((err) => {
  console.error("Error generating brand icons:", err);
  process.exit(1);
});
