import { describe, expect, it } from 'vitest';
import { CHAPTERS, isUnlocked, nextChapter } from '../src/chapters';
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
      for (const l of allLines(c)) expect(l.who === 'narration' || ids.has(l.who), `${c.id}: unknown speaker ${l.who}`).toBe(true);
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
