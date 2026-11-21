/**
 * Epilogue, "The Kitchen Table": a home game with friends, today, the kind
 * RSDP Live was made for. No-Limit Hold'em with the house extras RSDP Live
 * offers: bomb pots, double board, and the 7-2 bounty. All people are fictional.
 */
import { lines, music, rival, say } from './cast';
import type { Chapter } from './types';

export const KITCHEN_TABLE: Chapter = {
  id: 'kitchen-table',
  numeral: 'Epilogue',
  part: 2,
  title: 'The Kitchen Table',
  year: 'Today',
  place: 'A home game with friends',
  youAre: 'You',
  teaches: 'House extras: bomb pots, double board and the 7-2 bounty',
  rulesObject: 'House rules on the fridge',
  stages: [
    {
      fromHand: 1,
      structure: { unit: 2 },
      extras: { bombPotEvery: 4, bombPotUnits: 3, doubleBoardOnBombPots: true, bounty72Units: 2 },
      games: [
        {
          game: 'nlhe',
          betting: 'no-limit',
          lesson: {
            teacher: 'marcus',
            before: [
              say('marcus', 'Okay, house rules, because every home game has some. It’s No-Limit Hold’em, one and two dollar blinds. You know Hold’em.'),
              say('dee', 'Rule one: the seven-deuce. Win a pot with a seven and a two, show it, and everybody else pays you a bounty. It’s the worst hand in the game, so now it’s the best.'),
              say('priya', 'Rule two: bomb pots. Every few hands, everyone puts in a little extra, no betting before the flop, and the flop just comes. Chaos. I love it.'),
              say('marcus', 'And on bomb pots we deal two boards. Half the pot for each board. You’ll see.'),
            ],
            streets: {
              0: [say('dee', 'Got a seven and a deuce? You know what to do. Raise it. Trust me.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 200,
  levelEvery: 12,
  levelLines: [say('narration', 'The pizza arrives. Marcus says the blinds should go up “to keep it spicy”. Nobody argues.')],
  intro: [
    'Today. A kitchen table, a stack of borrowed chips, three friends and a pizza on the way.',
    'You have brought the old deck home. It is too precious to shuffle now, so it sits on the counter in its leather case, full at last, while you play with a new one.',
    'Your friends want to hear the whole story. First, they want your money.',
  ],
  recap: [
    'The Ashcombe deck was painted in 1543 and has been played for at every kind of poker table since: a Tudor hall, an English inn, a New Orleans gaming house, a steamboat, an army camp, a gold town, a speakeasy, Las Vegas, Paris, Atlantic City, the internet, an English card room and Macau.',
    'In Macau, the Cranes finally let it go. Now it is home.',
  ],
  history: [
    'Home games are where most people learn poker, and every one has house rules.',
    'Bomb pots, double boards and the seven-deuce bounty are favourite home-game extras. RSDP Live, the poker engine behind this game, offers all three.',
  ],
  howToWin: [
    'No-limit, $1 and $2 blinds. Every fourth hand is a double-board bomb pot. Win a pot with 7-2 and show it for a bounty.',
    'Be the last one with chips. Or just enjoy it: it’s a home game.',
  ],
  rivals: [
    rival(
      {
        id: 'priya',
        name: 'Priya',
        fullName: 'Priya',
        role: 'Loves bomb pots. Loves chaos.',
        personality: { level: 'easy', valueAt: 1.2, bluff: 0.22, caution: -0.06, betSize: 0.7, respect: 0.3, reads: 0.2 },
        tell: { text: 'She can’t stop smiling.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.3 },
        lines: lines({
          bet: ['Raise!', 'Let’s gooo.', 'Bet. Come on.'],
          call: ['Sure, I call.', 'Why not.'],
          fold: ['Ugh. Fold.', 'Fine.'],
          check: ['Check.'],
          win: ['Yes!', 'Pay me.'],
          bust: 'I’m out! I’m getting more pizza. Somebody save me a slice of the action.',
        }),
      },
      'left',
      '#5a3a6a',
    ),
    rival(
      {
        id: 'marcus',
        name: 'Marcus',
        fullName: 'Marcus',
        role: 'Hosts every game, and takes it very seriously',
        personality: { level: 'normal', valueAt: 1.45, bluff: 0.1, caution: 0.03, betSize: 0.65, trap: 0.3, respect: 0.6, reads: 0.7, tilt: 0.08 },
        tell: { text: 'He re-stacks his chips by colour.', signals: 'strong', showsWhenTrue: 0.55, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['Bet.', 'I’ll raise.', 'Let’s see where we are.'],
          call: ['Call.', 'I’ll look.'],
          fold: ['Fold.', 'Good bet. I fold.'],
          check: ['Check.'],
          win: ['House wins.', 'Nice.'],
          bust: 'Busted at my own table. Again. Same time next week?',
        }),
      },
      'across',
      '#2a4a3a',
    ),
    rival(
      {
        id: 'dee',
        name: 'Dee',
        fullName: 'Dee',
        role: 'Plays seven-deuce every single time',
        personality: { level: 'easy', valueAt: 1.35, bluff: 0.18, caution: -0.02, betSize: 0.6, respect: 0.45, reads: 0.3 },
        tell: { text: 'She drums the table with both hands.', signals: 'bluffing', showsWhenTrue: 0.6, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['Raise. Could be seven-deuce.', 'Bet!'],
          call: ['Call.', 'I’m in.'],
          fold: ['Fold. It wasn’t seven-deuce.', 'Nope.'],
          check: ['Check.'],
          win: ['Ha!', 'Was it seven-deuce? You’ll never know.'],
          bust: 'I’m out. It was seven-deuce, by the way. Every time.',
        }),
      },
      'right',
      '#6a4a2a',
    ),
  ],
  nemesisId: 'marcus',
  narratorId: 'marcus',
  scene: { music: music('kitchen-table'), palette: { wall: '#1a1612', light: '#ffe2a8', felt: '#6a4a2a', rim: '#3a2a1a' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Your friends', line: 'The Kitchen Table, today. Where every poker player starts.' },
  story: {
    dealer: ['Blinds in!', 'Shuffle up and deal.', 'Cards!'],
    moments: [
      {
        beforeHand: 6,
        lines: [
          say('priya', 'Okay, so tell us again. The deck was in a Tudor castle?'),
          say('narration', 'You tell them about Nan Avery and Lady Margery, and the Pewter Lamb in the snow, and the steamboat, and Deadwood, and all the rest. It takes a whole hand.'),
          say('marcus', 'And the Cranes just… gave up?'),
          say('dee', 'Sounds like they finally learned to fold.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        priya: [say('priya', 'I’m going to watch this. Pizza and a show.'), say('narration', 'Priya pulls her chair back with a slice.')],
        dee: [say('dee', 'Heads-up? I’m out. I mean, I’m in. Watching.'), say('narration', 'Dee leans back to watch.')],
      },
      headsUp: [say('marcus', 'You and me. Winner does the dishes. Wait, no, loser does the dishes.')],
    },
  },
  outro: {
    won: [
      'The last chips are yours. Marcus groans and starts on the dishes. Priya asks when the next game is.',
      'The old deck sits on the counter in its full case: Silas, Margery, Pike, Reed, Ruby, Élodie, Nora, Tex, the Comte, Margot, N0rthStar, Gaz, Victor. And now, a picture of three friends at a kitchen table.',
      'Every one of those games still has a table somewhere. Start your own.',
    ],
    lost: [
      'Your last chip goes to Marcus, who is unbearable about it.',
      '“It’s a home game,” Dee says. “Rebuy.” Try again?',
    ],
  },
};
