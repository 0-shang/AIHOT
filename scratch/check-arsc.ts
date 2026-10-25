import fs from 'node:fs';

const arsc = fs.readFileSync('scratch/native_apk_workspace/resources.arsc');
const hex = arsc.toString('hex');

// In ARSC, colors are 32-bit integers: 0xAARRGGBB in little-endian is BB GG RR AA
// #fff8fafc: AA=FF, RR=F8, GG=FA, BB=FC -> little-endian bytes: FC FA F8 FF -> hex: fcfaf8ff
// #ff0c1015: AA=FF, RR=0C, GG=10, BB=15 -> little-endian bytes: 15 10 0C FF -> hex: 15100cff

console.log('Occurrences of #fff8fafc (fcfaf8ff):', (hex.match(/fcfaf8ff/g) || []).length);
console.log('Occurrences of #ff0c1015 (15100cff):', (hex.match(/15100cff/g) || []).length);
console.log('Occurrences of #ffce1141 (4111ceff):', (hex.match(/4111ceff/g) || []).length);
