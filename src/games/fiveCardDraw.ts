/**
 * Five-card draw, as played in Deadwood (chapter 5, 1876):
 * - 52 cards. Everyone antes and gets five cards face down. Betting round.
 * - Each player may throw away up to three cards and draw new ones (four if
 *   the card they keep is an ace). Second betting round, then the showdown.
 * - Modern hand rankings.
 */
import type { Card, GameSpec, VariantRules } from '@rsdp/engine/core';
import { anyFiveAward } from './award';

export const DRAW5_ID = 'draw5-1876';

export const FIVE_CARD_DRAW: GameSpec = {
  id: DRAW5_ID,
  name: 'Five-Card Draw (1876)',
  family: 'draw',
  streets: [
    { name: 'Before the draw', dealDown: 5, dealUp: 0, dealBoard: 0, betSize: 'small' },
    // The engine allows four; the table enforces "four only when keeping an ace" (drawRule below).
    { name: 'After the draw', dealDown: 0, dealUp: 0, dealBoard: 0, drawMaxDiscard: 4, betSize: 'big' },
  ],
  maxPlayers: 6,
  defaultBetting: 'pot-limit',
  split: 'high',
  forcedBets: 'blinds',
};

export const FIVE_CARD_DRAW_RULES: VariantRules = {
  awardPortion: anyFiveAward,
};

/** Null when the discard is allowed, otherwise why not. */
export function draw5Rule(cards: Card[], discard: number[]): string | null {
  if (discard.length <= 3) return null;
  if (discard.length > 4) return 'You may draw at most four.';
  const kept = cards.filter((_, i) => !discard.includes(i));
  return kept.length === 1 && kept[0][0] === 'A' ? null : 'You may draw four only when the card you keep is an ace.';
}
