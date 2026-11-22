/**
 * The card table: the room, the rivals, the cards and the controls.
 *
 * Layers, back to front (see docs/ARCHITECTURE.md, "The table screen"):
 *   room (art or painted placeholder) -> characters -> table front (hides
 *   their laps) -> things on the felt (cards, board, pot, names) -> dialogue
 *   and controls.
 *
 * The Session (src/table/session.ts) holds the game. This component only
 * shows session.snapshot() and calls session methods; `version` is bumped
 * after each call to re-render.
 */
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { Action, LegalActions, SeatIndex } from '@rsdp/engine/core';
import type { Character, DealerMarker } from '../chapters/types';
import { HUMAN, type SceneView, type Session, type Snapshot } from '../table/session';
import { Card, type CardSize } from './Card';
import { dealQuestion, outsQuestion, type MathQuestion } from '../math';
import { MathStrip } from './MathStrip';
import { PoweredBy } from './PoweredBy';
import { RulesPanel } from './RulesPanel';
import { Rival, SceneBack, SceneFront } from './Scene';
import { playMusic } from './sound';
import { useCompact } from './Stage';
import { potLimitWords } from '../table/stakes';
import { PLAYER_SPOT, betSide, potSpot, seatSpot, type BetSide, useTableFx, type Flight, type Point } from './useTableFx';

/** How long a rival "thinks" before acting, in ms. */
const BOT_DELAY = 1100;

