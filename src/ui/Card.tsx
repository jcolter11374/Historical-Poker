/** A playing card in the period style: no corner numbers, just the rank and suit large in the middle. */
import type { CSSProperties } from 'react';

const SUIT: Record<string, { symbol: string; red: boolean; word: string }> = {
  s: { symbol: '♠', red: false, word: 'spades' },
  h: { symbol: '♥', red: true, word: 'hearts' },
  d: { symbol: '♦', red: true, word: 'diamonds' },
  c: { symbol: '♣', red: false, word: 'clubs' },
};
const RANK_WORD: Record<string, string> = { A: 'ace', K: 'king', Q: 'queen', J: 'jack', T: 'ten' };

export function cardLabel(card: string) {
  return `${RANK_WORD[card[0]] ?? card[0]} of ${SUIT[card[1]].word}`;
}

export function Card({ card, size = 'large', style }: { card: string | null; size?: 'large' | 'small'; style?: CSSProperties }) {
  if (!card) return <div className={`card card-back card-${size}`} style={style} aria-label="face-down card" role="img" />;
  const suit = SUIT[card[1]];
  const rank = card[0] === 'T' ? '10' : card[0];
  return (
    <div className={`card card-face card-${size} ${suit.red ? 'red' : 'black'}`} style={style} role="img" aria-label={cardLabel(card)}>
      <span className="card-rank">{rank}</span>
      <span className="card-suit">{suit.symbol}</span>
    </div>
  );
}
