import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("docker exec aihot-api-1 env | grep -E 'MODEL|LLM|ENABLED'", (err, stream) => {
    let out = '';
    stream.on('data', d => out += d).on('close', () => {
      console.log('VPS Model Env:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
