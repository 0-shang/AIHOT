import { Client } from 'ssh2';

const script = `
echo "=== Search splash in res/layout ==="
find /root/myhot/apk_decompiled/res/layout* -name "*splash*"

echo "=== View splash layout if exists ==="
for f in $(find /root/myhot/apk_decompiled/res/layout* -name "*splash*"); do
  echo "--- $f ---"
  cat $f
done

echo "=== Search SplashActivity in AndroidManifest.xml ==="
grep -C 5 "SplashActivity" /root/myhot/apk_decompiled/AndroidManifest.xml
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
