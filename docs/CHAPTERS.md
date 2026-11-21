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
| 10 | The Boom | `boom.ts` | 2005 | No-Limit Hold'em, 2-7 Triple Draw, Badugi | Jamie Avery | "N0rthStar" (Nat Crane) | 9 |
| 11 | The Big O | `bigO.ts` | 2019 | 5- and 6-Card Omaha, then their Hi-Lo versions | Sophie Avery | Gaz Whitlock | 10 |
| 12 | The Last Table | `lastTable.ts` | Today | HORSE, then the 8-Game | You, the last Avery | Elena Crane | 11 |
| Epilogue | The Kitchen Table | `kitchenTable.ts` | Today | No-Limit Hold'em with bomb pots, double board, 7-2 bounty | You, the last Avery | Elena, now your wife | 12 |

Each chapter's music (its own original tune, set in `scene.music`) is listed in [MUSIC.md](MUSIC.md).

"Unlocked by" is the chapter you must win to open it normally. Every chapter can still be opened early from the chapter select: the intro then shows "The story so far" (the chapter's `recap`) first, so a friend can go straight to the game they want to learn. The bonus is not on the main path: "On to…" after chapter 5 goes to chapter 6.

Every rival's personality numbers and tell chances are in the chapter file; the tables below give the character of each so you know what to expect. The numbers are explained in [GAME_DESIGN.md](GAME_DESIGN.md), "How the bots think".

### Chapters that go back in time

Play order is not date order in Part One: 1836, then 1543 and 1763, then 1863 and 1876, with the 1817 bonus last. The game makes that plain instead of hiding it. Chapters 2 and 3 and the bonus set `toldBy` ("Delphine's tale", "Delphine's own tale"), which is printed under the year on their card in the chapter select and on their intro screen; Part One's heading on the chapter select says "It opens in 1836, looks back to 1543, and goes on to 1876"; and the story text carries the frame: chapter 1's ending starts Delphine's telling, chapters 2 and 3 open and close on the riverboat with her, and chapter 4 opens "twenty-seven years" after the riverboat. Part Two runs in date order.

Who is related to whom, with the dates that make it possible, is in [GAME_OUTLINE.md](GAME_OUTLINE.md), "The family lines". Check new story text against it.

### The feud, chapter by chapter

The story is a family feud with a happy ending (John, 2026-11-21: "a Hatfields and McCoys story with a happy ending"). The player should dislike the Cranes at first, warm to them over the years, and end by marrying one. Each Crane is written to that curve; keep new lines on it.

| When | Who | How they come across | Where it is written |
| --- | --- | --- | --- |
| 1543 | Sir Roland Crane | Where it starts, as a sulk and not a crime: Lady Margery's nephew, a likeable fool who was promised the deck and watches a painter's daughter win it. "A Crane does not forget." | `paintedDeck.ts`: his role, the stake, his bust line, Delphine's ending |
| 1763 | A Crane of Kent, never seen | The grudge is already a family habit: he pays the highwayman Jack Sorrel ten guineas to take the deck off the York coach. | `northRoad.ts`: Sorrel's unmasking, Delphine's ending |
| 1836 | Silas Crane | Hateful: a cheat with no redeeming moment. He gloats about Kit's father, and loses saying the Cranes have been robbed again after three hundred years. The bitterness starts here. | `riverboat.ts`: the stake, his bust line, the ending |
| 1876 | Jasper Crane | Still an enemy and still a cheat, but with the first human note: he believes the family's luck "went downriver" with the deck, and leaves saying it was the only thing his hard grandfather ever spoke softly about. | `lastHand.ts`: the moment before hand 5, his exit |
| 1926, 1972, 1992 | A lawyer, no name | Letters offering to buy the deck, more polite every time: a threat in 1926, "a fair price, at your convenience" in 1972, "with respect" in 1992. No Avery answers. The reader only learns in 2005 that they were the Cranes'. | `backRoom.ts` (before hand 6), `desertClassic.ts` (before hand 3), `cercle.ts` (before hand 4) |
| 2005 | Nat Crane | A rival to respect, and the first Crane woman at the table: cold, fair, no cheating. She names the letters, wants to win the deck "fair, with the whole country watching", and shakes hands when she loses. | `boom.ts`: the final table's opening, her bust line, the ending |
| 2019 | "E. Crane" | The first warm word: a handwritten, signed note that apologises for the old letters and only asks to see the deck. | `bigO.ts`: the intro, the moment before hand 7 |
| Today | Elena Crane | Likeable from the first hand: a top professional, funny, honest about Silas. The player falls for her across the table. | `lastTable.ts` |
| Today | Victor Crane | The old grudge, in person, until the last scene lets it go. Baffled and delighted at a kitchen table a year later. | `lastTable.ts`, `kitchenTable.ts` |

The game opens and closes on this arc in pictures: see [GAME_DESIGN.md](GAME_DESIGN.md), "The opening and the ending".

## Part One

### 1. The River (1836), straight poker

Built first, and the model for the rest. Table stakes (no limit), $1 ante, $2 minimum bet, $100 each, no rising stakes. Full detail is in [GAME_DESIGN.md](GAME_DESIGN.md), "Chapter 1". Beats: scripted tutorial hand with Delphine pointing out Ezra's tell; Silas stakes the Ashcombe deck, gloating that Kit's father begged; Silas deals himself four aces once, and you can call out the deal; Delphine or Ezra bows out for the heads-up finale. Win: Silas says he was robbed and that his family will want the deck back, and Delphine answers the legend ("Your father held it, and lost. It is not the deck, darling. It is who is watching.") before she begins her tale.

### 2. The Painted Deck (1543), Primero

Ashcombe Hall, Twelfth Night. Nan Avery plays Lady Margery for the deck Nan's father painted. Money is in shillings (shown as "12s").

- **Game:** Primero as reconstructed in `src/games/primero.ts` (40 cards, two down, bet, two down, bet, change up to two once, bet). Table stakes: wager any part of your "rest". 1s ante, 2s minimum wager, 200s each, stakes rise every 10 hands.
- **Teacher:** Brother Anselm, before the first deal and on each street of the first hand.
- **Cast:** Sir Roland Crane, Lady Margery's nephew (very loose, drains his cup before a bluff), Lady Margery (tight and strong, turns her signet ring when strong), Brother Anselm (careful, mutters a prayer when weak).
- **Beats:** before hand 4 Roland wagers and loses his horse; he was promised the deck as a New Year's gift, and says so when it is staked and when he loses ("A Crane does not forget"); before hand 7 Anselm talks about his abbey. Margery puts the deck on the table once Nan has won a few pots. Finale: Roland or Anselm bows out. Win: she pays, gives the deck back to Nan, and writes "M.A. 1543" in its case. The intro opens, and the win ending closes, with Delphine telling the tale on the riverboat; she names Roland as the start of the quarrel.

### 3. The North Road (1763), Brag

The Pewter Lamb, snowbound on the Great North Road. Will Avery, stagecoach guard. Shillings.

- **Game:** Brag as the 1700s played it (`src/games/brag.ts`): three cards each, one round of bragging, only pairs royal and pairs count (aces high), the knave of clubs and the nine of diamonds are wild "braggers", and a natural hand beats the same hand made with a bragger. No runs, flushes or blind betting: those are the later game. Table stakes, 1s ante, 2s minimum, 100s each.
- **Teacher:** Hannah Pell, the innkeeper.
- **Cast:** Hannah (tight, polishes a tankard when strong), Captain Pike (loose, loud: the louder the boast, the weaker the hand), Jack Sorrel (tricky, his hand drifts to his coat pocket when weak).
- **Beats:** before hand 5 Sorrel is unmasked as a highwayman, and admits a gentleman of Kent named Crane paid him ten guineas to take the deck. Pike stakes a berth on a brig to Philadelphia. Finale: Hannah or Sorrel bows out. Win: the deck crosses the Atlantic. Delphine closes her tale by saying how she knows it (she held the deck herself at nineteen and gave it back to Kit's grandfather, who told her) and why she is on this boat (she heard Silas Crane was showing a painted deck on the river, and bought passage).

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
- **Beats:** before hand 2 miners talk about the shooting at Saloon No. 10 and the dead man's hand; before hand 3 Ruby warns Clara to watch Jasper when he deals; before hand 5 Jasper says why the Cranes want the deck (his grandfather never won a big hand again, and said their luck went downriver with it), Ruby says Silas dealt seconds, and Jasper answers "That is the Avery story. We have our own." **The cheat:** from hand 4, Jasper deals himself four kings once, with his own tell and a decoy, exactly like Silas in chapter 1; the player can call out the deal. There is no stake: the deck is already Clara's, and the sitting is to settle it. Finale: Doc bows out, leaving Ruby, who turns out to be the real opponent, and part of the feud: Jasper offered her a thousand dollars to win the deck for him, and she would sooner win it for herself. If Jasper goes broke he stops at the door for one human line about his grandfather. Win: Clara pencils "Still ours" in the case and decides the name goes with the deck, so her children are Averys (which is why Edith and, later, Sophie carry the name through their mothers).

### Bonus. The Gaming House (1817), Poque

Maison Fontaine, New Orleans. You play young Delphine, at her aunt's table.

- **Game:** Poque as reconstructed in `src/games/poque.ts`: 32-card piquet deck, five cards each, one betting round, only sets count (fours, threes, a pair; a second pair only breaks ties). Table stakes, $1 ante, $2 minimum, $100 each. The other two parts of the game, and the payout board, are not built.
- **Art:** fully painted: the salon, the title painting (a French Quarter street at night) and all three rivals.
- **Teacher:** Henri Avery, Will's son and Kit's grandfather.
- **Cast:** Henri (solid, hums when strong), Madame Élodie (tricky, fans her cards slowly when strong), Captain Lacroix (privateer, loose, laughs too loudly when bluffing).
- **Beats:** Élodie has won the Ashcombe deck from Henri, and stakes it; Delphine wins it back for him. Finale: Henri or Lacroix bows out.

## Part Two

### 6. The Back Room (1926), Seven Card Stud then Razz

A Chicago speakeasy behind a florist's shop. Edith Avery, Clara's daughter. Fully painted: the brick back room under its green lamp, all three rivals, and a title painting of the shop on a rainy night (`docs/screenshots/chapter-6-intro.jpg`, `chapter-6-table.jpg`).

- **Stages:** hands 1 to 6, Seven Card Stud, taught by Sal Moretti; from hand 7, "Razz, after midnight", taught by Nora Shea. Limit, $10 unit, $400 each, stakes rise every 8 hands. Both are dealt with no bring-in (`stud-1926`, `razz-1926`): everyone antes and the best hand showing (in Razz the lowest) opens every round and may check. The low card's forced bring-in is a later casino rule; chapters 9 and 12 have it.
- **Cast:** Sal (bookkeeper, careful, taps his pencil when weak), Nora (owner, tricky, laughs and lights a cigarette when bluffing), Gus Lindqvist (truck driver, calls too much, hums a Swedish song when strong).
- **Beats:** before hand 4 a knock at the door, which turns out to be the ice man; before hand 6 Nora mentions a lawyer asking around for an old painted deck, and the first letter (no name: "name your price, or the deck will be taken from you at a card table, as it was taken from us"). Finale: Sal or Gus bows out. Players who go broke in the stud stage buy back in so everyone reaches Razz (see "Buy-backs" in GAME_DESIGN.md).

### 7. The Desert Classic (1972), Limit then No-Limit Hold'em

A fictional early championship in Las Vegas. Lou Avery. Fully painted: the tournament room under its amber lamps, all three rivals, and a title painting of the strip at dusk (`docs/screenshots/chapter-7-intro.jpg`, `chapter-7-table.jpg`).

- **Stages:** hands 1 to 5, "The side game, the night before", Limit Hold'em; from hand 6, "The Desert Classic: no limit", a tournament where everyone starts again with $500 (`resetStacks`) and blinds rise every 5 hands. Both taught by Professor Weiss.
- **Cast:** Professor Weiss (careful, polishes his glasses when weak), Tex Pruitt (loose and fast, tips his hat back when bluffing), Lorraine Fisk (former showgirl, her face never moves: a coin flip).
- **Beats:** before hand 3 Tex says a lawyer wrote to him too, offering good money to anyone who could win the deck from an Avery; the letters have grown polite ("a fair price, at your convenience"). No finale bow-out: it's a tournament, played to the last player.

### 8. The Cercle (1992), Pot-Limit Omaha then Omaha Hi-Lo

A private card club in Paris. Anna Avery, a translator. Money in francs ("1,000 F"). Fully painted: the panelled club room, all three rivals, and a title painting of a Paris boulevard at night (`docs/screenshots/chapter-8-intro.jpg`, `chapter-8-table.jpg`).

- **Stages:** hands 1 to 6, Pot-Limit Omaha, taught by Siobhan Kearney; from hand 7, "Omaha Hi-Lo, after two in the morning", taught by the Comte. 20 F unit, 1,000 F each, rising every 8 hands.
- **Cast:** Siobhan (Irish pro, drums her fingers when bluffing), the Comte Lucien Varenne (club president, tricky, turns his signet ring when strong), Dmitri Volkov (chess master, perfectly still when weak).
- **Beats:** before hand 4 the Comte asks to look at the old deck, and tells of a New York lawyer who writes to every collector in Europe on behalf of a client with no name; the family's own latest letter says "with respect" twice. The intro says Ray lent Anna the deck on condition it comes home. Finale: Siobhan or Dmitri bows out.

### 9. The Boardwalk (1995), Stud Hi-Lo

An Atlantic City poker room, two years after poker became legal there (it was banned in the casinos until 1993; see HISTORY_SOURCES.md). Ray Avery, after his daughter Anna's Paris chapter. Fully painted: the poker room with its blue table and neon, all three rivals, and a title painting of the boardwalk at dusk (`docs/screenshots/chapter-9-intro.jpg`, `chapter-9-table.jpg`).

- **Game:** Seven Card Stud Hi-Lo (eight or better), limit, $10 unit, $400 each, rising every 9 hands. Taught by Margot Arceneaux.
- **Cast:** Benny "the Book" Russo (loose, shuffles his chips faster when strong), Margot (Delphine's descendant and the room manager, twists a pearl earring when strong), Ruth Goldfarb (very tight, adjusts her glasses when weak).
- **Beats:** Margot's family held the deck once, for one night, and gave it back; she wants to win it the same way, hold it one night, and send it home. She stakes Delphine's diary. Finale: Benny or Ruth bows out.

### 10. The Boom (2005), online Hold'em, 2-7 Triple Draw, Badugi, then a final table

Jamie Avery, a broke student, in an internet café at 3 a.m. The rivals are screen names; their tells are about **timing** and chat ("Bets instantly", "types hmm").

- **Stages:** hands 1 to 4, "The $5 qualifier, 3 a.m.", No-Limit Hold'em, taught by DeuceSeven; 5 to 8, "Waiting for the next table: 2-7 Triple Draw", taught by DeuceSeven; 9 to 12, "Still waiting: Badugi", taught by Hanbit; from 13, "The final table, Las Vegas", No-Limit Hold'em with stacks reset, its own room (a stage `scene`) and the rivals in person (the stage's `seats`). $10 unit, $500 each, blinds rise every 4 hands.
- **Cast:** DeuceSeven (tanks then raises when bluffing), N0rthStar (bets instantly when strong; revealed at the final table as Nat Crane), Hanbit (from Seoul, types "hmm" when weak).
- **Art:** online, the table is the screen of the café's monitor and the rivals are square avatars above its far rim (a shark, a star, a tiger cub). At the final table DeuceSeven is painted; Nat Crane and Hanbit are silhouettes until their pictures are made, and there is no title painting yet.
- **Beats:** the final table opens with the reveal: Nat Crane says her family has wanted the deck since 1543, names the eighty years of lawyers' letters ("You never wrote back") and says she does not cheat and means to win the deck fairly, on television. Finale: no bow-outs; it is played to the end like a tournament, with a heads-up line from Nat, who shakes hands when she loses.

### 11. The Big O (2019), 5- and 6-Card Omaha, then Hi-Lo

A big card room in the English Midlands. Sophie Avery. Pounds ("£200").

- **Stages:** hands 1 to 4, 5-Card Omaha; 5 to 8, 6-Card Omaha; from 9, "Last round: Hi-Lo", alternating 5-Card and 6-Card Omaha Hi-Lo two hands each. All pot-limit, all taught by Gaz. £4 unit, £200 each, rising every 6 hands.
- **Cast:** Kerry-Ann Booth (loose, checks her phone when weak), Gaz Whitlock (a regular who has seen everything, goes quiet when strong), Mr. Okafor (tight, perfect chip towers when strong).
- **Beats:** the intro has the first warm word from a Crane: a handwritten note signed "E. Crane", sorry for the old letters and asking only to see the deck. Before hand 3 Gaz recognises the old deck; before hand 7 he sees Sophie reading the note and tells her to write back. Jamie gave Sophie the deck when she moved. Finale: Kerry-Ann or Okafor bows out.

### 12. The Last Table (today), HORSE then the 8-Game

A private room in Macau. You are the last Avery (a man; the story ends with his wedding), and Sophie has handed you the deck with its bundle of letters. Victor Crane sends the invitation but does not play for the deck himself: his daughter **Elena Crane**, one of the best professional players in the world, plays for the family. She is the "E. Crane" of the 2019 note. Hong Kong dollars.

- **Stages:** hands 1 to 10, HORSE: Limit Hold'em, Omaha Hi-Lo, Razz, Stud, Stud Hi-Lo, two hands each. From hand 11, the 8-Game: 2-7 Triple Draw, Limit Hold'em, Omaha Hi-Lo, Razz, Stud, Stud Hi-Lo, No-Limit Hold'em, Pot-Limit Omaha, two hands each, round and round. Mei Lin Chau gives a short lesson the first time each game is dealt (the player may have jumped straight here). HK$50 unit, HK$2,500 each, rising every 10 hands. Buy-backs during HORSE; from the 8-Game, broke means out. The games and rules are unchanged from before the story rework.
- **Cast:** Mei Lin (quiet legend, sips her tea when weak), Elena (the nemesis: a top pro, she looks up at you before she bets when she is bluffing), Victor (her father, straightens his riverboat cufflinks when bluffing). Rafael Duarte, the shipping heir who used to hold the third seat, is gone.
- **Elena's strength:** she is written as a top pro in her talk and reputation, not in a punishing difficulty: this is a teaching game. Her numbers are a little sharper than Victor's. When rivals move to RSDP Live's bots, she is one of the few characters where the Hard setting may fit (John, 2026-11-21).
- **Beats, the two of you warming:** before hand 2 she says she wrote to your family once, and laughs when you say the note reached you last month in a shoebox; before hand 4 you tell her she looks at you when she bluffs; before hand 6 Victor gives the Crane version of the legend (their luck went downriver in 1836), Mei Lin answers that the Averys won by watching people, and Elena says Silas dealt seconds ("That is the Avery version," says Victor); before hand 9 she reads Clara's "Still ours" in the case, and Mei Lin tells Victor these two are no longer playing for the deck.
- **Finale:** Mei Lin or Victor bows out ("I started this, with a letter. You two finish it."), and the last two are you and Elena, for the deck, loser buys dinner. Win: she laughs, says it was always yours, and you owe her dinner; Victor lets the grudge go ("It was never the deck, was it? Maybe the Cranes can just play cards now"); the case has room for one more line, which you leave empty until after dinner.

### Epilogue. The Kitchen Table (today), house extras

The home game the night after your wedding to Elena, a year and a good many dinners after Macau. Both families at one table. No-Limit Hold'em, $1/$2, $200 each, blinds rise every 12 hands ("to keep it spicy").

- **House extras:** every 4th hand is a **bomb pot** (everyone puts in 3 units, no betting before the flop) dealt with a **double board** (half the pot for each board); winning a pot with **7-2** and showing it collects a **bounty** of 2 units from everyone. Unchanged. Taught before the first deal by Dee, with Marcus and Priya, while Victor objects ("That is not poker").
- **Cast, left to right:** Dee (your friend; always says it's seven-deuce, drums the table when bluffing), Elena (your wife, the nemesis; she still looks up before a bluff), Victor (your father-in-law, at his first home game; the cufflinks). Elena and Victor sit where they sat in Macau, so their pictures serve both chapters. **Marcus deals and Priya heckles from the sofa:** they speak in scenes with their names shown but hold no seat (`bystanders` in the chapter file).
- **Beats:** before hand 3 Victor learns there is a prize for the worst hand in poker; before hand 6 your friends ask for the whole story, Victor tells it again with the Cranes as the injured party, Elena says Silas dealt seconds, and Dee gets the last word ("The Cranes didn't fold. They married in."); before hand 9 Victor says he hasn't enjoyed a game so much in forty years. Finale: Victor or Dee bows out, and the last two are you and Elena again: last time for the deck, this time the loser does the dishes. Win: the case is full, and the last line in its lid is two names, Avery and Crane. Then the ending pictures and the credits, which link to RSDP Live.

## How the rivals play

Every rival thinks with RSDP Live's practice bot at the level shown, bent by the numbers from their chapter file (what each means: [GAME_DESIGN.md](GAME_DESIGN.md), "How the bots think"; what is RSDP's and what is ours: [BOTS.md](BOTS.md)). The last three columns are how they actually played in the bot lab (`tools/bot-lab.ts`, 2026-11-21, 300 hands per stand-in in Part One, 200 to 300 in Part Two). "Plays" is the share of hands they put money in on the first round by choice; "bets" the share of their decisions that were bets or raises. In multi-game chapters these mix every game.

| Chapter | Rival | RSDP level | valueAt | bluff | caution | betSize | trap | respect | reads | tilt | plays % | bets % | folds to a bet % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| riverboat | Delphine | normal | 1.6 | 0.07 | 0.03 | 0.6 | 0.5 | 0.6 | 0.9 |  | 28 | 15 | 68 |
| riverboat | Silas | easy | 1.05 | 0.24 | -0.02 | 0.75 |  | 0.35 | 0.6 | 0.12 | 55 | 23 | 38 |
| riverboat | Ezra | easy | 2 | 0 | 0.2 | 0.4 |  | 0.95 | 0.1 |  | 29 | 7 | 62 |
| painted-deck | Sir Roland | easy | 0.95 | 0.3 | -0.06 | 0.8 |  | 0.25 | 0.1 | 0.15 | 38 | 24 | 34 |
| painted-deck | Lady Margery | normal | 1.45 | 0.08 | -0.03 | 0.7 |  | 0.4 | 0.9 |  | 12 | 19 | 57 |
| painted-deck | Brother Anselm | easy | 1.7 | 0.03 | 0.18 | 0.5 |  | 0.85 | 0.3 |  | 9 | 6 | 56 |
| north-road | Hannah | easy | 1.7 | 0.04 | 0.12 | 0.7 |  | 0.8 | 0.4 |  | 35 | 10 | 60 |
| north-road | Captain Pike | easy | 0.95 | 0.32 | -0.04 | 0.85 |  | 0.3 | 0.2 | 0.1 | 60 | 24 | 34 |
| north-road | Mr. Sorrel | normal | 1.35 | 0.18 | 0 | 0.65 | 0.35 | 0.5 | 0.9 |  | 36 | 19 | 59 |
| camp | Toby | easy | 1.5 | 0.04 | -0.12 | 0.45 |  | 0.4 | 0.1 |  | 38 | 13 | 22 |
| camp | Sergeant Reed | normal | 1.5 | 0.02 | 0 | 0.75 |  | 0.5 | 0.6 |  | 10 | 17 | 57 |
| camp | Hattie | easy | 1.35 | 0.22 | 0.02 | 0.7 |  | 0.5 | 0.6 | 0.08 | 23 | 20 | 31 |
| last-hand | Doc | easy | 1.4 | 0.12 | -0.08 | 0.5 |  | 0.4 | 0.3 |  | 34 | 16 | 31 |
| last-hand | Ruby | normal | 1.4 | 0.14 | 0.03 | 0.7 | 0.3 | 0.6 | 1 |  | 20 | 27 | 50 |
| last-hand | Jasper | normal | 1.3 | 0.25 | -0.02 | 0.8 |  | 0.35 | 0.4 | 0.15 | 32 | 40 | 35 |
| gaming-house | Henri | easy | 1.5 | 0.08 | 0.03 | 0.6 |  | 0.7 | 0.5 | 0.1 | 38 | 11 | 53 |
| gaming-house | Madame Élodie | normal | 1.45 | 0.12 | 0.04 | 0.7 | 0.4 | 0.6 | 1 |  | 33 | 19 | 64 |
| gaming-house | Lacroix | easy | 0.95 | 0.3 | -0.06 | 0.85 |  | 0.25 | 0.2 | 0.12 | 59 | 21 | 29 |
| back-room | Sal | normal | 1.55 | 0.05 | 0.05 | 0.6 |  | 0.75 | 0.7 |  | 15 | 18 | 65 |
| back-room | Nora | normal | 1.35 | 0.15 | 0.02 | 0.7 | 0.25 | 0.6 | 0.8 |  | 27 | 24 | 43 |
| back-room | Gus | easy | 1.3 | 0.1 | 0.02 | 0.5 |  | 0.4 | 0.1 |  | 29 | 19 | 11 |
| desert-classic | Professor Weiss | normal | 1.5 | 0.06 | 0.04 | 0.6 |  | 0.7 | 0.7 |  | 24 | 14 | 55 |
| desert-classic | Tex | normal | 1.2 | 0.28 | -0.03 | 0.8 |  | 0.35 | 0.5 | 0.1 | 46 | 30 | 29 |
| desert-classic | Lorraine | normal | 1.45 | 0.12 | 0.03 | 0.7 | 0.4 | 0.6 | 0.9 |  | 35 | 15 | 36 |
| cercle | Siobhan | normal | 1.4 | 0.14 | 0.02 | 0.75 |  | 0.6 | 0.9 |  | 25 | 19 | 50 |
| cercle | Comte Varenne | normal | 1.4 | 0.1 | 0.03 | 0.75 | 0.3 | 0.6 | 0.7 |  | 23 | 13 | 54 |
| cercle | Dmitri | normal | 1.6 | 0.06 | 0.06 | 0.6 |  | 0.7 | 0.8 |  | 30 | 11 | 48 |
| boardwalk | Benny | easy | 1.3 | 0.14 | 0.06 | 0.6 |  | 0.5 | 0.6 |  | 62 | 17 | 9 |
| boardwalk | Margot | normal | 1.45 | 0.1 | 0.04 | 0.7 | 0.3 | 0.6 | 0.9 |  | 27 | 15 | 28 |
| boardwalk | Ruth | normal | 1.9 | 0 | 0.1 | 0.5 |  | 0.95 | 0.2 |  | 15 | 4 | 52 |
| boom | DeuceSeven | normal | 1.35 | 0.16 | 0.01 | 0.7 |  | 0.5 | 0.8 |  | 47 | 33 | 25 |
| boom | N0rthStar | hard | 1.25 | 0.22 | -0.01 | 0.8 | 0.2 | 0.6 | 1 |  | 40 | 21 | 33 |
| boom | Hanbit | normal | 1.5 | 0.08 | 0.04 | 0.6 |  | 0.6 | 0.7 |  | 45 | 29 | 25 |
| big-o | Kerry-Ann | easy | 1.3 | 0.15 | -0.03 | 0.7 |  | 0.5 | 0.3 | 0.08 | 55 | 18 | 18 |
| big-o | Gaz | normal | 1.35 | 0.14 | 0 | 0.75 | 0.25 | 0.6 | 0.9 |  | 29 | 15 | 50 |
| big-o | Mr. Okafor | normal | 1.7 | 0.04 | 0.07 | 0.6 |  | 0.8 | 0.4 |  | 28 | 10 | 53 |
| last-table | Mei Lin | hard | 1.5 | 0.08 | 0.04 | 0.65 |  | 0.6 | 1 |  | 31 | 19 | 39 |
| last-table | Victor | normal | 1.3 | 0.2 | 0 | 0.75 | 0.25 | 0.5 | 0.7 | 0.1 | 45 | 27 | 23 |
| last-table | Rafael | easy | 1.2 | 0.22 | 0.05 | 0.75 |  | 0.3 | 0.2 | 0.1 | 49 | 20 | 10 |
| kitchen-table | Priya | easy | 1.2 | 0.22 | -0.06 | 0.7 |  | 0.3 | 0.2 |  | 41 | 23 | 27 |
| kitchen-table | Marcus | normal | 1.45 | 0.1 | 0.03 | 0.65 | 0.3 | 0.6 | 0.7 | 0.08 | 33 | 18 | 36 |
| kitchen-table | Dee | easy | 1.35 | 0.18 | -0.02 | 0.6 |  | 0.45 | 0.3 |  | 57 | 18 | 21 |

Levels: 16 Easy, 24 Normal, 2 Hard (N0rthStar and Mei Lin). Part One has two Easy rivals at every table (one in the finale). An Easy rival bets and raises less than the same numbers did on the old bot, because RSDP's Easy only raises its best hands: Silas, Roland, Pike and Lacroix are still the loudest at their tables, but they are loose callers who bluff rather than raisers.

Stand-ins in your seat, in betting units won per 100 hands (negative means the rivals beat them):

| Chapter | station | maniac | aggro | teacher |
| --- | --- | --- | --- | --- |
| riverboat | -50 | -1203 | -355 | -32 |
| painted-deck | -192 | -342 | -616 | 73 |
| north-road | -126 | -2110 | -444 | 20 |
| camp | -216 | -194 (over 2,400 hands; all-in play swings widely, and one 300-hand run came out +34) | -430 | 20 |
| last-hand | -105 | -415 | -625 | 86 |
| gaming-house | -77 | -1348 | -556 | -14 |
| back-room | -184 | -318 | -170 | 16 |
| desert-classic | -309 | -57 | -154 | 25 |
| cercle | -282 | -309 | -277 | -12 |
| boardwalk | -85 | -87 | -46 | 10 |
| boom | -225 | -149 | -131 | 13 |
| big-o | -109 | -48 | -36 | 0 |
| last-table | -101 | -115 | -304 | -15 |
| kitchen-table | -103 | -754 | -206 | -18 |

The teacher follows the hints (RSDP's coach, steadied for beginners). Compared with the old bots (2026-11-20), a player who only calls loses more slowly in most chapters (the riverboat 50 a hundred hands against 82, the gaming house 77 against 353), so the short chapters are no quicker to bust a beginner than before.
