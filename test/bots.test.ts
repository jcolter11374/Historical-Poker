import { describe, expect, it } from 'vitest';
import { decide, effective, type Personality } from '../src/bots/personality';
import { seeded } from '../src/bots/random';
import { equity } from '../src/bots/strength';
import { CAMP } from '../src/chapters/camp';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { getGame } from '../src/games/catalog';
import { HUMAN, Session } from '../src/table/session';
import { playStyle, type RivalStats } from './standIns';

const holdem = () => getGame('nlhe');

describe('hand strength', () => {
  const input = { game: holdem(), me: ['Jh', 'Jd'], board: ['9c', '5s', '2d'], opponents: [[]], dead: [], street: 1, drawPending: false };

  it('reads a bet as strength, and a known bluffer’s bet as less', () => {
    const plain = equity(input, seeded(1), 1500);
    const believed = equity({ ...input, pressure: [2] }, seeded(1), 1500);
    const doubted = equity({ ...input, pressure: [0.5] }, seeded(1), 1500);
    expect(believed).toBeLessThan(plain - 0.05);
    expect(doubted).toBeGreaterThan(plain + 0.02);
  });
});

describe('decisions', () => {
  const p: Personality = { valueAt: 1.5, bluff: 0.1, caution: 0.03, betSize: 0.6, tilt: 0.12 };

  it('plays looser and wilder on tilt', () => {
    const t = effective(p, true);
    expect(t.bluff).toBeCloseTo(0.22);
    expect(t.valueAt).toBeCloseTo(1.38);
    expect(t.caution).toBeCloseTo(-0.03);
    expect(effective(p, false)).toBe(p);
  });

  it('bluffs more against one player than against three', () => {
    const legal = { canFold: false, canCheck: true, callAmount: 0, canRaise: true, raiseKind: 'bet', minTo: 2, maxTo: 100, canBringIn: false } as never;
    const bluffs = (opponents: number) => {
      const rnd = seeded(7);
      let n = 0;
      for (let i = 0; i < 4000; i++) if (decide(p, { legal, equity: 0.2 / (opponents + 1), opponents, pot: 10, currentBet: 0 }, rnd).bluffing) n++;
      return n;
    };
    expect(bluffs(1)).toBeGreaterThan(bluffs(3) * 2);
  });
});

describe('reading the player', () => {
  it('stops believing a player who bets every time, if the rival reads people', () => {
    const s = new Session(RIVERBOAT, { seed: 1, skipTutorial: true });
    const delphine = RIVERBOAT.rivals.find((r) => r.id === 'delphine')!.personality;
    const ezra = RIVERBOAT.rivals.find((r) => r.id === 'ezra')!.personality;
    const cred = (by: Personality) => s['credibility'](HUMAN, by);
    expect(cred(delphine)).toBeCloseTo(1, 1);
    // Forty decisions, every one a bet or raise.
    s['humanDecisions'] = 40;
    s['humanAggressive'] = 40;
    expect(cred(delphine)).toBeLessThan(0);
    expect(cred(ezra)).toBeGreaterThan(0.75);
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
