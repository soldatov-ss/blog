// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { codeFrame } from './src/code-frame.mjs';

// https://astro.build/config
export default defineConfig({
	// TODO: set to your real domain (used for RSS, sitemap, canonical URLs)
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Colors come from --astro-code-* tokens mapped to Sirene's code colours in src/styles/site.css.
		shikiConfig: { theme: 'css-variables', transformers: [codeFrame] },
	},
	// Fonts (Fraunces with its SOFT axis, Bricolage Grotesque, JetBrains Mono) load from sirene-design-system/components/bundle.css.
});
