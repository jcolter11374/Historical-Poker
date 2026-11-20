/**
 * Small seedable random source. The game uses the browser's crypto for the
 * shuffle (see src/table/session.ts); bots and tests use this so a game can be
 * replayed exactly from a seed.
 */
export interface Random {
  /** Uniform float in [0, 1). */
  next(): number;
  /** Uniform integer in [0, n). */
  int(n: number): number;
  /** A shuffled copy. */
  shuffle<T>(items: T[]): T[];
  /** True with probability p. */
  chance(p: number): boolean;
}

/** mulberry32: fast, good enough for game decisions (not for dealing cards). */
export function seeded(seed: number): Random {
  let a = seed >>> 0 || 1;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (n: number) => Math.floor(next() * n);
  return {
    next,
    int,
    chance: (p) => next() < p,
    shuffle<T>(items: T[]) {
      const out = items.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(i + 1);
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}
