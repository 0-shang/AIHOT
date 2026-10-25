import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
    cd /root/myhot
    echo "=== GIT STATUS ON VPS ==="
    git status -s
    echo "=== DOCKER CONTAINERS ON VPS ==="
    docker ps
    echo "=== DOCKER WEB LOGS (last 20 lines) ==="
    docker logs --tail 20 aihot-web-1
    echo "=== DOCKER API LOGS (last 20 lines) ==="
    docker logs --tail 20 aihot-api-1
  `, (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      return;
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', () => {
      conn.end();
    });
  });
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 10000
});
