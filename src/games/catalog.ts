/**
 * Every game the story plays, in one place. A GameDef is what the table
 * (src/table/session.ts), the bots (src/bots) and the rules card (src/ui)
 * need to know about a game:
 *
 * - `spec` and `rules`: what the RSDP engine needs (registered once, below).
 * - `deck`, `forced`: how the table deals and what forced bets it posts.
 * - `describe`: names the best hand some cards make, for "your hand" labels.
 * - `discards`, `drawRule`: draw games only; how bots draw, and any table
 *   rule on top of the engine's limit (five-card draw's "four with an ace").
 * - `card`: the rules card the player can open at the table.
 *
 * The six historical games are in their own files in this folder. The twelve
 * modern games are RSDP Live's own, run by the engine unchanged; this file
 * only adds names, rules cards and draw habits for them.
 */
import { freshDeck } from '@rsdp/engine';
import { variants, type Card, type GameSpec, type VariantRules } from '@rsdp/engine/core';
import {
  HIGH_EVALUATORS,
  LOW_EVALUATORS,
  VARIANTS,
  bestBadugi,
  registerAllVariants,
  type VariantId,
} from '@rsdp/engine/variants';
import '@rsdp/engine/modifiers';
import { BRAG, BRAG_RULES, scoreBrag } from './brag';
import { DRAW5_ID, FIVE_CARD_DRAW, FIVE_CARD_DRAW_RULES, draw5Rule } from './fiveCardDraw';
import { FIVE_CARD_STUD, FIVE_CARD_STUD_RULES } from './fiveCardStud';
import { POQUE, POQUE_RULES, deck32, scoreGroups } from './poque';
import { PRIMERO, PRIMERO_RULES, deck40, primeroDiscards, scorePrimero } from './primero';
import { STRAIGHT_POKER, STRAIGHT_POKER_RULES, deck20, evaluate1836 } from './straightPoker';

/**
 * 'antes': everyone antes, dead money; the minimum bet is the big blind amount.
 * 'blinds': small and big blind left of the buck.
 * 'stud': everyone antes and the low card brings in.
 */
export type ForcedStyle = 'antes' | 'blinds' | 'stud';

export interface RulesCard {
  /** "Five-Card Stud". */
  title: string;
  /** How a hand goes, one step per entry. */
  howToPlay: string[];
  /** "Hands, best first" or "Low hands, best first". */
  rankingsTitle: string;
  rankings: { name: string; example: string }[];
  note?: string;
}

export interface GameDef {
  id: string;
  /** Short name for the table: "Razz", "Limit Hold'em" is built by the table from this plus the betting. */
  name: string;
  spec: GameSpec;
  rules: VariantRules;
  deck(): Card[];
  forced: ForcedStyle;
  /** The best hand these cards make now, in words; '' when there are too few cards to say. */
  describe(hole: Card[], board: Card[]): string;
  /** Draw games: which card indexes a sensible player throws, at most `max`. */
  discards?(cards: Card[], max: number): number[];
  /** Draw games: a table rule on top of the engine's limit. Null when allowed, else why not. */
  drawRule?(cards: Card[], discard: number[]): string | null;
  /** Draw games with a table rule: how many may be thrown, in words ("up to three, or four if you keep an ace"). */
  drawLimitWords?: string;
  /** One of the historical games (their names don't carry the betting). */
  historical?: boolean;
  /** Relative cost of valuing a hand by simulation (Omaha with many cards is slow); bots run fewer trials. */
  simCost: number;
  card: RulesCard;
}

// ---------------------------------------------------------------- shared rankings

const HIGH_RANKINGS = [
  { name: 'Straight flush', example: '9♠ 8♠ 7♠ 6♠ 5♠' },
  { name: 'Four of a kind', example: 'K K K K 3' },
  { name: 'Full house', example: 'Q Q Q 7 7' },
  { name: 'Flush', example: 'A♥ J♥ 8♥ 6♥ 2♥' },
  { name: 'Straight', example: '10 9 8 7 6' },
  { name: 'Three of a kind', example: '8 8 8 K 4' },
  { name: 'Two pair', example: 'J J 5 5 A' },
  { name: 'One pair', example: '10 10 K 7 3' },
  { name: 'High card', example: 'A Q 9 6 3' },
];
const ACE_FIVE_LOWS = [
  { name: 'The wheel', example: '5 4 3 2 A' },
  { name: 'Six low', example: '6 4 3 2 A' },
  { name: 'Seven low', example: '7 5 4 2 A' },
  { name: 'Eight low', example: '8 6 4 3 2' },
  { name: 'Nine low and worse', example: '9 7 5 3 2' },
  { name: 'Any pair is worse still', example: '3 3 5 4 2' },
];
const HIGH_NOTE = 'Your best five cards play. An ace can be high or low in a straight (A-K-Q-J-10 or 5-4-3-2-A).';

