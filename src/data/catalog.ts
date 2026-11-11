import { games } from './games';
import type { ArtStyle, Palette, PosterSpec, Progress, RailData, TitleItem } from './types';

/*
 * Fictional titles and the four rails of the home screen.
 *
 * Palette slots by art style:
 *   orbit    space, glow, light, shade
 *   noir     shadow, wall, light, haze
 *   horizon  sky top, sky bottom, sun, land
 *   pop      background, shape A, shape B, line
 *   field    background, line, accent, soft line
 */

const poster = (style: ArtStyle, variant: number, palette: Palette, ink: string): PosterSpec => ({
  style,
  variant,
  palette,
  ink,
});

interface TitleInput {
  id: string;
  title: string;
  year: number;
  rating: string;
  length: string;
  synopsis: string;
  poster: PosterSpec;
  progress?: Progress;
}

const titlesOf = (genre: string, inputs: readonly TitleInput[]): TitleItem[] =>
  inputs.map((input) => ({ kind: 'title', genre, ...input }));

const scienceFiction = titlesOf('Science fiction', [
  {
    id: 'quiet-meridian',
    title: 'The Quiet Meridian',
    year: 2024,
    rating: '12+',
    length: '2 seasons',
    synopsis:
      'A survey crew maps a planet whose day lasts eleven years, and finds that something has been keeping time for them.',
    poster: poster('orbit', 0, ['#070b1a', '#1b2a5c', '#f2b279', '#c2543d'], '#f6e7d6'),
  },
  {
    id: 'vantage-seven',
    title: 'Vantage Seven',
    year: 2023,
    rating: '16+',
    length: '1h 58m',
    synopsis:
      'The last operator of a listening post hears a distress call sent in her own voice, dated next week.',
    poster: poster('orbit', 1, ['#0a0614', '#3a1d5e', '#8fd3ff', '#3c6fd8'], '#e6f4ff'),
  },
  {
    id: 'sable-station',
    title: 'Sable Station',
    year: 2025,
    rating: '12+',
    length: '1 season',
    synopsis:
      'Six strangers win a lottery to crew a retired orbital hotel. None of them entered it.',
    poster: poster('orbit', 2, ['#050a0a', '#0f3b3a', '#d7f2e3', '#4fb39a'], '#e4f6ee'),
  },
  {
    id: 'lanterns-of-io',
    title: 'Lanterns of Io',
    year: 2022,
    rating: '12+',
    length: '3 seasons',
    synopsis:
      'Miners on a volcanic moon light lanterns for the ships that never came home. One night a lantern answers.',
    poster: poster('orbit', 0, ['#140805', '#5a1f0c', '#ffd27a', '#ff7a3c'], '#ffeccc'),
  },
  {
    id: 'perihelion-club',
    title: 'Perihelion Club',
    year: 2021,
    rating: '16+',
    length: '1h 44m',
    synopsis:
      'Every 76 years a comet returns, and so does an invitation to a dinner party nobody remembers leaving.',
    poster: poster('orbit', 2, ['#0b0b10', '#2a2a3a', '#f4ecdf', '#9a94a8'], '#f4ecdf'),
  },
  {
    id: 'glass-tide',
    title: 'The Glass Tide',
    year: 2025,
    rating: '12+',
    length: '1 season',
    synopsis:
      'An ocean world freezes from the top down. A family of divers races the ice to reach the only warm vent left.',
    poster: poster('orbit', 1, ['#04101c', '#0d3a66', '#a6f0ff', '#2aa6c9'], '#dff8ff'),
  },
  {
    id: 'thirteen-suns',
    title: 'Thirteen Suns',
    year: 2020,
    rating: '12+',
    length: '4 seasons',
    synopsis:
      'A generation ship built for twelve stops receives coordinates for one more. The captain keeps it to herself.',
    poster: poster('orbit', 2, ['#120a02', '#4d3208', '#ffe9a8', '#e0a021'], '#fff3cf'),
  },
  {
    id: 'low-orbit-lullaby',
    title: 'Low Orbit Lullaby',
    year: 2024,
    rating: 'All ages',
    length: '1h 32m',
    synopsis:
      'A night-shift satellite repairer sings to her daughter over the radio, and half the planet starts tuning in.',
    poster: poster('orbit', 0, ['#10061a', '#4a1650', '#ffb3d1', '#d14b8f'], '#ffe3ee'),
  },
]);

