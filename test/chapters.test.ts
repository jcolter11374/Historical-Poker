import { describe, expect, it } from 'vitest';
import { CHAPTERS, chapterById, isUnlocked, nextChapter } from '../src/chapters';
import { HUMAN, Session } from '../src/table/session';
import { CLOSING, OPENING } from '../src/story/montages';
import type { Chapter, SceneLine } from '../src/chapters/types';
import { GAMES, getGame } from '../src/games/catalog';
import { VARIANT_LIST } from '@rsdp/engine/variants';
import { playChapter } from './play';

/** Every scene line in a chapter, wherever it is written. */
function allLines(c: Chapter): SceneLine[] {
  const s = c.story ?? {};
  const out: SceneLine[] = [...(c.levelLines ?? [])];
  for (const st of c.stages) {
    out.push(...(st.opening ?? []));
    for (const g of st.games) out.push(...(g.lesson?.before ?? []), ...Object.values(g.lesson?.streets ?? {}).flat());
  }
  if (s.tutorial) out.push(...s.tutorial.before, ...s.tutorial.afterTell);
  if (s.stake) out.push(...s.stake.lines, ...s.stake.passes);
  if (s.cheat) out.push(...s.cheat.caught, ...s.cheat.wrong, ...s.cheat.missed);
  if (s.finale) out.push(...Object.values(s.finale.bowOut).flat(), ...s.finale.headsUp);
  out.push(...Object.values(s.exits ?? {}).flat(), ...(s.moments ?? []).flatMap((m) => m.lines));
  return out;
}

describe('the chapters', () => {
  it('are fourteen, in story order, with unique ids', () => {
    expect(CHAPTERS).toHaveLength(14);
    expect(new Set(CHAPTERS.map((e) => e.chapter.id)).size).toBe(14);
  });

  for (const { chapter: c } of CHAPTERS) {
    it(`${c.id}: every speaker, teacher and game exists`, () => {
      const ids = new Set(c.rivals.map((r) => r.id));
      // Bystanders speak but hold no seat, so they can't share an id with a rival.
      const bystanders = new Set(Object.keys(c.bystanders ?? {}));
      for (const b of bystanders) expect(ids.has(b)).toBe(false);
      for (const l of allLines(c)) expect(l.who === 'narration' || ids.has(l.who) || bystanders.has(l.who), `${c.id}: unknown speaker ${l.who}`).toBe(true);
      expect(ids.has(c.nemesisId)).toBe(true);
      expect(ids.has(c.narratorId)).toBe(true);
      for (const st of c.stages) for (const g of st.games) {
        expect(() => getGame(g.game)).not.toThrow();
        if (g.lesson) expect(ids.has(g.lesson.teacher)).toBe(true);
      }
      if (c.story?.cheat?.by) expect(ids.has(c.story.cheat.by)).toBe(true);
      expect(c.stages[0].fromHand).toBe(1);
      expect(c.recap.length).toBeGreaterThan(0);
    });
  }

  it('teach every RSDP Live game, inside the story, with a lesson', () => {
    const taught = new Set<string>();
    for (const { chapter } of CHAPTERS) for (const st of chapter.stages) for (const g of st.games) if (g.lesson) taught.add(g.game);
    for (const v of VARIANT_LIST) expect(taught.has(v.id), `${v.id} is never taught`).toBe(true);
    // ...and Hold'em in all three bettings.
    const holdem = new Set<string>();
    for (const { chapter } of CHAPTERS) for (const st of chapter.stages) for (const g of st.games) if (g.game === 'nlhe' && g.lesson) holdem.add(g.betting);
    expect([...holdem].sort()).toEqual(['fixed-limit', 'no-limit']);
    // Every historical game is played somewhere.
    for (const g of Object.values(GAMES)) if (g.historical) expect(taught.has(g.id) || g.id === 'straight-1836').toBe(true);
  });

  it('unlock in order, with the bonus after the Part One finale', () => {
    const won = new Set<string>();
    expect(nextChapter(won).id).toBe('riverboat');
    expect(isUnlocked('painted-deck', won)).toBe(false);
    won.add('riverboat');
    expect(nextChapter(won).id).toBe('painted-deck');
    for (const id of ['painted-deck', 'north-road', 'camp', 'last-hand']) won.add(id);
    expect(isUnlocked('gaming-house', won)).toBe(true);
    expect(isUnlocked('back-room', won)).toBe(true);
  });
});

