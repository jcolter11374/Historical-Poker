/**
 * How good is a hand? Bots answer by simulation: deal the unseen cards to the
 * opponents still in the hand many times and count how often this hand wins.
 * With a 20-card deck this is cheap (a few hundred trials take about a millisecond).
 */
import type { Card } from '@rsdp/engine/core';
import { compareValues, deck20, evaluate1836 } from '../games/straightPoker';
import type { Random } from './random';

/** Share of the pot this hand wins on average against `opponents` random hands (ties count as split). */
export function equity(hand: Card[], opponents: number, rnd: Random, trials = 400): number {
  if (opponents <= 0) return 1;
  const unseen = deck20().filter((c) => !hand.includes(c));
  const mine = evaluate1836(hand);
  let won = 0;
  for (let t = 0; t < trials; t++) {
    const pool = rnd.shuffle(unseen);
    let best = 1; // 1 = we are ahead, otherwise our share of a tie
    let tied = 1;
    for (let o = 0; o < opponents; o++) {
      const theirs = evaluate1836(pool.slice(o * 5, o * 5 + 5));
      const cmp = compareValues(mine, theirs);
      if (cmp < 0) { best = 0; break; }
      if (cmp === 0) tied++;
    }
    won += best === 0 ? 0 : 1 / tied;
  }
  return won / trials;
}
