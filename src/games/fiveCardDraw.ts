/**
 * Five-card draw, as played in Deadwood (chapter 5, 1876):
 * - 52 cards, five each, face down.
 * - The ante is a blind put up by the "age" alone (the eldest hand, left of
 *   the dealer). To come in costs double the ante; the age makes his ante
 *   good last (forced style 'age', src/table/stakes.ts).
 * - The draw: any number of cards, up to all five (Bohn's 1850 handbook:
 *   "as many cards as he may wish, not exceeding five"). The modern
 *   three-card limit is a later house rule against running out of cards.
 * - After the draw the player left of the age bets first and the age has the
 *   last say. The table gets this by telling the engine the age holds the
 *   button (src/table/session.ts, startHand).
 * - No jackpots: a pair of jacks to open was a late novelty, played by
 *   agreement, and not part of the straight game.
 * - Straights and the straight flush count (in general play by the 1870s,
 *   though the books of the day still call the straight optional).
 * Sources and open questions: docs/HISTORY_SOURCES.md.
 */
import type { GameSpec, VariantRules } from '@rsdp/engine/core';
import { anyFiveAward } from './award';

export const DRAW5_ID = 'draw5-1876';

export const FIVE_CARD_DRAW: GameSpec = {
  id: DRAW5_ID,
  name: 'Five-Card Draw (1876)',
  family: 'draw',
  streets: [
    { name: 'Before the draw', dealDown: 5, dealUp: 0, dealBoard: 0, betSize: 'small' },
    { name: 'After the draw', dealDown: 0, dealUp: 0, dealBoard: 0, drawMaxDiscard: 5, betSize: 'big' },
  ],
  maxPlayers: 6,
  defaultBetting: 'no-limit',
  split: 'high',
  forcedBets: 'blinds',
};

export const FIVE_CARD_DRAW_RULES: VariantRules = {
  awardPortion: anyFiveAward,
};
