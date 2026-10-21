import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("java -version 2>&1 || echo 'No Java on host'", (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d);
    stream.on('close', () => {
      console.log('VPS java check:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
