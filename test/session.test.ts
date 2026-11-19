import { describe, expect, it } from 'vitest';
import { seeded } from '../src/bots/random';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { HUMAN, Session } from '../src/table/session';

/** Plays a whole chapter with the human using a simple rule, until it ends or maxHands. */
function playOut(seed: number, human: 'calls' | 'folds', maxHands = 400) {
  const deal = seeded(seed * 7919);
  const s = new Session(RIVERBOAT, { seed, dealRng: (n) => deal.int(n) });
  const total = s.snapshot().seats.reduce((n, x) => n + x.stack, 0);
  let hands = 0;
  while (!s.snapshot().outcome && hands < maxHands) {
    s.startHand();
    hands++;
    let guard = 0;
    while (s.handInProgress) {
      if (++guard > 50) throw new Error('hand did not finish');
      if (s.toAct === HUMAN) {
        const legal = s.legal()!;
        if (human === 'folds') s.act({ type: 'fold' });
        else s.act(legal.canCheck ? { type: 'check' } : { type: 'call' });
      } else expect(s.botStep()).toBe(true);
    }
    const snap = s.snapshot();
    // Chips are never created or destroyed.
    expect(snap.seats.reduce((n, x) => n + x.stack, 0)).toBe(total);
    expect(snap.seats.every((x) => x.stack >= 0)).toBe(true);
  }
  return { s, hands };
}

describe('a riverboat session', () => {
  it('plays many full games without breaking, keeping every dollar accounted for', () => {
    for (let seed = 1; seed <= 12; seed++) playOut(seed, 'calls');
  });

  it('ends in a loss when the player only ever folds', () => {
    const { s } = playOut(3, 'folds', 2000);
    expect(s.snapshot().outcome).toBe('lost');
  });

  it('starts with the narrator holding the buck and the player seeing five cards', () => {
    const s = new Session(RIVERBOAT, { seed: 1 });
    s.startHand();
    const snap = s.snapshot();
    expect(snap.seats[snap.button].character?.id).toBe('delphine');
    expect(snap.hand!.myCards).toHaveLength(5);
    expect(snap.hand!.pot).toBe(4); // four $1 antes
  });

  it('refuses moves out of turn', () => {
    const s = new Session(RIVERBOAT, { seed: 2 });
    s.startHand();
    if (s.toAct !== HUMAN) expect(() => s.act({ type: 'fold' })).toThrow();
  });
});
