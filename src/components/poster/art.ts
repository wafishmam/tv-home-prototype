import type { Palette } from '../../data/types';
import type { Random } from '../../lib/random';

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

// The seeded random generator lives in src/lib/random.ts. It is re-exported
// here so the art files have one place to import from.
export { createRandom, hashString, type Random } from '../../lib/random';

/** A random number between min and max, rounded to keep the SVG markup short. */
export function between(random: Random, min: number, max: number): number {
  return round(min + random() * (max - min));
}

export function round(value: number): number {
  return Math.round(value * 10) / 10;
}
