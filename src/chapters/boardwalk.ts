/**
 * Chapter 9, "The Boardwalk": Seven Card Stud Hi-Lo in an Atlantic City
 * casino poker room, 1995. The Arceneaux and Avery families meet again. All
 * people and places are fictional.
 *
 * Art: the poker room (blue oval table, neon trim, the pier at the window),
 * its title painting (the boardwalk at dusk) and all three rivals are painted
 * (docs/ART.md).
 */
import { cutout, lines, music, rival, say } from './cast';
import type { Chapter, Character, CharacterArt } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/boardwalk/${file}`;

/** The painted rivals, by id: image, width / height, and place on the 1600 x 900 stage. */
const PAINTED: Record<string, CharacterArt> = {
  benny: cutout(art('benny.webp'), 1.0389, { x: 340, bottom: 600, height: 450 }),
  margot: cutout(art('margot.webp'), 0.8044, { x: 800, bottom: 560, height: 440 }),
  ruth: cutout(art('ruth.webp'), 0.86, { x: 1265, bottom: 600, height: 450 }),
};
const paint = (r: Character): Character => ({ ...r, art: PAINTED[r.id] ?? r.art });
const painted = ([a, b, c]: Chapter['rivals']): Chapter['rivals'] => [paint(a), paint(b), paint(c)];

export const BOARDWALK: Chapter = {
  id: 'boardwalk',
  numeral: '9',
  part: 2,
  title: 'The Boardwalk',
  year: 1995,
  place: 'A casino poker room, Atlantic City',
  youAre: 'Ray Avery',
  teaches: 'Seven Card Stud Hi-Lo (8 or better)',
  rulesObject: 'The house rules card',
  dealerMarker: 'button',
  houseDeals: true,
  stages: [
    {
      fromHand: 1,
      structure: { unit: 10 },
      games: [
        {
          game: 'stud8',
          betting: 'fixed-limit',
          lesson: {
            teacher: 'margot',
            before: [
              say('margot', 'You play stud, Mr. Avery? Good. Tonight we play it high-low, eight or better. Stud Hi-Lo. Same deal, same betting.'),
              say('margot', 'At the end, the pot is cut in two. Half goes to the best high hand, as usual. Half goes to the best low hand.'),
              say('margot', 'A low needs five different cards, eight or lower. Aces count low. Straights and flushes don’t spoil it. Five-four-three-two-ace is the best low, and a straight for the high half too.'),
              say('margot', 'If nobody makes a low, the high hand takes it all. The dream is to win both halves: we call that a scoop.'),
            ],
            streets: {
              0: [say('margot', 'Three cards. Three small cards, all different, start a low. A big pair starts a high. Three small cards to a straight or flush can go both ways: those are the best.')],
              2: [say('margot', 'Fifth street, bets double. If you’re going for half the pot, make sure it’s a half you can win.')],
              4: [say('margot', 'Seventh street. The label shows your high hand and your low, if you have one. Each half can use different cards.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 400,
  levelEvery: 9,
  levelLines: [say('narration', 'The dealers change shifts. The floor man moves the game up to bigger limits.')],
  intro: [
    'Atlantic City, 1995. Poker has been legal in the casinos here for only two years, and the poker room of the Seaview Palace is full every night with players from New York and Philadelphia. The game is stud.',
    'Ray Avery, Lou’s son, has the old deck in his jacket, back from Paris with his daughter Anna. He came because of a letter from the room’s manager, a woman named Margot Arceneaux.',
    '“An old diary in my family says our families shared a deck once,” she wrote. “I’d like to see it. And I’d like to play you for it.”',
  ],
  recap: [
    'The Ashcombe deck has been in the Avery family since 1543. In 1836 Kit Avery won it back on a steamboat, with help from a widow named Delphine Arceneaux, who knew its whole story.',
    'In 1972 Lou Avery won a Las Vegas Hold’em tournament with it in his pocket. In 1992 his granddaughter Anna took it to a Paris card club and brought it home. Now Lou’s son Ray has it.',
  ],
  history: [
    'Seven-card stud was the main poker game in the casinos of the eastern United States before Hold’em took over.',
    'Casinos opened in Atlantic City in 1978, but poker was banned there until June 1993. For the next ten years, stud ruled its new poker rooms.',
    'When the “eight or better” rule for split pots first appeared is not recorded.',
  ],
  howToWin: [
    'Limit betting: ten on the early streets, twenty later.',
    'Once Margot stakes Delphine’s diary, take her last chip to win it. Or be the last one at the table.',
  ],
  rivals: painted([
    rival(
      {
        id: 'benny',
        name: 'Benny',
        fullName: 'Benny “the Book” Russo',
        role: 'A regular who has been in every game since the room opened',
        personality: { valueAt: 1.3, bluff: 0.14, caution: -0.04, betSize: 0.6, respect: 0.5, reads: 0.6 },
        tell: { text: 'He shuffles his chips, faster and faster.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['Bet, bet.', 'Raise it up.', 'C’mon, let’s play.'],
          call: ['I gotta see.', 'Call.'],
          fold: ['Fuhgeddaboudit.', 'Fold.'],
          check: ['Check.'],
          win: ['Ayyy!', 'That’s what I’m talkin’ about.'],
          bust: 'I’m tapped. Hey, Margot, I’m good for a marker? No? Okay.',
        }),
      },
      'left',
      '#3a3a4a',
    ),
    rival(
      {
        id: 'margot',
        name: 'Margot',
        fullName: 'Margot Arceneaux',
        role: 'Poker room manager, Delphine’s descendant',
        personality: { valueAt: 1.45, bluff: 0.1, caution: 0.04, betSize: 0.7, trap: 0.3, respect: 0.6, reads: 0.9 },
        tell: { text: 'She twists a pearl earring.', signals: 'strong', showsWhenTrue: 0.55, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['Bet.', 'Let’s make it interesting, Mr. Avery.', 'Raise.'],
          call: ['I’ll see that.', 'Call.'],
          fold: ['Not this one.', 'I’ll sit this one out.'],
          check: ['Check.'],
          win: ['How kind.', 'Patience. It runs in the family.'],
          bust: 'Well. Delphine wrote that the Averys were hard to beat. She was right.',
        }),
      },
      'across',
      '#4a2a3a',
    ),
    rival(
      {
        id: 'ruth',
        name: 'Ruth',
        fullName: 'Ruth Goldfarb',
        role: 'A retired schoolteacher who only plays good hands',
        personality: { valueAt: 1.9, bluff: 0.0, caution: 0.1, betSize: 0.5, respect: 0.95, reads: 0.2 },
        tell: { text: 'She adjusts her reading glasses.', signals: 'weak', showsWhenTrue: 0.6, showsWhenFalse: 0.08 },
        lines: lines({
          bet: ['I’ll bet, dear.', 'A raise, I think.'],
          call: ['I’ll call.', 'All right.'],
          fold: ['Not for me.', 'I fold, dear.'],
          check: ['Check, please.'],
          win: ['Oh, how nice.', 'Gold star for me.'],
          bust: 'That was my bus money! Never mind, I’ll call my son.',
        }),
      },
      'right',
      '#5a4a3a',
    ),
  ]),
  nemesisId: 'margot',
  narratorId: 'margot',
  scene: {
    music: music('boardwalk'),
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#151218', light: '#f2d39a', felt: '#2a3a5a', rim: '#3a2a20' },
  },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Margot Arceneaux', line: 'The Boardwalk, 1995. Two families, one deck, half a pot each.' },
  story: {
    stake: {
      afterPlayerWins: 2,
      orAfterHands: 6,
      lines: [
        say('margot', 'You’re good, Mr. Avery. Let me show you something.'),
        say('narration', 'Margot sets a small leather book on the felt, its pages brown with age. On the first page: “Delphine Arceneaux, her diary, 1817.”'),
        say('margot', 'Everything she knew about your deck is in here. The gaming house, the steamboat, all of it. Take my last chip and it’s yours.'),
      ],
      passes: [
        say('narration', 'Margot is out of chips. The diary goes to {name}.'),
        say('margot', 'Well, Mr. Avery? Go and get it.'),
      ],
    },
    finale: {
      bowOut: {
        benny: [say('benny', 'Family business, huh? I know when to walk away. Sometimes.'), say('narration', 'Benny racks his chips and goes to watch from the rail.')],
        ruth: [say('ruth', 'I’ll stop while I still have bus money. Good luck, both of you.'), say('narration', 'Ruth cashes out and pulls up a chair behind the rail.')],
      },
      headsUp: [say('margot', 'Just us, Mr. Avery. Like our families, a hundred and fifty years ago.')],
    },
  },
  outro: {
    won: [
      'Margot slides the diary across the felt, and smiles. “Read it. Then bring the deck back sometime, and let me hold it.”',
      'Ray reads Delphine’s diary on the bus home. On the last page, in her old hand: “The Averys keep the deck. The deck keeps the Averys.”',
    ],
    lost: [
      'Your last chip is gone. Margot holds the old deck up to the light for a long moment, then sets it beside the diary.',
      '“Go for both halves when you can, and fold when you’re fighting for a half you’ll have to share,” Ruth says kindly. Try again?',
    ],
  },
};
