// Post catalogue: the one place that knows what a post is beyond its frontmatter:
// ordering, URLs, tags and reading time. Pages and components ask here instead of re-deriving.
import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All posts, newest first. Same-day series parts keep their order: the later part counts as newer. */
export async function getPosts(): Promise<Post[]> {
	return (await getCollection('blog')).sort(
		(a, b) =>
			b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
			(b.data.series?.part ?? 0) - (a.data.series?.part ?? 0) ||
			a.id.localeCompare(b.id),
	);
}

/** Distinct tags across `posts`, alphabetical. */
export const tagsOf = (posts: Post[]) => [...new Set(posts.flatMap((post) => post.data.tags))].sort();

export const postUrl = (post: Post) => `/blog/${post.id}/`;
export const tagUrl = (tag: string) => `/tags/${tag}/`;
// Acronyms and names a plain capitalisation would get wrong.
const TAG_LABELS: Record<string, string> = {
	aws: 'AWS',
	drf: 'DRF',
	'e2e-testing': 'E2E testing',
	oidc: 'OIDC',
	sso: 'SSO',
};
/** Tags are slugs (`access-control`); this is how a reader sees them (`Access control`). */
export const tagLabel = (tag: string) => TAG_LABELS[tag] ?? tag[0].toUpperCase() + tag.slice(1).replaceAll('-', ' ');

/** At 220 words a minute, never less than 1. */
export const readingMinutes = (post: Post) => Math.max(1, Math.round((post.body ?? '').split(/\s+/).length / 220));

/** Every part of `post`'s series in reading order, or [] when it isn't in one. */
export const seriesOf = (posts: Post[], post: Post) => {
	const name = post.data.series?.name;
	if (!name) return [];
	return posts.filter((p) => p.data.series?.name === name).sort((a, b) => a.data.series!.part - b.data.series!.part);
};

export const postsTagged = (posts: Post[], tag: string) => posts.filter((post) => post.data.tags.includes(tag));
/**
 * Up to `n` other posts that share tags with `post`, outside its own series (the series nav already links those).
 * Tags on more than a third of all posts (django, python) say too little to relate two essays, so they don't count;
 * a shared rare tag counts for more than a common one. Another series gets one slot, for its first part.
 */
export const relatedTo = (posts: Post[], post: Post, n = 3) => {
	const weight = (tag: string) => {
		const count = postsTagged(posts, tag).length;
		return count > posts.length / 3 ? 0 : 1 / count;
	};
	const score = (p: Post) =>
		p.data.tags.filter((t) => post.data.tags.includes(t)).reduce((sum, t) => sum + weight(t), 0);
	const series = post.data.series?.name;
	return posts
		.filter(
			(p) => p.id !== post.id && (p.data.series ? p.data.series.name !== series && p.data.series.part === 1 : true),
		)
		.map((p) => ({ p, score: score(p) }))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, n)
		.map(({ p }) => p);
};
/** Tag pages with fewer posts are thin: noindexed and left out of the sitemap. */
export const MIN_INDEXED_TAG_POSTS = 3;
export const essayCount = (n: number) => `${n} ${n === 1 ? 'essay' : 'essays'}`;
/** Raw Markdown copy of a post, for agents and LLMs (src/pages/blog/[slug].md.ts). */
export const markdownUrl = (post: Post) => `/blog/${post.id}.md`;
