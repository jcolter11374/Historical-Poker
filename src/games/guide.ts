/**
 * The teaching side of every game: what the rules sheet's "Playing it well"
 * page says, and the short reminders the teacher adds to a hint.
 *
 * - `tips`: how to play the game decently, for someone who has just learned
 *   the rules. Plain words, best tip first, three to five of them.
 * - `mistakes`: what new players get wrong in this game.
 * - `coach`: one-line reminders keyed by the name of the betting round (as
 *   the game's spec names its streets: 'Preflop', 'Third Street', 'First
 *   Draw', 'The deal'...), 'draw' for while you are choosing cards to throw,
 *   or '*' for any time. A hint adds one of them, taking turns, so a player
 *   who keeps asking keeps learning.
 *
 * The rules themselves (the deal, the rankings) are the rules card in
 * catalog.ts. The betting words below are shared by every game and come from
 * the table's betting style, forced bets and any house extras.
 * test/guide.test.ts checks every game in the catalog has a guide.
 */
import type { Betting, Extras } from '../chapters/types';
import type { ForcedStyle } from './catalog';

export interface GameGuide {
  tips: string[];
  mistakes: string[];
  coach: Record<string, string[]>;
}

// ---------------------------------------------------------------- shared lines

const OMAHA_TIPS = [
  'You must use exactly two cards from your hand and three from the board. Check that every hand you think you have really does.',
  'Hands run bigger than in Hold’em. One pair rarely wins; two pair is often beaten. Ask what the best possible hand on this board is (the “nuts”), and whether you have it.',
  'Good starting hands work together: pairs, cards close in rank, and two cards of a suit. One great card with three bad ones is a trap.',
  'Drawing to a straight or flush is only good if it’s the best one. Drawing to a small flush can cost you a big pot.',
];
const OMAHA_MISTAKES = [
  'Counting four cards of one suit in your hand as a flush. Only two of them can play.',
  'Counting a board pair plus your one card as three of a kind. You need two from your hand.',
  'Calling to the end with one pair.',
];
const OMAHA_COACH: Record<string, string[]> = {
  Preflop: ['Look for four cards that help each other: pairs, cards in a row, and suits that match.', 'Pot limit keeps the betting sane before the flop, so you can see a flop cheaply with a good-looking hand.'],
  Flop: ['What is the best hand this board can make? If it isn’t you, be careful.', 'Two from your hand, three from the board. Check your hand against that rule.'],
  Turn: ['A draw is worth chasing when it’s to the best hand, and the price is right.'],
  River: ['If the board pairs, a full house is possible. If three of a suit show, a flush is.'],
};
const HILO_TIPS = [
  'You win the most by taking both halves (a “scoop”). Play hands that can win the high and the low at once.',
  'A low needs five different cards of 8 or lower; aces count low. A-2 is the best start for a low, A-3 next.',
  'Half a pot is often not worth chasing: if two players share the low, each gets a quarter.',
];
const HILO_MISTAKES = [
  'Chasing a low on a board with fewer than three cards of 8 or under: there can’t be a low at all.',
  'Forgetting your low can be “counterfeited”: when the board pairs one of your low cards, your low gets worse.',
];
const STUD_TIPS = [
  'Watch the up-cards. A card you need that is showing in someone else’s hand is a card you can’t get.',
  'Start with a pair, three cards to a flush or straight, or three high cards. Fold the rest on third street.',
  'If someone’s up-cards already beat anything you can make, let it go.',
];
const STUD_COACH: Record<string, string[]> = {
  'Third Street': ['Count how many of your cards are showing in other hands: those are dead to you.', 'A pair, three to a flush, or three to a straight are worth playing. Most others aren’t.'],
  'Fourth Street': ['Who improved? The best hand showing bets first now.'],
  'Fifth Street': ['The bets double here. Keep going with a made hand or a good draw; let a weak one go.'],
  'Sixth Street': ['One card to come after this. Count what you need and how many are left.'],
  'Seventh Street': ['The last card comes face down. Bet if you’d be glad to be called.'],
};
const DRAW_COACH: Record<string, string[]> = {
  draw: ['Draw fewer cards than your rivals and you are usually ahead of them.'],
  'Before the Draw': ['Three draws to come: start with cards that are already good, not just hopeful.'],
  'First Draw': ['How many did each rival draw? Fewer cards usually means a better hand.'],
  'Second Draw': ['Someone who stood pat (drew nothing) is telling you they’re happy.'],
  'Third Draw': ['Last draw done. Now it’s just your hand against theirs.'],
};

