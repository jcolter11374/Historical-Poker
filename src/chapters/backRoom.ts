/**
 * Chapter 6, "The Back Room": Seven Card Stud, then Razz, in a Chicago
 * speakeasy in 1926. The first chapter of Part Two. (docs/GAME_OUTLINE.md,
 * "Part Two".) All people and places are fictional.
 *
 * Art: the back room, its title painting (the florist's shop in the rain) and
 * all three rivals are painted (docs/ART.md).
 */
import { cutout, lines, music, rival, say } from './cast';
import { RAZZ_1926, STUD_1926 } from '../games/catalog';
import type { Chapter, Character, CharacterArt } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/back-room/${file}`;

/** The painted rivals, by id: image, width / height, and place on the 1600 x 900 stage. */
const PAINTED: Record<string, CharacterArt> = {
  sal: cutout(art('sal.webp'), 0.9356, { x: 340, bottom: 590, height: 450 }),
  nora: cutout(art('nora.webp'), 1.02, { x: 800, bottom: 505, height: 390 }),
  gus: cutout(art('gus.webp'), 1.0156, { x: 1265, bottom: 590, height: 450 }),
};
const paint = (r: Character): Character => ({ ...r, art: PAINTED[r.id] ?? r.art });
const painted = ([a, b, c]: Chapter['rivals']): Chapter['rivals'] => [paint(a), paint(b), paint(c)];

export const BACK_ROOM: Chapter = {
  id: 'back-room',
  numeral: '6',
  part: 2,
  title: 'The Back Room',
  year: 1926,
  place: 'A speakeasy behind a florist’s shop, Chicago',
  youAre: 'Edith Avery, Clara’s daughter',
  teaches: 'Seven Card Stud, then Razz',
  rulesObject: 'Rules on a matchbook',
  stages: [
    {
      fromHand: 1,
      label: 'Seven Card Stud',
      structure: { unit: 10 },
      games: [
        {
          game: STUD_1926,
          betting: 'fixed-limit',
          lesson: {
            teacher: 'sal',
            before: [
              say('sal', 'Seven-card stud, Miss Avery. It’s the coming game: two more cards than your mother’s game, and a lot more to think about.'),
              say('sal', 'Everybody antes. You get two cards down and one up. High card up talks first: he can bet or check. Then betting.'),
              say('sal', 'Then three more cards up, one at a time, a bet after each. Then the last card face down. Best five of your seven wins.'),
              say('sal', 'It’s a limit game: bets come in fixed sizes. Ten a bet on the early streets, twenty later. Nobody gets pushed out by one big bet; you get bled slowly. I keep books, I know.'),
            ],
            streets: {
              0: [say('sal', 'Third street. Two down, one up. A pair already, or three cards to a flush, is worth playing. Look at the up cards: if your cards are showing elsewhere, they’re dead.')],
              1: [say('sal', 'Fourth street. Best hand showing talks first, same as before: a pair on the board beats any one card.')],
              2: [say('sal', 'Fifth street. The bets double here. If you’re not drawing to something real, this is the cheap time to fold.')],
              4: [say('sal', 'Seventh street: the last card, face down. Pick your best five of the seven. The label under your cards shows it.')],
            },
          },
        },
      ],
    },
    {
      fromHand: 7,
      label: 'Razz, after midnight',
      structure: { unit: 10 },
      opening: [
        say('narration', 'The clock over the bar strikes midnight. Nora Shea locks the front door, turns the sign to CLOSED, and comes back to the table with a grin.'),
        say('nora', 'After midnight we play my game, kids. Stud for losers.'),
      ],
      games: [
        {
          game: RAZZ_1926,
          betting: 'fixed-limit',
          lesson: {
            teacher: 'nora',
            before: [
              say('nora', 'Razz. Same deal as stud: two down, one up, three more up, last one down. Same betting.'),
              say('nora', 'But the LOWEST hand wins. Aces are low. Straights and flushes don’t count against you. Five-four-three-two-ace is perfect: a wheel.'),
              say('nora', 'Pairs are poison, and a king is the worst thing you can show.'),
              say('nora', 'The lowest hand showing talks first, every street. Got it? Good. Now give me your money.'),
            ],
            streets: {
              0: [say('nora', 'Three small cards, all different? That’s a start. A king up? Get out, honey.')],
              1: [say('nora', 'Fourth street. Count from the top: an eight-low is fine, a seven-low is pretty, a six-low is a dream.')],
              4: [say('nora', 'Last card. Your best five low cards play: the label under your hand says what you’ve got.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 400,
  levelEvery: 8,
  levelLines: [say('narration', 'Somebody turns up the phonograph. Nora doubles the limits: “Keeps you awake.”')],
  intro: [
    'Chicago, 1926. Prohibition. Behind the cold room of a florist’s shop on the North Side, a door with no handle opens onto a smoky back room with a bar and a poker table.',
    'Edith Avery, Clara’s daughter, an Avery by her mother’s rule that the name goes with the deck, works days as a stenographer. At night she plays cards, with the family deck in her handbag for luck.',
    'Nora Shea owns the room, and everybody in it. She has heard about the Avery deck. She would like to see if it is as lucky as they say.',
  ],
  recap: [
    'The Ashcombe deck was painted in 1543 for Lady Margery Ashcombe. It crossed to America in 1763 with the Averys.',
    'In 1836, Kit Avery won it back on a Mississippi steamboat from the card sharp Silas Crane. In 1876, Kit’s granddaughter Clara kept it at a Deadwood table against Silas’s grandson, who swore his family had been robbed of it. Then the Cranes went quiet.',
    'Fifty years on, Clara’s daughter Edith has it in Chicago.',
  ],
  history: [
    'Seven-card stud was a mainstay of American home games for most of the 1900s, and the main game in casinos in the eastern United States before Hold’em.',
    'Razz, stud played for low, grew up alongside it; exactly when it began is not recorded.',
    'Prohibition, from 1920 to 1933, put the drinking, and a good deal of the card playing, behind locked doors.',
  ],
  howToWin: [
    'Before midnight, a player who goes broke can buy back in. After midnight, in Razz, broke means out.',
    'Be the last one at Nora’s table with money.',
  ],
  rivals: painted([
    rival(
      {
        id: 'sal',
        name: 'Sal',
        fullName: 'Sal Moretti',
        role: 'A bootlegger’s bookkeeper who counts everything',
        personality: { valueAt: 1.55, bluff: 0.05, caution: 0.05, betSize: 0.6, respect: 0.75, reads: 0.7 },
        tell: { text: 'He taps his pencil on the table, counting.', signals: 'weak', showsWhenTrue: 0.6, showsWhenFalse: 0.12 },
        lines: lines({
          bet: ['Bet.', 'The numbers say raise.'],
          call: ['I’ll call.', 'Worth the price.'],
          fold: ['Bad odds. Fold.', 'Not on my books.'],
          check: ['Check.'],
          win: ['Arithmetic.', 'Into the ledger.'],
          bust: 'I’m out. My boss is going to ask about this.',
        }),
      },
      'left',
      '#2f3a2a',
    ),
    rival(
      {
        id: 'nora',
        name: 'Nora',
        fullName: 'Nora Shea',
        role: 'Owner of the back room',
        personality: { valueAt: 1.35, bluff: 0.15, caution: 0.02, betSize: 0.7, trap: 0.25, respect: 0.6, reads: 0.8 },
        tell: { text: 'She laughs and lights a cigarette.', signals: 'bluffing', showsWhenTrue: 0.6, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Bet, kid.', 'Raise. It’s my room.', 'Let’s make it worth the trip.'],
          call: ['Sure.', 'I’ll see it.'],
          fold: ['Take it.', 'Not my hand.'],
          check: ['Check.'],
          win: ['The house thanks you.', 'Drinks are on you, then.'],
          bust: 'Well, well. Cleaned out in my own room. You’re all right, Avery.',
        }),
      },
      'across',
      '#3c1f2e',
    ),
    rival(
      {
        id: 'gus',
        name: 'Gus',
        fullName: 'Gus Lindqvist',
        role: 'A Swedish truck driver who just likes the company',
        personality: { valueAt: 1.3, bluff: 0.1, caution: -0.08, betSize: 0.5, respect: 0.4, reads: 0.1 },
        tell: { text: 'He hums a Swedish song.', signals: 'strong', showsWhenTrue: 0.55, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['I bet! Ja!', 'More, more.'],
          call: ['I come along.', 'Ja, call.'],
          fold: ['Nej. Fold.', 'Too much for Gus.'],
          check: ['Check, ja.'],
          win: ['Ha! Lucky Gus!', 'Tack, tack!'],
          bust: 'Gus is broke! Ha! Good game, everybody. Good game.',
        }),
      },
      'right',
      '#4a5a6a',
    ),
  ]),
  nemesisId: 'nora',
  narratorId: 'nora',
  scene: {
    music: music('back-room'),
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#16110f', light: '#e9b86a', felt: '#2a3a2e', rim: '#4a3020' },
  },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Nora Shea', line: 'The Back Room, 1926. Stud for winners, after all.' },
  story: {
    moments: [
      {
        beforeHand: 4,
        lines: [
          say('narration', 'A knock at the door: three short, two long. Everyone freezes. Gus sweeps the chips into a flowerpot.'),
          say('nora', 'Relax. It’s the ice man. Gus, put the money back. All of it, Gus.'),
          say('gus', 'Ja, ja. All of it.'),
        ],
      },
      {
        beforeHand: 6,
        lines: [
          say('nora', 'Funny thing, Avery. A lawyer has been asking around the North Side about an old painted deck. Cash for whoever brings it in, and no name on his letter. He wrote to you too?'),
          say('narration', 'He did. It said: name your price, or the deck will be taken from you at a card table, as it was taken from us. Edith did not answer it.'),
          say('nora', 'I don’t run errands for men with no name. I’ll win it for myself, thanks.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        sal: [say('sal', 'I can count. I’m done. It’s between you two.'), say('narration', 'Sal closes his notebook and moves to the bar.')],
        gus: [say('gus', 'I go home while I have money for my mother. Good luck, Miss Edith!'), say('narration', 'Gus pulls on his coat and waves from the door.')],
      },
      headsUp: [say('nora', 'Just you and me, Avery. Let’s see that luck.')],
    },
  },
  outro: {
    won: [
      'Nora Shea pushes the last of her chips across the felt and pours two glasses of something illegal. “To the Avery deck,” she says. “And to anybody who can beat me at Razz.”',
      'Edith walks home at dawn with the deck in her handbag. The game is changing: stud now, and someday something else. The deck will be there for it.',
    ],
    lost: [
      'Your last chip is gone. Nora taps the old deck on the bar. “Next time, kid. Bring more money.”',
      '“In Razz, run from a pair,” Sal tells you on the way out. “And from anybody showing three little cards.” Try again?',
    ],
  },
};
