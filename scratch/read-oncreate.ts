import { Client } from 'ssh2';

const script = `
echo "=== SplashActivity.smali onCreate ==="
grep -A 35 "onCreate(" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/splash/SplashActivity.smali || true

echo "=== MainActivity.smali onCreate ==="
grep -A 35 "onCreate(" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali || true
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
