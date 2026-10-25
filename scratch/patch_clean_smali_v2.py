import os
import shutil

base_dir = "/root/myhot/clean_smali"
util_dir = os.path.join(base_dir, "smali/com/kotlin/mNative/util")
os.makedirs(util_dir, exist_ok=True)

# 1. DarkThemeHelper.smali (100% standard SDK methods, no unverified APIs)
dark_theme_helper_smali = """\
.class public final Lcom/kotlin/mNative/util/DarkThemeHelper;
.super Ljava/lang/Object;
.source "DarkThemeHelper.java"

.field public static currentIsDark:Z

# direct methods
.method static constructor <clinit>()V
    .locals 1

    const/4 v0, 0x1
    sput-boolean v0, Lcom/kotlin/mNative/util/DarkThemeHelper;->currentIsDark:Z

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static applyDarkThemeSplash(Landroid/app/Activity;)V
    .locals 2

    # Splash is always pure black: #ff000000
    const/high16 v0, -0x1000000
    const/4 v1, 0x1
    invoke-static {p0, v0, v1}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applySystemBars(Landroid/app/Activity;IZ)V

    return-void
.end method

.method public static applyDarkThemeMain(Landroid/app/Activity;)V
    .locals 1

    sget-boolean v0, Lcom/kotlin/mNative/util/DarkThemeHelper;->currentIsDark:Z
    invoke-static {p0, v0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyTheme(Landroid/app/Activity;Z)V

    return-void
.end method

.method public static applyTheme(Landroid/app/Activity;Z)V
    .locals 1

    sput-boolean p1, Lcom/kotlin/mNative/util/DarkThemeHelper;->currentIsDark:Z

    if-eqz p1, :cond_light

    # Dark: #ff0c1015 (-0xf3efeb), isDark = true
    const v0, -0xf3efeb
    invoke-static {p0, v0, p1}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applySystemBars(Landroid/app/Activity;IZ)V
    return-void

    :cond_light
    # Light: #ffffffff (-0x1), isDark = false
    const/4 v0, -0x1
    invoke-static {p0, v0, p1}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applySystemBars(Landroid/app/Activity;IZ)V
    return-void
.end method

.method private static applySystemBars(Landroid/app/Activity;IZ)V
    .locals 3

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

    # 3. Set Status Bar and Navigation Bar colors
    invoke-virtual {v0, p1}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v0, p1}, Landroid/view/Window;->setNavigationBarColor(I)V

    # 4. Optional: Disable navigation bar contrast on Android 10+ (API 29+)
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v2, 0x1d
    if-lt v1, v2, :cond_2
    const/4 v2, 0x0
    invoke-virtual {v0, v2}, Landroid/view/Window;->setNavigationBarContrastEnforced(Z)V

    :cond_2
    # 5. Toggle Light/Dark icons via DecorView SystemUiVisibility
    # 0x2000 = SYSTEM_UI_FLAG_LIGHT_STATUS_BAR (API 23+)
    # 0x0010 = SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR (API 26+)
    # 0x2010 combined
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v0
    if-eqz v0, :cond_4

    invoke-virtual {v0}, Landroid/view/View;->getSystemUiVisibility()I
    move-result v1

    if-eqz p2, :cond_3
    # Dark mode: clear 0x2010 -> flags & ~0x2010 (-0x2011)
    const v2, -0x2011
    and-int/2addr v1, v2
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    goto :goto_0

    :cond_3
    # Light mode: set 0x2010 -> flags | 0x2010
    const/16 v2, 0x2010
    or-int/2addr v1, v2
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

.method public static setupThemeBridge(Landroid/app/Activity;Landroid/webkit/WebView;)V
    .locals 2

    if-eqz p0, :cond_0
    if-nez p1, :cond_1
    :cond_0
    return-void

    :cond_1
    :try_start_0
    new-instance v0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge;
    invoke-direct {v0, p0}, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge;-><init>(Landroid/app/Activity;)V
    const-string v1, "AndroidBridge"
    invoke-virtual {p1, v0, v1}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catch_all

    return-void

    :catch_all
    move-exception v0
    return-void
.end method
"""

with open(os.path.join(util_dir, "DarkThemeHelper.smali"), "w", encoding="utf-8") as f:
    f.write(dark_theme_helper_smali)

# 2. DarkThemeHelper$ThemeBridge.smali
theme_bridge_smali = """\
.class public final Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge;
.super Ljava/lang/Object;
.source "DarkThemeHelper.java"

.field private final activity:Landroid/app/Activity;

.method public constructor <init>(Landroid/app/Activity;)V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge;->activity:Landroid/app/Activity;
    return-void
.end method

.method public onThemeChange(Ljava/lang/String;)V
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    .locals 3

    iget-object v0, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge;->activity:Landroid/app/Activity;
    if-nez v0, :cond_0
    return-void

    :cond_0
    const-string v1, "light"
    invoke-static {v1, p1}, Landroid/text/TextUtils;->equals(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Z
    move-result v1

    if-eqz v1, :cond_1
    # Light mode: isDark = false
    const/4 v1, 0x0
    goto :goto_0

    :cond_1
    # Dark mode: isDark = true
    const/4 v1, 0x1

    :goto_0
    new-instance v2, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;
    invoke-direct {v2, v0, v1}, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;-><init>(Landroid/app/Activity;Z)V
    invoke-virtual {v0, v2}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method
"""

