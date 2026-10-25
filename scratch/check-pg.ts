import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("docker exec aihot-db-1 psql -U aihot -d aihot -c \"SELECT pid, state, wait_event_type, wait_event, query FROM pg_stat_activity WHERE state != 'idle';\"", (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
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
