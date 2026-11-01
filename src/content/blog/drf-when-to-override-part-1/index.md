---
title: 'Django REST Framework: when (and when not) to override serializers and viewsets, part 1'
description: 'Part 1 covers serializers: which methods to override for validation, saving, and output formatting, and what logic does not belong in a serializer at all.'
pubDate: '2025-08-10'
canonicalUrl: 'https://dev.to/soldatov-ss/part-1-django-rest-framework-when-and-when-not-to-override-serializers-and-viewsets-11a7'
heroImage: './cover.webp'
tags: ['django', 'drf', 'architecture', 'clean-code']
---

## DRF, part 1: serializer overrides
Ask any Django developer where to put validation, formatting, and orchestration logic, and you’ll often get different answers — some say “just put it in the serializer,” others drop everything in the viewset.

This works… until it doesn’t.
When your API grows, mixing concerns makes code brittle, hard to test, and painful to maintain. Knowing exactly **when** to override a serializer method and **when** to override a viewset method is key to keeping a codebase clean.

---
### The serializer's core mission

Think of your serializer as the security guard at the door of your database. It's responsible for three primary tasks:

1. **Validation**: Checking the ID of incoming data to ensure it's legitimate.
2. **Transformation**: Making sure the data is in the right format before being saved.
3. **Representation**: Deciding how the data should be presented when it's sent back out.

Its world is small and focused: just the data. Let's look at the tools it uses.

---

### 1) Serializer method overrides
**Role**
Serializers control what may enter and how it leaves: validation, input normalization, output formatting.

`validate_<field_name>(self, value)` - field-level checks
This is your go-to for single-field validation. Django's model fields and DRF's serializer fields handle the basics, like checking if a field is an integer or a valid email. But what about your specific business rules?

Use this when a single field has a rule that only it needs to worry about.

**Example**: Imagine you have a `Product` model with a `discount_percentage` field. For most products, any discount is fine. But for the "Electronics" category, you need to cap it at 50% to protect your margins.

`validate(self, data)` - cross-field validation
Sometimes fields can't be validated in isolation. They have relationships; they depend on each other. `validate` is where your fields have a conversation. It runs after all the individual `validate_<field>` methods have passed.

Use this for cross-field validation.
**Example**: A classic case is a `PromoCampaign` model with a `start_date` and an `end_date`. It makes no sense for the promotion to end before it even begins.

```python
def validate(self, data):
    """
    Check that the start date is before the end date.
    """
    if data['start_date'] > data['end_date']:
        raise serializers.ValidationError("End date must occur after start date.")
    return data
```

Simple enough, right? This keeps your data integrity rules right next to the data definition.

`create(self, validated_data)` 
DRF's default `create` method is wonderfully simple: it just unpacks your validated data and calls `YourModel.objects.create(**validated_data)`. But sometimes "simple" isn't enough.

- Override `create` when you need to control exactly how a new object instance comes into being. This could mean:
- Creating related objects in the same transaction.
- Injecting data that doesn't come from the user, like `created_by=self.context['request'].user`.
- Handling nested serializers for write operations.

```python
# In a UserProfileSerializer that also creates a user
def create(self, validated_data):
    user_data = validated_data.pop('user')
    user = User.objects.create_user(**user_data)
    # Stamp the current user from the view's context
    created_by_user = self.context['request'].user
    profile = UserProfile.objects.create(user=user, created_by=created_by_user, **validated_data)
    return profile
```

`update(self, instance, validated_data)`
Just like `create`, the default `update` method loops through the validated data and does a `setattr(instance, key, value)` for each item before calling `instance.save()`. You should override it when you have more complex update logic.

Maybe you need to prevent updates if an order is already "shipped." Or perhaps updating one field requires a calculated change to another.

**Example**: When updating a blog post, you want to replace all its tags, not just add new ones. The default `update` for a many-to-many relationship might not do exactly what you want.

```python
# In a PostSerializer with a 'tags' field
def update(self, instance, validated_data):
    tags_data = validated_data.pop('tags', None)

    # This is the default behavior for all other fields
    instance = super().update(instance, validated_data)

    # Now, handle the tags with our custom logic
    if tags_data is not None:
        instance.tags.set(tags_data) # Replaces all existing tags

    return instance
```

`to_representation(self, instance)`
This is the "glow-up" method. It's the last stop before your data is serialized and sent out into the world. Its job is to shape the outbound data. The model might store a user ID, but you want to show their full name. The database has a `first_name` and `last_name`, but you want to add a `full_name` field to the API response.

**Example**: Add a computed field to your User serializer.

```python
# In your UserSerializer
def to_representation(self, instance):
    # Get the default representation
    representation = super().to_representation(instance)
    # Add our custom field
    representation['full_name'] = instance.get_full_name()
    return representation
```

### So, when should serializers just say no?
This is just as important. A serializer that does too much becomes a god object. Here’s what doesn't belong in a serializer:

**Heavy Side Effects**: Sending emails, charging credit cards, updating inventory in another system, calling third-party APIs. This is a one-way ticket to a maintenance nightmare. If the database transaction fails after the email is sent, what do you do? This logic belongs elsewhere.

**Complex Queries**: A serializer's `validate` method shouldn't be making five different database calls to check a condition. That logic should live in a dedicated place (like a "selector" function or repository's function) and be called from the view.

**Business Workflows**: A multi-step process, like "register user, create trial subscription, and schedule a welcome email," is a business workflow. It's too high-level for a serializer. This is a job for a service layer.

--- 

In [Part 2](/blog/drf-when-to-override-part-2/) of this series, we’ll dive into the ViewSet's role as the orchestra's conductor and explore how to use its methods—and a service layer—to keep your application logic clean and organized.
