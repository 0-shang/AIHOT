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

cnts_w = [c for c in cnts_w if cv2.contourArea(c) > 500]
cnts_r = [c for c in cnts_r if cv2.contourArea(c) > 500]

def points_to_svg_spline(pts, tension=1.0):
    n = len(pts)
    if n < 3:
        return ''
    
    # Identify sharp corners by angle
    is_corner = np.zeros(n, dtype=bool)
    for i in range(n):
        p_prev = pts[(i - 1) % n]
        p_curr = pts[i]
        p_next = pts[(i + 1) % n]
        
        v1 = p_prev - p_curr
        v2 = p_next - p_curr
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        if norm1 > 1e-4 and norm2 > 1e-4:
            cos_angle = np.dot(v1, v2) / (norm1 * norm2)
            angle = np.arccos(np.clip(cos_angle, -1.0, 1.0)) * 180 / np.pi
            if angle < 105: # Sharp corner!
                is_corner[i] = True
    
    d = f"M {pts[0][0]:.2f} {pts[0][1]:.2f} "
    
    for i in range(n):
        p0 = pts[(i - 1) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]
        
        # If p1 is sharp corner or p2 is sharp corner
        c1_corner = is_corner[i]
        c2_corner = is_corner[(i + 1) % n]
        
        if c1_corner and c2_corner:
            d += f"L {p2[0]:.2f} {p2[1]:.2f} "
        elif c1_corner:
            # Flat exit from corner
            cp1 = p1 + (p2 - p1) / 3.0
            cp2 = p2 - (p3 - p1) / (6.0 * tension)
            d += f"C {cp1[0]:.2f} {cp1[1]:.2f}, {cp2[0]:.2f} {cp2[1]:.2f}, {p2[0]:.2f} {p2[1]:.2f} "
        elif c2_corner:
            # Flat entry into corner
            cp1 = p1 + (p2 - p0) / (6.0 * tension)
            cp2 = p2 - (p2 - p1) / 3.0
            d += f"C {cp1[0]:.2f} {cp1[1]:.2f}, {cp2[0]:.2f} {cp2[1]:.2f}, {p2[0]:.2f} {p2[1]:.2f} "
        else:
            cp1 = p1 + (p2 - p0) / (6.0 * tension)
            cp2 = p2 - (p3 - p1) / (6.0 * tension)
            d += f"C {cp1[0]:.2f} {cp1[1]:.2f}, {cp2[0]:.2f} {cp2[1]:.2f}, {p2[0]:.2f} {p2[1]:.2f} "
            
    d += "Z"
    return d

svg_paths_w = []
for c in cnts_w:
    approx = cv2.approxPolyDP(c, 1.2, True)[:, 0, :]
    svg_paths_w.append(points_to_svg_spline(approx, tension=0.8))

svg_paths_r = []
for c in cnts_r:
    approx = cv2.approxPolyDP(c, 1.2, True)[:, 0, :]
    svg_paths_r.append(points_to_svg_spline(approx, tension=0.8))

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">
  <rect width="100%" height="100%" fill="#000000" />
  <g fill="#FFFFFF">
    {' '.join([f'<path d="{d}" />' for d in svg_paths_w])}
  </g>
  <g fill="#CE1141" fill-rule="evenodd">
    {' '.join([f'<path d="{d}" />' for d in svg_paths_r])}
  </g>
</svg>'''

with open('temp_vector_spline.svg', 'w') as f:
    f.write(svg)

print('Saved temp_vector_spline.svg')
