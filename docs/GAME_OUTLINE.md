# Historical Poker: Full Game Outline

2026-11-19 · John Colter

## Overview

Historical Poker is a single-player story game in the browser: you follow one heirloom deck of cards through 330 years of card tables, from a Tudor hall in 1543 to a Deadwood saloon in 1876 and on to the present day, and play each era's real game against painted rival characters. It opens on a Mississippi steamboat in 1836, the first game actually called poker, and reaches back and forward from there.

- **Platform:** static website, played in any modern browser, hosted free on GitHub Pages. No server, no accounts; progress saves in the browser.
- **Engine:** a copy of the RSDP Live poker engine (pure TypeScript), extended with the historical games. RSDP Live itself is never changed.
- **Length:** Part One has five main chapters plus one bonus chapter, roughly 20 to 40 minutes each, and is the first release. Part Two adds seven chapters and an epilogue, from 1926 to today, in a later release.
- **Audience:** casual players and history fans. Every game is taught in play, so no poker knowledge is needed. By the end of Part Two the story has taught every game RSDP Live offers, so friends can learn a game here before playing it for money.
- **Feel:** a painted, narrative card game, not a poker client. People at the table, dialogue in the lower third, controls that look like objects on the table.
- **Credit:** a small "Powered by RSDP Live" mark with the RSDP Live chip logo, linking to the live site.

This outline is the source of truth for the game's design. History facts were checked against sources on 2026-11-20; each claim, its source and any correction is in [HISTORY_SOURCES.md](HISTORY_SOURCES.md).

## Premise and story

The story follows **the Ashcombe deck**, a hand-painted deck made in 1543, as it passes between owners and the game played with it changes. The player wins it back on a steamboat in 1836, learns its past in flashbacks, then carries it forward to the Old West.

### The frame: 1836

You play **Kit Avery**, a young traveler on the steamboat *Magnolia Queen* (fictional), bound downriver from Natchez to New Orleans. Kit's late father lost the family's old deck at cards to the gambler **Silas Crane**. Kit sits down at Silas's table to win it back. The player is never shown on screen: everyone talks to "you", and Kit is a name, not a face, so any player fits the role.

### The shape of the story

1. **Act I, the riverboat (1836).** Kit wins the deck back from Silas. Inside its worn leather case is an inscription, "M.A. 1543", and Delphine Arceneaux, who knows its history, starts to tell it.
1. **Act II, flashbacks.** Each flashback is a chapter played as an earlier owner of the deck: a card-painter's daughter at Ashcombe Hall in 1543, then a coach guard at a coaching inn in 1763. They explain how the deck was made, how it crossed to England's roads and then to America, and why people say "the deck never loses".
1. **Act III, forward.** Kit's line carries the deck on: Kit's son at a Union army camp in 1863, then Kit's granddaughter in a Deadwood saloon in 1876, where a Crane descendant wants the deck back. The finale settles the feud.
1. **Bonus, New Orleans (1817).** Once the main story is done, Delphine's own story unlocks: the night the deck came to her aunt's gaming house, played as Poque, the French game that probably gave poker its name.

### The thread through every chapter

- **The legend:** "Whoever holds the Ashcombe deck never loses." Each chapter shows the truth: the deck's owners won by reading people, not by luck. That is also what the player learns, through the tell system (see Progression).
- **The keepsake:** every chapter's rival, once beaten, adds a painted card to the deck's case. The case fills up across the game and is the chapter select screen.
- **The Cranes:** Silas is the first villain, and a Crane returns in the finale, so the story starts and ends with the same feud.
- **Real history, invented people:** every main character is fictional. Real places, events and rules appear as backdrop and in short history notes. Whether real figures make cameos (for example Wild Bill Hickok in Deadwood) is an open question.

## Chapters

Five main chapters and one bonus, listed in the order the player meets them. Each chapter has its own era, game, three opponents at the table, and its own look.

| # | Chapter | Year | Place | Game | Rival | You play as |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | The River | 1836 | Steamboat *Magnolia Queen*, Mississippi | 20-card straight poker | Silas Crane | Kit Avery |
| 2 | The Painted Deck | 1543 | Ashcombe Hall, Kent, England | Primero | Lady Margery Ashcombe | Nan Avery, a card-painter's daughter |
| 3 | The North Road | 1763 | The Pewter Lamb coaching inn, Great North Road, England | Brag | Captain Josiah Pike | Will Avery, a stagecoach guard |
| 4 | The Camp | 1863 | Union army camp near Chattanooga, Tennessee | Five-card stud | Sergeant Amos Reed | Sam Avery, Kit's son |
| 5 | The Last Hand | 1876 | Lucky Nugget saloon, Deadwood, Dakota Territory | Five-card draw | Ruby Calloway | Clara Avery, Kit's granddaughter |
| Bonus | The Gaming House | 1817 | Maison Fontaine, New Orleans | Poque (reconstructed) | Madame Élodie Fontaine | Young Delphine Arceneaux |

