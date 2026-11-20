/**
 * Three-card brag, as played in English inns (chapter 3, 1763). Our version
 * follows the modern game, which keeps the 1700s hand order:
 * - 52 cards, three each, face down. Everyone antes, one betting round.
 * - Hands, best first: prial (three of a kind; three threes are best, then
 *   aces, kings and down), running flush, run, flush, pair, high card.
 * - Runs: A-2-3 is the best run, then A-K-Q, K-Q-J and down to 4-3-2.
 * Betting blind is described in the rules card but not played: see
 * docs/DECISIONS.md.
 */
import type { Card, GameSpec, VariantRules } from '@rsdp/engine/core';
import { RANK_ORDER, RANK_WORDS, cap, highAward, type Scored } from './award';

export const BRAG_ID = 'brag-1763';

export const BRAG: GameSpec = {
  id: BRAG_ID,
  name: 'Three-Card Brag (1763)',
  family: 'draw',
  streets: [{ name: 'The deal', dealDown: 3, dealUp: 0, dealBoard: 0, betSize: 'small' }],
  maxPlayers: 8,
  defaultBetting: 'pot-limit',
  split: 'high',
  forcedBets: 'blinds',
};

export const BRAG_CATEGORIES = ['High card', 'Pair', 'Flush', 'Run', 'Running flush', 'Prial'];

const letter = (r: number) => Object.keys(RANK_ORDER).find((k) => RANK_ORDER[k] === r)!;
const one = (r: number) => RANK_WORDS[letter(r)][0];
const many = (r: number) => RANK_WORDS[letter(r)][1];

export function scoreBrag(cards: Card[]): Scored {
  const ranks = cards.map((c) => RANK_ORDER[c[0]]).sort((a, b) => b - a);
  if (cards.length < 3) {
    const pair = ranks.length === 2 && ranks[0] === ranks[1];
    return { key: [pair ? 1 : 0, ...ranks], name: pair ? `A pair of ${many(ranks[0])}` : `${cap(one(ranks[0]))} high` };
  }
  const flush = cards.every((c) => c[1] === cards[0][1]);
  const [a, b, c] = ranks;
  // A-2-3 is the best run; then ordinary runs, aces high.
  const ace23 = a === 14 && b === 3 && c === 2;
  const run = ace23 || (a - b === 1 && b - c === 1);
  const runValue = ace23 ? 15 : a;
  if (a === b && b === c) return { key: [5, a === 3 ? 15 : a], name: `Prial of ${many(a)}` };
  if (run && flush) return { key: [4, runValue], name: ace23 ? 'Running flush, A-2-3' : `Running flush, ${one(a)} high` };
  if (run) return { key: [3, runValue], name: ace23 ? 'Run, A-2-3' : `Run, ${one(a)} high` };
  if (flush) return { key: [2, a, b, c], name: `Flush, ${one(a)} high` };
  if (a === b || b === c) {
    const pair = a === b ? a : b;
    const kicker = a === b ? c : a;
    return { key: [1, pair, kicker], name: `A pair of ${many(pair)}` };
  }
  return { key: [0, a, b, c], name: `${cap(one(a))} high` };
}

export const BRAG_RULES: VariantRules = { awardPortion: highAward(scoreBrag) };
