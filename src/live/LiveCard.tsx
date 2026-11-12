import type { GameItem, Team } from '../data/types';
import type { Side } from '../data/liveFeed';
import { ItemArt } from '../components/poster/ItemArt';
import { GameStatus } from './GameStatus';
import { Score } from './Score';
import './LiveCard.css';

/**
 * A live game card: both teams with their scores, and a chip with the live
 * indicator, period and clock.
 *
 * The card itself never re-renders for live data. Each small piece inside
 * (status, each score) subscribes to just the value it shows.
 */
export function LiveCard({ game }: { game: GameItem }) {
  return (
    <div className="live-card">
      <ItemArt item={game} />
      <div className="live-card__status">
        <GameStatus gameId={game.id} />
      </div>
      <div className="live-card__teams">
        <TeamColumn gameId={game.id} team={game.home} side="home" />
        <TeamColumn gameId={game.id} team={game.away} side="away" />
      </div>
    </div>
  );
}

function TeamColumn({ gameId, team, side }: { gameId: string; team: Team; side: Side }) {
  return (
    <div className="live-card__team" style={{ color: team.ink }}>
      <span className="live-card__abbr">{team.abbr}</span>
      <span className="live-card__score">
        <Score gameId={gameId} side={side} />
      </span>
    </div>
  );
}
