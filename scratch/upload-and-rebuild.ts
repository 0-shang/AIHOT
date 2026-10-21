import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready.');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP ready. Uploading patch_apk.py and web-lite.tar.gz...');

    sftp.fastPut('scratch/patch_apk.py', '/root/myhot/patch_apk.py', (err) => {
      if (err) throw err;
      console.log('Uploaded patch_apk.py.');

      sftp.fastPut('scratch/web-lite.tar.gz', '/root/myhot/web-lite.tar.gz', (err) => {
        if (err) throw err;
        console.log('Uploaded web-lite.tar.gz.');

        const remoteCommands = `
set -e
echo "==> Running python3 patch_apk.py..."
python3 /root/myhot/patch_apk.py

echo "==> Rebuilding APK with apktool 3.0.3..."
java -jar /root/myhot/apktool.jar b /root/myhot/apk_decompiled -o /root/myhot/clutchwire_rebuilt.apk

echo "==> Aligning APK..."
rm -f /root/myhot/clutchwire_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_rebuilt.apk /root/myhot/clutchwire_aligned.apk

echo "==> Signing APK..."
rm -f /root/myhot/clutchwire_final.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/clutchwire_final.apk /root/myhot/clutchwire_aligned.apk
apksigner verify /root/myhot/clutchwire_final.apk

echo "==> Deploying web update..."
tar -xzf /root/myhot/web-lite.tar.gz -C /root/myhot/apps/web/
cp /root/myhot/clutchwire_final.apk /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "==> Updating docker container aihot-web-1..."
docker cp /root/myhot/apps/web/build aihot-web-1:/app/apps/web/
docker restart aihot-web-1

echo "==> Testing live status..."
sleep 2
curl -I https://clutchwire.org/download/clutchwire.apk?v=8
curl -I https://clutchwire.org/install
echo "==> ALL DEPLOYMENTS COMPLETED SUCCESSFULLY!"
`;

        conn.exec(remoteCommands, (err, stream) => {
          if (err) throw err;
          stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
          stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
          stream.on('close', (code: number) => {
            console.log('Process exited with code:', code);
            conn.end();
            process.exit(code || 0);
          });
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 15000
});
