# Roadmap

The full plan, every chapter, and the open questions are in [GAME_OUTLINE.md](GAME_OUTLINE.md). This page tracks what is built.

## Order

1. **Chapter 1, The River (1836), straight poker.** In progress.
2. **Flashbacks:** The Painted Deck (1543, Primero), then The North Road (1763, Brag).
3. **Forward:** The Camp (1863, five-card stud), then the finale, The Last Hand (1876, five-card draw). Then the bonus, The Gaming House (1817, Poque).
4. **Polish:** title screen, deck-case chapter select, almanac, difficulty levels, Free Play.

That is **Part One, the first release**. Then:

5. **Part Two, to the present day (a later release).** Six chapters, built one at a time after Part One ships: The Left Bank (Paris 1925, seven-card stud), The Boardwalk (Atlantic City 1929, lowball draw), The Desert Classic (Las Vegas 1972, Texas Hold'em), The Mayfair Club (London 1988, pot-limit Omaha), The Boom (online 2003, Hold'em) and The Last Table (Macau today, a rotation of the story's games). The engine already plays these games; the new systems are tournament blinds and an online "timing" tell. Every person, venue and website in Part Two is fictional, with generic names: no real trademarks or living people. Details are in the outline's "Part Two" section.

Art for each chapter can be made in parallel; the code uses placeholders until it arrives.

## Chapter 1 status

Done:
- [x] Repo set up, engine copied, tests and typecheck.
- [x] The 1836 game: 20-card deck, hand ranks, one betting round, pot-limit.
- [x] Three bots with personalities and tells (Silas, Delphine, Ezra).
- [x] Table screen with layered painted art, chip controls, dialogue, rules sheet, "Powered by RSDP Live" badge.
- [x] Intro and ending screens.
- [x] Publishing to GitHub Pages on every push to `main`.

To do (story beats from the outline):
- [ ] Scripted tutorial hand with Delphine explaining the deck, and pointing out Ezra's tell.
- [ ] Silas puts the Ashcombe deck on the table as a stake after Kit wins a few pots.
- [ ] Silas deals seconds once; catching his tell lets Delphine call him out.
- [ ] Ezra's comic exit, and the heads-up finale with Silas.
- [ ] Delphine and Ezra cutouts (John to make them on green), title card, coins and buck art.
- [ ] Optional "tell spotted" hint, saving progress, difficulty levels.
- [ ] History notes checked against sources.

## Open questions

Tracked in the outline's "Open questions". The one that matters for chapter 1: the betting limit (pot-limit for now).
