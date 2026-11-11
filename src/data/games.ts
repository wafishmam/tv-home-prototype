import type { GameItem, League, Team } from './types';

/*
 * Fictional leagues, teams and fixtures for the "Live now" rail.
 * Three sports, because they keep time and score very differently, which is
 * what makes hiding the score an interesting problem.
 */

const meridian: League = { id: 'meridian', name: 'Meridian League', sport: 'hoops' };
const northernIce: League = { id: 'northern-ice', name: 'Northern Ice Circuit', sport: 'ice' };
const lowland: League = { id: 'lowland', name: 'Lowland Football Union', sport: 'football' };

const team = (
  id: string,
  name: string,
  abbr: string,
  primary: string,
  secondary: string,
  ink: string,
): Team => ({ id, name, abbr, primary, secondary, ink });

const kites = team('kites', 'Harbor City Kites', 'HCK', '#1d4e89', '#f2c14e', '#ffffff');
const foundry = team('foundry', 'Ironvale Foundry', 'IRV', '#4a5560', '#f28c28', '#ffffff');
const herons = team('herons', 'Port Alder Herons', 'PAH', '#0f6e63', '#d7f2e3', '#ffffff');
const lanterns = team('lanterns', 'Saltgate Lanterns', 'SGL', '#f0b429', '#3b2a12', '#221703');

const owls = team('owls', 'Coldwater Owls', 'CWO', '#3a2d6b', '#c9b8ff', '#ffffff');
const lynx = team('lynx', 'Pinefall Lynx', 'PFL', '#2f5d3a', '#e8d9a8', '#ffffff');
const auks = team('auks', 'Frostmere Auks', 'FMA', '#dfe9f2', '#1b3554', '#10233a');
const elk = team('elk', 'Tarn Valley Elk', 'TVE', '#6b2d3e', '#e0b08a', '#ffffff');

const wrenfield = team('wrenfield', 'Wrenfield Athletic', 'WRE', '#a3195b', '#ffffff', '#ffffff');
const dunmoor = team('dunmoor', 'Dunmoor Rovers', 'DUN', '#16213e', '#7ad7f0', '#ffffff');
const estermouth = team('estermouth', 'Estermouth United', 'EST', '#1c1c1c', '#f4ecdf', '#ffffff');
const kestrel = team('kestrel', 'Kestrel Vale', 'KVL', '#7ab8e8', '#ffffff', '#0d2238');

export const games: readonly GameItem[] = [
  {
    kind: 'game',
    id: 'kites-foundry',
    league: meridian,
    home: kites,
    away: foundry,
    venue: 'Breakwater Arena',
    synopsis:
      'First against second in the Meridian League. The Kites have not lost at home since the autumn.',
  },
  {
    kind: 'game',
    id: 'owls-lynx',
    league: northernIce,
    home: owls,
    away: lynx,
    venue: 'Coldwater Icehouse',
    synopsis:
      'A northern rivalry that tends to stay close into the third period. Both goaltenders are in form.',
  },
  {
    kind: 'game',
    id: 'wrenfield-dunmoor',
    league: lowland,
    home: wrenfield,
    away: dunmoor,
    venue: 'The Aviary',
    synopsis:
      'Wrenfield need a result to stay in the top half. Dunmoor arrive unbeaten in six on the road.',
  },
  {
    kind: 'game',
    id: 'herons-lanterns',
    league: meridian,
    home: herons,
    away: lanterns,
    venue: 'Alder Pavilion',
    synopsis:
      'Two of the fastest teams in the league. Expect a quick pace and very little time on the clock wasted.',
  },
  {
    kind: 'game',
    id: 'auks-elk',
    league: northernIce,
    home: auks,
    away: elk,
    venue: 'Frostmere Gardens',
    synopsis:
      'The Auks return from a long road trip to face an Elk side fighting for the last playoff place.',
  },
  {
    kind: 'game',
    id: 'estermouth-kestrel',
    league: lowland,
    home: estermouth,
    away: kestrel,
    venue: 'Quayside Park',
    synopsis:
      'A coastal derby under the lights. The last three meetings were each decided by a single goal.',
  },
];
