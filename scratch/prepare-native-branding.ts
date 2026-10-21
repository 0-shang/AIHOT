import fs from 'node:fs';
import path from 'node:path';

const iconSrc = 'industry/brand/icon.png';
const splashSrc = 'industry/brand/splash.png';
const ws = 'scratch/native_apk_workspace';

// Replace icons
const mipmaps = [
  'res/mipmap-mdpi/icon_launcher.png',
  'res/mipmap-hdpi/icon_launcher.png',
  'res/mipmap-xhdpi/icon_launcher.png',
  'res/mipmap-xxhdpi/icon_launcher.png',
  'res/mipmap-xxxhdpi/icon_launcher.png',
];

for (const m of mipmaps) {
  const dest = path.join(ws, m);
  if (fs.existsSync(dest)) {
    fs.copyFileSync(iconSrc, dest);
    console.log('Replaced:', dest);
  } else {
    console.warn('Not found:', dest);
  }
}

// Replace splash
const splashDest = path.join(ws, 'res/drawable/splash.png');
if (fs.existsSync(splashDest)) {
  fs.copyFileSync(splashSrc, splashDest);
  console.log('Replaced splash:', splashDest);
} else {
  console.warn('Not found splash:', splashDest);
}

// Remove old META-INF
const metaInf = path.join(ws, 'META-INF');
if (fs.existsSync(metaInf)) {
  fs.rmSync(metaInf, { recursive: true, force: true });
  console.log('Removed old META-INF signatures');
}

console.log('Native APK workspace ready for packing & signing!');
