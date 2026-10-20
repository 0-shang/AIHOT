import fs from 'node:fs';
import potrace from 'potrace';

function traceFile(filePath: string, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(filePath, options, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });
}

async function main() {
  const whiteSvg = await traceFile('temp_py_mask_white.png', {
    threshold: 128,
    optCurve: true,
    optTolerance: 0.5,
    turdSize: 20,
    alphaMax: 1.1,
    color: '#FFFFFF'
  });

  const redSvg = await traceFile('temp_py_mask_red.png', {
    threshold: 128,
    optCurve: true,
    optTolerance: 0.5,
    turdSize: 20,
    alphaMax: 1.1,
    color: '#CE1141'
  });

  fs.writeFileSync('temp_potrace_white.svg', whiteSvg);
  fs.writeFileSync('temp_potrace_red.svg', redSvg);

  console.log('Traced ultra-smooth vector curves!');
}

main().catch(console.error);
