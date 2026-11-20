import { describe, expect, it } from 'vitest';
import type { Chapter } from '../src/chapters/types';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { GAMES } from '../src/games/catalog';
import { scoreBrag } from '../src/games/brag';
import { scorePrimero, primeroDiscards } from '../src/games/primero';
import { scoreGroups } from '../src/games/poque';
import { draw5Rule } from '../src/games/fiveCardDraw';
import { compareKeys } from '../src/games/award';
import { playChapter } from './play';

const better = (a: number[], b: number[]) => expect(compareKeys(a, b)).toBeGreaterThan(0);

describe('primero', () => {
  it('ranks chorus, fluxus, supremus, primero, numerus', () => {
    const chorus = scorePrimero(['7c', '7d', '7h', '7s']);
    const fluxus = scorePrimero(['7h', '6h', '5h', 'Kh']);
    const supremus = scorePrimero(['7h', '6h', 'Ah', '2c']);
    const primero = scorePrimero(['7h', '6c', 'As', '5d']);
    const numerus = scorePrimero(['7h', '6h', '2c', '3c']);
    better(chorus.key, fluxus.key);
    better(fluxus.key, supremus.key);
    better(supremus.key, primero.key);
    better(primero.key, numerus.key);
    expect(primero.name).toBe('Primero, 70 points');
    expect(numerus.name).toBe('Numerus, 39 points in hearts');
  });
  it('changes cards toward a primero', () => {
    expect(primeroDiscards(['7h', '6h', '2c', '3c'], 2)).toHaveLength(2);
    expect(primeroDiscards(['7h', '6c', 'As', '5d'], 2)).toEqual([]);
  });
});

describe('brag', () => {
  it('puts three threes on top and A-2-3 as the best run', () => {
    better(scoreBrag(['3c', '3d', '3h']).key, scoreBrag(['Ac', 'Ad', 'Ah']).key);
    better(scoreBrag(['Ac', '2d', '3h']).key, scoreBrag(['Ac', 'Kd', 'Qh']).key);
    better(scoreBrag(['4c', '3d', '2h']).key, scoreBrag(['Ac', 'Kc', '9c']).key);
    expect(scoreBrag(['Qc', 'Qd', '5h']).name).toBe('A pair of queens');
  });
});

describe('poque', () => {
  it('counts only matched cards', () => {
    better(scoreGroups(['9c', '9d', '9h', 'Ac', 'Kd']).key, scoreGroups(['Kc', 'Kd', '7h', '7c', 'Ad']).key);
    expect(scoreGroups(['Ac', 'Kd', 'Qh', 'Jc', 'Td']).name).toBe('Ace high');
  });
});

describe('five-card draw', () => {
  it('allows four cards only when keeping an ace', () => {
    expect(draw5Rule(['Ac', '2d', '5h', '9c', 'Jd'], [1, 2, 3, 4])).toBeNull();
    expect(draw5Rule(['Kc', '2d', '5h', '9c', 'Jd'], [1, 2, 3, 4])).not.toBeNull();
    expect(draw5Rule(['Kc', '2d', '5h', '9c', 'Jd'], [1, 2, 3])).toBeNull();
  });
});

/** A one-stage chapter of one game, for checking every game plays through the table. */
function oneGame(game: string, betting: 'pot-limit' | 'no-limit' | 'fixed-limit'): Chapter {
  return {
    ...RIVERBOAT,
    id: `test-${game}`,
    story: undefined,
    stages: [{ fromHand: 1, games: [{ game, betting, lesson: { teacher: 'delphine', before: [{ who: 'delphine', text: 'Lesson.' }], streets: { 1: [{ who: 'delphine', text: 'Street.' }] } } }], structure: { unit: 4 } }],
    levelEvery: 6,
    startingStack: 160,
  };
}

describe('every game plays whole sittings at the table', () => {
  for (const id of Object.keys(GAMES)) {
    const def = GAMES[id];
    const betting = def.historical ? 'pot-limit' : def.spec.defaultBetting;
    it(`${id} (${betting})`, () => {
      for (const seed of [1, 2]) {
        const { s } = playChapter(oneGame(id, betting), seed, { maxHands: 120 });
        expect(s.snapshot().outcome).not.toBeNull();
      }
    }, 60_000);
  }
});
