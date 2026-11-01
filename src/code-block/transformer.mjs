// Shiki transformer: renders fenced code as Sirene's CodeBlock
// (sirene-design-system/components/CodeBlock): filename · language bar, Copy button,
// highlighted lines. Meta syntax: ```ts title="can.ts" {2-3,5}
// Plain-text blocks (diagrams) get no Copy button; add alt="…" to give one a text alternative.
// The Copy button's behaviour is ./copy.ts, mounted by Layout.astro.

function parseMeta(raw = '') {
	const title = raw.match(/title="([^"]+)"/)?.[1];
	const alt = raw.match(/alt="([^"]+)"/)?.[1];
	const lines = new Set();
	for (const range of raw.match(/\{([\d,\s-]+)\}/)?.[1].split(',') ?? []) {
		const [a, b = a] = range.split('-').map(Number);
		for (let i = a; i <= b; i++) lines.add(i);
	}
	return { title, alt, lines };
}

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

export const codeFrame = {
	name: 'code-frame',
	preprocess() {
		this.meta.codeFrame = parseMeta(this.options.meta?.__raw);
	},
	pre(node) {
		const { alt } = this.meta.codeFrame;
		if (alt) Object.assign(node.properties, { role: 'img', 'aria-label': alt });
	},
	line(node, line) {
		const highlighted = this.meta.codeFrame.lines.has(line);
		this.addClassToHast(node, highlighted ? ['ln', 'ln--hl'] : 'ln');
	},
	code(node) {
		// Lines are display: block, so the "\n" text nodes between them would add blank rows.
		node.children = node.children.filter((child) => child.type !== 'text');
	},
	root(root) {
		const { title } = this.meta.codeFrame;
		const lang = this.options.lang;
		const plain = lang === 'plaintext' || lang === 'text';
		const label = [title, plain ? '' : lang].filter(Boolean).join(' · ');
		const bar = [];
		if (label) bar.push(el('span', { className: ['sr-meta'] }, [text(label)]));
		if (!plain) {
			bar.push(el('button', { className: ['sr-code__copy', 'sr-meta'], type: 'button' }, [text('Copy')]));
		}
		root.children = [
			el('figure', { className: ['sr-code'] }, [
				...(bar.length ? [el('figcaption', { className: ['sr-code__bar'] }, bar)] : []),
				...root.children,
			]),
		];
	},
};
