/**
 * Chapter 5, "The Last Hand": five-card draw at the Lucky Nugget saloon,
 * Deadwood, August 1876. The finale of Part One: the Crane feud ends.
 * (docs/GAME_OUTLINE.md, Chapter 5.)
 */
import { DRAW5_ID } from '../games/fiveCardDraw';
import { lines, rival, say } from './cast';
import type { Chapter } from './types';

export const LAST_HAND: Chapter = {
  id: 'last-hand',
  numeral: '5',
  part: 1,
  title: 'The Last Hand',
  year: 1876,
  place: 'The Lucky Nugget saloon, Deadwood, Dakota Territory',
  youAre: 'Clara Avery, Kit’s granddaughter',
  teaches: 'Five-card draw, the great American game',
  rulesObject: 'House rules on the wall',
  stages: [
    {
      fromHand: 1,
      structure: { unit: 4 },
      games: [
        {
          game: DRAW5_ID,
          betting: 'pot-limit',
          lesson: {
            teacher: 'ruby',
            before: [
              say('ruby', 'House rules, honey, so nobody gets shot over a misunderstanding. We play draw. Everybody antes, everybody gets five cards, face down.'),
              say('ruby', 'One round of betting. Then the draw: throw away up to three cards and I deal you new ones. Four, if the card you keep is an ace.'),
              say('ruby', 'Then we bet again, and the best hand takes it. Straights and flushes count, same as anywhere civilized.'),
              say('ruby', 'And watch how many cards a man draws. A man who takes one card is chasing a straight or a flush. A man who takes none is either very good or very brave.'),
            ],
            streets: {
              0: [say('ruby', 'Look at your five. A pair of jacks or better is worth a bet. Less than that, you’re hoping the draw saves you.')],
              1: [say('ruby', 'Time to draw. Click the cards you want to throw away, then draw. Keep your pairs, throw the rest. Four to a flush? Throw the odd one.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 120,
  levelEvery: 10,
  levelLines: [say('narration', 'The lamps are lit. The piano player switches to something faster, and Ruby raises the ante.')],
  intro: [
    'Deadwood, Dakota Territory, August 1876. A gold town only a few months old: plank walls, mud streets, and money everywhere.',
    'Clara Avery, Kit’s granddaughter, has come west with the family deck. So has Jasper Crane, grandson of the gambler Kit beat on the river. He says it is the Crane deck, stolen from his family, and he means to take it back.',
    'Ruby Calloway, who owns the Lucky Nugget and is said to be the best player in the territory, will host the game that settles it. “Last one with money at my table keeps the deck,” she says. “And nobody draws a gun.”',
  ],
  recap: [
    'The Ashcombe deck was painted in 1543, crossed to America in 1763, and passed down the Avery family.',
    'In 1836, Kit Avery won it back from “Gentleman” Silas Crane, catching him dealing seconds. In 1863, Kit’s son Sam carried it through the Civil War.',
  ],
  history: [
    'Draw poker was first described in print in 1850. By 1875 The American Hoyle listed draw, stud and “jackpots”, and poker was played in saloons from San Francisco to New York.',
    'On August 2, 1876, Wild Bill Hickok was shot dead at a poker table in Deadwood’s Saloon No. 10. The hand he is said to have held, aces and eights, is still called the dead man’s hand, though the story was first told in the 1920s.',
    '“Jackpots”, where you need a pair of jacks or better to open the betting, were new: they first appear in print in 1875.',
  ],
  howToWin: [
    'Everyone antes $2; the smallest bet is $4, and no bet may be larger than the pot.',
    'Be the last one at Ruby’s table with money, and the feud is settled.',
  ],
  rivals: [
    rival(
      {
        id: 'doc',
        name: 'Doc',
        fullName: '“Doc” Abel Whitcomb',
        role: 'A prospector who has never been a doctor',
        personality: { valueAt: 1.4, bluff: 0.12, caution: -0.08, betSize: 0.5, respect: 0.4, reads: 0.3 },
        tell: { text: 'He shakes his pouch of gold dust.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['A pinch of dust says I’m good.', 'Bet! Feelin’ lucky.', 'Raise, on a hunch.'],
          call: ['I’ll ride along.', 'Call, I s’pose.'],
          fold: ['Nope.', 'That’s a dry claim.'],
          check: ['Check.'],
          win: ['Hee hee! Pay dirt!', 'Knew it in my knees.'],
          bust: 'Dry as my last claim. Did I ever tell you about the time I found a nugget big as a horse?',
          draw: ['Three, and make ’em pretty.', 'Gimme two.', 'One. Just one.'],
          pat: ['I’ll play these, thank you kindly.'],
        }),
      },
      'left',
      '#6b4a2b',
    ),
    rival(
      {
        id: 'ruby',
        name: 'Ruby',
        fullName: 'Ruby Calloway',
        role: 'Owner of the Lucky Nugget, best player in the territory',
        // Balanced and hard to read: value bets, traps, bluffs at the right times.
        personality: { valueAt: 1.4, bluff: 0.14, caution: 0.03, betSize: 0.7, trap: 0.3, respect: 0.6, reads: 1 },
        // No reliable tell: she reads yours instead.
        tell: { text: 'She smiles at you. It tells you nothing.', signals: 'strong', showsWhenTrue: 0.3, showsWhenFalse: 0.3 },
        lines: lines({
          bet: ['Bet, honey.', 'Let’s see if you mean it.', 'Raise.'],
          call: ['I’ll call.', 'Sure.'],
          fold: ['Yours.', 'Go on, take it.'],
          check: ['Check.'],
          win: ['House thanks you.', 'That’s why I own the place.'],
          bust: 'Well, I’ll be. Nobody’s done that to me in this territory. Drinks are on the house.',
          draw: ['Two for me.', 'One.', 'Three.'],
          pat: ['I’m good.'],
        }),
      },
      'across',
      '#6a1d2b',
    ),
    rival(
      {
        id: 'jasper',
        name: 'Jasper',
        fullName: 'Jasper Crane',
        role: 'Silas Crane’s grandson, come for “the Crane deck”',
        personality: { valueAt: 1.3, bluff: 0.25, caution: -0.02, betSize: 0.8, respect: 0.35, reads: 0.4, tilt: 0.15 },
        // The same mustache stroke as his grandfather, a callback to chapter 1.
        tell: { text: 'He smooths his mustache, just like his grandfather.', signals: 'bluffing', showsWhenTrue: 0.7, showsWhenFalse: 0.3 },
        lines: lines({
          bet: ['Raise, Miss Avery. Family tradition.', 'A little more for the pot.', 'Let’s find out how lucky my deck is.'],
          call: ['I’ll keep you honest.', 'Call.'],
          fold: ['Your hand, this time.', 'I’ll let that one go.'],
          check: ['After you.'],
          win: ['The Cranes thank you.', 'The deck knows its family.'],
          bust: 'Again. A Crane, beaten by an Avery, again. Grandfather said you people were lucky.',
          draw: ['One card.', 'Two.'],
          pat: ['I’ll stand.'],
        }),
      },
      'right',
      '#2a2a2a',
    ),
  ],
  nemesisId: 'ruby',
  narratorId: 'ruby',
  scene: { palette: { wall: '#21170f', light: '#f0b75e', felt: '#3b4a2a', rim: '#5b3b20' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Ruby Calloway', line: 'The Last Hand, 1876. The best in the territory, until you.' },
  story: {
    cheat: {
      by: 'jasper',
      afterHand: 4,
      hand: ['Ks', 'Kh', 'Kd', 'Kc', 'Ad'],
      chance: 0.5,
      latestDeal: 3,
      tell: 'His thumb lingers on the top card as he deals…',
      decoy: 'He riffles the cards with a gambler’s flourish.',
      decoyChance: 0.5,
      caught: [
        say('narration', 'You put your hand flat on the table. “That card came from second in the deck, Mr. Crane. My grandfather told me how your grandfather did it.”'),
        say('ruby', 'Did it now. Jasper, honey, you’ll deal those again. Slowly. And if I see that thumb move, you’ll deal the next hand to the undertaker.'),
        say('jasper', 'A slip of the thumb. It runs in the family.'),
        say('narration', 'The hand is called off and the antes go back.'),
      ],
      wrong: [
        say('jasper', 'Calling a Crane a cheat on an honest deal? That’s five dollars, Miss Avery, for my good name.'),
        say('ruby', 'He’s right, honey. House rules: you pay for a false accusation. Watch the thumb, not the flourish.'),
      ],
      fine: 5,
      missed: [
        say('ruby', 'Four kings on his own deal. That boy dealt himself seconds, honey, right under my nose. And yours.'),
        say('jasper', 'Luck of the Cranes.'),
        say('ruby', 'He won’t try it twice at my table. Now go win it back.'),
      ],
    },
    moments: [
      {
        beforeHand: 2,
        lines: [
          say('narration', 'Outside, two miners walk by, still arguing about the shooting at Saloon No. 10 a few weeks back. Aces and eights, one of them says. The dead man’s hand.'),
          say('doc', 'I was there, y’know. Well. Near there. Well, in town.'),
        ],
      },
      {
        beforeHand: 3,
        lines: [say('ruby', 'Mind Jasper when he deals, honey. I’ve heard about his grandfather. I hear things.')],
      },
    ],
    finale: {
      bowOut: {
        doc: [say('doc', 'I’m gonna quit while I got dust in the pouch. Go get ’em, Miss Clara.'), say('narration', 'Doc ties his pouch shut and leans on the bar to watch.')],
      },
      headsUp: [say('ruby', 'Well, honey. Seems the real game was always between you and me.')],
    },
    exits: {
      doc: [say('narration', 'Doc tips his hat, misses the door, and finds it on the second try.')],
      jasper: [say('ruby', 'Off you go, Jasper. Tell your family the Averys keep their deck.')],
    },
  },
  outro: {
    won: [
      'Ruby Calloway pushes her last coins across the table and raises a glass. “To the Avery deck. And to the only player who ever beat me fair.”',
      'Jasper Crane is on the morning stage out of Deadwood. The feud is over. For now.',
      'Clara opens the leather case. Inside, beside “M.A. 1543”, she adds a line in pencil: “The Ashcombe Deck, 1543 to 1876. Still ours.”',
    ],
    lost: [
      'Your last dollar is gone. Ruby holds the old deck up to the lamplight, and sets it aside for whoever wins the next game.',
      '“Watch the draws, honey,” she says. “A one-card draw is a man hoping. Bet him out of it.” Sit down again?',
    ],
  },
};
