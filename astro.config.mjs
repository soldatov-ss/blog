// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { codeFrame } from './src/code-frame.mjs';

// https://astro.build/config
export default defineConfig({
	// TODO: set to your real domain (used for RSS, sitemap, canonical URLs)
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Colors come from --astro-code-* tokens mapped to the design system's code-* tokens in BlogPost.astro.
		shikiConfig: { theme: 'css-variables', transformers: [codeFrame] },
	},
	fonts: [
		{
			// Free stand-in for Mackinac
			provider: fontProviders.google(),
			name: 'Fraunces',
			cssVariable: '--font-fraunces',
			weights: [500, 600],
			styles: ['normal', 'italic'],
			fallbacks: ['Georgia', 'serif'],
		},
		{
			// "Fricolage Grotesque" in the design spec
			provider: fontProviders.google(),
			name: 'Bricolage Grotesque',
			cssVariable: '--font-bricolage',
			weights: ['300 600'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			weights: [400],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
});
