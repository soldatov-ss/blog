# PageBackground

A herringbone tweed texture, the zigzag weave of a classic jacket, that shows only at the top of a page (under the header) and the bottom (above the footer). It fades to plain `surface-canvas` behind the text.

- **Markup:** wrap everything inside `body.sr` in `<div class="sr-page">`. The texture is drawn on its `::before`, so there's no extra markup and the content stays clickable.
- **Fade length:** `--sr-bg-fade` (default `min(380px, 20%)`) sets how far the tweed reaches from each edge. The 20% cap keeps the two ends apart on short pages, so no per-page override is needed.
- **Colour:** `thread` at 34% strength in Silk and 24% in Coliseum night, where gold reads brighter. Text contrast is unchanged, because the tweed never reaches the reading column at strength.
- **Where:** article pages and the home page. Not inside cards or code blocks; they sit on top as clean patches.
- Don't combine it with the cross-stitch band in the same viewport.
