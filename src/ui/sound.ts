/**
 * Sound effects and music.
 *
 * Every sound effect is made in code with the Web Audio API (filtered noise
 * for cards, short metallic pings for chips, a low thump for a knock), so
 * there are no audio files to license or download. See docs/CREDITS.md.
 *
 * Music is a hook: a chapter (or one of its stages) may name a music file in
 * `scene.music` (src/chapters/types.ts). The file goes in public/music/ and
 * must be free to use (see docs/ART.md, "Music"). With no file named, no
 * music plays. Music fades between chapters and loops.
 *
 * Browsers only allow sound after the player has clicked or tapped, so the
 * audio context starts on the first press anywhere (unlock()).
 *
 * No React here. The UI calls sfx('chip') and so on; src/ui/useTableFx.ts
 * works out which sounds a change at the table makes.
 */

export type Sfx = 'deal' | 'flip' | 'chip' | 'chips' | 'check' | 'fold' | 'win' | 'bigWin' | 'turn' | 'draw' | 'lose';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let sfxOn = true;
let musicOn = true;
let musicEl: HTMLAudioElement | null = null;
let musicSrc: string | null = null;
let fadeTimer: number | undefined;

const MUSIC_VOLUME = 0.35;

/** Start audio. Call from a click or tap (the browser insists). Safe to call often. */
export function unlock(): void {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    noise = makeNoise(ctx);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  // A music file asked for before the first click starts now.
  if (musicEl && musicOn && musicEl.paused) void musicEl.play().catch(() => undefined);
}

export function setSoundOn(on: boolean): void {
  sfxOn = on;
}

export function setMusicOn(on: boolean): void {
  musicOn = on;
  if (!musicEl) return;
  if (on) void musicEl.play().catch(() => undefined);
  else musicEl.pause();
}

/** Plays a sound effect, if sound is on and audio has started. */
export function sfx(name: Sfx, delayMs = 0): void {
  if (!sfxOn || !ctx || !master || ctx.state !== 'running') return;
  const t = ctx.currentTime + delayMs / 1000;
  RECIPES[name](ctx, master, t);
}

/** Changes the music: a file path (relative to the site), or null for silence. Fades over a second. */
export function playMusic(src: string | null): void {
  if (typeof window === 'undefined' || src === musicSrc) return;
  musicSrc = src;
  const old = musicEl;
  window.clearInterval(fadeTimer);
  if (old) fade(old, 0, () => old.pause());
  musicEl = null;
  if (!src) return;
  const el = new Audio(src);
  el.loop = true;
  el.volume = 0;
  musicEl = el;
  if (musicOn) void el.play().catch(() => undefined);
  fade(el, MUSIC_VOLUME);
}

function fade(el: HTMLAudioElement, to: number, done?: () => void) {
  const from = el.volume;
  let step = 0;
  const id = window.setInterval(() => {
    step++;
    el.volume = Math.max(0, Math.min(1, from + ((to - from) * step) / 20));
    if (step >= 20) {
      window.clearInterval(id);
      done?.();
    }
  }, 50);
  if (!done) fadeTimer = id;
}

// ---------------------------------------------------------------- the sounds

type Recipe = (c: AudioContext, out: AudioNode, t: number) => void;

function makeNoise(c: AudioContext): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** A burst of filtered noise: card slides, swishes. */
function swish(c: AudioContext, out: AudioNode, t: number, o: { dur: number; freq: number; q: number; gain: number; sweepTo?: number }) {
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(o.freq, t);
  if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.dur);
  f.Q.value = o.q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain, t + o.dur * 0.15);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  src.connect(f).connect(g).connect(out);
  src.start(t, Math.random() * 0.5, o.dur + 0.05);
}

/** A short pitched ping that dies fast: clay and bone chips touching. */
function ping(c: AudioContext, out: AudioNode, t: number, freq: number, gain: number, dur = 0.09) {
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.92, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function clack(c: AudioContext, out: AudioNode, t: number, gain: number) {
  ping(c, out, t, 2600 + Math.random() * 900, gain * 0.5, 0.06);
  ping(c, out, t + 0.002, 4100 + Math.random() * 900, gain * 0.25, 0.04);
  swish(c, out, t, { dur: 0.03, freq: 5200, q: 2, gain: gain * 0.6 });
}

/** A low soft thump: knuckles on the table. */
function thump(c: AudioContext, out: AudioNode, t: number, gain: number) {
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.2);
  swish(c, out, t, { dur: 0.04, freq: 900, q: 1, gain: gain * 0.3 });
}

/** A soft bell: a warm note with a quiet octave over it. */
function bell(c: AudioContext, out: AudioNode, t: number, freq: number, gain: number, dur = 0.9) {
  for (const [mult, g0] of [
    [1, 1],
    [2.01, 0.35],
    [3.02, 0.12],
  ] as const) {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * mult;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain * g0, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur / mult);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }
}

const RECIPES: Record<Sfx, Recipe> = {
  deal: (c, o, t) => swish(c, o, t, { dur: 0.11, freq: 2400, q: 0.9, gain: 0.32, sweepTo: 1300 }),
  flip: (c, o, t) => {
    swish(c, o, t, { dur: 0.06, freq: 3000, q: 1.2, gain: 0.25 });
    swish(c, o, t + 0.05, { dur: 0.05, freq: 1800, q: 1.5, gain: 0.2 });
  },
  draw: (c, o, t) => {
    swish(c, o, t, { dur: 0.14, freq: 1600, q: 0.8, gain: 0.26, sweepTo: 2600 });
  },
  chip: (c, o, t) => {
    clack(c, o, t, 0.5);
    clack(c, o, t + 0.07, 0.35);
  },
  chips: (c, o, t) => {
    for (let i = 0; i < 6; i++) clack(c, o, t + i * 0.045 + Math.random() * 0.02, 0.45 - i * 0.05);
  },
  check: (c, o, t) => {
    thump(c, o, t, 0.5);
    thump(c, o, t + 0.13, 0.4);
  },
  fold: (c, o, t) => swish(c, o, t, { dur: 0.2, freq: 900, q: 0.7, gain: 0.22, sweepTo: 500 }),
  win: (c, o, t) => {
    for (let i = 0; i < 9; i++) clack(c, o, t + i * 0.04 + Math.random() * 0.02, 0.4);
  },
  bigWin: (c, o, t) => {
    for (let i = 0; i < 12; i++) clack(c, o, t + i * 0.04 + Math.random() * 0.02, 0.4);
    bell(c, o, t + 0.1, 523.25, 0.12);
    bell(c, o, t + 0.22, 659.25, 0.1);
    bell(c, o, t + 0.34, 783.99, 0.1, 1.4);
  },
  lose: (c, o, t) => {
    bell(c, o, t, 392, 0.06, 0.7);
    bell(c, o, t + 0.16, 311.13, 0.06, 1.0);
  },
  turn: (c, o, t) => bell(c, o, t, 880, 0.05, 0.6),
};
