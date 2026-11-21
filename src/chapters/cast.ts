/**
 * Helpers for writing chapters. Until a chapter's art exists, its rivals are
 * drawn as painted silhouettes in their own colour, in three standard seats
 * (left, across, right). When the art arrives, replace `placeholder(...)`
 * with a real CharacterArt and tune the positions (docs/ART.md).
 */
import type { Character, CharacterArt, Lines, SceneLine } from './types';

/** A chapter's music loop in public/music/ (made by tools/music/compose.py; docs/MUSIC.md). */
export const music = (id: string) => `${import.meta.env.BASE_URL}music/${id}.mp3`;

export type SeatPos = 'left' | 'across' | 'right';

const ART: Record<SeatPos, { x: number; bottom: number; height: number }> = {
  left: { x: 330, bottom: 560, height: 380 },
  across: { x: 800, bottom: 500, height: 400 },
  right: { x: 1270, bottom: 560, height: 380 },
};
const PLATE: Record<SeatPos, { x: number; y: number }> = {
  left: { x: 380, y: 540 },
  across: { x: 800, y: 474 },
  right: { x: 1220, y: 540 },
};

export function placeholder(color: string, seat: SeatPos): CharacterArt {
  return { src: '', kind: 'placeholder', color, aspect: 0.8, place: ART[seat] };
}

/** Painted art cut out from green, placed on the 1600 x 900 stage. `aspect` is the image's width / height. */
export function cutout(src: string, aspect: number, place: { x: number; bottom: number; height: number }): CharacterArt {
  return { src, kind: 'cutout', aspect, place };
}

/** A rival with placeholder art in a standard seat. */
export function rival(c: Omit<Character, 'art' | 'plate'>, seat: SeatPos, color: string): Character {
  return { ...c, art: placeholder(color, seat), plate: PLATE[seat] };
}

/** Lines, with plain defaults for the ones a character doesn't need to vary. */
export function lines(l: Partial<Lines> & Pick<Lines, 'bet' | 'win' | 'bust'>): Lines {
  return {
    call: ['Call.'],
    fold: ['Fold.'],
    check: ['Check.'],
    ...l,
  };
}

/** Short-hand for scene lines: say('anselm', 'Text'), or say('narration', 'Text'). */
export const say = (who: string, text: string): SceneLine => ({ who, text });
