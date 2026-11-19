# Historical Poker

A single-player card game that tells the history of poker, one chapter per era. You follow one heirloom deck, the Ashcombe deck, from table to table: a Mississippi steamboat in 1836, then flashbacks to a Tudor hall and a coaching inn, then forward to a Civil War camp and a Deadwood saloon. A later release carries it on to the present day. A **Card School** teaches every game RSDP Live offers, so friends can learn one without risking money. Each chapter is played with the poker of its time, against painted rivals with their own personalities and tells.

**Chapter 1, "The River"** (20-card straight poker aboard the *Magnolia Queen*, 1836) is the first one built. The whole game is designed in [docs/GAME_OUTLINE.md](docs/GAME_OUTLINE.md); what's built and what's next is in [docs/ROADMAP.md](docs/ROADMAP.md).

It runs entirely in the browser: no server, no accounts, nothing stored. It is hosted for free on GitHub Pages.

Powered by the poker engine from [RSDP Live](https://rsdp-poker-live.fly.dev), used under its MIT license (see [docs/ENGINE.md](docs/ENGINE.md)).

## Start here

New to the project? Read these, in order:

1. **This page**: what it is and how to run it.
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: how the code fits together, and how to add a chapter.
3. **[docs/GAME_OUTLINE.md](docs/GAME_OUTLINE.md)**: the full design of the game, every chapter and character. The source of truth for story and design.
4. **[docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)**: how the built chapters actually play: rules as coded, bots, tells and tuning.
5. **[docs/ART.md](docs/ART.md)**: the art style, the prompts used to make it, and how a picture becomes game art.

For looking things up:

| If you want to… | Read |
| --- | --- |
| See what's done and what's next | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Know why something is the way it is | [docs/DECISIONS.md](docs/DECISIONS.md) |
| Understand or update the copied RSDP engine | [docs/ENGINE.md](docs/ENGINE.md) |
| See the software, fonts and art this uses | [docs/CREDITS.md](docs/CREDITS.md) |
| Know the rules AI coding sessions follow | [CLAUDE.md](CLAUDE.md) |

## Quick start

You need Node.js 20 or later.

```bash
npm install
npm run dev        # the game at http://localhost:5173
npm test           # rules, bots and whole simulated games
npm run typecheck
npm run build      # the static site, in dist/
npm run test:engine  # the copied RSDP engine's own tests
```

## How it's built

```
packages/engine   The RSDP Live poker engine, copied unchanged (docs/ENGINE.md).
src/games         Each historical game's rules for the engine (straightPoker.ts).
src/table         The table between hands: seats, money, the buck, chapter win/loss.
src/bots          How rivals decide: hand strength by simulation, plus a personality.
src/chapters      Each chapter's story, characters, tells, lines and art placement.
src/ui            React screens: intro, table, ending, rules sheet.
public/art        Game-ready art, one folder per chapter.
tools             Scripts that turn original art into game art (docs/ART.md).
test              Unit tests and whole-game simulations.
```

Every pull request runs the typecheck, tests and build. Pushing to `main` does the same and, if they pass, publishes the site to GitHub Pages (`.github/workflows/pages.yml`). Pages must be set to "Source: GitHub Actions" in the repo settings, once.

## License

MIT, see [LICENSE](LICENSE). The art in `public/art` was made for this game; see [docs/CREDITS.md](docs/CREDITS.md).
