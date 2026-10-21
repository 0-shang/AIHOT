import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const localTar = path.resolve('scratch/install-guide-update.tar.gz');
const remoteTar = '/tmp/install-guide-update.tar.gz';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream(localTar);
    const writeStream = sftp.createWriteStream(remoteTar);

    writeStream.on('close', () => {
      const commands = `
set -e
mkdir -p /tmp/install_update
tar -xzf /tmp/install-guide-update.tar.gz -C /tmp/install_update

echo "Injecting web build into aihot-web-1..."
docker cp /tmp/install_update/apps/web/build aihot-web-1:/app/apps/web/

echo "Restarting aihot-web-1..."
docker restart aihot-web-1

sleep 5

echo "--- Testing /install route on web ---"
curl -s http://127.0.0.1:3000/install | grep -o '添加到手机桌面' || echo "Check /install"

echo "--- Testing /more route contains install link ---"
curl -s http://127.0.0.1:3000/more | grep -o '安装指南' || echo "Check /more"

rm -rf /tmp/install_update /tmp/install-guide-update.tar.gz
`;
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d: Buffer) => process.stdout.write(d));
        stream.stderr.on('data', (d: Buffer) => process.stderr.write(d));
        stream.on('close', (code: number) => {
          console.log(`\nDeployment finished with code ${code}`);
          conn.end();
        });
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