// ---------------------------------------------------------------- historical games

const historical: GameDef[] = ([
  {
    id: STRAIGHT_POKER.id,
    name: 'Straight Poker',
    spec: STRAIGHT_POKER,
    rules: STRAIGHT_POKER_RULES,
    deck: deck20,
    forced: 'antes',
    describe: (hole) => (hole.length === 5 ? evaluate1836(hole).name : ''),
    simCost: 1,
    card: {
      title: 'Straight Poker, 1836',
      howToPlay: [
        'Twenty cards: aces, kings, queens, jacks and tens. Everyone antes.',
        'Four players, five cards each, so every card is dealt.',
        'One round of betting, starting left of the buck. No draw.',
        'If more than one player is left, the best hand takes the pot.',
      ],
      rankingsTitle: 'Hands, best first',
      rankings: [
        { name: 'Four of a kind', example: 'K K K K A' },
        { name: 'Full house', example: 'Q Q Q 10 10' },
        { name: 'Triplets', example: 'J J J A K' },
        { name: 'Two pairs', example: 'A A 10 10 Q' },
        { name: 'One pair', example: 'K K A Q J' },
        { name: 'High card', example: 'A K Q J 10' },
      ],
      note: 'No straights or flushes yet. A tie goes to the higher pair or triplets, then the higher odd cards.',
    },
  },
  {
    id: PRIMERO.id,
    name: 'Primero',
    spec: PRIMERO,
    rules: PRIMERO_RULES,
    deck: deck40,
    forced: 'antes',
    describe: (hole) => (hole.length ? scorePrimero(hole).name : ''),
    discards: primeroDiscards,
    simCost: 1,
    card: {
      title: 'Primero, 1543',
      howToPlay: [
        'Forty cards: no eights, nines or tens. Everyone antes.',
        'Two cards each, then a round of betting. Two more cards each, and another round.',
        'Then each player may change up to two cards, once. A last round of betting, then the best hand wins.',
        'Points: seven 21, six 18, ace 16, five 15, four 14, three 13, two 12, court cards 10.',
      ],
      rankingsTitle: 'Hands, best first',
      rankings: [
        { name: 'Chorus', example: 'four of a kind' },
        { name: 'Fluxus', example: 'four of one suit' },
        { name: 'Supremus', example: '7, 6 and A of one suit' },
        { name: 'Primero', example: 'one card of each suit' },
        { name: 'Numerus', example: 'most points in one suit' },
      ],
      note: 'A tie goes to the higher points. Old books disagree on Primero; this is our playable reconstruction.',
    },
  },
  {
    id: BRAG.id,
    name: 'Brag',
    spec: BRAG,
    rules: BRAG_RULES,
    deck: freshDeck,
    forced: 'antes',
    describe: (hole) => (hole.length ? scoreBrag(hole).name : ''),
    simCost: 0.5,
    card: {
      title: 'Brag, 1763',
      howToPlay: [
        'A full pack. Everyone antes and gets three cards, face down.',
        'One round of betting, starting left of the dealer. Bragging is half the game: bet as if you hold a prial.',
        'If more than one player is left, the best three cards win.',
        'At a real inn you might bet "blind", without looking, at half the price. At this table everyone looks.',
      ],
      rankingsTitle: 'Hands, best first',
      rankings: [
        { name: 'Prial', example: '3 3 3 is best, then A A A' },
        { name: 'Running flush', example: '8♦ 7♦ 6♦' },
        { name: 'Run', example: 'A-2-3, then A-K-Q' },
        { name: 'Flush', example: 'K♣ 9♣ 4♣' },
        { name: 'Pair', example: 'Q Q 5' },
        { name: 'High card', example: 'A J 7' },
      ],
      note: 'With only three cards, a run is harder than a flush, so it ranks higher. These are today’s rankings; the 1700s game was scored differently.',
    },
  },
  {
    id: FIVE_CARD_STUD.id,
    name: 'Five-Card Stud',
    spec: FIVE_CARD_STUD,
    rules: FIVE_CARD_STUD_RULES,
    deck: freshDeck,
    forced: 'stud',
    describe: describeWith('any-five'),
    simCost: 1,
    card: {
      title: 'Five-Card Stud, 1863',
      howToPlay: [
        'A full pack. Everyone antes. One card face down (your hole card) and one face up.',
        'The lowest card showing must "bring in" a small bet, or make it a full bet. Then a round of betting.',
        'Three more cards face up, one at a time, each with a round of betting. The best hand showing bets first.',
        'Only your hole card is hidden. Read what the others show, and what they don’t.',
      ],
      rankingsTitle: 'Hands, best first',
      rankings: HIGH_RANKINGS,
      note: 'The flush came in with the full pack, and the straight is new in this era. Both count.',
    },
  },
  {
    id: FIVE_CARD_DRAW.id,
    name: 'Five-Card Draw',
    spec: FIVE_CARD_DRAW,
    rules: FIVE_CARD_DRAW_RULES,
    deck: freshDeck,
    forced: 'antes',
    describe: describeWith('any-five'),
    discards: highDrawDiscards,
    drawRule: draw5Rule,
    drawLimitWords: 'up to three, or four if you keep an ace',
    simCost: 1,
    card: {
      title: 'Five-Card Draw, 1876',
      howToPlay: [
        'A full pack. Everyone antes and gets five cards face down. A round of betting.',
        'The draw: throw away up to three cards and get new ones. Four, if the card you keep is an ace.',
        'A second round of betting, then the best hand wins.',
        'How many cards someone draws is a tell of its own.',
      ],
      rankingsTitle: 'Hands, best first',
      rankings: HIGH_RANKINGS,
      note: HIGH_NOTE,
    },
  },
  {
    id: POQUE.id,
    name: 'Poque',
    spec: POQUE,
    rules: POQUE_RULES,
    deck: deck32,
    forced: 'antes',
    describe: (hole) => (hole.length === 5 ? scoreGroups(hole).name : ''),
    simCost: 1,
    card: {
      title: 'Poque, 1817',
      howToPlay: [
        'Thirty-two cards, sevens up to aces: the French piquet pack. Everyone antes.',
        'Five cards each, face down. One round of betting, where the art is to boast and bluff about pairs and triplets.',
        'If more than one player is left, the best hand wins.',
      ],
      rankingsTitle: 'Hands, best first',
      rankings: [
        { name: 'Four of a kind', example: 'Q Q Q Q 7' },
        { name: 'Full house', example: 'J J J 8 8' },
        { name: 'Triplets', example: '9 9 9 A K' },
        { name: 'Two pairs', example: 'K K 7 7 A' },
        { name: 'A pair', example: 'A A Q 9 8' },
        { name: 'High card', example: 'A K J 9 7' },
      ],
      note: 'Only matched cards count. The rules of Poque were never written down well; this is our reconstruction.',
    },
  },
] as GameDef[]).map((g) => ({ ...g, historical: true }));

