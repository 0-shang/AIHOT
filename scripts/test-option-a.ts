import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Precision SVG for Option A: Pure 2D Flat Aerodynamic Dual-Blade 'R'
export const svgOptionA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Matte Obsidian Space Canvas -->
    <linearGradient id="matteBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141822" />
      <stop offset="100%" stop-color="#07090D" />
    </linearGradient>

    <!-- Houston Rockets Championship Speed Red -->
    <linearGradient id="speedRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF1A48" />
      <stop offset="60%" stop-color="#CE1141" />
      <stop offset="100%" stop-color="#B30932" />
    </linearGradient>

    <!-- Titanium Crisp White -->
    <linearGradient id="crispWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#EDEDF0" />
    </linearGradient>

    <!-- Ultra-subtle Rim -->
    <linearGradient id="rimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02" />
    </linearGradient>
  </defs>

  <!-- iOS Standard Squircle Container -->
  <rect width="512" height="512" rx="116" fill="url(#matteBg)" />
  <rect x="2" y="2" width="508" height="508" rx="114" fill="none" stroke="url(#rimStroke)" stroke-width="2" />

  <!-- Dual-Blade Kinetic 'R' Emblem (Centered) -->
  <g id="bladesR" transform="translate(14, 0)">
    <!-- 1. Upper / Main Aerodynamic Red Blade (Forms the top arc and sweeping counter-curve) -->
    <!-- Starts at left top, arcs across top loop, dips into waist, and sweeps out to bottom-left spur -->
    <path d="
      M 96, 142
      C 134, 142 168, 148 226, 148
      C 304, 148 376, 172 376, 246
      C 376, 312 320, 348 244, 356
      C 184, 362 136, 396 92, 442
      C 134, 404 186, 380 236, 380
      C 302, 380 348, 350 382, 308
      C 414, 268 424, 218 408, 174
      C 388, 118 316, 96 226, 96
      C 168, 96 128, 106 96, 142
      Z
    " fill="url(#speedRed)" />

    <!-- 2. Lower / Supporting Titanium White Blade (Forms the core dynamic thrust leg) -->
    <!-- Sweeps from the inner waist down to the bottom right with high-speed tapering -->
    <path d="
      M 198, 268
      C 238, 268 280, 274 316, 314
      C 354, 356 386, 404 424, 436
      C 376, 416 338, 380 306, 346
      C 278, 314 246, 302 210, 302
      C 178, 302 152, 314 132, 334
      C 156, 300 174, 268 198, 268
      Z
    " fill="url(#crispWhite)" />
  </g>
</svg>`;

async function test() {
  const buf = Buffer.from(svgOptionA);
  await sharp(buf).resize(512, 512).png().toFile('assets/designs/test_blades_r.png');
  console.log('Generated test_blades_r.png');
}

test();
