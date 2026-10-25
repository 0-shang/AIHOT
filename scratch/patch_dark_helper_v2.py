import os

base_dir = "/root/myhot/apk_test_r"
util_dir = os.path.join(base_dir, "smali/com/kotlin/mNative/util")
os.makedirs(util_dir, exist_ok=True)

# 1. DarkThemeHelper.smali
dark_theme_helper_smali = """\
.class public final Lcom/kotlin/mNative/util/DarkThemeHelper;
.super Ljava/lang/Object;
.source "DarkThemeHelper.java"

.field public static splashOverlay:Landroid/view/View;
.field public static currentIsDark:Z

# direct methods
.method static constructor <clinit>()V
    .locals 1

    const/4 v0, 0x1
    sput-boolean v0, Lcom/kotlin/mNative/util/DarkThemeHelper;->currentIsDark:Z

    const/4 v0, 0x0
    sput-object v0, Lcom/kotlin/mNative/util/DarkThemeHelper;->splashOverlay:Landroid/view/View;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static applyDarkThemeSplash(Landroid/app/Activity;)V
    .locals 2

    # Splash is always pure black
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
    .locals 5

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

    # 4. Set Status Bar and Navigation Bar colors
    invoke-virtual {v0, p1}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v0, p1}, Landroid/view/Window;->setNavigationBarColor(I)V

    # 5. Disable contrast enforcement on Android 10+ (API 29+)
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v2, 0x1d
    const/4 v3, 0x0
    if-lt v1, v2, :cond_2
    invoke-virtual {v0, v3}, Landroid/view/Window;->setNavigationBarContrastEnforced(Z)V
    invoke-virtual {v0, v3}, Landroid/view/Window;->setStatusBarContrastEnforced(Z)V

    :cond_2
    # 6. Check Android 11+ (API 30+)
    const/16 v2, 0x1e
    const/16 v4, 0x18
    if-lt v1, v2, :cond_4
    invoke-virtual {v0}, Landroid/view/Window;->getInsetsController()Landroid/view/WindowInsetsController;
    move-result-object v0
    if-eqz v0, :cond_6

    if-eqz p2, :cond_3
    # Dark: appearance 0 (turn off light status/nav bars)
    invoke-interface {v0, v3, v4}, Landroid/view/WindowInsetsController;->setSystemBarsAppearance(II)V
    goto :goto_0

    :cond_3
    # Light: appearance 24 (turn ON light status/nav bars -> dark icons)
    invoke-interface {v0, v4, v4}, Landroid/view/WindowInsetsController;->setSystemBarsAppearance(II)V
    goto :goto_0

    :cond_4
    # 7. Fallback for Android < 30: DecorView
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v0
    if-eqz v0, :cond_6
    invoke-virtual {v0}, Landroid/view/View;->getSystemUiVisibility()I
    move-result v1

    if-eqz p2, :cond_5
    # Dark: clear 0x2010
    const v2, -0x2011
    and-int/2addr v1, v2
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    goto :goto_0

    :cond_5
    # Light: set 0x2010
    const/16 v2, 0x2010
    or-int/2addr v1, v2
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catch_all

    :cond_6
    :goto_0
    return-void

    :catch_all
    move-exception v0
    return-void
.end method

.method public static attachSplashOverlay(Landroid/app/Activity;)V
    .locals 4

    if-nez p0, :cond_0
    return-void

    :cond_0
    :try_start_0
    # android.R.id.content = 0x01020002
    const v0, 0x1020002
    invoke-virtual {p0, v0}, Landroid/app/Activity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    check-cast v0, Landroid/view/ViewGroup;
    if-nez v0, :cond_1
    return-void

    :cond_1
    invoke-static {p0}, Landroid/view/LayoutInflater;->from(Landroid/content/Context;)Landroid/view/LayoutInflater;
    move-result-object v1
    # R.layout.activity_splash = 0x7f0b001d
    const v2, 0x7f0b001d
    const/4 v3, 0x0
    invoke-virtual {v1, v2, v0, v3}, Landroid/view/LayoutInflater;->inflate(ILandroid/view/ViewGroup;Z)Landroid/view/View;
    move-result-object v1
    # Add to root
    invoke-virtual {v0, v1}, Landroid/view/ViewGroup;->addView(Landroid/view/View;)V
    sput-object v1, Lcom/kotlin/mNative/util/DarkThemeHelper;->splashOverlay:Landroid/view/View;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catch_all

    return-void

    :catch_all
    move-exception v0
    return-void
.end method

.method public static dismissSplashOverlay()V
    .locals 3

    :try_start_0
    sget-object v0, Lcom/kotlin/mNative/util/DarkThemeHelper;->splashOverlay:Landroid/view/View;
    if-nez v0, :cond_0
    return-void

    :cond_0
    const/4 v1, 0x0
    sput-object v1, Lcom/kotlin/mNative/util/DarkThemeHelper;->splashOverlay:Landroid/view/View;

    # Smooth fade out 250ms
    invoke-virtual {v0}, Landroid/view/View;->animate()Landroid/view/ViewPropertyAnimator;
    move-result-object v1
    const/4 v2, 0x0
    invoke-virtual {v1, v2}, Landroid/view/ViewPropertyAnimator;->alpha(F)Landroid/view/ViewPropertyAnimator;
    move-result-object v1
    const-wide/16 v2, 0xfa
    invoke-virtual {v1, v2, v3}, Landroid/view/ViewPropertyAnimator;->setDuration(J)Landroid/view/ViewPropertyAnimator;
    move-result-object v1

    # Remove when done
    new-instance v2, Lcom/kotlin/mNative/util/DarkThemeHelper$DismissRunnable;
    invoke-direct {v2, v0}, Lcom/kotlin/mNative/util/DarkThemeHelper$DismissRunnable;-><init>(Landroid/view/View;)V
    invoke-virtual {v1, v2}, Landroid/view/ViewPropertyAnimator;->withEndAction(Ljava/lang/Runnable;)Landroid/view/ViewPropertyAnimator;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catch_all

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

# 2. DarkThemeHelper$DismissRunnable.smali
dismiss_runnable_smali = """\
.class public final Lcom/kotlin/mNative/util/DarkThemeHelper$DismissRunnable;
.super Ljava/lang/Object;
.source "DarkThemeHelper.java"

