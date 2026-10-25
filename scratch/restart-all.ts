import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Restarting services via docker compose...');
  conn.exec('cd /root/myhot && docker compose restart api web worker && docker compose ps', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log('Restart output:\n' + out);
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
