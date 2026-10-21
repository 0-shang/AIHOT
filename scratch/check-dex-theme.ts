import fs from 'node:fs';

const buf = fs.readFileSync('scratch/native_apk_workspace/classes.dex');
const str = buf.toString('latin1');
console.log('Includes theme-color:', str.includes('theme-color'));
console.log('Includes theme_color:', str.includes('theme_color'));
console.log('Includes statusBarColor:', str.includes('statusBarColor'));
console.log('Includes navigationBarColor:', str.includes('navigationBarColor'));
console.log('Includes #ffffff:', str.includes('#ffffff') || str.includes('#FFFFFF'));
console.log('Includes #000000:', str.includes('#000000'));

// Find context around setStatusBarColor
let idx = 0;
while ((idx = str.indexOf('setStatusBarColor', idx + 1)) !== -1) {
  const slice = str.slice(Math.max(0, idx - 100), Math.min(str.length, idx + 100));
  // clean non-printables
  const clean = slice.replace(/[^\x20-\x7E]/g, ' ');
  console.log('Context:', clean);
}
