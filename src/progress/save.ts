/**
 * Saved progress, in the browser's localStorage. No accounts, no server:
 * clearing the browser's data resets it. Saved after every chapter ends.
 *
 * Stored under one key as JSON. Bump VERSION and migrate in load() if the
 * shape ever changes.
 *
 * A chapter left part-way is kept too, under a second key: the table as it
 * stood after the last finished hand (Session.saveTable()), one per chapter,
 * so "Continue" sits you back down at the same table. A hand in play is not
 * saved; you pick up at the next deal.
 *
 * Save slots: three players can share one browser, each with a name and
 * their own progress, settings and tables left part-way. Slot 1 lives under
 * the two keys the game has always used, so a save from before slots existed
 * simply is slot 1. Slots 2 and 3 use the same two keys with `slot2/` or
 * `slot3/` in them. A third small key holds the names and which slot was
 * played last. Every function below reads and writes the slot in play
 * (pickSlot); the ones that take a slot number look at any of them.
 */
import type { SavedTable } from '../table/session';

const SLOTS_KEY = 'historical-poker/slots';
const VERSION = 1;

/** How many players can keep a save in one browser. */
export const SLOT_COUNT = 3;
/** The longest name a slot can have. */
export const NAME_LENGTH = 14;

/** Slot 1 keeps the first keys the game ever used, so old saves are slot 1. */
const prefix = (n: number) => (n === 1 ? 'historical-poker/' : `historical-poker/slot${n}/`);
const progressKey = (n: number) => `${prefix(n)}progress`;
const tablesKey = (n: number) => `${prefix(n)}tables`;

export interface Progress {
  version: typeof VERSION;
  /** Chapter ids won, with when (ISO time) they were first won. */
  won: Record<string, string>;
  /** Chapter ids started at least once (for "continue" and the select screen). */
  played: Record<string, string>;
  /** Teacher hints on the table (on by default). */
  hints: boolean;
  /** Sound effects (on by default). */
  sound: boolean;
  /** Music, where a chapter has some (on by default). */
  music: boolean;
  /** Math Mode: sums at the table for young players (off by default). See src/math. */
  math: boolean;
  /** Stars earned for right answers in Math Mode. */
  mathStars: number;
  /** The opening pictures have been shown once (they play before the chapter select on the first visit). */
  seenOpening: boolean;
}

const empty = (): Progress => ({ version: VERSION, won: {}, played: {}, hints: true, sound: true, music: true, math: false, mathStars: 0, seenOpening: false });

/** Somewhere to keep progress. The browser's localStorage, or a stand-in in tests. */
export interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function store(): Store | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null; // private browsing or storage disabled: play without saving
  }
}

// ---------------------------------------------------------------- save slots

/** The slots' names (by slot number, 1 to SLOT_COUNT; none = not named) and the slot played last. */
interface Slots {
  current: number;
  names: Record<number, string>;
}

const validSlot = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= SLOT_COUNT;

function loadSlots(s: Store | null): Slots {
  try {
    const raw = s?.getItem(SLOTS_KEY);
    const m = raw ? (JSON.parse(raw) as Partial<Slots>) : {};
    return { current: validSlot(m.current) ? m.current : 1, names: m.names && typeof m.names === 'object' ? m.names : {} };
  } catch {
    return { current: 1, names: {} };
  }
}

function writeSlots(m: Slots, s: Store | null): void {
  try {
    s?.setItem(SLOTS_KEY, JSON.stringify(m));
  } catch {
    /* storage full or disabled: the names just aren't kept */
  }
}

/** The slot in play. Read from storage the first time it is needed. */
let playing: number | null = null;

/** The slot in play (1 to SLOT_COUNT): the one played last in this browser. */
export function currentSlot(s: Store | null = store()): number {
  playing ??= loadSlots(s).current;
  return playing;
}

/** Plays as another slot from now on, and remembers it for the next visit. */
export function pickSlot(n: number, s: Store | null = store()): void {
  if (!validSlot(n)) return;
  playing = n;
  writeSlots({ ...loadSlots(s), current: n }, s);
}

const tidyName = (name: string) => name.replace(/\s+/g, ' ').trim().slice(0, NAME_LENGTH);

/** Names a slot (trimmed, at most NAME_LENGTH letters). An empty name takes the name away. */
export function nameSlot(n: number, name: string, s: Store | null = store()): void {
  if (!validSlot(n)) return;
  const m = loadSlots(s);
  const { [n]: _old, ...names } = m.names;
  const tidy = tidyName(name);
  writeSlots({ ...m, names: tidy ? { ...names, [n]: tidy } : names }, s);
}

/** What the "Who's playing?" screen shows for one slot. */
export interface SlotSummary {
  slot: number;
  /** The player's name, or "Player 2" if they never gave one. */
  name: string;
  /** Someone has played here (or named it). An unused slot is an empty seat. */
  used: boolean;
  /** Chapters won. */
  won: number;
  /** The table left most recently, if any. */
  latest: KeptTable | null;
  mathStars: number;
}

