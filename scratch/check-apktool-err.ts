import { Client } from 'ssh2';

const script = `
apktool b /root/myhot/apk_decompiled -o /root/myhot/clutchwire_rebuilt.apk 2>&1 | tail -n 40
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('apktool tail output:\n', out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
