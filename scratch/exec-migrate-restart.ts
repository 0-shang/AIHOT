import { Client } from 'ssh2';
import * as path from 'node:path';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Uploading run-0052.ts...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut(
      path.resolve(import.meta.dirname, '../scripts/run-0052.ts'),
      '/root/myhot/scripts/run-0052.ts',
      (uploadErr) => {
        if (uploadErr) throw uploadErr;
        console.log('Uploaded run-0052.ts. Running migration and restarting...');

        const script = `
docker cp /root/myhot/scripts/run-0052.ts aihot-api-1:/app/scripts/run-0052.ts
docker exec aihot-api-1 node scripts/run-0052.ts
echo "==> Restarting web, api, and worker containers..."
docker restart aihot-web-1 aihot-api-1 aihot-worker-1
echo "==> Container status:"
sleep 3
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
`;

        conn.exec(script, (execErr, stream) => {
          if (execErr) throw execErr;
          stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
          stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
          stream.on('close', (code: number) => {
            console.log('Remote finished with code:', code);
            conn.end();
            process.exit(code || 0);
          });
        });
      }
    );
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
