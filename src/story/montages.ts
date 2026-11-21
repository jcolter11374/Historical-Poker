/**
 * The two picture sequences that frame the game (docs/GAME_DESIGN.md, "The
 * opening and the ending"):
 *
 *   OPENING: plays before the chapter select on the first visit. The feud
 *   between the Averys and the Cranes at its most bitter, one moment per
 *   picture, so the player sits down disliking the Cranes.
 *
 *   CLOSING: plays after the epilogue is won. The same moments and people
 *   again, seen kindly, then the wedding, the deck and the credits.
 *
 * Each picture wipes in over the one before (src/ui/Montage.tsx). Every
 * moment is one the chapters actually tell; change a caption here and check
 * it against the chapter it comes from. The feud begins in 1543 (Sir Roland
 * Crane, chapter 2). The opening names no Crane after 1876, so it doesn't
 * give away who "N0rthStar" is in chapter 10.
 *
 * Art: each slide should end up with its own painting (prompts in
 * docs/ART_PROMPTS.md, "The opening and the ending"). Until then a slide
 * borrows a chapter painting that fits (`image`), or shows a lamplit
 * placeholder in `palette`. To add a painting: put it in
 * public/art/montage/ and point `image` at it.
 */
import type { Palette } from '../chapters/types';

export interface Slide {
  /** Where and when: "The Mississippi, before 1836". */
  when: string;
  caption: string;
  /** A picture under public/art/, e.g. 'riverboat/title.webp'. */
  image?: string;
  /** No picture yet: the colours of the room, for a painted placeholder. */
  palette?: Palette;
  /** True while `image` is a chapter's painting standing in for the slide's own (for docs and the art list). */
  standIn?: boolean;
}

const MACAU: Palette = { wall: '#0d0b10', light: '#f5d9a0', felt: '#3a1418', rim: '#b08a3a' };
const KITCHEN: Palette = { wall: '#1a1612', light: '#ffe2a8', felt: '#6a4a2a', rim: '#3a2a1a' };
const LETTERS: Palette = { wall: '#1c1a22', light: '#d8c9a0', felt: '#3a3326', rim: '#5a4a2a' };

export const OPENING: Slide[] = [
  {
    when: 'Ashcombe Hall, 1543',
    caption: 'It starts with a grudge. A young knight named Crane is promised a painted deck of cards, and watches a painter’s daughter named Avery win it at the table instead. “A Crane does not forget,” he says.',
    image: 'montage/opening-1-ashcombe.webp',
  },
  {
    when: 'The Mississippi, 1836',
    caption: 'Three hundred years on, a river gambler named Silas Crane cheats an Avery out of that deck, smiling. Avery’s child comes aboard to win it back. The Cranes will say they were robbed. Again.',
    image: 'montage/opening-2-cheat.webp',
  },
  {
    when: 'Deadwood, 1876',
    caption: 'Forty years on, Crane’s grandson rides into a gold town for what he calls “the Crane deck”, with his grandfather’s trick in his thumb. An Avery is waiting for him.',
    image: 'montage/opening-3-deadwood.webp',
  },
  {
    when: 'Chicago, Las Vegas, Paris: 1926 to 1992',
    caption: 'Then the letters begin. A lawyer, no name, and an offer for the deck. Every Avery gets one. No Avery answers.',
    image: 'montage/opening-4-letters.webp',
  },
  {
    when: 'Las Vegas, 2005',
    caption: 'A stranger who never says a word sits down at an Avery’s table, in front of the cameras, and plays as if the deck were already theirs.',
    image: 'montage/opening-5-stranger.webp',
  },
  {
    when: 'Today',
    caption: 'Two families. One deck. Nearly five hundred years of bad blood. Somebody has to end it. Take a seat.',
    image: 'montage/opening-6-today.webp',
    palette: MACAU,
  },
];

export const CLOSING: Slide[] = [
  {
    when: 'The Mississippi, after 1836',
    caption: 'Silas Crane never won a big hand again. He told his grandchildren the family’s luck had gone downriver with a deck of cards. It was easier than telling them what he had done.',
    image: 'montage/opening-2-cheat.webp',
  },
  {
    when: 'Deadwood, 1876',
    caption: 'Jasper Crane left on the morning stage with empty pockets. He was a young man who had been raised on one story, and had just met the other half of it.',
    image: 'montage/opening-3-deadwood.webp',
  },
  {
    when: 'A shoebox of letters, 1926 to 2019',
    caption: 'Read in order, the letters were never threats. They grow a little politer every decade. The last one is in handwriting, signed, and only asks to see it.',
    image: 'montage/ending-3-shoebox.webp',
    palette: LETTERS,
  },
  {
    when: 'Las Vegas, 2005',
    caption: 'Nat Crane shook an Avery’s hand on live television. “Every generation,” she said. She did not sound angry any more.',
    image: 'montage/opening-5-stranger.webp',
  },
  {
    when: 'The wedding',
    caption: 'Both families in one room, and nobody counting the chairs between them.',
    image: 'montage/ending-5-wedding.webp',
    palette: KITCHEN,
  },
  {
    when: 'The Ashcombe deck, 1543 to today',
    caption: 'In the lid of the case, three lines in three hands: “M.A. 1543”. “Still ours.” And two names, side by side: Avery and Crane.',
    palette: MACAU,
  },
];
