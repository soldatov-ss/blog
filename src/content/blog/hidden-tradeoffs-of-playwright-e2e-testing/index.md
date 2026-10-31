---
title: 'Almost done: the hidden tradeoffs of Playwright E2E testing in a fast-moving app'
description: 'A week of investigating Playwright on a fast-moving UI ended with a recommendation to stop. Four hidden costs that make end-to-end tests cheap to start and expensive to keep.'
pubDate: '2026-06-07'
canonicalUrl: 'https://dev.to/soldatov-ss/almost-done-the-hidden-tradeoffs-of-playwright-e2e-testing-in-a-fast-moving-app-i8l'
heroImage: './cover.png'
tags: ['playwright', 'e2e-testing', 'engineering-judgment']
---

The feature demoed beautifully. A real browser opened on its own, clicked through our app like a tiny invisible coworker, created a record, and closed the drawer. A green checkmark. Everyone in the call nodded. And then, a week later, I wrote a message to the client recommending we stop.

Not "ship it." Stop.

Here's the thing about engineering work: the deliverable isn't always code. Sometimes it's a clear-eyed account of why the thing that looks cheap is actually expensive, and the honesty to say so before the bill arrives. That week, the report was the product. Let me explain how I got there, because the path matters more than the punchline.

## What we were actually trying to protect

The problem was real and not exotic. Our team had no automated way to confirm that core user journeys still worked after a merge. You create a Right, a Campaign, a Line Item, an Ad. The bread-and-butter flows of the product. Regressions got caught late, by hand, or not at all. And with AI-assisted development speeding everything up, new forms could ship without anyone noticing a test was missing. Coverage was quietly drifting.

So E2E testing felt like the obvious answer. Playwright, a dedicated test user, a shared fixture on the dev server, tests that fire after every merge. On paper? Clean. We even got the first one working: creating a Social Posts Right, the simplest entity we have, name and status and allocation, nothing fancy. Drawer closes, toast appears, test passes. Lovely.

You know what they say about the first 80%.

## Layer one: you can't record the test until the app is ready to be recorded

The whole pitch of modern E2E testing is that you don't hand-write every click. You record. Playwright watches you move through a flow and spits out a script. Magic, right?

Except the recording is only as stable as the thing it's recording. Every interactive element in a flow needs a stable identifier baked into the source code first: a `data-testid`, an `inputId`, something that won't change when a designer tweaks the copy or refactors the styling. And not every component had one. Some buttons were icon-only, no text, no title. Some dropdowns were React selects that codegen would record as fragile emotion-class soup — selectors that look like `.emotion-class-nxiuxh-container` and break the moment anything shifts.

So before recording a single flow, you do an audit pass. You go through the source, you add identifiers, you follow a naming convention so the testids stay grep-friendly. Then — and only then — can you press record.

And here's the part that stung: you repeat that pass every single time a new flow comes online. It isn't a one-time setup tax. It's a recurring toll.

## Layer two: "record it and you're done" is a half-truth

Fine, I thought. The prep is annoying but bounded. Once the app is instrumented, the recorder does the heavy lifting.

Mostly. Not entirely. The recording-to-test conversion works, but it's not one-click reliable. The raw output regularly needs manual fixes: unrecognizable selectors, ambiguous elements, edge cases the conversion can't resolve on its own. We built a Claude skill to turn recordings into proper Page Object Model tests, and it's genuinely good. It asks one clarifying question at a time when it hits a field it can't identify, greps the right component, slots it in. Real craft went into that.

But every one of those clarifications sends you back into the source code. A dropdown without an `inputId`? Go add it. A button the recorder couldn't pin down? Same trip. The conversion is a conversation, not a transaction, and conversations take time.

## Layer three: the flows worth testing are the ones most likely to break

This is where my optimism really started to wobble.

The high-value tests are the long ones. Create a campaign, then a line item, then a visual, a chain with fifty to a hundred interactive elements before you reach the assertion that matters. Those flows are the heart of the product. They're exactly what you'd want a robot guarding overnight.

They're also the most fragile thing you can build. Any UI change anywhere in the middle snaps the entire chain. Fixing one broken test in a long flow can cascade into hours, because the break isn't where the error message points — it's three steps upstream, in a drawer somebody redesigned on Tuesday. The longer the flow, the bigger the blast radius. The more valuable the test, the more it costs to keep alive.

That's not a bug in our setup. That's just the physics of E2E testing on a product whose UI changes every week. And ours changes a lot.

## Layer four: the mess nobody knows how to clean up

Then there's the test data. Every run creates records. On a clean internal entity, that's solved — the test deletes what it made through a direct API call, or a nightly cron sweeps up the orphans from crashed runs. Tidy enough.

But some flows touch external platforms. A test that creates a TikTok or Facebook entity creates something we don't fully control. Those can't be reliably deleted by a scheduled job, because each platform plays by its own rules for what can be removed and when. So you're left with a permanent open risk: test debris accumulating on someone else's system, with no clean broom.

I didn't have an answer for that one. I still don't. And "we'll figure it out later" is how open risks become incidents.

## The lesson wasn't "I planned badly"

Here's what I kept feeling, honestly, the whole week: I'm almost done. Just this one more fix. Then I'd solve it and the floor would drop out and there'd be another room underneath.  Stable identifiers, then conversion gaps, then fragile long flows, then the cleanup problem. Each layer revealed another layer.

For a while I read that as a personal failure. Bad estimating. Should've seen it coming. But that's not it. This is genuinely how E2E complexity behaves on a fast-moving UI. The maintenance cost doesn't end when setup ends. It compounds with every release. A test suite isn't a thing you build and own. It's a thing you feed. And I had to ask, out loud and to the client: is this the thing we want to be feeding right now?

The answer, for us, today, was no.

## Why the "no" was the deliverable

It would've been easy to keep going. Ship more tests, show more green checkmarks, let the maintenance bill quietly grow until it became someone else's problem. Demos are seductive that way. They show you the feature working and hide the cost of keeping it working.

So I wrote the client the unglamorous version. The approach works in theory, the real cost is far higher than it looks from the outside, and it recurs as the UI evolves. My recommendation: pause the investment now.

But — and this matters — pausing isn't the same as throwing the week away. The groundwork stands. The POM structure, the recording workflow, the selector conventions, the conversion skill, the code-review rules that flag a missing test before it ships. If we revisit this when the UI settles, or when a specific flow becomes critical enough to justify the upkeep, the foundation is right there. We didn't burn the bridge. We just decided not to drive across it yet.

That's the part I'd want a junior engineer to take from this. Saying no isn't quitting. A well-reasoned no, backed by a week of real investigation and a clear map of what you'd inherit, is sometimes the most senior thing you can hand a client. It saves them months. It saves them from a suite that fails for the wrong reasons and gets ignored — which, remember, is worse than having no suite at all, because it teaches the team to distrust the green check.

So, the question I keep coming back to: when did we start treating "we built it" as the only acceptable ending to an engineering story? Some of the best work I've done ended with a clear recommendation and nothing merged. This was one of those weeks. And I'd make the same call again.
