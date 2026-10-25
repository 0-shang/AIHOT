import { Client } from 'ssh2';

const script = `
sed -n '/.method protected onCreate/,/.line 75/p' /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log('MainActivity onCreate start:\n', out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
