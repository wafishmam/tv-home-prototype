import { ART_HEIGHT, ART_WIDTH, artSvgProps, between, createRandom, round, type ArtProps, type Random } from './art';

/*
 * Documentary: drawn like a field map.
 * Variants: 0 contour rings around a marked point, 1 layered strata lines.
 * Palette: background, line, accent, soft line.
 */
export function FieldArt({ palette, variant, seed }: ArtProps) {
  const random = createRandom(seed);
  const [background, line, accent, softLine] = palette;
  const colours = { random, line, accent, softLine };

  return (
    <svg {...artSvgProps}>
      <rect width={ART_WIDTH} height={ART_HEIGHT} fill={background} />
      {variant === 0 ? <Contours {...colours} /> : <Strata {...colours} />}
    </svg>
  );
}

interface LineProps {
  random: Random;
  line: string;
  accent: string;
  softLine: string;
}

function Contours({ random, line, accent, softLine }: LineProps) {
  const cx = between(random, 250, 310);
  const cy = between(random, 96, 136);
  const squash = between(random, 0.6, 0.82);
  const baseTilt = between(random, -30, 30);
  const twist = between(random, 3, 7);

  // Each ring is a little larger and a little more rotated than the last.
  const rings = Array.from({ length: 11 }, (_, index) => {
    const rx = 12 + index * 18;
    return {
      rx,
      ry: round(rx * squash),
      tilt: round(baseTilt + index * twist),
      // Every fourth ring is drawn heavier, like index contours on a map.
      major: index % 4 === 3,
    };
  });

  return (
    <g>
      {rings.map((ring, index) => (
        <ellipse
          key={index}
          cx={cx}
          cy={cy}
          rx={ring.rx}
          ry={ring.ry}
          transform={`rotate(${ring.tilt} ${cx} ${cy})`}
          fill="none"
          stroke={ring.major ? line : softLine}
          strokeWidth={ring.major ? 2 : 1.25}
        />
      ))}
      <circle cx={cx} cy={cy} r={5} fill={accent} />
    </g>
  );
}

function Strata({ random, line, accent, softLine }: LineProps) {
  const accentIndex = 2 + Math.floor(random() * 4);

  const layers = Array.from({ length: 9 }, (_, index) => {
    const baseY = 106 + index * 13;
    // Lower layers wander more than upper ones.
    const amplitude = 3 + index * 1.4;
    const steps = 8;
    let path = '';
    for (let step = 0; step <= steps; step++) {
      const x = round((step / steps) * ART_WIDTH);
      const y = between(random, baseY - amplitude, baseY + amplitude);
      if (step === 0) path = `M ${x} ${y}`;
      else if (step === 1) path += ` Q ${round(x / 2)} ${y} ${x} ${y}`;
      // "T" continues a smooth curve through each new point.
      else path += ` T ${x} ${y}`;
    }
    return path;
  });

  return (
    <g fill="none" strokeLinecap="round">
      {layers.map((path, index) => (
        <path
          key={index}
          d={path}
          stroke={index === accentIndex ? accent : index % 3 === 0 ? line : softLine}
          strokeWidth={index === accentIndex ? 3 : 1.5}
        />
      ))}
    </g>
  );
}
