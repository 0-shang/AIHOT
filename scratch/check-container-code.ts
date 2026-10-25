import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('docker exec aihot-api-1 grep lastStandingsCheckMs /app/packages/backend/src/nba/pipeline.ts || echo "NOT_FOUND"', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Result:\n' + out);
      conn.end();
      process.exit(0);
    });
  });
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
