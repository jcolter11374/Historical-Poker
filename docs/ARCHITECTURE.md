# Architecture

How the code fits together. Read the README first.

## The big picture

```
 chapter data ──┐        game catalog (src/games) ──registered in──▶ RSDP engine
 (src/chapters) │                 ▲                                  (packages/engine)
                ▼                 │                                        ▲
  UI (src/ui) ──calls──▶ Session (src/table/session.ts) ──builds hands for─┘
      ▲                        │
      └──── snapshot() ◀───────┤
                               └──asks──▶ bots (src/bots) ──simulate with──▶ the game's own rules
  progress (src/progress) ◀── App saves wins and settings
```

- **The engine** plays one hand at a time: deals, enforces betting rules, works out pots and side pots, runs draws, and settles the showdown. It knows nothing about chapters, stories or bots. It is a copy of RSDP Live's engine; see [ENGINE.md](ENGINE.md). It already runs RSDP Live's twelve games and the home-game extras.
- **The game catalog** (`src/games/catalog.ts`) lists every game the story uses, old and new, as a `GameDef`: the engine spec, the showdown rules, the deck, the style of forced bets, a rules card for the player, and helpers bots use (which cards to throw in a draw, how to describe a hand). The historical games each have their own file (`primero.ts`, `brag.ts`, `poque.ts`, `straightPoker.ts`, `fiveCardStud.ts`, `fiveCardDraw.ts`); `award.ts` has the shared "best hand wins" helpers. `guide.ts` is the teaching side of every game: tips and easy mistakes for the rules sheet, the reminders a hint adds for each betting round, and the betting and house extras in words. `registerGames()` registers the historical games with the engine; RSDP Live's own games are already there.
- **The Session** (`src/table/session.ts`) is the table between hands, for any chapter. It holds the four seats and their money, works out which stage and game the next hand is, moves the buck, turns the stage's unit into forced bets (`src/table/stakes.ts`), builds the engine's input, asks bots to act or draw, picks lines for the characters, runs lessons and story beats, handles buy-backs and the finale, gives hints, and decides when the chapter is won or lost. It has no React in it, so tests play whole chapters with it.
- **Bots** (`src/bots/`): `strength.ts` simulates the rest of the hand a few hundred times, for any game, to estimate how often a hand wins (its equity), weighting the deals by how believable each opponent's betting is; `personality.ts` turns equity and pot odds into fold, call or raise, shaped by the character's numbers (and their temper, if they're on tilt). The Session keeps what the bots remember: how often you bet tonight, who is on tilt (`pressureOn`, `credibility`, `checkTempers`). See GAME_DESIGN.md, "How the bots think".
- **A chapter** (`src/chapters/<name>.ts`) is data: story text, stages and lessons, the three rivals (personality, tell, lines, art), story beats and the ending. `types.ts` documents every field; `cast.ts` has helpers so a chapter file stays short (`rival()`, `lines()`, `say()`, standard seat positions); `index.ts` is the order of chapters and the unlock rules.
- **Progress** (`src/progress/save.ts`) is a small JSON object in local storage: chapters started and won, and the hints setting.
- **The UI** (`src/ui/`) shows `session.snapshot()` and calls session methods. It never changes game state itself.
- **Sound** (`src/ui/sound.ts`): sound effects made in code with the Web Audio API, and the music player, which loops each chapter's music file without a gap. The music itself is written in `tools/music/` ([MUSIC.md](MUSIC.md)). `src/ui/useTableFx.ts` compares each snapshot with the last and turns the difference into sounds and chips flying across the felt.

## Screens

`App.tsx` switches between four screens:

1. **Chapter select** (`ChapterSelect.tsx`): the deck case.
2. **Intro** (`IntroScreen` in `App.tsx`): story, "the story so far" when jumping ahead, the cast. Behind it: the chapter's title painting (`scene.title`) with the text on a left-hand shade, or the table room if there is no painting.
3. **Table** (`TableScreen.tsx`): a `Session` for the chapter.
4. **Ending** (`EndScreen` in `App.tsx`): outro, keepsake, history, next chapter.

Everything is laid out on a fixed 1600 x 900 stage (`Stage.tsx`) that scales to fit the window, so positions in chapter files are plain stage pixels.

**Small screens.** When the stage is drawn at less than 0.75 scale, `Stage` sets the CSS variable `--boost` (1 to 1.6) and the class `stage-compact`, and `useCompact()` returns true. The "Small screens" block at the end of `styles.css` enlarges words and controls by `--boost` with the CSS `scale` property, leaving the painting alone. A phone held upright gets the "turn sideways" card (`RotateHint`, shown by a CSS media query). `Stage` also undoes any scrolling a focused button causes (`unscroll`), since the stage is bigger than the window before it is scaled.

## One hand, start to finish

1. `TableScreen` calls `session.startHand()`.
2. Between hands the session has already prepared this hand (`prepareNextHand`): it found the stage and game, raised the stakes if a level was reached, queued any moment, stage opening or lesson as a scene, and set up a bomb pot if due.
3. `startHand` moves the buck to the next player still in, shuffles the game's deck with the browser's crypto random source (or arranges it, for the tutorial or a cheat), works out the forced bets, and calls `engine.startHand()`.
4. If a rival is to act, `TableScreen` waits about a second and calls `session.botStep()`. The bot estimates its equity from what it can see and decides (or chooses cards to draw); the session passes that to `engine.act()` or `engine.draw()`. The session may also record a tell and a line of dialogue.
5. If the player is to act, `TableScreen` shows chip buttons built from `session.legal()`, or in a draw, selectable cards and a Draw chip (`session.draw()`).
6. When the hand ends, the engine settles every pot (split pots, side pots, two boards) using the game's `awardPortion`. The session copies the stacks back, writes the one-line summary, handles buy-backs or exits, the stake, the cheat and the finale, and checks whether the chapter is over.

## The table screen

`TableScreen.tsx` draws in layers, back to front (see `Scene.tsx`):

1. **Background**: the room. A painting if the chapter has one (`scene.background`), else a placeholder drawn in code from the chapter's `palette`: a dark wall, lamp glow and grain.
2. **Rivals**: each character's picture, from `art.place`. A character without art is a painted silhouette in their colour (`kind: 'placeholder'`).
3. **Table front**: the table, drawn over the rivals so they sit behind it. A cut-out image, or a felt ellipse in the palette's colours.
4. **On the felt**: name plates (with money, cards and hand names at showdown), the buck, the board or boards, the pot, the player's hand.
5. **On top**: the game name and stage label, the corner links (rules, hint, sound, music, leave), dialogue (a hint adds a smaller reminder under it), chip controls, tells, chips in flight, the rules sheet.

### The rules sheet

`RulesPanel.tsx` opens over the table in three pages, chosen by text links along its top: **The rules** (the rules card's "how a hand goes" and the betting in words from `guide.ts`, beside the hand rankings and any house extras), **Playing it well** (the game's tips and easy mistakes from `guide.ts`), and **This chapter** (how to win it, and the history book). Short pages, so it never becomes a wall of text.

### Motion and sound

- **Cards** are wrapped in `.deal-in`, a CSS animation that runs when the element mounts, starting from the dealer's seat (`--dx`, `--dy`: dealer minus the card's place). Cards are keyed by value, so a card drawn or turned over mounts again and animates; face-up cards also `.flip-in`.
- **Chips** are drawn by `useTableFx`: when a seat's bet goes up, a `ChipFlight` slides from that seat to the pot; when the hand ends, from the pot to each winner. Seat and pot spots are `seatSpot()` and `potSpot()` in `useTableFx.ts`.
- **Sounds** come from the same diff (`useTableFx`, see the table at its top) and play through `sfx()`. The browser only allows audio after a press, so `App` calls `unlock()` on the first one.
- **Music**: `playMusic(src)` fades from one loop to the next. Loops play through Web Audio: the file is decoded once and looped over the exact length given in `src/ui/music.json`, so there is no gap. `TableScreen` plays the stage's `scene.music`, else the chapter's; `App` plays the chapter's on the intro and ending, and silence on the chapter select. Audio rests while the tab is hidden.
- Settings (`sound`, `music`) live in the saved progress (`setOption`). "Music on/off" is a text link on the intro, the table and the ending (`musicLink` in `App.tsx`).
- All motion is off under `prefers-reduced-motion` (end of the "Motion" block in `styles.css`).