// ---------------------------------------------------------------- every game

export const GUIDES: Record<string, GameGuide> = {
  // ---- historical games
  'straight-1836': {
    tips: [
      'Every card is dealt, so the cards you hold are cards nobody else can have. Three kings in your hand means nobody holds more than one.',
      'There is no draw: your hand never changes. Decide what it’s worth and stick to it.',
      'One pair wins often here; two pairs is strong; triplets or better, bet them.',
      'A bet against one player can win the pot with nothing. Against three, someone usually has something.',
    ],
    mistakes: ['Calling a big bet with high card, hoping. Nothing is coming.', 'Forgetting that straights and flushes don’t count in 1836.', 'Putting your whole purse behind one pair. It’s table stakes: a rival may bet everything he has.'],
    coach: {
      'The deal': ['Count your cards against the deck: twenty cards, four of each rank. What you hold, they can’t.', 'With one round of betting, act on what you have now.'],
    },
  },
  'primero-1543': {
    tips: [
      'The kind of hand comes first: a Primero (one card of each suit) beats any Numerus, whatever the points.',
      'Sevens (21 points) and sixes (18) are the best cards to hold. Court cards are worth only 10.',
      'At the change, chase the suit you’re missing for a Primero, or the fourth card of a suit for a Fluxus.',
    ],
    mistakes: ['Keeping court cards at the change: they score least.', 'Betting a big Numerus as if it beats a Primero. It doesn’t.'],
    coach: {
      'First two cards': ['Two different suits start a Primero; two of one suit start a Fluxus.'],
      'Second two cards': ['Four suits already? That’s a Primero. Bet it.'],
      'The change': ['Watch how many each rival changes: none means they like what they have.'],
      draw: ['Change up to two cards. Throw court cards first; keep sevens and sixes.'],
    },
  },
  'brag-1763': {
    tips: [
      'Only matched cards count. Any pair is above average, a high pair is strong, and a pair royal (three alike) is nearly unbeatable.',
      'The knave of clubs and the nine of diamonds are braggers: either one turns your best card into a pair, and a pair into a pair royal.',
      'A natural hand beats the same hand made with a bragger, so a true pair of aces beats an ace with a bragger.',
      'Bragging is the game: wager a strong hand the same way you wager a weak one, so nobody can tell.',
    ],
    mistakes: ['Counting three in a row or three of one suit as a hand. In 1763 they are worth nothing.', 'Calling every brag with a high card.'],
    coach: {
      'The deal': ['A pair is a good hand in Brag. Ace-high often wins against one caller.', 'One round of bragging: whatever you hold now is your hand.', 'Holding a bragger? You have a pair at least.'],
    },
  },
  'poque-1817': {
    tips: [
      'In a thirty-two card pack pairs come often. One pair is ordinary, a pair of aces is good, and three alike are strong.',
      'Only sets count: four alike, three alike, a pair. No straights or flushes, and a second pair only breaks a tie between equal pairs.',
      'With no pair, the highest cards decide. Ace-king high wins more than you’d expect.',
    ],
    mistakes: ['Counting a run or a suit as a hand. They count for nothing here.', 'Thinking two small pairs beat a pair of aces. The higher pair wins.', 'Betting a small pair into three players.'],
    coach: {
      'The deal': ['With only sevens to aces, someone usually holds a pair. A pair of aces or kings, or three alike, is worth a bet.'],
    },
  },
  'stud5-1863': {
    tips: [
      'Your hole card is your only secret. If it pairs your highest up-card, you know more than anyone at the table.',
      'Play few hands: a pair, or an ace or king with a good card showing. Fold most others at once.',
      'Look around the table before every bet. If someone shows a pair you can’t beat, fold.',
      'The best hand showing speaks first and may check. Nobody is forced to bet, so a bet means something.',
    ],
    mistakes: ['Staying in when what’s showing already beats you.', 'Chasing a straight or flush: with only five cards, they rarely come. And in 1863 a straight loses to three of a kind.'],
    coach: {
      'Second card': ['A pair in your first two cards is a strong start. Two small, unmatched cards: usually fold.'],
      'Third card': ['Read the up-cards. Who could have you beaten already?'],
      'Fourth card': ['The pots get bigger now. Keep going with the best hand, or a pair to beat what shows.'],
      'Fifth card': ['Last card. If what they show beats you, a call only pays them.'],
    },
  },
  'draw5-1876': {
    tips: [
      'Keep a pair and draw three. Keep two pairs and draw one. With a straight or better, draw nothing (“stand pat”).',
      'Before the draw, come in with good pairs (jacks or better) and fold most hands with nothing. It costs double the ante to come in.',
      'Watch how many cards each rival draws. One card: two pairs or a straight or flush draw. Three: a pair. None: a made hand, or a bluff.',
    ],
    mistakes: ['Keeping an extra high card with a pair. Drawing three gives you a better chance to improve.', 'Drawing four or five cards. You may, but a hand that needs them was not worth coming in with.', 'Drawing to an inside straight: one rank in the middle fills it, and only four cards are left of it.'],
    coach: {
      'Before the draw': ['Jacks or better are worth a bet. A small pair is worth a call, not a raise.'],
      'After the draw': ['Remember what each rival drew. A one-card draw that bets now usually made it.'],
      draw: ['Keep a pair and draw three; keep two pairs and draw one. With nothing but an ace, keep it and draw four.', 'Drawing three to a pair makes two pairs or better about three times in ten.'],
    },
  },

  // ---- RSDP Live's games
  nlhe: {
    tips: [
      'Fold most hands before the flop. Play pairs, two high cards (A-K, A-Q, K-Q) and aces with a card of the same suit.',
      'Acting last is a big edge: you see what everyone did first. Play more hands when the dealer button is near you.',
      'After the flop, ask whether the board helps you or someone else. Top pair with a weak second card isn’t a monster.',
      'Missed the flop and someone bets? It’s fine to fold. Most flops miss most hands.',
      'No limit means one bet can be for everything. Don’t put all your chips in with one pair against a big raise.',
    ],
    mistakes: ['Playing any ace. A-7 loses to the better aces that call you.', 'Calling all the way with a draw when the bets are bigger than the pot odds.', 'Forgetting the board plays for everyone: a straight on the board is everyone’s straight.'],
    coach: {
      Preflop: ['Before the flop, about one hand in four is worth playing. Pairs and big cards first.', 'With the dealer button in front of you, you act last after the flop. That’s the time to play a few more hands.'],
      Flop: ['The flop decides most hands. Did you make a pair or better, or a good draw? If not, be ready to let go.', 'A flush draw comes in about one time in three by the river; an open-ended straight draw, about the same.'],
      Turn: ['Count your outs (the cards that make your hand). Each one is worth about 2% per card to come.'],
      River: ['No more cards. Bet if you’d be glad to be called; check if you wouldn’t.'],
    },
  },
  plo4: { tips: OMAHA_TIPS, mistakes: OMAHA_MISTAKES, coach: OMAHA_COACH },
  plo5: {
    tips: [OMAHA_TIPS[0], 'With five cards each, the nuts (the best possible hand) are made far more often. Aim for them.', ...OMAHA_TIPS.slice(2)],
    mistakes: OMAHA_MISTAKES,
    coach: { ...OMAHA_COACH, Preflop: ['Five cards: look for all five working together. A pair plus connected, suited cards is ideal.'] },
  },
  plo6: {
    tips: [OMAHA_TIPS[0], 'Six cards make big hands common. A straight is often beaten, and a small flush is a trap. Play for the best hand.', ...OMAHA_TIPS.slice(2)],
    mistakes: [...OMAHA_MISTAKES, 'Getting excited about a hand that isn’t the nuts. With six cards each, someone often has it.'],
    coach: { ...OMAHA_COACH, Preflop: ['Six cards: nearly every hand looks playable. Wait for one that can make the best hand, not just a good one.'] },
  },
  plo8: {
    tips: [OMAHA_TIPS[0], ...HILO_TIPS, 'For the low, too, you use exactly two cards from your hand: A-2 in your hand plus three different low cards on the board makes a low, often the best one.'],
    mistakes: [...HILO_MISTAKES, OMAHA_MISTAKES[0]],
    coach: {
      ...OMAHA_COACH,
      Preflop: ['Best starts hold A-2 or A-3 with another low card, plus a pair or suits for the high: hands that can scoop.'],
      Flop: ['Are three cards of 8 or lower on the board? If not, no low is possible yet.', 'Two from your hand, three from the board, for the high and the low.'],
    },
  },
  'plo5-8': {
    tips: [OMAHA_TIPS[0], ...HILO_TIPS],
    mistakes: [...HILO_MISTAKES, OMAHA_MISTAKES[0]],
    coach: {
      ...OMAHA_COACH,
      Preflop: ['With five cards, try for A-2 plus something for the high. Hands that go both ways scoop.'],
      Flop: ['Three low cards on the board make a low possible. Fewer, and the whole pot goes high.'],
    },
  },
  'plo6-8': {
    tips: [OMAHA_TIPS[0], ...HILO_TIPS, 'With six cards, lows are common. Only the best low (A-2) is worth much on its own.'],
    mistakes: [...HILO_MISTAKES, OMAHA_MISTAKES[0]],
    coach: {
      ...OMAHA_COACH,
      Preflop: ['Six cards: an A-2 is common, so a low alone is often split. Look for hands that can scoop.'],
      Flop: ['Three low cards on the board make a low possible. Fewer, and the whole pot goes high.'],
    },
  },
  stud: {
    tips: STUD_TIPS,
    mistakes: ['Chasing a flush when the cards of your suit are showing in other hands.', 'Ignoring a rival’s up-cards: a pair showing on fourth street is often trips by the end.'],
    coach: STUD_COACH,
  },
  'stud-1926': {
    tips: [...STUD_TIPS, 'Nobody is forced to bet: the best hand showing speaks first on every street and may check.'],
    mistakes: ['Chasing a flush when the cards of your suit are showing in other hands.', 'Ignoring a rival’s up-cards: a pair showing on fourth street is often trips by the end.'],
    coach: { ...STUD_COACH, 'Fourth Street': ['Who improved? The best hand showing speaks first, as on every street.'] },
  },
  'razz-1926': {
    tips: [
      'The LOWEST hand wins. Aces are low, and straights and flushes don’t count, so 5-4-3-2-A is perfect.',
      'Start with three cards of 8 or lower, all different. The lower, the better.',
      'A high card showing is bad news for that player. When a rival catches a king, you’re suddenly ahead.',
    ],
    mistakes: ['Playing a pair: pairs are bad in Razz.', 'Forgetting who speaks first: the lowest hand showing, on every street.'],
    coach: {
      ...STUD_COACH,
      'Third Street': ['Three different cards of 8 or lower are a good start. Anything with a pair or a high card, fold.'],
      'Fourth Street': ['Who caught a high card? They just got worse. The lowest hand showing speaks first.'],
    },
  },
  razz: {
    tips: [
      'The LOWEST hand wins. Aces are low, and straights and flushes don’t count, so 5-4-3-2-A is perfect.',
      'Start with three cards of 8 or lower, all different. The lower, the better.',
      'A high card showing is bad news for that player. When a rival catches a king, you’re suddenly ahead.',
    ],
    mistakes: ['Playing a pair: pairs are bad in Razz.', 'Forgetting the highest card showing brings it in, not the lowest.'],
    coach: {
      ...STUD_COACH,
      'Third Street': ['Three different cards of 8 or lower are a good start. Anything with a pair or a high card, fold.'],
      'Fourth Street': ['Who caught a high card? They just got worse. The lowest hand showing bets first now.'],
    },
  },
  stud8: {
    tips: [...HILO_TIPS, 'Watch the up-cards: low cards showing mean someone is going low; a pair showing means someone is going high.'],
    mistakes: ['Chasing a low when two of your first three cards are above 8: every card to come would have to be low.', 'Forgetting that each half can use a different five of your seven cards.'],
    coach: {
      ...STUD_COACH,
      'Third Street': ['Three low cards, or a pair of aces, are the best starts: they can win both ways.'],
    },
  },
  td27: {
    tips: [
      'The LOWEST hand wins, but aces are high and straights and flushes count against you. 7-5-4-3-2 of mixed suits is the best.',
      'Start with three or more different cards of 7 or lower, with a 2 among them.',
      'Draw fewer cards than your rivals and you are usually ahead. Stand pat with a smooth 8 or better.',
    ],
    mistakes: ['Thinking an ace is low. Here it’s the highest card.', 'Keeping a straight or flush: 6-5-4-3-2 is a straight, a bad hand.'],
    coach: {
      ...DRAW_COACH,
      'Before the Draw': ['Keep cards of 7 or lower, all different, and a 2 if you can. Throw everything else.'],
      draw: ['Keep cards of 7 or lower, all different. A pair, an ace or a picture card goes.', ...DRAW_COACH.draw],
    },
  },
  badugi: {
    tips: [
      'You want four cards of four different suits and four different ranks. Aces are low: A-2-3-4 of four suits is the best.',
      'Any four-card hand (a “badugi”) beats any three-card hand, however low.',
      'Keep your lowest cards of different suits; throw a card that repeats a suit or rank.',
    ],
    mistakes: ['Keeping two cards of the same suit: only one of them counts.', 'Drawing to a high badugi when you already have a low three-card hand that might win.'],
    coach: {
      ...DRAW_COACH,
      'Before the Draw': ['Keep low cards of different suits and ranks. Throw the rest.'],
      draw: ['Throw any card that repeats a suit or a rank. Of two cards that clash, keep the lower.', ...DRAW_COACH.draw],
    },
  },
};

