import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const localScript = path.resolve('scratch/patch_dark_helper.py');
const remoteScript = '/root/myhot/patch_dark_helper.py';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading patch_dark_helper.py...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream(localScript);
    const writeStream = sftp.createWriteStream(remoteScript);

    writeStream.on('close', () => {
      console.log('Script uploaded successfully. Running patching and build...');
      const commands = `
set -e
cd /root/myhot

echo "=== STEP 1: Running patch_dark_helper.py ==="
python3 /root/myhot/patch_dark_helper.py

echo "=== STEP 2: Verifying DarkThemeHelper.smali exists ==="
ls -lh /root/myhot/apk_test_r/smali/com/kotlin/mNative/util/DarkThemeHelper.smali

echo "=== STEP 3: Verifying SplashActivity smali onCreate ==="
grep -A 10 "invoke-super {p0, p1}, Landroid/app/Activity;->onCreate" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/splash/SplashActivity.smali

echo "=== STEP 4: Verifying MainActivity smali onCreate ==="
grep -A 10 "invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali

echo "=== STEP 5: Building APK with apktool ==="
rm -f /root/myhot/clutchwire_dark_12m.apk
apktool b /root/myhot/apk_test_r -o /root/myhot/clutchwire_dark_12m.apk

echo "=== STEP 6: Aligning APK ==="
rm -f /root/myhot/clutchwire_dark_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_dark_12m.apk /root/myhot/clutchwire_dark_aligned.apk

echo "=== STEP 7: Signing APK ==="
mkdir -p /root/myhot/apps/web/build/client/download
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_dark_aligned.apk

echo "=== STEP 8: Verifying APK signature & size ==="
apksigner verify -v /root/myhot/apps/web/build/client/download/clutchwire.apk
ls -lh /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 9: Deploying APK into Docker web container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 10: Verifying in container ==="
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 11: Testing Live Download HTTP Endpoint ==="
curl -I https://clutchwire.org/download/clutchwire.apk

echo "=== ALL DONE SUCCESSFULLY! ==="
`;
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d: Buffer) => process.stdout.write(d));
        stream.stderr.on('data', (d: Buffer) => process.stderr.write(d));
        stream.on('close', (code: number) => {
          console.log(`\nFinished with exit code ${code}`);
          conn.end();
        });
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
