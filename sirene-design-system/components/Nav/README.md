# Nav

A floating `surface-card` pill with `shadow-patch`, max 1080px wide, 24px from the top. Not a full-width bar.

- **Consumer provides:** the wordmark (site name in the display face, one word in italic `gold`), 2–4 links and an optional ghost icon button (e.g. a theme toggle). No Subscribe button: the subscribe call lives at the end of an article, where the reader has earned it.
- The current section gets `aria-current="page"`: `rose` text over a solid `thread` underline.
- Keep the links visible on phones (the pill wraps); add a "Menu" button only once links no longer fit at 375px.
