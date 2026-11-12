import { useEffect, useState } from 'react';
import { tokenMs } from '../styles/tokens';
import { useNavigation } from './FocusContext';
import type { FocusState } from './focusStore';

export interface FocusPosition {
  rowId: string;
  index: number;
}

const positionOf = (state: FocusState): FocusPosition => ({
  rowId: state.rowId,
  index: state.indexByRow[state.rowId] ?? 0,
});

/**
 * The focused position, but only once focus has rested there for a moment.
 *
 * This is a debounce on the focus store. Every focus change restarts a
 * timer, and the value updates only when the timer is allowed to finish.
 * While the user is moving quickly nothing is returned and, importantly,
 * the component using this hook does not re-render at all.
 */
export function useSettledFocus(): FocusPosition {
  const { store } = useNavigation();
  const [settled, setSettled] = useState(() => positionOf(store.get()));

  useEffect(() => {
    let timer: number | undefined;

    const unsubscribe = store.subscribe(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const next = positionOf(store.get());
        // Keep the old object if focus came back to where it was, so React skips the update.
        setSettled((current) =>
          current.rowId === next.rowId && current.index === next.index ? current : next,
        );
      }, tokenMs('--delay-hero-dwell'));
    });

    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [store]);

  return settled;
}
