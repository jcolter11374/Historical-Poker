# Rules for AI coding sessions

Read README.md and docs/ARCHITECTURE.md first.

- **Keep the docs current.** Any change to behavior, rules, tuning numbers, art or structure updates the matching doc in the same commit: GAME_DESIGN.md (how it plays), ARCHITECTURE.md (code), ART.md (art), ROADMAP.md (status), DECISIONS.md (why). The project must stay easy to hand to another developer.
- **docs/GAME_OUTLINE.md is the design source of truth.** Don't change story or design there without the owner agreeing; record agreed changes there.
- **Never change RSDP Live**, and avoid changing `packages/engine`. Add games from `src/games/`. See docs/ENGINE.md.
- **Keep the repo public**: GitHub Pages hosting is free only for public repos.
- **UI style:** no boxes or panels. Painted scene, chips as controls, dialogue on a shaded strip. See docs/ART.md.
- **Before pushing:** `npm run typecheck` and `npm test` pass.
- Deals must be fair (engine crypto random). Story moments come from events, not rigged deals, except a clearly scripted tutorial hand.