Every chapter below lists the same things: setting, rules as the game will run them, the cast and how each bot plays, story beats, history notes, and the art John needs to make. Each bot has a **tell**, a small animation that hints at its hand; "reliability" is how often the tell tells the truth.

### Chapter 1: The River (1836), straight poker

**Setting.** Night on the steamboat *Magnolia Queen*, between Natchez and New Orleans. A wood-paneled card room, brass portholes onto a moonlit river, a hanging oil lamp, worn green felt with a chipped gilt rim. Stakes are silver dollars, and a buckhorn knife marks the dealer.

**Rules.**

- Deck: 20 cards, ace, king, queen, jack and ten of each suit. No corner indices on the cards (they came later).
- Four players. Everyone antes, then all 20 cards are dealt, five each, face down.
- One betting round, starting left of the dealer. No draw. Then showdown.
- Hands, best first: four of a kind, full house, three of a kind, two pair, one pair, high card. No straights or flushes yet.
- Since every card is dealt, a player can work out what others might hold from their own five. The tutorial points this out.
- Betting limit (no limit with table stakes, or a cap on raises) is a tuning decision for the build.

**Cast.**

| Character | Role | How the bot plays | Tell |
| --- | --- | --- | --- |
| "Gentleman" Silas Crane | Rival, a riverboat card sharp | Loose and aggressive: plays many hands, bets big to push others out, bluffs often. Cheats once per sitting by dealing seconds. | Strokes his mustache when bluffing (about 70% reliable) |
| Mrs. Delphine Arceneaux | A widow from Louisiana who knows the deck's story | Tricky: checks strong hands to trap, then raises; bluffs rarely. Helps the player in dialogue. | Snaps her fan shut, but she fakes it half the time |
| Ezra Hollis | A nervous cotton agent from New Orleans | Tight and passive: plays only good hands, calls rather than raises, folds to big bets | Wipes his brow when weak (about 90% reliable, the tutorial tell) |

**Story beats.**

1. Title card, then Kit boards. Delphine introduces the table and Silas.
1. Tutorial hand: Delphine explains the 20-card deck and the rankings; the game points out Ezra's sweat.
1. After Kit wins a few pots, Silas puts the old deck on the table as a stake.
1. Silas deals seconds. If the player catches his tell at the right moment, Delphine calls him out and he has to play straight; if not, he wins that hand.
1. Ezra goes broke, or bows out, with a comic exit.
1. Final showdown, heads-up with Silas for the deck.
1. Win: Kit opens the case and finds "M.A. 1543" inside. Delphine begins the story, and the first flashback unlocks. Lose: Silas pockets the stake, Delphine gives a lesson, and the player can retry.

**History notes (checked).** The earliest accounts of "poker" (Joseph Cowell, in New Orleans in 1829; Jonathan Green, on a steamboat bound for New Orleans in 1833) describe this 20-card game for four players, five cards each, with no draw. Professional riverboat gamblers worked the boats in this era. Between about 1830 and 1845 the full 52-card deck took over, so more people could play, and it brought in the flush; the straight came later (listed in 1864). A knife with a buckhorn handle, the "buck", marked the dealer, which is where "passing the buck" comes from; the phrase is in print by 1857.

**Art needed.** Background (done), Silas (done), Delphine and Ezra seated on green (done), period card faces with no corner numbers, silver dollars, the buckhorn knife, a chapter title card (done).

### Chapter 2: The Painted Deck (1543), Primero

**Setting.** Twelfth Night, the end of the Christmas revels, in the great hall of Ashcombe Hall in Kent. Candlelight, an oak trestle table, tapestries and a roaring hearth. Stakes are silver shillings and groats.

**Story.** Nan Avery's father, a card painter, made a hand-painted deck for Lady Margery Ashcombe. She refuses to pay, and offers instead to play for it. Nan takes the seat.

**Rules (our playable reconstruction; old sources disagree).**

- Deck: 40 cards (no eights, nines or tens), four suits.
- Card points: seven 21, six 18, ace 16, five 15, four 14, three 13, two 12, face cards 10.
- Everyone antes. Deal two cards each, betting round. Deal two more, betting round. Each player may then swap up to two cards once, then a last betting round and showdown.
- Hands, best first: **chorus** (four of a kind), **fluxus** (all four cards one suit), **supremus** (seven, six and ace of one suit), **primero** (one card of each suit), then **numerus** (the most points in one suit). Ties within a rank go to the higher point total.
- The game says plainly that this is a reconstruction.

**Cast.**

