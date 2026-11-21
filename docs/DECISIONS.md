# Decisions

Why things are the way they are. Add an entry, with the date, when you make a choice someone might later question.

### A separate repo, not part of RSDP Live (2026-11-19)
RSDP Live is developed in its own project. Building the game inside it would mix two codebases and two release cycles. The game copies the engine instead ([ENGINE.md](ENGINE.md)).

### Single player in the browser, hosted on GitHub Pages (2026-11-19)
With only bots at the table there is nothing to run on a server, so the game is a static site and hosting is free. The repo must stay public for free Pages hosting.

### The story opens in 1836 (2026-11-19)
The steamboat game is the first one actually called poker, so the story starts there and reaches back in flashbacks and forward to the Old West. Five-card draw is the finale (1876), because it came after 1836 and can't be a flashback. See [GAME_OUTLINE.md](GAME_OUTLINE.md).

### Pot-limit betting in chapter 1 (2026-11-19)
With no-limit, simulated games often ended in one all-in hand, which is short and swingy for a story chapter. Pot-limit keeps hands meaningful but lets a sitting last. Revisit while play-testing (an open question in the outline).

### Win by taking the deck (2026-11-19, revised 2026-11-20)
The first version ended the chapter when Silas went broke, which could hand the player a win while folding every hand. Then it needed the player to win all the money. Now the chapter is won by taking the last chips of whoever has the deck staked, usually Silas heads-up, after the other remaining rival bows out with their money. That matches the outline's finale and keeps the ending about Silas. Being last at the table still wins if the deck was never staked.

### Tells have two chances, not one (2026-11-19)
A tell that only fires when true would be a free win. Each tell has a chance to show when true and when false; the ratio is its reliability, which matches the outline's percentages and lets Delphine's tell be a deliberate coin flip.

### Layered art (2026-11-19)
Characters are separate cutouts placed behind a table-front layer, instead of one painted scene, so they can dim when they fold and later react. See [ART.md](ART.md).

### No boxes or panels in the UI (2026-11-19)
John found boxed layouts looked generic. Controls are painted chips on the felt, dialogue is plain text on a shaded strip, names sit on the table edge.

### Fixed 1600 x 900 stage (2026-11-19)
Everything is placed in stage pixels and the stage scales to the window, so art placement in chapter files is simple and the scene looks the same at any size.

### Part Two, to the present day, is a later release (2026-11-19)
John wants the story to reach today. The first release is Part One only (through Deadwood, plus the Poque bonus), so it ships sooner. Part Two (1926 to today) come after, and use only fictional people, venues and websites, with no real trademarks or living people.

### Every RSDP Live game is taught inside the story (2026-11-19)
John wants his friends to learn RSDP Live's games here, for free, before playing for money, but without a separate "school" mode. Each game is taught by a character in the chapter where it first appears, with a guided first hand. Part Two is seven chapters plus an epilogue, each set where its games were really played (re-checked for historical fit on 2026-11-19, which cut a 1994 riverboat casino chapter).

### Silas's cheat is a read, not a quick-time event (2026-11-20)
The outline says catching Silas's tell lets Delphine call him out. Calling out is a chip the player can press on any hand Silas deals until the cheat is settled, so it is a decision rather than a reflex. His cheat has its own tell, and a harmless decoy shows on some honest deals. A wrong call costs $5, so guessing every time has a price. The cheat hand is the only rigged deal outside the tutorial, and it is part of the story (CLAUDE.md allows story moments, not hidden rigging).

### All chapters built at once, with placeholder art (2026-11-20)
John asked for every chapter, the progression and the story now, with art later. So Part Two was built together with Part One instead of as a later release, and every room and character has a placeholder drawn in code from a palette and a colour. Swapping in art is a data change in the chapter file ([ART.md](ART.md)).

### Chapters are data; one Session plays them all (2026-11-20)
Fourteen chapters with twenty games would be unmanageable as fourteen bits of code. Each chapter is a data file (stages, games, lessons, cast, story beats) and one `Session` runs any of them. New behaviour goes into the Session behind an optional chapter field, so older chapters don't change.

