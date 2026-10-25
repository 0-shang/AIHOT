import { Client } from 'ssh2';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAYLOAD_DIR = path.join(import.meta.dirname, 'payload_si');
const TAR_FILE = path.join(import.meta.dirname, 'si-update.tar.gz');

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
    { src: 'packages/backend/src/publication/detail.ts', dest: 'packages/backend/src/publication/detail.ts' },
    { src: 'packages/backend/src/publication/publish.ts', dest: 'packages/backend/src/publication/publish.ts' },
    { src: 'packages/backend/src/editorial/analyze.ts', dest: 'packages/backend/src/editorial/analyze.ts' },
    { src: 'apps/web/app/lib/api.server.ts', dest: 'apps/web/app/lib/api.server.ts' },
    { src: 'apps/web/app/components/ui/IntentLink.tsx', dest: 'apps/web/app/components/ui/IntentLink.tsx' },
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
          console.log('4. Uploading archive...');
          await new Promise<void>((res, rej) => {
            sftp.fastPut(TAR_FILE, '/tmp/si-update.tar.gz', (e: any) => e ? rej(e) : res());
          });

          console.log('5. Executing hot injection and database update...');
          const script = `
set -e
echo "==> Extracting payload..."
rm -rf /tmp/si_extracted
mkdir -p /tmp/si_extracted
tar -xzf /tmp/si-update.tar.gz -C /tmp/si_extracted

echo "==> Updating host files..."
cp -rf /tmp/si_extracted/* /root/myhot/

echo "==> Hot-injecting into aihot-web-1..."
docker cp /tmp/si_extracted/apps/web/build/server/. aihot-web-1:/app/apps/web/build/server/
docker cp /tmp/si_extracted/apps/web/build/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/
docker cp /tmp/si_extracted/packages/backend/. aihot-web-1:/app/packages/backend/

echo "==> Hot-injecting into aihot-api-1..."
docker cp /tmp/si_extracted/packages/backend/. aihot-api-1:/app/packages/backend/

echo "==> Hot-injecting into aihot-worker-1..."
docker cp /tmp/si_extracted/packages/backend/. aihot-worker-1:/app/packages/backend/

echo "==> Restarting api and web containers..."
docker restart aihot-api-1 aihot-web-1

echo "==> Running script inside aihot-api-1 to update SI preview summary..."
docker exec aihot-api-1 node -e '
import { sql, closeDb } from "@aihot/backend/db";
async function fix() {
  console.log("Searching for Sports Illustrated preview article...");
  const rows = await sql\`
    SELECT p.article_id, p.title, p.summary, a.title as orig_title, a.body_text
    FROM publications p
    JOIN articles a ON a.id = p.article_id
    WHERE a.title ILIKE "%Hawks Vs Rockets%Preview%" OR p.title ILIKE "%Hawks Vs Rockets%Preview%"
    LIMIT 5
  \`;
  console.log("Found rows:", rows.length);
  for (const r of rows) {
    console.log("Found row:", r.article_id, r.title);
    const zhTitle = "老鹰vs火箭前瞻：伤病报告与今晚比赛预计首发";
    const zhSummary = "休斯敦火箭今日主场迎战亚特兰大老鹰。赛前双方伤病报告与预计首发阵容出炉，火箭队全员保持健康状态出击，力争延续主场攻防强势表现。";
    await sql\`
      UPDATE publications
      SET title = \${zhTitle},
          summary = \${zhSummary},
          category = "news",
          tags = ARRAY["赛前前瞻", "伤病报告", "预计首发", "权威动态"]::text[],
          visibility = "public",
          eligible = true,
          updated_at = NOW()
      WHERE article_id = \${r.article_id}
    \`;
    await sql\`
      UPDATE articles
      SET summary = \${zhSummary}
      WHERE id = \${r.article_id}
    \`;
    console.log("Updated article " + r.article_id + " with Chinese title and summary!");
  }
  await closeDb();
}
fix().catch(e => { console.error(e); process.exit(1); });
'

echo "==> Verifying containers..."
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
  console.log('Hot injection and summary fix completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
