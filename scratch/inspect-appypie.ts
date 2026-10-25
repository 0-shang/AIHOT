import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
echo "=== 1. Activities in AndroidManifest.xml ==="
grep -B 2 -A 8 "activity android:name" /root/myhot/apk_test_r/AndroidManifest.xml

echo "=== 2. SplashActivity layout ==="
find /root/myhot/apk_test_r/res -name "*splash*"

echo "=== 3. SplashActivity smali onCreate ==="
sed -n '/\.method.*onCreate/,/\.end method/p' /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/splash/SplashActivity.smali | head -n 45

echo "=== 4. MainActivity smali onCreate ==="
sed -n '/\.method.*onCreate/,/\.end method/p' /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali | head -n 45
`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
