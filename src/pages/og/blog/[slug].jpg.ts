// Share image for each post, at /og/blog/<id>.jpg (BaseHead links it as og:image).
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderShareImage, jpegResponse } from '../../../og';
import { getPosts, type Post } from '../../../posts';

export const getStaticPaths = (async () =>
	(await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => jpegResponse(await renderShareImage((props.post as Post).data.title));
