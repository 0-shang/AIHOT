import sharp from 'sharp';
import fs from 'node:fs';

async function testMask() {
  const src = 'C:/Users/96910/.gemini/antigravity-ide/brain/477ca72d-fe90-4418-ad83-176081215c6c/perfect_complete_emblem_1792498433990.jpg';
  
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const cleanBuf = Buffer.alloc(w * h * 4);
  
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 20 && Math.max(r, g, b) < 25) {
      cleanBuf[i * 4] = 0;
      cleanBuf[i * 4 + 1] = 0;
      cleanBuf[i * 4 + 2] = 0;
      cleanBuf[i * 4 + 3] = 255;
    } else {
      cleanBuf[i * 4] = r;
      cleanBuf[i * 4 + 1] = g;
      cleanBuf[i * 4 + 2] = b;
      cleanBuf[i * 4 + 3] = 255;
    }
  }

  const cleanPng = await sharp(cleanBuf, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Test 1: Android Adaptive Circle Mask
  const circleMask = Buffer.from(
    '<svg width="512" height="512"><circle cx="256" cy="256" r="230" fill="#ffffff"/></svg>'
  );

  const icon512 = await sharp(cleanPng)
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const maskedCircle = await sharp(icon512)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  fs.writeFileSync('temp_test_masked_circle.png', maskedCircle);

  // Test 2: Android Squircle Mask (rx=115 for 512x512)
  const squircleMask = Buffer.from(
    '<svg width="512" height="512"><rect x="0" y="0" width="512" height="512" rx="115" ry="115" fill="#ffffff"/></svg>'
  );

  const maskedSquircle = await sharp(icon512)
    .composite([{ input: squircleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  fs.writeFileSync('temp_test_masked_squircle.png', maskedSquircle);

  // Test 3: Splash Screen Mockup (1242x2688)
  const splashW = 1242;
  const splashH = 2688;
  const splashEmblemSize = 640;

  const splashEmblem = await sharp(cleanPng)
    .resize(splashEmblemSize, splashEmblemSize, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const splashTop = Math.round((splashH - splashEmblemSize) * 0.44);
  const splashLeft = Math.round((splashW - splashEmblemSize) / 2);

  const splashPng = await sharp({
    create: {
      width: splashW,
      height: splashH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([{ input: splashEmblem, top: splashTop, left: splashLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('temp_test_splash.png', splashPng);

  console.log('All test assets generated successfully!');
}

testMask().catch(console.error);
