import { formatClock } from '../data/liveFeed';
import { useLiveValue } from './useLiveGame';
import './GameStatus.css';

/**
 * The live indicator: a pulsing dot, the period and the clock.
 * Shows "Final" with a still dot once the game is over.
 */
export function GameStatus({ gameId }: { gameId: string }) {
  const live = useLiveValue(gameId, (snapshot) => snapshot.status === 'live');
  const period = useLiveValue(gameId, (snapshot) => snapshot.periodLabel);
  const clock = useLiveValue(gameId, (snapshot) => formatClock(snapshot.clockSeconds));

  return (
    <span className="game-status" data-live={live}>
      <span className="game-status__dot" />
      <span>{period}</span>
      {live && <span className="game-status__clock">{clock}</span>}
    </span>
  );
}