const crime = titlesOf('Crime', [
  {
    id: 'saltmarsh',
    title: 'Saltmarsh',
    year: 2023,
    rating: '16+',
    length: '2 seasons',
    synopsis:
      'A tide-table error puts a body where no body should be, and a coastguard clerk becomes the only reliable witness.',
    poster: poster('noir', 0, ['#0c1012', '#23343a', '#d9e4e2', '#8fa6a3'], '#eef3f2'),
  },
  {
    id: 'ledger-man',
    title: 'The Ledger Man',
    year: 2022,
    rating: '16+',
    length: '1h 52m',
    synopsis:
      'An accountant for a quiet family firm finds a second set of books, and a third set written about him.',
    poster: poster('noir', 1, ['#100c08', '#3a2a12', '#f2c14e', '#a97f2a'], '#fff3d6'),
  },
  {
    id: 'nine-cold-mornings',
    title: 'Nine Cold Mornings',
    year: 2024,
    rating: '16+',
    length: '1 season',
    synopsis:
      'Nine days, nine anonymous letters, one detective a week from retirement who recognises the handwriting.',
    poster: poster('noir', 2, ['#080c14', '#18243d', '#9cc4ff', '#5d7fb8'], '#eaf2ff'),
  },
  {
    id: 'greywater-lane',
    title: 'Greywater Lane',
    year: 2021,
    rating: '12+',
    length: '3 seasons',
    synopsis:
      'Everyone on the street saw the removal van. Nobody can agree on which house it stopped at.',
    poster: poster('noir', 1, ['#0d0d0d', '#2a2a2a', '#e8e8e8', '#8c8c8c'], '#ffffff'),
  },
  {
    id: 'quiet-arrangement',
    title: 'A Quiet Arrangement',
    year: 2025,
    rating: '18+',
    length: '1 season',
    synopsis:
      'Two rival solicitors agree to lose one case each. Then a client turns up who needs them both to win.',
    poster: poster('noir', 0, ['#120708', '#3a1114', '#e8493f', '#8f2a26'], '#ffe9e6'),
  },
  {
    id: 'cartwright-file',
    title: 'The Cartwright File',
    year: 2020,
    rating: '16+',
    length: '2h 04m',
    synopsis:
      'A records officer is told to shred one folder. She reads it first, which is where her trouble starts.',
    poster: poster('noir', 2, ['#0b100b', '#1f2e16', '#b8e06a', '#6f8f3a'], '#f1f8e4'),
  },
  {
    id: 'dead-reckoner',
    title: 'Dead Reckoner',
    year: 2023,
    rating: '16+',
    length: '2 seasons',
    synopsis:
      'A harbour pilot who navigates without instruments is asked to find a ship that every instrument says is not there.',
    poster: poster('noir', 1, ['#0a0a12', '#221d3d', '#c9b8ff', '#7a6cb8'], '#f1ecff'),
  },
  {
    id: 'lowlight',
    title: 'Lowlight',
    year: 2024,
    rating: '16+',
    length: '1h 47m',
    synopsis:
      'A crime scene photographer notices the same stranger in the background of four unrelated cases.',
    poster: poster('noir', 0, ['#110d06', '#3d2408', '#ff9f43', '#a8621f'], '#fff0dc'),
  },
]);

const continueWatching: TitleItem[] = [
  ...titlesOf('Comedy', [
    {
      id: 'second-helpings',
      title: 'Second Helpings',
      year: 2024,
      rating: '12+',
      length: '2 seasons',
      synopsis:
        'A failed restaurant critic inherits the worst-reviewed cafe in town, including the review she wrote.',
      poster: poster('pop', 0, ['#ffd23f', '#ff6f91', '#2b59c3', '#1a1423'], '#1a1423'),
      progress: { fraction: 0.62, label: 'S2 E4 · 18 min left' },
    },
  ]),
  ...titlesOf('Drama', [
    {
      id: 'orchard-years',
      title: 'The Orchard Years',
      year: 2022,
      rating: '12+',
      length: '1 season',
      synopsis:
        'Three siblings return to sell the family orchard and find their mother has already promised it to the trees.',
      poster: poster('horizon', 0, ['#f6c89f', '#e98a6b', '#fff1d0', '#3b2a3f'], '#3b2a3f'),
      progress: { fraction: 0.35, label: 'S1 E7 · 34 min left' },
    },
  ]),
  ...titlesOf('Documentary', [
    {
      id: 'tidewrack',
      title: 'Tidewrack',
      year: 2025,
      rating: 'All ages',
      length: '1h 32m',
      synopsis:
        'A year on one mile of shoreline, told through everything the sea leaves behind and everyone who comes to collect it.',
      poster: poster('field', 0, ['#12303a', '#7fc8c0', '#f2b84b', '#3f6f74'], '#eaf6f4'),
      progress: { fraction: 0.8, label: '19 min left' },
    },
  ]),
  ...titlesOf('Comedy', [
    {
      id: 'night-shift-lido',
      title: 'Night Shift at the Lido',
      year: 2023,
      rating: '12+',
      length: '1 season',
      synopsis:
        'The overnight staff of an outdoor pool run a thriving social club for people who cannot sleep.',
      poster: poster('pop', 1, ['#1fb5a8', '#ffe066', '#f25c54', '#10231f'], '#10231f'),
      progress: { fraction: 0.15, label: 'S1 E2 · 22 min left' },
    },
  ]),
  ...titlesOf('Drama', [
    {
      id: 'marrow-and-vine',
      title: 'Marrow & Vine',
      year: 2021,
      rating: '16+',
      length: '3 seasons',
      synopsis:
        'Two families have shared one allotment fence for forty years. A property survey says the fence is in the wrong place.',
      poster: poster('horizon', 2, ['#2b2350', '#c7607a', '#ffd9a0', '#141026'], '#ffe9cf'),
      progress: { fraction: 0.5, label: 'S3 E1 · 27 min left' },
    },
  ]),
  ...titlesOf('Documentary', [
    {
      id: 'long-thaw',
      title: 'The Long Thaw',
      year: 2024,
      rating: 'All ages',
      length: '1h 48m',
      synopsis:
        'Glaciologists and reindeer herders compare notes on a valley that both groups have measured for generations.',
      poster: poster('field', 1, ['#e9e4d8', '#8a9a8f', '#c4572f', '#b9c2b6'], '#22302b'),
      progress: { fraction: 0.9, label: '11 min left' },
    },
  ]),
];

export const rails: readonly RailData[] = [
  { id: 'live', title: 'Live now', items: games },
  { id: 'continue', title: 'Continue watching', items: continueWatching },
  { id: 'science-fiction', title: 'Science fiction', items: scienceFiction },
  { id: 'crime', title: 'Crime and mystery', items: crime },
];
