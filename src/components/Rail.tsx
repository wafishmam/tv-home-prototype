import type { RailData } from '../data/types';
import { LiveCard } from '../live/LiveCard';
import { Card } from './Card';
import './Rail.css';

/** One horizontal row of cards with its title. */
export function Rail({ rail }: { rail: RailData }) {
  const titleId = `rail-${rail.id}-title`;

  return (
    <section className="rail" aria-labelledby={titleId}>
      <h2 id={titleId} className="rail__title">
        {rail.title}
      </h2>
      <ul className="rail__track">
        {rail.items.map((item) => (
          <li key={item.id} className="rail__item">
            {item.kind === 'game' ? <LiveCard game={item} /> : <Card item={item} />}
          </li>
        ))}
      </ul>
    </section>
  );
}
