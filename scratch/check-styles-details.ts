import { Client } from 'ssh2';

const script = `
echo "=== values/styles.xml ==="
cat /root/myhot/apk_decompiled/res/values/styles.xml | grep -A 25 '<style name="AppTheme"'

echo "=== values-v26/styles.xml ==="
if [ -f /root/myhot/apk_decompiled/res/values-v26/styles.xml ]; then
  cat /root/myhot/apk_decompiled/res/values-v26/styles.xml
fi

echo "=== values-v28/styles.xml ==="
if [ -f /root/myhot/apk_decompiled/res/values-v28/styles.xml ]; then
  cat /root/myhot/apk_decompiled/res/values-v28/styles.xml
fi

echo "=== values-v31/styles.xml ==="
if [ -f /root/myhot/apk_decompiled/res/values-v31/styles.xml ]; then
  cat /root/myhot/apk_decompiled/res/values-v31/styles.xml
fi

echo "=== values/colors.xml ==="
grep -E "colorPrimary|colorAccent|windowBackground" /root/myhot/apk_decompiled/res/values/colors.xml || true
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
