import { rails } from '../data/catalog';
import type { Row } from '../navigation/focusStore';

/** The focus row that holds the spoiler free toggle. */
export const TOPBAR_ROW = 'topbar';

// The focus rows of the home screen, top to bottom: the top bar (one item,
// the spoiler free toggle), then one row per rail.
export const homeRows: readonly Row[] = [
  { id: TOPBAR_ROW, length: 1, fixed: true },
  ...rails.map((rail) => ({ id: rail.id, length: rail.items.length })),
];

// Focus starts on the first rail, not on the top bar.
export const homeInitialRowId = rails[0]?.id;
