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
 */
import type { SavedTable } from '../table/session';

const KEY = 'historical-poker/progress';
const TABLES_KEY = 'historical-poker/tables';
const VERSION = 1;

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
}

const empty = (): Progress => ({ version: VERSION, won: {}, played: {}, hints: true, sound: true, music: true });

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

export function loadProgress(s: Store | null = store()): Progress {
  try {
    const raw = s?.getItem(KEY);
    if (!raw) return empty();
    const p = JSON.parse(raw) as Partial<Progress>;
    if (p.version !== VERSION) return empty();
    return { ...empty(), ...p };
  } catch {
    return empty();
  }
}

export function saveProgress(p: Progress, s: Store | null = store()): void {
  try {
    s?.setItem(KEY, JSON.stringify(p));
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

/** Turns a setting (hints, sound, music) on or off and saves. */
export function setOption(p: Progress, option: 'hints' | 'sound' | 'music', on: boolean, s: Store | null = store()): Progress {
  const next = { ...p, [option]: on };
  saveProgress(next, s);
  return next;
}

/** Wipes saved progress, and every table left part-way. */
export function resetProgress(s: Store | null = store()): Progress {
  const p = empty();
  saveProgress(p, s);
  try {
    s?.setItem(TABLES_KEY, '{}');
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

export function loadTables(s: Store | null = store()): SavedTables {
  try {
    const raw = s?.getItem(TABLES_KEY);
    const t = raw ? (JSON.parse(raw) as SavedTables) : {};
    return t && typeof t === 'object' ? t : {};
  } catch {
    return {};
  }
}

function writeTables(t: SavedTables, s: Store | null): SavedTables {
  try {
    s?.setItem(TABLES_KEY, JSON.stringify(t));
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
