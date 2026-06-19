# Expression system

The expression sheet is where a mascot stops being a logo and becomes a
character. Two rules: reuse the head, and tune the set to the product.

## Reuse the head, swap the face

Keep the body, belly, cheeks, signature feature, and feet identical across every
expression. Change only: eyes, mouth, eyebrows, and small per-state accents
(sparkles, sweat bead, stars, a "?"). This is the modular rig — it guarantees
consistency and makes animation trivial (you're toggling small groups).

Face part vocabulary you can mix and match:
- **Eyes**: open (white + pupil + highlight), happy arcs `^^`, wide (surprised),
  half/への (sleepy), heart pupils (love), star eyes (excited/streak),
  sunglasses (cool), looking-up (thinking).
- **Mouth**: small smile, open grin, tiny "o", flat/pursed (thinking),
  gentle optimistic curve (encouraging), open celebrate.
- **Brows**: one raised (curious/encouraging), both up (surprised), angled.
- **Accents**: sparkles, sweat bead, floating stars, "?", "z z z", radiating
  lines, a brightened signature feature.

## Tune the set to the product's real moments

Generic emotion sets (happy/sad/angry/sleepy) waste the mascot. Map states to
where the character actually appears and what the user is doing.

**Example — a learning/quiz app:**
Input: the character appears during questions, on right/wrong answers, and at a
win screen.
Output set: `ready` (idle), `thinking` (a question is shown), `correct`
(right answer), `nearly` (wrong — encouraging, NOT sad, matching a "never scold"
voice), `powered-up` (passed / reward unlocked), `streak` (consecutive wins).

**Example — a productivity app:** `idle`, `focused`, `done` (task complete),
`celebrate` (milestone), `nudge` (reminder), `sleepy` (overdue/inactive).

**Example — a finance app:** `idle`, `up` (gains), `down` (losses — calm, honest,
not panicked), `goal-hit`, `thinking` (analyzing).

The point: derive the set from the product's event list, then design a face for
each. 6–12 is the right range — enough to feel alive, few enough to stay
coherent. Echo the product's voice in any speech-bubble copy.

## Put it on the board

Render the set as rows of small heads (same recipe, reduced scale) in the concept
board, each labeled with its product moment, so the user can approve the range.
