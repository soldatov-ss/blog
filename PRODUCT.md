# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Engineers solving a problem (primary).** They arrive on one article from search or dev.to while working on the same problem: SSO with AWS Cognito, Azure or Okta, Django and DRF internals, migrations, testing. They are mid-task and want a working answer and the reasoning behind it.
- **Hiring managers and recruiters.** They skim About, Projects and a few essays to judge how Serhii thinks and works.

## Product Purpose

The personal blog of Serhii Soldatov, a software engineer: long-form notes on architecture, access control and refactoring live systems. It succeeds when a reader gets unstuck on their problem, and when the writing shows how Serhii works.

## Positioning

Changing software that people already rely on: real changes to live production systems, and the evidence that nothing broke. Write-ups come from work actually done, not from tutorials.

## Operating Context

- Articles are the core. Some form series (for example the six-part Enterprise SSO with Django and AWS Cognito), with step-by-step screenshots and code blocks.
- The blog is the canonical home of every article; copies on dev.to point back to it.
- Readers follow by RSS (`/rss.xml`) or through GitHub, LinkedIn and dev.to.

## Capabilities and Constraints

- Static Astro site deployed to Cloudflare Workers as static assets at serhiisoldatov.dev.
- Sections: Articles (with tags and series), Projects (GitHub repositories, some with a "story" article), About.
- Light and dark themes, following the OS unless the reader picks one.
- No comments, newsletter or analytics-driven features exist; do not add them without asking.

## Brand Commitments

- Name: Serhii Soldatov. Voice: first person, plain and direct, with occasional dry humour (the road to Mordor, the 404 "This seam came loose").
- The visual identity is the Sirene design system in `sirene-design-system/`, inspired by Sirene's coliseum in *Clair Obscur: Expedition 33*. The About page credits it.

## Evidence on Hand

- 15 articles in `src/content/blog/`, including the SSO series, the Elasticsearch to OpenSearch migration and the hardcoded roles rewrite.
- 4 projects on GitHub, listed on `/projects`.
- No testimonials, client names, metrics or press. Never invent them.

## Product Principles

1. The article is the product. Anything on the page either helps the reader finish their task or gets out of the way.
2. Show the evidence: what changed, why, and how it was proved safe.
3. Arrival is mid-task, often on a deep page from search; every article must stand on its own and point to its series and related reading.
4. Honest and specific over impressive: real work, real numbers, no inflated claims.
