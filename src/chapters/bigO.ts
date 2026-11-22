/**
 * Chapter 11, "The Big O": 5-Card Omaha, then 6-Card Omaha, then their Hi-Lo
 * versions in turn, in a big card room in the English Midlands, 2019. All
 * people and places are fictional.
 */
import { cutout, lines, music, rival, say } from './cast';
import type { Chapter, Character, CharacterArt } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/big-o/${file}`;

/** The painted rivals, by id: image, width / height, and place on the 1600 x 900 stage. */
const PAINTED: Record<string, CharacterArt> = {
  kerryann: cutout(art('kerryann.webp'), 0.8222, { x: 340, bottom: 600, height: 450 }),
  gaz: cutout(art('gaz.webp'), 1.14, { x: 800, bottom: 540, height: 430 }),
  okafor: cutout(art('okafor.webp'), 0.9089, { x: 1265, bottom: 610, height: 460 }),
};
const paint = (r: Character): Character => ({ ...r, art: PAINTED[r.id] ?? r.art });
const painted = ([a, b, c]: Chapter['rivals']): Chapter['rivals'] => [paint(a), paint(b), paint(c)];

export const BIG_O: Chapter = {
  id: 'big-o',
  numeral: '11',
  part: 2,
  title: 'The Big O',
  year: 2019,
  place: 'A big card room in the English Midlands',
  youAre: 'Sophie Avery',
  teaches: '5- and 6-Card Omaha, then their Hi-Lo versions',
  rulesObject: 'The card room’s house rules',
  dealerMarker: 'button',
  houseDeals: true,
  money: { prefix: '£' },
  stages: [
    {
      fromHand: 1,
      label: '5-Card Omaha',
      structure: { unit: 4 },
      games: [
        {
          game: 'plo5',
          betting: 'pot-limit',
          lesson: {
            teacher: 'gaz',
            before: [
              say('gaz', 'Right, duck. You know Omaha? Four cards, use two, pot-limit? Good. Here we play it with five. Big O, the Yanks call it.'),
              say('gaz', 'Five cards in your hand. Still use exactly two of them, and exactly three off the board. That never changes.'),
              say('gaz', 'More cards means bigger hands. Two pair is nothing. A straight’s often second best. Play for the nuts.'),
            ],
            streets: {
              0: [say('gaz', 'Five cards. Look for ones that work together: suited, connected, a pair. Five strangers? Bin ’em.')],
              1: [say('gaz', 'Flop. Count your outs, duck: with five cards you’ve got loads of ways to make something. So has everyone else.')],
            },
          },
        },
      ],
    },
    {
      fromHand: 5,
      label: '6-Card Omaha',
      structure: { unit: 4 },
      opening: [say('gaz', 'Time to go up a card, eh? Six-card Omaha. You’ll love this, or you’ll hate it. No in between.')],
      games: [
        {
          game: 'plo6',
          betting: 'pot-limit',
          lesson: {
            teacher: 'gaz',
            before: [
              say('gaz', 'Six cards each. Same rule: two from your hand, three from the board. Fifteen different pairs you could use.'),
              say('gaz', 'Everyone has a draw. Everyone has a reason to call. Pots get massive. Don’t fall in love with a flush unless it’s the ace-high one.'),
            ],
            streets: {
              3: [say('gaz', 'River. Is your hand the best possible on this board? If not, someone at this table probably has it.')],
            },
          },
        },
      ],
    },
    {
      fromHand: 9,
      label: 'Last round: Hi-Lo',
      structure: { unit: 4 },
      handsPerGame: 2,
      opening: [
        say('gaz', 'Last round, and we split ’em. High-low, eight or better, two hands of five-card, two of six-card, round and round.'),
        say('kerryann', 'I’m off shift in an hour. Let’s go.'),
      ],
      games: [
        {
          game: 'plo5-8',
          betting: 'pot-limit',
          lesson: {
            teacher: 'gaz',
            before: [
              say('gaz', 'Hi-Lo: half the pot to the best high, half to the best low. Low is five different cards eight or under, aces low, two from your hand and three from the board.'),
              say('gaz', 'With five cards in your hand, you’ll often have a shot at both halves. Scoop the lot if you can.'),
            ],
          },
        },
        {
          game: 'plo6-8',
          betting: 'pot-limit',
          lesson: {
            teacher: 'gaz',
            before: [say('gaz', 'Six-card Hi-Lo now. Same split. With six cards, an ace and a deuce in your hand is gold.')],
          },
        },
      ],
    },
  ],
  startingStack: 200,
  levelEvery: 6,
  levelLines: [say('narration', 'The tournament next door finishes, the room gets louder, and the floor manager moves your game up a level.')],
  intro: [
    '2019. A huge, noisy card room on a retail park in the English Midlands: forty tables, a carvery, and every big Omaha game in the region on a Friday night.',
    'Sophie Avery, Anna’s daughter and an Avery like her mother, because in this family the name goes with the deck, has moved to England for work. Jamie gave her the deck the day she left. She plays on Fridays, and keeps it in her coat.',
    'This spring a letter followed her across the ocean. Not a lawyer’s, this time: handwritten, and signed. “My family has asked to buy your deck for ninety years, and I am sorry for most of those letters. I would only like to see it, once. E. Crane.” She has not decided whether to answer.',
    'The regular everyone knows is Gaz Whitlock, who has been in this room since it opened, has seen everything, and will tell you about all of it.',
  ],
  recap: [
    'The Ashcombe deck was painted in Kent in 1543. It left England for America in 1763, and the Averys kept it for two and a half centuries.',
    'In 2005, Jamie Avery beat Nat Crane on television with it, and she shook Jamie’s hand. Now Jamie’s niece Sophie has it and, by chance, the deck is back in England.',
  ],
  history: [
    'Five-card Omaha, “Big O”, spread through American card rooms from about 2008.',
    'Six-card Omaha is found in many UK casinos and card rooms, where big Omaha games are a Friday-night favourite.',
    'Both are played high-low too, with the same eight-or-better rule as Omaha Hi-Lo.',
  ],
  howToWin: [
    'Pot-limit. Until the Hi-Lo round, a player who goes broke can buy back in.',
    'In the last round, broke means out. Be the last one at the table.',
  ],
  rivals: painted([
    rival(
      {
        id: 'kerryann',
        name: 'Kerry-Ann',
        fullName: 'Kerry-Ann Booth',
        role: 'A nurse just off a night shift',
        personality: { level: 'easy', valueAt: 1.3, bluff: 0.15, caution: -0.03, betSize: 0.7, respect: 0.5, reads: 0.3, tilt: 0.08 },
        tell: { text: 'She checks her phone, bored.', signals: 'weak', showsWhenTrue: 0.55, showsWhenFalse: 0.15 },
        lines: lines({
          bet: ['Pot it.', 'Raise.', 'Go on, then.'],
          call: ['Call.', 'Yeah, go on.'],
          fold: ['Nah.', 'Fold.'],
          check: ['Check.'],
          win: ['Get in!', 'Lovely.'],
          beatYou: ['Get in!', 'Sorry, love! Night shift luck.'],
          lostToYou: ['Oh, you’re joking.', 'Lovely hand. Horrible, but lovely.'],
          bust: 'That’s me done. Off to bed. Night all.',
        }),
      },
      'left',
      '#3a5a6a',
    ),
    rival(
      {
        id: 'gaz',
        name: 'Gaz',
        fullName: 'Gaz Whitlock',
        role: 'A regular who has seen everything, twice',
        personality: { level: 'normal', valueAt: 1.35, bluff: 0.14, caution: 0.0, betSize: 0.75, trap: 0.25, respect: 0.6, reads: 0.9 },
        tell: { text: 'He goes quiet. Gaz is never quiet.', signals: 'strong', showsWhenTrue: 0.65, showsWhenFalse: 0.15 },
        lines: lines({
          bet: ['Pot, duck.', 'Raise. Go on.', 'Let’s have a game.'],
          call: ['I’ll have a look.', 'Call.'],
          fold: ['Not with that rubbish.', 'Fold.'],
          check: ['Check.'],
          win: ['Lovely jubbly.', 'Told you. Seen it all.'],
          beatYou: ['Lovely jubbly.', 'Seen it all, duck. Seen that too.'],
          lostToYou: ['Well, I’ve not seen that before.', 'Cheeky. Very cheeky.'],
          bust: 'Well, I’ve seen everything now. Beaten by an American with a deck older than this town.',
        }),
      },
      'across',
      '#4a3a2a',
    ),
    rival(
      {
        id: 'okafor',
        name: 'Mr. Okafor',
        fullName: 'Mr. Emeka Okafor',
        role: 'A retired accountant who plays every Friday',
        personality: { level: 'normal', valueAt: 1.7, bluff: 0.04, caution: 0.07, betSize: 0.6, respect: 0.8, reads: 0.4 },
        tell: { text: 'He stacks his chips in perfect towers.', signals: 'strong', showsWhenTrue: 0.55, showsWhenFalse: 0.15 },
        lines: lines({
          bet: ['I shall bet.', 'Pot, please.'],
          call: ['Call.', 'Very well.'],
          fold: ['I fold.', 'No, thank you.'],
          check: ['Check.'],
          win: ['Splendid.', 'The books balance.'],
          beatYou: ['Splendid.', 'The books balance, I’m afraid.'],
          lostToYou: ['Most unfortunate.', 'A debit, then. Well played.'],
          bust: 'Most unfortunate. Same time next Friday, everyone.',
        }),
      },
      'right',
      '#2a3a2a',
    ),
  ]),
  nemesisId: 'gaz',
  narratorId: 'gaz',
  scene: { music: music('big-o'), title: art('title.webp'), background: art('background.webp'), tableFront: art('table-front.webp'), palette: { wall: '#121418', light: '#f2e6c8', felt: '#1f4a3a', rim: '#2a2a2a' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Gaz Whitlock', line: 'The Big O, 2019. He had seen everything, except you.' },
  story: {
    // What tonight means to you, said at the table as it happens (docs/CHAPTERS.md, "Why you care").
    heart: {
      stakes: [
        say('narration', 'Jamie gave you the deck the day you left. “Don’t lose it to some guy in a parking lot,” Jamie said.'),
        say('gaz', 'Car park, duck. Over here it’s a car park. And it’s round the back.'),
      ],
      losing: [
        say('gaz', 'Don’t worry, duck. Omaha gets everyone in the end.'),
        say('narration', 'You think of the note in the case. If the deck goes tonight, you will have nothing to show E. Crane, ever.'),
      ],
      turning: [
        say('gaz', 'Well. I’ve not seen that before.'),
        say('kerryann', 'Gaz has seen everything, love. You’ve just made history.'),
      ],
    },
    dealer: ['Blinds in, please.', 'Shuffle up.', 'Cards.'],
    moments: [
      {
        beforeHand: 3,
        lines: [
          say('gaz', 'Old deck you’ve got there, duck. Made in Kent, you say? My nan was from Kent.'),
          say('narration', '“Everybody’s nan was from Kent, Gaz,” says the dealer.'),
        ],
      },
      {
        beforeHand: 7,
        lines: [
          say('gaz', 'What’s that you keep reading between hands, duck? A love letter?'),
          say('narration', 'Sophie folds E. Crane’s note back into the case. “It’s from a family that has hated mine for nearly five hundred years,” she says. “It’s the first nice thing any of them ever wrote.”'),
          say('gaz', 'Then write back, duck. Five hundred years is long enough for anybody.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        kerryann: [say('kerryann', 'I’m shattered. Going home while I’m up. Do him, Sophie.'), say('narration', 'Kerry-Ann racks up and heads for the car park.')],
        okafor: [say('okafor', 'I shall stop while the books still balance. Good luck.'), say('narration', 'Mr. Okafor cashes out and takes a seat at the rail.')],
      },
      headsUp: [say('gaz', 'Just you and me, duck. Seen this before. Not sure how it ends, mind.')],
    },
  },
  outro: {
    won: [
      'Gaz pushes his last chips over and shakes his head, grinning. “Two hundred and fifty years in America, and the first time I sit down with it, it cleans me out.”',
      'He buys you a drink at the bar, and tells you about every big hand he has ever seen. It takes a while.',
    ],
    lost: [
      'Your last chip goes to Gaz. “Don’t worry, duck. Omaha gets everyone in the end.”',
      '“Play for the nuts, Sophie,” Mr. Okafor says. “Second-best hands are expensive here.” Try again?',
    ],
  },
};
