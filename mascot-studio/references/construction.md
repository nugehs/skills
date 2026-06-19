# Construction, silhouette & palette

How to build the character body in SVG, prove it reads, and lock its colors.

## Build from primitives with locked proportions

Compose the body from a few overlapping shapes that share one fill. Same fill +
overlap = a clean union with no internal seams (so don't stroke the individual
shapes; add detail lines separately on top).

A reliable recipe for a rounded creature/head:
- a rounded-rect or ellipse for the main mass,
- a few circles across the top for a bumpy "crown" / signature feature,
- two side circles for cheeks/ears,
- a lower ellipse for the belly/jaw.

Then add, as separate elements on top:
- **detail lines** (brain folds, fur, seams) as `stroke` paths in a darker shade,
- **a signature feature** (bolt, tuft, antenna, horn) — this is what makes the
  silhouette unique,
- the **face** (see expression-system.md),
- small **arms** as rotated ellipses (give them stable IDs for waving),
- a soft **glow/shadow** ellipse for grounding.

Write the key coordinates down (centers + radii). Reuse them verbatim for every
expression and the animated version — that's what keeps it on-model.

## The silhouette test (do not skip)

Duplicate the whole character, set every shape to one flat color, remove the
face and detail lines. Look at it small. It must be obviously *what it is* and
distinct from a plain circle. If not: exaggerate the signature feature, or
simplify competing bumps. Put this silhouette in the concept board as proof.

## Concept board layout

Render with `show_widget` (read the visualize `read_me`, `art` module first).
A strong board stacks: hero pose → construction overlay (faint body + dashed
primitive circles) → one-color silhouette → expression sheet → palette swatches.
Keep it on the brand's background color.

## Palette handling

- Pull **exact hex** from the brand (e.g. a `BRAND.md` token table). Use the
  token names as swatch labels so the design ties back to the system.
- A typical kit: a primary fill, a darker shade of it for outlines/detail, 1–2
  accent colors for states (success/celebrate, error/encourage), and an ink
  color for eyes/mouth.
- **Dark-brand scenes** (navy/black backgrounds): hardcode all hex and do NOT
  use theme-reactive color classes — the scene must not invert in dark mode.
  Make the silhouette a near-white or bright fill so it reads on the dark ground.
  Put text labels in a light brand color so they stay legible.
- Light/neutral brands: a flat fill with a heavier outline reads best.

## Editable asset

Always also save a standalone `.svg` of the hero pose to the user's folder, with
a header comment listing the palette and labeling each fill, so they (or you,
later) can recolor and re-pose it. A starter is in `assets/mascot-template.svg`.
