import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigation } from '../navigation/FocusContext';
import { tokenMs, tokenSeconds } from '../styles/tokens';
import { useIsTouch } from '../touch/useIsTouch';
import './Hint.css';

/**
 * A short hint shown on first load. It leaves as soon as the viewer moves
 * focus, which shows they have worked it out, or after a few seconds.
 */
export function Hint() {
  const { store } = useNavigation();
  const touch = useIsTouch();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    const timer = window.setTimeout(hide, tokenMs('--duration-hint'));
    // Any change of focus means the viewer is already navigating.
    const unsubscribe = store.subscribe(hide);
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [store]);

  return (
    <AnimatePresence>
      {visible && (
        <m.p
          className="hint"
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: tokenSeconds('--duration-slow') }}
        >
          {touch ? 'Use the direction pad and OK' : 'Use arrow keys and Enter'}
        </m.p>
      )}
    </AnimatePresence>
  );
}
