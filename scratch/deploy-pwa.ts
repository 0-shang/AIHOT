import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const localTar = path.resolve('scratch/pwa-update.tar.gz');
const remoteTar = '/tmp/pwa-update.tar.gz';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready, opening SFTP...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream(localTar);
    const writeStream = sftp.createWriteStream(remoteTar);

    writeStream.on('close', () => {
      console.log('SFTP upload complete. Executing remote injection...');
      const commands = `
set -e
mkdir -p /tmp/pwa_update
tar -xzf /tmp/pwa-update.tar.gz -C /tmp/pwa_update

echo "Injecting static.ts into aihot-api-1..."
docker cp /tmp/pwa_update/apps/api/src/routes/static.ts aihot-api-1:/app/apps/api/src/routes/static.ts

echo "Injecting web build into aihot-web-1..."
docker cp /tmp/pwa_update/apps/web/build aihot-web-1:/app/apps/web/

echo "Restarting aihot-api-1 and aihot-web-1..."
docker restart aihot-api-1 aihot-web-1

echo "Waiting for services..."
sleep 6

echo "--- Testing /sw.js on API ---"
curl -I http://127.0.0.1:3001/sw.js

echo "--- Testing Web HTML contains PWA prompt string ---"
curl -s http://127.0.0.1:3000/ | grep -o '添加到手机桌面' || echo "Check client bundle"

rm -rf /tmp/pwa_update /tmp/pwa-update.tar.gz
`;
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', (d: Buffer) => {
          process.stdout.write(d);
          out += d;
        });
        stream.stderr.on('data', (d: Buffer) => {
          process.stderr.write(d);
        });
        stream.on('close', (code: number) => {
          console.log(`\nRemote deployment finished with code ${code}`);
          conn.end();
        });
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
