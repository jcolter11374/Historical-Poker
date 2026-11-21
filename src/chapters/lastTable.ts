/**
 * Chapter 12, "The Last Table": HORSE, then the 8-Game mix, in a private
 * high-stakes room in Macau, today. The finale of Part Two: the Crane feud
 * ends for good. All people and places are fictional.
 *
 * Every game was taught in an earlier chapter, but a player may jump straight
 * here, so Mei Lin Chau gives a short lesson the first time each one is dealt.
 */
import type { BettingKind } from '@rsdp/engine/core';
import { lines, music, rival, say } from './cast';
import type { GamePlay, SceneLine } from './types';
import type { Chapter } from './types';

const L: BettingKind = 'fixed-limit';
const mei = (...texts: string[]): SceneLine[] => texts.map((t) => say('meilin', t));
const play = (game: string, betting: BettingKind, ...texts: string[]): GamePlay => ({ game, betting, lesson: { teacher: 'meilin', before: mei(...texts) } });

export const LAST_TABLE: Chapter = {
  id: 'last-table',
  numeral: '12',
  part: 2,
  title: 'The Last Table',
  year: 'Today',
  place: 'A private high-stakes room, Macau',
  youAre: 'You',
  teaches: 'HORSE, then the 8-Game mix',
  rulesObject: 'The tablet menu',
  money: { prefix: 'HK$' },
  stages: [
    {
      fromHand: 1,
      label: 'HORSE',
      structure: { unit: 50 },
      handsPerGame: 2,
      opening: mei(
        'Welcome. I am Mei Lin. Tonight we play HORSE: five games, two hands each, round and round. Hold’em, Omaha Hi-Lo, Razz, Stud, Stud Eight-or-better. H, O, R, S, E.',
        'All limit betting. I will tell you each time the game changes.',
      ),
      games: [
        play('nlhe', L, 'H: Limit Hold’em. Two cards each, five shared on the board, best five of seven. Fixed bets: one unit before the turn, two after.'),
        play('plo8', L, 'O: Omaha Hi-Lo. Four cards, use exactly two with three from the board. Half the pot to the best high, half to the best low of eight or under. Still limit.'),
        play('razz', L, 'R: Razz. Seven-card stud for the lowest hand. Aces low, pairs bad, 5-4-3-2-A is perfect. The highest card up brings in.'),
        play('stud', L, 'S: Seven Card Stud. Two down, four up, one down. Best five high. Lowest card up brings in; after that, best hand showing bets first.'),
        play('stud8', L, 'E: Stud, eight or better. Same deal; split the pot between best high and best low, if anyone has an eight-low.'),
      ],
    },
    {
      fromHand: 11,
      label: 'The 8-Game',
      structure: { unit: 50 },
      handsPerGame: 2,
      opening: [
        say('victor', 'HORSE is for tourists. Let’s play all eight.'),
        ...mei('The 8-Game, then. The five you know, plus three: 2-7 Triple Draw, No-Limit Hold’em and Pot-Limit Omaha. Two hands each.'),
        say('narration', 'The doors are closed. From here, broke means out.'),
      ],
      games: [
        play('td27', L, '2-7 Triple Draw. Five cards, three draws, lowest hand wins. Aces are high and straights and flushes count against you. 7-5-4-3-2 is the best.'),
        { game: 'nlhe', betting: L },
        { game: 'plo8', betting: L },
        { game: 'razz', betting: L },
        { game: 'stud', betting: L },
        { game: 'stud8', betting: L },
        play('nlhe', 'no-limit', 'No-Limit Hold’em. Same game as before, but any bet up to everything you have. Careful now.'),
        play('plo4', 'pot-limit', 'Pot-Limit Omaha. Four cards, exactly two with three from the board, high only. Bets up to the size of the pot.'),
      ],
    },
  ],
  startingStack: 2500,
  levelEvery: 10,
  levelLines: [say('narration', 'Midnight over the harbour. A host in a dark suit brings tea, and the limits go up.')],
  intro: [
    'Macau, today. On the top floor of a hotel over the harbour, a private room with one table, a dealer, and four chairs.',
    'You are the latest of the Averys to hold the Ashcombe deck. You have brought it because of an invitation from Victor Crane, Nate’s uncle and, by his own account, the last Crane who still wants it: one game, every game, for the deck, and the end of the feud.',
    'He has asked a local legend, Mei Lin Chau, to sit in and explain each game. She has played every one of them, everywhere.',
  ],
  recap: [
    'The Ashcombe deck was painted in Kent in 1543. It crossed to America in 1763, and the Avery family has kept it through every kind of poker since: straight poker, stud, draw, Hold’em, Omaha, triple draw and more.',
    'The Crane family has wanted it back since Kit Avery caught Silas Crane cheating on a steamboat in 1836. In 2005, Nate Crane lost to Jamie Avery on live television. Tonight it ends.',
  ],
  history: [
    'Mixed games rotate several kinds of poker, so a player must be good at all of them. HORSE, five limit games in turn, became a championship event in the 2000s.',
    'The 8-Game adds 2-7 Triple Draw, No-Limit Hold’em and Pot-Limit Omaha to HORSE’s five.',
    'Macau has become one of the biggest gambling centres in the world.',
  ],
  howToWin: [
    'During HORSE, a player who goes broke can buy back in.',
    'From the 8-Game on, broke means out. Be the last one at the table.',
  ],
  rivals: [
    rival(
      {
        id: 'meilin',
        name: 'Mei Lin',
        fullName: 'Mei Lin Chau',
        role: 'A quiet local legend who has played every game',
        personality: { level: 'hard', valueAt: 1.5, bluff: 0.08, caution: 0.04, betSize: 0.65, respect: 0.6, reads: 1 },
        tell: { text: 'She sips her tea.', signals: 'weak', showsWhenTrue: 0.5, showsWhenFalse: 0.15 },
        lines: lines({
          bet: ['Bet.', 'Raise, please.'],
          call: ['Call.'],
          fold: ['Fold.', 'Not this one.'],
          check: ['Check.'],
          win: ['Thank you.', 'Mm.'],
          bust: 'Very well played. I will watch the rest with great interest.',
          draw: ['One, please.', 'Two.'],
          pat: ['Pat.'],
        }),
      },
      'left',
      '#3a2a2a',
    ),
    rival(
      {
        id: 'victor',
        name: 'Victor',
        fullName: 'Victor Crane',
        role: 'The last Crane who still wants the deck',
        personality: { level: 'normal', valueAt: 1.3, bluff: 0.2, caution: 0.0, betSize: 0.75, trap: 0.25, respect: 0.5, reads: 0.7, tilt: 0.1 },
        tell: { text: 'He straightens his cufflinks: little gold riverboats.', signals: 'bluffing', showsWhenTrue: 0.65, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Raise.', 'Bet.', 'Let’s see if the deck still works.'],
          call: ['Call.', 'I’ll see it.'],
          fold: ['Yours.', 'Fold.'],
          check: ['Check.'],
          win: ['Thank you.', 'Two hundred years, and the Cranes are due.'],
          bust: 'That’s it, then. Nearly two hundred years. Keep it. It was always yours.',
          draw: ['One.', 'Two cards.'],
          pat: ['Pat.'],
        }),
      },
      'across',
      '#1a1a1a',
    ),
    rival(
      {
        id: 'rafael',
        name: 'Rafael',
        fullName: 'Rafael Duarte',
        role: 'A shipping heir who plays for fun, and loudly',
        personality: { level: 'easy', valueAt: 1.2, bluff: 0.22, caution: 0.05, betSize: 0.75, respect: 0.3, reads: 0.2, tilt: 0.1 },
        tell: { text: 'He hums along to music only he can hear.', signals: 'strong', showsWhenTrue: 0.5, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Raise! Why not?', 'Bet, my friend.'],
          call: ['Call, call.', 'I’m curious. Call.'],
          fold: ['Bah. Fold.', 'Okay, okay.'],
          check: ['Check.'],
          win: ['Ha! Beautiful!', 'Obrigado!'],
          bust: 'I’m finished! Best night of the year. Somebody call my boat.',
          draw: ['Two! Make them good.', 'Three. I like surprises.'],
          pat: ['I keep them all, because I’m brave.'],
        }),
      },
      'right',
      '#2a4a5a',
    ),
  ],
  nemesisId: 'victor',
  narratorId: 'meilin',
  scene: { music: music('last-table'), palette: { wall: '#0d0b10', light: '#f5d9a0', felt: '#3a1418', rim: '#b08a3a' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Victor Crane', line: 'The Last Table, today. Every game, and the end of the feud.' },
  story: {
    moments: [
      {
        beforeHand: 6,
        lines: [
          say('victor', 'Do you know what my family says about yours? That the deck does the winning. That an Avery couldn’t win a hand without it.'),
          say('meilin', 'Every Avery I have read about won by watching people, Mr. Crane. Not cards.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        meilin: [...mei('This is between your two families. I will watch. It will be a pleasure.'), say('narration', 'Mei Lin moves her chips aside and folds her hands.')],
        rafael: [say('rafael', 'I know a family feud when I see one! I’ll watch. Champagne for everyone!'), say('narration', 'Rafael sweeps his chips into a bag and settles in to watch.')],
      },
      headsUp: [say('victor', 'Just us, then. The way it was always going to end.')],
    },
  },
  outro: {
    won: [
      'Victor Crane looks at the cards for a long time. Then he laughs, for the first time all night, and pushes the last of his chips across the felt.',
      '“Keep it,” he says. “It was always yours. Maybe the Cranes can just play cards now.” Mei Lin pours three cups of tea.',
      'You open the leather case. Inside, under “M.A. 1543” and Clara’s pencilled line, there is just room for one more.',
    ],
    lost: [
      'Your last chip goes to Victor Crane. He holds the old deck up, and doesn’t look as happy as he expected to.',
      '“Every game has its own patience,” Mei Lin says. “Learn each one’s.” Try again?',
    ],
  },
};
