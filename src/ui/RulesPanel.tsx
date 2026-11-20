/** The rules card: the current game's rules and hand rankings, how to win the chapter, and its history. */
import { useEffect, useRef } from 'react';
import type { Chapter } from '../chapters/types';
import type { GameDef } from '../games/catalog';

export function RulesPanel({ chapter, game, playName, onClose }: { chapter: Chapter; game: GameDef; playName: string; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => close.current?.focus(), []);
  const card = game.card;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="rules-title" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="sheet-eyebrow">{chapter.rulesObject}</div>
        <h2 id="rules-title">{game.historical ? card.title : playName}</h2>
        <div className="sheet-columns">
          <section>
            <h3>How a hand goes</h3>
            {card.howToPlay.map((t) => <p key={t}>{t}</p>)}
            <h3>This chapter</h3>
            {chapter.howToWin.map((t) => <p key={t}>{t}</p>)}
          </section>
          <section>
            <h3>{card.rankingsTitle}</h3>
            <ol className="rankings">
              {card.rankings.map((r) => (
                <li key={r.name}>
                  <span>{r.name}</span>
                  <span className="example">{r.example}</span>
                </li>
              ))}
            </ol>
            {card.note && <p className="note">{card.note}</p>}
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
