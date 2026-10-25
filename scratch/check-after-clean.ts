import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
systemctl stop multipathd.socket 2>/dev/null || true
rm -f /root/doge_trade.log /root/trade_history.log
kill -9 $(pgrep -f "tweets-automator/src/bot.js") 2>/dev/null || true

echo "=== MEMORY STATUS ==="
free -h

echo "=== UPTIME & LOAD ==="
uptime

echo "=== RUNNING PROCESSES (TOP 12 MEM) ==="
ps -eo pid,user,pmem,args --sort=-pmem | head -n 13

echo "=== DISK USAGE ==="
df -h /
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', code => {
      console.log(out);
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
  readyTimeout: 30000
});
