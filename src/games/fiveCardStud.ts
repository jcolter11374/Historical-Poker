/**
 * Five-card stud, as played in Civil War camps (chapter 4, 1863):
 * - 52 cards. Everyone antes; one card down and one up, then a betting round.
 * - Three more up cards, one at a time, each with a betting round.
 * - Every round is opened by the best hand showing, who may check. There is
 *   no bring-in: the low card's forced bet is a later casino rule. The engine
 *   still asks a stud game for a "bring-in seat" on the first round, so this
 *   game names the best card showing and the table posts a bring-in of
 *   nothing (forced style 'stud-open'; see legalFor in src/table/session.ts).
 * - Hands as The American Hoyle listed them in 1864, the year stud first
 *   appears in print: the straight ranks BELOW triplets, and there is no
 *   straight flush (a straight in one suit is a flush).
 * Sources: docs/HISTORY_SOURCES.md.
 */
import type { Card, GameSpec, SeatIndex, VariantRules } from '@rsdp/engine/core';
import { bestHigh } from '@rsdp/engine/variants';
import { highAward } from './award';
import { score1864 } from './hands1864';

export const STUD5_ID = 'stud5-1863';

export const FIVE_CARD_STUD: GameSpec = {
  id: STUD5_ID,
  name: 'Five-Card Stud (1863)',
  family: 'stud',
  streets: [
    { name: 'Second card', dealDown: 1, dealUp: 1, dealBoard: 0, betSize: 'small' },
    { name: 'Third card', dealDown: 0, dealUp: 1, dealBoard: 0, betSize: 'small' },
    { name: 'Fourth card', dealDown: 0, dealUp: 1, dealBoard: 0, betSize: 'big' },
    { name: 'Fifth card', dealDown: 0, dealUp: 1, dealBoard: 0, betSize: 'big' },
  ],
  maxPlayers: 8,
  defaultBetting: 'no-limit',
  split: 'high',
  forcedBets: 'ante-bring-in',
};

const SUIT_ORDER = 'cdhs';
const RANKS = '23456789TJQKA';
const cardValue = (c: Card) => RANKS.indexOf(c[0]) * 4 + SUIT_ORDER.indexOf(c[1]);

export const FIVE_CARD_STUD_RULES: VariantRules = {
  awardPortion: highAward(score1864),
  /** No bring-in: the "bring-in seat" is the highest card showing, who opens the first round (and may check). */
  bringInSeat(_spec, upBySeat) {
    const seats = Object.keys(upBySeat).map(Number);
    const rank = (s: SeatIndex) => RANKS.indexOf(upBySeat[s][0][0]);
    return seats.reduce((a, b) => (rank(b) > rank(a) ? b : a));
  },
  /** The best hand showing acts first; exact ties go to the seat first in `order`. */
  firstToActSeat(_spec, upBySeat, order) {
    const seats = Object.keys(upBySeat).map(Number);
    const pos = (s: SeatIndex) => (order ? order.indexOf(s) : s);
    const score = (s: SeatIndex) => bestHigh(upBySeat[s]).score;
    return seats.reduce((a, b) => {
      const d = score(b) - score(a);
      return d > 0 || (d === 0 && pos(b) < pos(a)) ? b : a;
    });
  },
  oddChipOrder(eligible, holeBySeat) {
    const top = (s: SeatIndex) => Math.max(...holeBySeat[s].map(cardValue));
    return [...eligible].sort((a, b) => top(b) - top(a));
  },
};
