/**
 * Locks in each game's structure as it is actually dealt at the table, for
 * every game and betting kind any chapter uses:
 *
 * - the deal: cards down, up and on the board, street by street;
 * - draws: every draw round is offered to a player still in, before the
 *   betting that follows it, and never more cards than the rule allows;
 * - limits: fixed-limit bets and raises are exactly one small or big bet,
 *   capped at four bets a round; pot-limit never exceeds the pot; no-limit
 *   goes up to the whole purse;
 * - stud: the right up card brings in.
 *
 * It plays whole sittings with a player who raises the minimum whenever
 * allowed (to push the limits) and one who only calls (to reach showdowns).
 */
import { describe, expect, it } from 'vitest';
import type { Card } from '@rsdp/engine/core';
import { seeded } from '../src/bots/random';
import { CHAPTERS } from '../src/chapters';
import { getGame } from '../src/games/catalog';
import { HUMAN, Session } from '../src/table/session';

const RANKS = '23456789TJQKA';
/** Draw rounds each draw game must offer. */
const DRAWS: Record<string, number> = { 'primero-1543': 1, 'draw5-1876': 1, td27: 3, badugi: 3 };

interface Seen {
  hands: number;
  showdowns: number;
  raisesOffered: number;
  draws: number;
  caps: number;
}

function audit(chapterId: string, policy: 'raises' | 'calls', seed: number, maxHands: number, seen: Record<string, Seen>) {
  const chapter = CHAPTERS.find((c) => c.chapter.id === chapterId)!.chapter;
  const deal = seeded(seed * 7919);
  const s = new Session(chapter, { seed, dealRng: (n) => deal.int(n), skipTutorial: true, simTrials: 12 });
  const skip = () => {
    while (s.inScene) s.advanceScene();
  };
  skip();
  for (let h = 0; h < maxHands && !s.snapshot().outcome; h++) {
    skip();
    s.startHand();
    const play = s.snapshot().play;
    const game = getGame(play.gameId);
    const spec = game.spec;
    const label = `${play.name} (${play.betting})`;
    const rec = (seen[`${play.gameId}/${play.betting}`] ??= { hands: 0, showdowns: 0, raisesOffered: 0, draws: 0, caps: 0 });
    rec.hands++;
    const drawStreets = spec.streets.map((x, i) => (x.drawMaxDiscard != null ? i : -1)).filter((i) => i >= 0);
    expect(drawStreets.length, `${label}: draw rounds in the rules`).toBe(DRAWS[play.gameId] ?? 0);
    const drewAt = new Set<number>();
    let guard = 0;
    let street = -1;
    while (s.handInProgress) {
      if (++guard > 400) throw new Error(`${label}: hand did not finish`);
      skip();
      if (!s.handInProgress) break;
      const hv = s.snapshot().hand!;
      const st = spec.streets[hv.street];
      if (hv.street !== street) {
        street = hv.street;
        // The deal so far: cards down and up for everyone still in, and the board.
        const upto = spec.streets.slice(0, street + 1);
        const down = upto.reduce((n, x) => n + x.dealDown, 0);
        const up = upto.reduce((n, x) => n + x.dealUp, 0);
        const board = upto.reduce((n, x) => n + x.dealBoard, 0);
        expect(hv.myCards.length, `${label}, ${hv.streetName}: your cards`).toBe(down + up);
        expect(hv.myCards.filter((c) => c.up).length, `${label}, ${hv.streetName}: your up cards`).toBe(up);
        expect(hv.boards[0]?.length ?? 0, `${label}, ${hv.streetName}: board cards`).toBe(board);
        for (const seat of [1, 2, 3]) {
          const p = hv.players[seat];
          if (!p || p.folded) continue;
          expect(p.cards.length, `${label}, ${hv.streetName}: seat ${seat} cards`).toBe(down + up);
          expect(p.cards.filter((c) => c !== null).length, `${label}, ${hv.streetName}: seat ${seat} cards showing`).toBe(up);
        }
      }
      if (s.toAct !== HUMAN) {
        const who = s.toAct!;
        s.botStep();
        const after = s.snapshot().hand!;
        if (after.players[who]?.lastAction === 'Bring-in') checkBringIn(after, who, play.gameId, label);
        continue;
      }
      const limit = s.drawLimit();
      if (limit !== null) {
        expect(st.drawMaxDiscard, `${label}: a draw on a street without one`).not.toBeUndefined();
        expect(drewAt.has(hv.street), `${label}: two draws in one round`).toBe(false);
        drewAt.add(hv.street);
        rec.draws++;
        expect(hv.draw, `${label}: the draw is shown to the player`).not.toBeNull();
        const cards = hv.myCards.map((c) => c.card);
        expect(s.drawProblem(cards.map((_, i) => i).slice(0, limit + 1)) !== null || limit >= cards.length, `${label}: more than the limit refused`).toBe(true);
        let d = game.discards?.(cards, limit) ?? [];
        if (s.drawProblem(d)) d = d.slice(0, 3);
        s.draw(d);
        expect(s.snapshot().hand!.myCards.length, `${label}: same number of cards after the draw`).toBe(cards.length);
        continue;
      }
      // A betting turn. In a draw round, the draw must have come first.
      if (st.drawMaxDiscard != null) expect(drewAt.has(hv.street), `${label}, ${hv.streetName}: asked to bet before drawing`).toBe(true);
      const legal = hv.legal!;
      const me = hv.players[HUMAN];
      const stack = s.snapshot().seats[HUMAN].stack;
      const unit = play.unit;
      const size = st.betSize === 'big' ? unit * 2 : unit;
      if (legal.canBringIn) checkBringIn(hv, HUMAN, play.gameId, label);
      if (legal.canRaise) {
        rec.raisesOffered++;
        const current = me.bet + legal.callAmount;
        const allIn = me.bet + stack;
        // A short all-in adds less than a full bet, which shifts the ladder; the plain sizes hold when nobody is all in.
        const shortAllIn = Object.values(hv.players).some((p) => p.lastAction === 'All in');
        if (play.betting === 'fixed-limit') {
          expect(legal.minTo, `${label}, ${hv.streetName}: limit bets have one size`).toBe(legal.maxTo);
          // Completing a bring-in makes it one full bet; anything else adds exactly one bet. Short purses go all in.
          const full = spec.family === 'stud' && hv.street === 0 && current < size ? size : current + size;
          if (!shortAllIn) {
            expect(legal.minTo, `${label}, ${hv.streetName}: limit bet size`).toBe(Math.min(full, allIn));
            expect(legal.minTo, `${label}, ${hv.streetName}: four bets cap a round`).toBeLessThanOrEqual(size * 4);
          }
        } else if (play.betting === 'pot-limit') {
          // The most you may raise to: call, then raise by the pot as it then stands.
          expect(legal.maxTo, `${label}, ${hv.streetName}: no bet bigger than the pot`).toBeLessThanOrEqual(Math.min(allIn, current + hv.pot + legal.callAmount));
          expect(legal.minTo).toBeLessThanOrEqual(legal.maxTo);
        } else {
          expect(legal.maxTo, `${label}, ${hv.streetName}: no limit means the whole purse`).toBe(allIn);
        }
      }
      if (play.betting === 'fixed-limit' && !legal.canRaise && !legal.canCheck && stack > legal.callAmount + size && !Object.values(hv.players).some((p) => p.lastAction === 'All in')) {
        // Chips left, nobody all in, and still no raise offered: the round has had its four bets.
        expect(me.bet + legal.callAmount, `${label}, ${hv.streetName}: raising stops at four bets`).toBe(size * 4);
        rec.caps++;
      }
      if (policy === 'raises' && legal.canRaise) s.act({ type: legal.raiseKind, to: legal.minTo });
      else s.act(legal.canBringIn ? { type: 'bring-in' } : legal.canCheck ? { type: 'check' } : { type: 'call' });
    }
    skip();
    const end = s.snapshot().hand!;
    const mine = end.players[HUMAN];
    if (!end.summary!.startsWith('Everyone else folded') && mine && !mine.folded) {
      rec.showdowns++;
      // A hand that reached the showdown went through every draw round.
      expect(drewAt.size, `${label}: draw rounds played before the showdown`).toBe(drawStreets.length);
      expect(end.myCards.length, `${label}: cards at the showdown`).toBe(spec.streets.reduce((n, x) => n + x.dealDown + x.dealUp, 0));
    }
  }
}

