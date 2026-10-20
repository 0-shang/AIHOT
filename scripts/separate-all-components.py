import cv2
import numpy as np

src = cv2.imread('assets/designs/user_selected_icon.png')
left, top, size = 55, 70, 335
crop = src[top:top+size, left:left+size]

b, g, r = crop[:,:,0].astype(np.float32), crop[:,:,1].astype(np.float32), crop[:,:,2].astype(np.float32)
lum = 0.299 * r + 0.587 * g + 0.114 * b
red_diff = r - np.maximum(g, b)

# 1. White Top R
mask_w_top = np.zeros((size, size), dtype=np.uint8)
# 2. White Leg
mask_w_leg = np.zeros((size, size), dtype=np.uint8)

# 3. Red Upper Fin
mask_r_fin1 = np.zeros((size, size), dtype=np.uint8)
# 4. Red Lower Fin
mask_r_fin2 = np.zeros((size, size), dtype=np.uint8)
# 5. Red Main Body
mask_r_body = np.zeros((size, size), dtype=np.uint8)
# 6. Inner Hole
mask_r_hole = np.zeros((size, size), dtype=np.uint8)

# Thresholds
is_white = (lum > 80) & (red_diff < 15)
is_red = (red_diff > 18) & (r > 80)

# Hole
for y in range(120, 200):
    for x in range(180, 260):
        if lum[y, x] < 45 and red_diff[y, x] < 15:
            mask_r_hole[y, x] = 255

# White components
cnts_w, _ = cv2.findContours(is_white.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cnts_w = sorted([c for c in cnts_w if cv2.contourArea(c) > 500], key=cv2.contourArea, reverse=True)
# The two largest white components:
# One has y < 160 (top), one has y > 180 (leg)
for c in cnts_w:
    rect = cv2.boundingRect(c)
    if rect[1] < 150:
        cv2.drawContours(mask_w_top, [c], -1, 255, -1)
    else:
        cv2.drawContours(mask_w_leg, [c], -1, 255, -1)

# Red components:
cnts_r, _ = cv2.findContours(is_red.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cnts_r = sorted([c for c in cnts_r if cv2.contourArea(c) > 500], key=cv2.contourArea, reverse=True)
for c in cnts_r:
    rect = cv2.boundingRect(c)
    if rect[2] > 150: # Main body
        cv2.drawContours(mask_r_body, [c], -1, 255, -1)
    elif rect[1] > 200: # Lower fin
        cv2.drawContours(mask_r_fin2, [c], -1, 255, -1)
    else: # Upper fin
        cv2.drawContours(mask_r_fin1, [c], -1, 255, -1)

# Fill hole inside main body mask so main body is solid
mask_r_body = cv2.bitwise_or(mask_r_body, mask_r_hole)

print('Separated all components successfully:')
print('  White Top pixels:', np.count_nonzero(mask_w_top))
print('  White Leg pixels:', np.count_nonzero(mask_w_leg))
print('  Red Body pixels:', np.count_nonzero(mask_r_body))
print('  Red Hole pixels:', np.count_nonzero(mask_r_hole))
print('  Red Fin1 pixels:', np.count_nonzero(mask_r_fin1))
print('  Red Fin2 pixels:', np.count_nonzero(mask_r_fin2))

cv2.imwrite('temp_comp_w_top.png', mask_w_top)
cv2.imwrite('temp_comp_w_leg.png', mask_w_leg)
cv2.imwrite('temp_comp_r_body.png', mask_r_body)
cv2.imwrite('temp_comp_r_hole.png', mask_r_hole)
cv2.imwrite('temp_comp_r_fin1.png', mask_r_fin1)
cv2.imwrite('temp_comp_r_fin2.png', mask_r_fin2)
