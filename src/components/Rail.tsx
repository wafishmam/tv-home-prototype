import { useRef, type ReactNode } from 'react';
import { describeItem } from '../data/describe';
import type { RailData } from '../data/types';
import { LiveCard } from '../live/LiveCard';
import { Focusable } from '../navigation/Focusable';
import { useChildPitch } from '../navigation/useChildPitch';
import { useIsRowFocused, useRowAnchor } from '../navigation/useFocusable';
import { Card } from './Card';
import './Rail.css';

interface RailProps {
  rail: RailData;
  /** True once the screen has scrolled past this rail. */
  passed: boolean;
}

/** One horizontal row of cards with its title. Each rail is one focus row. */
export function Rail({ rail, passed }: RailProps) {
  const focused = useIsRowFocused(rail.id);
  const titleId = `rail-${rail.id}-title`;
  const live = rail.items[0]?.kind === 'game';

  return (
    <section
      className={live ? 'rail rail--live' : 'rail'}
      aria-labelledby={titleId}
      data-focused={focused}
      data-passed={passed}
    >
      <h2 id={titleId} className="rail__title">
        {rail.title}
      </h2>
      <RailTrack rowId={rail.id}>
        {rail.items.map((item, index) => (
          <li key={item.id} className="rail__item">
            <Focusable rowId={rail.id} index={index} label={describeItem(item)}>
              {item.kind === 'game' ? <LiveCard game={item} /> : <Card item={item} />}
            </Focusable>
          </li>
        ))}
      </RailTrack>
    </section>
  );
}

/**
 * The sliding strip of cards. It is its own component so that scrolling
 * re-renders only this element. The cards are passed in as children, and
 * React skips children whose elements have not changed.
 */
function RailTrack({ rowId, children }: { rowId: string; children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const anchor = useRowAnchor(rowId);
  const pitch = useChildPitch(trackRef, 'x');

  // Slide left by whole cards so the anchored card lands on the left anchor line.
  return (
    <ul ref={trackRef} className="rail__track" style={{ transform: `translateX(${-anchor * pitch}px)` }}>
      {children}
    </ul>
  );
}