## Adding a chapter

1. **Games.** If the game is already in `src/games/catalog.ts` (all RSDP Live games and the six historical ones are), skip this. Otherwise add `src/games/<game>.ts` with a `GameSpec`, its `VariantRules` (at least `awardPortion`) and a scoring function, add a `GameDef` to the catalog with its rules card, add its tips, mistakes and reminders to `src/games/guide.ts`, and add tests like the ones in `test/games.test.ts`.
2. **Chapter data.** Copy the chapter closest to yours (one stage: `northRoad.ts`; several stages: `backRoom.ts`; a rotation: `lastTable.ts`) and change the story, stages, lessons and rivals. Every field is documented in `src/chapters/types.ts`.
3. **Order.** Add it to `CHAPTERS` in `src/chapters/index.ts`, with the chapter it comes `after`.
4. **Check.** `npm test` plays every chapter to the end with a simple player, checks every speaker and teacher exists, and checks every RSDP Live game is still taught somewhere. Then play it in `npm run dev`.
5. **Art.** It works without any. When art arrives, follow [ART.md](ART.md).
6. **Music.** Add a tune for it to `tools/music/pieces.py`, render it, and set `scene: { music: music('<chapter-id>') }` ([MUSIC.md](MUSIC.md)).
7. **Docs.** Add the chapter to [CHAPTERS.md](CHAPTERS.md), its art list to [ART.md](ART.md), its tune to [MUSIC.md](MUSIC.md), and update [ROADMAP.md](ROADMAP.md).