| Character | Role | How the bot plays | Tell |
| --- | --- | --- | --- |
| Lady Margery Ashcombe | Rival, a courtier who never shows her hand | Tight and aggressive: plays few hands and bets them hard; bluffs rarely but at the best moment | Turns her signet ring when strong (about 60% reliable) |
| Sir Roland Fettiplace | A reckless young knight | Very loose and aggressive: bets on anything, easy to trap | Drains his cup before a bluff |
| Brother Anselm | A former monk, turned out when the monasteries closed, now the hall's steward | Careful: counts points, calls with good odds, rarely raises | Mutters a prayer when weak |

**Story beats.** The feast and Lady Margery's challenge. Sir Roland wagers and loses his horse. Anselm talks about the abbey he lost. Final showdown with Margery. Win: she pays, and has the deck's leather case stamped with her initials, "M.A. 1543", as a mark of respect. Her parting quip, that whoever holds it never loses, starts the legend.

**History notes (checked).** Primero (Italian *primiera*, Spanish *primera*) was popular across Europe in the 1500s and was one of the fashionable games of Henry VIII's reign. Shakespeare mentions it, in *Henry VIII* (the king at primero with the Duke of Suffolk) and *The Merry Wives of Windsor* (Falstaff). It is played with 40 cards; its hands, including a flush and four of a kind, foreshadow poker's. Henry VIII closed England's monasteries between 1536 and 1541.

**Art needed.** Great hall background (done), Margery, Roland and Anselm seated on green (done), Tudor-style hand-painted card faces, shillings, a title card (done).

### Chapter 3: The North Road (1763), Brag

**Setting.** A snowbound coaching inn, the Pewter Lamb, on the Great North Road. Low beams, a pewter-lit taproom, frost on the windows, a fire. Stakes are shillings and guineas.

**Story.** The deck has passed down the Avery line. Will Avery, guard on the York stagecoach, is stuck at the inn by snow. Captain Josiah Pike wants the deck as a lucky charm for his voyage to the American colonies, and a well-dressed stranger seems far too interested in the coach's strongbox.

**Rules (modern three-card brag, with an optional period rule).**

- Deck: 52 cards. Everyone antes and gets three cards face down.
- Players may bet **blind** (without looking, at half the stake) or **seen** (after looking, at full stake).
- Betting goes round until only two players remain; then either may pay to **see** the other, and the better hand wins.
- Hands, best first: **prial** (three of a kind; three threes is best, then aces down), running flush (straight flush), run (straight), flush, pair, high card.
- Optional period rule, "braggers": the jack of clubs is wild, as in the first printed rules (1721), with the nine of diamonds added later. (Checked: the often-repeated trio of ace of diamonds, jack of clubs and nine of diamonds comes from later books, and Parlett finds no evidence anyone played that way.)

**Cast.**

| Character | Role | How the bot plays | Tell |
| --- | --- | --- | --- |
| Captain Josiah Pike | Rival, a retired sea captain | Loose and aggressive: over-bets, bluffs loudly, often plays blind | The louder his boast, the weaker his hand (about 75% reliable) |
| Hannah Pell | The innkeeper | Tight: rarely plays, but bets hard when she does | Polishes a tankard when strong |
| Jack Sorrel | A dandy gentleman, secretly a highwayman | Tricky: mixes blind and seen play to confuse, bluffs a lot late in a sitting | Touches his coat pocket, where the pistol is, when weak |

**Story beats.** The snowstorm strands the coach. Pike shows off and challenges Will. Hannah warns Will about Sorrel. Sorrel is unmasked mid-sitting, and the strongbox becomes a stake. Final showdown with Pike. Win: Pike pays Will's passage to America, and the deck crosses the Atlantic with the Averys.

**History notes (checked).** Brag descends from post and pair, recorded from 1528. Its rules were printed in *The Compleat Gamester* (1721) and by Hoyle (1751), with a wild "bragger", the jack of clubs. Betting blind, bluffing and "bragging" about a hand are all ideas poker kept. Three-card brag is still a popular British gambling game. The chapter plays modern three-card brag rankings (prials, runs), not the 1700s scoring; the rules card says so.

**Art needed.** Inn taproom background (done), Pike, Hannah and Sorrel seated on green (done), Georgian-style cards, coins, a title card (done).

### Chapter 4: The Camp (1863), five-card stud

**Setting.** A Union army camp near Chattanooga, Tennessee, in November 1863, the night before battle. A lantern-lit tent, an upturned hardtack crate as a table, rain on the canvas. Stakes are greenbacks and coins.

**Story.** Kit's son Sam Avery, a corporal, carries the deck. Payday comes the night before the army attacks. Sergeant Amos Reed wants the deck as a lucky charm, and Sam has to decide what it is worth to him.

**Rules.**

