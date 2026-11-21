/**
 * Plays any chapter to the end with a simple player: checks or calls every
 * bet (brings in when stud makes them), draws like a sensible player, and
 * clicks through every scene. Checks after every hand that no money appears
 * or disappears (buy-backs before the last stage are counted separately).
 */
import { expect } from 'vitest';
import { seeded } from '../src/bots/random';
import type { Chapter } from '../src/chapters/types';
import { HUMAN, Session } from '../src/table/session';

export function playChapter(chapter: Chapter, seed: number, opts: { maxHands?: number; policy?: 'calls' | 'folds'; trials?: number } = {}) {
  const deal = seeded(seed * 7919);
  const s = new Session(chapter, { seed, dealRng: (n) => deal.int(n), skipTutorial: true, simTrials: opts.trials ?? 16 });
  const total = () => s.snapshot().seats.reduce((n, x) => n + x.stack, 0) - s.snapshot().boughtIn;
  const start = total();
  const skip = () => {
    while (s.inScene) s.advanceScene();
  };
  const games = new Set<string>();
  let hands = 0;
  skip();
  while (!s.snapshot().outcome && hands < (opts.maxHands ?? 300)) {
    skip();
    s.startHand();
    games.add(s.snapshot().play.name);
    hands++;
    let guard = 0;
    while (s.handInProgress) {
      if (++guard > 200) throw new Error('hand did not finish');
      skip();
      if (!s.handInProgress) break;
      if (s.toAct === HUMAN) {
        const limit = s.drawLimit();
        if (limit !== null) {
          const cards = s.snapshot().hand!.myCards.map((c) => c.card);
          let d = s.currentGame.discards?.(cards, limit) ?? [];
          if (s.drawProblem(d)) d = d.slice(0, 3);
          expect(s.hint()?.text).toMatch(/keep|throw|Stand pat/i);
          s.draw(d);
          continue;
        }
        const legal = s.legal()!;
        expect(s.hint()).not.toBeNull();
        if (legal.canBringIn) s.act({ type: 'bring-in' });
        else if (opts.policy === 'folds' && legal.canFold) s.act({ type: 'fold' });
        else s.act(legal.canCheck ? { type: 'check' } : { type: 'call' });
      } else expect(s.botStep()).toBe(true);
    }
    skip();
    const snap = s.snapshot();
    expect(snap.hand?.summary).toBeTruthy();
    expect(total()).toBe(start);
    expect(snap.seats.every((x) => x.stack >= 0)).toBe(true);
  }
  return { s, hands, games };
}
