/**
 * Bonus chapter, "The Gaming House": Poque at Maison Fontaine, New Orleans,
 * 1817. Unlocks after the Part One finale and answers how Delphine knows the
 * deck. (docs/GAME_OUTLINE.md, "Bonus".) Poque's rules are a reconstruction.
 *
 * Art: the salon, the title painting and the three rivals (cut out from
 * pictures painted on green) are in public/art/gaming-house/.
 */
import { POQUE_ID } from '../games/poque';
import { cutout, lines, music, rival, say } from './cast';
import type { Chapter } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/gaming-house/${file}`;

export const GAMING_HOUSE: Chapter = {
  id: 'gaming-house',
  numeral: 'Bonus',
  part: 1,
  title: 'The Gaming House',
  year: 1817,
  place: 'Maison Fontaine, New Orleans',
  toldBy: 'Delphine’s own tale',
  youAre: 'Young Delphine Arceneaux',
  teaches: 'Poque, the French game that named poker',
  rulesObject: 'The house card',
  dealerMarker: 'none',
  stages: [
    {
      fromHand: 1,
      structure: { unit: 2 },
      games: [
        {
          game: POQUE_ID,
          betting: 'no-limit',
          lesson: {
            teacher: 'henri',
            before: [
              say('henri', 'Your aunt never taught you poque, madame? Then let an old American teach you a French game.'),
              say('henri', 'Thirty-two cards, sevens to aces. Five each, face down. Everyone antes, then one round of wagers.'),
              say('henri', 'Only matched cards count: a pair, then three alike, then four alike. A second pair only settles a tie. The rest is noise.'),
              say('henri', 'There is no limit in this house. You may wager any of the money in front of you.'),
              say('henri', 'And the wagering is the game. You say “je poque”, and you bet as if you hold three aces. Sometimes you do.'),
            ],
            streets: {
              0: [say('henri', 'Your five cards. With only thirty-two in the deck, pairs come often: a pair of aces is good, three alike is very good. Wager like you believe it.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 100,
  levelEvery: 10,
  levelLines: [say('narration', 'Midnight strikes at the cathedral. Aunt Élodie sends for fresh candles and doubles the stakes.')],
  intro: [
    'New Orleans, 1817, two years after the battle that saved the city. Warm night air through the iron balconies of Maison Fontaine, the finest gaming house in the French Quarter.',
    'You are Delphine Arceneaux, nineteen, married a year, niece of the house’s owner, Madame Élodie Fontaine. Tonight you are allowed to sit at the table for the first time.',
    'An American named Henri Avery has lost almost everything to your aunt. Almost: he still has an old painted deck in a leather case, and he has just put it on the table.',
  ],
  recap: [
    'This is the story Delphine Arceneaux never told on the riverboat: the night, nineteen years earlier, she first saw the Ashcombe deck.',
    'The deck had come to America with Will Avery in 1763. By 1817 it belonged to his son Henri, Kit Avery’s grandfather.',
  ],
  history: [
    'Poque was the French form of the German game Pochen, played with a 32-card pack, and French speakers brought it to New Orleans. Players bet, and bragged, on pairs, triplets and fours.',
    'It is the most likely source of the word “poker”: the English-speaking newcomers to New Orleans would have heard “poque” across the table.',
    'Its exact rules were never written down well. This chapter is our reconstruction.',
  ],
  howToWin: [
    'Everyone antes $1 and the smallest wager is $2. You may wager anything up to all the money in front of you.',
    'Your aunt holds the Avery deck. Take her last dollar and it is yours to give back.',
  ],
  rivals: [
    {
      ...rival(
        {
          id: 'henri',
          name: 'Henri',
          fullName: 'Henri Avery',
          role: 'Kit’s grandfather, an American with one thing left to lose',
          personality: { valueAt: 1.5, bluff: 0.08, caution: 0.03, betSize: 0.6, respect: 0.7, reads: 0.5, tilt: 0.1 },
          tell: { text: 'He hums an old tune under his breath.', signals: 'strong', showsWhenTrue: 0.65, showsWhenFalse: 0.12 },
          lines: lines({
            bet: ['Je poque, as they say.', 'A wager, then.'],
            call: ['I’ll see it.', 'Why not.'],
            fold: ['Not this time.', 'Too rich for an American.'],
            check: ['I’ll wait.'],
            win: ['Ah! Luck returns.', 'Merci, merci.'],
            bust: 'Well. That is everything, truly. Good night, mesdames, messieurs.',
          }),
        },
        'left',
        '#3a4a5a',
      ),
      art: cutout(art('henri.webp'), 1.2078, { x: 330, bottom: 560, height: 420 }),
    },
    {
      ...rival(
        {
          id: 'elodie',
          name: 'Madame Élodie',
          fullName: 'Madame Élodie Fontaine',
          role: 'Owner of the house, Delphine’s aunt, who reads everyone',
          personality: { valueAt: 1.45, bluff: 0.12, caution: 0.04, betSize: 0.7, trap: 0.4, respect: 0.6, reads: 1 },
          tell: { text: 'She fans her cards slowly open.', signals: 'strong', showsWhenTrue: 0.55, showsWhenFalse: 0.2 },
          lines: lines({
            bet: ['Je poque.', 'Shall we, chérie?', 'Double, I think.'],
            call: ['I see it.', 'Bien.'],
            fold: ['Non.', 'Take it, child.'],
            check: ['Passe.'],
            win: ['The house thanks you.', 'Patience, chérie. Always patience.'],
            bust: 'My own niece. I taught you too well. Bravo, chérie.',
          }),
        },
        'across',
        '#5a1f3a',
      ),
      art: cutout(art('elodie.webp'), 0.7156, { x: 800, bottom: 560, height: 500 }),
    },
    {
      ...rival(
        {
          id: 'lacroix',
          name: 'Lacroix',
          fullName: 'Captain Jean-Baptiste Lacroix',
          role: 'A privateer spending his prize money fast',
          personality: { valueAt: 1.15, bluff: 0.3, caution: -0.06, betSize: 0.85, respect: 0.25, reads: 0.2, tilt: 0.12 },
          tell: { text: 'He laughs, a little too loudly.', signals: 'bluffing', showsWhenTrue: 0.7, showsWhenFalse: 0.2 },
          lines: lines({
            bet: ['Ha! Je poque! Double!', 'Spanish silver, and plenty of it!', 'Raise, by the Gulf!'],
            call: ['I see you, madame.', 'Call!'],
            fold: ['Bah!', 'A storm. I run for port.'],
            check: ['I wait, for once.'],
            win: ['A prize! Another prize!', 'Ha ha!'],
            bust: 'Out of silver! To sea again, then. There is always another Spanish ship.',
          }),
        },
        'right',
        '#2a4a4a',
      ),
      art: cutout(art('lacroix.webp'), 1.3211, { x: 1270, bottom: 560, height: 440 }),
    },
  ],
  nemesisId: 'elodie',
  narratorId: 'elodie',
  scene: {
    music: music('gaming-house'),
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#1c120f', light: '#f2a65a', felt: '#2a4a3a', rim: '#9a7a3a' },
  },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Madame Élodie Fontaine', line: 'The Gaming House, 1817. She read everyone but her niece.' },
  story: {
    stake: {
      afterPlayerWins: 1,
      orAfterHands: 3,
      lines: [
        say('narration', 'Henri pushes the leather case into the middle. Your aunt calls, and wins it with three queens.'),
        say('elodie', 'A pretty thing. Painted in England, nearly three hundred years ago. It will look well in my cabinet.'),
        say('henri', 'It was my father’s. Will Avery, who won it at Brag on the North Road.'),
        say('narration', 'You look at Henri’s face, and decide. If you win the deck from your aunt, it goes back to him.'),
        say('elodie', 'Ah, chérie, you want it? Then take my last dollar. I fan my cards when I am strong; everyone knows it. But do I always?'),
      ],
      passes: [
        say('narration', 'Your aunt is out of silver. The Avery deck goes to {name}.'),
        say('henri', 'It is still on the table, madame. Please.'),
      ],
    },
    finale: {
      bowOut: {
        henri: [say('henri', 'I have nothing left worth wagering. I will watch, and hope.'), say('narration', 'Henri sits back, hands folded.')],
        lacroix: [say('lacroix', 'Family business! I leave it to the family. Bonne chance, madame!'), say('narration', 'Lacroix scoops his silver into his hat and goes to the balcony.')],
      },
      headsUp: [say('elodie', 'Just us, chérie. Show me what I taught you.')],
    },
  },
  outro: {
    won: [
      'Your aunt laughs, and kisses you on both cheeks. “My own niece!” She slides the leather case across the table.',
      'You put it in Henri Avery’s hands. When he can speak, he tells you all of it: the painter’s daughter, the inn in the snow. You write down every word. Nineteen years later, on a steamboat called the Magnolia Queen, you will see that deck again, in the hands of a man named Silas Crane, and you will know exactly whose it is.',
    ],
    lost: [
      'Your last dollar goes to your aunt. She sets the painted deck in her glass cabinet, beside the Spanish silver.',
      '“Never bet against the house, chérie,” she says, “unless you can read the house.” Henri gives you a sad smile. Try again?',
    ],
  },
};
