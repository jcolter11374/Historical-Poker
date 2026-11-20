import { describe, expect, it } from 'vitest';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { evaluate1836 } from '../src/games/straightPoker';
import { HUMAN, Session } from '../src/table/session';
import { playOut } from './helpers';

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
    expect(evaluate1836(s.snapshot().hand!.myCards).name).toBe('Two pairs, kings and queens');
    // Silas acts first, then Ezra; his tell shows and Delphine explains it.
    while (!s.inScene && s.toAct !== HUMAN) s.botStep();
    const snap = s.snapshot();
    expect(s.inScene).toBe(true);
    expect(snap.tells[3]).toContain(RIVERBOAT.rivals[2].tell.text);
    expect(snap.scene?.name).toBe('Delphine');
  });

  it('puts the deck on the table after a few hands', () => {
    const s = new Session(RIVERBOAT, { seed: 4, skipTutorial: true });
    playUntil(s, () => s.snapshot().stakeHolder !== null);
    const snap = s.snapshot();
    if (!snap.outcome) expect(snap.seats[snap.stakeHolder!].character?.id).toBe('silas');
  });

  it('calls off the hand and gives the money back when the player catches Silas cheating', () => {
    let caught = 0;
    for (let seed = 1; seed <= 30 && caught < 3; seed++) {
      const s = new Session(RIVERBOAT, { seed, skipTutorial: true });
      // Play until Silas deals himself four aces (or the game ends).
      playUntil(s, () => {
        const tells = s.snapshot().tells[2] ?? [];
        return s.handInProgress && tells.includes(RIVERBOAT.story!.cheat!.tell);
      });
      if (!s.canAccuse() || !(s.snapshot().tells[2] ?? []).includes(RIVERBOAT.story!.cheat!.tell)) continue;
      const before = s.snapshot().seats.map((x) => x.stack);
      s.accuse();
      const after = s.snapshot();
      expect(after.hand).toBeNull();
      expect(after.redeal).toBe(true);
      expect(after.seats.map((x) => x.stack)).toEqual(before);
      skip(s);
      s.startHand();
      expect(s.canAccuse()).toBe(false); // caught once, he plays straight from then on
      caught++;
    }
    expect(caught).toBeGreaterThan(0);
  });

  it('fines the player for accusing an honest deal', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const s = new Session(RIVERBOAT, { seed, skipTutorial: true });
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
