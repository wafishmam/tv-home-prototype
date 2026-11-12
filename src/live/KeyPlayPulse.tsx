import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import type { GameItem } from '../data/types';
import { tokenBezier, tokenMs, tokenSeconds } from '../styles/tokens';
import { liveFeed } from './feed';
import { useScoreVisible } from './spoilers';
import './KeyPlayPulse.css';

interface Pulse {
  id: number;
  /** What happened and to whom. Only shown when the score is visible. */
  detail: string;
}

/**
 * Reacts to key plays on a live card: a flash around the card and a short
 * banner across its top.
 *
 * While the score is hidden the banner says only "Something just happened".
 * The pulse is identical for every kind of key play, scoring or not, and it
 * is centred on the card, so it does not hint at what happened or to whom.
 */
export function KeyPlayPulse({ game }: { game: GameItem }) {
  const visible = useScoreVisible(game.id);
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    let nextId = 0;
    let timer: number | undefined;

    const unsubscribe = liveFeed.subscribe(game.id, (event) => {
      if (event.type !== 'keyPlay') return;
      setPulse({ id: nextId++, detail: `${event.label} · ${game[event.side].abbr}` });
      // A new key play restarts the hold, so banners never stack up.
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setPulse(null), tokenMs('--duration-pulse-hold'));
    });

    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [game]);

  const easeOut = tokenBezier('--ease-out');

  return (
    <AnimatePresence>
      {pulse && (
        <m.div key={pulse.id} className="key-play" exit={{ opacity: 0 }}>
          {/* A ring that flashes once around the whole card. */}
          <m.span
            className="key-play__flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: tokenSeconds('--duration-flash'), ease: 'easeOut' }}
          />
          <m.span
            className="key-play__banner"
            role="status"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: tokenSeconds('--duration-slow'), ease: easeOut }}
          >
            <span className="key-play__dot" />
            {visible ? pulse.detail : 'Something just happened'}
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
