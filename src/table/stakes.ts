/**
 * Turns a chapter's one-number stake (its `unit`, raised as the night wears
 * on) into the engine's forced bets for one hand of one game. See
 * Structure in src/chapters/types.ts.
 */
import type { BettingKind, PlannedPost, SeatIndex, Stakes } from '@rsdp/engine/core';
import type { ForcedStyle } from '../games/catalog';

/** The unit after `level` rises of half again each, rounded to a whole number (at least the base). */
export function unitAt(base: number, level: number): number {
  return Math.max(base, Math.round(base * 1.5 ** level));
}

export function stakesFor(style: ForcedStyle, unit: number): Stakes {
  const half = Math.max(1, Math.round(unit / 2));
  const ante = style === 'stud' ? Math.max(1, Math.round(unit / 5)) : style === 'antes' ? half : 0;
  return {
    smallBlind: style === 'blinds' ? half : 0,
    bigBlind: unit,
    ante,
    anteType: ante ? 'per-player' : 'none',
    bringIn: style === 'stud' ? Math.max(1, Math.round(unit / 3)) : 0,
    smallBet: unit,
    bigBet: unit * 2,
  };
}

/**
 * Forced bets in posting order. `order` is the live seats clockwise from the
 * seat after the buck. Heads-up, the buck posts the small blind.
 */
export function postsFor(style: ForcedStyle, stakes: Stakes, order: SeatIndex[], button: SeatIndex, bomb: number | null): PlannedPost[] {
  if (bomb !== null) return order.map((seat) => ({ seat, kind: 'bomb-pot', amount: bomb, live: true }));
  if (style === 'antes' || style === 'stud') return order.map((seat) => ({ seat, kind: 'ante', amount: stakes.ante, live: false }));
  const [sb, bb] = order.length === 2 ? [button, order.find((s) => s !== button)!] : [order[0], order[1]];
  return [
    { seat: sb, kind: 'small-blind', amount: stakes.smallBlind, live: true },
    { seat: bb, kind: 'big-blind', amount: stakes.bigBlind, live: true },
  ];
}

const WORD: Record<BettingKind, string> = { 'no-limit': 'No-Limit', 'pot-limit': 'Pot-Limit', 'fixed-limit': 'Limit' };

/** "No-Limit Hold'em", "Pot-Limit Omaha", "Razz" (stud and draw games are limit by nature; historical games don't say). */
export function playName(name: string, betting: BettingKind, historical: boolean, family: string): string {
  if (historical) return name;
  if (family !== 'flop' && betting === 'fixed-limit') return name;
  return `${WORD[betting]} ${name}`;
}
