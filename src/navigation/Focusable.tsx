import type { ReactNode } from 'react';
import { useFocusable } from './useFocusable';
import './Focusable.css';

interface FocusableProps {
  rowId: string;
  index: number;
  /** Accessible name, read out when the item receives focus. */
  label: string;
  onSelect?: () => void;
  children: ReactNode;
}

/**
 * Wraps a card and gives it the focus treatment: scale, ring, shadow, and
 * the shift that makes room for a focused neighbour. All of the visuals are
 * in Focusable.css, driven by the data-focus attribute.
 */
export function Focusable({ rowId, index, label, onSelect, children }: FocusableProps) {
  const { props } = useFocusable<HTMLDivElement>({ rowId, index, onSelect });

  return (
    <div className="focusable" role="button" aria-label={label} {...props}>
      {/* The inner element takes the press animation, so it can run
          independently of the focus scale on the outer one. */}
      <div className="focusable__body">{children}</div>
    </div>
  );
}
