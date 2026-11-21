/**
 * Screens and the flow between them:
 *
 *   chapter select (the deck case) -> chapter intro (with "the story so far"
 *   when jumping ahead) -> the table -> the ending -> next chapter or back
 *   to the case.
 *
 *   chapter select -> practice (pick any game) -> a practice table -> back
 *   to practice. Practice tables never end and are never saved.
 *
 * Progress (chapters won, hints on or off) is saved in the browser after each
 * chapter (src/progress/save.ts).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { CHAPTERS, followingChapter, isUnlocked, nextChapter } from '../chapters';
import type { Chapter } from '../chapters/types';
import { addMathStar, loadProgress, record, resetProgress, setHints, setOption, type Progress } from '../progress/save';
import { practiceChapter, type PracticeGame } from '../practice';
import { Session } from '../table/session';
import { ChapterSelect } from './ChapterSelect';
import { PracticeScreen } from './PracticeScreen';
import { PoweredBy } from './PoweredBy';
import { Face, SceneBack } from './Scene';
import { Stage } from './Stage';
import { playMusic, setMusicOn, setSoundOn, unlock } from './sound';
import { TableScreen } from './TableScreen';

type Screen =
  | { name: 'select' }
  | { name: 'intro'; chapter: Chapter }
  | { name: 'table'; session: Session }
  | { name: 'end'; chapter: Chapter; won: boolean }
  | { name: 'practice' };

export function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const won = new Set(Object.keys(progress.won));
  const [screen, setScreen] = useState<Screen>(() => (Object.keys(progress.played).length ? { name: 'select' } : { name: 'intro', chapter: nextChapter(won) }));

  // Sound: browsers only allow it after a press, so start audio on the first one.
  useEffect(() => {
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);
  useEffect(() => setSoundOn(progress.sound), [progress.sound]);
  useEffect(() => setMusicOn(progress.music), [progress.music]);
  // The table picks its own music (a stage can change it); story screens play the chapter's.
  const storyMusic = screen.name === 'intro' || screen.name === 'end' ? (screen.chapter.scene.music ?? null) : null;
  useEffect(() => {
    if (screen.name !== 'table') playMusic(storyMusic);
  }, [screen.name, storyMusic]);

  // The practice game picked last, so leaving a practice table comes back to it.
  const [practiced, setPracticed] = useState<string | null>(null);
  const practise = (game: PracticeGame, lesson: boolean) => {
    setPracticed(game.key);
    setScreen({ name: 'table', session: new Session(practiceChapter(game, { lesson })) });
  };
  // "Music on" / "Music off": a plain text link on the story screens and the table.
  const musicLink = (
    <button type="button" className="text-link" onClick={() => setProgress((p) => setOption(p, 'music', !p.music))} aria-pressed={progress.music}>
      {progress.music ? 'Music on' : 'Music off'}
    </button>
  );

  const sit = (chapter: Chapter) => {
    setProgress(record(progress, chapter.id, 'started'));
    setScreen({ name: 'table', session: new Session(chapter) });
  };
  const finished = (session: Session) => {
    const didWin = session.snapshot().outcome === 'won';
    if (didWin) setProgress((p) => record(p, session.chapter.id, 'won'));
    setScreen({ name: 'end', chapter: session.chapter, won: didWin });
  };

  return (
    <Stage>
      {screen.name === 'select' && (
        <ChapterSelect
          progress={progress}
          onPick={(chapter) => setScreen({ name: 'intro', chapter })}
          onPractice={() => setScreen({ name: 'practice' })}
          onHints={(on) => setProgress(setHints(progress, on))}
          onOption={(option, on) => setProgress(setOption(progress, option, on))}
          onReset={() => setProgress(resetProgress())}
        />
      )}
      {screen.name === 'intro' && (
        <IntroScreen chapter={screen.chapter} jumping={!isUnlocked(screen.chapter.id, won)} onStart={() => sit(screen.chapter)} onBack={() => setScreen({ name: 'select' })} musicLink={musicLink} />
      )}
      {screen.name === 'table' && (
        <TableScreen
          session={screen.session}
          hints={progress.hints}
          sound={progress.sound}
          onSound={(on) => setProgress(setOption(progress, 'sound', on))}
          musicLink={musicLink}
          math={progress.math}
          mathStars={progress.mathStars}
          onMath={(on) => setProgress((p) => setOption(p, 'math', on))}
          onMathStar={() => setProgress((p) => addMathStar(p))}
          onFinished={() => finished(screen.session)}
          onLeave={() => setScreen(screen.session.chapter.practice ? { name: 'practice' } : { name: 'select' })}
        />
      )}
      {screen.name === 'practice' && <PracticeScreen initial={practiced} onSit={practise} onBack={() => setScreen({ name: 'select' })} />}
      {screen.name === 'end' && (
        <EndScreen
          chapter={screen.chapter}
          won={screen.won}
          onAgain={() => sit(screen.chapter)}
          onNext={(c) => setScreen({ name: 'intro', chapter: c })}
          onCase={() => setScreen({ name: 'select' })}
          musicLink={musicLink}
        />
      )}
    </Stage>
  );
}

function IntroScreen({ chapter, jumping, onStart, onBack, musicLink }: { chapter: Chapter; jumping: boolean; onStart: () => void; onBack: () => void; musicLink: ReactNode }) {
  const first = CHAPTERS[0].chapter.id === chapter.id;
  return (
    <div className={`story-screen ${chapter.scene.title ? 'story-titled' : ''}`}>
      {chapter.scene.title ? <img className="layer" src={chapter.scene.title} alt="" /> : <SceneBack scene={chapter.scene} />}
      <div className="story-shade" />
      <PoweredBy />
      <div className="story-card">
        <div className="eyebrow">
          {chapter.numeral === 'Bonus' || chapter.numeral === 'Epilogue' ? chapter.numeral : `Chapter ${chapter.numeral}`} · {chapter.place}, {chapter.year}
        </div>
        <h1>{chapter.title}</h1>
        {jumping && !first && (
          <div className="recap">
            <h3>The story so far</h3>
            {chapter.recap.map((p) => <p key={p}>{p}</p>)}
          </div>
        )}
        {chapter.intro.map((p) => <p key={p}>{p}</p>)}
        <p className="you-are">
          You play {chapter.youAre}. Taught here: {chapter.teaches}.
        </p>
        <ul className="cast">
          {chapter.rivals.map((c) => (
            <li key={c.id}>
              <Face character={c} />
              <div>
                <div className="cast-name">{c.fullName}</div>
                <div className="cast-role">{c.role}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="story-buttons">
          <button type="button" className="chip chip-raise chip-wide" onClick={onStart} autoFocus>
            Take a seat
          </button>
          <button type="button" className="text-link" onClick={onBack}>
            All chapters
          </button>
          {musicLink}
        </div>
      </div>
    </div>
  );
}

function EndScreen({ chapter, won, onAgain, onNext, onCase, musicLink }: { chapter: Chapter; won: boolean; onAgain: () => void; onNext: (c: Chapter) => void; onCase: () => void; musicLink: ReactNode }) {
  const next = won ? followingChapter(chapter.id) : null;
  const nemesis = chapter.rivals.find((r) => r.id === chapter.nemesisId)!;
  const last = chapter.id === CHAPTERS[CHAPTERS.length - 1].chapter.id;
  return (
    <div className="story-screen">
      <SceneBack scene={chapter.scene} />
      <div className="story-shade" />
      <PoweredBy />
      <div className="story-card">
        <div className="eyebrow">{won ? 'Chapter complete' : 'Not this time'}</div>
        <h1>{won ? chapter.title : 'Busted'}</h1>
        {(won ? chapter.outro.won : chapter.outro.lost).map((p) => <p key={p}>{p}</p>)}
        {won && (
          <div className="keepsake">
            <Face character={nemesis} className="keepsake-face" />
            <div>
              <div className="keepsake-title">A keepsake for the deck’s case: {chapter.keepsake.name}</div>
              <div className="keepsake-line">{chapter.keepsake.line}</div>
            </div>
          </div>
        )}
        <h3>From the history book</h3>
        {chapter.history.map((p) => <p key={p} className="history">{p}</p>)}
        <div className="story-buttons">
          {next ? (
            <button type="button" className="chip chip-raise chip-wide" onClick={() => onNext(next)} autoFocus>
              On to {next.title}
            </button>
          ) : (
            <button type="button" className="chip chip-raise chip-wide" onClick={won ? onCase : onAgain} autoFocus>
              {won ? 'Back to the deck case' : 'Try again'}
            </button>
          )}
          {won && last && (
            <a className="chip chip-call chip-wide" href="https://rsdp-poker-live.fly.dev" target="_blank" rel="noreferrer">
              Start your own game on RSDP Live
            </a>
          )}
          {(next || !won) && (
            <button type="button" className="text-link" onClick={won ? onAgain : onCase}>
              {won ? 'Play this chapter again' : 'All chapters'}
            </button>
          )}
          {next && (
            <button type="button" className="text-link" onClick={onCase}>
              All chapters
            </button>
          )}
          {musicLink}
        </div>
      </div>
    </div>
  );
}
