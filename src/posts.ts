// Post catalogue: the one place that knows what a post is beyond its frontmatter:
// ordering, URLs, tags and reading time. Pages and components ask here instead of re-deriving.
import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id),
	);
}

/** Distinct tags across `posts`, alphabetical. */
export const tagsOf = (posts: Post[]) => [...new Set(posts.flatMap((post) => post.data.tags))].sort();

export const postUrl = (post: Post) => `/blog/${post.id}/`;
export const tagUrl = (tag: string) => `/tags/${tag}/`;
/** Tags are slugs (`access-control`); this is how a reader sees them. */
export const tagLabel = (tag: string) => tag.replaceAll('-', ' ');

/** At 220 words a minute, never less than 1. */
export const readingMinutes = (post: Post) => Math.max(1, Math.round((post.body ?? '').split(/\s+/).length / 220));
