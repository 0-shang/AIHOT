import { Client } from 'ssh2';

const script = `
python3 -c '
import re
with open("/root/myhot/apk_decompiled/AndroidManifest.xml", "r", encoding="utf-8") as f:
    text = f.read()

# remove <queries>...</queries>
text = re.sub(r"<queries>.*?</queries>", "", text, flags=re.DOTALL)

with open("/root/myhot/apk_decompiled/AndroidManifest.xml", "w", encoding="utf-8") as f:
    f.write(text)

print("Removed <queries> from AndroidManifest.xml")
'

echo "=== Running apktool b --use-aapt2 ==="
apktool b --use-aapt2 /root/myhot/apk_decompiled -o /root/myhot/test_aapt2_fixed.apk
echo "Exit code: $?"
ls -lh /root/myhot/test_aapt2_fixed.apk || true
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', (d: Buffer) => out += d.toString());
    stream.stderr.on('data', (d: Buffer) => out += d.toString());
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
