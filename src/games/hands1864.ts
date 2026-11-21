/**
 * Poker hands as The American Hoyle of 1864 lists them, lowest first: one
 * pair, two pairs, straight ("sequence or rotation"), triplets, flush, full
 * house, fours. The straight was new and sat BELOW three of a kind, and no
 * straight flush is listed: a straight all in one suit plays as a flush.
 * Used by five-card stud (1863). Source: docs/HISTORY_SOURCES.md, [pagat History].
 */
import type { Card } from '@rsdp/engine/core';
import { RANK_ORDER, RANK_WORDS, cap, type Scored } from './award';

export const RANKINGS_1864 = [
  { name: 'Four of a kind', example: 'K K K K 3' },
  { name: 'Full house', example: 'Q Q Q 7 7' },
  { name: 'Flush', example: 'A♥ J♥ 8♥ 6♥ 2♥' },
  { name: 'Three of a kind', example: '8 8 8 K 4' },
  { name: 'Straight', example: '10 9 8 7 6' },
  { name: 'Two pairs', example: 'J J 5 5 A' },
  { name: 'One pair', example: '10 10 K 7 3' },
  { name: 'High card', example: 'A Q 9 6 3' },
];

const word = (r: number, plural = false) => RANK_WORDS[Object.keys(RANK_ORDER).find((k) => RANK_ORDER[k] === r)!][plural ? 1 : 0];

/** Scores one to five cards (fewer than five can only make pairs and sets, for "your hand" labels mid-deal). */
export function score1864(cards: Card[]): Scored {
  const counts = new Map<number, number>();
  for (const c of cards) counts.set(RANK_ORDER[c[0]], (counts.get(RANK_ORDER[c[0]]) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const ranks = groups.map((g) => g[0]);
  const shape = groups.map((g) => g[1]).join('');
  const [a, b] = ranks;
  if (shape.startsWith('4')) return { key: [7, ...ranks], name: `Four ${word(a, true)}` };
  if (shape === '32') return { key: [6, ...ranks], name: `Full house, ${word(a, true)} over ${word(b, true)}` };
  const five = cards.length === 5 && shape === '11111';
  if (five && cards.every((c) => c[1] === cards[0][1])) return { key: [5, ...ranks], name: `Flush, ${word(a)} high` };
  if (shape.startsWith('3')) return { key: [4, ...ranks], name: `Three ${word(a, true)}` };
  if (five) {
    const wheel = ranks.join() === '14,5,4,3,2';
    if (wheel || a - ranks[4] === 4) return { key: [3, wheel ? 5 : a], name: `Straight, ${word(wheel ? 5 : a)} high` };
  }
  if (shape.startsWith('22')) return { key: [2, ...ranks], name: `Two pairs, ${word(a, true)} and ${word(b, true)}` };
  if (shape.startsWith('2')) return { key: [1, ...ranks], name: `A pair of ${word(a, true)}` };
  return { key: [0, ...ranks], name: `${cap(word(a))} high` };
}
