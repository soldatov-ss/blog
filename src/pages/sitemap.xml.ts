import type { APIRoute } from 'astro';
import { getPosts, MIN_INDEXED_TAG_POSTS, postsTagged, postUrl, tagsOf, tagUrl } from '../posts';

// Built from the post catalogue (not @astrojs/sitemap) so posts carry a real lastmod and thin tag pages stay out.
export const GET: APIRoute = async ({ site }) => {
	const posts = await getPosts();
	const urls: [string, Date?][] = [
		['/'],
		['/blog/'],
		['/about/'],
		['/projects/'],
		...posts.map((post): [string, Date] => [postUrl(post), post.data.updatedDate ?? post.data.pubDate]),
		...tagsOf(posts)
			.filter((tag) => postsTagged(posts, tag).length >= MIN_INDEXED_TAG_POSTS)
			.map((tag): [string] => [tagUrl(tag)]),
	];
	const body = urls
		.map(
			([path, lastmod]) =>
				`<url><loc>${new URL(path, site)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`,
		)
		.join('');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } },
	);
};
