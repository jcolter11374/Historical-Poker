/**
 * Chapter 3, "The North Road": three-card Brag at the Pewter Lamb, a
 * snowbound coaching inn on the Great North Road, 1763. The second
 * flashback: how the deck crossed to America. (docs/GAME_OUTLINE.md, Chapter 3.)
 *
 * Art: the taproom, the title painting and the three rivals (cut out from
 * green) are painted (docs/ART.md).
 */
import { BRAG_ID } from '../games/brag';
import { cutout, lines, music, rival, say } from './cast';
import type { Chapter } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/north-road/${file}`;

export const NORTH_ROAD: Chapter = {
  id: 'north-road',
  numeral: '3',
  part: 1,
  title: 'The North Road',
  year: 1763,
  place: 'The Pewter Lamb, Great North Road, England',
  toldBy: 'Delphine’s tale',
  youAre: 'Will Avery, guard on the York stagecoach',
  teaches: 'Brag, the bluffing game of English inns',
  rulesObject: 'The tavern slate',
  dealerMarker: 'none',
  money: { suffix: 's' },
  stages: [
    {
      fromHand: 1,
      structure: { unit: 2 },
      games: [
        {
          game: BRAG_ID,
          betting: 'no-limit',
          lesson: {
            teacher: 'hannah',
            before: [
              say('hannah', 'Brag, is it? It’s the only game in this house, love. Simple as bread: three cards each, one round of wagering, best hand wins.'),
              say('hannah', 'Three of a kind is a pair royal, and that’s the top of it: three aces best of all. Then a pair. Then just your highest card. Nothing else counts, so don’t go showing me three hearts.'),
              say('hannah', 'Two cards are braggers: the knave of clubs and the nine of diamonds. A bragger is any card you want it to be. But a true pair beats the same pair made with a bragger.'),
              say('hannah', 'You may pass, or you may brag: put up what you like of the coin in front of you, and the others must match it or give up.'),
              say('hannah', 'And it’s called brag for a reason. Half these men wager like they hold a pair royal when they hold a pair of fours. Watch them, not your cards.'),
            ],
            streets: {
              0: [say('hannah', 'There’s your three. A pair is a fair hand at this table, and a high pair or a bragger is a strong one. Ace-high and nothing else? Let it go, unless you’re sure they’re bragging.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 100,
  levelEvery: 10,
  levelLines: [say('narration', 'The snow piles against the windows. Hannah stokes the fire, and Captain Pike calls for higher stakes.')],
  intro: [
    '“Now come forward two hundred years,” Delphine says, as the Magnolia Queen steams on. January 1763. Snow has closed the Great North Road, and the York coach is stuck at the Pewter Lamb until it thaws.',
    'The Ashcombe deck has passed down the Avery family for two hundred years. Now it rides in your coat: you, Will Avery, guard of the York coach and of the strongbox in its boot.',
    'A retired sea captain has heard of the lucky deck. He wants it for his voyage to the colonies. And the well-dressed stranger by the fire has asked about the strongbox twice.',
  ],
  recap: [
    'In 1836, Kit Avery won back the family’s old hand-painted deck from a riverboat gambler. Delphine Arceneaux is telling its story.',
    'In 1543, Nan Avery won it at Primero from Lady Margery Ashcombe, who paid for it, gave it back with “M.A. 1543” written in its case, and started a legend: whoever holds it never loses.',
  ],
  history: [
    'Brag grew out of post and pair, a game recorded in the 1500s. English card books described it from 1721, with a wild card called a “bragger”: the jack of clubs, later joined by the nine of diamonds.',
    'In the 1700s only pairs and pairs royal counted. The runs, flushes and blind betting of today’s three-card brag came later.',
    'Bluffing, and bragging about a hand you may not hold, are ideas poker kept. Three-card brag is still played in Britain today.',
  ],
  howToWin: [
    'Everyone antes 1s and the smallest brag is 2s. You may brag anything up to all the money in front of you.',
    'Once Captain Pike stakes his ship’s passage, take his last shilling and you sail with him for free.',
  ],
  rivals: [
    {
      ...rival(
        {
          id: 'hannah',
          name: 'Hannah',
          fullName: 'Hannah Pell',
          role: 'Keeper of the Pewter Lamb',
          personality: { valueAt: 1.7, bluff: 0.04, caution: 0.06, betSize: 0.7, respect: 0.8, reads: 0.4 },
          tell: { text: 'She polishes a tankard, slowly.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.15 },
          lines: lines({
            bet: ['I’ll put some in.', 'Wager.', 'Raise, and I’ll not apologise.'],
            call: ['I’ll stay.', 'Go on, then.'],
            fold: ['Not worth my bread.', 'I’m out.'],
            check: ['I’ll wait.'],
            win: ['House always wins, love.', 'That’ll pay for the firewood.'],
            bust: 'Well. That’s the takings gone. Back to the kitchen with me.',
          }),
        },
        'left',
        '#5a3b22',
      ),
      art: cutout(art('hannah.webp'), 1.0911, { x: 320, bottom: 560, height: 450 }),
    },
    {
      ...rival(
        {
          id: 'pike',
          name: 'Captain Pike',
          fullName: 'Captain Josiah Pike',
          role: 'A retired sea captain bound for the colonies',
          personality: { valueAt: 1.15, bluff: 0.32, caution: -0.04, betSize: 0.85, respect: 0.3, reads: 0.2, tilt: 0.1 },
          // The louder his boast, the weaker his hand: shows on 75% of his bluffs, 25% of his honest bets.
          tell: { text: 'He boasts, loudly, about the hand he holds.', signals: 'bluffing', showsWhenTrue: 0.75, showsWhenFalse: 0.25 },
          lines: lines({
            bet: ['A pair royal, lad, I’d wager my ship on it!', 'Raise! I’ve sailed through worse storms than you.', 'More! The sea favours the bold.'],
            call: ['I’ll see you, landlubber.', 'Aye.'],
            fold: ['Strike the colours. Fold.', 'Not worth the powder.'],
            check: ['Steady as she goes.'],
            win: ['Ha! Into the hold with it!', 'Fair winds and full pockets.'],
            bust: 'Sunk. Holed below the waterline. I’ll pay my debts, lad; a captain’s word is good.',
          }),
        },
        'across',
        '#1f3550',
      ),
      art: cutout(art('pike.webp'), 1.4144, { x: 800, bottom: 510, height: 400 }),
    },
    {
      ...rival(
        {
          id: 'sorrel',
          name: 'Mr. Sorrel',
          fullName: 'Mr. Jack Sorrel',
          role: 'A well-dressed gentleman. Too well dressed',
          personality: { valueAt: 1.35, bluff: 0.18, caution: 0.0, betSize: 0.65, trap: 0.35, respect: 0.5, reads: 0.9 },
          tell: { text: 'His hand drifts to his coat pocket.', signals: 'weak', showsWhenTrue: 0.55, showsWhenFalse: 0.12 },
          lines: lines({
            bet: ['I believe I shall wager.', 'Shall we make it interesting?'],
            call: ['Delighted.', 'I’ll come along.'],
            fold: ['Another time.', 'Your hand, sir.'],
            check: ['After you, I insist.'],
            win: ['Too kind.', 'Most generous.'],
            bust: 'Robbed! And by a coach guard, of all people. There’s a joke in that somewhere.',
          }),
        },
        'right',
        '#2b4a3a',
      ),
      art: cutout(art('sorrel.webp'), 1.1433, { x: 1290, bottom: 560, height: 450 }),
    },
  ],
  nemesisId: 'pike',
  narratorId: 'hannah',
  scene: {
    music: music('north-road'),
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#151719', light: '#f0a24a', felt: '#3d3226', rim: '#8a8f94' },
  },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Captain Josiah Pike', line: 'The North Road, 1763. He bragged; you called.' },
  story: {
    stake: {
      afterPlayerWins: 2,
      orAfterHands: 5,
      lines: [
        say('pike', 'You’ve a lucky deck in that coat, lad. I can smell it. A ship’s captain knows luck.'),
        say('narration', 'Captain Pike slaps a folded paper on the table: a berth on the brig Constance, sailing from Bristol to Philadelphia in March.'),
        say('pike', 'Passage to the colonies, cabin and board. Take my last shilling and it’s yours. Lose, and that deck sails with me.'),
        say('hannah', 'He shouts loudest when he’s got least, love. Remember that.'),
      ],
      passes: [
        say('narration', 'Captain Pike is out of silver. His berth on the Constance goes to {name}.'),
        say('hannah', 'The passage is still at this table. Win it back.'),
      ],
    },
    moments: [
      {
        beforeHand: 5,
        lines: [
          say('narration', 'A gust blows the door open. As Mr. Sorrel reaches to steady his cards, his coat falls open: a pistol, and a black silk mask.'),
          say('hannah', 'Well, well. Gentleman Jack of the North Road, at my table. There’s a reward for you in York.'),
          say('sorrel', 'There is no road tonight, madam, and no constable. I suggest we all simply keep playing. I find honest money is still money.'),
          say('hannah', 'Then you play with your hands on the table, sir. Both of them.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        hannah: [say('hannah', 'I’ve more sense than to sit between those two. I’ll pour, and watch.'), say('narration', 'Hannah gathers her coins and goes back behind the bar.')],
        sorrel: [say('sorrel', 'I believe I shall retire before the constable thaws out. My compliments, Mr. Avery.'), say('narration', 'Mr. Sorrel sweeps his winnings into his hat and is gone into the snow.')],
      },
      headsUp: [say('pike', 'Just you and me, lad. Your deck against my ship.')],
    },
    exits: {
      sorrel: [say('narration', 'Mr. Sorrel bows, steps out into the snow, and is never seen on the North Road again.')],
    },
  },
  outro: {
    won: [
      'Captain Pike roars with laughter and claps you on the back. “A captain’s word is good, lad. The Constance sails in March, and you’re on her.”',
      'In the spring of 1763, Will Avery and the Ashcombe deck cross the Atlantic. The Averys will be Americans now.',
      'Delphine closes her fan. “And that is how an English deck came to an American river, darling. I held it once myself, at nineteen, in my aunt’s house in New Orleans, and put it back in your grandfather’s hands. He told me all of this.”',
      '“So when I heard that Silas Crane was showing a painted deck on the river, I bought passage. Where it goes next is up to the Averys.”',
    ],
    lost: [
      'Your last shilling goes to the captain. He tucks the deck into his sea chest with a wink.',
      '“He boasts when he’s weak, love. Call him,” Hannah says, pouring you a small beer. “The road’s still closed. Sit down again.”',
    ],
  },
};
