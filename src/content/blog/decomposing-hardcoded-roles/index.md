---
title: 'Decomposing hardcoded roles: rewriting access control in a Django app without breaking customers'
description: 'How we replaced three hardcoded roles with 46 named permissions and customer-defined roles, and proved nothing changed before changing anything.'
pubDate: '2026-10-31'
heroImage: './cover.gif'
heroStill: './cover-still.jpg'
tags: ['django', 'python', 'architecture', 'access-control']
---

Our Django monolith runs a no-code workflow product, and every user in it was one of three hardcoded roles: `admin`, `member` or `light_user`. That worked until customers started asking for something in between, like a person who manages integrations without being a full admin. Each of those requests meant a code change on our side, and usually the answer was "make them an admin", which handed over every other admin power too.

Over about three and a half months we replaced those roles with a catalog of 46 named permissions, let customers build their own roles from it, and shipped it to production. Existing roles kept doing what they did before, apart from a few changes we made on purpose.

Here is how we did it, and the rule that kept production safe throughout: prove nothing changed, then change things.

## The legacy problem: one question, four places to answer it

Each organization membership stored one of three role strings, and access decisions were role predicates like `is_organization_admin` or `is_light_user`. Each of them asked "which role are you?", never "what are you allowed to do?".

Worse, those checks lived in four different layers:

* django-rules registries
* DRF permission classes
* queryset filters deciding which rows a user sees, which duplicated the rules logic as raw `Q` objects
* ad-hoc inline role checks in views, serializers and services

On top of the all-or-nothing admin, this created three more problems:

* **Hardcoded exceptions:** The light user was not a set of powers but about 15 hardcoded branches and bespoke screens spread across several apps. Changing it was fragile, and generalizing it was impossible.
* **Implicit checks:** Some member powers had no check at all, because the code assumed "anyone who isn't a light user can". You can't refactor a check that doesn't exist.
* **Documentation drift:** Nobody had a single table of what each role could actually do, and the docs and the code already disagreed.

Replacing the role checks and introducing custom roles in one step would have made regressions difficult to detect. Before changing the authorization model, we needed a way to prove what the application allowed (and what it denied) today.

## The arc: how we got there

We split the project into five phases:

1. **Safety-net test grid:** establish coverage before changing the authorization code.
2. **Admin decomposition:** replace hardcoded admin checks with explicit permission codes, while seeding the legacy roles to preserve their existing behavior.
3. **Member decomposition:** do the same for everyday member permissions before customers could build roles on top of the catalog.
4. **Custom roles:** let customers define roles from the catalog and assign them, behind a per-organization feature flag.
5. **Light user decomposition:** express restricted-user access through the new model, so customers can build roles like "a light user who can also see workflows".

## Prove nothing changed before changing anything

We wanted to replace the authorization mechanism without changing what customers could do. Instead of hiding the refactor behind a feature flag, we built an allow/deny test grid for every registered permission, and the grid staying green was the proof.

The deny side is what matters. A test that only checks "the admin can do X" still passes after someone deletes the restriction. So a typical entry checks one permission from three sides:

```python
def test_change_process(admin, member, another_member, process):
    # process.lead = member
    assert admin.has_perm("processor.change_process", process)              # allow: role
    assert member.has_perm("processor.change_process", process)             # allow: workflow lead
    assert not another_member.has_perm("processor.change_process", process)  # deny
```

We wrote these against the old role checks, and they had to pass unchanged after every refactoring step.

The guard compares the grid with the live django-rules registry, so a new permission without tests fails CI:

```python
def test_registry_matches_grid():
    assert set(rules_registry.keys()) == REGISTERED_PERMISSIONS
```

The feature flag came back only for custom roles, the first change customers could actually see.

## Separating roles from relationships

Not every access question is about roles. "Can this role delete workflows?" and "Is this user the lead of this workflow?" are different questions, so we kept them apart:

* **Role permissions** decide what a user can generally do.
* **Relationships** decide how a user relates to a specific item: workflow lead, step assignee, team member, folder collaborator.

The new system answers only the role half, through one helper:

```python
user.has_org_permission(org_id, "workflow.delete")
```

The same lookup backs a django-rules predicate and a DRF permission class, so every layer asks the same question. At the call site, the two halves are OR-ed:

```python
can_delete = has_perm("workflow.delete") | is_workflow_lead
```

Relationship checks stayed exactly as they were. That kept the refactor small, and it's why a role without "View all workflows" still sees the workflows its user is involved in.

One more decision removed a whole class of bugs: the admin role holds every member permission plus the admin-only ones, so no check needs an extra "or is admin" branch.

## Defining the catalog: from code to frontend

Every permission is declared in code as a catalog entry. An idempotent seed command syncs the catalog to the database on every deploy.

A single permission looks like this:

