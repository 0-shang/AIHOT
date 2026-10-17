import { Client } from 'ssh2';
import fs from 'node:fs';
import path from 'node:path';

const conn = new Client();

const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

async function uploadDir(sftp: any, localDir: string, remoteDir: string) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = path.posix.join(remoteDir, entry.name);
    if (entry.isDirectory()) {
      await new Promise<void>((resolve, reject) => {
        sftp.mkdir(remotePath, (err: any) => {
          // Ignore if exists
          resolve();
        });
      });
      await uploadDir(sftp, localPath, remotePath);
    } else {
      await new Promise<void>((resolve, reject) => {
        sftp.fastPut(localPath, remotePath, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
}

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
        .on('close', (code: number) => {
          resolve(out);
        })
        .on('data', (data: Buffer) => {
          out += data.toString();
        })
        .stderr.on('data', (data: Buffer) => {
          out += data.toString();
        });
    });
  });
}

conn.on('ready', () => {
  console.log('SSH connection established to ' + HOST);
  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    try {
      console.log('1. Uploading industry/brand files...');
      await uploadDir(sftp, 'industry/brand', '/root/myhot/industry/brand');

      console.log('2. Uploading apps/web/build...');
      await uploadDir(sftp, 'apps/web/build', '/root/myhot/apps/web/build');

      console.log('3. Uploading contracts & routes...');
      await uploadFile(
        sftp,
        'packages/contracts/src/http-policy.ts',
        '/root/myhot/packages/contracts/src/http-policy.ts'
      );
      await uploadFile(
        sftp,
        'apps/api/src/routes/static.ts',
        '/root/myhot/apps/api/src/routes/static.ts'
      );

      console.log('4. Copying files into Docker containers & restarting...');
      const dockerCmd = `
        docker cp /root/myhot/industry/brand/. aihot-web-1:/app/industry/brand/
        docker cp /root/myhot/industry/brand/. aihot-api-1:/app/industry/brand/
        docker cp /root/myhot/apps/web/build/. aihot-web-1:/app/apps/web/build/
        docker cp /root/myhot/packages/contracts/src/http-policy.ts aihot-web-1:/app/packages/contracts/src/http-policy.ts
        docker cp /root/myhot/packages/contracts/src/http-policy.ts aihot-api-1:/app/packages/contracts/src/http-policy.ts
        docker cp /root/myhot/apps/api/src/routes/static.ts aihot-api-1:/app/apps/api/src/routes/static.ts
        docker restart aihot-api-1 aihot-web-1
      `;
      const result = await execCommand(conn, dockerCmd);
      console.log('Docker output:\n', result);

      console.log('Deployment complete!');
    } catch (e) {
      console.error('Error during deploy:', e);
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
