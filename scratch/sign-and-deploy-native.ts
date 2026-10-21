import { Client } from 'ssh2';
import fs from 'node:fs';

const conn = new Client();
const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function uploadFile(sftp: any, localFile: string, remoteFile: string) {
  await new Promise<void>((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function execCommand(conn: Client, cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream
        .on('close', () => resolve(out))
        .on('data', (data: Buffer) => { out += data.toString(); })
        .stderr.on('data', (data: Buffer) => { out += data.toString(); });
    });
  });
}

conn.on('ready', () => {
  console.log('SSH connected to ' + HOST);
  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    try {
      console.log('1. Uploading native_ws.tar.gz and signing.keystore...');
      await uploadFile(sftp, 'scratch/native_ws.tar.gz', '/root/myhot/native_ws.tar.gz');
      await uploadFile(sftp, 'scratch/extracted_fullscreen/signing.keystore', '/root/myhot/signing.keystore');

      console.log('2. Building, aligning, and signing native APK on VPS...');
      const script = `
set -e
cd /root/myhot

# Unpack workspace
rm -rf native_apk_ws
mkdir -p native_apk_ws
tar -xzf native_ws.tar.gz -C native_apk_ws

# Create uncompressed/standard zip
cd native_apk_ws
rm -rf META-INF
rm -f ../clutchwire_unsigned.apk
zip -r -0 ../clutchwire_unsigned.apk . > /dev/null
cd /root/myhot

# 4-byte align the APK
rm -f clutchwire_aligned.apk
zipalign -v -p 4 clutchwire_unsigned.apk clutchwire_aligned.apk > /dev/null

# Sign the APK with release keystore
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks signing.keystore --ks-pass pass:OkKmlf_3MR99 --key-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk clutchwire_aligned.apk

# Verify signature
echo "=== APK SIGNATURE VERIFICATION ==="
apksigner verify -v /root/myhot/apps/web/build/client/download/clutchwire.apk

# Copy into container
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== DEPLOYED FILE DETAILS ==="
ls -lh /root/myhot/apps/web/build/client/download/clutchwire.apk
`;
      const res = await execCommand(conn, script);
      console.log('Build Output:\n' + res);

    } catch (e) {
      console.error('Build error:', e);
    } finally {
      conn.end();
    }
  });
}).connect({
  host: HOST,
  port: 22,
  username: USERNAME,
  password: PASSWORD
});
