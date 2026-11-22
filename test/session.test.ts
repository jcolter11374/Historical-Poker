import { describe, expect, it } from 'vitest';
import type { Card } from '@rsdp/engine/core';
import { seeded } from '../src/bots/random';
import { chapterById } from '../src/chapters';
import { LAST_TABLE } from '../src/chapters/lastTable';
import { RIVERBOAT } from '../src/chapters/riverboat';
import { getGame } from '../src/games/catalog';
import { HUMAN, Session } from '../src/table/session';
import { playOut } from './helpers';

describe('a riverboat session', () => {
  it('plays many full games without breaking, keeping every dollar accounted for', () => {
    for (let seed = 1; seed <= 12; seed++) playOut(seed, 'calls', { accuse: seed % 3 === 0 ? 0.5 : 0 });
  });

  it('ends in a loss when the player only ever folds', () => {
    const { s } = playOut(3, 'folds', { maxHands: 2000 });
    expect(s.snapshot().outcome).toBe('lost');
  });

  it('starts with the narrator holding the buck and the player seeing five cards', () => {
    const s = new Session(RIVERBOAT, { seed: 1, skipTutorial: true });
    s.startHand();
    const snap = s.snapshot();
    expect(snap.seats[snap.button].character?.id).toBe('delphine');
    expect(snap.hand!.myCards).toHaveLength(5);
    expect(snap.hand!.pot).toBe(4); // four $1 antes
  });

  it('refuses moves out of turn', () => {
    const s = new Session(RIVERBOAT, { seed: 2, skipTutorial: true });
    s.startHand();
    if (s.toAct !== HUMAN) expect(() => s.act({ type: 'fold' })).toThrow();
  });
});

describe('a finished hand in a rotation', () => {
  it('is still described by its own game after the next game is set up', () => {
    // HORSE changes game every few hands; between hands `play` is already the next game.
    const deal = seeded(41);
    const s = new Session(LAST_TABLE, { seed: 41, dealRng: (n) => deal.int(n), skipTutorial: true, simTrials: 16 });
    let changes = 0;
    for (let n = 0; n < 40 && !s.snapshot().outcome; n++) {
      while (s.inScene) s.advanceScene();
      s.startHand();
      const play = s.snapshot().play;
      const game = getGame(play.gameId);
      while (s.handInProgress) {
        while (s.inScene) s.advanceScene();
        if (!s.handInProgress) break;
        if (s.toAct === HUMAN) {
          if (s.drawLimit() !== null) s.draw([]);
          else {
            const legal = s.legal()!;
            s.act(legal.canBringIn ? { type: 'bring-in' } : legal.canCheck ? { type: 'check' } : { type: 'call' });
          }
        } else s.botStep();
      }
      const snap = s.snapshot();
      if (snap.play.gameId !== play.gameId) changes++;
      const hand = snap.hand!;
      expect(hand.family).toBe(play.family);
      const board = hand.boards[0] ?? [];
      for (const p of Object.values(hand.players)) {
        if (p.handName) expect(p.handName).toBe(game.describe(p.cards as Card[], board) || null);
      }
      if (hand.myCards.length) expect(hand.myHandName).toBe(game.describe(hand.myCards.map((c) => c.card), board));
    }
    expect(changes).toBeGreaterThan(2);
  });
});

describe('blinds on the felt', () => {
  it('names the blinds in front of the players until they act', () => {
    const s = new Session(chapterById('desert-classic')!, { seed: 3, skipTutorial: true });
    while (s.inScene) s.advanceScene();
    s.startHand();
    while (s.inScene) s.advanceScene();
    const players = Object.values(s.snapshot().hand!.players);
    const posted = players.map((p) => p.posted).filter(Boolean).sort();
    expect(posted).toEqual(['big blind', 'small blind']);
    for (const p of players) if (p.posted) expect(p.bet).toBeGreaterThan(0);
  });
});
