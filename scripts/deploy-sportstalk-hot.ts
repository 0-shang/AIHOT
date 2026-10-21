import { Client } from 'ssh2';

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
      console.log('1. Uploading source files and tarball to VPS...');
      await uploadFile(
        sftp,
        'packages/backend/src/publication/publish.ts',
        '/root/myhot/packages/backend/src/publication/publish.ts'
      );
      await uploadFile(
        sftp,
        'packages/backend/src/publication/items.ts',
        '/root/myhot/packages/backend/src/publication/items.ts'
      );
      await uploadFile(
        sftp,
        'apps/web/app/routes/podcasts.tsx',
        '/root/myhot/apps/web/app/routes/podcasts.tsx'
      );
      await uploadFile(
        sftp,
        'database/migrations/0051_fix_sportstalk_fertitta_and_ice_filter.sql',
        '/root/myhot/database/migrations/0051_fix_sportstalk_fertitta_and_ice_filter.sql'
      );
      await uploadFile(
        sftp,
        'scripts/sync-all-candidates.ts',
        '/root/myhot/scripts/sync-all-candidates.ts'
      );
      await uploadFile(
        sftp,
        'web-build.tar.gz',
        '/root/myhot/web-build.tar.gz'
      );

      console.log('2. Hot-injecting into Docker containers & applying migrations & syncing...');
      const remoteScript = `
        set -e
        mkdir -p /root/myhot/apps/web/build
        tar -xzf /root/myhot/web-build.tar.gz -C /root/myhot/apps/web/build
        rm -f /root/myhot/web-build.tar.gz

        # Copy backend files to worker and api
        docker cp /root/myhot/packages/backend/src/publication/publish.ts aihot-api-1:/app/packages/backend/src/publication/publish.ts
        docker cp /root/myhot/packages/backend/src/publication/publish.ts aihot-worker-1:/app/packages/backend/src/publication/publish.ts
        docker cp /root/myhot/packages/backend/src/publication/items.ts aihot-api-1:/app/packages/backend/src/publication/items.ts
        docker cp /root/myhot/packages/backend/src/publication/items.ts aihot-worker-1:/app/packages/backend/src/publication/items.ts

        # Copy web build & route to web container
        docker cp /root/myhot/apps/web/build/. aihot-web-1:/app/apps/web/build/
        docker cp /root/myhot/apps/web/app/routes/podcasts.tsx aihot-web-1:/app/apps/web/app/routes/podcasts.tsx

        # Copy migration & sync script to api
        docker cp /root/myhot/database/migrations/0051_fix_sportstalk_fertitta_and_ice_filter.sql aihot-api-1:/app/database/migrations/
        docker cp /root/myhot/scripts/sync-all-candidates.ts aihot-api-1:/app/scripts/sync-all-candidates.ts

        # Run database migration inside aihot-api-1
        echo "=== Running migrate.ts ==="
        docker exec aihot-api-1 node scripts/migrate.ts

        # Run podcast sync inside aihot-api-1
        echo "=== Running sync-all-candidates.ts ==="
        docker exec aihot-api-1 node scripts/sync-all-candidates.ts

        # Restart containers to load new code
        echo "=== Restarting Docker services ==="
        docker restart aihot-api-1 aihot-web-1 aihot-worker-1

        echo "=== Waiting for services to become ready ==="
        sleep 4

        # Test API response
        echo "=== Testing public API on VPS ==="
        curl -s "http://127.0.0.1:3000/api/site/pool?category=podcasts&source=rss-podcast-sportstalk790%25" | head -c 400
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
