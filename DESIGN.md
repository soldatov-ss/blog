---
name: Sirene
description: The page is cloth; seams, patches and gold thread hold a quiet editorial blog together.
colors:
  rose: "light-dark(#a8435a, #ef94a2)"
  on-rose: "light-dark(#fffaf3, #1b1117)"
  rose-blush: "light-dark(#f3d3cf, #4a2632)"
  teal: "light-dark(#24686a, #80c9c2)"
  gold: "light-dark(#86601c, #e2bb6a)"
  thread: "light-dark(#a37632, #c99a4c)"
  coral: "light-dark(#e58a73, #d97a66)"
  surface-canvas: "light-dark(#faf4ec, #1b1117)"
  surface-card: "light-dark(#fffaf3, #251820)"
  surface-tint: "light-dark(#f3e6dc, #33212b)"
  ink: "light-dark(#2c1822, #f7ece3)"
  ink-soft: "light-dark(#5a4250, #dcc7c9)"
  ink-muted: "light-dark(#745d6a, #ab949d)"
  hairline: "light-dark(#e8d8c6, #3d2a33)"
  focus-ring: "light-dark(#a8435a, #ef94a2)"
typography:
  display:
    fontFamily: "Fraunces, 'Iowan Old Style', Georgia, serif"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: "68px"
    letterSpacing: "-0.045em"
    fontVariation: "'SOFT' 100"
  headline:
    fontFamily: "Fraunces, 'Iowan Old Style', Georgia, serif"
    fontSize: "36px"
    fontWeight: 500
    lineHeight: "44px"
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Fraunces, 'Iowan Old Style', Georgia, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: "30px"
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "'Bricolage Grotesque', 'Avenir Next', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 350
    lineHeight: "32px"
    letterSpacing: "0.01em"
  body:
    fontFamily: "'Bricolage Grotesque', 'Avenir Next', system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 350
    lineHeight: "30px"
    letterSpacing: "0.012em"
  body-sm:
    fontFamily: "'Bricolage Grotesque', 'Avenir Next', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0.02em"
  label:
    fontFamily: "'Bricolage Grotesque', 'Avenir Next', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 550
    lineHeight: "18px"
    letterSpacing: "0.08em"
  code:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  sm: "4px"
  md: "10px"
  lg: "18px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.on-rose}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
  button-outline:
    textColor: "{colors.rose}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
  tag:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "32px"
  nav-label:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "5px 6px"
  nav-link-current:
    backgroundColor: "{colors.rose-blush}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  icon-button:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "40px"
  callout:
    backgroundColor: "{colors.surface-tint}"
    rounded: "{rounded.md}"
    padding: "24px 24px 24px 64px"
  code-block:
    backgroundColor: "{colors.surface-card}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
---

# Design System: Sirene

The source of truth is `sirene-design-system/` (tokens in `tokens.css`, components in `components/bundle.css`, rules in its README). This file summarises it for design tools; when they disagree, the code wins and this file gets refreshed.

## Overview

**Creative North Star: "The Sewn Page"**

The page is cloth. Sirene borrows from the coliseum of Sirene in *Clair Obscur: Expedition 33*, a Belle Époque world of silk, ribbons and gold thread, and turns it into a quiet editorial reading surface. Text and controls stay calm; the character comes from how the cloth is sewn together: running-stitch seams instead of rules, cards as patches stitched onto the page, a herringbone tweed at the page's top and bottom edges.

Density is low and the pace is slow: a 680px reading column, 96px between sections, a soft display serif over a warm grotesque. Ornament lives at the edges and never behind text at full strength. Anything that sits on the tweed is a solid sewn-on patch, so it stays readable.

The palette is an homage, not a reproduction: no game screenshots, official art, stock photos or 3D renders.

**Key Characteristics:**
- Gold-thread stitches (dashed `thread`) separate and frame things; grey rules and heavy shadows don't.
- One action colour, rose, used sparingly.
- Ivory silk by day (Silk), plum night (Coliseum night); every token has both.
- Ornament frames the content and fades away behind it.
- Motion is small and textile: a thread pulled through a link stitch, a floret turning on the home button.

