import fs from 'node:fs';
import potrace from 'potrace';
import sharp from 'sharp';

function traceFile(filePath: string, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(filePath, options, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });
}

async function testParams(optTol: number, alpha: number, label: string) {
  const whiteSvg = await traceFile('temp_py_mask_white.png', {
    threshold: 128,
    optCurve: true,
    optTolerance: optTol,
    turdSize: 30,
    alphaMax: alpha,
    color: '#FFFFFF'
  });

  const redSvg = await traceFile('temp_py_mask_red.png', {
    threshold: 128,
    optCurve: true,
    optTolerance: optTol,
    turdSize: 30,
    alphaMax: alpha,
    color: '#CE1141'
  });

  const whitePaths = [...whiteSvg.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);
  const redPaths = [...redSvg.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);
  const vbMatch = whiteSvg.match(/viewBox="([^"]+)"/);
  const vb = vbMatch ? vbMatch[1] : '0 0 1800 1680';

  const combined = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="1800" height="1680">
  <rect width="100%" height="100%" fill="#000000" />
  ${whitePaths.map(d => `<path fill="#FFFFFF" d="${d}" />`).join('\n  ')}
  ${redPaths.map(d => `<path fill="#CE1141" d="${d}" />`).join('\n  ')}
</svg>`;

  const png = await sharp(Buffer.from(combined))
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toBuffer();

  fs.writeFileSync(`temp_test_${label}.png`, png);
  console.log(`Saved temp_test_${label}.png with optTol=${optTol}, alpha=${alpha}`);
}

async function run() {
  await testParams(0.8, 1.2, 'tol08_a12');
  await testParams(1.2, 1.3, 'tol12_a13');
  await testParams(1.5, 1.4, 'tol15_a14');
}

run().catch(console.error);
