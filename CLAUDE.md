# Rules for AI coding sessions

Read README.md and docs/ARCHITECTURE.md first.

- **Keep the docs current.** Any change to behavior, rules, tuning numbers, art or structure updates the matching doc in the same commit: GAME_DESIGN.md (how it plays), CHAPTERS.md (each chapter as built), ARCHITECTURE.md (code), BOTS.md (the rivals' thinking), ART.md (art), MUSIC.md (music), ROADMAP.md (status), DECISIONS.md (why). The project must stay easy to hand to another developer.
- **docs/GAME_OUTLINE.md is the design source of truth.** Don't change story or design there without the owner agreeing; record agreed changes there.
- **Never change RSDP Live**, and avoid changing `packages/engine` and `src/bots/rsdp` (RSDP Live's bot and coach, copied). Add games from `src/games/` and characters from chapter files. See docs/ENGINE.md and docs/BOTS.md. Don't call anything RSDP's that isn't.
- **It's a teaching game.** Rivals are mostly Easy or Normal; Hard is for a rare late boss (docs/BOTS.md, "Levels").
- **Keep the repo public**: GitHub Pages hosting is free only for public repos.
- **UI style:** no boxes or panels. Painted scene, chips as controls, dialogue on a shaded strip. See docs/ART.md.
- **Before pushing:** `npm run typecheck` and `npm test` pass.
- Deals must be fair (engine crypto random). Story moments come from events, not rigged deals. The only exceptions are the ones the design calls for and the player can see: a scripted tutorial hand, and a rival's cheat that shows a tell and can be called out (docs/GAME_DESIGN.md, "Story beats").
