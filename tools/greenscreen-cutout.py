"""
Cuts a character out of a solid-green background.

    python3 tools/greenscreen-cutout.py <in.jpg> <out.png> [--lace X0,Y0,X1,Y1 ...] [--glass CX,CY,RX,RY ...]

Every pixel gets an alpha from how much greener it is than red or blue, and the
green spill on edges is removed. Two options help with see-through things,
given in pixels of the original picture (several of each are allowed):

  --lace X0,Y0,X1,Y1   A box around lace or mesh (Delphine's fan). Inside it the
                       key is unmixed: each pixel is split into its own colour
                       and the green behind it, so the holes go see-through and
                       the threads keep their colour, with no green cast.
  --glass CX,CY,RX,RY  An ellipse over glass (Ezra's spectacle lens). Where the
                       green shows through the glass, it becomes a faint pale
                       sheen instead of a hole or a green patch.

Check the result over a dark and a light colour before using it (docs/ART.md).
Needs: pip install pillow numpy
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

args = sys.argv[1:]
src, dst = args[0], args[1]
laces, glasses = [], []
for flag, val in zip(args[2::2], args[3::2]):
    nums = [float(v) for v in val.split(',')]
    (laces if flag == '--lace' else glasses).append(nums)

im = np.asarray(Image.open(src).convert('RGB')).astype(float)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# greenness: how much green exceeds the larger of red and blue
gx = g - np.maximum(r, b)
alpha = np.clip(1 - (gx - 30) / 60, 0, 1)  # gx <= 30 opaque, >= 90 transparent
rgb = im.copy()

backdrop = np.median(im[20:300, 20:500].reshape(-1, 3), 0)  # the green, from the top-left corner
gx_backdrop = backdrop[1] - max(backdrop[0], backdrop[2])

for x0, y0, x1, y1 in laces:
    ys, xs = slice(int(y0), int(y1)), slice(int(x0), int(x1))
    sub, sgx = im[ys, xs], gx[ys, xs]
    gx_thread = -25.0  # pale lace is a little less green than red
    share = np.clip((gx_backdrop - sgx) / (gx_backdrop - gx_thread), 0, 1)
    share = np.where(share > 0.97, 1, share)
    share = np.clip((share - 0.08) / 0.92, 0, 1)
    own = ((sub - (1 - share[..., None]) * backdrop) / np.maximum(share[..., None], 0.05)).clip(0, 255)
    tinted = sgx > 4  # only touch pixels with green in them
    rgb[ys, xs][tinted] = own[tinted]
    alpha[ys, xs][tinted] = np.minimum(alpha[ys, xs][tinted], share[tinted])

# remove the green spill
rgb[..., 1] = np.minimum(rgb[..., 1], np.maximum(rgb[..., 0], rgb[..., 2]) * 1.02)

H, W = alpha.shape
yy, xx = np.mgrid[0:H, 0:W]
for cx, cy, rx, ry in glasses:
    inside = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 < 1
    sheen, sheen_alpha = np.array([215, 222, 225.0]), 0.28
    green_share = 1 - alpha
    new_alpha = alpha + green_share * sheen_alpha
    mixed = (alpha[..., None] * rgb + (green_share * sheen_alpha)[..., None] * sheen) / np.maximum(new_alpha, 1e-3)[..., None]
    rgb[inside], alpha[inside] = mixed[inside], new_alpha[inside]

out = np.dstack([rgb, alpha[..., None] * 255]).clip(0, 255).astype(np.uint8)
img = Image.fromarray(out, 'RGBA')
img.putalpha(img.getchannel('A').filter(ImageFilter.GaussianBlur(0.7)))
img.save(dst)
