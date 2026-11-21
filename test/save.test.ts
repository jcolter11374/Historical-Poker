/**
 * Saving: progress and settings, and a chapter left part-way (the table after
 * the last finished hand) picked up again exactly where it stood.
 */
import { describe, expect, it } from 'vitest';
import { seeded } from '../src/bots/random';
import { CHAPTERS, chapterById } from '../src/chapters';
import type { Chapter } from '../src/chapters/types';
import { clearTable, latestTable, loadProgress, loadTables, record, resetProgress, saveTable, type Store } from '../src/progress/save';
import { HUMAN, Session, TABLE_SAVE_VERSION, type SavedTable } from '../src/table/session';

function memory(): Store & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
}

/** Plays `n` hands (or to the end) with a check-or-call player, clicking through scenes. */
function playHands(s: Session, n: number) {
  for (let i = 0; i < n && !s.snapshot().outcome; i++) {
    while (s.inScene) s.advanceScene();
    s.startHand();
    let guard = 0;
    while (s.handInProgress) {
      if (++guard > 200) throw new Error('hand did not finish');
      while (s.inScene) s.advanceScene();
      if (!s.handInProgress) break;
      if (s.toAct === HUMAN) {
        const limit = s.drawLimit();
        if (limit !== null) {
          s.draw([]);
          continue;
        }
        const legal = s.legal()!;
        if (legal.canBringIn) s.act({ type: 'bring-in' });
        else s.act(legal.canCheck ? { type: 'check' } : { type: 'call' });
      } else s.botStep();
    }
  }
}

const session = (c: Chapter, seed: number) => {
  const deal = seeded(seed * 7919);
  return new Session(c, { seed, dealRng: (n) => deal.int(n), skipTutorial: true, simTrials: 8 });
};

/** What the player sees between hands, minus the last hand's cards and talk. */
const table = (s: Session) => {
  const { hand: _hand, speech: _speech, tells: _tells, ...rest } = s.snapshot();
  return rest;
};

describe('a chapter left part-way', () => {
  it('cannot be saved before the first hand or during one', () => {
    const s = session(CHAPTERS[0].chapter, 1);
    expect(s.saveTable()).toBeNull();
    while (s.inScene) s.advanceScene();
    s.startHand();
    expect(s.handInProgress).toBe(true);
    expect(s.saveTable()).toBeNull();
  });

  // Every chapter: play a while, save through JSON, resume, and the table is the same.
  for (const { chapter } of CHAPTERS) {
    it(`${chapter.id}: resumes at the same table and plays on`, () => {
      const s = session(chapter, 3);
      playHands(s, 9);
      if (s.snapshot().outcome) return; // finished already: nothing to save
      const saved = JSON.parse(JSON.stringify(s.saveTable())) as SavedTable;
      expect(saved.handNumber).toBe(9);
      const r = Session.resume(chapter, saved, { seed: 4, simTrials: 8 })!;
      expect(r).not.toBeNull();
      expect(table(r)).toEqual(table(s));
      expect(r.currentGame.id).toBe(s.currentGame.id);
      expect(r.saveTable()).toEqual(saved);
      const money = r.snapshot().seats.reduce((n, x) => n + x.stack, 0) - r.snapshot().boughtIn;
      playHands(r, 6);
      const after = r.snapshot();
      expect(after.handNumber).toBeGreaterThan(9);
      expect(after.seats.reduce((n, x) => n + x.stack, 0) - after.boughtIn).toBe(money);
    });
  }

  it('keeps a story beat already played (the stake on the table)', () => {
    const river = chapterById('riverboat')!;
    for (let seed = 1; seed < 40; seed++) {
      const s = session(river, seed);
      playHands(s, 14);
      const snap = s.snapshot();
      if (snap.outcome || snap.stakeHolder === null) continue;
      const r = Session.resume(river, JSON.parse(JSON.stringify(s.saveTable())))!;
      expect(r.snapshot().stakeHolder).toBe(snap.stakeHolder);
      return;
    }
    throw new Error('no seed put the stake up in 14 hands');
  });

  it('is refused if it no longer fits the chapter', () => {
    const river = chapterById('riverboat')!;
    const s = session(river, 2);
    playHands(s, 2);
    const saved = s.saveTable()!;
    expect(Session.resume(chapterById('camp')!, saved)).toBeNull();
    expect(Session.resume(river, { ...saved, version: TABLE_SAVE_VERSION + 1 })).toBeNull();
    expect(Session.resume(river, { ...saved, stageIndex: 99 })).toBeNull();
    expect(Session.resume(river, { ...saved, seats: saved.seats.slice(1) })).toBeNull();
  });
});

describe('saved progress', () => {
  it('records chapters won and keeps tables per chapter', () => {
    const store = memory();
    let p = loadProgress(store);
    p = record(p, 'riverboat', 'won', store);
    expect(Object.keys(loadProgress(store).won)).toEqual(['riverboat']);

    const s = session(chapterById('camp')!, 5);
    playHands(s, 3);
    saveTable(s.saveTable()!, store);
    expect(loadTables(store).camp.handNumber).toBe(3);
    expect(latestTable(loadTables(store))?.chapterId).toBe('camp');

    clearTable('camp', store);
    expect(loadTables(store)).toEqual({});

    saveTable(s.saveTable()!, store);
    resetProgress(store);
    expect(loadTables(store)).toEqual({});
    expect(loadProgress(store).won).toEqual({});
  });

  it('survives broken or missing storage', () => {
    const store = memory();
    store.data.set('historical-poker/progress', '{not json');
    store.data.set('historical-poker/tables', 'null');
    expect(loadProgress(store).won).toEqual({});
    expect(loadTables(store)).toEqual({});
    expect(loadTables(null)).toEqual({});
  });
});
