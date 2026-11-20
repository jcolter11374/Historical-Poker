/**
 * Every chapter, in story order, and what unlocks what.
 *
 * The story runs in a line: each chapter unlocks the next. The bonus (1817)
 * unlocks after the Part One finale but isn't needed to go on to Part Two.
 * Any chapter can also be started straight away from the chapter select,
 * after a short "story so far" (src/ui/ChapterSelect.tsx), so a friend can
 * go right to the game they want to learn.
 */
import { BACK_ROOM } from './backRoom';
import { BIG_O } from './bigO';
import { BOARDWALK } from './boardwalk';
import { BOOM } from './boom';
import { CAMP } from './camp';
import { CERCLE } from './cercle';
import { DESERT_CLASSIC } from './desertClassic';
import { GAMING_HOUSE } from './gamingHouse';
import { KITCHEN_TABLE } from './kitchenTable';
import { LAST_HAND } from './lastHand';
import { LAST_TABLE } from './lastTable';
import { NORTH_ROAD } from './northRoad';
import { PAINTED_DECK } from './paintedDeck';
import { RIVERBOAT } from './riverboat';
import type { Chapter } from './types';

export interface ChapterEntry {
  chapter: Chapter;
  /** The chapter that must be won first to unlock this one; null = open from the start. */
  after: string | null;
}

export const CHAPTERS: ChapterEntry[] = [
  { chapter: RIVERBOAT, after: null },
  { chapter: PAINTED_DECK, after: 'riverboat' },
  { chapter: NORTH_ROAD, after: 'painted-deck' },
  { chapter: CAMP, after: 'north-road' },
  { chapter: LAST_HAND, after: 'camp' },
  { chapter: GAMING_HOUSE, after: 'last-hand' },
  { chapter: BACK_ROOM, after: 'last-hand' },
  { chapter: DESERT_CLASSIC, after: 'back-room' },
  { chapter: CERCLE, after: 'desert-classic' },
  { chapter: BOARDWALK, after: 'cercle' },
  { chapter: BOOM, after: 'boardwalk' },
  { chapter: BIG_O, after: 'boom' },
  { chapter: LAST_TABLE, after: 'big-o' },
  { chapter: KITCHEN_TABLE, after: 'last-table' },
];

export function chapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((e) => e.chapter.id === id)?.chapter;
}

/** Unlocked: open from the start, or the chapter before it has been won. */
export function isUnlocked(id: string, won: ReadonlySet<string>): boolean {
  const entry = CHAPTERS.find((e) => e.chapter.id === id);
  return !!entry && (entry.after === null || won.has(entry.after));
}

/** The next chapter to play: the first unlocked one not yet won. */
export function nextChapter(won: ReadonlySet<string>): Chapter {
  return (CHAPTERS.find((e) => isUnlocked(e.chapter.id, won) && !won.has(e.chapter.id)) ?? CHAPTERS[0]).chapter;
}

/** The chapter that follows this one in the story, if any (the bonus is skipped). */
export function followingChapter(id: string): Chapter | null {
  const next = CHAPTERS.find((e) => e.after === id && e.chapter.numeral !== 'Bonus');
  return next?.chapter ?? null;
}
