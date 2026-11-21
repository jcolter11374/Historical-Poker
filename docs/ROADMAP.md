# Roadmap

The full plan, every chapter, and the open questions are in [GAME_OUTLINE.md](GAME_OUTLINE.md). This page tracks what is built.

## Status (2026-11-21)

**Every chapter is built and playable, with placeholder art.** All fourteen chapters (1 to 5, the Poque bonus, 6 to 12 and the epilogue) have their games, cast, lessons, story beats and endings, and every RSDP Live game is taught in the story. Part Two was built alongside Part One, at John's request, rather than as a later release. What's left is art, play-testing and polish.

Done:
- [x] The game renamed from Historical Poker to **Still Ours** (2026-11-21); the repo, the live address and the save keys keep the old name (DECISIONS.md). The tagline is "Five hundred years, two families, one deck of cards."
- [x] The story as a family feud with a happy ending (2026-11-21): the Cranes written from hateful (1836) to loved (today); the lawyers' letters through the 1900s; Elena Crane, a top pro, as the last rival and the love interest; the epilogue as the home game after the wedding; the opening and ending pictures; nine fixes to holes in the plot ([DECISIONS.md](DECISIONS.md), [CHAPTERS.md](CHAPTERS.md) "The feud, chapter by chapter").
- [x] Chapter 1, The River, complete with its painted background and Silas (see below).
- [x] The six historical games: Primero, Brag, Poque, straight poker, five-card stud, five-card draw.
- [x] All RSDP Live games at the table: Hold'em (limit, pot-limit, no-limit), Omaha 4/5/6 and their Hi-Lo versions, Seven Card Stud, Razz, Stud Hi-Lo, 2-7 Triple Draw, Badugi, plus bomb pots, double board and the 7-2 bounty.
- [x] Chapters 2 to 5 and the bonus; chapters 6 to 12 and the epilogue ([CHAPTERS.md](CHAPTERS.md)).
- [x] Stages, game rotations (HORSE, 8-Game), lessons from a teacher the first time each game is dealt, rising stakes, buy-backs before the last stage, tournament restarts.
- [x] Chapter select (the deck case), jump-ahead with "the story so far", keepsakes, saved progress, "Start over".
- [x] A chapter left part-way is saved after every hand and picked up from the case or its intro; each chapter keeps its own table (2026-11-21).
- [x] Teacher hints (on by default, can be turned off), hand names, one-line showdown summaries, a rules card per game.
- [x] Draw controls, stud up-cards and bring-in, two boards.
- [x] Placeholder art drawn in code for every room and character.
- [x] Chapter 1's own art: background, all three rivals cut out from green, and the title painting behind the intro (2026-11-20).
- [x] Chapter 2's own art: the great hall, Margery, Roland and Anselm cut out from green, and the title painting (2026-11-20).
- [x] Chapter 3's own art: the Pewter Lamb's taproom, Hannah, Pike and Sorrel cut out from green, and the title painting (2026-11-20).
- [x] Chapter 4's own art: the tent, Toby, Reed and Hattie cut out from green, and the title painting (2026-11-20).
- [x] Chapter 5: the saloon background and Doc (2026-11-20); Ruby, Jasper and the title painting (2026-11-21). Chapters 1 to 5 are fully painted.
- [x] The bonus chapter's own art: the salon, Henri, Madame Élodie and Captain Lacroix cut out from green, and the title painting (2026-11-21).
- [x] Chapter 7's own art: the tournament room, Weiss, Tex and Lorraine cut out from green, and the title painting (2026-11-21).
- [x] Chapter 9's own art: the Boardwalk poker room, Benny, Margot and Ruth cut out from green, and the title painting (2026-11-21).
- [x] Motion: cards dealt from the dealer and turned over, chips sliding to the pot and to the winner (2026-11-20).
- [x] Sound effects made in code, with on/off switches (2026-11-20).
- [x] Chapter 6's own art: the back room, Sal, Nora and Gus cut out from green, and the title painting (2026-11-21).
- [x] Chapter 8's own art: the Paris club room, the Comte Varenne, Siobhan and Dmitri cut out from green, and the title painting (2026-11-21).
- [x] Music: an original loop for every chapter, with Music on/off at the table and on the story screens ([MUSIC.md](MUSIC.md), 2026-11-21).
- [x] Stronger teaching: the rules sheet in three pages (rules and betting, tips and easy mistakes, this chapter), and hints that name your hand, explain the pot odds and add a reminder for the game and round (2026-11-21).
- [x] Phones and tablets: played sideways, with enlarged words and chips on small screens, a "turn sideways" card, and home-screen full screen (2026-11-20).
- [x] Practice: any game, on its own, against the chapter's rivals, with its teacher's lesson and hints, never ending and never saved (2026-11-21). This is the outline's Free Play.
- [x] Bots that read the betting, size you up over the evening (the sharp ones), and go on tilt (the hot-headed ones); a bot lab to measure them (2026-11-20).
- [x] The rivals think with RSDP Live's practice bot and the hints come from RSDP Live's coach, copied in like the engine; each character is one of RSDP's levels (mostly Easy and Normal, two Hard bosses) with their own style on top ([BOTS.md](BOTS.md), 2026-11-21).
- [x] Math Mode, first version (2026-11-21): a switch, off by default, that asks young players sums from the hand being played: counting outs as a fraction of the unseen cards, and "is this call a good deal?" (pot odds). Stars for right answers (GAME_DESIGN.md, "Math Mode").

