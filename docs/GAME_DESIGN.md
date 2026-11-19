# Game design: what is built

[GAME_OUTLINE.md](GAME_OUTLINE.md) is the full design of the game and the source of truth for story, chapters and characters. This page describes how the chapters that exist actually play, as coded, and the tuning numbers behind them. When the code and this page disagree, fix one of them.

## Chapter 1: The River (1836)

Code: `src/chapters/riverboat.ts` (story, rivals, tells, lines, art placement) and `src/games/straightPoker.ts` (the rules).

### Rules as coded

- **Deck:** 20 cards, ace, king, queen, jack and ten in four suits. Cards are drawn without corner numbers, as in the period.
- **Seats:** four. Seat 0 is the player (Kit Avery, never shown); seats 1 to 3 are Delphine, Silas and Ezra.
- **Each hand:** everyone puts in a $1 ante, all 20 cards are dealt five each, one betting round starts left of the buck, then the best hand still in takes the pot. There is no draw.
- **Hand ranks, best first:** four of a kind, full house, three of a kind, two pairs, one pair, high card. No straights or flushes. Ties are broken by the ranks that make the hand, then kickers (`evaluate1836`).
- **Betting:** pot-limit, minimum bet $2, everyone starts with $100. No-limit was tried first; simulated games often ended in one all-in hand, so pot-limit was chosen (see [DECISIONS.md](DECISIONS.md)).
- **Winning the chapter:** be the last player with money. **Losing:** run out of money. Rivals who run out leave the table with a parting line.

### Not built yet

From the outline's story beats: the scripted tutorial hand, Silas putting the deck on the table as a stake, Silas dealing seconds and Delphine calling it out, the heads-up finale with special staging, keepsake cards, saving progress, and the two difficulty levels. They are listed in [ROADMAP.md](ROADMAP.md).

## How the bots think

All rivals run the same code. What makes them different is a few numbers in their chapter file.

1. **Hand strength** (`src/bots/strength.ts`): the bot deals the unseen cards out at random a few hundred times and counts how often its hand wins (ties count as shares). This is its *equity*, 0 to 1.
2. **Decision** (`src/bots/personality.ts`, `decide()`): equity is compared with an average hand. `relative = equity × players in the hand`, so 1 is an average hand and 2 is twice as good.

| Number | Meaning |
| --- | --- |
| `valueAt` | How strong (`relative`) a hand must be to bet or raise for value. Lower is looser. |
| `bluff` | Chance to bet a hand that isn't strong when nobody has bet. Half of it is the chance to raise as a bluff when facing a bet. |
| `caution` | Extra equity, above the pot odds, demanded before calling. Negative means the bot calls too much. |
| `betSize` | Bet size as a share of the pot (bluffs are 80% of that). |
| `trap` | Optional. Chance to check a strong hand when nobody has bet, hoping to raise later. |

Facing a bet, the bot raises when `relative ≥ 1.25 × valueAt`, calls when its equity beats the pot odds plus `caution`, sometimes bluff-raises, and otherwise folds.

Chapter 1 numbers:

| Rival | valueAt | bluff | caution | betSize | trap | Plays like |
| --- | --- | --- | --- | --- | --- | --- |
| Silas Crane | 1.3 | 0.24 | -0.02 | 0.75 | | Loose and aggressive, bluffs often |
| Delphine Arceneaux | 1.6 | 0.07 | 0.03 | 0.6 | 0.5 | Tricky: traps strong hands, bluffs rarely |
| Ezra Hollis | 2.0 | 0 | 0.1 | 0.4 | | Tight and passive, never bluffs |

Bots use a seeded random generator (`src/bots/random.ts`) so tests can replay games. The deal itself uses the engine's crypto random source in the game.

## Tells

A tell is a habit that hints at a rival's hand. Each one has:

- `text`: what the player notices, shown near the rival ("He wipes his brow.").
- `signals`: what it is about: `bluffing`, `weak` or `strong`. A `bluffing` tell can only show when the rival bets or raises; the other two can show on any action.
- `showsWhenTrue` and `showsWhenFalse`: the chance it shows when the hand really is what it signals, and when it isn't.

The two chances together are the tell's reliability: when a tell shows, how likely is it to be true? The session (`src/table/session.ts`, `botStep`) rolls for it every time the rival acts.

| Rival | Tell | Signals | When true | When false | Story says |
| --- | --- | --- | --- | --- | --- |
| Ezra | Wipes his brow | weak | 0.6 | 0.07 | About 90% reliable, the tutorial tell |
| Silas | Smooths his mustache | bluffing | 0.7 | 0.3 | About 70% reliable |
| Delphine | Her fan snaps shut | strong | 0.4 | 0.4 | A coin flip: she fakes it |

## History notes

The history text in `riverboat.ts` (the intro, the "history" sheet and the rules panel) is written from general knowledge and must be checked against sources before release. Items to verify are listed in the outline's "History notes (to verify)" for each chapter.
