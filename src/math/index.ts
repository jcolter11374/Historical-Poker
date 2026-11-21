/**
 * Math Mode: sums for a young player, made from the hand they are playing.
 * Off unless the player switches it on (docs/GAME_DESIGN.md, "Math Mode").
 *
 * Two kinds of question, both asked while it is the player's turn to bet:
 *
 * - **Counting outs** (`outsQuestion`): "how many of the cards you can't see
 *   would make your hand a better kind of hand?" The answer is a fraction the
 *   player can see: 9 helpful cards out of 47 unseen.
 * - **A good deal?** (`dealQuestion`): the pot against the price of a call.
 *   The call is a good deal when the player's chance of winning is bigger
 *   than their share of the money: price / (pot + price).
 *
 * Nothing here changes the game. It reads what the player can already see
 * (their cards, the board, cards face up, the pot, the price) and the same
 * winning chance the teacher's hint gives. No React, so tests can check the
 * sums (test/math.test.ts).
 */
import type { Card } from '@rsdp/engine/core';
import { HIGH_EVALUATORS, VARIANTS, type VariantId } from '@rsdp/engine/variants';
import type { GameDef } from '../games/catalog';
import { FIVE_CARD_STUD } from '../games/fiveCardStud';

// ---------------------------------------------------------------- fractions

