import cv2
import numpy as np

# Load authentic source icon (500x484)
src = cv2.imread('assets/designs/user_selected_icon.png', cv2.IMREAD_UNCHANGED)

# Emblem bounding box:
# Exact coordinates inside user_selected_icon.png:
# Left: 55, Top: 70, Width: 335, Height: 335
left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

# In crop:
# Background is dark gray/black (RGB ~ 18-28)
# White R is RGB ~ 240-255
# Red Ribbon is RGB ~ (200, 30, 50)
b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)

lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Distance to background:
# If lum > 60 or red_diff > 18, it is foreground.
# Compute exact subpixel distance/alpha:
# Clean crisp transition: transition band only between 45 and 65 for lum, and 12 and 18 for red
alpha_white = np.clip((lum - 50.0) / 25.0, 0.0, 1.0)
alpha_red = np.clip((red_diff - 12.0) / 12.0, 0.0, 1.0)
alpha = np.maximum(alpha_white, alpha_red)

# For background suppression: where alpha == 0, make RGB pure 0
crop_clean = crop.copy().astype(np.float32)
for c in range(3):
    crop_clean[:,:,c] = crop_clean[:,:,c] * alpha

# Create 4-channel RGBA
rgba = np.zeros((size, size, 4), dtype=np.float32)
rgba[:,:,:3] = crop_clean[:,:,:3]
rgba[:,:,3] = alpha * 255.0

# Now Super-Resolution Upscale 4x: from 335x335 to 1340x1340 using Lanczos4
target_size = 1340
up_rgba = cv2.resize(rgba, (target_size, target_size), interpolation=cv2.INTER_LANCZOS4)

# De-ring and clamp
up_rgba = np.clip(up_rgba, 0, 255)

# Separate channels
up_rgb = up_rgba[:,:,:3]
up_a = up_rgba[:,:,3] / 255.0

# Sharpening: Unsharp mask on RGB
blur_rgb = cv2.GaussianBlur(up_rgb, (0, 0), sigmaX=1.5)
sharp_rgb = cv2.addWeighted(up_rgb, 1.6, blur_rgb, -0.6, 0)
sharp_rgb = np.clip(sharp_rgb, 0, 255)

# Crisp alpha thresholding to eliminate any soft halo:
# Boost mid-tones of alpha for crisp vector-like edges
up_a = np.clip((up_a - 0.15) / 0.7, 0.0, 1.0)
# Smoothstep
up_a = up_a * up_a * (3.0 - 2.0 * up_a)

final_rgba = np.zeros((target_size, target_size, 4), dtype=np.uint8)
final_rgba[:,:,:3] = np.clip(sharp_rgb * up_a[:,:,np.newaxis], 0, 255).astype(np.uint8)
final_rgba[:,:,3] = (up_a * 255.0).astype(np.uint8)

cv2.imwrite('temp_hd_emblem_1340.png', final_rgba)
print('Saved temp_hd_emblem_1340.png')

# Composite on pure OLED black 1242x2688 splash screen
splash = np.zeros((2688, 1242, 4), dtype=np.uint8)
splash[:,:,3] = 255 # opaque black

# Emblem size on splash: let's make it 560px wide (large, crisp, prominent!)
splash_emblem_w = 560
splash_emblem_h = 560
emblem_resized = cv2.resize(final_rgba, (splash_emblem_w, splash_emblem_h), interpolation=cv2.INTER_LANCZOS4)

pos_y = int((2688 - splash_emblem_h) * 0.44)
pos_x = int((1242 - splash_emblem_w) / 2)

src_rgb = emblem_resized[:,:,:3].astype(np.float32)
src_a = (emblem_resized[:,:,3].astype(np.float32) / 255.0)[:,:,np.newaxis]

roi = splash[pos_y:pos_y+splash_emblem_h, pos_x:pos_x+splash_emblem_w, :3].astype(np.float32)
blended = src_rgb * src_a + roi * (1.0 - src_a)
splash[pos_y:pos_y+splash_emblem_h, pos_x:pos_x+splash_emblem_w, :3] = np.clip(blended, 0, 255).astype(np.uint8)

cv2.imwrite('temp_crisp_splash.png', splash)
print('Saved temp_crisp_splash.png')
