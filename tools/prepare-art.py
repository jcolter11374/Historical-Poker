"""
Turns the original art into the files the game loads (public/art/<chapter>/).

    python3 tools/prepare-art.py <originals-folder> <chapter> [<room>]

Expects in <originals-folder>:
  background.jpg          the empty room and table (16:9, no people)
  <name>.png              each character already cut out (see greenscreen-cutout.py)
  <name>-portrait.jpg     optional: a portrait with its own background (placeholder art)
  title.jpg               optional: the chapter's title painting (shown behind the intro)

Writes WebP files about a tenth of the size, plus table-front.webp: the table
cut out of the background so it can sit in front of the characters.
TABLE_ELLIPSE says where the table's rim is, as shares of the background's
width and height; check it against each new background (docs/ART.md).

A chapter with two rooms (the Boom: 'cafe' and 'final') names the room as a
third argument. It then reads background-<room>.jpg and writes
background-<room>.webp and table-front-<room>.webp, with the rim looked up as
'<chapter>-<room>'. TABLE_CLIP keeps the table front inside a box, for a table
that is cut off by something in the picture (the café's monitor frame).
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
    'boom-cafe': (0.124, 0.49, 0.876, 0.86),
    'boom-final': (0.0, 0.497, 0.993, 0.932),
    'gaming-house': (-0.005, 0.495, 1.002, 1.0),
    'desert-classic': (-0.005, 0.5, 1.0, 0.985),
    'cercle': (-0.005, 0.493, 1.005, 0.982),
    'boardwalk': (-0.012, 0.492, 1.02, 1.03),
    'last-table': (-0.014, 0.496, 1.014, 0.966),
    'kitchen-table': (-0.008, 0.503, 1.008, 0.968),
    'big-o': (-0.005, 0.497, 1.005, 1.03),
}
# Left, top, right, bottom of the box the table front stays inside, as shares of the picture.
TABLE_CLIP = {
    'boom-cafe': (0.19, 0.0, 0.813, 1.0),  # the inside of the monitor's frame
}

src, chapter = Path(sys.argv[1]), sys.argv[2]
room = '-' + sys.argv[3] if len(sys.argv) > 3 else ''
out = Path(__file__).resolve().parent.parent / 'public' / 'art' / chapter
out.mkdir(parents=True, exist_ok=True)

bg = Image.open(src / f'background{room}.jpg').convert('RGB')
W, H = bg.size
size = (1920, round(1920 * H / W))
bg.resize(size, Image.LANCZOS).save(out / f'background{room}.webp', quality=82)

x0, y0, x1, y1 = TABLE_ELLIPSE[chapter + room]
mask = Image.new('L', bg.size, 0)
ImageDraw.Draw(mask).ellipse([x0 * W, y0 * H, x1 * W, y1 * H], fill=255)
if chapter + room in TABLE_CLIP:
    cx0, cy0, cx1, cy1 = TABLE_CLIP[chapter + room]
    box = Image.new('L', bg.size, 0)
    ImageDraw.Draw(box).rectangle([cx0 * W, cy0 * H, cx1 * W, cy1 * H], fill=255)
    mask = Image.composite(mask, box, box)
front = bg.convert('RGBA')
front.putalpha(mask.filter(ImageFilter.GaussianBlur(2)))
front.resize(size, Image.LANCZOS).save(out / f'table-front{room}.webp', quality=82)

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
