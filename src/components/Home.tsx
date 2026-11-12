import { useRef } from 'react';
import { rails } from '../data/catalog';
import { FocusProvider } from '../navigation/FocusContext';
import type { Row } from '../navigation/focusStore';
import { useChildPitch } from '../navigation/useChildPitch';
import { useAnchorRowPosition } from '../navigation/useFocusable';
import { Hero } from './Hero';
import { Rail } from './Rail';
import { TopBar } from './TopBar';
import './Home.css';

// The focus rows of this screen, top to bottom: one per rail.
const rows: readonly Row[] = rails.map((rail) => ({ id: rail.id, length: rail.items.length }));

/** The TV home screen: hero, top bar and the stack of rails. */
export function Home() {
  return (
    <FocusProvider rows={rows}>
      <div className="home">
        <Hero />
        <TopBar />
        <main className="home__rails">
          <RailStack />
        </main>
      </div>
    </FocusProvider>
  );
}

/** All the rails, moved up as one so the anchored rail sits at the top of the window. */
function RailStack() {
  const stackRef = useRef<HTMLDivElement>(null);
  const anchorPosition = useAnchorRowPosition();
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
