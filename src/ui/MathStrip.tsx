/**
 * Math Mode at the table: one sum at a time on the dialogue strip, where a
 * rival's line would be, while it is the player's turn (src/math makes the
 * questions). Answering is optional: the betting chips stay live, and acting
 * moves on.
 *
 * - Choices are small bone chips. A right answer earns a star.
 * - After an outs answer, the deck is laid out on the felt: cards you can see
 *   are gone, helpful cards glow.
 * - A "good deal?" question shows the pot and the price as stacks of chips.
 */
import { useState } from 'react';
import type { DealQuestion, MathQuestion, OutsQuestion } from '../math';
import { Card } from './Card';

export function MathStrip({
  questions,
  stars,
  onStar,
  unit,
  money,
}: {
  questions: MathQuestion[];
  stars: number;
  onStar: () => void;
  /** The table's stake unit: one chip in the stacks. */
  unit: number;
  money: (n: number) => string;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | string | null>(null);
  const q = questions[index];
  const right = picked !== null && (q.kind === 'outs' ? picked === q.answer : q.answer === 'close' || picked === q.answer);
  const pick = (choice: number | string) => {
    if (picked !== null) return;
    setPicked(choice);
    if (q.kind === 'outs' ? choice === q.answer : q.answer === 'close' || choice === q.answer) onStar();
  };
  const more = index + 1 < questions.length;
  return (
    <>
      {q.kind === 'outs' && picked !== null && <OutsGrid q={q} />}
      <div key={index} className="dialogue dialogue-math" aria-live="polite">
        <div className="speaker">
          Math question
          {stars > 0 && <span className="math-stars" aria-label={`${stars} stars`}>★ {stars}</span>}
        </div>
        {picked === null ? (
          <>
            <p>{q.ask}</p>
            <div className="math-row">
              {q.kind === 'deal' && <Stacks q={q} unit={unit} money={money} />}
              <div className="math-choices">
                {q.kind === 'outs'
                  ? q.choices.map((n) => (
                      <button key={n} type="button" className="chip math-chip" onClick={() => pick(n)}>
                        {n}
                      </button>
                    ))
                  : (['good', 'bad'] as const).map((v) => (
                      <button key={v} type="button" className="chip math-chip math-chip-wide" onClick={() => pick(v)}>
                        {v === 'good' ? 'Good deal' : 'Bad deal'}
                      </button>
                    ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <p className={`math-result${right ? ' math-right' : ''}`}>
              {right ? '★ Right!' : q.kind === 'outs' ? `Not quite. It’s ${q.answer}.` : `Not quite. It’s a ${q.answer} deal.`}
            </p>
            <p className="aside">{q.explain}</p>
            {more && (
              <button type="button" className="text-link" onClick={() => { setIndex(index + 1); setPicked(null); }}>
                Next question
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

/** The pot and the price of the call, as two stacks of chips to compare. */
function Stacks({ q, unit, money }: { q: DealQuestion; unit: number; money: (n: number) => string }) {
  // One chip per stake unit; if the pot would be taller than eight chips, each chip stands for more.
  const per = unit * Math.max(1, Math.ceil(q.pot / unit / 8));
  const stack = (amount: number, top: string, label: string) => {
    const n = Math.max(1, Math.round(amount / per));
    return (
      <div className="math-stack">
        <svg width="56" height="62" viewBox="0 0 56 62" aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <ellipse key={i} cx="28" cy={52 - i * 6} rx="24" ry="8" fill={i === n - 1 ? top : '#cfc9b8'} stroke="#5e5646" />
          ))}
        </svg>
        <span>{label}</span>
      </div>
    );
  };
  return (
    <div className="math-stacks">
      {stack(q.pot, '#f4f1e6', `Pot ${money(q.pot)}`)}
      {stack(q.price, '#e3b24c', `Call ${money(q.price)}`)}
    </div>
  );
}

/** The deck laid out by suit: seen cards are gaps, helpful cards glow. */
function OutsGrid({ q }: { q: OutsQuestion }) {
  const unseen = new Set(q.unseen);
  const outs = new Set(q.outs);
  const suits = ['s', 'h', 'd', 'c'].filter((s) => q.deck.some((c) => c[1] === s));
  const order = 'AKQJT98765432';
  return (
    <div className="outs-grid pop-in" role="img" aria-label={`${q.outs.length} of the ${q.unseen.length} cards you can't see help you`}>
      {suits.map((s) => (
        <div key={s} className="outs-row">
          {q.deck
            .filter((c) => c[1] === s)
            .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
            .map((c) =>
              unseen.has(c) ? <Card key={c} card={c} size="tiny" className={outs.has(c) ? 'out-yes' : 'out-no'} /> : <span key={c} className="out-seen" />,
            )}
        </div>
      ))}
      <div className="outs-caption">
        {q.outs.length} of the {q.unseen.length} cards you can’t see help you
      </div>
    </div>
  );
}
