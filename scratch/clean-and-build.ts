import { Client } from 'ssh2';

const script = `
rm -f /root/myhot/apk_decompiled/res/drawable/*avd*
rm -f /root/myhot/apk_decompiled/res/drawable/*checkbox*
rm -f /root/myhot/apk_decompiled/res/drawable/*switch_thumb*

# remove entries for them in public.xml
python3 -c '
with open("/root/myhot/apk_decompiled/res/values/public.xml", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = [l for l in lines if not any(k in l for k in ["avd_", "checkbox", "switch_thumb"])]

with open("/root/myhot/apk_decompiled/res/values/public.xml", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
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
