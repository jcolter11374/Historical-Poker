# Art prompts, every chapter

Copy-ready image prompts for every picture the game needs: each chapter's background, its three rivals on green, a title painting, and a few props. Each prompt is complete on its own, so you can paste one block into the image tool and go. How a picture becomes game art (cutting out, `prepare-art.py`, placing) is in [ART.md](ART.md).

## How to use these

1. **Attach two reference images** to every prompt, from the project's `art` folder:
   - always `art/style-target-riverboat.jpg` (the look);
   - for a **background**: `art/layers/background-riverboat.jpg` (the layout: table rim across the middle, wall above);
   - for a **character**: `art/layers/silas-green.jpg` (the framing: centred, waist up, on flat green).
2. Paste the prompt. Ask for **16:9** unless the prompt says otherwise.
3. Check the result against the list below, then save it with the file name given (the originals folder for `prepare-art.py`).

**Checklist for a character on green**

- The green is one flat colour, with no shadow under or behind the character.
- Nothing green on the character: no green clothes, eyes, gems or felt. (A green item turns see-through when cut out.)
- No smoke, steam, veils or flyaway hair reaching into the green, and nothing touching the image edges except the body at the bottom.
- Waist up, head and hat fully inside the frame, hands at chest height so they show above the table rim.
- Lit like the chapter's room (each prompt says how), so they look like they sit in it.
- **The right number of cards for the chapter's game**, and no more: count them in the result. Each prompt says "exactly N"; the table below says why. If the tool paints the wrong number, ask again ("exactly five cards, count them") before accepting it.

**Cards in hand, by chapter.** A rival's picture shows what a seated player of that game would really be holding. Take the game from the chapter as built ([CHAPTERS.md](CHAPTERS.md)); if a chapter's game changes, change its prompts.

| Chapter | Game | In the picture |
| --- | --- | --- |
| 1 The River | Straight poker (no draw) | Exactly five, backs toward us |
| 2 The Painted Deck | Primero | Exactly four |
| 3 The North Road | Brag | Exactly three |
| 4 The Camp | Five-card stud | Exactly one: the face-down hole card. The other four are dealt face up on the table, so nobody holds a fan |
| 5 The Last Hand | Five-card draw | Exactly five |
| Bonus, The Gaming House | Poque | Exactly five |
| 6 The Back Room | Seven-card stud, Razz | Exactly two: the two hole cards a hand starts with. The up cards lie on the table |
| 7 The Desert Classic | Hold'em | Exactly two |
| The Cercle | Omaha, Omaha Hi-Lo | Exactly four |
| The Boardwalk | Seven-card stud Hi-Lo | Exactly two hole cards |
| 10 The Boom, final table | No-Limit Hold'em | Exactly two (the online stages show avatars, with no cards) |
| 11 The Big O | Five- and six-card Omaha | Exactly five for all three. The chapter also plays six-card, but one picture serves the whole chapter, and five is the game taught first and the one "Big O" names |
| 12 The Last Table | HORSE and the 8-Game (mixed) | A small squared-up stack, face down, not fanned. The game changes every few hands (two, four, five or seven cards), so no fan could be right |
| Epilogue, The Kitchen Table | No-Limit Hold'em with house rules | Exactly two |

**Painted pictures to redo for card count** (checked 2026-11-21 against the originals in `art/layers/`). The prompts below now ask for the right number, so a redo is a re-run of the same prompt with the old picture attached ("the same person and pose as the second attached image, but holding exactly N cards").

| Character | Chapter | Holds now | Should hold |
| --- | --- | --- | --- |
| Silas Crane | 1 | about four | five |
| Sir Roland | 2 | two | four |
| Brother Anselm | 2 | three | four |
| Toby Finch | 4 | about six, fanned | one hole card |
| Sergeant Reed | 4 | four, fanned | one hole card |
| Hattie Bloom | 4 | four, fanned | one hole card |
| Doc Whitcomb | 5 | four | five |
| Ruby Calloway | 5 | about nine | five |

Already right: Delphine and Ezra (five), Lady Margery (four), and all of chapter 3 (Hannah, Pike and Sorrel hold three).

**Checklist for a background**

- No people and no chairs.
- The table is an oval whose far rim curves across the middle of the picture, and the table fills the bottom half, edge to edge, as in the riverboat background. `prepare-art.py` cuts the table front along that curve, so a square or rectangular table won't work.
- Nothing on the table.
- The wall just above the far rim is fairly plain, because the three rivals are placed there.

**Seats.** Each chapter has a rival on the left, one across, and one on the right. The prompts already say which way each one turns: the side players turn a little toward the middle of the table, the one across faces you.

**Same person, more than one picture.** For a character who appears again (young Delphine, the Crane family look, Nate Crane online and in person), also attach the earlier picture of them and say "the same person as the second attached image".

---

## Chapter 1: The River (1836)

Background and Silas are done. Needed: Delphine and Ezra seated on green, to replace the portraits. For these two, also attach their existing portraits (`art/delphine-arceneaux.jpg`, `art/ezra-hollis.jpg`) so the faces and costumes stay the same.

Room light: warm oil-lamp light from above and in front, a cool blue moonlight rim from the side.