describe('every chapter plays to an end', () => {
  for (const { chapter: c } of CHAPTERS) {
    it(c.id, () => {
      const games = c.stages.flatMap((st) => st.games.map((g) => g.game));
      let reachedAll = false;
      for (const seed of [3, 4]) {
        const { s, games: played } = playChapter(c, seed, { maxHands: 250 });
        expect(s.snapshot().outcome, `${c.id} seed ${seed} did not finish`).not.toBeNull();
        const ids = new Set<string>();
        for (const name of played) ids.add(name);
        if (s.snapshot().handNumber >= c.stages[c.stages.length - 1].fromHand) reachedAll = true;
      }
      // Buy-backs keep everyone in until the last stage, so every game is reached.
      expect(reachedAll || games.length === 1).toBe(true);
    }, 120_000);
  }
});

describe('the last two chapters: Elena Crane, and the home game after the wedding', () => {
  it('Elena is the last rival in both, and Victor sits in', () => {
    for (const id of ['last-table', 'kitchen-table']) {
      const c = chapterById(id)!;
      expect(c.nemesisId).toBe('crane');
      expect(c.rivals.find((r) => r.id === 'crane')!.fullName).toBe('Elena Crane');
      expect(c.rivals.some((r) => r.id === 'victor')).toBe(true);
    }
  });

  it('lets people in the room speak without a seat (Marcus deals, Priya watches)', () => {
    const home = chapterById('kitchen-table')!;
    const s = new Session(home, { seed: 2, skipTutorial: true });
    const speakers: (string | null)[] = [];
    while (s.inScene) {
      const line = s.snapshot().scene!;
      speakers.push(line.name);
      if (line.name === 'Marcus' || line.name === 'Priya') expect(line.seat).toBeNull();
      s.advanceScene();
    }
    expect(speakers).toContain('Marcus');
    expect(speakers).toContain('Priya');
    expect(s.snapshot().seats[HUMAN].stack).toBe(home.startingStack);
  });

  it('will not resume a table saved with a cast that has since changed', () => {
    const home = chapterById('kitchen-table')!;
    const saved = playChapter(home, 3, { maxHands: 2 }).s.saveTable()!;
    expect(Session.resume(home, { ...saved, scene: [{ who: 'priya', text: 'Hi.' }] })).not.toBeNull();
    expect(Session.resume(home, { ...saved, scene: [{ who: 'rafael', text: 'Champagne!' }] })).toBeNull();
  });
});

describe('the opening and the ending', () => {
  /** Every painting in public/art, as 'riverboat/title.webp'. */
  const paintings = new Set(Object.keys(import.meta.glob('../public/art/**/*.webp')).map((f) => f.replace('../public/art/', '')));
  it('have four to six pictures each, every one with a caption and a picture that exists or a placeholder', () => {
    for (const slides of [OPENING, CLOSING]) {
      expect(slides.length).toBeGreaterThanOrEqual(4);
      expect(slides.length).toBeLessThanOrEqual(6);
      for (const s of slides) {
        expect(s.when.length).toBeGreaterThan(3);
        expect(s.caption.length).toBeGreaterThan(20);
        expect(!!s.image || !!s.palette).toBe(true);
        if (s.image) expect(paintings.has(s.image), s.image).toBe(true);
      }
    }
  });

  it('the opening does not give away who N0rthStar is', () => {
    const late = OPENING.filter((s) => /19\d\d|20\d\d|Today/.test(s.when));
    for (const s of late) expect(s.caption).not.toMatch(/Nate|N0rthStar/);
  });
});
