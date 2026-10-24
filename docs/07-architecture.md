# 7. Architecture and Required Diagrams

**Baseline:** Next.js 16/React frontend + Spring Boot 3.5 REST backend + JPA/H2. Browser-side catalog controls and favorites are client-side; backend owns stock, reservations, totals and offer persistence. The Next.js layer proxies same-origin /api requests. The present system is a **client/server modular monolith**, not deployed microservices.

**Planned:** authentication/roles, business offer management, PostgreSQL, dynamic markdown module, pricing history, cancellation/pickup lifecycle.

## A. System Context Diagram (rendered on GitHub)

~~~mermaid
flowchart LR
  Customer([Customer]) -->|browse / reserve| DamTap[DamTap web platform]
  Business([Food business]) -->|partner application now; offer/pricing management planned| DamTap
  Admin([Administrator]) -->|offer API now; broader controls planned| DamTap
  DamTap -->|must enforce sale cutoff| Safety[Food-safety constraints]
~~~

Editable PlantUML: [system-context.puml](diagrams/system-context.puml).

## B. Use Case Diagram (rendered on GitHub)

~~~mermaid
flowchart LR
  C([Customer]) --> B[Browse / search / filter / sort]
  C --> V[View offer details / pickup]
  C --> F[Save local favorite]
  C --> R[Reserve available portions]
  Business([Business]) --> PA[Submit partner application]
  Business -.planned.-> BM[Manage owned offers]
  Business -.planned.-> DP[Configure markdown]
  Admin([Admin]) --> AC[Create offer via protected API]
  C -.planned.-> Cancel[Cancel reservation]
  Business -.planned.-> Confirm[Confirm pickup]
~~~

Editable UML use-case source: [use-case.puml](diagrams/use-case.puml).

## C. Component Diagram (rendered on GitHub)

~~~mermaid
flowchart LR
  Browser[Browser / Next.js UI] -->|HTTP JSON /api| API[Spring Boot REST API]
  API --> Catalog[Offer catalog]
  API --> Booking[Reservation service]
  API --> Partner[Partner applications]
  Catalog --> H2[(H2 current)]
  Booking -->|transaction + row lock| H2
  Partner --> H2
  API -.planned.-> Auth[Auth / RBAC]
  API -.planned.-> Pricing[Dynamic markdown]
  Pricing -.planned.-> Audit[Price audit]
  Catalog -.planned.-> PG[(PostgreSQL)]
  Booking -.planned.-> PG
  Pricing -.planned.-> PG
~~~

Editable PlantUML: [component.puml](diagrams/component.puml).

## Data and transactional flow

1. Browser requests current offers from Next.js, which calls Spring Boot.
2. Backend returns eligible offers from H2; the browser applies UI filtering/sorting and displays stock and pickup details.
3. Browser POSTs offer ID and quantity, **not a price**.
4. Reservation service validates expiry/quantity, locks offer row, computes server-side total, persists reservation and decrements stock transactionally.
5. Future pricing service will evaluate the current stage **under the same offer lock**, persist any advancement and snapshot the effective price before decrementing stock.
6. The future scheduler will improve freshness of displayed prices but never replace transactional repricing as the source of truth.

## Trust and deployment boundaries

Public GET and reservation endpoints currently have no customer authentication; GET reservation by UUID has no ownership check. Admin API uses a configured server-side key, which is not a full identity system. H2 file storage is local; public deployment and PostgreSQL are not verified. Do not expose this prototype as production-ready.

## Consistency mapping

FR-01–03 -> Catalog/UI; FR-04–06 -> Reservation/DB; FR-10–11 -> planned Auth/Business; FR-12–15 -> planned Pricing/Reservation; FR-17 -> planned PostgreSQL. See [06-requirements.md](06-requirements.md).

Diagram sources and instructions: [diagrams/README.md](diagrams/README.md).
