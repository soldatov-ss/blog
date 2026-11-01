---
title: 'Django REST Framework: when (and when not) to override serializers and viewsets, part 2'
description: 'Part 2 covers ViewSets: when to override create versus perform_create, how update, partial_update, and perform_update fit together, and a cheat sheet for where each kind of logic goes.'
pubDate: '2025-08-10'
canonicalUrl: 'https://dev.to/soldatov-ss/part-2-django-rest-framework-when-and-when-not-to-override-serializers-and-viewsets-3j32'
heroImage: './cover.webp'
tags: ['django', 'drf', 'architecture', 'clean-code']
---

## DRF, part 2: ViewSet overrides

Welcome to the second half of our guide on DRF architecture. In [Part 1](/blog/drf-when-to-override-part-1/), we established a clear rule: serializers are the guardians of your data. They handle validation, transformation, and representation. They ensure that the data entering your system is clean and the data leaving is well-formed.

But that’s only half the picture.

## The ViewSet's core mission: orchestration

Viewsets handle the HTTP journey. They don't care if a `start_date` is before an `end_date` — that's the serializer's job. They care about things like:

- Parsing the incoming `request`.
- Checking permissions and authentication.
- Calling the serializer to validate data.
- Triggering the save operation.
- Formatting the final `Response` with the right data and status code.

Let's explore the most common and powerful methods you can override.

## The big showdown: `create` vs. `perform_create`
This is where so much confusion happens. Both seem to do the same thing! But their purpose is completely different, and choosing the right one is key to clean code.

- Override `create(self, request, *args, **kwargs)` when you need to change the **orchestration of the request or the shape of the final response**. Do you need to return a `202 Accepted` instead of a `201 Created`? Do you need to wrap the response in a `{ "data": ... }` envelope? Do you need to do something before the serializer is even validated? That's a job for create.

- Override `perform_create(self, serializer)` when you just need to **tweak how the object is saved**. This is a much cleaner, more focused hook. The default create method calls this after validation is successful. It's the perfect place to inject the current user or tenant ID right before saving.

**A practical rule of thumb**: Always try to use `perform_create` first. Only override the full `create` method if you absolutely have to manipulate the HTTP response or the flow itself.

```python
# In your OrderViewSet
class OrderViewSet(viewsets.ModelViewSet):
    # ... queryset and serializer_class definitions ...

    # This is the CLEAN way to stamp the user
    def perform_create(self, serializer):
        # The serializer is already validated here.
        serializer.save(customer=self.request.user)

    # Only override this if you need to change the whole dance
    def create(self, request, *args, **kwargs):
        # Maybe you need to check inventory before even trying to validate
        if not check_inventory(request.data):
            return Response({"error": "Item out of stock"}, status=status.HTTP_400_BAD_REQUEST)

        # Now call the original 'create' logic
        return super().create(request, *args, **kwargs)
```
This principle of separating the HTTP-level orchestration (create) from the persistence hook (perform_create) is key. Now, let's apply that same logic to updates.

---

## The update trinity: `update` (PUT), `partial_update` (PATCH), and `perform_update`

Updates are more complex than creates because there are two different ways to do them: a full update (`PUT`) and a partial one (`PATCH`). DRF gives you three distinct methods to control this process.

First, let's get the flow right. It's a common point of confusion. The methods `update` and `partial_update` are peers; one does not call the other.

- A `PUT` request is routed to the `update()` method. After validation, `update()` calls `perform_update()` to save the changes.
  **Flow**: `PUT Request` → `update()` → `perform_update()` → `serializer.save()`

- A `PATCH` request is routed to the `partial_update()` method. After partial validation, `partial_update()` also calls `perform_update()` to save the changes.
  **Flow**: `PATCH Request` → `partial_update()` → `perform_update()` → `serializer.save()`

`perform_update()` is the shared, final step for both. With that in mind, here’s when to override each one.

--- 
### When to override `perform_update(self, serializer)`
This is your go-to hook for 90% of update logic. Override `perform_update` when you have code that **must run for any update, whether it's a** `PUT` **or a** `PATCH`. It keeps your code DRY (Don't Repeat Yourself) by providing a single place for shared save-time logic.