## Colors

Warm ivory and plum, one rose for action, gold for thread and a sea teal as the quiet second accent. Each token is one `light-dark()` pair; the theme flips by `color-scheme`, following the OS unless the reader pins one.

### Primary
- **Coliseum Rose** (`rose`): the only action colour. Primary button fill, link text, focus ring. Text on it is `on-rose`.
- **Blush Ribbon** (`rose-blush`): the current page's chip in the nav, text selection. Decoration and state only, never text.

### Secondary
- **Sirene Sea Teal** (`teal`): code keywords and callout marks.

### Tertiary
- **Gold Leaf** (`gold`): gold *text* (labels, small accents).
- **Gold Thread** (`thread`): stitches, seams, dashed outlines, the tweed and link underlines. Meets 3:1 for marks; never body text.
- **Coral Embroidery** (`coral`): the cross-stitch band only. Decoration.

### Neutral
- **Silk Canvas** (`surface-canvas`): the page.
- **Patch Ivory** (`surface-card`): cards, code blocks, header and footer patches, icon buttons.
- **Linen Wash** (`surface-tint`): tags, callouts, inline code.
- **Plum Ink** (`ink`): headlines and strong text.
- **Soft Plum** (`ink-soft`): prose.
- **Faded Plum** (`ink-muted`): dates, meta, captions.
- **Hairline** (`hairline`): the rare structural border (code blocks).

### Named Rules
**The One Rose Rule.** Rose is the only action colour: the primary button, links, the focus ring. If something rose isn't clickable or focused, it's wrong.

**The No Grey Rule.** Text is plum ink in three strengths, never black or grey. Every text token meets 4.5:1 on canvas, card and tint in both themes.

## Typography

**Display Font:** Fraunces at weight 500 with `SOFT 100` (fallback Iowan Old Style, Georgia)
**Body Font:** Bricolage Grotesque (fallback Avenir Next, system-ui)
**Label/Mono Font:** JetBrains Mono for code only

**Character:** A soft, rounded serif for headlines over a warm, slightly quirky grotesque. The serif carries the Belle Époque warmth; the grotesque keeps the engineering prose plain and easy.

### Hierarchy
- **Display** (500, 64px, 68px): page titles and the home hero. Tight negative tracking.
- **Headline** (500, 36px, 44px): section headings like "More essays" and article H2s.
- **Title** (500, 22px, 30px): card titles and article H3s.
- **Lede** (350, 20px, 32px): standfirsts under a title.
- **Body** (350, 18px, 30px): article prose, held to a 680px column.
- **Body small** (400, 15px, 24px): excerpts and UI text, including nav links.
- **Label** (550, 12px, 0.08em, uppercase): meta lines such as dates, reading time, "Part 3 of 6", tags.

### Named Rules
**The Serif Ceiling Rule.** The serif is for headlines only; everything else is the grotesque, and code is mono. Negative tracking on the serif, positive tracking on small sans.

**The No Gilded Italic Rule.** Headings never italicise a word and turn it gold for emphasis. (The design system README once suggested it; the blog owner rejected it.)

## Layout

A 1080px content width with 24px side gutters, and a 680px reading column for prose and article heads. Sections are 96px apart (64px on phones); cards pad 32px. On wide screens (1200px and up) an article's contents list sits in a left rail; below that it collapses into a "Contents" disclosure above the text. The post grid is 2 columns down to 760px, then 1.

The header is not sticky: the floret home button, a pill label holding the section links, and the theme button, sitting on the tweed above a running-stitch seam. The footer mirrors it below a seam. On phones the link label tightens (below 640px and again below 375px) so all three links fit down to 320px without a menu.

The tweed (`.sr-page`) wraps header, main and footer. It shows at full strength at the top and bottom and fades to plain canvas over `min(380px, 20%)` of the page height, so on short pages it never meets behind the text.

## Elevation & Depth

Depth is textile, not material. Things are separated by seams and tone; the only shadow is the soft lift of a patch sitting on the cloth.

### Shadow Vocabulary
- **Patch** (`shadow-patch`: a 1px hairline plus a soft 10px/24px drop, both tinted plum): cards, the header and footer pieces, icon buttons. Nothing else.

