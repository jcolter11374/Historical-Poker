/**
 * Saved progress, in the browser's localStorage. No accounts, no server:
 * clearing the browser's data resets it. Saved after every chapter ends.
 *
 * Stored under one key as JSON. Bump VERSION and migrate in load() if the
 * shape ever changes.
 */
const KEY = 'historical-poker/progress';
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
  /** Math Mode: sums at the table for young players (off by default). See src/math. */
  math: boolean;
  /** Stars earned for right answers in Math Mode. */
  mathStars: number;
}

const empty = (): Progress => ({ version: VERSION, won: {}, played: {}, hints: true, sound: true, music: true, math: false, mathStars: 0 });

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

/** Turns a setting (hints, sound, music, Math Mode) on or off and saves. */
export function setOption(p: Progress, option: 'hints' | 'sound' | 'music' | 'math', on: boolean, s: Store | null = store()): Progress {
  const next = { ...p, [option]: on };
  saveProgress(next, s);
  return next;
}

/** One more star for a right answer in Math Mode. */
export function addMathStar(p: Progress, s: Store | null = store()): Progress {
  const next = { ...p, mathStars: p.mathStars + 1 };
  saveProgress(next, s);
  return next;
}

/** Wipes saved progress. */
export function resetProgress(s: Store | null = store()): Progress {
  const p = empty();
  saveProgress(p, s);
  return p;
}
