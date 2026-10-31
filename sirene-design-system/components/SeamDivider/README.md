# SeamDivider

The signature: gold-thread seams instead of grey rules — the way Sirene's coliseum is stitched together from cloth.

- **Running stitch** `<hr class="sr-seam">` — between sections and under the nav on article pages.
- **Floret divider** `<div class="sr-divider"><div class="sr-seam"></div>{floret svg}<div class="sr-seam"></div></div>` — ends an article, separates the hero from the post list. Floret strokes are `thread`, its centre `coral`.
- **Cross-stitch band** `<div class="sr-embroidery"></div>` — a 14px `coral` row of X stitches; at most once per page (hero foot or footer top).
- Decorative only: mark with `aria-hidden` / `role="presentation"` where they are not `<hr>`.
