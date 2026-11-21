import { describe, expect, it } from 'vitest';
import { VARIANT_LIST } from '@rsdp/engine/variants';
import { GAMES } from '../src/games/catalog';
import { PRACTICE, practiceChapter } from '../src/practice';
import { HUMAN, Session } from '../src/table/session';
import { playChapter } from './play';

describe('practice', () => {
  it('offers every RSDP Live game, Hold’em in both bettings, every historical game, and the mixed games', () => {
    const keys = new Set(PRACTICE.map((p) => p.key));
    for (const v of VARIANT_LIST) expect([...keys].some((k) => k.startsWith(`${v.id}/`)), `${v.id} missing`).toBe(true);
    expect(keys.has('nlhe/fixed-limit')).toBe(true);
    expect(keys.has('nlhe/no-limit')).toBe(true);
    for (const g of Object.values(GAMES)) if (g.historical) expect([...keys].some((k) => k.startsWith(`${g.id}/`)), `${g.id} missing`).toBe(true);
    const mixed = PRACTICE.filter((p) => p.group === 'mixed').map((p) => p.name);
    expect(mixed).toEqual(['HORSE', '8-Game', 'The Home Game']);
    expect(keys.size).toBe(PRACTICE.length);
  });

  it('puts every teachable game with a teacher who sits at its table', () => {
    for (const p of PRACTICE) {
      expect(p.source.rivals).toContain(p.teacher);
      if (p.key !== 'straight-1836/pot-limit') expect(p.teachable, p.key).toBe(true);
    }
  });

  for (const p of PRACTICE) {
    it(`${p.key}: a practice table has every speaker, never knocks anyone out, and keeps the books`, () => {
      const c = practiceChapter(p, { lesson: true });
      expect(c.practice).toBe(true);
      expect(c.story).toBeUndefined();
      const ids = new Set(c.rivals.map((r) => r.id));
      for (const g of c.stages[0].games) {
        expect(ids.has(g.lesson!.teacher)).toBe(true);
        for (const l of [...g.lesson!.before, ...Object.values(g.lesson!.streets ?? {}).flat()]) expect(l.who === 'narration' || ids.has(l.who)).toBe(true);
      }
      // A player who always folds goes broke many times over and is just bought back in.
      const { s, hands } = playChapter(c, 3, { maxHands: p.group === 'mixed' ? 20 : 12, policy: 'folds', trials: 8 });
      expect(hands).toBe(p.group === 'mixed' ? 20 : 12);
      expect(s.snapshot().outcome).toBeNull();
      expect(s.snapshot().seats.every((x) => !x.out)).toBe(true);
    });
  }

  it('teaches the first hand only when asked', () => {
    const p = PRACTICE.find((x) => x.key === 'razz/fixed-limit')!;
    const taught = new Session(practiceChapter(p, { lesson: true }), { seed: 1 });
    const plain = new Session(practiceChapter(p, { lesson: false }), { seed: 1 });
    expect(taught.inScene).toBe(true);
    expect(plain.inScene).toBe(false);
    // Hints still come from the teacher with the lesson off.
    plain.startHand();
    while (plain.handInProgress && plain.toAct !== HUMAN) plain.botStep();
    if (plain.toAct === HUMAN) expect(plain.hint()?.name).toBe(p.teacher.name);
  });

  it('a player who goes broke buys back in instead of losing', () => {
    const p = PRACTICE.find((x) => x.key === 'nlhe/no-limit')!;
    const { s } = playChapter(practiceChapter(p, { lesson: false }), 11, { maxHands: 40, policy: 'calls', trials: 8 });
    expect(s.snapshot().boughtIn).toBeGreaterThan(0); // somebody went broke...
    expect(s.snapshot().outcome).toBeNull(); // ...and the table went on
    expect(s.snapshot().seats.every((x) => !x.out)).toBe(true);
  });
});
