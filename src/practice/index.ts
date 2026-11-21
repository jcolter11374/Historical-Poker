/**
 * Practice mode: any game the story teaches, played on its own against
 * bots, outside the story, for as long as you like (docs/GAME_DESIGN.md,
 * "Practice").
 *
 * Nothing here is written by hand. The list is built from the chapters: every
 * game and betting the story deals becomes one practice game, sat at the
 * table of the first chapter that teaches it, with that chapter's rivals,
 * room, stakes and teacher. Stages that deal a rotation of games (HORSE, the
 * 8-Game) and stages with house rules (the epilogue's bomb pots) become
 * practice games of their own. A chapter added later shows up here by itself.
 *
 * A practice table is an ordinary Chapter with `practice: true`: one stage,
 * no story, steady stakes, and nobody is ever knocked out (anyone who goes
 * broke buys back in), so it never ends until the player leaves.
 */
import type { BettingKind } from '@rsdp/engine/core';
import { CHAPTERS } from '../chapters';
import type { Chapter, Character, GamePlay, Lesson, SceneLine, Stage } from '../chapters/types';
import { getGame } from '../games/catalog';
import { playName } from '../table/stakes';

export type PracticeGroup = 'old' | 'flop' | 'stud-draw' | 'mixed';

export const GROUP_TITLES: Record<PracticeGroup, string> = {
  old: 'The old games, 1543 to 1876',
  flop: 'Hold’em and Omaha',
  'stud-draw': 'Stud and draw',
  mixed: 'Mixed games and house rules',
};

export interface PracticeGame {
  /** Stable id: 'razz/fixed-limit', 'mixed/last-table/0'. */
  key: string;
  /** "Razz", "Pot-Limit Omaha", "HORSE". */
  name: string;
  /** Mixed games and house rules: a few words on what it is ("Five games in turn"). */
  blurb: string | null;
  /** Mixed games: every game in the rotation; house rules: the game and each rule. */
  games: string[];
  group: PracticeGroup;
  /** The chapter whose table, rivals and stakes it is played at. */
  source: Chapter;
  /** Who explains it and gives hints. */
  teacher: Character;
  /** Has a lesson to give before the first hand. */
  teachable: boolean;
}

const BETTING_LINE: Record<BettingKind, string> = {
  'fixed-limit': 'This is limit betting: every bet and raise is a fixed size, one unit early in the hand and two units later.',
  'pot-limit': 'This is pot limit: you may bet or raise up to the size of the pot.',
  'no-limit': 'This is no limit: any bet, any time, up to everything in front of you.',
};

/** Every practice game, grouped and in a sensible order: old games by date, then modern ones by family. */
export const PRACTICE: PracticeGame[] = build();

export function practiceGame(key: string): PracticeGame | undefined {
  return PRACTICE.find((p) => p.key === key);
}

function build(): PracticeGame[] {
  const singles = new Map<string, PracticeGame>();
  const mixed: PracticeGame[] = [];
  for (const { chapter } of CHAPTERS) {
    chapter.stages.forEach((stage, i) => {
      const extras = !!stage.extras && Object.keys(stage.extras).length > 0;
      if (stage.games.length > 2 || extras) {
        const teacherId = stage.games.find((g) => g.lesson)?.lesson?.teacher ?? chapter.narratorId;
        mixed.push({
          key: `mixed/${chapter.id}/${i}`,
          name: extras ? 'The Home Game' : (stage.label ?? 'Mixed games').replace(/^The /, ''),
          blurb: extras ? houseRules(stage).blurb : `${numberWord(stage.games.length)} games in turn`,
          games: extras ? houseRules(stage).list : stage.games.map((g) => shortName(g)).filter(unique),
          group: 'mixed',
          source: chapter,
          teacher: rival(chapter, teacherId),
          teachable: stage.games.some((g) => g.lesson),
        });
        if (extras) return; // the house-rules game isn't also plain No-Limit Hold'em
      }
      for (const play of stage.games) {
        const key = `${play.game}/${play.betting}`;
        const known = singles.get(key);
        // The first chapter that teaches it wins; a chapter that only deals it is a fallback.
        if (known && (known.teachable || !play.lesson)) continue;
        const game = getGame(play.game);
        singles.set(key, {
          key,
          name: playName(game.name, play.betting, !!game.historical, game.spec.family),
          blurb: null,
          games: [],
          group: game.historical ? 'old' : game.spec.family === 'flop' ? 'flop' : 'stud-draw',
          source: chapter,
          teacher: rival(chapter, play.lesson?.teacher ?? chapter.narratorId),
          teachable: !!play.lesson,
        });
      }
    });
  }
  const order: PracticeGroup[] = ['old', 'flop', 'stud-draw', 'mixed'];
  const year = (c: Chapter) => (c.year === 'Today' ? 9999 : c.year);
  const all = [...singles.values(), ...mixed];
  return order.flatMap((group) => {
    const g = all.filter((p) => p.group === group);
    // The old games read best by date; the modern ones keep the story's order, which groups them by family.
    return group === 'old' ? g.sort((a, b) => year(a.source) - year(b.source)) : g;
  });
}

