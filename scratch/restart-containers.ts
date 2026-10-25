import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Restarting containers to free RAM/Swap...');
  const cmd = `
docker restart aihot-web-1 aihot-api-1 aihot-worker-1
sleep 3
sync
echo 3 > /proc/sys/vm/drop_caches
uptime
free -h
docker ps --format "table {{.Names}}\t{{.Status}}"
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', code => {
      console.log('Done with code:', code);
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