### One "unit" sets every stake (2026-11-20)
Each stage gives one number, and every game derives its antes, blinds, bring-in and bet sizes from it (`src/table/stakes.ts`). That keeps rotations like HORSE consistent (limit hold'em and stud cost about the same per hand) and makes tuning one number per chapter.

### Rising stakes and buy-backs (2026-11-20)
Without rising stakes, four careful bots could play for hours. The unit rises by half every `levelEvery` hands, in the story's words ("The pizza arrives…"). And with several games in a chapter, someone going broke early would skip lessons, so until the last stage a broke player, you included, buys back in. From the last stage on, broke means out. Chapter 7 and the Boom's final table start everyone again from the same stack, like a real tournament.

### Lessons are words, not set-up deals (2026-11-20)
The outline asks for a guided first hand per game. Chapter 1's tutorial is a set deal, but doing that for twenty games would be a lot of rigged hands. Instead the teacher speaks before the first deal and on each street of that hand, which is dealt fairly, and teacher hints can be asked for at any time. CLAUDE.md's "deals must be fair" stays true for everything but chapter 1's tutorial and the two cheats.

### Historical games use pot-limit; modern games use their usual limit (2026-11-20)
The old games use pot-limit, as chapter 1 does, for the same reason (no-limit ends sittings in one hand). The modern games use the betting they are usually played with: stud games, Razz, 2-7 Triple Draw and Badugi limit; Omaha pot-limit; Hold'em limit then no-limit as the outline says. HORSE is all limit, and the 8-Game adds No-Limit Hold'em and Pot-Limit Omaha.

### Reconstructed rules for the old games (2026-11-20)
- **Primero:** as in the outline. A hand of numerus is described by its points and suit ("Numerus, 39 points in hearts").
- **Brag:** no blind betting yet. The engine has no "play blind" option, and adding one means changing the engine. Pike still bets loose and loud. The optional "braggers" wild cards are not used.
- **Poque:** 32 cards, five each, one betting round, and only fours, triplets, two pairs and pairs count. No payout board yet. The rules card says this is a reconstruction.
- **Five-card draw:** draw up to three, or four keeping an ace; no jackpots (needs an opening rule the engine doesn't have).

### Story choices made while building, for John to confirm (2026-11-20)
The outline left some story details open. These were filled in and are easy to change in the chapter files:
- Stakes: Margery puts the deck itself on the table; Pike stakes a berth to Philadelphia (his promise to pay Will's passage); Reed stakes a silver watch against the deck; Margot stakes Delphine's diary.
- Chapter 5 has no stake: the deck is Clara's and the sitting settles it. Jasper's cheat works like Silas's (four kings, with a tell and a decoy), and Ruby is teacher, narrator and the real opponent.
- The bonus: Élodie has just won the deck from Henri; young Delphine wins it back for him.
- Part Two's teachers and stakes follow the outline; the Boom's tournament is played to the last player with no bow-outs, and the Desert Classic too.
- The players in Part Two are named Averys as in the outline; in chapter 12 and the epilogue you play yourself.

### Any chapter can be started at once (2026-11-20)
The outline's open question, answered as John asked: every chapter can be opened from the deck case; a chapter you haven't reached shows "the story so far" first. Winning still unlocks the next chapter in order, and the case shows which ones you've won.

### History fact check (2026-11-20)
Every history claim in the game was checked against sources; the list, with sources and corrections, is [HISTORY_SOURCES.md](HISTORY_SOURCES.md). Only wording and dates in story text changed, no gameplay. Points raised:
- **Atlantic City moved from 1985 to 1995 (John chose this, 2026-11-20):** poker was illegal in Atlantic City casinos until June 25, 1993, so a 1985 casino poker room can't have existed. In 1995 stud was the room's main game (it was from 1993 to 2003). The Boardwalk is now chapter 9, after the Cercle (Paris 1992), which is now chapter 8. The Cercle no longer depends on Delphine's diary (Ray only wins it in 1995); Anna brings the deck because the Comte collects antique cards. Chapter ids and saves are unchanged.
- **Five-card draw limit:** chapter 5 lets players draw up to three cards (four with an ace). That is a modern house rule; in 1876 a player could draw up to five. Changing it is a gameplay change, so it is left as is.
- **The "buck" in 1836:** the rules cards say "left of the buck" in every chapter. The buck knife is attested from the 1850s, a little after chapter 1. Left as the game's word for the dealer marker.

### Rivals read the betting and size you up (2026-11-20)
Before this, a bot judged its hand against random cards whatever had been bet, so it paid off big bets far too often, and a player who just bet big every time got paid. Now a bet counts as strength (by how much a rival respects bets), and the sharp rivals notice a player who bets nearly every time and stop believing them. The outline's "adaptive bots" for Ruby and Élodie is this `reads` number, given to every rival in a dose that fits them. Hot-headed rivals also get a temper (`tilt`) that the table can see. Tuned with stand-in players (`tools/bot-lab.ts`) so reckless play loses everywhere and careful play by the hints is about even; beating a chapter takes reading the table.

### Sound is made in code; music is a hook (2026-11-20)
Recorded sound effects need licences tracked and files hosted. Cards, chips and knocks are short noises that Web Audio makes well, so they're generated in code: nothing to license, nothing to download. Generated music sounds cheap, so music is left as a per-chapter hook for free-to-use tracks John picks ([ART.md](ART.md), "Music").

### Phones play sideways (2026-11-20)
The table is a wide painting with characters in it, and an upright layout would mean shrinking or cropping the people, which is the point of the look. So phones play sideways like most console-style games, with words and controls enlarged on small screens, and an upright phone is asked to turn (it can carry on upright). An upright layout could come later if play-testers want it.

### Leaving a chapter part-way keeps the table (2026-11-21)
Chapters are long sittings, and friends dip in to learn one game, so losing a half-played chapter to a closed tab was the biggest gap in saving. The table is saved after every hand, one save per chapter, in local storage; the hand in play isn't saved (a half-dealt hand would need the engine's whole state and the deck, and restarting from the next deal is what a real table would do). It does mean reloading mid-hand undoes that hand; in a single-player teaching game that is harmless. The case marks a chapter left part-way ("At hand 12"), and "Continue" goes back to the most recent one. The "Jump ahead" labels on chapters not yet reached were dropped: every chapter is open, and a face-down card already says you haven't been there. The game now always opens on the case, even on a first visit (John chose this, 2026-11-21): it is a teaching tool, and friends should see every game at once; "Begin the story" starts chapter 1.

### Original music, written as code (2026-11-21)
John asked for music in every chapter. Rather than collect free tracks of uneven sound and licence, each chapter has an original tune in the sound of its era, written as a short score in code (`tools/music/pieces.py`) and rendered with a sampled-instrument soundfont (FluidR3 GM, MIT). This replaces the earlier plan of a hook for tracks picked later: sampled instruments sound far better than the synthesis the sound effects use, there is nothing to license, and a developer can change a tune by editing a melody string ([MUSIC.md](MUSIC.md)). Loops are short (50 to 90 seconds), mastered quietly and played at half volume, so the music stays in the background. It can be turned off at the table and on the story screens.

### The rules sheet teaches, not just lists (2026-11-21)
To help friends learn every RSDP Live game, the rules sheet gained a page of tips and easy mistakes for each game, and plain words for the betting (no limit, pot limit, limit; antes, blinds, bring-in) and the house extras. It is split into three short pages so it never becomes a wall of text. Hints now explain themselves: your hand, your share of the pot, and the share a call needs, plus one reminder about the game and round. The reminders take turns, so a player who keeps asking keeps learning.

### Math Mode is a switch, and its sums come from the real hand (2026-11-21)
John wants the game to help children learn math (fractions, pot odds), and is happy for it to use money words: children know what money is. It is a switch that is off by default, so the main game stays uncluttered, and it works at every table instead of being a separate puzzle screen, so the sums are about a hand the child is actually playing. It only reads what the player can see and never changes a deal or blocks play: a child can ignore a question and just bet. Outs are counted as "cards that make a better kind of hand", which a child can check by looking, not as "cards that win", which depends on hidden cards; so the outs question is kept to high-hand games with one card to come. The winning chance in the "good deal?" question is the teacher's estimate from the hint simulation, because a child can't work that out, while the pot share (price over pot plus price) is the fraction they can. Answers are multiple choice on chips, in the painted style, with the working shown after.

### Practice is the outline's Free Play, open from the start (2026-11-21)
John asked for a practice mode where friends pick any RSDP Live game and play it outside the story. The outline's Free Play ("any unlocked game against any unlocked characters", unlocked by the Part One finale) is built as this, with two differences, which John confirmed on 2026-11-21 (the outline is updated to match): it is open from the start, like jumping to any chapter, because its purpose is letting a friend go straight to the game they want to learn; and each game is played against the rivals of the chapter that teaches it, rather than picking characters, which keeps the screen to one choice. The list is generated from the chapters, so it can't fall out of step with them. The practice lesson is the game's rules card read by the teacher, because chapter lessons refer to the story around them.

### The Count turns his ring, not a cigar (2026-11-21, awaiting John's OK)
John disliked the cigar and match in the Comte Varenne's picture, so the redone picture shows an empty hand with his signet ring. His tell, which was "He relights a cigar that is already lit", is now "He turns the signet ring on his finger", so the words match what the player sees. What it signals and how often it shows are unchanged. To go back, restore the tell text in `src/chapters/cercle.ts` and the cast line in CHAPTERS.md.

### Rules audit: every game checked, and locked in by tests (2026-11-21)
John asked that every rule set actually works: draws where there are draws, limit games strictly limit. Every game in every chapter was played and checked (`test/rules.test.ts` now does this on every run): cards down, up and on the board street by street; every draw round offered before its betting; fixed-limit bets exactly one small or big bet with four bets a round at most; pot-limit never over the pot; no-limit up to the whole purse; the right up card bringing in. Findings:
- **Five-card stud (The Camp) was pot-limit with a limit game's bring-in**, while Reed's lesson said "the bets get bigger from here". It is now fixed limit like every other stud game: $4 on the first two rounds, $8 on the last two, four bets a round. A test keeps every stud game at fixed limit.
- **Five-card draw (The Last Hand) had its draw, but it was easy to miss**: a small grey note and one "Stand pat" chip, which a player pressing the only chip skipped straight past. The draw is now announced over the felt in every draw game.
- **Purses didn't go down during a hand** (they showed the amount at the deal until the hand ended). Fixed.
- **Known, deliberate differences from the historical games** (unchanged, stated on the rules cards): Brag is bet like poker in one round, without blind betting or "seeing"; five-card stud uses the modern low-card bring-in where old stud had the high card bet first; five-card draw allows three cards (four with an ace) where 1876 allowed five, and has no jacks-or-better opener; Primero and Poque are reconstructions.
- RSDP Live's twelve games had no deviations.

### Short chapters: more money, steadier hints (2026-11-21)
A player following the hints could go broke in the first two or three hands of the one-stage pot-limit chapters. John agreed to raise starting money and leave the stakes alone: The Last Hand $120 to $240, The Painted Deck 100s to 200s. The hints were also steadied (GAME_DESIGN.md, "Help at the table"). Measured with a scripted hint-follower over 24 sittings per chapter: before, a quarter of the busts came by hand 4 or 5 in those two chapters and hand-1 busts happened in five chapters; after, a quarter of busts come by about hand 11 or later in every one-stage chapter. Open: heads-up against Silas at the end of chapter 1, a pure hint-follower can grind for a very long time (chapter 1 has no rising stakes).

### Every game by the rules of its year (2026-11-21)
John's rule: "all rules should be historically accurate for when they are being played". It replaces two earlier choices above: "Pot-limit betting in chapter 1" and "Historical games use pot-limit", and the "known, deliberate differences" left in the rules audit. What changed, with sources, is in [HISTORY_SOURCES.md](HISTORY_SOURCES.md), "Period rules"; how it plays is in [GAME_DESIGN.md](GAME_DESIGN.md), "Period rules". In short:
- **Betting.** Pot-limit is a 1900s idea and the four-bet fixed limit a card room's, so no chapter before 1900 uses either. Primero, Brag, Poque, straight poker and five-card stud are table stakes (the engine's no-limit). Five-card draw in 1876 is played to a limit the table agrees on each bet or raise, with no cap on raises. The old worry about no-limit (sittings over in one hand) was measured again with a hint-following player, 16 sittings a chapter: nobody went broke before hand 11 in any of these chapters, and most sittings ran 25 hands or more.
- **Brag** is the 1700s game: pairs royal and pairs only, two braggers, no blind betting.
- **Poque** counts only sets (fours, threes, a pair).
- **Five-card stud** has no bring-in (the best hand showing opens and may check) and uses the 1864 hand list (straight below three of a kind, no straight flush).
- **Five-card draw** has the blind ante from the age, a draw of up to five, the age speaking last, and no jack pots.
- **Seven Card Stud and Razz in 1926** have no bring-in. The casino chapters (1995, today) keep it.
- **How it was built without changing the engine.** The agreed limit is the engine's no-limit with a ceiling the table adds; stud with no bring-in is the engine's bring-in set to nothing and shown as a check; the age's ante is one blind post smaller than the engine's big blind, which the engine already treats as "everyone else still owes the full amount"; and the age speaks last because the table tells the engine the age holds the button. All of it is in `src/table/session.ts` (`legalFor`, `actFor`, `startHand`) and `src/table/stakes.ts`.
- **Where history is unsure**, the best-supported rule is used and marked "best pick" in HISTORY_SOURCES.md. The main ones: the 1876 blind ante, agreed limit and betting order come from the period's rule books, which could not be opened for this pass; no source dates the stud bring-in; no limit of any kind is recorded for the games before 1850.

### The out-of-order chapters are a told tale, and the family tree is written down (2026-11-21)
John noticed chapter 1 (1836) comes before chapters 2 (1543) and 3 (1763), and asked that the whole story make narrative sense. The order stays (the riverboat is the first real poker and teaches the basics; reordering would also renumber art and saves), but the frame the outline always had is now on screen: Delphine tells the deck's past on the riverboat, in the text of chapters 1 to 4, and flashback chapters are labelled "Delphine's tale" on the chapter select and intro (`Chapter.toldBy`).

Reading all 14 chapters end to end also turned up contradictions, fixed in the text: Lady Margery paid for the deck yet the Averys kept it (she now gives it back); Henri was Will's grandson and Kit's grandfather, which the dates don't allow (now Will's son); Lou was Edith's grandson, which made his granddaughter Anna a child in Paris in 1992 (now Edith's son); the camp recap said Kit kept the deck all his life while Sam carried it and wrote to him; Delphine was "Mrs. Arceneaux, a widow" in 1836 but already Arceneaux and unmarried in 1817 (now newly married in 1817); Victor was "the last of the Cranes" twenty years after Nate; the epilogue's list of keepsakes left out Silas. The tree is in [GAME_OUTLINE.md](GAME_OUTLINE.md), "The family lines".

