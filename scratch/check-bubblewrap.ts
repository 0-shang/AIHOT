import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS, checking bubblewrap container...');
  conn.exec('docker run --rm ghcr.io/googlechromelabs/bubblewrap:latest bubblewrap --version', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', (d: Buffer) => {
      process.stdout.write(d.toString());
      out += d.toString();
    });
    stream.on('close', () => {
      console.log('\nFinished checking bubblewrap');
      conn.end();
    });
  });
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
