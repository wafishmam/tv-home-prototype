import { rails } from '../data/catalog';
import { Rail } from './Rail';
import { TopBar } from './TopBar';
import './Home.css';

/** The TV home screen: top bar, hero area (later) and the stack of rails. */
export function Home() {
  return (
    <div className="home">
      <TopBar />
      <main className="home__rails">
        <div className="home__rail-stack">
          {rails.map((rail) => (
            <Rail key={rail.id} rail={rail} />
          ))}
        </div>
      </main>
    </div>
  );
}
