import { createRandom, hashString, type Random } from '../lib/random';
import type { GameItem, Sport } from './types';

/*
 * The live data module.
 *
 * `LiveFeed` is the contract the UI depends on: read a snapshot, subscribe
 * to a game, unsubscribe. `createMockFeed` is one implementation that makes
 * games up on a timer. A real implementation (a WebSocket, server-sent
 * events, polling) would satisfy the same interface, and nothing in the UI
 * would need to change.
 */

// ---- Contract ----------------------------------------------------------------

export type Side = 'home' | 'away';

/** The full state of one game at a moment in time. */
export interface GameSnapshot {
  gameId: string;
  status: 'live' | 'final';
  /** 1-based. */
  period: number;
  /** Ready to display, for example "Q3", "2nd period" or "1st half". */
  periodLabel: string;
  /** Seconds as the sport shows them: counting down, or counting up for football. */
  clockSeconds: number;
  home: number;
  away: number;
}

/** Every event carries the snapshot after it happened, so listeners never have to rebuild state. */
export type GameEvent =
  | { type: 'clock'; snapshot: GameSnapshot }
  | { type: 'period'; snapshot: GameSnapshot }
  | { type: 'status'; snapshot: GameSnapshot }
  | { type: 'score'; side: Side; points: number; snapshot: GameSnapshot }
  | {
      type: 'keyPlay';
      /** For example "Goal", "Lead change" or "Penalty awarded". */
      label: string;
      side: Side;
      /** True if this play changed the score. */
      scoring: boolean;
      snapshot: GameSnapshot;
    };

export type GameListener = (event: GameEvent) => void;
export type Unsubscribe = () => void;

export interface LiveFeed {
  /** The latest known state, or undefined for an unknown game. */
  getSnapshot(gameId: string): GameSnapshot | undefined;
  /** Start receiving events for one game. Call the returned function to stop. */
  subscribe(gameId: string, listener: GameListener): Unsubscribe;
}

/** "08:41" from a number of seconds. */
export function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

// ---- Mock implementation -----------------------------------------------------

interface SportRules {
  periods: number;
  periodSeconds: number;
  clock: 'down' | 'up';
  periodLabel(period: number): string;
  /** Roughly what one team scores in one period. Used to pick a believable starting score. */
  typicalPerPeriod: number;
  /** Chance of a score in any one second of game time. */
  scoreChance: number;
  /** Possible point values for a score. */
  points: readonly number[];
  /** In low scoring sports every score is a key play. */
  scoreIsKeyPlay: boolean;
  scoreLabel: string;
  /** Chance of a key play that does not change the score. */
  keyPlayChance: number;
  keyPlayLabels: readonly string[];
}

const ordinal = (n: number) => ['1st', '2nd', '3rd', '4th'][n - 1] ?? `${n}th`;

/*
 * Chances are higher than real life so that something happens while you
 * watch the prototype for a minute.
 */
const RULES: Readonly<Record<Sport, SportRules>> = {
  hoops: {
    periods: 4,
    periodSeconds: 10 * 60,
    clock: 'down',
    periodLabel: (period) => `Q${period}`,
    typicalPerPeriod: 22,
    scoreChance: 0.045,
    points: [2, 2, 2, 3, 3, 1],
    scoreIsKeyPlay: false,
    scoreLabel: 'Basket',
    keyPlayChance: 0.004,
    keyPlayLabels: ['Fast break', 'Big block', 'Buzzer beater attempt'],
  },
  ice: {
    periods: 3,
    periodSeconds: 20 * 60,
    clock: 'down',
    periodLabel: (period) => `${ordinal(period)} period`,
    typicalPerPeriod: 1,
    scoreChance: 0.004,
    points: [1],
    scoreIsKeyPlay: true,
    scoreLabel: 'Goal',
    keyPlayChance: 0.006,
    keyPlayLabels: ['Power play', 'Breakaway save', 'Shot off the post'],
  },
  football: {
    periods: 2,
    periodSeconds: 45 * 60,
    clock: 'up',
    periodLabel: (period) => `${ordinal(period)} half`,
    typicalPerPeriod: 0.7,
    scoreChance: 0.0025,
    points: [1],
    scoreIsKeyPlay: true,
    scoreLabel: 'Goal',
    keyPlayChance: 0.005,
    keyPlayLabels: ['Penalty awarded', 'Shot off the bar', 'Red card', 'Goal line clearance'],
  },
};

interface MockFeedOptions {
  /** Game seconds that pass per real second. Above 1 so periods change while you watch. */
  speed?: number;
  /** How long a finished game stays on "Final" before it starts again, in real seconds. */
  restartAfter?: number;
}

/** The private, mutable state of one simulated game. */
interface MockGame {
  rules: SportRules;
  random: Random;
  status: 'live' | 'final';
  period: number;
  /** Game seconds played in the current period. */
  elapsed: number;
  home: number;
  away: number;
  /** Ticks spent on "Final", used to restart the game for the demo. */
  finalTicks: number;
  listeners: Set<GameListener>;
}

