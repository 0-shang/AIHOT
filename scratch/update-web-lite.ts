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
      console.log('Uploading web-lite.tar.gz...');
      await uploadFile(sftp, 'scratch/web-lite.tar.gz', '/root/myhot/web-lite.tar.gz');

      const script = `
set -e
cd /root/myhot
tar -xzf web-lite.tar.gz -C apps/web/build
docker cp apps/web/build/server/. aihot-web-1:/app/apps/web/build/server/
docker cp apps/web/build/client/assets/. aihot-web-1:/app/apps/web/build/client/assets/
docker restart aihot-web-1
`;
      const res = await execCommand(conn, script);
      console.log('Update Output:\n' + res);

    } catch (e) {
      console.error('Error:', e);
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
