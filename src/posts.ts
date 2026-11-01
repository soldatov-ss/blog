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
export const essayCount = (n: number) => `${n} ${n === 1 ? 'essay' : 'essays'}`;
/** Raw Markdown copy of a post, for agents and LLMs (src/pages/blog/[slug].md.ts). */
export const markdownUrl = (post: Post) => `/blog/${post.id}.md`;
