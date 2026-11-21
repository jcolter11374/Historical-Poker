/**
 * Five-card stud, as played in Civil War camps (chapter 4, 1863):
 * - 52 cards. Everyone antes; one card down and one up, then a betting round
 *   started by the low card's bring-in.
 * - Three more up cards, one at a time, each with a betting round; the best
 *   hand showing acts first.
 * - Modern hand rankings (straights and flushes count).
 */
import type { Card, GameSpec, SeatIndex, VariantRules } from '@rsdp/engine/core';
import { bestHigh } from '@rsdp/engine/variants';
import { anyFiveAward } from './award';

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
  defaultBetting: 'fixed-limit',
  split: 'high',
  forcedBets: 'ante-bring-in',
};

const SUIT_ORDER = 'cdhs';
const RANKS = '23456789TJQKA';
const cardValue = (c: Card) => RANKS.indexOf(c[0]) * 4 + SUIT_ORDER.indexOf(c[1]);

export const FIVE_CARD_STUD_RULES: VariantRules = {
  awardPortion: anyFiveAward,
  /** The lowest up card brings in (aces high); clubs are the lowest suit on a tie. */
  bringInSeat(_spec, upBySeat) {
    const seats = Object.keys(upBySeat).map(Number);
    return seats.reduce((a, b) => (cardValue(upBySeat[b][0]) < cardValue(upBySeat[a][0]) ? b : a));
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
