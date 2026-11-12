import { AnimatePresence, motion } from 'motion/react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { CatalogItem } from '../data/types';
import { useNavigation } from '../navigation/FocusContext';
import { tokenBezier, tokenSeconds } from '../styles/tokens';
import { revealScore, useScoreVisible } from './spoilers';
import './ActionPanel.css';

/*
 * The small panel that opens when a card is selected.
 *
 * It is modal: while it is open it captures navigation input (see
 * Navigation.capture), so arrows move between its choices and Back closes
 * it. Focus on the grid underneath does not move, which means closing the
 * panel puts the viewer exactly where they were.
 */

interface Choice {
  label: string;
  /** Runs when the choice is selected. The panel closes afterwards either way. */
  run?: () => void;
}

const OpenPanelContext = createContext<(item: CatalogItem) => void>(() => {});

/** Returns a function that opens the panel for an item. */
export function useOpenActionPanel() {
  return useContext(OpenPanelContext);
}

export function ActionPanelProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<CatalogItem | null>(null);
  const close = useCallback(() => setItem(null), []);

  return (
    <OpenPanelContext value={setItem}>
      {children}
      <AnimatePresence>{item && <ActionPanel key={item.id} item={item} onClose={close} />}</AnimatePresence>
    </OpenPanelContext>
  );
}

function ActionPanel({ item, onClose }: { item: CatalogItem; onClose: () => void }) {
  const navigation = useNavigation();
  const choices = useChoices(item);
  const [index, setIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const choose = (choice: Choice | undefined) => {
    choice?.run?.();
    onClose();
  };

  // The capture handler needs the latest index and choices without being
  // re-registered on every render, so it reads them through a ref.
  const latest = useRef({ index, choices, choose });
  useEffect(() => {
    latest.current = { index, choices, choose };
  });

  // Take over navigation input for as long as the panel is mounted.
  useEffect(
    () =>
      navigation.capture((action) => {
        const { index, choices, choose } = latest.current;
        if (action === 'up') setIndex(Math.max(0, index - 1));
        else if (action === 'down') setIndex(Math.min(choices.length - 1, index + 1));
        else if (action === 'select') choose(choices[index]);
        else if (action === 'back') onClose();
        // Left and right do nothing: the choices are stacked vertically.
      }),
    [navigation, onClose],
  );

  // Real DOM focus follows the highlighted choice.
  useEffect(() => {
    buttonRefs.current[index]?.focus({ preventScroll: true });
  }, [index]);

  const title = item.kind === 'game' ? `${item.home.name} vs ${item.away.name}` : item.title;
  const easeOut = tokenBezier('--ease-out');

  return (
    <motion.div
      className="panel-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: tokenSeconds('--duration-fast'), ease: easeOut }}
      // Clicking the dimmed area closes the panel.
      onClick={onClose}
    >
      <motion.div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Options for ${title}`}
        // Starts slightly small rather than from nothing, and settles without bounce.
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{ duration: tokenSeconds('--duration-base'), ease: easeOut }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="panel__title">{title}</h2>
        <ul className="panel__choices">
          {choices.map((choice, position) => (
            <li key={choice.label}>
              <button
                ref={(element) => {
                  buttonRefs.current[position] = element;
                }}
                className="panel__choice"
                data-focused={position === index}
                tabIndex={position === index ? 0 : -1}
                onPointerMove={() => setIndex(position)}
                onClick={(event) => {
                  // Keyboard-made clicks (detail 0) are handled by the capture above.
                  if (event.detail !== 0) choose(choice);
                }}
              >
                {choice.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="panel__note">Playback is not part of this prototype.</p>
      </motion.div>
    </motion.div>
  );
}

/** The two choices for an item, which depend on what it is and on spoiler free mode. */
function useChoices(item: CatalogItem): Choice[] {
  // Hooks cannot be conditional, so this is asked for every item. Titles have
  // no score to hide and simply ignore the answer.
  const scoreVisible = useScoreVisible(item.id);

  if (item.kind === 'game') {
    return scoreVisible
      ? [{ label: 'Watch live' }, { label: 'Watch from start' }]
      : [{ label: 'Watch from start' }, { label: 'Reveal score', run: () => revealScore(item.id) }];
  }
  return item.progress ? [{ label: 'Resume' }, { label: 'Start over' }] : [{ label: 'Play' }, { label: 'Watch trailer' }];
}
