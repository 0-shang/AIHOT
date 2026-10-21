import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -n -A 20 "<style name=\\"AppTheme\\"" /root/myhot/apk_decompiled/res/values/styles.xml', (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('AppTheme definition:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
