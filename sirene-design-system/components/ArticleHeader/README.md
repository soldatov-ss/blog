# ArticleHeader

The top of an article: eyebrow, `display` title (one italic word in `gold`), `lede`, byline meta, then a running-stitch seam.

- **Markup:** `<header class="sr-article-head">` with `.sr-eyebrow`, `h1.sr-display`, `p.sr-lede`, `.sr-byline` of `.sr-meta` spans, `<hr class="sr-seam">`.
- Below 640px swap `sr-display` for `sr-heading`.
- Left-aligned; max width 760px. Body text that follows is 680px.
