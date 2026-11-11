import type { CSSProperties } from 'react';
import type { TitleItem } from '../../data/types';
import { ItemArt } from './ItemArt';
import './Poster.css';

/**
 * A title's poster: generated art plus the title set in lettering that
 * belongs to the art style. Fills its parent.
 */
export function Poster({ item }: { item: TitleItem }) {
  // Colours are per title, so they are passed to CSS as variables:
  // the lettering colour, and the poster's base (background) colour.
  const style = {
    '--poster-ink': item.poster.ink,
    '--poster-base': item.poster.palette[0],
  } as CSSProperties;

  return (
    <div className={`poster poster--${item.poster.style}`} style={style}>
      <ItemArt item={item} />
      <span className="poster__title">{item.title}</span>
    </div>
  );
}
