import type { TitleItem } from '../data/types';
import { Poster } from './poster/Poster';
import './Card.css';

/** A film or series card: its poster, plus a progress bar if partly watched. */
export function Card({ item }: { item: TitleItem }) {
  return (
    <div className="card">
      <Poster item={item} />
      {item.progress && (
        <div className="card__progress">
          {/* scaleX instead of width: it never triggers layout. */}
          <div className="card__progress-fill" style={{ transform: `scaleX(${item.progress.fraction})` }} />
        </div>
      )}
    </div>
  );
}
