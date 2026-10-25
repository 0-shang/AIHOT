import { Client } from 'ssh2';

const script = `
python3 -c '
with open("/root/myhot/apktool_build.log", "r") as f:
    text = f.read()
import re
print("File length:", len(text))
for line in text.splitlines():
    if "Exception" in line or "error" in line.lower() or "brut" in line:
        print(line[:160])
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
