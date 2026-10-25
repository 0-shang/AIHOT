import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
echo "=== 1. ALL DOCKER CONTAINERS ==="
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== 2. PM2 PROCESSES ==="
pm2 list 2>/dev/null || echo "No pm2 installed or running"

echo ""
echo "=== 3. LISTENING PORTS & SERVICES ==="
ss -tulpn | grep LISTEN

echo ""
echo "=== 4. DIRECTORIES IN /root ==="
ls -la /root

echo ""
echo "=== 5. CRON JOBS ==="
crontab -l 2>/dev/null || echo "No crontab for root"
ls -la /etc/cron.* 2>/dev/null

echo ""
echo "=== 6. NON-SYSTEM PROCESSES RUNNING ==="
ps -eo pid,user,pmem,args --sort=-pmem | head -n 35
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.on('close', code => {
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', console.error).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
