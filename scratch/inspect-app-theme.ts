import { Client } from 'ssh2';

const script = `
echo "=== 1. Find all styles.xml ==="
find /root/myhot/apk_decompiled/res -name "styles.xml"

echo "=== 2. Show AppTheme in each styles.xml ==="
for f in $(find /root/myhot/apk_decompiled/res -name "styles.xml"); do
  echo "--- FILE: $f ---"
  grep -A 15 'name="AppTheme"' $f || true
done

echo "=== 3. Search smali for statusBarColor and navigationBarColor ==="
grep -rn "setStatusBarColor" /root/myhot/apk_decompiled/smali* || true
grep -rn "setNavigationBarColor" /root/myhot/apk_decompiled/smali* || true
grep -rn "SYSTEM_UI_FLAG_LIGHT" /root/myhot/apk_decompiled/smali* || true
grep -rn "SYSTEM_UI_FLAG_LIGHT_STATUS_BAR" /root/myhot/apk_decompiled/smali* || true
grep -rn "SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR" /root/myhot/apk_decompiled/smali* || true

echo "=== 4. Search SplashActivity in smali ==="
find /root/myhot/apk_decompiled/smali* -name "*SplashActivity*.smali"
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
