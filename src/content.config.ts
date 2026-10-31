import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// First frame of an animated heroImage: link previews and reduced motion use it.
			heroStill: z.optional(image()),
			// Where the essay first appeared, if elsewhere: becomes rel=canonical so search engines credit the original.
			canonicalUrl: z.url().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

export const collections = { blog };
