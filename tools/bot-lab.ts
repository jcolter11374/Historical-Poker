/**
 * Bot lab: plays chapters many times with simple stand-in players and prints
 * how each rival plays and how each stand-in fares. Use it after changing a
 * personality or src/bots/ to check the rivals still feel like themselves and
 * that the table isn't easy money.
 *
 *   npx vite-node tools/bot-lab.ts                 every chapter, 300 hands each
 *   npx vite-node tools/bot-lab.ts riverboat 600   one chapter, 600 hands
 *
 * Stand-in players (the "you" seat):
 *   station  checks and calls everything
 *   maniac   raises as much as allowed whenever it can, otherwise calls
 *   aggro    bets or raises about the pot whenever it can, otherwise calls
 *   teacher  plays what the hint would say (a careful, honest player)
 *
 * Columns for rivals (from every decision they made):
 *   play%    hands where they put money in on the first round by choice
 *   aggr%    bets and raises, as a share of all their betting decisions
 *   fold%    folds when facing a bet
 *   bluff%   share of their bets and raises made with a weak hand
 * and for the stand-ins: result in units (the stage's betting unit) per 100 hands.
 * Negative means the rivals beat that style; the teacher should be about even
 * or a little ahead, and the reckless styles should lose.
 */
import { CHAPTERS } from '../src/chapters';
import { playStyle, POLICIES, type RivalStats } from '../test/standIns';

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}`.padStart(5) : '    -');

declare const process: { argv: string[] };
const [only, handsArg] = process.argv.slice(2);
const hands = Number(handsArg ?? 300);
const chapters = CHAPTERS.filter((c) => !only || c.chapter.id === only).map((c) => c.chapter);
if (!chapters.length) throw new Error(`no chapter "${only}"; ids: ${CHAPTERS.map((c) => c.chapter.id).join(', ')}`);

for (const chapter of chapters) {
  const stats: Record<string, RivalStats> = {};
  const results = POLICIES.map((p, i) => `${p} ${playStyle(chapter, p, hands, 1000 + i, stats).toFixed(0).padStart(5)}`);
  console.log(`\n${chapter.id}  (you, units per 100 hands)  ${results.join('   ')}`);
  console.log('  rival        play%  aggr%  fold%  bluff%');
  for (const c of chapter.rivals) {
    const r = stats[c.id];
    if (!r) continue;
    console.log(`  ${c.name.padEnd(12)} ${pct(r.played, r.hands)}  ${pct(r.aggressive, r.decisions)}  ${pct(r.folds, r.facing)}  ${pct(r.bluffs, r.aggressive)}`);
  }
}
