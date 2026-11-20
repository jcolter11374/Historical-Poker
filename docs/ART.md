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

## Placeholders: playing before the art exists

Every chapter is playable with no art at all:

- **Room:** with no `scene.background`, the table screen paints the room from the chapter's `scene.palette` (wall, lamp light, felt, rim colours): a dark wall, a warm lamp glow, a felt table ellipse and grain. Pick the palette from the era's colours so the placeholder already feels right.
- **Characters:** `art.kind: 'placeholder'` draws a painted head-and-shoulders silhouette in the character's `color` (made by `rival()` in `src/chapters/cast.ts`). Faces in the chapter select, intro and keepsake show the character's initial on that colour.
- **Cards, chips, the buck:** drawn in code for every chapter.

## Swapping in art for a chapter

1. Make the pictures from the prompts above, using the chapter's setting and cast from [CHAPTERS.md](CHAPTERS.md) and the outline.
2. Run the tools as in "From picture to game art", into `public/art/<chapter-id>/` (for example `public/art/painted-deck/`), and add the chapter's `TABLE_ELLIPSE` to `prepare-art.py`.
3. In the chapter file, set `scene.background` and `scene.tableFront` (see `riverboat.ts`: `art('background.webp')`), and give each rival real art instead of `rival(..., seat, colour)`: `art: { src, kind: 'cutout', aspect, place }` with `aspect` the image's width / height. The standard seat positions in `cast.ts` are a good start; nudge `place` and `plate` until they sit right.
4. Check every stage of the chapter in `npm run dev` (some stages change the lighting, like the Boom's final table), and update the list below.

## RSDP Live logo

The RSDP Live credit in the top right corner (`src/ui/PoweredBy.tsx`) is RSDP Live's "RSDP Live!" wordmark on its own: "RSDP" in off-white, "Live!" in red italic, as at the top of RSDP Live's home page. John chose this over the red chip icon with "Powered by" text. It links to RSDP Live, and its hover text and alt text say "Powered by RSDP Live".

The file is `public/brand/rsdp-live-wordmark.svg`, drawn by `tools/make-rsdp-wordmark.cjs` to match RSDP Live's `.logo` style (Inter Black, #eef1f4 and #ef5a4c), with the letters as outlines so it needs no font. If RSDP Live's logo ever changes, re-run the script (instructions are at the top of it). Never edit the RSDP Live repo from here. Keep the credit small: it is a credit, not a banner.

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

Each chapter needs: a **background** (the empty room and table, first-person from the player's seat, 16:9, no people), the **three rivals** seated waist-up on solid green, and optionally a **title card** and a prop or two. The setting and cast descriptions are in the outline. Everything not listed as done is a placeholder now. The prompts for each are in [ART_PROMPTS.md](ART_PROMPTS.md). Young Delphine needs no picture: you play her in the bonus, and the player is never shown. The Camp's table is drawn round (a barrelhead under an army blanket) rather than a crate, because `prepare-art.py` cuts the table front along an oval rim.

| Chapter | Background | Characters (on green) | Props worth painting |
| --- | --- | --- | --- |
| 1 The River | done | Silas done; Delphine, Ezra (portraits now) | silver dollars, buckhorn knife, title card |
| 2 The Painted Deck | Tudor great hall, Twelfth Night: candlelight, oak trestle table, tapestries, hearth | Lady Margery Ashcombe, Sir Roland Fettiplace, Brother Anselm | Tudor hand-painted card faces, shillings, the leather case stamped "M.A. 1543" |
| 3 The North Road | snowbound coaching-inn taproom: low beams, pewter, frosted windows, fire | Captain Josiah Pike, Hannah Pell, Jack Sorrel (gentleman's coat; masked version optional) | Georgian cards, coins, the coach's strongbox |
| 4 The Camp | lantern-lit army tent, hardtack-crate table, rain on canvas | Sergeant Amos Reed, Private Toby Finch, Hattie Bloom | greenbacks, the silver presentation watch |
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
- Silas: done, cut out from green.
- Delphine and Ezra: placeholders (portraits with backgrounds, faded at the edges). Needed: each seated on solid green, for proper cutouts.
- Still to make: a chapter title card, silver dollars, the buckhorn knife. The cards and the buck are drawn in code for now.
