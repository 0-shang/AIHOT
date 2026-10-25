import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'", (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
      process.exit(0);
    });
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
