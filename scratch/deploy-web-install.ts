import { Client } from 'ssh2';
import * as path from 'path';
import * as fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS for web sync...');
  // We can copy client build files or rsync/scp if needed, or check docker
  conn.exec('docker exec aihot-web-1 ls -la /app/apps/web/build/client/download/', (err, stream) => {
    if (err) throw err;
    stream.on('data', (d: Buffer) => process.stdout.write(d));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
