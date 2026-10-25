import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected successfully.');
  const cmd = `
echo "=== TOP CPU PROCESSES ==="
ps -eo pid,user,%cpu,%mem,comm,args --sort=-%cpu | head -n 15

echo "=== TOP MEM PROCESSES ==="
ps -eo pid,user,%cpu,%mem,comm,args --sort=-%mem | head -n 15

echo "=== DOCKER CONTAINERS ==="
docker ps --format "table {{.Names}}\t{{.Status}}"
`;

  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      return;
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', (code: number) => {
      console.log('Finished with code:', code);
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 45000
});
