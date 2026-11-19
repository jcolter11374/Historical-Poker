/**
 * The table between hands: who is sitting where, their money, the buck
 * (dealer button), what the rivals say, and when the chapter is won or lost.
 *
 * The RSDP engine plays ONE hand at a time (packages/engine/src/core). This
 * file does the job RSDP's server runtime does for a real table, cut down to
 * one human and three bots in a browser: it builds each HandInput, feeds the
 * engine actions, and reads the result back.
 *
 * No React here. The UI (src/ui) calls these methods and re-renders from
 * snapshot(). Tests (test/session.test.ts) play whole games with it.
 */
import {
  engine,
  variants,
  type Action,
  type Card,
  type HandInput,
  type HandState,
  type LegalActions,
  type SeatIndex,
} from '@rsdp/engine/core';
import { cryptoRng, shuffle, type Rng } from '@rsdp/engine';
import { decide } from '../bots/personality';
import { seeded, type Random } from '../bots/random';
import { equity } from '../bots/strength';
import type { Chapter, Character } from '../chapters/types';
import { STRAIGHT_POKER, STRAIGHT_POKER_RULES, deck20, evaluate1836 } from '../games/straightPoker';

let registered = false;
function registerGames() {
  if (registered) return;
  variants.register(STRAIGHT_POKER, STRAIGHT_POKER_RULES);
  registered = true;
}

/** Seat 0 is always the human; 1-3 are the chapter's rivals in seat order (left, across, right). */
export const HUMAN: SeatIndex = 0;

export interface Seat {
  seat: SeatIndex;
  name: string;
  /** Null for the human. */
  character: Character | null;
  stack: number;
  /** Lost all their money and left the table. */
  out: boolean;
}

export interface Speech {
  seat: SeatIndex;
  text: string;
}

export type Outcome = 'won' | 'lost' | null;

export interface Snapshot {
  seats: Seat[];
  button: SeatIndex;
  handNumber: number;
  /** Null between hands. */
  hand: HandView | null;
  speech: Speech | null;
  /** Tells the player has noticed this hand, by seat. */
  tells: Record<SeatIndex, string>;
  outcome: Outcome;
}

export interface HandView {
  complete: boolean;
  toAct: SeatIndex | null;
  pot: number;
  /** The human's cards. */
  myCards: Card[];
  myHandName: string;
  /** Per seat: in the hand, folded, chips bet this round, last action, cards shown at showdown. */
  players: Record<SeatIndex, { inHand: boolean; folded: boolean; bet: number; lastAction: string | null; shown: Card[] | null; handName: string | null }>;
  /** Filled in when the hand is over. */
  winners: { seat: SeatIndex; amount: number; handName?: string }[];
  /** Legal moves when it is the human's turn. */
  legal: LegalActions | null;
}

export interface SessionOptions {
  /** Seed for bot decisions and tells; omit for a random one. */
  seed?: number;
  /** Shuffles the deck. Defaults to the browser's crypto random source. */
  dealRng?: Rng;
}

export class Session {
  readonly chapter: Chapter;
  private seats: Seat[];
  private button: SeatIndex;
  private handNumber = 0;
  private state: HandState | null = null;
  private speech: Speech | null = null;
  private tells: Record<SeatIndex, string> = {};
  private outcome: Outcome = null;
  private readonly rnd: Random;
  private readonly dealRng: Rng;

  constructor(chapter: Chapter, opts: SessionOptions = {}) {
    registerGames();
    this.chapter = chapter;
    this.rnd = seeded(opts.seed ?? Math.floor(Math.random() * 2 ** 31));
    this.dealRng = opts.dealRng ?? cryptoRng;
    const stack = chapter.stakes.startingStack;
    this.seats = [
      { seat: HUMAN, name: 'You', character: null, stack, out: false },
      ...chapter.rivals.map((c, i) => ({ seat: i + 1, name: c.name, character: c, stack, out: false })),
    ];
    // The narrator holds the buck for the first hand, so play starts to their left.
    this.button = this.seats.find((s) => s.character?.id === chapter.narratorId)?.seat ?? 1;
  }

  // ---------------------------------------------------------------- reading

