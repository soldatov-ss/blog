# Prose
Long-form article body styled from plain Markdown output — set like a well-made book.

**Consumer provides:** rendered Markdown HTML (p, h2, h3, a, strong, ul/ol, blockquote, hr, inline code) inside `<article class="sn-prose">`.

- Text in `body` (Newsreader 19/32, `body` colour) at `measure` (660px).
- The first paragraph opens with a three-line drop cap in Cormorant `accent`.
- h2 / h3 in Cormorant (`h2`, `h3`), `ink`; `space-48` above h2, `space-32` above h3. No h4+.
- Links `accent`, underlined 1px at 4px offset, 2px on hover.
- List markers and section breaks (`hr` → ✦ ✦ ✦) are `gold` ornaments.
- Pull quotes are centred `quote` style (Cormorant italic 30px, `ink`) under a gold ✦ — no side border, no box.
- Inline code `code-inline`, `ink` on `surface-sunken`. Code, figures and tables may break out to `wide`.
