# PostCard

A post in a list, sewn onto the page like a patch: `surface-card`, `radius-lg`, `shadow-patch`, and a dashed `thread` seam 8px inside the edge (`.sr-stitched`).

- **Markup:** `<article class="sr-card sr-stitched">` containing an `.sr-subheading` title whose `a.sr-card__link` stretches over the whole card, `.sr-card__excerpt`, and a `.sr-card__foot` meta row (date · reading time in `ink-muted`). One link per card, so screen readers hear the title, not the whole card; the focus ring sits on the card via `:has(.sr-card__link:focus-visible)`.
- No eyebrow: tags already say what the post is about.
- Titles may italicise one word — it turns `gold`.
- Grid: 2 columns ≥ 760px, 1 column below; 32px gap. Hover lifts 2px and turns the title `rose`.
- No cover images by default; the stitched frame is the decoration.
