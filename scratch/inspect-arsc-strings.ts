import fs from 'node:fs';

const arsc = fs.readFileSync('scratch/native_apk_workspace/resources.arsc');

// Search for string occurrences in the string pool of ARSC
const str = arsc.toString('latin1');

console.log('Includes primary:', str.includes('colorPrimary'));
console.log('Includes status:', str.includes('statusBarColor'));
console.log('Includes navigation:', str.includes('navigationBarColor'));
console.log('Includes AppTheme:', str.includes('AppTheme'));
console.log('Includes Splash:', str.includes('Splash'));

// Print all occurrences of words near colorPrimary
let idx = 0;
while ((idx = str.indexOf('colorPrimary', idx + 1)) !== -1) {
  console.log('Match near:', str.slice(Math.max(0, idx - 40), Math.min(str.length, idx + 40)).replace(/[^\x20-\x7E]/g, ' '));
}
