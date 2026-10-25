import { Client } from 'ssh2';

const script = `
python3 -c '
with open("/root/myhot/apktool_build.log", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

lines = text.splitlines()
print(f"Total lines: {len(lines)}")
for i, l in enumerate(lines):
    if len(l) > 500:
        print(f"Line {i} is very long ({len(l)} chars): {l[:100]}...{l[-100:]}")
    else:
        print(f"Line {i}: {l}")
'
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