## Story scenes

The Session keeps a queue of scene lines (`SceneLine`: who speaks and what). While the queue isn't empty, nobody acts and the UI shows the line with a Continue chip that calls `advanceScene()`. Lines are queued between hands (moments, stage openings, lessons, levels, the stake, buy-backs, exits, the finale), on a lesson hand's streets, when a tutorial tell shows, and when the player calls out a deal (`accuse()`). Set-up deals (chapter 1's tutorial, the cheats) are built by `arrangeDeck()`, which orders the deck so the engine's deal gives each seat the chosen cards.

## Tests

- `test/straightPoker.test.ts`: chapter 1's deck and hand rankings.
- `test/games.test.ts`: the other historical games' rankings, and every game in the catalog playing whole sittings at the table.
- `test/chapters.test.ts`: every chapter's speakers, teachers and games exist; every RSDP Live game has a lesson; the unlock order; every chapter plays to an end and reaches its last stage.
- `test/session.test.ts`: many complete games of chapter 1 with seeded dealing (some calling out the dealer at random), checking every dollar after each hand.
- `test/guide.test.ts`: every game has tips, mistakes and reminders that match its own betting rounds; every chapter has its own music loop, on disk and in `music.json`.
- `test/story.test.ts`: chapter 1's story beats: the tutorial deal and tell, the stake, catching the cheat, a wrong accusation, the finale.
- `test/bots.test.ts`: reading bets in the strength simulation, tilt, bluffing less into more players, rivals reading a player who always bets, reckless styles losing in chapters 1 and 4, Silas, Delphine and Ezra playing like themselves.
- `test/play.ts` and `test/helpers.ts`: play a chapter with a simple player, clicking through scenes, checking money and summaries after every hand.
- `test/standIns.ts`: stand-in players (station, maniac, aggro, teacher) for `bots.test.ts` and the bot lab.

## Tools

- `tools/bot-lab.ts` (`npx vite-node tools/bot-lab.ts [chapter-id] [hands]`): plays chapters with the stand-ins and prints each rival's play, aggression, folds and bluffs, and how each stand-in did. Use it when tuning a personality (GAME_DESIGN.md, "Is it too easy?").
- `tools/prepare-art.py`, `tools/greenscreen-cutout.py`: preparing art ([ART.md](ART.md)).
- `tools/music/compose.py` and `tools/music/pieces.py`: the chapters' music, written as code and rendered to MP3 loops ([MUSIC.md](MUSIC.md)).
- `npm run test:engine` runs the engine's own tests.

Random numbers: dealing uses the engine's `cryptoRng` in the game. Bots use a seeded generator (`src/bots/random.ts`), and tests pass a seeded deal so failures can be replayed.
