import { Client } from 'ssh2';

const script = `
which jadx || true
which d2j-dex2jar || true
which baksmali || true
find / -name "*baksmali*.jar" 2>/dev/null || true
find / -name "*jadx*" 2>/dev/null || true
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
