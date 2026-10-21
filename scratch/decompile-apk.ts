import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('apktool d -f -s /root/myhot/apps/web/build/client/download/clutchwire.apk -o /root/myhot/apk_decompiled', (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('apktool output:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
