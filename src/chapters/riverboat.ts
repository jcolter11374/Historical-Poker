/**
 * Chapter 1, "The River": straight poker aboard the steamboat Magnolia Queen,
 * between Natchez and New Orleans, 1836. The story opens here
 * (docs/GAME_OUTLINE.md is the design this follows).
 *
 * History in this file is written from general knowledge and is marked for a
 * fact check in docs/GAME_DESIGN.md before release.
 */
import type { Chapter } from './types';
import { GAME_ID } from '../games/straightPoker';

const art = (file: string) => `${import.meta.env.BASE_URL}art/riverboat/${file}`;

export const RIVERBOAT: Chapter = {
  id: 'riverboat',
  numeral: '1',
  title: 'The River',
  year: 1836,
  place: 'The Magnolia Queen, Mississippi River',
  gameId: GAME_ID,
  stakes: { ante: 1, minBet: 2, startingStack: 100 },
  intro: [
    'Your father lost the family’s old deck at cards, to a gambler named Silas Crane. People called it the Ashcombe deck, and swore that whoever held it never lost.',
    'Tonight, Kit Avery, you have found him: in the card room of the Magnolia Queen, steaming downriver from Natchez to New Orleans. Two other passengers already sit at his green table.',
    'Win back your family’s deck. Be the last player at the table and it goes home with you.',
  ],
  history: [
    'Early players dealt only the twenty high cards: aces down to tens. Four players took five cards each, so the whole deck was in play.',
    'There was one round of betting and no draw. Straights and flushes did not count yet; they arrived with the 52-card deck.',
    'A knife, or “buck”, marked whose turn it was to deal. Handing it on is where “passing the buck” comes from.',
  ],
  howToPlay: [
    'Everyone puts in a $1 ante. Each player is dealt five cards from the 20-card deck.',
    'One round of betting, starting left of the buck. Check, bet, call, raise or fold.',
    'If more than one player is left, the best hand takes the pot.',
    'Win every dollar at the table to finish the chapter. Lose all of yours and the deck stays on the boat.',
  ],
  rivals: [
    {
      id: 'delphine',
      name: 'Delphine',
      fullName: 'Mrs. Delphine Arceneaux',
      role: 'A Louisiana widow who knows the deck’s story',
      // Tricky: checks strong hands to trap, bluffs rarely.
      personality: { valueAt: 1.6, bluff: 0.07, caution: 0.03, betSize: 0.6, trap: 0.5 },
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
      art: { src: art('delphine-portrait.webp'), kind: 'portrait', aspect: 1200 / 670, place: { x: 330, bottom: 540, height: 400 } },
      plate: { x: 380, y: 540 },
    },
    {
      id: 'silas',
      name: 'Silas',
      fullName: '“Gentleman” Silas Crane',
      role: 'A riverboat card sharp',
      personality: { valueAt: 1.3, bluff: 0.24, caution: -0.02, betSize: 0.75 },
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
      personality: { valueAt: 2.0, bluff: 0.0, caution: 0.1, betSize: 0.4 },
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
      art: { src: art('ezra-portrait.webp'), kind: 'portrait', aspect: 1200 / 670, place: { x: 1270, bottom: 540, height: 400 } },
      plate: { x: 1220, y: 540 },
    },
  ],
  nemesisId: 'silas',
  narratorId: 'delphine',
  scene: { background: art('background.webp'), tableFront: art('table-front.webp') },
  playerPlate: { x: 800, y: 760 },
  outro: {
    won: [
      'The last of the money is in front of you. Silas Crane tips his hat and slides a worn leather case across the felt.',
      'Inside the lid, in faded ink: “M.A. 1543”. Delphine leans closer. “That deck is older than this river’s name, darling. Let me tell you where it has been.”',
    ],
    lost: [
      'Your last dollar crosses the table. Silas Crane pockets the leather case with a smile.',
      '“Never chase a man who is smoothing his mustache,” Delphine murmurs. The Magnolia Queen has a long way still to go. Sit down again?',
    ],
  },
};
