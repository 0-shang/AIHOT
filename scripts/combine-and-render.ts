import fs from 'node:fs';
import sharp from 'sharp';

async function main() {
  const whiteSvg = fs.readFileSync('temp_potrace_white.svg', 'utf8');
  const redSvg = fs.readFileSync('temp_potrace_red.svg', 'utf8');

  const whitePaths = [...whiteSvg.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);
  const redPaths = [...redSvg.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => m[1]);

  console.log('White paths count:', whitePaths.length, 'Red paths count:', redPaths.length);

  // Get viewBox or width/height from whiteSvg
  const vbMatch = whiteSvg.match(/viewBox="([^"]+)"/);
  const vb = vbMatch ? vbMatch[1] : '0 0 1200 1120';

  const combined = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
  <rect width="100%" height="100%" fill="#000000" />
  ${whitePaths.map(d => `<path fill="#FFFFFF" d="${d}" />`).join('\n  ')}
  ${redPaths.map(d => `<path fill="#CE1141" d="${d}" />`).join('\n  ')}
</svg>`;

  fs.writeFileSync('temp_potrace_combined.svg', combined);
  console.log('Saved temp_potrace_combined.svg');

  await sharp(Buffer.from(combined))
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile('temp_potrace_render.png');

  console.log('Rendered temp_potrace_render.png');
}

main().catch(console.error);
