import type { GameItem } from '../data/types';
import { ItemArt } from '../components/poster/ItemArt';
import './LiveCard.css';

/**
 * A live game card. For now it is static: the two teams and the league.
 * The clock, score and live indicator arrive with the live data module.
 */
export function LiveCard({ game }: { game: GameItem }) {
  return (
    <div className="live-card">
      <ItemArt item={game} />
      <span className="live-card__league">{game.league.name}</span>
      <div className="live-card__teams">
        <span className="live-card__team" style={{ color: game.home.ink }}>
          {game.home.abbr}
        </span>
        <span className="live-card__team" style={{ color: game.away.ink }}>
          {game.away.abbr}
        </span>
      </div>
    </div>
  );
}
