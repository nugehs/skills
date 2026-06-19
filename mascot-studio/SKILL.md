---
name: mascot-studio
description: >-
  Design and animate a professional, Duolingo-Duo-level brand mascot end to end —
  character concept, geometric construction, expression system, brand palette, an
  interactive animated component, and wiring it into a real product. Use this
  whenever the user wants to create, redesign, refine, name, or animate a mascot,
  character, "brand buddy", app character, logo creature, or animated avatar —
  even when they only say things like "make a mascot", "design a character",
  "give my app a personality", "our logo needs a face", "animate this character",
  or "make the character react to X". Strongly prefer this skill for any mascot
  or character-design task; it covers both the static design and the animation,
  so reach for it even if the user mentions only one half.
---

# Mascot Studio

A complete pipeline for creating a mascot that can carry a brand — the kind of
character that has a recognizable silhouette, a personality, a full sheet of
expressions, and motion that makes it feel alive. The north star is "Duo-level":
simple, modular, instantly readable, deeply on-brand.

This skill is for design work, which is subjective. Treat the phases below as a
dependable order of operations, not a straitjacket — skip ahead when the user
already has pieces, and always optimize for the user's actual product and taste.

## Core philosophy (the six principles)

A great mascot is not "a logo with a face." It works because of six things:

1. **Built from a small kit of simple shapes** with fixed proportions, so it
   stays on-model across thousands of poses.
2. **Rounded forms + one heavy, consistent outline** — friendly and reproducible.
3. **A silhouette that reads at a glance** — recognizable as a solid black shape.
4. **Personality over description** — it embodies the brand's attitude, it
   doesn't explain the product.
5. **An expression system, not one pose** — 6–12 states tuned to where the
   character will actually appear.
6. **Engineered for motion and reuse** — parts come apart so it can be posed,
   animated, and re-skinned cheaply.

Full explanation with the Duo case study: read `references/playbook.md`.

## The pipeline

Work through these phases. Each has a deliverable; later phases reuse earlier
ones. For any non-trivial phase, read the matching reference file before acting.

### Phase 0 — Brand fit (do this first, always)

The single most common mistake is designing a generic character that ignores the
product. Before drawing anything, anchor on the brand.

- If the user has a project/brand, read its brand assets: look for `BRAND.md`,
  a style guide, existing logo/icon SVGs, `package.json` (product name, audience),
  and any existing character hiding in the logo. The mascot should feel like the
  grown-up version of what's already there, not a stranger.
- Extract: exact palette (hex + token names), typography mood, audience/age,
  product voice, and the core metaphor (what the product *is*).
- If there is no brand yet, ask 2–3 sharp questions (audience, vibe, where the
  mascot will appear) and propose a metaphor.

Deliverable: a short brand-fit note — palette, audience, voice, and the chosen
character metaphor — that every later phase references.

### Phase 1 — Character concept

Pick *what the character is* from the product's own metaphor (a brain for a
learning app, a spark for an energy app, etc.). Avoid a generic blob unless the
brand truly has no metaphor. Give it a name.

Deliverable: one-line character definition (what it is, its personality, its
signature feature — e.g. "a friendly brain powered by a lightning bolt").

### Phase 2 — Construction & silhouette

Build the body from a few overlapping primitives with locked proportions, then
prove the silhouette. See `references/construction.md` for the SVG patterns,
the silhouette test, and palette handling (including dark-brand scenes).

Deliverable: a concept board (use `show_widget`) showing the hero pose, the
construction overlay, the one-color silhouette, and the palette; plus an
editable static `.svg` asset saved to the user's folder.

### Phase 3 — Expression system

Design 6–12 expressions, and — critically — tune them to the product's real
moments, not generic emotions. A learning app needs "thinking / correct /
nearly / powered-up / streak," not "sad / sleepy." See
`references/expression-system.md`.

Deliverable: an expression sheet (rows of faces) in the concept board.

### Phase 4 — Palette & style lock

Lock the exact fills, the outline weight, and the fold/detail treatment so every
future asset matches. Pull hex straight from the brand. See the palette section
of `references/construction.md`.

### Phase 5 — Interactive animation

Bring it alive: idle life (float/breathe/blink), optional cursor tracking,
hover/click response, the triggerable reactions from Phase 3, and entrance/exit.
Build it as a real, reusable component. See `references/animation.md` and the
template in `assets/mascot-component.js`.

Deliverable: an interactive `show_widget` demo, and a self-contained component
file the user can embed.

### Phase 6 — Integration

Wire the component into the user's product so it reacts to real events. See
`references/integration.md` for the safe-hooks pattern (guarded calls, a small
event→state map, show/hide per screen) and packaging notes.

Deliverable: the component added to the project, reaction calls placed at the
real event sites, a standalone preview page, and build-config updated so the
asset ships.

## Rendering approach

- Use **inline SVG** for the character. SVG is editable, scales, animates with
  CSS, and is the format real mascots ship in.
- Use **`show_widget`** to render concept boards and interactive demos inline so
  the user sees results immediately. Read the visualize `read_me` (`art` module
  for boards, `interactive` for the animated demo) before the first call.
- Also **save editable `.svg` / `.js` files** to the user's folder — the widget
  is a preview; the files are the deliverable.
- Keep the character **original**. Apply the principles; never trace or copy an
  existing brand's mascot (including Duo itself).

## Deliverables checklist

- [ ] Brand-fit note (palette, audience, voice, metaphor)
- [ ] Named character with a one-line definition
- [ ] Concept board: hero + construction + silhouette + palette
- [ ] Expression sheet tuned to the product's moments
- [ ] Editable static SVG asset
- [ ] Interactive animated demo + reusable component file
- [ ] Integration into the product (if there is one) + standalone preview
