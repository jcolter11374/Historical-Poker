import { describe, expect, it } from 'vitest';
import { LAST_HAND } from '../src/chapters/lastHand';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { evaluate1836 } from '../src/games/straightPoker';
import { HUMAN, Session } from '../src/table/session';
import { seeded } from '../src/bots/random';
import { playOut } from './helpers';

/** A seeded shuffle, so a test deals the same cards every run (the game itself deals with crypto). */
const dealFrom = (seed: number) => {
  const deal = seeded(seed * 7919 + 17);
  return (n: number) => deal.int(n);
};

const skip = (s: Session) => {
  while (s.inScene) s.advanceScene();
};

/** Plays hands (human checks or calls) until `until` is true or the chapter ends. */
function playUntil(s: Session, until: () => boolean, maxHands = 300) {
  for (let h = 0; h < maxHands && !until() && !s.snapshot().outcome; h++) {
    skip(s);
    s.startHand();
    while (s.handInProgress && !until()) {
      skip(s);
      if (!s.handInProgress) break;
      if (s.toAct === HUMAN) s.act(s.legal()!.canCheck ? { type: 'check' } : { type: 'call' });
      else s.botStep();
    }
  }
}

describe('chapter 1 story', () => {
  it('opens with Delphine explaining the game before any card is dealt', () => {
    const s = new Session(RIVERBOAT, { seed: 1 });
    expect(s.snapshot().scene?.name).toBe('Delphine');
    expect(() => s.startHand()).toThrow();
  });

  it('deals the tutorial hand from the set deck and points out Ezra’s tell', () => {
    const s = new Session(RIVERBOAT, { seed: 1 });
    skip(s);
    s.startHand();
    expect(evaluate1836(s.snapshot().hand!.myCards.map((c) => c.card)).name).toBe('Two pairs, kings and queens');
    // Silas acts first, then Ezra; his tell shows and Delphine explains it.
    while (!s.inScene && s.toAct !== HUMAN) s.botStep();
    const snap = s.snapshot();
    expect(s.inScene).toBe(true);
    expect(snap.tells[3]).toContain(RIVERBOAT.rivals[2].tell.text);
    expect(snap.scene?.name).toBe('Delphine');
  });

  it('puts the deck on the table after a few hands', () => {
    const s = new Session(RIVERBOAT, { seed: 4, dealRng: dealFrom(4), skipTutorial: true });
    playUntil(s, () => s.snapshot().stakeHolder !== null);
    const snap = s.snapshot();
    if (!snap.outcome) expect(snap.seats[snap.stakeHolder!].character?.id).toBe('silas');
  });

  it('calls off the hand and gives the money back when the player catches Silas cheating', () => {
    let caught = 0;
    for (let seed = 1; seed <= 30 && caught < 3; seed++) {
      const s = new Session(RIVERBOAT, { seed, dealRng: dealFrom(seed), skipTutorial: true });
      // Play until Silas deals himself four aces (or the game ends).
      playUntil(s, () => {
        const tells = s.snapshot().tells[2] ?? [];
        return s.handInProgress && tells.includes(RIVERBOAT.story!.cheat!.tell);
      });
      if (!s.canAccuse() || !(s.snapshot().tells[2] ?? []).includes(RIVERBOAT.story!.cheat!.tell)) continue;
      // Purses are shown as they stand mid-hand (antes and bets already out), so the pot is what must come back.
      const before = s.snapshot().seats.map((x) => x.stack);
      const pot = s.snapshot().hand!.pot;
      s.accuse();
      const after = s.snapshot();
      expect(after.hand).toBeNull();
      expect(after.redeal).toBe(true);
      const back = after.seats.map((x, i) => x.stack - before[i]);
      expect(back.every((n) => n >= 1)).toBe(true); // at least the $1 ante each
      expect(back.reduce((a, b) => a + b, 0)).toBe(pot);
      skip(s);
      s.startHand();
      expect(s.canAccuse()).toBe(false); // caught once, he plays straight from then on
      caught++;
    }
    expect(caught).toBeGreaterThan(0);
  });

  it('fines the player for accusing an honest deal', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const s = new Session(RIVERBOAT, { seed, dealRng: dealFrom(seed), skipTutorial: true });
      playUntil(s, () => s.canAccuse() && !(s.snapshot().tells[2] ?? []).includes(RIVERBOAT.story!.cheat!.tell));
      if (!s.canAccuse()) continue;
      s.accuse();
      expect(s.snapshot().scene?.name).toBe('Silas');
      skip(s);
      expect(s.canAccuse()).toBe(false); // once per hand
      return;
    }
    throw new Error('no honest Silas deal found');
  });

  it('ends with the player and Silas heads-up, or a clear result', () => {
    for (let seed = 1; seed <= 12; seed++) {
      const { s } = playOut(seed, 'calls', { skipTutorial: true });
      const snap = s.snapshot();
      expect(snap.outcome).not.toBeNull();
      // Nobody else plays on once the finale starts.
      const bowed = snap.seats.filter((x) => x.left === 'bowed');
      for (const b of bowed) expect(b.stack).toBeGreaterThan(0);
    }
  });
});

describe('a hand called off for cheating', () => {
  it('does not swallow the story moment due before the next hand', () => {
    // The redeal takes the next hand number. In Deadwood Jasper usually first cheats on hand 6, so put a moment before hand 7.
    const due = { beforeHand: 7, lines: [{ who: 'narration', text: 'A moment due before hand seven.' }] };
    const chapter = { ...LAST_HAND, story: { ...LAST_HAND.story!, moments: [due] } };
    const cheat = chapter.story.cheat!;
    let caughtOnSix = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const deal = dealFrom(seed);
      const s = new Session(chapter, { seed, dealRng: deal, simTrials: 6 });
      const said: string[] = [];
      const skipAll = () => {
        while (s.inScene) {
          said.push(s.snapshot().scene!.text);
          s.advanceScene();
        }
      };
      let caught: number | null = null;
      for (let h = 0; h < 9 && !s.snapshot().outcome; h++) {
        skipAll();
        s.startHand();
        while (s.handInProgress) {
          skipAll();
          if (!s.handInProgress) break;
          const snap = s.snapshot();
          if (snap.canAccuse && Object.values(snap.tells).flat().includes(cheat.tell)) {
            caught = snap.handNumber;
            s.accuse();
            continue;
          }
          if (s.toAct === HUMAN) {
            if (s.drawLimit() !== null) s.draw([]);
            else s.act(s.legal()!.canCheck ? { type: 'check' } : { type: 'call' });
          } else s.botStep();
        }
        skipAll();
      }
      if (caught !== 6 || s.snapshot().handNumber < 8) continue;
      caughtOnSix++;
      expect(said, `seed ${seed}`).toContain(due.lines[0].text);
      expect(said.filter((t) => t === due.lines[0].text)).toHaveLength(1);
    }
    expect(caughtOnSix).toBeGreaterThan(0);
  });
});
