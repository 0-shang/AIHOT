import AdmZip from 'adm-zip';
import fs from 'node:fs';
import path from 'node:path';

const zip = new AdmZip('scratch/extracted_fullscreen/ClutchWire.apk');
const entries = zip.getEntries();
const outDir = 'scratch/apk_icons';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  if (entry.entryName.endsWith('.png') && (entry.entryName.includes('ic_launcher') || entry.entryName.includes('icon') || entry.entryName.includes('splash') || entry.entryName.startsWith('res/'))) {
    // Look for larger pngs
    if (entry.header.size > 5000) {
      const fileName = path.basename(entry.entryName);
      fs.writeFileSync(path.join(outDir, `${entry.header.size}_${fileName}`), entry.getData());
      console.log(`Saved: ${entry.entryName} (size: ${entry.header.size})`);
    }
  }
}
