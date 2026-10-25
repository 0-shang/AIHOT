import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
echo "=== 1. MEMORY USAGE ==="
free -h

echo "=== 2. LOAD AVERAGE ==="
uptime

echo "=== 3. CHECKING STOPPED SERVICES ==="
ps -ef | grep -E "multipath|bot.js|PM2" | grep -v grep || echo "Confirmed: All target services are stopped!"

echo "=== 4. CHECKING LOG FILES ==="
ls -lh /root/doge_trade.log /root/trade_history.log 2>/dev/null || echo "Confirmed: 50MB+ trade logs deleted!"
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
