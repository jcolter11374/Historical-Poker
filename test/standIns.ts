/**
 * Stand-in players for measuring the rivals: used by tools/bot-lab.ts (which
 * prints a table) and test/bots.test.ts (which checks the rivals aren't easy
 * money). See tools/bot-lab.ts for what each style does.
 */
import { drawHabit } from './drawHabits';
import type { Action } from '@rsdp/engine/core';
import { seeded } from '../src/bots/random';
import type { Chapter } from '../src/chapters/types';
import { HUMAN, Session, type BotDecisionInfo } from '../src/table/session';

export type Policy = 'station' | 'maniac' | 'aggro' | 'teacher';
export const POLICIES: Policy[] = ['station', 'maniac', 'aggro', 'teacher'];

export interface RivalStats {
  hands: number;
  played: number;
  decisions: number;
  aggressive: number;
  facing: number;
  folds: number;
  bluffs: number;
}

function choose(s: Session, policy: Policy): Action {
  const legal = s.legal()!;
  if (legal.canBringIn) return { type: 'bring-in' };
  const passive: Action = legal.canCheck ? { type: 'check' } : { type: 'call' };
  if (policy === 'station') return passive;
  if (policy === 'teacher') return s.teacherAdvice()!.decision.action;
  if (!legal.canRaise) return passive;
  if (policy === 'maniac') return { type: legal.raiseKind, to: legal.maxTo };
  const pot = s.snapshot().hand!.pot;
  return { type: legal.raiseKind, to: Math.max(legal.minTo, Math.min(legal.maxTo, s.snapshot().hand!.players[HUMAN].bet + pot)) };
}

/**
 * Plays `hands` hands of a chapter with a stand-in in the player's seat,
 * starting a new sitting whenever one ends. Returns the stand-in's result in
 * betting units per 100 hands, and adds every rival decision to `stats`.
 */
export function playStyle(chapter: Chapter, policy: Policy, hands: number, seed: number, stats: Record<string, RivalStats> = {}, trials = 60) {
  let net = 0;
  let played = 0;
  let sessions = 0;
  let firstStreetPlayed = new Set<string>();
  const onBotDecision = (d: BotDecisionInfo) => {
    const r = (stats[d.id] ??= { hands: 0, played: 0, decisions: 0, aggressive: 0, facing: 0, folds: 0, bluffs: 0 });
    if (d.action === 'bring-in') return;
    r.decisions++;
    const aggressive = d.action === 'bet' || d.action === 'raise';
    if (aggressive) r.aggressive++;
    if (aggressive && d.bluffing) r.bluffs++;
    if (d.facingBet) {
      r.facing++;
      if (d.action === 'fold') r.folds++;
    }
    if (d.street === 0 && (aggressive || d.action === 'call')) firstStreetPlayed.add(d.id);
  };
  while (played < hands) {
    const deal = seeded(seed * 7919 + sessions);
    const s = new Session(chapter, { seed: seed + sessions * 31, dealRng: (n) => deal.int(n), skipTutorial: true, simTrials: trials, onBotDecision });
    sessions++;
    const skip = () => {
      while (s.inScene) s.advanceScene();
    };
    skip();
    while (!s.snapshot().outcome && played < hands) {
      skip();
      s.startHand();
      firstStreetPlayed = new Set();
      const unit = s.snapshot().play.unit;
      let guard = 0;
      while (s.handInProgress) {
        if (++guard > 300) throw new Error('hand did not finish');
        skip();
        if (!s.handInProgress) break;
        if (s.toAct !== HUMAN) {
          s.botStep();
          continue;
        }
        const limit = s.drawLimit();
        if (limit !== null) {
          const cards = s.snapshot().hand!.myCards.map((c) => c.card);
          let d = drawHabit(s.currentGame.id, cards, limit);
          if (s.drawProblem(d)) d = d.slice(0, 3);
          s.draw(d);
        } else s.act(choose(s, policy));
      }
      const snap = s.snapshot();
      for (let i = 1; i < snap.seats.length; i++) {
        const c = chapter.rivals[i - 1];
        if (snap.seats[i].out) continue;
        const r = (stats[c.id] ??= { hands: 0, played: 0, decisions: 0, aggressive: 0, facing: 0, folds: 0, bluffs: 0 });
        r.hands++;
        if (firstStreetPlayed.has(c.id)) r.played++;
      }
      net += (s.lastHandNet[HUMAN] ?? 0) / unit;
      played++;
      skip();
    }
  }
  return (net / played) * 100;
}

