import { useRef } from 'react';
import { rails } from '../data/catalog';
import { ActionPanelProvider } from '../live/ActionPanel';
import { useChildPitch } from '../navigation/useChildPitch';
import { useAnchorRowId } from '../navigation/useFocusable';
import { Hero } from './Hero';
import { Rail } from './Rail';
import { TopBar } from './TopBar';
import './Home.css';

/**
 * The TV home screen: hero, top bar and the stack of rails.
 * It must be rendered inside a FocusProvider (see App.tsx).
 */
export function Home() {
  return (
    // An open panel captures navigation input, so its provider wraps the screen.
    <ActionPanelProvider>
      <div className="home">
        <Hero />
        <TopBar />
        <main className="home__rails">
          <RailStack />
        </main>
      </div>
    </ActionPanelProvider>
  );
}

/** All the rails, moved up as one so the anchored rail sits at the top of the window. */
function RailStack() {
  const stackRef = useRef<HTMLDivElement>(null);
  const anchorRowId = useAnchorRowId();
  const anchorPosition = rails.findIndex((rail) => rail.id === anchorRowId);
  const pitch = useChildPitch(stackRef, 'y');

  return (
    <div
      ref={stackRef}
      className="home__rail-stack"
      style={{ transform: `translateY(${-anchorPosition * pitch}px)` }}
    >
      {rails.map((rail, position) => (
        <Rail key={rail.id} rail={rail} passed={position < anchorPosition} />
      ))}
    </div>
  );
}
