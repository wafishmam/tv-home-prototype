import { useId } from 'react';
import { ART_HEIGHT, ART_WIDTH, artSvgProps, between, createRandom, round, type ArtProps, type Random } from './art';

/*
 * Drama: a sky, a sun and layered land.
 * Variants: 0 high sun over hills, 1 sun setting into water, 2 large low sun behind hills.
 * Palette: sky top, sky bottom, sun, land.
 */
export function HorizonArt({ palette, variant, seed }: ArtProps) {
  const id = useId();
  const random = createRandom(seed);
  const [skyTop, skyBottom, sun, land] = palette;

  const sky = (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="0.75" stopColor={skyBottom} />
        </linearGradient>
      </defs>
      <rect width={ART_WIDTH} height={ART_HEIGHT} fill={`url(#${id}-sky)`} />
    </>
  );

  if (variant === 1) {
    const horizon = between(random, 124, 140);
    const sunX = between(random, 210, 300);
    const sunRadius = between(random, 34, 46);
    return (
      <svg {...artSvgProps}>
        {sky}
        <circle cx={sunX} cy={horizon} r={sunRadius} fill={sun} />
        <path d={hillPath(random, horizon - 4, 5)} fill={land} opacity="0.55" />
        {/* Water covers the lower half of the sun, then reflections sit on top. */}
        <rect y={horizon} width={ART_WIDTH} height={ART_HEIGHT - horizon} fill={land} />
        {[0, 1, 2, 3, 4].map((index) => {
          const width = round(sunRadius * (1.7 - index * 0.3));
          return (
            <rect
              key={index}
              x={round(sunX - width / 2)}
              y={round(horizon + 10 + index * 14)}
              width={width}
              height={4}
              rx={2}
              fill={sun}
              opacity={round(0.8 - index * 0.13)}
            />
          );
        })}
      </svg>
    );
  }

  const lowSun = variant === 2;
  const sunX = between(random, 200, 300);
  const sunY = lowSun ? between(random, 112, 126) : between(random, 56, 84);
  const sunRadius = lowSun ? between(random, 58, 74) : between(random, 26, 38);

  return (
    <svg {...artSvgProps}>
      {sky}
      <circle cx={sunX} cy={sunY} r={sunRadius} fill={sun} />
      {/* Far hills are more transparent, which reads as distance. */}
      <path d={hillPath(random, 128, 16)} fill={land} opacity="0.4" />
      <path d={hillPath(random, 156, 18)} fill={land} opacity="0.7" />
      <path d={hillPath(random, 188, 14)} fill={land} />
    </svg>
  );
}

/** A smooth ridge line across the full width, closed along the bottom edge. */
function hillPath(random: Random, baseY: number, amplitude: number): string {
  const steps = 6;
  const points = Array.from({ length: steps + 1 }, (_, index) => ({
    x: round((index / steps) * ART_WIDTH),
    y: between(random, baseY - amplitude, baseY + amplitude),
  }));

  // Curve through the midpoints between neighbours, using each point as a
  // control point. This turns a jagged polyline into a smooth one.
  let path = '';
  let previous: { x: number; y: number } | undefined;
  for (const point of points) {
    if (!previous) {
      path = `M 0 ${ART_HEIGHT} L ${point.x} ${point.y}`;
    } else {
      const midX = round((previous.x + point.x) / 2);
      const midY = round((previous.y + point.y) / 2);
      path += ` Q ${previous.x} ${previous.y} ${midX} ${midY}`;
    }
    previous = point;
  }
  if (previous) path += ` L ${previous.x} ${previous.y}`;
  return `${path} L ${ART_WIDTH} ${ART_HEIGHT} Z`;
}