### Named Rules
**The One Shadow Rule.** Only `shadow-patch` exists. If something needs separation and isn't a patch, use a seam or a tint.

## Shapes

Soft and sewn. Pills for anything you tap that isn't a card (buttons, tags, nav links, icon buttons, the nav label); large rounded corners for cards (18px); medium for code and callouts (10px); small for inline code (4px). The recurring silhouette is a shape with a dashed `thread` stitch drawn just inside its edge: 8px inside on cards, 4–6px inside on pills and circles. Stitches are outlines with a negative offset, so focus replaces them with the 2px solid focus ring.

## Components

### Buttons
Calm pills; the stitch makes them feel sewn rather than printed.
- **Shape:** pill (9999px), 10px × 22px padding, 15px medium sans with slight tracking.
- **Primary:** rose fill, `on-rose` text, with a dashed `on-rose` stitch 5px inside the edge.
- **Outline:** rose text and 1.5px rose border on transparent.
- **Ghost:** ink text, no fill, tight padding.
- **Hover / Focus:** colour fades over 150ms; focus is the 2px `focus-ring` outline, 2px offset.

### Chips (tags)
- **Style:** `surface-tint` pill, `ink-soft` uppercase label text, dashed `thread` stitch 4px inside.
- **State:** tags link to tag pages; the current section in the nav uses a `rose-blush` chip with `ink` text.

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** `surface-card` on canvas.
- **Shadow Strategy:** `shadow-patch` (see Elevation).
- **Border:** none; a dashed `thread` stitch 8px inside the edge.
- **Internal Padding:** 32px.
- **Behaviour:** the title link stretches over the whole card; on hover the card lifts 2px over 200ms and the title turns rose.

### Navigation
- **Style:** floret home button (48px circle patch), a `surface-card` pill label holding the links, a 40px circle theme button. All three wear the dashed stitch and `shadow-patch`.
- **Links:** 15px sans, `ink-soft`, rose on hover (150ms), current page as a `rose-blush` chip with `ink` text.
- **Mobile:** the label tightens; no menu button while there are three links.
- **Footer:** the same parts: floret home, a label of RSS/GitHub/LinkedIn/dev.to, a `© year` patch, and a back-to-top icon button.

### Links (signature)
- Rose text over a dashed `thread` stitch (5px dash, 3px gap, 1.5px high). On hover a solid thread is pulled through it left to right over 300ms (`cubic-bezier(0.16, 1, 0.3, 1)`); with reduced motion it turns solid at once. In high-contrast mode and print it falls back to a real underline.

### Seams and dividers (signature)
- **Running stitch** (`.sr-seam`): a 2px dashed gold line (7px dash, 5px gap) for section breaks and under article heads.
- **Floret divider** (`.sr-divider`): two stitches meeting at the floret, for the end of an article and below the home hero.

### Code blocks and callouts
- **Code:** `surface-card` with a 1px hairline border, 10px corners, a title bar separated by a dashed thread seam, and a copy button.
- **Callout:** `surface-tint` wash, 10px corners, a teal mark in the left gutter.

## Do's and Don'ts

### Do:
- **Do** separate things with a `thread` seam or a tone change, and keep `shadow-patch` for patches.
- **Do** put anything that sits on the tweed on a solid `surface-card` patch.
- **Do** keep rose for actions and focus only.
- **Do** give every interactive element the 2px `focus-ring` outline with a 2px offset, replacing its stitch on focus.
- **Do** draw icons as thin lines (1.4–1.6px stroke, round caps) in `currentColor`; the floret is the one ornamental glyph and the site's mark.
- **Do** keep reduced-motion variants for every animation.

### Don't:
- **Don't** put ornament at full strength behind text, or use more than two ornament kinds in one viewport.
- **Don't** use grey rules, black text or grey text.
- **Don't** italicise and gild a word in a heading.
- **Don't** use `thread` for body text, or `coral` and `rose-blush` for text.
- **Don't** use game screenshots, official art, stock photos, 3D renders or emoji.
- **Don't** add another shadow, another action colour or a heavy border.
