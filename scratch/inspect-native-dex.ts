import fs from 'node:fs';

const dex = fs.readFileSync('scratch/native_apk_workspace/classes.dex').toString('latin1');
const dex2 = fs.readFileSync('scratch/native_apk_workspace/classes2.dex').toString('latin1');
const all = dex + dex2;

// Search for com/kotlin/mNative occurrences
let idx = 0;
const nativeClasses = new Set<string>();
while ((idx = all.indexOf('Lcom/kotlin/mNative/', idx + 1)) !== -1) {
  const end = all.indexOf(';', idx);
  if (end !== -1 && end - idx < 100) {
    nativeClasses.add(all.slice(idx, end));
  }
}
console.log('Native classes in dex:', Array.from(nativeClasses));

// Let's inspect strings around SplashActivity and MainActivity
for (const cls of ['SplashActivity', 'MainActivity']) {
  console.log(`\n=== Strings near ${cls} ===`);
  let p = 0;
  while ((p = all.indexOf(cls, p + 1)) !== -1) {
    console.log(all.slice(Math.max(0, p - 60), Math.min(all.length, p + 60)).replace(/[^\x20-\x7E]/g, ' '));
  }
}
