/**
 * A chapter is one era, one game and one table of rivals. Everything that
 * makes a chapter different (story, people, art, tells, stakes) is data in a
 * file like riverboat.ts; the table code and the screens are shared.
 */
import type { BettingKind } from '@rsdp/engine/core';
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
  /** Image file. Empty for 'placeholder'. */
  src: string;
  /**
   * 'cutout': a transparent PNG cut from a green-screen image (the finished look).
   * 'portrait': a picture with its own dark background, faded in at the edges.
   * 'placeholder': no art yet; the table draws a painted silhouette in `color`.
   * Portraits and placeholders stand in until the cutout exists; see docs/ART.md.
   */
  kind: 'cutout' | 'portrait' | 'placeholder';
  /** Placeholder silhouette colour (their clothes), e.g. '#6b2a2a'. */
  color?: string;
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
  /** Draw games: said when they change cards, and when they keep them all. Optional; plain words are used otherwise. */
  draw?: string[];
  pat?: string[];
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

/** The colours of a chapter's room, used to paint a placeholder scene until its art exists. */
export interface Palette {
  /** The walls and the dark around the table. */
  wall: string;
  /** The light falling on the table (lamp, candle, neon, monitor). */
  light: string;
  felt: string;
  rim: string;
}

/**
 * How big the bets are, in one number. The table derives every forced bet
 * from it (src/table/stakes.ts): antes games ante half a unit and bet at
 * least a unit; blinds are half a unit and a unit; limit bets are one and two
 * units; stud antes a fifth of a unit and brings in a third. The old games'
 * forced bets are in stakesFor too.
 */
export interface Structure {
  unit: number;
  /** 'spread-limit' betting: the most one bet or raise may be, in units (default 5). */
  limitUnits?: number;
}

/**
 * How a game is bet. The engine's three kinds, plus the 1800s "limit": the
 * table agrees the most any one bet or raise may be, a bet may be any amount
 * from the minimum up to it, and there is no cap on the number of raises.
 * The table runs it on the engine's no-limit betting with a ceiling
 * (src/table/session.ts, legalFor).
 */
export type Betting = BettingKind | 'spread-limit';

/** One game played in a stage, and the lesson given the first time it is dealt in the chapter. */
export interface GamePlay {
  /** A game id from src/games/catalog.ts. */
  game: string;
  betting: Betting;
  lesson?: Lesson;
}

/**
 * Teaching a game inside the story (docs/GAME_DESIGN.md, "Teaching"). Shown
 * the first time this game is dealt in the chapter: `before` ahead of the
 * deal, then `streets[i]` as street i begins on that first hand (a guided
 * hand, dealt fairly).
 */
export interface Lesson {
  /** The character who teaches it; also gives hints while it is played. */
  teacher: string;
  before: SceneLine[];
  streets?: Record<number, SceneLine[]>;
}

/** Optional house extras from RSDP Live (the epilogue). */
export interface Extras {
  /** Every Nth hand is a bomb pot: everyone posts this many units and the flop comes at once. */
  bombPotEvery?: number;
  bombPotUnits?: number;
  /** Bomb pots are dealt with two boards, each worth half the pot. */
  doubleBoardOnBombPots?: boolean;
  /** Win a pot with 7-2 and show it, and everyone else pays you this many units. */
  bounty72Units?: number;
}

/**
 * A stretch of the chapter played with one game, or a rotation of games
 * (HORSE). Stages start at fixed hand numbers.
 */
export interface Stage {
  /** First hand of the stage (1 for the first stage). */
  fromHand: number;
  /** One game, or several played in turn. */
  games: GamePlay[];
  /** In a rotation, hands of each game before the next one. */
  handsPerGame?: number;
  structure: Structure;
  /** Said as the stage begins (before its first lesson). */
  opening?: SceneLine[];
  extras?: Extras;
  /** A new room for this stage (the Boom's final table). */
  scene?: ChapterScene;
  /** Everyone starts this stage with the chapter's starting stack again (a tournament after a side game). */
  resetStacks?: boolean;
  /** What the chapter title strip says during this stage ("The qualifier"). */
  label?: string;
}

