# CommanderPlayPad Overhaul — Design

**Date:** 2026-07-06
**Status:** Approved by owner

## Goal

Modernize CommanderPlayPad in incremental, individually testable steps:
fix known issues, migrate fully to Svelte 5 runes, persist game state,
add poison counters and monarch tracking, and refresh the UI in a clean &
minimal direction.

**Target device:** one shared iPad lying flat on the table (4:3, matches the
existing 2048×1536 design canvas). The app must work fully offline.

**Delivery style:** step-by-step; the owner implements/tests/tweaks one
feature or fix at a time. Strategy is *foundation first*: architecture
migration, then fixes, then persistence, then features, then UI refresh —
nothing gets built twice.

## Architecture & state model

A new `src/lib/game.svelte.js` module is the single source of truth, using
Svelte 5 runes (`$state`) in a `.svelte.js` file. It exposes one `game`
object plus mutation functions:

- `settings`: `startingLife` (default 40), `startingTimeMinutes` (default 23)
- `players[4]`: `name`, `color`, `colorSecondary`, `life`,
  `timeRemainingSeconds`, `poison`, `commanderDamageGiven[4]`, `lifeHistory[]`
- `activePlayerIndex`: whose clock is running, −1 = none
- `monarchIndex`: −1 = none

**Derived, never stored:** `isDead(player)` = life ≤ 0 **or** poison ≥ 10
**or** timeRemaining = 0. Death styling and timer-eligibility read this;
nothing ever assigns a "dead" flag, eliminating drift between status class
and actual state.

**Single ticker:** one timestamp-based tick loop (comparing `Date.now()`
against turn start) replaces the per-player `setInterval` chains. This
survives browser timer throttling on iPad, keeps the 23-minute clocks
accurate, and also drives the decorative stopwatch hand.

**Components become thin views:**

- `+page.svelte` renders the 2×2 grid; no game logic, no `bind:this`
  method calls into children.
- `Player.svelte` reads/writes `game` directly.
- `createEventDispatcher` / event forwarding removed everywhere; callback
  props only where a child genuinely notifies a parent (name modal).
- `stores.js` is deleted once migration completes.

All components migrate to runes idioms: `$state`, `$derived`, `$props`,
`$effect` where needed.

## Fixes

| Issue | Resolution |
|---|---|
| Timer drift (`setInterval(1000)`) | Timestamp-based single ticker (above) |
| State lost on refresh | Full persistence (below) |
| Font Awesome CDN (offline breakage) | Replace with inline SVGs (gear, crown); no external requests |
| Duplicate `<meta viewport>` in `app.html` | Deduplicate |
| Commander damage cap relies on accidental `undefined` | Explicit clamp 0–21 in the game module |
| Commented-out "damage received" scaffolding | Removed (feature dropped by owner decision) |
| Resize listener never removed | Cleanup returned from `$effect`/`onMount` |
| `console.log` debug output | Removed |
| Dead code (`resetCommanderDamageGiven` on mount, unused imports) | Removed |
| Non-uniform scaling | **Kept.** 2048×1536 matches the iPad exactly; replacing it is churn with no benefit on the target device |
| Mid-game settings change | Explicitly defined: settings take effect on Restart only |

## Persistence

- The entire `game` object is saved to `localStorage` from a `$effect` on
  every change and restored on startup if present.
- After a reload, the game resumes **paused** (no clock silently burning),
  with all life/poison/damage/monarch/history intact and the previously
  active player remembered but stopped.
- Restart clears the saved game. Settings persist separately and survive
  across games.

## Poison counters

- Per-panel counter: icon + count with finger-sized +/− controls.
- Clamped 0–10. Poison does **not** reduce life (per Magic rules).
- At 10, the player is dead via computed `isDead` — same treatment as 0 life.
- Reset on Restart; persisted like all state.

## Monarch tracking

- Crown outline on every panel. Tap → that player becomes monarch (crown
  fills, subtle panel highlight); any previous monarch is cleared
  automatically (only one monarch).
- Tapping the reigning monarch's crown clears monarchy (monarchIndex = −1).
- Cleared on Restart; persisted.

## UI refresh — clean & minimal

A pure styling pass done **last**, after structure is stable:

- Near-black app background; player panels become flat, muted, darker
  tints of each player color instead of saturated fills.
- Typography-first hierarchy: life total is the hero, timer second, name
  third; poison / commander damage / crown are quiet, small elements.
  System font stack, consistent type scale, tabular numerals for all
  counters.
- Active player: slightly brighter panel + thin accent border. Stopwatch
  SVG kept but simplified/monochrome.
- Dead player: panel desaturates to grey, with a small indicator of cause
  (life / poison).
- Touch targets keep current generous sizes; borders become hairlines;
  rounded-corner usage made consistent.
- Settings overlay and name-change modal restyled to the same palette and
  type scale.

## Explicitly out of scope

- Commander damage *received* display (dropped)
- Support for player counts other than 4
- Per-player phone mode / networking
- Test framework introduction (manual testing per step; no test
  infrastructure exists today)

## Testing

No automated test infrastructure exists and none is added. Each
implementation step ends with a manual verification checklist run in the
browser (`npm run dev`), exercising the affected flow on a 4:3 viewport.
Persistence steps additionally verify reload-restore and Restart-clears
behavior.