- Deck: 52 cards. Everyone antes.
- Each player gets one card face down and one face up, then a betting round.
- Three more face-up cards follow, one at a time, each with a betting round (four rounds in all). The best hand showing acts first.
- Full rankings, as today: straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair, high card.
- Mostly configuration of the engine's existing stud support.

**Cast.**

| Character | Role | How the bot plays | Tell |
| --- | --- | --- | --- |
| Sergeant Amos Reed | Rival, a veteran | Very tight: folds almost everything, then bets big hands hard; when he bets, believe him | Stops chewing tobacco when strong (about 80% reliable) |
| Private Toby Finch | A teenage drummer boy | Loose and passive: calls far too much, hard to bluff | Grins at every card, good or bad (unreliable) |
| Hattie Bloom | The camp sutler (licensed trader) | Clever: bets when her face-up cards look scary, whatever she holds | Taps her pencil when bluffing |

**Story beats.** Payday and the card game. Toby loses his month's pay and Sam has a chance to give it back. Reed proposes the deck as a stake. Late in the night, orders arrive for the morning. Final showdown with Reed. Win: Sam keeps the deck and writes a letter home that becomes the chapter's ending. A quiet, more serious chapter.

**History notes (checked).** Five-card stud first appears in print in *The American Hoyle* of 1864 and was much played by soldiers on both sides. The flush had come in with the 52-card deck; the straight is first listed in that same 1864 book. The first American cards with corner indices were patented in February 1864 and caught on in the 1870s and 1880s, so the cards in this 1863 camp have none. The battles for Chattanooga ran from November 23 to 25, 1863, so the chapter opens on November 22.

**Art needed.** Tent background (done), Reed, Toby and Hattie seated on green (done), 1860s cards, greenbacks and coins, a title card (done).

### Chapter 5: The Last Hand (1876), five-card draw, the finale

**Setting.** Deadwood, Dakota Territory, in August 1876, at the height of the gold rush. The Lucky Nugget saloon: rough plank walls, dusty sunlight through grimy windows, oil lamps at night. Stakes are coins and pinches of gold dust.

**Story.** Clara Avery, Kit's granddaughter, has the deck. Jasper Crane, Silas's grandson, has come to take back "the Crane deck", and saloon owner Ruby Calloway agrees to host the game that settles it. In the background, the town is talking about a famous man shot at a card table down the street.

**Rules.**

- Deck: 52 cards. Everyone antes and gets five cards face down. Betting round.
- Each player may discard and draw up to three cards (four if they keep an ace). Second betting round, then showdown.
- Full rankings, as in chapter 4.
- Optional period rule, "jackpots": you need a pair of jacks or better to open the betting.
- Mostly configuration of the engine's existing draw support.

**Cast.**

| Character | Role | How the bot plays | Tell |
| --- | --- | --- | --- |
| Ruby Calloway | Final rival, owner of the Lucky Nugget and the best player in the territory | Adaptive: watches how the player bets across the sitting and adjusts; bluffs players who fold too much, value-bets players who call too much | None reliable; she reads yours instead |
| Jasper Crane | Silas's grandson | Loose and aggressive, and cheats like his grandfather | The same mustache stroke as Silas, a callback to chapter 1 |
| "Doc" Abel Whitcomb | A prospector | Loose and passive: unpredictable, bets gold dust on hunches | Shakes his dust pouch when he has a hand |

**Story beats.** Jasper arrives and makes his claim. Ruby sets the terms. Doc goes broke and tells a tall tale on his way out. Jasper's cheat is caught (the player has learned the family tell). Final showdown with Ruby, who has quietly been the real opponent all along. Win: the feud ends, Ruby toasts the deck, and an epilogue shows the case full of keepsake cards, "The Ashcombe Deck, 1543 to 1876".

**History notes (checked).** Draw poker is first described in print in 1850, and *The American Hoyle* of 1875 lists draw, stud and jackpots (jacks or better to open). On August 2, 1876, Wild Bill Hickok was shot at a poker table in Nuttal & Mann's Saloon No. 10, Deadwood; accounts differ on whether the game was stud or draw. The hand he is said to have held, aces and eights, is known as the dead man's hand, though nobody tied it to him until the 1920s. Note: the chapter's draw limit (three cards, four with an ace) is a modern house rule; in 1876 players could draw up to five.

**Art needed.** Saloon background (done), Ruby, Jasper and Doc seated on green (Doc done), 1870s indexed cards, coins and gold dust, a title card, an epilogue painting of the full case.

### Bonus: The Gaming House (1817), Poque

**Setting.** Maison Fontaine, a gaming house in New Orleans's French Quarter, two years after the Battle of New Orleans. Candlelight, iron balconies, warm night air. Stakes are Spanish silver and banknotes.

