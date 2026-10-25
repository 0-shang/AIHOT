import { Client } from 'ssh2';

const script = `
echo "Testing apktool with --use-aapt2..."
apktool b --use-aapt2 /root/myhot/apk_decompiled -o /root/myhot/test_aapt2.apk
echo "Exit code: $?"
ls -lh /root/myhot/test_aapt2.apk || true
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
