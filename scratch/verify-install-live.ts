import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("curl -I https://clutchwire.org/install && curl -s https://clutchwire.org/install | grep -o '添加到手机桌面' && curl -s https://clutchwire.org/more | grep -o '安装指南'", (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d);
    stream.on('close', () => {
      console.log('Result:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
