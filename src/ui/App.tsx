/**
 * Screens: the chapter's opening story, the table, and the ending.
 * Only one chapter exists so far; when there are more, a chapter map goes
 * here (docs/ROADMAP.md).
 */
import { useState } from 'react';
import { RIVERBOAT } from '../chapters/riverboat';
import type { Chapter } from '../chapters/types';
import { Session } from '../table/session';
import { PoweredBy } from './PoweredBy';
import { Stage } from './Stage';
import { TableScreen } from './TableScreen';

type Screen = { name: 'intro' } | { name: 'table'; session: Session } | { name: 'end'; won: boolean };

export function App() {
  const chapter = RIVERBOAT;
  const [screen, setScreen] = useState<Screen>({ name: 'intro' });
  const sit = () => setScreen({ name: 'table', session: new Session(chapter) });
  return (
    <Stage>
      {screen.name === 'intro' && <IntroScreen chapter={chapter} onStart={sit} />}
      {screen.name === 'table' && (
        <TableScreen session={screen.session} onFinished={() => setScreen({ name: 'end', won: screen.session.snapshot().outcome === 'won' })} />
      )}
      {screen.name === 'end' && <EndScreen chapter={chapter} won={screen.won} onAgain={sit} />}
    </Stage>
  );
}

function IntroScreen({ chapter, onStart }: { chapter: Chapter; onStart: () => void }) {
  return (
    <div className="story-screen">
      <img className="layer story-bg" src={chapter.scene.background} alt="" />
      <PoweredBy />
      <div className="story-card">
        <div className="eyebrow">
          Chapter {chapter.numeral} · {chapter.place}, {chapter.year}
        </div>
        <h1>{chapter.title}</h1>
        {chapter.intro.map((p) => <p key={p}>{p}</p>)}
        <ul className="cast">
          {chapter.rivals.map((c) => (
            <li key={c.id}>
              <img src={c.art.src} alt="" className={`cast-face cast-${c.art.kind}`} />
              <div>
                <div className="cast-name">{c.fullName}</div>
                <div className="cast-role">{c.role}</div>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className="chip chip-raise chip-wide" onClick={onStart} autoFocus>
          Take a seat
        </button>
      </div>
    </div>
  );
}

function EndScreen({ chapter, won, onAgain }: { chapter: Chapter; won: boolean; onAgain: () => void }) {
  return (
    <div className="story-screen">
      <img className="layer story-bg" src={chapter.scene.background} alt="" />
      <div className="story-card">
        <div className="eyebrow">{won ? 'Chapter complete' : 'The deck stays aboard'}</div>
        <h1>{won ? 'The deck is yours' : 'Busted'}</h1>
        {(won ? chapter.outro.won : chapter.outro.lost).map((p) => <p key={p}>{p}</p>)}
        <h3>From the history book</h3>
        {chapter.history.map((p) => <p key={p} className="history">{p}</p>)}
        <button type="button" className="chip chip-raise chip-wide" onClick={onAgain} autoFocus>
          {won ? 'Play again' : 'Try again'}
        </button>
      </div>
    </div>
  );
}
