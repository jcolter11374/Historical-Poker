import { describe, expect, it } from 'vitest';
import { engine, type HandState } from '@rsdp/engine/core';
import { teachBots } from '../src/bots/games';
import { effective, play, thinking, type Personality, type PlayerRead } from '../src/bots/personality';
import { seeded } from '../src/bots/random';
import { estimateEquity, extraGames, handReads, potShare, situation } from '../src/bots/rsdp/strategy';
import { CAMP } from '../src/chapters/camp';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { GAMES, getGame } from '../src/games/catalog';
import { HUMAN, Session } from '../src/table/session';
import { playStyle, type RivalStats } from './standIns';

/** A hand of the chapter, dealt and waiting on the first player to act. */
function dealt(chapter = RIVERBOAT, seed = 3) {
  const deal = seeded(seed);
  const s = new Session(chapter, { seed, dealRng: (n) => deal.int(n), skipTutorial: true, simTrials: 60 });
  while (s.inScene) s.advanceScene();
  s.startHand();
  while (s.inScene) s.advanceScene();
  return s;
}
const stateOf = (s: Session) => s['state'] as HandState;

describe('RSDP Live’s bot, taught the historical games', () => {
  it('knows every game in the catalog, RSDP’s own without being taught', () => {
    teachBots();
    for (const id of ['nlhe', 'plo4', 'plo8', 'stud', 'razz', 'stud8', 'td27', 'badugi']) expect(extraGames.has(id), id).toBe(false);
    for (const g of Object.values(GAMES).filter((x) => x.historical)) expect(extraGames.has(g.id), g.id).toBe(true);
  });

  it('scores a historical showdown by that game’s own ranking', () => {
    teachBots();
    const spec = (id: string) => extraGames.get(id)!.spec;
    // 1836: no flushes or straights, so a pair beats five hearts in a row.
    expect(potShare(spec('straight-1836'), [['Td', 'Tc', 'Ah', 'Kh', 'Qh'], ['Ah', 'Kh', 'Qh', 'Jh', 'Th']], [])).toBe(1);
    // 1864 stud: triplets beat a straight.
    expect(potShare(spec('stud5-1863'), [['8d', '8c', '8h', 'Kh', '2s'], ['9h', '8s', '7h', '6d', '5c']], [])).toBe(1);
    // Brag: a natural pair royal beats one made with a bragger.
    expect(potShare(spec('brag-1763'), [['7d', '7c', '7h'], ['7s', 'Jc', '7h']], [])).toBe(1);
  });

  it('deals out the game’s own deck when it sizes up a hand', () => {
    const s = dealt();
    thinking(getGame('straight-1836'), 200);
    // Twenty cards, four players: every card is out, so the four chances add up to about one pot.
    const chances = [0, 1, 2, 3].map((seat) => estimateEquity(situation(stateOf(s), seat), seeded(seat + 1).next));
    for (const eq of chances) expect(eq).toBeLessThan(1);
    expect(chances.reduce((x, y) => x + y, 0)).toBeGreaterThan(0.6);
    expect(chances.reduce((x, y) => x + y, 0)).toBeLessThan(1.4);
    expect(extraGames.get('straight-1836')!.deck()).toHaveLength(20);
  });
});

describe('a character on top of RSDP’s bot', () => {
  const p: Personality = { valueAt: 1.5, bluff: 0.1, caution: 0.03, betSize: 0.6, tilt: 0.12 };

  it('plays looser and wilder on tilt', () => {
    const t = effective(p, true);
    expect(t.bluff).toBeCloseTo(0.22);
    expect(t.valueAt).toBeCloseTo(1.38);
    expect(t.caution).toBeCloseTo(-0.03);
    expect(effective(p, false)).toBe(p);
  });

  /** How often each kind of first move is made in the same spot, over many seeds. */
  const firstMoves = (who: Personality, n = 300) => {
    const s = dealt();
    const hand = stateOf(s);
    const seat = hand.toAct!;
    const out = { bet: 0, check: 0, bluffs: 0 };
    for (let i = 0; i < n; i++) {
      const d = play(who, { hand, seat, game: getGame('straight-1836'), legal: engine.legalActions(hand, seat)!, sims: 40 }, seeded(i + 1));
      if (d.kind !== 'act') continue;
      if (d.action.type === 'bet') out.bet++;
      else out.check++;
      if (d.bluffing) out.bluffs++;
    }
    return out;
  };

  it('a looser character bets the same cards more often, and one who never bluffs never does', () => {
    const tight = firstMoves({ level: 'normal', valueAt: 2.4, bluff: 0, caution: 0.03, betSize: 0.6 });
    const loose = firstMoves({ level: 'normal', valueAt: 0.9, bluff: 0.3, caution: 0.03, betSize: 0.6 });
    expect(loose.bet).toBeGreaterThan(tight.bet);
    expect(tight.bluffs).toBe(0);
  });

  it('a trapper checks hands RSDP’s bot would bet', () => {
    const plain = firstMoves({ level: 'normal', valueAt: 0.5, bluff: 0, caution: 0.03, betSize: 0.6 });
    const trapper = firstMoves({ level: 'normal', valueAt: 0.5, bluff: 0, caution: 0.03, betSize: 0.6, trap: 0.6 });
    expect(plain.bet).toBeGreaterThan(250);
    expect(trapper.check).toBeGreaterThan(plain.check + 100);
  });
});

describe('reading the player', () => {
  it('RSDP’s read stops believing a player who bets every time', () => {
    const s = dealt();
    // The player opens with a bet.
    while (s.toAct !== HUMAN) s.botStep();
    const legal = s.legal()!;
    s.act({ type: legal.raiseKind, to: legal.minTo });
    const hand = stateOf(s);
    const seat = hand.seats.find((x) => x.seat !== HUMAN && !x.folded)!.seat;
    const mine = (players: Record<string, PlayerRead>) => handReads(hand, seat, players)[hand.seats.filter((x) => x.seat !== seat && !x.folded).findIndex((x) => x.seat === HUMAN)];
    // An ordinary player's bet is believed; forty bets in forty decisions are not.
    expect(mine({})).toBeGreaterThan(0.5);
    expect(mine({ you: { acts: 40, aggressive: 40, faced: 0, folds: 0 } })).toBe(0);
  });
});

describe('the rivals', () => {
  // Seeded and short, so this runs in a few seconds; tools/bot-lab.ts runs the long version.
  const HANDS = 160;
  for (const chapter of [RIVERBOAT, CAMP]) {
    it(`${chapter.id}: punish reckless play`, () => {
      for (const style of ['maniac', 'aggro', 'station'] as const) {
        expect(playStyle(chapter, style, HANDS, 11, {}, 24), style).toBeLessThan(0);
      }
    });
  }

  it('riverboat: each plays like themselves (Silas loose and wild, Ezra tight and honest)', () => {
    const stats: Record<string, RivalStats> = {};
    playStyle(RIVERBOAT, 'teacher', HANDS, 5, stats, 24);
    const { silas, ezra, delphine } = stats;
    const rate = (r: RivalStats, k: 'played' | 'aggressive') => r[k] / (k === 'played' ? r.hands : r.decisions);
    expect(rate(silas, 'played')).toBeGreaterThan(rate(ezra, 'played') + 0.1);
    expect(rate(silas, 'aggressive')).toBeGreaterThan(rate(delphine, 'aggressive'));
    expect(ezra.bluffs).toBe(0);
    expect(silas.bluffs).toBeGreaterThan(0);
  });
});
