import { useEffect, useRef, useSyncExternalStore, type MouseEvent, type PointerEvent } from 'react';
import { useNavigation } from './FocusContext';
import type { FocusState } from './focusStore';

/*
 * Hooks that connect components to the focus store.
 *
 * Every hook goes through useFocusSelector, which re-renders a component
 * only when the value it selected changes. Moving focus one card to the
 * right re-renders two cards, not the whole screen.
 */

/** Subscribe to one derived value from the focus state. Return primitives. */
export function useFocusSelector<T>(selector: (state: FocusState) => T): T {
  const { store } = useNavigation();
  return useSyncExternalStore(store.subscribe, () => selector(store.get()));
}

/**
 * How an item should look:
 *   focused  it has focus: scaled up, with the focus ring
 *   shifted  it sits after the focused item in the same row: moved aside to make room
 *   before   it sits before the item its row is scrolled to: dimmed in the margin
 *   rest     nothing special
 */
export type FocusLook = 'focused' | 'shifted' | 'before' | 'rest';

interface UseFocusableOptions {
  rowId: string;
  index: number;
  /** Called when the item is selected with Enter, OK or a click. */
  onSelect?: () => void;
}

/** Makes one element a focusable item at a position in a row. */
export function useFocusable<E extends HTMLElement>({ rowId, index, onSelect }: UseFocusableOptions) {
  const navigation = useNavigation();
  const elementRef = useRef<E>(null);

  const look = useFocusSelector<FocusLook>((state) => {
    const focusedIndex = state.indexByRow[rowId] ?? 0;
    if (state.rowId === rowId) {
      if (index === focusedIndex) return 'focused';
      if (index > focusedIndex) return 'shifted';
    }
    if (index < (state.anchorByRow[rowId] ?? 0)) return 'before';
    return 'rest';
  });
  const focused = look === 'focused';

  // Keep the latest onSelect in a ref so the registration below stays stable.
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  // Tell the navigation where this item is, so Enter can reach it.
  useEffect(
    () => navigation.register(rowId, index, { element: elementRef, onSelect: onSelectRef }),
    [navigation, rowId, index],
  );

  // Move real DOM focus along with our focus, so assistive technology
  // announces the item. preventScroll matters: scrolling is done with
  // transforms, and the browser must not also scroll the clipped containers.
  useEffect(() => {
    if (focused) elementRef.current?.focus({ preventScroll: true });
  }, [focused]);

  return {
    look,
    focused,
    /** Spread these onto the element. */
    props: {
      ref: elementRef,
      // Roving tabindex: only the focused item is in the tab order.
      tabIndex: focused ? 0 : -1,
      'data-focus': look,
      onPointerMove(event: PointerEvent) {
        // Touch has no hover. A tap arrives as a click instead.
        if (event.pointerType !== 'mouse') return;
        navigation.pointerFocus(rowId, index, event.clientX, event.clientY);
      },
      onClick(event: MouseEvent) {
        // detail is 0 for clicks synthesised from the keyboard, which the
        // key handler has already dealt with.
        if (event.detail === 0) return;
        navigation.pointerSelect(rowId, index);
      },
    },
  };
}

/** Is this the row that has focus? */
export function useIsRowFocused(rowId: string): boolean {
  return useFocusSelector((state) => state.rowId === rowId);
}

/** Which item this row is scrolled to. */
export function useRowAnchor(rowId: string): number {
  return useFocusSelector((state) => state.anchorByRow[rowId] ?? 0);
}

/** The position, in the list of rows, of the row the screen is scrolled to. */
export function useAnchorRowPosition(): number {
  const { rows } = useNavigation();
  return useFocusSelector((state) => rows.findIndex((row) => row.id === state.anchorRowId));
}