To do:
- [ ] **Math Mode, next ideas** (not agreed in detail yet): a chance meter (your chance as a fraction, a percent and a pie, guess first); chip math (making change, splitting a pot, odd chips as remainders); easy, medium and hard levels (for example the fraction shown for you on easy, typed answers on hard); outs in draw games and low games; a separate "Math Table" on the chapter list; play-testing with children for wording and reading level.
- [x] Chapter 10, The Boom: both rooms, the three avatars, all three rivals in person and the title painting (2026-11-21). Chapter 10 is fully painted.
- [x] Chapter 11, The Big O: the card room, all three rivals and the title painting (2026-11-21). Chapter 11 is fully painted.
- [ ] **Art** for chapters 2 to 12 and the epilogue, and the rest of chapter 1 ([ART.md](ART.md), "Art needed, per chapter").
- [x] Play-test pass of every chapter, by a scripted player following the teacher's hints, at desktop (1600x900, 1280x720) and phone sizes (844x390, 667x375) (2026-11-21). Fixed: the last hand of a game in a rotation was named by the next game's rules at the showdown and laid out for it; story screens opened scrolled to the bottom on phones; on phones the chips covered your cards, the hand line ran under the dialogue and chips, the raise's −/+ covered the right-hand seat, and long showdown lines covered the seat across; on desktop the pot sat under your cards, the seat across was hidden by the board at Omaha showdowns, seven-card stud plates ran into your cards, and "Call out the deal" pushed the chips onto your cards. No crashes, console errors or stuck hands.
- [x] Rules audit of every game, locked in by `test/rules.test.ts`; the Camp's stud made a true limit game; the draw announced on the felt; live purses; steadier hints and more starting money in The Last Hand and The Painted Deck (2026-11-21, [DECISIONS.md](DECISIONS.md)).
- [ ] **Play-testing with people:** length, stakes, bot difficulty, and lesson wording. Chapter 1's heads-up finale can drag for a player who only follows the hints.
- [ ] Story choices made while building that John should confirm ([DECISIONS.md](DECISIONS.md), 2026-11-20 entries).
- [ ] Outline features not built yet: difficulty levels, the almanac, a "tell spotted" hint, Brag's other two stakes (best card and thirty-one), Poque's other two parts and its payout board, choices in scenes (giving Toby his pay back).
- [x] History notes checked against sources, in every chapter ([HISTORY_SOURCES.md](HISTORY_SOURCES.md)). The Atlantic City chapter moved to 1995, after Paris, because poker was illegal there until 1993.
- [ ] Play-test the bot tuning with real people; the numbers in GAME_DESIGN.md come from stand-in players.

## Chapter 1 status

Done:
- [x] Repo set up, engine copied, tests and typecheck.
- [x] The 1836 game: 20-card deck, hand ranks, one betting round, table stakes.
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

## Story: waiting on John (2026-11-21)

- [ ] **Art for the new story:** Elena Crane (chapter 12 and the epilogue), nine paintings for the opening and the ending, and three optional ones. Prompts are in [ART_PROMPTS.md](ART_PROMPTS.md). Until then: a silhouette for Elena, and chapter paintings standing in on the slides.
- [x] **John approved the opening's and ending's moments and captions** (`src/story/montages.ts`), 2026-11-21. Their art can be made.
- [x] **1543 is the start of the feud** (John said yes, 2026-11-21). Sir Roland is a Crane who was promised the deck; a Crane hires the highwayman in 1763; the opening starts in 1543. See [DECISIONS.md](DECISIONS.md).
- [x] **A Crane who is a woman before Elena** (John said yes, 2026-11-21). "N0rthStar" is Nat Crane, Victor's niece. Her picture is not painted yet; the prompt is updated. See [DECISIONS.md](DECISIONS.md).
- [ ] **For the RSDP bots work:** Elena Crane is a top professional in the story. She is one of the few rivals where RSDP Live's Hard setting may fit; Victor should stay Normal, and Dee Easy ([CHAPTERS.md](CHAPTERS.md), chapter 12).
