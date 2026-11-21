/**
 * Turns a chapter's one-number stake (its `unit`, raised as the night wears
 * on) into the engine's forced bets for one hand of one game. See
 * Structure in src/chapters/types.ts.
 */
import type { BettingKind, PlannedPost, SeatIndex, Stakes } from '@rsdp/engine/core';
import type { Betting } from '../chapters/types';
import type { ForcedStyle } from '../games/catalog';

/** The unit after `level` rises of half again each, rounded to a whole number (at least the base). */
export function unitAt(base: number, level: number): number {
  return Math.max(base, Math.round(base * 1.5 ** level));
}

export function stakesFor(style: ForcedStyle, unit: number): Stakes {
  const half = Math.max(1, Math.round(unit / 2));
  const stud = style === 'stud' || style === 'stud-open';
  const ante = stud ? Math.max(1, Math.round(unit / 5)) : style === 'antes' ? half : 0;
  return {
    smallBlind: style === 'blinds' ? half : 0,
    bigBlind: unit,
    ante,
    anteType: ante ? 'per-player' : 'none',
    // 'stud-open' has no bring-in: the best card showing opens, and may check.
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
  if (style === 'age') {
    // The eldest hand (the "age", left of the dealer) antes half a unit blind. The engine reads a lone
    // 'big-blind' post smaller than stakes.bigBlind as "everyone else must still put in the full amount",
    // which is the old rule exactly: it costs double the ante to come in, and the age makes his ante good last.
    return [{ seat: order[0], kind: 'big-blind', amount: Math.max(1, Math.round(stakes.bigBlind / 2)), live: true }];
  }
  if (style === 'antes' || style === 'stud' || style === 'stud-open') return order.map((seat) => ({ seat, kind: 'ante', amount: stakes.ante, live: false }));
  const [sb, bb] = order.length === 2 ? [button, order.find((s) => s !== button)!] : [order[0], order[1]];
  return [
    { seat: sb, kind: 'small-blind', amount: stakes.smallBlind, live: true },
    { seat: bb, kind: 'big-blind', amount: stakes.bigBlind, live: true },
  ];
}

const WORD: Record<Betting, string> = { 'no-limit': 'No-Limit', 'pot-limit': 'Pot-Limit', 'fixed-limit': 'Limit', 'spread-limit': 'Limit' };

/** "No-Limit Hold'em", "Pot-Limit Omaha", "Razz" (stud and draw games are limit by nature; historical games don't say). */
export function playName(name: string, betting: Betting, historical: boolean, family: string): string {
  if (historical) return name;
  if (family !== 'flop' && (betting === 'fixed-limit' || betting === 'spread-limit')) return name;
  return `${WORD[betting]} ${name}`;
}

/** What the engine runs for a table's betting: the old agreed limit is no-limit with a ceiling the table adds. */
export function engineBetting(betting: Betting): BettingKind {
  return betting === 'spread-limit' ? 'no-limit' : betting;
}

/** 'spread-limit': the most one bet or raise may be. */
export function spreadLimit(unit: number, limitUnits = 5): number {
  return unit * limitUnits;
}

/**
 * Pot limit: the sum behind the biggest bet or raise allowed, in words, so
 * "raise to 70" with 30 in the pot makes sense. Null when the limit is not
 * the pot (your purse is smaller, or the pot is below the smallest bet).
 */
export function potLimitWords(legal: { canRaise: boolean; callAmount: number; maxTo: number }, pot: number, myBet: number, money: (n: number) => string): string | null {
  if (!legal.canRaise) return null;
  const call = legal.callAmount;
  if (legal.maxTo !== myBet + call + pot + call) return null;
  if (!call) return myBet ? `Pot limit: the pot is ${money(pot)}, so you can raise by ${money(pot)}, to ${money(legal.maxTo)}.` : `Pot limit: the pot is ${money(pot)}, so you can bet up to ${money(legal.maxTo)}.`;
  return `Pot limit: pot ${money(pot)} + your call ${money(call)} = ${money(pot + call)}, so you can raise by ${money(pot + call)}, to ${money(legal.maxTo)}.`;
}
