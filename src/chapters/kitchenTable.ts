/**
 * Epilogue, "The Kitchen Table": the home game the night after the wedding,
 * the kind of game RSDP Live was made for. No-Limit Hold'em with the house
 * extras RSDP Live offers: bomb pots, double board, and the 7-2 bounty.
 *
 * The player has married Elena Crane, whom he beat in Macau, so both
 * families are at the table: the player, his wife, Victor Crane, and the
 * player's friend Dee. Marcus deals and Priya heckles from the sofa: they
 * speak but hold no seat (`bystanders`). All people are fictional.
 */
import { lines, music, rival, say } from './cast';
import type { Chapter } from './types';

export const KITCHEN_TABLE: Chapter = {
  id: 'kitchen-table',
  numeral: 'Epilogue',
  part: 2,
  title: 'The Kitchen Table',
  year: 'Today',
  place: 'Home, the night after the wedding',
  bystanders: { marcus: 'Marcus', priya: 'Priya' },
  youAre: 'yourself, the last Avery',
  teaches: 'House extras: bomb pots, double board and the 7-2 bounty',
  rulesObject: 'House rules on the fridge',
  dealerMarker: 'button',
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
            teacher: 'dee',
            before: [
              say('marcus', 'Okay, house rules, because every home game has some. I’m dealing. It’s No-Limit Hold’em, one and two dollar blinds. You know Hold’em.'),
              say('dee', 'Rule one: the seven-deuce. Win a pot with a seven and a two, show it, and everybody else pays you a bounty. It’s the worst hand in the game, so now it’s the best.'),
              say('victor', 'That is not poker.'),
              say('priya', 'Rule two: bomb pots. Every few hands, everyone puts in a little extra, no betting before the flop, and the flop just comes. Chaos. I love it.'),
              say('marcus', 'And on bomb pots we deal two boards. Half the pot for each board. You’ll see.'),
              say('victor', 'Two boards. Mei Lin must never hear of this.'),
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
  levelLines: [say('narration', 'Someone cuts more wedding cake. Marcus says the blinds should go up “to keep it spicy”. Nobody argues, not even Victor.')],
  intro: [
    `A year and a good many dinners after Macau. Yesterday you married Elena Crane, with both families in one room and nobody counting the chairs between them.`,
    `Tonight is the game after the wedding: your kitchen table, a stack of borrowed chips, and leftover cake where the pizza usually goes. Your wife has the seat across from you. Victor Crane, who has never played a home game in his life, sits on her left. Your friend Dee has the other chair, Marcus insists on dealing, and Priya is heckling from the sofa.`,
    'The old deck is too precious to shuffle now. It sits on the counter in its leather case while you play with a new one. Everyone wants to hear the whole story. First, they want your money.',
  ],
  recap: [
    'The Ashcombe deck was painted in 1543 and has been played for at every kind of poker table since: a Tudor hall, an English inn, a New Orleans gaming house, a steamboat, an army camp, a gold town, a speakeasy, Las Vegas, Paris, Atlantic City, the internet, an English card room and Macau.',
    `For nearly two hundred years the Crane family wanted it back. In Macau you won it from Elena Crane, the best of them, and then the two of you went to dinner. The feud ended the way the best ones do: with a wedding.`,
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
        id: 'dee',
        name: 'Dee',
        fullName: 'Dee',
        role: 'Your friend, who plays seven-deuce every single time',
        personality: { valueAt: 1.35, bluff: 0.18, caution: -0.02, betSize: 0.6, respect: 0.45, reads: 0.3 },
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
      'left',
      '#6a4a2a',
    ),
    rival(
      {
        id: 'crane',
        name: 'Elena',
        fullName: `Elena Crane`,
        role: `Your wife, as of yesterday`,
        personality: { valueAt: 1.35, bluff: 0.18, caution: 0.01, betSize: 0.75, trap: 0.25, respect: 0.6, reads: 0.9 },
        tell: { text: `She looks up at you before she bets.`, signals: 'bluffing', showsWhenTrue: 0.65, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Raise.', 'Bet. I know that face.', 'Let’s see what an Avery does with that.'],
          call: ['Call.', 'I’ll look.'],
          fold: ['Yours. This once.', 'Fold.'],
          check: ['Check.'],
          win: ['Thank you.', `One day married, and already taking my husband’s money.`],
          bust: 'I’m out. Fine. You wash, I’ll dry.',
        }),
      },
      'across',
      '#5a1f2e',
    ),
    rival(
      {
        id: 'victor',
        name: 'Victor',
        fullName: 'Victor Crane',
        role: `Your new father-in-law, at his first home game`,
        personality: { valueAt: 1.3, bluff: 0.2, caution: 0.0, betSize: 0.75, trap: 0.25, respect: 0.5, reads: 0.7, tilt: 0.1 },
        tell: { text: 'He straightens his cufflinks: little gold riverboats.', signals: 'bluffing', showsWhenTrue: 0.65, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Raise.', 'I bet. Is that allowed here? Good.', 'Let’s see where we are.'],
          call: ['Call.', 'I’ll see it.'],
          fold: ['Yours.', 'Fold.'],
          check: ['Check.'],
          win: ['Thank you.', 'The Cranes are due. In two-dollar chips, it seems.'],
          bust: 'Busted at a kitchen table, by my own family. Wonderful. Deal me in next week.',
        }),
      },
      'right',
      '#1a1a1a',
    ),
  ],
  nemesisId: 'crane',
  narratorId: 'dee',
  scene: { music: music('kitchen-table'), palette: { wall: '#1a1612', light: '#ffe2a8', felt: '#6a4a2a', rim: '#3a2a1a' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Avery and Crane', line: 'The Kitchen Table, the night after the wedding. One deck, one family.' },
  story: {
    dealer: ['Blinds in!', 'Shuffle up and deal.', 'Cards!'],
    moments: [
      {
        beforeHand: 3,
        lines: [
          say('victor', `My new son-in-law tells me there is a prize here for the worst hand in poker. I have studied this game for fifty years, and nobody told me.`),
          say('dee', 'Stick with me, Mr. Crane.'),
        ],
      },
      {
        beforeHand: 6,
        lines: [
          say('priya', 'Okay, so tell us again. The deck was in a Tudor castle?'),
          say('narration', 'You tell them about Nan Avery and Lady Margery, and the Pewter Lamb in the snow, and the steamboat, and Deadwood, and all the rest. Then Victor tells it again, with the Cranes as the injured party. It takes two hands.'),
          say('crane', 'For the record, Silas dealt seconds. It is in our family’s letters too, if you read between the lines.'),
          say('marcus', 'So after two hundred years the Cranes just… gave up?'),
          say('dee', 'The Cranes didn’t fold. They married in.'),
        ],
      },
      {
        beforeHand: 9,
        lines: [
          say('victor', 'In Macau I have played for a house on one card. Tonight I am playing for who dries the dishes. I have not enjoyed a game so much in forty years.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        victor: [say('victor', 'The first time a Crane has lost to an Avery and enjoyed it. I will watch. Is there more cake?'), say('narration', 'Victor takes his plate to the sofa. Priya makes room.')],
        dee: [say('dee', 'Heads-up, the newlyweds? I’m out. I mean, I’m in. Watching.'), say('narration', 'Dee leans back to watch.')],
      },
      headsUp: [say('crane', 'You and me again. Last time it was for the deck. This time, the loser does the dishes.')],
    },
  },
  outro: {
    won: [
      `The last chips are yours. Your wife groans, kisses your cheek, and starts on the dishes. Priya asks when the next game is. Victor asks if he may come.`,
      `The old deck sits on the counter in its full case: Silas, Margery, Pike, Reed, Ruby, Élodie, Nora, Tex, the Comte, Margot, N0rthStar, Gaz and Elena. In the lid, under “M.A. 1543” and Clara’s “Still ours”, the last line is two names side by side: Avery and Crane.`,
      'Every one of those games still has a table somewhere. Start your own.',
    ],
    lost: [
      `Your last chip is gone, and your wife is unbearable about it. You do the dishes.`,
      '“It’s a home game,” Dee says. “Rebuy.” Try again?',
    ],
  },
};
