# History sources

Every history fact the game states (chapter intros, "From the history book" notes, rules cards, and the outline's history notes) was checked against sources on 2026-11-20. This page lists each claim, what the sources say, and where the game text was corrected.

How to use it: when you add or change history text in a chapter file (`src/chapters/*.ts`) or a rules card (`src/games/catalog.ts`), add the claim here with a source. Prefer David Parlett's histories (pagat.com, parlettgames.uk), The World of Playing Cards (wopc.co.uk) and Wikipedia articles with citations. If a fact can't be sourced, soften it or cut it.

Verdicts: **OK** (sources agree), **Fixed** (the game text was wrong or too strong and has been corrected), **Story** (needs a story decision; see [DECISIONS.md](DECISIONS.md)).

## Main sources

- [P1] David Parlett, *A History of Poker*: https://pagat.com/poker/history.html
- [P2] David Parlett, *Poker* (history): https://www.parlettgames.uk/histocs/poker.html
- [W-HP] Wikipedia, History of poker: https://en.wikipedia.org/wiki/History_of_poker

Every other source is in the list at the end.

## Era fit, chapter by chapter

| Chapter | Game, year, place | Fits? |
| --- | --- | --- |
| 1, The River | Straight poker (20 cards), 1836, Mississippi steamboat | Yes: the 20-card game is described in New Orleans in 1829 and on a steamboat in 1833 [P1][P2]. |
| 2, The Painted Deck | Primero, 1543, Kent | Yes: fashionable in Henry VIII's reign [W-Primero]. |
| 3, The North Road | Brag, 1763, Great North Road | Yes: printed rules from 1721 and in Hoyle, 1751 [W-Brag]. The chapter uses modern rankings and says so. |
| 4, The Camp | Five-card stud, 1863, Chattanooga | Yes, just: stud first appears in print in 1864 and was much played by soldiers [P1][W-Stud]. |
| 5, The Last Hand | Five-card draw, 1876, Deadwood | Yes: draw is in print from 1850; Hickok was shot at poker there that August [P1][W-Hickok]. |
| Bonus, The Gaming House | Poque, 1817, New Orleans | Yes: Parlett places poker's birth in New Orleans between about 1810 and 1825 [P1]. |
| 6, The Back Room | Seven-card stud and Razz, 1926, Chicago | Yes: Razz since the start of the 1900s; seven-card stud followed five-card stud [W-Razz][W-Stud]. Prohibition ran 1920 to 1933 [W-Prohibition]. |
| 7, The Desert Classic | Limit and no-limit Hold'em, 1972, Las Vegas | Yes: Hold'em in Vegas from 1963, championship from 1970 [W-Holdem]. |
| 8, The Boardwalk | Stud Hi-Lo, 1985, Atlantic City | **No.** Poker was banned in Atlantic City casinos until June 25, 1993 [AC1][AC2]. Needs a story decision. |
| 9, The Cercle | PLO and Omaha Hi-Lo, 1992, Paris | Yes (already sourced in the outline). |
| 10, The Boom | Online Hold'em, 2-7 Triple Draw, Badugi, 2005 | Yes [W-Moneymaker][W-Draw][pagat Badugi]. |
| 11, The Big O | 5- and 6-card Omaha, 2019, English Midlands | Yes (already sourced in the outline). |
| 12, The Last Table | HORSE and 8-Game, today, Macau | Yes [W-HORSE][W-Macau]. |
| Epilogue | Home-game extras, today | Not a history claim. |

## Claims checked

### Chapter 1, The River (1836)

| Claim in the game | Verdict | What the sources say |
| --- | --- | --- |
| Early players dealt only the 20 high cards; four players, five each, whole deck in play | OK | Green and Cowell describe 20 cards "evenly dealt amongst four players", five each, no draw [P1][P2]. |
| One betting round, no draw | OK | "There is no draw"; the draw later added "a second betting interval" [P2]. |
| Straights and flushes did not count yet; they arrived with the 52-card deck | **Fixed** | The 52-card pack came in between about 1830 and 1845 and gave rise to the flush; the straight was "as yet unknown" and is first listed in 1864 [P1][P2]. Text now says flushes came with the full pack and straights later. |
| A knife, the "buck", marked the dealer; "passing the buck" | **Fixed** (dated) | The buck was a knife with a buckhorn handle [W-Button]; "pass the buck" is in print by 1857 [Popik]. Text now says "By the 1850s", since that is later than 1836. |
| No corner indices on the cards | OK | First US indexed deck patented 1864 [WOPC]. |

### Chapter 2, The Painted Deck (1543)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Primero (primiera, primera) was fashionable in 1500s Europe and played at Henry VIII's court | OK | Popular across Europe in the 1500s [pagat Primero]; "one of the most fashionable games throughout the reigns of Henry VIII"; Shakespeare's *Henry VIII* has the king at primero with the Duke of Suffolk [W-Primero]. |
| Shakespeare has Falstaff lose at it | **Fixed** | Falstaff says "I never prospered since I forswore myself at primero" (*Merry Wives*) [W-Primero]. That is about swearing falsely, not simply losing; text now quotes the sense. |
| 40 cards; points 7=21, 6=18, A=16, 5=15, 4=14, 3=13, 2=12, courts 10; chorus, fluxus, supremus, primero, numerus | OK | [W-Primero][pagat Primero]. The rules card already calls the game a reconstruction. |
| Monasteries closed 1536 to 1541; Anselm lost his abbey "five years ago" (1538) | OK | [W-Dissolution]. |

### Chapter 3, The North Road (1763)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Brag grew out of the 1500s game post and pair | OK | Post and Pair "recorded as far back as 1528" [W-Brag]. |
| Described in 1700s English card books, "often with wild cards called braggers" | **Fixed** | Rules first printed in *The Compleat Gamester*, 1721, and in Hoyle, 1751. At first one bragger, the jack of clubs; the nine of diamonds was added later [W-Brag]. The ace of diamonds / jack of clubs / nine of diamonds trio in later books describes "an entirely fictitious form of Brag" [pagat Brag]. Text and outline corrected. |
| Three-card brag is still played in Britain | OK | "A popular British gambling game" [pagat Brag]. |
| Rules card rankings (prial 3-3-3 best, runs over flushes) | Noted | These are modern three-card brag rules. The rules card now says the 1700s game was scored differently. |

### Chapter 4, The Camp (1863)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Five-card stud appears in print around the Civil War | **Fixed** (made exact) | First appears in *The American Hoyle* of 1864 [P1][P2]; "first appeared during the American Civil War" [W-Stud]. |
| Soldiers on both sides carried poker across the country | **Fixed** (softened) | Sources say stud was "much played among soldiers on both sides" [W-Stud]; none says they spread poker nationally. |
| The straight and flush became standard around this time | **Fixed** | The flush is older (1830 to 1845); the straight is first listed in 1864 [P1]. Rules card note fixed the same way. |
| Corner indices appeared in the 1860s and 1870s | **Fixed** (made exact) | Saladee's patent, February 9, 1864, is believed to be the first American deck with corner indices; Dougherty's "Triplicates" 1875; indices became the norm over the following years [WOPC]. Text adds that the cards in this tent have none. |
| Intro: "November 23, 1863 ... Tomorrow, the army attacks" | **Fixed** | The battles for Chattanooga were November 23 to 25, 1863 [W-Chattanooga], so the night before the attack is November 22. |

### Chapter 5, The Last Hand (1876)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Draw poker was the dominant American game from the 1850s | **Fixed** (softened) | First printed mention is Bohn's handbook, 1850 [P2]; draw, stud and jackpots all appear in *The American Hoyle* of 1875 [P1]. No source found calling draw "dominant", so the text no longer says it. |
| Hickok shot in Deadwood on August 2, 1876, while playing poker | OK | Shot at Nuttal & Mann's Saloon No. 10 while playing poker; accounts differ on stud or draw [W-Hickok]. Text names the saloon. |
| Aces and eights, the dead man's hand | OK, with a caveat | "No one connected it to Hickok until the 1920s" [W-DMH]. Text says so. |
| Jackpots appeared around this time | OK (made exact) | First in print in the 1875 *American Hoyle*; jacks or better to open [P1][P2]. |
| Deadwood "three months old" | **Fixed** (softened) | Founded in 1876; text now says "only a few months old". |
| Draw up to three cards (four with an ace) | Noted | A modern house rule; gameplay, so not changed. See DECISIONS.md. |

### Bonus, The Gaming House (1817)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Poque, a French game related to German Pochen | OK | "The French version of Pochen" [P1][P2]; Poch / le Poque [pagat Poch]. |
| Played in Louisiana by French settlers | **Fixed** (made exact) | Poker "originated in the New Orleans some time between 1810 and 1825" [P1]. Text now says French speakers brought it to New Orleans. |
| 32-card pack; payout board | OK | Poque "played by up to six players with a 32-card pack" [P1]; "poque" names one of six staking containers [P2]; boards with pools [pagat Poch]. |
| Most likely source of the word "poker" | OK | "The French name was poque, pronounced poke" (Coffin, quoted in [P1]). |
| Two years after the Battle of New Orleans | OK | January 1815. |
| Élodie: the deck was "painted in England, two hundred years ago" | **Fixed** | 1543 to 1817 is 274 years; now "nearly three hundred years ago". |

### Chapter 6, The Back Room (1926)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Seven-card stud was a mainstay of American home games, and the main game of eastern casinos before Hold'em | OK | [W-7Stud]. |
| Razz grew up alongside it; start not recorded | OK | "Played since the start of the 20th century" [W-Razz]. |
| Prohibition, 1920 to 1933 | OK | [W-Prohibition]. |

### Chapter 7, The Desert Classic (1972)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Hold'em came from Texas to Las Vegas in the late 1960s | **Fixed** | First dealt in Las Vegas in 1963 (California Club); for several years the Golden Nugget was the only casino offering it [W-Holdem]; Texans such as Crandell Addington played it in Vegas in the late 1960s, when no-limit Hold'em "was still a bit of a novelty" [Addington]. |
| Tournaments grew up around it in the early 1970s | **Fixed** (made exact) | The championship began in 1970; from the next year its main event was no-limit Hold'em [W-Holdem]. |

### Chapter 8, The Boardwalk (1985)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Casinos opened in Atlantic City in 1978, "and its poker rooms followed" | **Story** | Resorts opened in 1978, but "for the first 15 years of legal casinos, the game was banned by state law"; the first legal hand was dealt June 25, 1993 [AC1][AC2]. A 1985 casino poker room can't have existed. Left unchanged until John decides (DECISIONS.md). |
| Stud was the game of East Coast poker rooms | OK, for 1993 to 2003 | "During Atlantic City's first ten years (1993-2003), Seven-Card Stud was the most popular poker game by a wide margin" [AC2]. |
| When eight-or-better appeared is not recorded | OK | No source found gives a date. |

### Chapter 9, The Cercle (1992)

Already sourced in the outline (Omaha at a downtown Las Vegas casino in the 1980s; PLO popular in Europe). Omaha Hi-Lo is the O in HORSE [W-HORSE]. OK.

### Chapter 10, The Boom (2005)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Online qualifiers went on to win the biggest live tournaments | OK | Moneymaker won the 2003 main event after an $86 online satellite; the "Moneymaker effect" [W-Moneymaker]. The story's "$5 qualifier" is the story's own detail. |
| 2-7 Triple Draw was a favourite of high-stakes players | **Fixed** (softened) | Triple draw "has gained some popularity among serious players"; the 2004 World Series had a 2-7 triple draw event [W-Draw]. No source for "high-stakes favourite". |
| Badugi, 1980s, Korea, US around 2004 | OK | Already sourced [pagat Badugi]. |
| The deck has been with the American Averys "for two hundred years" | **Fixed** | Since 1763: now "more than two hundred years". |

### Chapter 11, The Big O (2019)

Already sourced. Gaz's line "Two hundred years in America" fixed to "two hundred and fifty" (1763 to 2019).

### Chapter 12, The Last Table (today)

| Claim | Verdict | Sources |
| --- | --- | --- |
| HORSE became a championship event in the 2000s | OK | Debuted at the World Series in 2002; the $50,000 event in 2006 [W-HORSE]. |
| 8-Game adds 2-7 Triple Draw, NL Hold'em and PLO to HORSE | OK | [W-HORSE]. |
| Macau is one of the biggest gambling centres in the world | OK | Highest gambling revenue of any city; passed the Las Vegas Strip in 2007 [W-Macau]. |

## Source list

- [P1] https://pagat.com/poker/history.html
- [P2] https://www.parlettgames.uk/histocs/poker.html
- [W-HP] https://en.wikipedia.org/wiki/History_of_poker
- [W-Button] https://en.wikipedia.org/wiki/Button_(poker)
- [Popik] https://barrypopik.com/blog/pass_the_buck
- [WOPC] https://www.wopc.co.uk/playing-cards/corner-indices
- [W-Primero] https://en.wikipedia.org/wiki/Primero
- [pagat Primero] https://www.pagat.com/vying/primero.html
- [W-Dissolution] https://en.wikipedia.org/wiki/Dissolution_of_the_monasteries
- [W-Brag] https://en.wikipedia.org/wiki/Brag_(card_game)
- [pagat Brag] https://www.pagat.com/vying/brag.html
- [W-Stud] https://en.wikipedia.org/wiki/Stud_poker
- [W-7Stud] https://en.wikipedia.org/wiki/Seven-card_stud
- [W-Razz] https://en.wikipedia.org/wiki/Razz_(poker)
- [W-Chattanooga] https://en.wikipedia.org/wiki/Battle_of_Chattanooga
- [W-Hickok] https://en.wikipedia.org/wiki/Wild_Bill_Hickok
- [W-DMH] https://en.wikipedia.org/wiki/Dead_man%27s_hand
- [pagat Poch] https://www.pagat.com/stops/poch.html
- [W-Prohibition] https://en.wikipedia.org/wiki/Prohibition_in_the_United_States
- [W-Holdem] https://en.wikipedia.org/wiki/Texas_hold_%27em
- [Addington] https://www.pokernews.com/news/2009/03/poker-vaults-crandell-addington-part-1-1258.htm
- [AC1] https://shorelocalnews.com/poker-marks-its-30th-anniversary-in-atlantic-city
- [AC2] https://www.nolandalla.com/early-years-atlantic-city-poker-scene/
- [W-Moneymaker] https://en.wikipedia.org/wiki/Chris_Moneymaker
- [W-Draw] https://en.wikipedia.org/wiki/Draw_poker
- [pagat Badugi] https://pagat.com/poker/variants/badugi.html
- [W-HORSE] https://en.wikipedia.org/wiki/HORSE_(poker)
- [W-Macau] https://en.wikipedia.org/wiki/Gambling_in_Macau
