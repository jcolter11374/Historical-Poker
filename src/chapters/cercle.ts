/**
 * Chapter 9, "The Cercle": Pot-Limit Omaha, then Omaha Hi-Lo, in a private
 * Paris card club, 1992. All people and places are fictional.
 */
import { lines, rival, say } from './cast';
import type { Chapter } from './types';

export const CERCLE: Chapter = {
  id: 'cercle',
  numeral: '9',
  part: 2,
  title: 'The Cercle',
  year: 1992,
  place: 'A private card club, Paris',
  youAre: 'Anna Avery, a translator',
  teaches: 'Pot-Limit Omaha, then Omaha Hi-Lo',
  rulesObject: 'The club’s rule book',
  money: { suffix: ' F' },
  stages: [
    {
      fromHand: 1,
      label: 'Pot-Limit Omaha',
      structure: { unit: 20 },
      games: [
        {
          game: 'plo4',
          betting: 'pot-limit',
          lesson: {
            teacher: 'siobhan',
            before: [
              say('siobhan', 'Omaha, Anna. It’s Hold’em’s wild cousin. Born in Las Vegas, but Europe fell in love with it. Pot-limit, always.'),
              say('siobhan', 'Same blinds, same shared board: flop, turn, river. But you get FOUR cards, not two.'),
              say('siobhan', 'And here’s the one rule everyone gets wrong: your hand must use exactly two of your four cards and exactly three from the board. Not one. Not three. Two.'),
              say('siobhan', 'Pot-limit means you can bet up to what’s in the pot. Pots grow fast. Hands are big: a straight is often not enough.'),
            ],
            streets: {
              0: [say('siobhan', 'Four cards. The best hands work together: pairs, cards close in rank, two suits. Four random cards? Let them go.')],
              1: [say('siobhan', 'The flop. Remember: two from your hand, three from the board. If you hold four hearts, that’s still only two of them that count.')],
              3: [say('siobhan', 'The river. Read the board: could someone have the nuts, the best possible hand? In Omaha, someone often does.')],
            },
          },
        },
      ],
    },
    {
      fromHand: 7,
      label: 'Omaha Hi-Lo, after two in the morning',
      structure: { unit: 20 },
      opening: [
        say('varenne', 'It is two o’clock. At this hour, the Cercle plays my game. High-low, eight or better.'),
      ],
      games: [
        {
          game: 'plo8',
          betting: 'pot-limit',
          lesson: {
            teacher: 'varenne',
            before: [
              say('varenne', 'Omaha, Mademoiselle Avery, but the pot is cut in two: half for the best high hand, half for the best low.'),
              say('varenne', 'A low is five different cards of eight or below, aces low. Still two from your hand and three from the board, for each half. You may use different cards for each.'),
              say('varenne', 'If the board has fewer than three low cards, nobody can make a low, and the high takes everything.'),
              say('varenne', 'Ace and deuce in your hand: the most beautiful start. Remember it.'),
            ],
            streets: {
              1: [say('varenne', 'Look at the flop: three cards of eight or lower? Then a low is possible. Otherwise, play for the high.')],
              3: [say('varenne', 'The river. Your high and your low are under your cards. Do not be surprised if you must share.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 1000,
  levelEvery: 8,
  levelLines: [say('narration', 'A waiter in a white jacket refills the coffee. The Comte nods, and the blinds double.')],
  intro: [
    'Paris, 1992. Behind a plain door near the Champs-Élysées is the Cercle Varenne, a private card club with velvet chairs, cigar smoke and portraits of members long dead.',
    'Anna Avery, Ray’s daughter, is in Paris translating for a publisher. She has brought the old deck, because Delphine’s diary says it once belonged to a Frenchwoman in New Orleans.',
    'The club’s president, the Comte Lucien Varenne, collects antique cards. He has invited her to play. He would very much like to see the deck.',
  ],
  recap: [
    'The Ashcombe deck, painted in England in 1543, has passed down the American Avery family for two centuries.',
    'In 1985, Ray Avery won Delphine Arceneaux’s diary at an Atlantic City stud table: the whole story of the deck, including a night in 1817 at a New Orleans gaming house.',
  ],
  history: [
    'Omaha was introduced at a downtown Las Vegas casino in the 1980s: Hold’em with four cards, and the strict two-and-three rule.',
    'Pot-limit Omaha became especially popular in Europe, where it is still a favourite in card clubs and casinos.',
    'Omaha Hi-Lo splits the pot, and became one of the five games of HORSE.',
  ],
  howToWin: [
    'Pot-limit: no bet larger than the pot. Before two o’clock, a player who goes broke can buy back in.',
    'After two, in Omaha Hi-Lo, broke means out. Be the last one at the table.',
  ],
  rivals: [
    rival(
      {
        id: 'siobhan',
        name: 'Siobhan',
        fullName: 'Siobhan Kearney',
        role: 'An Irish professional who plays the European circuit',
        personality: { valueAt: 1.4, bluff: 0.14, caution: 0.02, betSize: 0.75, respect: 0.6, reads: 0.9 },
        tell: { text: 'She drums her fingers on the rail.', signals: 'bluffing', showsWhenTrue: 0.6, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['Pot.', 'Bet the pot.', 'Raise, love.'],
          call: ['I’ll call.', 'Go on so.'],
          fold: ['Not this time.', 'Fold.'],
          check: ['Check.'],
          win: ['Grand.', 'Lovely stuff.'],
          bust: 'Ah, that’s Omaha for you. Good luck, Anna.',
        }),
      },
      'left',
      '#2a4a3a',
    ),
    rival(
      {
        id: 'varenne',
        name: 'Comte Varenne',
        fullName: 'Comte Lucien Varenne',
        role: 'President of the club, collector of antique cards',
        personality: { valueAt: 1.4, bluff: 0.1, caution: 0.03, betSize: 0.75, trap: 0.3, respect: 0.6, reads: 0.7 },
        tell: { text: 'He relights a cigar that is already lit.', signals: 'strong', showsWhenTrue: 0.55, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['Pot.', 'I raise, mademoiselle.', 'Let us see.'],
          call: ['Je suis.', 'I follow.'],
          fold: ['Non.', 'I pass.'],
          check: ['Parole.'],
          win: ['Merci.', 'Naturellement.'],
          bust: 'Magnifique. I am beaten, in my own club. My compliments to your deck, and to you.',
        }),
      },
      'across',
      '#3a2a4a',
    ),
    rival(
      {
        id: 'dmitri',
        name: 'Dmitri',
        fullName: 'Dmitri Volkov',
        role: 'A chess grandmaster who plays cold and exact',
        personality: { valueAt: 1.6, bluff: 0.06, caution: 0.06, betSize: 0.6, respect: 0.7, reads: 0.8 },
        tell: { text: 'He stares at the board, perfectly still.', signals: 'weak', showsWhenTrue: 0.5, showsWhenFalse: 0.12 },
        lines: lines({
          bet: ['Pot.', 'Raise.'],
          call: ['Call.'],
          fold: ['Fold.'],
          check: ['Check.'],
          win: ['Correct.', 'As expected.'],
          bust: 'A blunder. I resign.',
        }),
      },
      'right',
      '#2a2a3a',
    ),
  ],
  nemesisId: 'varenne',
  narratorId: 'varenne',
  scene: { palette: { wall: '#1a0f12', light: '#f0c890', felt: '#3a1f2a', rim: '#7a5a2a' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Comte Lucien Varenne', line: 'The Cercle, 1992. Two from the hand, three from the board.' },
  story: {
    dealer: ['Faites vos jeux. Blinds, please.', 'Blinds in.', 'Cartes.'],
    moments: [
      {
        beforeHand: 4,
        lines: [
          say('varenne', 'May I? Only to look.'),
          say('narration', 'The Comte turns one card of the Ashcombe deck over in his fingers, under the lamp: a queen, painted with a face from a Tudor household.'),
          say('varenne', 'Kent, 1540s. Hand-painted. There are perhaps three like it in the world. You carry it in a handbag, mademoiselle?'),
        ],
      },
    ],
    finale: {
      bowOut: {
        siobhan: [say('siobhan', 'I’ve a flight to Dublin in the morning. Go on, Anna, take him.'), say('narration', 'Siobhan cashes out and leans on the bar.')],
        dmitri: [say('dmitri', 'The position is clear. I resign the game and keep my material.'), say('narration', 'Dmitri gathers his chips and sits back to watch.')],
      },
      headsUp: [say('varenne', 'And so, mademoiselle, it is you and I.')],
    },
  },
  outro: {
    won: [
      'The Comte stands and bows. “I would have offered you a fortune for that deck. I see now it is not for sale.”',
      'He gives Anna his card. “If your family ever tires of winning, call me.” They never do.',
    ],
    lost: [
      'Your last franc goes to the Comte. He holds the old deck reverently, then asks if you would like to play him for it again tomorrow.',
      '“Two cards from your hand, Anna. Always two,” Siobhan reminds you. Try again?',
    ],
  },
};
