import { Client } from 'ssh2';

const conn = new Client();
conn.on('error', (err) => {
  console.error('SSH Error:', err);
});
conn.on('ready', () => {
  console.log('SSH Ready!');
  conn.exec('ls -l /proc/55933/fd | tail -n 25', (err, stream) => {
    if (err) throw err;
    stream.on('data', (d: Buffer) => process.stdout.write(d));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
