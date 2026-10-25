import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// 1. Prepare local web build bundle (server + client excluding download/)
console.log('STEP 1: Packaging local web build...');
const tarPath = path.resolve('scratch/web_update.tar.gz');
if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
execSync(`tar -czf "${tarPath}" -C apps/web/build --exclude="client/download" server client`);
console.log(`Web tarball ready: ${fs.statSync(tarPath).size} bytes`);

const localPyScript = path.resolve('scratch/patch_dark_helper_v2.py');
const remotePyScript = '/root/myhot/patch_dark_helper_v2.py';

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Uploading files...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    // Upload python script
    const pyRead = fs.createReadStream(localPyScript);
    const pyWrite = sftp.createWriteStream(remotePyScript);

    pyWrite.on('close', () => {
      console.log('Uploaded patch_dark_helper_v2.py.');

      // Upload web update tarball
      const webRead = fs.createReadStream(tarPath);
      const webWrite = sftp.createWriteStream('/tmp/web_update.tar.gz');

      webWrite.on('close', () => {
        console.log('Uploaded web_update.tar.gz. Starting build & deploy pipeline...');

        const commands = `
set -e
cd /root/myhot

echo "=== STEP 1: Deploying web app updates to aihot-web-1 ==="
mkdir -p /tmp/web_update_extracted
rm -rf /tmp/web_update_extracted/*
tar -xzf /tmp/web_update.tar.gz -C /tmp/web_update_extracted
docker cp /tmp/web_update_extracted/server/. aihot-web-1:/app/apps/web/build/server/
docker cp /tmp/web_update_extracted/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/

echo "=== STEP 2: Running patch_dark_helper_v2.py ==="
python3 /root/myhot/patch_dark_helper_v2.py

echo "=== STEP 3: Building 12MB APK with apktool ==="
rm -f /root/myhot/clutchwire_v2_12m.apk
apktool b /root/myhot/apk_test_r -o /root/myhot/clutchwire_v2_12m.apk

echo "=== STEP 4: Aligning APK ==="
rm -f /root/myhot/clutchwire_v2_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_v2_12m.apk /root/myhot/clutchwire_v2_aligned.apk

echo "=== STEP 5: Signing APK with production keystore ==="
mkdir -p /root/myhot/apps/web/build/client/download
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_v2_aligned.apk

echo "=== STEP 6: Verifying APK signature & size ==="
apksigner verify -v /root/myhot/apps/web/build/client/download/clutchwire.apk
ls -lh /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 7: Copying APK into Docker web container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== STEP 8: Restarting web container ==="
docker restart aihot-web-1
sleep 3

echo "=== STEP 9: Verifying container APK & live download ==="
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk
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

      webRead.pipe(webWrite);
    });

    pyRead.pipe(pyWrite);
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
