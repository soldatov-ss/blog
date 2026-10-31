---
title: 'Hello, world'
description: 'Why I started this blog and what I plan to write about.'
pubDate: 'Oct 31 2026'
tags: ['meta']
---

This is the first post on the blog. Posts live in `src/content/blog/` as Markdown or MDX files. Add a `heroImage` to the frontmatter to give a post an arch-framed cover.

## Frontmatter

```yaml
title: 'My article'
description: 'One sentence shown on cards and in search results.'
pubDate: 'Nov 01 2026'
tags: ['typescript', 'architecture']
heroImage: '../../assets/my-cover.png' # optional
```

## Code blocks

Code is highlighted at build time. Add a filename with `title="..."` and highlight lines with `{4-5}`:

```ts title="retry.ts" {4-5}
export async function retry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
	for (let i = 1; ; i++) {
		try {
			return await fn();
		} catch (err) {
			if (i >= attempts) throw err; // give up after the last attempt
			await new Promise((r) => setTimeout(r, 2 ** i * 100));
		}
	}
}
```

> Simplicity is a prerequisite for reliability.
