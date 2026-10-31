Serhii's Notes is a personal software-development blog staged like a Belle Époque theatre by the sea: pale silk and sand by day, a near-black velvet stage by night, one rose colour for every action, gilt hairlines, arched frames and a literary serif voice. The drama is in light and shadow — clair and obscur — while the prose stays calm and easy to read.

## Content fundamentals

- **Voice:** first person, direct, a working engineer talking to peers. "I", "we" for a team I was on, "you" for the reader. No hype words, no emoji.
- **Casing:** sentence case for titles and prose. Interface text — buttons, nav, eyebrows, tags, callout labels, footer heads — is uppercase Jost with wide tracking, like a poster or a programme.
- **Titles** state the idea: "Decomposing hardcoded roles into permissions". One word may be set in italic `accent` — the single flourish on a page.
- **Deks** are one italic sentence about what the reader walks away with.
- **Meta:** "Oct 18, 2026 · 9 min read".
- **Buttons:** verb first, under three words.

## Light and colour

- Two themes, named for the idea: **Clair** (day) and **Obscur** (night). Both are first-class; every text pair holds 4.5:1 in both.
- Ground is `canvas` (silk ivory / velvet black-rose); cards and inputs sit on `surface`. Separate with `border` hairlines and tone, not shadows.
- Text: `ink` for headings and strong text, `body` for prose, `muted` for meta. `faint` is decorative only.
- `accent` (rose) is the only action colour: primary buttons, links, active nav, eyebrows, drop caps, the italic title word. Fill text on it is `on-accent`.
- `gold` is for ornament: hairline rules, ✦ marks, arch outlines, list markers, footer heads. In Clair it is never used for text.
- Silk tints `blush`, `pearl`, `lagoon` make the ribbon gradient (`blush` → `pearl` → `lagoon`) on arch plates and illustrations — never on controls or text.
- `night` is the stage: the footer, the code blocks' family and the one spotlight section per page, where a soft `blush` glow falls from a single corner. Use the spotlight once per page; the contrast only works if it is rare.
- Callout pairs (`tip-*` lagoon, `warn-*` gold-brown, `danger-*` crimson) appear only in articles and always carry a word label.

## Typography

- **Cormorant Garamond** (`display`) for titles, headings, pull quotes and the wordmark — weight 500–600, italic for flourishes.
- **Newsreader** (`text`) for prose: 19/32 at `measure` (660px). Deks are its italic.
- **Jost** (`ui`) for all interface text: `ui` 13px +1.6px and `label` 11px +2.4px, always uppercase; `caption` 13px for meta.
- **JetBrains Mono** (`mono`) for code, ligatures off.
- All four load from Google Fonts (see `components/bundle.css`).
- Styles: `display` (home hero), `title` (article, centred), `h2`, `h3`, `quote`, `lead`, `body`, `body-sm`, `ui`, `label`, `caption`, `code`, `code-inline`.
- The first paragraph of an article opens with a Cormorant drop cap in `accent`.

## Ornament and shape

- **Arches:** images, card plates and hero frames get `radius-arch` top corners and `radius-sm` bottoms, with a 1px `gold` inner line.
- **Sharp controls:** buttons and inputs use `radius-sm` (2px). Cards, code and callouts use `radius-md` (6px). Only tags and the avatar are round (`radius-pill`).
- **Gilt:** 1px `gold` rules frame the byline, sit under the nav hairline and top the footer. ✦ marks the eyebrow, list bullets, section breaks (✦ ✦ ✦) and pull quotes. Never more than one ornament per element.
- Shadows: only `shadow-lift` on hover. Light comes from tone and the spotlight.

## Code

- Code sits on `code-bg` (night) in both themes; filename header, Copy button, horizontal scroll.
- Five syntax hues drawn from the palette: `code-keyword` rose, `code-string` lagoon, `code-function` gold, `code-number` apricot, `code-comment` muted italic. Map other scopes to `code-ink`.
- Highlight lines with `code-line` and a 2px `code-keyword` edge. Inline code is `ink` on `surface-sunken`.

## Spacing and layout

- 4px base. Components use `space-4` … `space-32`; sections are separated by `space-96` on the canvas; heroes and spotlights get `space-128`.
- Widths: `page-max` 1200px, `measure` 660px for prose, `wide` 880px for code and figures.
- Article headers are centred; prose is left-aligned. Gutters `space-16` mobile, `space-32` desktop.

## States and motion

- Hover: links thicken their underline; fills go to `accent-hover`; cards rise 2px with `shadow-lift`; outlines turn `accent`.
- Focus: 2px solid `focus` outline, 2px offset, everywhere; inputs add `shadow-inset`.
- Motion is slow and soft — 200–250ms ease on colour and transform; a theme switch may cross-fade over 400ms. Respect `prefers-reduced-motion`.

## Imagery and iconography

- Painterly illustration over photography: soft brushwork in the silk tints, a single light source, deep shadow around it. One per post at most, inside an arch.
- Diagrams use `ink` lines on `surface` with `accent` for the one thing that matters.
- Icons: 16px line icons, 1.5px stroke, round caps (Lucide-style), `currentColor`. No icon set ships yet — the previews use inline SVG.
- No logo mark: the italic Cormorant wordmark is the logo.

## Page recipes

- **Home:** Nav → hero (`display` title with one italic `accent` word, `lead`, one primary button, an arch-framed illustration) → PostCard grid → Subscribe spotlight → Footer.
- **Article:** Nav → ArticleHeader → Prose with CodeBlock and Callout → Subscribe spotlight → Footer.
- **Archive / topic:** Nav → `h2` + Tag row → PostCard rows grouped by year → Footer.