// ---------------------------------------------------------------- RSDP Live's games

const STUD_HOW = [
  'Everyone antes. Two cards face down and one face up; the lowest card showing brings in.',
  'Three more cards face up, one at a time (fourth, fifth and sixth street), then a last card face down (seventh street). A round of betting after each.',
  'From fourth street on, the best hand showing bets first.',
  'Make your best five-card hand from your seven cards.',
];
const OMAHA_HOW = (n: number) => [
  `Blinds, then ${n} cards face down for each player. A round of betting.`,
  'The flop (three shared cards), the turn (one more) and the river (one more), each with a round of betting.',
  `Your hand must use exactly two of your ${n} cards and exactly three from the board. Not one, not three.`,
];
const HILO_HOW = 'The pot is split: half to the best high hand, half to the best low. A low needs five different cards 8 or lower (aces low). If nobody has a low, the high hand takes it all.';
const HOLDEM_HOW = [
  'The two players left of the buck post the small and big blind. Two cards face down for each player, then a round of betting.',
  'The flop: three shared cards face up. A round of betting.',
  'The turn: a fourth shared card. The river: a fifth. A round of betting after each.',
  'Make your best five-card hand from your two cards and the five on the board, in any mix.',
];
const DRAW_HOW = (n: number) => [
  `Blinds, then ${n} cards face down for each player. A round of betting.`,
  'Three draws: each time, throw away any cards you like and get new ones, then a round of betting.',
];

function engineGame(id: VariantId, extra: Partial<GameDef> & Pick<GameDef, 'name' | 'card'>): GameDef {
  const spec = VARIANTS[id];
  return {
    id,
    spec,
    rules: undefined as unknown as VariantRules, // filled in by registerGames()
    deck: freshDeck,
    forced: spec.forcedBets === 'ante-bring-in' ? 'stud' : 'blinds',
    describe: describeVariant(id),
    simCost: 1,
    ...extra,
  };
}