**Story.** Unlocks after the finale. It answers how Delphine knows the deck: as a young woman in her aunt's gaming house, she watched Kit's grandfather Henri Avery play for it, and sat in herself.

**Rules (a proposal; needs research before building).**

- Deck: 32 cards, seven to ace, the French piquet deck.
- Five cards each, a betting round where players bet on and bluff about pairs, triplets and fours, then showdown.
- Period touch: a payout board with compartments, as in the related German game Poch.
- The game will say this is a reconstruction. A short research task should settle the rules first.

**Cast.**

| Character | Role | How the bot plays | Tell |
| --- | --- | --- | --- |
| Madame Élodie Fontaine | Rival, owner of the house, Delphine's aunt | Reads every tell: punishes repeated patterns in the player's betting | Fans her cards slowly when strong |
| Henri Avery | Kit's grandfather, a friendly rival | Solid and fair, a mentor at the table | Hums when happy with his hand |
| Jean-Baptiste Lacroix | A privateer flush with prize money | Loose and aggressive, bets wildly | Laughs too loudly when bluffing |

**History notes (checked).** Poque, the French form of the German Pochen, was played by up to six players with a 32-card pack, and staked into a board of six pools ("poque" names one of them). Parlett places poker's birth in New Orleans between about 1810 and 1825, and poque, pronounced "poke", is the most likely source of the word. Its exact rules are poorly recorded.

**Art needed.** Gaming-house background, Élodie, Henri, Lacroix and young Delphine on green, piquet cards, a payout board, a title card.

## Part Two: to the present day (a later release)

Part Two carries the deck from 1926 to today and teaches every game RSDP Live offers, each one inside the story, in a place and time where that game was really played. It has seven chapters and a short epilogue, built after Part One ships. The engine already runs all of these games, so the main work is art and story.

| # | Chapter | Year | Place | Games, in the order taught | Rival | You play as |
| --- | --- | --- | --- | --- | --- | --- |
| 6 | The Back Room | 1926 | A speakeasy, Chicago | Seven Card Stud, then Razz | Nora Shea | Edith Avery, Clara's daughter |
| 7 | The Desert Classic | 1972 | A casino tournament, Las Vegas | Limit Hold'em, then No-Limit Hold'em | "Tex" Dawson Pruitt | Lou Avery |
| 8 | The Cercle | 1992 | A private card club, Paris | Pot-Limit Omaha, then Omaha Hi-Lo | Comte Lucien Varenne | Anna Avery |
| 9 | The Boardwalk | 1995 | A casino poker room, Atlantic City | Stud Hi-Lo | Margot Arceneaux | Ray Avery |
| 10 | The Boom | 2005 | An internet café at 3 a.m., then a final table in Las Vegas | Online Hold'em, then 2-7 Triple Draw and Badugi | A player known only as "N0rthStar" | Jamie Avery |
| 11 | The Big O | 2019 | A big card room in the English Midlands | 5-Card Omaha, then 6-Card Omaha, then their Hi-Lo versions | Gaz Whitlock | Sophie Avery |
| 12 | The Last Table | Today | A private high-stakes room, Macau | HORSE, then 8-Game | Victor Crane | You |
| Epilogue | The Kitchen Table | Today | A home game with friends | Hold'em with home-game extras: bomb pots, double board, 7-2 bounty | None: friends | You |

All people, clubs, events and websites in Part Two are fictional, with generic venue names. No real trademarks or real living people appear.

### The chapters in brief