/** The bring-in goes to the lowest up card (aces high), or in Razz the highest (aces low). */
function checkBringIn(hv: NonNullable<ReturnType<Session['snapshot']>['hand']>, seat: number, gameId: string, label: string) {
  const razz = gameId === 'razz';
  const value = (c: Card) => (razz && c[0] === 'A' ? -1 : RANKS.indexOf(c[0]));
  const upOf = (i: number): Card[] => (i === HUMAN ? hv.myCards.filter((c) => c.up).map((c) => c.card) : (hv.players[i].cards.filter((c) => c !== null) as Card[]));
  const mine = value(upOf(seat)[0]);
  for (const i of [0, 1, 2, 3]) {
    const p = hv.players[i];
    if (!p || i === seat || upOf(i).length === 0) continue;
    if (razz) expect(mine, `${label}: the highest up card brings in`).toBeGreaterThanOrEqual(value(upOf(i)[0]));
    else expect(mine, `${label}: the lowest up card brings in`).toBeLessThanOrEqual(value(upOf(i)[0]));
  }
}

describe('every game is dealt and bet by its own rules', () => {
  const seen: Record<string, Seen> = {};
  for (const { chapter } of CHAPTERS) {
    it(`${chapter.title}: ${chapter.teaches}`, () => {
      for (const seed of [1, 2, 3]) {
        audit(chapter.id, 'raises', seed, 40, seen);
        audit(chapter.id, 'calls', seed + 10, 40, seen);
      }
    });
  }

  it('saw every game in every betting kind, with raises offered, showdowns reached and draws taken', () => {
    const wanted = new Set<string>();
    for (const { chapter } of CHAPTERS) for (const st of chapter.stages) for (const g of st.games) wanted.add(`${g.game}/${g.betting}`);
    for (const key of wanted) {
      const r = seen[key];
      expect(r, `${key} was never dealt`).toBeTruthy();
      expect(r.raisesOffered, `${key}: no raise was ever offered`).toBeGreaterThan(0);
      expect(r.showdowns, `${key}: no showdown reached`).toBeGreaterThan(0);
      if (DRAWS[key.split('/')[0]]) expect(r.draws, `${key}: no draw taken`).toBeGreaterThan(0);
    }
    const capped = Object.entries(seen).filter(([k, r]) => k.endsWith('/fixed-limit') && r.caps > 0);
    expect(capped.length, 'limit games where a round was raised to the four-bet cap').toBeGreaterThan(3);
    {
    }
  });

  it('plays the stud games at fixed limits', () => {
    for (const { chapter } of CHAPTERS) for (const st of chapter.stages) for (const g of st.games) {
      if (getGame(g.game).spec.family === 'stud') expect(g.betting, `${chapter.title}: ${g.game}`).toBe('fixed-limit');
    }
  });
});
