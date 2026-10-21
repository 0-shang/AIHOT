import { Client } from 'ssh2';

const script = `
set -e
echo "==> 1. Updating res/values/styles.xml with python3..."
python3 -c '
import re

path = "/root/myhot/apk_decompiled/res/values/styles.xml"
with open(path, "r", encoding="utf-8") as f:
    xml = f.read()

new_theme = """    <style name="AppTheme" parent="@style/Theme.MaterialComponents.Light.NoActionBar.Bridge">
        <item name="android:fitsSystemWindows">true</item>
        <item name="bottomSheetDialogTheme">@style/AppBottomSheetDialogTheme</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="android:statusBarColor">#ff0c1015</item>
        <item name="android:navigationBarColor">#ff0c1015</item>
        <item name="android:windowBackground">#ff0c1015</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
    </style>"""

xml = re.sub(r"<style name=\"AppTheme\" parent=\"[^\"]*\">.*?</style>", new_theme, xml, flags=re.DOTALL)
with open(path, "w", encoding="utf-8") as f:
    f.write(xml)
print("styles.xml patched")
'

echo "==> 2. Updating res/values-night/styles.xml with python3..."
python3 -c '
path = "/root/myhot/apk_decompiled/res/values-night/styles.xml"
with open(path, "r", encoding="utf-8") as f:
    xml = f.read()

if "name=\\"AppTheme\\"" not in xml:
    injection = """    <style name="AppTheme" parent="@style/Theme.MaterialComponents.DayNight.NoActionBar.Bridge">
        <item name="android:fitsSystemWindows">true</item>
        <item name="bottomSheetDialogTheme">@style/AppBottomSheetDialogTheme</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="android:statusBarColor">#ff0c1015</item>
        <item name="android:navigationBarColor">#ff0c1015</item>
        <item name="android:windowBackground">#ff0c1015</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
    </style>
</resources>"""
    xml = xml.replace("</resources>", injection)
    with open(path, "w", encoding="utf-8") as f:
        f.write(xml)
    print("values-night/styles.xml patched")
else:
    print("values-night/styles.xml already has AppTheme")
'

echo "==> 3. Updating res/values/colors.xml with python3..."
python3 -c '
import re

path = "/root/myhot/apk_decompiled/res/values/colors.xml"
with open(path, "r", encoding="utf-8") as f:
    xml = f.read()

xml = re.sub(r"<color name=\"colorAccent\">#[0-9a-fA-F]+</color>", "<color name=\"colorAccent\">#ffce1141</color>", xml)
xml = re.sub(r"<color name=\"colorPrimary\">#[0-9a-fA-F]+</color>", "<color name=\"colorPrimary\">#ff0c1015</color>", xml)
xml = re.sub(r"<color name=\"colorPrimaryDark\">#[0-9a-fA-F]+</color>", "<color name=\"colorPrimaryDark\">#ff0c1015</color>", xml)

with open(path, "w", encoding="utf-8") as f:
    f.write(xml)
print("colors.xml patched")
'

echo "==> 4. Building APK with apktool..."
apktool b /root/myhot/apk_decompiled -o /root/myhot/clutchwire_rebuilt.apk

echo "==> 5. Aligning APK with zipalign..."
rm -f /root/myhot/clutchwire_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_rebuilt.apk /root/myhot/clutchwire_aligned.apk

echo "==> 6. Signing APK with apksigner..."
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_aligned.apk

echo "==> 7. Verifying APK signature..."
apksigner verify /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "==> 8. Copying to running web container..."
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "==> SUCCESS! Dark-styled APK is deployed."
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Executing patch and rebuild...');
  conn.exec(script, (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      process.exit(1);
    }
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', (code: number) => {
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', (err) => {
  console.error('SSH Connection error:', err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 10000
});