export function TableScreen({
  session,
  hints,
  sound,
  onSound,
  onHandOver,
  musicLink,
  math,
  mathStars,
  onMath,
  onMathStar,
  onFinished,
  onLeave,
}: {
  session: Session;
  hints: boolean;
  sound: boolean;
  onSound: (on: boolean) => void;
  /** Called between hands (and as each scene line passes), so the app can save the table. */
  onHandOver?: () => void;
  /** The "Music on/off" link, owned by App (it also sits on the story screens). */
  musicLink: ReactNode;
  /** Math Mode is on: sums about the hand while it is the player's turn (src/math). */
  math: boolean;
  mathStars: number;
  onMath: (on: boolean) => void;
  /** A right answer. */
  onMathStar: () => void;
  onFinished: () => void;
  onLeave: () => void;
}) {
  const [, setVersion] = useState(0);
  const refresh = () => {
    setHint(null);
    setVersion((v) => v + 1);
  };
  const [rulesOpen, setRulesOpen] = useState(false);
  const [hint, setHint] = useState<SceneView | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const chapter = session.chapter;
  const snap = session.snapshot();
  const stage = chapter.stages[snap.play.stageIndex];
  const scene = stage.scene ?? chapter.scene;
  // The rivals as this stage seats them (a stage can give them other art and places).
  const rivals = useMemo(() => (stage.seats ? chapter.rivals.map((c) => ({ ...c, ...stage.seats![c.id] })) : chapter.rivals), [chapter, stage]);
  const money = (n: number) => session.money(n);
  const compact = useCompact();
  const flights = useTableFx(rivals, snap, compact);
  // The dealer's marker for this room and year. A card room's stud game shows none: the house dealer deals, and the up cards decide who acts.
  const roomMarker = stage.dealerMarker ?? chapter.dealerMarker;
  const marker: DealerMarker = (roomMarker === 'button' || roomMarker === 'online') && (snap.hand?.family ?? snap.play.family) === 'stud' ? 'none' : roomMarker;
  // A stage with its own scene keeps the chapter's music unless it names its own.
  const music = stage.scene?.music ?? chapter.scene.music ?? null;
  useEffect(() => playMusic(music), [music]);
  // Lay out the felt for the hand on it: between hands `play` is already the next game.
  const flop = (snap.hand?.family ?? snap.play.family) === 'flop';
  // Cards fly in from whoever deals: the seat with the buck or the button, or the middle of the table where the house deals.
  const dealer = chapter.houseDeals ? HOUSE_DEALER_SPOT : seatSpot(rivals, snap.button);
  const from = (to: Point): CSSProperties => ({ '--dx': `${dealer.x - to.x}px`, '--dy': `${dealer.y - to.y}px` }) as CSSProperties;

  // Deal the first hand when the table opens, once any opening scene is over.
  const inScene = session.inScene;
  useEffect(() => {
    if (!inScene && !session.handInProgress && session.snapshot().handNumber === 0) {
      session.startHand();
      refresh();
    }
  }, [session, inScene]);

  // Rivals act on their own, one at a time, after a short pause.
  const toAct = session.toAct;
  useEffect(() => {
    if (toAct === null || toAct === HUMAN) return;
    const t = window.setTimeout(() => {
      session.botStep();
      refresh();
    }, BOT_DELAY);
    return () => window.clearTimeout(t);
  }, [toAct, snap.hand?.pot, snap.hand?.street, snap.hand?.phase, snap.scene, session]);

  const act = (a: Action) => {
    session.act(a);
    refresh();
  };
  const draw = () => {
    session.draw(selected);
    setSelected([]);
    refresh();
  };
  const accuse = () => {
    session.accuse();
    refresh();
  };
  const advance = () => {
    session.advanceScene();
    refresh();
  };
  const next = () => {
    if (snap.outcome) onFinished();
    else {
      session.startHand();
      setSelected([]);
      refresh();
    }
  };

  const hand = snap.hand;
  const swept = hand ? hand.pot - Object.values(hand.players).reduce((n, p) => n + p.bet, 0) : 0;
  const speaker = snap.speech ? snap.seats[snap.speech.seat] : null;
  const line = snap.scene ?? hint;
  const betweenHands = (!hand || hand.complete) && snap.handNumber > 0;
  const drawing = hand?.draw ?? null;
  const drawProblem = drawing ? session.drawProblem(selected) : null;

  // Math Mode: the sums for this decision, worked out once when the turn comes round.
  const legal = hand && !hand.complete && !snap.scene ? hand.legal : null;
  const mathKey = math && legal ? `${snap.handNumber}/${hand!.street}/${hand!.pot}/${legal.callAmount}` : null;
  const questions = useMemo<MathQuestion[]>(() => {
    const h = session.snapshot().hand;
    if (!mathKey || !h?.legal) return [];
    const shown = Object.entries(h.players).flatMap(([seat, p]) => (Number(seat) === HUMAN ? [] : p.cards.filter((c): c is string => c !== null)));
    const outs = h.boards.length > 1 ? null : outsQuestion({ game: session.currentGame, mine: h.myCards.map((c) => c.card), board: h.boards[0] ?? [], shown, street: h.street });
    const advice = h.legal.canCheck || !h.legal.callAmount ? null : session.teacherAdvice();
    const deal = advice ? dealQuestion(h.pot, h.legal.callAmount, advice.equity, (n) => session.money(n)) : null;
    return [outs, deal].filter((q): q is MathQuestion => q !== null);
  }, [session, mathKey]);

  // Between hands, keep the table so the chapter can be picked up later.
  useEffect(() => {
    if (betweenHands && !snap.outcome) onHandOver?.();
  }, [betweenHands, snap.handNumber, snap.outcome, snap.scene?.text]);

  return (
    <div className={`table-screen${flop ? ' table-flop' : ''}`}>
      <SceneBack scene={scene} />
      {rivals.map((c, i) => (
        <Rival key={c.id} character={c} left={snap.seats[i + 1].left} folded={!!hand?.players[i + 1]?.folded && !hand.complete} light={scene.palette.light} />
      ))}
      <SceneFront scene={scene} />

      <header className="chapter-title">
        <div className="eyebrow">
          {/^\d/.test(chapter.numeral) ? `Chapter ${chapter.numeral}` : chapter.numeral} · {chapter.year}
        </div>
        <h1>{chapter.title}</h1>
        <div className="game-name">
          {snap.play.name}
          {snap.play.bombPot ? ' · bomb pot' : ''}
          {stage.label && stage.label !== snap.play.name ? <span className="stage-label"> · {stage.label}</span> : null}
        </div>
      </header>
      <PoweredBy />
      <nav className="corner-links">
        <button type="button" onClick={() => setRulesOpen(true)}>
          {chapter.rulesObject}
        </button>
        {hints && session.toAct === HUMAN && (
          <button type="button" onClick={() => setHint(session.hint())}>
            Ask for a hint
          </button>
        )}
        <button type="button" onClick={() => onMath(!math)} aria-pressed={math} title="Sums about your hand, for young players">
          {math ? 'Math on' : 'Math off'}
        </button>
        <button type="button" onClick={() => onSound(!sound)} aria-pressed={sound}>
          {sound ? 'Sound on' : 'Sound off'}
        </button>
        {musicLink}
        <button type="button" onClick={onLeave}>
          Leave the table
        </button>
      </nav>

      {rivals.map((c, i) => (
        <SeatPlate key={c.id} character={c} seat={i + 1} snap={snap} money={money} small={flop} marker={marker} dealFrom={from({ x: c.plate.x, y: c.plate.y + 40 })} betSide={betSide(c, flop, compact)} />
      ))}

      {snap.hand && Object.entries(snap.tells).map(([seat, texts]) => <TellNote key={seat} character={rivals[Number(seat) - 1]} texts={texts} />)}

      {hand && hand.boards.some((b) => b.length) && (
        <div className={`boards boards-${hand.boards.length}`}>
          {hand.boards.map((b, i) => (
            <div key={i} className="board">
              {Array.from({ length: 5 }, (_, j) =>
                b[j] ? (
                  <span key={`${j}${b[j]}`} className="deal-in" style={{ ...from({ x: 800, y: 600 }), '--delay': `${(j < 3 ? j : 0) * 0.09}s` } as CSSProperties}>
                    <Card card={b[j]} size={hand.boards.length > 1 ? 'small' : 'medium'} className="flip-in" />
                  </span>
                ) : (
                  <div key={j} className={`card-slot card-slot-${hand.boards.length > 1 ? 'small' : 'medium'}`} />
                ),
              )}
            </div>
          ))}
        </div>
      )}

      {hand && !hand.complete && (
        <div className="pot" style={{ left: potSpot(flop, compact).x, top: potSpot(flop, compact).y }}>
          {/* Chips lie in the middle once a round's bets are swept in. The amount is the whole pot, bets in front of the players included (what pot limit and Math Mode count). */}
          {swept > 0 && <Coins key={swept} />}
          <div className="pot-amount">{money(hand.pot)}</div>
        </div>
      )}

      {hand?.complete && hand.summary && <div className="summary">{hand.summary}</div>}

      {/* The draw is easy to miss, so it is announced where the showdown line goes. */}
      {drawing && !snap.scene && (
        <div className="summary draw-call" aria-live="polite">
          <span className="draw-call-title">{drawing.rounds > 1 ? `The draw, ${drawing.round} of ${drawing.rounds}` : 'The draw'}</span>
          Pick the cards to throw away: {drawing.words}. Or stand pat and keep them all.
        </div>
      )}

      {hand && (
        <PlayerHand
          snap={snap}
          money={money}
          selectable={!!drawing && !snap.scene}
          selected={selected}
          onToggle={(i) => setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
          lowered={flop}
          dealNote={snap.button !== HUMAN || (marker === 'none' && roomMarker !== 'none') ? '' : MARKER_MINE[marker]}
          dealFrom={from(PLAYER_SPOT)}
        />
      )}

      {flights.map((f) => (
        <ChipFlight key={f.id} flight={f} />
      ))}

      {line ? (
        <div key={line.text} className={`dialogue${line.name ? '' : ' dialogue-narration'}${line === hint ? ' dialogue-hint' : ''}`} aria-live="polite">
          {line.name && <div className="speaker">{line.name}</div>}
          <p>{line.name ? `“${line.text}”` : line.text}</p>
          {line.aside && <p className="aside">{line.aside}</p>}
        </div>
      ) : questions.length ? (
        <MathStrip key={mathKey} questions={questions} stars={mathStars} onStar={onMathStar} unit={snap.play.unit} money={money} />
      ) : (
        snap.speech &&
        speaker && (
          <div key={snap.speech.text} className="dialogue" aria-live="polite">
            <div className="speaker">{speaker.name}</div>
            <p>“{snap.speech.text}”</p>
          </div>
        )
      )}

      <div className="controls">
        {snap.scene ? (
          <button type="button" className="chip chip-call chip-wide" onClick={advance} autoFocus>
            Continue
          </button>
        ) : (
          <>
            {hand && !hand.complete && hand.legal && <ChipControls legal={hand.legal} pot={hand.pot} unit={snap.play.unit} money={money} onAct={act} potLimit={snap.play.betting === 'pot-limit'} myBet={hand.players[HUMAN]?.bet ?? 0} />}
            {drawing && (
              <div className="draw-group">
                <div className="draw-note">{drawProblem ?? (selected.length ? `Throw ${selected.length}, draw ${selected.length}.` : 'Pick cards to throw away, or keep them all.')}</div>
                <button type="button" className="chip chip-raise" onClick={draw} disabled={!!drawProblem}>
                  {selected.length ? (
                    <>
                      Draw
                      <br />
                      {selected.length}
                    </>
                  ) : (
                    <>
                      Stand
                      <br />
                      pat
                    </>
                  )}
                </button>
              </div>
            )}
            {hand && !hand.complete && !hand.legal && !drawing && hand.toAct !== null && (
              <div className="waiting">
                {snap.seats[hand.toAct]?.name} is {hand.phase === 'drawing' ? 'drawing' : 'thinking'}…
              </div>
            )}
            {snap.canAccuse && (
              <button type="button" className="chip chip-accuse" onClick={accuse} title="Accuse the dealer of cheating">
                Call out
                <br />
                the deal
              </button>
            )}
            {betweenHands && (
              <button type="button" className="chip chip-raise chip-wide" onClick={next} autoFocus>
                {snap.outcome ? 'Continue' : snap.redeal ? 'Deal again' : 'Next hand'}
              </button>
            )}
          </>
        )}
      </div>

      {rulesOpen && (
        <RulesPanel
          chapter={chapter}
          game={session.currentGame}
          playName={snap.play.name}
          betting={snap.play.betting}
          extras={stage.extras}
          unitMoney={(units) => money(units * snap.play.unit)}
          hints={hints}
          onClose={() => setRulesOpen(false)}
        />
      )}
    </div>
  );
}

function SeatPlate({
  character,
  seat,
  snap,
  money,
  small,
  marker,
  dealFrom,
  betSide,
}: {
  character: Character;
  seat: SeatIndex;
  snap: Snapshot;
  money: (n: number) => string;
  small: boolean;
  marker: DealerMarker;
  dealFrom: CSSProperties;
  /** Which side of the plate this seat's bets lie on (useTableFx.ts, betSide). */
  betSide: BetSide;
}) {
  const s = snap.seats[seat];
  const p = snap.hand?.players[seat];
  const status =
    s.left === 'bowed'
      ? 'watching'
      : s.out
        ? 'left the table'
        : !snap.hand
          ? ''
          : p?.folded
            ? 'folded'
            : p?.lastAction
              ? `${p.lastAction.toLowerCase()}${p.bet > 0 ? ` ${money(p.bet)}` : ''}`
              : '';
  const inHand = snap.hand && !s.out && p && !p.folded;
  const won = snap.hand?.complete ? snap.hand.winners.filter((w) => w.seat === seat).reduce((n, w) => n + w.amount, 0) : 0;
  // Flop games: cards stay tiny before the showdown. The seat across stays
  // tiny at the showdown too, and its win goes on the hand line, so its
  // cards never reach the board below.
  const across = seat === 2;
  const size: CardSize = small && (across || !p?.handName) ? 'tiny' : 'small';
  const winInLine = small && across;
  const winText = won > 0 ? `wins ${money(won)}` : '';
  const showHand = !!p?.handName && !p.folded;
  return (
    <div className={`plate${s.out || p?.folded ? ' plate-dim' : ''}`} style={{ left: character.plate.x, top: character.plate.y }}>
      {snap.button === seat && <Marker kind={marker} />}
      {snap.stakeHolder === seat && <DeckCase />}
      <div className="plate-name">{character.name}</div>
      <div className="plate-stack">
        {money(s.stack)}
        {status ? ` · ${status}` : ''}
        {winInLine && !showHand && winText && <span className="plate-win pop-in"> · {winText}</span>}
      </div>
      {inHand && (
        <div className={`plate-cards plate-cards-${size}`}>
          {p.cards.map((c, i) => (
            <span key={i} className="deal-in" style={{ ...dealFrom, '--delay': `${Math.min(i, 4) * 0.1 + seat * 0.03}s` } as CSSProperties}>
              {/* Re-mounts when the card turns over, so it flips. */}
              <Card key={c ?? 'back'} card={c} size={size} className={c ? 'flip-in' : ''} />
            </span>
          ))}
        </div>
      )}
      {showHand && (
        <div className="plate-hand">
          {p.handName}
          {winInLine && winText && <span className="plate-win pop-in"> · {winText}</span>}
        </div>
      )}
      {winText && !winInLine && <div className="plate-win pop-in">{winText}</div>}
      {/* This round's bet (a blind first), lying on the felt beside the seat's cards until the round ends. */}
      {p && p.bet > 0 && !snap.hand?.complete && <BetChips side={betSide} amount={money(p.bet)} label={p.posted} />}
    </div>
  );
}

/** A little stack of chips sliding across the felt (a bet into the pot, or the pot to a winner). */
function ChipFlight({ flight }: { flight: Flight }) {
  const { from, to, delay, big } = flight;
  const style = { left: from.x, top: from.y, '--fx': `${to.x - from.x}px`, '--fy': `${to.y - from.y}px`, animationDelay: `${delay}ms` } as CSSProperties;
  const n = big ? 5 : 3;
  return (
    <svg className="flight" style={style} width="60" height="50" viewBox="0 0 60 50" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={30 + (i % 2 ? 3 : -2)} cy={40 - i * 6} rx="20" ry="7" fill={i === n - 1 ? '#f4f1e6' : i % 2 ? '#e3b24c' : '#cfc9b8'} stroke="#5e5646" />
      ))}
    </svg>
  );
}

