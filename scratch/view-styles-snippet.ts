import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('sed -n "1840,1865p" /root/myhot/apk_decompiled/res/values/styles.xml', (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('Styles:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
