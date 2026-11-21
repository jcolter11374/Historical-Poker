/**
 * Brag, as played in English inns (chapter 3, 1763). This is the vying game
 * of Hoyle's century, not today's three-card brag:
 * - 52 cards, three each, face down. Everyone antes, then one round of
 *   bragging: pass, or brag (bet), until the brags are matched ("seen").
 * - Only matched cards count. Hands, best first: a pair royal (three of a
 *   kind), a pair, then the highest card. Aces are high. Runs and flushes do
 *   not count: they are the later, modern game.
 * - Two "braggers", the knave of clubs and the nine of diamonds, stand for
 *   any card. A natural hand beats the same hand made with a bragger.
 * - No betting blind and no agreed limit: neither is recorded for the 1700s.
 * Not played here: the other two stakes of three-stake brag (the best card
 * turned up, and thirty-one). Sources and open questions:
 * docs/HISTORY_SOURCES.md.
 */
import type { Card, GameSpec, VariantRules } from '@rsdp/engine/core';
import { RANK_ORDER, RANK_WORDS, cap, highAward, type Scored } from './award';

export const BRAG_ID = 'brag-1763';

export const BRAG: GameSpec = {
  id: BRAG_ID,
  name: 'Brag (1763)',
  family: 'draw',
  streets: [{ name: 'The deal', dealDown: 3, dealUp: 0, dealBoard: 0, betSize: 'small' }],
  maxPlayers: 8,
  defaultBetting: 'no-limit',
  split: 'high',
  forcedBets: 'blinds',
};

export const BRAG_CATEGORIES = ['High card', 'Pair', 'Pair royal'];

/** The braggers: the knave of clubs and the nine of diamonds are wild. */
export const BRAGGERS: Card[] = ['Jc', '9d'];

const letter = (r: number) => Object.keys(RANK_ORDER).find((k) => RANK_ORDER[k] === r)!;
const one = (r: number) => RANK_WORDS[letter(r)][0];
const many = (r: number) => RANK_WORDS[letter(r)][1];

/**
 * Scores one to three cards. Key: [category, rank of the set, kicker, natural (1) or made with a bragger (0)],
 * so of two equal hands the natural one wins.
 */
export function scoreBrag(cards: Card[]): Scored {
  const naturals = cards.filter((c) => !BRAGGERS.includes(c)).map((c) => RANK_ORDER[c[0]]).sort((a, b) => b - a);
  const wild = cards.length - naturals.length;
  const tag = wild ? ' (with a bragger)' : '';
  const [a, b, c] = naturals;
  // No natural card at all (both braggers and nothing else): they stand for aces.
  if (!naturals.length) return wild === 1 ? { key: [0, 14, 0, 0], name: 'A bragger' } : { key: [1, 14, 0, 0], name: `A pair of aces${tag}` };
  const allAlike = naturals.every((r) => r === a);
  if (cards.length === 3 && allAlike) return { key: [2, a, 0, wild ? 0 : 1], name: `Pair royal of ${many(a)}${tag}` };
  if (wild) {
    // One bragger with two different cards (or with one card, mid-deal): it pairs the higher.
    return { key: [1, a, b ?? 0, 0], name: `A pair of ${many(a)}${tag}` };
  }
  if (a === b || (b !== undefined && b === c)) {
    const pair = a === b ? a : b;
    const kicker = a === b ? (c ?? 0) : a;
    return { key: [1, pair, kicker, 1], name: `A pair of ${many(pair)}` };
  }
  return { key: [0, a, b ?? 0, c ?? 0], name: `${cap(one(a))} high` };
}

export const BRAG_RULES: VariantRules = { awardPortion: highAward(scoreBrag) };
