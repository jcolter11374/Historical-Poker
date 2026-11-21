/**
 * Twenty-card straight poker, as played on Mississippi steamboats in the 1830s.
 *
 * The rules, as this game uses them (see docs/GAME_DESIGN.md for sources and
 * the choices we made where history is unclear):
 * - A 20-card deck: aces, kings, queens, jacks and tens in four suits.
 * - Four players, five cards each, all private. No draw, no community cards.
 * - Everyone antes, then there is one round of betting, then a showdown.
 * - Hands, best first: four of a kind, full house, triplets, two pairs,
 *   one pair, high card. Straights and flushes do not exist yet.
 *
 * The betting itself is run by the RSDP engine (packages/engine). This file
 * only tells the engine what the game is (its GameSpec) and how to decide who
 * wins (its VariantRules.awardPortion).
 */
import type { AwardPortion, Card, GameSpec, PortionAward, VariantRules } from '@rsdp/engine/core';

export const GAME_ID = 'straight-1836';

/** Ranks in the 20-card deck, lowest first, using the engine's card letters ("T" is ten). */
export const RANKS_20 = ['T', 'J', 'Q', 'K', 'A'] as const;
export const SUITS = ['c', 'd', 'h', 's'] as const;

/** The 20-card deck in a fixed order (shuffle before use). */
export function deck20(): Card[] {
  const deck: Card[] = [];
  for (const r of RANKS_20) for (const s of SUITS) deck.push(r + s);
  return deck;
}

export const STRAIGHT_POKER: GameSpec = {
  id: GAME_ID,
  name: 'Straight Poker (1836)',
  // 'draw' is the engine family for games with private cards and no board.
  // With no drawMaxDiscard on the street, the engine skips the draw entirely.
  family: 'draw',
  streets: [{ name: 'The deal', dealDown: 5, dealUp: 0, dealBoard: 0, betSize: 'small' }],
  maxPlayers: 4,
  defaultBetting: 'no-limit',
  split: 'high',
  // We post antes ourselves (see src/table/session.ts), so the engine never plans blinds.
  forcedBets: 'blinds',
};

// ------------------------------------------------------------------ hand ranking

export type Category = 0 | 1 | 2 | 3 | 4 | 5;

export const CATEGORY_NAMES: Record<Category, string> = {
  0: 'High card',
  1: 'One pair',
  2: 'Two pairs',
  3: 'Triplets',
  4: 'Full house',
  5: 'Four of a kind',
};

/** Best first, for the in-game rules panel. */
export const RANKING_ORDER: Category[] = [5, 4, 3, 2, 1, 0];

export interface HandValue {
  category: Category;
  /** Compare two hands with compareValues: higher wins. */
  key: number[];
  /** For people, e.g. "Two pairs, kings and tens". */
  name: string;
}

const RANK_VALUE: Record<string, number> = { T: 10, J: 11, Q: 12, K: 13, A: 14 };
const RANK_WORD: Record<number, [string, string]> = {
  10: ['ten', 'tens'],
  11: ['jack', 'jacks'],
  12: ['queen', 'queens'],
  13: ['king', 'kings'],
  14: ['ace', 'aces'],
};

export function rankValue(card: Card): number {
  const v = RANK_VALUE[card[0]];
  if (v === undefined) throw new Error(`not a 20-card deck card: ${card}`);
  return v;
}

/**
 * Values a five-card hand under 1836 rules. Ties are broken by the ranks of
 * the groups (biggest group first), then by the leftover cards, high to low.
 */
export function evaluate1836(cards: Card[]): HandValue {
  if (cards.length !== 5) throw new Error(`a hand is five cards, got ${cards.length}`);
  const counts = new Map<number, number>();
  for (const c of cards) counts.set(rankValue(c), (counts.get(rankValue(c)) ?? 0) + 1);
  // Groups sorted by size, then by rank: e.g. full house kings over tens = [[13,3],[10,2]].
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const shape = groups.map((g) => g[1]).join('');
  const category: Category =
    shape === '41' ? 5 : shape === '32' ? 4 : shape === '311' ? 3 : shape === '221' ? 2 : shape === '2111' ? 1 : 0;
  const key = [category, ...groups.map((g) => g[0])];
  return { category, key, name: describe(category, groups.map((g) => g[0])) };
}

function describe(category: Category, ranks: number[]): string {
  const [a, b] = ranks;
  const one = (r: number) => RANK_WORD[r][0];
  const many = (r: number) => RANK_WORD[r][1];
  switch (category) {
    case 5: return `Four ${many(a)}`;
    case 4: return `Full house, ${many(a)} over ${many(b)}`;
    case 3: return `Triplets, ${many(a)}`;
    case 2: return `Two pairs, ${many(a)} and ${many(b)}`;
    case 1: return `A pair of ${many(a)}`;
    case 0: return `${cap(one(a))} high`;
  }
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Positive when a beats b, negative when b wins, 0 for a tie. */
export function compareValues(a: HandValue, b: HandValue): number {
  for (let i = 0; i < Math.max(a.key.length, b.key.length); i++) {
    const d = (a.key[i] ?? 0) - (b.key[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

// ------------------------------------------------------------------ showdown

/**
 * Splits one pot among the best hands, the same way the engine's own
 * high-hand award does: equal shares, odd chips one at a time in `eligible`
 * order (the engine passes it already in odd-chip order).
 */
export const awardPortion1836: AwardPortion = (_spec, amount, eligible, holeBySeat) => {
  if (amount === 0) return [];
  if (eligible.length === 0) throw new Error('no eligible seat for a non-empty portion');
  const hands = eligible.map((seat) => ({ seat, cards: holeBySeat[seat], value: evaluate1836(holeBySeat[seat]) }));
  let best = hands[0];
  for (const h of hands) if (compareValues(h.value, best.value) > 0) best = h;
  const winners = hands.filter((h) => compareValues(h.value, best.value) === 0);
  const share = Math.floor(amount / winners.length);
  const odd = amount - share * winners.length;
  const awards: PortionAward[] = [];
  winners.forEach((w, i) => {
    const won = share + (i < odd ? 1 : 0);
    if (won > 0) awards.push({ seat: w.seat, amount: won, half: 'scoop', handName: w.value.name, cards: w.cards });
  });
  return awards;
};

export const STRAIGHT_POKER_RULES: VariantRules = { awardPortion: awardPortion1836 };
