import cv2
import numpy as np

src = cv2.imread('assets/designs/user_selected_icon.png', cv2.IMREAD_UNCHANGED)

left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Distance fields
field_white = (lum - 70.0) / 45.0
field_red = (red_diff - 16.0) / 20.0

up_size = 2010
up_white = cv2.resize(field_white, (up_size, up_size), interpolation=cv2.INTER_LANCZOS4)
up_red = cv2.resize(field_red, (up_size, up_size), interpolation=cv2.INTER_LANCZOS4)

# Bilateral smoothing
norm_w = np.clip((up_white + 0.5) * 128.0, 0, 255).astype(np.uint8)
norm_r = np.clip((up_red + 0.5) * 128.0, 0, 255).astype(np.uint8)

smooth_w = cv2.bilateralFilter(norm_w, d=9, sigmaColor=50, sigmaSpace=7)
smooth_r = cv2.bilateralFilter(norm_r, d=9, sigmaColor=50, sigmaSpace=7)

smooth_w = cv2.GaussianBlur(smooth_w, (5, 5), 1.0).astype(np.float32) / 128.0 - 0.5
smooth_r = cv2.GaussianBlur(smooth_r, (5, 5), 1.0).astype(np.float32) / 128.0 - 0.5

def make_matte(f):
    t = np.clip((f + 0.1) / 0.2, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

matte_w = make_matte(smooth_w)
matte_r = make_matte(smooth_r)

# Remove detached squircle rim artifacts from matte_w by keeping only the largest 2 components (top R and bottom leg)
bin_w = (matte_w > 0.1).astype(np.uint8)
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(bin_w)

# Filter out small components (like squircle rim or noise)
clean_matte_w = np.zeros_like(matte_w)
for label in range(1, num_labels):
    area = stats[label, cv2.CC_STAT_AREA]
    if area > 10000: # Significant white parts
        clean_matte_w[labels == label] = matte_w[labels == label]

# Remove small noise from matte_r as well
bin_r = (matte_r > 0.1).astype(np.uint8)
num_r, labels_r, stats_r, _ = cv2.connectedComponentsWithStats(bin_r)
clean_matte_r = np.zeros_like(matte_r)
for label in range(1, num_r):
    area = stats_r[label, cv2.CC_STAT_AREA]
    if area > 10000: # Significant red rocket parts
        clean_matte_r[labels_r == label] = matte_r[labels_r == label]

# High quality color interpolation
up_crop = cv2.resize(crop[:,:,:3], (up_size, up_size), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
up_blur = cv2.GaussianBlur(up_crop, (0, 0), sigmaX=1.2)
up_sharp = np.clip(cv2.addWeighted(up_crop, 1.4, up_blur, -0.4, 0), 0, 255)

canvas = np.zeros((up_size, up_size, 4), dtype=np.uint8)
canvas_rgb = np.zeros((up_size, up_size, 3), dtype=np.float32)

for c in range(3):
    canvas_rgb[:,:,c] = up_sharp[:,:,c] * clean_matte_w

for c in range(3):
    canvas_rgb[:,:,c] = canvas_rgb[:,:,c] * (1.0 - clean_matte_r) + up_sharp[:,:,c] * clean_matte_r

total_a = np.maximum(clean_matte_w, clean_matte_r)
canvas[:,:,:3] = np.clip(canvas_rgb, 0, 255).astype(np.uint8)
canvas[:,:,3] = np.clip(total_a * 255.0, 0, 255).astype(np.uint8)

cv2.imwrite('temp_pristine_hd_emblem.png', canvas)
print('Saved temp_pristine_hd_emblem.png')

# Now create full 1242x2688 Splash Screen on 100% OLED Pure Black #000000
splash = np.zeros((2688, 1242, 4), dtype=np.uint8)
splash[:,:,3] = 255 # Pure black

# Emblem on splash: 600px wide (large, crisp, Retina display ready)
splash_w = 600
splash_h = 600
emblem_splash = cv2.resize(canvas, (splash_w, splash_h), interpolation=cv2.INTER_AREA)

top_y = int((2688 - splash_h) * 0.44)
left_x = int((1242 - splash_w) / 2)

s_rgb = emblem_splash[:,:,:3].astype(np.float32)
s_a = (emblem_splash[:,:,3].astype(np.float32) / 255.0)[:,:,np.newaxis]

roi = splash[top_y:top_y+splash_h, left_x:left_x+splash_w, :3].astype(np.float32)
splash[top_y:top_y+splash_h, left_x:left_x+splash_w, :3] = np.clip(s_rgb * s_a + roi * (1.0 - s_a), 0, 255).astype(np.uint8)

cv2.imwrite('temp_pristine_splash.png', splash)
print('Saved temp_pristine_splash.png')

# Now create Master App Icon (512x512) on 100% OLED Pure Black #000000
# Safe margin: 340px emblem centered in 512px
icon512 = np.zeros((512, 512, 4), dtype=np.uint8)
icon512[:,:,3] = 255

icon_emblem_size = 340
icon_emblem = cv2.resize(canvas, (icon_emblem_size, icon_emblem_size), interpolation=cv2.INTER_AREA)

icon_top = int((512 - icon_emblem_size) / 2)
icon_left = int((512 - icon_emblem_size) / 2)

i_rgb = icon_emblem[:,:,:3].astype(np.float32)
i_a = (icon_emblem[:,:,3].astype(np.float32) / 255.0)[:,:,np.newaxis]

roi_icon = icon512[icon_top:icon_top+icon_emblem_size, icon_left:icon_left+icon_emblem_size, :3].astype(np.float32)
icon512[icon_top:icon_top+icon_emblem_size, icon_left:icon_left+icon_emblem_size, :3] = np.clip(i_rgb * i_a + roi_icon * (1.0 - i_a), 0, 255).astype(np.uint8)

cv2.imwrite('temp_pristine_icon512.png', icon512)
print('Saved temp_pristine_icon512.png')
