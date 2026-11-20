# Roadmap

The full plan, every chapter, and the open questions are in [GAME_OUTLINE.md](GAME_OUTLINE.md). This page tracks what is built.

## Order

1. **Chapter 1, The River (1836), straight poker.** In progress.
2. **Flashbacks:** The Painted Deck (1543, Primero), then The North Road (1763, Brag).
3. **Forward:** The Camp (1863, five-card stud), then the finale, The Last Hand (1876, five-card draw). Then the bonus, The Gaming House (1817, Poque).
4. **Polish:** title screen, deck-case chapter select, almanac, difficulty levels, Free Play.

That is **Part One, the first release**. Then:

5. **Part Two, to the present day (a later release).** Seven chapters and an epilogue, built in order after Part One ships. Each one teaches RSDP Live games inside the story, through a character, in a place and time where the game was really played, so John's friends can learn them here before playing for money:
   - 6 The Back Room (Chicago speakeasy, 1926): Seven Card Stud, then Razz
   - 7 The Desert Classic (Las Vegas, 1972): Limit, then No-Limit Hold'em
   - 8 The Boardwalk (Atlantic City casino poker room, 1985): Stud Hi-Lo
   - 9 The Cercle (Paris private card club, 1992): Pot-Limit Omaha, then Omaha Hi-Lo
   - 10 The Boom (2005): an internet café qualifier at 3 a.m. through to a televised Las Vegas final table, with 2-7 Triple Draw and Badugi taught mid-chapter
   - 11 The Big O (English Midlands card room, 2019): 5- and 6-Card Omaha, then their Hi-Lo versions
   - 12 The Last Table (Macau, today): HORSE, then 8-Game
   - Epilogue, The Kitchen Table (a home game today): bomb pots, double board, 7-2 bounty

   The engine already runs all of these games; the new systems are tournament blinds and an online "timing" tell. Every person, venue and website in Part Two is fictional, with generic names: no real trademarks or living people. Its history claims are marked in the outline as sourced (with links) or "to verify". The outline's "Part Two" and "Teaching inside the story" sections have the details: a guided first hand per game, rules cards as era objects, teacher hints built on the engine's `advice.ts`, and replay as practice.

Art for each chapter can be made in parallel; the code uses placeholders until it arrives.

## Chapter 1 status

Done:
- [x] Repo set up, engine copied, tests and typecheck.
- [x] The 1836 game: 20-card deck, hand ranks, one betting round, pot-limit.
- [x] Three bots with personalities and tells (Silas, Delphine, Ezra).
- [x] Table screen with layered painted art, chip controls, dialogue, rules sheet, "Powered by RSDP Live" badge.
- [x] Intro and ending screens.
- [x] Publishing to GitHub Pages on every push to `main`.
- [x] Scripted tutorial hand with Delphine explaining the deck, and pointing out Ezra's tell.
- [x] Silas puts the Ashcombe deck on the table as a stake after Kit wins a few pots.
- [x] Silas deals seconds once; catching his tell lets Delphine call him out.
- [x] Ezra's comic exit, and the heads-up finale with Silas.

To do:
- [ ] Delphine and Ezra cutouts (John to make them on green), title card, coins and buck art.
- [ ] Optional "tell spotted" hint, saving progress, difficulty levels.
- [ ] History notes checked against sources.

## Open questions

Tracked in the outline's "Open questions". The one that matters for chapter 1: the betting limit (pot-limit for now). Two affect the build order: whether Part Two should come before the Part One flashbacks, so friends can learn the RSDP Live games sooner, and whether players can start any chapter straight away after a "story so far".
