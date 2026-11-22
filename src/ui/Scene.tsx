/**
 * The room and the people in it. Each chapter has painted art (a background,
 * a table-front layer and cut-out characters) or, until that art exists, a
 * placeholder painted in code from the chapter's palette: a lamplit wall, a
 * felt table, and silhouettes in each character's colour. See docs/ART.md.
 */
import type { CSSProperties } from 'react';
import type { Character, ChapterScene } from '../chapters/types';
import type { Mood } from '../table/session';

/** Everything behind the characters: the background picture, or a painted wall and lamp glow. */
export function SceneBack({ scene }: { scene: ChapterScene }) {
  if (scene.background) return <img className="layer" src={scene.background} alt="" />;
  const { wall, light } = scene.palette;
  return (
    <svg className="layer" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="18%" r="70%">
          <stop offset="0%" stopColor={light} stopOpacity="0.55" />
          <stop offset="45%" stopColor={light} stopOpacity="0.12" />
          <stop offset="100%" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill={wall} />
      <rect width="1600" height="900" fill="url(#glow)" />
      {/* A lamp hanging over the table. */}
      <line x1="800" y1="0" x2="800" y2="96" stroke="#000" strokeOpacity="0.5" strokeWidth="3" />
      <ellipse cx="800" cy="118" rx="70" ry="26" fill={light} fillOpacity="0.85" />
      <ellipse cx="800" cy="106" rx="76" ry="22" fill="#000" fillOpacity="0.55" />
      <rect width="1600" height="900" filter="url(#grain)" />
    </svg>
  );
}

/** The table in front of the characters: the table-front picture, or a painted felt ellipse. */
export function SceneFront({ scene }: { scene: ChapterScene }) {
  if (scene.background) return scene.tableFront ? <img className="layer" src={scene.tableFront} alt="" /> : null;
  const { felt, rim, light } = scene.palette;
  return (
    <svg className="layer" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="feltlight" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor={light} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <ellipse cx="800" cy="800" rx="900" ry="350" fill={rim} />
      <ellipse cx="800" cy="806" rx="860" ry="322" fill={felt} />
      <ellipse cx="800" cy="806" rx="860" ry="322" fill="url(#feltlight)" />
      <ellipse cx="800" cy="806" rx="860" ry="322" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="6" />
    </svg>
  );
}

/** A rival: their art, or a painted silhouette in their colour until the art exists. */
/**
 * How a painting is alive at the table (styles.css, "Living portraits"):
 * every rival breathes; the one speaking leans in; in a story scene the
 * others fall back into shadow; a mood shows how the last pot landed.
 */
export interface RivalLife {
  /** Which seat they are in, so they don't all breathe together. */
  index: number;
  speaking: 'scene' | 'talk' | null;
  /** A story scene is playing and someone else has the floor. */
  shadowed: boolean;
  mood: Mood | null;
}

export function Rival({ character, left, folded, light, life }: { character: Character; left: 'broke' | 'bowed' | null; folded: boolean; light: string; life?: RivalLife }) {
  // A rival who went broke leaves; one who bowed out stays to watch, dimmed.
  if (left === 'broke') return null;
  const { place, src, kind, aspect, color } = character.art;
  const width = place.height * aspect;
  const style = { left: place.x - width / 2, top: place.bottom - place.height, width, height: place.height, '--breath-delay': `${-(life?.index ?? 0) * 1.7}s` } as CSSProperties;
  const dim =
    (folded || left === 'bowed' ? ' rival-folded' : '') +
    (life?.speaking ? ` rival-speaking rival-speaking-${life.speaking}` : '') +
    (life?.shadowed ? ' rival-shadowed' : '') +
    (life?.mood ? ` rival-${life.mood}` : '');
  if (kind !== 'placeholder') return <img className={`rival rival-${kind}${dim}`} src={src} alt={character.fullName} style={style} />;
  const id = `sil-${character.id}`;
  return (
    <svg className={`rival${dim}`} style={style} viewBox="0 0 320 400" role="img" aria-label={`${character.fullName} (art to come)`}>
      <defs>
        <radialGradient id={id} cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor={light} stopOpacity="0.45" />
          <stop offset="60%" stopColor={color ?? '#444'} stopOpacity="1" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Shoulders and body, then the head: a simple bust, lit from the lamp above. */}
      <path d="M20 400 C 24 300, 70 250, 160 245 C 250 250, 296 300, 300 400 Z" fill={`url(#${id})`} />
      <rect x="138" y="200" width="44" height="56" rx="16" fill={color ?? '#444'} />
      <ellipse cx="160" cy="160" rx="62" ry="76" fill={`url(#${id})`} />
      <ellipse cx="160" cy="160" rx="62" ry="76" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="3" />
      <path d="M20 400 C 24 300, 70 250, 160 245 C 250 250, 296 300, 300 400" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="3" />
    </svg>
  );
}

/** A small round face for intro and keepsake screens: the art, or the silhouette colour. */
export function Face({ character, className = '' }: { character: Character; className?: string }) {
  const { src, kind, color } = character.art;
  if (kind === 'placeholder') {
    return (
      <span className={`cast-face cast-placeholder ${className}`} style={{ background: `radial-gradient(circle at 50% 35%, #f6e0b0 0 22%, ${color ?? '#444'} 23% 100%)` }} aria-hidden="true">
        {character.name[0]}
      </span>
    );
  }
  return <img src={src} alt="" className={`cast-face cast-${kind} ${className}`} />;
}
