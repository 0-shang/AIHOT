import { Client } from 'ssh2';
import fs from 'node:fs';
import path from 'node:path';

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
      console.log('1. Uploading source files, api files, and web-build.tar.gz to VPS...');
      await uploadFile(
        sftp,
        'apps/api/src/routes/static.ts',
        '/root/myhot/apps/api/src/routes/static.ts'
      );
      await uploadFile(
        sftp,
        'apps/web/app/components/shell/Chrome.tsx',
        '/root/myhot/apps/web/app/components/shell/Chrome.tsx'
      );
      await uploadFile(
        sftp,
        'apps/web/server.ts',
        '/root/myhot/apps/web/server.ts'
      );
      await uploadFile(
        sftp,
        'web-build.tar.gz',
        '/root/myhot/web-build.tar.gz'
      );

      console.log('2. Hot-injecting into Docker containers & restarting services...');
      const remoteScript = `
        set -e
        mkdir -p /root/myhot/apps/web/build
        tar -xzf /root/myhot/web-build.tar.gz -C /root/myhot/apps/web/build
        rm -f /root/myhot/web-build.tar.gz

        # Copy API static route into aihot-api-1
        docker cp /root/myhot/apps/api/src/routes/static.ts aihot-api-1:/app/apps/api/src/routes/static.ts

        # Copy web build and server into aihot-web-1
        docker cp /root/myhot/apps/web/build/. aihot-web-1:/app/apps/web/build/
        docker cp /root/myhot/apps/web/app/components/shell/Chrome.tsx aihot-web-1:/app/apps/web/app/components/shell/Chrome.tsx
        docker cp /root/myhot/apps/web/server.ts aihot-web-1:/app/apps/web/server.ts

        # Restart containers to reload
        echo "=== Restarting aihot-api-1 and aihot-web-1 ==="
        docker restart aihot-api-1 aihot-web-1

        echo "=== Waiting for services to become ready ==="
        sleep 5

        # Verify assetlinks.json
        echo "=== Testing /.well-known/assetlinks.json on VPS ==="
        curl -s "http://127.0.0.1:3000/.well-known/assetlinks.json" | head -c 200

        # Verify APK download HTTP status & Content-Type
        echo -e "\n=== Testing /download/clutchwire.apk headers on VPS ==="
        curl -s -I "http://127.0.0.1:3000/download/clutchwire.apk" | head -n 6
      `;

      const result = await execCommand(conn, remoteScript);
      console.log('Remote execution output:\n' + result);
      console.log('\nHot injection completed successfully!');
    } catch (e) {
      console.error('Error during hot deployment:', e);
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
