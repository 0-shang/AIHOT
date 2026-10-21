import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'ssh2';

// Check local ClutchWire.apk
const apkPath = 'scratch/extracted_fullscreen/ClutchWire.apk';
if (fs.existsSync(apkPath)) {
  const stat = fs.statSync(apkPath);
  console.log('ClutchWire.apk size:', stat.size);
} else {
  console.log('ClutchWire.apk not found');
}

const conn = new Client();
conn.on('ready', () => {
  conn.exec('which java javac keytool zipalign apksigner docker', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('VPS Tools:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