### A feud with a happy ending (2026-11-21)
John asked for the whole arc as he would pitch it to a publisher, and the read-through found nine weak links. He approved fixes for all nine, and then reshaped the ending: "a Hatfields and McCoys story with a happy ending". The player should dislike the Cranes immensely at first, warm to them over the years, and at last marry one. What was decided, in his order:

- **The nine fixes.** (1) The Cranes' grievance: Silas never won a big hand again and told his family their luck went downriver with the deck (Jasper, 1876; Victor, today). (2) The feud no longer vanishes between 1876 and 2005: a lawyer with no name writes to every Avery offering to buy the deck (1926, 1972, 1992), more politely each time, and Nate reveals in 2005 that the letters were the Cranes'. (3) The legend is answered: Delphine in 1836 ("Your father held it, and lost. It is not the deck. It is who is watching."), Victor at the end ("It was never the deck, was it?"). (4) Margot's family held the deck for one night and gave it back; she wants to do the same, not to keep it. (5) Delphine says at the end of her tale how she knows it and why she is on the boat. (6) Ruby is part of the feud: Jasper offered her money to win the deck for him. (7) Each 1990s and 2000s intro says who handed the deck to whom. (8) Sophie hands the deck to "you". (9) Clara decides the name goes with the deck, which is why Edith and Sophie are Averys through their mothers.
- **The love story.** The last rival is Elena Crane, Victor's daughter, one of the best professional players in the world. You win the deck from her in Macau while falling for her; Victor sits in. She replaces Rafael Duarte, who had no part in the story. The epilogue is the home game the night after the wedding, with Victor at the kitchen table. Kept light, because children play with Math Mode: teasing, a dinner owed, a kiss on the cheek.
- **No gender choice.** John first asked for the player to pick a gender, and for a choice of Elena or Eli, then decided it was not worth it: the last Avery is a man who marries a woman. The earlier Averys are unchanged. (The choice was built and taken out again the same day; nothing of it remains.)
- **A strong rival who is still beatable.** Elena's strength is in her talk and reputation. Her numbers are only a little sharper than Victor's, because this is a teaching game.
- **The opening and the ending in pictures.** John asked for an intro of "art wipes of various family feud moments" to show the animosity, and a matching ending that "humanizes everything". Built as data (`src/story/montages.ts`) on borrowed paintings and placeholders, because no new art can be made right now. The opening names no Crane after 1876 so the 2005 reveal still lands.
- **Chapter 12's and the epilogue's games and rules did not change**, only the people and the words.

