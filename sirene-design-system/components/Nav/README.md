# Nav

The site header is a quiet bar. Its home link is a sewn-on button with the floret stitched in the middle, the links sit beside it, and theme and RSS icon buttons sit on the right, all resting on a running-stitch seam. There's no name, letter or title: the floret is the mark.

- **Markup:** `<header class="sr-header">` containing `a.sr-header__home` (floret SVG, `aria-label="Home"`), `nav.sr-header__links` with 2–4 links, and `.sr-header__tools` with `button.sr-icon-btn` (theme) and `a.sr-icon-btn` (RSS), each with an `aria-label`.
- **Not sticky.** It sits in normal flow at the top of the page and scrolls away with the content. Don't give it `position: sticky` or `fixed`.
- **Home button:** `surface-card` disc, `shadow-patch`, a dashed `thread` stitch 6px inside. The floret is `thread` with a `coral` centre, and it turns 45° on hover (off with reduced motion).
- **Current section:** set `aria-current="page"`. It shows in `rose` text over a solid `thread` underline.
- **Phones:** keep everything on one line; add a "Menu" button only once the links no longer fit at 375px.
- Same width as the content column (max 1080px), with no background of its own: the bar sits directly on `surface-canvas`.
