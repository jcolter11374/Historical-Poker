/**
 * How a computer player decides. Each rival has a Personality: a handful of
 * numbers that make Silas reckless, Delphine shrewd and Ezra timid. The same
 * decide() function runs all of them, so a new character is a new set of
 * numbers (and a tell) in its chapter file, not new code.
 */
import type { Action, LegalActions } from '@rsdp/engine/core';
import type { Random } from './random';

export interface Personality {
  /**
   * How strong a hand must be before betting or raising for value, as a
   * multiple of an average hand's share (1 = average, 2 = twice as good).
   */
  valueAt: number;
  /** Chance of betting or raising with a weak hand (a bluff). */
  bluff: number;
  /** Extra winning chance demanded above the pot odds before calling (0.1 = 10 points). */
  caution: number;
  /** Bet size as a share of the pot. */
  betSize: number;
  /** Chance of checking a strong hand when nobody has bet, hoping to raise later (a trap). */
  trap?: number;
  /**
   * How much a bet scares this player, 0 to 1 (default 0.6). Each bet or raise
   * an opponent makes this hand counts the deals where they're ahead
   * (1 + respect) times over. 1 = believes every bet; 0.2 = barely notices.
   */
  respect?: number;
  /**
   * How well this player sizes up YOU over the evening, 0 to 1 (default 0.5).
   * If you bet and raise far more than a normal player, a player who reads
   * stops believing your bets and calls you down; if you rarely bet, they
   * fold to you more. 0 = never adjusts.
   */
  reads?: number;
  /**
   * Temper, 0 to 0.3 (default 0). After losing a big pot, for the next three
   * hands this much is added to `bluff`, taken from `valueAt`, and half of it
   * taken from `caution`: they play looser and wilder. The table sees it.
   */
  tilt?: number;
}

/** Defaults for the optional numbers. */
export const RESPECT = 0.6;
export const READS = 0.5;

export interface Situation {
  legal: LegalActions;
  /** 0-1 share of the pot this hand wins on average (see strength.ts). */
  equity: number;
  /** Other players still in the hand. */
  opponents: number;
  /** Chips in the middle, counting this round's bets. */
  pot: number;
  /** The highest bet this round, which a raise must beat. */
  currentBet: number;
  /** Stung by a big loss: play by the tilted numbers (see `tilt`). */
  tilted?: boolean;
}

export interface Decision {
  action: Action;
  /** Betting or raising with a weak hand. Drives the tells. */
  bluffing: boolean;
  /** Holding a strong hand. Drives the tells. */
  strong: boolean;
  /** Holding a below-average hand. Drives the tells. */
  weak: boolean;
}

/** The numbers this player actually uses now: tilted, if stung. */
export function effective(p: Personality, tilted = false): Personality {
  const t = tilted ? (p.tilt ?? 0) : 0;
  if (!t) return p;
  return { ...p, bluff: p.bluff + t, valueAt: Math.max(1.05, p.valueAt - t), caution: p.caution - t / 2 };
}

/**
 * A bluff works best against one player and hardly ever against three, so
 * the bluff chance scales with how many are still in.
 */
const BLUFF_BY_OPPONENTS = [0, 1.4, 1, 0.55, 0.4];

export function decide(personality: Personality, s: Situation, rnd: Random): Decision {
  const p = effective(personality, s.tilted);
  const { legal, equity, opponents, pot } = s;
  const bluff = p.bluff * (BLUFF_BY_OPPONENTS[opponents] ?? 0.3);
  // 1 = an average hand for this many players, 2 = twice the average share.
  const relative = equity * (opponents + 1);
  const strong = relative >= p.valueAt;
  const weak = relative < 1;
  const sizeTo = (fraction: number) => {
    const want = s.currentBet + Math.round(pot * fraction * (0.85 + rnd.next() * 0.3));
    return clamp(want, legal.minTo, legal.maxTo);
  };
  const aggressive = (bluffing: boolean): Decision => ({
    action: { type: legal.raiseKind, to: sizeTo(bluffing ? p.betSize * 0.8 : p.betSize) },
    bluffing,
    strong,
    weak,
  });

  if (legal.canCheck) {
    if (legal.canRaise && strong && !rnd.chance(p.trap ?? 0)) return aggressive(false);
    if (legal.canRaise && !strong && rnd.chance(bluff)) return aggressive(true);
    return { action: { type: 'check' }, bluffing: false, strong, weak };
  }

  const potOdds = legal.callAmount / (pot + legal.callAmount);
  if (legal.canRaise && relative >= p.valueAt * 1.25) return aggressive(false);
  if (equity >= potOdds + p.caution) return { action: { type: 'call' }, bluffing: false, strong, weak };
  if (legal.canRaise && rnd.chance(bluff * 0.5)) return aggressive(true);
  return { action: { type: 'fold' }, bluffing: false, strong, weak };
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
