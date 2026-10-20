import cv2
import numpy as np

# Load source icon
img = cv2.imread('assets/designs/user_selected_icon.png')

# Emblem bounding box: left: 90, top: 125, width: 300, height: 280
left, top, w, h = 90, 125, 300, 280
crop = img[top:top+h, left:left+w]

# Convert to float
crop_float = crop.astype(np.float32)
b, g, r = crop_float[:,:,0], crop_float[:,:,1], crop_float[:,:,2]

lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Create continuous float fields for White and Red
# White field: positive where lum > 100 and red_diff < 15
white_field = (lum - 90) - np.maximum(0, red_diff * 2)
# Red field: positive where red_diff > 15 and r > 80
red_field = red_diff - 12.0

# Scale up 6x using bicubic/lanczos for subpixel smooth contouring
scale = 6
up_w, up_h = w * scale, h * scale

up_white = cv2.resize(white_field, (up_w, up_h), interpolation=cv2.INTER_LANCZOS4)
up_red = cv2.resize(red_field, (up_w, up_h), interpolation=cv2.INTER_LANCZOS4)

# Apply gentle Gaussian blur to eliminate any raster pixel stepping
up_white = cv2.GaussianBlur(up_white, (15, 15), 3.0)
up_red = cv2.GaussianBlur(up_red, (15, 15), 3.0)

# Binary masks: 0 for foreground (black for potrace), 255 for background (white)
mask_white = np.where(up_white > 0, 0, 255).astype(np.uint8)
mask_red = np.where(up_red > 0, 0, 255).astype(np.uint8)

cv2.imwrite('temp_py_mask_white.png', mask_white)
cv2.imwrite('temp_py_mask_red.png', mask_red)

print('Successfully exported smooth subpixel masks at', up_w, 'x', up_h)
