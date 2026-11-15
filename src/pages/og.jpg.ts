// Default share image, at /og.jpg, for pages that aren't posts (BaseHead links it as og:image).
import type { APIRoute } from 'astro';
import { SITE_TAGLINE } from '../consts';
import { renderShareImage, jpegResponse } from '../og';

export const GET: APIRoute = async () => jpegResponse(await renderShareImage(SITE_TAGLINE));
