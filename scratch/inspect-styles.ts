import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('/root/myhot/apk_decompiled/res/values/styles.xml')
root = tree.getroot()
for style in root.findall('style'):
    name = style.attrib.get('name', '')
    if name in ['SplashTheme', 'AppTheme']:
        print('=== Style:', name, 'parent:', style.attrib.get('parent', ''), '===')
        for item in style.findall('item'):
            print('  ', item.attrib.get('name'), '=', item.text)
"
`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
    stream.on('close', () => conn.end());
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
