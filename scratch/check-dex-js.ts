import fs from 'node:fs';

const dex1 = fs.readFileSync('scratch/native_apk_workspace/classes.dex');
const dex2 = fs.readFileSync('scratch/native_apk_workspace/classes2.dex');
const str1 = dex1.toString('latin1');
const str2 = dex2.toString('latin1');
const all = str1 + str2;

console.log('has JavascriptInterface:', all.includes('JavascriptInterface'));
console.log('has addJavascriptInterface:', all.includes('addJavascriptInterface'));

let idx = 0;
while ((idx = all.indexOf('addJavascriptInterface', idx + 1)) !== -1) {
  console.log('JS interface call:', all.slice(Math.max(0, idx - 50), Math.min(all.length, idx + 100)).replace(/[^\x20-\x7E]/g, ' '));
}
