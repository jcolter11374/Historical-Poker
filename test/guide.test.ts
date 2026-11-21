import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '../src/chapters';
import { GAMES, getGame } from '../src/games/catalog';
import { bettingWords, extrasWords, guideFor, GUIDES } from '../src/games/guide';
import TRACKS from '../src/ui/music.json';

/** The loops in public/music/, by file name. */
const ON_DISK = new Set(Object.keys(import.meta.glob('../public/music/*.mp3')).map((p) => p.split('/').pop()));

describe('the rules sheet and hints', () => {
  for (const id of Object.keys(GAMES)) {
    it(`${id} has tips, mistakes and reminders for its own betting rounds`, () => {
      const g = guideFor(id);
      expect(GUIDES[id], `${id} has no guide in src/games/guide.ts`).toBeTruthy();
      expect(g.tips.length).toBeGreaterThanOrEqual(3);
      expect(g.mistakes.length).toBeGreaterThanOrEqual(1);
      // Reminders are keyed by the game's own street names: one that matches none would never show.
      const streets = new Set(getGame(id).spec.streets.map((s) => s.name));
      const used = Object.keys(g.coach).filter((k) => k === '*' || k === 'draw' || streets.has(k));
      expect(used.length, `${id}: no reminder matches any of its rounds`).toBeGreaterThan(0);
      // Shared reminder sets (stud, draw) may name a round of another game in the family, nothing else.
      for (const key of Object.keys(g.coach)) {
        if (key !== '*' && key !== 'draw' && !streets.has(key)) expect(Object.values(GAMES).some((x) => x.spec.streets.some((s) => s.name === key)), `${id}: no game has a round called "${key}"`).toBe(true);
      }
    });
  }

  it('explains every kind of betting', () => {
    expect(bettingWords('no-limit', 'blinds', 'flop', false).join(' ')).toMatch(/No limit/);
    expect(bettingWords('pot-limit', 'blinds', 'flop', false).join(' ')).toMatch(/Pot limit/);
    expect(bettingWords('fixed-limit', 'blinds', 'flop', false).join(' ')).toMatch(/Limit: every bet/);
    expect(bettingWords('fixed-limit', 'stud', 'stud', false).join(' ')).toMatch(/bring it in/);
  });

  it('explains the house extras', () => {
    const lines = extrasWords({ bombPotEvery: 4, bombPotUnits: 2, doubleBoardOnBombPots: true, bounty72Units: 5 }, (u) => `$${u * 2}`).join(' ');
    expect(lines).toMatch(/fourth hand.*\$4.*two boards/);
    expect(lines).toMatch(/7-2 bounty.*\$10/);
  });
});

describe('the music', () => {
  for (const { chapter: c } of CHAPTERS) {
    it(`${c.id} has its own loop, on disk and in music.json`, () => {
      const src = c.scene.music;
      expect(src, `${c.id} names no music`).toBeTruthy();
      const file = src!.split('/').pop()!;
      const track = Object.values(TRACKS).find((t) => t.file === file);
      expect(track, `${file} is not in src/ui/music.json`).toBeTruthy();
      expect(ON_DISK.has(file), `public/music/${file} is missing`).toBe(true);
    });
  }

  it('gives every chapter a different tune', () => {
    const files = CHAPTERS.map((e) => e.chapter.scene.music);
    expect(new Set(files).size).toBe(files.length);
  });
});
