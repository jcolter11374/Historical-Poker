/**
 * Screens and the flow between them:
 *
 *   chapter select (the deck case) -> chapter intro (with "the story so far"
 *   when jumping ahead) -> the table -> the ending -> next chapter or back
 *   to the case.
 *
 *   The first visit opens on the opening pictures (the feud, one painting
 *   wiping into the next), and winning the epilogue leads to the ending
 *   pictures and the credits (src/story/montages.ts, Montage.tsx). Both can
 *   be skipped, and watched again from the chapter select.
 *
 *   chapter select -> practice (pick any game) -> a practice table -> back
 *   to practice. Practice tables never end and are never saved.
 *
 * Progress (chapters won, hints on or off) is saved in the browser after each
 * chapter, and a chapter left part-way is saved after every hand, so
 * "Continue" sits you back down at the same table (src/progress/save.ts).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { CHAPTERS, chapterById, followingChapter, isUnlocked } from '../chapters';
import { CLOSING, OPENING } from '../story/montages';
import type { Chapter } from '../chapters/types';
import {
  addMathStar,
  clearTable,
  latestTable,
  loadProgress,
  loadTables,
  record,
  resetProgress,
  sawOpening,
  saveTable,
  setHints,
  setOption,
  type KeptTable,
  type Progress,
} from '../progress/save';
import { practiceChapter, type PracticeGame } from '../practice';
import { Session } from '../table/session';
import { ChapterSelect } from './ChapterSelect';
import { Montage } from './Montage';
import { PracticeScreen } from './PracticeScreen';
import { PoweredBy } from './PoweredBy';
import { Face, SceneBack } from './Scene';
import { focusOnMount, Stage } from './Stage';
import { playMusic, setMusicOn, setSoundOn, unlock } from './sound';
import { TableScreen } from './TableScreen';

type Screen =
  | { name: 'select' }
  | { name: 'intro'; chapter: Chapter }
  | { name: 'table'; session: Session }
  | { name: 'end'; chapter: Chapter; won: boolean }
  | { name: 'practice' }
  /** The feud in pictures, before the chapter select. */
  | { name: 'opening' }
  /** The ending pictures and the credits, after the epilogue. */
  | { name: 'closing' };

export function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [tables, setTables] = useState(() => loadTables());
  const won = new Set(Object.keys(progress.won));
  const [screen, setScreen] = useState<Screen>(() => (loadProgress().seenOpening ? { name: 'select' } : { name: 'opening' }));
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
  // The opening plays the riverboat's tune (where the feud starts) and the ending the kitchen table's.
  const storyMusic =
    screen.name === 'intro' || screen.name === 'end'
      ? (screen.chapter.scene.music ?? null)
      : screen.name === 'opening'
        ? (CHAPTERS[0].chapter.scene.music ?? null)
        : screen.name === 'closing'
          ? (CHAPTERS[CHAPTERS.length - 1].chapter.scene.music ?? null)
          : null;
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

  /** Sits down at a chapter: at the saved table if there is one (unless starting over), else a fresh one. */
  const sit = (chapter: Chapter, fresh = false) => {
    setProgress(record(progress, chapter.id, 'started'));
    const saved = fresh ? null : tables[chapter.id];
    const session = (saved && Session.resume(chapter, saved)) || new Session(chapter);
    if (!saved || fresh) setTables(clearTable(chapter.id));
    setScreen({ name: 'table', session });
  };
  /** After each hand (and on leaving), keep the table so the chapter can be picked up later. Story chapters only. */
  const keep = (session: Session) => {
    if (!chapterById(session.chapter.id)) return;
    const table = session.saveTable();
    if (table) setTables(saveTable(table));
  };
  const finished = (session: Session) => {
    const didWin = session.snapshot().outcome === 'won';
    if (didWin) setProgress((p) => record(p, session.chapter.id, 'won'));
    setTables(clearTable(session.chapter.id));
    setScreen({ name: 'end', chapter: session.chapter, won: didWin });
  };
  const resume = (t: KeptTable | null) => {
    const chapter = t && chapterById(t.chapterId);
    if (chapter) sit(chapter);
  };

  return (
    <Stage>
      {screen.name === 'select' && (
        <ChapterSelect
          progress={progress}
          tables={tables}
          onPick={(chapter) => setScreen({ name: 'intro', chapter })}
          onOpening={() => setScreen({ name: 'opening' })}
          onClosing={() => setScreen({ name: 'closing' })}
          onResume={() => resume(latestTable(tables))}
          onPractice={() => setScreen({ name: 'practice' })}
          onHints={(on) => setProgress(setHints(progress, on))}
          onOption={(option, on) => setProgress(setOption(progress, option, on))}
          onReset={() => {
            setProgress(resetProgress());
            setTables(loadTables());
          }}
        />
      )}
      {screen.name === 'opening' && (
        <Montage
          slides={OPENING}
          musicLink={musicLink}
          onSkip={() => {
            setProgress((p) => sawOpening(p));
            setScreen({ name: 'select' });
          }}
          finish={
            <>
              <div className="eyebrow">The Ashcombe deck, 1543 to today</div>
              <h1>Historical Poker</h1>
              <p>One painted deck. Two families. Every table it was ever played on.</p>
              <div className="story-buttons">
                <button
                  type="button"
                  className="chip chip-raise chip-wide"
                  ref={focusOnMount}
                  onClick={() => {
                    setProgress((p) => sawOpening(p));
                    setScreen({ name: 'select' });
                  }}
                >
                  Take a seat
                </button>
              </div>
            </>
          }
        />
      )}
      {screen.name === 'closing' && (
        <Montage
          slides={CLOSING}
          musicLink={musicLink}
          onSkip={() => setScreen({ name: 'select' })}
          finish={
            <>
              <div className="eyebrow">The Ashcombe deck, 1543 to today</div>
              <h1>Historical Poker</h1>
              <p>Every one of those games still has a table somewhere. Start your own.</p>
              <PoweredBy />
              <p className="credits">Story, paintings and music made for this game. Every chapter is dealt by the rules of its own year.</p>
              <div className="story-buttons">
                <a className="chip chip-raise chip-wide" href="https://rsdp-poker-live.fly.dev" target="_blank" rel="noreferrer">
                  Start your own game on RSDP Live
                </a>
                <button type="button" className="chip chip-call chip-wide" onClick={() => setScreen({ name: 'select' })} ref={focusOnMount}>
                  Back to the deck case
                </button>
              </div>
            </>
          }
        />
      )}
      {screen.name === 'intro' && (
        <IntroScreen
          chapter={screen.chapter}
          jumping={!isUnlocked(screen.chapter.id, won)}
          saved={tables[screen.chapter.id] ?? null}
          onStart={(fresh) => sit(screen.chapter, fresh)}
          onBack={() => setScreen({ name: 'select' })}
          musicLink={musicLink}
        />
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
          onHandOver={() => keep(screen.session)}
          onFinished={() => finished(screen.session)}
          onLeave={() => {
            keep(screen.session);
            setScreen(screen.session.chapter.practice ? { name: 'practice' } : { name: 'select' });
          }}
        />
      )}
      {screen.name === 'practice' && <PracticeScreen initial={practiced} onSit={practise} onBack={() => setScreen({ name: 'select' })} />}
      {screen.name === 'end' && (
        <EndScreen
          chapter={screen.chapter}
          won={screen.won}
          onClosing={() => setScreen({ name: 'closing' })}
          onAgain={() => sit(screen.chapter, true)}
          onNext={(c) => setScreen({ name: 'intro', chapter: c })}
          onCase={() => setScreen({ name: 'select' })}
          musicLink={musicLink}
        />
      )}
    </Stage>
  );
}

