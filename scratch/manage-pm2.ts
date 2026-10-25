import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
echo "=== PM2 CMDLINE ==="
cat /proc/923/cmdline | tr '\\0' ' ' || true
echo ""

echo "=== FINDING PM2 ==="
which pm2 || true
find / -name pm2 2>/dev/null || true

echo "=== KILLING BOT AND PM2 ==="
kill -9 923 $(pgrep -f "bot.js") 2>/dev/null || true
sleep 1
ps -ef | grep -E "bot.js|PM2" | grep -v grep || echo "Both successfully killed!"

echo "=== CLEANING OLD LOGS ==="
rm -f /root/doge_trade.log /root/trade_history.log
ls -lh /root/*.log 2>/dev/null || echo "No large logs remaining"
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
