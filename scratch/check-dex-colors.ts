import fs from 'node:fs';

for (const dex of ['classes.dex', 'classes2.dex']) {
  const file = `scratch/native_apk_workspace/${dex}`;
  if (fs.existsSync(file)) {
    const buf = fs.readFileSync(file);
    const str = buf.toString('latin1');
    const hasStatus = str.includes('setStatusBarColor');
    const hasNav = str.includes('setNavigationBarColor');
    const hasWindow = str.includes('setDecorFitsSystemWindows');
    console.log(`${dex}: setStatusBarColor=${hasStatus}, setNavigationBarColor=${hasNav}, setDecorFitsSystemWindows=${hasWindow}`);
  }
}