  snapshot(): Snapshot {
    return {
      seats: this.seats.map((s) => ({ ...s })),
      button: this.button,
      handNumber: this.handNumber,
      hand: this.state ? this.handView(this.state) : null,
      speech: this.speech,
      tells: { ...this.tells },
      outcome: this.outcome,
    };
  }

  /** The seat whose turn it is, or null (between hands, or hand over). */
  get toAct(): SeatIndex | null {
    return this.state && this.state.phase === 'betting' ? this.state.toAct : null;
  }

  get handInProgress(): boolean {
    return this.state !== null && this.state.phase !== 'complete';
  }

  // ---------------------------------------------------------------- playing

  /** Deals the next hand. Moves the buck first, except before the first hand. */
  startHand(): void {
    if (this.outcome) throw new Error('the chapter is over');
    if (this.handInProgress) throw new Error('a hand is already being played');
    const live = this.seats.filter((s) => !s.out);
    if (this.handNumber > 0) this.button = this.nextLiveSeat(this.button);
    this.handNumber++;
    this.tells = {};
    const { ante, minBet } = this.chapter.stakes;
    const input: HandInput = {
      handId: `${this.chapter.id}-${this.handNumber}`,
      handNumber: this.handNumber,
      game: STRAIGHT_POKER,
      betting: 'pot-limit',
      stakes: { smallBlind: 0, bigBlind: minBet, ante, anteType: 'per-player', bringIn: 0, smallBet: minBet, bigBet: minBet * 2 },
      maxSeats: 4,
      seats: live.map((s) => ({ seat: s.seat, playerId: s.character?.id ?? 'you', stack: s.stack, away: false })),
      button: this.button,
      buttonDead: false,
      // Antes are dead money: they go in the pot but don't count as a bet to call.
      posts: live.map((s) => ({ seat: s.seat, kind: 'ante', amount: ante, live: false })),
      deck: shuffle(deck20(), this.dealRng),
      reshuffleSeed: 1,
      options: { boards: 1, bombPot: false, runItTwice: 'off', fixedLimitCap: 4, uncappedHeadsUp: false, showdown: 'show-all' },
      modifiers: [],
    };
    this.state = engine.startHand(input);
    const narrator = this.narratorSeat();
    this.say(narrator, this.handNumber === 1 ? 'Ante up, everyone. Five cards apiece.' : this.pick(['Ante up.', 'Fresh hand. Antes, please.', 'Five cards apiece.']));
    this.afterAction();
  }

  /** The human's legal moves, or null when it isn't their turn. */
  legal(): LegalActions | null {
    if (!this.state || this.toAct !== HUMAN) return null;
    return engine.legalActions(this.state, HUMAN);
  }

  /** The human acts. Throws if it isn't their turn or the move is illegal. */
  act(action: Action): void {
    if (!this.state || this.toAct !== HUMAN) throw new Error('not your turn');
    engine.act(this.state, HUMAN, action);
    this.afterAction();
  }

  /** If a rival is to act, they decide and act. Returns false when it's not a rival's turn. The UI calls this on a timer. */
  botStep(): boolean {
    const seat = this.toAct;
    if (!this.state || seat === null || seat === HUMAN) return false;
    const character = this.seats[seat].character!;
    const s = this.state;
    const legal = engine.legalActions(s, seat)!;
    const me = s.seats.find((x) => x.seat === seat)!;
    const opponents = s.seats.filter((x) => !x.folded && x.seat !== seat).length;
    const decision = decide(
      character.personality,
      {
        legal,
        equity: equity(me.cards.map((c) => c.card), opponents, this.rnd),
        opponents,
        pot: s.seats.reduce((n, x) => n + x.total, 0),
        currentBet: s.currentBet,
      },
      this.rnd,
    );
    engine.act(s, seat, decision.action);

    const kind = decision.action.type;
    const aggressive = kind === 'bet' || kind === 'raise';
    const tell = character.tell;
    if (tell.signals !== 'bluffing' || aggressive) {
      const truth = tell.signals === 'bluffing' ? decision.bluffing : tell.signals === 'strong' ? decision.strong : decision.weak;
      if (this.rnd.chance(truth ? tell.showsWhenTrue : tell.showsWhenFalse)) this.tells[seat] = tell.text;
    }
    const lines = character.lines;
    if (aggressive) this.say(seat, this.pick(lines.bet));
    else if (kind === 'call') this.say(seat, this.pick(lines.call));
    else if (kind === 'fold') this.say(seat, this.pick(lines.fold));
    else if (kind === 'check') this.say(seat, this.pick(lines.check));
    this.afterAction();
    return true;
  }

