# History sources

Every history fact the game states (chapter intros, "From the history book" notes, rules cards, and the outline's history notes) was checked against sources on 2026-11-20. This page lists each claim, what the sources say, and where the game text was corrected.

How to use it: when you add or change history text in a chapter file (`src/chapters/*.ts`) or a rules card (`src/games/catalog.ts`), add the claim here with a source. Prefer David Parlett's histories (pagat.com, parlettgames.uk), The World of Playing Cards (wopc.co.uk) and Wikipedia articles with citations. If a fact can't be sourced, soften it or cut it.

Verdicts: **OK** (sources agree), **Fixed** (the game text was wrong or too strong and has been corrected), **Story** (needed a story decision; see [DECISIONS.md](DECISIONS.md)).

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
| 3, The North Road | Brag, 1763, Great North Road | Yes: printed rules from 1721 and in Hoyle, 1751 [W-Brag]. The chapter plays the 1700s rules: see "Period rules". |
| 4, The Camp | Five-card stud, 1863, Chattanooga | Yes, just: stud first appears in print in 1864 and was much played by soldiers [P1][W-Stud]. |
| 5, The Last Hand | Five-card draw, 1876, Deadwood | Yes: draw is in print from 1850; Hickok was shot at poker there that August [P1][W-Hickok]. |
| Bonus, The Gaming House | Poque, 1817, New Orleans | Yes: Parlett places poker's birth in New Orleans between about 1810 and 1825 [P1]. |
| 6, The Back Room | Seven-card stud and Razz, 1926, Chicago | Yes: Razz since the start of the 1900s; seven-card stud followed five-card stud [W-Razz][W-Stud]. Prohibition ran 1920 to 1933 [W-Prohibition]. |
| 7, The Desert Classic | Limit and no-limit Hold'em, 1972, Las Vegas | Yes: Hold'em in Vegas from 1963, championship from 1970 [W-Holdem]. |
| 8, The Cercle | PLO and Omaha Hi-Lo, 1992, Paris | Yes (already sourced in the outline). |
| 9, The Boardwalk | Stud Hi-Lo, 1995, Atlantic City | Yes, after the fix: it was set in 1985, but poker was banned in Atlantic City casinos until June 25, 1993 [AC1][AC2]. Moved to 1995, when stud ruled its poker rooms [AC2]. |
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
| Rules card rankings | **Fixed** (2026-11-21) | The card used modern three-card brag (prial of threes best, runs over flushes). It now gives the 1700s game: pair royal, pair, high card, with braggers. See "Period rules". |

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
| Draw up to three cards (four with an ace) | **Fixed** (2026-11-21) | A modern house rule. The game now lets you draw up to five, as in 1850 [PN-Draw]. See "Period rules". |

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

### Chapter 8, The Cercle (1992)

Already sourced in the outline (Omaha at a downtown Las Vegas casino in the 1980s; PLO popular in Europe). Omaha Hi-Lo is the O in HORSE [W-HORSE]. OK.

### Chapter 9, The Boardwalk (1995)

| Claim | Verdict | Sources |
| --- | --- | --- |
| Casinos opened in Atlantic City in 1978, "and its poker rooms followed" (chapter set in 1985) | **Fixed** (story moved) | Resorts opened in 1978, but "for the first 15 years of legal casinos, the game was banned by state law"; the first legal hand was dealt June 25, 1993 [AC1][AC2]. A 1985 casino poker room can't have existed, so John moved the chapter to 1995 and after Paris. The history note now says poker was banned until 1993. |
| Stud was the game of East Coast poker rooms | OK, for 1993 to 2003 | "During Atlantic City's first ten years (1993-2003), Seven-Card Stud was the most popular poker game by a wide margin" [AC2]. |
| When eight-or-better appeared is not recorded | OK | No source found gives a date. |

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

## Period rules, game by game

Added 2026-11-21, when John asked that every game be played by the rules of the year its chapter is set in. For each game: what the game now does, what the sources say, and how sure that is. **Sure** means a source read for this pass says it. **Best pick** means the sources are thin or silent and the rule is the best-supported choice; these are the ones to revisit if a better source turns up. Sources that could not be opened are named at the end.

### Primero, 1543 (chapter 2)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| 40 cards; dealt two and two with a wager after each; card points 7=21, 6=18, ace=16, 5=15, 4=14, 3=13, 2=12, courts 10; hands chorus, fluxus, supremus (55), primero, numerus | Sure, as far as it goes | No rule book survives, only descriptions that disagree [W-Primero][pagat Primero]. These points are common to them. |
| One change of up to two cards | Best pick | The descriptions have players draw or stand turn by turn, with discard limits that vary [W-Primero]. One change of two is our simplification. |
| Table stakes: wager any part of your "rest" | Best pick | No limit is recorded. The stake a player had on the table was the "rest", and "to set up one's rest" (wager all of it) comes from this game [W-Primero]. |

### Brag, 1763 (chapter 3)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| Only pair royal and pair count, aces high | Sure | "The pair-royal (three of a kind) and pair were still the only ones recognized" [P1]; runs and flushes are not attested for the period [W-Brag][pagat Brag]. |
| Braggers: knave of clubs and nine of diamonds, wild | Sure for the knave of clubs; best pick for the nine | The jack of clubs first (1721), the nine of diamonds added later; Hoyle (1751) gives powers to "certain" knaves and nines [W-Brag]. The ace of diamonds as a third bragger is not documented, so it is not wild here. |
| A natural hand beats the same hand made with a bragger | Sure | [pagat Brag][W-Brag]. |
| One round: pass or brag, and the others match or give up | Sure in outline | From the eldest hand each passes or says "I brag"; the brag is matched or raised until one gives way or "sees" [W-Brag][pagat Brag]. |
| No blind betting | Sure | Blind betting is not established for the 1700s [W-Brag]. It was on the old rules card; it has been taken off. |
| Table stakes | Best pick | No limit is recorded for the period. |
| Equal hands split the pot | Best pick (not period) | In the old game the player who called the see loses a tie [pagat Brag]. The engine splits ties, and they are rare. |
| Only the brag is played | Stated on the card | Three-stake Brag also paid the best card turned up and the hand nearest thirty-one [W-Brag]. Hoyle (1751) describes a single-stake Brag, which is what the chapter plays. |

### Poque, 1817 (bonus chapter)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| 32 cards, up to six players | Sure | "A tripartite game played by up to six players with a 32-card pack" [P1]. |
| Only sets count: fours, threes, a pair | Sure | Parlett tables Poque's hands as fours, threes and pair [P1]. Two pairs and the full house appear with 20-card poker [P1]. The game counted two pairs and full houses until 2026-11-21. |
| Five cards each, one betting round, table stakes | Best pick | The details of Poque are not recorded [P2]. "Je poque d'un jeton" (I bet one unit) is the only betting recorded [P1]. |
| Only the vying part is played | Stated on the card | Poque, like Poch, had three parts [P1][pagat Poch]. |

### Straight poker, 1836 (chapter 1)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| 20 cards, four players, five each, no draw; pair, two pairs, triplets, full, fours | Sure | [P1][P2]. |
| Everyone antes | Best pick | Cowell's account (1829) has the dealer "make the game" with an ante [P2]; who pays it is not clear. |
| Table stakes, no limit | Best pick | The early accounts state no limit [P1][P2]. Pot-limit, which the chapter used until 2026-11-21, is a 1900s idea. |

### Five-card stud, 1863 (chapter 4)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| One card down, the rest up | Sure | *The American Hoyle*, 1864: "the first dealt as usual, face down, all the others face up" [P2]. |
| No bring-in; the best hand showing opens and may check | Sure that there was no bring-in; best pick that the opener may check | "Traditionally, each betting round is begun by the player with the best hand showing"; the low-card bring-in "is now the normal rule in formal games hosted by American casinos" [pagat 5stud]. With no bring-in the high card "may check" [W-5Stud]. |
| Everyone antes | Best pick | The 1864 book says stud follows "the same laws, and mode of betting" as poker generally [P2]. |
| Straight below three of a kind; no straight flush | Sure for 1864 | The 1864 list runs "one pair, two pairs, straight sequence or rotation, triplets, flush, full house, fours" [P1]. The same book says straights "are played in some localities" and that some experts urged the straight flush [PN-Draw]. |
| Table stakes | Best pick | No limit is given for 1860s stud; one writer says there were generally none beyond table stakes [PN-Stud], without a source. The fixed limit with a four-bet cap, used until 2026-11-21, is a modern card-room structure. |

### Five-card draw, 1876 (chapter 5)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| Draw up to five cards | Sure | Bohn's handbook, 1850: "as many cards as he may wish, not exceeding five" [PN-Draw]. An 1883 pamphlet calls drawing five a beginner's mistake, so it was allowed [UG]. |
| No jack pots | Sure | "An innovation of a late date" in 1883 [UG]; first in print in 1875 [P1]. |
| Straights and straight flush count | Best pick | Optional in 1864 [PN-Draw]; the 1883 pamphlet treats both as part of the current game [UG]. Their exact rank in 1876 was not checked. |
| The age (left of the dealer) antes blind; double the ante to come in; the age makes good last | Best pick | A blind by the player left of the dealer, with the next bet at least double it, is in the 1845 Hoyle as an option, and "age" is the 1864 word for that player [PN-Draw]. That this was the standard form by the 1870s is from the rule books of the 1870s to 1890s (the 1875 *American Hoyle*, Schenck 1880, Foster 1897), which could not be opened for this pass. The 1883 pamphlet shows jack pots as the game where "all alike" ante, which implies the plain game was not [UG]. |
| After the draw the player left of the age speaks first, and the age last | Best pick | Same rule books; not read for this pass. |
| A limit agreed by the table on each bet or raise; no cap on raises | Best pick | Same rule books; not read for this pass. The size (ten times the ante) is ours. |
| Checking after the draw is allowed | Best pick | Not found in any source read. |
| In the draw, the player left of the age is served first and the age last | Known difference | The dealer served the age first. The engine draws in betting order. |

### Seven Card Stud and Razz, 1926 (chapter 6)

| Rule in the game | How sure | Sources |
| --- | --- | --- |
| No bring-in: everyone antes, the best hand showing (Razz: the lowest) opens every round | Best pick | "In home games, using only an ante is typical"; with no bring-in "the first betting round begins with the player showing the highest-ranking up-card, who may check" [W-7Stud]; the bring-in is the casino rule [pagat 7stud]. No source read dates the bring-in. |
| Fixed limit, one size early and double later, four bets a round | Best pick | No source read gives a 1926 limit structure. |

### 1972 to today (chapters 7 to 12 and the epilogue)

Checked against the same sources as the era table above; no rule changes. Limit Hold'em then a no-limit tournament in 1972 [W-Holdem]; pot-limit Omaha in a Paris club in 1992; limit Stud Hi-Lo with an ante and bring-in in a 1995 casino room [AC2][pagat 7stud]; no-limit Hold'em, limit 2-7 Triple Draw and Badugi online in 2005; pot-limit five- and six-card Omaha in 2019; HORSE and the 8-Game as RSDP Live deals them. Everyone still in at the end shows their cards in every chapter, which is simpler than any period's showdown etiquette.

### The dealer's marker, chapter by chapter (2026-11-21)

John pointed out that the buck is out of place in many chapters: card rooms never used it. Each chapter now shows the marker its room and year would have had (`dealerMarker` in the chapter file). **OK** = sourced; **Best pick** = no source found for that exact time and place, so the likeliest choice is used and flagged.

| Chapter | Marker shown | Verdict | Why |
| --- | --- | --- | --- |
| 1, The River (1836) | The buck (a knife) | **Best pick** | The buck is first in print in 1865, and an 1868 rule book has the dealer pass "the buck, i.e., a knife or key" to the player on his left [ADS-Buck][W-Button]. That is a generation after 1836; no source says what, if anything, marked the deal on an 1830s steamboat. Kept because the chapter's history note teaches "passing the buck" (and already says "By the 1850s"). |
| 2, The Painted Deck (1543) | None; the deal passes | **Best pick** | No source on Primero mentions a dealer's marker. |
| 3, The North Road (1763) | None; the deal passes | **Best pick** | No source on 1700s Brag mentions one. |
| Bonus, The Gaming House (1817) | None; the deal passes | **Best pick** | No source on Poque mentions one. |
| 4, The Camp (1863) | The buck (a knife) | **OK** | In print 1865; Twain recalls it as Virginia City slang of 1862 [W-Button][ADS-Buck]. |
| 5, The Last Hand (1876) | The buck (a knife) | **OK** | As above; the 1868 rule book describes passing it to the left [ADS-Buck]. |
| 6, The Back Room (1926) | The buck (a knife) | **Best pick** | An 1887 draw poker book still defines the buck as "any inanimate object, usually knife or pencil" [ADS-Buck]. Nothing found for a 1920s back room in particular; a players' game where the deal passes is assumed. |
| 7, The Desert Classic (1972) | A white "DEALER" button | **Best pick** | With a house dealer, a button marks the player who would deal in a home game [W-Button][PN-Button]. No source gives the year Las Vegas rooms took it up. |
| 8, The Cercle (1992) | "DEALER" button | **OK** | As above: a club with house dealers. |
| 9, The Boardwalk (1995) | None | **OK** | A casino's stud game has no button: the house dealer deals and the up cards decide who acts [PN-Button]. |
| 10, The Boom (2005) | A disc with a "D" on the site; a "DEALER" button at the live final table | **Best pick** | Poker sites draw the button as a small disc marked "D"; not sourced beyond common knowledge of the software. |
| 11, The Big O (2019) | "DEALER" button | **OK** | Flop games in a card room [PN-Button]. |
| 12, The Last Table (today) | "DEALER" button; nothing in the stud rounds | **OK** | [PN-Button]. In a real mixed game the button stays on the table, unmoved, through the stud rounds; here it is hidden for them (and still moves a seat each hand). |
| Epilogue, The Kitchen Table (today) | "DEALER" button | **Best pick** | A home game's chip set comes with one; not sourced. |

In the card rooms and on the poker site (chapters 7 to 12) the house deals [W-Button][PN-Button], so cards are dealt from the middle of the table, not from the seat with the button, and the rules sheet says so. No house dealer is painted. The kitchen table is a home game: the player with the button deals.

### Sources that could not be opened

Project Gutenberg's copies of *Round Games with Cards* (1892) and *Hoyle's Games Modernized*, and the 1911 *Encyclopaedia Britannica* article "Poker", refused automated reading on 2026-11-21. They, or the 1875 *American Hoyle* itself, are the place to confirm the "best pick" rows for 1876.

## Source list

- [P1] https://pagat.com/poker/history.html
- [P2] https://www.parlettgames.uk/histocs/poker.html
- [W-HP] https://en.wikipedia.org/wiki/History_of_poker
- [W-Button] https://en.wikipedia.org/wiki/Button_(poker)
- [Popik] https://barrypopik.com/blog/pass_the_buck
- [ADS-Buck] American Dialect Society list, 2015, quoting the OED's entry for the poker "buck" and its sources (1865, 1868, 1872, 1887): https://listserv.linguistlist.org/pipermail/ads-l/2015-January/135847.html
- [PN-Button] PokerNews, "Casino Poker for Beginners: The Deal With the Dealer Button" (2017): https://www.pokernews.com/strategy/casino-poker-for-beginners-07-the-dealer-button-29299.htm
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
- [pagat 5stud] https://www.pagat.com/poker/variants/5stud.html
- [pagat 7stud] https://www.pagat.com/poker/variants/7stud.html
- [W-5Stud] https://en.wikipedia.org/wiki/Five-card_stud
- [PN-Draw] Martin Harris, "Poker & Pop Culture" (Hoyle 1845, Bohn 1850, *The American Hoyle* 1864 quoted): https://www.pokernews.com/news/2016/06/poker-pop-culture-006-24966.htm
- [PN-Stud] https://www.pokernews.com/news/2016/06/poker-pop-culture-007-25030.htm
- [UG] *Talk of Uncle George to His Nephew About Draw Poker* (1883): https://www.gutenberg.org/ebooks/54590
