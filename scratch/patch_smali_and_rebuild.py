import re
import os
import subprocess

base_dir = "/root/myhot/apk_test_r"

splash_smali_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/splash/SplashActivity.smali")
main_smali_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/MainActivity.smali")

dark_window_smali = """
    # --- ClutchWire Dark Window Configuration ---
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v0
    const v1, -0xf3efeb
    invoke-virtual {v0, v1}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v0, v1}, Landroid/view/Window;->setNavigationBarColor(I)V
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v0
    const/4 v1, 0x0
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    # ---------------------------------------------
"""

# 1. Patch SplashActivity
with open(splash_smali_path, "r", encoding="utf-8") as f:
    splash = f.read()

target_splash = "invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V"
if target_splash not in splash:
    raise RuntimeError("Target string not found in SplashActivity.smali")

if "-0xf3efeb" not in splash:
    splash = splash.replace(target_splash, target_splash + "\n" + dark_window_smali)
    with open(splash_smali_path, "w", encoding="utf-8") as f:
        f.write(splash)
    print("-> SplashActivity.smali successfully patched with dark status/nav bars!")
else:
    print("-> SplashActivity.smali already contains dark configuration")

# 2. Patch MainActivity
with open(main_smali_path, "r", encoding="utf-8") as f:
    main = f.read()

target_main = "invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V"
if target_main not in main:
    raise RuntimeError("Target string not found in MainActivity.smali")

if "-0xf3efeb" not in main:
    main = main.replace(target_main, target_main + "\n" + dark_window_smali)

    target_webview = "iput-object p1, p0, Lcom/kotlin/mNative/activity/MainActivity;->webView:Landroid/webkit/WebView;"
    webview_dark = """
    # Set webView background to dark #ff0c1015
    const v0, -0xf3efeb
    invoke-virtual {p1, v0}, Landroid/webkit/WebView;->setBackgroundColor(I)V
"""
    if target_webview in main:
        main = main.replace(target_webview, target_webview + "\n" + webview_dark)

    with open(main_smali_path, "w", encoding="utf-8") as f:
        f.write(main)
    print("-> MainActivity.smali successfully patched with dark status/nav bars and dark webview!")
else:
    print("-> MainActivity.smali already contains dark configuration")

print("SMALI PATCHING COMPLETED SUCCESSFULLY!")
