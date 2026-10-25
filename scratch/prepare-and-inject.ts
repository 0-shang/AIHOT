import { Client } from 'ssh2';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAYLOAD_DIR = path.join(import.meta.dirname, 'update_payload');
const TAR_FILE = path.join(import.meta.dirname, 'hot-update.tar.gz');

const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function main() {
  console.log('1. Preparing update payload...');
  if (fs.existsSync(PAYLOAD_DIR)) {
    fs.rmSync(PAYLOAD_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(PAYLOAD_DIR, { recursive: true });

  const filesToCopy: Array<{ src: string; dest: string }> = [
    { src: 'apps/web/build/server', dest: 'apps/web/build/server' },
    { src: 'apps/web/build/client/assets', dest: 'apps/web/build/client/assets' },
    { src: 'packages/backend/src/editorial/analyze.ts', dest: 'packages/backend/src/editorial/analyze.ts' },
    { src: 'packages/backend/src/publication/items.ts', dest: 'packages/backend/src/publication/items.ts' },
    { src: 'packages/backend/src/publication/publish.ts', dest: 'packages/backend/src/publication/publish.ts' },
    { src: 'packages/backend/src/nba/pipeline.ts', dest: 'packages/backend/src/nba/pipeline.ts' },
    { src: 'packages/backend/src/nba/seed-data.ts', dest: 'packages/backend/src/nba/seed-data.ts' },
    { src: 'industry/sources.json', dest: 'industry/sources.json' },
    { src: '.data/rockets/standings.json', dest: '.data/rockets/standings.json' },
    { src: 'database/migrations/0052_clean_noisy_aggregator_and_tweets.sql', dest: 'database/migrations/0052_clean_noisy_aggregator_and_tweets.sql' }
  ];

  for (const { src, dest } of filesToCopy) {
    const fullSrc = path.join(ROOT, src);
    const fullDest = path.join(PAYLOAD_DIR, dest);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    if (fs.statSync(fullSrc).isDirectory()) {
      fs.cpSync(fullSrc, fullDest, { recursive: true });
    } else {
      fs.copyFileSync(fullSrc, fullDest);
    }
    console.log(`  + copied ${src}`);
  }

  console.log('2. Creating tar.gz archive...');
  if (fs.existsSync(TAR_FILE)) fs.unlinkSync(TAR_FILE);
  execSync(`tar -czf "${TAR_FILE}" -C "${PAYLOAD_DIR}" .`, { stdio: 'inherit' });
  console.log(`Archive size: ${(fs.statSync(TAR_FILE).size / 1024).toFixed(1)} KB`);

  console.log('3. Connecting to VPS via SSH...');
  const conn = new Client();

  await new Promise<void>((resolve, reject) => {
    conn.on('ready', () => {
      console.log('Connected to ' + HOST);
      conn.sftp(async (err, sftp) => {
        if (err) return reject(err);

        try {
          console.log('4. Uploading hot-update.tar.gz...');
          await new Promise<void>((res, rej) => {
            sftp.fastPut(TAR_FILE, '/tmp/hot-update.tar.gz', (uploadErr: any) => {
              if (uploadErr) rej(uploadErr);
              else res();
            });
          });
          console.log('Upload complete.');

          console.log('5. Executing hot injection on VPS...');
          const remoteScript = `
set -e
echo "==> Extracting payload to /tmp/hot_update_extracted..."
rm -rf /tmp/hot_update_extracted
mkdir -p /tmp/hot_update_extracted
tar -xzf /tmp/hot-update.tar.gz -C /tmp/hot_update_extracted

echo "==> Updating /root/myhot host directory..."
cp -rf /tmp/hot_update_extracted/* /root/myhot/

echo "==> Hot-injecting into aihot-web-1..."
docker cp /tmp/hot_update_extracted/apps/web/build/server/. aihot-web-1:/app/apps/web/build/server/
docker cp /tmp/hot_update_extracted/apps/web/build/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/
docker cp /tmp/hot_update_extracted/packages/backend/. aihot-web-1:/app/packages/backend/
docker cp /tmp/hot_update_extracted/industry/. aihot-web-1:/app/industry/
if [ -d /tmp/hot_update_extracted/.data ]; then
  docker cp /tmp/hot_update_extracted/.data/. aihot-web-1:/app/.data/
fi

echo "==> Hot-injecting into aihot-api-1..."
docker cp /tmp/hot_update_extracted/packages/backend/. aihot-api-1:/app/packages/backend/
docker cp /tmp/hot_update_extracted/industry/. aihot-api-1:/app/industry/
if [ -d /tmp/hot_update_extracted/.data ]; then
  docker cp /tmp/hot_update_extracted/.data/. aihot-api-1:/app/.data/
fi
docker cp /tmp/hot_update_extracted/database/migrations/. aihot-api-1:/app/database/migrations/

echo "==> Hot-injecting into aihot-worker-1..."
docker cp /tmp/hot_update_extracted/packages/backend/. aihot-worker-1:/app/packages/backend/
docker cp /tmp/hot_update_extracted/industry/. aihot-worker-1:/app/industry/

echo "==> Running database migration 0052..."
docker exec aihot-api-1 node scripts/migrate.ts

echo "==> Restarting services..."
docker restart aihot-web-1 aihot-api-1 aihot-worker-1

echo "==> Verifying containers are up..."
sleep 3
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "==> Hot injection succeeded!"
`;

          conn.exec(remoteScript, (execErr, stream) => {
            if (execErr) return reject(execErr);
            stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
            stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
            stream.on('close', (code: number) => {
              if (code !== 0) reject(new Error(`Remote script failed with exit code ${code}`));
              else {
                console.log('Remote execution finished successfully.');
                resolve();
              }
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
      readyTimeout: 30000
    });
  });

  conn.end();
  console.log('6. All done! Hot injection completed successfully.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
