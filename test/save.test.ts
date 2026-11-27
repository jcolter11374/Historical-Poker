/**
 * Saving: progress and settings, and a chapter left part-way (the table after
 * the last finished hand) picked up again exactly where it stood.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { seeded } from '../src/bots/random';
import { CHAPTERS, chapterById } from '../src/chapters';
import type { Chapter } from '../src/chapters/types';
import { clearSlot, clearTable, currentSlot, latestTable, loadProgress, loadTables, nameSlot, pickSlot, record, resetProgress, saveTable, setOption, SLOT_COUNT, slotSummaries, type Store } from '../src/progress/save';
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

/** What the player sees between hands, minus the last hand's cards, talk and reactions. */
const table = (s: Session) => {
  const { hand: _hand, speech: _speech, tells: _tells, mood: _mood, bigPot: _bigPot, ...rest } = s.snapshot();
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

  it('is still picked up when the dealer has just gone broke and left the table', () => {
    // The buck stays in front of the seat that dealt until the next deal, even if that player is out.
    let seen = 0;
    for (const { chapter } of CHAPTERS.slice(0, 5)) {
      for (let seed = 1; seed < 40; seed++) {
        const s = session(chapter, seed);
        for (let h = 0; h < 60 && !s.snapshot().outcome; h++) {
          playHands(s, 1);
          const snap = s.snapshot();
          if (snap.outcome || !snap.seats[snap.button].out) continue;
          seen++;
          const saved = JSON.parse(JSON.stringify(s.saveTable())) as SavedTable;
          const r = Session.resume(chapter, saved, { seed: 4, simTrials: 8 });
          expect(r, `${chapter.id}, seed ${seed}, hand ${snap.handNumber}`).not.toBeNull();
          expect(table(r!)).toEqual(table(s));
          playHands(r!, 2);
          // The buck moved on to someone still playing.
          const after = r!.snapshot();
          if (!after.outcome) expect(after.seats[after.button].out).toBe(false);
        }
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

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

describe('the opening is shown once', () => {
  it('is remembered with progress, and an older save has not seen it', async () => {
    const { sawOpening } = await import('../src/progress/save');
    const store = memory();
    expect(loadProgress(store).seenOpening).toBe(false);
    sawOpening(loadProgress(store), store);
    expect(loadProgress(store).seenOpening).toBe(true);
    store.setItem('historical-poker/progress', JSON.stringify({ version: 1, won: { riverboat: 'x' }, played: {}, hints: true, sound: true, music: true, math: false, mathStars: 0 }));
    expect(loadProgress(store)).toMatchObject({ won: { riverboat: 'x' }, seenOpening: false });
  });
});

describe('save slots', () => {
  // The slot in play is remembered by the module: put it back for the other tests.
  afterEach(() => pickSlot(1, memory()));

  const table = (chapterId: string): SavedTable => {
    const s = new Session(chapterById(chapterId)!);
    playHands(s, 1);
    return s.saveTable()!;
  };

  it('a save from before slots existed is slot 1, untouched', () => {
    const s = memory();
    s.setItem('historical-poker/progress', JSON.stringify({ version: 1, won: { riverboat: '2026-11-20T00:00:00Z' }, played: { riverboat: '2026-11-20T00:00:00Z' }, hints: false, sound: true, music: true, math: false, mathStars: 0, seenOpening: true }));
    pickSlot(1, s);
    expect(Object.keys(loadProgress(s).won)).toEqual(['riverboat']);
    expect(loadProgress(s).hints).toBe(false);
    const [one, two, three] = slotSummaries(s);
    expect(one).toMatchObject({ slot: 1, name: 'Player 1', used: true, won: 1 });
    expect(two.used).toBe(false);
    expect(three.used).toBe(false);
    expect(slotSummaries(s)).toHaveLength(SLOT_COUNT);
  });

  it('each slot keeps its own progress, settings and tables', () => {
    const s = memory();
    pickSlot(1, s);
    const first = CHAPTERS[0].chapter.id;
    const second = CHAPTERS[1].chapter.id;
    record(loadProgress(s), first, 'won', s);
    saveTable(table(first), s);

    pickSlot(2, s);
    expect(loadProgress(s).won).toEqual({});
    expect(loadTables(s)).toEqual({});
    setOption(record(loadProgress(s), second, 'won', s), 'math', true, s);
    saveTable(table(second), s);

    pickSlot(1, s);
    expect(Object.keys(loadProgress(s).won)).toEqual([first]);
    expect(loadProgress(s).math).toBe(false);
    expect(Object.keys(loadTables(s))).toEqual([first]);
    pickSlot(2, s);
    expect(Object.keys(loadProgress(s).won)).toEqual([second]);
    expect(loadProgress(s).math).toBe(true);
    expect(Object.keys(loadTables(s))).toEqual([second]);
    expect(slotSummaries(s)[1].latest?.chapterId).toBe(second);
  });

  it('remembers the slot played last, and ignores a slot that does not exist', () => {
    const s = memory();
    pickSlot(3, s);
    expect(JSON.parse(s.getItem('historical-poker/slots')!).current).toBe(3);
    pickSlot(7, s);
    pickSlot(0, s);
    expect(currentSlot(s)).toBe(3);
  });

  it('names are tidied, and an unnamed slot is "Player n"', () => {
    const s = memory();
    nameSlot(2, '   Anna   Sophia of the very long name  ', s);
    expect(slotSummaries(s)[1]).toMatchObject({ name: 'Anna Sophia of', used: true });
    nameSlot(2, '  ', s);
    expect(slotSummaries(s)[1]).toMatchObject({ name: 'Player 2', used: false });
  });

  it('"Start over" wipes only the slot in play; clearing a slot empties it and leaves the others', () => {
    const s = memory();
    const first = CHAPTERS[0].chapter.id;
    for (const n of [1, 2, 3]) {
      pickSlot(n, s);
      nameSlot(n, `P${n}`, s);
      record(loadProgress(s), first, 'won', s);
      saveTable(table(first), s);
    }
    pickSlot(2, s);
    resetProgress(s);
    expect(slotSummaries(s).map((x) => [x.name, x.won, !!x.latest])).toEqual([['P1', 1, true], ['P2', 0, false], ['P3', 1, true]]);
    clearSlot(3, s);
    expect(slotSummaries(s).map((x) => [x.name, x.used])).toEqual([['P1', true], ['P2', true], ['Player 3', false]]);
    expect(currentSlot(s)).toBe(2);
  });

  it('broken slot data falls back to slot 1 with no names', () => {
    const s = memory();
    s.setItem('historical-poker/slots', '{not json');
    expect(slotSummaries(s).map((x) => x.name)).toEqual(['Player 1', 'Player 2', 'Player 3']);
  });
});