- **6, The Back Room (1926).** Prohibition Chicago, behind a fake florist's shop. Seven-card stud is the coming American game. Sal Moretti, a bootlegger's bookkeeper, teaches it on the first hand; after midnight Nora Shea, the owner, switches to Razz, "stud for losers", and teaches it with a grin. Gus Lindqvist, a Swedish-born truck driver, gambles happily. *Fit:* stud was a mainstay of American home games for most of the century (sourced); Razz has been played since the start of the 1900s, though no exact start date is recorded (sourced).
- **7, The Desert Classic (1972).** A fictional early championship in Las Vegas, where Hold'em had recently arrived from Texas. Professor Milton Weiss teaches limit Hold'em in the side game the night before; the tournament itself is no limit, with blinds that rise. "Tex" Pruitt plays every hand fast; Lorraine Fisk, a former showgirl, has an iron poker face. *Fit:* Hold'em was first dealt in Las Vegas in 1963 and caught on when Texas players brought it to the Golden Nugget in the late 1960s; the first championship was in 1970, with a no-limit Hold'em main event from the next year (sourced).
- **8, The Cercle (1992).** Omaha was born in Las Vegas in the 1980s, but pot-limit Omaha took hold in Europe. In a private Paris card club, Anna Avery, a translator, learns it from Siobhan Kearney, an Irish pro; late in the night Comte Lucien Varenne, the club's president, switches to Omaha Hi-Lo. Dmitri Volkov, a chess master, plays cold and exact. *Fit:* Omaha was introduced at a downtown Las Vegas casino in the 1980s, and pot-limit Omaha is especially popular in Europe (sourced).
- **9, The Boardwalk (1995).** Poker has been legal in Atlantic City casinos for two years, and stud is the game of East Coast poker rooms. Margot Arceneaux, Delphine's descendant and the room's manager, teaches Stud Hi-Lo and challenges Ray Avery for the deck the two families once shared. *Fit:* seven-card stud was the main casino game in the eastern US before Hold'em (sourced); casinos opened in Atlantic City in 1978, but poker was banned there until June 25, 1993, and stud was its main poker game from 1993 to 2003 (sourced; the chapter moved from 1985 to 1995 for this, John agreed 2026-11-20); when the 8-or-better rule appeared is not recorded (checked: no source gives a date).
- **10, The Boom (2005).** The most dramatic chapter, not a quiet one. Jamie Avery, broke and studying at night, plays a $5 online qualifier in a cramped internet café at 3 a.m. The screen is the table: a painted monitor glow, avatars, a scrolling chat full of trash talk, four tables at once, and a new tell, **timing**, how fast each player acts. Jamie wins seat after seat and lands at the televised final table of a big live championship in Las Vegas, with lights, cameras and a crowd, where the rival "N0rthStar" is revealed in person as a Crane. Between rounds of the qualifier, two online pros teach the high-stakes games of the moment: "DeuceSeven" teaches 2-7 Triple Draw, and "Hanbit", from Seoul, teaches Badugi. *Fit:* the online boom of the mid-2000s turned amateurs into champions: Chris Moneymaker won the 2003 world championship after qualifying through an $86 online satellite (sourced); Badugi has been played since the 1980s, in South Korea among other places, and became known in the US around 2004 (sourced).
- **11, The Big O (2019).** A huge, noisy card room in the English Midlands, where big Omaha games with five and six cards are the fashion. Gaz Whitlock, a regular who has seen everything, teaches 5-Card and then 6-Card Omaha; on the last round the table switches to the Hi-Lo versions. *Fit:* six-card Omaha is found in many UK casinos, and five-card Omaha ("Big O") spread in American card rooms from about 2008 (sourced; the 2008 date is uncited on its source).
- **12, The Last Table (today).** The finale in a private room in Macau. Victor Crane, the last of the Cranes, challenges you for the deck in HORSE, five games in turn, then the 8-Game mix, so you use almost everything you have learned. Mei Lin Chau, a quiet local legend, explains each switch. The feud ends for good and the deck's case is full.
- **Epilogue, The Kitchen Table (today).** You bring the deck home to a game with friends, the kind RSDP Live was made for. Your friends teach the house extras: bomb pots, double board and the 7-2 bounty. The last screen is the "Powered by RSDP Live" mark, inviting players to start their own game.

