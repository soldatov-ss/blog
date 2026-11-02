# Footer

The page ends the way it starts: a running-stitch seam, then sewn-on pieces sitting on the tweed. From left to right: the floret home button, a stitched label of links, a small "© year" label, and a back-to-top button.

- **Markup:** `<footer class="sr-footer">` containing `a.sr-header__home` (floret, `aria-label="Home"`), `nav.sr-header__links` (`aria-label="Elsewhere"`, 2–4 links such as RSS, GitHub, LinkedIn), `span.sr-footer__label` (© year), and `a.sr-icon-btn` linking to `#top` (`aria-label="Back to top"`).
- It reuses the header's parts on purpose, so the two always match. The footer's links are 14px; the seam sits on top instead of below.
- **On the tweed:** like the header, nothing sits directly on the texture. Every item is a solid `surface-card` patch with a dashed `thread` stitch.
- Same width as the content column (max 1080px), with no background of its own.
- **Phones:** keep it on one row if it fits; otherwise wrap the © label under the links.
