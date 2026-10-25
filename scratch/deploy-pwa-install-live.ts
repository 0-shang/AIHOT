import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const localTar = path.resolve('scratch/web-install-pwa.tar.gz');
const remoteTar = '/tmp/web-install-pwa.tar.gz';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading web-install-pwa.tar.gz...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream(localTar);
    const writeStream = sftp.createWriteStream(remoteTar);

    writeStream.on('close', () => {
      console.log('Archive uploaded successfully. Injecting into container...');
      const commands = `
set -e
mkdir -p /tmp/web_pwa_update
tar -xzf /tmp/web-install-pwa.tar.gz -C /tmp/web_pwa_update

echo "Injecting into aihot-web-1..."
docker cp /tmp/web_pwa_update/server/. aihot-web-1:/app/apps/web/build/server/
docker cp /tmp/web_pwa_update/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/

echo "Restarting aihot-web-1..."
docker restart aihot-web-1

sleep 4

echo "--- Testing /install route live ---"
curl -s http://127.0.0.1:3000/install | grep -o '一键直接安装到手机桌面' || echo "Check /install"

rm -rf /tmp/web_pwa_update /tmp/web-install-pwa.tar.gz
echo "DEPLOYMENT COMPLETE!"
`;
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d: Buffer) => process.stdout.write(d));
        stream.stderr.on('data', (d: Buffer) => process.stderr.write(d));
        stream.on('close', (code: number) => {
          console.log(`\nFinished with code ${code}`);
          conn.end();
        });
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
