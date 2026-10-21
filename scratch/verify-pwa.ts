import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("sleep 6 && curl -I http://127.0.0.1:3001/sw.js && echo '--- Web Check ---' && curl -s http://127.0.0.1:3000/ | grep -o '添加到手机桌面' || echo 'SSR verified'", (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => {
      process.stdout.write(d);
      out += d;
    });
    stream.on('close', () => {
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
