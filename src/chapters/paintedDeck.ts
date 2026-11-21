/**
 * Chapter 2, "The Painted Deck": Primero in the great hall of Ashcombe Hall,
 * Kent, on Twelfth Night 1543. The first flashback: how the deck was made
 * and how its legend began. (docs/GAME_OUTLINE.md, Chapter 2.)
 *
 * Art: the great hall, the title painting and the three rivals (cut out
 * from green) are painted (docs/ART.md).
 */
import { PRIMERO_ID } from '../games/primero';
import { cutout, lines, music, rival, say } from './cast';
import type { Chapter } from './types';

const art = (file: string) => `${import.meta.env.BASE_URL}art/painted-deck/${file}`;

export const PAINTED_DECK: Chapter = {
  id: 'painted-deck',
  numeral: '2',
  part: 1,
  title: 'The Painted Deck',
  year: 1543,
  place: 'Ashcombe Hall, Kent, England',
  toldBy: 'Delphine’s tale',
  youAre: 'Nan Avery, a card-painter’s daughter',
  teaches: 'Primero, the courtly ancestor of poker',
  rulesObject: 'The parchment of rules',
  dealerMarker: 'none',
  money: { suffix: 's' },
  stages: [
    {
      fromHand: 1,
      structure: { unit: 2 },
      games: [
        {
          game: PRIMERO_ID,
          betting: 'no-limit',
          lesson: {
            teacher: 'anselm',
            before: [
              say('anselm', 'You have never played Primero, child? Then sit by me. I kept the abbey’s accounts for twenty years; I can count a hand of cards.'),
              say('anselm', 'Forty cards: the painted court, and the aces to the sevens. No eights, nines or tens. Every card is worth points. The seven is worth most, twenty-one; then the six, eighteen; the ace, sixteen.'),
              say('anselm', 'You will get two cards, then two more, with a wager after each. Then you may change up to two cards, once, and we wager a last time.'),
              say('anselm', 'The coin before you is your rest. You may wager any part of it, or set up your rest and wager it all. Do that only when you are sure, child.'),
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
  startingStack: 200,
  levelEvery: 10,
  levelLines: [say('narration', 'The yule log sinks into embers. A servant brings more candles, and Lady Margery doubles the wager.')],
  intro: [
    'On the Magnolia Queen, Delphine turns the old case in the lamplight. “It begins three hundred years ago, darling, with an Avery like you and, I am sorry to say, a Crane. How I know is a story for another night.” Twelfth Night, 1543. The last night of the Christmas revels in the great hall of Ashcombe Hall. Candlelight, tapestries, a roaring hearth.',
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
    'Everyone antes 1s and the smallest wager is 2s. You may wager anything up to your whole “rest”, the money in front of you.',
    'Take Lady Margery’s last shilling once she stakes the deck, and it is paid for.',
  ],
  rivals: [
    {
      ...rival(
        {
          id: 'roland',
          name: 'Sir Roland',
          fullName: 'Sir Roland Crane',
          role: 'Lady Margery’s nephew, a reckless young knight who was promised the deck',
          personality: { level: 'easy', valueAt: 0.95, bluff: 0.3, caution: -0.06, betSize: 0.8, respect: 0.25, reads: 0.1, tilt: 0.15 },
          tell: { text: 'He drains his cup in one long swallow.', signals: 'bluffing', showsWhenTrue: 0.7, showsWhenFalse: 0.15 },
          lines: lines({
            bet: ['Have at thee!', 'More silver! Fortune loves the bold.', 'I raise, by Saint George.'],
            call: ['I’ll not be frightened off.', 'Aye, I’ll see it.'],
            fold: ['Bah. Take it.', 'A tactical retreat.'],
            check: ['I’ll hold, for now.'],
            win: ['Ha! Did I not say so?', 'Fortune is a lady, and she loves me.'],
            bust: 'Out of silver, the horse gone, and my deck in a painter’s girl’s lap. A Crane does not forget this, Mistress Avery.',
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
          personality: { level: 'normal', valueAt: 1.45, bluff: 0.08, caution: -0.03, betSize: 0.7, respect: 0.4, reads: 0.9 },
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
          personality: { level: 'easy', valueAt: 1.7, bluff: 0.03, caution: 0.18, betSize: 0.5, respect: 0.85, reads: 0.3 },
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
    music: music('painted-deck'),
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
        say('roland', 'Aunt! That deck was to be my New Year’s gift. You promised it to me, before all the household.'),
        say('margery', 'I promised it to whoever deserved it, nephew. Sit down and deserve it.'),
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
        roland: [say('roland', 'I shall watch. And I shall remember who walks out of this hall with my deck. My aunt holds my horse.'), say('narration', 'Sir Roland pushes back his bench and refills his cup.')],
        anselm: [say('anselm', 'I am a steward, not a gambler. I will keep what I have and watch.'), say('narration', 'Brother Anselm folds his hands and sits back from the table.')],
      },
      headsUp: [say('margery', 'Just the two of us, then, Mistress Avery. For your father’s year of work.')],
    },
    exits: {
      roland: [
        say('narration', 'Sir Roland bows to the table, trips over the hound, and bows to the hound.'),
        say('narration', 'From the door he calls back: “That deck was to be mine. A Crane does not forget!” The hound barks at him until he goes.'),
      ],
    },
  },
  outro: {
    won: [
      'Lady Margery’s last shilling crosses the table. The hall is silent; then she laughs, and pays twice what she owed. Then she puts the deck back in your hands. “A deck that beat me will not sit in my cupboard. Keep it, Mistress Avery.”',
      'First she has her initials inked inside the lid of its case: “M.A. 1543”. “Whoever holds this deck never loses,” she says. “Tonight, at least, that was true.”',
      '“And so the legend began,” Delphine says, back on the river. “And so did the quarrel. Remember the name of that sulking young knight, darling: Crane. His family never forgave yours.”',
      'She turns the case over in her hands. “Two hundred years later, the deck was on the road north, in a coach guard’s coat…”',
    ],
    lost: [
      'Your last shilling is gone. Lady Margery tucks the painted deck into her sleeve.',
      '“Change toward the suits you lack, child, and wager hard on a primero,” Brother Anselm whispers. “Try again.”',
    ],
  },
};
