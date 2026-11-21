/**
 * A sequence of paintings with one caption each: the opening before the
 * chapter select, and the ending after the epilogue (src/story/montages.ts).
 *
 * Each picture wipes in from the left over the one before. It moves on by
 * itself after a few seconds; a press, Space, Enter or the right arrow moves
 * on at once, and "Skip" jumps to the end. After the last picture comes
 * `finish`: the title and "Take a seat" for the opening, the credits for the
 * ending. No boxes: the painting fills the stage and the caption sits on a
 * shaded strip along the bottom, like dialogue at the table.
 */
import { useEffect, useState, type ReactNode } from 'react';
import type { Slide } from '../story/montages';
import { SceneBack, SceneFront } from './Scene';

/** How long a picture stays before the next wipes in. */
const HOLD_MS = 8000;

const art = (file: string) => `${import.meta.env.BASE_URL}art/${file}`;

export function Montage({ slides, finish, onSkip, musicLink }: { slides: Slide[]; finish: ReactNode; onSkip: () => void; musicLink?: ReactNode }) {
  // `at` counts slides shown so far; slides.length means the finish screen.
  const [at, setAt] = useState(0);
  const done = at >= slides.length;
  const next = () => setAt((n) => Math.min(n + 1, slides.length));

  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(next, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [at, done]);
  useEffect(() => {
    if (done) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [done, onSkip]);

  // The picture before stays underneath while the new one wipes over it.
  const shown = done ? [slides[slides.length - 1]] : slides.slice(Math.max(0, at - 1), at + 1);
  const first = Math.max(0, at - 1);
  return (
    <div className="montage" onClick={done ? undefined : next}>
      {shown.map((s, i) => (
        <div key={done ? 'last' : first + i} className={`montage-slide${!done && first + i === at && at > 0 ? ' montage-wipe' : ''}`}>
          {s.image ? <img className="layer" src={art(s.image)} alt="" /> : <Placeholder slide={s} />}
        </div>
      ))}
      {done ? (
        <div className="montage-finish">{finish}</div>
      ) : (
        <>
          <div className="montage-strip" key={at}>
            <div className="eyebrow">{slides[at].when}</div>
            <p>{slides[at].caption}</p>
          </div>
          <div className="montage-links" onClick={(e) => e.stopPropagation()}>
            <span className="montage-count" aria-hidden="true">
              {slides.map((_, i) => (i === at ? '◆' : '◇')).join(' ')}
            </span>
            {musicLink}
            <button type="button" className="text-link" onClick={onSkip}>
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** Until a slide has its painting: an empty lamplit room in the slide's colours. */
function Placeholder({ slide }: { slide: Slide }) {
  const palette = slide.palette ?? { wall: '#1a1410', light: '#f2b45a', felt: '#2f5a3a', rim: '#8a6a2a' };
  return (
    <>
      <SceneBack scene={{ palette }} />
      <SceneFront scene={{ palette }} />
    </>
  );
}
