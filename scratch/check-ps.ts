import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('ps aux | grep -E "bubblewrap|docker"', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('Process list:\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
