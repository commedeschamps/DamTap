# 6. Software Requirements Specification (Initial)

**Baseline:** Git tag prob-period-1, commit 9f454a51a031acebf7f87c050dc96982e410bf3a. **Status legend:** I = implemented in tagged prototype; P = partial; F = future/planned. MoSCoW priorities refer to intended diploma MVP, not current completion.

## Functional requirements

| ID | Requirement | Priority | State | Verifiable acceptance criterion |
| --- | --- | --- | --- | --- |
| FR-01 | Browse eligible offers | Must | I | GET /api/offers excludes expired and out-of-stock offers. |
| FR-02 | Search, filter and sort | Must | I | Supported query/category/sort combinations return expected results. |
| FR-03 | View offer details | Must | I | Display price, quantity, allergens, venue and pickup information. |
| FR-04 | Reserve 1–10 portions | Must | I | Valid POST persists receipt and decrements stock atomically. |
| FR-05 | Prevent overselling | Must | I | Concurrent requests for last portion cannot create excess successful reservations. |
| FR-06 | Server-authoritative price | Must | I | Client cannot choose the charged/reserved price. |
| FR-07 | Save favorites locally | Should | I | Favorite survives reload in same browser. |
| FR-08 | Submit partner application | Could | I | Valid venue/email persisted and identifier returned. |
| FR-09 | Administrator creates offers | Must | P | Configured key protects validated API; full admin/ownership UI pending. |
| FR-10 | Authenticate customer/business/admin | Must | F | Unauthorized role requests rejected; ownership enforced. |
| FR-11 | Business manages its offers | Must | F | Business cannot edit another business's offers. |
| FR-12 | Configure markdown rules | Must | F | Validate start/end, minimum price, stage thresholds and discounts. |
| FR-13 | Reprice automatically by elapsed time | Must | F | Clock-controlled tests show correct non-increasing stage prices. |
| FR-14 | Optional stock-pressure markdown | Should | F | Threshold can advance, never reverse, a pricing stage. |
| FR-15 | Immutable reservation price snapshot | Must | P | Unit price, total, timestamp and rule version persist despite later repricing. |
| FR-16 | Cancel/confirm pickup lifecycle | Must | F | Valid transitions persisted; invalid transitions rejected. |
| FR-17 | PostgreSQL with migrations | Must | F | Clean DB migration + actual PostgreSQL integration tests pass. |
| FR-18 | Price-change history | Should | F | Authorized business can retrieve ordered price events and reasons. |

## Non-functional requirements

| ID | Quality attribute | Priority | Proposed acceptance criterion |
| --- | --- | --- | --- |
| NFR-01 | Stock consistency | Must | No negative stock/oversell in repeatable concurrency tests. |
| NFR-02 | Monetary integrity | Must | Integer KZT or exact decimal; no floating-point price authority. |
| NFR-03 | Food safety | Must | No reservation at/after legal or operational sale cutoff, regardless of discount. |
| NFR-04 | Security | Must | Authentication, RBAC, ownership and non-committed secrets; current public reservation lookup is a known gap. |
| NFR-05 | Performance | Should | Proposed target: p95 API latency < 500 ms under a documented staging load; not yet measured. |
| NFR-06 | Testability | Must | Pricing uses injectable Clock; stage/boundary/concurrency cases automated. |
| NFR-07 | Accessibility | Should | Aim for WCAG 2.2 AA on primary flows; audit pending. |
| NFR-08 | Auditability | Must | Each price-stage transition records old/new price, time, reason and rule version. |
| NFR-09 | Resilience | Must | Scheduler delays never bypass server-side expiry or price calculation. |
| NFR-10 | Privacy | Must | Minimize personal data and protect reservation access before public deployment. |

**Important:** targets are proposed engineering acceptance thresholds, not measured results or supervisor-approved commercial SLAs.

## Dynamic pricing invariants

For reference price Pr, floor Pmin, sale start t0 and end te, let u = clamp((t - t0)/(te - t0), 0, 1). Configure ordered stages (a_j, d_j) where 0 = a0 < ... < a_m < 1 and discounts 0 <= d0 <= ... <= d_m. The current stage is max(previous persisted stage, elapsed-time stage, optional stock-pressure stage). Price is max(Pmin, roundedTick(Pr × (1 - discount))). **Prices cannot automatically rise during the same offer window; prices cannot fall below the business-approved floor; no booking is accepted at/after te.**

At reservation, lock the offer row, read server time, validate stock and cutoff, compute and persist the effective stage, snapshot the server price and decrement stock in one transaction. A stale displayed price must not become the authoritative transaction price.

## Traceability

| Requirement | Current/planned component | Verification evidence |
| --- | --- | --- |
| FR-01–03 | Next.js catalog + Spring API | Catalog API tests; UI checks (browser automation future) |
| FR-04–06, NFR-01–02 | Reservation service, JPA lock | Existing integration tests; PostgreSQL repeat planned |
| FR-09–11, NFR-04/10 | Admin API, future auth/business module | RBAC and ownership tests planned |
| FR-12–14, FR-18, NFR-06/08 | Future pricing engine + audit | Clock-driven unit/integration tests planned |
| FR-15, NFR-03/09 | Reservation + pricing + cutoff | Price snapshot, boundary and concurrency tests planned |
| FR-16–17 | Reservation lifecycle + PostgreSQL | State transition/migration tests planned |

Source of current-state claims: tagged README and source. Future acceptance criteria are the team's draft specification and require supervisor review.