/** A seat's bet this round, lying on the felt in front of it; for a blind, what it is. */
function BetChips({ side = 'left', amount, label }: { side?: BetSide; amount: string; label: string | null }) {
  return (
    <div className={`bet bet-${side}`}>
      {/* Re-mounts when the amount changes, so it lands after the chips fly in. */}
      <div key={amount} className="bet-in">
        <svg width="44" height="30" viewBox="0 0 44 30" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx="22" cy={22 - i * 5} rx="18" ry="6" fill={i === 2 ? '#f4f1e6' : i % 2 ? '#e3b24c' : '#cfc9b8'} stroke="#5e5646" />
          ))}
        </svg>
        <div className="bet-amount">{amount}</div>
        {label && <div className="bet-label">{label}</div>}
      </div>
    </div>
  );
}

function Coins() {
  return (
    <svg width="122" height="44" viewBox="16 0 122 44" aria-hidden="true">
      {[0, 1, 2].map((i) => <ellipse key={`a${i}`} cx="40" cy={34 - i * 6} rx="22" ry="7" fill={i === 2 ? '#f4f1e6' : '#cfc9b8'} stroke="#6f6a5c" />)}
      {[0, 1, 2, 3].map((i) => <ellipse key={`b${i}`} cx="80" cy={36 - i * 6} rx="22" ry="7" fill={i === 3 ? '#f4f1e6' : '#cfc9b8'} stroke="#6f6a5c" />)}
      <ellipse cx="120" cy="36" rx="14" ry="5" fill="#e3b24c" stroke="#8a6420" />
    </svg>
  );
}

