---
title: 'From Django library to AWS Cognito: my journey building enterprise SSO'
description: 'How a multi-provider SSO requirement took me from rewriting a Django SSO library to an AWS Cognito setup where adding a new identity provider needs no server code changes.'
pubDate: '2026-04-12'
canonicalUrl: 'https://dev.to/soldatov-ss/from-django-library-to-aws-cognito-my-journey-building-enterprise-sso-30be'
heroImage: './cover.webp'
tags: ['django', 'aws', 'cognito', 'sso']
---

## The client call that started everything

"We need SSO. Multiple providers. Per client. Starting next sprint."

That was the moment I realized I had no idea what I was actually getting into.

I'd built auth flows before — JWT, session-based, OAuth2 callbacks. But enterprise SSO at scale, where each tenant brings their own identity provider, where role sync needs to be automatic, where a user getting removed from an Azure group means they lose access in your app within minutes? That's a different animal entirely.

This is the story of how I went from frantically Googling "Django SSO library" to building a production system on AWS Cognito that handles Azure AD, Okta, and any OIDC provider — without touching a line of server code when a new provider is added.

---

## V1: wrestling a library into submission

### The starting point

My first search led me to `django-simple-sso` — the only SSO-focused library I could find for Django at the time. The bones were reasonable. The problem? It was designed for one provider, one configuration, one-to-one everything.

My requirements were the opposite:

- Multiple providers per client (a client might have Azure AD *and* Okta)
- Dynamic provider selection by email domain
- Automatic role mapping: `admin`, `manager`, etc., synced from the provider
- Per-tenant configuration, entirely isolated

### The rearchitecture

So I stopped trying to configure the library and started reading its internals. Then I started rewriting them.

The data model went from one-to-one relationships to many-to-many. The auth flow got rewritten for dynamic provider resolution — when a user types their email, the backend queries which SSO configs are associated with that domain, selects the right provider, and redirects accordingly. Role mapping got its own layer.

Three weeks of heads-down work. By the end, it covered everything: multiple providers, automatic role sync, dynamic authentication. It was custom, it was complex, and it worked.

Until the next client call.

---

## The problem that forced V2

### The request

"We need to add a new provider."

Fine. I'd done it before. Except this one was an obscure, legacy enterprise identity system — the kind that's only used in certain American B2B markets, where getting test credentials means purchasing a suite of products and weeks of vendor coordination. We literally could not test against it without significant time and cost investment.

And that's when the real problem became obvious: every new provider required code changes. Test access. Adjustment cycles. The library abstraction I'd built was still fundamentally tied to providers I could understand and validate myself.

The client's roadmap had more providers coming. We needed something universal.

### The decision

We removed everything. The library, the custom SSO code, all of it.

And we moved to **AWS Cognito**.

---

## V2: why Cognito changed everything

AWS Cognito sits between your application and any external identity provider. It speaks OIDC to the providers (Azure AD, Okta, Google, SAML, whatever) and speaks a single, consistent OAuth2 flow back to your app.

The transformation this unlocked:

```text
Before (V1):
App <--> Custom SSO code <--> [Azure-specific logic] <--> Azure AD
                          <--> [Okta-specific logic]  <--> Okta
                          <--> [???-specific logic]   <--> Unknown provider

After (V2):
App <--> Cognito <--> Azure AD
                <--> Okta
                <--> Any OIDC provider
```

**Adding a new provider now requires zero server-side code changes.** Cognito normalises everything. The token your app receives is identical regardless of which provider the user authenticated against.

### What we built

The Django application I'm open-sourcing handles:

- **Dynamic config discovery** — `GET /api/oidc/check_config_exists/<email>/` returns the right Cognito client config for a given email domain
- **OAuth2 callback** — exchanges the authorization code, decodes the ID token, maps roles, creates/updates the user and their membership record
- **Automated Cognito provisioning** — clients send their identity provider credentials via a web form; the backend calls AWS APIs to configure the Cognito User Pool, no manual AWS console work required
- **Lifecycle events via webhooks** — Azure AD and Okta can notify the app when a user is removed from a group or deleted. The system soft-deletes their membership, revoking access automatically

