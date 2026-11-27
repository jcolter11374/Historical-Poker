/**
 * "Who's playing?": the three save slots, as three cards on the deck case.
 * A card with a player on it shows their name and how far they are; an empty
 * seat is face down. Pressing a card plays as that player (an empty seat asks
 * for a name first). Under a used card: "Rename" and "Clear".
 *
 * Shown when the game opens if two or more slots are in use, and from
 * "Change player" on the chapter select. The slots themselves are in
 * src/progress/save.ts.
 */
import { useState, type FormEvent } from 'react';
import { CHAPTERS, chapterById } from '../chapters';
import { clearSlot, nameSlot, NAME_LENGTH, slotSummaries, type SlotSummary } from '../progress/save';
import { PoweredBy } from './PoweredBy';

const ART = `linear-gradient(rgba(12, 6, 2, 0.45), rgba(12, 6, 2, 0.45)), url(${import.meta.env.BASE_URL}art/chapter-select.webp)`;

export function PlayersScreen({ current, onPick }: { /** The slot played last (its card glows). */ current: number; onPick: (slot: number) => void }) {
  const [slots, setSlots] = useState(() => slotSummaries());
  /** The slot whose name is being typed, and whether that is a new player sitting down. */
  const [naming, setNaming] = useState<{ slot: number; fresh: boolean; name: string } | null>(null);
  const [clearing, setClearing] = useState<number | null>(null);
  const refresh = () => setSlots(slotSummaries());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!naming) return;
    nameSlot(naming.slot, naming.name);
    if (naming.fresh) onPick(naming.slot);
    else {
      setNaming(null);
      refresh();
    }
  };

  const where = (s: SlotSummary) => {
    const chapter = s.latest ? chapterById(s.latest.chapterId) : undefined;
    if (chapter && s.latest) return `${chapter.title}, hand ${s.latest.handNumber + 1}`;
    return s.won ? 'Between chapters' : 'Just sat down';
  };

  const card = (s: SlotSummary) => {
    if (naming?.slot === s.slot) {
      return (
        <form className="case-card player-card player-naming" onSubmit={submit}>
          <span className="case-seal" aria-hidden="true">♠</span>
          <label className="player-label" htmlFor={`player-name-${s.slot}`}>
            {naming.fresh ? 'Your name' : 'New name'}
          </label>
          <input
            id={`player-name-${s.slot}`}
            className="player-input"
            value={naming.name}
            maxLength={NAME_LENGTH}
            autoFocus
            autoComplete="off"
            enterKeyHint="done"
            onChange={(e) => setNaming({ ...naming, name: e.target.value })}
          />
          <button type="submit" className="chip chip-raise chip-wide player-go">
            {naming.fresh ? 'Take a seat' : 'Done'}
          </button>
          <button type="button" className="player-cancel" onClick={() => setNaming(null)}>
            Cancel
          </button>
        </form>
      );
    }
    if (!s.used) {
      return (
        <button type="button" className="case-card case-locked player-card" onClick={() => setNaming({ slot: s.slot, fresh: true, name: '' })}>
          <span className="case-seal" aria-hidden="true">✦</span>
          <span className="player-name">Empty seat</span>
          <span className="player-line">New player</span>
        </button>
      );
    }
    return (
      <button type="button" className={`case-card player-card${s.slot === current ? ' case-next' : ''}`} onClick={() => onPick(s.slot)} title={`Play as ${s.name}`}>
        <span className="case-seal" aria-hidden="true">♠</span>
        <span className="player-name">{s.name}</span>
        <span className="player-line">
          {s.won} of {CHAPTERS.length} chapters won
        </span>
        <span className="player-line player-where">{where(s)}</span>
        {s.mathStars > 0 && <span className="player-line">★ {s.mathStars}</span>}
      </button>
    );
  };

  return (
    <div className="select-screen select-painted players-screen" style={{ backgroundImage: ART }}>
      <PoweredBy />
      <header className="select-head">
        <div className="eyebrow">Still Ours</div>
        <h1>Who’s playing?</h1>
        <p>Each player keeps their own chapters, tables and settings.</p>
      </header>
      <div className="players-row">
        {slots.map((s) => (
          <div className="player-seat" key={s.slot}>
            {card(s)}
            <div className="player-links">
              {clearing === s.slot ? (
                <span className="reset">
                  Forget everything {s.name} has won?{' '}
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      clearSlot(s.slot);
                      setClearing(null);
                      refresh();
                    }}
                  >
                    Yes, clear it
                  </button>{' '}
                  <button type="button" className="text-link" onClick={() => setClearing(null)}>
                    No
                  </button>
                </span>
              ) : (
                s.used &&
                naming?.slot !== s.slot && (
                  <>
                    <button type="button" className="text-link" onClick={() => setNaming({ slot: s.slot, fresh: false, name: s.name })}>
                      Rename
                    </button>
                    <button type="button" className="text-link" onClick={() => setClearing(s.slot)}>
                      Clear
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
