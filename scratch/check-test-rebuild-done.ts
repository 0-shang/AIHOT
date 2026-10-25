import { Client } from 'ssh2';

const script = `
ps aux | grep apktool | grep -v grep || true
ls -la /root/myhot/test_rebuild.apk 2>/dev/null || true
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
