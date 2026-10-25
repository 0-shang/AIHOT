import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
grep -n -C 5 "getWindow" /root/myhot/apk_test_r/smali/com/kotlin/mNative/activity/MainActivity.smali
`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
