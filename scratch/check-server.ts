import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH ready...');
  conn.exec('docker ps -a; echo "--- API LOGS ---"; docker logs --tail 30 aihot-api-1; echo "--- WEB LOGS ---"; docker logs --tail 30 aihot-web-1', (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', code => {
      console.log('Done code:', code);
      conn.end();
    });
  });
}).on('error', console.error).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
