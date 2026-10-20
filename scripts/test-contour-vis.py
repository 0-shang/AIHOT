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

cnts_w, _ = cv2.findContours(mask_w, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cnts_r, hierarchy = cv2.findContours(mask_r, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

vis = np.zeros((size, size, 3), dtype=np.uint8)

# Draw white
cv2.drawContours(vis, cnts_w, -1, (255, 255, 255), -1)

# Draw red
cv2.drawContours(vis, cnts_r, -1, (0, 0, 255), -1)

cv2.imwrite('temp_vis_contours.png', vis)
print('Hierarchy for red:', hierarchy)
