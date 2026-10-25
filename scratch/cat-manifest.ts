import { Client } from 'ssh2';

const script = `
python3 -c '
import xml.etree.ElementTree as ET
tree = ET.parse("/root/myhot/apk_decompiled/AndroidManifest.xml")
root = tree.getroot()
app = root.find("application")
print("Application attrs:", app.attrib)
for child in app:
    print("Tag:", child.tag, child.attrib)
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
