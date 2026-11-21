# The RSDP engine

`packages/engine` is a copy of the poker engine from RSDP Live (repo `jcolter11374/rsdp-poker-live`, folder `packages/engine`), which John wrote. It is used here under its MIT license.

## Where it came from

- Copied from commit `39b7053e249c6931416fb9fe1d88932156178af2` (2026-11-17).
- Copied unchanged, including its own tests (`npm run test:engine`).
- It is a workspace package named `@rsdp/engine`; the game imports `@rsdp/engine/core`.

RSDP Live's practice bot and coach are copied too, into `src/bots/rsdp/`. They have their own page: [BOTS.md](BOTS.md).

## Rules

- **Never change RSDP Live from this project.** It has its own project and its own development.
- **Prefer not to change the copy either.** Historical games are added from outside, by registering a `GameSpec` and its rules (`variants.register`) in `src/games/`. Straight poker needed no engine change: it is a draw-family game with one street, a custom 20-card deck passed in `HandInput.deck`, and its own `awardPortion` for the 1836 hand ranks.
- If a change to the copy is ever unavoidable, keep it small, list it below, and add a test.

## What the game uses

- `engine.startHand(HandInput)`: seats, stacks, button, posts (antes as `kind: 'ante', live: false`), betting type, the deck.
- `engine.legalActions`, `engine.act`: betting.
- `engine.pots`, and the `show`, `award` and `uncalled` events at the end of a hand.
- `cryptoRng` for shuffling.

## Updating the copy

1. Copy `packages/engine` from a newer RSDP Live commit over this folder.
2. Run `npm install`, `npm run test:engine`, `npm test` and `npm run typecheck`.
3. Update the commit and date above, and note anything that changed.

## Local changes to the copy

None.
