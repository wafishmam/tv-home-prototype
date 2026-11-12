/*
 * Seeded randomness. Math.random gives different results on every run; a
 * seeded generator gives the same sequence for the same seed. Used for the
 * poster art (stable artwork) and the mock live feed (repeatable games).
 */

export type Random = () => number;

/** FNV-1a hash: turns an id like "saltmarsh" into a number to seed from. */
export function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** mulberry32: a tiny, well distributed pseudo random number generator. */
export function createRandom(seed: number): Random {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
