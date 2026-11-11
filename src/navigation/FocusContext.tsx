import { createContext, useContext, useEffect, useState, type ReactNode, type RefObject } from 'react';
import { tokenMs } from '../styles/tokens';
import {
  createInitialState,
  createStore,
  focusAt,
  goBack,
  moveFocus,
  type FocusState,
  type NavAction,
  type Row,
  type Store,
} from './focusStore';

/*
 * The navigation context. It owns the focus store and turns input (keys,
 * pointer, and later the touch pad) into changes to that store.
 *
 * Components do not read focus from this context directly. They subscribe
 * to the store through the hooks in useFocusable.ts.
 */

/** What a focusable item tells the navigation about itself. */
export interface Registration {
  element: RefObject<HTMLElement | null>;
  onSelect: RefObject<(() => void) | undefined>;
}

export interface Navigation {
  rows: readonly Row[];
  store: Store<FocusState>;

  /** The single entry point for input. Keys and the touch pad both call this. */
  dispatch(action: NavAction): void;

  /** Mouse support. x and y are the pointer position, used to ignore fake moves. */
  pointerFocus(rowId: string, index: number, x: number, y: number): void;
  pointerSelect(rowId: string, index: number): void;

  /** Called by each focusable item so Enter can find its element and handler. */
  register(rowId: string, index: number, registration: Registration): () => void;

  /**
   * Lets something modal (a panel) take over input. While a capture is
   * active, actions go to it instead of moving focus. Returns a release function.
   */
  capture(handler: (action: NavAction) => void): () => void;
}

const itemKey = (rowId: string, index: number) => `${rowId}:${index}`;

function createNavigation(rows: readonly Row[]): Navigation {
  const store = createStore(createInitialState(rows));
  const registrations = new Map<string, Registration>();
  const captures: Array<(action: NavAction) => void> = [];
  const lastPointer = { x: -1, y: -1 };

  /** Runs the focused item's select handler, with a short press animation. */
  function select(rowId: string, index: number) {
    const registration = registrations.get(itemKey(rowId, index));
    if (!registration) return;

    // The dip is a data attribute plus a CSS transition (see Focusable.css).
    const element = registration.element.current;
    if (element) {
      element.dataset.pressed = 'true';
      window.setTimeout(() => delete element.dataset.pressed, tokenMs('--duration-instant'));
    }

    registration.onSelect.current?.();
  }

  return {
    rows,
    store,

    dispatch(action) {
      // A modal on top gets the action instead of the grid.
      const captured = captures[captures.length - 1];
      if (captured) {
        captured(action);
        return;
      }

      const state = store.get();
      if (action === 'select') {
        select(state.rowId, state.indexByRow[state.rowId] ?? 0);
      } else if (action === 'back') {
        store.set(goBack(state, rows));
      } else {
        store.set(moveFocus(state, rows, action));
      }
    },

    pointerFocus(rowId, index, x, y) {
      // Browsers fire pointer events when content moves under a still cursor.
      // Only a real change of position should move focus.
      if (x === lastPointer.x && y === lastPointer.y) return;
      lastPointer.x = x;
      lastPointer.y = y;

      if (captures.length > 0) return;
      store.set(focusAt(store.get(), rowId, index));
    },

    pointerSelect(rowId, index) {
      if (captures.length > 0) return;
      store.set(focusAt(store.get(), rowId, index));
      select(rowId, index);
    },

    register(rowId, index, registration) {
      const key = itemKey(rowId, index);
      registrations.set(key, registration);
      return () => {
        // Only remove our own entry: a newer item may have taken the slot.
        if (registrations.get(key) === registration) registrations.delete(key);
      };
    },

    capture(handler) {
      captures.push(handler);
      return () => {
        const position = captures.indexOf(handler);
        if (position !== -1) captures.splice(position, 1);
      };
    },
  };
}

const KEY_ACTIONS: Readonly<Record<string, NavAction>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  Enter: 'select',
  ' ': 'select',
  Escape: 'back',
  Backspace: 'back',
};

const FocusContext = createContext<Navigation | null>(null);

interface FocusProviderProps {
  /** The rows of the screen, top to bottom. */
  rows: readonly Row[];
  children: ReactNode;
}

export function FocusProvider({ rows, children }: FocusProviderProps) {
  // Created once. The navigation object is stable, so providing it through
  // context never causes a re-render.
  const [navigation] = useState(() => createNavigation(rows));

  useEffect(() => {
    let lastRepeat = 0;

    function onKeyDown(event: KeyboardEvent) {
      // Leave browser shortcuts such as Alt+Left alone.
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const action = KEY_ACTIONS[event.key];
      if (!action) return;
      // Stops the page scrolling and stops Enter "clicking" the focused element.
      event.preventDefault();

      if (event.repeat) {
        // Holding Enter or Escape should not fire again and again.
        if (action === 'select' || action === 'back') return;
        // A held arrow repeats about 30 times a second, which is too fast to
        // follow. Slow it to a steady pace. Fresh presses are never delayed.
        const now = performance.now();
        if (now - lastRepeat < tokenMs('--nav-repeat-interval')) return;
        lastRepeat = now;
      }

      navigation.dispatch(action);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigation]);

  return <FocusContext value={navigation}>{children}</FocusContext>;
}

export function useNavigation(): Navigation {
  const navigation = useContext(FocusContext);
  if (!navigation) throw new Error('useNavigation must be used inside a FocusProvider.');
  return navigation;
}