- **Why Override?** You need to stamp a field, clear a cache, or log an update without caring if it was a full or partial change.
- **Example**: You always want to record which user was the last person to modify an object.
```python
def perform_update(self, serializer):
    # This logic runs for both PUT and PATCH, after validation.
    # It's the cleanest place for shared save-time hooks.
    serializer.save(last_updated_by=self.request.user)
```

### When to override `partial_update(self, request, *args, **kwargs)`
Override the `partial_update` method for logic that should **only run during a partial change** (`PATCH`). This is incredibly useful for implementing fine-grained permissions or triggering specific side effects when certain fields are modified

- **Why Override?** You want to allow different update rules for different fields, or you want to react to specific, targeted changes.
- **Example**: In a project management system, maybe anyone can `PATCH` a task's `description`, but only a manager can `PATCH` its `due_date`. Overriding `partial_update` is the perfect place to check for this.

```python
def partial_update(self, request, *args, **kwargs):
    # Custom logic just for PATCH
    if 'due_date' in request.data and not request.user.is_manager:
        return Response({"error": "Only managers can change the due date."}, status=status.HTTP_403_FORBIDDEN)
    
    # Another example: trigger a notification ONLY if the status changes
    if 'status' in request.data:
        instance = self.get_object()
        old_status = instance.status
        new_status = request.data['status']
        if old_status != new_status:
            notify_team_of_status_change(instance, new_status)

    return super().partial_update(request, *args, **kwargs)
```


### When to override `update(self, request, *args, **kwargs)`
Override the `update` method when you need to add logic that is **specific to a full resource replacement** (`PUT`). Because `PUT` implies replacing the entire resource, you might have preconditions or post-conditions that don't apply to a simple `PATCH`.
- **Why Override?** You want to enforce a strict "all or nothing" replacement policy or perform an action that only makes sense when the entire object is changed.
- **Example**: Imagine you have a `Settings` object. You could override `update` to ensure that a `PUT` request truly contains every single required setting field, preventing users from accidentally wiping out settings by sending an incomplete object. You could also log a specific "Settings Overwritten" event that is more severe than a simple field change.

```python
def update(self, request, *args, **kwargs):
    # Custom logic just for PUT
    if not all(key in request.data for key in ['theme', 'notifications', 'timezone']):
        return Response({"error": "A full update requires all setting keys."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Log the major change
    log_settings_overwritten(user=request.user)
    
    return super().update(request, *args, **kwargs)
```

---

## Other useful ViewSet hooks
Beyond `create` and `update`, other methods give you powerful control over the request lifecycle:
- `list()`: Override this when you need to reshape the entire list response beyond a simple array of objects, for example, by adding metadata or aggregation summaries.

- `retrieve()`: Perfect for when a single object's response needs extra context that depends on the request, like adding a `can_edit` flag for the current user.

- `destroy()`: The default just deletes the object. Override this to implement soft deletes, check for dependencies, or record an audit log event.

- `get_queryset()`: This is one of the most important overrides for performance and security. It’s where you scope the data (e.g., a user only sees their own invoices) and where you should add performance boosters like `select_related` and `prefetch_related`.

- `get_serializer_class()`: Your viewset's "chameleon." It lets you use different serializers for different actions (e.g., a summary for `list`, details for `retrieve`).

- `get_permissions()`: Great for when permissions change based on the action (e.g., anyone can `GET`, but only staff can `POST`).

---

## The decision guide: where does this logic go?
Let’s boil everything from both articles down to a simple cheat sheet for a clean DRF architecture:
- **Is it about the shape, structure, or validity of data?**

  - **Answer**: Serializer (`validate`, `validate_<field>`, `to_representation`).
- **Is it about managing the HTTP request/response flow, like returning a custom status code or handling action-specific permissions?**

  - **Answer**: ViewSet action (`create`, `update`, `list`, etc.).
- **Is it about changing how an object is saved after validation, for both `PUT` and `PATCH`?**

  - **Answer**: ViewSet `perform_*` method (`perform_create`, `perform_update`).
- **Is it about filtering the main list of objects based on the user or request?**

  - **Answer**: ViewSet `get_queryset` method.


Keeping these boundaries clear isn't just an abstract architectural exercise. It’s a practical strategy for building software that can grow and adapt without collapsing under its own weight. Your team will thank you. And more importantly, your future self will, too.