  // ---------------------------------------------------------------- internals

  private afterAction() {
    const s = this.state;
    if (!s || s.phase !== 'complete') return;
    for (const hs of s.seats) this.seats[hs.seat].stack = hs.stack;
    const winners = this.handView(s).winners;
    const top = winners[0];
    if (top && top.seat !== HUMAN) {
      const c = this.seats[top.seat].character!;
      this.say(top.seat, this.pick(c.lines.win));
    } else if (top) {
      this.say(this.narratorSeat(), top.handName ? `Your pot. ${top.handName}.` : 'The pot is yours.');
    }
    for (const seat of this.seats) {
      if (!seat.out && seat.stack === 0) {
        seat.out = true;
        if (seat.character) this.say(seat.seat, seat.character.lines.bust);
      }
    }
    // The chapter ends when the player is broke, or is the last one at the table.
    if (this.seats[HUMAN].out) this.outcome = 'lost';
    else if (this.seats.every((x) => x.seat === HUMAN || x.out)) this.outcome = 'won';
  }

  private handView(s: HandState): HandView {
    const shown = new Map<SeatIndex, { cards: Card[]; handName?: string }>();
    const winners: HandView['winners'] = [];
    for (const e of s.events) {
      if (e.t === 'show') shown.set(e.seat, { cards: e.cards, handName: e.handName });
      if (e.t === 'award') {
        const w = winners.find((x) => x.seat === e.seat);
        if (w) w.amount += e.amount;
        else winners.push({ seat: e.seat, amount: e.amount, handName: e.handName });
      }
      if (e.t === 'uncalled') { /* returned bet, not a win */ }
    }
    const players: HandView['players'] = {};
    for (const x of s.seats) {
      const sh = shown.get(x.seat) ?? null;
      players[x.seat] = {
        inHand: true,
        folded: x.folded,
        bet: x.bet,
        lastAction: x.lastAction,
        shown: sh ? sh.cards : null,
        handName: sh ? (sh.handName ?? (sh.cards.length === 5 ? evaluate1836(sh.cards).name : null)) : null,
      };
    }
    const me = s.seats.find((x) => x.seat === HUMAN);
    const myCards = me ? me.cards.map((c) => c.card) : [];
    return {
      complete: s.phase === 'complete',
      toAct: s.phase === 'betting' ? s.toAct : null,
      pot: s.seats.reduce((n, x) => n + x.total, 0),
      myCards,
      myHandName: myCards.length === 5 ? evaluate1836(myCards).name : '',
      players,
      winners,
      legal: s.phase === 'betting' && s.toAct === HUMAN ? engine.legalActions(s, HUMAN) : null,
    };
  }

  private nextLiveSeat(from: SeatIndex): SeatIndex {
    for (let i = 1; i <= this.seats.length; i++) {
      const s = this.seats[(from + i) % this.seats.length];
      if (!s.out) return s.seat;
    }
    return from;
  }

  private seatOf(characterId: string): SeatIndex {
    const s = this.seats.find((x) => x.character?.id === characterId);
    if (!s) throw new Error(`no seat for ${characterId}`);
    return s.seat;
  }

  /** The narrator announces the hand; if they have left the table, the first rival still playing does. */
  private narratorSeat(): SeatIndex {
    const n = this.seatOf(this.chapter.narratorId);
    if (!this.seats[n].out) return n;
    return this.seats.find((x) => x.seat !== HUMAN && !x.out)?.seat ?? n;
  }

  private say(seat: SeatIndex, text: string) {
    this.speech = { seat, text };
  }

  private pick<T>(items: T[]): T {
    return items[this.rnd.int(items.length)];
  }
}
