/*
 * Reads design tokens from CSS so JavaScript never repeats a value that
 * lives in tokens.css. Values are cached after the first read.
 */

type TokenName = `--${string}`;

const cache = new Map<string, unknown>();

function read<T>(name: TokenName, parse: (raw: string) => T): T {
  if (cache.has(name)) return cache.get(name) as T;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parse(raw);
  cache.set(name, value);
  return value;
}

function toNumber(name: TokenName, raw: string): number {
  const number = parseFloat(raw);
  if (Number.isNaN(number)) throw new Error(`Token ${name} is not a number: "${raw}"`);
  return number;
}

/** A duration token such as --duration-base, in milliseconds. */
export function tokenMs(name: TokenName): number {
  return read(name, (raw) => {
    const number = toNumber(name, raw);
    // CSS allows both "200ms" and "0.2s".
    return raw.endsWith('ms') ? number : number * 1000;
  });
}

/** A duration token in seconds, which is the unit the motion library uses. */
export function tokenSeconds(name: TokenName): number {
  return tokenMs(name) / 1000;
}

/** A length token such as --space-2, in px. */
export function tokenPx(name: TokenName): number {
  return read(name, (raw) => toNumber(name, raw));
}

export type Bezier = [number, number, number, number];

/** An easing token written as cubic-bezier(a, b, c, d), as the four numbers. */
export function tokenBezier(name: TokenName): Bezier {
  return read(name, (raw) => {
    const numbers = raw.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    const [a, b, c, d] = numbers;
    if (a === undefined || b === undefined || c === undefined || d === undefined) {
      throw new Error(`Token ${name} is not a cubic-bezier: "${raw}"`);
    }
    return [a, b, c, d];
  });
}
