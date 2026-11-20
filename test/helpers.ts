import { expect } from 'vitest';
import { seeded } from '../src/bots/random';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { HUMAN, Session } from '../src/table/session';

type Policy = 'calls' | 'folds';

/**
 * Plays a whole chapter with the human using a simple rule, until it ends or
 * maxHands. Story scenes are clicked through. With `accuse`, the human calls
 * out the dealer whenever the game allows it, with that chance.
 */
export function playOut(seed: number, human: Policy, opts: { maxHands?: number; accuse?: number; skipTutorial?: boolean } = {}) {
  const deal = seeded(seed * 7919);
  const choice = seeded(seed * 31);
  const s = new Session(RIVERBOAT, { seed, dealRng: (n) => deal.int(n), skipTutorial: opts.skipTutorial });
  const total = s.snapshot().seats.reduce((n, x) => n + x.stack, 0);
  const skip = () => {
    while (s.inScene) s.advanceScene();
  };
  let hands = 0;
  skip();
  while (!s.snapshot().outcome && hands < (opts.maxHands ?? 400)) {
    s.startHand();
    hands++;
    let guard = 0;
    while (s.handInProgress) {
      if (++guard > 60) throw new Error('hand did not finish');
      skip();
      if (!s.handInProgress) break;
      if (s.canAccuse() && choice.chance(opts.accuse ?? 0)) {
        s.accuse();
        continue;
      }
      if (s.toAct === HUMAN) {
        const legal = s.legal()!;
        if (human === 'folds') s.act({ type: 'fold' });
        else s.act(legal.canCheck ? { type: 'check' } : { type: 'call' });
      } else expect(s.botStep()).toBe(true);
    }
    skip();
    const snap = s.snapshot();
    // Chips are never created or destroyed (a rival who bows out keeps theirs).
    expect(snap.seats.reduce((n, x) => n + x.stack, 0)).toBe(total);
    expect(snap.seats.every((x) => x.stack >= 0)).toBe(true);
  }
  return { s, hands };
}

