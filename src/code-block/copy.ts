// Copy button behaviour for code blocks rendered by ./transformer.mjs.
// Delegated, so it covers every .sr-code on any page. The button is aria-live, so the result is announced.
document.addEventListener('click', async (event) => {
	const button = (event.target as Element).closest<HTMLButtonElement>('.sr-code__copy');
	if (!button) return;
	const code = button.closest('.sr-code')?.querySelector('pre')?.innerText ?? '';
	try {
		await navigator.clipboard.writeText(code);
		button.textContent = 'Copied';
	} catch {
		button.textContent = 'Copy failed';
	}
	setTimeout(() => (button.textContent = 'Copy'), 2000);
});
