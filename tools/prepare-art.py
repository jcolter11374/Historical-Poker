"""
Turns the original art into the files the game loads (public/art/<chapter>/).

    python3 tools/prepare-art.py <originals-folder> <chapter>

Expects in <originals-folder>:
  background.jpg          the empty room and table (16:9, no people)
  <name>.png              each character already cut out (see greenscreen-cutout.py)
  <name>-portrait.jpg     optional: a portrait with its own background (placeholder art)
  title.jpg               optional: the chapter's title painting (shown behind the intro)

Writes WebP files about a tenth of the size, plus table-front.webp: the table
cut out of the background so it can sit in front of the characters.
TABLE_ELLIPSE says where the table's rim is, as shares of the background's
width and height; check it against each new background (docs/ART.md).
Needs: pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

TABLE_ELLIPSE = {
    'riverboat': (-0.007, 0.505, 1.007, 1.02),
    'painted-deck': (-0.005, 0.5, 1.005, 1.0),
    'north-road': (-0.005, 0.5, 1.0, 0.985),
    'camp': (-0.005, 0.5, 1.0, 0.985),
    'back-room': (-0.005, 0.495, 1.0, 0.985),
    'last-hand': (-0.005, 0.5, 1.0, 0.985),
}

src, chapter = Path(sys.argv[1]), sys.argv[2]
out = Path(__file__).resolve().parent.parent / 'public' / 'art' / chapter
out.mkdir(parents=True, exist_ok=True)

bg = Image.open(src / 'background.jpg').convert('RGB')
W, H = bg.size
size = (1920, round(1920 * H / W))
bg.resize(size, Image.LANCZOS).save(out / 'background.webp', quality=82)

x0, y0, x1, y1 = TABLE_ELLIPSE[chapter]
mask = Image.new('L', bg.size, 0)
ImageDraw.Draw(mask).ellipse([x0 * W, y0 * H, x1 * W, y1 * H], fill=255)
front = bg.convert('RGBA')
front.putalpha(mask.filter(ImageFilter.GaussianBlur(2)))
front.resize(size, Image.LANCZOS).save(out / 'table-front.webp', quality=82)

for p in src.glob('*.png'):
    im = Image.open(p)
    im = im.crop(im.getbbox())
    im = im.resize((round(im.width * 900 / im.height), 900), Image.LANCZOS)
    im.save(out / (p.stem + '.webp'), quality=85)
    print(p.stem, 'aspect', round(im.width / im.height, 4))

if (src / 'title.jpg').exists():
    t = Image.open(src / 'title.jpg').convert('RGB')
    t.resize((1920, round(1920 * t.height / t.width)), Image.LANCZOS).save(out / 'title.webp', quality=82)

for p in src.glob('*-portrait.jpg'):
    im = Image.open(p).convert('RGB')
    im.resize((1200, round(1200 * im.height / im.width)), Image.LANCZOS).save(out / (p.stem + '.webp'), quality=82)