export function createMockFeed(games: readonly GameItem[], options: MockFeedOptions = {}): LiveFeed {
  const speed = options.speed ?? 4;
  const tickMs = 1000 / speed;
  const restartTicks = (options.restartAfter ?? 20) * speed;

  const state = new Map<string, MockGame>();
  for (const item of games) state.set(item.id, kickOff(item));

  let timer: number | undefined;
  let listenerCount = 0;

  /** Starts each game somewhere in the middle, with a plausible score. */
  function kickOff(item: GameItem): MockGame {
    const rules = RULES[item.league.sport];
    // Seeded from the game id: the same games play out the same way each visit.
    const random = createRandom(hashString(item.id));
    const period = 1 + Math.floor(random() * rules.periods);
    const elapsed = Math.floor(random() * rules.periodSeconds * 0.8);
    const periodsPlayed = period - 1 + elapsed / rules.periodSeconds;
    // Each team gets the typical amount for the time played, give or take 15%.
    const startingScore = () => Math.round(rules.typicalPerPeriod * periodsPlayed * (0.85 + random() * 0.3));

    return {
      rules,
      random,
      status: 'live',
      period,
      elapsed,
      home: startingScore(),
      away: startingScore(),
      finalTicks: 0,
      listeners: new Set(),
    };
  }

  function snapshotOf(gameId: string, game: MockGame): GameSnapshot {
    const { rules } = game;
    return {
      gameId,
      status: game.status,
      period: game.period,
      periodLabel: game.status === 'final' ? 'Final' : rules.periodLabel(game.period),
      clockSeconds: rules.clock === 'down' ? rules.periodSeconds - game.elapsed : game.elapsed,
      home: game.home,
      away: game.away,
    };
  }

  /** Advances one game by one second of game time and emits what happened. */
  function tick(gameId: string, game: MockGame) {
    const { rules, random } = game;
    const emit = (event: GameEvent) => game.listeners.forEach((listener) => listener(event));
    const snapshot = () => snapshotOf(gameId, game);

    if (game.status === 'final') {
      // Demo only: a real game stays final. Here it restarts so the rail stays live.
      if (++game.finalTicks >= restartTicks) {
        Object.assign(game, { status: 'live', period: 1, elapsed: 0, home: 0, away: 0, finalTicks: 0 });
        emit({ type: 'status', snapshot: snapshot() });
      }
      return;
    }

    game.elapsed += 1;

    if (game.elapsed >= rules.periodSeconds) {
      if (game.period < rules.periods) {
        game.period += 1;
        game.elapsed = 0;
        emit({ type: 'period', snapshot: snapshot() });
      } else {
        game.elapsed = rules.periodSeconds;
        game.status = 'final';
        emit({ type: 'status', snapshot: snapshot() });
      }
      return;
    }

    emit({ type: 'clock', snapshot: snapshot() });

    const side: Side = random() < 0.5 ? 'home' : 'away';

    if (random() < rules.scoreChance) {
      const leaderBefore = Math.sign(game.home - game.away);
      const points = rules.points[Math.floor(random() * rules.points.length)] ?? 1;
      game[side] += points;
      emit({ type: 'score', side, points, snapshot: snapshot() });

      const leaderAfter = Math.sign(game.home - game.away);
      if (rules.scoreIsKeyPlay) {
        emit({ type: 'keyPlay', label: rules.scoreLabel, side, scoring: true, snapshot: snapshot() });
      } else if (leaderAfter !== 0 && leaderAfter !== leaderBefore) {
        // In high scoring sports only a change of lead is worth a pulse.
        emit({ type: 'keyPlay', label: 'Lead change', side, scoring: true, snapshot: snapshot() });
      }
    } else if (random() < rules.keyPlayChance) {
      const label = rules.keyPlayLabels[Math.floor(random() * rules.keyPlayLabels.length)] ?? 'Key play';
      emit({ type: 'keyPlay', label, side, scoring: false, snapshot: snapshot() });
    }
  }

  return {
    getSnapshot(gameId) {
      const game = state.get(gameId);
      return game && snapshotOf(gameId, game);
    },

    subscribe(gameId, listener) {
      const game = state.get(gameId);
      if (!game) return () => {};

      game.listeners.add(listener);
      listenerCount += 1;
      // Like opening a connection: the timer runs only while someone listens.
      if (timer === undefined) {
        timer = window.setInterval(() => state.forEach((each, id) => tick(id, each)), tickMs);
      }

      let active = true;
      return () => {
        if (!active) return;
        active = false;
        game.listeners.delete(listener);
        listenerCount -= 1;
        if (listenerCount === 0) {
          window.clearInterval(timer);
          timer = undefined;
        }
      };
    },
  };
}
