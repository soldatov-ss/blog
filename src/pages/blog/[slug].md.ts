// Each post as plain Markdown at /blog/<id>.md: fewer tokens and no layout for agents and LLMs to strip.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, type Post } from '../../posts';

export const getStaticPaths = (async () =>
	(await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
	const { data, body } = props.post as Post;
	return new Response(`# ${data.title}\n\n> ${data.description}\n\n${body ?? ''}`, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
