import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const commands = `
grep -rn "splash:I" /root/myhot/apk_test_r/smali/com/kotlin/mNative/R*
`;
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('data', (d: Buffer) => process.stdout.write(d));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
