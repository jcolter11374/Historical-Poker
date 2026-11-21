/**
 * Chapter 7, "The Desert Classic": Limit Hold'em in a side game, then a
 * No-Limit Hold'em tournament with rising blinds, Las Vegas, 1972. All
 * people and events are fictional.
 *
 * Art: the tournament room, its title painting (the strip at dusk) and all
 * three rivals are painted (docs/ART.md).
 */
import { cutout, lines, music, rival, say } from './cast';
import type { Chapter, Character, CharacterArt } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/desert-classic/${file}`;

/** The painted rivals, by id: image, width / height, and place on the 1600 x 900 stage. */
const PAINTED: Record<string, CharacterArt> = {
  weiss: cutout(art('weiss.webp'), 0.81, { x: 340, bottom: 590, height: 450 }),
  tex: cutout(art('tex.webp'), 0.9344, { x: 800, bottom: 505, height: 390 }),
  lorraine: cutout(art('lorraine.webp'), 0.8, { x: 1265, bottom: 590, height: 450 }),
};
const paint = (r: Character): Character => ({ ...r, art: PAINTED[r.id] ?? r.art });
const painted = ([a, b, c]: Chapter['rivals']): Chapter['rivals'] => [paint(a), paint(b), paint(c)];

export const DESERT_CLASSIC: Chapter = {
  id: 'desert-classic',
  numeral: '7',
  part: 2,
  title: 'The Desert Classic',
  year: 1972,
  place: 'A casino poker tournament, Las Vegas',
  youAre: 'Lou Avery',
  teaches: 'Limit Hold’em, then No-Limit Hold’em',
  rulesObject: 'The tournament program',
  stages: [
    {
      fromHand: 1,
      label: 'The side game, the night before',
      structure: { unit: 10 },
      games: [
        {
          game: 'nlhe',
          betting: 'fixed-limit',
          lesson: {
            teacher: 'weiss',
            before: [
              say('weiss', 'Hold’em, Mr. Avery. The Texans brought it here a few years ago and now everybody wants to learn it. I teach mathematics; let me teach you this.'),
              say('weiss', 'No antes. The two players left of the dealer button post blinds, a small one and a big one. Then two cards each, face down. Those are yours alone.'),
              say('weiss', 'Then five cards come face up in the middle, shared by everyone: three at once (the flop), then one (the turn), then one (the river). A round of betting before the flop and after each.'),
              say('weiss', 'Your hand is the best five from your two and the five shared. Tonight it’s limit: fixed bets, ten before the turn, twenty after. A good way to learn.'),
            ],
            streets: {
              0: [say('weiss', 'Your two cards. Pairs, two high cards, an ace with something: play them. Seven and two of different suits: the worst hand in the game. Fold it.')],
              1: [say('weiss', 'The flop. Three shared cards. Now you have five cards to think about: what’s your best hand, and what could someone else have with these three?')],
              2: [say('weiss', 'The turn. Bets double now. If you’re behind with little hope, it costs more to find out.')],
              3: [say('weiss', 'The river, the last card. Your best five of seven: the label under your cards says it. Did anyone just make a flush?')],
            },
          },
        },
      ],
    },
    {
      fromHand: 6,
      label: 'The Desert Classic: no limit',
      resetStacks: true,
      structure: { unit: 10 },
      opening: [
        say('narration', 'Morning. The tournament room of the Golden Mesa casino: thirty players, one prize, and a man from a Las Vegas newspaper taking notes. By evening, it’s down to four.'),
        say('tex', 'Well, look who made it. The schoolteacher, the showgirl, the kid with the old deck, and me.'),
      ],
      games: [
        {
          game: 'nlhe',
          betting: 'no-limit',
          lesson: {
            teacher: 'weiss',
            before: [
              say('weiss', 'Same game, Mr. Avery, but no limit. Any bet, any time, up to everything in front of you. That changes everything.'),
              say('weiss', 'It’s a tournament: when your chips are gone, you’re out, and the blinds go up every few hands so it can’t last forever.'),
              say('weiss', 'One mistake can end your day. So can one brave bet. Pick your spots.'),
            ],
            streets: {
              0: [say('weiss', 'Bet sizes are yours now. Raising about three times the big blind is the custom. All in is a button you only press with a reason.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 500,
  levelEvery: 5,
  levelLines: [say('narration', 'A tournament director in a bolo tie calls out: “Blinds are going up!”')],
  intro: [
    'Las Vegas, 1972. The Golden Mesa casino is holding its first Desert Classic, a no-limit Hold’em tournament for anyone with the entry fee.',
    'Lou Avery came out from Chicago with his savings and his grandmother Edith’s old deck. Tonight there’s a side game, to learn Hold’em. Tomorrow, the tournament.',
    'The favourite is a big Texan called Tex Pruitt, who has been playing Hold’em since before anyone in Nevada had heard of it.',
  ],
  recap: [
    'The Ashcombe deck, painted in 1543, has passed down the Avery family in America for two centuries, through riverboats, a war and a gold town.',
    'In 1926 Edith Avery kept it at a Chicago speakeasy table, learning seven-card stud and Razz from the people who played them.',
  ],
  history: [
    'Texas Hold’em was first dealt in Las Vegas in 1963. In the late 1960s Texas players made it a big game there, and for years the Golden Nugget was the only casino that spread it.',
    'The first championship was held in 1970. From the next year its main event was a tournament of no-limit Hold’em, where everyone starts with the same chips and plays until one player has them all.',
    'No-limit, where any bet can be everything you have, made Hold’em famous.',
  ],
  howToWin: [
    'The side game: limit Hold’em, and you can buy back in if you go broke.',
    'The tournament: no-limit, blinds rise every five hands, and broke means out. Win every chip.',
  ],
  rivals: painted([
    rival(
      {
        id: 'weiss',
        name: 'Professor Weiss',
        fullName: 'Professor Milton Weiss',
        role: 'A mathematics professor who plays by the numbers',
        personality: { valueAt: 1.5, bluff: 0.06, caution: 0.04, betSize: 0.6, respect: 0.7, reads: 0.7 },
        tell: { text: 'He polishes his glasses.', signals: 'weak', showsWhenTrue: 0.55, showsWhenFalse: 0.12 },
        lines: lines({
          bet: ['A bet, by the numbers.', 'Raise. The odds favour it.'],
          call: ['The pot odds are right. Call.', 'Call.'],
          fold: ['Negative expectation. Fold.', 'I’ll pass on that.'],
          check: ['Check.'],
          win: ['As calculated.', 'Q.E.D.'],
          bust: 'Variance, Mr. Avery. Write that down: variance. Good luck.',
        }),
      },
      'left',
      '#4a4a3a',
    ),
    rival(
      {
        id: 'tex',
        name: 'Tex',
        fullName: '“Tex” Dawson Pruitt',
        role: 'A road gambler from Amarillo who plays every hand fast',
        personality: { valueAt: 1.2, bluff: 0.28, caution: -0.03, betSize: 0.8, respect: 0.35, reads: 0.5, tilt: 0.1 },
        tell: { text: 'He tips his hat back and grins.', signals: 'bluffing', showsWhenTrue: 0.65, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Raise, partner.', 'Let’s gamble!', 'Bet. Y’all are too slow.'],
          call: ['I’ll take a look.', 'Call.'],
          fold: ['Aw, shoot.', 'Yours, hoss.'],
          check: ['Check it.'],
          win: ['Yee-haw.', 'That’s Texas, son.'],
          bust: 'Well, butter my biscuits. Beat by a kid from Chicago. Good game, partner.',
        }),
      },
      'across',
      '#6a4a2a',
    ),
    rival(
      {
        id: 'lorraine',
        name: 'Lorraine',
        fullName: 'Lorraine Fisk',
        role: 'A former showgirl with an iron poker face',
        personality: { valueAt: 1.45, bluff: 0.12, caution: 0.03, betSize: 0.7, trap: 0.4, respect: 0.6, reads: 0.9 },
        tell: { text: 'Her face doesn’t move. At all.', signals: 'strong', showsWhenTrue: 0.35, showsWhenFalse: 0.35 },
        lines: lines({
          bet: ['Bet.', 'Raise.'],
          call: ['Call.'],
          fold: ['Fold.'],
          check: ['Check.'],
          win: ['Thank you, darling.', 'Mm-hm.'],
          bust: 'Well. I’ve had worse nights on stage. Break a leg, sugar.',
        }),
      },
      'right',
      '#5a2a4a',
    ),
  ]),
  nemesisId: 'tex',
  narratorId: 'weiss',
  scene: {
    music: music('desert-classic'),
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#1a1410', light: '#f5c878', felt: '#2a4a3a', rim: '#5a3a1a' },
  },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: '“Tex” Dawson Pruitt', line: 'The Desert Classic, 1972. All in, and all out.' },
  story: {
    dealer: ['Blinds, please. Cards in the air.', 'Shuffle up and deal.', 'Blinds in. Here they come.'],
    exits: {
      weiss: [say('narration', 'Professor Weiss shakes every hand at the table, and leaves to write a paper on what just happened.')],
      lorraine: [say('narration', 'Lorraine Fisk stands, smooths her dress, and walks out like it’s the end of a show.')],
    },
  },
  outro: {
    won: [
      'The last chips are yours. Flashbulbs go off; the man from the newspaper wants a photo of the winner with “that old deck of cards”.',
      'Tex Pruitt shakes your hand, hard. “Hold’em’s going to be big, partner. Real big. And you were here first.”',
    ],
    lost: [
      'Your last chip goes to Tex. He tips his hat to you. “Come back next year, partner.”',
      '“Don’t call off your tournament on a draw,” Professor Weiss says gently. “Patience is a strategy.” Try again?',
    ],
  },
};