/** The dealer's marker, drawn for the room and year (types.ts, DealerMarker). Nothing where none was used. */
function Marker({ kind }: { kind: DealerMarker }) {
  if (kind === 'none') return null;
  if (kind === 'buck') {
    return (
      <svg className="buck" width="70" height="20" viewBox="0 0 70 20" role="img" aria-label="Holds the buck (deals this hand)">
        <path d="M2 10 L34 4 L48 10 L34 16 Z" fill="#e2e2da" stroke="#5e5e56" strokeWidth="1.5" />
        <rect x="46" y="5" width="22" height="10" rx="4" fill="#9a6a34" stroke="#4a2e10" strokeWidth="1.5" />
      </svg>
    );
  }
  // A white disc lying on the felt: "DEALER" in a card room, "D" on a poker site.
  return (
    <svg className="buck dealer-button" width="52" height="34" viewBox="0 0 52 34" role="img" aria-label="Has the dealer button">
      <ellipse cx="26" cy="19" rx="24" ry="13" fill="#8f8a7c" stroke="#4d4a42" strokeWidth="1.5" />
      <ellipse cx="26" cy="15" rx="24" ry="13" fill="#f6f3e8" stroke="#4d4a42" strokeWidth="1.5" />
      <text x="26" y={kind === 'online' ? 21 : 18.5} textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize={kind === 'online' ? 17 : 9} fill="#1c1a16">
        {kind === 'online' ? 'D' : 'DEALER'}
      </text>
    </svg>
  );
}

