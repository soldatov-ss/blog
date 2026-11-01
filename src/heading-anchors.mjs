// Sätteri HAST plugin: give every h2/h3 in a post a shareable "#" link.
// Runs before Astro's own heading-ids plugin, so it sets the id itself with the same slugger
// (Astro keeps an existing id). The link has no text node, only an aria-label naming its section and a CSS "#",
// so heading text, the TOC and reading time stay clean.
import Slugger from 'github-slugger';

export const headingAnchors = () => {
	const slugger = new Slugger();
	return {
		name: 'heading-anchors',
		element: {
			filter: ['h2', 'h3'],
			visit(node, ctx) {
				const text = ctx.textContent(node);
				const id = typeof node.properties?.id === 'string' ? node.properties.id : slugger.slug(text);
				ctx.setProperty(node, 'id', id);
				ctx.appendChild(node, {
					type: 'element',
					tagName: 'a',
					properties: { href: `#${id}`, className: ['heading-anchor'], ariaLabel: `Link to section: ${text}` },
					children: [],
				});
			},
		},
	};
};
