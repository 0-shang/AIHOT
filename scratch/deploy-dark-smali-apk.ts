import { Client } from 'ssh2';
import fs from 'node:fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading patch_smali_and_rebuild.py via SFTP...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      process.exit(1);
    }

    const localStream = fs.createReadStream('scratch/patch_smali_and_rebuild.py');
    const remoteStream = sftp.createWriteStream('/root/myhot/patch_smali_and_rebuild.py');

    remoteStream.on('close', () => {
      console.log('patch_smali_and_rebuild.py uploaded successfully. Running pipeline...');

      const cmd = `
set -e
echo "=== STEP 1: Running python smali patcher ==="
python3 /root/myhot/patch_smali_and_rebuild.py

echo "=== STEP 2: Verifying patched smali in SplashActivity ==="
grep -A 15 "invoke-super {p0, p1}, Landroid/app/Activity;->onCreate" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/splash/SplashActivity.smali

echo "=== STEP 3: Verifying patched smali in MainActivity ==="
grep -A 15 "invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali
grep -A 6 "iput-object p1, p0, Lcom/kotlin/mNative/activity/MainActivity;->webView" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali

echo "=== STEP 4: Building APK with apktool ==="
rm -f /root/myhot/clutchwire_rebuilt.apk
apktool b /root/myhot/apk_test_r -o /root/myhot/clutchwire_rebuilt.apk

echo "=== STEP 5: Aligning APK ==="
rm -f /root/myhot/clutchwire_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_rebuilt.apk /root/myhot/clutchwire_aligned.apk
ls -lh /root/myhot/clutchwire_aligned.apk

echo "=== STEP 6: Signing APK ==="
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_aligned.apk

echo "=== STEP 7: Verifying APK signature ==="
apksigner verify -v /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 8: Deploying APK into running Docker web container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 9: Verifying live download file in container ==="
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk
docker exec aihot-web-1 sha256sum /app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 10: Testing HTTP HEAD request on live download route ==="
curl -I https://clutchwire.org/download/clutchwire.apk || true

echo "=== DEPLOYMENT COMPLETED PERFECTLY! ==="
`;

      conn.exec(cmd, (execErr, stream) => {
        if (execErr) {
          console.error('Exec error:', execErr);
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
    });

    localStream.pipe(remoteStream);
  });
}).on('error', (err) => {
  console.error('SSH Connection error:', err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 10000
});
