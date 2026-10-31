Sirene is the visual language of a personal software blog, borrowed from the coliseum of Sirene in *Clair Obscur: Expedition 33*: a Belle Époque world built from silk, ribbons, gold thread and woven rugs. Think of the page as cloth. Text and UI stay quiet and editorial, and the decoration comes from **how the cloth is sewn together**: seams, embroidery, stitched patches and a rug's fringe.

## Principles

1. **Sewn, not drawn.** Separate things with gold-thread seams (`thread`), not grey rules or heavy shadows. A card is a patch stitched onto the page.
2. **One rose, used sparingly.** `rose` is the only action color: the primary button, links, the active nav item. Everything else is ivory, plum ink and gold.
3. **Editorial, slow.** A soft display serif over a warm grotesque, a 680px reading measure, and 96px between sections.
4. **Ornament at the edges.** Embroidery and rugs frame the content (hero foot, article end, footer). They never sit behind text.

## Voice

- First person, singular: "I tried…", "here's what broke". Address the reader as "you".
- Sentence case everywhere except `caption` eyebrows, which are uppercase.
- Titles can italicise one word for emphasis, e.g. "Roles are seams, *not* walls". That word turns `gold`.
- Textile metaphors are welcome in moderation ("baste first, sew later"). No emoji.

## Color

Two themes share every token name: **Silk** (light, the default) and **Coliseum night** (dark).

- Page: `surface-canvas`. Cards, nav, code: `surface-card`. Washes, tags, callouts, inline code: `surface-tint`. Footer: `surface-deep`.
- Text: headlines in `ink`, prose in `ink-soft`, dates and captions in `ink-muted`. Never pure black or grey.
- Action: `rose` fill with `on-rose` text. Links are `rose` with a dashed `thread` underline that turns solid on hover.
- Gold: `gold` is for text (eyebrows, the italic accent word). `thread` is for stitches, seams and fringe, never for body text.
- `teal` (the sea) is the secondary accent: code keywords, callout marks. `coral` and `rose-blush` are decoration only.
- Focus: a 2px solid `focus-ring` outline with a 2px offset on every interactive element.
- Every text token meets 4.5:1 on canvas, card and tint in both themes. `thread` meets 3:1 for marks.

## Typography

- **Display: Fraunces** (Google Fonts) at weight 500 with `SOFT 100`, which gives a warm, rounded stand-in for Mackinac. Styles: `display` 64px at −0.045em, `heading` 36px, `subheading` 22px. Italic accents use weight 400.
- **Text: Bricolage Grotesque** (Google Fonts, the face Fly.io calls "Fricolage"). Prose uses `body` 18/30 at the light weight 350 with slight positive tracking. Excerpts and UI use `body-sm`, standfirsts use `lede`, and eyebrows use `caption` (uppercase, 0.08em).
- **Code: JetBrains Mono** via the `code` style.
- Pairing rule: serif for headlines only, grotesque for everything else. Use negative tracking on the serif and positive tracking on small sans.

## Textile ornament

| Ornament | Class | Where |
|---|---|---|
| Running stitch | `.sr-seam` | Section breaks, under article headers |
| Floret divider | `.sr-divider` | End of article, hero to post list |
| Stitched patch | `.sr-stitched` | Post cards (dashed `thread` 8px inside the edge) |
| Cross-stitch band | `.sr-embroidery` | Once per page at most, `coral` |
| Kilim band + fringe | `.sr-kilim`, `.sr-fringe` | Footer only: the rug's end |

Don't use more than two ornament kinds in one viewport, and don't put ornament under text.

## Shape and space

- Spacing runs `space-1` (4) to `space-24` (96): 32px card padding (`space-8`) and 96px between sections (`space-24`).
- Radii: `radius-pill` for buttons, tags and nav; `radius-lg` for cards; `radius-md` for code and callouts; `radius-sm` for inline code.
- One shadow, `shadow-patch`, for cards and the nav pill. Anything else gets separation from tone or a seam.
- Layout: a 1080px max content width, a 680px reading column and a floating nav pill. Post grid has 2 columns down to 760px, then 1.

## Imagery

There's no illustration requirement. The textile ornament carries the mood. If you add images, use painterly or watercolour pieces in warm ivory, rose and gold, framed with `.sr-stitched`. Avoid stock photos and 3D renders. Never use game screenshots or official art: the palette and textures are an homage, not a reproduction.

## Iconography

Draw thin line icons (1.4–1.6px stroke, round caps) in `currentColor`. The floret is the site's one ornamental glyph. Arrows in buttons are 14px.

## Consuming in a blog

Load `components/bundle.css` (it imports the three Google Fonts) after the tokens. Put `class="sr"` on `<body>` and `data-theme="coliseum"` on `<html>` for dark mode (follow `prefers-color-scheme` by default). Component markup is plain HTML with no JavaScript, so it works in any static-site generator (Astro, Eleventy, Hugo, Next).
