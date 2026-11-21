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

### Original music, written as code (2026-11-21)
John asked for music in every chapter. Rather than collect free tracks of uneven sound and licence, each chapter has an original tune in the sound of its era, written as a short score in code (`tools/music/pieces.py`) and rendered with a sampled-instrument soundfont (FluidR3 GM, MIT). This replaces the earlier plan of a hook for tracks picked later: sampled instruments sound far better than the synthesis the sound effects use, there is nothing to license, and a developer can change a tune by editing a melody string ([MUSIC.md](MUSIC.md)). Loops are short (50 to 90 seconds), mastered quietly and played at half volume, so the music stays in the background. It can be turned off at the table and on the story screens.

### The rules sheet teaches, not just lists (2026-11-21)
To help friends learn every RSDP Live game, the rules sheet gained a page of tips and easy mistakes for each game, and plain words for the betting (no limit, pot limit, limit; antes, blinds, bring-in) and the house extras. It is split into three short pages so it never becomes a wall of text. Hints now explain themselves: your hand, your share of the pot, and the share a call needs, plus one reminder about the game and round. The reminders take turns, so a player who keeps asking keeps learning.

### Practice is the outline's Free Play, open from the start (2026-11-21)
John asked for a practice mode where friends pick any RSDP Live game and play it outside the story. The outline's Free Play ("any unlocked game against any unlocked characters", unlocked by the Part One finale) is built as this, with two differences, which John confirmed on 2026-11-21 (the outline is updated to match): it is open from the start, like jumping to any chapter, because its purpose is letting a friend go straight to the game they want to learn; and each game is played against the rivals of the chapter that teaches it, rather than picking characters, which keeps the screen to one choice. The list is generated from the chapters, so it can't fall out of step with them. The practice lesson is the game's rules card read by the teacher, because chapter lessons refer to the story around them.
