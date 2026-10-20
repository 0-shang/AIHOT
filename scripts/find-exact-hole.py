import cv2
import numpy as np

src = cv2.imread('assets/designs/user_selected_icon.png')
crop = src[70:70+335, 55:55+335]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# Let's find the inner hole:
# It's an island of dark background (lum < 40, red_diff < 10) surrounded by red (red_diff > 30)
# Region: x between 180 and 260, y between 120 and 200
hole_mask = np.zeros((335, 335), dtype=np.uint8)
for y in range(120, 200):
    for x in range(180, 260):
        if lum[y, x] < 45 and red_diff[y, x] < 15:
            hole_mask[y, x] = 255

# Clean hole mask
cnts, _ = cv2.findContours(hole_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cnts = sorted(cnts, key=cv2.contourArea, reverse=True)
if cnts:
    print('Hole found! Area:', cv2.contourArea(cnts[0]), 'bbox:', cv2.boundingRect(cnts[0]))
    cv2.imwrite('temp_exact_hole.png', hole_mask)