### Proposed, waiting for John's yes (2026-11-21)
Not built. Both came up while the ending was being written.

- **Make 1543 the start of the feud.** John asked what to do about Primero, which is outside the Avery and Crane story. Proposal, with no new art and no change to Primero's or Brag's rules: Sir Roland Fettiplace becomes **Sir Roland Crane**, Lady Margery's nephew, who was promised the deck as a New Year's gift and watches a painter's daughter win it. He stays the comic young knight, so the feud begins as a sulk, not a crime ("That deck was to be mine. A Crane does not forget."). In 1763 the highwayman Jack Sorrel admits a gentleman named Crane paid him to fetch a painted deck off the York coach. Delphine says outright that the quarrel is older than the river. This makes the Cranes' claim nearly five hundred years old and partly sincere. In 1836 "the Cranes held it once and lost it" becomes "the Cranes have wanted it for three hundred years, held it at last by cheating, and lost it in a night", which fits better. It touches about eight lines in chapters 2, 3, 1 and 5, Roland's name in docs and prompts, and adds a first slide to the opening. One cost: Roland is a likeable fool, which softens "hateful at first", so the bitterness would still start with Silas.
- **A Crane woman before Elena.** John noted the Crane rivals need not all be men. Silas and Jasper are painted; Victor is Elena's father and carries the cufflinks and the family likeness in the art prompts. So the one to change is **Nate (2005)**: "N0rthStar" becomes Natalie "Nat" Crane, Victor's niece. Nothing in the chapter depends on the character being a man except pronouns in a few lines, the avatar is a star, and the in-person picture is not painted yet. The "same mustache" joke is only Silas and Jasper, so it is untouched. A woman as the cold, fair, respected Crane also prepares the ground for Elena.
