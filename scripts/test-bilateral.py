import cv2
import numpy as np

src = cv2.imread('assets/designs/user_selected_icon.png', cv2.IMREAD_UNCHANGED)

left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Foreground distance fields
# Background is dark gray/black (lum < 35, red_diff < 10)
# White R is lum > 100, red_diff < 15
# Red is red_diff > 18
field_white = (lum - 65.0) / 45.0
field_red = (red_diff - 16.0) / 20.0

up_size = 2010
up_white = cv2.resize(field_white, (up_size, up_size), interpolation=cv2.INTER_LANCZOS4)
up_red = cv2.resize(field_red, (up_size, up_size), interpolation=cv2.INTER_LANCZOS4)

# Bilateral / edge-preserving smoothing: smooths pixel steps without rounding off corners!
# First normalize to 0..255 uint8 for bilateralFilter
norm_w = np.clip((up_white + 0.5) * 128.0, 0, 255).astype(np.uint8)
norm_r = np.clip((up_red + 0.5) * 128.0, 0, 255).astype(np.uint8)

smooth_w = cv2.bilateralFilter(norm_w, d=9, sigmaColor=50, sigmaSpace=7)
smooth_r = cv2.bilateralFilter(norm_r, d=9, sigmaColor=50, sigmaSpace=7)

# Slight gentle anti-aliasing blur
smooth_w = cv2.GaussianBlur(smooth_w, (5, 5), 1.0).astype(np.float32) / 128.0 - 0.5
smooth_r = cv2.GaussianBlur(smooth_r, (5, 5), 1.0).astype(np.float32) / 128.0 - 0.5

# Sharp matte
def make_matte(f):
    t = np.clip((f + 0.1) / 0.2, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

matte_w = make_matte(smooth_w)
matte_r = make_matte(smooth_r)

# Colors
up_crop = cv2.resize(crop[:,:,:3], (up_size, up_size), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)

# Unsharp mask on colors
up_blur = cv2.GaussianBlur(up_crop, (0, 0), sigmaX=1.2)
up_sharp = np.clip(cv2.addWeighted(up_crop, 1.4, up_blur, -0.4, 0), 0, 255)

canvas = np.zeros((up_size, up_size, 4), dtype=np.uint8)
canvas_rgb = np.zeros((up_size, up_size, 3), dtype=np.float32)

# Composite white
for c in range(3):
    canvas_rgb[:,:,c] = up_sharp[:,:,c] * matte_w

# Composite red over white
for c in range(3):
    canvas_rgb[:,:,c] = canvas_rgb[:,:,c] * (1.0 - matte_r) + up_sharp[:,:,c] * matte_r

total_a = np.maximum(matte_w, matte_r)
canvas[:,:,:3] = np.clip(canvas_rgb, 0, 255).astype(np.uint8)
canvas[:,:,3] = np.clip(total_a * 255.0, 0, 255).astype(np.uint8)

cv2.imwrite('temp_bilateral_emblem.png', canvas)

# Check top serif crop
crop_top = canvas[int(up_size * (130-70)/335) : int(up_size * (190-70)/335), int(up_size * (110-55)/335) : int(up_size * (250-55)/335)]
cv2.imwrite('temp_check_top_serif_bilateral.png', crop_top)

print('Saved bilateral emblem and top crop')
