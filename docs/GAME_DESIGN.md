# Game design: what is built

[GAME_OUTLINE.md](GAME_OUTLINE.md) is the full design of the game and the source of truth for story, chapters and characters. This page describes how the game actually plays, as coded, and the tuning numbers behind it. Each chapter's cast and story beats are in [CHAPTERS.md](CHAPTERS.md). When the code and these pages disagree, fix one of them.

## The shape of the game

- **The opening** (first visit only): six paintings of the Avery and Crane feud, one wiping into the next, then the title and "Take a seat". See "The opening and the ending" below.
- **Chapter select** (the Ashcombe deck's leather case): one card per chapter in two rows, Part One and Part Two. Every card names the game it teaches. Won chapters show the beaten rival's face (the keepsake) and a green "Won" ribbon; a chapter left part-way shows a red "At hand 12" ribbon; the chapter you'd continue glows; chapters you haven't reached are face down but open like any other (after "the story so far"). "Continue" goes straight back to the table you left most recently, or to the next chapter's intro if there is none. The game always opens here, first visit included ("Begin the story" opens chapter 1), so a friend can go straight to the game they want to learn.
- **Intro:** the setting, who you play, what game is taught, the cast. If you jumped ahead, "The story so far" comes first.
- **The table:** one sitting of the chapter's games (below).
- **Ending:** the chapter's won or lost text, the keepsake, a "From the history book" note, and "On to" the next chapter. Losing offers "Try again". Winning the last chapter leads to "How it all ends": the ending pictures and the credits, which link to RSDP Live.
- **Practice** ("Practice any game" on the chapter select): any game the story teaches, on its own, outside the story. See "Practice" below.
- **Saved progress:** which chapters were started and won, and the hints, sound and music switches, are kept in the browser's local storage (`src/progress/save.ts`). No account: another browser or device starts fresh, and clearing the browser's data resets it.
- **Leaving part-way:** after every hand the table is saved for that chapter: money, the buck, the stage and stakes, which lessons were given, story beats already played (the stake, the cheat, the finale), and any scene still to read. Leaving the table, closing the tab or reloading the page loses at most the hand in play. Opening that chapter again offers "Back to the table (hand 12)" or "Start the chapter over". Each chapter keeps its own table, so a friend can leave Brag half-way, try Omaha, and come back. Finishing a chapter (won or lost) or "Play this chapter again" clears its table. "Start over" on the case clears everything.

### The opening and the ending

The story is a family feud with a happy ending, and the game frames it in pictures at both ends (John asked for both, 2026-11-21). The slides and captions are data in `src/story/montages.ts`; `src/ui/Montage.tsx` shows them.

- **The opening** plays before the chapter select on the first visit. Six moments of the feud: a young knight named Crane losing the deck he was promised, in 1543; Silas Crane cheating an Avery out of it three hundred years later, and Kit coming aboard to win it back; Jasper Crane riding into Deadwood; the lawyers' letters; a silent stranger at an Avery's table in 2005; and today, "nearly five hundred years of bad blood". It names no Crane after 1876 and says nothing about the stranger, not even "he" or "she", so it does not give away who "N0rthStar" is. Its music is the riverboat's.
- **The ending** plays after the epilogue is won ("How it all ends"). The same moments again, seen kindly: Silas, who told his grandchildren the luck had gone downriver; Jasper, raised on one story; the letters, politer every decade; Nat's handshake; then the wedding and the deck with two names in its lid. Then the credits: the title, "Powered by RSDP Live!", and a chip to start a game on RSDP Live. Its music is the kitchen table's.
- **How it moves:** each painting is uncovered from the left over the one before (1.4 seconds), with its place and year and one caption on a shaded strip along the bottom. It moves on by itself after 8 seconds; a press, Space, Enter or the right arrow moves on at once; "Skip" (or Escape) jumps out. People who ask their device for less motion get the pictures without the wipe.
- **Watching again:** "Watch the opening" is always under the chapter select; "Watch the ending" joins it once the epilogue is won. After "Start over", the opening plays by itself again on the next visit.
- **Art:** every slide should end up with its own painting ([ART_PROMPTS.md](ART_PROMPTS.md), "The opening and the ending"). Until then a slide borrows a chapter painting that fits, or shows a lamplit empty table in the right colours.
- **Every caption must match the chapters.** If a chapter's story changes, check the captions against it.

### The order of the story

The story opens in 1836, on the riverboat, because that is the first game called poker. The deck's older past (1543, 1763) is then told by Delphine, at that same table, before the story moves forward to 1863 and on to today. So that nobody takes the jump back for a mistake, a chapter that goes back in time is labelled as a tale ("Delphine's tale") on its chapter-select card and intro screen, its text begins and ends with her telling it, and the chapter select's Part One heading spells the order out. See [CHAPTERS.md](CHAPTERS.md), "Chapters that go back in time".

## How a chapter plays

Everything here is shared by every chapter and lives in `src/table/session.ts`. A chapter file only supplies data (`src/chapters/types.ts`).

### Four seats

Seat 0 is the player; seats 1 to 3 are the three rivals, sitting left, across and right. Everyone starts with the chapter's `startingStack`.

### Stages and games

A chapter is a list of **stages**, each starting at a hand number (`fromHand`). A stage lists one or more **games**, each a game id with a betting kind (no-limit, pot-limit, fixed-limit, or the 1800s agreed limit, `spread-limit`; see "Period rules" below). With one game, every hand is that game. With several, they rotate, `handsPerGame` hands each (HORSE, the 8-Game, the Big O's Hi-Lo round). A stage can have an `opening` scene, a `label` shown under the game name, its own lighting (`scene`), house `extras` (bomb pots and so on), and `resetStacks` to give everyone a fresh starting stack (a tournament starting).

### Period rules

John's rule (2026-11-21): **every game is played by the rules of the year its chapter is set in**, including how it is bet, what is forced, and who speaks first. Sources are in [HISTORY_SOURCES.md](HISTORY_SOURCES.md), "Period rules"; where history is unsure the best-supported rule is used and listed there as an open pick.

| Years | Betting | Why |
| --- | --- | --- |
| 1543 to 1863 (Primero, Brag, Poque, straight poker, five-card stud) | **Table stakes** (`no-limit`): any amount in front of you | No source for these games gives a limit. Primero players spoke of wagering their whole "rest". Pot-limit is a 1900s idea and the four-bet fixed limit a card room's. |
| 1876 (five-card draw) | **The agreed limit** (`spread-limit`): any bet or raise from the minimum up to the table's limit (5 units: $20 at the start), no cap on the number of raises | Draw poker of the rule-book years was played to a limit the table agreed. |
| 1926 on | The modern kinds, as each game was played | Limit stud; limit and no-limit Hold'em; pot-limit Omaha; limit draw games. |

The engine has no agreed limit, so the table runs `spread-limit` on the engine's no-limit betting and lowers the ceiling itself (`legalFor` in `src/table/session.ts`). The same place handles stud with no bring-in. The engine's copy is unchanged.

Not played, and said so on the rules cards: Brag's other two stakes (best card turned up, and thirty-one), Poque's other two parts, and jack pots.

### Lessons

Each game in a stage can carry a **lesson**: the teacher's lines before it is first dealt, and optionally lines on each street of that first hand (`streets`, keyed by street number). A lesson plays once per game and betting kind in a sitting (Limit Hold'em and No-Limit Hold'em are taught separately). Lesson hands are dealt fairly: the teaching is in the words, not a set-up deal. Chapter 1's scripted tutorial hand is the only set deal (plus the visible cheats).

### Stakes, and the stakes going up

Each stage has one number, the **unit**. Every game turns it into its forced bets (`src/table/stakes.ts`):

| Forced bets | Used by | Ante | Blinds | Bring-in | Bets |
| --- | --- | --- | --- | --- | --- |
| Antes | Primero, Brag, Poque, straight poker | half a unit each | none | none | the unit is the minimum bet |
| The age (`age`) | Five-card draw, 1876 | half a unit, from the player left of the dealer only, blind | none | none | a unit to come in (double the ante); the age makes good last |
| Stud, no bring-in (`stud-open`) | Five-card stud 1863, Seven Card Stud and Razz 1926 | a fifth of a unit | none | none: the best hand showing opens every round and may check | the unit is the minimum bet (1863); limit: one unit, then two (1926) |
| Blinds | Hold'em, Omaha, 2-7 Triple Draw, Badugi | none | half a unit and one unit | none | limit: one unit, then two |
| Stud | Seven Card Stud, Razz, Stud Hi-Lo from the casino years on | a fifth of a unit | none | a third of a unit | limit: one unit, then two |

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

- **The rules object:** a corner link named for the era ("The tavern slate", "The help screen") opens the current game's rules sheet, in three short pages:
  - *The rules:* how a hand goes; the betting in words (antes, blinds or bring-in; what fold, check, call and raise mean; what no limit, pot limit or limit allows); the hands, best first; and any house extras in play (bomb pots, two boards, the 7-2 bounty).
  - *Playing it well:* three to five tips for someone who has just learned the game, and the easy mistakes new players make in it.
  - *This chapter:* how to win it, and the history book.
  Rules cards are in `src/games/catalog.ts`; tips, mistakes and the betting words in `src/games/guide.ts`.
- **Teacher hints:** "Ask for a hint" (on by default, can be turned off on the chapter select). The game's teacher names your hand, says how big a share of the pot a hand like yours takes against this many players (the same simulation the bots use), and, when there is a bet to call, what the call costs and the share it needs to pay ("Calling costs $2 to win $6, so it pays if you take more than 25%"). Then fold, check, call, bet or raise. In a draw, they say which cards they'd keep. Under the line, in smaller gold italic, a reminder about this game and betting round (from `coach` in `guide.ts`); asking again on the same round gives the next one, so hints teach the game as you play. The teacher is steadier than the bots so a beginner isn't led into a raising war (`Session.steady` and `teacherAdvice`): your chance is marked down by a fifth for every raise a player still in has made (`RAISE_DISCOUNT`); short of a near-certain hand (85%, `NUTS`) the teacher won't bet or raise more than a quarter of your purse into one pot (`STEADY_SHARE`), raises once a round at most, and wants 12 points more than the pot odds before calling a third of your purse (`BIG_CALL`). Once only two players are left at the table, the teacher plays it straight.
- **Your hand:** your best hand's name (and best low, in split games) shows under your cards.
- **Between hands:** the finished hand stays on the felt, described by its own game, while the next game's name (and its lesson, in a rotation) is already shown at the top.
- **Calling out the deal:** the "Call out the deal" chip sits above the other chips.
- **Showdown summary:** one line after each hand: who won, with what, and your hand if you lost. Split pots say who took the high and the low.
- **Drawing:** when it's your turn to draw, "The draw" is announced over the felt with the limit in words (and "1 of 3" in triple-draw games), and your cards bob to show they can be picked. Pick cards to throw them (they lift), then "Draw N" or "Stand pat". The chip says what is not allowed (more than the limit).
- **Purses:** during a hand every purse shows what is left after antes and bets, not what it was at the deal.

### Math Mode

A switch for young players learning math, **off by default** so the game stays uncluttered: the "Math Mode" checkbox on the chapter select, or the "Math on / Math off" corner link at any table (story or practice). It is saved with the other settings. When it is on, a sum made from the hand being played appears on the dialogue strip each time it is the player's turn to bet. Answering is optional: the betting chips stay live, and acting moves on. A right answer earns a star; the count shows beside "Math question" and on the chapter select. Money words are used as in the rest of the game (John's call, 2026-11-21). The code is `src/math/index.ts` (the sums) and `src/ui/MathStrip.tsx` (the strip).

Two kinds of question in this first version:

- **Counting outs.** "One more card is coming. You have a pair now. How many of the cards you can't see would make it a better kind of hand?" Four numbers on small chips to pick from. After the answer, the deck is laid out on the felt by suit: cards the player can see (their own, the board, face-up cards in other hands) are gaps, the helpful cards glow, and the working is given as a fraction: "6 of the 47 cards you can't see help you... 6/47, about 1 in 8, or 13%".
  - A card *helps* when it makes the hand a better **kind** of hand (high card to a pair, four hearts to a flush). In a game with a board, a card that gives everyone the same kind of hand doesn't count (the board pairing when you hold nothing).
  - Asked only where the count is clean: games won by the best high hand (Hold'em, the Omahas, Seven Card Stud, five-card stud), when exactly one card comes next (the turn or river, the next stud card), with one board, and at least one card helps. Not in low or split games, draw games, or the old games with no card to come.
- **A good deal?** Asked whenever there is a bet to call, in every game. "The pot holds $12. Calling costs you $4. A hand like yours wins about 40 times in 100. Is calling a good deal?" The pot and the price are drawn as two stacks of chips, and the answers are "Good deal" and "Bad deal". The working: "$4 of the $16 in the pot is yours. 4/16 = 1/4, which is 25%... 40% is more than 25%... a good deal. Card players call this pot odds."
  - The winning chance is the teacher's estimate, the same number a hint gives (`Session.teacherAdvice`).
  - Within 4 percentage points (`CLOSE`) the deal is "too close to call" and either answer earns the star.

When both apply, outs is asked first and "Next question" brings the deal. A story scene or a hint takes the strip while it shows.

Ideas not built yet are in [ROADMAP.md](ROADMAP.md).

### Sound and motion

- **Motion:** cards fly in from whoever deals (the seat with the buck or the button), one at a time, and turn over when shown; antes slide from the seat to the pot; blinds and bets slide onto the felt in front of the seat and stay there, with their amount (and "small blind", "big blind" or "blind ante" while a blind is untouched), until the betting round ends and they are swept into the pot; the pot slides to the winner when the hand ends, and "wins $N" pops up. Lines of dialogue fade in. Anyone whose system asks for reduced motion gets none of this.
- **Sound effects:** a swish per card dealt, a flip for board cards, a riffle when you draw, a clack of chips for a bet (a bigger one for all in), two knocks for a check, a soft swish for a fold, chips gathering for a pot, a flourish with a little bell when you take a good pot, a low two-note sigh when you lose a showdown, and a quiet bell when it's your turn. All made in code (`src/ui/sound.ts`), no recordings.
- **Music:** every chapter has its own original loop in the sound of its era (a steamboat waltz, a Tudor galliard, a speakeasy stomp, a Paris musette, a Macau night...), quiet under the table, fading between chapters ([MUSIC.md](MUSIC.md)).
- **Switches:** "Sound on/off" and "Music on/off" in the table's corner links, "Music on/off" on the intro and ending, and Sound and Music boxes on the chapter select. Saved with your progress.

### Phones and tablets

- **Sideways:** the table is a wide painting, so on a phone it's played sideways. Held upright, the phone shows "Turn your phone sideways" (with "Play upright anyway").
- **Where things sit on the felt:** the pot, the dealer's marker, the bets and the board are always drawn on the felt, never on the painted rim. The pot sits in the middle, below the seat across; in flop games it sits between that seat and the board, so the board is a little lower and your own cards a little smaller. On small screens the enlarged name plates leave no room above the board, so in flop games the pot sits on the felt between the left and middle seats. The spots are `potSpot()` in `src/ui/useTableFx.ts`; check them against every chapter's painting when they change.
- **The dealer's marker:** each chapter shows what its room and year would have had (`dealerMarker` in the chapter file; a stage can set its own): the buck, a knife, in the 1800s American chapters and the 1926 back room; a white "DEALER" button in the card rooms and at the kitchen table; a disc with a "D" on the Boom's poker site; and nothing at all for Primero, Brag and Poque, where no marker is recorded, or for stud in a card room, where the house dealer deals. Your own line says "you hold the buck", "you have the button" or "you deal" to match. The rules sheets of the modern games say "dealer button". Where the house deals (`houseDeals` on the chapter: the card rooms and the poker site, not the kitchen table), cards come from the middle of the table, not from a player's seat, and the rules sheet adds a line: the house deals, and the button only marks whose turn it would be. Sources and how sure each choice is: [HISTORY_SOURCES.md](HISTORY_SOURCES.md), "The dealer's marker".
- **Pot limit shows its sum:** in pot-limit games a line above the chips gives the working behind the biggest raise allowed, for example "Pot limit: pot 30 F + your call 20 F = 50 F, so you can raise by 50 F, to 70 F." (`potLimitWords()` in `src/table/stakes.ts`). It is left out when the pot is not what limits you (your purse is smaller).
- **Corner links:** the links in the top right sit on a soft shadow that fades into the painting (no edge, not a panel), so they read over lamps and bright art.
- **Bigger words and chips:** when the screen draws the table at less than three quarters size, names, money, dialogue, links and chips are enlarged (up to 1.6 times) while the painting stays the same. The pot stays on the felt (see "Where things sit on the felt" below).
- **Room for your cards:** on small screens your hand name and your purse sit on two lines under your cards, the raise's "−, +, Max" stand in a column beside the raise chip, and the draw note sits beside the Draw chip, so nothing covers your cards or the right-hand seat. A long showdown line grows upward from above the seat across, and in flop games the board sits a little lower so the seat across can show its hand.
- **Story screens start at the top:** the intro and ending scroll on a phone; they open at the first line, not at the button. On a computer they never scroll: a long one is drawn a little smaller so all of it, button included, fits the screen.
- **Full screen:** added to the home screen, the game opens full screen and sideways (`public/manifest.webmanifest`).

## Practice

The outline's Free Play, built for John's friends to learn any RSDP Live game risk-free (`src/practice/index.ts`, `src/ui/PracticeScreen.tsx`).

- **The list** is the deck case again, with one small card per game, in four groups: the old games (by date), Hold'em and Omaha, stud and draw, and mixed games and house rules. It is built from the chapters, not written by hand: every game and betting the story deals is one card (20 of them, including Limit Omaha Hi-Lo from HORSE), plus HORSE, the 8-Game and the epilogue's Home Game (bomb pots on two boards, the 7-2 bounty). A chapter added later appears by itself.
- **Where it's played:** at the table of the first chapter that teaches the game, with that chapter's room, music, rivals and stake unit, and its teacher giving the hints. Razz is at the Back Room with Nora; Primero in the great hall with Brother Anselm.
- **The lesson** ("Nora explains it first", on by default): before the first hand the teacher reads out the game's rules card (how a hand goes), plus one line on the betting (limit, pot limit or no limit) for the modern games. The chapter's own street-by-street remarks then guide that first hand. The rules card is used rather than the chapter's lesson because chapter lessons lean on the story ("Same game, but no limit", "It's a tournament"). Mixed games use the chapter's own short lessons (Mei Lin's one-liners), borrowing the HORSE ones for the 8-Game's first five games. Straight poker has no lesson (chapter 1 teaches it with its scripted tutorial hand, which practice doesn't use), so it has no checkbox.
- **The table:** one stage, steady stakes (no rises), no story beats, no stake, cheat or finale. Nobody is ever knocked out: anyone who runs out, you included, buys back in for a fresh starting stack. The rules object, hints, sound and the rest work as in a chapter. "Leave the table" goes back to the practice list with the same game picked.
- **Nothing is saved.** Practice doesn't count as starting or winning a chapter. Practice tables have ids starting `practice:` and `practice: true` on their Chapter.
- **Open to everyone.** The outline first unlocked Free Play after the Part One finale; John agreed to open it from the start, because every chapter can already be opened at once and the point is letting friends go straight to a game ([DECISIONS.md](DECISIONS.md)).

## The games

| Game | Code | Deck | Deal and betting | What wins |
| --- | --- | --- | --- | --- |
| Primero (1543) | `src/games/primero.ts` | 40 (no 8s, 9s, 10s) | 2 down, bet, 2 down, bet, change up to 2 once, bet | chorus > fluxus > supremus > primero > numerus; points break ties |
| Brag (1763) | `src/games/brag.ts` | 52 | 3 down, one round of bragging; table stakes | pair royal (aces best) > pair > high card; the knave of clubs and nine of diamonds are wild ("braggers") and a natural hand beats the same hand made with one; no runs or flushes |
| Poque (1817) | `src/games/poque.ts` | 32 (7 to ace) | 5 down, one betting round; table stakes | fours > threes > pair > nothing; a second pair only breaks ties; no straights or flushes |
| Straight poker (1836) | `src/games/straightPoker.ts` | 20 (10 to ace) | 5 down, one betting round; table stakes | see chapter 1 |
| Five-card stud (1863) | `src/games/fiveCardStud.ts` | 52 | 1 down 1 up, bet; then 3 more up, bet each; everyone antes, no bring-in, the best hand showing opens every round and may check; table stakes | the 1864 list (`src/games/hands1864.ts`): fours > full house > flush > threes > straight > two pairs > pair; no straight flush |
| Five-card draw (1876) | `src/games/fiveCardDraw.ts` | 52 | the age antes blind; 5 down, bet (double the ante to come in), draw up to 5, bet (left of the age first); an agreed limit on each bet or raise, no cap on raises; no jackpots | standard high hands |
| Seven Card Stud and Razz (1926) | `src/games/catalog.ts` (`stud-1926`, `razz-1926`) | 52 | RSDP Live's games with no bring-in: everyone antes, the best hand showing (Razz: the lowest) opens every round; fixed limit | as in RSDP Live |
| RSDP Live's 12 games | `packages/engine` | 52 | as in RSDP Live | as in RSDP Live |

The historical rules are our playable reconstructions; old sources disagree, and the rules cards say so. Every game, old or new, is registered in `src/games/catalog.ts`.

## Chapter 1: The River (1836)

Code: `src/chapters/riverboat.ts` (story, rivals, tells, lines, art placement) and `src/games/straightPoker.ts` (the rules).

### Rules as coded

- **Deck:** 20 cards, ace, king, queen, jack and ten in four suits. Cards are drawn without corner numbers, as in the period.
- **Seats:** four. Seat 0 is the player (Kit Avery, never shown); seats 1 to 3 are Delphine, Silas and Ezra.
- **Each hand:** everyone puts in a $1 ante, all 20 cards are dealt five each, one betting round starts left of the buck, then the best hand still in takes the pot. There is no draw.
- **Hand ranks, best first:** four of a kind, full house, three of a kind, two pairs, one pair, high card. No straights or flushes. Ties are broken by the ranks that make the hand, then kickers (`evaluate1836`).
- **Betting:** table stakes (the engine's no-limit), minimum bet $2, everyone starts with $100. It was pot-limit until 2026-11-21; pot-limit is a 1900s idea, and the first accounts of the game give no limit at all (see "Period rules" and [DECISIONS.md](DECISIONS.md)).
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

Every rival thinks with **RSDP Live's practice bot**, copied into `src/bots/rsdp/`, and every hint comes from RSDP Live's coach. [BOTS.md](BOTS.md) says exactly what is RSDP's and what is this game's. In short:

1. **RSDP's bot sizes up the hand.** It deals the unseen cards out a few hundred times and counts how much of the pot its hand wins (its *equity*, 0 to 1). With draws to come it tries every way to draw. It sees only what a player in its seat could see. For the games RSDP Live doesn't have, `src/bots/games.ts` teaches it the deck and the hand ranking; the thinking is the same.
2. **It reads the betting** (`handReads`): every bet or raise an opponent made this hand deals them stronger cards in the bot's imagination. A player who bets nearly every time is believed less. RSDP keeps a record of how often each player bets and how often they fold to a bet (`readPlayers`); the Session keeps it for the whole sitting.
3. **It bets by one of RSDP's three levels.** Easy calls small bets with almost anything, bets only good hands and never bluffs. Normal plays the pot odds with a small margin. Hard also follows your draws, uses position, and bluffs players who fold a lot.
4. **The character bends it** (`src/bots/personality.ts`, `play()`), with a few numbers in their chapter file:

| Number | Meaning |
| --- | --- |
| `level` | RSDP's level: `easy`, `normal` or `hard`. This is a teaching game: Part One is mostly Easy, Part Two mostly Normal, and only two late bosses are Hard ([BOTS.md](BOTS.md), "Levels"). |
| `valueAt` | How strong a hand must be to bet for value when nobody has bet (1 is an average hand, 2 twice as good). RSDP's own bar is 1.7 at Easy, 1.45 at Normal, 1.35 at Hard. Lower is looser. |
| `bluff` | Chance to bet a hand RSDP's bot checked, against two players. It's 1.4 times that against one player, about half against three. Half of it is the chance to raise a hand RSDP folded. 0 switches off RSDP's own bluffs too. |
| `caution` | Extra equity, above the pot odds, demanded before calling. 0.03 is RSDP Normal's own margin. Negative means they call too much. |
| `betSize` | Bet size as a share of the pot (bluffs are 80% of that). |
| `trap` | Optional. Chance to check a strong hand RSDP's bot would bet, hoping to raise later. |
| `respect` | Optional, 0 to 1 (default 0.6). How much a bet scares them: it scales RSDP's read of the betting. Timid players near 1, reckless ones near 0.3. Easy players don't read the betting at all. |
| `reads` | Optional, 0 to 1 (default 0.5). How fast they size you up: how much of RSDP's record of you they have taken in. The sharp players are 0.9 to 1; the naive ones 0.1 to 0.3. |
| `tilt` | Optional temper, 0 to 0.3 (default none). After losing a quarter of a starting stack in one hand, for three hands they add `tilt` to `bluff`, take it from `valueAt` and half of it from `caution`. A line appears by them ("Silas is still smarting from that last pot."), so you can punish it. |

The teacher's hints are RSDP's coach tip: a Normal bot that never bluffs, in your seat, seeing only what you see. The Session steadies it for beginners (`steady()`: no big bets or raising wars without a near-certain hand).

Chapter 1 numbers (every other chapter's are in its file; [CHAPTERS.md](CHAPTERS.md), "How the rivals play", lists them all with measured play):

| Rival | RSDP level | valueAt | bluff | caution | betSize | trap | respect | reads | tilt | Plays like |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Silas Crane | easy | 1.05 | 0.24 | -0.02 | 0.75 | | 0.35 | 0.6 | 0.12 | Loose and loud: plays over half his hands, bluffs often, steams after a big loss |
| Delphine Arceneaux | normal | 1.6 | 0.07 | 0.03 | 0.6 | 0.5 | 0.6 | 0.9 | | Tricky: traps strong hands, bluffs rarely, sees through a bully |
| Ezra Hollis | easy | 2.0 | 0 | 0.2 | 0.4 | | 0.95 | 0.1 | | Tight and passive, never bluffs, folds to most bets |

### Is it too easy? The bot lab

`npx vite-node tools/bot-lab.ts [chapter-id] [hands]` plays each chapter with four stand-ins in your seat and prints how they did and how each rival played (`test/standIns.ts` has the stand-ins):

- **station** checks and calls everything; **maniac** raises the most it can every time; **aggro** bets about the pot whenever it can; **teacher** follows the hint.

The aim (2026-11-21 tuning on RSDP's bots, 200 to 300 hands a chapter): every reckless style loses in every chapter (station about 50 to 310 units per 100 hands, maniac and aggro about 40 to 2,100; all-in play swings widely over a few hundred hands), and a careful player following the hints comes out roughly even or a little ahead (-32 to +25 in most chapters, +73 and +86 in chapters 2 and 5). The full table is in [CHAPTERS.md](CHAPTERS.md), "How the rivals play". Beating a chapter takes more than playing safe: watching tells, catching a rival on tilt and changing gear. `test/bots.test.ts` checks the reckless styles lose in chapters 1 and 4 and that Silas, Delphine and Ezra stay recognisably themselves. Run the lab after changing any personality or anything in `src/bots/`, and update the numbers here.

Bots use a seeded random generator (`src/bots/random.ts`) and deal a fixed number of finishes per decision rather than stopping by the clock as RSDP Live does, so tests can replay games. The deal itself uses the engine's crypto random source in the game.

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

The history text in every chapter (the intro, the "From the history book" notes and the rules cards) was checked against sources on 2026-11-20. Each claim, its source and any correction is in [HISTORY_SOURCES.md](HISTORY_SOURCES.md). Add any new history text there with a source.
