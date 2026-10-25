import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
    echo "=== 1. Checking pg-boss schedules in Postgres ==="
    docker exec aihot-db-1 psql -U aihot -d aihot -c "
      SELECT name, cron, timezone, active FROM pgboss.schedule WHERE name LIKE '%rockets%' OR name LIKE '%sync%';
    "
    echo "=== 2. Checking job_runs in Postgres ==="
    docker exec aihot-db-1 psql -U aihot -d aihot -c "
      SELECT id, name, status, started_at, finished_at, error FROM job_runs WHERE name LIKE '%rockets%' ORDER BY id DESC LIMIT 5;
    "
    echo "=== 3. Checking all cron schedules in pgboss ==="
    docker exec aihot-db-1 psql -U aihot -d aihot -c "
      SELECT name, cron, timezone FROM pgboss.schedule ORDER BY name;
    "
  `, (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      return;
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', () => {
      conn.end();
    });
  });
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 10000
});
