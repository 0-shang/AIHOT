import cv2
import numpy as np

src = cv2.imread('assets/designs/user_selected_icon.png')
left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

mask_w = ((lum > 80) & (red_diff < 15)).astype(np.uint8) * 255
mask_r = ((red_diff > 18) & (r > 80)).astype(np.uint8) * 255

k = np.ones((3,3), np.uint8)
mask_w = cv2.morphologyEx(mask_w, cv2.MORPH_OPEN, k)
mask_r = cv2.morphologyEx(mask_r, cv2.MORPH_OPEN, k)

# Find all contours including holes
cnts_w, hier_w = cv2.findContours(mask_w, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
cnts_r, hier_r = cv2.findContours(mask_r, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)

print('Red contours found:', len(cnts_r))
for i, c in enumerate(cnts_r):
    parent = hier_r[0][i][3]
    area = cv2.contourArea(c)
    bbox = cv2.boundingRect(c)
    print(f'Red {i}: parent={parent}, area={area}, bbox={bbox}')
