// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Serhii Soldatov';
export const SITE_DESCRIPTION = 'Notes and essays on building software.';

export function readingTime(body = '') {
	return `${Math.max(1, Math.round(body.split(/\s+/).length / 220))} min read`;
}
