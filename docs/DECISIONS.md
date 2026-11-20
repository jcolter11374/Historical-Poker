# Decisions

Why things are the way they are. Add an entry, with the date, when you make a choice someone might later question.

### A separate repo, not part of RSDP Live (2026-11-19)
RSDP Live is developed in its own project. Building the game inside it would mix two codebases and two release cycles. The game copies the engine instead ([ENGINE.md](ENGINE.md)).

### Single player in the browser, hosted on GitHub Pages (2026-11-19)
With only bots at the table there is nothing to run on a server, so the game is a static site and hosting is free. The repo must stay public for free Pages hosting.

### The story opens in 1836 (2026-11-19)
The steamboat game is the first one actually called poker, so the story starts there and reaches back in flashbacks and forward to the Old West. Five-card draw is the finale (1876), because it came after 1836 and can't be a flashback. See [GAME_OUTLINE.md](GAME_OUTLINE.md).

### Pot-limit betting in chapter 1 (2026-11-19)
With no-limit, simulated games often ended in one all-in hand, which is short and swingy for a story chapter. Pot-limit keeps hands meaningful but lets a sitting last. Revisit while play-testing (an open question in the outline).

### Win by taking the deck (2026-11-19, revised 2026-11-20)
The first version ended the chapter when Silas went broke, which could hand the player a win while folding every hand. Then it needed the player to win all the money. Now the chapter is won by taking the last chips of whoever has the deck staked, usually Silas heads-up, after the other remaining rival bows out with their money. That matches the outline's finale and keeps the ending about Silas. Being last at the table still wins if the deck was never staked.

### Tells have two chances, not one (2026-11-19)
A tell that only fires when true would be a free win. Each tell has a chance to show when true and when false; the ratio is its reliability, which matches the outline's percentages and lets Delphine's tell be a deliberate coin flip.

### Layered art (2026-11-19)
Characters are separate cutouts placed behind a table-front layer, instead of one painted scene, so they can dim when they fold and later react. See [ART.md](ART.md).

### No boxes or panels in the UI (2026-11-19)
John found boxed layouts looked generic. Controls are painted chips on the felt, dialogue is plain text on a shaded strip, names sit on the table edge.

### Fixed 1600 x 900 stage (2026-11-19)
Everything is placed in stage pixels and the stage scales to the window, so art placement in chapter files is simple and the scene looks the same at any size.

### Part Two, to the present day, is a later release (2026-11-19)
John wants the story to reach today. The first release is Part One only (through Deadwood, plus the Poque bonus), so it ships sooner. Part Two (1926 to today) come after, and use only fictional people, venues and websites, with no real trademarks or living people.

### Every RSDP Live game is taught inside the story (2026-11-19)
John wants his friends to learn RSDP Live's games here, for free, before playing for money, but without a separate "school" mode. Each game is taught by a character in the chapter where it first appears, with a guided first hand. Part Two is seven chapters plus an epilogue, each set where its games were really played (re-checked for historical fit on 2026-11-19, which cut a 1994 riverboat casino chapter).

### Silas's cheat is a read, not a quick-time event (2026-11-20)
The outline says catching Silas's tell lets Delphine call him out. Calling out is a chip the player can press on any hand Silas deals until the cheat is settled, so it is a decision rather than a reflex. His cheat has its own tell, and a harmless decoy shows on some honest deals. A wrong call costs $5, so guessing every time has a price. The cheat hand is the only rigged deal outside the tutorial, and it is part of the story (CLAUDE.md allows story moments, not hidden rigging).
