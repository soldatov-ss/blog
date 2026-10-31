// Shiki transformer: renders fenced code as Sirene's CodeBlock
// (sirene-design-system/components/CodeBlock): filename · language bar, Copy button,
// highlighted lines. Meta syntax: ```ts title="can.ts" {2-3,5}

function parseMeta(raw = '') {
	const title = raw.match(/title="([^"]+)"/)?.[1];
	const lines = new Set();
	for (const range of raw.match(/\{([\d,\s-]+)\}/)?.[1].split(',') ?? []) {
		const [a, b = a] = range.split('-').map(Number);
		for (let i = a; i <= b; i++) lines.add(i);
	}
	return { title, lines };
}

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

export const codeFrame = {
	name: 'code-frame',
	line(node, line) {
		const highlighted = parseMeta(this.options.meta?.__raw).lines.has(line);
		this.addClassToHast(node, highlighted ? ['ln', 'ln--hl'] : 'ln');
	},
	code(node) {
		// Lines are display: block, so the "\n" text nodes between them would add blank rows.
		node.children = node.children.filter((child) => child.type !== 'text');
	},
	root(root) {
		const { title } = parseMeta(this.options.meta?.__raw);
		const lang = this.options.lang;
		const label = [title, lang === 'plaintext' || lang === 'text' ? '' : lang].filter(Boolean).join(' · ');
		root.children = [
			el('figure', { className: ['sr-code'] }, [
				el('figcaption', { className: ['sr-code__bar'] }, [
					el('span', { className: ['sr-meta'] }, [text(label)]),
					el('button', { className: ['sr-code__copy', 'sr-meta'], type: 'button' }, [text('Copy')]),
				]),
				...root.children,
			]),
		];
	},
};
