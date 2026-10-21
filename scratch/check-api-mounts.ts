import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec("docker inspect aihot-api-1 --format '{{ range .Mounts }}{{ .Source }} -> {{ .Destination }}\n{{ end }}'", (err, stream) => {
    let out = '';
    stream.on('data', d => out += d).on('close', () => {
      console.log('Mounts of aihot-api-1:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
