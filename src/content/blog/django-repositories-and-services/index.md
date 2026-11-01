---
title: 'Django without the mess: repositories for data, services for rules'
description: 'Why selectors are a trap for cleaning up fat Django models, and how repositories for data access plus services for business rules keep the layers apart.'
pubDate: '2025-09-07'
canonicalUrl: 'https://dev.to/soldatov-ss/django-without-the-mess-repositories-for-data-services-for-rules-k8e'
heroImage: './cover.webp'
tags: ['django', 'python', 'architecture', 'clean-code']
---

## The elephant in the room: Django's fat model problem

Let’s talk about the elephant in every Django project: that one `models.py` file. You know the one. It started pure and simple, a beautiful reflection of your database schema. Now, it's a 2,000-line behemoth, bloated with custom managers, `@property` decorators that hide monstrous queries, and `save()` methods that seem to have more side effects than a late-night infomercial product.

Your views are a mess, your business logic is scattered, and making any change feels like performing surgery with a butter knife. In this moment of desperation, a seemingly elegant solution appears: "selectors." Just pull all those messy queries out into a separate `selectors.py` file! It feels clean. It feels right.

But I'm here to tell you that selectors are a trap. They’re a quick fix that feels like progress but ultimately leads you down a path of architectural pain. There’s a better way, a more structured approach that will save you from future headaches: the Repository and Service patterns. Let’s break down why this combination wins, and why selectors just don’t hold up in the long run.

---

## How we all got here
No one sets out to write messy code. We typically arrive here by following well-intentioned advice. In the Django world, the classic mantra is "fat models, thin views." The idea is to keep your views lean and push all the logic related to your data into the corresponding model.

And for a small project, this works beautifully! A `User` model with a method like `is_profile_complete()` is perfectly reasonable. But what happens when the logic gets more complex? Soon, you have `user.get_recent_orders()`, `user.calculate_lifetime_value()`, and `user.send_password_reset_email()`. Your model is no longer just a data structure; it's a tangled web of business rules, database queries, and external interactions.

This is when developers, rightly, look for a way to clean up. The `selectors.py` file is born. You create functions like `user_get_active_with_recent_orders()` and `product_get_top_sellers()`. The model slims down, the view calls a clean function—problem solved, right?

Not quite. Honestly, this is like sweeping a pile of dirt under the rug. The room looks cleaner at a glance, but you haven't actually dealt with the mess. You’ve just moved it. This separation is superficial, and as we’ll see, it creates a whole new set of problems.

---

## Repository pattern 101: your data's bodyguard
So, what’s the alternative? Let’s start with the first piece of the puzzle: the **Repository Pattern**.

In the simplest terms, a repository is an abstraction layer that sits between your application's business logic and your database. Its one and only job is to handle data access. Think of it as a specialized agent for a particular model. If you need to get users, save a user, or delete a user, you talk to the `UserRepository`. You design it to serve your use cases, not to mirror every possible query.

**Structure**:

