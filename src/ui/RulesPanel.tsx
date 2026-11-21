/**
 * The rules sheet: a sheet of the era's paper over the table, in three short
 * pages so no page is a wall of text.
 *
 * 1. The rules: how a hand goes and how the betting works | the hands, best first.
 * 2. Playing it well: tips | mistakes new players make (src/games/guide.ts).
 * 3. This chapter: how to win it | the history book.
 *
 * The pages are plain text links along the top, like the table's corner links.
 */
import { useEffect, useRef, useState } from 'react';
import type { Betting, Chapter, Extras } from '../chapters/types';
import type { GameDef } from '../games/catalog';
import { bettingWords, extrasWords, guideFor } from '../games/guide';

const PAGES = ['The rules', 'Playing it well', 'This chapter'] as const;
type Page = (typeof PAGES)[number];

export function RulesPanel({
  chapter,
  game,
  playName,
  betting,
  extras,
  unitMoney,
  hints,
  onClose,
}: {
  chapter: Chapter;
  game: GameDef;
  playName: string;
  betting: Betting;
  /** House extras at this stage (bomb pots, the 7-2 bounty). */
  extras?: Extras;
  /** A number of stake units, as money: "$4". */
  unitMoney: (units: number) => string;
  /** Teacher hints are on. */
  hints: boolean;
  onClose: () => void;
}) {
  const [page, setPage] = useState<Page>('The rules');
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => first.current?.focus(), []);
  const card = game.card;
  const guide = guideFor(game.id);
  const house = extrasWords(extras, unitMoney);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="rules-title" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="sheet-eyebrow">{chapter.rulesObject}</div>
        <h2 id="rules-title">{game.historical ? card.title : playName}</h2>
        <nav className="sheet-pages">
          {PAGES.map((p, i) => (
            <button key={p} ref={i === 0 ? first : undefined} type="button" className={p === page ? 'current' : ''} aria-pressed={p === page} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
        </nav>

        {page === 'The rules' && (
          <div className="sheet-columns">
            <section>
              <h3>How a hand goes</h3>
              {card.howToPlay.map((t) => <p key={t}>{t}</p>)}
              <h3>The betting</h3>
              {bettingWords(betting, game.forced, game.spec.family, !!game.historical).map((t) => <p key={t}>{t}</p>)}
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
              {house.length > 0 && (
                <>
                  <h3>House extras</h3>
                  {house.map((t) => <p key={t}>{t}</p>)}
                </>
              )}
            </section>
          </div>
        )}

        {page === 'Playing it well' && (
          <div className="sheet-columns">
            <section>
              <h3>Tips from the table</h3>
              <ul className="tips">
                {guide.tips.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>
            <section>
              <h3>Easy mistakes</h3>
              <ul className="tips">
                {guide.mistakes.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <p className="note">
                {hints
                  ? 'Stuck on a hand? “Ask for a hint” at the table: your teacher says what they’d do, how often a hand like yours wins, and what the bet costs.'
                  : 'Teacher hints are off. Turn them on from the chapter list to ask what your teacher would do on any hand.'}
              </p>
            </section>
          </div>
        )}

        {page === 'This chapter' && (
          <div className="sheet-columns">
            <section>
              <h3>How to win</h3>
              {chapter.howToWin.map((t) => <p key={t}>{t}</p>)}
            </section>
            <section>
              <h3>From the history book</h3>
              {chapter.history.map((t) => <p key={t}>{t}</p>)}
            </section>
          </div>
        )}

        <button type="button" className="sheet-close" onClick={onClose}>
          Back to the table
        </button>
      </div>
    </div>
  );
}
