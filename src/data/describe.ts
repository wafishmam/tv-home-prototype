import type { CatalogItem } from './types';

/** The accessible name for a card: what a screen reader says when it gets focus. */
export function describeItem(item: CatalogItem): string {
  if (item.kind === 'game') {
    return `${item.home.name} versus ${item.away.name}, ${item.league.name}, live`;
  }
  const parts = [item.title, item.genre, String(item.year)];
  if (item.progress) parts.push(item.progress.label);
  return parts.join(', ');
}
