# Art

John makes the art with an image tool from the prompts below. This page covers the style, the prompts, and how a picture becomes game art.

**Ready-to-paste prompts for every chapter** (backgrounds, every rival on green, title paintings, props) are in [ART_PROMPTS.md](ART_PROMPTS.md). The two below are the general templates.

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
| Title painting: shown behind the chapter's intro screen | `title.webp` | The title prompt in ART_PROMPTS.md. Keep its left side quiet (sky, shadow): the intro text sits there on a shade that fades out to the right |

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

1. Put the originals in a folder: `background.jpg`, optionally `title.jpg`, and each character as `<name>.png` (cut out) or `<name>-portrait.jpg` (placeholder).
2. If a character came on green, cut it out: `python3 tools/greenscreen-cutout.py silas-green.png silas.png`. Check the edges over a dark and a light colour; the thresholds are in the script. For see-through parts, give the script their place in the original picture's pixels: `--lace x0,y0,x1,y1` boxes lace or mesh so the holes go clear with no green cast, and `--glass cx,cy,rx,ry` covers a lens so the green behind it becomes a faint glass sheen, not a hole. Chapter 1 used `--lace 1370,570,2000,1040` for Delphine's fan and `--glass 1626,508,43,44` for Ezra's right lens. If the image tool leaves stray text or smudges near the bottom, as on Anselm's, clear them by hand or ask for the picture again; Anselm's were cleared by keeping only what lies inside his robe's ink outline below y = 1050. Chapter 3 needed the same: a blurred blob beside Hannah was cleared, and the table edges drawn under Pike (a line) and Sorrel (an arc) were cut away, which only loses what the table hides anyway. Chapter 4: Toby's picture had game text, a smear and blurred chips across the bottom, so he is kept down to the chest and faded out there; Reed's green darkened toward the bottom, so there it is keyed by how much green outweighs red and blue.
3. Run `python3 tools/prepare-art.py <originals-folder> <chapter>`. It writes WebP files into `public/art/<chapter>/` and makes `table-front.webp`.
4. The table front is an ellipse matching the table's rim, set per chapter in `TABLE_ELLIPSE` in `prepare-art.py` as shares of the picture's width and height. For a new background, adjust it until the rim lines up (look at the table screen: characters should disappear behind the rim, not in front of it).
5. Place each character in the chapter file (`art.place`: centre x, bottom y and height, in stage pixels on the 1600 x 900 stage), and their name plate (`plate`). Check in `npm run dev`.

Keep the originals out of the repo; only the WebP files in `public/art` are committed. Screenshots of each chapter with its art in place are in `docs/screenshots/`; replace them when the art changes.

## Placeholders: playing before the art exists

Every chapter is playable with no art at all:

- **Room:** with no `scene.background`, the table screen paints the room from the chapter's `scene.palette` (wall, lamp light, felt, rim colours): a dark wall, a warm lamp glow, a felt table ellipse and grain. Pick the palette from the era's colours so the placeholder already feels right.
- **Characters:** `art.kind: 'placeholder'` draws a painted head-and-shoulders silhouette in the character's `color` (made by `rival()` in `src/chapters/cast.ts`). Faces in the chapter select, intro and keepsake show the character's initial on that colour.
- **Cards, chips, the buck:** drawn in code for every chapter.

## Swapping in art for a chapter

