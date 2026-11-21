/**
 * The table between hands: who is sitting where, their money, the buck
 * (dealer button), which game is being played, what the rivals say, the
 * chapter's story beats and lessons, and when the chapter is won or lost.
 *
 * The RSDP engine plays ONE hand at a time (packages/engine/src/core). This
 * file does the job RSDP's server runtime does for a real table, cut down to
 * one human and three bots in a browser: it builds each HandInput, feeds the
 * engine actions and draws, and reads the result back.
 *
 * A chapter is played in stages (src/chapters/types.ts, Stage), each with one
 * game or a rotation of games. The first time a game is dealt, its teacher
 * gives a lesson before the deal and talks through each street of that first
 * hand. Before the last stage starts, anyone who goes broke buys back in, so
 * every lesson is reached; in the last stage, broke means out.
 *
 * Story beats (tutorial, stake, cheat, finale, moments) are run from here,
 * using the text in the chapter's `story`. While a scene is showing, nobody
 * acts; the UI calls advanceScene() to move through it.
 *
 * No React here. The UI (src/ui) calls these methods and re-renders from
 * snapshot(). Tests (test/) play whole chapters with it.
 */
import {
  engine,
  type Action,
  type Card,
  type HandInput,
  type HandState,
  type LegalActions,
  type SeatIndex,
} from '@rsdp/engine/core';
import { cryptoRng, shuffle, type Rng } from '@rsdp/engine';
import { play, thinking, type Decision, type PlayerRead } from '../bots/personality';
import { seeded, type Random } from '../bots/random';
import { coachTip } from '../bots/rsdp/coach';
import { readPlayers, seededRand, seenBy } from '../bots/rsdp/strategy';
import type { Betting, Chapter, Character, GamePlay, SceneLine, Stage, Story } from '../chapters/types';
import { getGame, type GameDef } from '../games/catalog';
import { coachLines } from '../games/guide';
import { engineBetting, playName, postsFor, spreadLimit, stakesFor, unitAt } from './stakes';

/**
 * A table saved between hands, so a chapter can be picked up later
 * (Session.saveTable() and Session.resume()). Plain JSON. Bump
 * TABLE_SAVE_VERSION if the shape changes; older saves are then dropped.
 */
export const TABLE_SAVE_VERSION = 2;
export interface SavedTable {
  version: number;
  chapterId: string;
  seats: { stack: number; out: boolean; left: Seat['left'] }[];
  button: SeatIndex;
  handNumber: number;
  stageIndex: number;
  /** Index of the next hand's game in its stage's `games`. */
  playIndex: number;
  level: number;
  bombPot: boolean;
  boughtIn: number;
  /** How everyone has played this sitting, as RSDP's bots keep it (see Session.players). */
  players: Record<string, PlayerRead>;
  tiltLeft: Record<number, number>;
  taught: string[];
  scene: SceneLine[];
  playerWins: number;
  stakeHolder: SeatIndex | null;
  cheat: CheatState;
  cheaterDeals: number;
  redeal: boolean;
  finaleStarted: boolean;
  tutorialTellShown: boolean;
}

/** Seat 0 is always the human; 1-3 are the chapter's rivals in seat order (left, across, right). */
export const HUMAN: SeatIndex = 0;

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
  /** A teaching reminder shown under the line (hints only): see src/games/guide.ts, `coach`. */
  aside?: string;
}

export type Outcome = 'won' | 'lost' | null;

/** Where the cheat stands. 'none': the chapter has no cheat. */
export type CheatState = 'none' | 'waiting' | 'cheating' | 'caught' | 'missed';

/** The game being played this hand. */
export interface PlayView {
  gameId: string;
  /** "Pot-Limit Omaha", "Razz", "Primero". */
  name: string;
  betting: Betting;
  /** 'spread-limit' only: the most one bet or raise may be at the current stakes. */
  limit: number | null;
  family: 'flop' | 'stud' | 'draw';
  /** The stage's label, if it has one ("The final table"). */
  stageLabel: string | null;
  stageIndex: number;
  /** Current stake unit, after any rises. */
  unit: number;
  /** This hand is a bomb pot (the epilogue). */
  bombPot: boolean;
}

export interface Snapshot {
  seats: Seat[];
  button: SeatIndex;
  handNumber: number;
  /** The game of the hand being played, or of the next hand between hands. */
  play: PlayView;
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
  /** Chips added to the table by buy-backs before the last stage (tests use it to balance the books). */
  boughtIn: number;
  outcome: Outcome;
}

export interface PlayerView {
  folded: boolean;
  /** Chips bet this round. */
  bet: number;
  lastAction: string | null;
  /** Every card they hold, in order; null where it is face down to you. */
  cards: (Card | null)[];
  /** Their best hand in words, once all their cards are shown. */
  handName: string | null;
}

export interface HandView {
  complete: boolean;
  /** 'betting' or 'drawing' while the hand is on; 'complete' after. */
  phase: 'betting' | 'drawing' | 'complete';
  street: number;
  streetName: string;
  toAct: SeatIndex | null;
  pot: number;
  /** The human's cards, with which are face up (stud). */
  myCards: { card: Card; up: boolean }[];
  myHandName: string;
  /** The family of this hand's game. Between hands, `play` is already the next hand's game, which may differ. */
  family: 'flop' | 'stud' | 'draw';
  /** Shared cards: one array per board (two in a double-board hand). */
  boards: Card[][];
  players: Record<SeatIndex, PlayerView>;
  /** Filled in when the hand is over. */
  winners: { seat: SeatIndex; amount: number; handName?: string; half: 'high' | 'low' | 'scoop' }[];
  /** One line saying who won what and why; set when the hand is over. */
  summary: string | null;
  /** Legal moves when it is the human's turn to bet. */
  legal: LegalActions | null;
  /**
   * When it is the human's turn to draw: the most cards they may throw, the
   * limit in words ("up to two", "as many as you like"), and which draw this
   * is of how many (triple draw: 1 of 3).
   */
  draw: { max: number; words: string; round: number; rounds: number } | null;
}

