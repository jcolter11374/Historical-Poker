# Chapters, as built

One section per chapter: what you play, who teaches it, the cast as coded, and the story beats. The story itself is designed in [GAME_OUTLINE.md](GAME_OUTLINE.md); this page says what the code actually does, so you can find your way around a chapter file. How the shared systems work (stages, lessons, stakes, buy-backs, levels, the finale) is in [GAME_DESIGN.md](GAME_DESIGN.md). Every chapter is one file in `src/chapters/`, and `src/chapters/index.ts` sets the order.

## Order and unlocks

| # | Chapter | File | Year | Game(s) | You play | Nemesis | Unlocked by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | The River | `riverboat.ts` | 1836 | Straight poker | Kit Avery | Silas Crane | open from the start |
| 2 | The Painted Deck | `paintedDeck.ts` | 1543 | Primero | Nan Avery | Lady Margery Ashcombe | 1 |
| 3 | The North Road | `northRoad.ts` | 1763 | Three-card Brag | Will Avery | Captain Josiah Pike | 2 |
| 4 | The Camp | `camp.ts` | 1863 | Five-card stud | Sam Avery | Sergeant Amos Reed | 3 |
| 5 | The Last Hand | `lastHand.ts` | 1876 | Five-card draw | Clara Avery | Ruby Calloway | 4 |
| Bonus | The Gaming House | `gamingHouse.ts` | 1817 | Poque | young Delphine | Madame Élodie Fontaine | 5 |
| 6 | The Back Room | `backRoom.ts` | 1926 | Seven Card Stud, then Razz | Edith Avery | Nora Shea | 5 |
| 7 | The Desert Classic | `desertClassic.ts` | 1972 | Limit, then No-Limit Hold'em | Lou Avery | "Tex" Dawson Pruitt | 6 |
| 8 | The Cercle | `cercle.ts` | 1992 | Pot-Limit Omaha, then Omaha Hi-Lo | Anna Avery | Comte Lucien Varenne | 7 |
| 9 | The Boardwalk | `boardwalk.ts` | 1995 | Stud Hi-Lo | Ray Avery | Margot Arceneaux | 8 |
| 10 | The Boom | `boom.ts` | 2005 | No-Limit Hold'em, 2-7 Triple Draw, Badugi | Jamie Avery | "N0rthStar" (Nate Crane) | 9 |
| 11 | The Big O | `bigO.ts` | 2019 | 5- and 6-Card Omaha, then their Hi-Lo versions | Sophie Avery | Gaz Whitlock | 10 |
| 12 | The Last Table | `lastTable.ts` | Today | HORSE, then the 8-Game | You | Victor Crane | 11 |
| Epilogue | The Kitchen Table | `kitchenTable.ts` | Today | No-Limit Hold'em with bomb pots, double board, 7-2 bounty | You | Marcus | 12 |

Each chapter's music (its own original tune, set in `scene.music`) is listed in [MUSIC.md](MUSIC.md).

