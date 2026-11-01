// Copy button behaviour for code blocks rendered by ./transformer.mjs.
// Delegated, so it covers every .sr-code on any page. The button label changes for sighted readers; the result is
// announced through one shared status region, since screen readers don't reliably announce a live region on the button.
let liveRegion: HTMLElement | undefined;
const announce = (text: string) => {
	if (!liveRegion) {
		liveRegion = document.body.appendChild(document.createElement('p'));
		liveRegion.className = 'sr-only';
		liveRegion.setAttribute('role', 'status');
	}
	liveRegion.textContent = text;
};

document.addEventListener('click', async (event) => {
	const button = (event.target as Element).closest<HTMLButtonElement>('.sr-code__copy');
	if (!button) return;
	const code = button.closest('.sr-code')?.querySelector('pre')?.innerText ?? '';
	try {
		await navigator.clipboard.writeText(code);
		button.textContent = 'Copied';
		announce('Code copied');
	} catch {
		button.textContent = 'Copy failed';
		announce('Copy failed: select the code and copy it by hand');
	}
	setTimeout(() => (button.textContent = 'Copy'), 2000);
});