/** The guide for a game; every catalog game has one (test/guide.test.ts). */
export function guideFor(gameId: string): GameGuide {
  return GUIDES[gameId] ?? { tips: [], mistakes: [], coach: {} };
}

/** Reminders for a betting round: that round's, then the any-time ones. */
export function coachLines(gameId: string, street: string): string[] {
  const c = guideFor(gameId).coach;
  return [...(c[street] ?? []), ...(c['*'] ?? [])];
}

// ---------------------------------------------------------------- the betting

/** The betting, in words, for the rules sheet. */
export function bettingWords(betting: Betting, forced: ForcedStyle, family: 'flop' | 'stud' | 'draw', historical: boolean): string[] {
  const lines: string[] = [];
  if (forced === 'blinds') lines.push('Before the deal, the two players left of the dealer button post the small and big blind. The button moves one seat each hand, so everyone takes a turn.');
  else if (forced === 'stud') lines.push('Everyone antes. The card showing that’s worst for its game (the lowest in most stud, the highest in Razz) must “bring it in” with a small bet, or make a full bet.');
  else if (forced === 'stud-open') lines.push('Everyone antes. Nobody is forced to bet after that: the best hand showing speaks first on every round, and may check.');
  else if (forced === 'age')
    lines.push('Only the “age”, the player left of the dealer, antes, and blind, before the cards. To come in you put up double the ante. The age speaks last and can make the ante good or give it up.');
  else lines.push('Everyone puts in an ante before the deal, so there is always something to win.');
  lines.push('On your turn: fold (give up the hand), check (pass, if nobody has bet), call (match the bet), or bet and raise.');
  if (betting === 'no-limit') lines.push(historical ? 'Table stakes: you may bet any amount up to all the money in front of you. A raise must be at least as big as the last bet or raise.' : 'No limit: you may bet any amount up to all your chips. A raise must be at least as big as the last bet or raise.');
  else if (betting === 'spread-limit') lines.push('The table’s limit: a bet or raise may be any amount up to the limit the table has agreed, and no more. There is no end to the number of raises.');
  else if (betting === 'pot-limit') lines.push('Pot limit: the most you may bet is what’s in the pot. To raise the most, call first, then raise by the size of the pot with your call in it: with 30 in the pot and 20 to call, that is 30 + 20 = 50 more, a raise to 70. The table shows this sum above your chips.');
  else
    lines.push(
      family === 'flop'
        ? 'Limit: every bet is a fixed size, the small bet before the flop and on the flop and twice that on the turn and river. One bet and three raises at most each round.'
        : historical
          ? 'Limit: every bet is a fixed size, and bigger in the later rounds. One bet and three raises at most each round.'
          : 'Limit: every bet is a fixed size, the small bet early and twice that in the later rounds. One bet and three raises at most each round.',
    );
  return lines;
}

