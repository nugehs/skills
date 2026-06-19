# Animation

Make the mascot feel alive with layered motion. Build it as a real, reusable
component, not a throwaway. A working, parametric template is in
`assets/mascot-component.js` — adapt it rather than starting from scratch.

## The four motion layers

1. **Idle life** (always on): a gentle vertical float/bob, subtle body
   squash-stretch ("breathing"), and a blink every ~3–4s. This baseline is what
   sells "alive" — never ship a frozen mascot.
2. **Interaction response**: pupils that track the cursor (in the calm states),
   a slight squash on hover, a wiggle on click.
3. **Emotional reactions**: the Phase-3 states, triggered via a `react(state)`
   call — swap the visible face group, raise arms / brighten the signature
   feature / pulse a glow for the "hype" states.
4. **Entrance / exit**: a pop-in (scale from small with a slight overshoot) and
   an exit (bounce away), good for onboarding and screen transitions.

## Structure that makes this easy

Nest transform layers so independent animations don't fight over `transform`:

```
#root        (entrance/exit + wiggle via swapped classes)
  #bob       (idle float — its own CSS animation)
    #inner   (hover squash via a class)
      ...body, #torso (breathe), #signature, #armL/#armR, face groups
```

Each animated group needs `transform-box: fill-box` and a sensible
`transform-origin`. Drive everything with CSS classes + keyframes; use JS only to
toggle classes and to set pupil offset for tracking. Honour
`@media (prefers-reduced-motion: reduce)` by disabling the looping animations.

## The state API

Expose a tiny, predictable API (the template implements all of this):

- `react(state)` — show one face group, toggle hype extras (arms up, bright
  signature, glow pulse) for celebratory states.
- `show()` / `hide()` — fade/scale in and out.
- `wave()` — one-off arm wave.
- `say(text, ms)` — optional speech bubble in the brand voice.

Keep `react()` purely a state-setter: let the host product's flow drive the
sequence (e.g. answer → `correct`, then next question → `thinking`). Don't bury
auto-revert timers inside it — they fight the host's own timing.

## Preview

Render an interactive `show_widget` (visualize `read_me`, `interactive` module)
with buttons for every state plus wave/bounce, and idle + cursor tracking live,
so the user can play with it. Also save the component file to the user's folder
and a tiny standalone `demo.html` that loads it, so they can preview without any
build step.
