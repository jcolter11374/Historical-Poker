/**
 * The table between hands: who is sitting where, their money, the buck
 * (dealer button), what the rivals say, the chapter's story beats, and when
 * the chapter is won or lost.
 *
 * The RSDP engine plays ONE hand at a time (packages/engine/src/core). This
 * file does the job RSDP's server runtime does for a real table, cut down to
 * one human and three bots in a browser: it builds each HandInput, feeds the
 * engine actions, and reads the result back.
 *
 * Story beats (tutorial, stake, cheat, finale) are run from here, using the
 * text in the chapter's `story` (src/chapters/types.ts, Story). While a scene
 * is showing, nobody acts; the UI calls advanceScene() to move through it.
 *
 * No React here. The UI (src/ui) calls these methods and re-renders from
 * snapshot(). Tests (test/session.test.ts, test/story.test.ts) play whole
 * games with it.
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
import type { Chapter, Character, SceneLine, Story } from '../chapters/types';
import { STRAIGHT_POKER, STRAIGHT_POKER_RULES, deck20, evaluate1836 } from '../games/straightPoker';

let registered = false;
function registerGames() {
  if (registered) return;
  variants.register(STRAIGHT_POKER, STRAIGHT_POKER_RULES);
  registered = true;
}

/** Seat 0 is always the human; 1-3 are the chapter's rivals in seat order (left, across, right). */
export const HUMAN: SeatIndex = 0;
const CARDS_EACH = 5;

export interface Seat {
  seat: SeatIndex;
  name: string;
  /** Null for the human. */
  character: Character | null;
  stack: number;
  /** No longer playing. */
  out: boolean;
  /** Why they left: lost all their money, or chose to stop (keeping their money) before the finale. */
  left: 'broke' | 'bowed' | null;
}

export interface Speech {
  seat: SeatIndex;
  text: string;
}

/** The scene line on screen. `name` is null for narration. */
export interface SceneView {
  name: string | null;
  seat: SeatIndex | null;
  text: string;
}

export type Outcome = 'won' | 'lost' | null;

/** Where the nemesis's cheat stands. 'none': the chapter has no cheat. */
export type CheatState = 'none' | 'waiting' | 'cheating' | 'caught' | 'missed';

export interface Snapshot {
  seats: Seat[];
  button: SeatIndex;
  handNumber: number;
  /** Null between hands (and after a hand is called off). */
  hand: HandView | null;
  speech: Speech | null;
  /** The story scene line to show, if one is playing. Play waits until it is done. */
  scene: SceneView | null;
  /** Tells the player has noticed this hand, by seat. */
  tells: Record<SeatIndex, string[]>;
  /** Who has the chapter's prize (the deck) on the table in front of them, if it has been staked. */
  stakeHolder: SeatIndex | null;
  /** The player may accuse the dealer of cheating right now. */
  canAccuse: boolean;
  /** The next hand is a redeal after a called-off hand (the buck doesn't move). */
  redeal: boolean;
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
  /** Seed for bot decisions, tells and story chances; omit for a random one. */
  seed?: number;
  /** Shuffles the deck. Defaults to the browser's crypto random source. */
  dealRng?: Rng;
  /** Skip the scripted tutorial hand (for tests and replays). */
  skipTutorial?: boolean;
}

export class Session {
  readonly chapter: Chapter;
  private seats: Seat[];
  private button: SeatIndex;
  private handNumber = 0;
  private state: HandState | null = null;
  private speech: Speech | null = null;
  private tells: Record<SeatIndex, string[]> = {};
  private outcome: Outcome = null;
  private readonly rnd: Random;
  private readonly dealRng: Rng;

  // Story state. See the Story type for what each beat is.
  private readonly story: Story;
  private readonly tutorial: boolean;
  private scene: SceneLine[] = [];
  private playerWins = 0;
  private stakeHolder: SeatIndex | null = null;
  private cheat: CheatState;
  private nemesisDeals = 0;
  private cheatingThisHand = false;
  private accusedThisHand = false;
  private pendingFine = 0;
  private redeal = false;
  private finaleStarted = false;
  private tutorialTellShown = false;

