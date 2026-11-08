---
title: 'Why Django REST Framework doesn''t show your custom validation error messages (and what to do about it)'
description: 'DRF skips model full_clean(), so custom constraint messages may never reach your API. What DRF 3.17 fixed, what it didn''t, and three workarounds.'
pubDate: '2025-05-21'
updatedDate: '2026-11-08'
tags: ['django', 'drf', 'python']
---

> **Update, November 2026:** DRF 3.17.0 fixed the most common case. A multi-field `UniqueConstraint`, like the example below, now passes its `violation_error_message` through to the API response. A single-field `UniqueConstraint(fields=['email'])` still returns DRF's default message (`"… with this email already exists."`). Tested on DRF 3.16.1, 3.17.0 and 3.18.3 with Django 6.1. If you're on 3.16 or older, upgrade first. The workarounds below are for older versions and the single-field case.

The GitHub Discussion: [link](https://github.com/encode/django-rest-framework/discussions/7850)

![GitHub comment by grjones from 2015 arguing that ModelSerializers no longer running model-level clean or full_clean pushes business logic into views](./image-1.png)



## Issue developers face:

When developing with Django REST Framework (DRF), developers typically run into issues where error messages for custom validation specified on Django model constraints (e.g., UniqueConstraint.violation_error_message) are not passed through to API responses. DRF returns default validation error messages instead.

For example, a custom error message like:
```python
UniqueConstraint(
    fields=['email', 'username'],
    violation_error_message='This email and username combination already exists.'
)
```
...might never actually reach the API client.

Instead, you'll see something generic like:
```json
{"non_field_errors": ["The fields email, username must make a unique set."]}
```

This is what the DRF maintainers had to say about it:

- DRF validation is deliberately occurring at the serializer level, **before** the creation of the model instance.

- It intentionally avoids calling Django's `full_clean()` in this processes, as serializers are meant to validate incoming data instead of an already-created model instance.

- Due to the complexity and backward compatibility issues, there were no immediate plans from DRF for changing this behavior. (DRF 3.17 later changed it for multi-field `UniqueConstraint`; see the update above.)

In other words - DRF prioritises serialiser checking for API input, which means that unless you explicitly call model checking (e.g. via `full_clean()`), constraint errors and their custom messages will never be called or shown in API responses.


## Possible solutions:

Developers can tackle this issue through several practical approaches:

- **Explicitly calling `full_clean()`:**
```python
def create(self, validated_data):
    instance = MyModel(**validated_data)
    try:
        instance.full_clean()
    except DjangoValidationError as e:
        raise DRFValidationError(e.message_dict)
    instance.save()
    return instance
```

- **Custom serializer validators:**

This method just overrides DRF's built-in UniqueTogetherValidator just to replace the error message.

```python
class CustomUniqueValidator(UniqueTogetherValidator):
    def __call__(self, attrs, serializer):
        try:
            super().__call__(attrs, serializer)
        except serializers.ValidationError:
            raise serializers.ValidationError("This email and username combination already exists.")
```

-  **Sometimes just double your validation code:**
Sometimes, custom validators and extra abstractions aren't needed. Although we all know the DRY principle, sometimes it's acceptable to just duplicate simple validation logic directly into your serializer

```python
class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ['email', 'username']
        validators = [
            UniqueTogetherValidator(
                queryset=MyModel.objects.all(),
                fields=['email', 'username'],
                message="This email and username combination already exists."
            )
        ]
```


### Summary:

**Issue**: DRF doesn't carry forward most custom validation messages defined in Django. Since DRF 3.17, multi-field `UniqueConstraint` messages are the exception.

**Reason**: For reasons of architecture and backward compatibility, DRF validates its data independently from Django's model validation.

### Important warnings:
Be careful where you place validation logic. Django models can be modified via the admin interface, serializers, or directly with bulk operations (.update()).

Placing the critical validation logic into `save()` or `full_clean()` is problematic, as those aren't called when performing bulk updates or certain direct model manipulations. Always bear these edge cases in mind when developing your validation plans.

This approach keeps your validation logic consistent, reusable, and well-documented throughout your project.
