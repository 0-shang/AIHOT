import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function main() {
  console.log('1. Creating tarball of apps/web/build...');
  execSync('tar -czf update_brand.tar.gz -C apps/web/build .');

  console.log('2. Connecting to VPS...');
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Connected to VPS');
    conn.sftp(async (err, sftp) => {
      if (err) {
        console.error('SFTP error:', err);
        conn.end();
        return;
      }

      try {
        console.log('3. Uploading update_brand.tar.gz...');
        await new Promise<void>((resolve, reject) => {
          sftp.fastPut('update_brand.tar.gz', '/root/myhot/update_brand.tar.gz', (e) => {
            if (e) reject(e);
            else resolve();
          });
        });

        console.log('4. Uploading brand image files...');
        const brandFiles = ['apple-icon.png', 'favicon.ico', 'icon-192.png', 'icon.png', 'splash.png', 'logo.svg'];
        for (const file of brandFiles) {
          const localP = path.join('industry/brand', file);
          const remoteP = `/root/myhot/industry/brand/${file}`;
          console.log(`Uploading ${file}...`);
          await new Promise<void>((resolve, reject) => {
            sftp.fastPut(localP, remoteP, (e) => {
              if (e) reject(e);
              else resolve();
            });
          });
        }

        console.log('5. Uploading apps/api/src/routes/static.ts...');
        await new Promise<void>((resolve, reject) => {
          sftp.fastPut('apps/api/src/routes/static.ts', '/root/myhot/apps/api/src/routes/static.ts', (e) => {
            if (e) reject(e);
            else resolve();
          });
        });

        console.log('6. Extracting and syncing to Docker containers...');
        const remoteCmd = `
          cd /root/myhot
          rm -rf apps/web/build/*
          tar -xzf update_brand.tar.gz -C apps/web/build/
          docker cp industry/brand/. aihot-web-1:/app/industry/brand/
          docker cp industry/brand/. aihot-api-1:/app/industry/brand/
          docker cp apps/web/build/. aihot-web-1:/app/apps/web/build/
          docker cp apps/api/src/routes/static.ts aihot-api-1:/app/apps/api/src/routes/static.ts
          rm -f update_brand.tar.gz
          docker restart aihot-api-1 aihot-web-1
        `;

        conn.exec(remoteCmd, (execErr, stream) => {
          if (execErr) {
            console.error('Exec error:', execErr);
            conn.end();
            return;
          }
          let out = '';
          stream
            .on('data', (d: Buffer) => {
              out += d.toString();
            })
            .on('close', () => {
              console.log(out);
              console.log('Brand deployment completed successfully!');
              conn.end();
            });
        });
      } catch (e) {
        console.error('Upload error:', e);
        conn.end();
      }
    });
  }).connect({
    host: HOST,
    port: 22,
    username: USERNAME,
    password: PASSWORD
  });
}

main().catch(console.error);
