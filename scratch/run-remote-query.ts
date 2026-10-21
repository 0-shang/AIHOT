import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    sftp.fastPut('scripts/query-fertitta.ts', '/root/myhot/scripts/query-fertitta.ts', () => {
      conn.exec('docker cp /root/myhot/scripts/query-fertitta.ts aihot-api-1:/app/scripts/query-fertitta.ts && docker exec aihot-api-1 node scripts/query-fertitta.ts', (err, stream) => {
        let out = '';
        stream.on('data', d => out += d).on('close', () => {
          console.log(out);
          conn.end();
        });
      });
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
