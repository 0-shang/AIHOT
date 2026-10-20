import { Client } from 'ssh2';

const HOST = '45.32.112.31';
const USERNAME = 'root';
const PASSWORD = 'sN6,{U@hhw+SuoLU';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected');
  conn.exec('docker ps; echo "=== WEB LOGS ==="; docker logs --tail 25 aihot-web-1; echo "=== API LOGS ==="; docker logs --tail 25 aihot-api-1', (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      return;
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.on('close', () => {
      conn.end();
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect({
  host: HOST,
  port: 22,
  username: USERNAME,
  password: PASSWORD
});
