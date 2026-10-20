import fs from 'node:fs';
import sharp from 'sharp';
import potrace from 'potrace';

function tracePng(buf: Buffer, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(buf, options, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });
}

async function main() {
  // Let's take temp_mask_w_clean.png and temp_mask_r_clean.png
  // In potrace: 0 is black (foreground), 255 is white (background)
  // Our masks currently have 255 for foreground, 0 for background.
  // So we invert them:
  const maskW = await sharp('temp_mask_w_clean.png')
    .negate({ alpha: false })
    .resize(1340, 1340, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const maskR = await sharp('temp_mask_r_clean.png')
    .negate({ alpha: false })
    .resize(1340, 1340, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  console.log('Tracing White with potrace...');
  const svgW = await tracePng(maskW, {
    threshold: 128,
    optCurve: true,
    optTolerance: 0.85,
    turdSize: 10,
    alphaMax: 1.15,
    color: '#FFFFFF'
  });

  console.log('Tracing Red with potrace...');
  const svgR = await tracePng(maskR, {
    threshold: 128,
    optCurve: true,
    optTolerance: 0.85,
    turdSize: 10,
    alphaMax: 1.15,
    color: '#CE1141'
  });

  const pathsW = [...svgW.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);
  const pathsR = [...svgR.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);

  const vbMatch = svgW.match(/viewBox="([^"]+)"/);
  const vb = vbMatch ? vbMatch[1] : '0 0 1340 1340';

  const combined = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="1340" height="1340">
  <rect width="100%" height="100%" fill="#000000" />
  <g fill="#FFFFFF">
    ${pathsW.map(d => `<path d="${d}" />`).join('\n    ')}
  </g>
  <g fill="#CE1141" fill-rule="evenodd">
    ${pathsR.map(d => `<path d="${d}" />`).join('\n    ')}
  </g>
</svg>`;

  fs.writeFileSync('temp_clean_potrace.svg', combined);
  console.log('Saved temp_clean_potrace.svg');

  // Render at 1242x1242
  await sharp(Buffer.from(combined))
    .resize(1242, 1242)
    .png()
    .toFile('temp_clean_potrace_render.png');

  console.log('Rendered temp_clean_potrace_render.png');
}

main().catch(console.error);
