/**
 * Poque, as played in New Orleans gaming houses around 1817 (the bonus
 * chapter). A RECONSTRUCTION: the old French game is poorly recorded (see
 * docs/GAME_OUTLINE.md, "Bonus"). Our version:
 * - A 32-card piquet deck: sevens up to aces.
 * - Five cards each, one betting round, then the best hand wins.
 * - Only matched cards count: four of a kind, a full house, triplets, two
 *   pairs, a pair. No straights or flushes. This is the "bet on your pairs
 *   and triplets" game the early sources describe.
 */
import type { Card, GameSpec, VariantRules } from '@rsdp/engine/core';
import { RANK_ORDER, RANK_WORDS, cap, highAward, type Scored } from './award';

export const POQUE_ID = 'poque-1817';
const RANKS = ['7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export function deck32(): Card[] {
  return RANKS.flatMap((r) => ['c', 'd', 'h', 's'].map((s) => r + s));
}

export const POQUE: GameSpec = {
  id: POQUE_ID,
  name: 'Poque (1817)',
  family: 'draw',
  streets: [{ name: 'The deal', dealDown: 5, dealUp: 0, dealBoard: 0, betSize: 'small' }],
  maxPlayers: 6,
  defaultBetting: 'pot-limit',
  split: 'high',
  forcedBets: 'blinds',
};

const NAMES = ['High card', 'A pair', 'Two pairs', 'Triplets', 'Full house', 'Four of a kind'];

/**
 * Matched cards only, any deck: groups by size then rank, then kickers.
 * Shared by Poque and usable by any "pairs and triplets" game.
 */
export function scoreGroups(cards: Card[]): Scored {
  const counts = new Map<number, number>();
  for (const c of cards) counts.set(RANK_ORDER[c[0]], (counts.get(RANK_ORDER[c[0]]) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const shape = groups.map((g) => g[1]).join('');
  const cat = shape.startsWith('4') ? 5 : shape === '32' ? 4 : shape.startsWith('3') ? 3 : shape.startsWith('22') ? 2 : shape.startsWith('2') ? 1 : 0;
  const ranks = groups.map((g) => g[0]);
  const word = (r: number, plural: boolean) => {
    const letter = Object.keys(RANK_ORDER).find((k) => RANK_ORDER[k] === r)!;
    return RANK_WORDS[letter][plural ? 1 : 0];
  };
  const [a, b] = ranks;
  const name =
    cat === 5 ? `Four ${word(a, true)}`
    : cat === 4 ? `Full house, ${word(a, true)} over ${word(b, true)}`
    : cat === 3 ? `Triplets, ${word(a, true)}`
    : cat === 2 ? `Two pairs, ${word(a, true)} and ${word(b, true)}`
    : cat === 1 ? `A pair of ${word(a, true)}`
    : `${cap(word(a, false))} high`;
  return { key: [cat, ...ranks], name };
}

export const POQUE_RULES: VariantRules = { awardPortion: highAward(scoreGroups) };
export const POQUE_RANKINGS = NAMES.slice().reverse();
