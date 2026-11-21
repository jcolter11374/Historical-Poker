/**
 * The title screen and chapter select: the Ashcombe deck's leather case,
 * open, with one card per chapter. A won chapter's card shows its keepsake
 * (the beaten rival); the next chapter glows; a chapter left part-way says
 * so ("Hand 12"); later ones are face down but every one can be opened,
 * after "the story so far", so a friend can jump right to the game they
 * want to learn. Each card names the game it teaches, and its year; a
 * chapter that goes back in time is marked as a tale told in the story
 * (Chapter.toldBy), because the story opens in 1836, not 1543.
 *
 * "Continue" sits you back down at the table you left most recently, or
 * opens the next chapter of the story.
 */
import { useState } from 'react';
import { CHAPTERS, isUnlocked, nextChapter } from '../chapters';
import type { Chapter } from '../chapters/types';
import { latestTable, type Progress, type SavedTables } from '../progress/save';
import { PoweredBy } from './PoweredBy';

/** The painting behind the chapter cards: the open deck case, lined with red velvet (docs/ART.md). */
const SELECT_ART = `linear-gradient(rgba(12, 6, 2, 0.35), rgba(12, 6, 2, 0.35)), url(${import.meta.env.BASE_URL}art/chapter-select.webp)`;
import { Face } from './Scene';

export function ChapterSelect({
  progress,
  tables,
  onPick,
  onOpening,
  onClosing,
  onResume,
  onPractice,
  onHints,
  onOption,
  onReset,
}: {
  progress: Progress;
  /** Chapters left part-way. */
  tables: SavedTables;
  /** Watch the opening pictures again; and, once the epilogue is won, the ending. */
  onOpening: () => void;
  onClosing: () => void;
  onPick: (c: Chapter) => void;
  /** Back to the table left most recently. */
  onResume: () => void;
  onPractice: () => void;
  onHints: (on: boolean) => void;
  onOption: (option: 'sound' | 'music' | 'math', on: boolean) => void;
  onReset: () => void;
}) {
  const won = new Set(Object.keys(progress.won));
  const next = nextChapter(won);
  const finished = won.has(CHAPTERS[CHAPTERS.length - 1].chapter.id);
  const latest = latestTable(tables);
  const latestChapter = latest ? CHAPTERS.find((e) => e.chapter.id === latest.chapterId)?.chapter : undefined;
  const [confirmReset, setConfirmReset] = useState(false);
  const part = (n: 1 | 2) => CHAPTERS.filter((e) => e.chapter.part === n).map((e) => e.chapter);
  const card = (c: Chapter) => {
    const isWon = won.has(c.id);
    const open = isUnlocked(c.id, won);
    const nemesis = c.rivals.find((r) => r.id === c.nemesisId)!;
    const saved = tables[c.id];
    return (
      <button
        key={c.id}
        type="button"
        className={`case-card${isWon ? ' case-won' : ''}${c.id === (latestChapter ?? next).id && !isWon ? ' case-next' : ''}${open || saved ? '' : ' case-locked'}`}
        onClick={() => onPick(c)}
        title={saved ? `Back to ${c.title}, hand ${saved.handNumber + 1}` : open ? `Play ${c.title}` : `Jump ahead to ${c.title}: you’ll read the story so far first`}
      >
        <span className="case-numeral">{c.numeral}</span>
        <span className="case-title">{c.title}</span>
        <span className="case-year">{c.year}</span>
        {c.toldBy && <span className="case-told">{c.toldBy}</span>}
        {isWon ? <Face character={nemesis} className="case-face" /> : <span className="case-seal" aria-hidden="true">{open || saved ? '♠' : '✦'}</span>}
        <span className="case-game">{c.teaches}</span>
        {saved ? <span className="case-badge case-badge-saved">At hand {saved.handNumber + 1}</span> : isWon && <span className="case-badge">Won</span>}
      </button>
    );
  };
  return (
    <div className="select-screen select-painted" style={{ backgroundImage: SELECT_ART }}>
      <PoweredBy />
      <header className="select-head">
        <div className="eyebrow">The Ashcombe deck, 1543 to today</div>
        <h1>Still Ours</h1>
        <p>One family deck, every table it was ever played on. Each chapter teaches the poker of its time.</p>
      </header>
      <div className="case">
        <div className="case-part">
          <h2>Part One · It opens in 1836, looks back to 1543, and goes on to 1876</h2>
          <div className="case-row">{part(1).map(card)}</div>
        </div>
        <div className="case-part">
          <h2>Part Two · 1926 to today</h2>
          <div className="case-row">{part(2).map(card)}</div>
        </div>
      </div>
      <footer className="select-foot">
        {latestChapter ? (
          <button type="button" className="chip chip-raise chip-wide" onClick={onResume} autoFocus>
            Continue: {latestChapter.title}
          </button>
        ) : (
          <button type="button" className="chip chip-raise chip-wide" onClick={() => onPick(next)} autoFocus>
            {won.size ? `Continue: ${next.title}` : 'Begin the story'}
          </button>
        )}
        <button type="button" className="chip chip-call chip-wide" onClick={onPractice} title="Play any game on its own, outside the story">
          Practice any game
        </button>
        <label className="toggle">
          <input type="checkbox" checked={progress.hints} onChange={(e) => onHints(e.target.checked)} /> Teacher hints at the table
        </label>
        <label className="toggle">
          <input type="checkbox" checked={progress.sound} onChange={(e) => onOption('sound', e.target.checked)} /> Sound
        </label>
        <label className="toggle">
          <input type="checkbox" checked={progress.music} onChange={(e) => onOption('music', e.target.checked)} /> Music
        </label>
        <label className="toggle" title="Sums for young players at the table: counting helpful cards, and whether a call is a good deal">
          <input type="checkbox" checked={progress.math} onChange={(e) => onOption('math', e.target.checked)} /> Math Mode{progress.math && progress.mathStars > 0 ? ` · ★ ${progress.mathStars}` : ''}
        </label>
        {confirmReset ? (
          <span className="reset">
            Forget every chapter you’ve won, and every table you left?{' '}
            <button type="button" className="text-link" onClick={() => { onReset(); setConfirmReset(false); }}>
              Yes, start over
            </button>{' '}
            <button type="button" className="text-link" onClick={() => setConfirmReset(false)}>
              No
            </button>
          </span>
        ) : (
          <button type="button" className="text-link" onClick={() => setConfirmReset(true)}>
            Start over
          </button>
        )}
      </footer>
      <div className="select-links">
        <button type="button" className="text-link" onClick={onOpening}>
          Watch the opening
        </button>
        {finished && (
          <button type="button" className="text-link" onClick={onClosing}>
            Watch the ending
          </button>
        )}
      </div>
    </div>
  );
}
