import { useSyncExternalStore } from 'react';
import { createStore } from '../navigation/focusStore';

/*
 * Spoiler free mode.
 *
 * The state lives in this module's memory only. It is not written to
 * localStorage or anywhere else, so it lasts for the session and resets on
 * reload.
 */

interface SpoilerState {
  /** Spoiler free mode is on. */
  enabled: boolean;
  /** Games whose score the viewer chose to reveal while the mode is on. */
  revealed: ReadonlySet<string>;
}

// On by default: the prototype is about the viewer who does not want spoilers.
const store = createStore<SpoilerState>({ enabled: true, revealed: new Set() });

export function toggleSpoilerFree() {
  const { enabled } = store.get();
  // Turning the mode back on starts clean: earlier reveals are forgotten.
  store.set({ enabled: !enabled, revealed: new Set() });
}

/** Reveal one game. Every other game stays hidden. */
export function revealScore(gameId: string) {
  const state = store.get();
  if (state.revealed.has(gameId)) return;
  store.set({ ...state, revealed: new Set(state.revealed).add(gameId) });
}

export function useSpoilerFree(): boolean {
  return useSyncExternalStore(store.subscribe, () => store.get().enabled);
}

/** Should this game's score be shown right now? */
export function useScoreVisible(gameId: string): boolean {
  return useSyncExternalStore(store.subscribe, () => {
    const { enabled, revealed } = store.get();
    return !enabled || revealed.has(gameId);
  });
}
