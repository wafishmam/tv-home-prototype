/*
 * The focus model. Pure data and pure functions, no React and no DOM.
 *
 * The screen is a vertical list of rows. Each row is a horizontal list of
 * items. Focus is "which row, and which item in it". That is all the spatial
 * navigation there is: left and right change the item, up and down change
 * the row.
 */

export type Direction = 'left' | 'right' | 'up' | 'down';

/** Everything an input device can ask for. Keys and the touch pad both produce these. */
export type NavAction = Direction | 'select' | 'back';

export interface Row {
  id: string;
  /** How many items the row holds. */
  length: number;
  /**
   * True for rows that are not part of the scrolling stack, such as the top
   * bar. Focusing a fixed row leaves the camera where it is.
   */
  fixed?: boolean;
}

export interface FocusState {
  /** The row that has focus. */
  rowId: string;

  /**
   * The focused item in every row. Rows that do not have focus keep their
   * entry, which is how a rail remembers its last focused card.
   */
  indexByRow: Readonly<Record<string, number>>;

  /**
   * The "camera": which row the screen is scrolled to, and which item each
   * row is scrolled to. Keys move the camera along with focus. The pointer
   * moves focus only, so cards never slide out from under the cursor.
   */
  anchorRowId: string;
  anchorByRow: Readonly<Record<string, number>>;
}

export function createInitialState(rows: readonly Row[], initialRowId?: string): FocusState {
  const first = rows.find((row) => row.id === initialRowId) ?? rows[0];
  if (!first) throw new Error('Focus navigation needs at least one row.');

  const zeros = Object.fromEntries(rows.map((row) => [row.id, 0]));
  return { rowId: first.id, indexByRow: zeros, anchorRowId: first.id, anchorByRow: zeros };
}

/** Focus an item and bring the camera to it. Used for every key press. */
function focusAndAnchor(state: FocusState, row: Row, index: number): FocusState {
  const rowId = row.id;
  // A fixed row takes focus but does not move the camera.
  if (row.fixed) return focusAt(state, rowId, index);

  const unchanged =
    state.rowId === rowId &&
    state.indexByRow[rowId] === index &&
    state.anchorRowId === rowId &&
    state.anchorByRow[rowId] === index;
  // Returning the same object tells the store that nothing happened.
  if (unchanged) return state;

  return {
    rowId,
    indexByRow: { ...state.indexByRow, [rowId]: index },
    anchorRowId: rowId,
    anchorByRow: { ...state.anchorByRow, [rowId]: index },
  };
}

/** Arrow keys. */
export function moveFocus(state: FocusState, rows: readonly Row[], direction: Direction): FocusState {
  const rowPosition = rows.findIndex((row) => row.id === state.rowId);
  const row = rows[rowPosition];
  if (!row) return state;

  const index = state.indexByRow[row.id] ?? 0;

  switch (direction) {
    case 'left':
      return focusAndAnchor(state, row, Math.max(0, index - 1));
    case 'right':
      return focusAndAnchor(state, row, Math.min(row.length - 1, index + 1));
    case 'up':
    case 'down': {
      const target = rows[rowPosition + (direction === 'up' ? -1 : 1)];
      // At the first or last row there is nowhere to go.
      if (!target) return state;
      // Land on the item this row had focused last time (rail memory).
      return focusAndAnchor(state, target, state.indexByRow[target.id] ?? 0);
    }
  }
}

/**
 * Escape or Backspace when nothing is open: go back to the start of the
 * rail, and from there back to the first rail.
 */
export function goBack(state: FocusState, rows: readonly Row[]): FocusState {
  const row = rows.find((each) => each.id === state.rowId);
  const index = state.indexByRow[state.rowId] ?? 0;
  if (row && index > 0) return focusAndAnchor(state, row, 0);

  // The first row of content, skipping fixed rows like the top bar.
  const first = rows.find((each) => !each.fixed);
  if (!first) return state;
  return focusAndAnchor(state, first, state.indexByRow[first.id] ?? 0);
}

/** Pointer hover or click: move focus, leave the camera where it is. */
export function focusAt(state: FocusState, rowId: string, index: number): FocusState {
  if (state.rowId === rowId && state.indexByRow[rowId] === index) return state;
  return { ...state, rowId, indexByRow: { ...state.indexByRow, [rowId]: index } };
}

// ---- A minimal store --------------------------------------------------------
// Holds one value and tells subscribers when it is replaced. React components
// read it with useSyncExternalStore (see useFocusable.ts), which lets each
// card re-render only when its own answer changes, not on every focus move.

export interface Store<T> {
  get(): T;
  set(next: T): void;
  subscribe(listener: () => void): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
