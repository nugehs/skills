# Integration

Wiring the mascot into a real product so it reacts to actual events. The goal:
the character responds to "every meaningful moment" without ever being able to
break the host app.

## 1. Ship a self-contained component

One file (e.g. `buddy.js`) that, on load, injects its own CSS + inline SVG and
exposes a global API (`react`, `show`, `hide`, `wave`, `say`). No dependencies,
no build step. Scope all CSS classes with a prefix so they can't collide with the
host. See `assets/mascot-component.js`.

## 2. Find the real event sites

Read the host code and locate where meaningful things happen — don't guess. For a
quiz app that meant: the new-question function, the answer-check (right vs wrong
branches), the lesson/retry success, and the pass/fail screens. Grep for the
functions that change state, not just UI strings.

## 3. Map events → states, and place guarded calls

At each event site, add one line. **Always guard the call** so a missing or
broken component can never throw inside the host:

```js
try { if (window.Buddy) Buddy.react('thinking'); } catch (e) {}
```

Example map (learning app):
- new question shown        → `react('thinking')`
- correct answer            → `react('correct')` (every Nth in a row → `'streak'`)
- wrong answer              → `react('nearly')`  (encouraging)
- practice question nailed  → `react('correct')`
- passed / unlocked         → `react('powered')`
- failed                    → `react('nearly')` + a kind `say(...)`

## 4. Show only where it belongs

Hook the host's screen-switch function so the mascot shows on the relevant
screens and hides elsewhere; wave on entry to the main screen:

```js
if (['quiz','lesson','passed','failed'].includes(screen)) { Buddy.show(); if (screen==='quiz') Buddy.wave(); }
else Buddy.hide();
```

## 4b. Place it so it can't break the layout

Once a screen *should* show the mascot (§4), decide *where on it* the mascot
sits. That's set by how much room the screen has — not by taste; get it wrong and
the character pushes the real UI around. Two patterns:

- **Sparse screens** (welcome, result / celebration, empty states) — drop an
  inline host straight into the flow, or go big with a hero pose. There's room;
  let it be the centrepiece.
- **Dense screens** (a form, a quiz card with an input + keypad, anything inside
  a height-constrained or scrolling container) — **do not inject an inline block
  into the content flow.** A ~100px mascot wedged between elements pushes the real
  controls down and can force the card to overflow and scroll; on a fixed-height
  kiosk it can shove the submit button off-screen. Float it in a corner instead.

The corner pattern, done right:

```css
/* Anchor to a NON-clipping ancestor, not the scrolling card itself. */
.screen { position: relative; }          /* the card's container */
.mascotHost {                            /* one host, reused across screens */
  position: absolute; top: 8px; right: 8px;
  width: 96px; height: 108px; z-index: 6;
  pointer-events: none;                  /* taps pass straight through */
}
```

Two traps the corner avoids:
- **Speech-bubble clipping.** Setting only `overflow-y:auto` forces the computed
  `overflow-x` to `auto` too (CSS won't leave one axis `visible` beside a
  scrolling one), so the card becomes a scroll box that can't paint a child
  outside its edges — an in-card overlay gets its upward bubble cut off. Anchor
  the host to an *outer* element that doesn't clip, and the bubble renders over
  the background instead of being chopped at the card edge.
- **Blocking input.** `pointer-events:none` lets the mascot overlap a button
  without ever eating a tap.

Keep **one** host element and move the single instance into the active screen on
each switch (`attachTo`) — don't mint a copy per screen.

Whichever pattern you pick, prove it (see §6): the mascot must not introduce
overflow, scroll, or cover a control on the densest screen at the shortest
viewport you support.

## 5. Make it ship

- Add the `<script src="assets/buddy.js"></script>` tag (after the host script).
- **Watch for naive `<script>` extraction.** Adding this external tag can break
  host tooling that pulls the inline script with a *greedy*
  `/<script>([\s\S]*)<\/script>/` — the match now runs to the *last* `</script>`
  (yours), swallowing the closing tag and failing to parse ("Unexpected token
  '<'"). If a smoke test or build step does this, make it non-greedy
  (`[\s\S]*?`) or target the inline block specifically. Grep the host for
  `<script>` extraction before assuming the tag is harmless.
- If the project has a packager allow-list (e.g. electron-builder `build.files`,
  a manifest, a bundler config), **add the new asset to it** — otherwise it works
  in dev but is missing from the built app.
- Provide a standalone `demo.html` (loads the component, buttons for each state +
  a "play a flow" button) so the user can preview without launching the full app.

## 6. Verify

- `node --check` the component and any JSON you edited (e.g. `package.json`).
- Grep the host to confirm every intended hook is present.
- **Render it and check the layout didn't move.** Open the host (drive a browser
  to the real screens) and confirm the mascot introduced no overflow/scroll,
  pushed nothing off-screen, and covers no control — test the densest screen at
  the shortest viewport you support. `card.scrollHeight > card.clientHeight` is a
  fast programmatic regression check; the speech bubble must render unclipped.
- Re-run the host's smoke/test suite (see §5 for why your `<script>` tag can trip it).
- Note for the user: a previously *installed/built* app won't have the changes —
  they must run the dev build or rebuild to see them.

## Safety

Only ever read the host's code and add additive, guarded calls. Don't change
business logic. Keep every injected call wrapped in try/catch so the mascot is
strictly decorative from the host's perspective.
