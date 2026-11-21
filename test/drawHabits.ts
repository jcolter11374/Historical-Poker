/**
 * Simple rules of thumb for drawing, for the test players only (test/play.ts,
 * test/standIns.ts, test/rules.test.ts): quick, and the same every time. The
 * rivals and the hints do not use these; they weigh every way to draw with
 * RSDP Live's bot (src/bots/rsdp/strategy.ts, bestDraw).
 */
import type { Card } from '@rsdp/engine/core';
import { HIGH_EVALUATORS, bestBadugi } from '@rsdp/engine/variants';
import { POINTS, scorePrimero } from '../src/games/primero';

/**
 * High-hand draw: keep matched cards; otherwise four to a flush; otherwise
 * the ace (or the highest card). At most `max` thrown.
 */
export function highDrawDiscards(cards: Card[], max: number): number[] {
  const counts = new Map<string, number>();
  for (const c of cards) counts.set(c[0], (counts.get(c[0]) ?? 0) + 1);
  const matched = cards.map((c, i) => ((counts.get(c[0]) ?? 0) >= 2 ? i : -1)).filter((i) => i >= 0);
  // A pat hand (straight or better) stands.
  const name = (HIGH_EVALUATORS['any-five'](cards, [])?.name ?? '');
  if (/Straight|Flush|Full House|Four/i.test(name)) return [];
  if (matched.length) return cards.map((_, i) => i).filter((i) => !matched.includes(i)).slice(0, max);
  const suits = new Map<string, number[]>();
  cards.forEach((c, i) => suits.set(c[1], [...(suits.get(c[1]) ?? []), i]));
  const four = [...suits.values()].find((s) => s.length === 4);
  if (four) return cards.map((_, i) => i).filter((i) => !four.includes(i));
  const order = '23456789TJQKA';
  const top = cards.reduce((a, _, i) => (order.indexOf(cards[i][0]) > order.indexOf(cards[a][0]) ? i : a), 0);
  // Throw the lowest first, so a three-card limit keeps the two highest.
  const throwAll = cards
    .map((_, i) => i)
    .filter((i) => i !== top)
    .sort((a, b) => order.indexOf(cards[a][0]) - order.indexOf(cards[b][0]));
  return throwAll.slice(0, cards[top][0] === 'A' ? Math.min(4, max) : Math.min(3, max));
}

/** 2-7 lowball: throw pairs, aces and anything above an eight. */
export function lowballDiscards(cards: Card[], max: number): number[] {
  const order = '23456789TJQKA';
  const seen = new Set<string>();
  const out: number[] = [];
  cards
    .map((c, i) => ({ c, i }))
    .sort((a, b) => order.indexOf(a.c[0]) - order.indexOf(b.c[0]))
    .forEach(({ c, i }) => {
      if (seen.has(c[0]) || order.indexOf(c[0]) > order.indexOf('8')) out.push(i);
      seen.add(c[0]);
    });
  return out.slice(0, max);
}

/**
 * Which cards to change (indexes), at most `max`. Aims for the best category
 * within reach: keep a near-fluxus suit, keep a near-primero spread (one card
 * per suit, the highest), otherwise change the lowest cards.
 */
export function primeroDiscards(cards: Card[], max: number): number[] {
  if (cards.length < 4 || max === 0) return [];
  const now = scorePrimero(cards).key[0];
  if (now >= 1) return []; // primero or better: keep it
  const bySuit = new Map<string, number[]>();
  cards.forEach((c, i) => bySuit.set(c[1], [...(bySuit.get(c[1]) ?? []), i]));
  const longest = [...bySuit.values()].sort((a, b) => b.length - a.length)[0];
  if (longest.length >= 3) return cards.map((_, i) => i).filter((i) => !longest.includes(i)).slice(0, max);
  // Keep the best card of each suit; change the rest (lowest first).
  const keep = new Set([...bySuit.values()].map((idx) => idx.reduce((a, b) => (POINTS[cards[b][0]] > POINTS[cards[a][0]] ? b : a))));
  return cards
    .map((_, i) => i)
    .filter((i) => !keep.has(i))
    .sort((a, b) => POINTS[cards[a][0]] - POINTS[cards[b][0]])
    .slice(0, max);
}

/** Badugi: keep the cards that count. */
export function badugiDiscards(cards: Card[], max: number): number[] {
  const keep = new Set(bestBadugi(cards).cards);
  return cards.map((c, i) => (keep.has(c) ? -1 : i)).filter((i) => i >= 0).slice(0, max);
}

const HABITS: Record<string, (cards: Card[], max: number) => number[]> = {
  'primero-1543': primeroDiscards,
  'draw5-1876': highDrawDiscards,
  td27: lowballDiscards,
  badugi: badugiDiscards,
};

/** The cards a test player throws in this game (none if it has no habit). */
export const drawHabit = (gameId: string, cards: Card[], max: number): number[] => HABITS[gameId]?.(cards, max) ?? [];