**Delphine Arceneaux, left seat** → `delphine.png` (after cutting out)

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. The same woman as the second attached image: Mrs. Delphine Arceneaux, a Louisiana widow in her forties, knowing half-smile, dark auburn hair under a black silk bonnet with a magenta plume, high-necked black mourning dress with lace collar and jet buttons, holding an open lace fan near her chin with one hand and a fan of exactly five playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by warm oil-lamp light from above and in front, with a cool blue moonlight rim on one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. No loose feathers or wisps crossing into the green beyond the plume. The character centred, filling about 85% of the image height, the whole bonnet and plume inside the frame. No table, no text, no border. 16:9.
```

**Ezra Hollis, right seat** → `ezra.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. The same man as the second attached image: Ezra Hollis, a nervous cotton agent from New Orleans in his fifties, grey side-whiskers, round wire spectacles, beads of sweat on his brow, worried eyes, brown bowler hat, worn brown frock coat over a mustard waistcoat and black cravat. He holds a fan of exactly five playing cards (backs toward us) close to his chest in both hands, a crumpled white handkerchief tucked in one fist. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by warm oil-lamp light from above and in front, with a cool blue moonlight rim on one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole hat inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: the paddle steamboat "Magnolia Queen" at night on the lower Mississippi in 1836, twin tall smokestacks, white tiered decks with warm lit windows, the big paddle wheel churning silver water, a crescent moon and stars, dark cypress banks. Seen from the river bank at a low angle. Calm, darker sky in the upper-left third, left empty for a title the game adds. No text, no lettering, no border. 16:9.
```

**Props, on green** (see "Props" at the end for the shared prompt): a short stack of 1830s silver dollars; a buckhorn-handled folding knife lying flat (the dealer's buck).

---

## Chapter 2: The Painted Deck (1543)

Twelfth Night in the great hall of Ashcombe Hall, Kent. Palette: candle gold and dark oak. Room light: warm candlelight and firelight from in front and to one side.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Use the second attached image only for the layout. The great hall of a Tudor manor house in Kent on Twelfth Night, 1543, with NO people and no chairs: dark oak panelling, a faded hunting tapestry on the wall behind the table, a big stone hearth with a roaring fire off to one side, iron candle stands and a hanging candle wheel, holly and ivy over the panelling. First-person view from a seat at a large oval oak table covered with a worn dark-red wool cloth, its rim of carved, scuffed oak: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain and dark. 16:9, no text.
```

**Sir Roland Fettiplace, left seat** → `roland.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Sir Roland Fettiplace, a reckless young English knight of 1543, about twenty-two, flushed cheeks, cocky grin, golden shoulder-length hair under a flat black velvet cap with a white feather, slashed doublet in crimson and gold with puffed sleeves. He raises a silver goblet in one hand and holds exactly four painted playing cards (backs toward us) loosely in the other. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by warm candlelight and firelight from in front and to one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole cap and feather inside the frame. No table, no text, no border. 16:9.
```

**Lady Margery Ashcombe, across** → `margery.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Lady Margery Ashcombe, an English noblewoman of 1543 in her late thirties, cool and watchful, a faint unreadable smile, pale skin, auburn hair under a black French hood edged with pearls, a deep burgundy velvet gown with a square neckline, gold embroidery and fur-trimmed sleeves, a heavy gold signet ring on one finger. She holds exactly four hand-painted playing cards (backs toward us) close to her chest, the other hand resting with the ring showing. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by warm candlelight and firelight from in front and to one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole hood inside the frame. No table, no text, no border. 16:9.
```

**Brother Anselm, right seat** → `anselm.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Brother Anselm, a former monk turned steward of a Tudor manor in 1543, in his sixties, round kindly face, tonsure growing out into a grey fringe, a plain brown wool robe with a steward's ring of iron keys at his belt and a wooden rosary wound round one wrist. He studies exactly four painted playing cards (backs toward us) held in both hands, lips pressed together. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by warm candlelight and firelight from in front and to one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a Tudor manor house in Kent on a snowy Twelfth Night, 1543, red brick and timber, tall chimneys smoking, every leaded window glowing with candlelight, torches at the gatehouse, a frosty night sky. Calm, darker sky in the upper-left third, left empty for a title the game adds. No people in close-up. No text, no lettering, no border. 16:9.
```

**Props:** a small pile of Tudor silver shillings and groats; the brown leather card case, worn, with "M.A. 1543" tooled in gold on the lid (image tools often garble lettering; if so, ask for a blank lid and add the letters by hand).

---

## Chapter 3: The North Road (1763)

The Pewter Lamb, a snowbound coaching inn on the Great North Road. Palette: pewter, firelight and frost. Room light: orange firelight from one side, cold blue-white light from frosted windows.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Use the second attached image only for the layout. The taproom of an English coaching inn in winter, 1763, with NO people and no chairs: low blackened oak beams, rough whitewashed walls, a shelf of pewter tankards and plates, a small leaded window thick with frost and snow outside, a wide inglenook fireplace glowing off to one side, a horse brass and a coaching horn on the wall. First-person view from a seat at a large oval tavern table of scrubbed, scarred dark oak: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text.
```

**Hannah Pell, left seat** → `hannah.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Hannah Pell, a Yorkshire innkeeper of 1763 in her forties, strong arms, shrewd eyes, a no-nonsense half-smile, red-brown hair under a white linen cap, sleeves rolled up, a blue-grey bodice over a linen shift, a striped apron, a cloth over her shoulder. She holds a pewter tankard and a polishing cloth in one hand and exactly three playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by orange firelight from one side and cold blue window light from the other. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole cap inside the frame. No table, no text, no border. 16:9.
```

**Captain Josiah Pike, across** → `pike.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Captain Josiah Pike, a retired English sea captain of 1763 in his sixties, weathered red face, booming laugh caught mid-boast, bushy white eyebrows, a grey queue tied with black ribbon under a battered black tricorn hat, a faded navy-blue coat with brass buttons and big turned-back cuffs, a loosened white neckcloth. He thrusts exactly three playing cards (backs toward us) forward in one fist as if bragging about them. Seated, seen from the waist up as if sitting behind a table, facing the viewer. Lit by orange firelight from one side and cold blue window light from the other. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole hat inside the frame. No table, no text, no border. 16:9.
```

**Jack Sorrel, right seat** → `sorrel.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Mr. Jack Sorrel, a dandy gentleman of 1763 who is secretly a highwayman, about thirty, handsome and too smooth, a sly sideways look, powdered hair tied back, a plum-coloured silk coat with silver braid, a lace jabot, one gloved hand resting near the deep pocket of his coat where a pistol hides, exactly three playing cards (backs toward us) held lightly in the other. Seated, seen from the waist up as if sitting behind a table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by orange firelight from one side and cold blue window light from the other. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