/** The chapter's prize, set on the felt when it is staked. */
function DeckCase() {
  return (
    <svg className="deck-case" width="46" height="34" viewBox="0 0 46 34" role="img" aria-label="The stake is in front of this player">
      <rect x="2" y="4" width="42" height="28" rx="4" fill="#6b3f1f" stroke="#2e1a0b" strokeWidth="2" />
      <rect x="2" y="4" width="42" height="9" rx="4" fill="#82502a" stroke="#2e1a0b" strokeWidth="2" />
      <rect x="19" y="10" width="8" height="6" rx="1" fill="#d9b25a" stroke="#6e5420" />
    </svg>
  );
}

function TellNote({ character, texts }: { character: Character; texts: string[] }) {
  const { place, tellAbove } = character.art;
  const top = place.bottom - place.height + 70;
  // Beside the head, on the side away from the stage's edge; or, for small art, centred above it.
  const right = !tellAbove && place.x > 1100;
  const style: CSSProperties = tellAbove
    ? { left: place.x - 110, bottom: 900 - (place.bottom - place.height) + 8 }
    : right
      ? { right: 1600 - (place.x - 70), top }
      : { left: place.x + 70, top };
  return (
    <div className={`tell${right ? ' tell-left' : ''}`} style={style}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>
        {texts.map((t) => (
          <span key={t} className="tell-line">
            {t}
          </span>
        ))}
      </span>
    </div>
  );
}

