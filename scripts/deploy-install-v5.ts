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
        .on('data', (data: Buffer) => { out += data.toString(); })
        .stderr.on('data', (data: Buffer) => { out += data.toString(); });
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
      console.log('1. Uploading static.ts...');
      await uploadFile(sftp, 'apps/api/src/routes/static.ts', '/root/myhot/apps/api/src/routes/static.ts');

      console.log('2. Uploading web-build-v5.tar.gz...');
      await uploadFile(sftp, 'scratch/web-build-v5.tar.gz', '/root/myhot/web-build-v5.tar.gz');

      console.log('3. Extracting and injecting into Docker containers...');
      const script = `
set -e
cd /root/myhot

# Unpack web build on host
rm -rf apps/web/build
tar -xzf /root/myhot/web-build-v5.tar.gz -C apps/web

# Update container static.ts
docker cp /root/myhot/apps/api/src/routes/static.ts aihot-api-1:/app/apps/api/src/routes/static.ts

# Update container web build
docker cp /root/myhot/apps/web/build/. aihot-web-1:/app/apps/web/build/

# Restart containers
docker restart aihot-api-1 aihot-web-1

sleep 4
echo "=== VERIFY API ASSETLINKS ==="
docker exec aihot-api-1 curl -s http://127.0.0.1:3000/.well-known/assetlinks.json | head -c 200
echo ""
echo "=== CONTAINERS STATUS ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
`;
      const res = await execCommand(conn, script);
      console.log('Output:\n' + res);

    } catch (e) {
      console.error('Deployment error:', e);
    } finally {
      conn.end();
    }
  });
}).connect({
  host: HOST,
  port: 22,
  username: USERNAME,
  password: PASSWORD
});