Optional unmasked version for when he's found out: add "the same person as the second attached image, now with a black mask pushed up on his forehead, his pistol half drawn".

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a stone coaching inn on a lonely English moor road in a snowstorm at dusk, 1763, a hanging painted sign of a lamb, warm light in the small windows, a snowed-in red stagecoach in the yard with its horses being led to the stable by lantern light. Calm, darker sky in the upper-left third, left empty for a title the game adds. No text, no lettering on the sign, no border. 16:9.
```

**Props:** a few Georgian silver shillings and a gold guinea; the stagecoach's iron-bound wooden strongbox.

---

## Chapter 4: The Camp (1863)

A Union army camp near Chattanooga, the night before battle. Palette: lantern yellow on wet canvas. Room light: one warm lantern hanging above the table, cold dark blue night outside.

The outline's table is an upturned hardtack crate. `prepare-art.py` needs a round rim, so the prompt makes it a round camp table: a barrelhead on crates, with an army blanket over it.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Use the second attached image only for the layout. Inside a Union army wall tent at night in November 1863, with NO people and no chairs: rain-darkened canvas walls and ridgepole, rain streaking on the canvas, a tin lantern hanging from the ridgepole, a rifle stack and a knapsack in a shadowed corner, a hardtack crate stamped with plain marks. First-person view from a seat at a large round camp table made from a wide barrelhead set on crates and covered with a grey wool army blanket, its rim a worn wooden hoop: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the canvas just above the far rim fairly plain. 16:9, no text.
```

**Private Toby Finch, left seat** → `toby.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Private Toby Finch, a Union drummer boy of 1863, fifteen pretending to be eighteen, freckles, big ears, a wide eager grin, a too-large dark-blue forage cap and a short dark-blue shell jacket with brass buttons, drumsticks tucked in his belt. He holds a single playing card (exactly one, its back toward us) up to his nose in both hands, peeking at it, delighted. Seated, seen from the waist up as if sitting behind a table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by one warm lantern above, cold dark blue around the edges. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole cap inside the frame. No table, no text, no border. 16:9.
```

**Sergeant Amos Reed, across** → `reed.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Sergeant Amos Reed, a Union veteran of 1863 in his forties, lean and tired, grey-streaked short beard, a cheek bulging with chewing tobacco, steady unblinking eyes, a sun-faded dark-blue sack coat with sergeant's chevrons, a battered black slouch hat. He holds a single playing card (exactly one, its back toward us) low and still in one hand, the other forearm resting flat. Seated, seen from the waist up as if sitting behind a table, facing the viewer. Lit by one warm lantern above, cold dark blue around the edges. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole hat inside the frame. No table, no text, no border. 16:9.
```

**Hattie Bloom, right seat** → `hattie.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Hattie Bloom, a camp sutler (licensed trader) of 1863 in her thirties, sharp and businesslike, a quick appraising look, dark hair pinned up under a small plain bonnet pushed back, a practical brown wool dress with a shawl, a pencil behind her ear and another in her hand, a small leather ledger tucked under one arm, a single playing card (exactly one, its back toward us) held in the other hand. Seated, seen from the waist up as if sitting behind a table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by one warm lantern above, cold dark blue around the edges. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole bonnet inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: rows of white canvas army tents in the rain at night in November 1863, glowing from lanterns inside, campfires hissing, dark Tennessee hills and a ridge beyond, a lone sentry's silhouette. Calm, darker sky in the upper-left third, left empty for a title the game adds. No flags with readable text, no lettering, no border. 16:9.
```

**Props:** a few 1860s greenback notes and coins; Sergeant Reed's silver presentation watch, open.

---

## Chapter 5: The Last Hand (1876)

The Lucky Nugget saloon, Deadwood, August 1876. Palette: dusty daylight and amber lamps. Room light: warm amber oil lamps, a dusty shaft of window light from one side.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Use the second attached image only for the layout. A rough frontier saloon in a gold-rush town in 1876, with NO people and no chairs: raw pine plank walls, a grimy window letting in a dusty shaft of evening light, two oil lamps with tin reflectors on the wall, a mirror and bottles on a back bar in the distance, a mounted antler rack. First-person view from a seat at a large oval card table with worn green baize and a scuffed dark wooden rim: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text.
```

**"Doc" Abel Whitcomb, left seat** → `doc.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. "Doc" Abel Whitcomb, an old gold prospector of 1876, wild white beard, twinkling eyes, a gap-toothed grin, a battered sweat-stained hat with the brim turned up, a red flannel shirt under faded suspenders, a small leather pouch of gold dust dangling from one hand and a fan of exactly five dog-eared playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by warm amber oil lamps with a dusty shaft of light from one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole hat inside the frame. No table, no text, no border. 16:9.
```

**Ruby Calloway, across** → `ruby.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Ruby Calloway, the owner of a frontier saloon in 1876 and the best card player in the territory, in her thirties, composed and amused, a small knowing smile, red hair pinned up with a few strands loose, a deep crimson silk dress with a black lace shawl, a cameo at her throat. She holds exactly five playing cards (backs toward us) in a neat, tight fan in one hand, chin resting on the other. Seated, seen from the waist up as if sitting behind a table, facing the viewer. Lit by warm amber oil lamps with a dusty shaft of light from one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Jasper Crane, right seat** (also attach `art/layers/silas-green.jpg` as a family likeness) → `jasper.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Jasper Crane, a card sharp of 1876 in his late twenties and the grandson of the man in the second attached image: the same sharp features and curled waxed mustache, younger, harder and dustier. A flat-crowned black hat, a black frock coat over a dark-red brocade waistcoat with a watch chain, a string tie. One hand smooths his mustache, the other holds a fan of exactly five playing cards (backs toward us). Seated, seen from the waist up as if sitting behind a table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by warm amber oil lamps with a dusty shaft of light from one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole hat inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: the muddy main street of a gold-rush boom town in a narrow pine gulch in 1876, false-front wooden buildings, wagons and mules, prospectors, golden late-afternoon dust in the air, dark pine hills on both sides. Calm sky in the upper-left third, left empty for a title the game adds. No readable signs, no lettering, no border. 16:9.
```

