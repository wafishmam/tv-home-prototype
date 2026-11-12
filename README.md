# Nightjar: a TV home screen prototype

A high fidelity front end prototype that explores one question:

> How should a TV home screen show live sports to someone who does not want the score spoiled?

It is a single TV-style home screen with a "Live now" rail and a spoiler free mode. It is not a full app: there is no playback, no backend and no real data. The brand, titles, teams and leagues are all fictional.

This prototype was built with [Claude Code](https://claude.com/claude-code). I directed the work step by step and reviewed each step in the browser before it was committed. The commit history follows those steps.

## Setup

Requires Node 20 or later.

```bash
npm install
npm run dev
```

Open the URL that Vite prints (usually http://localhost:5173) and click the page once so it has keyboard focus.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run dev -- --host` | Same, and reachable from a phone on the same network |
| `npm run typecheck` | TypeScript strict type check |
| `npm run build` | Type check, then build a static site into `dist/` |
| `npm run preview` | Serve the built site locally |

### Controls

| Input | Action |
| --- | --- |
| Arrow keys | Move focus |
| Enter or Space | Select the focused item |
| Escape or Backspace | Go back: close the panel, or return to the start of the rail |
| Mouse | Hover to focus, click to select |
| Touch | An on-screen direction pad with OK and Back appears on touch devices |

### Deploying

The build output is a static site with no server and no environment variables. On Vercel, import the repository and keep the defaults (framework preset Vite, build command `npm run build`, output directory `dist`).

### Development views

These are aids for checking the work. Add them to the URL.

| Flag | Shows |
| --- | --- |
| `?tokens` | The design tokens: colour, type, spacing, radius, motion |
| `?posters` | Every card in the catalog on one scrolling page |
| `?feed` | The mock live feed as a table, with an event log |
| `?guides` | The safe area and current scale, drawn over the TV screen |
| `?touch` | Forces the touch controls on without a touch screen |

## What this prototype explores

### What was built

- A fixed 1920 by 1080 stage that scales to fit the browser window, like a TV screen.
- A hero that shows the focused item's title, metadata and synopsis over a backdrop made from that item's poster art.
- Four rails: "Live now", "Continue watching", and two genre rails.
- Poster art generated in SVG, in six styles keyed by genre. Details are seeded from each item's id, so every poster is different and stays the same between visits.
- A mock live data feed for six games across three fictional sports, emitting clock, period, score and key play events.
- Spoiler free mode, switched from the top bar. It is on at first load and is held in memory only, so it resets on reload.
- With the mode on:
  - Scores are not rendered. Cards show a neutral bar of one fixed size, the hero says "Score hidden", and the accessible name leaves the score out.
  - A key play flashes the card and shows a banner reading "Something just happened". The pulse is the same whether or not the play changed the score.
  - Enter on a live card opens a panel with "Watch from start" and "Reveal score". Reveal applies to that one game.
  - Turning the mode off and on again clears earlier reveals.
- With the mode off, scores are shown and roll to the new number when they change, and key play banners name the play and the team.
- An on-screen direction pad for touch devices.
- Reduced motion support: when the system setting is on, movement is removed and fades are kept.

TODO (me): Why I chose live sports spoilers as the feature question.

TODO (me): Why a hidden score is replaced by a neutral bar, and what else I considered.

TODO (me): Why key plays pulse without saying what happened, and the trade-off between awareness and spoiling.

TODO (me): Why reveal is per game instead of global, and why the panel offers "Watch from start" first.

TODO (me): Why the mode is on by default in this prototype, and what the default should be in a real product.

### How navigation works

The spatial navigation is written from scratch in `src/navigation/`. No navigation library is used.

- **The model.** The screen is a vertical list of rows, and each row is a horizontal list of items. Focus is "which row, and which item in that row". Left and Right change the item. Up and Down change the row. (`focusStore.ts`)
- **Rail memory.** The store keeps the focused index of every row, not only the current one. Moving to a row lands on the index it had last time.
- **One entry point for input.** Keys, the touch pad and the pointer all end up in the same store through `dispatch(action)`. (`FocusContext.tsx`)
- **Per-item subscriptions.** Each card subscribes to its own look (focused, shifted aside, passed, or at rest) with `useSyncExternalStore`. A move re-renders the two cards that changed, not the screen. (`useFocusable.ts`)
- **Anchored scrolling.** A rail scrolls by translating its track so the focused card sits on a fixed line at the left. The stack of rails scrolls the same way so the focused rail sits under the hero.
- **Focus treatment.** The focused card scales from its left edge and gains a ring and a shadow, and later cards shift right by the width it gained. Only `transform` and `opacity` change. These are CSS transitions at 200 ms with a single ease-out curve.
- **Pointer.** Hover moves focus but does not scroll, so cards do not slide out from under the cursor. The next key press re-anchors the rail.
- **Held keys.** A held arrow key is limited to one move every 110 ms.
- **Hero dwell.** The hero follows focus only after focus has rested for 300 ms. (`useSettledFocus.ts`)
- **Modal input.** The action panel captures navigation input while it is open. Focus underneath does not move, so closing the panel returns the viewer to the same card.
- **Accessibility.** Real DOM focus follows the focused item with a roving `tabindex`, every focusable item has an accessible name, and the focus ring is drawn from focus state so it is visible at all times.

TODO (me): Why the focused card stays at a fixed anchor instead of moving across the screen.

TODO (me): How I arrived at the timing values (200 ms movement, 300 ms hero dwell, 110 ms key repeat).

TODO (me): What I would change about navigation after using it on a real TV with a remote.

### How the live data is structured

- `src/data/liveFeed.ts` defines a `LiveFeed` interface with `getSnapshot(gameId)` and `subscribe(gameId, listener)`, which returns an unsubscribe function. Every event carries the full game snapshot.
- `createMockFeed` implements that interface with a timer. `src/live/feed.ts` is the single line that chooses the implementation.
- Two things in the mock are for demonstration and are not realistic: scoring chances are raised so something happens within a minute, and a finished game restarts after 20 seconds.

### What I would test with users

TODO (me): The questions I would want answered, for example whether viewers notice and understand the pulse.

TODO (me): Who I would test with, and how.

TODO (me): What result would make me change the design.

### Known limits

- Playback is not implemented. The play choices in the panel only close it.
- It has been checked in a desktop Chromium browser and in phone emulation. It has not been run on a physical TV, a TV browser or a physical phone.
- The hero is not announced to screen readers when it changes; the focused card's name is.
- At the end of a rail, the last card sits alone at the left anchor with empty space to its right. This follows from keeping the anchor fixed.

## Stack

- Vite, React 19 and TypeScript in strict mode
- Plain CSS, with every size, colour and duration defined once in `src/styles/tokens.css`
- The `motion` library for enter and exit animation (hero crossfade, score changes, panel, pulses)
- Self-hosted variable fonts through `@fontsource`: Bricolage Grotesque and Instrument Sans

## Project structure

```
src/
  styles/       design tokens and base styles
  stage/        the scaled 1920 x 1080 stage
  navigation/   focus store, context and hooks
  data/         fictional catalog and the live feed
  live/         live cards, spoiler free mode, action panel
  components/   hero, rails, cards, top bar, poster art
  touch/        on-screen direction pad
  dev/          the development views listed above
```
