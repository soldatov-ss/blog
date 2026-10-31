# CodeBlock
Fenced code on the night stage: filename header, copy button, a rose/lagoon/gold syntax palette, highlighted lines.

**Consumer provides:** code, language, optional filename, optional highlight ranges. Tokenise with Shiki or Prism and map scopes to the classes below.

- Dark in both themes: `code-bg`, `code-ink`, `radius-md`, up to `wide`; scrolls, never wraps.
- Syntax, five hues only: `.k` `code-keyword` (rose), `.s` `code-string` (lagoon), `.f` `code-function` (gold), `.n` `code-number` (apricot), `.c` `code-comment` (italic).
- Highlighted lines: `code-line` band with a 2px `code-keyword` edge.
- Header: filename in mono 13px `code-comment`; Copy button turns gold on hover and reads "Copied" for 2s.
