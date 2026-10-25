import { Client } from 'ssh2';
import fs from 'node:fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading patch_dark.py via SFTP...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      process.exit(1);
    }

    const localStream = fs.createReadStream('scratch/patch_dark.py');
    const remoteStream = sftp.createWriteStream('/root/myhot/patch_apk_dark.py');

    remoteStream.on('close', () => {
      console.log('patch_dark.py uploaded successfully. Running patch & build script...');

      const cmd = `
set -e
echo "=== STEP 0: Clean up any backup files inside apk_decompiled ==="
find /root/myhot/apk_decompiled -name "*bak*" -delete

echo "=== STEP 1: Running python patcher ==="
python3 /root/myhot/patch_apk_dark.py

echo "=== STEP 2: Verifying patched files ==="
echo "--- values/styles.xml AppTheme ---"
grep -A 12 '<style name="AppTheme"' /root/myhot/apk_decompiled/res/values/styles.xml
echo "--- values/styles.xml SplashTheme ---"
grep -A 8 '<style name="SplashTheme"' /root/myhot/apk_decompiled/res/values/styles.xml
echo "--- AndroidManifest.xml SplashActivity ---"
grep -C 2 "SplashActivity" /root/myhot/apk_decompiled/AndroidManifest.xml
echo "--- activity_splash.xml ---"
cat /root/myhot/apk_decompiled/res/layout/activity_splash.xml

echo "=== STEP 3: Building APK with apktool ==="
rm -f /root/myhot/clutchwire_rebuilt.apk
apktool b /root/myhot/apk_decompiled -o /root/myhot/clutchwire_rebuilt.apk

echo "=== STEP 4: Aligning APK ==="
rm -f /root/myhot/clutchwire_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_rebuilt.apk /root/myhot/clutchwire_aligned.apk

echo "=== STEP 5: Signing APK ==="
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_aligned.apk

echo "=== STEP 6: Verifying APK signature ==="
apksigner verify /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 7: Deploying APK into container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 8: Verifying download file ==="
ls -lh /root/myhot/apps/web/build/client/download/clutchwire.apk
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk

echo "=== SUCCESS! ==="
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
