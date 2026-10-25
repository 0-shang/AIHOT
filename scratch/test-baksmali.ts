import { Client } from 'ssh2';

const script = `
java -cp /root/myhot/apktool.jar org.jf.baksmali.Main --version || true
java -cp /root/myhot/apktool.jar org.jf.smali.Main --version || true
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('Result:\n', out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
