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

contours_white, _ = cv2.findContours(mask_white, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_L1)
contours_red, _ = cv2.findContours(mask_red, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_L1)

print('White contours:', len(contours_white))
for i, c in enumerate(contours_white):
  print(f'  White {i}: {len(c)} points, area={cv2.contourArea(c)}')

print('Red contours:', len(contours_red))
for i, c in enumerate(contours_red):
  print(f'  Red {i}: {len(c)} points, area={cv2.contourArea(c)}')
