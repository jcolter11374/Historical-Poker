/**
 * Primero, as played at the Tudor court (chapter 2, 1543). A RECONSTRUCTION:
 * the old sources disagree, and the game says so. Our version:
 * - A 40-card deck: no eights, nines or tens.
 * - Two cards each and a betting round; two more and a betting round; then
 *   everyone may change up to two cards once, and a last betting round.
 * - Every card has points: seven 21, six 18, ace 16, five 15, four 14,
 *   three 13, two 12, court cards 10.
 * - Hands, best first: chorus (four of a kind), fluxus (four of one suit),
 *   supremus (seven, six and ace of one suit), primero (one of each suit),
 *   numerus (the most points in one suit). Ties go to the higher points.
 */
import type { Card, GameSpec, VariantRules } from '@rsdp/engine/core';
import { RANK_WORDS, cap, highAward, type Scored } from './award';

export const PRIMERO_ID = 'primero-1543';
const RANKS = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
const SUITS = ['c', 'd', 'h', 's'];
const SUIT_WORD: Record<string, string> = { c: 'clubs', d: 'diamonds', h: 'hearts', s: 'spades' };

export const POINTS: Record<string, number> = { '7': 21, '6': 18, A: 16, '5': 15, '4': 14, '3': 13, '2': 12, J: 10, Q: 10, K: 10 };

export function deck40(): Card[] {
  return RANKS.flatMap((r) => SUITS.map((s) => r + s));
}

export const PRIMERO: GameSpec = {
  id: PRIMERO_ID,
  name: 'Primero (1543)',
  family: 'draw',
  streets: [
    { name: 'First two cards', dealDown: 2, dealUp: 0, dealBoard: 0, betSize: 'small' },
    { name: 'Second two cards', dealDown: 2, dealUp: 0, dealBoard: 0, betSize: 'small' },
    { name: 'The change', dealDown: 0, dealUp: 0, dealBoard: 0, drawMaxDiscard: 2, betSize: 'big' },
  ],
  maxPlayers: 6,
  defaultBetting: 'no-limit',
  split: 'high',
  forcedBets: 'blinds',
};

export const PRIMERO_CATEGORIES = ['Numerus', 'Primero', 'Supremus', 'Fluxus', 'Chorus'];

const total = (cards: Card[]) => cards.reduce((n, c) => n + POINTS[c[0]], 0);

/** Scores any number of cards; the top four hands need all four. */
export function scorePrimero(cards: Card[]): Scored {
  const pts = total(cards);
  const bySuit = new Map<string, Card[]>();
  for (const c of cards) bySuit.set(c[1], [...(bySuit.get(c[1]) ?? []), c]);
  const ranks = new Map<string, number>();
  for (const c of cards) ranks.set(c[0], (ranks.get(c[0]) ?? 0) + 1);
  if (cards.length >= 4) {
    const four = [...ranks.entries()].find(([, n]) => n >= 4);
    if (four) return { key: [4, POINTS[four[0]]], name: `Chorus, four ${RANK_WORDS[four[0]][1]}` };
    const flush = [...bySuit.entries()].find(([, cs]) => cs.length >= 4);
    if (flush) return { key: [3, pts], name: `Fluxus in ${SUIT_WORD[flush[0]]}, ${pts} points` };
    const supremus = [...bySuit.entries()].find(([, cs]) => ['7', '6', 'A'].every((r) => cs.some((c) => c[0] === r)));
    if (supremus) return { key: [2, pts], name: `Supremus in ${SUIT_WORD[supremus[0]]}` };
    if (bySuit.size === 4) return { key: [1, pts], name: `Primero, ${pts} points` };
  }
  let bestSuit = '';
  let best = -1;
  for (const [s, cs] of bySuit) {
    const p = total(cs);
    if (p > best) {
      best = p;
      bestSuit = s;
    }
  }
  return { key: [0, best, pts], name: `${cap('numerus')}, ${best} points in ${SUIT_WORD[bestSuit]}` };
}

export const PRIMERO_RULES: VariantRules = { awardPortion: highAward(scorePrimero) };
