# Game design: what is built

[GAME_OUTLINE.md](GAME_OUTLINE.md) is the full design of the game and the source of truth for story, chapters and characters. This page describes how the game actually plays, as coded, and the tuning numbers behind it. Each chapter's cast and story beats are in [CHAPTERS.md](CHAPTERS.md). When the code and these pages disagree, fix one of them.

## The shape of the game

- **Chapter select** (the Ashcombe deck's leather case): one card per chapter in two rows, Part One and Part Two. Won chapters show the beaten rival's face (the keepsake); the next chapter glows; later ones say "Jump ahead". A first-time visitor goes straight to chapter 1's intro.
- **Intro:** the setting, who you play, what game is taught, the cast. If you jumped ahead, "The story so far" comes first.
- **The table:** one sitting of the chapter's games (below).
- **Ending:** the chapter's won or lost text, the keepsake, a "From the history book" note, and "On to" the next chapter. Losing offers "Try again". The last chapter links to RSDP Live.
- **Saved progress:** which chapters were started and won, and whether teacher hints are on, are kept in the browser's local storage (`src/progress/save.ts`). "Start over" clears them.

## How a chapter plays

Everything here is shared by every chapter and lives in `src/table/session.ts`. A chapter file only supplies data (`src/chapters/types.ts`).

### Four seats

Seat 0 is the player; seats 1 to 3 are the three rivals, sitting left, across and right. Everyone starts with the chapter's `startingStack`.

### Stages and games

A chapter is a list of **stages**, each starting at a hand number (`fromHand`). A stage lists one or more **games**, each a game id with a betting kind (no-limit, pot-limit or fixed-limit). With one game, every hand is that game. With several, they rotate, `handsPerGame` hands each (HORSE, the 8-Game, the Big O's Hi-Lo round). A stage can have an `opening` scene, a `label` shown under the game name, its own lighting (`scene`), house `extras` (bomb pots and so on), and `resetStacks` to give everyone a fresh starting stack (a tournament starting).

### Lessons

Each game in a stage can carry a **lesson**: the teacher's lines before it is first dealt, and optionally lines on each street of that first hand (`streets`, keyed by street number). A lesson plays once per game and betting kind in a sitting (Limit Hold'em and No-Limit Hold'em are taught separately). Lesson hands are dealt fairly: the teaching is in the words, not a set-up deal. Chapter 1's scripted tutorial hand is the only set deal (plus the visible cheats).

### Stakes, and the stakes going up

Each stage has one number, the **unit**. Every game turns it into its forced bets (`src/table/stakes.ts`):

| Forced bets | Used by | Ante | Blinds | Bring-in | Bets |
| --- | --- | --- | --- | --- | --- |
| Antes | Historical games, except stud | half a unit each | none | none | the unit is the minimum bet |
| Blinds | Hold'em, Omaha, 2-7 Triple Draw, Badugi | none | half a unit and one unit | none | limit: one unit, then two |
| Stud | Seven Card Stud, Razz, Stud Hi-Lo, five-card stud | a fifth of a unit | none | a third of a unit | limit: one unit, then two |

If a chapter sets `levelEvery`, the unit rises by half every that many hands (rounded: 10, 15, 23, 34…), with the chapter's `levelLines` and "The stakes are now…". Money is shown with the chapter's `money` prefix or suffix ($, £, HK$, F, s).

### Buy-backs, and when broke means out

Until the chapter's **last stage** begins, a player who runs out of money buys back in for a fresh starting stack, so everyone reaches every lesson. This includes the player. From the last stage on, broke means out: rivals leave with their bust line, and if you run out, the chapter is lost. Chapters with one stage are played for keeps from the first hand. Money bought in is tracked (`boughtIn`) so tests can check every chip is accounted for.

### The stake, the cheat and the finale

- **The stake** (optional): after the player wins a few pots or after a set hand, the nemesis puts something on the table (the Ashcombe deck, a watch, a ship's berth, a diary). From then on you win the chapter by taking the last chips of whoever holds it. If the nemesis goes broke to another rival first, the stake passes to them.
- **No stake:** you win by being the last player with chips.
- **The cheat** (chapters 1 and 5): one rival deals themselves a set hand once, with a tell and a decoy. A "Call out the deal" chip appears on every hand they deal until it is settled. See chapter 1 below for the details, which chapter 5 shares.
- **Moments:** scenes before a set hand ("orders arrive").
- **The finale:** once the last stage has begun (and the stake is up, if there is one), and only you, the nemesis and one other rival remain, that rival bows out with their money if the chapter gives them a bow-out scene. Then it's heads-up.

### House extras (the epilogue)

Set per stage in `extras`: a **bomb pot** every N hands (everyone puts in N units, no betting before the flop), dealt on **two boards** if `doubleBoardOnBombPots` (half the pot per board), and the **7-2 bounty** (win a pot with seven-deuce and everyone pays you N units). These use RSDP Live's own engine options and modifiers.

### Help at the table

- **The rules object:** a corner link named for the era ("The tavern slate", "The help screen") opens the current game's rules card: the deal, the betting, what wins, plus how to win the chapter and a history note. Rules cards are in `src/games/catalog.ts`.
- **Teacher hints:** "Ask for a hint" (on by default, can be turned off on the chapter select). The chapter's teacher suggests fold, call or raise in one line, with your chance of winning and the pot odds, from the same simulation the bots use.
- **Your hand:** your best hand's name (and best low, in split games) shows under your cards.
- **Showdown summary:** one line after each hand: who won, with what, and your hand if you lost. Split pots say who took the high and the low.
- **Drawing:** in draw games, click cards to throw them (they lift), then "Draw N" or "Stand pat". The chip says what is not allowed (more than the limit).

### Sound and motion

- **Motion:** cards fly in from whoever holds the buck, one at a time, and turn over when shown; antes and bets slide from the seat to the pot; the pot slides to the winner when the hand ends, and "wins $N" pops up. Lines of dialogue fade in. Anyone whose system asks for reduced motion gets none of this.
- **Sound effects:** a swish per card dealt, a flip for board cards, a riffle when you draw, a clack of chips for a bet (a bigger one for all in), two knocks for a check, a soft swish for a fold, chips gathering for a pot, a flourish with a little bell when you take a good pot, a low two-note sigh when you lose a showdown, and a quiet bell when it's your turn. All made in code (`src/ui/sound.ts`), no recordings.
- **Music:** each chapter (or stage) can name a looping music file; none are in the game yet ([ART.md](ART.md), "Music").
- **Switches:** "Sound on/off" in the table's corner links; Sound and Music boxes on the chapter select. Saved with your progress.

### Phones and tablets

- **Sideways:** the table is a wide painting, so on a phone it's played sideways. Held upright, the phone shows "Turn your phone sideways" (with "Play upright anyway").
- **Bigger words and chips:** when the screen draws the table at less than three quarters size, names, money, dialogue, links and chips are enlarged (up to 1.6 times) while the painting stays the same. The pot then sits up between the left and middle seats in every game (it always does in flop games, where the board has the middle of the felt).
- **Full screen:** added to the home screen, the game opens full screen and sideways (`public/manifest.webmanifest`).

## The games

| Game | Code | Deck | Deal and betting | What wins |
| --- | --- | --- | --- | --- |
| Primero (1543) | `src/games/primero.ts` | 40 (no 8s, 9s, 10s) | 2 down, bet, 2 down, bet, change up to 2 once, bet | chorus > fluxus > supremus > primero > numerus; points break ties |
| Brag (1763) | `src/games/brag.ts` | 52 | 3 down, one betting round | prial (3s best) > running flush > run (A-2-3 best) > flush > pair > high |
| Poque (1817) | `src/games/poque.ts` | 32 (7 to ace) | 5 down, one betting round | fours > triplets > two pairs > pair > nothing; no straights or flushes |
| Straight poker (1836) | `src/games/straightPoker.ts` | 20 (10 to ace) | 5 down, one betting round | see chapter 1 |
| Five-card stud (1863) | `src/games/fiveCardStud.ts` | 52 | 1 down 1 up, bet; then 3 more up, bet each | standard high hands; lowest card up brings in, best hand showing acts first |
| Five-card draw (1876) | `src/games/fiveCardDraw.ts` | 52 | 5 down, bet, draw up to 3 (4 keeping an ace), bet | standard high hands |
| RSDP Live's 12 games | `packages/engine` | 52 | as in RSDP Live | as in RSDP Live |

The historical rules are our playable reconstructions; old sources disagree, and the rules cards say so. Every game, old or new, is registered in `src/games/catalog.ts`.

## Chapter 1: The River (1836)

Code: `src/chapters/riverboat.ts` (story, rivals, tells, lines, art placement) and `src/games/straightPoker.ts` (the rules).

### Rules as coded

- **Deck:** 20 cards, ace, king, queen, jack and ten in four suits. Cards are drawn without corner numbers, as in the period.
- **Seats:** four. Seat 0 is the player (Kit Avery, never shown); seats 1 to 3 are Delphine, Silas and Ezra.
- **Each hand:** everyone puts in a $1 ante, all 20 cards are dealt five each, one betting round starts left of the buck, then the best hand still in takes the pot. There is no draw.
- **Hand ranks, best first:** four of a kind, full house, three of a kind, two pairs, one pair, high card. No straights or flushes. Ties are broken by the ranks that make the hand, then kickers (`evaluate1836`).
- **Betting:** pot-limit, minimum bet $2, everyone starts with $100. No-limit was tried first; simulated games often ended in one all-in hand, so pot-limit was chosen (see [DECISIONS.md](DECISIONS.md)).
- **Winning the chapter:** take the Ashcombe deck: win the last chips of whoever has it staked (normally Silas, heads-up at the end). If the deck is never staked, being the last player with money also wins. **Losing:** run out of money. Rivals who run out leave the table with a parting line.

### Story beats

The words are in `story` in `src/chapters/riverboat.ts`; when each beat happens is decided in `src/table/session.ts` (`Session`). While a scene plays, nobody acts and the player clicks Continue through it. The beats, in the order a player usually meets them:

1. **Tutorial hand.** Before the first deal Delphine explains the 20-card deck and the hand ranks. The first hand is dealt from a set deck (`story.tutorial.hands`): you get two pairs, kings and queens; Ezra gets ace high. Ezra's tell always shows the first time he acts in that hand, and Delphine points it out. This is the only hand dealt from a set deck that the player isn't told about.
2. **The stake.** After the player has won 2 pots, or after hand 5, whichever is first, Silas puts the deck on the table. A leather case sits beside his name from then on. Delphine hints: watch his hands when he deals.
3. **The cheat.** On each hand Silas deals after the stake, there is a 50% chance he deals himself four aces; by his 3rd deal he always does. When he cheats, the tell "His thumb lingers on the top card as he deals..." shows. On half his honest deals a decoy shows instead ("He shuffles with a showman's flourish."), so the player has to tell them apart.
   - On any hand Silas deals, until the cheat is settled, a red **Call out the deal** chip appears.
   - Right call: Delphine backs you, the hand is called off (everyone's money goes back, antes included) and Silas deals again. He plays straight from then on.
   - Wrong call: Silas takes a $5 fine from you when the hand ends. One accusation per hand.
   - Missed: if the cheat hand finishes without a call, Delphine explains what happened afterwards, and he doesn't try again.
4. **Exits.** A rival who goes broke says their bust line; Ezra also gets a comic exit.
5. **Heads-up finale.** Once the deck is staked and only you, Silas and one other remain, that rival (Delphine or Ezra) bows out with their money and watches, dimmed. You play Silas heads-up for the deck.
6. **If the deck changes hands.** If Silas goes broke to another rival, the deck passes to them and you win it by taking their last chips. If Silas goes broke before staking it, it goes to whoever took his last chips.

### Not built yet

The two difficulty levels and an optional "tell spotted" hint. They are listed in [ROADMAP.md](ROADMAP.md).

## How the bots think

All rivals run the same code. What makes them different is a few numbers in their chapter file.

1. **Hand strength** (`src/bots/strength.ts`): the bot deals the unseen cards out at random a few hundred times and counts how often its hand wins (ties count as shares). This is its *equity*, 0 to 1.
2. **Reading the betting** (also `strength.ts`, `pressure`): a player who bets is more likely to be ahead, so each simulated deal where an opponent who bet this hand beats the bot counts extra. How much extra is `1 + respect × (their bets and raises this hand, up to 3) × how believable they are`. A bet from a rival who bluffs a lot is believed less. Your bets are believed less the more often you bet tonight, but only by rivals who read people (`reads`). Against someone who bets nearly every time, a rival who reads well counts your bets as *weaker* than a random hand, and calls you down.
3. **Decision** (`src/bots/personality.ts`, `decide()`): equity is compared with an average hand. `relative = equity × players in the hand`, so 1 is an average hand and 2 is twice as good.

| Number | Meaning |
| --- | --- |
| `valueAt` | How strong (`relative`) a hand must be to bet or raise for value. Lower is looser. |
| `bluff` | Chance to bet a hand that isn't strong when nobody has bet, heads-up against two players. It's 1.4 times that against one player, about half against three. Half of it is the chance to raise as a bluff when facing a bet. |
| `caution` | Extra equity, above the pot odds, demanded before calling. Negative means the bot calls too much. |
| `betSize` | Bet size as a share of the pot (bluffs are 80% of that). |
| `trap` | Optional. Chance to check a strong hand when nobody has bet, hoping to raise later. |
| `respect` | Optional, 0 to 1 (default 0.6). How much a bet scares them. Timid players near 1, reckless ones near 0.3. |
| `reads` | Optional, 0 to 1 (default 0.5). How fast they size you up. The sharp players are 0.9 to 1; the naive ones 0.1 to 0.3. |
| `tilt` | Optional temper, 0 to 0.3 (default none). After losing a quarter of a starting stack in one hand, for three hands they add `tilt` to `bluff`, take it from `valueAt` and half of it from `caution`. A line appears by them ("Silas is still smarting from that last pot."), so you can punish it. |

Facing a bet, the bot raises when `relative ≥ 1.25 × valueAt`, calls when its equity beats the pot odds plus `caution`, sometimes bluff-raises, and otherwise folds.

Bots in every game also see the cards showing (stud up-cards, the board) and simulate the cards still to come and their own draws. A game's `simCost` sets how many deals are simulated, so slow games (many-card Omaha) stay fast. The teacher's hints use the same reading of the betting.

Chapter 1 numbers (every other chapter's are in its file; [CHAPTERS.md](CHAPTERS.md), "How the rivals play", lists them all with measured play):

| Rival | valueAt | bluff | caution | betSize | trap | respect | reads | tilt | Plays like |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Silas Crane | 1.3 | 0.24 | -0.02 | 0.75 | | 0.35 | 0.6 | 0.12 | Loose and aggressive, bluffs often, steams after a big loss |
| Delphine Arceneaux | 1.6 | 0.07 | 0.03 | 0.6 | 0.5 | 0.6 | 0.9 | | Tricky: traps strong hands, bluffs rarely, sees through a bully |
| Ezra Hollis | 2.0 | 0 | 0.1 | 0.4 | | 0.95 | 0.1 | | Tight and passive, never bluffs, folds to any bet |

### Is it too easy? The bot lab

`npx vite-node tools/bot-lab.ts [chapter-id] [hands]` plays each chapter with four stand-ins in your seat and prints how they did and how each rival played (`test/standIns.ts` has the stand-ins):

- **station** checks and calls everything; **maniac** raises the most it can every time; **aggro** bets about the pot whenever it can; **teacher** follows the hint.

The aim (2026-11-20 tuning, 300 hands a chapter): every reckless style loses steadily in every chapter (station about 80 to 360 units per 100 hands, maniac and aggro 80 to 1,300), and a careful player following the hints comes out roughly even (-70 to +60). Beating a chapter takes more than playing safe: watching tells, catching a rival on tilt and changing gear. `test/bots.test.ts` checks the reckless styles lose in chapters 1 and 4 and that Silas, Delphine and Ezra stay recognisably themselves. Run the lab after changing any personality or anything in `src/bots/`, and update the numbers here.

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

Every chapter's rivals and tells are in its file and summarised in [CHAPTERS.md](CHAPTERS.md). The Boom's online tells are about timing and chat, as the outline asks, but they work the same way.

## History notes

The history text in every chapter (the intro, the "From the history book" notes and the rules cards) is written from general knowledge and must be checked against sources before release. Items to verify are listed in the outline's "History notes (to verify)" for each chapter.
