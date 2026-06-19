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

## 5. Make it ship

- Add the `<script src="assets/buddy.js"></script>` tag (after the host script).
- If the project has a packager allow-list (e.g. electron-builder `build.files`,
  a manifest, a bundler config), **add the new asset to it** — otherwise it works
  in dev but is missing from the built app.
- Provide a standalone `demo.html` (loads the component, buttons for each state +
  a "play a flow" button) so the user can preview without launching the full app.

## 6. Verify

- `node --check` the component and any JSON you edited (e.g. `package.json`).
- Grep the host to confirm every intended hook is present.
- Note for the user: a previously *installed/built* app won't have the changes —
  they must run the dev build or rebuild to see them.

## Safety

Only ever read the host's code and add additive, guarded calls. Don't change
business logic. Keep every injected call wrapped in try/catch so the mascot is
strictly decorative from the host's perspective.
