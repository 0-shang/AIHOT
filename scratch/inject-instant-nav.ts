import { Client } from 'ssh2';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAYLOAD_DIR = path.join(import.meta.dirname, 'payload_nav');
const TAR_FILE = path.join(import.meta.dirname, 'nav-update.tar.gz');

const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function main() {
  console.log('1. Preparing payload...');
  if (fs.existsSync(PAYLOAD_DIR)) fs.rmSync(PAYLOAD_DIR, { recursive: true, force: true });
  fs.mkdirSync(PAYLOAD_DIR, { recursive: true });

  const filesToCopy = [
    { src: 'apps/web/build/server', dest: 'apps/web/build/server' },
    { src: 'apps/web/build/client/assets', dest: 'apps/web/build/client/assets' },
    { src: 'apps/web/app/components/ui/ItemSkeleton.tsx', dest: 'apps/web/app/components/ui/ItemSkeleton.tsx' },
    { src: 'apps/web/app/root.tsx', dest: 'apps/web/app/root.tsx' },
    { src: 'apps/web/app/features/feed/parts.tsx', dest: 'apps/web/app/features/feed/parts.tsx' },
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
  }

  console.log('2. Creating tar.gz archive...');
  if (fs.existsSync(TAR_FILE)) fs.unlinkSync(TAR_FILE);
  execSync(`tar -czf "${TAR_FILE}" -C "${PAYLOAD_DIR}" .`, { stdio: 'inherit' });
  console.log(`Archive size: ${(fs.statSync(TAR_FILE).size / 1024).toFixed(1)} KB`);

  console.log('3. Connecting to VPS...');
  const conn = new Client();
  await new Promise<void>((resolve, reject) => {
    conn.on('ready', () => {
      console.log('Connected to ' + HOST);
      conn.sftp(async (err, sftp) => {
        if (err) return reject(err);

        try {
          console.log('4. Uploading archive via fastPut...');
          await new Promise<void>((res, rej) => {
            sftp.fastPut(TAR_FILE, '/tmp/nav-update.tar.gz', (e: any) => e ? rej(e) : res());
          });

          console.log('5. Executing hot injection and web restart...');
          const script = `
set -e
echo "==> Extracting payload..."
rm -rf /tmp/nav_extracted
mkdir -p /tmp/nav_extracted
tar -xzf /tmp/nav-update.tar.gz -C /tmp/nav_extracted

echo "==> Updating host files..."
cp -rf /tmp/nav_extracted/* /root/myhot/

echo "==> Hot-injecting into aihot-web-1..."
docker cp /tmp/nav_extracted/apps/web/build/server/. aihot-web-1:/app/apps/web/build/server/
docker cp /tmp/nav_extracted/apps/web/build/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/

echo "==> Restarting aihot-web-1..."
docker restart aihot-web-1

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
  console.log('Instant Navigation hot injection completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