const modern: GameDef[] = [
  engineGame('nlhe', {
    name: "Hold'em",
    card: { title: "Texas Hold'em", howToPlay: HOLDEM_HOW, rankingsTitle: 'Hands, best first', rankings: HIGH_RANKINGS, note: HIGH_NOTE },
  }),
  engineGame('plo4', {
    name: 'Omaha',
    simCost: 2,
    card: { title: 'Omaha', howToPlay: OMAHA_HOW(4), rankingsTitle: 'Hands, best first', rankings: HIGH_RANKINGS, note: 'Four of one suit in your hand is not a flush: you may only use two of them.' },
  }),
  engineGame('plo5', {
    name: '5-Card Omaha',
    simCost: 3,
    card: { title: '5-Card Omaha ("Big O")', howToPlay: OMAHA_HOW(5), rankingsTitle: 'Hands, best first', rankings: HIGH_RANKINGS, note: 'Still exactly two from your hand and three from the board.' },
  }),
  engineGame('plo6', {
    name: '6-Card Omaha',
    simCost: 4,
    card: { title: '6-Card Omaha', howToPlay: OMAHA_HOW(6), rankingsTitle: 'Hands, best first', rankings: HIGH_RANKINGS, note: 'Six cards make big hands common. A straight is often not enough.' },
  }),
  engineGame('plo8', {
    name: 'Omaha Hi-Lo',
    simCost: 3,
    card: { title: 'Omaha Hi-Lo (8 or better)', howToPlay: [...OMAHA_HOW(4), HILO_HOW], rankingsTitle: 'Low hands, best first', rankings: ACE_FIVE_LOWS.slice(0, 4), note: 'High hands rank as usual. For the low you may use two different cards from your hand.' },
  }),
  engineGame('plo5-8', {
    name: '5-Card Omaha Hi-Lo',
    simCost: 4,
    card: { title: '5-Card Omaha Hi-Lo', howToPlay: [...OMAHA_HOW(5), HILO_HOW], rankingsTitle: 'Low hands, best first', rankings: ACE_FIVE_LOWS.slice(0, 4), note: 'High hands rank as usual.' },
  }),
  engineGame('plo6-8', {
    name: '6-Card Omaha Hi-Lo',
    simCost: 5,
    card: { title: '6-Card Omaha Hi-Lo', howToPlay: [...OMAHA_HOW(6), HILO_HOW], rankingsTitle: 'Low hands, best first', rankings: ACE_FIVE_LOWS.slice(0, 4), note: 'High hands rank as usual.' },
  }),
  engineGame('stud', {
    name: 'Seven Card Stud',
    card: { title: 'Seven Card Stud', howToPlay: STUD_HOW, rankingsTitle: 'Hands, best first', rankings: HIGH_RANKINGS, note: HIGH_NOTE },
  }),
  engineGame('razz', {
    name: 'Razz',
    card: {
      title: 'Razz',
      howToPlay: [STUD_HOW[0].replace('lowest', 'highest'), STUD_HOW[1], 'From fourth street on, the lowest hand showing bets first.', 'The LOWEST five-card hand wins. Aces are low; straights and flushes don’t count against you.'],
      rankingsTitle: 'Low hands, best first',
      rankings: ACE_FIVE_LOWS,
    },
  }),
  engineGame('stud8', {
    name: 'Stud Hi-Lo',
    card: { title: 'Seven Card Stud Hi-Lo (8 or better)', howToPlay: [...STUD_HOW, HILO_HOW], rankingsTitle: 'Low hands, best first', rankings: ACE_FIVE_LOWS.slice(0, 4), note: 'High hands rank as usual. Each half can use any five of your seven cards.' },
  }),
  engineGame('td27', {
    name: '2-7 Triple Draw',
    discards: lowballDiscards,
    card: {
      title: '2-7 Triple Draw',
      howToPlay: [...DRAW_HOW(5), 'The LOWEST hand wins. Aces are high, and straights and flushes count against you.'],
      rankingsTitle: 'Low hands, best first',
      rankings: [
        { name: 'The best: seven-five', example: '7 5 4 3 2, mixed suits' },
        { name: 'Seven-six', example: '7 6 4 3 2' },
        { name: 'Eight low', example: '8 5 4 3 2' },
        { name: 'Worse: a straight', example: '6 5 4 3 2 is a straight!' },
        { name: 'Worse still: any pair', example: '2 2 7 5 3' },
      ],
    },
  }),
  engineGame('badugi', {
    name: 'Badugi',
    discards: (cards, max) => {
      const keep = new Set(bestBadugi(cards).cards);
      return cards.map((c, i) => (keep.has(c) ? -1 : i)).filter((i) => i >= 0).slice(0, max);
    },
    card: {
      title: 'Badugi',
      howToPlay: [...DRAW_HOW(4), 'You want four cards of four different suits and four different ranks, as low as possible. Aces are low.'],
      rankingsTitle: 'Hands, best first',
      rankings: [
        { name: 'Best badugi', example: '4♠ 3♥ 2♦ A♣' },
        { name: 'Any badugi', example: 'K♠ Q♥ J♦ 10♣' },
        { name: 'Three-card hand', example: '3♠ 2♥ A♦ + another ♠' },
        { name: 'Two-card hand', example: 'A♠ 2♥ + two duplicates' },
      ],
      note: 'Cards that repeat a suit or a rank don’t count. Fewer counting cards always loses to more.',
    },
  }),
];

