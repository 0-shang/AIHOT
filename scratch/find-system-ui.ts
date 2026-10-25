import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
echo "=== Grepping for system bar methods in smali ==="
grep -rn "setStatusBarColor" /root/myhot/apk_test_r/smali* || true
grep -rn "setNavigationBarColor" /root/myhot/apk_test_r/smali* || true
grep -rn "SYSTEM_UI_FLAG" /root/myhot/apk_test_r/smali* || true
grep -rn "setSystemUiVisibility" /root/myhot/apk_test_r/smali* || true
grep -rn "WindowInsetsController" /root/myhot/apk_test_r/smali* || true

echo "=== Checking Theme in AndroidManifest.xml ==="
grep -C 3 "android:theme" /root/myhot/apk_test_r/AndroidManifest.xml
`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
