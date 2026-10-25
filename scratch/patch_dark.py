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
print("ALL PATCHES APPLIED CLEANLY")
