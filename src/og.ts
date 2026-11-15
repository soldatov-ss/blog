// Share images (og:image): one card design for every page, with the page title set on it.
// The card is src/assets/og-card.png: the finished design with the title area left empty (the floret, the divider and
// the site name are part of the picture). Satori lays out the title as paths and sharp (already used by astro:assets)
// composites it onto the card and writes the JPEG.
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import sharp from 'sharp';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// A static instance, because Satori can't set variable axes: Fraunces opsz 72, SOFT 100, weight 500 (the site's
// display setting). OFL, fetched from the Google Fonts CSS API as TTF.
// Read from the project root: share images are only rendered at build time.
const fonts = readFile('src/assets/fonts/Fraunces-72pt-SOFT100-Medium.ttf').then((data) => [
	{ name: 'Fraunces', data, weight: 500 as const },
]);

const CARD = 'src/assets/og-card.png';
// The empty part of the card's dark panel, between the floret and the divider.
const TITLE_BOX = { left: 200, top: 213, width: 800, height: 184 };
const TITLE_COLOR = '#f7ece3';
// The design sets a two-line title at 68px. Longer titles take the largest size that still leaves air above and below.
const TITLE_SIZES = [68, 62, 56, 52, 48, 44, 40, 36, 32];
const TITLE_MAX_HEIGHT = 160;

// satori's types want a ReactElement; a plain { type, props } tree is what it walks at runtime.
const titleSvg = async (title: string, fontSize: number, height?: number) =>
	satori(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					width: TITLE_BOX.width,
					height,
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					overflow: 'hidden',
				},
				children: {
					type: 'div',
					props: {
						style: {
							display: 'block',
							fontFamily: 'Fraunces',
							fontSize,
							lineHeight: 1.06,
							// Tight at display sizes, looser once the letters get small.
							letterSpacing: fontSize >= 56 ? '-0.03em' : '-0.02em',
							color: TITLE_COLOR,
							textWrap: 'balance',
						},
						children: title,
					},
				},
			},
		} as never,
		{ width: TITLE_BOX.width, height, fonts: await fonts },
	);

/** A 1200×630 JPEG: the title centred on the card. */
export async function renderShareImage(title: string) {
	// Typographic apostrophes, as in the article's own heading.
	const text = title.replace(/(\w)'(\w)/g, '$1’$2');
	// Without a height, Satori sizes the SVG to the wrapped text, which is how each size is measured.
	let fontSize = TITLE_SIZES.at(-1)!;
	for (const size of TITLE_SIZES) {
		const height = Number((await titleSvg(text, size)).match(/height="([\d.]+)"/)?.[1]);
		if (height <= TITLE_MAX_HEIGHT) {
			fontSize = size;
			break;
		}
	}
	const svg = await titleSvg(text, fontSize, TITLE_BOX.height);
	return (
		sharp(CARD)
			.composite([{ input: Buffer.from(svg), left: TITLE_BOX.left, top: TITLE_BOX.top }])
			// Full chroma keeps the cream letters crisp on the plum panel.
			.jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
			.toBuffer()
	);
}

export const jpegResponse = (jpeg: Buffer) =>
	new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
