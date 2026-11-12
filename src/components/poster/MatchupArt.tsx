import type { ReactNode } from 'react';
import type { Sport, Team } from '../../data/types';
import { ART_HEIGHT, ART_WIDTH, artSvgProps } from './art';

interface MatchupArtProps {
  home: Team;
  away: Team;
  sport: Sport;
  /** Horizontal centre of the seam between the two colours. Defaults to the middle. */
  seam?: number;
}

/** How far the seam leans: its top is this far right of centre, its bottom this far left. */
const LEAN = 20;

/*
 * Sport: the two team colours split by a slanted seam, with the markings of
 * the playing surface drawn faintly on top. Home is on the left.
 */
export function MatchupArt({ home, away, sport, seam = ART_WIDTH / 2 }: MatchupArtProps) {
  const top = seam + LEAN;
  const bottom = seam - LEAN;

  return (
    <svg {...artSvgProps}>
      <polygon points={`0,0 ${top},0 ${bottom},${ART_HEIGHT} 0,${ART_HEIGHT}`} fill={home.primary} />
      <polygon
        points={`${top},0 ${ART_WIDTH},0 ${ART_WIDTH},${ART_HEIGHT} ${bottom},${ART_HEIGHT}`}
        fill={away.primary}
      />

      {/* A sash of each team's second colour, parallel to the seam. */}
      <polygon
        points={`${top - 30},0 ${top - 16},0 ${bottom - 16},${ART_HEIGHT} ${bottom - 30},${ART_HEIGHT}`}
        fill={home.secondary}
      />
      <polygon
        points={`${top + 16},0 ${top + 30},0 ${bottom + 30},${ART_HEIGHT} ${bottom + 16},${ART_HEIGHT}`}
        fill={away.secondary}
      />

      <g fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2">
        <rect x={8} y={8} width={ART_WIDTH - 16} height={ART_HEIGHT - 16} rx={4} />
        {sport === 'hoops' && <HoopsLines />}
        {sport === 'ice' && <IceLines />}
        {sport === 'football' && <FootballLines />}
      </g>
    </svg>
  );
}

/** Draws the children once, then again mirrored for the other end. */
function BothEnds({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform={`translate(${ART_WIDTH} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

function HoopsLines() {
  return (
    <BothEnds>
      <path d="M 8 36 H 52 A 72 72 0 0 1 52 180 H 8" />
      <rect x={8} y={82} width={58} height={52} />
    </BothEnds>
  );
}

function IceLines() {
  return (
    <BothEnds>
      <line x1={132} y1={8} x2={132} y2={ART_HEIGHT - 8} />
      <circle cx={76} cy={62} r={22} />
      <circle cx={76} cy={154} r={22} />
      <path d="M 26 92 A 16 16 0 0 1 26 124" />
    </BothEnds>
  );
}

function FootballLines() {
  return (
    <BothEnds>
      <rect x={8} y={48} width={66} height={120} />
      <rect x={8} y={80} width={26} height={56} />
      <path d="M 74 86 A 28 28 0 0 1 74 130" />
    </BothEnds>
  );
}
