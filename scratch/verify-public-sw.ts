import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("curl -I https://clutchwire.org/sw.js", (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d);
    stream.on('close', () => {
      console.log('sw.js public check:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
