import { Client } from 'ssh2';
import net from 'node:net';

const LOCAL_PORT = 3000;
const REMOTE_HOST = '127.0.0.1';
const REMOTE_PORT = 80;

const sshConfig = {
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 15000,
};

const conn = new Client();

conn.on('ready', () => {
  console.log('SSH 连接成功！');
  console.log(`正在建立隧道: 本地 localhost:${LOCAL_PORT} → VPS 127.0.0.1:${REMOTE_PORT}`);

  const localServer = net.createServer((localSocket) => {
    conn.forwardOut(
      '127.0.0.1', 0,
      REMOTE_HOST, REMOTE_PORT,
      (err, remoteStream) => {
        if (err) {
          console.error('转发失败:', err.message);
          localSocket.end();
          return;
        }
        localSocket.pipe(remoteStream).pipe(localSocket);
      }
    );
  });

  localServer.listen(LOCAL_PORT, '127.0.0.1', () => {
    console.log(`\n✅ 隧道已建立！请在浏览器打开: http://localhost:${LOCAL_PORT}`);
    console.log('按 Ctrl+C 关闭隧道\n');
  });

  localServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ 端口 ${LOCAL_PORT} 已被占用，请先关闭占用该端口的程序`);
      conn.end();
      process.exit(1);
    }
    console.error('本地服务器错误:', err.message);
  });
});

conn.on('error', (err) => {
  console.error('SSH 连接失败:', err.message);
  process.exit(1);
});

conn.on('close', () => {
  console.log('SSH 连接已关闭');
  process.exit(0);
});

conn.connect(sshConfig);
