import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { rails } from '../data/catalog';
import type { CatalogItem } from '../data/types';
import { GameStatus } from '../live/GameStatus';
import { Score } from '../live/Score';
import { useSettledFocus } from '../navigation/useSettledFocus';
import { tokenBezier, tokenPx, tokenSeconds } from '../styles/tokens';
import { ItemArt } from './poster/ItemArt';
import './Hero.css';

/**
 * The top of the screen: details of the focused item over a large backdrop
 * made from that item's poster art.
 *
 * It follows focus only after focus has rested (see useSettledFocus), so
 * moving quickly across a rail does not make it flicker.
 */
export function Hero() {
  const position = useSettledFocus();
  const focusedItem = rails.find((rail) => rail.id === position.rowId)?.items[position.index];

  // Focus can rest on things that are not catalog items (the top bar, later).
  // The hero then keeps showing the last item instead of going empty.
  const [item, setItem] = useState(focusedItem);
  if (focusedItem && focusedItem !== item) setItem(focusedItem);
  if (!item) return null;

  const easeOut = tokenBezier('--ease-out');

  return (
    <section className="hero" aria-label="Focused title">
      {/* Backdrop: old and new overlap and crossfade. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={item.id}
          className="hero__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: tokenSeconds('--duration-hero'), ease: 'easeInOut' }}
        >
          <ItemArt item={item} backdrop />
        </motion.div>
      </AnimatePresence>

      {/* Scrims sit above every backdrop so text stays readable on any art. */}
      <div className="hero__scrim" />

      {/* Text: two overlapping blocks of text are unreadable, so the old one
          leaves quickly before the new one arrives ("wait" mode). */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={item.id}
          className="hero__content"
          initial={{ opacity: 0, y: tokenPx('--hero-text-rise') }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: tokenSeconds('--duration-slow'), ease: easeOut },
          }}
          exit={{
            opacity: 0,
            transition: { duration: tokenSeconds('--duration-fast'), ease: easeOut },
          }}
        >
          <HeroDetails item={item} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function HeroDetails({ item }: { item: CatalogItem }) {
  if (item.kind === 'game') {
    return (
      <>
        <p className="hero__kicker">
          <span className="hero__live">Live</span>
          {item.league.name}
        </p>
        <h1 className="hero__title">
          {item.home.name} <span className="hero__versus">vs</span> {item.away.name}
        </h1>
        <ul className="hero__meta">
          <li>
            <GameStatus gameId={item.id} />
          </li>
          <li className="hero__scoreline">
            {item.home.abbr} <Score gameId={item.id} side="home" />
            <span className="hero__versus">:</span>
            <Score gameId={item.id} side="away" /> {item.away.abbr}
          </li>
          <li>{item.venue}</li>
        </ul>
        <p className="hero__synopsis">{item.synopsis}</p>
      </>
    );
  }

  return (
    <>
      <p className="hero__kicker">{item.genre}</p>
      <h1 className="hero__title">{item.title}</h1>
      <ul className="hero__meta">
        <li>{item.year}</li>
        <li>
          <span className="hero__rating">{item.rating}</span>
        </li>
        <li>{item.length}</li>
        {item.progress && <li>{item.progress.label}</li>}
      </ul>
      <p className="hero__synopsis">{item.synopsis}</p>
    </>
  );
}
