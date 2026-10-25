import { Client } from 'ssh2';
import fs from 'node:fs';

const conn = new Client();
const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function uploadFile(sftp: any, localFile: string, remoteFile: string) {
  await new Promise<void>((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function execCommand(conn: Client, cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream
        .on('close', () => resolve(out))
        .on('data', (data: Buffer) => {
          process.stdout.write(data.toString());
          out += data.toString();
        })
        .stderr.on('data', (data: Buffer) => {
          process.stderr.write(data.toString());
          out += data.toString();
        });
    });
  });
}

conn.on('ready', () => {
  console.log('SSH connected to ' + HOST);
  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    try {
      console.log('1. Uploading scratch/ClutchWire.apk to /root/myhot/ClutchWire_twa.apk...');
      await uploadFile(sftp, 'scratch/ClutchWire.apk', '/root/myhot/ClutchWire_twa.apk');

      console.log('2. Running verification, deployment and live checks on VPS...');
      const script = `
set -e
cd /root/myhot

echo "=== Verifying APK Signature ==="
apksigner verify -v --print-certs /root/myhot/ClutchWire_twa.apk

echo "=== Package Badging Info ==="
aapt dump badging /root/myhot/ClutchWire_twa.apk | head -n 15

echo "=== Checking Target Download Directory ==="
mkdir -p /root/myhot/apps/web/build/client/download
cp /root/myhot/ClutchWire_twa.apk /root/myhot/apps/web/build/client/download/clutchwire.apk
chmod 644 /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== Deploying to Live Docker Web Container ==="
docker cp /root/myhot/ClutchWire_twa.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk
docker exec aihot-web-1 chmod 644 /app/apps/web/build/client/download/clutchwire.apk

echo "=== Container File Verification ==="
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk
docker exec aihot-web-1 sha256sum /app/apps/web/build/client/download/clutchwire.apk

echo "=== Testing Live Download HTTP Endpoint ==="
curl -I https://clutchwire.org/download/clutchwire.apk

echo "=== Verifying Digital Asset Links ==="
curl -s https://clutchwire.org/.well-known/assetlinks.json

echo "=== SUCCESS! ==="
`;
      const result = await execCommand(conn, script);
      console.log('Deployment script finished successfully.');
    } catch (e) {
      console.error('Error during deployment:', e);
    } finally {
      conn.end();
    }
  });
}).on('error', (err) => {
  console.error('SSH Connection error:', err);
}).connect({
  host: HOST,
  port: 22,
  username: USERNAME,
  password: PASSWORD,
  readyTimeout: 10000
});
