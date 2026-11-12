/*
 * Development flags, read once from the URL query string.
 *
 *   ?tokens    show the design token specimen instead of the TV screen
 *   ?posters   show every card in the catalog on one scrolling page
 *   ?feed      show the live feed as a table with an event log
 *   ?touch     show the touch controls even without a touch screen
 *   ?guides    draw the safe area and scale readout over the stage
 */
const params = new URLSearchParams(window.location.search);

export const devFlags = {
  tokens: params.has('tokens'),
  posters: params.has('posters'),
  feed: params.has('feed'),
  touch: params.has('touch'),
  guides: params.has('guides'),
} as const;
