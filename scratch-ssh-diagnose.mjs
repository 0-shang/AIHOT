import { Client } from 'ssh2';

const conn = new Client();

function runCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '', stderr = '';
      stream.on('data', d => stdout += d.toString());
      stream.stderr.on('data', d => stderr += d.toString());
      stream.on('close', () => resolve({ stdout: stdout.trim(), stderr: stderr.trim() }));
    });
  });
}

conn.on('ready', async () => {
  console.log('=== SSH 连接成功 ===\n');

  console.log('--- Docker 容器状态 ---');
  const ps = await runCommand(conn, 'cd /root/myhot 2>/dev/null && docker compose ps 2>/dev/null || cd /root && find . -maxdepth 3 -name "docker-compose.yml" -o -name "compose.yaml" 2>/dev/null | head -5');
  console.log(ps.stdout || ps.stderr || '(no output)');

  console.log('\n--- 查找项目目录 ---');
  const findProject = await runCommand(conn, 'find /root /home -maxdepth 3 \\( -name "docker-compose.yml" -o -name "compose.yaml" \\) 2>/dev/null | head -10');
  console.log(findProject.stdout || '(not found)');

  console.log('\n--- 监听端口 ---');
  const ports = await runCommand(conn, 'ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null');
  console.log(ports.stdout || ports.stderr || '(no output)');

  console.log('\n--- 防火墙状态 ---');
  const fw = await runCommand(conn, 'ufw status 2>/dev/null; echo "==="; iptables -L INPUT -n 2>/dev/null | head -15');
  console.log(fw.stdout || fw.stderr || '(no output)');

  console.log('\n--- Docker 版本 ---');
  const docker = await runCommand(conn, 'docker --version 2>/dev/null && docker compose version 2>/dev/null');
  console.log(docker.stdout || docker.stderr || 'Docker not installed');

  console.log('\n--- .env PORT 设置 ---');
  const envPort = await runCommand(conn, 'find /root /home -maxdepth 4 -name ".env" 2>/dev/null | head -5 | while read f; do echo "=== $f ==="; grep -i "port\\|SITE_URL\\|API_BASE" "$f" 2>/dev/null; done');
  console.log(envPort.stdout || '(no .env found)');

  conn.end();
});

conn.on('error', (err) => {
  console.error('SSH 连接失败:', err.message);
  process.exit(1);
});

conn.connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 15000,
});
