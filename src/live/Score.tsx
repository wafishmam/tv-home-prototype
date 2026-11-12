import { AnimatePresence, m } from 'motion/react';
import type { Side } from '../data/liveFeed';
import { tokenBezier, tokenSeconds } from '../styles/tokens';
import { useLiveValue } from './useLiveGame';
import './Score.css';

interface ScoreProps {
  gameId: string;
  side: Side;
}

/**
 * One team's score. When it changes, the old number rolls up and out while
 * the new one rolls in from below, like a scoreboard digit.
 */
export function Score({ gameId, side }: ScoreProps) {
  const value = useLiveValue(gameId, (snapshot) => snapshot[side]);
  const transition = { duration: tokenSeconds('--duration-slow'), ease: tokenBezier('--ease-out') };

  return (
    <span className="score">
      {/* popLayout takes the leaving number out of the layout at once, so the
          two numbers overlap in place instead of sitting side by side. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          className="score__value"
          initial={{ y: '50%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-50%', opacity: 0 }}
          transition={transition}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
