/** A parchment sheet with the chapter's rules, hand rankings and history. */
import type { Chapter } from '../chapters/types';
import { CATEGORY_NAMES, RANKING_ORDER } from '../games/straightPoker';
import { useEffect, useRef } from 'react';

const EXAMPLES: Record<number, string> = {
  5: 'K K K K A',
  4: 'Q Q Q 10 10',
  3: 'J J J A K',
  2: 'A A 10 10 Q',
  1: 'K K A Q J',
  0: 'A K Q J 10',
};

export function RulesPanel({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => close.current?.focus(), []);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="rules-title" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <h2 id="rules-title">Rules of {chapter.year}</h2>
        <div className="sheet-columns">
          <section>
            <h3>How a hand goes</h3>
            {chapter.howToPlay.map((t) => <p key={t}>{t}</p>)}
          </section>
          <section>
            <h3>Hands, best first</h3>
            <ol className="rankings">
              {RANKING_ORDER.map((c) => (
                <li key={c}>
                  <span>{CATEGORY_NAMES[c]}</span>
                  <span className="example">{EXAMPLES[c]}</span>
                </li>
              ))}
            </ol>
            <p className="note">No straights or flushes yet. A tie goes to the higher pair or triplets, then the higher odd cards.</p>
          </section>
        </div>
        <section>
          <h3>From the history book</h3>
          {chapter.history.map((t) => <p key={t}>{t}</p>)}
        </section>
        <button ref={close} type="button" className="sheet-close" onClick={onClose}>
          Back to the table
        </button>
      </div>
    </div>
  );
}
