import { ART_HEIGHT, ART_WIDTH, artSvgProps, between, createRandom, round, type ArtProps, type Random } from './art';

/*
 * Comedy: flat colour and bold cut-paper shapes.
 * Variants: 0 circles and a zigzag, 1 quarter-circle tiles, 2 ring and stripes.
 * Palette: background, shape A, shape B, line.
 */
export function PopArt({ palette, variant, seed }: ArtProps) {
  const random = createRandom(seed);
  const [background, shapeA, shapeB, line] = palette;
  const colours = { random, background, shapeA, shapeB, line };

  return (
    <svg {...artSvgProps}>
      <rect width={ART_WIDTH} height={ART_HEIGHT} fill={background} />
      {variant === 0 && <Circles {...colours} />}
      {variant === 1 && <Tiles {...colours} />}
      {variant === 2 && <RingAndStripes {...colours} />}
    </svg>
  );
}

interface ShapeProps {
  random: Random;
  background: string;
  shapeA: string;
  shapeB: string;
  line: string;
}

function Circles({ random, background, shapeA, shapeB, line }: ShapeProps) {
  const bigX = between(random, 286, 326);
  const bigY = between(random, 120, 160);
  const bigRadius = between(random, 78, 96);
  const halfX = between(random, 56, 84);
  const zigY = between(random, 34, 52);
  const zigzag = [0, 1, 2, 3, 4, 5, 6]
    .map((step) => `${176 + step * 20},${step % 2 === 0 ? zigY : zigY - 18}`)
    .join(' ');

  return (
    <g>
      <circle cx={bigX} cy={bigY} r={bigRadius} fill={shapeA} />
      {/* Centred on the top edge, so the frame crops it to a half circle. */}
      <circle cx={halfX} cy={0} r={66} fill={shapeB} />
      <polyline
        points={zigzag}
        fill="none"
        stroke={line}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={round(bigX - 30)} cy={round(bigY - 20)} r={10} fill={background} />
    </g>
  );
}

function Tiles({ random, shapeA, shapeB, line }: ShapeProps) {
  const size = 72;
  const fills = [shapeA, shapeB, line];
  const flipOffset = Math.floor(random() * 2);

  // A two by three grid of quarter circles down the right hand side.
  const tiles = [0, 1, 2, 3, 4, 5].map((index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = ART_WIDTH - size * (2 - column);
    const y = row * size;
    // Alternate which corner the quarter circle grows from.
    const flipped = (index + row + flipOffset) % 2 === 0;
    const path = flipped
      ? `M ${x + size} ${y + size} L ${x} ${y + size} A ${size} ${size} 0 0 1 ${x + size} ${y} Z`
      : `M ${x} ${y} L ${x + size} ${y} A ${size} ${size} 0 0 1 ${x} ${y + size} Z`;
    return { path, fill: fills[(index + row) % fills.length] ?? shapeA };
  });

  const dots = Array.from({ length: 18 }, (_, index) => ({
    x: 30 + (index % 6) * 16,
    y: 30 + Math.floor(index / 6) * 16,
  }));

  return (
    <g>
      {tiles.map((tile, index) => (
        <path key={index} d={tile.path} fill={tile.fill} />
      ))}
      {dots.map((dot, index) => (
        <circle key={index} cx={dot.x} cy={dot.y} r={3.5} fill={line} />
      ))}
    </g>
  );
}

function RingAndStripes({ random, shapeA, shapeB, line }: ShapeProps) {
  const ringX = between(random, 270, 300);
  const ringY = between(random, 86, 106);

  return (
    <g>
      <g transform="rotate(-18 96 60)">
        {[0, 1, 2, 3, 4].map((index) => (
          <rect key={index} x={20} y={22 + index * 16} width={150} height={8} rx={4} fill={shapeB} />
        ))}
      </g>
      <circle cx={ringX} cy={ringY} r={62} fill="none" stroke={shapeA} strokeWidth="30" />
      <circle cx={ringX} cy={ringY} r={17} fill={line} />
    </g>
  );
}
