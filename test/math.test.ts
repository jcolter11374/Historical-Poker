import { describe, expect, it } from 'vitest';
import { getGame } from '../src/games/catalog';
import { FIVE_CARD_STUD } from '../src/games/fiveCardStud';
import { CLOSE, dealQuestion, outsQuestion, roughly, simplify, unseenCards, type MathView } from '../src/math';
import { addMathStar, loadProgress, setOption, type Store } from '../src/progress/save';

const cards = (s: string) => s.split(' ').filter(Boolean);
const dollars = (n: number) => `$${n}`;
/** Hold'em after the flop (street 1), the turn (2) or the river (3). */
const holdem = (mine: string, board: string): MathView => ({ game: getGame('nlhe'), mine: cards(mine), board: cards(board), shown: [], street: Math.max(0, cards(board).length - 2) });

describe('Math Mode: counting outs', () => {
  it('a flush draw on the flop has nine outs to a flush out of 47 unseen cards', () => {
    // Ace and king of hearts: three aces and three kings also make a pair.
    const q = outsQuestion(holdem('Ah Kh', '7h 2h 9c'))!;
    expect(q.unseen).toHaveLength(47);
    expect(q.outs.filter((c) => c[1] === 'h')).toHaveLength(9);
    expect(q.answer).toBe(15);
    expect(q.explain).toMatch(/9 make a flush and 6 make a pair/);
    expect(q.explain).toMatch(/15\/47/);
    expect(q.choices).toContain(15);
    expect(q.choices).toHaveLength(4);
    expect([...q.choices].sort((a, b) => a - b)).toEqual(q.choices);
  });

  it('an open-ended straight draw on the turn has eight outs to the straight out of 46', () => {
    const q = outsQuestion(holdem('9s 8d', '7h 6c 2s Kd'))!;
    expect(q.unseen).toHaveLength(46);
    expect(q.outs.filter((c) => c[0] === 'T' || c[0] === '5')).toHaveLength(8);
    expect(q.answer).toBe(8 + 6); // and three nines and three eights for a pair
  });

  it('does not count a board card that gives everyone the same kind of hand', () => {
    // Pairing the board's seven, two or king gives every player that pair.
    const q = outsQuestion(holdem('As Qd', '7h 2c Kd'))!;
    expect(q.outs.every((c) => c[0] === 'A' || c[0] === 'Q')).toBe(true);
    expect(q.answer).toBe(6);
  });

  it('is not asked before the flop, on the river, or in low and split games', () => {
    expect(outsQuestion(holdem('As Qd', ''))).toBeNull(); // three cards come next
    expect(outsQuestion(holdem('As Qd', '7h 2c Kd 3s 9h'))).toBeNull(); // no card to come
    expect(outsQuestion({ game: getGame('razz'), mine: cards('As 2d 3h'), board: [], shown: [], street: 0 })).toBeNull();
    expect(outsQuestion({ game: getGame('plo8'), mine: cards('As 2d 3h Kh'), board: cards('7h 8c Kd'), shown: [], street: 1 })).toBeNull();
    expect(outsQuestion({ game: getGame('straight-1836'), mine: cards('As Ad Kh Kd Qs'), board: [], shown: [], street: 0 })).toBeNull();
  });

  it('in stud, cards face up in other hands are not in the unseen cards', () => {
    // A pair of kings; one king shows in a rival's hand, so only one is left.
    const v: MathView = { game: getGame(FIVE_CARD_STUD.id), mine: cards('Ks Kd 7h'), board: [], shown: cards('Kh 7c 2d'), street: 1 };
    expect(unseenCards(v)).toHaveLength(52 - 6);
    const q = outsQuestion(v)!;
    // The last king makes three of a kind; two sevens (one is showing) make two pair.
    expect([...q.outs].sort()).toEqual(cards('7d 7s Kc').sort());
    expect(q.explain).toMatch(/2 make two pair/);
    expect(q.explain).toMatch(/3\/46/);
  });

  it('Omaha counts with two cards from the hand', () => {
    // Four hearts in hand is not a flush draw with one heart on the board.
    const q = outsQuestion({ game: getGame('plo4'), mine: cards('Ah Kh Qh Jh'), board: cards('2h 7c 8d'), shown: [], street: 1 })!;
    expect(q.explain).not.toMatch(/flush/);
  });
});

describe('Math Mode: a good deal?', () => {
  it('$4 to win $12 is a quarter of the money: good with a 40% hand, bad with a 10% hand', () => {
    const good = dealQuestion(12, 4, 0.4, dollars)!;
    expect(good.share).toEqual({ top: 1, bottom: 4 });
    expect(good.need).toBe(25);
    expect(good.answer).toBe('good');
    expect(good.ask).toMatch(/pot holds \$12.*costs you \$4.*40 times in 100/);
    expect(good.explain).toMatch(/\$4 of the \$16.*4\/16 = 1\/4, which is 25%.*40% is more than 25%/);
    expect(dealQuestion(12, 4, 0.1, dollars)!.answer).toBe('bad');
  });

  it('is too close to call within a few points', () => {
    expect(dealQuestion(12, 4, (25 + CLOSE) / 100, dollars)!.answer).toBe('close');
    expect(dealQuestion(12, 4, (25 + CLOSE + 1) / 100, dollars)!.answer).toBe('good');
    expect(dealQuestion(12, 4, (25 - CLOSE - 1) / 100, dollars)!.answer).toBe('bad');
  });

  it('is not asked when there is nothing to call', () => {
    expect(dealQuestion(12, 0, 0.5, dollars)).toBeNull();
  });

  it('uses the chapter’s money', () => {
    expect(dealQuestion(9, 3, 0.5, (n) => `${n}s`)!.ask).toMatch(/pot holds 9s.*costs you 3s/);
  });
});

describe('Math Mode: fractions and the setting', () => {
  it('simplifies and rounds to everyday fractions', () => {
    expect(simplify(4, 16)).toEqual({ top: 1, bottom: 4 });
    expect(simplify(7, 23)).toEqual({ top: 7, bottom: 23 });
    expect(roughly(9 / 47)).toEqual({ top: 1, bottom: 5 });
    expect(roughly(0.5)).toEqual({ top: 1, bottom: 2 });
  });

  it('is off by default, remembers being switched on, and counts stars', () => {
    const data = new Map<string, string>();
    const store: Store = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
    let p = loadProgress(store);
    expect(p.math).toBe(false);
    expect(p.mathStars).toBe(0);
    p = addMathStar(setOption(p, 'math', true, store), store);
    expect(loadProgress(store)).toMatchObject({ math: true, mathStars: 1 });
  });
});
