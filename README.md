# Serhii Soldatov — blog

Long-form essays on software engineering. Astro 7, static output, styled with the Sirene design system (`sirene-design-system/`).

```sh
npm install
npm run dev      # or: npx astro dev --background
npm run lint     # prettier --check + astro check
npm run build    # → dist/
```

- Posts: `src/content/blog/*.md(x)`. Frontmatter schema in `src/content.config.ts`.
- Post ordering, URLs, tags and reading time: `src/posts.ts`.
- Code blocks (title, alt, line highlights, copy button): `src/code-block/`.
- Colours and type: `sirene-design-system/tokens.css` (each colour once, via `light-dark()`).
