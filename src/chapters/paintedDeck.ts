/**
 * Chapter 2, "The Painted Deck": Primero in the great hall of Ashcombe Hall,
 * Kent, on Twelfth Night 1543. The first flashback: how the deck was made
 * and how its legend began. (docs/GAME_OUTLINE.md, Chapter 2.)
 *
 * Art: the great hall, the title painting and the three rivals (cut out
 * from green) are painted (docs/ART.md).
 */
import { PRIMERO_ID } from '../games/primero';
import { cutout, lines, rival, say } from './cast';
import type { Chapter } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/painted-deck/${file}`;

export const PAINTED_DECK: Chapter = {
  id: 'painted-deck',
  numeral: '2',
  part: 1,
  title: 'The Painted Deck',
  year: 1543,
  place: 'Ashcombe Hall, Kent, England',
  youAre: 'Nan Avery, a card-painter’s daughter',
  teaches: 'Primero, the courtly ancestor of poker',
  rulesObject: 'The parchment of rules',
  money: { suffix: 's' },
  stages: [
    {
      fromHand: 1,
      structure: { unit: 2 },
      games: [
        {
          game: PRIMERO_ID,
          betting: 'pot-limit',
          lesson: {
            teacher: 'anselm',
            before: [
              say('anselm', 'You have never played Primero, child? Then sit by me. I kept the abbey’s accounts for twenty years; I can count a hand of cards.'),
              say('anselm', 'Forty cards: the painted court, and the aces to the sevens. No eights, nines or tens. Every card is worth points. The seven is worth most, twenty-one; then the six, eighteen; the ace, sixteen.'),
              say('anselm', 'You will get two cards, then two more, with a wager after each. Then you may change up to two cards, once, and we wager a last time.'),
              say('anselm', 'Best of all is a chorus, four alike. Then a fluxus, four of one suit. Then the supremus, seven, six and ace of one suit. Then a primero, one card of every suit. Failing those, the most points in a single suit.'),
            ],
            streets: {
              0: [say('anselm', 'Your first two cards. Two of one suit start you toward a fluxus; two of different suits, toward a primero. Wager as your hope allows.')],
              1: [say('anselm', 'Two more. Count your suits. Four different suits is a primero already, and you should keep it.')],
              2: [say('anselm', 'Now the change. Pick up to two cards to throw away and draw fresh ones. Throw the cards that break your pattern, and keep the high ones.')],
            },
          },
        },
      ],
    },
  ],
  startingStack: 100,
  levelEvery: 10,
  levelLines: [say('narration', 'The yule log sinks into embers. A servant brings more candles, and Lady Margery doubles the wager.')],
  intro: [
    'Twelfth Night, 1543. The last night of the Christmas revels in the great hall of Ashcombe Hall. Candlelight, tapestries, a roaring hearth.',
    'Your father, the card painter Thomas Avery, spent a year on a deck for Lady Margery Ashcombe: every card painted by hand, every court card a face from her own household. Now she will not pay for it.',
    '“Play me for it, if you think it is worth so much,” she says. Your father’s hands shake too badly to hold the cards. So you, Nan Avery, take the seat.',
  ],
  recap: [
    'In 1836, on a Mississippi steamboat, Kit Avery won back a family heirloom: an old hand-painted deck called the Ashcombe deck, with “M.A. 1543” inside its case.',
    'Mrs. Delphine Arceneaux, who knows its history, began to tell where it came from. This is that story, three hundred years earlier.',
  ],
  history: [
    'Primero (primiera in Italy, primera in Spain) was the fashionable gambling game of 1500s Europe, and was played at the court of Henry VIII.',
    'Its hands foreshadow poker’s: four of a kind, a flush, and betting on a hand others can’t see. Shakespeare mentions it: Falstaff grumbles that he has never prospered since he swore falsely at primero.',
    'Old books disagree on its exact rules. This chapter plays a reconstruction, and says so.',
  ],
  howToWin: [
    'Everyone antes 1s; the smallest wager is 2s, and no wager may be larger than the pot.',
    'Take Lady Margery’s last shilling once she stakes the deck, and it is paid for.',
  ],
  rivals: [
    {
      ...rival(
        {
          id: 'roland',
          name: 'Sir Roland',
          fullName: 'Sir Roland Fettiplace',
          role: 'A reckless young knight with a new horse',
          personality: { valueAt: 1.1, bluff: 0.3, caution: -0.06, betSize: 0.8, respect: 0.25, reads: 0.1, tilt: 0.15 },
          tell: { text: 'He drains his cup in one long swallow.', signals: 'bluffing', showsWhenTrue: 0.7, showsWhenFalse: 0.15 },
          lines: lines({
            bet: ['Have at thee!', 'More silver! Fortune loves the bold.', 'I raise, by Saint George.'],
            call: ['I’ll not be frightened off.', 'Aye, I’ll see it.'],
            fold: ['Bah. Take it.', 'A tactical retreat.'],
            check: ['I’ll hold, for now.'],
            win: ['Ha! Did I not say so?', 'Fortune is a lady, and she loves me.'],
            bust: 'Out of silver, and the horse is already gone. I shall walk home to Oxfordshire.',
            draw: ['Two fresh ones, and quickly!', 'Give me one. A good one.'],
            pat: ['I keep them all. Tremble.'],
          }),
        },
        'left',
        '#7a1f1f',
      ),
      art: cutout(art('roland.webp'), 1038 / 900, { x: 330, bottom: 560, height: 470 }),
    },
    {
      ...rival(
        {
          id: 'margery',
          name: 'Lady Margery',
          fullName: 'Lady Margery Ashcombe',
          role: 'Mistress of Ashcombe Hall, who never shows her hand',
          personality: { valueAt: 1.45, bluff: 0.08, caution: 0.04, betSize: 0.7, respect: 0.6, reads: 0.9 },
          tell: { text: 'She turns the signet ring on her finger.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.2 },
          lines: lines({
            bet: ['I wager.', 'Let us raise the stakes, Mistress Avery.', 'Twice that.'],
            call: ['I will see it.', 'As you wish.'],
            fold: ['No.', 'Not this one.'],
            check: ['I pass.'],
            win: ['As expected.', 'My hall, my fortune.'],
            bust: 'Enough. I am beaten fairly, and I pay my debts. Eventually.',
            draw: ['One card.', 'Two, if you please.'],
            pat: ['I am content.'],
          }),
        },
        'across',
        '#3b2a5c',
      ),
      art: cutout(art('margery.webp'), 851 / 900, { x: 800, bottom: 520, height: 470 }),
    },
    {
      ...rival(
        {
          id: 'anselm',
          name: 'Brother Anselm',
          fullName: 'Brother Anselm',
          role: 'A monk turned out of his abbey, now the hall’s steward',
          personality: { valueAt: 1.7, bluff: 0.03, caution: 0.08, betSize: 0.5, respect: 0.85, reads: 0.3 },
          tell: { text: 'He mutters a prayer under his breath.', signals: 'weak', showsWhenTrue: 0.65, showsWhenFalse: 0.1 },
          lines: lines({
            bet: ['A modest wager.', 'The numbers favour me, I think.'],
            call: ['I will follow.', 'Very well.'],
            fold: ['Not with these.', 'Lord, forgive my poor cards.'],
            check: ['I pass, gladly.'],
            win: ['Deo gratias.', 'Arithmetic, my lady. Only arithmetic.'],
            bust: 'I have lost an abbey once already. A few shillings, I can bear.',
            draw: ['Two, by your leave.', 'One, I think.'],
            pat: ['These will serve.'],
          }),
        },
        'right',
        '#4a3a26',
      ),
      art: cutout(art('anselm.webp'), 784 / 900, { x: 1270, bottom: 560, height: 470 }),
    },
  ],
  nemesisId: 'margery',
  narratorId: 'anselm',
  scene: {
    background: art('background.webp'),
    tableFront: art('table-front.webp'),
    title: art('title.webp'),
    palette: { wall: '#1a120c', light: '#f5c56a', felt: '#7a2420', rim: '#6e4a22' },
  },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: 'Lady Margery Ashcombe', line: 'The Painted Deck, 1543. She paid, and named it.' },
  story: {
    stake: {
      afterPlayerWins: 2,
      orAfterHands: 5,
      lines: [
        say('margery', 'You play well for a painter’s girl. Very well.'),
        say('narration', 'Lady Margery sets the painted deck on the oak table, in a plain leather case.'),
        say('margery', 'Take my last shilling and the deck is paid for, and then some. Lose yours and I keep it for nothing.'),
        say('anselm', 'She turns her ring when the cards favour her, child. Not always. But often.'),
      ],
      passes: [
        say('narration', 'Lady Margery is out of silver. The leather case passes to {name}.'),
        say('anselm', 'Your father’s deck is still on this table, child. Win it from whoever holds it.'),
      ],
    },
    moments: [
      {
        beforeHand: 4,
        lines: [
          say('roland', 'I have no more silver on me. I wager my horse! A grey, sixteen hands, the finest in Kent.'),
          say('margery', 'Your horse is already in my stables, Sir Roland. You wagered it at dinner.'),
          say('roland', '...Ah.'),
        ],
      },
      {
        beforeHand: 7,
        lines: [
          say('anselm', 'This hall was nothing to me, five years ago. I had an abbey, and a library, and a garden of herbs. The King’s men took the lead from the roof.'),
          say('anselm', 'Now I count Lady Margery’s candles. Play your cards, child. Do not let me bore you.'),
        ],
      },
    ],
    finale: {
      bowOut: {
        roland: [say('roland', 'I shall watch, and cheer for the painter’s daughter. Quietly. My lady holds my horse.'), say('narration', 'Sir Roland pushes back his bench and refills his cup.')],
        anselm: [say('anselm', 'I am a steward, not a gambler. I will keep what I have and watch.'), say('narration', 'Brother Anselm folds his hands and sits back from the table.')],
      },
      headsUp: [say('margery', 'Just the two of us, then, Mistress Avery. For your father’s year of work.')],
    },
    exits: {
      roland: [say('narration', 'Sir Roland bows to the table, trips over the hound, and bows to the hound.')],
    },
  },
  outro: {
    won: [
      'Lady Margery’s last shilling crosses the table. The hall is silent; then she laughs, and pays twice what she owed.',
      'She has her goldsmith stamp her initials inside the deck’s case: “M.A. 1543”. “Whoever holds this deck never loses,” she says. “Tonight, at least, that was true.”',
      'The legend has begun. Two hundred years later, the deck is on the road north…',
    ],
    lost: [
      'Your last shilling is gone. Lady Margery tucks the painted deck into her sleeve.',
      '“Change toward the suits you lack, child, and wager hard on a primero,” Brother Anselm whispers. “Try again.”',
    ],
  },
};
