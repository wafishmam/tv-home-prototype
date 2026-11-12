import type { GameItem } from '../data/types';
import { Focusable } from '../navigation/Focusable';
import { LiveCard } from './LiveCard';
import { useLiveValue } from './useLiveGame';

interface LiveRailCardProps {
  game: GameItem;
  rowId: string;
  index: number;
}

/**
 * A live card as a focusable rail item. It exists so the accessible name can
 * include live facts. The clock is left out on purpose: a name that changed
 * every second would be noise for a screen reader.
 */
export function LiveRailCard({ game, rowId, index }: LiveRailCardProps) {
  const period = useLiveValue(game.id, (snapshot) => snapshot.periodLabel);
  const home = useLiveValue(game.id, (snapshot) => snapshot.home);
  const away = useLiveValue(game.id, (snapshot) => snapshot.away);

  const label = [
    `${game.home.name} versus ${game.away.name}`,
    game.league.name,
    period === 'Final' ? 'final' : `live, ${period}`,
    `${game.home.name} ${home}, ${game.away.name} ${away}`,
  ].join(', ');

  return (
    <Focusable rowId={rowId} index={index} label={label}>
      <LiveCard game={game} />
    </Focusable>
  );
}
