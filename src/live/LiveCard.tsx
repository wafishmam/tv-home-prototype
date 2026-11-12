import type { GameItem, Team } from '../data/types';
import type { Side } from '../data/liveFeed';
import { ItemArt } from '../components/poster/ItemArt';
import { GameStatus } from './GameStatus';
import { KeyPlayPulse } from './KeyPlayPulse';
import { ScoreSlot } from './ScoreSlot';
import './LiveCard.css';

/**
 * A live game card: both teams with their scores (or a veil in spoiler free
 * mode), a chip with the live indicator, period and clock, and a pulse when
 * a key play happens.
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
      <KeyPlayPulse game={game} />
    </div>
  );
}

function TeamColumn({ gameId, team, side }: { gameId: string; team: Team; side: Side }) {
  return (
    <div className="live-card__team" style={{ color: team.ink }}>
      <span className="live-card__abbr">{team.abbr}</span>
      <span className="live-card__score">
        <ScoreSlot gameId={gameId} side={side} />
      </span>
    </div>
  );
}