# interfaces
.implements Ljava/lang/Runnable;

.field final synthetic val$view:Landroid/view/View;

.method public constructor <init>(Landroid/view/View;)V
    .locals 0

    iput-object p1, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$DismissRunnable;->val$view:Landroid/view/View;
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method

.method public run()V
    .locals 2

    :try_start_0
    iget-object v0, p0, Lcom/kotlin/mNative/util/DarkThemeHelper$DismissRunnable;->val$view:Landroid/view/View;
    if-eqz v0, :cond_0

    const/16 v1, 0x8
    invoke-virtual {v0, v1}, Landroid/view/View;->setVisibility(I)V

    invoke-virtual {v0}, Landroid/view/View;->getParent()Landroid/view/ViewParent;
    move-result-object v1
    check-cast v1, Landroid/view/ViewGroup;
    if-eqz v1, :cond_0

    invoke-virtual {v1, v0}, Landroid/view/ViewGroup;->removeView(Landroid/view/View;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catch_all

    :cond_0
    return-void

    :catch_all
    move-exception v0
    return-void
.end method
"""

with open(os.path.join(util_dir, "DarkThemeHelper$DismissRunnable.smali"), "w", encoding="utf-8") as f:
    f.write(dismiss_runnable_smali)

# 3. DarkThemeHelper$ThemeBridge.smali
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

# 4. DarkThemeHelper$ThemeBridge$1.smali
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

print("Created all DarkThemeHelper smali files successfully.")

# 5. Patch MainActivity.smali
main_activity_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/MainActivity.smali")
with open(main_activity_path, "r", encoding="utf-8") as f:
    content = f.read()

# Clean any literal \n
content = content.replace("\\n", "\n")

# Make sure onCreate attaches splash overlay and applies theme
if "DarkThemeHelper;->attachSplashOverlay" not in content:
    target = "invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V"
    replacement = "invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->attachSplashOverlay(Landroid/app/Activity;)V\n    invoke-static {p0}, Lcom/kotlin/mNative/util/DarkThemeHelper;->applyDarkThemeMain(Landroid/app/Activity;)V"
    if target in content:
        content = content.replace(target, replacement, 1)

# Make sure setupThemeBridge is called after webView initialization
if "DarkThemeHelper;->setupThemeBridge" not in content:
    target = "iput-object p1, p0, Lcom/kotlin/mNative/activity/MainActivity;->webView:Landroid/webkit/WebView;"
    replacement = target + "\n\n    invoke-static {p0, p1}, Lcom/kotlin/mNative/util/DarkThemeHelper;->setupThemeBridge(Landroid/app/Activity;Landroid/webkit/WebView;)V"
    if target in content:
        content = content.replace(target, replacement, 1)

with open(main_activity_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patched MainActivity.smali successfully.")

# 6. Patch MainActivity$onCreate$2.smali (WebViewClient)
webview_client_path = os.path.join(base_dir, "smali/com/kotlin/mNative/activity/MainActivity$onCreate$2.smali")
with open(webview_client_path, "r", encoding="utf-8") as f:
    wvc_content = f.read()

# Clean any literal \n
wvc_content = wvc_content.replace("\\n", "\n")

# In onPageStarted: keep progressBar GONE (0x8) instead of VISIBLE (0x0)
# const/4 p2, 0x0 -> const/16 p2, 0x8
# invoke-virtual {p1, p2}, Landroid/widget/ProgressBar;->setVisibility(I)V
if ".method public onPageStarted(Landroid/webkit/WebView;Ljava/lang/String;Landroid/graphics/Bitmap;)V" in wvc_content:
    parts = wvc_content.split(".method public onPageStarted(Landroid/webkit/WebView;Ljava/lang/String;Landroid/graphics/Bitmap;)V")
    before = parts[0]
    rest = parts[1].split(".end method", 1)
    started_body = rest[0]
    after = rest[1]

    # Replace visibility 0x0 with 0x8
    started_body_patched = started_body.replace("const/4 p2, 0x0", "const/16 p2, 0x8")
    wvc_content = before + ".method public onPageStarted(Landroid/webkit/WebView;Ljava/lang/String;Landroid/graphics/Bitmap;)V" + started_body_patched + ".end method" + after

# In onPageFinished: call DarkThemeHelper.dismissSplashOverlay()
# Clean any previous broken patch
wvc_content = wvc_content.replace("\\n    invoke-static {}, Lcom/kotlin/mNative/util/DarkThemeHelper;->dismissSplashOverlay()V", "")
if "dismissSplashOverlay" not in wvc_content:
    target = ".method public onPageFinished(Landroid/webkit/WebView;Ljava/lang/String;)V"
    replacement = target + "\n    invoke-static {}, Lcom/kotlin/mNative/util/DarkThemeHelper;->dismissSplashOverlay()V\n"
    wvc_content = wvc_content.replace(target, replacement, 1)

with open(webview_client_path, "w", encoding="utf-8") as f:
    f.write(wvc_content)

print("Patched MainActivity$onCreate$2.smali successfully.")
