import { Card } from '../components/Card';
import { rails } from '../data/catalog';
import { LiveCard } from '../live/LiveCard';
import './PosterSheet.css';

/*
 * A contact sheet of every card in the catalog, at full size, on a scrolling
 * page. Development aid only. Enable with ?posters in the URL.
 */
export function PosterSheet() {
  return (
    <main className="sheet">
      {rails.map((rail) => (
        <section key={rail.id} className="sheet__section">
          <h2 className="sheet__heading">{rail.title}</h2>
          <div className="sheet__grid">
            {rail.items.map((item) =>
              item.kind === 'game' ? <LiveCard key={item.id} game={item} /> : <Card key={item.id} item={item} />,
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
