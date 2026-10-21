import { Client } from 'ssh2';
import * as fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Testing hot poster endpoint on VPS...');
  conn.exec("curl -I http://127.0.0.1:3001/og/posters/hot.png && curl -s http://127.0.0.1:3000/hot | grep -o '生成热点海报'", (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => {
      process.stdout.write(d);
      out += d;
    });
    stream.on('close', () => {
      console.log('\n--- Downloading hot poster to local file for preview ---');
      conn.sftp((err, sftp) => {
        if (err) {
          conn.end();
          return;
        }
        // First curl it to a file on VPS
        conn.exec("curl -s http://127.0.0.1:3001/og/posters/hot.png > /tmp/hot-poster-preview.png", (err, s2) => {
          s2.on('close', () => {
            sftp.fastGet('/tmp/hot-poster-preview.png', 'scratch/hot-poster-preview.png', (err) => {
              if (err) console.error('SFTP fastGet error:', err);
              else console.log('Successfully saved to scratch/hot-poster-preview.png !');
              conn.end();
            });
          });
        });
      });
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