export interface ChapterScene {
  /** The empty room, drawn over the whole stage. Omit until the art exists: the palette paints a placeholder. */
  background?: string;
  /** The same picture with everything but the table transparent, drawn over the characters. See docs/ART.md. */
  tableFront?: string;
  /**
   * The chapter's title painting, shown behind its intro screen (the table
   * room is shown when it is missing). Its left side should be quiet sky or
   * shadow: the intro text sits there. See docs/ART.md.
   */
  title?: string;
  palette: Palette;
  /**
   * Music that loops while at this table: a path under public/music/, e.g.
   * 'music/riverboat.mp3'. Must be free to use; list it in docs/CREDITS.md.
   * Omit for no music. See src/ui/sound.ts.
   */
  music?: string;
}

export interface Chapter {
  id: string;
  /** "1", "Bonus", "Epilogue": the chapter's place in the full story. */
  numeral: string;
  /** 1 = 1543 to 1876 (the first release), 2 = 1926 to today. */
  part: 1 | 2;
  title: string;
  /** Display year ("Today" for the present). */
  year: number | 'Today';
  place: string;
  /** Who the player is in this chapter: "Kit Avery". */
  youAre: string;
  /** The games taught, for the chapter select: "Seven Card Stud, then Razz". */
  teaches: string;
  /** The rules card's era object: "a parchment page", "a matchbook". Shown as the button label. */
  rulesObject: string;
  /** The stages of play, in order. The last one is the showdown: before it starts, nobody is knocked out (they buy back in). */
  stages: Stage[];
  startingStack: number;
  /** How money is written: '$5' (the default), '5s' for shillings, '£5'. */
  money?: { prefix?: string; suffix?: string };
  /** The stakes rise by half every this many hands ("the night wears on"). Omit for steady stakes. */
  levelEvery?: number;
  /** Said when the stakes rise. */
  levelLines?: SceneLine[];
  /** Story shown before the first hand, one paragraph per entry. */
  intro: string[];
  /** "The story so far", shown when a player jumps to this chapter without playing the ones before. */
  recap: string[];
  /** The short history lesson shown on the intro screen and in the rules. */
  history: string[];
  /** Extra lines for the rules card about this chapter (how to win it). */
  howToWin: string[];
  /** The three rivals, in seat order: left, across, right. */
  rivals: [Character, Character, Character];
  /** The chapter's main rival, for the story and the intro screen. */
  nemesisId: string;
  /** Which rival narrates the hand (announces bets, deals) and gives hints when no lesson is running. */
  narratorId: string;
  scene: ChapterScene;
  /** Where the player's own cards sit. */
  playerPlate: { x: number; y: number };
  outro: { won: string[]; lost: string[] };
  /** The painted keepsake card won here: who is on it and the line under it. */
  keepsake: { name: string; line: string };
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
   * A rival cheats once per sitting, on one of the hands they deal after the
   * stake is up (or after hand `afterHand` when there is no stake), by
   * dealing themselves `hand`. The player may accuse them on any hand they
   * deal until the cheat is caught or has happened. Only for games whose
   * first deal gives each player all their cards (straight poker, draw).
   */
  cheat?: {
    /** Who cheats: a rival's id. Defaults to the nemesis. */
    by?: string;
    /** With no stake in the chapter: the cheat can start from this hand. */
    afterHand?: number;
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
  /**
   * When only the player, the nemesis and one other rival are left (after the
   * stake, if there is one, and once the last stage has begun), that rival
   * leaves with their money, if they have a bow-out scene.
   */
  finale?: {
    bowOut: Record<string, SceneLine[]>;
    /** Said as the heads-up match begins. */
    headsUp: SceneLine[];
  };
  /** Extra lines after a rival loses their last chips, by character id (after their usual bust line). */
  exits?: Record<string, SceneLine[]>;
  /** Scenes before a given hand is dealt ("orders arrive"). */
  moments?: { beforeHand: number; lines: SceneLine[] }[];
  /** What the narrator says as each hand is dealt. Defaults to plain words for the game. */
  dealer?: string[];
}
