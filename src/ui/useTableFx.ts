/**
 * Table effects: compares each snapshot with the one before and turns what
 * changed into sounds (src/ui/sound.ts) and chips flying across the felt.
 *
 *   new cards          -> a card swish per card (a flip for board cards)
 *   a bet, call, raise -> chips slide from that seat to the pot, with a clack
 *   a check            -> two knocks on the table
 *   a fold             -> a soft swish
 *   your draw          -> a riffle
 *   the hand ends      -> the pot slides to the winner(s); a flourish if it's you
 *   your turn          -> a quiet bell
 *
 * The Session knows nothing about any of this: effects are only drawn from
 * snapshots, so they can't change the game. Card deal-in and flip
 * animations are plain CSS on mount (styles.css, "Motion").
 */
import { useEffect, useRef, useState } from 'react';
import type { SeatIndex } from '@rsdp/engine/core';
import type { Chapter } from '../chapters/types';
import { HUMAN, type Snapshot } from '../table/session';
import { sfx, type Sfx } from './sound';

export interface Point {
  x: number;
  y: number;
}

export interface Flight {
  id: number;
  from: Point;
  to: Point;
  delay: number;
  /** Bigger stack for the pot going to a winner. */
  big: boolean;
}

/** Where the player's own chips sit, in stage pixels. */
export const PLAYER_SPOT: Point = { x: 800, y: 760 };

export function seatSpot(chapter: Chapter, seat: SeatIndex): Point {
  if (seat === HUMAN) return PLAYER_SPOT;
  const p = chapter.rivals[seat - 1].plate;
  return { x: p.x, y: p.y + 46 };
}

/**
 * Where the pot sits: in the middle of the felt, below the seat across.
 * In flop games the board takes the middle, and on small screens the
 * enlarged name plates fill it, so then the pot moves up between the left
 * and middle seats.
 */
export function potSpot(flop: boolean, compact = false): Point {
  return flop || compact ? { x: 585, y: 462 } : { x: 800, y: 640 };
}

const FLIGHT_MS = 650;
let nextId = 1;

function cardCount(snap: Snapshot): number {
  const h = snap.hand;
  if (!h) return 0;
  return Object.entries(h.players).reduce((n, [seat, p]) => n + (Number(seat) === HUMAN ? 0 : p.cards.length), 0) + h.myCards.length;
}

export function useTableFx(chapter: Chapter, snap: Snapshot, compact: boolean): Flight[] {
  const prev = useRef<Snapshot | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);

  const hand = snap.hand;
  const key = [
    snap.handNumber,
    hand?.street,
    hand?.phase,
    hand?.complete,
    hand?.toAct,
    hand?.pot,
    hand?.boards.map((b) => b.length).join(','),
    hand?.myCards.map((c) => c.card).join(','),
    hand && Object.values(hand.players).map((p) => `${p.lastAction}:${p.bet}:${p.folded}:${p.cards.length}`).join('|'),
    snap.scene?.text,
  ].join('/');

  useEffect(() => {
    const before = prev.current;
    prev.current = snap;
    const h = snap.hand;
    if (!h) return;
    const flop = snap.play.family === 'flop';
    const pot = potSpot(flop, compact);
    const add: Flight[] = [];
    const sounds: [Sfx, number][] = [];
    const sameHand = !!before?.hand && before.handNumber === snap.handNumber;

    // Cards.
    const dealt = cardCount(snap) - (sameHand ? cardCount(before!) : 0);
    const myDrew = sameHand && before!.hand!.myCards.length === h.myCards.length && before!.hand!.myCards.some((c, i) => c.card !== h.myCards[i].card);
    if (myDrew) sounds.push(['draw', 0]);
    else for (let i = 0; i < Math.min(dealt, 8); i++) sounds.push(['deal', i * 55]);
    const boardNow = h.boards.reduce((n, b) => n + b.length, 0);
    const boardBefore = sameHand ? before!.hand!.boards.reduce((n, b) => n + b.length, 0) : 0;
    for (let i = 0; i < Math.min(boardNow - boardBefore, 5); i++) sounds.push(['flip', 120 + i * 90]);

    // Betting.
    if (!sameHand) {
      // Antes and blinds go in as the hand starts.
      for (const seat of Object.keys(h.players).map(Number)) add.push({ id: nextId++, from: seatSpot(chapter, seat), to: pot, delay: seat * 40, big: false });
      sounds.push(['chip', 0]);
    } else {
      for (const [k, p] of Object.entries(h.players)) {
        const seat = Number(k);
        const was = before!.hand!.players[seat];
        if (!was) continue;
        if (p.folded && !was.folded) sounds.push(['fold', 0]);
        else if (p.bet > was.bet) {
          add.push({ id: nextId++, from: seatSpot(chapter, seat), to: pot, delay: 0, big: p.lastAction === 'All in' });
          sounds.push([p.lastAction === 'All in' ? 'chips' : 'chip', 0]);
        } else if (p.lastAction === 'Check' && was.lastAction !== 'Check') sounds.push(['check', 0]);
      }
    }

    // The pot goes to the winners.
    if (h.complete && !(sameHand && before!.hand!.complete)) {
      const seats = [...new Set(h.winners.map((w) => w.seat))];
      seats.forEach((seat, i) => add.push({ id: nextId++, from: pot, to: seatSpot(chapter, seat), delay: 350 + i * 120, big: true }));
      const mine = h.winners.filter((w) => w.seat === HUMAN).reduce((n, w) => n + w.amount, 0);
      const showdown = Object.values(h.players).some((p) => p.handName);
      if (mine > 0) sounds.push([mine >= h.pot * 0.9 && h.pot >= snap.play.unit * 8 ? 'bigWin' : 'win', 350]);
      else if (showdown && !h.players[HUMAN]?.folded) sounds.push(['lose', 350]);
      else sounds.push(['chips', 350]);
    }

    // Your turn.
    if (h.toAct === HUMAN && !snap.scene && !h.complete && (before?.hand?.toAct !== HUMAN || before?.scene)) sounds.push(['turn', 150]);

    for (const [s, d] of sounds) sfx(s, d);
    if (add.length) {
      setFlights((f) => [...f, ...add]);
      const ids = new Set(add.map((a) => a.id));
      const longest = Math.max(...add.map((a) => a.delay)) + FLIGHT_MS + 50;
      window.setTimeout(() => setFlights((f) => f.filter((x) => !ids.has(x.id))), longest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return flights;
}
