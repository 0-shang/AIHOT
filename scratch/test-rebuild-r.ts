import { Client } from 'ssh2';

const script = `
apktool b /root/myhot/apk_test_r -o /root/myhot/test_rebuild.apk
echo "EXIT: $?"
ls -lh /root/myhot/test_rebuild.apk
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