  constructor(chapter: Chapter, opts: SessionOptions = {}) {
    registerGames();
    this.chapter = chapter;
    this.rnd = seeded(opts.seed ?? Math.floor(Math.random() * 2 ** 31));
    this.dealRng = opts.dealRng ?? cryptoRng;
    const stack = chapter.stakes.startingStack;
    this.seats = [
      { seat: HUMAN, name: 'You', character: null, stack, out: false, left: null },
      ...chapter.rivals.map((c, i) => ({ seat: i + 1, name: c.name, character: c, stack, out: false, left: null })),
    ];
    // The narrator holds the buck for the first hand, so play starts to their left.
    this.button = this.seats.find((s) => s.character?.id === chapter.narratorId)?.seat ?? 1;
    this.story = chapter.story ?? {};
    this.tutorial = !!this.story.tutorial && !opts.skipTutorial;
    this.cheat = this.story.cheat ? 'waiting' : 'none';
    if (this.tutorial) this.scene.push(...this.story.tutorial!.before);
  }

  // ---------------------------------------------------------------- reading

  snapshot(): Snapshot {
    return {
      seats: this.seats.map((s) => ({ ...s })),
      button: this.button,
      handNumber: this.handNumber,
      hand: this.state ? this.handView(this.state) : null,
      speech: this.speech,
      scene: this.sceneView(),
      tells: Object.fromEntries(Object.entries(this.tells).map(([k, v]) => [k, [...v]])),
      stakeHolder: this.stakeHolder,
      canAccuse: this.canAccuse(),
      redeal: this.redeal,
      outcome: this.outcome,
    };
  }

  /** The seat whose turn it is, or null (between hands, hand over, or a scene is playing). */
  get toAct(): SeatIndex | null {
    if (this.scene.length) return null;
    return this.state && this.state.phase === 'betting' ? this.state.toAct : null;
  }

  get handInProgress(): boolean {
    return this.state !== null && this.state.phase !== 'complete';
  }

  /** A story scene is showing; call advanceScene() to move on. */
  get inScene(): boolean {
    return this.scene.length > 0;
  }

  /** Whether the player can accuse the dealer now: the nemesis is dealing, the stake is up and the cheat hasn't been settled. */
  canAccuse(): boolean {
    if (this.cheat !== 'waiting' && this.cheat !== 'cheating') return false;
    if (this.stakeHolder === null || this.scene.length || !this.handInProgress || this.accusedThisHand) return false;
    const nemesis = this.nemesisSeat();
    return this.button === nemesis && !this.seats[nemesis].out;
  }

  // ---------------------------------------------------------------- playing

  /** Shows the next line of the current scene. */
  advanceScene(): void {
    this.scene.shift();
  }

