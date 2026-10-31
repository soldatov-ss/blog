---
title: "The CVE we couldn't patch directly: an Elasticsearch to OpenSearch migration story"
description: 'How a one-line urllib3 security bump turned into migrating a Django app from elasticsearch-py to opensearch-py, and what we vendored to keep the API responses unchanged.'
pubDate: '2026-10-31'
heroImage: './cover.png'
tags: ['python', 'django', 'opensearch', 'security']
---


## Key takeaways

- Legacy search clients like `elasticsearch==7.10.1` hard-cap underlying transport libraries (`urllib3<2`), blocking critical security patches for vulnerabilities like **CVE-2025-50181**.
- `elasticsearch-py 7.14.0+` introduced a client-side `UnsupportedProductError` check that refuses connections to non-Elasticsearch servers, making `opensearch-py` the necessary drop-in for AWS OpenSearch domains.
- Upgrading to `opensearch-py` alone does not guarantee a security fix because its `urllib3` constraint is a floor (`>=1.26.19`), requiring an explicit application-level pin of `urllib3>=2.5.0`.
- When third-party packages like `django-elasticsearch-dsl-drf` are abandoned, vendoring a lean (~190 LOC) project-local filter and pagination layer prevents breaking client-facing REST API response contracts.
- Verifying a search client migration requires separating metadata ping traffic (`size=0`) from document retrieval queries and verifying vulnerability remediation with automated security auditing tools.

When a security advisory hits a core library like `urllib3`, upgrading is usually a routine dependency bump. However, when legacy search clients hard-cap underlying transport libraries, security remediations become full-scale client migrations.

This is the story of that digging: how a security patch that looked like a one-line version bump turned into a full client-library migration, what part of that migration was genuinely mechanical, and what part wasn't. If you're running an older `elasticsearch` Python client against an AWS OpenSearch domain, there's a decent chance you're sitting on the same trap.

## The anatomy of a transitive CVE trap
In modern Python backend architectures, transitive dependencies can quietly turn into security bottlenecks. Our production Django application relied on `elasticsearch==7.10.1` to interact with event and audit-log indices hosted on AWS OpenSearch 1.3.

A transitive dependency is a package your code never imports directly, it gets pulled in because something you depend on needs it. That distance is exactly why a cap like this goes unnoticed for years: nobody on the team ever wrote `import urllib3`, so nobody was watching its version.

