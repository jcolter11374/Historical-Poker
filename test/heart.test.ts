/**
 * Why you care (docs/GAME_DESIGN.md): each chapter's `heart` beats play at
 * the table as the evening goes, moments can wait on something you did,
 * rivals react to big pots, and table talk never changes how anyone plays.
 */
import { describe, expect, it } from 'vitest';
import { seeded } from '../src/bots/random';
import { CHAPTERS, chapterById } from '../src/chapters';
import type { Chapter } from '../src/chapters/types';
import { BIG_POT, HUMAN, Session, type BotDecisionInfo } from '../src/table/session';

type Style = 'call' | 'fold';

/** Plays `n` hands with a player who always calls (or always folds to a bet), and records every scene line. */
function play(c: Chapter, seed: number, n: number, style: Style = 'call', log?: BotDecisionInfo[]) {
  const deal = seeded(seed * 7919);
  const s = new Session(c, { seed, dealRng: (k) => deal.int(k), skipTutorial: true, simTrials: 8, onBotDecision: log ? (d) => log.push(d) : undefined });
  const scenes: string[] = [];
  const said: string[] = [];
  const skip = () => {
    while (s.inScene) {
      scenes.push(s.snapshot().scene!.text);
      s.advanceScene();
    }
  };
  for (let i = 0; i < n && !s.snapshot().outcome; i++) {
    skip();
    s.startHand();
    let guard = 0;
    while (s.handInProgress) {
      if (++guard > 300) throw new Error('hand did not finish');
      skip();
      if (!s.handInProgress) break;
      if (s.toAct === HUMAN) {
        if (s.drawLimit() !== null) s.draw([]);
        else {
          const legal = s.legal()!;
          if (legal.canBringIn) s.act({ type: 'bring-in' });
          else if (legal.canCheck) s.act({ type: 'check' });
          else s.act({ type: style === 'fold' ? 'fold' : 'call' });
        }
      } else s.botStep();
      const sp = s.snapshot().speech;
      if (sp) said.push(sp.text);
    }
    const sp = s.snapshot().speech;
    if (sp) said.push(sp.text);
  }
  skip();
  return { s, scenes, said };
}

describe('why you care', () => {
  it('every story chapter says what is at stake for you, and how it feels when it turns', () => {
    for (const { chapter } of CHAPTERS) {
      const h = chapter.story?.heart;
      expect(h, chapter.id).toBeTruthy();
      expect(h!.stakes.length && h!.losing.length && h!.turning.length, chapter.id).toBeTruthy();
      for (const r of chapter.rivals) {
        expect(r.lines.beatYou?.length, r.id).toBeGreaterThan(0);
        expect(r.lines.lostToYou?.length, r.id).toBeGreaterThan(0);
      }
    }
  });

  it('the stakes are told before the second hand, once', () => {
    for (const { chapter } of CHAPTERS) {
      const { scenes } = play(chapter, 5, 3);
      const first = chapter.story!.heart!.stakes[0].text;
      expect(scenes.filter((t) => t === first).length, chapter.id).toBe(1);
    }
  });

  it('losing half your purse brings the losing beat, once', () => {
    const c = chapterById('riverboat')!;
    const line = c.story!.heart!.losing[0].text;
    let seen = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const { scenes } = play(c, seed, 40);
      const n = scenes.filter((t) => t === line).length;
      expect(n).toBeLessThanOrEqual(1);
      seen += n;
    }
    expect(seen).toBeGreaterThan(0);
  });

  it('Elena only says you fold when she looks at you once you have folded to her', () => {
    const c = chapterById('last-table')!;
    const line = 'You fold when I look at you. That is not in any of my family’s stories about yours.';
    // A player who never folds never hears it.
    expect(play(c, 3, 12, 'call').scenes).not.toContain(line);
    // A player who folds to every bet does, after she has bet into them.
    expect(play(c, 3, 12, 'fold').scenes).toContain(line);
  });

  it('a big pot gets a reaction and a mood; small ones mostly pass in silence', () => {
    const c = chapterById('riverboat')!;
    let big = 0;
    for (let seed = 1; seed <= 4; seed++) {
      const deal = seeded(seed * 7919);
      const s = new Session(c, { seed, dealRng: (k) => deal.int(k), skipTutorial: true, simTrials: 8 });
      for (let i = 0; i < 25 && !s.snapshot().outcome; i++) {
        while (s.inScene) s.advanceScene();
        s.startHand();
        while (s.handInProgress) {
          while (s.inScene) s.advanceScene();
          if (!s.handInProgress) break;
          if (s.toAct === HUMAN) {
            const l = s.legal()!;
            s.act(l.canCheck ? { type: 'check' } : { type: 'call' });
          } else s.botStep();
        }
        const snap = s.snapshot();
        if (!snap.bigPot) continue;
        big++;
        expect(snap.bigPot.amount).toBeGreaterThanOrEqual(c.startingStack * BIG_POT);
        expect(Object.keys(snap.mood).length).toBeGreaterThan(0);
      }
    }
    expect(big).toBeGreaterThan(0);
  });

  it('rivals talk less than they act', () => {
    const c = chapterById('last-table')!;
    const log: BotDecisionInfo[] = [];
    const { said } = play(c, 2, 8, 'call', log);
    expect(said.length).toBeLessThan(log.length * 0.6);
  });
});
