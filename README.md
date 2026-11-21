# Historical Poker

A single-player card game that tells the history of poker, one chapter per era. Its story is a family feud with a happy ending: the Averys and the Cranes quarrel over one deck for nearly five hundred years, and it ends with a wedding. You follow one heirloom deck, the Ashcombe deck, from table to table: a Mississippi steamboat in 1836, then flashbacks to a Tudor hall and a coaching inn, forward to a Civil War camp and a Deadwood saloon, and on through a Chicago speakeasy, Las Vegas, Paris, Atlantic City, the online boom, an English card room and Macau, to a kitchen table today. It teaches every game RSDP Live offers inside the story, so friends can learn one here before playing it for money. Each chapter is played with the poker of its time, against painted rivals with their own personalities and tells.

**All fourteen chapters are built and playable.** Chapters 1 to 9 have their painted art; the others use placeholders drawn in code until their art is made. Every chapter has its own original music. The whole game is designed in [docs/GAME_OUTLINE.md](docs/GAME_OUTLINE.md); what's built and what's next is in [docs/ROADMAP.md](docs/ROADMAP.md).

It runs entirely in the browser: no server, no accounts. Progress is saved in the browser's local storage. It is hosted for free on GitHub Pages.

Powered by the poker engine from [RSDP Live](https://rsdp-poker-live.fly.dev), used under its MIT license (see [docs/ENGINE.md](docs/ENGINE.md)).

## Start here

New to the project? Read these, in order:

1. **This page**: what it is and how to run it.
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: how the code fits together, and how to add a chapter.
3. **[docs/GAME_OUTLINE.md](docs/GAME_OUTLINE.md)**: the full design of the game, every chapter and character. The source of truth for story and design.
4. **[docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)**: how the game actually plays: stages, lessons, stakes, the games' rules as coded, bots, tells and tuning.
5. **[docs/CHAPTERS.md](docs/CHAPTERS.md)**: each chapter as built: its games, teacher, cast and story beats, and which file it's in.
6. **[docs/ART.md](docs/ART.md)**: the art style, the prompts, how a picture becomes game art, and the art each chapter still needs.

For looking things up:

| If you want to… | Read |
| --- | --- |
| See what's done and what's next | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Make art for a chapter (copy-ready image prompts) | [docs/ART_PROMPTS.md](docs/ART_PROMPTS.md) |
| Know why something is the way it is | [docs/DECISIONS.md](docs/DECISIONS.md) |
| Check a history fact, or add one with its source | [docs/HISTORY_SOURCES.md](docs/HISTORY_SOURCES.md) |
| Understand or update the copied RSDP engine | [docs/ENGINE.md](docs/ENGINE.md) |
| Change a chapter's music | [docs/MUSIC.md](docs/MUSIC.md) |
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
src/games         The game catalog: every game's rules card and teaching guide, and the historical games' rules.
src/table         The table between hands: seats, money, stages, stakes, story beats, win/loss.
src/bots          How rivals decide: hand strength by simulation, plus a personality.
src/chapters      One file per chapter: story, stages, lessons, characters; index.ts sets the order.
src/practice      Practice mode: any game outside the story, built from the chapters.
src/math          Math Mode: sums for young players made from the hand being played (counting outs, pot odds).
src/progress      Saved progress (chapters won, settings, Math Mode stars).
src/ui            React screens: chapter select, intro, table, ending, rules sheet.
public/art        Game-ready art, one folder per chapter.
public/music      Each chapter's music loop (docs/MUSIC.md).
tools             Scripts that turn original art into game art (docs/ART.md), and tools/music, which writes the music.
test              Unit tests and whole-game simulations.
```

Every pull request runs the typecheck, tests and build. Pushing to `main` does the same and, if they pass, publishes the site to GitHub Pages (`.github/workflows/pages.yml`). Pages must be set to "Source: GitHub Actions" in the repo settings, once.

## License

MIT, see [LICENSE](LICENSE). The art in `public/art` was made for this game; see [docs/CREDITS.md](docs/CREDITS.md).