/** Where the cards come from when the house deals: the middle of the table. */
const HOUSE_DEALER_SPOT: Point = { x: 800, y: 560 };

/** Said on your own line when the deal is yours. */
const MARKER_MINE: Record<DealerMarker, string> = { buck: ' · you hold the buck', button: ' · you have the button', online: ' · you have the button', none: ' · you deal' };

function PlayerHand({
  snap,
  money,
  selectable,
  selected,
  onToggle,
  lowered,
  dealNote,
  dealFrom,
}: {
  snap: Snapshot;
  money: (n: number) => string;
  selectable: boolean;
  selected: number[];
  onToggle: (i: number) => void;
  lowered: boolean;
  /** " · you hold the buck", or nothing. */
  dealNote: string;
  dealFrom: CSSProperties;
}) {
  const hand = snap.hand!;
  const me = snap.seats[HUMAN];
  const folded = hand.players[HUMAN]?.folded;
  const won = hand.complete ? hand.winners.filter((w) => w.seat === HUMAN).reduce((n, w) => n + w.amount, 0) : 0;
  const myBet = hand.players[HUMAN]?.bet ?? 0;
  const n = hand.myCards.length;
  const mid = (n - 1) / 2;
  const tilt = n > 5 ? 4 : 7;
  return (
    <div className={`my-hand${lowered ? ' my-hand-low' : ''}`}>
      <div className="my-cards-wrap">
        <div className={`my-cards${folded ? ' my-cards-folded' : ''}${n > 5 ? ' my-cards-many' : ''}${selectable ? ' my-cards-draw' : ''}`}>
          {hand.myCards.map((c, i) => {
            const lift = selected.includes(i) ? -48 : 0;
            const style = { transform: `rotate(${(i - mid) * tilt}deg) translateY(${Math.abs(i - mid) * 8 + lift}px)` };
            const card = <Card card={c.card} className={c.up ? 'card-up' : ''} style={style} />;
            const deal = { ...dealFrom, '--delay': `${Math.min(i, 4) * 0.1}s` } as CSSProperties;
            return selectable ? (
              <button key={c.card} type="button" className="card-button deal-in" style={deal} onClick={() => onToggle(i)} aria-pressed={selected.includes(i)}>
                {card}
              </button>
            ) : (
              <div key={c.card} className="deal-in" style={deal}>
                {card}
              </div>
            );
          })}
        </div>
        {myBet > 0 && !hand.complete && <BetChips amount={money(myBet)} label={hand.players[HUMAN]?.posted ?? null} />}
      </div>
      <div className="my-line">
        <span className="my-hand-name">{folded ? 'You folded' : hand.myHandName}</span>
        {/* On small screens the purse goes on a second line (styles.css, "Small screens"). */}
        <span className="my-purse">
          your purse {money(me.stack)}
          {dealNote}
          {won ? ` · you win ${money(won)}` : ''}
        </span>
      </div>
    </div>
  );
}

