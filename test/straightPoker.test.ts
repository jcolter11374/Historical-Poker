import { describe, expect, it } from 'vitest';
import { compareValues, deck20, evaluate1836 } from '../src/games/straightPoker';

const v = (s: string) => evaluate1836(s.split(' '));

describe('20-card deck', () => {
  it('has the twenty high cards, once each', () => {
    const d = deck20();
    expect(d).toHaveLength(20);
    expect(new Set(d).size).toBe(20);
    expect(d.every((c) => 'TJQKA'.includes(c[0]))).toBe(true);
  });
});

describe('1836 hand rankings', () => {
  it('names each category', () => {
    expect(v('As Ah Ad Ac Ks').name).toBe('Four aces');
    expect(v('Ks Kh Kd Ts Th').name).toBe('Full house, kings over tens');
    expect(v('Qs Qh Qd As Ts').name).toBe('Triplets, queens');
    expect(v('Ks Kh Ts Th As').name).toBe('Two pairs, kings and tens');
    expect(v('Js Jh As Ks Ts').name).toBe('A pair of jacks');
    expect(v('As Kh Qd Jc Ts').name).toBe('Ace high');
  });

  it('ranks four of a kind > full house > triplets > two pairs > pair > high card', () => {
    const order = ['As Ah Ad Ac Ks', 'Ks Kh Kd Ts Th', 'Qs Qh Qd As Ts', 'Ks Kh Ts Th As', 'Js Jh As Ks Ts', 'As Kh Qd Jc Ts'];
    for (let i = 0; i < order.length - 1; i++) expect(compareValues(v(order[i]), v(order[i + 1]))).toBeGreaterThan(0);
  });

  it('does not count straights or flushes', () => {
    // A-K-Q-J-T all spades would be a royal flush today; in 1836 it is just ace high.
    expect(v('As Ks Qs Js Ts').category).toBe(0);
    expect(compareValues(v('As Ks Qs Js Ts'), v('Ah Kd Qc Jh Td'))).toBe(0);
  });

  it('breaks ties by group rank, then kickers', () => {
    expect(compareValues(v('Ks Kh Qs Qh As'), v('Ks Kd Js Jh As'))).toBeGreaterThan(0);
    expect(compareValues(v('Js Jh As Ks Qs'), v('Jd Jc As Ks Ts'))).toBeGreaterThan(0);
    expect(compareValues(v('Ts Th Td Js Jh'), v('Jd Jc Js Ts Th'))).toBeLessThan(0);
  });

  it('rejects cards outside the 20-card deck', () => {
    expect(() => v('9s Ah Ad Ac Ks')).toThrow();
  });
});
