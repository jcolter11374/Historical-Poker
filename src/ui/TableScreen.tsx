/**
 * The card table: the room, the rivals, the cards and the controls.
 *
 * Layers, back to front (see docs/ARCHITECTURE.md, "The table screen"):
 *   background art -> characters -> table-front art (hides their laps)
 *   -> things on the felt (cards, pot, names) -> dialogue and controls.
 *
 * The Session (src/table/session.ts) holds the game. This component only
 * shows session.snapshot() and calls session methods; `version` is bumped
 * after each call to re-render.
 */
import { useEffect, useRef, useState } from 'react';
import type { Action, LegalActions, SeatIndex } from '@rsdp/engine/core';
import type { Chapter, Character } from '../chapters/types';
import { HUMAN, type Session, type Snapshot } from '../table/session';
import { Card } from './Card';
import { PoweredBy } from './PoweredBy';
import { RulesPanel } from './RulesPanel';

/** How long a rival "thinks" before acting, in ms. */
const BOT_DELAY = 1100;

export function TableScreen({ session, onFinished }: { session: Session; onFinished: () => void }) {
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);
  const [rulesOpen, setRulesOpen] = useState(false);
  const chapter = session.chapter;
  const snap = session.snapshot();

  // Deal the first hand when the table opens.
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!session.handInProgress && session.snapshot().handNumber === 0) {
      session.startHand();
      refresh();
    }
  }, [session]);

  // Rivals act on their own, one at a time, after a short pause.
  const toAct = session.toAct;
  useEffect(() => {
    if (toAct === null || toAct === HUMAN) return;
    const t = window.setTimeout(() => {
      session.botStep();
      refresh();
    }, BOT_DELAY);
    return () => window.clearTimeout(t);
  }, [toAct, snap.hand?.pot, session]);

  const act = (a: Action) => {
    session.act(a);
    refresh();
  };
  const next = () => {
    if (snap.outcome) onFinished();
    else {
      session.startHand();
      refresh();
    }
  };

  const hand = snap.hand;
  const speaker = snap.speech ? snap.seats[snap.speech.seat] : null;

  return (
    <div className="table-screen">
      <img className="layer" src={chapter.scene.background} alt="" />
      {chapter.rivals.map((c, i) => (
        <Rival key={c.id} character={c} out={snap.seats[i + 1].out} folded={!!hand?.players[i + 1]?.folded && !hand.complete} />
      ))}
      <img className="layer" src={chapter.scene.tableFront} alt="" />

      <header className="chapter-title">
        <div className="eyebrow">Chapter {chapter.numeral} · {chapter.year}</div>
        <h1>{chapter.title}</h1>
      </header>
      <PoweredBy />
      <button type="button" className="rules-button" onClick={() => setRulesOpen(true)}>
        Rules of {chapter.year}
      </button>

      {chapter.rivals.map((c, i) => (
        <SeatPlate key={c.id} character={c} seat={i + 1} snap={snap} />
      ))}

      {snap.hand && Object.entries(snap.tells).map(([seat, text]) => <TellNote key={seat} character={chapter.rivals[Number(seat) - 1]} text={text} />)}

      {hand && (
        <div className="pot" style={{ left: 800, top: 612 }}>
          <svg width="150" height="44" viewBox="0 0 150 44" aria-hidden="true">
            {[0, 1, 2].map((i) => <ellipse key={`a${i}`} cx="40" cy={34 - i * 6} rx="22" ry="7" fill={i === 2 ? '#f4f1e6' : '#cfc9b8'} stroke="#6f6a5c" />)}
            {[0, 1, 2, 3].map((i) => <ellipse key={`b${i}`} cx="80" cy={36 - i * 6} rx="22" ry="7" fill={i === 3 ? '#f4f1e6' : '#cfc9b8'} stroke="#6f6a5c" />)}
            <ellipse cx="120" cy="36" rx="14" ry="5" fill="#e3b24c" stroke="#8a6420" />
          </svg>
          <div className="pot-amount">${hand.pot}</div>
        </div>
      )}

      {hand && <PlayerHand snap={snap} />}

      {snap.speech && speaker && (
        <div className="dialogue" aria-live="polite">
          <div className="speaker">{speaker.name}</div>
          <p>“{snap.speech.text}”</p>
        </div>
      )}

      <div className="controls">
        {hand && !hand.complete && hand.legal && <ChipControls legal={hand.legal} pot={hand.pot} minBet={chapter.stakes.minBet} onAct={act} />}
        {hand && !hand.complete && !hand.legal && <div className="waiting">{snap.seats[hand.toAct ?? 0]?.name} is thinking…</div>}
        {hand?.complete && (
          <button type="button" className="chip chip-raise chip-wide" onClick={next}>
            {snap.outcome ? 'Continue' : 'Next hand'}
          </button>
        )}
      </div>

      {rulesOpen && <RulesPanel chapter={chapter} onClose={() => setRulesOpen(false)} />}
    </div>
  );
}

