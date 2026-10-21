import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const localTar = path.resolve('scratch/sw-fix.tar.gz');
const remoteTar = '/tmp/sw-fix.tar.gz';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream(localTar);
    const writeStream = sftp.createWriteStream(remoteTar);

    writeStream.on('close', () => {
      const commands = `
set -e
mkdir -p /tmp/sw_fix
tar -xzf /tmp/sw-fix.tar.gz -C /tmp/sw_fix

echo "Injecting into aihot-web-1..."
docker cp /tmp/sw_fix/packages/contracts/src/http-policy.ts aihot-web-1:/app/packages/contracts/src/http-policy.ts
docker cp /tmp/sw_fix/apps/web/build aihot-web-1:/app/apps/web/

echo "Injecting into aihot-api-1..."
docker cp /tmp/sw_fix/packages/contracts/src/http-policy.ts aihot-api-1:/app/packages/contracts/src/http-policy.ts

docker restart aihot-web-1

sleep 3
echo "--- Testing sw.js locally on Web:3000 ---"
curl -I http://127.0.0.1:3000/sw.js

rm -rf /tmp/sw_fix /tmp/sw-fix.tar.gz
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
