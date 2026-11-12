/*
 * Development flags, read once from the URL query string.
 *
 *   ?tokens    show the design token specimen instead of the TV screen
 *   ?posters   show every card in the catalog on one scrolling page
 *   ?feed      show the live feed as a table with an event log
 *   ?guides    draw the safe area and scale readout over the stage
 */
const params = new URLSearchParams(window.location.search);

export const devFlags = {
  tokens: params.has('tokens'),
  posters: params.has('posters'),
  feed: params.has('feed'),
  guides: params.has('guides'),
} as const;
