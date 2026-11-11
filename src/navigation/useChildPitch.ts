import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Measures the distance from one child to the next along an axis: card width
 * plus gap for a rail, or rail height plus gap for the stack of rails.
 *
 * Scrolling to child N is then a translate of N times the pitch. Measuring it
 * once from the DOM means the sizes stay in tokens.css and are not repeated
 * in JavaScript. The stage has a fixed size, so the pitch never changes.
 */
export function useChildPitch(containerRef: RefObject<HTMLElement | null>, axis: 'x' | 'y'): number {
  const [pitch, setPitch] = useState(0);

  useLayoutEffect(() => {
    const [first, second] = containerRef.current?.children ?? [];
    if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) return;
    // offsetLeft and offsetTop are layout positions. They ignore transforms,
    // so this is correct even while things are scaled or mid-animation.
    setPitch(axis === 'x' ? second.offsetLeft - first.offsetLeft : second.offsetTop - first.offsetTop);
  }, [containerRef, axis]);

  return pitch;
}
