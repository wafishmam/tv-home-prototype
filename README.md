# Nightjar: a TV home screen prototype

A high fidelity front end prototype that explores one question:

> How should a TV home screen show live sports to someone who does not want the score spoiled?

It is a single TV-style home screen with a "Live now" rail and a spoiler free mode. It is not a full app: there is no playback, no backend and no real data. The brand, titles, teams and leagues are all fictional.

This prototype was built with [Claude Code](https://claude.com/claude-code).

## Setup

Requires Node 20 or later.

```bash
npm install
npm run dev
```

Open the URL that Vite prints (usually http://localhost:5173) and click the page once so it has keyboard focus.

| Input | Action |
| --- | --- |
| Arrow keys | Move focus |
| Enter or Space | Select the focused item |
| Escape or Backspace | Go back: close the panel, or return to the start of the rail |
| Mouse | Hover to focus, click to select |
| Touch | An on-screen direction pad with OK and Back |

`npm run build` type checks and builds a static site into `dist/`. It deploys to Vercel with the default Vite settings.

## What this prototype explores

### What was built

- A fixed 1920 by 1080 stage that scales to fit the browser window, like a TV screen.
- A hero that shows the focused item's title, metadata and synopsis over a backdrop made from its poster art.
- Four rails: "Live now", "Continue watching", and two genre rails.
- Poster art generated in SVG, in six styles keyed by genre.
- A mock live data feed for six games, emitting clock, period, score and key play events.
- Spoiler free mode, switched from the top bar and held in memory for the session only.

With spoiler free mode on:

- Scores are not rendered. Cards show a neutral bar of one fixed size, and the hero says "Score hidden".
- A key play flashes the card with a "Something just happened" banner. It looks the same whether or not the play changed the score.
- Enter on a live card opens a panel with "Watch from start" and "Reveal score". Reveal applies to that one game.

With the mode off, scores are shown and roll to the new number when they change.

### How navigation works

The spatial navigation is written from scratch in `src/navigation/`, with no navigation library.

- **Model.** The screen is a list of rows, and each row is a list of items. Focus is "which row, and which item in it". Left and Right change the item; Up and Down change the row.
- **Rail memory.** The store keeps the focused index of every row, so returning to a rail lands on the card it had last time.
- **Anchored scrolling.** Rails scroll so the focused card always sits on a fixed line at the left.
- **Focus treatment.** The focused card scales up with a ring, and later cards shift aside. Only `transform` and `opacity` animate, at 200 ms with no bounce.
- **Hero dwell.** The hero follows focus only after it has rested for 300 ms, so it does not flicker during fast movement.
- **One input path.** Keys, the touch pad and the pointer all go through the same `dispatch(action)` function.
- **Accessibility.** Real DOM focus follows the focused item, every focusable item has an accessible name, and the focus ring is always visible. Reduced motion is respected.

### Known limits

- Playback is not implemented. The play choices in the panel only close it.
- It has not been run on a physical TV or in a TV browser.

## Stack

- Vite, React 19 and TypeScript in strict mode
- Plain CSS, with design tokens in `src/styles/tokens.css`
- The `motion` library for enter and exit animation
- Self-hosted variable fonts through `@fontsource`

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
  dev/          development views: add ?tokens, ?posters, ?feed, ?guides or ?touch to the URL
```