```text
your_app/
  users/
    models.py
    repositories/
      __init__.py
      users.py
    services/
      __init__.py
      users.py
```
And here’s what that `UserRepository` might look like, inheriting from a `BaseRepository` (like the one [here](https://gist.github.com/soldatov-ss/ad8a158b5e65308c952553bbe451fda9)):

```python
# your_app/users/repositories/users.py

from your_app.apps.common.repositories import BaseRepository 
from your_app.users.models import User
from typing import Optional


class UserRepository(BaseRepository):
    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.filter(id=user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.filter(email=email).first()
```
**Why this matters**

- **Clear contract.** It provides a single, explicit interface for data operations. No more `User.objects.filter(...)` scattered across 20 different files. You centralize your query logic in one place.
- **Centralized query intent.** If a flow needs special prefetch or annotations, you add a method and keep it consistent.
- **Test seams.** You can pass a fake repository in tests. You can add caching or logging in one place without hunting through views.

---

## The service layer, also known as the brain

If repositories are your data's bodyguards, services are the brain of the operation. Services sit above repositories to orchestrate business workflows and enforce rules. They are where your transactions should begin and end. If a business rule changes—like "premium users get priority processing"—you want one, and only one, place to make that change.

The best analogy is this: **Repositories fetch the ingredients. Services follow the recipe to cook the meal.**

A service doesn't know _how_ the ingredients are fetched (that's the repository's job), and the view doesn't know _how_ the meal is cooked. The view just says, "I'd like to order the 'New User Registration' please."

```python
# users/services/users.py

from .repositories import UserRepository
# Assume a NotificationService exists elsewhere
from notifications.services import NotificationService

class UserService:
    def __init__(self, user_repo: UserRepository, notification_service: NotificationService):
        self.user_repo = user_repo
        self.notification_service = notification_service

    def register_user(self, email: str, name: str) -> User:
        # Business rule: check if user already exists
        if self.user_repo.get_by_email(email):
            raise ValueError("User with this email already exists.")

        # Step 1: Create the user via the repository
        user = self.user_repo.create(email=email, name=name)

        # Step 2: Orchestrate another action
        self.notification_service.send_welcome_email(user.email)

        return user
```

This is clean, transactional, and easy to follow.

---

## The real risk of selectors: a slippery slope

So if services are the brain, why not just use selectors for the data? The risk isn't that selectors are inherently bad, but that they are a **slippery slope**.

They lack a strong architectural boundary, making it too easy to add "just one little piece" of business logic. Over time, these small compromises turn your clean query file into a tangled, secondary business logic layer.

The Repository and Service pattern prevents this by creating **explicit guardrails**.

- **Repositories** have one job: get data.
- **Services** have one job: enforce business rules.

This clear separation makes the right path the easy path and prevents the slow decay of your architecture.

---

## Admin actions, celery tasks, and the rest of the crew
Keep the same pattern everywhere. Admin actions call services. Celery tasks call services. Management commands call services. DRF viewsets and APIViews call services. One flow. One place for idempotency and retries. If a task runs twice, the service checks state and either skips or continues.

---

## Wiring it together: `__init__.py` as a composition root

Once you have repositories and services, you still need to instantiate them somewhere. A clean way to handle this is to use the package's `__init__.py` as a **composition root**: one file that wires dependencies together and exports ready-to-use singletons.

```text
users/
  services/
    __init__.py   ← wires everything here
    users.py
    notifications.py
```

```python
# users/services/__init__.py

from .notifications import NotificationService
from .users import UserService
from users.repositories import user_repository

notification_service = NotificationService()
user_service = UserService(
    user_repo=user_repository,
    notification_service=notification_service,
)

__all__ = [
    "user_service",
    "notification_service",
]
```

Now callers import a single, already-wired object:

```python
# instead of this
from users.services.users import UserService
user_service = UserService(user_repo=..., notification_service=...)

# just this
from users.services import user_service
```

This keeps instantiation in one place, hides the internal module structure, and makes the public API explicit via `__all__`.

**One tradeoff to know:** services are instantiated at import time. If a test needs different wiring — say, a fake repository — it can't swap the dependency before the module loads. The fix is `unittest.mock.patch` on the singleton, or instantiating locally in the test. Neither is painful, but it's worth knowing before you adopt the pattern.

---

## Common questions you will hear on the team

- **Can I keep a small helper on the model.** Yes, if it only touches that model’s state.
- **Do I always need a service.** If a view is a straight read, repo to serializer can be fine. When you branch or change state, reach for a service.
- **Do I need a repo per model.** Start where it helps most. Big aggregates, heavy queries, hot paths. Let the layer grow with need.
- **Can selectors live beside repos.** If they exist, make them thin wrappers over repos, not a separate source of truth.
- **How does this fit with DRF?** Your viewset or `APIView` calls the service, then passes the result to a serializer. The service never touches the request object or serializer context. That boundary keeps your business logic framework-agnostic — the same service works from a Celery task or a management command without modification.

---

## Why this matters on teams, not only in code

Clean layers make it easier to talk. A PM says, payment failed on retry. You look at one place. A junior asks, where should I put this logic. You have a ready answer. A reviewer reads a PR and knows exactly which patterns to expect. The shape of the system stays steady as the people change.

Also, repositories act like discreet places to teach performance. You can add little comments, like why you used `select_for_update` here, or why an index matters. New teammates learn by seeing the same pattern in many methods. That is softer than sending a long wiki doc that nobody reads twice.

---

## Conclusion: choose clarity over convenience
Look, selectors aren't born from malice. They come from a good place: the desire to clean up messy code. They offer a moment of relief, a feeling of organization. But it’s a temporary fix. They are a crutch, not a long-term architectural strategy.

The Repository and Service patterns require a bit more discipline upfront. You have to think about your application's layers and enforce those boundaries
Keep models slim. Put data access in repositories. Put rules in services. Own transactions at the service layer. Be consistent.
