import fs from 'node:fs';
import sharp from 'sharp';
import potrace from 'potrace';

function traceMask(file: string, optTol = 0.8): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // Invert mask and upscale 4x with Lanczos + gentle anti-alias blur for silk-smooth curves
    const buf = await sharp(file)
      .negate({ alpha: false })
      .resize(1340, 1340, { kernel: sharp.kernel.lanczos3 })
      .blur(2.2)
      .threshold(128)
      .png()
      .toBuffer();

    potrace.trace(buf, {
      threshold: 128,
      optCurve: true,
      optTolerance: optTol,
      turdSize: 15,
      alphaMax: 1.15
    }, (err, svg) => {
      if (err) reject(err);
      else {
        const match = svg.match(/<path[^>]*d="([^"]+)"/);
        resolve(match ? match[1] : '');
      }
    });
  });
}

async function main() {
  console.log('1. Tracing all 6 components...');
  const pathWTop = await traceMask('temp_comp_w_top.png', 0.9);
  const pathWLeg = await traceMask('temp_comp_w_leg.png', 0.9);
  const pathRBody = await traceMask('temp_comp_r_body.png', 0.85);
  const pathRHole = await traceMask('temp_comp_r_hole.png', 0.85);
  const pathRFin1 = await traceMask('temp_comp_r_fin1.png', 0.85);
  const pathRFin2 = await traceMask('temp_comp_r_fin2.png', 0.85);

  const size = 1340;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="#000000" />
  <g fill="#FFFFFF">
    <path d="${pathWTop}" />
    <path d="${pathWLeg}" />
  </g>
  <g fill="#CE1141">
    <path d="${pathRFin1}" />
    <path d="${pathRFin2}" />
    <path d="${pathRBody} ${pathRHole}" fill-rule="evenodd" />
  </g>
</svg>`;

  fs.writeFileSync('temp_master_emblem.svg', svg);
  console.log('2. Saved temp_master_emblem.svg (100% mathematical vector)');

  // Render at 2048x2048 to test sharpness
  await sharp(Buffer.from(svg))
    .resize(2048, 2048)
    .png()
    .toFile('temp_master_emblem_2048.png');

  console.log('3. Rendered temp_master_emblem_2048.png');
}

main().catch(console.error);
