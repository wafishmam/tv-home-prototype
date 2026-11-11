import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Returns the scale factor that makes the fixed-size stage fit inside the
 * viewport element while keeping its aspect ratio ("contain" fitting).
 *
 * The stage's own size is measured from the DOM (offsetWidth and offsetHeight
 * ignore transforms), so 1920 x 1080 lives only in tokens.css.
 */
export function useStageScale(
  viewportRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
): number {
  const [scale, setScale] = useState(1);

  // Layout effect, so the first scale is applied before the browser paints
  // and the stage never flashes at full size.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage) return;

    const fit = () => {
      const widthRatio = viewport.clientWidth / stage.offsetWidth;
      const heightRatio = viewport.clientHeight / stage.offsetHeight;
      // The smaller ratio is the one that keeps the whole stage visible.
      setScale(Math.min(widthRatio, heightRatio));
    };

    fit();

    // Observing the viewport element (not the window) means the stage also
    // refits if something else takes space, like the touch controls later.
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [viewportRef, stageRef]);

  return scale;
}
