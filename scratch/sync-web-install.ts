import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// 1. Create a tarball of local apps/web/build/server and apps/web/build/client (excluding download/)
console.log('Packaging local web build...');
const tarPath = path.resolve('scratch/web_update.tar.gz');
if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);

// Use tar to bundle
execSync(`tar -czf "${tarPath}" -C apps/web/build --exclude="client/download" server client`);
console.log(`Tarball created: ${fs.statSync(tarPath).size} bytes`);

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading web_update.tar.gz...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream(tarPath);
    const writeStream = sftp.createWriteStream('/tmp/web_update.tar.gz');

    writeStream.on('close', () => {
      console.log('Uploaded tarball. Extracting and deploying to aihot-web-1...');
      const commands = `
set -e
mkdir -p /tmp/web_update_extracted
tar -xzf /tmp/web_update.tar.gz -C /tmp/web_update_extracted

echo "Copying into container..."
docker cp /tmp/web_update_extracted/server/. aihot-web-1:/app/apps/web/build/server/
docker cp /tmp/web_update_extracted/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/

echo "Restarting web container..."
docker restart aihot-web-1

echo "Verifying web container..."
sleep 3
docker ps | grep aihot-web

echo "Verifying live install page..."
curl -s https://clutchwire.org/install | grep -o "官方原生客户端" || echo "Done"

echo "=== WEB DEPLOYMENT COMPLETE! ==="
`;
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d: Buffer) => process.stdout.write(d));
        stream.stderr.on('data', (d: Buffer) => process.stderr.write(d));
        stream.on('close', (code: number) => {
          console.log(`\nFinished with exit code ${code}`);
          conn.end();
        });
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