/**
 * The practice table for a game: the source chapter with one stage and no
 * story. With `lesson`, the teacher explains the game before the first hand
 * (from the game's rules card, so it never leans on the story) and talks
 * through that hand street by street.
 */
export function practiceChapter(p: PracticeGame, opts: { lesson: boolean }): Chapter {
  const c = p.source;
  const stage = sourceStage(p);
  const games: GamePlay[] = p.group === 'mixed' ? mixedPlays(c, stage, opts.lesson) : [single(p, stage, opts.lesson)];
  const practiceStage: Stage = {
    fromHand: 1,
    games,
    handsPerGame: games.length > 1 ? (stage.handsPerGame ?? 2) : undefined,
    structure: stage.structure,
    extras: stage.extras,
    label: p.group === 'mixed' ? p.name : undefined,
  };
  return {
    ...c,
    id: `practice:${p.key}`,
    numeral: 'Practice',
    title: c.title,
    teaches: p.name,
    stages: [practiceStage],
    levelEvery: undefined,
    levelLines: undefined,
    howToWin: [
      'This is practice. Play as long as you like: if anyone runs out of chips they buy back in, and nothing is saved.',
      'Leave the table whenever you want to try another game.',
    ],
    scene: stage.scene ?? c.scene,
    story: undefined,
    practice: true,
  };
}

// ---------------------------------------------------------------- helpers

function sourceStage(p: PracticeGame): Stage {
  const c = p.source;
  if (p.group === 'mixed') return c.stages[Number(p.key.split('/')[2])];
  return c.stages.find((s) => s.games.some((g) => `${g.game}/${g.betting}` === p.key && g.lesson)) ?? c.stages.find((s) => s.games.some((g) => `${g.game}/${g.betting}` === p.key))!;
}

function single(p: PracticeGame, stage: Stage, withLesson: boolean): GamePlay {
  const play = stage.games.find((g) => `${g.game}/${g.betting}` === p.key)!;
  const game = getGame(play.game);
  const teacher = p.teacher.id;
  const before: SceneLine[] = withLesson
    ? [
        { who: teacher, text: `${game.card.title}. Here’s how it goes.` },
        ...game.card.howToPlay.map((text) => ({ who: teacher, text })),
        ...(game.historical ? [] : [{ who: teacher, text: BETTING_LINE[play.betting] }]),
      ]
    : [];
  // The teacher stays the teacher (hints come from them) even with the lesson off.
  const lesson: Lesson = { teacher, before, streets: withLesson ? play.lesson?.streets : undefined };
  return { game: play.game, betting: play.betting, lesson };
}

/**
 * A rotation's games. A game without its own lesson in this stage borrows the
 * one given for it earlier in the same chapter (the 8-Game's first five games
 * are taught in the HORSE stage before it), so every game is explained.
 */
function mixedPlays(c: Chapter, stage: Stage, withLesson: boolean): GamePlay[] {
  const earlier = c.stages.flatMap((s) => s.games).filter((g) => g.lesson);
  const teacher = stage.games.find((g) => g.lesson)?.lesson?.teacher ?? c.narratorId;
  return stage.games.map((g) => {
    const lesson = g.lesson ?? earlier.find((e) => e.game === g.game && e.betting === g.betting)?.lesson;
    return { ...g, lesson: withLesson ? lesson : { teacher: lesson?.teacher ?? teacher, before: [] } };
  });
}

function rival(c: Chapter, id: string): Character {
  return c.rivals.find((r) => r.id === id) ?? c.rivals.find((r) => r.id === c.narratorId)!;
}

function shortName(g: GamePlay): string {
  const game = getGame(g.game);
  return playName(game.name, g.betting, !!game.historical, game.spec.family);
}

/** The epilogue's house rules: a short blurb, and the whole list. */
function houseRules(stage: Stage): { blurb: string; list: string[] } {
  const x = stage.extras!;
  const list = [shortName(stage.games[0])];
  if (x.bombPotEvery) list.push(x.doubleBoardOnBombPots ? 'bomb pots dealt on two boards' : 'bomb pots');
  if (x.bounty72Units) list.push('a bounty for winning with 7-2');
  const blurb = [x.bombPotEvery ? 'Bomb pots' : '', x.bounty72Units ? 'the 7-2' : ''].filter(Boolean).join(' and ');
  return { blurb: blurb || 'House rules', list };
}

function numberWord(n: number): string {
  return ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][n] ?? String(n);
}

function unique<T>(v: T, i: number, a: T[]): boolean {
  return a.indexOf(v) === i;
}
