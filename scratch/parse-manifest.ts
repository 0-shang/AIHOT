import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
python3 -c "
import xml.etree.ElementTree as ET
try:
    tree = ET.parse('/root/myhot/apk_decompiled/AndroidManifest.xml')
    root = tree.getroot()
    app = root.find('application')
    print('Application attributes:', app.attrib)
    for act in app.findall('activity'):
        print('Activity:', act.attrib)
except Exception as e:
    print('Error:', e)
"
`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
