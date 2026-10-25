import { Client } from 'ssh2';

const script = `
set -e
echo "=== STEP 1: Check rebuilt APK ==="
ls -lh /root/myhot/clutchwire_rebuilt.apk

echo "=== STEP 2: Zipalign APK ==="
rm -f /root/myhot/clutchwire_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_rebuilt.apk /root/myhot/clutchwire_aligned.apk
ls -lh /root/myhot/clutchwire_aligned.apk

echo "=== STEP 3: Sign APK ==="
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_aligned.apk

echo "=== STEP 4: Verify APK signature ==="
apksigner verify -v /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 5: Deploy APK to Docker web container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 6: Verify file inside container ==="
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 7: Test curl download header ==="
curl -I http://127.0.0.1:3000/download/clutchwire.apk || true

echo "=== ALL FINISHED SUCCESSFULLY! ==="
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Running align, sign, deploy...');
  conn.exec(script, (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      process.exit(1);
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', (code: number) => {
      conn.end();
      process.exit(code || 0);
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
