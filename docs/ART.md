# Art

John makes the art with an image tool from the prompts below. This page covers the style, the prompts, and how a picture becomes game art.

**Ready-to-paste prompts for every chapter** (backgrounds, every rival on green, title paintings, props) are in [ART_PROMPTS.md](ART_PROMPTS.md). The two below are the general templates. Every rival holds the number of cards that is right for the chapter's game (five for draw, one hole card for five-card stud, two for Hold'em and so on): the table is in ART_PROMPTS.md, with the list of painted pictures that still show the wrong number.

## Style

The style target is John's painted riverboat scene: painted and hand-inked, worn textures, warm lamplight against blue moonlight. Every chapter matches its finish with its own era palette (see the outline's "Art and UI direction"). No boxes or panels in the UI: controls are chips on the table, dialogue is plain text on a shaded strip across the bottom.

Attach one clean finished picture as the reference to every prompt, so the style stays the same: a finished character on green for characters, the clean table (`background-clean-table.jpg`) for backgrounds, a finished title for titles (the exact files are listed at the top of ART_PROMPTS.md). Do not attach `style-target-riverboat.jpg`: it is a full game mockup, and the image tool copies its dialogue text, fan and chips into new pictures.

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
2. If a character came on green, cut it out: `python3 tools/greenscreen-cutout.py silas-green.png silas.png`. Check the edges over a dark and a light colour; the thresholds are in the script. For see-through parts, give the script their place in the original picture's pixels: `--lace x0,y0,x1,y1` boxes lace or mesh so the holes go clear with no green cast, and `--glass cx,cy,rx,ry` covers a lens so the green behind it becomes a faint glass sheen, not a hole. Chapter 1 used `--lace 1370,570,2000,1040` for Delphine's fan and `--glass 1626,508,43,44` for Ezra's right lens. If the image tool leaves stray text or smudges near the bottom, as on Anselm's, clear them by hand or ask for the picture again; Anselm's were cleared by keeping only what lies inside his robe's ink outline below y = 1050. Chapter 3 needed the same: a blurred blob beside Hannah was cleared, and the table edges drawn under Pike (a line) and Sorrel (an arc) were cut away, which only loses what the table hides anyway. Chapter 4: Toby's picture had game text, a smear and blurred chips across the bottom, so he is kept down to the chest and faded out there; Reed's green darkened toward the bottom, so there it is keyed by how much green outweighs red and blue. Chapter 5: Ruby's picture had a table edge drawn under her arms, so everything from that line down (y = 1414) was cut away; the lighter patch in her backdrop keyed out by itself. Jasper's picture showed a wooden chair back right of his coat and his lap along the bottom: the chair was cut away along the coat's ink outline, and everything from y = 1430 down was removed.
3. Run `python3 tools/prepare-art.py <originals-folder> <chapter>`. It writes WebP files into `public/art/<chapter>/` and makes `table-front.webp`.
4. The table front is an ellipse matching the table's rim, set per chapter in `TABLE_ELLIPSE` in `prepare-art.py` as shares of the picture's width and height. For a new background, adjust it until the rim lines up (look at the table screen: characters should disappear behind the rim, not in front of it).
5. Place each character in the chapter file (`art.place`: centre x, bottom y and height, in stage pixels on the 1600 x 900 stage), and their name plate (`plate`). Check in `npm run dev`.

Keep the originals out of the repo; only the WebP files in `public/art` are committed. Screenshots of each chapter with its art in place are in `docs/screenshots/`; replace them when the art changes.

## Placeholders: playing before the art exists

Every chapter is playable with no art at all:

- **Room:** with no `scene.background`, the table screen paints the room from the chapter's `scene.palette` (wall, lamp light, felt, rim colours): a dark wall, a warm lamp glow, a felt table ellipse and grain. Pick the palette from the era's colours so the placeholder already feels right.
- **Characters:** `art.kind: 'placeholder'` draws a painted head-and-shoulders silhouette in the character's `color` (made by `rival()` in `src/chapters/cast.ts`). Faces in the chapter select, intro and keepsake show the character's initial on that colour.
- **Cards, chips, the dealer's marker:** drawn in code for every chapter. The marker is a buck knife or a dealer button by chapter (`Marker` in `src/ui/TableScreen.tsx`; GAME_DESIGN.md, "The dealer's marker").

## Swapping in art for a chapter

1. Make the pictures from the prompts above, using the chapter's setting and cast from [CHAPTERS.md](CHAPTERS.md) and the outline.
2. Run the tools as in "From picture to game art", into `public/art/<chapter-id>/` (for example `public/art/painted-deck/`), and add the chapter's `TABLE_ELLIPSE` to `prepare-art.py`.
3. In the chapter file, set `scene.background`, `scene.tableFront` and (if painted) `scene.title` (see `riverboat.ts`: `art('background.webp')`), and give each rival real art: keep `rival(..., seat, colour)` and override its art, `{ ...rival(...), art: cutout(art('name.webp'), aspect, place) }`, with `aspect` the image's width / height (see `paintedDeck.ts`). The standard seat positions in `cast.ts` are a good start; nudge `place` and `plate` until they sit right.
4. Check every stage of the chapter in `npm run dev` (some stages change the room, like the Boom's final table), and update the list below.

### A chapter with two rooms (the Boom)

The Boom is played in two rooms, so its files carry the room's name: `background-cafe.jpg` and `background-final.jpg` in the originals folder, and `python3 tools/prepare-art.py <originals-folder> boom cafe` (then `... boom final`) writes `background-cafe.webp`, `table-front-cafe.webp` and so on. The rims are in `TABLE_ELLIPSE` as `boom-cafe` and `boom-final`.

- **The café** is the chapter's own `scene`. Its table is a picture on a monitor, cut off by the monitor's frame at both sides, so `TABLE_CLIP` in `prepare-art.py` keeps the table front inside the screen. The screen covers about x 305 to 1315 of the 1600-wide stage, so the three rivals sit closer together than usual (`ONLINE` in `boom.ts`): square avatars standing above the far rim, name plates under them. One thing follows from the tight seats: the avatars set `tellAbove` (tells show over the avatar, not beside it). The pot sits in the middle of the screen's felt, as at every table.
- **The avatars** are square icons in a silver frame on green, cut out like any character: `python3 tools/greenscreen-cutout.py deuceseven-avatar-green.jpg deuceseven-avatar.png`. They are also the faces on the chapter select, intro and keepsake.
- **The final table** is the last stage's `scene`, and that stage's `seats` gives each rival their in-person art and the standard seat places (see `Stage.seats` in `types.ts`). A rival not yet painted keeps the placeholder there: `standardSeat('across', colour)`.

## RSDP Live logo

The RSDP Live credit in the top right corner (`src/ui/PoweredBy.tsx`) reads "Powered by" in small plain text, then RSDP Live's "RSDP Live!" wordmark: "RSDP" in off-white, "Live!" in red italic, as at the top of RSDP Live's home page. John chose the wordmark over the red chip icon. It links to RSDP Live.

The file is `public/brand/rsdp-live-wordmark.svg`, drawn by `tools/make-rsdp-wordmark.cjs` to match RSDP Live's `.logo` style (Inter Black, #eef1f4 and #ef5a4c), with the letters as outlines so it needs no font. If RSDP Live's logo ever changes, re-run the script (instructions are at the top of it). Never edit the RSDP Live repo from here. Keep the credit small: it is a credit, not a banner.

## Music

Every chapter has an original music loop, made in code: see [MUSIC.md](MUSIC.md) for the tunes and how to change one. To use a recorded track instead, it must be free to use in a public game (CC0 / public domain is simplest; CC BY is fine with a line in [CREDITS.md](CREDITS.md); nothing "non-commercial"). Put it in `public/music/`, add its file name, title and loop length in seconds to `src/ui/music.json`, and point the chapter's `scene.music` at it.

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
| 5 The Last Hand | done | all done | gold-dust pouch, 1870s indexed cards; an epilogue painting of the full case (title painting done: Deadwood's main street) |
| Bonus The Gaming House | done (a salon with a red table, a chandelier and an open balcony door) | all done | piquet cards, Spanish silver, a payout board (title painting done: a French Quarter street at night) |
| 6 The Back Room | done | all done (Nora is cut off at her waistband, Gus above his lap; the table hides the rest) | a matchbook, chips in a flowerpot (title painting done: the florist's shop in the rain) |
| 7 The Desert Classic | done | all done (Weiss's lap and Lorraine's knee are cut away; the table hides the cuts) | clay chips, a tournament program (title painting done: the strip at dusk) |
| 8 The Cercle | done | all done (four cards each; Siobhan is cut off at her waist; the table hides the rest) | plaques (rectangular chips) (title painting done: a Paris boulevard at night, the tower across the river) |
| 9 The Boardwalk | done | all done | Delphine's diary (title painting done: the boardwalk at dusk) |
| 10 The Boom | both done: the café's monitor with the online table on its screen, and the televised final table (red felt, black rail) | the three avatars done (shark, star, tiger cub); in person, all done (Nat Crane fixed by hand to two cards) | chat window, TV graphics (title painting done: the café and the TV stage side by side) |
| 11 The Big O | done (rows of tables, a bar, waiting-list screens blurred by hand) | all done (five cards each) | modern chips (title painting done: the casino by a canal on a wet evening) |
| 12 The Last Table | done (private room over Macau harbour at night: red felt, the bridge and the observation tower; the lampshade painted out) | all done (Mei Lin fixed by hand to one card; Victor's lamp painted out) | the tablet menu, tea set (title painting done: the old street, the tower and the bridge at night) |
| Epilogue The Kitchen Table | done (a kitchen at night: wedding cake, flowers, the leather case on the counter, a green folding felt) | Dee done; Victor and Elena reuse their chapter 12 pictures (Marcus and Priya speak but are not seen) | the full leather case on the counter (title painting done: the house on a rainy street) |
| The opening and the ending | nine paintings in the style of the title paintings, one per slide (three more are optional) | none | see [ART_PROMPTS.md](ART_PROMPTS.md), "The opening and the ending" |

The player is never shown, so no art is needed for the Averys. Faces on the chapter select and keepsakes are cropped from the character art, so no separate portraits are needed.

## Current state, card counts in the old chapters

Every rival must hold the number of cards their chapter's game deals (table at the top of ART_PROMPTS.md). Eight early pictures did not; status as of 2026-11-21, with the details in ART_PROMPTS.md, "Painted pictures to redo for card count":

- Done: Silas (five, new picture), Sir Roland (four, new picture plus one card added by hand), Brother Anselm (four, one added by hand), Doc Whitcomb (five, one added by hand), Hattie (one hole card, the others painted out). Each sits in the same place as before, as the cut-outs kept their old proportions.
- Still to do, as new pictures: Ruby (about nine), Toby and Sergeant Reed (fanned hands instead of one hole card).

## Current state, game-wide pictures

- Title screen: done (`public/art/title-screen.webp`, from art/title-screen.jpg in the project files): the open leather case on green baize with the old cards spilling out, a brass lamp and a few coins. It sits behind "Still Ours" after the opening pictures; the shade darkens only the top, where the title is. Made at 1600 wide from the original with Pillow (quality 80); no cleanup needed.
- Chapter select, the deck case: done (`public/art/chapter-select.webp`, from art/chapter-select.jpg): looking down into the open case, plain red velvet framed by worn leather. It fills the chapter select behind a light shade (`SELECT_ART` in `ChapterSelect.tsx`), and the drawn case around the cards steps back so the painting is the case. The practice screen keeps the plain background.
- Screenshots: `docs/screenshots/title-screen.jpg`, `chapter-select.jpg`.
- The opening pictures (`public/art/montage/`, set as each slide's `image` in `src/story/montages.ts`): 1, Ashcombe Hall, 2, the cheat, and 3, Deadwood, done; Deadwood came with a hard-edged dark band over its bottom quarter, faded in by `opening-3-fix.py` (the untouched picture is art/montage-opening-3-deadwood-original.jpg); 4, the letters, done, with made-up lettering in the letterhead painted out by `opening-4-fix.py`; 5, the stranger, done (redone once to show a little of the face and sort the far stacks by colour; the near stacks were still mixed and are recoloured one colour each by `opening-5-fix.py`; untouched picture art/montage-opening-5-stranger-original.jpg); 6, today, done (it has five chairs, not four, and the case looks a little like a briefcase; kept). The opening is fully painted. The ending's slides 1, 2 and 4 reuse opening pictures 2, 3 and 5, as ART_PROMPTS.md plans; slide 3, the shoebox, is done (made-up type on the front letter painted out by `ending-3-fix.py`); slide 5, the wedding, is done; slide 6, the lid, is done, with the lid left blank (the caption names the three lines written in it; nothing draws them on the picture yet). Every slide of the opening and the ending now has its own painting or a planned reuse (screenshot `docs/screenshots/opening-1.jpg`).

## Current state, the epilogue

- Background and table front: done. The first picture had two fridges side by side, fake handwriting on the fridge notes and the lamp low over the seat across; a redo with only those changed fixed all three (the first try is art/redo/kitchen-to-fix.jpg). The two notes on the wall have scribbled lines, not letters, and were kept.
- Elena and Victor reuse their chapter 12 pictures in the same seats (`src/chapters/kitchenTable.ts`). Elena sits a little lower than in Macau so the lamp shows above her head instead of behind it.
- Dee: done, cut out from green, two cards and a fist pump. Her T-shirt print shows only broken shapes, no readable word, and most of it sits behind the table.
- Title painting: done, a house on a rainy street, the kitchen window glowing with the party inside and a wedding ribbon on the gatepost. The epilogue is fully painted.
- Screenshots: `docs/screenshots/epilogue-table.jpg`, `epilogue-intro.jpg`.

## Current state, chapter 12

- Background and table front: done. The first try showed Sydney through the windows (the Harbour Bridge), so it was redone with the same room and a Macau view (art/redo/last-table-room-sydney.jpg is the first try). The pendant lamp hung exactly behind Elena's head and its corners stuck out on both sides like ears, so the lampshade is painted out with `last-table-fix.py` (in the project's art/layers/cleanup-scripts; the untouched picture is art/last-table-background.jpg). The rod and the soft light below it stay.
- Elena: done. The first picture had her brows pulled down into a scheming look, wrong for the one warm Crane, and was redone with only the expression changed. A table edge along the bottom was cropped off before the cutout. She sits a little higher than the standard seat across so her closed stack shows above the rim.
- Mei Lin: done. She was painted holding a fan of three cards; the two back cards were painted out with her robe (cloned from just beside them) by `meilin-fix.py`, which also redraws the front card's ink outline and clears a blurred spot on the green. One card back is left, so no count can be read.
- Victor: done. He was painted under a hanging lamp touching his hair; `victor-fix.py` paints the lamp out and keeps the hair.
- Title painting: done, the old shophouse street and temple roofs in front, the observation tower, the gold casino tower and the long low bridge behind. The first version had two observation towers and made-up Chinese on the signs; a redo fixed the towers and blanked most signs, and `last-table-title-fix.py` blurs the rest (the untouched picture is art/last-table-title-original.jpg). Chapter 12 is fully painted.
- Screenshots: `docs/screenshots/chapter-12-table.jpg`, `chapter-12-intro.jpg`.

## Current state, chapter 11

- Background and table front: done. The image tool wrote fake lettering on the two waiting-list screens, so their insides are blurred by `big-o-fix.py` (in the project's art/layers/cleanup-scripts; the untouched picture is art/big-o-background-original.jpg). A first try, with a big blank wall over the left third, was not used.
- Kerry-Ann, Gaz and Mr. Okafor: done, cut out from green, five cards each. Kerry-Ann's card backs came out old tan, copied from Jasper's picture, and were turned modern blue with `kerryann-fix.py` (it recolours warm pixels in the fan, skipping a traced outline of her hand). Gaz came with a table edge drawn under his arms, cut away with `gaz-fix.py`. Mr. Okafor's picture ends in a flat cut below the tie, which the table rim hides. Later prompts for this chapter ask for blue card backs and no table edge.
- Title painting: done, the casino beside a canal and old warehouses on a wet evening, with a red double-decker bus. The couple at the bottom right wear a cloche and a trilby, a little old-fashioned but worn in 2019 too, so they were kept. Chapter 11 is fully painted.
- Screenshots: `docs/screenshots/chapter-11-table.jpg`, `chapter-11-intro.jpg`.

## Current state, chapter 10

- Café background and table front, the three avatars, the final table background and table front, DeuceSeven in person: done. Nothing needed cleaning up: no lettering or stray marks in any of the six.
- The café picture differs from its prompt in two ways that were kept: the table on the screen is cut off by the monitor frame at the sides, and its rim is brown wood, not a dark rail. Seats, cards, the board and the pot all sit on it (screenshot: `docs/screenshots/chapter-10-table.jpg`).
- Nat Crane and Hanbit in person: done (screenshot `docs/screenshots/chapter-10-final-table.jpg`). Nat was painted holding three cards; Hold'em is two, so the back card was painted out of the green original with `nat-fix.py` (in the project's art/layers/cleanup-scripts), which fills it with what lies behind it, the black jacket and the white shirt, carrying the lapel's edge down at its own slope. Nat sits a little higher than the standard seat across, so her cards show above the rim.
- Title painting: done, the student at the café on the left and the TV stage on the right (screenshot `docs/screenshots/chapter-10-intro.jpg`). Chapter 10 is fully painted.

## Current state, bonus chapter (The Gaming House)

- Background, table front and title painting: done (2026-11-21).
- Henri Avery, Madame Élodie and Captain Lacroix: done, cut out from green, each holding five cards (Poque deals five).
- Cleanups after the cutout, in pixels of the 2752 x 1536 originals: both men were painted on a chair with their legs showing, so the chair is cut away along the coat's ink outline and everything from y = 1440 down is removed (the table hides it), along with Henri's raised knee. A brownish blotch in the green beside Henri went by keeping only the largest connected piece. Élodie's picture had a ghostly lace fan floating beside her head, which is removed; the two teal gems in her comb are kept solid so the key leaves no holes. The script is kept with the originals as `gaming-house-fix.py`.

## Current state, chapter 1

- Background and table front: done.
- Silas, Delphine and Ezra: done, cut out from green. Delphine's lace fan is see-through; Ezra's right lens keeps a faint glass sheen where the backdrop showed through.
- Title painting (the Magnolia Queen at night): done, behind the intro screen.
- Still to make: silver dollars, the buckhorn knife. The cards and the buck are drawn in code for now.

## Current state, chapter 6

- Background (the brick back room under one green lamp), table front, title painting (the florist's shop in the rain): done. The background's wall calendar came with garbled lettering; the pen strokes of its heading and numbers were painted over with the paper colour and the grid lines kept, so nothing reads as text. Check every new picture for stray or nonsense lettering like this.
- Sal, Nora and Gus: done, cut out from green, two cards each (seven-card stud starts with two cards down). Gus's picture had stray game text in the green, removed by keeping only the largest connected piece (the figure), and he is cut off above his lap. Nora's had a brownish haze along the bottom of the green, so she is cut off at her waistband first. Sal's green was darker than usual but keyed cleanly as it was.
- `backRoom.ts` keeps its `rival(...)` blocks and swaps in the art by id (`PAINTED`), which is the same result as overriding `art` on each rival.
- Still to make: a matchbook, chips in a flowerpot.

## Current state, chapter 7

- Background (the panelled tournament room under amber pendant lamps, a row of mechanical slot machines behind a rope), table front, title painting (the strip at dusk): done. A first version of the room was turned down for oil lanterns and modern video slot machines, which are wrong for 1972; check every new picture against its year.
- The title painting's signs carry the plain word "CASINO" three times and some nonsense neon lettering (most plainly a teal upright sign on the right). No real casino is named. Left as painted; John to say if he wants it redone.
- Weiss, Tex and Lorraine: done, cut out from green, two cards each (Hold'em). Tex's picture had a pale blurred blotch in the green, removed by keeping only the largest connected piece (the figure). Weiss was painted with his lap and knee, and Lorraine with a bare knee under her hand; both are cut away along the thigh or hand. A first Lorraine was turned down for blurred hands, stray game text and chips.
- `desertClassic.ts` keeps its `rival(...)` blocks and swaps in the art by id (`PAINTED`), which is the same result as overriding `art` on each rival.
- Still to make: clay chips, a tournament program.

## Current state, chapter 8

- Background (the cream and gold panelled club room), table front, title painting (a Paris boulevard at night): done. The first room was rejected because its baize came out stained and its walls peeling: a prompt for a smart room must say the felt and paint are clean, or the tool copies the wear of the reference picture.
- The Comte Varenne: done, cut out from green. Redone at John's request without a cigar and match; one hand rests at his cravat with the signet ring, and his tell now reads "He turns the signet ring on his finger" to match.
- Siobhan and Dmitri: done, cut out from green. Both were painted with a fan of five cards, twice, and Omaha is four, so the leftmost card of each fan was removed by hand from the green original (`cercle-fix.py`: the card's face is found between its ink lines and turned to green, and a fresh ink line is drawn along the next card and the hand). Siobhan was also painted on a chair with a knee raised; the chair back beside her jacket is painted out and she is cut off at the waist (`cercle-siobhan-chair.py`). Both scripts are with the originals, in the project's art folder under `layers/cleanup-scripts/`.
- `cercle.ts` keeps its `rival(...)` blocks and swaps in the art by id (`PAINTED`).
- Still to make: plaques (rectangular chips).

## Current state, chapter 9

- Background (the casino poker room: blue oval table with a black padded rim, pink and blue neon along the ceiling, mirrored columns, brass rails, the pier and grey sea at the window), table front, title painting (the boardwalk at dusk: strollers, rolling chairs, the pier and its wheel, casino towers trimmed in neon): done. No lettering in either; the signs in the title painting are blank. A second table shows in the mirror on the right-hand column of the room, which is fine for a card room.
- Benny, Margot and Ruth: done, cut out from green, two cards each (the two hole cards of seven-card stud). All three have a pink and blue neon rim painted along their outlines, kept because it matches the room's neon. Benny's and Ruth's pictures had a pale blurred blotch in the green at the left, removed by keeping only the largest connected piece (the figure). Benny's chip stacks at the bottom edge are kept, and the table hides them. Margot twists her pearl earring and Ruth adjusts her glasses (their tells); Margot's name badge is blank. Ruth's beaded glasses chain keyed cleanly with the standard thresholds.
- `boardwalk.ts` keeps its `rival(...)` blocks and swaps in the art by id (`PAINTED`), which is the same result as overriding `art` on each rival.
- Still to make: Delphine's diary.
