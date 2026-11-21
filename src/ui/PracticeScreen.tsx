/**
 * Practice: pick any game and play it outside the story (src/practice).
 * Laid out like the chapter select: the deck's open case, here holding one
 * small card per game, grouped by kind. Pick a card, then sit down; the
 * game's teacher can explain it first.
 */
import { useState } from 'react';
import { GROUP_TITLES, PRACTICE, type PracticeGame, type PracticeGroup } from '../practice';
import { PoweredBy } from './PoweredBy';
import { Face } from './Scene';

export function PracticeScreen({
  initial,
  onSit,
  onBack,
}: {
  /** The game picked last time, so leaving a practice table comes back to it. */
  initial: string | null;
  onSit: (game: PracticeGame, lesson: boolean) => void;
  onBack: () => void;
}) {
  const [picked, setPicked] = useState<PracticeGame | null>(() => PRACTICE.find((p) => p.key === initial) ?? null);
  const [lesson, setLesson] = useState(true);
  const groups = (Object.keys(GROUP_TITLES) as PracticeGroup[]).map((g) => ({ g, games: PRACTICE.filter((p) => p.group === g) }));
  const where = (p: PracticeGame) => `${p.source.title}, ${p.source.year}`;
  const tip = (p: PracticeGame) => (p.games.length ? `${p.name}: ${p.games.join(', ')}` : `${p.name}, taught by ${p.teacher.fullName}`);
  return (
    <div className="select-screen practice-screen">
      <PoweredBy />
      <header className="select-head">
        <div className="eyebrow">Outside the story</div>
        <h1>The Practice Table</h1>
        <p>Any game, as long as you like. Nobody is knocked out and nothing is saved.</p>
      </header>
      <div className="case practice-case">
        {groups.map(({ g, games }) => (
          <div key={g} className="case-part">
            <h2>{GROUP_TITLES[g]}</h2>
            <div className="case-row practice-row">
              {games.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`practice-card${picked?.key === p.key ? ' practice-picked' : ''}`}
                  aria-pressed={picked?.key === p.key}
                  onClick={() => setPicked(p)}
                  onDoubleClick={() => onSit(p, lesson && p.teachable)}
                  title={tip(p)}
                >
                  <Face character={p.teacher} className="practice-face" />
                  <span className="practice-text">
                    <span className="practice-name">{p.name}</span>
                    <span className="practice-where">{p.blurb ?? `${p.teacher.name}, ${p.source.year}`}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className="select-foot practice-foot">
        {picked ? (
          <>
            <button type="button" className="chip chip-raise chip-wide" onClick={() => onSit(picked, lesson && picked.teachable)} autoFocus>
              Sit down: {picked.name}
            </button>
            <span className="practice-at">
              {picked.teacher.fullName} {picked.teachable ? 'teaches' : 'deals'}, at {where(picked)}.
            </span>
            {picked.teachable && (
              <label className="toggle">
                <input type="checkbox" checked={lesson} onChange={(e) => setLesson(e.target.checked)} /> {picked.teacher.name} explains it first
              </label>
            )}
          </>
        ) : (
          <span className="practice-at">Pick a game.</span>
        )}
        <button type="button" className="text-link" onClick={onBack}>
          Back to the chapters
        </button>
      </footer>
    </div>
  );
}