export interface Fraction {
  top: number;
  bottom: number;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** 4/16 -> 1/4. */
export function simplify(top: number, bottom: number): Fraction {
  const g = gcd(Math.abs(top), Math.abs(bottom)) || 1;
  return { top: top / g, bottom: bottom / g };
}

export const percent = (f: Fraction) => Math.round((f.top / f.bottom) * 100);

const FRIENDLY: Fraction[] = [
  [1, 20], [1, 10], [1, 8], [1, 6], [1, 5], [1, 4], [1, 3], [2, 5], [1, 2], [3, 5], [2, 3], [3, 4], [4, 5], [9, 10],
].map(([top, bottom]) => ({ top, bottom }));

/** The everyday fraction nearest to a chance: 9/47 -> 1 in 5. */
export function roughly(chance: number): Fraction {
  return FRIENDLY.reduce((best, f) => (Math.abs(f.top / f.bottom - chance) < Math.abs(best.top / best.bottom - chance) ? f : best));
}

// ---------------------------------------------------------------- what the player can see

/** The player's view of the hand: only what is face up to them. */
export interface MathView {
  game: GameDef;
  /** The player's own cards. */
  mine: Card[];
  /** Shared cards so far (one board only). */
  board: Card[];
  /** Every other card the player can see: rivals' face-up cards, folded or not. */
  shown: Card[];
  /** Index of the betting round being played (the game's `spec.streets`). */
  street: number;
}

/** Cards the player can't see: the deck less their own, the board and anything face up. */
export function unseenCards(v: MathView): Card[] {
  const seen = new Set<Card>([...v.mine, ...v.board, ...v.shown]);
  return v.game.deck().filter((c) => !seen.has(c));
}

// ---------------------------------------------------------------- counting outs

/** Kinds of hand, worst first: the index is the engine's category number. */
const KINDS = ['high card', 'a pair', 'two pair', 'three of a kind', 'a straight', 'a flush', 'a full house', 'four of a kind', 'a straight flush'];
const CATEGORY_SPAN = 16 ** 5; // the engine's hand scores: category first, then five rank digits

export interface OutsQuestion {
  kind: 'outs';
  ask: string;
  /** Four numbers to choose from, smallest first. */
  choices: number[];
  answer: number;
  /** The helpful cards. */
  outs: Card[];
  /** Every card the player can't see (the helpful ones are among them). */
  unseen: Card[];
  /** The whole deck in order, for laying the cards out. */
  deck: Card[];
  /** Said once the player has answered. */
  explain: string;
}

/** Which of the engine's high-hand rules a game uses, or null if outs aren't counted in it. */
function highRule(game: GameDef): 'any-five' | 'omaha' | null {
  if (game.id === FIVE_CARD_STUD.id) return 'any-five';
  const v = VARIANTS[game.id as VariantId];
  if (!v || v.showdown.low || !v.showdown.high) return null;
  return v.showdown.high;
}

/**
 * The outs question for this moment, or null when there isn't one.
 *
 * Asked only where the answer is clean enough to count on fingers:
 * - a game won by the best high hand (Hold'em, the Omahas, seven-card and
 *   five-card stud), not a low or split game;
 * - exactly one card comes next (the turn or river, or the next stud card);
 * - at least one card helps.
 *
 * A card "helps" when it makes the player's hand a better KIND of hand
 * (a pair becomes two pair, four hearts become a flush). In a game with a
 * board, a card that gives the same kind of hand to everyone doesn't count
 * (the board pairing when you hold nothing).
 */
export function outsQuestion(v: MathView): OutsQuestion | null {
  const rule = highRule(v.game);
  const next = v.game.spec.streets[v.street + 1];
  if (!rule || !next) return null;
  const toBoard = next.dealBoard === 1 && next.dealUp + next.dealDown === 0;
  const toMe = next.dealBoard === 0 && next.dealUp + next.dealDown === 1;
  if (!toBoard && !toMe) return null;
  const kindOf = (hole: Card[], board: Card[]): number | null => {
    try {
      const r = HIGH_EVALUATORS[rule](hole, board);
      return r ? Math.floor(r.score / CATEGORY_SPAN) : null;
    } catch {
      return null; // too few cards to say (Omaha before the flop)
    }
  };
  const now = kindOf(v.mine, v.board);
  if (now === null) return null;
  const unseen = unseenCards(v);
  const made = new Map<number, Card[]>();
  for (const c of unseen) {
    const after = toBoard ? kindOf(v.mine, [...v.board, c]) : kindOf([...v.mine, c], v.board);
    if (after === null || after <= now) continue;
    // A board card that makes this kind of hand for everybody is no help.
    if (toBoard && after <= boardKind([...v.board, c])) continue;
    made.set(after, [...(made.get(after) ?? []), c]);
  }
  const outs = [...made.values()].flat();
  if (!outs.length) return null;
  const answer = outs.length;
  const parts = [...made.entries()].sort((a, b) => b[0] - a[0]).map(([k, cards]) => `${cards.length} make${cards.length === 1 ? 's' : ''} ${KINDS[k]}`);
  const near = roughly(answer / unseen.length);
  const explain =
    (parts.length === 1
      ? `${answer} card${answer === 1 ? ' helps. It makes' : 's help. Each one makes'} ${KINDS[[...made.keys()][0]]}. `
      : `${answer} cards help: ${list(parts)}. `) +
    `There are ${unseen.length} cards you can’t see, so the chance the next card helps is ${answer}/${unseen.length}. ` +
    `That’s about ${near.top} in ${near.bottom}, or ${Math.round((answer / unseen.length) * 100)}%.`;
  return {
    kind: 'outs',
    ask: `One more card is coming${toBoard ? ' to the board' : ' to you'}. You have ${KINDS[now]} now. How many of the cards you can’t see would make it a better kind of hand?`,
    choices: choicesAround(answer, unseen.length, v.mine.join('')),
    answer,
    outs,
    unseen,
    deck: v.game.deck(),
    explain,
  };
}

/** The kind of hand the board makes by itself (pairs, trips and quads with fewer than five cards). */
function boardKind(board: Card[]): number {
  try {
    return Math.floor((HIGH_EVALUATORS['any-five'](board, [])?.score ?? -1) / CATEGORY_SPAN);
  } catch {
    return -1;
  }
}

/** The right number and three near misses, smallest first. Which misses depends on the cards, not on chance, so a re-render doesn't reshuffle them. */
function choicesAround(answer: number, max: number, salt: string): number[] {
  let h = 7;
  for (const ch of salt) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  const near = [-4, -3, -2, -1, 1, 2, 3, 4].map((d) => answer + d).filter((n) => n >= 0 && n <= max);
  const picked = new Set<number>([answer]);
  for (let i = 0; picked.size < 4 && i < 40; i++) picked.add(near[(h + i * 3) % near.length]);
  return [...picked].sort((a, b) => a - b);
}

const list = (w: string[]) => (w.length <= 1 ? w.join('') : `${w.slice(0, -1).join(', ')} and ${w[w.length - 1]}`);

// ---------------------------------------------------------------- a good deal?

export type Verdict = 'good' | 'bad' | 'close';

export interface DealQuestion {
  kind: 'deal';
  ask: string;
  /** Money in the pot before the call, and the price of calling. */
  pot: number;
  price: number;
  /** The player's share of the money if they call: price / (pot + price), simplified. */
  share: Fraction;
  /** The share as a percent: the chance of winning the call needs. */
  need: number;
  /** The player's chance of winning, as a percent. */
  chance: number;
  /** 'close': within a few points either way, so both answers are fair. */
  answer: Verdict;
  explain: string;
}

/** Within this many percentage points, the deal is too close to call. */
export const CLOSE = 4;

/**
 * The "good deal?" question for a call, or null when there is nothing to pay.
 * `chance` is the player's chance of winning, 0 to 1: the teacher's estimate
 * (Session.teacherAdvice), the same number a hint gives.
 */
export function dealQuestion(pot: number, price: number, chance: number, money: (n: number) => string): DealQuestion | null {
  if (price <= 0 || pot <= 0) return null;
  const total = pot + price;
  const share = simplify(price, total);
  const need = Math.round((price / total) * 100);
  const pct = Math.max(1, Math.min(99, Math.round(chance * 100)));
  const answer: Verdict = Math.abs(pct - need) <= CLOSE ? 'close' : pct > need ? 'good' : 'bad';
  const sum = share.top === price ? `${price}/${total}` : `${price}/${total} = ${share.top}/${share.bottom}`;
  const verdict =
    answer === 'close'
      ? `${pct}% and ${need}% are nearly the same, so this one is too close to call. Either answer is fair.`
      : answer === 'good'
        ? `${pct}% is more than ${need}%, so you win more often than you need to: a good deal.`
        : `${pct}% is less than ${need}%, so you don’t win often enough to pay for it: a bad deal.`;
  return {
    kind: 'deal',
    ask: `The pot holds ${money(pot)}. Calling costs you ${money(price)}. A hand like yours wins about ${pct} time${pct === 1 ? '' : 's'} in 100. Is calling a good deal?`,
    pot,
    price,
    share,
    need,
    chance: pct,
    answer,
    explain:
      `If you call, ${money(price)} of the ${money(total)} in the pot is yours. ${sum}, which is ${need}%. ` +
      `So you need to win more than ${need} times in 100. ${verdict} Card players call this “pot odds”.`,
  };
}

export type MathQuestion = OutsQuestion | DealQuestion;