```python
CatalogPermission(
    code="team.view",
    name="View all teams",
    resource="Teams",
    read_write=ReadWrite.READ,
    description="See every team in the organization, not only your own",
    group=_G.WORKSPACE,  # section in the role editor
    classification=_C.MEMBER_AND_ADMIN,  # built-in roles that get it by default
    requires=("workspace.overview", "team.overview"),  # auto-ticked together
)
```

The catalog has three kinds of codes, and this example touches two of them:

- **Page-display codes (`*.overview`)** show or hide a section of the app, like the Teams page.
- **"View all" codes (`*.view`)** let a user see every item in the organization, not only the ones they are related to.
- **Action codes** (`create`, `manage`, `delete`, `export`, ...) let a user change things.

The `requires` list defines dependencies between permissions. Ticking "View all teams" in the role editor also ticks the Workspace and Teams pages it depends on, and the server rejects any role that holds a code without its requirements.

## The data model

Three tables carry the whole system:

* `Permission`: one row per catalog code, with its name, description, group and `requires` list.
* `Role`: a named set of permissions. System roles (`admin`, `member`, `light_user`) have no organization and are shared by everyone, while custom roles belong to one customer organization. Each role has a stable `code` that identity providers can map onto.
* `RolePermission`: the join table mapping permissions to roles.

```text title="Role ↔ Permission" alt="Diagram: Role and Permission are many-to-many, joined by the RolePermission table (role_id, permission_id)."
       +-------------------+             +-----------------------+
       |       Role        |             |      Permission       |
       +-------------------+             +-----------------------+
       | id                |             | id                    |
       | code              |             | code                  |
       | name              |             | group                 |
       | organization_id   |             | requires              |
       | is_system         |             +-----------+-----------+
       +---------+---------+                         |
                 |                                   |
                 |       +-------------------+       |
                 +------>|  RolePermission   |<------+
                         +-------------------+
                         | role_id           |
                         | permission_id     |
                         +-------------------+
```

Memberships still store the old role string, which resolves to the matching system role. A custom role replaces it only on a `member` membership in an organization with custom roles enabled, so organizations without the flag see no change at all. Every change to roles, their permissions and role assignments is recorded with django-simple-history.

### Granularity strategy: start coarse

We started with coarse permissions and split them only when the existing authorization logic required a distinction.

Splitting a permission later is relatively straightforward. Merging permissions is harder: once customers have custom roles, someone may have one permission enabled and the other disabled. Combining them means deciding what happens to those saved choices.

That's why API keys, folders, members and teams ended up with a single `*.manage` permission rather than separate edit and delete permissions. Running workflows needed finer distinctions, so we split those actions.

### New permissions vs. saved custom roles

Once customers save roles, every new permission raises a question: should existing custom roles get it? We can't know whether a customer meant a role to be powerful or locked down, so the seed never touches custom roles.

Instead, a new permission reaches them through an explicit, reversible data migration that pins it to an existing one. When we split stopping a running workflow out of editing it, every custom role that could already edit (and so could already stop) received the new stop permission. Nobody gained or lost a power.

### Performance controls

Permission checks can happen many times during a single request, so we resolve the user's effective permission set once per request and memoize it on the user object.

We also deliberately left the permission tables out of ORM-level caching, so a role edit takes effect on the next request without a cache-invalidation mechanism.

## Decomposing the light user

Admin and member mostly differed in _which_ checks they passed. The light user was different: a separate code path with its own branches and screens, making it the hardest of the three roles to fold into the permission system.

The obvious options all had the same flaw. Letting a custom role start from a "base role" (member or light user), or adding a `base_role` column, would keep role-string checks and permission checks alive side by side forever. One permission per hardcoded site would have meant about ten codes for what was mostly the same idea.

The key was identifying the light user's defining trait: they only see content they're directly involved in, not organization-wide content. We expressed that through a single permission, `organization.view_public_content`. Admin and member have it; light user doesn't. Without it, visibility stays limited by relationships, such as assigned workflow steps.

Customers can now create a "near light user": a custom role that leaves this permission disabled while adding whatever other capabilities they need. The real light user role behaves exactly as before, and the change needed no schema migration.

## Frontend controls and user experience

The frontend needs to reflect the backend's authorization decisions without becoming a second source of truth.

- **The UI follows permissions.** The backend returns the user's permissions for the active organization. The frontend uses them to show or hide navigation items and actions, rather than checking the user's role name.

- **Hiding isn't security.** Without an `*.overview` permission, a section disappears from the navigation, but the API and links from related items keep working. The backend must still check permissions and filter data.

- **Unavailable actions:** if a user can't perform an action, the UI disables the corresponding control and explains why.

- **Users can't change their own role, not even admins.** Otherwise a custom role allowed to manage members could promote itself to admin.

## Lessons learned

The biggest lesson was to separate the behavior-preserving refactor from the product change. We replaced the authorization mechanism first, proven by a deny-heavy test grid, then introduced custom roles behind a feature flag.

The second lesson: the catalog becomes a contract the day a customer saves a role. Start coarse, and decide how new permissions reach existing custom roles before you need to.
