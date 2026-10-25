import { Client } from 'ssh2';
import fs from 'node:fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading patch_clean_smali.py via SFTP...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      process.exit(1);
    }

    const localStream = fs.createReadStream('scratch/patch_clean_smali.py');
    const remoteStream = sftp.createWriteStream('/root/myhot/patch_clean_smali.py');

    remoteStream.on('close', () => {
      console.log('patch_clean_smali.py uploaded successfully. Running patch & build script on clean_smali...');

      const cmd = `
set -e
echo "=== STEP 1: Running python patcher on clean_smali ==="
python3 /root/myhot/patch_clean_smali.py

echo "=== STEP 2: Verifying patched smali files ==="
ls -lh /root/myhot/clean_smali/smali/com/kotlin/mNative/util/DarkThemeHelper*
grep -A 4 "attachSplashOverlay" /root/myhot/clean_smali/smali/com/kotlin/mNative/activity/MainActivity.smali
grep -A 4 "setupThemeBridge" /root/myhot/clean_smali/smali/com/kotlin/mNative/activity/MainActivity.smali
grep -B 2 -A 4 "dismissSplashOverlay" /root/myhot/clean_smali/smali/com/kotlin/mNative/activity/MainActivity\\$onCreate\\$2.smali || true

echo "=== STEP 3: Building clean_smali with apktool ==="
rm -f /root/myhot/clutchwire_seamless.apk
apktool b /root/myhot/clean_smali -o /root/myhot/clutchwire_seamless.apk

echo "=== STEP 4: Aligning APK ==="
rm -f /root/myhot/clutchwire_seamless_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_seamless.apk /root/myhot/clutchwire_seamless_aligned.apk

echo "=== STEP 5: Signing APK ==="
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_seamless_aligned.apk

echo "=== STEP 6: Verifying APK signature ==="
apksigner verify /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 7: Deploying APK into container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 8: Verifying download file ==="
ls -lh /root/myhot/apps/web/build/client/download/clutchwire.apk
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk

echo "=== ALL APK STEPS SUCCESSFUL! ==="
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
