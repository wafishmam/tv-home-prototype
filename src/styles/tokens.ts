/*
 * Reads design tokens from CSS so JavaScript never repeats a value that
 * lives in tokens.css. Values are cached after the first read.
 */

const cache = new Map<string, number>();

/** A duration token such as --duration-base, in milliseconds. */
export function tokenMs(name: `--${string}`): number {
  const cached = cache.get(name);
  if (cached !== undefined) return cached;

  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const number = parseFloat(raw);
  if (Number.isNaN(number)) throw new Error(`Token ${name} is not a duration: "${raw}"`);

  // CSS allows both "200ms" and "0.2s".
  const ms = raw.endsWith('ms') ? number : number * 1000;
  cache.set(name, ms);
  return ms;
}
