import sharp from 'sharp';
import fs from 'node:fs';

export const svgOptionA2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Pure Deep Stealth Black Canvas -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#11141C" />
      <stop offset="100%" stop-color="#050608" />
    </linearGradient>

    <!-- Houston Speed Red -->
    <linearGradient id="red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF1744" />
      <stop offset="100%" stop-color="#C4002F" />
    </linearGradient>

    <!-- Razor Edge Highlight -->
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="116" fill="url(#bg)" />
  <rect x="2" y="2" width="508" height="508" rx="114" fill="none" stroke="url(#border)" stroke-width="2" />

  <!-- Master Monogram Group: Razor Kinetic 'R' -->
  <g transform="translate(4, 2)">
    <!-- Primary Red Aerodynamic Arc -->
    <!-- Shapes the iconic top wing and sweeping thrust body -->
    <path d="
      M 112, 142
      C 152, 138 214, 136 282, 136
      C 374, 136 414, 178 414, 244
      C 414, 304 366, 344 296, 354
      C 232, 364 168, 396 118, 442
      C 156, 404 208, 384 262, 384
      C 328, 384 366, 356 388, 318
      C 406, 286 408, 250 398, 222
      C 382, 178 334, 158 274, 158
      C 218, 158 162, 164 112, 180
      Z
    " fill="url(#red)" />

    <!-- Pure White Aerodynamic Blade (Lower Leg & Negative Cut) -->
    <path d="
      M 184, 252
      C 226, 252 268, 258 304, 292
      C 346, 332 376, 386 412, 436
      C 374, 412 344, 374 316, 338
      C 288, 302 254, 288 212, 288
      C 172, 288 136, 306 108, 332
      C 134, 288 158, 252 184, 252
      Z
    " fill="#FFFFFF" />

    <!-- Left High-Speed Stabilizer Spine (Red & White Interlock) -->
    <path d="
      M 108, 154
      C 128, 186 138, 224 138, 268
      C 138, 324 122, 376 96, 416
      C 114, 376 122, 332 122, 288
      C 122, 236 114, 192 108, 154
      Z
    " fill="url(#red)" />
  </g>
</svg>`;

async function test() {
  const buf = Buffer.from(svgOptionA2);
  await sharp(buf).resize(512, 512).png().toFile('assets/designs/test_blades_r2.png');
  console.log('Generated test_blades_r2.png');
}

test();