/** House extras in play at this stage, in words. */
export function extrasWords(extras: Extras | undefined, money: (units: number) => string): string[] {
  if (!extras) return [];
  const lines: string[] = [];
  if (extras.bombPotEvery)
    lines.push(
      `Bomb pot every ${extras.bombPotEvery === 1 ? 'hand' : `${ordinal(extras.bombPotEvery)} hand`}: everyone puts in ${money(extras.bombPotUnits ?? 1)} and the flop comes at once, with no betting before it.` +
        (extras.doubleBoardOnBombPots ? ' It’s dealt on two boards: each board wins half the pot.' : ''),
    );
  if (extras.bounty72Units) lines.push(`The 7-2 bounty: win a pot holding seven-deuce, the worst hand in Hold’em, show it, and everyone pays you ${money(extras.bounty72Units)}.`);
  return lines;
}

function ordinal(n: number): string {
  return ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'][n] ?? `${n}th`;
}

/** The rules sheet's line for a card room or a poker site, where no player deals. */
export function houseDealsWords(family: 'flop' | 'stud' | 'draw', marker: 'buck' | 'button' | 'online' | 'none'): string {
  const who = marker === 'online' ? 'The site deals every hand' : 'The house deals every hand';
  if (family === 'stud') return `${who}. There is no dealer button in stud: the cards showing decide who acts first.`;
  return `${who}. The dealer button only marks whose turn it would be to deal: the blinds sit to its left, and the player with the button acts last.`;
}