export const GAMES: Record<string, GameDef> = Object.fromEntries([...historical, ...modern].map((g) => [g.id, g]));

export function getGame(id: string): GameDef {
  registerGames();
  const g = GAMES[id];
  if (!g) throw new Error(`unknown game: ${id}`);
  return g;
}

let registered = false;
/** Registers every game with the engine, once. */
export function registerGames() {
  if (registered) return;
  registered = true;
  registerAllVariants(variants);
  for (const g of historical) variants.register(g.spec, g.rules);
  for (const g of modern) g.rules = variants.get(g.id).rules;
}

// ---------------------------------------------------------------- helpers

/** Hand name by the engine's evaluators for a modern high game (also used by five-card stud and draw). */
function describeWith(rule: 'any-five') {
  return (hole: Card[], board: Card[]) => {
    if (hole.length + board.length === 0) return '';
    try {
      return HIGH_EVALUATORS[rule](hole, board)?.name ?? '';
    } catch {
      return '';
    }
  };
}

function describeVariant(id: VariantId) {
  const { high, low } = VARIANTS[id].showdown;
  return (hole: Card[], board: Card[]): string => {
    const omaha = high === 'omaha' || low === 'omaha-eight-or-better';
    if (omaha && board.length < 3) return '';
    if (low === 'deuce-to-seven' && hole.length < 5) return '';
    const safe = (f: () => string) => {
      try {
        return f();
      } catch {
        return '';
      }
    };
    const hi = high ? safe(() => HIGH_EVALUATORS[high](hole, board)?.name ?? '') : '';
    const lo = low ? safe(() => LOW_EVALUATORS[low](hole, board)?.name ?? (high ? 'no low' : '')) : '';
    if (high && low) return hole.length + board.length >= 5 ? `${hi} · ${lo}` : hi;
    return hi || lo;
  };
}

/**
 * High-hand draw: keep matched cards; otherwise four to a flush; otherwise
 * the ace (or the highest card). At most `max` thrown.
 */
export function highDrawDiscards(cards: Card[], max: number): number[] {
  const counts = new Map<string, number>();
  for (const c of cards) counts.set(c[0], (counts.get(c[0]) ?? 0) + 1);
  const matched = cards.map((c, i) => ((counts.get(c[0]) ?? 0) >= 2 ? i : -1)).filter((i) => i >= 0);
  // A pat hand (straight or better) stands.
  const name = describeWith('any-five')(cards, []);
  if (/Straight|Flush|Full House|Four/i.test(name)) return [];
  if (matched.length) return cards.map((_, i) => i).filter((i) => !matched.includes(i)).slice(0, max);
  const suits = new Map<string, number[]>();
  cards.forEach((c, i) => suits.set(c[1], [...(suits.get(c[1]) ?? []), i]));
  const four = [...suits.values()].find((s) => s.length === 4);
  if (four) return cards.map((_, i) => i).filter((i) => !four.includes(i));
  const order = '23456789TJQKA';
  const top = cards.reduce((a, _, i) => (order.indexOf(cards[i][0]) > order.indexOf(cards[a][0]) ? i : a), 0);
  const throwAll = cards.map((_, i) => i).filter((i) => i !== top);
  return throwAll.slice(0, cards[top][0] === 'A' ? Math.min(4, max) : Math.min(3, max));
}

/** 2-7 lowball: throw pairs, aces and anything above an eight. */
export function lowballDiscards(cards: Card[], max: number): number[] {
  const order = '23456789TJQKA';
  const seen = new Set<string>();
  const out: number[] = [];
  cards
    .map((c, i) => ({ c, i }))
    .sort((a, b) => order.indexOf(a.c[0]) - order.indexOf(b.c[0]))
    .forEach(({ c, i }) => {
      if (seen.has(c[0]) || order.indexOf(c[0]) > order.indexOf('8')) out.push(i);
      seen.add(c[0]);
    });
  return out.slice(0, max);
}

export { DRAW5_ID };
