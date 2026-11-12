import { games } from '../data/games';
import { createMockFeed, type LiveFeed } from '../data/liveFeed';

/**
 * The feed the app uses. To connect real data, replace this one line with
 * another implementation of the LiveFeed interface.
 */
export const liveFeed: LiveFeed = createMockFeed(games);