**Epilogue painting, the full case** → `epilogue.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures, warm lamplight. A close still-life: an old brown leather card case lying open on worn green baize under a warm oil lamp, a well-worn deck of cards inside, and fanned out around it five very different old playing cards: a hand-painted Tudor card, a plain Georgian printed card, an 1830s card with no corner numbers, an 1860s card, and an 1870s card with small corner indices. A few silver coins and a pinch of gold dust nearby. No text, no border. 16:9.
```

**Props:** a gold-dust pouch with a little spilled dust; a stack of 1870s coins.

---

## Bonus: The Gaming House (1817)

Maison Fontaine, the French Quarter of New Orleans, 1817. Palette: warm Creole night. Room light: warm candlelight from a chandelier, a soft blue night through open balcony doors.

You play young Delphine here, so she is never shown at the table and needs no picture.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Use the second attached image only for the layout. A salon in a French Quarter gaming house in New Orleans in 1817, with NO people and no chairs: plastered walls in faded ochre and rose, tall open shutters onto a wrought-iron balcony and a warm blue night, a small crystal chandelier with candles, a gilt mirror, potted banana leaves in a dark corner. First-person view from a seat at a large oval gaming table with worn dark-red baize and a chipped gilt rim: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text.
```

**Henri Avery, left seat** → `henri.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Henri Avery, an American of 1817 in his fifties, warm and steady, a kind lined face, greying sandy hair, clean-shaven, a dark-blue tailcoat that has seen better days, a cream waistcoat and a white cravat. He holds exactly five playing cards (backs toward us) comfortably and looks content. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by warm candlelight from a chandelier above, a soft blue night glow from one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Madame Élodie Fontaine, across** (also attach Delphine's portrait for a family likeness) → `elodie.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Madame Élodie Fontaine, owner of a New Orleans gaming house in 1817 and the aunt of the woman in the second attached image (a family likeness), in her fifties, elegant and all-seeing, dark eyes that read everyone, dark hair dressed high with a jewelled comb and a few grey streaks, a high-waisted Regency gown in deep wine silk with a gauzy shawl, long gloves. She slowly fans open exactly five playing cards (backs toward us) in one hand. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by warm candlelight from a chandelier above, a soft blue night glow from one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head and comb inside the frame. No table, no text, no border. 16:9.
```

**Captain Jean-Baptiste Lacroix, right seat** → `lacroix.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Captain Jean-Baptiste Lacroix, a privateer of 1817 spending his prize money fast, in his thirties, sun-dark skin, black curls, a gold hoop earring, a big laugh with his head thrown back, an open-necked white shirt under a blue sea coat with tarnished gold braid, a red sash. He waves exactly five playing cards (backs toward us) in one hand and a silver coin in the other. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by warm candlelight from a chandelier above, a soft blue night glow from one side. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a narrow French Quarter street in New Orleans on a warm night in 1817, two-storey stucco houses with wrought-iron balconies, warm candlelight spilling from tall shuttered doorways, the street lit by hanging lanterns, figures in Regency dress strolling. Calm night sky in the upper-left third, left empty for a title the game adds. No text, no lettering, no border. 16:9.
```

**Props:** Spanish silver dollars (pieces of eight); the payout board, a round wooden board with painted compartments (not built in the game yet, so low priority).

---

## Part Two

Part Two moves into the 20th century and today. The style stays the same (painted, inked, worn), only the clothes, rooms and light change. All places and people are fictional: no real casino names, logos or trademarks, and no real people.

## Chapter 6: The Back Room (1926)

A Chicago speakeasy behind a fake florist's shop. Room light: one green-shaded lamp over the table (it lights them warm white; the shade is out of their pictures), dim brick around.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. The hidden back room of a Chicago speakeasy in 1926, behind a florist's shop, with NO people and no chairs: bare brick walls, stacked wooden crates of flowers and hidden bottles, buckets of lilies and roses, a pinned-up calendar with no readable text, a single green glass-shaded lamp hanging low over the table, cigarette haze. First-person view from a seat at a large oval card table with worn green felt and a scuffed walnut rim: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text.
```

**Sal Moretti, left seat** → `sal.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Sal Moretti, a bootlegger's bookkeeper in Chicago in 1926, in his forties, neat and anxious, slicked-back black hair, small round spectacles, a thin mustache, shirtsleeves with black sleeve garters, a grey waistcoat, a loosened tie. A pencil in one hand, tapping, exactly two playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit warm white from one low lamp directly above, dim around the edges. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Nora Shea, across** → `nora.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Nora Shea, the Irish-American owner of a Chicago speakeasy in 1926, about thirty-five, quick wit and a wicked grin, a sleek black bob with finger waves, red lipstick, a dark-blue beaded drop-waist dress, a long string of pearls, a long cigarette holder held unlit in one hand, exactly two playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit warm white from one low lamp directly above, dim around the edges. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. No smoke. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Gus Lindqvist, right seat** → `gus.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Gus Lindqvist, a big Swedish-born truck driver in Chicago in 1926, in his forties, broad shoulders, a ruddy cheerful face, a blond walrus mustache, a flat cap pushed back, a brown canvas work jacket over a collarless shirt and braces. He holds exactly two playing cards (backs toward us) in one huge hand and grins. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit warm white from one low lamp directly above, dim around the edges. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole cap inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a rainy Chicago street at night in 1926, a small florist's shop with buckets of flowers in a lit window, a 1920s sedan at the curb, an elevated train crossing in the distance, wet cobbles reflecting streetlights, a man glancing around before slipping through a side door. Calm, darker sky in the upper-left third, left empty for a title the game adds. No readable signs, no lettering, no border. 16:9.
```

**Props:** a matchbook (blank cover); clay chips in a flowerpot.

---

## Chapter 7: The Desert Classic (1972)

A fictional early poker championship in a Las Vegas casino. Room light: warm overhead lamps above the table, smoky amber haze.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. A casino tournament room in Las Vegas in 1972, with NO people and no chairs: a low ceiling with a row of warm hanging lamps, wood-panelled walls with gold trim, a busy 1970s patterned carpet glimpsed at the edges, a velvet rope and blurred slot machine lights far in the background, a haze of cigarette smoke. First-person view from a seat at a large oval poker table with worn green felt and a padded brown leather rail: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text, no real casino names or logos.
```

**Professor Milton Weiss, left seat** → `weiss.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Professor Milton Weiss, a mathematics professor at a poker tournament in 1972, in his fifties, thoughtful and gentle, a bald crown with grey hair at the sides, thick black-rimmed glasses being polished with a handkerchief, a brown corduroy jacket with elbow patches, a knitted tie, exactly two playing cards held face down in front of him. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by warm overhead lamps, in a smoky amber haze. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**"Tex" Dawson Pruitt, across** → `tex.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. "Tex" Dawson Pruitt, a road gambler from Amarillo, Texas at a poker tournament in 1972, in his forties, lanky, a big easy grin, sideburns, a cream cowboy hat tipped back on his head, a western shirt with pearl snaps under a tan suede jacket, a bolo tie. He flicks exactly two playing cards (backs toward us) between his fingers. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by warm overhead lamps, in a smoky amber haze. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole hat inside the frame. No table, no text, no border. 16:9.
```

**Lorraine Fisk, right seat** → `lorraine.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Lorraine Fisk, a former Las Vegas showgirl at a poker tournament in 1972, in her forties, glamorous and utterly unreadable, a perfectly still face, big platinum-blonde hair, false lashes, a gold lamé blouse, large gold earrings, long painted nails resting on exactly two face-down playing cards. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by warm overhead lamps, in a smoky amber haze. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole hairdo inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a desert city's casino strip at dusk in 1972, big glowing signs made of bulbs and neon shapes with no readable words, long 1970s cars on a wide boulevard, purple mountains and the last orange light behind. Calm sky in the upper-left third, left empty for a title the game adds. No text, no lettering, no real casino names, no border. 16:9.
```

**Props:** 1970s clay chips; a tournament program (blank cover, or a painted desert sunset with no words).

---

## Chapter 8: The Boardwalk (1985)

An Atlantic City casino poker room, 1985. Room light: bright overhead lights with pink and blue neon reflections, grey ocean light from a window.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. A casino poker room on an ocean boardwalk in 1985, with NO people and no chairs: mirrored columns, a pink and blue neon strip along the ceiling, brass rails, a big window showing a grey Atlantic ocean and a pier at dusk, a busy 1980s carpet at the edges. First-person view from a seat at a large oval poker table with worn blue felt and a black padded rail: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text, no real casino names or logos.
```

**Benny "the Book" Russo, left seat** → `benny.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Benny "the Book" Russo, a fast-talking regular in a 1985 casino poker room, in his sixties, round and jowly, slicked grey hair, tinted aviator glasses, a gold chain, a shiny maroon tracksuit jacket over an open-collared shirt. He riffles a stack of casino chips in one hand and holds exactly two playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by bright overhead light with pink and blue neon reflections. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Margot Arceneaux, across** (also attach Delphine's portrait for a family likeness) → `margot.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Margot Arceneaux, the manager of a casino poker room in 1985 and a descendant of the woman in the second attached image (the same knowing half-smile and dark auburn hair), in her forties, cool and in charge, voluminous 1980s hair, a black power suit with big shoulders, a pearl earring she is twisting with one hand, a dealer's name badge with no readable text, exactly two playing cards (backs toward us) in the other hand. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by bright overhead light with pink and blue neon reflections. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Ruth Goldfarb, right seat** → `ruth.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Ruth Goldfarb, a retired schoolteacher who plays poker carefully, in 1985, in her late sixties, small and sharp-eyed, a neat grey perm, reading glasses on a beaded chain being adjusted with one finger, a lavender cardigan over a blouse with a brooch, exactly two playing cards (backs toward us) held close in the other hand. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by bright overhead light with pink and blue neon reflections. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a wooden ocean boardwalk at dusk in 1985, casino towers with glowing pink and blue lights behind it, rolling chairs and strollers on the boards, the grey Atlantic and a pier with a lit Ferris wheel, gulls. Calm sky in the upper-left third, left empty for a title the game adds. No readable signs, no real casino names, no lettering, no border. 16:9.
```

**Props:** Delphine's diary, an old leather journal with a ribbon, lying open to handwritten pages (no readable words).

---

## Chapter 9: The Cercle (1992)

A private card club in Paris, 1992. Room light: warm chandelier light, cigar haze, deep red and gold.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. The card room of a private Paris club in 1992, with NO people and no chairs: carved wood panelling painted cream and gold, tall windows with heavy red velvet curtains, a crystal chandelier, an oil portrait in a gilt frame, a marble mantelpiece, a haze of cigar smoke. First-person view from a seat at a large oval card table with worn green baize and a polished mahogany rim: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the wall just above the far rim fairly plain. 16:9, no text.
```

**Siobhan Kearney, left seat** → `siobhan.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Siobhan Kearney, an Irish professional poker player on the European circuit in 1992, in her thirties, lively and confident, curly copper hair, freckles, a teasing smile, a black leather jacket over a cream silk blouse. Her fingers drum on exactly four playing cards (backs toward us) held in one hand. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by warm chandelier light in a light haze. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Comte Lucien Varenne, across** → `varenne.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Comte Lucien Varenne, the aristocratic president of a private Paris card club in 1992 and a collector of antique cards, in his sixties, silver swept-back hair, a trim silver goatee, heavy-lidded amused eyes, a midnight-blue velvet smoking jacket with a silk cravat, a signet ring. He holds an unlit cigar and a match in one hand and exactly four playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by warm chandelier light in a light haze. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. No smoke. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Dmitri Volkov, right seat** → `dmitri.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Dmitri Volkov, a Russian chess grandmaster playing cards in Paris in 1992, in his forties, gaunt and perfectly still, pale, dark hair cut short, deep-set unblinking eyes, a plain charcoal suit and a black turtleneck. He holds exactly four playing cards (backs toward us) motionless in one hand, the other hand flat. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by warm chandelier light in a light haze. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a Paris boulevard at night in winter 1992, a grand cream stone building with lit tall windows on the upper floor, wet pavement reflecting lamplight, a small 1990s car passing, the Seine and a distant iron tower lit in the haze. Calm sky in the upper-left third, left empty for a title the game adds. No readable signs, no lettering, no border. 16:9.
```

**Props:** rectangular casino plaques (no logos).

---

## Chapter 10: The Boom (2005)

Two settings. Hands 1 to 12 are online, in a cramped internet café at 3 a.m.: the monitor is the table, and the rivals show as avatars. From hand 13 it is a televised final table in Las Vegas, where the same three appear in person.

### The internet café (online stages)

Room light: cold blue-white monitor glow, a flickering tube light far behind.

**Background** → `background-cafe.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. First-person view of a computer monitor in a cramped internet café at 3 a.m. in 2005, with NO people: the bulky monitor fills almost the whole picture, its scuffed grey plastic frame at the edges, a sticky note on the corner. On the screen, an online poker table drawn in the same painted style: a large oval table with bright blue-green felt and a dark rail, its far rim curving across the middle of the screen and the table filling the bottom half, edge to edge, exactly like the second image; above the table, a plain dark blue gradient. Nothing on the table. Around the monitor's edge, a glimpse of a dark café with other glowing screens. Cold blue-white screen glow. 16:9, no text, no logos.
```

The three avatars are square icons, made one per prompt on green and shown in the rivals' seats on the screen.

**DeuceSeven's avatar** → `deuceseven-avatar.png`

```
Match the attached image's art style exactly: painted, hand-inked lines, bold outlines. A square online-poker avatar icon from 2005: a cartoon shark in dark sunglasses wearing a hoodie, grinning, head and shoulders, inside a rounded square frame of brushed silver. Background around the frame: one flat, solid pure chroma-key green (#00FF00). No text. 1:1.
```

**N0rthStar's avatar** → `northstar-avatar.png`

```
Match the attached image's art style exactly: painted, hand-inked lines, bold outlines. A square online-poker avatar icon from 2005: a single cold white five-pointed star on a midnight-blue night sky, inside a rounded square frame of brushed silver. Background around the frame: one flat, solid pure chroma-key green (#00FF00). No text. 1:1.
```

**Hanbit's avatar** → `hanbit-avatar.png`

```
Match the attached image's art style exactly: painted, hand-inked lines, bold outlines. A square online-poker avatar icon from 2005: a friendly cartoon tiger cub in the style of a Korean folk painting, head and shoulders, inside a rounded square frame of brushed silver. Background around the frame: one flat, solid pure chroma-key green (#00FF00). No text. 1:1.
```

### The final table (from hand 13)

Room light: hard white TV stage lights from above, blue and purple stage wash, dark crowd beyond.

**Background** → `background-final.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. The televised final table of a big poker championship in a Las Vegas ballroom in 2005, with NO people at the table and no chairs: a dark stage, hard white spotlights from a lighting rig above, blue and purple light washing the set, TV cameras on cranes, a crowd in dark bleachers beyond a rail, a giant screen glowing with no readable image. First-person view from a seat at a large oval poker table with bright red felt and a black padded rail: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the background just above the far rim fairly dark. 16:9, no text, no logos.
```

**DeuceSeven in person, left seat** → `deuceseven.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. "DeuceSeven", an American online poker pro at a televised final table in 2005, about twenty-five, pale from too many night sessions, scruffy goatee, messy hair under a backwards baseball cap with no logo, dark sunglasses pushed up on his head, a grey zip hoodie, white earbuds hanging round his neck. He peeks at exactly two face-down playing cards with one hand cupped over them. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by hard white stage light from above with a blue and purple wash. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no logos, no border. 16:9.
```

**Nate Crane ("N0rthStar") in person, across** (also attach `art/layers/silas-green.jpg` as a family likeness) → `nate.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Nate Crane, known online as "N0rthStar", at a televised poker final table in 2005, about thirty, a descendant of the man in the second attached image: the same sharp features and the same faintly mocking look, but clean-shaven with short dark hair. A slim black suit, an open-collared white shirt, no tie, a silver watch. He sits very still, exactly two face-down playing cards under one hand, a small cold smile. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by hard white stage light from above with a blue and purple wash. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Hanbit in person, right seat** → `hanbit.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. "Hanbit", a Korean poker player from Seoul at a televised final table in 2005, in her late twenties, calm and curious, a small amused smile, a sleek dark ponytail, a navy blazer over a white T-shirt, a small tiger charm on her phone strap peeking from a pocket. She holds exactly two playing cards (backs toward us) tilted toward her, head slightly tilted as if thinking "hmm". Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by hard white stage light from above with a blue and purple wash. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

The chapter never says whether Hanbit is a man or a woman, so this prompt makes a choice; change it if you like.

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting, split down the middle: on the left, a tired student hunched at a glowing monitor in a dim internet café at 3 a.m., seen from behind; on the right, a blazing TV stage with a red poker table under spotlights and a crowd. The two halves blend into each other through the light. Calm dark area in the upper-left third, left empty for a title the game adds. No text, no logos, no border. 16:9.
```

---

## Chapter 11: The Big O (2019)

A big, noisy modern card room in the English Midlands. Room light: bright even white overhead light, slightly cool, a busy room behind.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. A big modern card room in an English Midlands city in 2019, with NO people at the near table and no chairs: rows of other poker tables fading into the distance under bright square ceiling lights, blurred players far away, a big screen showing a waiting list with no readable text, a bar in the far corner, a patterned carpet. First-person view from a seat at a large oval poker table with worn blue felt and a black padded rail with a cup holder: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the area just above the far rim fairly plain. 16:9, no text, no logos.
```

**Kerry-Ann Booth, left seat** → `kerryann.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Kerry-Ann Booth, a nurse just off a night shift playing poker in an English card room in 2019, in her thirties, tired but game, blonde hair scraped into a messy bun, navy hospital scrubs under an open grey hoodie, a lanyard with a blank card. She scrolls a phone in one hand and holds a fan of exactly five playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by bright even white overhead light. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Gaz Whitlock, across** → `gaz.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Gaz Whitlock, a card-room regular in the English Midlands in 2019 who has seen everything, in his fifties, stocky, a shaved head, a grey stubbly beard, a gold sovereign ring, a navy polo shirt, a half-finished pint in one hand and a fan of exactly five playing cards (backs toward us) in the other, mid-story with his mouth open. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by bright even white overhead light. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no logos, no border. 16:9.
```

**Mr. Emeka Okafor, right seat** → `okafor.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Mr. Emeka Okafor, a retired Nigerian-British accountant who plays poker every Friday, in 2019, in his late sixties, dignified and precise, short grey hair, rimless glasses, a neat grey moustache, a tweed jacket over a pale blue shirt and a burgundy tie. He holds exactly five playing cards (backs toward us) in a perfectly even fan. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by bright even white overhead light. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a big modern casino building on a wet evening in an English Midlands city in 2019, red-brick canal and old warehouses beside it, glass entrance glowing, people in coats hurrying in, a double-decker bus passing. Calm sky in the upper-left third, left empty for a title the game adds. No readable signs, no logos, no lettering, no border. 16:9.
```

**Props:** modern casino chips, no logos.

---

## Chapter 12: The Last Table (today)

A private high-stakes room above Macau harbour at night. Room light: low warm light over the table, a cool glow of city lights from the windows behind.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures. Use the second attached image only for the layout. A private high-stakes card room high above a harbour city at night, today, with NO people and no chairs: a wall of floor-to-ceiling windows showing glittering skyscrapers, a bridge and dark water, dark lacquered wood panels, a single low pendant lamp over the table, a tea set on a side table in the shadows. First-person view from a seat at a large oval poker table with deep red felt and a black lacquer rim with a thin gold line: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the area just above the far rim fairly dark. 16:9, no text, no logos.
```

**Mei Lin Chau, left seat** → `meilin.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Mei Lin Chau, a quiet local poker legend in Macau today, in her seventies, small and serene, silver hair in a neat low bun, sharp kind eyes, a dark-blue silk jacket with a mandarin collar, a thin silver bracelet. She holds a small porcelain teacup in one hand and her playing cards in the other, squared together face down in one small closed stack, not fanned, so they can't be counted. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by a low warm lamp above with a cool city-light glow from behind. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. No steam. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Victor Crane, across** (also attach `art/layers/silas-green.jpg` as a family likeness) → `victor.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Victor Crane, the last of an old family of card sharps, today, in his fifties, a descendant of the man in the second attached image: the same sharp features, the same curled mustache now neatly trimmed and silver-flecked, the same faintly mocking smile. A perfectly cut charcoal three-piece suit, a dark red tie, white cuffs with small gold cufflinks shaped like paddle steamboats, which he is straightening with one hand; playing cards in the other, squared together face down in one small closed stack, not fanned, so they can't be counted. Seated, seen from the waist up as if sitting behind a card table, facing the viewer. Lit by a low warm lamp above with a cool city-light glow from behind. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Rafael Duarte, right seat** → `rafael.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Rafael Duarte, a Macanese-Portuguese shipping heir who plays poker for fun, today, in his early thirties, handsome and loud, wavy black hair, a big white grin, an unbuttoned pale-pink linen shirt under a cream blazer, an expensive watch, sunglasses hooked on his collar. He bobs his head to music only he can hear, playing cards in one hand, squared together face down in one small closed stack, not fanned, so they can't be counted. Seated, seen from the waist up as if sitting behind a card table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by a low warm lamp above with a cool city-light glow from behind. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no logos, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: a harbour city at night today, glittering towers and a long lit bridge over dark water, old Portuguese colonial buildings and temple roofs in the foreground, a single tall tower with one lit top-floor room. Calm sky in the upper-left third, left empty for a title the game adds. No readable signs, no real casino names, no lettering, no border. 16:9.
```

**Props:** a tablet showing a menu of games (blank screen is fine; the game can draw on it); a porcelain tea set.

---

## Epilogue: The Kitchen Table (today)

A home game with friends, at night. Room light: one warm pendant lamp over the table, cosy and a bit messy.

**Background** → `background.jpg`

```
Match the first attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Use the second attached image only for the layout. A cosy home kitchen at night today, with NO people and no chairs: a warm pendant lamp over the table, cabinets and a fridge covered in photos and magnets (no readable text), a pizza box and bottles on the counter, an old leather card case sitting on the counter, a dark window with rain. First-person view from a seat at a large round wooden kitchen table covered with a cheap folding poker felt, slightly wrinkled: the far rim curves across the middle of the picture and the table fills the bottom half, edge to edge, exactly like the second image. Nothing on the table. Keep the area just above the far rim fairly plain. 16:9, no text, no logos.
```

**Priya, left seat** → `priya.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Priya, a British-Indian woman in her early thirties at a home poker night today, bursting with mischief, a huge grin she can't hide, long dark hair in a loose braid, a mustard-yellow knitted jumper, chunky earrings, a slice of pizza in one hand and exactly two playing cards (backs toward us) in the other. Seated, seen from the waist up as if sitting behind a kitchen table, body turned slightly to the right toward the middle of the table, eyes on the viewer. Lit by one warm pendant lamp above. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Marcus, across** → `marcus.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Marcus, the host of a weekly home poker night today, a Black man in his late thirties, earnest and very serious about the game, short beard, black-framed glasses, a dark-blue button-up shirt with the sleeves rolled, a dealer button in one hand and exactly two playing cards (backs toward us) held neatly in the other. Seated, seen from the waist up as if sitting behind a kitchen table, facing the viewer. Lit by one warm pendant lamp above. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on him or what he holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Dee, right seat** → `dee.png`

```
Match the first attached image's art style exactly: a painted, hand-inked game illustration with bold dark ink outlines, rich painterly shading and worn textures. Dee, a woman in her late twenties at a home poker night today, loud and fearless, short bleached hair, a nose ring, a faded band T-shirt with no readable text under an oversized denim jacket, holding up exactly two playing cards (backs toward us) with a triumphant "seven-deuce!" look, the other hand drumming the table edge. Seated, seen from the waist up as if sitting behind a kitchen table, body turned slightly to the left toward the middle of the table, eyes on the viewer. Lit by one warm pendant lamp above. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow, gradient, floor or scenery. No green anywhere on her or what she holds. The character centred, filling about 85% of the image height, the whole head inside the frame. No table, no text, no border. 16:9.
```

**Title painting** → `title.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures. A wide establishing painting: an ordinary terraced house on a rainy evening today, one kitchen window glowing warm, silhouettes of friends laughing around a table inside, a bike against the railings, puddles reflecting streetlight. Calm sky in the upper-left third, left empty for a title the game adds. No text, no lettering, no border. 16:9.
```

**Props:** mismatched home-game chips; the old leather case, full, on the counter.

---

## Game-wide pictures

**Title screen** → `title-screen.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures, warm lamplight against blue moonlight. A dramatic still-life for a game's title screen: an old brown leather card case lying open on worn green baize, a fan of hand-painted antique playing cards spilling out of it, a few silver coins and a brass oil lamp's glow from one side, deep shadow around the edges. The open lid faces us and is plain. Calm, darker space across the top third, left empty for the game's title, which the game adds. No text, no lettering, no border. 16:9.
```

**Chapter select, the deck case** → `chapter-select.jpg`

```
Match the attached image's art style exactly: painted, hand-inked lines, worn textures, warm light. Looking straight down into an open, empty old brown leather card case lined with faded red velvet, with two rows of seven shallow card-shaped slots, all empty. The case lies on dark wood under warm lamplight. No cards, no text, no border. 16:9.
```

The chapter select shows one card per chapter in two rows (Part One, Part Two), so the slots must be empty: the game fills them. It works today without this picture; it would replace the plain background behind the cards.

---

## Props, the shared prompt

Small objects are made on green and cut out like the characters:

```
Match the attached image's art style exactly: painted, hand-inked lines, bold outlines, worn textures, warm light from above. [the object, e.g. "a short stack of worn 1830s silver dollars, one coin leaning against the stack"], seen at a slight angle from above, centred, filling about 70% of the image. Background: one flat, solid pure chroma-key green (#00FF00), evenly lit, with no shadow. No green on the object. No text. 1:1.
```

Playing cards are drawn in code for now, era by era. If you want painted card faces later, ask for one court card and one card back per era first, to settle the look, before a whole deck.

## Optional: expressions

Once a character looks right, two more versions make reactions possible: attach the finished character as the second image and add "the same person and pose as the second attached image, now looking pleased" (or "now looking worried"). Keep everything else in the prompt the same so the cutouts line up.
