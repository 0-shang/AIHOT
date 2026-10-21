import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('apt-get update -y && apt-get install -y zipalign apksigner', (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('Install result:\n' + out.slice(-500));
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
