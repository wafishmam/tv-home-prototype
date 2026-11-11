import { useId } from 'react';
import { ART_HEIGHT, ART_WIDTH, artSvgProps, between, createRandom, round, type ArtProps, type Random } from './art';

/*
 * Crime: a dark room and one hard source of light.
 * Variants: 0 light through blinds, 1 figure in a doorway, 2 street lamp in rain.
 * Palette: shadow, wall, light, haze.
 */
export function NoirArt({ palette, variant, seed }: ArtProps) {
  const id = useId();
  const random = createRandom(seed);
  const [shadow, wall, light, haze] = palette;

  return (
    <svg {...artSvgProps}>
      <defs>
        <linearGradient id={`${id}-room`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shadow} />
          <stop offset="1" stopColor={wall} />
        </linearGradient>
      </defs>
      <rect width={ART_WIDTH} height={ART_HEIGHT} fill={`url(#${id}-room)`} />

      {variant === 0 && <Blinds random={random} shadow={shadow} light={light} />}
      {variant === 1 && <Doorway random={random} shadow={shadow} light={light} />}
      {variant === 2 && <StreetLamp random={random} light={light} haze={haze} />}
    </svg>
  );
}

interface SceneProps {
  random: Random;
  light: string;
}

function Blinds({ random, shadow, light }: SceneProps & { shadow: string }) {
  // Kept to the right so the leaning slab never reaches the title on the left.
  const left = between(random, 286, 312);
  const skew = between(random, -20, -12);
  const pitch = between(random, 22, 28);
  const slatCount = Math.ceil((ART_HEIGHT + 40) / pitch);

  return (
    // A slab of light, skewed so it leans, with dark slats laid across it.
    <g transform={`skewX(${skew})`}>
      <rect x={left} y={-20} width={170} height={ART_HEIGHT + 40} fill={light} />
      {Array.from({ length: slatCount }, (_, index) => (
        <rect
          key={index}
          x={left - 10}
          y={round(-20 + index * pitch)}
          width={190}
          height={round(pitch * 0.42)}
          fill={shadow}
        />
      ))}
    </g>
  );
}

function Doorway({ random, shadow, light }: SceneProps & { shadow: string }) {
  const doorX = between(random, 246, 286);
  const doorWidth = 58;
  const doorTop = 34;
  const floorY = 158;
  const centre = doorX + doorWidth / 2;

  return (
    <g>
      {/* Light spilling across the floor toward the viewer. */}
      <polygon
        points={`${doorX},${floorY} ${doorX + doorWidth},${floorY} ${doorX + 24},${ART_HEIGHT} ${doorX - 150},${ART_HEIGHT}`}
        fill={light}
        opacity="0.5"
      />
      <rect x={doorX} y={doorTop} width={doorWidth} height={floorY - doorTop} fill={light} />
      {/* The figure and the long shadow it throws. */}
      <circle cx={centre} cy={86} r={9} fill={shadow} />
      <rect x={centre - 12} y={97} width={24} height={floorY - 97} rx={6} fill={shadow} />
      <polygon
        points={`${centre - 12},${floorY} ${centre + 12},${floorY} ${centre - 54},${ART_HEIGHT} ${centre - 104},${ART_HEIGHT}`}
        fill={shadow}
        opacity="0.85"
      />
    </g>
  );
}

function StreetLamp({ random, light, haze }: SceneProps & { haze: string }) {
  const postX = between(random, 268, 318);
  const lampX = postX - 34;
  const lampY = 44;

  const rain = Array.from({ length: 22 }, () => {
    const x = between(random, 0, ART_WIDTH);
    const y = between(random, 0, ART_HEIGHT);
    const length = between(random, 10, 22);
    return { x, y, x2: round(x - length * 0.35), y2: round(y + length) };
  });

  return (
    <g>
      {/* Two overlapping cones give the light a brighter core. */}
      <polygon
        points={`${lampX},${lampY} ${lampX - 110},${ART_HEIGHT} ${lampX + 110},${ART_HEIGHT}`}
        fill={light}
        opacity="0.16"
      />
      <polygon
        points={`${lampX},${lampY} ${lampX - 56},${ART_HEIGHT} ${lampX + 56},${ART_HEIGHT}`}
        fill={light}
        opacity="0.2"
      />
      <rect x={postX} y={lampY - 6} width={4} height={ART_HEIGHT} fill={haze} />
      <rect x={lampX} y={lampY - 6} width={postX - lampX} height={4} fill={haze} />
      <circle cx={lampX} cy={lampY} r={7} fill={light} />
      {rain.map((drop, index) => (
        <line
          key={index}
          x1={drop.x}
          y1={drop.y}
          x2={drop.x2}
          y2={drop.y2}
          stroke={haze}
          strokeWidth="1.5"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}