with open(os.path.join(util_dir, "DarkThemeHelper$ThemeBridge.smali"), "w", encoding="utf-8") as f:
    f.write(theme_bridge_smali)

# 3. DarkThemeHelper$ThemeBridge$1.smali
theme_bridge_runnable_smali = """\
.class public final Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;
.super Ljava/lang/Object;
.source "DarkThemeHelper.java"

# interfaces
.implements Ljava/lang/Runnable;

.field final synthetic val$activity:Landroid/app/Activity;
.field final synthetic val$isDark:Z

.method public constructor <init>(Landroid/app/Activity;Z)V
    .locals 0

    iput-object p1, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;->val$activity:Landroid/app/Activity;
    iput-boolean p2, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;->val$isDark:Z
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method

.method public run()V
    .locals 2

    iget-object v0, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;->val$activity:Landroid/app/Activity;
    iget-boolean v1, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$ThemeBridge$1;->val$isDark:Z
    invoke-static {v0, v1}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyTheme(Landroid/app/Activity;Z)V

    return-void
.end method
"""

with open(os.path.join(util_dir, "DarkThemeHelper$ThemeBridge$1.smali"), "w", encoding="utf-8") as f:
    f.write(theme_bridge_runnable_smali)

# Remove any old DismissRunnable
dismiss_file = os.path.join(util_dir, "DarkThemeHelper$DismissRunnable.smali")
if os.path.exists(dismiss_file):
    os.remove(dismiss_file)

print("Created DarkThemeHelper smali files.")

# 4. Patch SplashActivity.smali
splash_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/splash/SplashActivity.smali")
with open(splash_path, "r", encoding="utf-8") as f:
    splash_content = f.read()

# Clean previous attach/dismiss calls if any
splash_content = splash_content.replace("\n\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeSplash(Landroid/app/Activity;)V", "")
splash_content = splash_content.replace("\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeSplash(Landroid/app/Activity;)V", "")

# Place right after setContentView
target_splash = "invoke-virtual {p0, p1}, Lcom/kotlin/mNative/activity/splash/SplashActivity;->setContentView(I)V"
replacement_splash = target_splash + "\n\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeSplash(Landroid/app/Activity;)V"
if target_splash in splash_content:
    splash_content = splash_content.replace(target_splash, replacement_splash, 1)

with open(splash_path, "w", encoding="utf-8") as f:
    f.write(splash_content)
print("Patched SplashActivity.smali.")

# 5. Patch MainActivity.smali
main_activity_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/MainActivity.smali")
with open(main_activity_path, "r", encoding="utf-8") as f:
    main_content = f.read()

# Clean any previous attachSplashOverlay or applyDarkThemeMain
main_content = main_content.replace("\n\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->attachSplashOverlay(Landroid/app/Activity;)V\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V", "")
main_content = main_content.replace("\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->attachSplashOverlay(Landroid/app/Activity;)V\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V", "")
main_content = main_content.replace("\n\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V", "")

# Place applyDarkThemeMain right after setContentView
target_main = "invoke-virtual {p0, p1}, Lcom/kotlin/mNative/activity/MainActivity;->setContentView(I)V"
replacement_main = target_main + "\n\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V"
if target_main in main_content:
    main_content = main_content.replace(target_main, replacement_main, 1)

# Ensure setupThemeBridge is present after webView assignment
target_wv = "iput-object p1, p0, Lcom/kotlin/mNative/activity/MainActivity;->webView:Landroid/webkit/WebView;"
replacement_wv = target_wv + "\n\n    invoke-static {p0, p1}, Lcom/kotlin/mNative/util/DarkThemeHelper;->setupThemeBridge(Landroid/app/Activity;Landroid/webkit/WebView;)V"
if "setupThemeBridge" not in main_content and target_wv in main_content:
    main_content = main_content.replace(target_wv, replacement_wv, 1)

with open(main_activity_path, "w", encoding="utf-8") as f:
    f.write(main_content)
print("Patched MainActivity.smali.")

# 6. Patch MainActivity$onCreate$2.smali
wvc_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/MainActivity$onCreate$2.smali")
with open(wvc_path, "r", encoding="utf-8") as f:
    wvc_content = f.read()

# Clean dismissSplashOverlay
wvc_content = wvc_content.replace("\n    invoke-static {}, Lcom/kotlin/mNative/util/DarkThemeHelper;->dismissSplashOverlay()V", "")
wvc_content = wvc_content.replace("invoke-static {}, Lcom/kotlin/mNative/util/DarkThemeHelper;->dismissSplashOverlay()V\n\n    ", "")

# Force progress bar to stay GONE (0x8) in onPageStarted
target_prog = "const/4 p2, 0x0\n\n    invoke-virtual {p1, p2}, Landroid/widget/ProgressBar;->setVisibility(I)V"
replacement_prog = "const/16 p2, 0x8\n\n    invoke-virtual {p1, p2}, Landroid/widget/ProgressBar;->setVisibility(I)V"
if target_prog in wvc_content:
    wvc_content = wvc_content.replace(target_prog, replacement_prog, 1)

with open(wvc_path, "w", encoding="utf-8") as f:
    f.write(wvc_content)
print("Patched MainActivity$onCreate$2.smali.")
print("All clean patches applied successfully!")
