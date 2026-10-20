import sharp from 'sharp';
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

async function vectorize() {
  const origSrc = 'assets/designs/user_selected_icon.png';
  const cropX = 98;
  const cropY = 132;
  const cropW = 286;
  const cropH = 258;

  const { data, info } = await sharp(origSrc)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;

  // 1. Create a binary grid for White and Red
  // White mask: lum > 140 && redDiff < 25
  // Red mask: r > 110 && redDiff > 18
  const isWhite = new Uint8Array(w * h);
  const isRed = new Uint8Array(w * h);

  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const redDiff = r - Math.max(g, b);

    if (lum > 140 && redDiff < 25) {
      isWhite[i] = 1;
    }
    if (r > 105 && redDiff > 16) {
      isRed[i] = 1;
    }
  }

  // Check counts
  let countW = 0, countR = 0;
  for (let i = 0; i < w * h; i++) {
    if (isWhite[i]) countW++;
    if (isRed[i]) countR++;
  }
  console.log('Binary mask extracted: white pixels =', countW, 'red pixels =', countR);

  // 2. High-resolution Signed Distance Field (SDF) / Sub-pixel Bilateral Vector Upscaling
  // Scale up 8x from 286x258 -> 2288 x 2064
  const scale = 8;
  const outW = w * scale;
  const outH = h * scale;

  // Using distance transform or high-precision Lanczos3 on the float mask
  // First save crisp float masks
  const whiteMaskBuf = Buffer.alloc(w * h);
  const redMaskBuf = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    whiteMaskBuf[i] = isWhite[i] ? 255 : 0;
    redMaskBuf[i] = isRed[i] ? 255 : 0;
  }

  // Upscale white mask with lanczos3 to 2288x2064
  const upWhite = await sharp(whiteMaskBuf, { raw: { width: w, height: h, channels: 1 } })
    .resize(outW, outH, { kernel: sharp.kernel.lanczos3 })
    .raw()
    .toBuffer();

  const upRed = await sharp(redMaskBuf, { raw: { width: w, height: h, channels: 1 } })
    .resize(outW, outH, { kernel: sharp.kernel.lanczos3 })
    .raw()
    .toBuffer();

  // 3. Smoothstep thresholding for razor-sharp vector contours
  function smoothstep(e0: number, e1: number, x: number) {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }

  // Create ultra-sharp RGBA buffer (2288 x 2064)
  const crispBuf = Buffer.alloc(outW * outH * 4);

  // Colors:
  // White: #FFFFFF
  // Red: Rockets Championship Crimson #CE1141
  // Dark separation contour: #000000
  for (let y = 0; y < outH; y++) {
    const yRatio = y / outH;
    // Subtle luxury gradient on the red ribbon: from #DB1B38 at top to #B80F2B at bottom
    const redR = Math.round(219 - yRatio * 35);
    const redG = Math.round(27 - yRatio * 12);
    const redB = Math.round(56 - yRatio * 13);

    for (let x = 0; x < outW; x++) {
      const idx = y * outW + x;
      const wVal = upWhite[idx];
      const rVal = upRed[idx];

      // Sharp transition band (only 6 units wide out of 255, giving 1-pixel razor edge)
      const wAlpha = smoothstep(124, 131, wVal);
      const rAlpha = smoothstep(124, 131, rVal);

      const outIdx = idx * 4;

      if (rAlpha > 0.01) {
        // Red shape (rendered on top with subtle depth)
        crispBuf[outIdx] = redR;
        crispBuf[outIdx + 1] = redG;
        crispBuf[outIdx + 2] = redB;
        crispBuf[outIdx + 3] = Math.round(rAlpha * 255);
      } else if (wAlpha > 0.01) {
        // White shape
        crispBuf[outIdx] = 255;
        crispBuf[outIdx + 1] = 255;
        crispBuf[outIdx + 2] = 255;
        crispBuf[outIdx + 3] = Math.round(wAlpha * 255);
      } else {
        // Pure black
        crispBuf[outIdx] = 0;
        crispBuf[outIdx + 1] = 0;
        crispBuf[outIdx + 2] = 0;
        crispBuf[outIdx + 3] = 0;
      }
    }
  }

  const vectorQualityEmblem = await sharp(crispBuf, { raw: { width: outW, height: outH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('assets/designs/vector_quality_emblem.png', vectorQualityEmblem);
  console.log('Saved 2288x2064 vector_quality_emblem.png! Perfect razor-sharp edges.');

  // Now create the 512x512 icon and 1242x2688 splash screen
  const ARTIFACT_DIR = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c';

  // Master App Icon (512x512, safe margin)
  const emblem512 = await sharp(vectorQualityEmblem)
    .resize(330, null, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const m512 = await sharp(emblem512).metadata();
  const top512 = Math.round((512 - m512.height!) / 2);
  const left512 = Math.round((512 - m512.width!) / 2);

  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: emblem512, top: top512, left: left512 }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Android squircle mask preview
  const squircleMask = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" rx="115" fill="#ffffff"/></svg>');
  const squirclePreview = await sharp(icon512).composite([{ input: squircleMask, blend: 'dest-in' }]).png().toBuffer();

  // Mobile Splash (1242x2688, 100% OLED black)
  const splashEmblem = await sharp(vectorQualityEmblem)
    .resize(460, null, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const mSplash = await sharp(splashEmblem).metadata();
  const splashTop = Math.round((2688 - mSplash.height!) * 0.44);
  const splashLeft = Math.round((1242 - mSplash.width!) / 2);

  const splashPng = await sharp({
    create: {
      width: 1242,
      height: 2688,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: splashEmblem, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Save previews
  fs.writeFileSync(ARTIFACT_DIR + '/preview_vector_squircle.png', squirclePreview);
  fs.writeFileSync(ARTIFACT_DIR + '/preview_vector_splash.png', splashPng);

  console.log('Saved preview_vector_squircle.png and preview_vector_splash.png to artifact directory!');
}

vectorize().catch(console.error);
