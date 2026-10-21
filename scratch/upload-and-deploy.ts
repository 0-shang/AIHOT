import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const localTar = path.resolve('scratch/hot-poster-update.tar.gz');
const remoteTar = '/tmp/hot-poster-update.tar.gz';

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
mkdir -p /tmp/update
tar -xzf /tmp/hot-poster-update.tar.gz -C /tmp/update

echo "Injecting into aihot-api-1..."
docker cp /tmp/update/apps/api/src/og/hot-poster.ts aihot-api-1:/app/apps/api/src/og/hot-poster.ts
docker cp /tmp/update/apps/api/src/routes/og.ts aihot-api-1:/app/apps/api/src/routes/og.ts

echo "Injecting into aihot-web-1..."
docker cp /tmp/update/apps/web/build aihot-web-1:/app/apps/web/

echo "Restarting containers..."
docker restart aihot-api-1 aihot-web-1

echo "Waiting for services..."
sleep 6

echo "--- Testing API hot poster ---"
curl -I http://127.0.0.1:3001/og/posters/hot.png

echo "--- Testing Web hot page HTML ---"
curl -s http://127.0.0.1:3000/hot | grep -o '生成热点海报' || echo "Grep failed"

rm -rf /tmp/update /tmp/hot-poster-update.tar.gz
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
          console.log(`\nRemote script finished with code ${code}`);
          conn.end();
        });
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