export interface SessionOptions {
  /** Seed for bot decisions, tells and story chances; omit for a random one. */
  seed?: number;
  /** Shuffles the deck. Defaults to the browser's crypto random source. */
  dealRng?: Rng;
  /** Skip the scripted tutorial hand (for tests and replays). */
  skipTutorial?: boolean;
  /** Override how many deals a bot simulates per decision (tests use few, for speed). */
  simTrials?: number;
  /** Called after every rival decision with what they did and why. For tests and tools/bot-lab.ts. */
  onBotDecision?: (info: BotDecisionInfo) => void;
}

/** What a rival decided, and the numbers behind it (see SessionOptions.onBotDecision). */
export interface BotDecisionInfo {
  seat: SeatIndex;
  id: string;
  street: number;
  action: Action['type'];
  equity: number;
  bluffing: boolean;
  tilted: boolean;
  /** Facing a bet (could not check). */
  facingBet: boolean;
}

/** Hints only (Session.steady): a hand that wins this often may bet freely. */
const NUTS = 0.85;
/** Hints only: the share of your purse the teacher will bet or raise into one pot without the nuts. */
const STEADY_SHARE = 0.25;
/** Hints only: a call for this share of your remaining purse needs BIG_CALL_EDGE more than the pot odds. */
const BIG_CALL = 0.33;
const BIG_CALL_EDGE = 0.12;

export class Session {
  readonly chapter: Chapter;
  private seats: Seat[];
  private button: SeatIndex;
  private handNumber = 0;
  private state: HandState | null = null;
  private game: GameDef;
  /**
   * The game of the hand on the table. Once a hand ends, `game` moves on to
   * the next hand's game (a rotation), but the finished hand stays on screen
   * and must still be described by its own rules.
   */
  /** 'spread-limit' betting: the most one bet or raise may be this hand; null otherwise. */
  private handLimit: number | null = null;
  private handGame: GameDef;
  private play: GamePlay;
  private stageIndex = 0;
  private level = 0;
  private bombPot = false;
  private speech: Speech | null = null;
  private tells: Record<SeatIndex, string[]> = {};
  private outcome: Outcome = null;
  private readonly rnd: Random;
  private readonly dealRng: Rng;
  private readonly simTrials?: number;
  private readonly onBotDecision?: (info: BotDecisionInfo) => void;
  private boughtIn = 0;

  /**
   * What the table has learned about each player this sitting, by player id
   * ('you' and the rivals' ids): RSDP's bot record of how often they bet and
   * how often they fold to a bet (strategy.ts, readPlayers). Rivals who read
   * people play you by it (personality.ts, `reads`).
   */
  private players: Record<string, PlayerRead> = {};
  // Temper: hands left on tilt, by seat, and stacks at the start of the hand.
  private tiltLeft: Record<SeatIndex, number> = {};
  private handStartStacks: number[] = [];
  private lastNet: number[] = [];

  // Teaching: which games have been taught, and whether this hand is a guided one.
  private taught = new Set<string>();
  private guiding = false;
  private guidedStreets = new Set<number>();
  /** How many hints each game and betting round has given, so reminders take turns. */
  private coachTurns = new Map<string, number>();

  // Story state. See the Story type for what each beat is.
  private readonly story: Story;
  private readonly tutorial: boolean;
  private scene: SceneLine[] = [];
  private playerWins = 0;
  private stakeHolder: SeatIndex | null = null;
  private cheat: CheatState;
  private cheaterDeals = 0;
  private cheatingThisHand = false;
  private accusedThisHand = false;
  private pendingFine = 0;
  private redeal = false;
  private finaleStarted = false;
  private tutorialTellShown = false;

  constructor(chapter: Chapter, opts: SessionOptions = {}) {
    this.chapter = chapter;
    this.rnd = seeded(opts.seed ?? Math.floor(Math.random() * 2 ** 31));
    this.dealRng = opts.dealRng ?? cryptoRng;
    this.simTrials = opts.simTrials;
    this.onBotDecision = opts.onBotDecision;
    const stack = chapter.startingStack;
    this.seats = [
      { seat: HUMAN, name: 'You', character: null, stack, out: false, left: null },
      ...chapter.rivals.map((c, i) => ({ seat: i + 1, name: c.name, character: c, stack, out: false, left: null })),
    ];
    // The narrator holds the buck for the first hand, so play starts to their left.
    this.button = this.seats.find((s) => s.character?.id === chapter.narratorId)?.seat ?? 1;
    this.story = chapter.story ?? {};
    this.tutorial = !!this.story.tutorial && !opts.skipTutorial;
    this.cheat = this.story.cheat ? 'waiting' : 'none';
    this.play = chapter.stages[0].games[0];
    this.game = getGame(this.play.game);
    this.handGame = this.game;
    if (this.tutorial) this.scene.push(...this.story.tutorial!.before);
    this.prepareNextHand();
  }

  // ---------------------------------------------------------------- saving

  /**
   * The table as plain data, to pick up later with Session.resume(). Only
   * between hands (the hand in play is not saved) and while the chapter is
   * still going; otherwise null.
   */
  saveTable(): SavedTable | null {
    if (this.outcome || this.handInProgress || this.handNumber === 0) return null;
    const playIndex = this.stage().games.indexOf(this.play);
    if (playIndex < 0) return null;
    return {
      version: TABLE_SAVE_VERSION,
      chapterId: this.chapter.id,
      seats: this.seats.map((s) => ({ stack: s.stack, out: s.out, left: s.left })),
      button: this.button,
      handNumber: this.handNumber,
      stageIndex: this.stageIndex,
      playIndex,
      level: this.level,
      bombPot: this.bombPot,
      boughtIn: this.boughtIn,
      players: Object.fromEntries(Object.entries(this.players).map(([id, r]) => [id, { ...r }])),
      tiltLeft: { ...this.tiltLeft },
      taught: [...this.taught],
      scene: this.scene.map((l) => ({ ...l })),
      playerWins: this.playerWins,
      stakeHolder: this.stakeHolder,
      cheat: this.cheat,
      cheaterDeals: this.cheaterDeals,
      redeal: this.redeal,
      finaleStarted: this.finaleStarted,
      tutorialTellShown: this.tutorialTellShown,
    };
  }

