import { Client } from 'ssh2';

const script = `
apktool b /root/myhot/apk_decompiled -o /root/myhot/clutchwire_rebuilt.apk > /root/myhot/apktool_build.log 2>&1 || true
echo "Log size:"
wc -l /root/myhot/apktool_build.log
echo "--- First 30 lines ---"
head -n 30 /root/myhot/apktool_build.log
echo "--- Last 50 lines ---"
tail -n 50 /root/myhot/apktool_build.log
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
