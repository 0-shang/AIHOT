import { Client } from 'ssh2';
import * as fs from 'node:fs';
import * as path from 'node:path';

const sqlPath = path.resolve(import.meta.dirname, '../database/migrations/0052_clean_noisy_aggregator_and_tweets.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected, finishing migration and restarting containers...');

  // Escape SQL string for bash/node command
  const nodeRunner = `
import { sql, closeDb } from '@aihot/backend/db';
async function run() {
  console.log('Applying migration 0052...');
  const sql = (await import('@aihot/backend/db')).sql;
  await sql.unsafe(\`${sqlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  await sql\`INSERT INTO schema_migrations (name) VALUES ('0052_clean_noisy_aggregator_and_tweets.sql') ON CONFLICT (name) DO NOTHING\`;
  console.log('Migration 0052 applied successfully!');
  await (await import('@aihot/backend/db')).closeDb();
  process.exit(0);
}
run().catch(e => { console.error('Migration error:', e); process.exit(1); });
`;

  const script = `
docker exec aihot-api-1 node -e "${nodeRunner.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
echo "==> Restarting containers..."
docker restart aihot-web-1 aihot-api-1 aihot-worker-1
echo "==> Checking containers..."
sleep 2
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
`;

  conn.exec(script, (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      return;
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', (code: number) => {
      console.log('Finished with exit code:', code);
      conn.end();
    });
  });
}).on('error', (err) => {
  console.error('SSH error:', err);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
