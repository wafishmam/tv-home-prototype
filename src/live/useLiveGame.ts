import { useEffect, useRef, useState } from 'react';
import type { GameSnapshot } from '../data/liveFeed';
import { liveFeed } from './feed';

/**
 * Subscribes a component to one value from a live game, for example the
 * home score or the clock.
 *
 * The feed ticks four times a second. Selecting a single value means a
 * component re-renders only when that value changes: a score re-renders
 * when someone scores, not on every tick of the clock. Select primitives
 * (numbers, strings), which React can compare.
 */
export function useLiveValue<T>(gameId: string, select: (snapshot: GameSnapshot) => T): T {
  const [value, setValue] = useState(() => {
    const snapshot = liveFeed.getSnapshot(gameId);
    if (!snapshot) throw new Error(`No live game with id "${gameId}".`);
    return select(snapshot);
  });

  // Keep the latest selector without resubscribing on every render.
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  useEffect(
    // subscribe returns its own unsubscribe function, which is exactly the
    // cleanup function an effect needs.
    () => liveFeed.subscribe(gameId, (event) => setValue(selectRef.current(event.snapshot))),
    [gameId],
  );

  return value;
}
