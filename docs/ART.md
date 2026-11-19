# Art

John makes the art with an image tool from the prompts below. This page covers the style, the prompts, and how a picture becomes game art.

## Style

The style target is John's painted riverboat scene: painted and hand-inked, worn textures, warm lamplight against blue moonlight. Every chapter matches its finish with its own era palette (see the outline's "Art and UI direction"). No boxes or panels in the UI: controls are chips on the table, dialogue is plain text on a shaded strip across the bottom.

Attach the style-target image as a reference to every prompt, so the style stays the same.

## Layers

Each chapter's table scene is built from separate pictures, so characters can dim, react and sit behind the table:

| Layer | File in `public/art/<chapter>/` | Made from |
| --- | --- | --- |
| Background: the empty room and table, no people | `background.webp` | Prompt 1 |
| Table front: the table only, cut from the background | `table-front.webp` | `tools/prepare-art.py` |
| Each character, waist up, transparent around them | `<name>.webp` | Prompt 2, then `tools/greenscreen-cutout.py` |
| Placeholder: a character portrait with its own background | `<name>-portrait.webp` | Used until a cutout exists; the UI fades its edges |

## Prompts

**1. Background (empty table)**

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures, warm lamplight. The same steamboat card room in 1836 with NO people: dark wood-paneled wall, two round brass portholes showing a moonlit river and stars, a hanging oil lamp glow, and a large oval card table with a chipped gilt rim and worn green felt filling the bottom half. Nothing on the table. First-person view from a seat at the table. 16:9, no text.
```

For a new chapter, swap the room description for the chapter's setting from the outline.

**2. Each character**

```
Match the attached image's art style exactly. [character description], seated, visible from the waist up as if sitting behind a table, facing the viewer. Isolated on a plain transparent background (or solid pure green if transparency isn't available). No table, no text.
```

The character descriptions are in the outline's cast tables.

## From picture to game art

You need Python 3 with `pip install pillow numpy`.

1. Put the originals in a folder: `background.jpg`, and each character as `<name>.png` (cut out) or `<name>-portrait.jpg` (placeholder).
2. If a character came on green, cut it out: `python3 tools/greenscreen-cutout.py silas-green.png silas.png`. Check the edges; the thresholds are in the script.
3. Run `python3 tools/prepare-art.py <originals-folder> <chapter>`. It writes WebP files into `public/art/<chapter>/` and makes `table-front.webp`.
4. The table front is an ellipse matching the table's rim, set per chapter in `TABLE_ELLIPSE` in `prepare-art.py` as shares of the picture's width and height. For a new background, adjust it until the rim lines up (look at the table screen: characters should disappear behind the rim, not in front of it).
5. Place each character in the chapter file (`art.place`: centre x, bottom y and height, in stage pixels on the 1600 x 900 stage), and their name plate (`plate`). Check in `npm run dev`.

Keep the originals out of the repo; only the WebP files in `public/art` are committed.

## Current state, chapter 1

- Background and table front: done.
- Silas: done, cut out from green.
- Delphine and Ezra: placeholders (portraits with backgrounds, faded at the edges). Needed: each seated on solid green, for proper cutouts.
- Still to make: a chapter title card, silver dollars, the buckhorn knife. The cards and the buck are drawn in code for now.
