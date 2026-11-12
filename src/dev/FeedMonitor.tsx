import { useEffect, useState } from 'react';
import { games } from '../data/games';
import { formatClock, type GameSnapshot } from '../data/liveFeed';
import { liveFeed } from '../live/feed';
import './FeedMonitor.css';

interface LogLine {
  id: number;
  text: string;
}

/*
 * A plain table of the live feed, plus a log of everything except clock
 * ticks. Development aid only. Enable with ?feed in the URL.
 */
export function FeedMonitor() {
  const [listening, setListening] = useState(true);
  const [snapshots, setSnapshots] = useState<Record<string, GameSnapshot | undefined>>(() =>
    Object.fromEntries(games.map((game) => [game.id, liveFeed.getSnapshot(game.id)])),
  );
  const [log, setLog] = useState<LogLine[]>([]);

  useEffect(() => {
    if (!listening) return;
    let nextId = 0;

    const unsubscribes = games.map((game) =>
      liveFeed.subscribe(game.id, (event) => {
        setSnapshots((current) => ({ ...current, [game.id]: event.snapshot }));
        if (event.type === 'clock') return;

        const who = 'side' in event ? ` (${game[event.side].abbr})` : '';
        const what =
          event.type === 'score'
            ? `score +${event.points}`
            : event.type === 'keyPlay'
              ? `key play: ${event.label}${event.scoring ? ', scoring' : ''}`
              : `${event.type}: ${event.snapshot.periodLabel}`;
        const text = `${game.home.abbr} v ${game.away.abbr}  ${what}${who}`;
        setLog((lines) => [{ id: nextId++, text }, ...lines].slice(0, 14));
      }),
    );

    // Unsubscribing from everything stops the feed's timer.
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [listening]);

  return (
    <main className="monitor">
      <h1 className="monitor__heading">Live feed monitor</h1>
      <button className="monitor__button" onClick={() => setListening((value) => !value)}>
        {listening ? 'Unsubscribe all' : 'Subscribe all'}
      </button>

      <table className="monitor__table">
        <thead>
          <tr>
            <th>Game</th>
            <th>League</th>
            <th>Period</th>
            <th>Clock</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const snapshot = snapshots[game.id];
            if (!snapshot) return null;
            return (
              <tr key={game.id}>
                <td>
                  {game.home.abbr} v {game.away.abbr}
                </td>
                <td>{game.league.name}</td>
                <td>{snapshot.periodLabel}</td>
                <td className="monitor__number">{formatClock(snapshot.clockSeconds)}</td>
                <td className="monitor__number">
                  {snapshot.home} : {snapshot.away}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="monitor__subheading">Events (clock ticks hidden)</h2>
      <ol className="monitor__log">
        {log.map((line) => (
          <li key={line.id}>{line.text}</li>
        ))}
      </ol>
    </main>
  );
}