1. Make the pictures from the prompts above, using the chapter's setting and cast from [CHAPTERS.md](CHAPTERS.md) and the outline.
2. Run the tools as in "From picture to game art", into `public/art/<chapter-id>/` (for example `public/art/painted-deck/`), and add the chapter's `TABLE_ELLIPSE` to `prepare-art.py`.
3. In the chapter file, set `scene.background`, `scene.tableFront` and (if painted) `scene.title` (see `riverboat.ts`: `art('background.webp')`), and give each rival real art: keep `rival(..., seat, colour)` and override its art, `{ ...rival(...), art: cutout(art('name.webp'), aspect, place) }`, with `aspect` the image's width / height (see `paintedDeck.ts`). The standard seat positions in `cast.ts` are a good start; nudge `place` and `plate` until they sit right.
4. Check every stage of the chapter in `npm run dev` (some stages change the lighting, like the Boom's final table), and update the list below.

## Music

No music is in the game yet; the hook is ready. To add a loop for a chapter:

1. Find or make a track that is free to use in a public game: CC0 / public domain is simplest (for example from freepd.com, opengameart.org filtered to CC0, or the Free Music Archive filtered to CC0). CC BY is fine too if the credit goes in [CREDITS.md](CREDITS.md). Don't use anything "non-commercial" or unlicensed.
2. Keep it short and quiet (a 1 to 3 minute loop, MP3 or OGG at 96 to 128 kbps, under about 3 MB), and in the era: a fiddle or banjo for the river and the camp, a lute for 1543, a piano for the back room, lounge jazz for 1972.
3. Put it in `public/music/`, and in the chapter file set `scene.music: 'music/<file>.mp3'` (or a stage's `scene.music` to change it for that stage).
4. Add a line to [CREDITS.md](CREDITS.md) with the source, author and license.

The player turns music off with the Music box on the chapter select. It fades in, loops, and fades between chapters (`src/ui/sound.ts`).

## Motion and sound effects

The table's motion (cards dealt from the dealer, chips sliding, cards turning over) is CSS and drawn chips, so it works with any art and needs no files. Sound effects are made in code. If a painted chip or card back arrives, swap it into `ChipFlight` / `.card-back`; the motion stays the same. See [ARCHITECTURE.md](ARCHITECTURE.md), "Motion and sound".

## Art needed, per chapter

Each chapter needs: a **background** (the empty room and table, first-person from the player's seat, 16:9, no people), the **three rivals** seated waist-up on solid green, and optionally a **title card** and a prop or two. The setting and cast descriptions are in the outline. Everything not listed as done is a placeholder now. The prompts for each are in [ART_PROMPTS.md](ART_PROMPTS.md). Young Delphine needs no picture: you play her in the bonus, and the player is never shown. The Camp's table is drawn round (a big round board under an army blanket) rather than a crate, because `prepare-art.py` cuts the table front along an oval rim.

| Chapter | Background | Characters (on green) | Props worth painting |
| --- | --- | --- | --- |
| 1 The River | done | all done | silver dollars, buckhorn knife (title painting done) |
| 2 The Painted Deck | done (a round oak table with red cloth) | all done | Tudor hand-painted card faces, shillings, the leather case stamped "M.A. 1543" (title painting done) |
| 3 The North Road | done | all done (one Sorrel, not masked) | Georgian cards, coins, the coach's strongbox (title painting done) |
| 4 The Camp | done | all done (Toby is cut off at the chest; the table hides the rest) | greenbacks, the silver presentation watch (title painting done) |
| 5 The Last Hand | Deadwood saloon: plank walls, dusty light, oil lamps | Ruby Calloway, Jasper Crane, "Doc" Abel Whitcomb | gold-dust pouch, 1870s indexed cards; an epilogue painting of the full case |
| Bonus The Gaming House | New Orleans gaming house: candlelight, iron balconies | Madame Élodie Fontaine, Henri Avery, Captain Lacroix | piquet cards, Spanish silver, a payout board |
| 6 The Back Room | speakeasy behind a florist's shop: one green lamp, brick, crates of flowers | Nora Shea, Sal Moretti, Gus Lindqvist | a matchbook, chips in a flowerpot |
| 7 The Desert Classic | 1970s casino tournament room: low ceiling, smoke, patterned carpet | "Tex" Dawson Pruitt, Professor Milton Weiss, Lorraine Fisk | clay chips, a tournament program |
| 8 The Cercle | private Paris card club: panelled salon, chandelier, cigar smoke | Comte Lucien Varenne, Siobhan Kearney, Dmitri Volkov | plaques (rectangular chips) |
| 9 The Boardwalk | 1990s Atlantic City poker room: neon, mirrors, ocean at the window | Margot Arceneaux, Benny "the Book" Russo, Ruth Goldfarb | Delphine's diary |
| 10 The Boom | two: a cramped internet café at 3 a.m. (monitor glow, the screen as the table), then a TV final table in Las Vegas (stage lights, cameras) | "N0rthStar" (as an avatar, and as Nate Crane in person), "DeuceSeven", "Hanbit" (avatars and in person) | avatars, chat window, TV graphics |
| 11 The Big O | big modern card room in the English Midlands: rows of tables, bright lights | Gaz Whitlock, Kerry-Ann Booth, Mr. Emeka Okafor | |
| 12 The Last Table | private room over Macau harbour at night: one table, city lights | Victor Crane (riverboat cufflinks), Mei Lin Chau, Rafael Duarte | the tablet menu, tea set |
| Epilogue The Kitchen Table | a kitchen at night: warm light, pizza box, mismatched chips | Marcus, Priya, Dee | the full leather case on the counter |

The player is never shown, so no art is needed for the Averys. Faces on the chapter select and keepsakes are cropped from the character art, so no separate portraits are needed.

## Current state, chapter 1

- Background and table front: done.
- Silas, Delphine and Ezra: done, cut out from green. Delphine's lace fan is see-through; Ezra's right lens keeps a faint glass sheen where the backdrop showed through.
- Title painting (the Magnolia Queen at night): done, behind the intro screen.
- Still to make: silver dollars, the buckhorn knife. The cards and the buck are drawn in code for now.