```text
Browser          Django              Cognito          Azure AD / Okta
  |                 |                   |                   |
  |-- check email ->|                   |                   |
  |<- client_id  ---|                   |                   |
  |                 |                   |                   |
  |-------- redirect to Cognito ------->|                   |
  |                                     |--- OIDC flow ---->|
  |                                     |<-- user token ----|
  |<-------- redirect with ?code= ------|                   |
  |                 |                   |                   |
  |-- /callback  -->|                   |                   |
  |                 |-- exchange code ->|                   |
  |                 |<-- id_token ------|                   |
  |                 | decode + map roles                    |
  |                 | create/update User + Member           |
  |<- access_token--|                   |                   |
```

---

## The article series

This repo comes with a full series of step-by-step guides. Think of them as the manual that I wish had existed when I started:

**[1. How to Configure AWS Cognito for SSO: A Step-by-Step Guide](/blog/aws-cognito-sso-setup/)**
The foundation. User Pool setup, custom attributes (`custom:groups`, `custom:roles`), app client configuration, and the callback URL wiring. Start here.

**[2. Azure Single Sign-On (SSO) Setup: A Step-by-Step Guide](/blog/azure-sso-setup/)**
Enterprise App registration in Azure AD, configuring OIDC claims, mapping Azure groups to Cognito attributes. Includes the Graph API setup for lifecycle webhooks.

**[3. Okta Single Sign-On (SSO) Setup: A Step-by-Step Guide](/blog/okta-sso-setup/)**
Okta application setup, OIDC configuration, group claims, and the Event Hook configuration for real-time deprovisioning.

**[4. How to Set Up SSO Authentication in Your App's Admin Panel](/blog/sso-for-your-admin-panel/)**
The Django side: the authentication backend, the callback handler, role mapping, and how the admin panel reflects SSO-managed memberships.

**[5. How to Test SSO Authentication with Cognito and OIDC Providers](/blog/testing-sso-with-cognito-and-oidc/)**
End-to-end testing strategy — what to mock, what to hit for real, and the test patterns used in this repo.

---

## The repository

The code is on GitHub: **[django-cognito-sso-demo](https://github.com/soldatov-ss/django-cognito-sso-demo)**

It's a reference implementation, not a drop-in package. The parts you'll want to adapt for your own system:

- **`apps/oidc_auth/services/sso.py`** — core SSO orchestration: config lookup, token exchange, role mapping
- **`apps/oidc_auth/backends.py`** — Django authentication backend wired to Cognito
- **`apps/users/cognito.py`** — boto3 wrapper for all Cognito API calls
- **`apps/oidc_auth/services/notification.py`** — webhook processing for Azure and Okta lifecycle events

One intentional simplification worth noting: `RightsHolderService.get_rights_holder_from_request` resolves the tenant from the request user directly. In production, tenant resolution typically comes from middleware or a partnership context. Replace it with whatever your multi-tenancy layer provides.

---

## What I'd tell past me

**Don't start with a library.** Or rather: start with one to understand the problem space, but be honest about when you've outgrown it. The three weeks I spent rearchitecting `django-simple-sso` taught me exactly what I needed to know to make Cognito work well — I don't regret the time, but I wish I'd recognised sooner that the constraint wasn't the library, it was the model.

**The "universal provider" requirement is the forcing function.** If you know upfront that you need to support arbitrary OIDC providers without code changes, skip straight to an identity broker. Cognito is the obvious choice in AWS environments. There are others (Auth0, Keycloak). The architecture is the same.

**Lifecycle events are not optional for enterprise.** User deprovisioning is a security requirement, not a nice-to-have. Budget for the webhook infrastructure and the soft-deletion logic early. It's much harder to retrofit.

**Encrypt your client secrets.** `SSOAccountConfig` uses `django-encrypted-model-fields` for `client_id` and `client_secret`. If you're storing provider credentials in your database — and you will be — this is non-negotiable.

---

## Where this goes next

The system in this repo handles everything the original client needed. The architecture has stayed stable through adding new providers, new tenants, and changes in the underlying identity providers themselves.

If you're building something similar and hit a wall, the article series has the detail. The repo has the code.

---

*Source code: [github.com/your-username/django-cognito-sso-demo](https://github.com/soldatov-ss/django-cognito-sso-demo)*
