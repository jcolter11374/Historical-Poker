import sys, numpy as np
from PIL import Image, ImageFilter
src,dst=sys.argv[1],sys.argv[2]
im=np.asarray(Image.open(src).convert('RGB')).astype(float)
r,g,b=im[...,0],im[...,1],im[...,2]
# greenness: how much green exceeds the max of red/blue
gx=g-np.maximum(r,b)
a=np.clip(1-(gx-30)/60,0,1)  # gx<=30 opaque, >=90 transparent
# despill
spill=np.maximum(0,g-np.maximum(r,b))
g2=g-spill*0.9
out=np.dstack([r,g2,b,a*255]).clip(0,255).astype(np.uint8)
img=Image.fromarray(out,'RGBA')
al=img.getchannel('A').filter(ImageFilter.GaussianBlur(0.7)); img.putalpha(al)
img.save(dst)
