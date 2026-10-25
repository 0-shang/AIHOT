import { Client } from 'ssh2';

const script = `
set -e
echo "=== 1. Writing standalone python patcher on VPS ==="
cat << 'EOF' > /root/myhot/patch_apk_dark.py
import re
import os

base_dir = "/root/myhot/apk_decompiled"

# --- 1. res/values/styles.xml ---
styles_path = os.path.join(base_dir, "res/values/styles.xml")
with open(styles_path, "r", encoding="utf-8") as f:
    styles = f.read()

app_theme = """    <style name="AppTheme" parent="@style/Theme.MaterialComponents.NoActionBar.Bridge">
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

styles = re.sub(r"[ \t]*<style name=\"AppTheme\" parent=\"[^\"]*\">.*?</style>", app_theme, styles, flags=re.DOTALL)

if 'name="SplashTheme"' not in styles:
    splash_theme = """
    <style name="SplashTheme" parent="@style/Theme.MaterialComponents.NoActionBar.Bridge">
        <item name="android:windowBackground">#ff0c1015</item>
        <item name="android:statusBarColor">#ff0c1015</item>
        <item name="android:navigationBarColor">#ff0c1015</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
    </style>
</resources>"""
    styles = styles.replace("</resources>", splash_theme)

with open(styles_path, "w", encoding="utf-8") as f:
    f.write(styles)
print("-> styles.xml updated successfully")

# --- 2. res/values-night/styles.xml ---
night_styles_path = os.path.join(base_dir, "res/values-night/styles.xml")
with open(night_styles_path, "r", encoding="utf-8") as f:
    night_styles = f.read()

app_theme_night = """    <style name="AppTheme" parent="@style/Theme.MaterialComponents.DayNight.NoActionBar.Bridge">
        <item name="android:fitsSystemWindows">true</item>
        <item name="bottomSheetDialogTheme">@style/AppBottomSheetDialogTheme</item>
        <item name="colorAccent">#ffce1141</item>
        <item name="colorPrimary">#ff0c1015</item>
        <item name="colorPrimaryDark">#ff0c1015</item>
        <item name="android:statusBarColor">#ff0c1015</item>
        <item name="android:navigationBarColor">#ff0c1015</item>
        <item name="android:windowBackground">#ff0c1015</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
    </style>"""

if 'name="AppTheme"' in night_styles:
    night_styles = re.sub(r"[ \t]*<style name=\"AppTheme\" parent=\"[^\"]*\">.*?</style>", app_theme_night, night_styles, flags=re.DOTALL)
else:
    night_styles = night_styles.replace("</resources>", app_theme_night + "\n</resources>")

if 'name="SplashTheme"' not in night_styles:
    splash_theme_night = """
    <style name="SplashTheme" parent="@style/Theme.MaterialComponents.DayNight.NoActionBar.Bridge">
        <item name="android:windowBackground">#ff0c1015</item>
        <item name="android:statusBarColor">#ff0c1015</item>
        <item name="android:navigationBarColor">#ff0c1015</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
    </style>
</resources>"""
    night_styles = night_styles.replace("</resources>", splash_theme_night)

with open(night_styles_path, "w", encoding="utf-8") as f:
    f.write(night_styles)
print("-> values-night/styles.xml updated successfully")

# --- 3. res/values/colors.xml ---
colors_path = os.path.join(base_dir, "res/values/colors.xml")
with open(colors_path, "r", encoding="utf-8") as f:
    colors = f.read()

colors = re.sub(r"<color name=\"colorAccent\">#[0-9a-fA-F]+</color>", "<color name=\"colorAccent\">#ffce1141</color>", colors)
colors = re.sub(r"<color name=\"colorPrimary\">#[0-9a-fA-F]+</color>", "<color name=\"colorPrimary\">#ff0c1015</color>", colors)
colors = re.sub(r"<color name=\"colorPrimaryDark\">#[0-9a-fA-F]+</color>", "<color name=\"colorPrimaryDark\">#ff0c1015</color>", colors)

with open(colors_path, "w", encoding="utf-8") as f:
    f.write(colors)
print("-> colors.xml updated successfully")

# --- 4. res/layout/activity_splash.xml ---
splash_layout_path = os.path.join(base_dir, "res/layout/activity_splash.xml")
with open(splash_layout_path, "r", encoding="utf-8") as f:
    splash_layout = f.read()

splash_layout = splash_layout.replace('android:background="@color/white"', 'android:background="#ff0c1015"')
with open(splash_layout_path, "w", encoding="utf-8") as f:
    f.write(splash_layout)
print("-> activity_splash.xml updated successfully")

# --- 5. AndroidManifest.xml ---
manifest_path = os.path.join(base_dir, "AndroidManifest.xml")
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = f.read()

manifest = manifest.replace(
    'android:name="com.kotlin.mNative.activity.splash.SplashActivity" android:theme="@android:style/Theme.Translucent.NoTitleBar"',
    'android:name="com.kotlin.mNative.activity.splash.SplashActivity" android:theme="@style/SplashTheme"'
)
with open(manifest_path, "w", encoding="utf-8") as f:
    f.write(manifest)
print("-> AndroidManifest.xml updated successfully")

EOF

echo "=== 2. Running patcher ==="
python3 /root/myhot/patch_apk_dark.py

echo "=== 3. Verifying patched files ==="
echo "--- values/styles.xml ---"
grep -A 12 '<style name="AppTheme"' /root/myhot/apk_decompiled/res/values/styles.xml
grep -A 8 '<style name="SplashTheme"' /root/myhot/apk_decompiled/res/values/styles.xml

echo "--- AndroidManifest.xml SplashActivity ---"
grep -C 2 "SplashActivity" /root/myhot/apk_decompiled/AndroidManifest.xml

echo "--- activity_splash.xml ---"
cat /root/myhot/apk_decompiled/res/layout/activity_splash.xml

echo "=== 4. Building APK with apktool ==="
rm -f /root/myhot/clutchwire_rebuilt.apk
apktool b /root/myhot/apk_decompiled -o /root/myhot/clutchwire_rebuilt.apk

echo "=== 5. Aligning APK ==="
rm -f /root/myhot/clutchwire_aligned.apk
zipalign -v -p 4 /root/myhot/clutchwire_rebuilt.apk /root/myhot/clutchwire_aligned.apk

echo "=== 6. Signing APK ==="
rm -f /root/myhot/apps/web/build/client/download/clutchwire.apk
apksigner sign --ks /root/myhot/signing.keystore --ks-pass pass:OkKmlf_3MR99 --ks-key-alias clutchwire --out /root/myhot/apps/web/build/client/download/clutchwire.apk /root/myhot/clutchwire_aligned.apk

echo "=== 7. Verifying APK signature ==="
apksigner verify /root/myhot/apps/web/build/client/download/clutchwire.apk

echo "=== 8. Deploying APK into container ==="
docker cp /root/myhot/apps/web/build/client/download/clutchwire.apk aihot-web-1:/app/apps/web/build/client/download/clutchwire.apk

echo "=== 9. Verifying download file ==="
ls -lh /root/myhot/apps/web/build/client/download/clutchwire.apk
docker exec aihot-web-1 ls -lh /app/apps/web/build/client/download/clutchwire.apk

echo "=== COMPLETE! ==="
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS. Running fix-apk-dark-theme...');
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
  console.error('SSH error:', err);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 10000
});
