import { useId } from 'react';
import { ART_HEIGHT, ART_WIDTH, artSvgProps, between, createRandom, round, type ArtProps, type Random } from './art';

/*
 * Science fiction: deep space with one celestial subject on the right.
 * Variants: 0 ringed planet, 1 eclipse, 2 orbit diagram.
 * Palette: space, glow, light, shade.
 */
export function OrbitArt({ palette, variant, seed }: ArtProps) {
  const id = useId();
  const random = createRandom(seed);
  const [space, glow, light, shade] = palette;

  const stars = Array.from({ length: 26 }, () => ({
    x: between(random, 0, ART_WIDTH),
    y: between(random, 0, ART_HEIGHT),
    r: between(random, 0.5, 1.5),
    opacity: between(random, 0.3, 0.9),
  }));

  // The subject sits right of centre so the title has the lower left to itself.
  const cx = between(random, 250, 310);
  const cy = between(random, 64, 104);
  const radius = between(random, 50, 72);

  return (
    <svg {...artSvgProps}>
      <defs>
        <radialGradient id={`${id}-sky`} cx={cx / ART_WIDTH} cy={cy / ART_HEIGHT} r="0.85">
          <stop offset="0" stopColor={glow} />
          <stop offset="1" stopColor={space} />
        </radialGradient>
        <linearGradient id={`${id}-body`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>

      <rect width={ART_WIDTH} height={ART_HEIGHT} fill={`url(#${id}-sky)`} />
      {stars.map((star, index) => (
        <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={light} opacity={star.opacity} />
      ))}

      {variant === 0 && (
        <RingedPlanet cx={cx} cy={cy} radius={radius} random={random} light={light} bodyFill={`url(#${id}-body)`} />
      )}
      {variant === 1 && <Eclipse cx={cx} cy={cy} radius={radius} light={light} space={space} />}
      {variant === 2 && (
        <OrbitDiagram cx={cx} cy={cy} radius={radius} random={random} light={light} shade={shade} />
      )}
    </svg>
  );
}

interface SubjectProps {
  cx: number;
  cy: number;
  radius: number;
  light: string;
}

function RingedPlanet({ cx, cy, radius, random, light, bodyFill }: SubjectProps & { random: Random; bodyFill: string }) {
  const ringX = round(radius * between(random, 1.6, 1.9));
  const ringY = round(ringX * between(random, 0.16, 0.26));
  // A clockwise tilt lifts the left end of the ring, away from the title.
  const tilt = between(random, 10, 26);
  const innerX = round(ringX * 0.82);
  const innerY = round(ringY * 0.82);

  // The ring is drawn in two halves so the planet can sit between them:
  // the full ellipse goes behind, then the lower arc is redrawn in front.
  const frontArc = (rx: number, ry: number) =>
    `M ${round(cx - rx)} ${cy} A ${rx} ${ry} 0 0 0 ${round(cx + rx)} ${cy}`;

  return (
    <g>
      <g transform={`rotate(${tilt} ${cx} ${cy})`} fill="none" stroke={light}>
        <ellipse cx={cx} cy={cy} rx={ringX} ry={ringY} strokeWidth="3" strokeOpacity="0.5" />
        <ellipse cx={cx} cy={cy} rx={innerX} ry={innerY} strokeWidth="1.5" strokeOpacity="0.4" />
      </g>
      <circle cx={cx} cy={cy} r={radius} fill={bodyFill} />
      <g transform={`rotate(${tilt} ${cx} ${cy})`} fill="none" stroke={light} strokeLinecap="round">
        <path d={frontArc(ringX, ringY)} strokeWidth="3" />
        <path d={frontArc(innerX, innerY)} strokeWidth="1.5" strokeOpacity="0.8" />
      </g>
    </g>
  );
}

function Eclipse({ cx, cy, radius, light, space }: SubjectProps & { space: string }) {
  return (
    <g>
      {/* Two soft halos, then a bright disc mostly covered by a dark one. */}
      <circle cx={cx} cy={cy} r={round(radius * 2)} fill={light} opacity="0.08" />
      <circle cx={cx} cy={cy} r={round(radius * 1.4)} fill={light} opacity="0.14" />
      <circle cx={cx} cy={cy} r={radius} fill={light} />
      <circle cx={round(cx - radius * 0.2)} cy={round(cy + radius * 0.12)} r={round(radius * 0.97)} fill={space} />
    </g>
  );
}

function OrbitDiagram({ cx, cy, radius, random, light, shade }: SubjectProps & { random: Random; shade: string }) {
  const orbits = [0.55, 0.95, 1.4, 1.9, 2.5].map((factor) => {
    const orbitRadius = round(radius * factor);
    const angle = random() * Math.PI * 2;
    return {
      orbitRadius,
      planetX: round(cx + Math.cos(angle) * orbitRadius),
      planetY: round(cy + Math.sin(angle) * orbitRadius),
      planetRadius: between(random, 3, 7),
    };
  });

  return (
    <g>
      {orbits.map((orbit, index) => (
        <circle
          key={`orbit-${index}`}
          cx={cx}
          cy={cy}
          r={orbit.orbitRadius}
          fill="none"
          stroke={shade}
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
      ))}
      <circle cx={cx} cy={cy} r={round(radius * 0.24)} fill={light} />
      {orbits.map((orbit, index) => (
        <circle
          key={`planet-${index}`}
          cx={orbit.planetX}
          cy={orbit.planetY}
          r={orbit.planetRadius}
          fill={index % 2 === 0 ? light : shade}
        />
      ))}
    </g>
  );
}
