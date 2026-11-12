import { motion } from 'motion/react';
import type { Side } from '../data/liveFeed';
import { tokenSeconds } from '../styles/tokens';
import { Score } from './Score';
import { useScoreVisible } from './spoilers';
import './ScoreSlot.css';

/**
 * Where a score goes. Shows the score, or a neutral veil while the score is
 * hidden.
 *
 * When hidden, the Score component is not rendered at all. The number is
 * not in the page, so it cannot leak through the DOM, a screen reader or a
 * half-finished animation.
 */
export function ScoreSlot({ gameId, side }: { gameId: string; side: Side }) {
  const visible = useScoreVisible(gameId);
  const fade = { duration: tokenSeconds('--duration-slow') };

  // The key makes React replace the element, so each state fades in fresh.
  return visible ? (
    <motion.span key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fade}>
      <Score gameId={gameId} side={side} />
    </motion.span>
  ) : (
    <span key="veil" className="score-veil-wrap" aria-hidden="true">
      <motion.span className="score-veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fade} />
    </span>
  );
}
