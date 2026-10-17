import sharp from 'sharp';

export const svgOptionA3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Matte Obsidian Canvas -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#12151D" />
      <stop offset="100%" stop-color="#060709" />
    </linearGradient>

    <!-- Rockets Championship Red -->
    <linearGradient id="crimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF1744" />
      <stop offset="60%" stop-color="#CE1141" />
      <stop offset="100%" stop-color="#9E0024" />
    </linearGradient>

    <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="116" fill="url(#bg)" />
  <rect x="2" y="2" width="508" height="508" rx="114" fill="none" stroke="url(#rim)" stroke-width="2" />

  <!-- Bold, Muscular Dual-Blade 'R' -->
  <g transform="translate(10, 4)">
    <!-- 1. White Upper Top Bar / Beak (gives structural letterhead anchor) -->
    <path d="
      M 98, 148
      C 128, 142 164, 138 228, 138
      C 278, 138 314, 146 338, 162
      C 292, 178 226, 186 168, 186
      C 134, 186 112, 174 98, 148
      Z
    " fill="#FFFFFF" />

    <!-- 2. Master Red Aerodynamic Loop & Tail (Continuous Rocket Sweep) -->
    <path d="
      M 168, 138
      C 246, 138 386, 146 386, 236
      C 386, 304 332, 348 266, 362
      C 202, 376 138, 412 84, 452
      C 136, 408 196, 386 254, 386
      C 324, 386 376, 354 406, 306
      C 426, 274 432, 232 418, 196
      C 394, 132 312, 94 204, 94
      C 152, 94 116, 108 86, 134
      C 114, 136 142, 138 168, 138
      Z
    " fill="url(#crimson)" />

    <!-- 3. Lower White Kicking Thrust Blade (Right Leg) -->
    <path d="
      M 194, 252
      C 244, 252 296, 260 338, 300
      C 378, 338 412, 388 440, 436
      C 396, 414 362, 378 332, 346
      C 298, 310 262, 298 214, 298
      C 178, 298 144, 314 114, 340
      C 142, 288 168, 252 194, 252
      Z
    " fill="#FFFFFF" />
  </g>
</svg>`;

async function test() {
  const buf = Buffer.from(svgOptionA3);
  await sharp(buf).resize(512, 512).png().toFile('assets/designs/test_blades_r3.png');
  console.log('Generated test_blades_r3.png');
}

test();