"Unlocked by" is the chapter you must win to open it normally. Every chapter can still be opened early from the chapter select: the intro then shows "The story so far" (the chapter's `recap`) first, so a friend can go straight to the game they want to learn. The bonus is not on the main path: "On to…" after chapter 5 goes to chapter 6.

Every rival's personality numbers and tell chances are in the chapter file; the tables below give the character of each so you know what to expect. The numbers are explained in [GAME_DESIGN.md](GAME_DESIGN.md), "How the bots think".

### Chapters that go back in time

Play order is not date order in Part One: 1836, then 1543 and 1763, then 1863 and 1876, with the 1817 bonus last. The game makes that plain instead of hiding it. Chapters 2 and 3 and the bonus set `toldBy` ("Delphine's tale", "Delphine's own tale"), which is printed under the year on their card in the chapter select and on their intro screen; Part One's heading on the chapter select says "It opens in 1836, looks back to 1543, and goes on to 1876"; and the story text carries the frame: chapter 1's ending starts Delphine's telling, chapters 2 and 3 open and close on the riverboat with her, and chapter 4 opens "twenty-seven years" after the riverboat. Part Two runs in date order.

Who is related to whom, with the dates that make it possible, is in [GAME_OUTLINE.md](GAME_OUTLINE.md), "The family lines". Check new story text against it.

## Part One

### 1. The River (1836), straight poker

Built first, and the model for the rest. Table stakes (no limit), $1 ante, $2 minimum bet, $100 each, no rising stakes. Full detail is in [GAME_DESIGN.md](GAME_DESIGN.md), "Chapter 1". Beats: scripted tutorial hand with Delphine pointing out Ezra's tell; Silas stakes the Ashcombe deck; Silas deals himself four aces once, and you can call out the deal; Delphine or Ezra bows out for the heads-up finale.

### 2. The Painted Deck (1543), Primero

Ashcombe Hall, Twelfth Night. Nan Avery plays Lady Margery for the deck Nan's father painted. Money is in shillings (shown as "12s").

- **Game:** Primero as reconstructed in `src/games/primero.ts` (40 cards, two down, bet, two down, bet, change up to two once, bet). Table stakes: wager any part of your "rest". 1s ante, 2s minimum wager, 200s each, stakes rise every 10 hands.
- **Teacher:** Brother Anselm, before the first deal and on each street of the first hand.
- **Cast:** Sir Roland (very loose, drains his cup before a bluff), Lady Margery (tight and strong, turns her signet ring when strong), Brother Anselm (careful, mutters a prayer when weak).
- **Beats:** before hand 4 Roland wagers and loses his horse; before hand 7 Anselm talks about his abbey. Margery puts the deck on the table once Nan has won a few pots. Finale: Roland or Anselm bows out. Win: she pays, gives the deck back to Nan, and writes "M.A. 1543" in its case. The intro opens, and the win ending closes, with Delphine telling the tale on the riverboat.

### 3. The North Road (1763), Brag

The Pewter Lamb, snowbound on the Great North Road. Will Avery, stagecoach guard. Shillings.

- **Game:** Brag as the 1700s played it (`src/games/brag.ts`): three cards each, one round of bragging, only pairs royal and pairs count (aces high), the knave of clubs and the nine of diamonds are wild "braggers", and a natural hand beats the same hand made with a bragger. No runs, flushes or blind betting: those are the later game. Table stakes, 1s ante, 2s minimum, 100s each.
- **Teacher:** Hannah Pell, the innkeeper.
- **Cast:** Hannah (tight, polishes a tankard when strong), Captain Pike (loose, loud: the louder the boast, the weaker the hand), Jack Sorrel (tricky, his hand drifts to his coat pocket when weak).
- **Beats:** before hand 5 Sorrel is unmasked as a highwayman. Pike stakes a berth on a brig to Philadelphia. Finale: Hannah or Sorrel bows out. Win: the deck crosses the Atlantic.

### 4. The Camp (1863), five-card stud

A Union camp near Chattanooga, the night before battle. Sam Avery, Kit's son.

- **Game:** five-card stud (`src/games/fiveCardStud.ts`): one down, one up, then three more up, four betting rounds. Everyone antes $1. No bring-in: the best hand showing opens every round and may check. Table stakes, $4 minimum bet, $120 each. Hands as the 1864 *American Hoyle* lists them: the straight ranks below three of a kind and there is no straight flush.
- **Teacher:** Sergeant Reed (he is also the nemesis: a fair man who wants the deck).
- **Cast:** Toby Finch (drummer boy, calls everything, grins at every card, unreliable), Sergeant Reed (very tight, stops chewing when strong, about 85% reliable), Hattie Bloom (sutler, taps her pencil when bluffing).
- **Beats:** before hand 3 Toby's month's pay; before hand 9 orders arrive for the morning. Reed stakes his silver watch against the deck. Finale: Toby or Hattie bows out.

### 5. The Last Hand (1876), five-card draw

The Lucky Nugget, Deadwood. Clara Avery, Kit's granddaughter. The end of Part One.

- **Game:** five-card draw (`src/games/fiveCardDraw.ts`): the age (left of the dealer) antes $2 blind; five down; $4 to come in and the age makes good last; draw up to five; a second round with the player left of the age first. Ruby's limit is $20 a bet or raise, with no cap on raises (`spread-limit`). No jack pots. $240 each.
- **Teacher:** Ruby Calloway, who is also the nemesis and the narrator.
- **Cast:** Doc Whitcomb (prospector, loose, shakes his dust pouch when strong), Ruby (balanced; her smile is a deliberate coin flip), Jasper Crane (Silas's grandson, loose, the same mustache tell as his grandfather).
- **Beats:** before hand 2 miners talk about the shooting at Saloon No. 10 and the dead man's hand; before hand 3 Ruby warns Clara to watch Jasper when he deals. **The cheat:** from hand 4, Jasper deals himself four kings once, with his own tell and a decoy, exactly like Silas in chapter 1; the player can call out the deal. There is no stake: the deck is already Clara's, and the sitting is to settle it. Finale: Doc bows out, leaving Ruby, who turns out to be the real opponent.

### Bonus. The Gaming House (1817), Poque

Maison Fontaine, New Orleans. You play young Delphine, at her aunt's table.

- **Game:** Poque as reconstructed in `src/games/poque.ts`: 32-card piquet deck, five cards each, one betting round, only sets count (fours, threes, a pair; a second pair only breaks ties). Table stakes, $1 ante, $2 minimum, $100 each. The other two parts of the game, and the payout board, are not built.
- **Art:** fully painted: the salon, the title painting (a French Quarter street at night) and all three rivals.
- **Teacher:** Henri Avery, Will's son and Kit's grandfather.
- **Cast:** Henri (solid, hums when strong), Madame Élodie (tricky, fans her cards slowly when strong), Captain Lacroix (privateer, loose, laughs too loudly when bluffing).
- **Beats:** Élodie has won the Ashcombe deck from Henri, and stakes it; Delphine wins it back for him. Finale: Henri or Lacroix bows out.

## Part Two

### 6. The Back Room (1926), Seven Card Stud then Razz

A Chicago speakeasy behind a florist's shop. Edith Avery, Clara's daughter.

- **Stages:** hands 1 to 6, Seven Card Stud, taught by Sal Moretti; from hand 7, "Razz, after midnight", taught by Nora Shea. Limit, $10 unit, $400 each, stakes rise every 8 hands. Both are dealt with no bring-in (`stud-1926`, `razz-1926`): everyone antes and the best hand showing (in Razz the lowest) opens every round and may check. The low card's forced bring-in is a later casino rule; chapters 9 and 12 have it.
- **Cast:** Sal (bookkeeper, careful, taps his pencil when weak), Nora (owner, tricky, laughs and lights a cigarette when bluffing), Gus Lindqvist (truck driver, calls too much, hums a Swedish song when strong).
- **Beats:** before hand 4 a knock at the door, which turns out to be the ice man. Finale: Sal or Gus bows out. Players who go broke in the stud stage buy back in so everyone reaches Razz (see "Buy-backs" in GAME_DESIGN.md).

### 7. The Desert Classic (1972), Limit then No-Limit Hold'em

A fictional early championship in Las Vegas. Lou Avery.

- **Stages:** hands 1 to 5, "The side game, the night before", Limit Hold'em; from hand 6, "The Desert Classic: no limit", a tournament where everyone starts again with $500 (`resetStacks`) and blinds rise every 5 hands. Both taught by Professor Weiss.
- **Cast:** Professor Weiss (careful, polishes his glasses when weak), Tex Pruitt (loose and fast, tips his hat back when bluffing), Lorraine Fisk (former showgirl, her face never moves: a coin flip).
- **Beats:** no finale bow-out: it's a tournament, played to the last player.

### 8. The Cercle (1992), Pot-Limit Omaha then Omaha Hi-Lo

A private card club in Paris. Anna Avery, a translator. Money in francs ("1,000 F"). Fully painted: the panelled club room, all three rivals, and a title painting of a Paris boulevard at night (`docs/screenshots/chapter-8-intro.jpg`, `chapter-8-table.jpg`).

- **Stages:** hands 1 to 6, Pot-Limit Omaha, taught by Siobhan Kearney; from hand 7, "Omaha Hi-Lo, after two in the morning", taught by the Comte. 20 F unit, 1,000 F each, rising every 8 hands.
- **Cast:** Siobhan (Irish pro, drums her fingers when bluffing), the Comte Lucien Varenne (club president, tricky, turns his signet ring when strong), Dmitri Volkov (chess master, perfectly still when weak).
- **Beats:** before hand 4 the Comte asks to look at the old deck. Finale: Siobhan or Dmitri bows out.

### 9. The Boardwalk (1995), Stud Hi-Lo

An Atlantic City poker room, two years after poker became legal there (it was banned in the casinos until 1993; see HISTORY_SOURCES.md). Ray Avery, after his daughter Anna's Paris chapter.

- **Game:** Seven Card Stud Hi-Lo (eight or better), limit, $10 unit, $400 each, rising every 9 hands. Taught by Margot Arceneaux.
- **Cast:** Benny "the Book" Russo (loose, shuffles his chips faster when strong), Margot (Delphine's descendant and the room manager, twists a pearl earring when strong), Ruth Goldfarb (very tight, adjusts her glasses when weak).
- **Beats:** Margot stakes Delphine's diary, which tells how the two families shared the deck. Finale: Benny or Ruth bows out.

### 10. The Boom (2005), online Hold'em, 2-7 Triple Draw, Badugi, then a final table

Jamie Avery, a broke student, in an internet café at 3 a.m. The rivals are screen names; their tells are about **timing** and chat ("Bets instantly", "types hmm").

- **Stages:** hands 1 to 4, "The $5 qualifier, 3 a.m.", No-Limit Hold'em, taught by DeuceSeven; 5 to 8, "Waiting for the next table: 2-7 Triple Draw", taught by DeuceSeven; 9 to 12, "Still waiting: Badugi", taught by Hanbit; from 13, "The final table, Las Vegas", No-Limit Hold'em with stacks reset and its own lighting (a stage `scene` palette). $10 unit, $500 each, blinds rise every 4 hands.
- **Cast:** DeuceSeven (tanks then raises when bluffing), N0rthStar (bets instantly when strong; revealed at the final table as Nate Crane), Hanbit (from Seoul, types "hmm" when weak).
- **Beats:** the final table opens with the reveal. Finale: no bow-outs; it is played to the end like a tournament, with a heads-up line from Nate.

### 11. The Big O (2019), 5- and 6-Card Omaha, then Hi-Lo

A big card room in the English Midlands. Sophie Avery. Pounds ("£200").

- **Stages:** hands 1 to 4, 5-Card Omaha; 5 to 8, 6-Card Omaha; from 9, "Last round: Hi-Lo", alternating 5-Card and 6-Card Omaha Hi-Lo two hands each. All pot-limit, all taught by Gaz. £4 unit, £200 each, rising every 6 hands.
- **Cast:** Kerry-Ann Booth (loose, checks her phone when weak), Gaz Whitlock (a regular who has seen everything, goes quiet when strong), Mr. Okafor (tight, perfect chip towers when strong).
- **Beats:** before hand 3 Gaz recognises the old deck. Finale: Kerry-Ann or Okafor bows out.

### 12. The Last Table (today), HORSE then the 8-Game

A private room in Macau. You, the last Avery, against Victor Crane, the last Crane. Hong Kong dollars.

- **Stages:** hands 1 to 10, HORSE: Limit Hold'em, Omaha Hi-Lo, Razz, Stud, Stud Hi-Lo, two hands each. From hand 11, the 8-Game: 2-7 Triple Draw, Limit Hold'em, Omaha Hi-Lo, Razz, Stud, Stud Hi-Lo, No-Limit Hold'em, Pot-Limit Omaha, two hands each, round and round. Mei Lin Chau gives a short lesson the first time each game is dealt (the player may have jumped straight here). HK$50 unit, HK$2,500 each, rising every 10 hands. Buy-backs during HORSE; from the 8-Game, broke means out.
- **Cast:** Mei Lin (quiet legend, sips her tea when weak), Victor (straightens his riverboat cufflinks when bluffing), Rafael Duarte (shipping heir, loose, hums when strong).
- **Beats:** before hand 6 Victor says the deck does the winning; Mei Lin disagrees. Finale: Mei Lin or Rafael bows out. Win: the feud ends.

### Epilogue. The Kitchen Table (today), house extras

A home game with friends. No-Limit Hold'em, $1/$2, $200 each, blinds rise every 12 hands ("to keep it spicy").

- **House extras:** every 4th hand is a **bomb pot** (everyone puts in 3 units, no betting before the flop) dealt with a **double board** (half the pot for each board); winning a pot with **7-2** and showing it collects a **bounty** of 2 units from everyone. Taught by Marcus, Dee and Priya before the first deal.
- **Cast:** Priya (loves chaos, can't stop smiling when strong), Marcus (the host, re-stacks his chips by colour when strong), Dee (always says it's seven-deuce, drums the table when bluffing).
- **Beats:** before hand 6 your friends ask for the whole story. Finale: Priya or Dee bows out. Win: the case is full, and the ending links to RSDP Live.

## How the rivals play

Every rival's numbers, from their chapter file (what each number means: [GAME_DESIGN.md](GAME_DESIGN.md), "How the bots think"), and how they actually played in the bot lab (`tools/bot-lab.ts`, 2026-11-20, 300 hands per stand-in in Part One, 200 to 300 in Part Two). "Plays" is the share of hands they put money in on the first round by choice; "bets" the share of their decisions that were bets or raises. In multi-game chapters these mix every game.

| Chapter | Rival | valueAt | bluff | caution | betSize | trap | respect | reads | tilt | plays % | bets % | folds to a bet % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| riverboat | Delphine | 1.6 | 0.07 | 0.03 | 0.6 | 0.5 | 0.6 | 0.9 |  | 33 | 17 | 54 |
| riverboat | Silas | 1.3 | 0.24 | -0.02 | 0.75 |  | 0.35 | 0.6 | 0.12 | 53 | 39 | 37 |
| riverboat | Ezra | 2.0 | 0.0 | 0.1 | 0.4 |  | 0.95 | 0.1 |  | 28 | 14 | 64 |
| painted-deck | Sir Roland | 1.1 | 0.3 | -0.06 | 0.8 |  | 0.25 | 0.1 | 0.15 | 44 | 37 | 35 |
| painted-deck | Lady Margery | 1.45 | 0.08 | 0.04 | 0.7 |  | 0.6 | 0.9 |  | 17 | 19 | 40 |
| painted-deck | Brother Anselm | 1.7 | 0.03 | 0.08 | 0.5 |  | 0.85 | 0.3 |  | 6 | 5 | 73 |
| north-road | Hannah | 1.7 | 0.04 | 0.06 | 0.7 |  | 0.8 | 0.4 |  | 29 | 16 | 61 |
| north-road | Captain Pike | 1.15 | 0.32 | -0.04 | 0.85 |  | 0.3 | 0.2 | 0.1 | 57 | 43 | 36 |
| north-road | Mr. Sorrel | 1.35 | 0.18 | 0.0 | 0.65 | 0.35 | 0.5 | 0.9 |  | 47 | 28 | 41 |
| camp | Toby | 1.5 | 0.04 | -0.12 | 0.45 |  | 0.4 | 0.1 |  | 58 | 15 | 27 |
| camp | Sergeant Reed | 1.9 | 0.02 | 0.1 | 0.75 |  | 0.9 | 0.6 |  | 12 | 7 | 43 |
| camp | Hattie | 1.35 | 0.22 | 0.02 | 0.7 |  | 0.5 | 0.6 | 0.08 | 40 | 23 | 30 |
| last-hand | Doc | 1.4 | 0.12 | -0.08 | 0.5 |  | 0.4 | 0.3 |  | 31 | 24 | 38 |
| last-hand | Ruby | 1.4 | 0.14 | 0.03 | 0.7 | 0.3 | 0.6 | 1 |  | 25 | 27 | 34 |
| last-hand | Jasper | 1.3 | 0.25 | -0.02 | 0.8 |  | 0.35 | 0.4 | 0.15 | 40 | 40 | 27 |
| gaming-house | Henri | 1.5 | 0.08 | 0.03 | 0.6 |  | 0.7 | 0.5 | 0.1 | 32 | 27 | 54 |
| gaming-house | Madame Élodie | 1.45 | 0.12 | 0.04 | 0.7 | 0.4 | 0.6 | 1 |  | 38 | 25 | 47 |
| gaming-house | Lacroix | 1.15 | 0.3 | -0.06 | 0.85 |  | 0.25 | 0.2 | 0.12 | 57 | 40 | 34 |
| back-room | Sal | 1.55 | 0.05 | 0.05 | 0.6 |  | 0.75 | 0.7 |  | 30 | 20 | 38 |
| back-room | Nora | 1.35 | 0.15 | 0.02 | 0.7 | 0.25 | 0.6 | 0.8 |  | 40 | 27 | 23 |
| back-room | Gus | 1.3 | 0.1 | -0.08 | 0.5 |  | 0.4 | 0.1 |  | 52 | 22 | 10 |
| desert-classic | Professor Weiss | 1.5 | 0.06 | 0.04 | 0.6 |  | 0.7 | 0.7 |  | 23 | 14 | 47 |
| desert-classic | Tex | 1.2 | 0.28 | -0.03 | 0.8 |  | 0.35 | 0.5 | 0.1 | 48 | 31 | 21 |
| desert-classic | Lorraine | 1.45 | 0.12 | 0.03 | 0.7 | 0.4 | 0.6 | 0.9 |  | 35 | 15 | 26 |
| boardwalk | Benny | 1.3 | 0.14 | -0.04 | 0.6 |  | 0.5 | 0.6 |  | 51 | 22 | 15 |
| boardwalk | Margot | 1.45 | 0.1 | 0.04 | 0.7 | 0.3 | 0.6 | 0.9 |  | 26 | 14 | 21 |
| boardwalk | Ruth | 1.9 | 0.0 | 0.1 | 0.5 |  | 0.95 | 0.2 |  | 17 | 3 | 51 |
| cercle | Siobhan | 1.4 | 0.14 | 0.02 | 0.75 |  | 0.6 | 0.9 |  | 27 | 16 | 42 |
| cercle | Comte Varenne | 1.4 | 0.1 | 0.03 | 0.75 | 0.3 | 0.6 | 0.7 |  | 25 | 13 | 45 |
| cercle | Dmitri | 1.6 | 0.06 | 0.06 | 0.6 |  | 0.7 | 0.8 |  | 29 | 8 | 44 |
| boom | DeuceSeven | 1.35 | 0.16 | 0.01 | 0.7 |  | 0.5 | 0.8 |  | 30 | 30 | 31 |
| boom | N0rthStar | 1.25 | 0.22 | -0.01 | 0.8 | 0.2 | 0.6 | 1 |  | 39 | 35 | 23 |
| boom | Hanbit | 1.5 | 0.08 | 0.04 | 0.6 |  | 0.6 | 0.7 |  | 29 | 21 | 33 |
| big-o | Kerry-Ann | 1.3 | 0.15 | -0.03 | 0.7 |  | 0.5 | 0.3 | 0.08 | 34 | 19 | 41 |
| big-o | Gaz | 1.35 | 0.14 | 0.0 | 0.75 | 0.25 | 0.6 | 0.9 |  | 28 | 16 | 41 |
| big-o | Mr. Okafor | 1.7 | 0.04 | 0.07 | 0.6 |  | 0.8 | 0.4 |  | 29 | 6 | 52 |
| last-table | Mei Lin | 1.5 | 0.08 | 0.04 | 0.65 |  | 0.6 | 1 |  | 33 | 22 | 28 |
| last-table | Victor | 1.3 | 0.2 | 0.0 | 0.75 | 0.25 | 0.5 | 0.7 | 0.1 | 40 | 28 | 17 |
| last-table | Rafael | 1.2 | 0.22 | -0.05 | 0.75 |  | 0.3 | 0.2 | 0.1 | 47 | 30 | 13 |
| kitchen-table | Priya | 1.2 | 0.22 | -0.06 | 0.7 |  | 0.3 | 0.2 |  | 30 | 28 | 43 |
| kitchen-table | Marcus | 1.45 | 0.1 | 0.03 | 0.65 | 0.3 | 0.6 | 0.7 | 0.08 | 22 | 15 | 43 |
| kitchen-table | Dee | 1.35 | 0.18 | -0.02 | 0.6 |  | 0.45 | 0.3 |  | 47 | 24 | 33 |

Stand-ins in your seat, in betting units won per 100 hands (negative means the rivals beat them):

| Chapter | station | maniac | aggro | teacher |
| --- | --- | --- | --- | --- |
| riverboat | -82 | -695 | -644 | -43 |
| painted-deck | -203 | -82 | -472 | -41 |
| north-road | -181 | -918 | -846 | 61 |
| camp | -264 | -402 | -678 | 13 |
| last-hand | -234 | -516 | -574 | 35 |
| gaming-house | -353 | -1281 | -980 | 10 |
| back-room | -188 | -306 | -361 | 14 |
| desert-classic | -364 | -139 | -407 | 37 |
| boardwalk | -125 | -143 | -121 | -11 |
| cercle | -347 | -163 | -441 | -2 |
| boom | -319 | -160 | -108 | 43 |
| big-o | -247 | -275 | -344 | 5 |
| last-table | -197 | -206 | -431 | -23 |
| kitchen-table | -738 | -594 | -433 | 110 |
