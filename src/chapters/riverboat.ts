/**
 * Chapter 1, "The River": straight poker aboard the steamboat Magnolia Queen,
 * between Natchez and New Orleans, 1836. The story opens here
 * (docs/GAME_OUTLINE.md is the design this follows).
 *
 * History in this file was checked against sources; see docs/HISTORY_SOURCES.md.
 */
import type { Chapter } from './types';
import { GAME_ID } from '../games/straightPoker';
import { music } from './cast';

const art = (file: string) => `${import.meta.env.BASE_URL}art/riverboat/${file}`;

export const RIVERBOAT: Chapter = {
  id: 'riverboat',
  numeral: '1',
  part: 1,
  title: 'The River',
  year: 1836,
  place: 'The Magnolia Queen, Mississippi River',
  youAre: 'Kit Avery',
  teaches: 'Straight poker, the first game called poker',
  rulesObject: 'Rules of 1836',
  // One unit of $2: a $1 ante and a $2 minimum bet.
  stages: [{ fromHand: 1, games: [{ game: GAME_ID, betting: 'pot-limit' }], structure: { unit: 2 } }],
  startingStack: 100,
  intro: [
    'Your father lost the family’s old deck at cards, to a gambler named Silas Crane. People called it the Ashcombe deck, and swore that whoever held it never lost.',
    'Tonight, Kit Avery, you have found him: in the card room of the Magnolia Queen, steaming downriver from Natchez to New Orleans. Two other passengers already sit at his green table.',
    'Win back your family’s deck. Be the last player at the table and it goes home with you.',
  ],
  history: [
    'Early players dealt only the twenty high cards: aces down to tens. Four players took five cards each, so the whole deck was in play.',
    'There was one round of betting and no draw. Flushes did not count yet: they came with the full 52-card deck, between about 1830 and 1845. Straights came later still.',
    'By the 1850s, players marked the dealer with a knife, often one with a buckhorn handle: the “buck”. Handing it on is where “passing the buck” comes from.',
  ],
  recap: ['This is where the story begins.'],
  howToWin: [
    'Everyone antes $1; the smallest bet is $2, and no bet may be bigger than the pot.',
    'Take every dollar of whoever holds the Ashcombe deck to win it. Lose all of yours and the deck stays on the boat.',
  ],
  keepsake: { name: '“Gentleman” Silas Crane', line: 'The River, 1836. He dealt seconds; you dealt with him.' },
  rivals: [
    {
      id: 'delphine',
      name: 'Delphine',
      fullName: 'Mrs. Delphine Arceneaux',
      role: 'A Louisiana widow who knows the deck’s story',
      // Tricky: checks strong hands to trap, bluffs rarely.
      personality: { valueAt: 1.6, bluff: 0.07, caution: 0.03, betSize: 0.6, trap: 0.5, respect: 0.6, reads: 0.9 },
      // She fakes it half the time, so the tell is a coin flip.
      tell: { text: 'Her fan snaps shut.', signals: 'strong', showsWhenTrue: 0.4, showsWhenFalse: 0.4 },
      lines: {
        bet: ['I believe I\'ll wager.', 'Let us make it interesting, shall we?'],
        call: ['I\'ll see that.', 'Very well.'],
        fold: ['Not this time, darling.', 'I shall sit this one out.'],
        check: ['I\'ll wait.'],
        win: ['How kind of you all.', 'Patience, gentlemen. Always patience.'],
        bust: 'Well. I do believe I\'ve been outplayed. Good evening.',
      },
      art: { src: art('delphine.webp'), kind: 'cutout', aspect: 722 / 900, place: { x: 365, bottom: 555, height: 505 } },
      plate: { x: 380, y: 540 },
    },
    {
      id: 'silas',
      name: 'Silas',
      fullName: '“Gentleman” Silas Crane',
      role: 'A riverboat card sharp',
      personality: { valueAt: 1.3, bluff: 0.24, caution: -0.02, betSize: 0.75, respect: 0.35, reads: 0.6, tilt: 0.12 },
      // Loose and aggressive. The mustache is about 70% honest: it shows on 70% of his bluffs and 30% of his honest bets.
      tell: { text: 'He’s smoothing his mustache again...', signals: 'bluffing', showsWhenTrue: 0.7, showsWhenFalse: 0.3 },
      lines: {
        bet: ['I\'ll raise you, friend.', 'Let\'s find out how lucky that deck is.', 'A little more for the pot.'],
        call: ['I\'ll keep you honest.', 'Call.'],
        fold: ['Your hand, this time.', 'I\'ll let that one go.'],
        check: ['After you.'],
        win: ['Thank you kindly.', 'The river provides.'],
        bust: 'Well now. Take the deck, friend. You\'ve earned it.',
      },
      art: { src: art('silas.webp'), kind: 'cutout', aspect: 870 / 900, place: { x: 835, bottom: 545, height: 560 } },
      plate: { x: 800, y: 474 },
    },
    {
      id: 'ezra',
      name: 'Ezra',
      fullName: 'Ezra Hollis',
      role: 'A nervous cotton agent from New Orleans',
      // Tight and passive: plays only good hands, calls more than he raises.
      personality: { valueAt: 2.0, bluff: 0.0, caution: 0.1, betSize: 0.4, respect: 0.95, reads: 0.1 },
      // The tutorial tell: about 90% honest. He wipes his brow when his hand is weak.
      tell: { text: 'He wipes his brow.', signals: 'weak', showsWhenTrue: 0.6, showsWhenFalse: 0.07 },
      lines: {
        bet: ['I, ah, I\'ll bet.', 'Is it my turn? Then I bet.'],
        call: ['I suppose I must call.', 'Oh dear. Call.'],
        fold: ['No, no. Fold.', 'Too rich for me.'],
        check: ['Check. Yes. Check.'],
        win: ['Oh! Oh my.', 'I, well, thank you.'],
        bust: 'My employer will hear of this. Good night.',
      },
      art: { src: art('ezra.webp'), kind: 'cutout', aspect: 796 / 900, place: { x: 1245, bottom: 555, height: 490 } },
      plate: { x: 1220, y: 540 },
    },
  ],
  nemesisId: 'silas',
  narratorId: 'delphine',
  scene: {
    music: music('riverboat'),
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#1d1410', light: '#f2b45a', felt: '#2f5a3a', rim: '#8a6a2a' },
  },
  playerPlate: { x: 800, y: 760 },
  story: {
    tutorial: {
      before: [
        { who: 'delphine', text: 'Sit, darling, sit. You know the twenty-card game? Aces down to tens, four of each. Four of us, five cards apiece: every card is dealt.' },
        { who: 'delphine', text: 'Best hands first: four of a kind, a full house, three of a kind, two pairs, one pair. Straights and flushes don’t count here.' },
        { who: 'delphine', text: 'And since every card is out, your own five tell you what the rest of us cannot hold. One round of betting, then we show.' },
        { who: 'delphine', text: 'Above all, watch faces. The cards only tell you half of it.' },
      ],
      // Deal order is left of the buck (Delphine): Silas, Ezra, you, Delphine.
      hands: {
        you: ['Ks', 'Kh', 'Qc', 'Qd', 'As'],
        silas: ['Js', 'Jh', 'Ah', 'Tc', 'Qs'],
        ezra: ['Ad', 'Kc', 'Qh', 'Td', 'Jc'],
        delphine: ['Ts', 'Th', 'Ac', 'Kd', 'Jd'],
      },
      tellOf: 'ezra',
      afterTell: [
        { who: 'delphine', text: 'Do you see Mr. Hollis mopping his brow? He does that when his cards are poor. Nine times in ten, I’d say.' },
        { who: 'ezra', text: 'It is very warm in here. That is all.' },
      ],
    },
    stake: {
      afterPlayerWins: 2,
      orAfterHands: 5,
      lines: [
        { who: 'silas', text: 'You play like your father, friend. He sat right where you’re sitting.' },
        { who: 'narration', text: 'Silas sets a worn leather case on the felt beside his money.' },
        { who: 'silas', text: 'The Ashcombe deck. Take my last dollar and it goes home with you.' },
        { who: 'delphine', text: 'Mind his hands when he deals, darling. Not his face. His hands.' },
      ],
      passes: [
        { who: 'narration', text: 'Silas is broke. The leather case slides across the felt to {name}.' },
        { who: 'delphine', text: 'The deck is still at this table, darling. Win it from whoever holds it.' },
      ],
    },
    cheat: {
      hand: ['As', 'Ah', 'Ad', 'Ac', 'Kh'],
      chance: 0.5,
      latestDeal: 3,
      tell: 'His thumb lingers on the top card as he deals...',
      decoy: 'He shuffles with a showman’s flourish.',
      decoyChance: 0.5,
      caught: [
        { who: 'delphine', text: 'Mr. Crane. That card came from second in the deck, and we both saw it.' },
        { who: 'silas', text: 'A slip of the thumb, madam. Nothing more.' },
        { who: 'narration', text: 'The hand is called off and the antes go back. Silas gathers the cards and deals again, slowly.' },
        { who: 'silas', text: 'Straight as the river, friend. From here on.' },
      ],
      wrong: [
        { who: 'silas', text: 'Calling me a cheat, friend? On an honest deal? That’ll cost you five dollars for my trouble.' },
        { who: 'delphine', text: 'Not that one, darling. Watch the thumb, not the flourish.' },
      ],
      fine: 5,
      missed: [
        { who: 'delphine', text: 'Did you see his thumb on that deal? He was dealing seconds, darling: four aces don’t come from a fair deck.' },
        { who: 'silas', text: 'Luck of the river, madam.' },
        { who: 'delphine', text: 'He won’t risk it twice with me watching. Now win it back honestly.' },
      ],
    },
    finale: {
      bowOut: {
        delphine: [
          { who: 'delphine', text: 'I believe I’ll keep what I have and watch. This is between you and Mr. Crane now.' },
          { who: 'narration', text: 'Delphine gathers her money and turns her chair to face the table.' },
        ],
        ezra: [
          { who: 'ezra', text: 'I, ah. I believe I shall retire while my employer still has some money left. Good luck to you both. Mostly to you.' },
          { who: 'narration', text: 'Ezra stuffs his money into his hat and backs away from the table.' },
        ],
      },
      headsUp: [
        { who: 'silas', text: 'Just you and me, friend. For the deck.' },
      ],
    },
    exits: {
      ezra: [
        { who: 'narration', text: 'Ezra knocks over his chair, rights it, apologizes to it, and leaves.' },
        { who: 'delphine', text: 'Poor man. He’ll be writing letters about tonight all the way to New Orleans.' },
      ],
    },
  },
  outro: {
    won: [
      'The last of the money is in front of you. Silas Crane tips his hat and slides a worn leather case across the felt.',
      'Inside the lid, in faded ink: “M.A. 1543”. Delphine leans closer. “That deck is older than this river’s name, darling. Let me tell you where it has been.”',
      'She opens her fan. “It begins three hundred years ago, in an English hall, with a painter’s daughter named Avery…”',
    ],
    lost: [
      'Your last dollar crosses the table. Silas Crane pockets the leather case with a smile.',
      '“Never chase a man who is smoothing his mustache,” Delphine murmurs. The Magnolia Queen has a long way still to go. Sit down again?',
    ],
  },
};
