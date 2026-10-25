import { Client } from 'ssh2';

const script = `
ls -la /root/myhot/apk_decompiled/
head -n 30 /root/myhot/apk_decompiled/AndroidManifest.xml
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
