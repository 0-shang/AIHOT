import { Client } from 'ssh2';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function main() {
  const itemsPath = path.join(ROOT, 'packages/backend/src/publication/items.ts');
  const poolPath = path.join(ROOT, 'packages/backend/src/publication/pool.ts');

  console.log('Connecting to SSH ' + HOST + '...');
  const conn = new Client();
  await new Promise<void>((resolve, reject) => {
    conn.on('ready', () => {
      console.log('SSH connected!');
      conn.sftp(async (err, sftp) => {
        if (err) return reject(err);

        try {
          console.log('Uploading items.ts via fastPut...');
          await new Promise<void>((res, rej) => {
            sftp.fastPut(itemsPath, '/tmp/items.ts', (e: any) => e ? rej(e) : res());
          });
          console.log('Uploading pool.ts via fastPut...');
          await new Promise<void>((res, rej) => {
            sftp.fastPut(poolPath, '/tmp/pool.ts', (e: any) => e ? rej(e) : res());
          });
          console.log('Files uploaded successfully.');

          console.log('Executing hot injection and container restart...');
          const script = `
set -e
echo "==> Updating /root/myhot..."
cp /tmp/items.ts /root/myhot/packages/backend/src/publication/items.ts
cp /tmp/pool.ts /root/myhot/packages/backend/src/publication/pool.ts

echo "==> Hot-injecting into aihot-api-1..."
docker cp /tmp/items.ts aihot-api-1:/app/packages/backend/src/publication/items.ts
docker cp /tmp/pool.ts aihot-api-1:/app/packages/backend/src/publication/pool.ts

echo "==> Hot-injecting into aihot-web-1..."
docker cp /tmp/items.ts aihot-web-1:/app/packages/backend/src/publication/items.ts
docker cp /tmp/pool.ts aihot-web-1:/app/packages/backend/src/publication/pool.ts

echo "==> Hot-injecting into aihot-worker-1..."
docker cp /tmp/items.ts aihot-worker-1:/app/packages/backend/src/publication/items.ts
docker cp /tmp/pool.ts aihot-worker-1:/app/packages/backend/src/publication/pool.ts

echo "==> Restarting api and web containers..."
docker restart aihot-api-1 aihot-web-1

echo "==> Checking container status..."
sleep 2
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
`;
          conn.exec(script, (execErr, stream) => {
            if (execErr) return reject(execErr);
            stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
            stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
            stream.on('close', (code: number) => {
              if (code !== 0) reject(new Error(`Exit code ${code}`));
              else resolve();
            });
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject).connect({
      host: HOST,
      port: 22,
      username: USERNAME,
      password: PASSWORD,
      readyTimeout: 30000,
    });
  });

  conn.end();
  console.log('Hot injection completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
