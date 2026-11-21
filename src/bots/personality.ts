/**
 * How a rival decides. The thinking is RSDP Live's practice bot, copied into
 * src/bots/rsdp/ (docs/BOTS.md): it deals the unseen cards out many times to
 * estimate its chance, weighs every way to draw, and bets by the rules of one
 * of its three levels (Easy, Normal, Hard).
 *
 * What this file adds is the character. Each rival has a Personality: RSDP's
 * level, and a handful of numbers that bend that level's play so Silas is
 * reckless, Delphine shrewd and Ezra timid. The same play() runs all of them,
 * so a new character is a new set of numbers (and a tell) in its chapter
 * file, not new code.
 *
 * The numbers reach RSDP's bot in three ways:
 *  - what it sees: the chance it worked out is shown to its betting rules a
 *    little higher or lower (`valueAt`, `caution`), so the same rules bet
 *    thinner or call tighter;
 *  - its dice: its bet sizes are the character's (`betSize`), and a character
 *    who never bluffs never takes RSDP's bluffs either;
 *  - after it has chosen: a trapper sometimes checks a hand RSDP would bet
 *    (`trap`), and a bluffer sometimes bets one RSDP would check or fold
 *    (`bluff`).
 */
import type { Action, HandState, LegalActions, PlayerId, SeatIndex } from '@rsdp/engine/core';
import type { BotLevel } from '@rsdp/engine/wire';
import type { GameDef } from '../games/catalog';
import { teachBots } from './games';
import { coachTuning, botTuning, explainMove, sizeTo, type BotContext, type MoveWhy, type PlayerRead } from './rsdp/strategy';
import type { Random } from './random';

export type { BotLevel, PlayerRead };

