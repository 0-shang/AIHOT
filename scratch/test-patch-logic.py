import re

# 1. Test SplashActivity patching
splash_content = """
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 8

    .line 27
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    const p1, 0x7f0b001d
"""

dark_window_smali = """    # Window Dark Configuration (ClutchWire)
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v0
    const v1, -0xf3efeb
    invoke-virtual {v0, v1}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v0, v1}, Landroid/view/Window;->setNavigationBarColor(I)V
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v0
    const/4 v1, 0x0
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
"""

target_splash = "invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V"
patched_splash = splash_content.replace(target_splash, target_splash + "\n\n" + dark_window_smali)
print("Splash patched correctly:", "-0xf3efeb" in patched_splash)

# 2. Test MainActivity patching
main_content = """
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 4

    .line 66
    invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V

    const p1, 0x7f0b001c
"""

target_main = "invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V"
patched_main = main_content.replace(target_main, target_main + "\n\n" + dark_window_smali)
print("Main patched correctly:", "-0xf3efeb" in patched_main)