function ChipControls({ legal, pot, unit, money, onAct, potLimit, myBet }: { legal: LegalActions; pot: number; unit: number; money: (n: number) => string; onAct: (a: Action) => void; potLimit: boolean; myBet: number }) {
  const limitNote = potLimit ? potLimitWords(legal, pot, myBet, money) : null;
  const [to, setTo] = useState(legal.minTo);
  // Reset the raise amount whenever the situation changes.
  useEffect(() => setTo(Math.min(legal.maxTo, Math.max(legal.minTo, Math.round(pot / 2)))), [legal.minTo, legal.maxTo, pot]);
  const clamp = (n: number) => Math.max(legal.minTo, Math.min(legal.maxTo, n));
  const verb = legal.canBringIn ? 'Complete to' : legal.raiseKind === 'bet' ? 'Bet' : 'Raise to';
  const fixed = legal.minTo === legal.maxTo;
  return (
    <div className="chip-row">
      {limitNote && <div className="limit-note">{limitNote}</div>}
      {legal.canFold && !legal.canCheck && (
        <button type="button" className="chip chip-fold" onClick={() => onAct({ type: 'fold' })}>
          Fold
        </button>
      )}
      {legal.canBringIn ? (
        <button type="button" className="chip chip-call" onClick={() => onAct({ type: 'bring-in' })}>
          Bring in
        </button>
      ) : legal.canCheck ? (
        <button type="button" className="chip chip-call" onClick={() => onAct({ type: 'check' })}>
          Check
        </button>
      ) : (
        <button type="button" className="chip chip-call" onClick={() => onAct({ type: 'call' })}>
          Call
          <br />
          {money(legal.callAmount)}
        </button>
      )}
      {legal.canRaise && (
        <div className="raise-group">
          {!fixed && (
            <div className="raise-adjust">
              <button type="button" aria-label="Less" onClick={() => setTo(clamp(to - unit))} disabled={to <= legal.minTo}>
                −
              </button>
              <button type="button" aria-label="More" onClick={() => setTo(clamp(to + unit))} disabled={to >= legal.maxTo}>
                +
              </button>
              <button type="button" onClick={() => setTo(legal.maxTo)} disabled={to >= legal.maxTo}>
                Max
              </button>
            </div>
          )}
          <button type="button" className="chip chip-raise" onClick={() => onAct({ type: legal.raiseKind, to: fixed ? legal.minTo : to })}>
            {verb}
            <br />
            {money(fixed ? legal.minTo : to)}
          </button>
        </div>
      )}
    </div>
  );
}