  /** Deals the next hand. Moves the buck first, except before the first hand and on a redeal. */
  startHand(): void {
    if (this.outcome) throw new Error('the chapter is over');
    if (this.handInProgress) throw new Error('a hand is already being played');
    if (this.scene.length) throw new Error('a scene is playing');
    const live = this.seats.filter((s) => !s.out);
    if (this.handNumber > 0 && !this.redeal) this.button = this.nextLiveSeat(this.button);
    this.redeal = false;
    this.handNumber++;
    this.tells = {};
    this.cheatingThisHand = false;
    this.accusedThisHand = false;

    let deck = shuffle(deck20(), this.dealRng);
    if (this.tutorial && this.handNumber === 1) {
      deck = this.arrangeDeck(deck, this.tutorialHands());
    } else if (this.cheat === 'waiting' && this.stakeHolder !== null && this.button === this.nemesisSeat()) {
      const c = this.story.cheat!;
      this.nemesisDeals++;
      if (this.nemesisDeals >= c.latestDeal || this.rnd.chance(c.chance)) {
        deck = this.arrangeDeck(deck, new Map([[this.nemesisSeat(), c.hand]]));
        this.cheat = 'cheating';
        this.cheatingThisHand = true;
        this.noticeTell(this.nemesisSeat(), c.tell);
      } else if (this.rnd.chance(c.decoyChance)) {
        this.noticeTell(this.nemesisSeat(), c.decoy);
      }
    }

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
      deck,
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

  /**
   * The player accuses the dealer of cheating. If they were, the hand is
   * called off (everyone gets their money back) and redealt. If not, the
   * player owes the story's fine at the end of the hand.
   */
  accuse(): void {
    if (!this.canAccuse()) throw new Error('nothing to accuse');
    const c = this.story.cheat!;
    this.accusedThisHand = true;
    if (this.cheatingThisHand) {
      // Stacks are only copied back from the engine when a hand completes, so the seats still hold the pre-hand amounts.
      this.state = null;
      this.tells = {};
      this.cheat = 'caught';
      this.cheatingThisHand = false;
      this.redeal = true;
      this.speech = null;
      this.scene.push(...c.caught);
    } else {
      this.pendingFine += c.fine;
      this.scene.push(...c.wrong);
    }
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
    const t = this.story.tutorial;
    if (this.tutorial && this.handNumber === 1 && t && character.id === t.tellOf && !this.tutorialTellShown) {
      // The tutorial points this tell out, so it always shows the first time.
      this.tutorialTellShown = true;
      this.noticeTell(seat, tell.text);
      this.scene.push(...t.afterTell);
    } else if (tell.signals !== 'bluffing' || aggressive) {
      const truth = tell.signals === 'bluffing' ? decision.bluffing : tell.signals === 'strong' ? decision.strong : decision.weak;
      if (this.rnd.chance(truth ? tell.showsWhenTrue : tell.showsWhenFalse)) this.noticeTell(seat, tell.text);
    }
    const lines = character.lines;
    if (aggressive) this.say(seat, this.pick(lines.bet));
    else if (kind === 'call') this.say(seat, this.pick(lines.call));
    else if (kind === 'fold') this.say(seat, this.pick(lines.fold));
    else if (kind === 'check') this.say(seat, this.pick(lines.check));
    this.afterAction();
    return true;
  }

  // ---------------------------------------------------------------- after a hand

  private afterAction() {
    const s = this.state;
    if (!s || s.phase !== 'complete') return;
    for (const hs of s.seats) this.seats[hs.seat].stack = hs.stack;
    const nemesis = this.nemesisSeat();

    // A wrong accusation is paid for once the hand is over (money can't move mid-hand).
    if (this.pendingFine) {
      const fine = Math.min(this.pendingFine, this.seats[HUMAN].stack);
      if (this.seats[nemesis].stack > 0) {
        this.seats[HUMAN].stack -= fine;
        this.seats[nemesis].stack += fine;
      }
      this.pendingFine = 0;
    }

    const winners = this.handView(s).winners;
    const top = winners[0];
    if (top && top.seat !== HUMAN) {
      const c = this.seats[top.seat].character!;
      this.say(top.seat, this.pick(c.lines.win));
    } else if (top) {
      this.playerWins++;
      this.say(this.narratorSeat(), top.handName ? `Your pot. ${top.handName}.` : 'The pot is yours.');
    }

    if (this.cheatingThisHand && this.cheat === 'cheating') {
      this.cheat = 'missed';
      this.scene.push(...this.story.cheat!.missed);
    }

    for (const seat of this.seats) {
      if (seat.out || seat.stack > 0) continue;
      seat.out = true;
      seat.left = 'broke';
      if (!seat.character) continue;
      this.say(seat.seat, seat.character.lines.bust);
      this.scene.push({ who: seat.character.id, text: seat.character.lines.bust }, ...(this.story.exits?.[seat.character.id] ?? []));
      // The stake passes to whoever took the holder's last chips (the biggest winner of this pot).
      // If the nemesis goes broke before staking the deck, it goes the same way.
      const holdsStake = this.stakeHolder === seat.seat || (!!this.story.stake && this.stakeHolder === null && seat.seat === nemesis);
      if (holdsStake) {
        const taker = winners[0]?.seat ?? HUMAN;
        this.stakeHolder = taker;
        if (taker !== HUMAN && this.story.stake) {
          const name = this.seats[taker].character!.fullName;
          this.scene.push(...this.story.stake.passes.map((l) => ({ ...l, text: l.text.replace('{name}', name) })));
        }
      }
    }
    // A rival who leaves broke has already spoken in the scene; don't repeat the line underneath it.
    if (this.scene.length) this.speech = null;

    this.storyBeatsAfterHand();

    // The chapter ends when the player is broke, wins the stake, or is the last one at the table.
    if (this.seats[HUMAN].out) this.outcome = 'lost';
    else if (this.stakeHolder === HUMAN || this.seats.every((x) => x.seat === HUMAN || x.out)) this.outcome = 'won';
  }

  private storyBeatsAfterHand() {
    const nemesis = this.nemesisSeat();
    const playing = () => this.seats.filter((x) => !x.out);
    if (this.seats[HUMAN].out) return;

    // The stake goes on the table once the player has shown they can win.
    const stake = this.story.stake;
    if (stake && this.stakeHolder === null && !this.seats[nemesis].out) {
      if (this.playerWins >= stake.afterPlayerWins || this.handNumber >= stake.orAfterHands) {
        this.stakeHolder = nemesis;
        this.scene.push(...stake.lines);
      }
    }

    // Finale: once only the player, the nemesis and one other are left, the other steps away with their money.
    const finale = this.story.finale;
    if (finale && !this.finaleStarted && this.stakeHolder === nemesis && !this.seats[nemesis].out && playing().length <= 3) {
      this.finaleStarted = true;
      for (const other of playing()) {
        if (other.seat === HUMAN || other.seat === nemesis) continue;
        other.out = true;
        other.left = 'bowed';
        this.scene.push(...(finale.bowOut[other.character!.id] ?? []));
      }
      this.scene.push(...finale.headsUp);
    }
  }

  // ---------------------------------------------------------------- helpers

  private noticeTell(seat: SeatIndex, text: string) {
    const list = (this.tells[seat] ??= []);
    if (!list.includes(text)) list.push(text);
  }

  /** The tutorial's hands, by seat. */
  private tutorialHands(): Map<SeatIndex, string[]> {
    const hands = new Map<SeatIndex, string[]>();
    for (const [who, cards] of Object.entries(this.story.tutorial!.hands)) {
      hands.set(who === 'you' ? HUMAN : this.seatOf(who), cards);
    }
    return hands;
  }

  /**
   * Orders a deck so the given seats are dealt the given cards. The engine
   * deals one card at a time, clockwise from the seat left of the buck
   * (packages/engine/src/core/hand.ts, dealStreet). Everyone else gets cards
   * from the shuffled rest.
   */
  private arrangeDeck(shuffled: Card[], fixed: Map<SeatIndex, string[]>): Card[] {
    const taken = new Set([...fixed.values()].flat());
    const rest = shuffled.filter((c) => !taken.has(c));
    const order: SeatIndex[] = [];
    for (let seat = this.nextLiveSeat(this.button); order.length === 0 || seat !== order[0]; seat = this.nextLiveSeat(seat)) order.push(seat);
    const hands = order.map((seat) => (fixed.get(seat) as Card[] | undefined) ?? rest.splice(0, CARDS_EACH));
    const deck: Card[] = [];
    for (let i = 0; i < CARDS_EACH; i++) for (const h of hands) deck.push(h[i]);
    return [...deck, ...rest];
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
    winners.sort((a, b) => b.amount - a.amount);
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
      toAct: s.phase === 'betting' && !this.scene.length ? s.toAct : null,
      pot: s.seats.reduce((n, x) => n + x.total, 0),
      myCards,
      myHandName: myCards.length === 5 ? evaluate1836(myCards).name : '',
      players,
      winners,
      legal: s.phase === 'betting' && s.toAct === HUMAN && !this.scene.length ? engine.legalActions(s, HUMAN) : null,
    };
  }

  private sceneView(): SceneView | null {
    const line = this.scene[0];
    if (!line) return null;
    if (line.who === 'narration') return { name: null, seat: null, text: line.text };
    const seat = this.seatOf(line.who);
    return { name: this.seats[seat].name, seat, text: line.text };
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

  private nemesisSeat(): SeatIndex {
    return this.seatOf(this.chapter.nemesisId);
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
