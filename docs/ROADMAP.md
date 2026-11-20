# Roadmap

The full plan, every chapter, and the open questions are in [GAME_OUTLINE.md](GAME_OUTLINE.md). This page tracks what is built.

## Status (2026-11-20)

**Every chapter is built and playable, with placeholder art.** All fourteen chapters (1 to 5, the Poque bonus, 6 to 12 and the epilogue) have their games, cast, lessons, story beats and endings, and every RSDP Live game is taught in the story. Part Two was built alongside Part One, at John's request, rather than as a later release. What's left is art, play-testing and polish.

Done:
- [x] Chapter 1, The River, complete with its painted background and Silas (see below).
- [x] The six historical games: Primero, Brag, Poque, straight poker, five-card stud, five-card draw.
- [x] All RSDP Live games at the table: Hold'em (limit, pot-limit, no-limit), Omaha 4/5/6 and their Hi-Lo versions, Seven Card Stud, Razz, Stud Hi-Lo, 2-7 Triple Draw, Badugi, plus bomb pots, double board and the 7-2 bounty.
- [x] Chapters 2 to 5 and the bonus; chapters 6 to 12 and the epilogue ([CHAPTERS.md](CHAPTERS.md)).
- [x] Stages, game rotations (HORSE, 8-Game), lessons from a teacher the first time each game is dealt, rising stakes, buy-backs before the last stage, tournament restarts.
- [x] Chapter select (the deck case), jump-ahead with "the story so far", keepsakes, saved progress, "Start over".
- [x] Teacher hints (on by default, can be turned off), hand names, one-line showdown summaries, a rules card per game.
- [x] Draw controls, stud up-cards and bring-in, two boards.
- [x] Placeholder art drawn in code for every room and character.
- [x] Motion: cards dealt from the dealer and turned over, chips sliding to the pot and to the winner (2026-11-20).
- [x] Sound effects made in code, with on/off switches; a music hook per chapter (2026-11-20).
- [x] Phones and tablets: played sideways, with enlarged words and chips on small screens, a "turn sideways" card, and home-screen full screen (2026-11-20).
- [x] Bots that read the betting, size you up over the evening (the sharp ones), and go on tilt (the hot-headed ones); a bot lab to measure them (2026-11-20).

To do:
- [ ] **Art** for chapters 2 to 12 and the epilogue, and the rest of chapter 1 ([ART.md](ART.md), "Art needed, per chapter").
- [ ] **Play-testing** every chapter: length, stakes, bot difficulty, and lesson wording.
- [ ] Story choices made while building that John should confirm ([DECISIONS.md](DECISIONS.md), 2026-11-20 entries).
- [ ] Outline features not built yet: difficulty levels, Free Play, the almanac, a "tell spotted" hint, Brag's blind betting, Poque's payout board, jackpots in five-card draw, choices in scenes (giving Toby his pay back).
- [x] History notes checked against sources, in every chapter ([HISTORY_SOURCES.md](HISTORY_SOURCES.md)). The Atlantic City chapter moved to 1995, after Paris, because poker was illegal there until 1993.
- [ ] Music files for the chapters ([ART.md](ART.md), "Music").
- [ ] Play-test the bot tuning with real people; the numbers in GAME_DESIGN.md come from stand-in players.

## Chapter 1 status

Done:
- [x] Repo set up, engine copied, tests and typecheck.
- [x] The 1836 game: 20-card deck, hand ranks, one betting round, pot-limit.
- [x] Three bots with personalities and tells (Silas, Delphine, Ezra).
- [x] Table screen with layered painted art, chip controls, dialogue, rules sheet, "Powered by RSDP Live" badge (RSDP Live's real "RSDP Live!" wordmark).
- [x] Intro and ending screens.
- [x] Publishing to GitHub Pages on every push to `main`.
- [x] Scripted tutorial hand with Delphine explaining the deck, and pointing out Ezra's tell.
- [x] Silas puts the Ashcombe deck on the table as a stake after Kit wins a few pots.
- [x] Silas deals seconds once; catching his tell lets Delphine call him out.
- [x] Ezra's comic exit, and the heads-up finale with Silas.

To do:
- [ ] Delphine and Ezra cutouts (John to make them on green), title card, coins and buck art.

## Open questions

Tracked in the outline's "Open questions". Two were answered by building: Part Two was built together with Part One, and any chapter can be started straight away after "the story so far". Betting limits per game are set (see CHAPTERS.md) and open to change after play-testing.
