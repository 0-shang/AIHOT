import sharp from 'sharp';

// Precise vector reconstruction of Crop Icon A
export const svgIconA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Dark Slate/Obsidian Background -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161B24" />
      <stop offset="100%" stop-color="#0B0E14" />
    </linearGradient>

    <!-- Houston Crimson Red -->
    <linearGradient id="houstonRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EE1B42" />
      <stop offset="100%" stop-color="#C0082E" />
    </linearGradient>

    <!-- Crisp White -->
    <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F3F5" />
    </linearGradient>

    <!-- Outer Rim Border -->
    <linearGradient id="outerRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.08" />
    </linearGradient>
  </defs>

  <!-- iOS Squircle Canvas -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />
  <rect x="3" y="3" width="506" height="506" rx="113" fill="none" stroke="url(#outerRim)" stroke-width="4" />

  <!-- The Master Dual-Blade R Emblem -->
  <g id="emblemR" transform="translate(4, -2)">
    <!-- 1. Upper-to-Bottom-Left Red Master Swoosh -->
    <!-- From top left spur -> top shoulder -> right belly -> down to bottom left tip -->
    <path d="
      M 86, 116
      C 178, 112 284, 116 352, 142
      C 424, 172 444, 238 418, 302
      C 392, 362 338, 396 264, 404
      C 192, 412 118, 478 84, 520
      C 114, 466 172, 424 234, 404
      C 300, 384 344, 344 366, 296
      C 388, 248 376, 204 330, 178
      C 278, 148 184, 144 104, 148
      Z
    " fill="url(#houstonRed)" transform="scale(0.86) translate(40, 42)" />

    <!-- 2. Inner White Upper Crescent (Nested inside the upper loop) -->
    <path d="
      M 104, 156
      C 180, 158 266, 170 310, 204
      C 342, 230 338, 276 304, 306
      C 328, 268 326, 234 296, 214
      C 256, 186 174, 174 104, 174
      Z
    " fill="url(#whiteGrad)" transform="scale(0.86) translate(40, 42)" />

    <!-- 3. Lower Right Leg Red Blade -->
    <path d="
      M 284, 366
      C 334, 396 386, 448 438, 514
      C 410, 474 368, 432 316, 404
      C 278, 384 250, 376 228, 374
      C 246, 370 266, 368 284, 366
      Z
    " fill="url(#houstonRed)" transform="scale(0.86) translate(40, 42)" />

    <!-- 4. Lower Right Leg White Blade (Nestled above the red lower blade) -->
    <path d="
      M 226, 390
      C 258, 396 302, 422 344, 464
      C 384, 502 414, 532 422, 538
      C 392, 510 346, 468 296, 440
      C 260, 420 236, 412 216, 410
      C 218, 402 222, 396 226, 390
      Z
    " fill="url(#whiteGrad)" transform="scale(0.86) translate(40, 42)" />
  </g>
</svg>`;

async function test() {
  const buf = Buffer.from(svgIconA);
  await sharp(buf).resize(512, 512).png().toFile('assets/designs/test_vector_a.png');
  console.log('Generated test_vector_a.png');
}

test();
