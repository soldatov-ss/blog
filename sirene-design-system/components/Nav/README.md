# Nav

The site header is a quiet bar. Its home link is a sewn-on button with the floret stitched in the middle, the links sit beside it, and theme and RSS icon buttons sit on the right, all resting on a running-stitch seam. There's no name, letter or title: the floret is the mark.

- **Markup:** `<header class="sr-header">` containing `a.sr-header__home` (floret SVG, `aria-label="Home"`), `nav.sr-header__links` with 2–4 links, and `.sr-header__tools` with `button.sr-icon-btn` (theme) and `a.sr-icon-btn` (RSS), each with an `aria-label`.
- **Not sticky.** It sits in normal flow at the top of the page and scrolls away with the content. Don't give it `position: sticky` or `fixed`.
- **Home button:** `surface-card` disc, `shadow-patch`, a dashed `thread` stitch 6px inside. The floret is `thread` with a `coral` centre, and it turns 45° on hover (off with reduced motion).
- **On the tweed:** every header element is a solid patch sewn onto the texture. The links sit on a `surface-card` label with a dashed `thread` stitch, and the theme and RSS buttons are `surface-card` discs with `ink` icons. Never place bare text or icons directly on the tweed.
- **Current section:** set `aria-current="page"`. It shows as a `rose-blush` chip with `ink` text inside the label; hover turns other links `rose`.
- **Phones:** keep everything on one line: the label tightens below 640px and again below 375px, so all links fit down to 320px. Add a "Menu" button only if more links are added and they stop fitting.
- Same width as the content column (max 1080px), with no background of its own: the bar sits directly on `surface-canvas`.
