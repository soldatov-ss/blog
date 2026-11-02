---
title: 'Almost done: the hidden tradeoffs of Playwright E2E testing in a fast-moving app'
description: 'A week of investigating Playwright on a fast-moving UI ended with a recommendation to stop. Four hidden costs that make end-to-end tests cheap to start and expensive to keep.'
pubDate: '2026-06-07'
heroImage: './cover.png'
tags: ['playwright', 'e2e-testing', 'engineering-judgment']
---

I kept thinking I was one fix away from done. Add a stable identifier here, patch a selector there, and the suite would finally go green. Then green would reveal the next thing underneath it. By the end of the week I'd learned something I hadn't known going in: this is just how end-to-end testing behaves on a product whose UI changes every release. My planning was never the issue.

The premise was almost too clean. The goal was modest: a test that clicks through creating a campaign the way a real user would, so we'd know the moment a merge broke it. You record that flow once with Playwright's codegen, paste the raw output into a Claude skill, and get back a structured test. No writing selectors by hand, no describing every button. Record, convert, done. I built that workflow, and it worked: the first test went green. That's the dangerous part — the surface really does deliver, which is exactly why you trust it before you've seen what's underneath.

## The first cost: the app has to be built to be recorded

Codegen can only record what the page makes addressable. Point it at a button with visible text and you get a clean selector. Point it at a three-dot actions menu with no label, and you get `getByRole('button').nth(5)`, an index that breaks the instant a row reorders. Point it at one of our react-select dropdowns and codegen records `.emotion-class-nxiuxh-container > … > .emotion-class-11rjtvl`, a chain of generated CSS classes that won't survive the next restyle.

So before you record anything, every interactive element in the flow needs a stable identifier added to the source. Not all of them had one. That meant an audit-and-prep pass through the components first, and another pass every time a new flow gets added later. The "record" step everyone pictures as step one is actually step two.

## The second cost: conversion is its own negotiation

Say you've prepped the app and recorded the flow. The conversion still isn't one-click. The skill turns most of the recording into a clean test, then stops at the parts it can't resolve on its own: a selector it doesn't recognize, an element that's ambiguous, a dropdown that still came through as an emotion class. For each one it asks a question, and answering it means going back into the source: add an `inputId` here, a `data-testid` there, re-record or hand-patch. A recording is just a list of clicks. The real work is reconstructing the intent behind them, and that work lives half in the test file and half back in the components.

And that's the cost for a short flow. The flows actually worth testing aren't short.

## The third cost: the most valuable tests are the most fragile

The whole point of end-to-end testing is the long flow — create a campaign, then a line item inside it, then a visual on top of that. Fifty to a hundred interactive elements in a single chain, the exact journey a real user takes and the exact journey no unit test can cover. That's where the value is. It's also where the fragility is, and it's the same property producing both: the test is long because the flow is long, and every step in it is something that can change. A relabeled field in the middle, a reordered step, a drawer that now opens differently — any one of them breaks the chain from that point on, and a single UI tweak can turn into hours of tracing which step actually moved. The Page Object Model helps here: fix the selector in one class and every test that uses it recovers. But it only softens the blow, it doesn't stop the punches. The flows you most want to protect are the ones that break most often.

## The fourth cost: the test data you can't take back

The first three costs are all about getting a test written and keeping it green. The fourth is different in kind. It's about what a test leaves behind. A real campaign flow doesn't just touch our own database; it creates entities on TikTok and Facebook. Internal records you can clean up: record the ID, fire a delete in `afterEach`, and a nightly cron sweeps whatever a crashed run left orphaned. External entities you can't, at least not reliably. Each platform has its own deletion rules, its own delays, its own idea of what's even allowed. There's no scheduled job that dependably undoes them. And unlike the other three, this cost doesn't shrink as the suite matures. It's a standing risk that grows with every test that touches a real platform.

## The cost doesn't end — that's the finding

Here's what ties the four together. A normal feature has a build cost, and then it's done. These costs don't behave that way. The prep, the conversion fixups, the broken chains, the orphaned external data — each one recurs every time the UI moves, and on this product the UI moves every release. You don't build the suite once and walk away. You keep paying for it, and the bill scales with exactly the velocity that makes the product worth testing.

That's why I stopped thinking I was one fix away from done. There was no "finish" to reach at the cost I'd assumed; I just hadn't seen that yet. So the recommendation I brought back wasn't a test suite. It was: pause E2E investment for now, and keep the groundwork in place — the Page Object structure, the recording workflow, the selector conventions, the conversion skill all stay, ready if we ever decide the trade is worth it. The investigation produced something better than the thing we set out to build: a clear-eyed reason not to build it yet, and that turned out to be worth more than the suite would have been.

## If you're about to add Playwright to your project

Here's what to actually expect, in plain terms:

| What you're signing up for | When it costs you |
| --- | --- |
| **Prep before you can record.** Every element in a flow needs a stable identifier in the source first. | One upfront audit per app, then a smaller pass *every time you add a new flow*. |
| **Cleanup after recording.** The auto-conversion gets you most of the way; the rest is manual fixes back in the source. | A chunk of time *per flow*, every flow. It never drops to zero. |
| **Maintaining long flows.** The high-value multi-step tests break whenever a step in the middle changes. | Recurring, *per UI change*. A single tweak can cost hours of tracing. |
| **External test data.** Entities created on TikTok/Facebook can't be reliably auto-deleted. | Ongoing risk that never resolves; it grows with every test that touches a real platform. |

None of these are one-time. The setup is the part you can budget for; the rest you pay on every release.

