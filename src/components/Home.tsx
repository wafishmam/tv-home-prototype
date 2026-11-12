import { useRef } from 'react';
import { rails } from '../data/catalog';
import { ActionPanelProvider } from '../live/ActionPanel';
import { TOPBAR_ROW } from '../live/SpoilerToggle';
import { FocusProvider } from '../navigation/FocusContext';
import type { Row } from '../navigation/focusStore';
import { useChildPitch } from '../navigation/useChildPitch';
import { useAnchorRowId } from '../navigation/useFocusable';
import { Hero } from './Hero';
import { Rail } from './Rail';
import { TopBar } from './TopBar';
import './Home.css';

// The focus rows of this screen, top to bottom: the top bar (one item, the
// spoiler free toggle), then one row per rail.
const rows: readonly Row[] = [
  { id: TOPBAR_ROW, length: 1, fixed: true },
  ...rails.map((rail) => ({ id: rail.id, length: rail.items.length })),
];

// Focus starts on the first rail, not on the top bar.
const initialRowId = rails[0]?.id;

/** The TV home screen: hero, top bar and the stack of rails. */
export function Home() {
  return (
    <FocusProvider rows={rows} initialRowId={initialRowId}>
      {/* The panel provider sits inside the focus provider because an open
          panel captures navigation input. */}
      <ActionPanelProvider>
        <div className="home">
          <Hero />
          <TopBar />
          <main className="home__rails">
            <RailStack />
          </main>
        </div>
      </ActionPanelProvider>
    </FocusProvider>
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
