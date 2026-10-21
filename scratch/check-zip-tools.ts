import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('which zip unzip || apt-get install -y zip unzip', (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('Zip tools:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
