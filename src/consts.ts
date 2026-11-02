// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Serhii Soldatov';
export const SITE_DESCRIPTION = 'Notes and essays on building software.';

// Main sections, shown in the Nav.
export const NAV_LINKS = [
	{ href: '/blog', label: 'Articles' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/about', label: 'About' },
];

// Profiles elsewhere: footer links, About page and JSON-LD sameAs.
export const SOCIAL_LINKS = [
	{
		label: 'GitHub',
		href: 'https://github.com/soldatov-ss',
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/ss-soldatov/',
	},
	{
		label: 'dev.to',
		href: 'https://dev.to/soldatov-ss',
	},
];

// Theme vocabulary, shared by the pre-paint restore (BaseHead) and the toggle (Nav).
// Must match the [data-theme] selectors in sirene-design-system/tokens.css.
export const THEME_KEY = 'theme';
export const DAY_THEME = 'silk';
export const NIGHT_THEME = 'coliseum';
