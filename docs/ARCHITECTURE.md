# Architecture

How the code fits together. Read the README first.

## The big picture

```
 chapter data ──┐
 (src/chapters) │
                ▼
  UI (src/ui) ──calls──▶ Session (src/table/session.ts) ──builds hands for──▶ RSDP engine (packages/engine)
      ▲                        │                                                 ▲
      └──── snapshot() ◀───────┤                                                 │
                               └──asks──▶ bots (src/bots) ──value hands with──▶ game rules (src/games)
                                                                                 └──registered in──┘
```

- **The engine** plays one hand at a time: deals, enforces betting rules, works out pots and side pots, and settles the showdown. It knows nothing about chapters, stories or bots. It is a copy of RSDP Live's engine; see [ENGINE.md](ENGINE.md).
- **A game** (`src/games/`) tells the engine what a historical game is: its deck, how many cards, how many betting rounds, and who wins a showdown. Straight poker is `straightPoker.ts`.
- **The Session** (`src/table/session.ts`) is the table between hands. It holds the four seats and their money, moves the buck, builds each hand's input for the engine, asks bots to act, picks lines for the characters to say, and decides when the chapter is won or lost. It has no React in it, so tests can play whole games with it.
- **Bots** (`src/bots/`) decide with two pieces: `strength.ts` simulates hundreds of deals to estimate how often a hand wins, and `personality.ts` turns that plus the pot odds into fold, call or raise, shaped by the character's numbers.
- **A chapter** (`src/chapters/`) is data: story text, the three rivals (personality, tell, lines, art and where they sit), stakes and the ending text. `types.ts` documents every field.
- **The UI** (`src/ui/`) shows `session.snapshot()` and calls session methods. It never changes game state itself.

## One hand, start to finish

1. `TableScreen` calls `session.startHand()`.
2. The session moves the buck to the next player still at the table, shuffles a 20-card deck with the browser's crypto random source, and calls `engine.startHand()` with everyone's $1 ante as dead money.
3. The engine deals five cards each and sets `toAct` to the player left of the buck.
4. If a rival is to act, `TableScreen` waits about a second and calls `session.botStep()`. The bot estimates its hand strength, decides, and the session passes the action to `engine.act()`. The session may also record a tell and a line of dialogue.
5. If the player is to act, `TableScreen` shows chip buttons built from `session.legal()` (the engine's legal actions). A click calls `session.act()`.
6. When betting ends, the engine shows down and awards the pot using `awardPortion1836`. The session copies the new stacks back, marks anyone with no money left as out, and checks whether the chapter is over.

## The table screen

`TableScreen.tsx` draws in layers, back to front:

1. **Background**: the empty room and table (`public/art/<chapter>/background.webp`).
2. **Rivals**: each character's picture, positioned from the chapter's `art.place`.
3. **Table front**: the same background with everything except the table made transparent (`table-front.webp`). Drawn over the rivals so they sit behind the table.
4. **On the felt**: names, money, face-down cards, the buck, the pot, the player's hand.
5. **On top**: dialogue, chip controls, tells, the chapter title and the rules sheet.

Everything is laid out on a fixed 1600 x 900 stage (`Stage.tsx`) that scales to fit the window, so positions in chapter files are plain stage pixels.

## Adding a chapter

1. **Game rules.** If the chapter uses a game the engine can't run yet, add `src/games/<game>.ts` with a `GameSpec` and an `awardPortion`, register it in `Session`, and add tests like `test/straightPoker.test.ts`. Five-card stud and five-card draw are close to games the engine already plays; Primero and Brag need new hand rankings. See the engine's own variants in `packages/engine/src/variants/` for examples.
2. **Art.** Make the background and each character following [ART.md](ART.md), run `tools/prepare-art.py`, and check the result on the stage.
3. **Chapter data.** Copy `src/chapters/riverboat.ts`, change the story, rivals and positions.
4. **Session.** The session currently assumes four seats and one betting round with antes. A game with more rounds (stud, draw) works through the engine unchanged; a game with a draw also needs a draw control in the UI (`engine.draw`).
5. **Docs.** Update GAME_DESIGN.md, ROADMAP.md and, for any choice that isn't obvious, DECISIONS.md.

## Tests

- `test/straightPoker.test.ts`: the deck and the 1836 hand rankings.
- `test/session.test.ts`: plays many complete games with seeded dealing, checking that every dollar is accounted for after each hand and that the chapter ends.
- `npm run test:engine` runs the engine's own test suite.

Random numbers: dealing uses the engine's `cryptoRng` in the game. Bots use a seeded generator (`src/bots/random.ts`), and tests pass a seeded deal so failures can be replayed.
