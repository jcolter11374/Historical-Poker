import { describe, expect, it } from 'vitest';
import type { Betting, Chapter } from '../src/chapters/types';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { GAMES } from '../src/games/catalog';
import { scoreBrag } from '../src/games/brag';
import { scorePrimero } from '../src/games/primero';
import { primeroDiscards } from './drawHabits';
import { scoreGroups, scorePoque } from '../src/games/poque';
import { score1864 } from '../src/games/hands1864';
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
  it('counts only pairs royal and pairs, as in the 1700s', () => {
    better(scoreBrag(['Ac', 'Ad', 'Ah']).key, scoreBrag(['3c', '3d', '3h']).key);
    better(scoreBrag(['2c', '2d', '2h']).key, scoreBrag(['Ac', 'Ad', 'Kh']).key);
    // Runs and flushes are the later game: a pair beats both.
    better(scoreBrag(['2c', '2d', '5h']).key, scoreBrag(['Ac', 'Kc', 'Qc']).key);
    better(scoreBrag(['Ac', 'Kd', '4h']).key, scoreBrag(['4c', '3c', '2c']).key);
    expect(scoreBrag(['Qc', 'Qd', '5h']).name).toBe('A pair of queens');
  });
  it('lets the knave of clubs and the nine of diamonds stand for any card, and a natural hand beat a made one', () => {
    expect(scoreBrag(['Jc', 'Kd', 'Kh']).name).toBe('Pair royal of kings (with a bragger)');
    expect(scoreBrag(['9d', 'Ad', '4h']).name).toBe('A pair of aces (with a bragger)');
    expect(scoreBrag(['Jc', '9d', '7h']).name).toBe('Pair royal of sevens (with a bragger)');
    better(scoreBrag(['Kc', 'Kd', 'Kh']).key, scoreBrag(['Jc', 'Kd', 'Ks']).key);
    better(scoreBrag(['Ac', 'Ad', '4h']).key, scoreBrag(['9d', 'As', '4c']).key);
    better(scoreBrag(['Jc', 'Qd', 'Qh']).key, scoreBrag(['Ac', 'Ad', 'Kh']).key);
    // The other knaves and nines are ordinary cards.
    expect(scoreBrag(['Jd', 'Kd', '4h']).name).toBe('King high');
  });
});

describe('poque', () => {
  it('counts only matched cards', () => {
    better(scoreGroups(['9c', '9d', '9h', 'Ac', 'Kd']).key, scoreGroups(['Kc', 'Kd', '7h', '7c', 'Ad']).key);
    expect(scoreGroups(['Ac', 'Kd', 'Qh', 'Jc', 'Td']).name).toBe('Ace high');
  });
  it('ranks only sets: four, three, a pair', () => {
    better(scorePoque(['9c', '9d', '9h', 'Ac', 'Kd']).key, scorePoque(['Kc', 'Kd', '7h', '7c', 'Ad']).key);
    // Two pairs are only a pair (the higher one); a full house is only three of a kind.
    better(scorePoque(['Ac', 'Ad', '7h', '8c', '9d']).key, scorePoque(['Kc', 'Kd', 'Qh', 'Qc', 'Ad']).key);
    better(scorePoque(['Tc', 'Td', 'Th', '8c', '9d']).key, scorePoque(['9c', '9s', '9h', 'Ac', 'Ad']).key);
    expect(scorePoque(['Kc', 'Kd', 'Qh', 'Qc', 'Ad']).name).toBe('A pair of kings');
    expect(scorePoque(['9c', '9s', '9h', 'Ac', 'Ad']).name).toBe('Three nines');
  });
});

describe('the hands of 1864 (five-card stud)', () => {
  it('ranks the straight below three of a kind and above two pairs', () => {
    better(score1864(['8c', '8d', '8h', 'Kc', '4d']).key, score1864(['Tc', '9d', '8h', '7c', '6d']).key);
    better(score1864(['Tc', '9d', '8h', '7c', '6d']).key, score1864(['Ac', 'Ad', 'Kh', 'Kc', '4d']).key);
    better(score1864(['2h', '5h', '8h', '9h', 'Jh']).key, score1864(['8c', '8d', '8h', 'Kc', '4d']).key);
  });
  it('has no straight flush: a straight in one suit is a flush', () => {
    expect(score1864(['9s', '8s', '7s', '6s', '5s']).name).toBe('Flush, nine high');
    better(score1864(['Qc', 'Qd', 'Qh', '7c', '7d']).key, score1864(['9s', '8s', '7s', '6s', '5s']).key);
  });
});

/** A one-stage chapter of one game, for checking every game plays through the table. */
function oneGame(game: string, betting: Betting): Chapter {
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
    const betting: Betting = id === 'draw5-1876' ? 'spread-limit' : def.spec.defaultBetting;
    it(`${id} (${betting})`, () => {
      for (const seed of [1, 2]) {
        const { s } = playChapter(oneGame(id, betting), seed, { maxHands: 120 });
        expect(s.snapshot().outcome).not.toBeNull();
      }
    }, 60_000);
  }
});
