import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
# Stop multipathd completely
systemctl stop multipathd.socket multipathd.service 2>/dev/null || true
systemctl disable multipathd.socket multipathd.service 2>/dev/null || true

# Stop PM2 and Twitter bot
pkill -9 -f "bot.js" 2>/dev/null || true
pkill -9 -f "PM2" 2>/dev/null || true

# Remove old big trade logs
rm -f /root/doge_trade.log /root/trade_history.log

# Drop OS page cache
sync
echo 3 > /proc/sys/vm/drop_caches

echo "=== MEMORY AFTER OPTIMIZATION ==="
free -h

echo "=== UPTIME & LOAD ==="
uptime

echo "=== TOP RUNNING PROCESSES ==="
ps -eo pid,user,pmem,args --sort=-pmem | head -n 12
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', code => {
      console.log(out);
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
