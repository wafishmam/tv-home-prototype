import { useSyncExternalStore } from 'react';
import { devFlags } from '../dev/flags';

// "coarse" means the main pointer is a finger, not a mouse.
const query = window.matchMedia('(pointer: coarse)');

function subscribe(listener: () => void) {
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

/** True on touch devices. ?touch in the URL forces it on, for checking on a desktop. */
export function useIsTouch(): boolean {
  const coarse = useSyncExternalStore(subscribe, () => query.matches);
  return coarse || devFlags.touch;
}
