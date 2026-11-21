# The rivals' brains: RSDP Live's bots

Every rival at every table thinks with **RSDP Live's practice bot**, and every hint comes from **RSDP Live's coach**. Both are copied from RSDP Live (repo `jcolter11374/rsdp-poker-live`), which John wrote, the same way the engine was copied ([ENGINE.md](ENGINE.md)). This page says exactly what comes from RSDP Live, what this game adds on top, and how to update the copy.

## Where it came from

| File here | Copied from (RSDP Live) | What it is |
| --- | --- | --- |
| `src/bots/rsdp/strategy.ts` | `apps/server/src/bots/strategy.ts` | The practice bot: sizing up a hand by dealing out finishes, weighing every way to draw, the three levels' betting rules, reading the betting, the record of how each player plays |
| `src/bots/rsdp/coach.ts` | `apps/server/src/bots/coach.ts` | The coach tip: what a Normal bot that never bluffs would do, from only what you can see |

- Copied from commit `663730a39cfd2ae8f44ecf3cd685898f7a342e47` (2026-11-20). MIT license, as the engine.
- Not copied: `coachWorker.ts` and `coachThread.*` (they run the coach on its own server thread; this game has no server) and `reasons.ts` (the bot's "why I did that" notes for RSDP Live's screen, which this game doesn't show).
- **Never change RSDP Live from this project.**

## What runs on RSDP Live's bot

All of it, for every game. A rival's turn goes:

1. **RSDP's bot looks at the hand** as its seat sees it (`situation`): its own cards, up cards, the boards, the betting.
2. **It sizes up its chance** by dealing the unseen cards out many times (`estimateEquity`), or, with draws to come, by trying every way to draw (`bestDraw`).
3. **It bets by one of RSDP's three levels** (`decideEasy`, `decide`, `decideHard`), or picks its draw.
4. **The character bends it** (`src/bots/personality.ts`, below).

| Game | RSDP Live has this game? | What the bot uses |
| --- | --- | --- |
| Hold'em, Omaha (4, 5, 6 cards) and their Hi-Lo versions, Seven Card Stud, Razz, Stud Hi-Lo, 2-7 Triple Draw, Badugi; bomb pots and double boards | Yes | RSDP's bot, as written |
| Seven Card Stud and Razz by 1926 rules (no bring-in) | Yes, with a bring-in | RSDP's bot, as written. The table tells it the best hand showing may check |
| Five-card draw (1876) | No | RSDP's bot. It is taught the game's shape (five cards, one draw of up to five); the hands are the engine's ordinary ones |
| Five-card stud (1863) | No | RSDP's bot, taught the 1864 hand ranking (a straight loses to three of a kind, no straight flush) |
| Straight poker (1836) | No | RSDP's bot, taught the 20-card deck and the 1836 hands (no straights or flushes) |
| Poque (1817) | No | RSDP's bot, taught the 32-card deck and Poque's hands |
| Brag (1763) | No | RSDP's bot, taught Brag's three-card hands and its two wild "braggers" |
| Primero (1543) | No | RSDP's bot, taught the 40-card deck, the card points and Primero's five hands |

### What "taught" means, and what is not RSDP's

RSDP Live's bot knows its own twelve games by name: it deals from a 52-card deck and scores hands with the engine's evaluators. It has never heard of Primero. So for each game RSDP Live lacks, `src/bots/games.ts` hands the bot three things and nothing else:

- the game's **spec** (how many cards, which streets, whether there is a draw),
- its **deck**,
- its **showdown**: the game's own `awardPortion` from `src/games/`, the same function that settles real hands.

That knowledge of the old games' cards and rankings is this game's own work, because RSDP Live has nothing to copy for them. Everything the bot then *does* with it is RSDP's code: the dealing-out, the weighing of draws, the pot odds, the levels.

Honest limits, so nobody over-claims:

- **RSDP's bot has never been tuned for the old games.** Its rules (bet at 1.45 times an average hand, call at the pot odds plus a margin) are general, and the bot lab shows they play the old games sensibly, but nobody at RSDP Live designed them for a 20-card deck.
- **Hard's cleverest trick, following how many cards each opponent draws, only works in 2-7 Triple Draw and Badugi**, as in RSDP Live. In five-card draw and Primero a Hard bot would not use the draw counts. (No Hard character plays those games.)
- **Primero bets before the hand is all dealt**, which no RSDP game does. One local change deals the bot the cards still to come when it weighs its chances there.
- **1876 draw's blind ante** makes coming in cost twice what is in the pot. A bot that plays the pot odds mostly raises or folds there, where a player of the day would often just come in. That was true of the old bots too.

## What this game adds on top: the character

`src/bots/personality.ts`. RSDP's bot is one player at three strengths; the story needs forty-two people. Each rival has a `Personality` in their chapter file: RSDP's **level**, plus the numbers that make them themselves. The numbers reach RSDP's bot in three places:

| Number | What it does to RSDP's bot |
| --- | --- |
| `level` | Which of RSDP's levels thinks for them: `easy`, `normal` or `hard` |
| `valueAt` | When nobody has bet, the chance the bot worked out is shown to its betting rules scaled by (the level's own bar ÷ `valueAt`). At the level's own bar (1.7 Easy, 1.45 Normal, 1.35 Hard) the rules see the true number. Lower: bets thinner |
| `caution` | Facing a bet, the rules see the chance less (`caution` − 0.03). 0.03 is RSDP Normal's own margin. Higher folds more; negative calls too much |
| `betSize` | RSDP's dice pick a bet size; the character's dice answer with their own share of the pot |
| `bluff` | 0: RSDP's own bluffs, steals and semi-bluffs never come up on their dice. Above 0: on top of RSDP's, this chance (scaled by how many are in) to bet a hand RSDP checked, and half of it to raise one RSDP folded |
| `trap` | Chance to check a hand RSDP's bot chose to bet for value |
| `respect` | Scales RSDP's read of this hand's betting (`handReads`). RSDP gives that read to Hard bots and to its coach; here Normal characters get it too, weaker or stronger by this number. Easy characters ignore the betting, as RSDP's Easy does |
| `reads` | How much of RSDP's record of each player (`readPlayers`: how often they bet, how often they fold to a bet) the character has taken in. The Session keeps the record for the whole sitting |
| `tilt` | After a big loss, three hands with more `bluff`, less `valueAt` and less `caution` |

Tells, lines, story beats (Silas's and Jasper's cheats, the stake, the finale) and the tilt notice are the Session's, as before. A tell reads the bot's honest numbers: `bluffing` is a bluff RSDP's bot or the character chose, `strong` and `weak` compare its chance with an average hand.

### Levels: this is a teaching game

John's rule (2026-11-21): the rivals must not all be hard. Beginner friendliness outranks bot strength. So:

- **Part One (chapters 1 to 5 and the bonus):** two Easy rivals and one Normal at every table, except the finale (chapter 5), which has one Easy and two Normal.
- **Part Two:** mostly Normal, with an Easy friend at most tables.
- **Hard:** two characters in the whole game, both late bosses: N0rthStar (chapter 10) and Mei Lin (chapter 12).

Every character's level is in [CHAPTERS.md](CHAPTERS.md), "How the rivals play". To make a rival gentler, set `level: 'easy'` in their chapter file and run the bot lab.

What the levels mean, in RSDP Live's words: Easy calls small bets with almost anything, bets only good hands and small, raises only the best, and never bluffs. Normal bets good hands, bluffs now and then heads-up, and calls when its chance beats the pot odds by a margin. Hard thinks longer, follows how many cards each opponent draws (2-7 and Badugi), reads bets and raises as strength, bets thinner against players who call a lot, bluffs players who fold a lot, and uses position.

## Hints and Math Mode

`Session.teacherAdvice()` and `Session.teacherDraw()` ask RSDP's coach (`coachTip`) what to do in your seat. The coach is given only what you can see (`seenBy`), so a hint can never use a hidden card. It answers with your share of the pot, what a call needs, and a move; in a draw, the cards to throw. The hint's words, the teacher who says them, and the reminders under them are this game's.

One thing is added on top of the coach, for beginners (`Session.steady()`): short of a near-certain hand, the hint never puts more than a quarter of your purse in by betting, raises once a round at most, and wants a clear edge before calling off a third of your purse. Math Mode's "good deal?" question uses the coach's share of the pot.

## How long they think

RSDP Live's bots stop by the clock (10 ms on its server). Here they deal a fixed number of finishes instead (`thinking()` in `personality.ts`): about 260 for most games, fewer for the slow many-card Omaha games (`simCost` in the game catalog). A fixed number means a seeded game replays exactly, which the tests need, and a phone is never asked for more than it can do. The coach deals three times as many (RSDP Live's coach also thinks longer than its bots).

## Local changes to the copy

Each is marked `HP:` in `src/bots/rsdp/strategy.ts`. `coach.ts` has none.

1. **`extraGames`** (and `specOf`, `deckOf`): a table of games RSDP Live does not have, used where the bot looks up a game's spec (`situation`), builds its deck (`Pool`, `drawFieldSize`) and scores a showdown (`potShare`).
2. **`BotContext.reads`**: scales `handReads`, and gives the read to a bot that is not Hard.
3. **`BotContext.see`**: the chance the betting rules are shown.
4. **`BotContext.dice`**: wraps the bot's dice.
5. **`BotContext.legal`**: the table's legal moves, where it adds a period rule (the 1876 agreed limit, stud with no bring-in).
6. **`bestDraw`**: deals in cards still to come when the hand is not all dealt yet (Primero).

Nothing else differs: the copy imports `@rsdp/engine` exactly as RSDP Live does.

## Updating the copy

1. Copy the two files from a newer RSDP Live commit over `src/bots/rsdp/`.
2. Make the `HP:` changes again (search the old copy for `HP:`; there are about ten lines) and put the note back at the top of each file.
3. If RSDP Live's engine changed too, update it first ([ENGINE.md](ENGINE.md)).
4. Run `npm run typecheck` and `npm test`, then the bot lab (`npx vite-node tools/bot-lab.ts`), and update the measured numbers in CHAPTERS.md if they moved.
5. Update the commit and date on this page.

## Files

- `src/bots/rsdp/`: the copy.
- `src/bots/games.ts`: teaches the bot the games RSDP Live lacks.
- `src/bots/personality.ts`: the character on top (`play()`), and how long the bot thinks (`thinking()`).
- `src/bots/random.ts`: the seeded random numbers the bots and tests use.
- `test/bots.test.ts`: the bot knows every game; historical showdowns score by their own rankings; a looser character bets more, a trapper checks, a non-bluffer never bluffs; RSDP's read stops believing a player who always bets; reckless styles lose; Silas, Delphine and Ezra stay themselves.
- `test/drawHabits.ts`: simple draw rules for the test players only. The rivals and hints don't use them.
