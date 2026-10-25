import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Restarting aihot-worker-1...');
  conn.exec('docker restart aihot-worker-1 && docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log('Result:\n' + out);
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
