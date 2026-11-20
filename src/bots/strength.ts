/**
 * How good is a hand? Bots answer by simulation: deal the unseen cards out at
 * random many times (to the opponents still in, to the board, and to future
 * stud streets), play out any draws still to come, settle each deal with the
 * game's own showdown rule, and average how much of the pot this hand wins.
 *
 * Because it uses the game's own awardPortion, the same code values a hand
 * in every game: 1836 straight poker, Primero, Razz, Omaha Hi-Lo (where a
 * half pot counts as a half) or Badugi.
 */
import type { Card } from '@rsdp/engine/core';
import type { GameDef } from '../games/catalog';
import type { Random } from './random';

export interface SimInput {
  game: GameDef;
  /** This player's cards, in hand order. */
  me: Card[];
  /** Shared cards dealt so far. */
  board: Card[];
  /** Each opponent still in the hand: the cards everyone can see (stud up cards; empty otherwise). */
  opponents: Card[][];
  /** Other cards known to be out of play (folded players' up cards). */
  dead: Card[];
  /** Index of the street being played. */
  street: number;
  /** The draw on this street hasn't happened yet (we are in the drawing phase). */
  drawPending: boolean;
}

/** Share of the pot (0 to 1) this hand wins on average. */
export function equity(input: SimInput, rnd: Random, trials?: number): number {
  const { game, me, board, opponents } = input;
  if (opponents.length === 0) return 1;
  const n = trials ?? Math.max(30, Math.round(260 / game.simCost));
  const streets = game.spec.streets;
  const perPlayer = streets.reduce((s, st) => s + st.dealDown + st.dealUp, 0);
  const boardTotal = streets.reduce((s, st) => s + st.dealBoard, 0);
  const draws: number[] = [];
  streets.forEach((st, i) => {
    if (st.drawMaxDiscard === undefined) return;
    if (i > input.street || (i === input.street && input.drawPending)) draws.push(st.drawMaxDiscard);
  });
  const known = new Set<Card>([...me, ...board, ...opponents.flat(), ...input.dead]);
  const unseen = game.deck().filter((c) => !known.has(c));
  const seats = [0, ...opponents.map((_, i) => i + 1)];
  const POT = 1200;
  let won = 0;
  for (let t = 0; t < n; t++) {
    const pool = rnd.shuffle(unseen);
    let k = 0;
    const take = (count: number) => {
      const out = pool.slice(k, k + Math.max(0, count));
      k += out.length;
      return out;
    };
    const hands: Card[][] = [[...me, ...take(perPlayer - me.length)], ...opponents.map((o) => [...o, ...take(perPlayer - o.length)])];
    const b = [...board, ...take(boardTotal - board.length)];
    for (const max of draws) {
      for (let h = 0; h < hands.length; h++) {
        const throwIdx = game.discards ? game.discards(hands[h], max) : [];
        if (!throwIdx.length || k + throwIdx.length > pool.length) continue;
        const keep = hands[h].filter((_, i) => !throwIdx.includes(i));
        hands[h] = [...keep, ...take(throwIdx.length)];
      }
    }
    const holeBySeat: Record<number, Card[]> = {};
    hands.forEach((h, i) => (holeBySeat[i] = h));
    const awards = game.rules.awardPortion(game.spec, POT, seats, holeBySeat, b);
    for (const a of awards) if (a.seat === 0) won += a.amount;
  }
  return won / (POT * n);
}
