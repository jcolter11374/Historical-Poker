/**
 * Poque, as played in New Orleans gaming houses around 1817 (the bonus
 * chapter). A RECONSTRUCTION: the old French game is poorly recorded (see
 * docs/GAME_OUTLINE.md, "Bonus"). Our version:
 * - A 32-card piquet deck: sevens up to aces.
 * - Five cards each, one betting round, then the best hand wins.
 * - Only sets count, as the histories table them for Poque: four of a kind,
 *   then three, then a pair; then the highest card. Two pairs and the full
 *   house are poker's additions (first listed for the 20-card game of the
 *   1830s), so here a second pair is only a tie-breaker.
 * - Played: the vying part. Not played: the other two parts of the
 *   three-part game (a pool for the turned-up card, and playing the cards out).
 * Sources: docs/HISTORY_SOURCES.md.
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
  defaultBetting: 'no-limit',
  split: 'high',
  forcedBets: 'blinds',
};

const NAMES = ['High card', 'A pair', 'Three of a kind', 'Four of a kind'];

/** Poque: the biggest set, then its rank, then the other cards (a second pair only breaks ties). */
export function scorePoque(cards: Card[]): Scored {
  const g = scoreGroups(cards);
  const cat = g.key[0] === 5 ? 3 : g.key[0] >= 3 ? 2 : g.key[0] >= 1 ? 1 : 0;
  const name = g.key[0] === 4 ? g.name.replace(/^Full house, (\w+) over.*$/, 'Three $1') : g.key[0] === 3 ? g.name.replace('Triplets, ', 'Three ') : g.key[0] === 2 ? g.name.replace(/^Two pairs, (\w+) and.*$/, 'A pair of $1') : g.name;
  return { key: [cat, ...g.key.slice(1)], name };
}

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

export const POQUE_RULES: VariantRules = { awardPortion: highAward(scorePoque) };
export const POQUE_RANKINGS = NAMES.slice().reverse();