export interface Personality {
  /**
   * RSDP Live's bot level this character thinks at (default 'normal').
   * 'easy' calls small bets with almost anything, bets only good hands and
   * never bluffs by itself. 'normal' plays the pot odds with a small margin.
   * 'hard' also follows how many cards you draw, uses position, bets thinner
   * against players who call a lot and bluffs players who fold a lot. This
   * is a teaching game: most rivals are easy or normal (docs/BOTS.md).
   */
  level?: BotLevel;
  /**
   * How strong a hand must be before betting for value when nobody has bet,
   * as a multiple of an average hand's share (1 = average, 2 = twice as
   * good). RSDP's own bar is 1.7 at Easy, 1.45 at Normal and 1.35 at Hard;
   * a character with that number plays the level as RSDP wrote it.
   */
  valueAt: number;
  /** Chance of betting or raising with a weak hand (a bluff), on top of any bluffs RSDP's level makes. 0 = never bluffs at all. */
  bluff: number;
  /**
   * Extra winning chance demanded above the pot odds before calling (0.1 =
   * 10 points). 0.03 is RSDP Normal's own margin; less than that (or
   * negative) calls too much, more folds too much.
   */
  caution: number;
  /** Bet size as a share of the pot. */
  betSize: number;
  /** Chance of checking a strong hand when nobody has bet, hoping to raise later (a trap). */
  trap?: number;
  /**
   * How much a bet scares this player, 0 to 1 (default 0.6). It scales
   * RSDP's read of the betting (strategy.ts, handReads), in which every bet
   * or raise an opponent makes this hand deals them stronger cards. 1 =
   * believes every bet; 0.2 = barely notices. Easy players don't read the
   * betting at all, as in RSDP.
   */
  respect?: number;
  /**
   * How fast this player sizes up YOU over the evening, 0 to 1 (default
   * 0.5): how much of RSDP's record of each player (how often they bet, how
   * often they fold to a bet) this character takes in. A player who reads
   * well stops believing someone who bets every hand, and a Hard one starts
   * bluffing someone who keeps folding. 0 = never adjusts.
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
/** RSDP's own bar for a value bet at each level, as a multiple of an average hand (strategy.ts: decideEasy, decide, decideHard). */
export const VALUE_BAR: Record<BotLevel, number> = { easy: 1.7, normal: 1.45, hard: 1.35 };
/** RSDP Normal's own margin above the pot odds for a call. */
export const CALL_MARGIN = 0.03;

export interface Decision {
  action: Action;
  /** Betting or raising with a weak hand. Drives the tells. */
  bluffing: boolean;
  /** Holding a strong hand. Drives the tells. */
  strong: boolean;
  /** Holding a below-average hand. Drives the tells. */
  weak: boolean;
}

/** What a rival does on its turn, with the numbers RSDP's bot worked out. */
export type Play =
  | ({ kind: 'act'; why: MoveWhy; equity: number } & Decision)
  | { kind: 'draw'; discard: number[]; why: MoveWhy };

export interface Spot {
  hand: HandState;
  seat: SeatIndex;
  game: GameDef;
  /** The legal moves as the table has them (it may add a period rule to the engine's). Betting turns only. */
  legal?: LegalActions;
  /** RSDP's record of how everyone has played this sitting (readPlayers). */
  players?: Record<PlayerId, PlayerRead>;
  /** Stung by a big loss: play by the tilted numbers (see `tilt`). */
  tilted?: boolean;
  /** Deals per estimate; missing, the game's usual number (see thinking()). */
  sims?: number;
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

/**
 * Sets how long RSDP's bot and coach think. RSDP Live stops by the clock (a
 * few milliseconds on its server); here they deal a fixed number of finishes
 * instead, fewer for the slow many-card games, so a seeded game replays
 * exactly and a phone is not asked for more than it can do.
 */
export function thinking(game: GameDef, sims?: number) {
  teachBots();
  const n = sims ?? Math.max(30, Math.round(260 / game.simCost));
  // Draw decisions try every way to draw on a few deals each; tests that ask for very few deals get fewer there too.
  const f = sims === undefined ? 1 : Math.min(1, sims / 60);
  const few = (k: number) => Math.max(2, Math.round(k * f));
  Object.assign(botTuning, { thinkMs: Infinity, minSims: 1, maxSims: n, drawSims: few(10), drawFinalSims: few(60), drawBetSims: few(6), drawBetFinalSims: few(24) });
  // The coach thinks about three times as long as a bot, as in RSDP Live.
  coachTuning.equity = { thinkMs: Infinity, minSims: 1, maxSims: n * 3 };
  coachTuning.draw = { screen: few(24), final: few(120) };
  coachTuning.drawBet = { screen: few(12), final: few(60) };
  // The "against random hands" comparison is for RSDP Live's tip panel; nothing here shows it.
  coachTuning.vsRandomUnderMs = 0;
}

/** The player's record as this character has taken it in: a slow reader has seen less of it. */
function taken(players: Record<PlayerId, PlayerRead>, reads: number): Record<PlayerId, PlayerRead> {
  const out: Record<PlayerId, PlayerRead> = {};
  for (const [id, r] of Object.entries(players)) out[id] = { acts: r.acts * reads, aggressive: r.aggressive * reads, faced: r.faced * reads, folds: r.folds * reads };
  return out;
}

export function play(personality: Personality, spot: Spot, rnd: Random): Play {
  const { hand, seat, legal } = spot;
  thinking(spot.game, spot.sims);
  const p = effective(personality, spot.tilted);
  const level = p.level ?? 'normal';
  const ctx: BotContext = {
    level,
    players: taken(spot.players ?? {}, p.reads ?? READS),
    // Easy players pay the betting no mind, as in RSDP.
    reads: level === 'easy' ? undefined : (p.respect ?? RESPECT) / RESPECT,
    legal,
    // Nobody has bet: a looser character sees a hand worth betting sooner. Facing a bet: a careful one sees a worse price.
    see: (equity, l) => (l.canCheck || l.canBringIn ? (equity * VALUE_BAR[level]) / p.valueAt : equity - (p.caution - CALL_MARGIN)),
    dice: (dice) => ({
      roll: (label, chance) => dice.roll(label, (label === 'bluff' || label === 'steal' || label === 'semi-bluff') && p.bluff <= 0 ? 0 : chance),
      between: (label, base, span) => (label === 'size' ? dice.between(label, p.betSize * 0.85, p.betSize * 0.3) : dice.between(label, base, span)),
    }),
  };
  const { move, why } = explainMove(hand, seat, rnd.next, ctx);
  if (move.kind === 'draw') return { kind: 'draw', discard: move.discard, why };

  const l = legal!;
  const equity = why.equity ?? 0;
  const opponents = why.opponents ?? 1;
  // 1 = an average hand for this many players, 2 = twice the average share.
  const relative = equity * (opponents + 1);
  const strong = relative >= p.valueAt;
  const weak = relative < 1;
  const pot = hand.seats.reduce((n, x) => n + x.total, 0);
  const bluffChance = p.bluff * (BLUFF_BY_OPPONENTS[opponents] ?? 0.3);
  const bluffTo = () => sizeTo(l, hand.currentBet + pot * p.betSize * 0.8 * (0.85 + rnd.next() * 0.3));
  let action = move.action;
  let bluffing = why.rule === 'bluff' || why.rule === 'steal' || why.rule === 'semi-bluff';

  if (l.canBringIn) {
    // Stud's forced bet: RSDP's choice stands.
  } else if (why.rule === 'value' && l.canCheck && rnd.chance(p.trap ?? 0)) {
    action = { type: 'check' };
  } else if (action.type === 'check' && l.canRaise && !strong && rnd.chance(bluffChance)) {
    action = { type: l.raiseKind, to: bluffTo() };
    bluffing = true;
  } else if (action.type === 'fold' && l.canRaise && hand.raisesThisRound < 3 && rnd.chance(bluffChance * 0.5)) {
    action = { type: l.raiseKind, to: bluffTo() };
    bluffing = true;
  }
  return { kind: 'act', action, why, equity, bluffing, strong, weak };
}
