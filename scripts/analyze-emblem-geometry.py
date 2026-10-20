import cv2
import numpy as np

src = cv2.imread('assets/designs/user_selected_icon.png')
left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Binary masks
mask_w = ((lum > 80) & (red_diff < 15)).astype(np.uint8) * 255
mask_r = ((red_diff > 18) & (r > 80)).astype(np.uint8) * 255

# Clean
k = np.ones((3,3), np.uint8)
mask_w = cv2.morphologyEx(mask_w, cv2.MORPH_OPEN, k)
mask_r = cv2.morphologyEx(mask_r, cv2.MORPH_OPEN, k)

# Find contours
cnts_w, _ = cv2.findContours(mask_w, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cnts_r, hierarchy = cv2.findContours(mask_r, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)

# Keep largest
cnts_w = sorted([c for c in cnts_w if cv2.contourArea(c) > 500], key=cv2.contourArea, reverse=True)
cnts_r = sorted([c for c in cnts_r if cv2.contourArea(c) > 500], key=cv2.contourArea, reverse=True)

print(f'White contours count: {len(cnts_w)}')
for i, c in enumerate(cnts_w):
    rect = cv2.boundingRect(c)
    print(f'  White {i}: bbox={rect}, area={cv2.contourArea(c)}')

print(f'Red contours count: {len(cnts_r)}')
for i, c in enumerate(cnts_r):
    rect = cv2.boundingRect(c)
    print(f'  Red {i}: bbox={rect}, area={cv2.contourArea(c)}')

# Let's also check hierarchy for Red to find outer loop and inner hole
# Red 0 should be outer, and one child should be hole
cv2.imwrite('temp_mask_w_clean.png', mask_w)
cv2.imwrite('temp_mask_r_clean.png', mask_r)
