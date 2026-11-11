import type { Palette } from '../../data/types';

/*
 * Shared pieces for the generated poster art.
 *
 * Every art style is an SVG drawn in the same 384 x 216 coordinate space (the
 * size of a card). "slice" makes the SVG cover whatever box it is placed in,
 * so the same art works as a card and as the large hero backdrop.
 */

export const ART_WIDTH = 384;
export const ART_HEIGHT = 216;

export const artSvgProps = {
  className: 'art',
  viewBox: `0 0 ${ART_WIDTH} ${ART_HEIGHT}`,
  preserveAspectRatio: 'xMidYMid slice',
  'aria-hidden': true,
  focusable: false,
} as const;

export interface ArtProps {
  palette: Palette;
  variant: number;
  /** Seeds the random details so each title gets its own, stable, artwork. */
  seed: number;
}

// ---- Seeded randomness ------------------------------------------------------
// Math.random would redraw a different poster on every render. A seeded
// generator gives each title the same "random" details every time.

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

/** A random number between min and max, rounded to keep the SVG markup short. */
export function between(random: Random, min: number, max: number): number {
  return round(min + random() * (max - min));
}

export function round(value: number): number {
  return Math.round(value * 10) / 10;
}