/** Every slot, in order, for the "Who's playing?" screen. */
export function slotSummaries(s: Store | null = store()): SlotSummary[] {
  const m = loadSlots(s);
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const slot = i + 1;
    const p = readProgress(slot, s);
    const tables = readTables(slot, s);
    const named = typeof m.names[slot] === 'string' && m.names[slot] !== '';
    const used = named || p.seenOpening || Object.keys(p.played).length > 0 || Object.keys(p.won).length > 0 || Object.keys(tables).length > 0;
    return { slot, name: named ? m.names[slot] : `Player ${slot}`, used, won: Object.keys(p.won).length, latest: latestTable(tables), mathStars: p.mathStars };
  });
}

/** Empties a slot: its progress, settings, tables left part-way, and its name. */
export function clearSlot(n: number, s: Store | null = store()): void {
  if (!validSlot(n)) return;
  try {
    s?.setItem(progressKey(n), JSON.stringify(empty()));
    s?.setItem(tablesKey(n), '{}');
  } catch {
    /* nothing saved to wipe */
  }
  nameSlot(n, '', s);
}

// ---------------------------------------------------------------- progress (of the slot in play)

function readProgress(slot: number, s: Store | null): Progress {
  try {
    const raw = s?.getItem(progressKey(slot));
    if (!raw) return empty();
    const p = JSON.parse(raw) as Partial<Progress>;
    if (p.version !== VERSION) return empty();
    return { ...empty(), ...p };
  } catch {
    return empty();
  }
}

export function loadProgress(s: Store | null = store()): Progress {
  return readProgress(currentSlot(s), s);
}

export function saveProgress(p: Progress, s: Store | null = store()): void {
  try {
    s?.setItem(progressKey(currentSlot(s)), JSON.stringify(p));
  } catch {
    /* storage full or disabled: progress just isn't saved */
  }
}

/** Records a chapter start or result and saves. Returns the new progress. */
export function record(p: Progress, chapterId: string, event: 'started' | 'won', s: Store | null = store()): Progress {
  const now = new Date().toISOString();
  const next: Progress =
    event === 'won'
      ? { ...p, won: { ...p.won, [chapterId]: p.won[chapterId] ?? now } }
      : { ...p, played: { ...p.played, [chapterId]: now } };
  saveProgress(next, s);
  return next;
}

export function setHints(p: Progress, hints: boolean, s: Store | null = store()): Progress {
  return setOption(p, 'hints', hints, s);
}

/** Turns a setting (hints, sound, music, Math Mode) on or off and saves. */
export function setOption(p: Progress, option: 'hints' | 'sound' | 'music' | 'math', on: boolean, s: Store | null = store()): Progress {
  const next = { ...p, [option]: on };
  saveProgress(next, s);
  return next;
}

/** The opening has been watched (or skipped); it won't play by itself again. */
export function sawOpening(p: Progress, s: Store | null = store()): Progress {
  const next = { ...p, seenOpening: true };
  saveProgress(next, s);
  return next;
}

/** One more star for a right answer in Math Mode. */
export function addMathStar(p: Progress, s: Store | null = store()): Progress {
  const next = { ...p, mathStars: p.mathStars + 1 };
  saveProgress(next, s);
  return next;
}

/** Wipes the saved progress of the slot in play, and every table it left part-way. Its name stays. */
export function resetProgress(s: Store | null = store()): Progress {
  const p = empty();
  saveProgress(p, s);
  try {
    s?.setItem(tablesKey(currentSlot(s)), '{}');
  } catch {
    /* nothing saved to wipe */
  }
  return p;
}

// ---------------------------------------------------------------- tables left part-way

/** A table left part-way, and when it was saved (ISO time). */
export type KeptTable = SavedTable & { savedAt: string };
/** Chapters left part-way, by chapter id. */
export type SavedTables = Record<string, KeptTable>;

function readTables(slot: number, s: Store | null): SavedTables {
  try {
    const raw = s?.getItem(tablesKey(slot));
    const t = raw ? (JSON.parse(raw) as SavedTables) : {};
    return t && typeof t === 'object' ? t : {};
  } catch {
    return {};
  }
}

export function loadTables(s: Store | null = store()): SavedTables {
  return readTables(currentSlot(s), s);
}

function writeTables(t: SavedTables, s: Store | null): SavedTables {
  try {
    s?.setItem(tablesKey(currentSlot(s)), JSON.stringify(t));
  } catch {
    /* storage full or disabled: the table just isn't kept */
  }
  return t;
}

/** Keeps a chapter's table (after a hand), replacing any earlier save of it. */
export function saveTable(table: SavedTable, s: Store | null = store()): SavedTables {
  return writeTables({ ...loadTables(s), [table.chapterId]: { ...table, savedAt: new Date().toISOString() } }, s);
}

/** Forgets a chapter's table: it was finished, or started over. */
export function clearTable(chapterId: string, s: Store | null = store()): SavedTables {
  const { [chapterId]: _gone, ...rest } = loadTables(s);
  return writeTables(rest, s);
}

/** The table left most recently, if any. */
export function latestTable(t: SavedTables): KeptTable | null {
  return Object.values(t).sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0] ?? null;
}
