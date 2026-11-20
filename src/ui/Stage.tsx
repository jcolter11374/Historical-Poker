/**
 * Every screen is laid out on a fixed 1600 x 900 stage (the shape of the art)
 * and scaled to fit the window, with dark bars where the window is a
 * different shape. Positions in chapter files are stage pixels.
 *
 * Small screens (phones, small tablets): when the stage is drawn smaller than
 * about three quarters size, words and controls would be too small to read
 * or press. The stage then sets `--boost` (up to 1.6) and the class
 * `stage-compact`, and styles.css ("Small screens") enlarges the name
 * plates, dialogue, chips and links by that much, while the painted scene
 * keeps its size. Phones held upright are asked to turn sideways
 * (RotateHint), since the table is a wide painting.
 */
import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode, type UIEvent } from 'react';

export const STAGE_W = 1600;
export const STAGE_H = 900;
/** Below this scale, text and controls are enlarged. */
const COMPACT_BELOW = 0.75;
const MAX_BOOST = 1.6;

const Compact = createContext(false);

/** True when the stage is drawn small and words and controls are enlarged (a phone, a small tablet). */
export function useCompact(): boolean {
  return useContext(Compact);
}

export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
    };
  }, []);
  const boost = Math.min(MAX_BOOST, Math.max(1, COMPACT_BELOW / scale));
  const style = { width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})`, '--boost': boost } as CSSProperties;
  return (
    <div className="viewport" onScrollCapture={unscroll}>
      <div className={`stage${boost > 1 ? ' stage-compact' : ''}`} style={style}>
        <Compact.Provider value={boost > 1}>{children}</Compact.Provider>
      </div>
      <RotateHint />
    </div>
  );
}

/**
 * Focusing a button (autoFocus) makes the browser scroll its containers to
 * show it, even ones with overflow hidden, which would slide the whole stage
 * off the screen. Put any container that isn't meant to scroll back.
 */
function unscroll(e: UIEvent<HTMLDivElement>) {
  const el = e.target as HTMLElement;
  const { overflowY } = getComputedStyle(el);
  if (overflowY === 'auto' || overflowY === 'scroll') return;
  el.scrollTop = 0;
  el.scrollLeft = 0;
}

/** Shown only on a phone held upright (CSS decides): turn it sideways, or carry on anyway. */
function RotateHint() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="rotate-hint" role="dialog" aria-label="Turn your phone sideways">
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <rect x="30" y="14" width="36" height="62" rx="6" />
        <path d="M44 68h8" />
        <path d="M18 60a34 34 0 0 1 4-30" strokeDasharray="4 5" />
        <path d="M14 34l8-5 4 9" />
      </svg>
      <p>The card table is wide. Turn your phone sideways to sit down.</p>
      <button type="button" className="text-link" onClick={() => setDismissed(true)}>
        Play upright anyway
      </button>
    </div>
  );
}
