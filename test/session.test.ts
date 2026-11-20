import { describe, expect, it } from 'vitest';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { HUMAN, Session } from '../src/table/session';
import { playOut } from './helpers';

describe('a riverboat session', () => {
  it('plays many full games without breaking, keeping every dollar accounted for', () => {
    for (let seed = 1; seed <= 12; seed++) playOut(seed, 'calls', { accuse: seed % 3 === 0 ? 0.5 : 0 });
  });

  it('ends in a loss when the player only ever folds', () => {
    const { s } = playOut(3, 'folds', { maxHands: 2000 });
    expect(s.snapshot().outcome).toBe('lost');
  });

  it('starts with the narrator holding the buck and the player seeing five cards', () => {
    const s = new Session(RIVERBOAT, { seed: 1, skipTutorial: true });
    s.startHand();
    const snap = s.snapshot();
    expect(snap.seats[snap.button].character?.id).toBe('delphine');
    expect(snap.hand!.myCards).toHaveLength(5);
    expect(snap.hand!.pot).toBe(4); // four $1 antes
  });

  it('refuses moves out of turn', () => {
    const s = new Session(RIVERBOAT, { seed: 2, skipTutorial: true });
    s.startHand();
    if (s.toAct !== HUMAN) expect(() => s.act({ type: 'fold' })).toThrow();
  });
});
