/**
 * Chapter 4, "The Camp": five-card stud in a Union army camp near
 * Chattanooga, November 1863, the night before battle. A quieter, more
 * serious chapter. (docs/GAME_OUTLINE.md, Chapter 4.)
 */
import { STUD5_ID } from '../games/fiveCardStud';
import { lines, rival, say } from './cast';
import type { Chapter } from './types';

export const CAMP: Chapter = {
  id: 'camp',
  numeral: '4',
  part: 1,
  title: 'The Camp',
  year: 1863,
  place: 'A Union army camp near Chattanooga, Tennessee',
  youAre: 'Corporal Sam Avery, Kit’s son',
  teaches: 'Five-card stud, the soldiers’ game',
  rulesObject: 'Rules in the sutler’s ledger',
  stages: [
    {
      fromHand: 1,
      structure: { unit: 4 },
      games: [
        {
          game: STUD5_ID,
          betting: 'pot-limit',
          lesson: {
            teacher: 'reed',
            before: [
              say('reed', 'Stud, Corporal. Every man in this army plays it, and most of them badly. Listen once.'),
              say('reed', 'Everybody antes. You get one card face down, your hole card, and one face up. Nobody sees the hole card but you.'),
              say('reed', 'Lowest card showing has to bring it in: a small forced bet, or a full one if he likes his hand. Then the betting goes round.'),
              say('reed', 'Three more cards come face up, one at a time, with betting after each. Best hand showing bets first. Five cards, best hand wins: straights and flushes count now.'),
            ],
            streets: {
              0: [say('reed', 'Look at what everyone is showing. A man with an ace up has a head start. A man who bets big with a deuce up has something in the hole, or wants you to think so.')],
              1: [say('reed', 'Third card. If your cards are beaten by what someone shows already, get out cheap.')],
              2: [say('reed', 'Fourth card. The bets get bigger from here. Count what’s out: if two of your rank are on the table, nobody can make three of them.')],
              3: [say('reed', 'Last card. Look at every hand showing and ask: what does his hole card have to be? Then decide.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 120,
  levelEvery: 10,
  levelLines: [say('narration', 'The rain stops. Somewhere a bugle sounds for no reason, and the bets get bigger.')],
  intro: [
    'November 22, 1863. Rain drums on the canvas of a lantern-lit tent outside Chattanooga. Tomorrow, the army attacks.',
    'Kit Avery’s son Sam is a corporal now, and the Ashcombe deck rides in his knapsack, as it has all through the war. It was his father’s, and his father’s before that.',
    'It is payday. Sergeant Amos Reed has seen the old deck, and has heard the legend. Tonight, he wants it.',
  ],
  recap: [
    'The Ashcombe deck was painted in 1543 and won at Primero; it crossed to America in 1763 when Will Avery won his passage at Brag.',
    'In 1836, Kit Avery won it back from the riverboat gambler Silas Crane, who had cheated Kit’s father out of it. Kit kept it the rest of his life.',
  ],
  history: [
    'Five-card stud first appears in print in The American Hoyle of 1864, and was much played by soldiers on both sides of the Civil War.',
    'The 52-card deck had replaced the old 20-card one and brought in the flush. The straight was new: the same 1864 book lists it.',
    'Cards with corner numbers, so you could fan them in one hand, were first patented in 1864, and caught on in the 1870s and 1880s. The cards in this tent have none.',
  ],
  howToWin: [
    'Everyone antes $1; the low card brings it in for $1. No bet may be larger than the pot.',
    'Once Sergeant Reed stakes his claim, take his last dollar to keep the deck.',
  ],
  rivals: [
    rival(
      {
        id: 'toby',
        name: 'Toby',
        fullName: 'Private Toby Finch',
        role: 'A drummer boy, fifteen and pretending to be eighteen',
        personality: { valueAt: 1.5, bluff: 0.04, caution: -0.12, betSize: 0.45 },
        tell: { text: 'He grins at his new card.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.55 },
        lines: lines({
          bet: ['I’ll bet! I’ll bet a dollar!', 'Raise, I think? Is that allowed?'],
          call: ['I’m in!', 'Call, call.'],
          fold: ['Aw. Fold.', 'I guess not.'],
          check: ['Check, Sergeant?'],
          win: ['I won? I won!', 'Wait till I write my ma.'],
          bust: 'That was my whole month. Ma was going to get half of it.',
        }),
      },
      'left',
      '#2d3d63',
    ),
    rival(
      {
        id: 'reed',
        name: 'Sergeant Reed',
        fullName: 'Sergeant Amos Reed',
        role: 'A veteran of every battle since Bull Run',
        personality: { valueAt: 1.9, bluff: 0.02, caution: 0.1, betSize: 0.75 },
        // Stops chewing when strong: about 80% honest.
        tell: { text: 'He stops chewing his tobacco.', signals: 'strong', showsWhenTrue: 0.7, showsWhenFalse: 0.12 },
        lines: lines({
          bet: ['Bet.', 'Raise. Think hard, Corporal.'],
          call: ['Call.', 'I’ll see it.'],
          fold: ['No.', 'Fold.'],
          check: ['Check.'],
          win: ['Hm.', 'That’s how it’s done, boys.'],
          bust: 'Beaten fair. Keep your deck, Corporal. You’ll need luck tomorrow more than I will.',
        }),
      },
      'across',
      '#283548',
    ),
    rival(
      {
        id: 'hattie',
        name: 'Hattie',
        fullName: 'Hattie Bloom',
        role: 'The camp sutler, who sells everything',
        // Bets her board: aggressive, and bluffs when her up cards look scary.
        personality: { valueAt: 1.35, bluff: 0.22, caution: 0.02, betSize: 0.7 },
        tell: { text: 'She taps her pencil against the ledger.', signals: 'bluffing', showsWhenTrue: 0.65, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['That queen of mine looks lonely. Bet.', 'I’ll bet. Credit’s good with me.', 'Raise, boys.'],
          call: ['I’ll stay in.', 'Call, and write it down.'],
          fold: ['Too rich.', 'I sell shovels, not miracles.'],
          check: ['Check.'],
          win: ['Pleasure doing business.', 'That’s tobacco money for a month.'],
          bust: 'Well, I’m cleaned out. Good thing I sell the cards, too.',
        }),
      },
      'right',
      '#6a4a2a',
    ),
  ],
  nemesisId: 'reed',
  narratorId: 'hattie',
  scene: { palette: { wall: '#14130f', light: '#e8c06a', felt: '#4d3d27', rim: '#3b3022' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Sergeant Amos Reed', line: 'The Camp, 1863. When he bet, you believed him.' },
  story: {
    stake: {
      afterPlayerWins: 2,
      orAfterHands: 6,
      lines: [
        say('reed', 'That deck of your pa’s. Men say it never loses. I’d like to carry it tomorrow.'),
        say('narration', 'Sergeant Reed lays a silver watch on the crate: a presentation piece, engraved for gallantry at Shiloh.'),
        say('reed', 'My watch against your deck. Take my last dollar and you have both. Lose, and the deck goes up the ridge with me.'),
        say('hattie', 'He stops chewing when he’s got it, Sam. You can set your watch by it.'),
      ],
      passes: [
        say('narration', 'Sergeant Reed is out. His watch passes to {name}.'),
        say('hattie', 'The watch is still on the table, Sam. Win it back if you want it.'),
      ],
    },
    moments: [
      {
        beforeHand: 3,
        lines: [
          say('toby', 'My ma needs that money for the winter. Maybe I shouldn’t have played.'),
          say('hattie', 'Then play careful, child. Fold the deuces.'),
        ],
      },
      {
        beforeHand: 9,
        lines: [
          say('narration', 'A courier ducks into the tent, rain streaming from his cap. Orders: the division moves on Missionary Ridge at first light.'),
          say('reed', 'Well. Finish the hand, boys. Then write your letters.'),
          say('toby', 'Is it… is it a big fight, Sergeant?'),
          say('reed', 'Stay near me, Finch.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        toby: [say('toby', 'I’ll stop while I’ve still got something to send home. Go on, Corporal. Beat him.'), say('narration', 'Toby pockets his money and sits on his bedroll to watch.')],
        hattie: [say('hattie', 'I know when to close the shop. Good luck, boys. Both of you.'), say('narration', 'Hattie closes her ledger and steps back from the crate.')],
      },
      headsUp: [say('reed', 'Just us, Corporal. Your pa’s deck against my watch.')],
    },
  },
  outro: {
    won: [
      'Sergeant Reed pushes the watch across the crate. “Carry the deck tomorrow, Corporal. And keep your head down.”',
      'By lantern light, Sam writes to his father: “I still have it, Pa. Whatever happens on the ridge, it is coming home.”',
      'The Ashcombe deck survives the war. Thirteen years later, it is in a Dakota gold town…',
    ],
    lost: [
      'Your last greenback goes to the Sergeant. He takes the old deck gently, as if it might break.',
      '“He stops chewing when he’s strong, Sam. When he chews, he’s bluffing you out with nothing,” Hattie says quietly. “Again?”',
    ],
  },
};
