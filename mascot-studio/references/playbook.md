# The mascot playbook (the Duo case study)

Why Duolingo's owl works, and how to generalize it. Each principle is followed
by how to apply it.

## 1. Built from a small kit of simple shapes
Duo is a fixed set of geometric primitives — standardized body curvature, eye
size, wing placement. That modular "rig" lets the team draw thousands of poses
without the character drifting off-model.

Apply: define the body as a few overlapping circles/ellipses/rounded-rects with
locked positions and radii. Write them down. Every future asset reuses the same
numbers.

## 2. Rounded forms + one heavy consistent outline
Rounded shapes read as friendly and approachable; sharp angles read as
aggressive. A single thick, uniform outline makes the character pop and stay
reproducible at any size.

Apply: prefer curves. Use one outline weight everywhere (or, on a dark brand
background, a flat fill with no outline — let contrast do the work).

## 3. A silhouette that reads at a glance
Great mascots are recognizable as a solid black shape with zero interior detail.
Big eyes, simple body, a distinctive top feature (Duo's wing tufts) survive
shrinking to an app icon or a push notification.

Apply: always run the silhouette test (fill the whole character one flat color,
remove the face). If you can't tell what it is, simplify the outline or add one
distinctive signature shape.

## 4. Personality over description
The secret sauce. Duo embodies the brand's attitude (cheeky, funny,
passive-aggressive) rather than describing "education." It's a character with a
point of view, not a spokes-logo.

Apply: write the character's personality in one sentence and let it drive the
default expression and the copy in any speech bubbles. Match the product's voice.

## 5. An expression system, not one pose
Duo ships with dozens of emotional states — happy to reward, teary to guilt.
A sheet of 6–12 expressions carries a product through its first year and lets the
character live across the whole app and social.

Apply: design expressions for the product's real moments (see
`expression-system.md`). Reuse the same head; swap only eyes/mouth/accents.

## 6. Engineered for motion and reuse
The modular rig exists so animators can pose and animate fast (Duolingo even
built 20+ mouth shapes per character and drives them with a state machine).

Apply: structure the SVG so parts are separate groups with stable IDs
(`#eyes`, `#mouth`, `#armR`, `#bolt`…). Animate via CSS classes and a tiny
state API, never by redrawing.

## Universal sources for these principles
General mascot guidance converges on the same points: simple recognizable
silhouette, rounded/approachable forms, an expression range, brand alignment,
and scalability across full-color / mono / tiny / huge. When in doubt, optimize
for "readable as a 32px icon" and "obvious what it's feeling."
