/**
 * Chapter 10, "The Boom": 2005. A $5 online qualifier at 3 a.m. in an
 * internet café, 2-7 Triple Draw and Badugi taught by online pros between
 * tables, then a televised final table in Las Vegas where "N0rthStar" turns
 * out to be a Crane. The most dramatic chapter. All people, sites and events
 * are fictional.
 *
 * The online tell is timing: how fast each player acts. Their tells here are
 * written as timing habits.
 */
import { lines, music, rival, say } from './cast';
import type { Chapter } from './types';

export const BOOM: Chapter = {
  id: 'boom',
  numeral: '10',
  part: 2,
  title: 'The Boom',
  year: 2005,
  place: 'An internet café at 3 a.m., then a final table in Las Vegas',
  youAre: 'Jamie Avery, a student',
  teaches: 'Online Hold’em, then 2-7 Triple Draw and Badugi',
  rulesObject: 'The help screen',
  stages: [
    {
      fromHand: 1,
      label: 'The $5 qualifier, 3 a.m.',
      structure: { unit: 10 },
      games: [
        {
          game: 'nlhe',
          betting: 'no-limit',
          lesson: {
            teacher: 'deuceseven',
            before: [
              say('narration', 'Chat: DeuceSeven says: “new guy? ok quick version. no limit holdem. 2 cards each, 5 on the board, best 5 wins.”'),
              say('deuceseven', 'blinds go up fast in these. you have the timer, so don’t think forever. and watch how FAST people act. that’s the only tell online.'),
              say('deuceseven', 'instant bet = usually pre-clicked, usually strong or a bot. long tank then bet = usually a hard decision. gl.'),
            ],
            streets: {
              0: [say('deuceseven', 'top 2 at this table win seats at the next one. last one standing goes to vegas. no pressure lol')],
            },
          },
        },
      ],
    },
    {
      fromHand: 5,
      label: 'Waiting for the next table: 2-7 Triple Draw',
      structure: { unit: 10 },
      opening: [
        say('narration', 'The qualifier pauses between rounds. DeuceSeven opens a side table and sends you an invite: “2-7 triple draw. high stakes guys play it. you should learn.”'),
      ],
      games: [
        {
          game: 'td27',
          betting: 'fixed-limit',
          lesson: {
            teacher: 'deuceseven',
            before: [
              say('deuceseven', '2-7 triple draw. lowest hand wins. aces are HIGH here, so an ace is a bad card.'),
              say('deuceseven', 'straights and flushes count against you. 7-5-4-3-2 in mixed suits is the best hand. that’s where my name comes from.'),
              say('deuceseven', '5 cards each, then 3 draws: throw away any you don’t want, get new ones. bet after each. it’s limit.'),
            ],
            streets: {
              0: [say('deuceseven', 'look for small cards, all different. a 2, 3, 4, 7 is a great start. pairs are bad, face cards are terrible.')],
              1: [say('deuceseven', 'first draw. click the cards to throw (pairs, anything above 8), then draw.')],
              3: [say('deuceseven', 'last draw. if you’re drawing one card to a 7 or 8, that’s good. drawing 3 now? you’re probably behind.')],
            },
          },
        },
      ],
    },
    {
      fromHand: 9,
      label: 'Still waiting: Badugi',
      structure: { unit: 10 },
      opening: [
        say('narration', 'Another break. A new name joins the side table, typing from Seoul, where it’s mid-afternoon. Chat: Hanbit says: “hello! you know badugi? I teach.”'),
      ],
      games: [
        {
          game: 'badugi',
          betting: 'fixed-limit',
          lesson: {
            teacher: 'hanbit',
            before: [
              say('hanbit', 'Badugi! Four cards. You want four different suits AND four different ranks. That is a badugi.'),
              say('hanbit', 'Low is good. Aces are low. 4-3-2-A in four suits is the best hand.'),
              say('hanbit', 'If two cards share a suit or rank, only one counts. Any four-card badugi beats any three-card hand.'),
              say('hanbit', 'Three draws, like 2-7. Limit betting. We play this a lot at home. Have fun!'),
            ],
            streets: {
              1: [say('hanbit', 'Draw! Keep the low cards that are all different suits and ranks. Throw the rest.')],
              3: [say('hanbit', 'Last draw. A three-card hand with a 2 or 3 high is still OK. But a badugi is better!')],
            },
          },
        },
      ],
    },
    {
      fromHand: 13,
      label: 'The final table, Las Vegas',
      resetStacks: true,
      scene: { palette: { wall: '#07070c', light: '#e8f0ff', felt: '#1d2c5a', rim: '#3a3a4a' } },
      structure: { unit: 10 },
      opening: [
        say('narration', 'Six weeks later. Las Vegas. Television lights, three cameras, a crowd behind the rail. Out of eight thousand qualifiers, four players are left, and you are one of them.'),
        say('narration', 'So are DeuceSeven and Hanbit, who flew in from Seoul. And the fourth seat belongs to the player who knocked out half the field online: N0rthStar.'),
        say('northstar', 'Jamie Avery. I knew the name the minute I saw it. My great-great-great-grandfather lost a deck to yours on a riverboat.'),
        say('northstar', 'Nate Crane. Nice to finally meet you. I want that deck back on national television.'),
      ],
      games: [
        {
          game: 'nlhe',
          betting: 'no-limit',
        },
      ],
    },
  ],
  startingStack: 500,
  levelEvery: 4,
  levelLines: [say('narration', 'A message flashes across the screen: BLINDS ARE INCREASING.')],
  intro: [
    '2005. Everyone is playing poker on the internet, and anyone can become a champion: a $5 qualifier can win a seat at the biggest tournament in Las Vegas.',
    'Jamie Avery is broke, studying at night, and playing in a cramped internet café at 3 a.m. because the dorm Wi-Fi is down. The old family deck sits next to the keyboard, for luck.',
    'At the table: two online pros, DeuceSeven and Hanbit, and a mysterious player called N0rthStar who never types in the chat.',
  ],
  recap: [
    'The Ashcombe deck, painted in 1543, has stayed with the American Avery family for more than two hundred years, through steamboats, wars, speakeasies and casinos.',
    'The Cranes have wanted it back ever since Kit Avery caught Silas Crane cheating on the Mississippi in 1836.',
  ],
  history: [
    'In the mid-2000s, online poker boomed. Amateurs who qualified online for a few dollars went on to win the biggest live tournaments, and poker was on television every night.',
    '2-7 Triple Draw, a lowball game with three draws, was a game for serious players; the biggest series added a championship event for it in 2004.',
    'Badugi has been played since the 1980s, in South Korea among other places, and became known in the United States around 2004.',
  ],
  howToWin: [
    'Online, before the final table, a player who goes broke can buy back in.',
    'At the final table, everyone starts even, blinds rise every four hands, and broke means out. Win every chip.',
  ],
  rivals: [
    rival(
      {
        id: 'deuceseven',
        name: 'DeuceSeven',
        fullName: '“DeuceSeven”',
        role: 'An online pro who plays twelve tables at once',
        personality: { valueAt: 1.35, bluff: 0.16, caution: 0.01, betSize: 0.7, respect: 0.5, reads: 0.8 },
        tell: { text: 'He tanks for the full timer, then raises.', signals: 'bluffing', showsWhenTrue: 0.55, showsWhenFalse: 0.2 },
        lines: lines({
          bet: ['raise', 'bet', 'lol raise'],
          call: ['call', 'k call'],
          fold: ['fold', 'gg fold'],
          check: ['check'],
          win: ['ship it', 'gg'],
          bust: 'busto. gl jamie, take it down',
          draw: ['2', 'one', 'drawing 3 lol'],
          pat: ['pat.'],
        }),
      },
      'left',
      '#2a4a6a',
    ),
    rival(
      {
        id: 'northstar',
        name: 'N0rthStar',
        fullName: '“N0rthStar”',
        role: 'Never types in the chat. Never loses.',
        personality: { valueAt: 1.25, bluff: 0.22, caution: -0.01, betSize: 0.8, trap: 0.2, respect: 0.6, reads: 1 },
        tell: { text: 'Bets instantly, the moment it’s his turn.', signals: 'strong', showsWhenTrue: 0.6, showsWhenFalse: 0.25 },
        lines: lines({
          bet: ['Raise.', 'Bet.', 'All the way.'],
          call: ['Call.'],
          fold: ['Fold.'],
          check: ['Check.'],
          win: ['…', 'The Cranes say thank you.'],
          bust: 'Again. An Avery, again. Fine. Keep your deck. Every generation, the same story.',
          draw: ['One.', 'Two.'],
          pat: ['Pat.'],
        }),
      },
      'across',
      '#1a1a2a',
    ),
    rival(
      {
        id: 'hanbit',
        name: 'Hanbit',
        fullName: '“Hanbit”',
        role: 'A Badugi player from Seoul',
        personality: { valueAt: 1.5, bluff: 0.08, caution: 0.04, betSize: 0.6, respect: 0.6, reads: 0.7 },
        tell: { text: 'Hanbit types “hmm” in the chat.', signals: 'weak', showsWhenTrue: 0.6, showsWhenFalse: 0.12 },
        lines: lines({
          bet: ['bet!', 'raise :)'],
          call: ['call', 'ok call'],
          fold: ['fold', 'no luck'],
          check: ['check'],
          win: ['^^', 'thank you!'],
          bust: 'I am out! Good game everyone, very fun. Jamie, fighting!',
          draw: ['draw 1', 'draw 2'],
          pat: ['pat!'],
        }),
      },
      'right',
      '#5a3a5a',
    ),
  ],
  nemesisId: 'northstar',
  narratorId: 'deuceseven',
  scene: { music: music('boom'), palette: { wall: '#0b0f1a', light: '#6ad0ff', felt: '#1a3a6a', rim: '#2a2f3a' } },
  playerPlate: { x: 800, y: 760 },
  keepsake: { name: '“N0rthStar”, Nate Crane', line: 'The Boom, 2005. From a $5 qualifier to the final table.' },
  story: {
    dealer: ['Blinds posted. Dealing…', 'New hand.', 'Dealing…'],
    finale: {
      bowOut: {},
      headsUp: [
        say('narration', 'Heads-up for the title. The crowd is on its feet. The commentator says your name, and Crane’s, and something about a riverboat.'),
        say('northstar', 'Just us, Avery. Like always.'),
      ],
    },
    exits: {
      deuceseven: [say('narration', 'DeuceSeven stands, shakes your hand, and says his first words out loud all night: “Take him down.”')],
      hanbit: [say('narration', 'Hanbit bows to the table and leaves to a big round of applause.')],
    },
  },
  outro: {
    won: [
      'The last chips are yours. Confetti falls. Somewhere in the crowd, someone is waving a sign that says “$5 → CHAMPION”.',
      'Nate Crane shakes your hand on live television. “Every generation,” he says. “Every single one.” He doesn’t sound angry anymore. He sounds almost impressed.',
    ],
    lost: [
      'Your last chip goes to N0rthStar. The cameras swing to Nate Crane, holding up a battered old deck of cards.',
      '“dude you called off your tournament,” DeuceSeven types later. “fold more early. pressure late.” Try again?',
    ],
  },
};
