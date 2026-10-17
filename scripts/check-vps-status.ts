import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    cat /root/myhot/.env | grep -E "SITE_URL|DOMAIN"
    echo "--- internal checks ---"
    docker exec aihot-api-1 curl -s -I http://localhost:4000/splash.png
    docker exec aihot-web-1 curl -s -I http://localhost:3000/logo.svg
    docker exec aihot-web-1 curl -s -I http://localhost:3000/icon.png
    docker exec aihot-web-1 curl -s -I http://localhost:3000/favicon.ico
  `;
  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream
      .on('data', (d: Buffer) => (out += d.toString()))
      .on('close', () => {
        console.log(out);
        conn.end();
      });
  });
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