function IntroScreen({
  chapter,
  jumping,
  saved,
  onStart,
  onBack,
  musicLink,
}: {
  chapter: Chapter;
  jumping: boolean;
  /** The table this chapter was left at, if any. */
  saved: KeptTable | null;
  onStart: (fresh: boolean) => void;
  onBack: () => void;
  musicLink: ReactNode;
}) {
  const first = CHAPTERS[0].chapter.id === chapter.id;
  return (
    <div className={`story-screen ${chapter.scene.title ? 'story-titled' : ''}`}>
      {chapter.scene.title ? <img className="layer" src={chapter.scene.title} alt="" /> : <SceneBack scene={chapter.scene} />}
      <div className="story-shade" />
      <PoweredBy />
      <div className="story-card">
        <div className="eyebrow">
          {chapter.numeral === 'Bonus' || chapter.numeral === 'Epilogue' ? chapter.numeral : `Chapter ${chapter.numeral}`}{chapter.toldBy ? ` · ${chapter.toldBy}` : ''} · {chapter.place}, {chapter.year}
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
          <button type="button" className="chip chip-raise chip-wide" onClick={() => onStart(false)} ref={focusOnMount}>
            {saved ? `Back to the table (hand ${saved.handNumber + 1})` : 'Take a seat'}
          </button>
          {saved && (
            <button type="button" className="text-link" onClick={() => onStart(true)}>
              Start the chapter over
            </button>
          )}
          <button type="button" className="text-link" onClick={onBack}>
            All chapters
          </button>
          {musicLink}
        </div>
      </div>
    </div>
  );
}

function EndScreen({ chapter, won, onAgain, onNext, onCase, onClosing, musicLink }: { chapter: Chapter; won: boolean; onAgain: () => void; onNext: (c: Chapter) => void; onCase: () => void; onClosing: () => void; musicLink: ReactNode }) {
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
            <button type="button" className="chip chip-raise chip-wide" onClick={() => onNext(next)} ref={focusOnMount}>
              On to {next.title}
            </button>
          ) : won && last ? (
            // The story is over: on to the ending pictures and the credits (which link to RSDP Live).
            <button type="button" className="chip chip-raise chip-wide" onClick={onClosing} ref={focusOnMount}>
              How it all ends
            </button>
          ) : (
            <button type="button" className="chip chip-raise chip-wide" onClick={won ? onCase : onAgain} ref={focusOnMount}>
              {won ? 'Back to the deck case' : 'Try again'}
            </button>
          )}
          {won && last && (
            <button type="button" className="text-link" onClick={onCase}>
              Back to the deck case
            </button>
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
