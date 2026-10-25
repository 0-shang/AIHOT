import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected.');
  const cmd = `
docker exec aihot-db-1 psql -U postgres -d aihot -c "
SELECT
  relname,
  n_live_tup,
  n_dead_tup,
  last_vacuum,
  last_autovacuum,
  last_analyze
FROM pg_stat_user_tables
WHERE relname IN ('publications', 'pool_search', 'articles', 'sources');
"

docker exec aihot-db-1 psql -U postgres -d aihot -c "
VACUUM ANALYZE publications;
VACUUM ANALYZE pool_search;
VACUUM ANALYZE sources;
"
echo "=== VACUUM DONE ==="
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', code => {
      console.log('Done code:', code);
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', console.error).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 45000
});
