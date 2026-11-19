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

### Win by being the last at the table (2026-11-19)
The first version ended the chapter when Silas went broke, which could hand the player a win while folding every hand. The chapter now needs the player to win all the money. The outline's heads-up finale with Silas for the deck will be staged on top of this.

### Tells have two chances, not one (2026-11-19)
A tell that only fires when true would be a free win. Each tell has a chance to show when true and when false; the ratio is its reliability, which matches the outline's percentages and lets Delphine's tell be a deliberate coin flip.

### Layered art (2026-11-19)
Characters are separate cutouts placed behind a table-front layer, instead of one painted scene, so they can dim when they fold and later react. See [ART.md](ART.md).

### No boxes or panels in the UI (2026-11-19)
John found boxed layouts looked generic. Controls are painted chips on the felt, dialogue is plain text on a shaded strip, names sit on the table edge.

### Fixed 1600 x 900 stage (2026-11-19)
Everything is placed in stage pixels and the stage scales to the window, so art placement in chapter files is simple and the scene looks the same at any size.

### Part Two, to the present day, is a later release (2026-11-19)
John wants the story to reach today. The first release is Part One only (through Deadwood, plus the Poque bonus), so it ships sooner. Part Two's six chapters (1925 to today) come after, and use only fictional people, venues and websites, with no real trademarks or living people.
