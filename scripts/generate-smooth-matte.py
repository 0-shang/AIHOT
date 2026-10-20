import cv2
import numpy as np

# Load source icon (500x484)
src = cv2.imread('assets/designs/user_selected_icon.png', cv2.IMREAD_UNCHANGED)

# Emblem bounding box: Left: 55, Top: 70, Size: 335
left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Create crisp float masks for White and Red
# Background in squircle is lum ~ 20-30, red_diff ~ 0
# White is lum ~ 240, red_diff ~ 0
# Red is lum ~ 90, red_diff ~ 140
raw_white = np.clip((lum - 55.0) / 40.0 - np.maximum(0.0, red_diff * 0.1), 0.0, 1.0)
raw_red = np.clip((red_diff - 14.0) / 15.0, 0.0, 1.0)

# Upscale 6x to 2010x2010 for ultra-high-definition subpixel processing
up_size = 2010
up_white = cv2.resize(raw_white, (up_size, up_size), interpolation=cv2.INTER_LANCZOS4)
up_red = cv2.resize(raw_red, (up_size, up_size), interpolation=cv2.INTER_LANCZOS4)

# Apply Gaussian filter on the high-res mask to eliminate raster pixelation steps
up_white_smooth = cv2.GaussianBlur(up_white, (21, 21), 4.5)
up_red_smooth = cv2.GaussianBlur(up_red, (21, 21), 4.5)

# Steep smoothstep thresholding: gives razor-sharp 1-pixel anti-aliased vector edges!
def sharp_matte(val, low=0.35, high=0.55):
    t = np.clip((val - low) / (high - low), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

matte_white = sharp_matte(up_white_smooth)
matte_red = sharp_matte(up_red_smooth)

# Upscale original colors with bicubic to keep smooth gradients
up_crop = cv2.resize(crop[:,:,:3], (up_size, up_size), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)

# Unsharp mask on colors to restore fine contrast
up_blur = cv2.GaussianBlur(up_crop, (0, 0), sigmaX=2.0)
up_sharp_crop = np.clip(cv2.addWeighted(up_crop, 1.5, up_blur, -0.5, 0), 0, 255)

# Render composite on pure black canvas
canvas = np.zeros((up_size, up_size, 4), dtype=np.uint8)

# The total alpha
total_alpha = np.maximum(matte_white, matte_red)

# For RGB:
# Red layer on top of White layer where red is present
canvas_rgb = np.zeros((up_size, up_size, 3), dtype=np.float32)

# White parts:
canvas_rgb[:,:,0] = up_sharp_crop[:,:,0] * matte_white
canvas_rgb[:,:,1] = up_sharp_crop[:,:,1] * matte_white
canvas_rgb[:,:,2] = up_sharp_crop[:,:,2] * matte_white

# Red parts (blend over white):
for c in range(3):
    canvas_rgb[:,:,c] = canvas_rgb[:,:,c] * (1.0 - matte_red) + up_sharp_crop[:,:,c] * matte_red

canvas[:,:,:3] = np.clip(canvas_rgb, 0, 255).astype(np.uint8)
canvas[:,:,3] = np.clip(total_alpha * 255.0, 0, 255).astype(np.uint8)

cv2.imwrite('temp_matte_emblem_2010.png', canvas)
print('Saved temp_matte_emblem_2010.png')

# Create Splash Screen (1242 x 2688)
splash = np.zeros((2688, 1242, 4), dtype=np.uint8)
splash[:,:,3] = 255 # Pure black

# Size on splash: 620px (grand, crisp, HD)
splash_w = 620
splash_h = 620
emblem_splash = cv2.resize(canvas, (splash_w, splash_h), interpolation=cv2.INTER_AREA)

top_y = int((2688 - splash_h) * 0.44)
left_x = int((1242 - splash_w) / 2)

s_rgb = emblem_splash[:,:,:3].astype(np.float32)
s_a = (emblem_splash[:,:,3].astype(np.float32) / 255.0)[:,:,np.newaxis]

roi = splash[top_y:top_y+splash_h, left_x:left_x+splash_w, :3].astype(np.float32)
splash[top_y:top_y+splash_h, left_x:left_x+splash_w, :3] = np.clip(s_rgb * s_a + roi * (1.0 - s_a), 0, 255).astype(np.uint8)

cv2.imwrite('temp_matte_splash.png', splash)
print('Saved temp_matte_splash.png')