  /**
   * A table saved by saveTable(), ready for the next hand. Returns null if
   * the save doesn't fit the chapter as it is now (an old save, or the
   * chapter changed since), so the caller can start the chapter afresh.
   */
  static resume(chapter: Chapter, saved: SavedTable, opts: SessionOptions = {}): Session | null {
    try {
      if (saved.version !== TABLE_SAVE_VERSION || saved.chapterId !== chapter.id) return null;
      if (saved.seats.length !== chapter.rivals.length + 1 || saved.handNumber < 1) return null;
      const stage = chapter.stages[saved.stageIndex];
      const play = stage?.games[saved.playIndex];
      if (!play || saved.seats[saved.button]?.out !== false) return null;
      // A scene saved before the chapter's cast changed may name someone who no longer sits here.
      const known = (who: string) => who === 'narration' || chapter.rivals.some((r) => r.id === who) || !!chapter.bystanders?.[who];
      if (!saved.scene.every((l) => known(l.who))) return null;
      const s = new Session(chapter, { ...opts, skipTutorial: true });
      s.seats.forEach((seat, i) => Object.assign(seat, saved.seats[i]));
      s.button = saved.button;
      s.handNumber = saved.handNumber;
      s.stageIndex = saved.stageIndex;
      s.play = play;
      s.game = getGame(play.game);
      s.level = saved.level;
      s.bombPot = saved.bombPot;
      s.boughtIn = saved.boughtIn;
      s.players = Object.fromEntries(Object.entries(saved.players).map(([id, r]) => [id, { ...r }]));
      s.tiltLeft = { ...saved.tiltLeft };
      s.taught = new Set(saved.taught);
      s.scene = saved.scene.map((l) => ({ ...l }));
      s.playerWins = saved.playerWins;
      s.stakeHolder = saved.stakeHolder;
      s.cheat = s.story.cheat ? saved.cheat : 'none';
      s.cheaterDeals = saved.cheaterDeals;
      s.redeal = saved.redeal;
      s.finaleStarted = saved.finaleStarted;
      s.tutorialTellShown = saved.tutorialTellShown;
      s.speech = null;
      return s;
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------- reading

  snapshot(): Snapshot {
    return {
      // During a hand, show each purse as it is now (bets already taken out), not as it was at the deal.
      seats: this.seats.map((s) => ({ ...s, stack: this.liveStack(s.seat) ?? s.stack })),
      button: this.button,
      handNumber: this.handNumber,
      play: this.playView(),
      hand: this.state ? this.handView(this.state) : null,
      speech: this.speech,
      scene: this.sceneView(),
      tells: Object.fromEntries(Object.entries(this.tells).map(([k, v]) => [k, [...v]])),
      stakeHolder: this.stakeHolder,
      canAccuse: this.canAccuse(),
      redeal: this.redeal,
      boughtIn: this.boughtIn,
      outcome: this.outcome,
    };
  }

  /** A seat's chips in the hand being played, or null between hands (then the seat's own stack is right, fines and buy-backs included). */
  private liveStack(seat: SeatIndex): number | null {
    if (!this.state || this.state.phase === 'complete') return null;
    return this.state.seats.find((x) => x.seat === seat)?.stack ?? null;
  }

  /** Money each seat won (+) or lost (-) in the last finished hand, by seat (before any fine or buy-back). */
  get lastHandNet(): readonly number[] {
    return this.lastNet;
  }

  /** The seat whose turn it is (to bet or to draw), or null (between hands, hand over, or a scene is playing). */
  get toAct(): SeatIndex | null {
    if (this.scene.length || !this.state) return null;
    return this.state.phase === 'betting' || this.state.phase === 'drawing' ? this.state.toAct : null;
  }

  get handInProgress(): boolean {
    return this.state !== null && this.state.phase !== 'complete';
  }

  /** A story scene is showing; call advanceScene() to move on. */
  get inScene(): boolean {
    return this.scene.length > 0;
  }

  /** The game of the current (or next) hand. */
  get currentGame(): GameDef {
    return this.game;
  }

  /** Whether the player can accuse the dealer now: the cheat is dealing, the stake is up (if any) and the cheat hasn't been settled. */
  canAccuse(): boolean {
    if (this.cheat !== 'waiting' && this.cheat !== 'cheating') return false;
    if (!this.cheatWindowOpen() || this.scene.length || !this.handInProgress || this.accusedThisHand) return false;
    const cheater = this.cheaterSeat();
    return this.button === cheater && !this.seats[cheater].out;
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
    const isRedeal = this.redeal;
    this.redeal = false;
    this.handNumber++;
    this.tells = {};
    this.handStartStacks = this.seats.map((x) => x.stack);
    for (const seat of this.seats) {
      const left = this.tiltLeft[seat.seat] ?? 0;
      if (left <= 0) continue;
      this.tiltLeft[seat.seat] = left - 1;
      if (!seat.out && seat.character) this.noticeTell(seat.seat, `${seat.character.name} is still smarting from that last pot.`);
    }
    this.cheatingThisHand = false;
    this.accusedThisHand = false;
    this.guidedStreets = new Set();
    const key = playKey(this.play);
    this.guiding = !isRedeal && !!this.play.lesson && !this.taught.has(key);
    this.taught.add(key);

    this.handGame = this.game;
    let deck = shuffle(this.game.deck(), this.dealRng);
    if (this.tutorial && this.handNumber === 1) {
      deck = this.arrangeDeck(deck, this.tutorialHands());
    } else if (this.cheat === 'waiting' && this.cheatWindowOpen() && this.button === this.cheaterSeat()) {
      const c = this.story.cheat!;
      this.cheaterDeals++;
      if (this.cheaterDeals >= c.latestDeal || this.rnd.chance(c.chance)) {
        deck = this.arrangeDeck(deck, new Map([[this.cheaterSeat(), c.hand]]));
        this.cheat = 'cheating';
        this.cheatingThisHand = true;
        this.noticeTell(this.cheaterSeat(), c.tell);
      } else if (this.rnd.chance(c.decoyChance)) {
        this.noticeTell(this.cheaterSeat(), c.decoy);
      }
    }

    const stage = this.stage();
    const unit = unitAt(stage.structure.unit, this.level);
    const stakes = stakesFor(this.game.forced, unit);
    const order: SeatIndex[] = [];
    for (let seat = this.nextLiveSeat(this.button); !order.includes(seat); seat = this.nextLiveSeat(seat)) order.push(seat);
    const extras = stage.extras ?? {};
    const bomb = this.bombPot ? unit * (extras.bombPotUnits ?? 2) : null;
    const input: HandInput = {
      handId: `${this.chapter.id}-${this.handNumber}`,
      handNumber: this.handNumber,
      game: this.game.spec,
      betting: engineBetting(this.play.betting),
      stakes,
      maxSeats: 4,
      seats: live.map((s) => ({ seat: s.seat, playerId: s.character?.id ?? 'you', stack: s.stack, away: false })),
      // Old draw poker: the age (left of the dealer) has the last say in every round, so the engine is told the age holds the button.
      button: this.game.forced === 'age' ? order[0] : this.button,
      buttonDead: false,
      posts: postsFor(this.game.forced, stakes, order, this.button, bomb),
      deck,
      reshuffleSeed: 1 + this.handNumber,
      options: {
        boards: this.bombPot && extras.doubleBoardOnBombPots ? 2 : 1,
        bombPot: this.bombPot,
        runItTwice: 'off',
        fixedLimitCap: 4,
        uncappedHeadsUp: false,
        showdown: 'show-all',
      },
      modifiers: extras.bounty72Units
        ? [{ id: 'bounty-72', settings: { enabled: true, amount: unit * extras.bounty72Units, suits: 'any', autoShow: true } }]
        : [],
    };
    this.handLimit = this.play.betting === 'spread-limit' ? spreadLimit(unit, stage.structure.limitUnits) : null;
    this.state = engine.startHand(input);
    this.say(this.narratorSeat(), this.dealerLine());
    this.afterAction();
  }

  /** The human's legal betting moves, or null when it isn't their turn to bet. */
  legal(): LegalActions | null {
    if (!this.state || this.toAct !== HUMAN || this.state.phase !== 'betting') return null;
    return this.legalFor(HUMAN);
  }

  /**
   * The engine's legal moves for `seat`, with the two period rules the table adds on top:
   * - 'spread-limit' betting: no bet or raise may be more than the table's limit (the engine runs no-limit);
   * - stud with no bring-in ('stud-open'): the engine still starts the first round at a "bring-in" seat, but the
   *   bring-in is nothing, so the table shows it as what it is: the best card showing may check or bet.
   */
  private legalFor(seat: SeatIndex): LegalActions {
    const s = this.state!;
    let legal = engine.legalActions(s, seat)!;
    if (legal.canBringIn && s.input.stakes.bringIn === 0) legal = { ...legal, canBringIn: false, canCheck: true, canFold: true };
    if (this.handLimit !== null && legal.canRaise) {
      const maxTo = Math.min(legal.maxTo, s.currentBet + this.handLimit);
      legal = { ...legal, maxTo, minTo: Math.min(legal.minTo, maxTo) };
    }
    return legal;
  }

  /** Sends a move to the engine, translated back from legalFor's view of the table. */
  private actFor(seat: SeatIndex, action: Action): void {
    const s = this.state!;
    const raw = engine.legalActions(s, seat)!;
    if (raw.canBringIn && s.input.stakes.bringIn === 0 && action.type !== 'bet' && action.type !== 'raise') {
      // A check (or a fold with nothing to call, which is a check) is the engine's bring-in of nothing.
      engine.act(s, seat, { type: 'bring-in' });
      return;
    }
    if ((action.type === 'bet' || action.type === 'raise') && this.handLimit !== null) {
      const { maxTo } = this.legalFor(seat);
      if (Math.floor(action.to) > maxTo) throw new Error(`at most ${maxTo}`);
    }
    engine.act(s, seat, action);
  }

  /** The human bets. Throws if it isn't their turn or the move is illegal. */
  act(action: Action): void {
    if (!this.state || this.toAct !== HUMAN || this.state.phase !== 'betting') throw new Error('not your turn');
    this.actFor(HUMAN, action);
    this.afterAction();
  }

  /** Draw games: the most cards the human may throw now, or null when it isn't their turn to draw. */
  drawLimit(): number | null {
    if (!this.state || this.toAct !== HUMAN || this.state.phase !== 'drawing') return null;
    return this.state.input.game.streets[this.state.street].drawMaxDiscard ?? 0;
  }

  /** Why this discard isn't allowed (a table rule like "four only with an ace"), or null if it is. */
  drawProblem(discard: number[]): string | null {
    const max = this.drawLimit();
    if (max === null) return 'It isn’t your turn to draw.';
    if (discard.length > max) return `You may change at most ${max}.`;
    return this.game.drawRule?.(this.myCards(), discard) ?? null;
  }

  /** The human throws the cards at these indexes (into their hand) and draws replacements. */
  draw(discard: number[]): void {
    const problem = this.drawProblem(discard);
    if (problem) throw new Error(problem);
    engine.draw(this.state!, HUMAN, discard);
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

  /** If a rival is to act (bet or draw), they decide and act. Returns false when it's not a rival's turn. The UI calls this on a timer. */
  botStep(): boolean {
    const seat = this.toAct;
    if (!this.state || seat === null || seat === HUMAN) return false;
    const character = this.seats[seat].character!;
    const s = this.state;
    const me = s.seats.find((x) => x.seat === seat)!;

    const tilted = (this.tiltLeft[seat] ?? 0) > 0;
    const drawing = s.phase === 'drawing';
    const legal = drawing ? undefined : this.legalFor(seat);
    // RSDP Live's bot thinks; the character's numbers bend it (src/bots/personality.ts).
    const decision = play(character.personality, { hand: s, seat, game: this.game, legal, players: this.players, tilted, sims: this.simTrials }, this.rnd);

    if (decision.kind === 'draw') {
      const cards = me.cards.map((c) => c.card);
      let discard = decision.discard;
      if (this.game.drawRule?.(cards, discard)) discard = discard.slice(0, 3);
      engine.draw(s, seat, discard);
      const lines = character.lines;
      this.say(seat, discard.length ? this.pick(lines.draw ?? [`${count(discard.length)}.`, `I’ll take ${count(discard.length).toLowerCase()}.`]) : this.pick(lines.pat ?? ['I’ll play these.', 'None for me.']));
      this.afterAction();
      return true;
    }
    if (!legal) return false;

    // Stud's low card must bring in (or complete with a strong hand); it can't check or fold.
    if (legal.canBringIn && (decision.action.type === 'check' || decision.action.type === 'fold' || decision.action.type === 'call')) {
      decision.action = { type: 'bring-in' };
    }
    if (decision.action.type === 'bet' || decision.action.type === 'raise') decision.action = { ...decision.action, to: Math.max(legal.minTo, Math.min(legal.maxTo, decision.action.to)) };
    this.actFor(seat, decision.action);
    this.onBotDecision?.({
      seat,
      id: character.id,
      street: s.street,
      action: decision.action.type,
      equity: decision.equity,
      bluffing: decision.bluffing,
      tilted,
      facingBet: !legal.canCheck && !legal.canBringIn,
    });

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
    else if (kind === 'bring-in') this.say(seat, 'I’ll bring it in.');
    this.afterAction();
    return true;
  }

  /**
   * RSDP Live's coach tip for the human's turn (src/bots/rsdp/coach.ts): what
   * RSDP's Normal bot would do here if it never bluffed, worked out from only
   * what the player can see, reading this hand's betting. Seeded from the
   * turn, so asking twice gives the same answer.
   */
  private coach() {
    const s = this.state!;
    const drawing = s.phase === 'drawing';
    thinking(this.game, this.simTrials);
    return coachTip(seenBy(s, HUMAN), HUMAN, {
      legal: drawing ? null : this.legalFor(HUMAN),
      drawMax: drawing ? (s.input.game.streets[s.street].drawMaxDiscard ?? 0) : 0,
      rand: seededRand(this.handNumber * 101 + s.events.length),
      handNumber: this.handNumber,
      at: s.events.length,
    });
  }

  /**
   * What the teacher would do in the human's seat right now (betting only),
   * with the numbers behind it: RSDP's coach tip, steadied for a beginner
   * (steady()). hint() puts it into words; Math Mode uses its winning chance;
   * tools/bot-lab.ts plays with it.
   */
  teacherAdvice(): { decision: Decision; equity: number; opponents: number; pot: number } | null {
    const s = this.state;
    if (!s || this.toAct !== HUMAN || s.phase !== 'betting') return null;
    const legal = this.legalFor(HUMAN);
    const tip = this.coach();
    const eq = tip.share;
    const opponents = tip.opponents;
    const pot = s.seats.reduce((n, x) => n + x.total, 0);
    const m = tip.move;
    const action: Action =
      m.type === 'bet' || m.type === 'raise' || m.type === 'complete' ? { type: legal.raiseKind, to: Math.max(legal.minTo, Math.min(legal.maxTo, m.to ?? legal.minTo)) }
      : m.type === 'draw' ? { type: 'check' }
      : { type: m.type };
    const relative = eq * (opponents + 1);
    const decision = this.steady({ action, bluffing: false, strong: relative >= 1.45, weak: relative < 1 }, legal, eq, pot);
    return { decision, equity: eq, opponents, pot };
  }

  /** Draw turns: the cards (indexes into the human's hand) RSDP's coach would throw, within any table rule. */
  teacherDraw(): number[] | null {
    const s = this.state;
    if (!s || this.toAct !== HUMAN || s.phase !== 'drawing') return null;
    const m = this.coach().move;
    let discard = m.type === 'draw' ? [...m.discard].sort((a, b) => a - b) : [];
    if (this.game.drawRule?.(this.myCards(), discard)) discard = discard.slice(0, 3);
    return discard;
  }

  /**
   * Keeps the teacher's advice from leading a beginner into a raising war.
   * Short of a near-certain hand (NUTS), and until only two players are left
   * at the table, the teacher:
   *  - never puts more than a quarter of the purse you sat down to this hand
   *    with into the pot by betting or raising (a smaller bet, or just a call);
   *  - raises at most once in a betting round, then calls;
   *  - wants a clear edge before calling off a third of your purse or more.
   * Bots don't use this: it only shapes hints.
   */
  private steady(d: Decision, legal: LegalActions, equity: number, pot: number): Decision {
    const me = this.state!.seats.find((x) => x.seat === HUMAN)!;
    // Down to two at the table, somebody has to win the chips: the teacher plays it straight.
    if (this.seats.filter((x) => !x.out).length === 2 || equity >= NUTS) return d;
    const start = this.handStartStacks[HUMAN] ?? me.stack + me.total;
    const passive = (): Decision => ({ ...d, action: legal.canCheck ? { type: 'check' } : { type: 'call' } });
    if (d.action.type === 'bet' || d.action.type === 'raise') {
      const raisedAlready = me.lastAction === 'Bet' || me.lastAction === 'Raise';
      // The most this bet may reach: a quarter of the purse, counting what is already in.
      const capTo = me.bet + Math.floor(start * STEADY_SHARE) - me.total;
      if (raisedAlready || capTo < legal.minTo) return passive();
      return { ...d, action: { ...d.action, to: Math.min(d.action.to, capTo) } };
    }
    if (d.action.type === 'call' && legal.callAmount >= me.stack * BIG_CALL) {
      const potOdds = legal.callAmount / (pot + legal.callAmount);
      if (equity < potOdds + BIG_CALL_EDGE) return { ...d, action: { type: 'fold' } };
    }
    return d;
  }

  /**
   * The teacher's advice for the human's current decision, or null when there
   * is nothing to decide. It names your hand, gives your share of the pot
   * from the same simulation the bots use (played by a careful, honest
   * player), and when there is a bet to call, the share you need for the
   * call to pay. `aside` adds a reminder about this game and betting round.
   */
  hint(): SceneView | null {
    if (!this.state || this.toAct !== HUMAN) return null;
    const teacher = this.teacherSeat();
    const name = this.seats[teacher].name;
    const s = this.state;
    const cards = this.myCards();
    const board = s.runs[0]?.[0] ?? [];
    const handName = this.game.describe(cards, board);
    const youHave = handName ? `Your hand: ${handWords(handName)}. ` : '';
    // While drawing, reminders about the draw itself come first ('draw' in the game's guide).
    const aside = this.coachLine(s.phase === 'drawing' ? 'draw' : (s.input.game.streets[s.street]?.name ?? ''));
    if (s.phase === 'drawing') {
      const discard = this.teacherDraw()!;
      const keep = cards.map((_, i) => i).filter((i) => !discard.includes(i));
      const text = !discard.length
        ? `${youHave}I’d keep all of these. Stand pat.`
        : keep.length
          ? `${youHave}I’d keep ${listWords(keep.map((i) => cardWord(cards[i])))}, throw the rest and draw ${count(discard.length).toLowerCase()}.`
          : `${youHave}Nothing worth keeping. I’d throw them all.`;
      return { name, seat: teacher, text, aside };
    }
    const legal = this.legalFor(HUMAN);
    const { decision: d, equity: eq, opponents, pot } = this.teacherAdvice()!;
    const pct = Math.round(eq * 100);
    const need = legal.canCheck || !legal.callAmount ? null : Math.round((legal.callAmount / (pot + legal.callAmount)) * 100);
    const odds = need === null ? '' : ` Calling costs ${this.money(legal.callAmount)} to win ${this.money(pot)}, so it pays if you take more than ${need}%.`;
    const verb =
      legal.canBringIn && d.action.type !== 'bet' && d.action.type !== 'raise' ? 'just bring it in'
      : d.action.type === 'fold' ? 'let this one go'
      : d.action.type === 'check' ? 'check and see'
      : d.action.type === 'call' ? 'call'
      : legal.raiseKind === 'bet' ? 'bet' : 'raise';
    const against = opponents === 1 ? 'one player' : `${opponents} players`;
    return { name, seat: teacher, text: `${youHave}Against ${against}, a hand like yours takes about ${pct}% of the pot.${odds} I’d ${verb}.`, aside };
  }

  /** The next reminder for this game and round, taking turns through them. */
  private coachLine(street: string): string | undefined {
    const lines = coachLines(this.game.id, street);
    if (!lines.length) return undefined;
    const key = `${this.game.id}/${street}`;
    const n = this.coachTurns.get(key) ?? 0;
    this.coachTurns.set(key, n + 1);
    return lines[n % lines.length];
  }

  // ---------------------------------------------------------------- after a hand

  private afterAction() {
    const s = this.state;
    if (!s) return;
    if (s.phase !== 'complete') {
      this.guideStreet(s);
      return;
    }
    for (const hs of s.seats) this.seats[hs.seat].stack = hs.stack;
    // What everyone did this hand goes on their record, as RSDP's table keeps it for its bots.
    for (const [id, r] of Object.entries(readPlayers([s]))) {
      const have = (this.players[id] ??= { acts: 0, aggressive: 0, faced: 0, folds: 0 });
      have.acts += r.acts;
      have.aggressive += r.aggressive;
      have.faced += r.faced;
      have.folds += r.folds;
    }
    this.lastNet = this.seats.map((x) => x.stack - (this.handStartStacks[x.seat] ?? x.stack));
    this.checkTempers();
    const nemesis = this.nemesisSeat();

    // A wrong accusation is paid for once the hand is over (money can't move mid-hand).
    if (this.pendingFine) {
      const cheater = this.cheaterSeat();
      const fine = Math.min(this.pendingFine, this.seats[HUMAN].stack);
      if (this.seats[cheater].stack > 0) {
        this.seats[HUMAN].stack -= fine;
        this.seats[cheater].stack += fine;
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

    const finalStage = this.inFinalStage(this.handNumber);
    for (const seat of this.seats) {
      if (seat.out || seat.stack > 0) continue;
      if (!finalStage) {
        // Before the showdown stage nobody is knocked out: they buy back in, so every lesson is reached.
        seat.stack = this.chapter.startingStack;
        this.boughtIn += seat.stack;
        this.scene.push(
          seat.character
            ? { who: 'narration', text: `${seat.character.name} is broke, and buys back in for another ${this.money(seat.stack)}.` }
            : { who: this.chapter.rivals[this.teacherSeat() - 1]?.id ?? 'narration', text: `Out already? Here, take another ${this.money(seat.stack)}. Learning costs money, but not tonight.` },
        );
        continue;
      }
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
    if (!this.outcome) this.prepareNextHand();
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
    const staked = stake ? this.stakeHolder === nemesis : true;
    const others = playing().filter((x) => x.seat !== HUMAN && x.seat !== nemesis);
    // It starts once everyone else left can bow out (so it is always heads-up): one rival with a bow-out scene, or nobody.
    const ready = others.length <= 1 && others.every((x) => !!finale?.bowOut[x.character!.id]);
    if (finale && !this.finaleStarted && staked && this.inFinalStage(this.handNumber + 1) && !this.seats[nemesis].out && ready && !this.seats[HUMAN].out) {
      this.finaleStarted = true;
      for (const other of others) {
        other.out = true;
        other.left = 'bowed';
        this.scene.push(...finale.bowOut[other.character!.id]);
      }
      this.scene.push(...finale.headsUp);
    }
  }

  /**
   * Works out the next hand's stage and game, and queues anything said
   * before it: a moment from the story, the stakes rising, a new stage's
   * opening, and a lesson the first time a game is dealt.
   */
  private prepareNextHand() {
    if (this.redeal) return;
    const next = this.handNumber + 1;
    const stages = this.chapter.stages;
    let stageIndex = 0;
    stages.forEach((st, i) => {
      if (st.fromHand <= next) stageIndex = i;
    });
    const stage = stages[stageIndex];
    const newStage = stageIndex !== this.stageIndex || next === 1;
    this.stageIndex = stageIndex;

    for (const m of this.story.moments ?? []) if (m.beforeHand === next) this.scene.push(...m.lines);

    const level = this.chapter.levelEvery ? Math.floor((next - 1) / this.chapter.levelEvery) : 0;
    if (level > this.level) {
      this.level = level;
      const unit = unitAt(stage.structure.unit, level);
      this.scene.push(...(this.chapter.levelLines ?? [{ who: 'narration', text: 'The night wears on, and the stakes go up.' }]));
      this.scene.push({ who: 'narration', text: `The stakes are now ${unit} a unit.` });
    }

    if (newStage && stage.resetStacks && next > 1) {
      for (const seat of this.seats) {
        if (seat.out) continue;
        this.boughtIn += this.chapter.startingStack - seat.stack;
        seat.stack = this.chapter.startingStack;
      }
    }
    if (newStage && stage.opening) this.scene.push(...stage.opening);
    const per = stage.handsPerGame ?? Number.MAX_SAFE_INTEGER;
    const play = stage.games[Math.floor((next - stage.fromHand) / per) % stage.games.length];
    this.play = play;
    this.game = getGame(play.game);
    if (play.lesson && !this.taught.has(playKey(play))) this.scene.push(...play.lesson.before);

    const every = stage.extras?.bombPotEvery;
    this.bombPot = !!every && this.game.spec.family === 'flop' && (next - stage.fromHand + 1) % every === 0;
    if (this.bombPot) this.scene.push({ who: 'narration', text: 'Bomb pot! Everyone puts in, and the flop comes straight away.' });
  }

  /** On a guided first hand, the teacher talks through each street as it begins. */
  private guideStreet(s: HandState) {
    if (!this.guiding || this.guidedStreets.has(s.street)) return;
    this.guidedStreets.add(s.street);
    const lines = this.play.lesson?.streets?.[s.street];
    if (lines) this.scene.push(...lines);
  }

  // ---------------------------------------------------------------- helpers

  private stage(): Stage {
    return this.chapter.stages[this.stageIndex];
  }

  /** True once hand `hand` is in the last stage: from then on, broke means out. */
  private inFinalStage(hand: number): boolean {
    if (this.chapter.practice) return false; // practice never ends: everyone buys back in
    return hand >= this.chapter.stages[this.chapter.stages.length - 1].fromHand;
  }

  private playView(): PlayView {
    const stage = this.stage();
    return {
      gameId: this.game.id,
      name: playName(this.game.name, this.play.betting, !!this.game.historical, this.game.spec.family),
      betting: this.play.betting,
      limit: this.play.betting === 'spread-limit' ? spreadLimit(unitAt(stage.structure.unit, this.level), stage.structure.limitUnits) : null,
      family: this.game.spec.family,
      stageLabel: stage.label ?? null,
      stageIndex: this.stageIndex,
      unit: unitAt(stage.structure.unit, this.level),
      bombPot: this.bombPot,
    };
  }

  private dealerLine(): string {
    if (this.story.dealer?.length) return this.handNumber === 1 ? this.story.dealer[0] : this.pick(this.story.dealer);
    if (this.bombPot) return 'Everybody in. Flop’s coming.';
    switch (this.game.forced) {
      case 'stud':
        return this.pick(['Antes in. Low card brings it in.', 'Antes, please. Cards coming up.']);
      case 'stud-open':
        return this.pick(['Antes in. High card bets first.', 'Antes, please. Cards coming up.']);
      case 'age':
        return this.pick(['The age antes. Cards coming.', 'Ante’s up. Who comes in?']);
      case 'blinds':
        return this.pick(['Blinds in. Cards coming.', 'Shuffle up and deal.']);
      default:
        return this.pick(['Ante up.', 'Fresh hand. Antes, please.']);
    }
  }

  /** Who gives hints: the current game's teacher if they are still at the table, else the narrator. */
  private teacherSeat(): SeatIndex {
    const id = this.play.lesson?.teacher;
    const seat = id ? this.seats.find((x) => x.character?.id === id) : undefined;
    if (seat && !seat.out) return seat.seat;
    return this.narratorSeat();
  }

  private myCards(): Card[] {
    return this.state?.seats.find((x) => x.seat === HUMAN)?.cards.map((c) => c.card) ?? [];
  }

  /** After a hand: a rival with a temper who lost a big pot goes on tilt for three hands. */
  private checkTempers() {
    for (const seat of this.seats) {
      const tilt = seat.character?.personality.tilt ?? 0;
      if (!tilt || seat.out) continue;
      const lost = (this.handStartStacks[seat.seat] ?? seat.stack) - seat.stack;
      if (lost >= this.chapter.startingStack * 0.25) this.tiltLeft[seat.seat] = 3;
    }
  }

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
   * deals the first street one card at a time, clockwise from the seat left
   * of the buck (packages/engine/src/core/hand.ts, dealStreet). Everyone else
   * gets cards from the shuffled rest. Only for games whose first street
   * deals each player all their cards face down.
   */
  private arrangeDeck(shuffled: Card[], fixed: Map<SeatIndex, string[]>): Card[] {
    const each = this.game.spec.streets[0].dealDown;
    const taken = new Set([...fixed.values()].flat());
    const rest = shuffled.filter((c) => !taken.has(c));
    const order: SeatIndex[] = [];
    for (let seat = this.nextLiveSeat(this.button); order.length === 0 || seat !== order[0]; seat = this.nextLiveSeat(seat)) order.push(seat);
    const hands = order.map((seat) => (fixed.get(seat) as Card[] | undefined) ?? rest.splice(0, each));
    const deck: Card[] = [];
    for (let i = 0; i < each; i++) for (const h of hands) deck.push(h[i]);
    return [...deck, ...rest];
  }

  private handView(s: HandState): HandView {
    const game = this.handGame;
    const winners: HandView['winners'] = [];
    for (const e of s.events) {
      if (e.t === 'award') {
        const w = winners.find((x) => x.seat === e.seat && x.half === e.half);
        if (w) w.amount += e.amount;
        else winners.push({ seat: e.seat, amount: e.amount, handName: e.handName, half: e.half });
      }
    }
    winners.sort((a, b) => b.amount - a.amount);
    const boards = s.runs[0];
    const board = boards[0] ?? [];
    const players: HandView['players'] = {};
    for (const x of s.seats) {
      // You see your own cards, everyone's up cards, and whatever is shown at the end.
      const cards = x.cards.map((c, i) => (c.up || x.shown.includes(i) || x.seat === HUMAN ? c.card : null));
      const revealed = x.seat !== HUMAN && x.shown.length > 0 && cards.every((c) => c !== null);
      players[x.seat] = {
        folded: x.folded,
        bet: x.bet,
        // A bring-in of nothing (stud with no bring-in) is a check.
        lastAction: x.lastAction === 'Bring-in' && s.input.stakes.bringIn === 0 ? 'Check' : x.lastAction,
        cards,
        handName: revealed ? game.describe(x.cards.map((c) => c.card), board) || null : null,
      };
    }
    const me = s.seats.find((x) => x.seat === HUMAN);
    const myCards = me ? me.cards.map((c) => ({ card: c.card, up: c.up })) : [];
    const myTurn = s.toAct === HUMAN && !this.scene.length;
    const street = s.input.game.streets[s.street];
    return {
      complete: s.phase === 'complete',
      phase: s.phase === 'drawing' ? 'drawing' : s.phase === 'complete' ? 'complete' : 'betting',
      street: s.street,
      streetName: street?.name ?? '',
      toAct: (s.phase === 'betting' || s.phase === 'drawing') && !this.scene.length ? s.toAct : null,
      pot: s.seats.reduce((n, x) => n + x.total, 0),
      myCards,
      myHandName: myCards.length ? game.describe(myCards.map((c) => c.card), board) : '',
      family: s.input.game.family,
      boards: boards.map((b) => [...b]),
      players,
      winners,
      summary: s.phase === 'complete' ? this.summary(s, winners) : null,
      legal: s.phase === 'betting' && myTurn ? this.legalFor(HUMAN) : null,
      draw: s.phase === 'drawing' && myTurn ? this.drawView(s, myCards.length) : null,
    };
  }

  private drawView(s: HandState, held: number): NonNullable<HandView['draw']> {
    const streets = s.input.game.streets;
    const max = streets[s.street].drawMaxDiscard ?? 0;
    const draws = streets.map((x, i) => (x.drawMaxDiscard != null ? i : -1)).filter((i) => i >= 0);
    const words = this.handGame.drawLimitWords ?? (max >= held ? 'as many as you like' : `up to ${count(max).toLowerCase()}`);
    return { max, words, round: draws.indexOf(s.street) + 1, rounds: draws.length };
  }

  /** "Silas takes $24 with Triplets, kings." Plus the 7-2 bounty, and why the player's hand lost. */
  private summary(s: HandState, winners: HandView['winners']): string {
    const name = (seat: SeatIndex) => (seat === HUMAN ? 'You' : this.seats[seat].name);
    const takes = (seat: SeatIndex) => (seat === HUMAN ? 'take' : 'takes');
    const parts: string[] = [];
    if (!s.showdown) {
      const w = winners[0];
      if (w) parts.push(`Everyone else folded. ${name(w.seat)} ${takes(w.seat)} ${this.money(w.amount)}.`);
      else {
        // Nobody came in against a blind ante: there is nothing to win, and the age takes the ante back.
        const last = s.seats.find((x) => !x.folded);
        if (last) parts.push(`Nobody came in. ${name(last.seat)} ${last.seat === HUMAN ? 'keep' : 'keeps'} the ante.`);
      }
    } else {
      for (const w of winners) {
        const split = s.input.game.split === 'hi-lo';
        const half = !split ? '' : w.half === 'high' ? ' the high half,' : w.half === 'low' ? ' the low half,' : '';
        parts.push(`${name(w.seat)} ${takes(w.seat)}${half} ${this.money(w.amount)}${w.handName ? ` with ${w.handName}` : ''}.`);
      }
      const me = s.seats.find((x) => x.seat === HUMAN);
      if (me && !me.folded && !winners.some((w) => w.seat === HUMAN)) {
        const mine = this.handGame.describe(me.cards.map((c) => c.card), s.runs[0][0] ?? []);
        if (mine) parts.push(`Yours: ${mine}.`);
      }
    }
    const bounty = s.events.filter((e) => e.t === 'transfer' && e.kind === 'bounty-72');
    if (bounty.length) {
      const to = (bounty[0] as { to: SeatIndex }).to;
      const total = bounty.reduce((n, e) => n + (e as { amount: number }).amount, 0);
      parts.push(`Seven-deuce bounty! ${name(to)} ${to === HUMAN ? 'collect' : 'collects'} ${this.money(total)} more.`);
    }
    return parts.join(' ');
  }

  private sceneView(): SceneView | null {
    const line = this.scene[0];
    if (!line) return null;
    if (line.who === 'narration') return { name: null, seat: null, text: line.text };
    // Someone in the room without a seat (the epilogue's dealer): named, but nobody at the table lights up.
    const bystander = this.chapter.bystanders?.[line.who];
    if (bystander) return { name: bystander, seat: null, text: line.text };
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

  private cheaterSeat(): SeatIndex {
    return this.seatOf(this.story.cheat?.by ?? this.chapter.nemesisId);
  }

  /** The cheat may happen: after the stake goes up, or after `afterHand` when the chapter has no stake. */
  private cheatWindowOpen(): boolean {
    const c = this.story.cheat;
    if (!c) return false;
    if (this.story.stake) return this.stakeHolder !== null;
    return this.handNumber >= (c.afterHand ?? 1);
  }

  /** The narrator announces the hand; if they have left the table, the first rival still playing does. */
  private narratorSeat(): SeatIndex {
    const n = this.seatOf(this.chapter.narratorId);
    if (!this.seats[n].out) return n;
    return this.seats.find((x) => x.seat !== HUMAN && !x.out)?.seat ?? n;
  }

  /** Money in the chapter's currency: "$5", "5s", "£5". */
  money(n: number): string {
    const m = this.chapter.money ?? {};
    return `${m.prefix ?? (m.suffix ? '' : '$')}${n}${m.suffix ?? ''}`;
  }

  private say(seat: SeatIndex, text: string) {
    this.speech = { seat, text };
  }

  private pick<T>(items: T[]): T {
    return items[this.rnd.int(items.length)];
  }
}

const playKey = (p: GamePlay) => `${p.game}/${p.betting}`;

const COUNT = ['None', 'One', 'Two', 'Three', 'Four', 'Five'];
const count = (n: number) => `${COUNT[n] ?? n} card${n === 1 ? '' : 's'}`.replace('None cards', 'No cards');

const RANK_WORD: Record<string, string> = { A: 'ace', K: 'king', Q: 'queen', J: 'jack', T: 'ten', '9': 'nine', '8': 'eight', '7': 'seven', '6': 'six', '5': 'five', '4': 'four', '3': 'three', '2': 'two' };
const SUIT_WORD: Record<string, string> = { c: 'clubs', d: 'diamonds', h: 'hearts', s: 'spades' };
const cardWord = (c: Card) => `the ${RANK_WORD[c[0]]} of ${SUIT_WORD[c[1]]}`;
/** A hand name inside a sentence: "Pair of Kings" -> "pair of kings" ("A-2-3" stays). */
const handWords = (name: string) => name.replace(/\b[A-Z][a-z]+/g, (w) => w.toLowerCase());
const listWords = (w: string[]) => (w.length <= 1 ? w.join('') : `${w.slice(0, -1).join(', ')} and ${w[w.length - 1]}`);
