// @ts-check

import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { codeFrame } from './src/code-block/transformer.mjs';
import { headingAnchors } from './src/heading-anchors.mjs';

// https://astro.build/config
export default defineConfig({
	// TODO: set to your real domain (used for RSS, sitemap, canonical URLs)
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Colors come from --astro-code-* tokens mapped to Sirene's code colours in src/styles/site.css.
		shikiConfig: { theme: 'css-variables', transformers: [codeFrame] },
		processor: satteri({ hastPlugins: [headingAnchors] }),
	},
	// Self-hosted at build, mapped onto Sirene's --font-* tokens in src/styles/site.css.
	// Only what the CSS uses: Fraunces is always set with SOFT 100, sans weights 350-600.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Fraunces',
			cssVariable: '--font-fraunces',
			weights: ['400 500'],
			styles: ['normal', 'italic'],
			fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
			options: { experimental: { variableAxis: { opsz: [['9', '144']], SOFT: ['100'] } } },
		},
		{
			provider: fontProviders.google(),
			name: 'Bricolage Grotesque',
			cssVariable: '--font-bricolage',
			weights: ['350 600'],
			styles: ['normal'],
			fallbacks: ['Avenir Next', 'system-ui', 'sans-serif'],
			options: { experimental: { variableAxis: { opsz: [['12', '96']] } } },
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains',
			weights: ['400', '600'],
			styles: ['normal'],
			fallbacks: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
		},
	],
});
