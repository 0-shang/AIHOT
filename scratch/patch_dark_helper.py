import os

helper_smali_content = """\
.class public final Lcom/kotlin/mNative/util/DarkThemeHelper;
.super Ljava/lang/Object;
.source "DarkThemeHelper.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static applyDarkThemeSplash(Landroid/app/Activity;)V
    .locals 1

    # Pure black for splash screen
    const/high16 v0, -0x1000000

    invoke-static {p0, v0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyWindowDark(Landroid/app/Activity;I)V

    return-void
.end method

.method public static applyDarkThemeMain(Landroid/app/Activity;)V
    .locals 1

    # Dark background #ff0c1015 (-0xf3efeb) for main app
    const v0, -0xf3efeb

    invoke-static {p0, v0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyWindowDark(Landroid/app/Activity;I)V

    return-void
.end method

.method private static applyWindowDark(Landroid/app/Activity;I)V
    .locals 4

    if-nez p0, :cond_0

    return-void

    :cond_0
    :try_start_0
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;

    move-result-object v0

    if-nez v0, :cond_1

    return-void

    :cond_1
    # 1. Add FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS (0x80000000)
    const/high16 v1, -0x80000000

    invoke-virtual {v0, v1}, Landroid/view/Window;->addFlags(I)V

    # 2. Clear FLAG_TRANSLUCENT_STATUS | FLAG_TRANSLUCENT_NAVIGATION (0x0c000000)
    const v1, 0xc000000

    invoke-virtual {v0, v1}, Landroid/view/Window;->clearFlags(I)V

    # 3. Set window background drawable
    new-instance v1, Landroid/graphics/drawable/ColorDrawable;

    invoke-direct {v1, p1}, Landroid/graphics/drawable/ColorDrawable;-><init>(I)V

    invoke-virtual {v0, v1}, Landroid/view/Window;->setBackgroundDrawable(Landroid/graphics/drawable/Drawable;)V

    # 4. Set Status Bar and Navigation Bar colors to the dark color
    invoke-virtual {v0, p1}, Landroid/view/Window;->setStatusBarColor(I)V

    invoke-virtual {v0, p1}, Landroid/view/Window;->setNavigationBarColor(I)V

    # 5. Disable contrast enforcement on Android 10+ (API 29+) so no white/grey scrim is drawn!
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v2, 0x1d

    const/4 v3, 0x0

    if-lt v1, v2, :cond_2

    invoke-virtual {v0, v3}, Landroid/view/Window;->setNavigationBarContrastEnforced(Z)V

    invoke-virtual {v0, v3}, Landroid/view/Window;->setStatusBarContrastEnforced(Z)V

    :cond_2
    # 6. On Android 11+ (API 30+), use WindowInsetsController to turn OFF light bars (making icons light, bars dark)
    const/16 v2, 0x1e

    if-lt v1, v2, :cond_3

    invoke-virtual {v0}, Landroid/view/Window;->getInsetsController()Landroid/view/WindowInsetsController;

    move-result-object v1

    if-eqz v1, :cond_4

    # mask: 24 = APPEARANCE_LIGHT_STATUS_BARS (8) | APPEARANCE_LIGHT_NAVIGATION_BARS (16)
    # appearance: 0 turns them OFF
    const/16 v2, 0x18

    invoke-interface {v1, v3, v2}, Landroid/view/WindowInsetsController;->setSystemBarsAppearance(II)V

    goto :goto_0

    :cond_3
    # 7. Fallback for Android < 30: clear light status/nav bar flags in DecorView
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v0

    if-eqz v0, :cond_4

    invoke-virtual {v0}, Landroid/view/View;->getSystemUiVisibility()I

    move-result v1

    # Clear 0x2000 (LIGHT_STATUS) and 0x10 (LIGHT_NAV)
    const v2, -0x2011

    and-int/2addr v1, v2

    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catch_all

    :cond_4
    :goto_0
    return-void

    :catch_all
    move-exception v0

    return-void
.end method
"""

base_dir = "/root/myhot/apk_test_r"
util_dir = os.path.join(base_dir, "smali/com/kotlin/mNative/util")
os.makedirs(util_dir, exist_ok=True)
helper_path = os.path.join(util_dir, "DarkThemeHelper.smali")

with open(helper_path, "w", encoding="utf-8") as f:
    f.write(helper_smali_content)
print(f"Created {helper_path}")

# Patch SplashActivity.smali
splash_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/splash/SplashActivity.smali")
with open(splash_path, "r", encoding="utf-8") as f:
    splash = f.read()

# Replace any old injected block with new DarkThemeHelper call
target_splash = "invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V"
call_splash = "\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeSplash(Landroid/app/Activity;)V"

# Remove previous injected block if present
import re
splash = re.sub(r"# --- ClutchWire Dark Window Configuration ---.*?# ---------------------------------------------", "", splash, flags=re.DOTALL)
if "applyDarkThemeSplash" not in splash:
    splash = splash.replace(target_splash, target_splash + call_splash)

# Also ensure onResume in SplashActivity
if ".method protected onResume()V" not in splash:
    on_resume_splash = """
.method protected onResume()V
    .locals 0

    invoke-super {p0}, Landroid/app/Activity;->onResume()V

    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeSplash(Landroid/app/Activity;)V

    return-void
.end method
"""
    splash += on_resume_splash

with open(splash_path, "w", encoding="utf-8") as f:
    f.write(splash)
print(f"Patched {splash_path}")

# Patch MainActivity.smali
main_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/MainActivity.smali")
with open(main_path, "r", encoding="utf-8") as f:
    main = f.read()

target_main = "invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V"
call_main = "\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V"

main = re.sub(r"# --- ClutchWire Dark Window Configuration ---.*?# ---------------------------------------------", "", main, flags=re.DOTALL)
if "applyDarkThemeMain" not in main:
    main = main.replace(target_main, target_main + call_main)

# Also ensure onResume in MainActivity
if ".method protected onResume()V" in main:
    target_resume = "invoke-super {p0}, Landroidx/fragment/app/FragmentActivity;->onResume()V"
    if "applyDarkThemeMain" not in main[main.find(".method protected onResume()V"):]:
        main = main.replace(target_resume, target_resume + "\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V")
else:
    on_resume_main = """
.method protected onResume()V
    .locals 0

    invoke-super {p0}, Landroidx/fragment/app/FragmentActivity;->onResume()V

    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V

    return-void
.end method
"""
    main += on_resume_main

# Set webview background to dark #ff0c1015 if not already
target_wv = "iput-object p1, p0, Lcom/kotlin/mNative/activity/MainActivity;->webView:Landroid/webkit/WebView;"
wv_dark = """
    # Set webView background to dark #ff0c1015
    const v0, -0xf3efeb
    invoke-virtual {p1, v0}, Landroid/webkit/WebView;->setBackgroundColor(I)V
"""
if target_wv in main and "setBackgroundColor" not in main:
    main = main.replace(target_wv, target_wv + "\n" + wv_dark)

with open(main_path, "w", encoding="utf-8") as f:
    f.write(main)
print(f"Patched {main_path}")
