import { Client } from 'ssh2';

const script = `
cat /root/myhot/apk_decompiled/apktool.yml | head -n 30
echo "=== check aapt2 ==="
which aapt2 || true
aapt2 version || true
echo "=== check apktool version ==="
apktool -version
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
