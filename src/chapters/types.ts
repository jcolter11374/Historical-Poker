/**
 * A chapter is one era, one game and one table of rivals. Everything that
 * makes a chapter different (story, people, art, tells, stakes) is data in a
 * file like riverboat.ts; the table code and the screens are shared.
 */
import type { Personality } from '../bots/personality';

/** Where something sits on the 1600 x 900 stage, in stage pixels. */
export interface Placement {
  /** Horizontal centre. */
  x: number;
  /** Bottom edge (characters stand behind the table rim, so this is usually under it). */
  bottom: number;
  height: number;
}

export interface CharacterArt {
  src: string;
  /**
   * 'cutout': a transparent PNG cut from a green-screen image (the finished look).
   * 'portrait': a picture with its own dark background, faded in at the edges.
   * Portraits are placeholders until the cutout exists; see docs/ART.md.
   */
  kind: 'cutout' | 'portrait';
  /** Width / height of the image file, so the stage can size it without loading it first. */
  aspect: number;
  place: Placement;
}

/**
 * A habit that hints at a rival's hand. Each time the rival acts, the tell
 * may show: with chance `showsWhenTrue` when the hand really is what the tell
 * signals, and `showsWhenFalse` when it isn't. Their ratio is the tell's
 * reliability: Ezra's (0.6 vs 0.07) is honest, Delphine's (0.4 vs 0.4) is
 * a coin flip because she fakes it. See docs/GAME_DESIGN.md, "Tells".
 */
export interface Tell {
  /** What the player notices, e.g. "He's smoothing his mustache again..." */
  text: string;
  /**
   * What it signals. 'bluffing' is only checked when the rival bets or raises;
   * 'weak' and 'strong' on every action.
   */
  signals: 'bluffing' | 'weak' | 'strong';
  showsWhenTrue: number;
  showsWhenFalse: number;
}

export interface Lines {
  /** Said when they bet or raise. */
  bet: string[];
  call: string[];
  fold: string[];
  check: string[];
  /** Said when they win a pot. */
  win: string[];
  /** Said when they lose their last dollar and leave the table. */
  bust: string;
}

export interface Character {
  id: string;
  /** Short name used at the table: "Silas". */
  name: string;
  fullName: string;
  /** One line under the name on the intro screen. */
  role: string;
  personality: Personality;
  tell: Tell;
  lines: Lines;
  art: CharacterArt;
  /** Where their name, stack and face-down cards go on the felt. */
  plate: { x: number; y: number };
}

export interface Chapter {
  id: string;
  /** "1": the chapter's place in the full story. */
  numeral: string;
  title: string;
  year: number;
  place: string;
  /** Engine game id, registered in src/games. */
  gameId: string;
  stakes: { ante: number; minBet: number; startingStack: number };
  /** Story shown before the first hand, one paragraph per entry. */
  intro: string[];
  /** The short history lesson shown on the intro screen and in the rules panel. */
  history: string[];
  /** The rules panel's explanation of how a hand goes. */
  howToPlay: string[];
  /** The three rivals, in seat order: left, across, right. */
  rivals: [Character, Character, Character];
  /** The chapter's main rival, for the story and the intro screen. */
  nemesisId: string;
  /** Which rival narrates the hand (announces bets, deals). */
  narratorId: string;
  /**
   * background: the empty room, drawn over the whole stage.
   * tableFront: the same picture with everything but the table transparent,
   * drawn over the characters so they sit behind the table. See docs/ART.md.
   */
  scene: { background: string; tableFront: string };
  /** Where the player's own cards sit. */
  playerPlate: { x: number; y: number };
  outro: { won: string[]; lost: string[] };
  /** Scripted story moments at the table. Optional: a chapter without one is plain play. */
  story?: Story;
}

/** One line of a story scene. `who` is a rival's id, or 'narration' for plain description. */
export interface SceneLine {
  who: string;
  text: string;
}

/**
 * The story beats played at the table (docs/GAME_DESIGN.md, "Story beats").
 * The Session decides WHEN each one happens; the chapter file says WHAT is
 * said. Every field is optional, so a chapter can use only some beats.
 */
export interface Story {
  /** The first hand is dealt from a set deck, and a rival explains the game. */
  tutorial?: {
    /** Shown before the first card is dealt. */
    before: SceneLine[];
    /** Each seat's five cards, by character id ('you' for the player). Must use the whole deck exactly once. */
    hands: Record<string, string[]>;
    /** Whose tell is pointed out. It shows the first time they act in the tutorial hand. */
    tellOf: string;
    /** Said right after that tell first shows. */
    afterTell: SceneLine[];
  };
  /** The nemesis puts the chapter's prize on the table. */
  stake?: {
    /** After the player has won this many pots... */
    afterPlayerWins: number;
    /** ...or this many hands have been played, whichever comes first. */
    orAfterHands: number;
    lines: SceneLine[];
    /** Told when the nemesis loses their last chips to a rival instead of the player; the prize passes to that rival. `{name}` is replaced. */
    passes: SceneLine[];
  };
  /**
   * The nemesis cheats once per sitting, on one of the hands they deal after
   * the stake is up, by dealing themselves `hand`. The player may accuse them
   * on any hand they deal until the cheat is caught or has happened.
   */
  cheat?: {
    hand: string[];
    /** Chance of cheating on each hand they deal; they always cheat by the `latestDeal`-th deal. */
    chance: number;
    latestDeal: number;
    /** Tell shown when they cheat. */
    tell: string;
    /** A harmless habit shown on some honest deals, so the real tell has to be told apart. */
    decoy: string;
    decoyChance: number;
    /** Accused while cheating: the hand is called off and redealt. */
    caught: SceneLine[];
    /** Accused while dealing straight: the player pays `fine`. */
    wrong: SceneLine[];
    fine: number;
    /** The cheat hand ended without an accusation. */
    missed: SceneLine[];
  };
  /** When only the player, the nemesis and one other rival are left (after the stake), that rival leaves with their money. */
  finale?: {
    bowOut: Record<string, SceneLine[]>;
    /** Said as the heads-up match begins. */
    headsUp: SceneLine[];
  };
  /** Extra lines after a rival loses their last chips, by character id (after their usual bust line). */
  exits?: Record<string, SceneLine[]>;
}
