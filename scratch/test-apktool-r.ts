import { Client } from 'ssh2';

const script = `
rm -rf /root/myhot/apk_test_r
apktool d -r -f /root/myhot/apps/web/build/client/download/clutchwire.apk -o /root/myhot/apk_test_r
echo "EXIT: $?"
ls -la /root/myhot/apk_test_r/
find /root/myhot/apk_test_r/smali* -name "*SplashActivity*.smali"
find /root/myhot/apk_test_r/smali* -name "*MainActivity*.smali"
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
