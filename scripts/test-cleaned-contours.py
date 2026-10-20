import cv2
import numpy as np

img = cv2.imread('assets/designs/user_selected_icon.png')
left, top, w, h = 90, 125, 300, 280
crop = img[top:top+h, left:left+w]

b, g, r = crop[:,:,0], crop[:,:,1], crop[:,:,2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

mask_white = ((lum > 95) & (red_diff < 20)).astype(np.uint8) * 255
mask_red = ((red_diff > 18) & (r > 90)).astype(np.uint8) * 255

# Clean noise
kernel = np.ones((3,3), np.uint8)
mask_white = cv2.morphologyEx(mask_white, cv2.MORPH_OPEN, kernel)
mask_red = cv2.morphologyEx(mask_red, cv2.MORPH_OPEN, kernel)

# Find contours
cnts_w, _ = cv2.findContours(mask_white, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cnts_r, hierarchy_r = cv2.findContours(mask_red, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)

# Filter by area > 500
cnts_w = [c for c in cnts_w if cv2.contourArea(c) > 500]
cnts_r = [c for c in cnts_r if cv2.contourArea(c) > 500]

print('Significant White contours:', len(cnts_w))
for i, c in enumerate(cnts_w):
  print(f'White {i}: {len(c)} points')

print('Significant Red contours:', len(cnts_r))
for i, c in enumerate(cnts_r):
  print(f'Red {i}: {len(c)} points')
