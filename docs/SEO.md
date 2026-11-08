# SEO: what's done and what's next

Read this before changing anything that affects search: `<head>`, structured data, the sitemap, robots, headers, redirects, URLs, titles or descriptions.

Last updated: 2026-11-08.

## Where things stand

In November 2026 the site had a full audit with the claude-seo plugin (`/seo audit`). Its health score was 73/100:

| Area         | Score |
| ------------ | ----- |
| Technical    | 78    |
| Content      | 63    |
| On-page      | 66    |
| Schema       | 62    |
| Performance  | 96    |
| AI readiness | 74    |
| Images       | 96    |

The technical and schema fixes below are deployed and checked on the live site. Content and on-page are the weak areas left.

## What's done

**Security and caching headers** (`public/_headers`):

- Every page sends HSTS, `nosniff`, Referrer-Policy, Permissions-Policy and `frame-ancestors 'none'`.
- `/_astro/*` is cached for a year as immutable.
- There's no full Content-Security-Policy, because Astro's inline scripts (theme, table of contents, image zoom) would need hashes or nonces.

**Sitemap** (`src/pages/sitemap.xml.ts`):

- A custom endpoint replaced `@astrojs/sitemap`, which was uninstalled because it can't read post data from the config.
- Each post gets a `lastmod` (`updatedDate ?? pubDate`).
- Thin tag pages are left out.
- `public/_redirects` sends `/sitemap-index.xml` and `/sitemap-0.xml` to `/sitemap.xml` with a 301.
- `robots.txt` and `<link rel="sitemap">` point to `/sitemap.xml`.
- The sitemap is submitted in Google Search Console and Bing.

**Thin tag pages:**

- A tag page with fewer than `MIN_INDEXED_TAG_POSTS` (3, in `src/posts.ts`) posts gets `noindex` and stays out of the sitemap.
- The 404 page is also `noindex`.
- The `noindex` prop on `BaseHead.astro` emits the robots meta instead of the canonical link.

**Structured data** (`src/components/BaseHead.astro`):

- One `Person` with `@id` `/about/#person`, reused on every page. Its `sameAs` comes from `SOCIAL_LINKS`.
- Home page: a `WebSite` + `Person` graph.
- `/about/`: `ProfilePage`.
- Posts: `BlogPosting`, with the author linked to the Person.
- `og:url` uses the canonical URL.

**About page:**

- One plain line on who the author is: "I'm a software engineer in Kraków…".
- `jobTitle` is "Software engineer".
- The user rejected a CV-style section listing roles, projects and certifications as unnatural. They don't want to be described only as a backend engineer, or as focused on SSO. Keep the page short and in their voice.
- `Serhii_Soldatov_CV.yaml` in the repo root is the user's CV source. It's untracked and contains their email, so never commit it.

**Related essays** (`relatedTo` in `src/posts.ts`, rendered in `src/layouts/BlogPost.astro`):

- Each post ends with up to 3 posts that share tags with it.
- Tags on more than a third of all posts (`django`, `python`) don't count, and rarer tags weigh more.
- Posts from the same series are skipped. Another series gets one slot, for its part 1.
- Outside a series, related essays replace the older/newer links. Older/newer show only when nothing is related.

**Content fixes:**

- **Typos:** a Cyrillic "С" in "Click" in the Okta guide; "Copy a issuer URL" in the Okta and Azure guides; "dublicate" in the DRF post.
- **Azure guide:** now says "Microsoft Entra ID (formerly Azure Active Directory)".
- **uv Docker post:** fixed the `PATH` in the final stage.
- **DRF validation post:**
  - Updated for DRF 3.17 (`updatedDate`, an update note, and test results on 3.16.1, 3.17.0 and 3.18.3).
  - The title was shortened to "Why Django REST Framework ignores your custom validation error messages".

## Monitoring

Drift baselines are stored locally in `~/.cache/claude-seo/drift/baselines.db`. They were captured on 2026-11-08, after the fixes above were deployed:

| ID  | Page                                          | Expected state          |
| --- | --------------------------------------------- | ----------------------- |
| 1   | `/`                                           | WebSite + Person schema |
| 2   | `/about/`                                     | ProfilePage schema      |
| 3   | `/blog/drf-custom-validation-error-messages/` | BlogPosting schema      |

After the 2026-11-08 push, `/seo drift compare` on these three pages should show only the About text, the DRF title and the related essays. Run it again after any change to the layout, `BaseHead.astro`, or the Astro version.

Not baselined: tag pages (the `noindex` on thin ones), and Core Web Vitals (no PageSpeed API key).

## What could be next

In priority order:

1. **Drift compare** on the three baselined pages, to confirm the latest deploy changed only what it should.
2. **Search Console data, from about late November 2026.** Check which pages are indexed and which queries bring traffic, then improve titles and descriptions based on that. Use `/seo google` (needs a Google API service account) or the Search Console website. This should decide most content work from here.
   - Open question: several posts are republished copies, set with `canonicalUrl`, from HackerNoon or dev.to. Search Console shows which version Google treats as the original.
3. **Default share image.** Pages without a hero image have no `og:image`. The user deferred this on purpose. It affects link previews only, not rankings.
4. **SSO series order.** The overview post `django-enterprise-sso-with-aws-cognito` is part 6. If it's really the introduction, making it part 1 gives the series a better starting point. Ask the user first.
5. **Weak related link.** Okta SSO links to the OpenSearch migration only because both are tagged `security`. The user may want to retag one of them.
6. **Loose end in the uv post.** It mentions `UV_PROJECT_ENVIRONMENT`, but no snippet sets it.
7. **`/seo cluster <topic>`**, only when the user is planning new posts.

Not worth doing:

- `/seo local`, `/seo ecommerce`, `/seo programmatic` and `/seo competitor-pages` don't fit a personal blog.
- Another full `/seo audit` should wait until there's search data or new content.
- Don't add FAQ or HowTo schema. Google no longer shows rich results for either.