function Rival({ character, out, folded }: { character: Character; out: boolean; folded: boolean }) {
  if (out) return null;
  const { place, src, kind, aspect } = character.art;
  const width = place.height * aspect;
  return (
    <img
      className={`rival rival-${kind}${folded ? ' rival-folded' : ''}`}
      src={src}
      alt={character.fullName}
      style={{ left: place.x - width / 2, top: place.bottom - place.height, width, height: place.height }}
    />
  );
}

function SeatPlate({ character, seat, snap }: { character: Character; seat: SeatIndex; snap: Snapshot }) {
  const s = snap.seats[seat];
  const p = snap.hand?.players[seat];
  const status = s.out
    ? 'left the table'
    : !snap.hand
      ? ''
      : p?.folded
        ? 'folded'
        : p?.lastAction
          ? `${p.lastAction.toLowerCase()}${p.bet > 0 ? ` $${p.bet}` : ''}`
          : '';
  const showCards = snap.hand && !s.out && !p?.folded;
  return (
    <div className={`plate${s.out || p?.folded ? ' plate-dim' : ''}`} style={{ left: character.plate.x, top: character.plate.y }}>
      {snap.button === seat && <Buck />}
      <div className="plate-name">{character.name}</div>
      <div className="plate-stack">
        ${s.stack}
        {status ? ` · ${status}` : ''}
      </div>
      {showCards && (
        <div className="plate-cards">
          {(p?.shown ?? [null, null, null, null, null]).map((c, i) => (
            <Card key={i} card={c} size="small" />
          ))}
        </div>
      )}
      {p?.handName && <div className="plate-hand">{p.handName}</div>}
      {snap.hand?.complete && snap.hand.winners.some((w) => w.seat === seat) && (
        <div className="plate-win">wins ${snap.hand.winners.find((w) => w.seat === seat)!.amount}</div>
      )}
    </div>
  );
}

function Buck() {
  return (
    <svg className="buck" width="70" height="20" viewBox="0 0 70 20" role="img" aria-label="Holds the buck (deals this hand)">
      <path d="M2 10 L34 4 L48 10 L34 16 Z" fill="#e2e2da" stroke="#5e5e56" strokeWidth="1.5" />
      <rect x="46" y="5" width="22" height="10" rx="4" fill="#9a6a34" stroke="#4a2e10" strokeWidth="1.5" />
    </svg>
  );
}

function TellNote({ character, text }: { character: Character; text: string }) {
  const { place } = character.art;
  return (
    <div className="tell" style={{ left: place.x + 70, top: place.bottom - place.height + 70 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

function PlayerHand({ snap }: { snap: Snapshot }) {
  const hand = snap.hand!;
  const me = snap.seats[HUMAN];
  const folded = hand.players[HUMAN]?.folded;
  const won = hand.complete ? hand.winners.find((w) => w.seat === HUMAN) : undefined;
  return (
    <div className="my-hand">
      <div className={`my-cards${folded ? ' my-cards-folded' : ''}`}>
        {hand.myCards.map((c, i) => (
          <Card key={c} card={c} style={{ transform: `rotate(${(i - 2) * 7}deg) translateY(${Math.abs(i - 2) * 10}px)` }} />
        ))}
      </div>
      <div className="my-line">
        {folded ? 'You folded' : hand.myHandName}
        {' · '}your purse ${me.stack}
        {snap.button === HUMAN ? ' · you hold the buck' : ''}
        {won ? ` · you win $${won.amount}` : ''}
      </div>
    </div>
  );
}

function ChipControls({ legal, pot, minBet, onAct }: { legal: LegalActions; pot: number; minBet: number; onAct: (a: Action) => void }) {
  const [to, setTo] = useState(legal.minTo);
  // Reset the raise amount whenever the situation changes.
  useEffect(() => setTo(Math.min(legal.maxTo, Math.max(legal.minTo, Math.round(pot / 2)))), [legal.minTo, legal.maxTo, pot]);
  const clamp = (n: number) => Math.max(legal.minTo, Math.min(legal.maxTo, n));
  const verb = legal.raiseKind === 'bet' ? 'Bet' : 'Raise to';
  return (
    <div className="chip-row">
      {legal.canFold && !legal.canCheck && (
        <button type="button" className="chip chip-fold" onClick={() => onAct({ type: 'fold' })}>
          Fold
        </button>
      )}
      {legal.canCheck ? (
        <button type="button" className="chip chip-call" onClick={() => onAct({ type: 'check' })}>
          Check
        </button>
      ) : (
        <button type="button" className="chip chip-call" onClick={() => onAct({ type: 'call' })}>
          Call
          <br />${legal.callAmount}
        </button>
      )}
      {legal.canRaise && (
        <div className="raise-group">
          <div className="raise-adjust">
            <button type="button" aria-label="Less" onClick={() => setTo(clamp(to - minBet))} disabled={to <= legal.minTo}>
              −
            </button>
            <button type="button" aria-label="More" onClick={() => setTo(clamp(to + minBet))} disabled={to >= legal.maxTo}>
              +
            </button>
            <button type="button" onClick={() => setTo(legal.maxTo)} disabled={to >= legal.maxTo}>
              Max
            </button>
          </div>
          <button type="button" className="chip chip-raise" onClick={() => onAct({ type: legal.raiseKind, to })}>
            {verb}
            <br />${to}
          </button>
        </div>
      )}
    </div>
  );
}
