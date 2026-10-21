import re
import os

print("==> 1. Updating res/values/styles.xml...")
styles_path = "/root/myhot/apk_decompiled/res/values/styles.xml"
with open(styles_path, "r", encoding="utf-8") as f:
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

xml = re.sub(r'<style name="AppTheme" parent="[^"]*">.*?</style>', new_theme, xml, flags=re.DOTALL)
with open(styles_path, "w", encoding="utf-8") as f:
    f.write(xml)
print("styles.xml patched")

print("==> 2. Updating res/values-night/styles.xml...")
night_path = "/root/myhot/apk_decompiled/res/values-night/styles.xml"
with open(night_path, "r", encoding="utf-8") as f:
    xml = f.read()

if 'name="AppTheme"' not in xml:
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
    with open(night_path, "w", encoding="utf-8") as f:
        f.write(xml)
    print("values-night/styles.xml patched")
else:
    print("values-night/styles.xml already has AppTheme")

print("==> 3. Updating res/values/colors.xml...")
colors_path = "/root/myhot/apk_decompiled/res/values/colors.xml"
with open(colors_path, "r", encoding="utf-8") as f:
    xml = f.read()

xml = re.sub(r'<color name="colorAccent">#[0-9a-fA-F]+</color>', '<color name="colorAccent">#ffce1141</color>', xml)
xml = re.sub(r'<color name="colorPrimary">#[0-9a-fA-F]+</color>', '<color name="colorPrimary">#ff0c1015</color>', xml)
xml = re.sub(r'<color name="colorPrimaryDark">#[0-9a-fA-F]+</color>', '<color name="colorPrimaryDark">#ff0c1015</color>', xml)

with open(colors_path, "w", encoding="utf-8") as f:
    f.write(xml)
print("==> 4. Updating apktool.yml...")
yml_path = "/root/myhot/apk_decompiled/apktool.yml"
with open(yml_path, "r", encoding="utf-8") as f:
    yml = f.read()
yml = yml.replace("versionCode: '2'", "versionCode: 2")
yml = re.sub(r"versionCode:\s*'(\d+)'", r"versionCode: \1", yml)
with open(yml_path, "w", encoding="utf-8") as f:
    f.write(yml)
print("apktool.yml patched")

print("==> 5. Updating values-v31/colors.xml private resource references...")
v31_path = "/root/myhot/apk_decompiled/res/values-v31/colors.xml"
if os.path.exists(v31_path):
    with open(v31_path, "r", encoding="utf-8") as f:
        c31 = f.read()
    c31 = c31.replace("@android:color/", "@*android:color/")
    with open(v31_path, "w", encoding="utf-8") as f:
        f.write(c31)
    print("values-v31/colors.xml updated with @*android:color/")

print("Python patching complete!")
