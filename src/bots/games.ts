/**
 * Teaches RSDP Live's bot the games it does not have.
 *
 * The bot (src/bots/rsdp/strategy.ts) knows RSDP Live's twelve games by their
 * ids: it deals out a 52-card deck and scores with the engine's evaluators.
 * The story also plays games RSDP Live has no bot for. For each of those this
 * file hands the bot the three things it cannot know by itself: the game's
 * spec, its deck, and how its showdown shares a pot (the game's own
 * awardPortion, the same one that settles real hands). The thinking stays
 * RSDP's: dealing out finishes, weighing every way to draw, and the betting
 * rules of its three levels.
 *
 * - Seven-card stud and Razz by 1926 rules are RSDP's stud and Razz with no
 *   bring-in: the bot's own knowledge of those games applies in full.
 * - Five-card draw (1876) is scored by the engine's ordinary high hands, so
 *   only its spec is new to the bot.
 * - Straight poker (1836), Primero, Brag, Poque and five-card stud (1863)
 *   have their own decks or hand rankings, supplied here from src/games/.
 *
 * See docs/BOTS.md.
 */
import type { Card } from '@rsdp/engine/core';
import { VARIANTS, type VariantSpec } from '@rsdp/engine/variants';
import { DRAW5_ID, GAMES, registerGames, type GameDef } from '../games/catalog';
import { extraGames } from './rsdp/strategy';

const POT = 1200;

/** `hands[0]`'s share of a pot by the game's own showdown rule (ties and split pots count as shares). */
function shareBy(game: GameDef) {
  return (hands: Card[][], board: Card[]): number => {
    const seats = hands.map((_, i) => i);
    const holeBySeat: Record<number, Card[]> = {};
    hands.forEach((h, i) => (holeBySeat[i] = h));
    let mine = 0;
    for (const a of game.rules.awardPortion(game.spec, POT, seats, holeBySeat, board)) if (a.seat === 0) mine += a.amount;
    return mine / POT;
  };
}

let taught = false;
/** Registers every catalog game RSDP Live lacks with the bot, once. */
export function teachBots() {
  if (taught) return;
  taught = true;
  registerGames();
  for (const game of Object.values(GAMES)) {
    if (game.id in VARIANTS) continue;
    const cardsPerPlayer = game.spec.streets.reduce((n, st) => n + st.dealDown + st.dealUp, 0);
    // The 1926 stud games are built on RSDP's own (catalog.ts, openStud) and carry their showdown rules already.
    const known = (game.spec as Partial<VariantSpec>).showdown;
    const showdown: VariantSpec['showdown'] = known ?? (game.id === DRAW5_ID ? { high: 'any-five' } : {});
    const spec = { shortName: game.name, rules: '', ...game.spec, cardsPerPlayer, showdown } as VariantSpec;
    extraGames.set(game.id, { spec, deck: game.deck, share: showdown.high || showdown.low ? undefined : shareBy(game) });
  }
}

/** True when RSDP Live has this game itself (the bot needed no teaching). */
export const isRsdpGame = (id: string) => id in VARIANTS;
