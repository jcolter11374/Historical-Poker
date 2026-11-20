/**
 * Shared showdown helper for the historical games. The engine's own games
 * settle with the engine's awardPortion; ours only need "best hand takes it,
 * ties split", so each historical game supplies a scoring function and this
 * turns it into the engine's AwardPortion.
 */
import type { AwardPortion, Card, PortionAward } from '@rsdp/engine/core';
import { evaluateHigh } from '@rsdp/engine/variants';

export interface Scored {
  /** Compare with compareKeys: higher wins. */
  key: number[];
  /** For people, e.g. "Full house, kings over tens". */
  name: string;
}

/** Positive when a beats b, negative when b wins, 0 for a tie. */
export function compareKeys(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/**
 * Builds an AwardPortion from a scoring function. Equal shares; odd chips one
 * at a time in `eligible` order (the engine passes it in odd-chip order).
 */
export function highAward(score: (cards: Card[]) => Scored): AwardPortion {
  return (_spec, amount, eligible, holeBySeat, board) => {
    if (amount === 0) return [];
    if (eligible.length === 0) throw new Error('no eligible seat for a non-empty portion');
    const hands = eligible.map((seat) => {
      const cards = [...holeBySeat[seat], ...board];
      return { seat, cards, value: score(cards) };
    });
    let best = hands[0];
    for (const h of hands) if (compareKeys(h.value.key, best.value.key) > 0) best = h;
    const winners = hands.filter((h) => compareKeys(h.value.key, best.value.key) === 0);
    const share = Math.floor(amount / winners.length);
    const odd = amount - share * winners.length;
    const awards: PortionAward[] = [];
    winners.forEach((w, i) => {
      const won = share + (i < odd ? 1 : 0);
      if (won > 0) awards.push({ seat: w.seat, amount: won, half: 'scoop', handName: w.value.name, cards: w.cards });
    });
    return awards;
  };
}

/** "Ace", "Kings": words for ranks in hand names. */
export const RANK_WORDS: Record<string, [string, string]> = {
  A: ['ace', 'aces'],
  K: ['king', 'kings'],
  Q: ['queen', 'queens'],
  J: ['jack', 'jacks'],
  T: ['ten', 'tens'],
  '9': ['nine', 'nines'],
  '8': ['eight', 'eights'],
  '7': ['seven', 'sevens'],
  '6': ['six', 'sixes'],
  '5': ['five', 'fives'],
  '4': ['four', 'fours'],
  '3': ['three', 'threes'],
  '2': ['two', 'twos'],
};

export const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Engine rank order, 2 = 2 ... A = 14. */
export const RANK_ORDER: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, T: 10, J: 11, Q: 12, K: 13, A: 14 };

/** Modern high hands, best five of the cards (five-card stud and draw). */
export const anyFiveAward: AwardPortion = (_spec, amount, eligible, holeBySeat, board) => {
  if (amount === 0) return [];
  const ranked = eligible.map((seat) => ({ seat, hand: evaluateHigh(holeBySeat[seat], board) }));
  const top = Math.max(...ranked.map((r) => r.hand.score));
  const won = ranked.filter((r) => r.hand.score === top);
  const base = Math.floor(amount / won.length);
  const extra = amount - base * won.length;
  return won
    .map((w, i) => ({ seat: w.seat, amount: base + (i < extra ? 1 : 0), half: 'high' as const, handName: w.hand.name, cards: w.hand.cards }))
    .filter((a) => a.amount > 0);
};