Sources for the facts marked sourced: [Seven-card stud](https://en.wikipedia.org/wiki/7_Card_Stud), [Stud poker](https://en.wikipedia.org/wiki/Stud_poker), [Omaha hold 'em](https://en.wikipedia.org/wiki/Omaha_Hi-Lo), [Robert Turner](https://en.wikipedia.org/wiki/Robert_Turner_(poker_player)), [Omaha, at pagat.com](https://pagat.com/poker/variants/omaha.html), [Badugi, at pagat.com](https://pagat.com/poker/variants/badugi.html). Sources for everything else, and the full fact check, are in [HISTORY_SOURCES.md](HISTORY_SOURCES.md).

## Teaching inside the story

Every game, old or modern, is taught by a character at the moment it first appears in the story. There is no separate school or tutorial mode.

- **Guided first hand.** The first hand of each new game is a short scripted hand where that chapter's teacher walks through each step: what you were dealt, when to bet, and why the winner won. It is the only place deals are set up in advance.
- **Rules card as a story object.** Each game's rules are an object from its era that the player can open any time: a parchment page in 1543, a matchbook in 1926, a tournament program in 1972, a help screen in 2005. Each shows the deal, the betting rounds, what wins, and a hand-ranking strip (or low rankings for low games).
- **Hints from the teacher.** An optional hint button where the teacher suggests an action in one line, built on the engine's existing advice code. On by default at Story level, off at Gambler level.
- **Your hand, explained.** A small label always shows your current best hand (and your best low, in split games).
- **Showdown summary.** After each hand, one line: who won, with what, and why it beat yours.
- **Practice is replay.** Any finished chapter can be replayed, and its games played in Free Play with that chapter's characters, with chips that reset.

### Where every RSDP Live game is taught

| RSDP Live game | Chapter | Teacher |
| --- | --- | --- |
| Hold'em, limit | 7, The Desert Classic | Professor Milton Weiss |
| Hold'em, no limit and pot limit | 7, The Desert Classic | Professor Milton Weiss |
| Omaha (pot limit) | 8, The Cercle | Siobhan Kearney |
| Omaha Hi-Lo (8 or better) | 8, The Cercle | Comte Lucien Varenne |
| 5-Card and 6-Card Omaha, and their Hi-Lo versions | 11, The Big O | Gaz Whitlock |
| Seven Card Stud | 6, The Back Room | Sal Moretti |
| Razz | 6, The Back Room | Nora Shea |
| Stud Hi-Lo (8 or better) | 9, The Boardwalk | Margot Arceneaux |
| 2-7 Triple Draw | 10, The Boom | DeuceSeven |
| Badugi | 10, The Boom | Hanbit |
| HORSE and 8-Game | 12, The Last Table | Mei Lin Chau |
| Bomb pots, double board, 7-2 bounty | Epilogue, The Kitchen Table | Your friends |

## Progression and unlocks

The story runs in a straight line, one chapter unlocking the next, and every chapter stays replayable once unlocked.

1. **The River (1836)** is open from the start and teaches the basics.
1. Winning it unlocks **The Painted Deck (1543)**, then **The North Road (1763)**.
1. Finishing both flashbacks returns the story to the Averys and unlocks **The Camp (1863)**, then **The Last Hand (1876)**.
1. Finishing the finale unlocks the bonus, **The Gaming House (1817)**, and **Free Play**.
  In the later release, finishing Part One unlocks **Part Two**, played in order from The Back Room (1926) to the Epilogue, The Kitchen Table.

### How a chapter plays

- A chapter is one **sitting**: a story opening, then hands of the era's game, with story scenes triggered by events (a rival goes broke, the player wins a big pot, the stake goes on the table, a set number of hands has passed).
- Each chapter ends in a **showdown** with its rival for the chapter's stake. Win, and the story moves on. Go broke, and the player gets a short lesson from a friendly character and can retry the chapter.
- Hands are dealt fairly by the engine. Story moments come from events and dialogue, never from rigged deals, except in a clearly scripted tutorial hand.

### Systems that carry across chapters

- **Tells.** Every bot has a tell with its own reliability. When a tell plays, an optional "tell spotted" hint can flash. Reading tells is the skill the whole game teaches, and it pays off in the story (catching Silas and Jasper cheating).
- **Keepsake cards.** Beating a rival adds a painted portrait card of them to the deck's case. The case is the chapter select screen; empty slots show which chapters remain.
- **Almanac.** Each chapter's history notes and rules are collected in a book the player can browse, with a short "how this game led to poker" line per era.
- **Difficulty.** Two levels: Story (bots make more mistakes, hints on) and Gambler (sharper bots, no hints).
- **Free Play.** Any unlocked game against any unlocked characters, for practice or fun.
- **Saving.** Progress, keepsakes and settings save in the browser automatically. There are no accounts; clearing the browser's data resets it.

## Art and UI direction

Every screen should look like a painted scene you are sitting in, not a poker app. The approved style target is the painted, hand-inked, worn riverboat scene in the project's art folder (`art/style-target-riverboat.jpg`); every chapter matches its finish, with its own era palette.

### Look

- **Style:** painted and hand-inked, with worn textures: chipped gilt, scuffed felt, aged card stock, bone and metal tokens.
- **People first:** three opponents sit across the table, waist up, lit by the scene's light, fading into the room behind them. The player's view is first person, with their cards in the foreground.
- **Era palettes:** 1543 candle gold and oak; 1763 pewter, firelight and frost; 1817 warm Creole night; 1836 lamplight against blue moonlight; 1863 lantern yellow on wet canvas; 1876 dusty daylight and amber lamps.
- **Cards change with the era:** hand-painted Tudor faces, Georgian prints, 1830s cards with no corner numbers, then indexed cards from the 1860s on.

### Screen layout

- **No boxes or panels.** Controls are objects on the table: Fold, Call and Raise are large painted chips; the purse and pot are coin stacks with small numbers.
- **Dialogue** sits as plain text over a soft shaded strip across the bottom third, with the speaker's name, as in story games.
- Names and stacks sit on the table's edge in front of each character. A folded character dims.
- The "Powered by RSDP Live" credit is a small mark in a corner, in RSDP's own colors so it reads as a credit, not as part of the scene.

### How art is made

- John generates the art with an image tool from prompts written here, attaching the style target as a reference each time.
- Each chapter is built from **layers**: an empty background (room and table, no people), each character seated, waist up and centered on solid green, plus cards, coins or chips, and a chapter title card.
- Characters are cut out of the green with the project script (`art/layers/greenscreen-cutout.py`), so they can react, dim and move on their own.
- Optional later: two or three expressions per character (neutral, pleased, worried) to drive reactions and tells.

### Per-chapter art checklist

| Chapter | Background | Characters on green | Props |
| --- | --- | --- | --- |
| 1 The River | Done | All done | 20-card deck, silver dollars, buckhorn knife |
| 2 The Painted Deck | Needed | Margery, Roland, Anselm | Tudor cards, shillings |
| 3 The North Road | Needed | Pike, Hannah, Sorrel | Georgian cards, coins |
| 4 The Camp | Needed | Reed, Toby, Hattie | 1860s cards, greenbacks |
| 5 The Last Hand | Needed | Ruby, Jasper, Doc | Indexed cards, gold dust, epilogue painting |
| Bonus | Needed | Élodie, Henri, Lacroix, young Delphine | Piquet cards, payout board |

Each chapter also needs a title card, and the game needs a title screen and the deck-case chapter select.

## Tech approach

A static TypeScript web app in the repo `jcolter11374/Historical-Poker`, built on a copy of the RSDP Live engine and published to GitHub Pages. The chapter 1 build is setting up the repo now; its README and `docs/` folder are where file-level details live, and they win if they differ from this summary.

### Pieces

- **Engine.** A copy of RSDP Live's `packages/engine` (pure TypeScript, one small dependency, zod). It already handles draw and stud games. RSDP Live's own repo is never changed; fixes made here stay here.
- **Historical games.** Each game is a rules module: its deck (20, 32, 40 or 52 cards), hand ranking, deal and betting sequence. Stud and draw are mostly configuration; straight poker needs a new deck and ranking; Primero, Brag and Poque need their own ranking and betting flow.
- **Bots.** One shared bot built from RSDP Live's coach bot, given a personality per character: how loose, how aggressive, how often it bluffs, its tell and the tell's reliability, plus special behaviors (Silas's cheat, Ruby adapting to the player).
- **Story.** Each chapter's scenes are data, not code: lines of dialogue with a speaker, and triggers that fire them (hand number, a rival going broke, a big pot). New chapters are mostly new data and art.
- **Scene.** The table screen draws the layered art (background, cut-out characters, table rim, cards, coins) with chip buttons and the dialogue strip. Each chapter supplies its own art and palette.
- **Saves.** Progress, keepsakes and settings in the browser's local storage.
- **Publishing.** Every push to the main branch rebuilds and publishes the site to GitHub Pages. The repo is public so hosting stays free.

### Adding a chapter

1. Write its rules module and tests for the hand ranking.
1. Add the three characters' bot personalities.
1. Write its story script and history notes.
1. Drop in John's art layers (cut out from green).
1. Register the chapter in the deck case and unlock order.

## Roadmap and open questions

The build follows the roadmap agreed in the project chat, with one change: five-card draw moves from the flashbacks to the finale, because draw poker came after 1836 and can't be a flashback from the riverboat.

1. **Chapter 1, The River:** playable, with Silas, Delphine and Ezra as bots. In progress.
1. **Flashbacks:** The Painted Deck (Primero), then The North Road (Brag).
1. **Forward:** The Camp (five-card stud), then the finale, The Last Hand (five-card draw). Then the Poque bonus.
1. **Polish:** title screen, deck-case chapter select, almanac, difficulty levels, Free Play, final GitHub Pages publish.

**After the first release:** Part Two in order, from The Back Room (1926) to the Epilogue. By its end every RSDP Live game is taught in the story. New systems are only the online timing tell and tournament blinds; the games themselves already run in the engine.

Art for each chapter can be generated in parallel with the build; code uses placeholders until it arrives.

### Open questions

- [ ] Is the finale five-card draw in Deadwood (this outline), or five-card stud as first drafted in chat?
- [ ] Should real people make cameos, such as Wild Bill Hickok at a nearby table in 1876, or stay in the background only?
- [ ] Are the names Kit Avery, the *Magnolia Queen*, the Ashcombe deck and the new characters OK?
- [ ] Betting limits for each game (no limit, pot limit or fixed), to settle while play-testing chapter 1.
- [ ] Poque's rules need a short research pass before that chapter is built.
- [ ] History notes need checking against sources before they appear in the game.

- [ ] Which Part Two settings to keep: Paris, Atlantic City, Las Vegas, London, online and Macau, or swap one for a Monte Carlo-style casino, Havana or a California card club?

- [ ] Should Part Two's chapters be built before the Part One flashbacks, so John's friends can learn the RSDP Live games sooner?
- [ ] Can a player start any chapter straight away, after a short "story so far", so a friend can go right to the chapter that teaches the game they want?
