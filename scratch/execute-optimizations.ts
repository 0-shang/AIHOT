import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Executing optimization steps...');

  const cmd = `
echo "=== 1. STOPPING AND DISABLING MULTIPATHD ==="
systemctl stop multipathd 2>&1 || true
systemctl disable multipathd 2>&1 || true

echo "=== 2. STOPPING YASI TWITTER BOT & PM2 DAEMON ==="
kill 2515533 2>&1 || true
pkill -f "tweets-automator/src/bot.js" 2>&1 || true
pkill -f "PM2" 2>&1 || true

echo "=== 3. CLEANING OLD LARGE LOG FILES ==="
ls -lh /root/doge_trade.log /root/trade_history.log 2>/dev/null || true
rm -f /root/doge_trade.log /root/trade_history.log

echo "=== 4. SYNC AND DROP PAGE CACHES ==="
sync
echo 3 > /proc/sys/vm/drop_caches

echo "=== 5. POST-CLEANUP STATUS ==="
uptime
free -h

echo "=== 6. TOP 10 MEMORY PROCESSES NOW ==="
ps -eo pid,user,pmem,args --sort=-pmem | head -n 12
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.on('close', (code) => {
      console.log('Execution finished with code:', code);
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
