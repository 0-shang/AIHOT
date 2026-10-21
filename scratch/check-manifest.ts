import fs from 'node:fs';

const buf = fs.readFileSync('scratch/native_apk_workspace/AndroidManifest.xml');
// Scan UTF-16 and UTF-8 strings
const strings = new Set<string>();
for (let i = 0; i < buf.length - 8; i++) {
  // Try UTF-16LE
  let u16 = '';
  for (let j = i; j < Math.min(i + 100, buf.length - 1); j += 2) {
    const code = buf.readUInt16LE(j);
    if (code >= 32 && code <= 126) {
      u16 += String.fromCharCode(code);
    } else {
      break;
    }
  }
  if (u16.length >= 4) strings.add(u16);
}
console.log('UTF-16 strings:', Array.from(strings).filter(s => s.includes('Activity') || s.includes('Theme') || s.includes('color') || s.includes('package') || s.includes('com.') || s.includes('org.')).slice(0, 30));