When **CVE-2025-50181** (an open-redirect / SSRF vulnerability in `urllib3`, affecting everything before 2.5.0, [details here](https://github.com/advisories/GHSA-pq67-6m6q-mj2v)) was disclosed, security compliance required updating `urllib3` to version `2.5.0` or higher. However, running a dependency audit revealed a hard blocker:

```toml
# pyproject.toml (legacy state)
elasticsearch = "7.10.1" # Pinned: requires urllib3 >= 1.21.1, < 2
```

The `elasticsearch 7.10.1` package explicitly capped `urllib3 < 2`. Because `1.26.20` was the final release on the `urllib3 1.26.x` line, no backport was available. Upgrading `elasticsearch-py` to `7.14+` or `8.x` was not an option due to the introduction of client-side product checks (`UnsupportedProductError`), which intentionally refuse connection to AWS OpenSearch or Elasticsearch OSS endpoints.

The client library itself was forcing the application to remain vulnerable. The only remediation path was swapping the underlying search client entirely.

## Client selection: why `opensearch-py`, not a newer Elasticsearch client

OpenSearch is AWS's fork of Elasticsearch: a separately maintained, Apache-licensed search engine with (mostly) the same API, created specifically so companies could keep running an open-source-licensed alternative after Elastic changed its own license.

The `elasticsearch==7.10.1` pin predates a fight that had nothing to do with us. Elastic changed its licensing in January 2021 after AWS forked Elasticsearch into what became OpenSearch, and that July `elasticsearch-py` 7.14.0 quietly added a check that raises `UnsupportedProductError` on any server missing Elastic's own `X-Elastic-Product` header ([issue #1639](https://github.com/elastic/elasticsearch-py/issues/1639)). AWS OpenSearch doesn't send it. Elastic called the change an enhancement; the backlash was loud enough that [Elastic locked the GitHub thread](https://www.theregister.com/2021/08/09/elasticsearch_python_client_change/). Practically, it meant any `elasticsearch-py` release from 7.14 onward refuses to talk to our production database, so upgrading the vulnerable client in place was never on the table.

`opensearch-py` sidesteps that fight by construction: it's OpenSearch's own client, forked from `elasticsearch-py` at the 7.10.x line before the check existed. It never inherited it, and from a recent enough release, it drops the urllib3 ceiling too. [`COMPATIBILITY.md`](https://github.com/opensearch-project/opensearch-py/blob/main/COMPATIBILITY.md) confirms it supports OpenSearch 1.0 through 2.x, our production range, and since OpenSearch's wire protocol is still the Elasticsearch 7.x REST API, the same client talks cleanly to both our production domain and the legacy `elasticsearch-oss:7.10.2` container we ran in CI.

## Picking a version was its own research project
Here's the part that surprised me: even after deciding on `opensearch-py`, picking _which_ version wasn't obvious, and getting it wrong would have shipped a "fix" that didn't actually fix anything.

Not every `opensearch-py` release frees urllib3. Early 1.x and 2.x releases inherited the exact same `<2` cap we were trying to escape. One release briefly dropped the cap without formally declaring urllib3-2 support, and the very next release re-added it. The real cutover point was version 2.6.0, shipped in [PR #719](https://github.com/opensearch-project/opensearch-py/pull/719):

| opensearch-py                  | urllib3 constraint                    | Frees urllib3?                                          |
| ------------------------------ | ------------------------------------- | ------------------------------------------------------- |
| 1.x                            | `>=1.21.1,<2`                         | No, same cap as before                                  |
| 2.0.0 through 2.3.1            | `>=1.21.1,<2`                         | No                                                      |
| 2.4.x                          | `>=1.26.18` (cap dropped, undeclared) | Unofficially, briefly                                   |
| 2.5.0                          | `>=1.26.18,<2`                        | No, cap re-added                                        |
| **2.6.0**                      | `!=2.2.0,<3,>=1.26.18`                | **Yes, first real support**                             |
| 2.8.0 (latest 2.x at the time) | `!=2.2.0,!=2.2.1,<3,>=1.26.19`        | Yes, plus more fixes                                    |
| 3.0.0 and later                | same floor                            | Yes, but enforces keyword-only arguments, a bigger diff |
We landed on 2.8.0: same migration effort as 2.6.0, but with roughly six more months of bug and security fixes, while still avoiding the breaking change in 3.0 (which makes arguments like `body=` keyword-only, not removed, just no longer allowed positionally, which matters if any of your call sites pass it positionally).

In dependency terms, `>=1.26.19` is a floor: it says "at least this version," not "exactly this version." Package maintainers almost always publish floors rather than pins, because a pin would make their library incompatible with anything else in your project that needs a different exact version. That's exactly why a floor alone can't guarantee what actually gets installed.

The gotcha I'd flag loudest: that urllib3 constraint is a floor, not a pin. `1.26.19` satisfies `>=1.26.19` just as well as `2.7.0` does, so installing `opensearch-py` 2.8 doesn't guarantee your resolver picks a patched urllib3, it just stops forbidding it. Skip a separate `urllib3>=2.5.0` pin in your own dependency file, and you can finish this entire migration still shipping the vulnerable version, because the old version still satisfies every constraint in the graph. We pinned it explicitly, with a comment citing the CVE, so the reason survives whoever edits that line next.

```toml
# pyproject.toml
[tool.poetry.dependencies]
python = "^3.12"
opensearch-py = "^2.8"

# Explicitly floor urllib3 >= 2.5.0 for CVE-2025-50181 remediation.
# opensearch-py only floors at >=1.26.19, so explicit flooring forces the resolver to upgrade.
urllib3 = ">=2.5.0, <3"
```

## Bridging the DRF gap: the one piece of code we actually had to write

Most of the Python call-site changes are import renames (`from opensearchpy import OpenSearch, Q, Search` in place of the Elasticsearch equivalents), pure find-and-replace. Django REST Framework integration was the exception: DRF's ordering and pagination classes expect a Django ORM queryset, not an `elasticsearch-dsl` `Search` object, so our workflow changelog view relied on `django-elasticsearch-dsl-drf` to bridge that gap.

That package depends on the old `elasticsearch` client, reintroducing the urllib3 cap, and hasn't shipped since [July 2022](https://pypi.org/project/django-elasticsearch-dsl-drf/), with no OpenSearch successor: [`django-opensearch-dsl`](https://github.com/codoc-health/django-opensearch-dsl) only handles indexing, and `django-anysearch-dsl-drf` never made it to PyPI.

Rewriting the endpoint onto the ORM would have meant a real backfill, not a client swap, so we vendored the roughly 190 lines we actually used into a project-local module, `processor/v1/opensearch_drf.py`. If you hit the same wall: check whether a maintained package already covers your usage (indexing-only ones often skip the DRF layer), how narrow your actual usage is, and whether anything downstream depends on an exact response shape.
### Preserving the API contract

The frontend application depended on a rigid JSON response structure for pagination and ordering:


```json
{
  "count": 142,
  "facets": {},
  "next": "https://api.domain.com/v1/.../changelog/events/?page=2",
  "previous": null,
  "results": [...]
}
```

To maintain 100% backward compatibility without changing frontend integration code, our inline `PageNumberPagination` implementation handles OpenSearch's response structure explicitly:


```python
# processor/v1/opensearch_drf.py (excerpt)
from rest_framework.pagination import PageNumberPagination as DRFPageNumberPagination
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

class PageNumberPagination(DRFPageNumberPagination):
    """
    Project-local DRF paginator over an opensearchpy Search object.
    Preserves exact contract: {count, facets, next, previous, results}.
    """
    page_size = 50  # Default PAGE_SIZE

    def paginate_queryset(self, queryset, request, view=None):
        page_number = request.query_params.get(self.page_query_param, 1)
        
        # Calculate search slice
        try:
            page_number = int(page_number)
        except ValueError:
            if page_number == 'last':
                page_number = self._get_last_page_number(queryset)
            else:
                raise NotFound("Invalid page.")

        bottom = (page_number - 1) * self.page_size
        top = bottom + self.page_size
        
        # Execute sliced opensearchpy Search query
        self.response = queryset[bottom:top].execute()
        
        # Parse total hits (supports ES7+ / OpenSearch dict/object shapes)
        total = self.response.hits.total
        self.count = total.value if hasattr(total, 'value') else total

        if self.count > 0 and bottom >= self.count:
            raise NotFound("Invalid page.")

        self.request = request
        self.page_number = page_number
        return list(self.response)

    def get_paginated_response(self, data):
        return Response({
            'count': self.count,
            'facets': {},  # Maintained for strict frontend schema contract
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
```

By coupling this with an `OrderingFilterBackend` that transforms user query parameters (`?ordering=-timestamp`) into OpenSearch `.sort({'timestamp': {'order': 'desc'}})` execution calls, we dropped `django-elasticsearch-dsl-drf` completely and uninstalled four transitive packages.


## Two gotchas worth knowing before you try this

- **An app-name collision broke an import at boot.** `opensearch-py`'s optional metrics module does `from events import Events`, expecting a small PyPI package called _Events_. Our own top-level Django app was also named `events`, and it shadowed the real package. The fix was a two-line shim satisfying the import, not a working metrics backend, just enough to stop the crash, since we don't use that feature anyway.
- **"No product check" is the point, not a risk to route around.** It's the entire reason one client works against both a legacy Elasticsearch-OSS container in CI and a real AWS OpenSearch domain in production. If you ever see `UnsupportedProductError` after this migration, it means a stray `import elasticsearch` survived somewhere. A full-tree grep should come back completely clean.

### Verification & observability strategy

Validating search client migrations requires separating metadata aggregations (`size=0`) from real document retrieval hits.

In Datadog, we isolated event retrieval traffic using query exclusions:
```
service:backend-api @logger.name:opensearch -"size=0"
```

A successful status `200` response on a non-`size=0` query confirmed that both ordering backends, pagination slicing, and document mapping round-tripped cleanly through `opensearch-py` to AWS OpenSearch.

Finally, running `pip-audit` verified the security milestone:

```bash
$ pip-audit
No known vulnerabilities found
```
