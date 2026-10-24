# DamTap — AITU First Probationary Report

**Submission reference:** 24 October 2026

**Official project title:** Development of a Distributed Platform for Dynamic Discounted Sales of Surplus Food from Food Service Establishments

**Students:** Seidigali Rakhman Seidigaliuly; Kenesbay Alizhan Nurzhanuly; Shomanov Rakhat Alibekovich. **Group:** SE-2411.

**Supervisor:** Salkenov Aldiyar Kanatovich.

**Repository:** https://github.com/commedeschamps/DamTap

**Tagged baseline:** https://github.com/commedeschamps/DamTap/tree/prob-period-1 (9f454a51a031acebf7f87c050dc96982e410bf3a)

**YouTrack:** https://damtap.youtrack.cloud/projects/DAM/issues

> **Version integrity.** The academic documents in this report are being added *after* the immutable prob-period-1 tag. They describe that tag's implementation accurately but must not be misrepresented as files already included in it. The team has not conducted the 3–5 stakeholder discussions requested by AITU. Dynamic pricing is the central *planned* engineering contribution, not an implemented feature.

## Table of Contents

1. Project Proposal
2. Evidence of Relevance
3. Critical Literature Review
4. Existing System Comparison
5. Technology Comparison
6. Requirements Specification
7. Architecture and Diagrams
8. UX / Prototype
9. Verification and Evaluation Plan
10. Project Management and Risks
11. Supervisor Feedback
12. References

---

# 1. Project Proposal

**Title:** Development of a Distributed Platform for Dynamic Discounted Sales of Surplus Food from Food Service Establishments

**Project:** DamTap | **Institution:** Astana IT University | **Group:** SE-2411 | **Reporting date:** 24 October 2026

**Students:** Seidigali Rakhman Seidigaliuly (frontend, UI/UX, branding, coordination); Kenesbay Alizhan Nurzhanuly (backend, persistence and API); Shomanov Rakhat Alibekovich (QA, DevOps and integration).

**Supervisor:** Salkenov Aldiyar Kanatovich.

## Problem and relevance

Food-service businesses can have edible, time-sensitive surplus, while customers seek affordable food. Without a shared discovery and reservation channel, eligible surplus is difficult to match with nearby customers before its permitted sale window closes. The UN Environment Programme estimated 1.05 billion tonnes of food waste in 2022 at household, food-service and retail levels, with food service accounting for approximately 28% [13]. Kazakhstan's official September 2026 inflation release reported 8.5% year-on-year food-product inflation [14]. These statistics establish general relevance, **not verified local demand for DamTap**.

## Target users

1. Customers in Astana looking for lower-priced, pickup-based food offers.
2. Cafés, bakeries, restaurants and shops managing eligible surplus inventory.
3. Platform administrators responsible for moderation and oversight.

## Aim

Design, implement and evaluate a food-surplus marketplace that supports discoverable offers, concurrency-safe reservations and a **configurable dynamic-markdown mechanism**, comparing the latter with fixed discounting on sell-through, unsold inventory and revenue recovery.

## Objectives

- Specify requirements, acceptance criteria, architecture and food-safety constraints.
- Provide searchable and filterable offers, pickup details and reservations.
- Preserve inventory correctness and server-authoritative booking prices under concurrency.
- Introduce PostgreSQL, authentication/authorization and business offer management.
- Implement transparent, bounded, non-increasing markdown stages based on time and optionally stock.
- Preserve an immutable reservation price snapshot and auditable price history.
- Verify correctness with automated tests and evaluate pricing against a fixed-discount baseline.
- Collect genuine Astana stakeholder feedback before claiming market validation.

## Engineering complexity

The principal challenges are transactional inventory control, reservation/price consistency under concurrent requests, lifecycle and cutoff validation, role-based ownership of offers, deterministic repricing and reproducible algorithm evaluation. The deployed architecture is not claimed to be a microservice system.

## Scope and outcomes

**Verified at submission tag prob-period-1:** Next.js 16 frontend, Spring Boot 3.5/Java 17 REST API, JPA/H2 persistence, searchable/sortable catalog, offer detail dialog, favorites in browser storage, reservations with server-calculated totals and row locking, partner application API, limited admin offer API, nine backend tests, frontend CI configuration.

**Planned core scope:** PostgreSQL with migrations, roles, business dashboard, reservation lifecycle, dynamic markdown rules, pricing audit and evaluation.

**Out of current scope:** payment processing, delivery routing, production deployment claims and machine-learning demand prediction.

**Expected deliverables:** functional prototype, SRS, three architecture diagrams, documented algorithm, test evidence, evaluation report and traceable Git/YouTrack work. Environmental impact and local adoption remain research hypotheses, not achieved results.

**Evidence:** tagged source and README: https://github.com/commedeschamps/DamTap/tree/prob-period-1 . Scientific and official references: [1], [2], [8], [13], [14].

---

# 2. Evidence of Relevance

## Evidence status on 24 October 2026

**Primary research: NOT CONDUCTED.** The team has not conducted interviews, surveys, client meetings or formal stakeholder discussions with potential Astana customers or food businesses. The university's expectation of **3–5 genuine stakeholder discussions or a substantive client agreement is not yet met**. No invented quotations, participants, counts or agreements are included.

## Available secondary evidence

| Evidence | Supported inference | What it does not establish |
| --- | --- | --- |
| UNEP Food Waste Index Report 2024 [13] | Food-service waste is a substantial global issue. | Local volume of eligible Astana café surplus. |
| Kazakhstan September 2026 inflation statistics [14] | Food affordability is a relevant national context. | Willingness to use this particular application. |
| Macca et al. (2026) [11] | Economic and sustainability messages can interact in consumer adoption intentions. | Real purchasing behaviour in Astana. |
| Gómez Ceballos and Antonopoulou (2024) [6] | Pickup convenience, time and usability can affect engagement. | Exact local pickup tolerance. |
| Aloysius and Ananda (2023) [4] | Redistribution requires operational coordination and stakeholder participation. | Business partner commitment in Kazakhstan. |
| Sanders (2024) [8] | Pricing outcomes are conditional, not universally waste-reducing. | DamTap's future pricing impact. |
| Too Good To Go / OLIO / Flashfood / Karma [17]–[20] | Digital surplus redistribution and discounted pickup are established product models. | An unmet, commercially viable local niche. |

## Provisional, not validated, assumptions

A1: Astana food businesses have suitable, safe, recurring surplus. A2: Consumers will accept same-day pickup. A3: Businesses will authorize automated price decreases when they control a minimum price. A4: Transparent pricing and allergen/pickup information will build sufficient trust. A5: Dynamic markdowns may improve sell-through without excessive revenue loss.

These assumptions motivate requirements and evaluation; they are **not findings**.

## Stakeholder validation protocol (future)

Recruit, with consent, 2–3 food-business representatives and 2–3 potential customers; at least 3–5 discussions total, depending on AITU interpretation. Ask businesses about types/quantity of surplus, current markdown practices, safety cutoffs, minimum acceptable prices, pickup staffing and willingness to configure automation. Ask customers about discount value, information needs, trust, collection distance and price changes. Record date, anonymized participant ID, role, consent, notes and implications for requirements. Do not collect personal identifiers unnecessarily. Use the separate interview guide in this folder.

## Findings traceability template

| Interview/observation ID | Date | Actual observation | Requirement affected | Decision |
| --- | --- | --- | --- | --- |
| Pending | Pending | No primary finding yet | To be determined | Pending |

**Assessment status:** secondary evidence assembled; required local primary validation remains outstanding.

---

# 3. Critical Literature Review

## Review question and method

What does recent research establish about digital food-surplus redistribution, user adoption and perishable-goods markdown optimization, and which results are transferable to an Astana pickup marketplace? This is a **targeted critical review**, not a systematic review or meta-analysis. Twelve peer-reviewed papers are analyzed below, most published between 2022 and 2026, together with official contextual data [13]–[16].

## Thematic synthesis

**Redistribution and platform design.** Mazzucchelli et al. [12] examine factors affecting food-sharing platform success. Ranjbari et al. [5] model system-level effects of digitally enabled food sharing; model outcomes are scenario-dependent rather than proof of impact in Astana. Aloysius and Ananda [4] demonstrate the importance of food-rescue organizations and operations, but their Sri Lankan case does not directly validate Kazakhstan adoption. Grewal et al. [7] situate digital interventions in a broader food production–consumption chain; their synthesis is conceptual, not a controlled trial of DamTap.

**User behavior and friction.** Gómez Ceballos and Antonopoulou [6] report practical barriers to OLIO engagement, including collection time and usability, supporting explicit pickup information and low-friction discovery. Macca et al. [11] experimentally examine economic and sustainability motivations; stated intention does not guarantee purchase. Hansen et al. [9] study consumer information in perishables, supporting the need for visible product/price details, but in a grocery context.

**Environmental claims.** Meshulam et al. [3] investigate rebound effects using OLIO listings and modelling; the environmental benefit of redistribution can be partly offset by subsequent spending. Therefore DamTap should report portions sold/unsold directly and avoid unsupported CO2-equivalent claims.

**Dynamic pricing.** Kayikci et al. [1] propose multi-stage, data-driven pricing for perishable retail. Scholz and Kulko [2] connect freshness to willingness to pay and compare pricing policies through experiment and simulation. Haijema et al. [10] model expiration-based discounting with stochastic dynamic programming. These studies justify an explicit pricing algorithm and baseline comparison. However, their demand data, grocery settings and shelf-life structures do not transfer automatically to Astana prepared-food pickup.

**Limits of optimization.** Sanders [8] finds that dynamic pricing can either increase or decrease waste under different demand and incentive structures. This is why DamTap must evaluate **both** sell-through and revenue recovery and maintain a fixed-discount control.

## Structured analysis of 12 scientific publications

| ID | Publication / year | Approach | Relevant contribution | Transferability limitation |
| --- | --- | --- | --- | --- |
| [1] | Kayikci et al., 2022 | Data-driven multi-stage dynamic pricing | Real-time perishable markdown strategy | Retail dataset and calibration needs differ |
| [2] | Scholz & Kulko, 2022 | Willingness-to-pay experiment + Monte Carlo | Freshness-sensitive pricing and sustainability trade-offs | Scenario and product specific |
| [3] | Meshulam et al., 2023 | Platform data + input-output modelling | Rebound effects complicate environmental benefit | Free-sharing UK platform, not paid café sales |
| [4] | Aloysius & Ananda, 2023 | Food-rescue case study | Stakeholder and operational coordination | Sri Lanka-specific institutions |
| [5] | Ranjbari et al., 2024 | System-dynamics simulation | Digitally enabled food sharing scenarios | Model assumptions determine outcomes |
| [6] | Gómez Ceballos & Antonopoulou, 2024 | Mixed-method COM-B study | Convenience and app-usability barriers | Bogotá OLIO setting |
| [7] | Grewal et al., 2024 | Conceptual scientific synthesis | Food-system technology framework | Not a platform implementation trial |
| [8] | Sanders, 2024 | Structural model + counterfactuals | Dynamic pricing may raise or lower waste | Grocery retailer incentives |
| [9] | Hansen, Misra & Sanders, 2024 | Empirical perishables information study | Importance of customer information | Grocery rather than restaurant surplus |
| [10] | Haijema et al., 2026 | Stochastic dynamic programming | Expiration-date-based pricing policies | Requires demand/expiry modelling |
| [11] | Macca et al., 2026 | 2×2 consumer experiment | Economic + sustainability motivation | Intentions, non-Kazakhstan sample |
| [12] | Mazzucchelli et al., 2021 | Food-sharing platform research | Adoption and success factors | Older work and different markets |

## Design implications

1. Make pickup window, stock, allergens, venue and price explicit [6], [9].
2. Implement transparent, deterministic time-based markdowns before data-hungry ML [1], [2], [10].
3. Enforce minimum prices and cutoff dates; never extend legal sale life [15], [16].
4. Use stock/price transaction snapshots and concurrency tests as an engineering contribution.
5. Compare dynamic pricing with fixed discount under identical simulated demand; measure revenue and unsold portions [8].
6. Obtain actual Astana stakeholder data before making adoption or local impact claims [4], [11].

**Research gap:** the reviewed evidence does not validate the market or calibrated pricing parameters for Astana food-service establishments. DamTap will evaluate a small, explainable system in that context rather than claim novelty of dynamic pricing itself.

Full DOI-linked bibliography: [references.md](references.md).

---

# 4. Existing System Comparison

**Scope:** four verified market analogues. Sources are the platforms' official public documentation [17]–[20]; a blank/unknown capability means **not publicly verified in the reviewed material**, not proven absent.

| Criterion | Too Good To Go | OLIO | Flashfood | Karma | DamTap at prob-period-1 / plan |
| --- | --- | --- | --- | --- | --- |
| Primary model | Surplus Surprise Bags | Sharing and retailer reductions | Discounted groceries | Discounted surplus / merchant ecosystem | Explicit offers for Astana |
| Typical provider | Food businesses | Community and retailers | Grocery retailers | Restaurants and merchants | Cafés, bakeries, shops (target) |
| Product specificity | Bag contents may be a surprise | Depends on listing/feed | Item-level | Merchant listing | Item-level with details |
| Discount presentation | Reduced price | Free or reduced | Up to 50% advertised | Reduced price | Original/current KZT prices |
| Dynamic repricing | AI-powered discounting marketed as a separate retailer product | Smart discounting described; exact algorithm unverified | Not verified in consulted materials | Not verified in consulted materials | **Planned, not implemented** |
| Reservation/purchase | App reservation and payment | Sharing/collection or retailer feed | In-app checkout | Platform transaction | Reservation API; no payment |
| Pickup | Collection window | Community/store pickup | In-store pickup | Merchant pickup | Offer pickup window |
| Inventory connection | Retailer product integrations | POS/reductions feed | Retail inventory partnerships | Merchant/POS ecosystem | JPA/H2 current; PostgreSQL planned |
| Target geography | International markets | International/community | North America | Existing merchant markets | Astana, KZT |
| Public pricing-rule transparency | Proprietary product | Not fully disclosed | Not established | Not established | Deterministic rules planned and auditable |

## Critical interpretation

Too Good To Go already advertises AI-powered markdown optimization, so **DamTap cannot claim to be the first platform with dynamic pricing** [17]. OLIO's Reductions Feed also indicates retailer-side integration [18]. Flashfood emphasizes explicit grocery products and checkout [19], while Karma offers discounted food through merchant tools [20]. These are legitimate comparators, but product feature sets may change.

The defensible project focus is the **combination** of transparent configurable markdown stages, food-service pickup constraints, immutable reservation price snapshots, concurrency-safe stock locking and Astana/KZT localization. This is a proposed engineering emphasis, not proof of commercial uniqueness.

Official source URLs are provided in [references.md](references.md).

---

# 5. Technology Comparison and Decisions

| Decision | Alternative | Strengths | Trade-offs | Decision |
| --- | --- | --- | --- | --- |
| Backend | Spring Boot (Java 17) | Already working; validation, JPA transactions, locking and tests | JVM/tooling overhead | **Selected** |
| Backend | NestJS (TypeScript) | Common language with frontend, modular decorators | Rewriting transactional backend adds risk | Not selected |
| Backend | FastAPI (Python) | Concise API development, easy future data-science integration | Rewriting and alternative persistence stack | Not selected |
| Durable database | PostgreSQL | ACID relational model, row locks, constraints, indexing | Needs deployment, migrations and real-DB testing | **Planned production selection** |
| Durable database | MySQL | Relational and transactional | Different lock/SQL behaviors to validate | Not selected |
| Durable database | MongoDB | Flexible document schema | Core offer/reservation/price relations favor relational constraints | Not selected |
| Client/API communication | REST/JSON | Implemented, debuggable, standard HTTP status codes, OpenAPI support | Multiple requests possible for complex views | **Selected** |
| Client/API communication | GraphQL | Flexible client-selected fields | Added schema/runtime complexity | Not selected |
| Client/API communication | gRPC | Efficient typed service-to-service RPC | Browser-facing workflow less direct | Not selected |
| Markdown algorithm | Fixed discount | Stable and explainable | No adaptation to time or stock | **Evaluation baseline** |
| Markdown algorithm | Stepwise time markdown | Deterministic, auditable, limited writes | Abrupt threshold changes | **MVP choice** |
| Markdown algorithm | Stock-aware / ML pricing | Can adapt to inventory/demand | Calibration, uncertainty and fairness complexity | Bounded stock trigger planned; ML deferred |

## Current implementation versus intended selection

The submitted version uses **H2**, not PostgreSQL. H2 is appropriate for local development and the existing integration tests, but its behavior is not proof of PostgreSQL correctness. Production persistence requires a driver, migration tooling, environment configuration and actual PostgreSQL integration/concurrency tests.

The application is a **Next.js + Spring Boot client/server modular monolith**, not a set of independently deployed microservices. A distributed-platform title does not require inventing microservices; the present engineering boundary is browser/Next.js to REST backend.

## Architecture Decision Records (draft)

**ADR-01 Spring Boot:** retain existing Java backend to preserve verified reservation transactions and tests.

**ADR-02 PostgreSQL:** migrate persistent production storage to PostgreSQL after introducing versioned schema migrations; validate row-lock behavior under actual concurrent requests.

**ADR-03 REST:** retain JSON/HTTP endpoints; add an OpenAPI specification and document error contracts.

**ADR-04 Deterministic markdown:** begin with a fixed baseline and configurable monotonic time stages; optionally advance a stage under high-stock conditions. Do not claim demand-prediction ML without transaction data.

**Evidence:** tagged README and source; pricing research [1], [2], [8], [10]; PostgreSQL locking documentation https://www.postgresql.org/docs/current/explicit-locking.html ; OpenAPI https://spec.openapis.org/oas/latest.html .

---

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

---

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

---

# 8. UX and Prototype Evidence

**Verified source:** https://github.com/commedeschamps/DamTap/tree/prob-period-1

The working UI is the Next.js homepage at the root route, with responsive sections and modal offer details. No public deployment has been verified. Sample seed offers and venues are illustrative, not evidence of commercial availability.

| Scenario | User journey | Evidence at tagged version | Future work |
| --- | --- | --- | --- |
| Discover offers | Open homepage -> browse catalog | Current Next.js UI + Spring catalog | Pagination/live updates |
| Find relevant food | Enter query -> category -> sort | Current UI and catalog API | Real geolocation |
| Inspect offer | Open offer card -> view KZT price, stock, allergens, pickup | Current dialog | Dedicated detail route optional |
| Reserve | Choose quantity -> submit -> receive confirmation | Current UI + reservation API | Auth, cancellation, pickup confirmation |
| Save offer | Toggle favorite -> reload | Browser localStorage | Cross-device optional |
| Become partner | Submit venue/contact | Persisted partner application | Verification/onboarding |
| Configure pricing | Business enters floor, stages and time window | **Not implemented** | Required business mockup + API |
| Observe price change | Customer sees stage update | **Not implemented** | Pricing UI and freshness indicators |

## Reproducible prototype demonstration

Start backend: from backend/ run ./mvnw spring-boot:run with JDK 17. Start frontend: from repository root run npm ci then npm run dev. Open http://localhost:3000. Confirm http://localhost:8080/api/health returns UP. If sample offers have expired, start with a fresh isolated H2 DB_URL rather than inventing live stock. Follow README for environment and tests.

## Screenshot evidence to capture before submission

1. Homepage with catalog and category navigation.
2. Search/filter/sort in use.
3. Offer dialog showing pickup and allergens.
4. Successful reservation confirmation using sample data.
5. Partner application interface.
6. Future business pricing wireframe, **clearly labelled planned** if added.

Screenshots are not embedded here because no actual rendered session or images were supplied/verified in this documentation task. Do not label proposed wireframes as implemented UI.

## Planned pricing UI contract

Business should be able to specify reference price, initial price, minimum price, active sale window, markdown thresholds and optional stock trigger, preview the schedule and see a clear warning that sales stop at the permitted cutoff. Customer should see current price, original price and pickup cutoff; price displayed on screen is provisional until reservation is confirmed by the server.

---

# 9. Verification and Evaluation Plan

## Distinguish evidence from plan

**Current:** tagged README documents nine backend integration tests (catalog, stock/expiry, reservation totals, concurrency, validation, partner persistence and admin access). GitHub Actions configures npm ci, ESLint and Next.js production build. A specific CI run's pass status has not been established by this document.

**Planned:** PostgreSQL/Testcontainers verification, pricing engine unit tests, reservation-price snapshots, RBAC, E2E browser tests, performance benchmarks and a controlled pricing evaluation. No pricing experiment has been conducted.

## Verification matrix

| Level | Scenario | Acceptance / evidence |
| --- | --- | --- |
| Unit | Time thresholds, floor, rounding, monotonic stage | Deterministic assertions with injected Clock |
| API | Invalid quantity, cutoff, absent offer, wrong roles | Correct 400/401/403/404/409 contracts as specified |
| Integration | Persist booking and decrement stock | Transactional state matches receipt |
| Concurrency | Two customers request last portion | No successful oversell or negative stock |
| Concurrency | Scheduler reprices while customer reserves | Snapshot equals price computed under same lock |
| Persistence | PostgreSQL migrations and row locking | Repeatable tests on PostgreSQL, not only H2 |
| E2E | Search -> detail -> reserve; business config | Browser assertions and screenshots |
| Security | Cross-venue edits, reservation lookup, secrets | Unauthorized requests denied |
| Performance | Catalog and reservation load | Report p50/p95, throughput and error rate; target p95 < 500 ms is provisional |
| Accessibility | Primary flows and keyboard use | WCAG 2.2 AA audit and remediation |
| Pricing | Fixed vs dynamic under same demand | Sell-through, unsold portions, recovered revenue, savings |

## Baseline and treatments

A: fixed discount across the sale window (control); B: deterministic stepwise time markdown; C: continuous linear markdown; D: time stages with bounded stock-pressure advancement. The proposed MVP is B with optional D. ML pricing is deferred for lack of real demand data.

For reference price Pr, minimum Pmin, initial stock Q0 and remaining stock q(t), configure stages with increasing elapsed thresholds and non-decreasing discounts. A stage is monotonic: once advanced, stock changes do not raise price. Sale cutoff is authoritative, even if scheduler is delayed.

## Research questions

RQ1: Does dynamic markdown improve sell-through / reduce unsold portions relative to a fixed discount under the same conditions?

RQ2: What recovered-revenue trade-off accompanies any improvement?

RQ3: Does bounded stock-triggered advancement outperform time-only stages?

RQ4: Does the implementation preserve minimum price, cutoff and consistent reservation snapshots under concurrency?

## Proposed simulation protocol (not completed)

Use fixed random seed **20261024**, paired customer-arrival streams (common random numbers) and a factorial scenario grid: initial stock {5,10,20}, sale window {3,6 hours}, demand {low,medium,high}, price sensitivity {low,medium,high}, reference prices {1500,3000,5000 KZT}, price floor {40%,50%,60% of reference}. Consider 10,000 replications per scenario/policy if computationally feasible. These are **synthetic scenario choices, not observed Astana demand parameters**.

Arrival intensity may be modeled as λ(t,p) = λ0 g(t) (p/Pr)^(-ε). Do not treat assumed λ0 or ε as estimated parameters until actual data exists.

## Metrics and calculation

- Sell-through = (Q0 − Qend) / Q0.
- Unsold portions = Qend.
- Recovered revenue = sum over bookings of actual server-snapshot unit price × quantity.
- Revenue recovery ratio = recovered revenue / (Pr × Q0).
- Customer savings = sum over sold units of (Pr − booking price).
- Additional: mean discount, median time-to-sale, conflict rate, constraint violations, p95 API latency.

Report paired differences and uncertainty intervals across simulation replications. A policy should be considered promising only if any reduction in unsold portions is assessed jointly with its revenue cost. A project-defined threshold, e.g. 10% fewer unsold portions with no more than 5% less revenue, requires supervisor/business agreement; it is **not an externally validated standard**.

| Policy | Sell-through | Revenue | Unsold | Measurement status |
| --- | --- | --- | --- | --- |
| Fixed | Not measured | Not measured | Not measured | Pending |
| Stepwise | Not measured | Not measured | Not measured | Pending |
| Linear | Not measured | Not measured | Not measured | Pending |
| Time + stock | Not measured | Not measured | Not measured | Pending |

Research [1], [2], [8], [10] supports comparing markdown policies but does **not** guarantee that a dynamic policy reduces waste in all scenarios.

---

# 10. Project Management, Traceability and Risks

## Project evidence

**GitHub:** https://github.com/commedeschamps/DamTap

**Immutable baseline tag:** https://github.com/commedeschamps/DamTap/tree/prob-period-1 (commit 9f454a51a031acebf7f87c050dc96982e410bf3a).

**YouTrack:** https://damtap.youtrack.cloud/projects/DAM/issues

The tagged repository contains meaningful code and documentation contributions. This documentation change is being prepared **after the tag** on a review branch and must not be backdated or represented as part of the tag.

## Allocation of responsibilities

| Student / GitHub | Established area | Next work package |
| --- | --- | --- |
| Seidigali Rakhman Seidigaliuly / commedeschamps | Frontend, UI/UX, branding, coordination | Pricing configuration UI, UX validation, academic docs |
| Kenesbay Alizhan Nurzhanuly / AlizhanKenesbay | Java backend, API, persistence | PostgreSQL, authentication/roles, pricing service and booking transaction |
| Shomanov Rakhat Alibekovich / pizzaman7182 | QA, DevOps, integration, frontend features | Backend CI, pricing/concurrency tests, simulation pipeline |

Assignments reflect team responsibilities, **not a claim that the proposed work has already been completed**. Real YouTrack assignees, statuses, priorities and dates must be confirmed against the live board before submission.

## Proposed milestones (dates require team/supervisor approval)

M0: 24 Oct 2026, tagged functional prototype and academic-documentation draft.

M1: Primary validation, 3–5 genuine stakeholder discussions, consent and requirements revision.

M2: PostgreSQL schema migrations, roles and business offer ownership.

M3: Deterministic dynamic pricing with audit and reservation price snapshots.

M4: Full reservation lifecycle and browser/API/security/concurrency testing.

M5: Fixed-vs-dynamic reproducible evaluation, documented limitations and final review.

Dependencies: database/roles -> business offer configuration -> pricing rules -> transactional snapshot -> evaluation.

## Risks and mitigation

| Risk | Probability / impact | Mitigation |
| --- | --- | --- |
| No local demand evidence | High / High | Conduct actual interviews; state assumptions |
| No partner pilot | High / High | Use simulation; pursue one genuine pilot |
| Markdown hurts revenue | Medium / High | Floor price, bounded discounts, fixed-price fallback |
| Price/stock race | Medium / High | Same offer-row lock; snapshot price in transaction |
| H2 and PostgreSQL differ | Medium / High | Real PostgreSQL integration tests |
| Missing roles/privacy | High / High | RBAC, ownership checks before public exposure |
| Food-safety cutoff error | Medium / Critical | Hard cutoff validation; never extend expiry |
| Too much scope | High / Medium | Defer ML, payments, delivery and microservices |
| No reviewer evidence | Medium / High | Use feature PRs and peer reviews; retain comments |
| Docs diverge from code | Medium / High | Reference exact tag, status labels, traceability |

## Git / YouTrack process and compliance gaps

Every new work item should have a YouTrack ID, one accountable assignee, priority, acceptance criteria, target date, relevant commit/PR URL and truthful status. Use task-ID branch names and commit/PR descriptions for future work. A different team member should review each feature PR before merge; a PR existing does not prove that review occurred. Do not fabricate review comments or retroactively rewrite author identities.

**Outstanding verification:** committee/supervisor repository access; live YouTrack assignment and deadline completeness; actual PR review trail; per-person contribution links; requested canonical pre-defense tag names. The currently existing tag is prob-period-1; the general guideline also mentions pre-defense-1. Confirm which name the submission form requires before creating an additional immutable alias.

---

# 11. Supervisor Feedback and Response

**Supervisor:** Salkenov Aldiyar Kanatovich.

**Evidence basis:** Written feedback text supplied by the team for 24 October 2026. An original screenshot/file must be attached to the final PDF if required by the committee; it has not been committed as evidence in this documentation package.

## Feedback (faithful substantive summary)

The supervisor observed progress from mock data to a working Next.js/Spring Boot full-stack application, with JPA persistence, searchable/filterable/sortable catalog, server-calculated reservation totals, row locking for the last portion, API validation/status codes, nine backend integration tests and frontend lint/build checks in GitHub Actions. He valued the README's honest limitation reporting. The central criticism was that **"the academic documentation is now the gap"**: the repository lacked a formal requirements specification, evidence of user need, a sufficiently detailed architecture document and required design diagrams beyond a basic flowchart. He recommended adding a docs/ directory before the next checkpoint.

## Decisions and corrective action

| Feedback item | Response | Status |
| --- | --- | --- |
| Requirements missing | Draft FR/NFR IDs, MoSCoW priorities and measurable criteria | Drafted in docs/06-requirements.md; supervisor review pending |
| Evidence of user need missing | Assemble scientific/official secondary evidence; plan genuine interviews | Secondary evidence documented; **interviews not conducted** |
| Architecture underdocumented | Create context, use-case and component diagrams, editable .puml and GitHub-renderable Mermaid | Drafted on post-tag documentation branch |
| Project status could be overstated | Distinguish implemented, partial, planned, hypotheses | Adopted in report |
| Academic repository structure absent | Add docs/ with eleven component documents and references | Drafted on post-tag documentation branch |
| Engineering progress needs evaluation | Specify fixed-discount baseline and tests for dynamic markdown | Evaluation plan drafted; experiment pending |

## Evidence integrity

These are **responses to the feedback**, not evidence that the original tag contained the documents. The prob-period-1 tag remains unchanged. Documentation should be reviewed and merged through the ordinary Git workflow, with the PR and merge timestamp preserved. No supervisor approval of this new report is implied.

---

# References (IEEE style; consulted in DamTap research package)

The twelve peer-reviewed papers [1]–[12] are **meaningfully discussed** in the literature review; [13]–[20] are official data, legal or comparator documentation. DOI links are retained for verification.

[1] Y. Kayikci, S. Demir, S. K. Mangla, N. Subramanian, and B. Koc, "Data-driven optimal dynamic pricing strategy for reducing perishable food waste at retailers," *Journal of Cleaner Production*, vol. 344, art. 131068, 2022. https://doi.org/10.1016/j.jclepro.2022.131068

[2] M. Scholz and R.-D. Kulko, "Dynamic pricing of perishable food as a sustainable business model," *British Food Journal*, vol. 124, no. 5, pp. 1609–1621, 2022. https://doi.org/10.1108/BFJ-03-2021-0294

[3] T. Meshulam, D. Font-Vivanco, V. Blass, and T. Makov, "Sharing economy rebound: The case of peer-to-peer sharing of food waste," *Journal of Industrial Ecology*, vol. 27, pp. 882–895, 2023. https://doi.org/10.1111/jiec.13319

[4] N. Aloysius and J. Ananda, "A Circular Economy Approach to Food Security and Poverty: a Case Study in Food Rescue in Sri Lanka," *Circular Economy and Sustainability*, vol. 3, pp. 1919–1940, 2023. https://doi.org/10.1007/s43615-023-00255-4

[5] M. Ranjbari, Z. Shams Esfandabadi, P.-O. Siebers, P. Pisano, and F. Quatraro, "Digitally enabled food sharing platforms towards effective waste management in a circular economy: A system dynamics simulation model," *Technovation*, vol. 130, art. 102939, 2024. https://doi.org/10.1016/j.technovation.2023.102939

[6] A. M. Gómez Ceballos and V. Antonopoulou, "Exploring barriers and facilitators to increase the engagement with a digital app (OLIO) for food/non-food sustainable consumption in citizens from Bogotá, Colombia," *Current Psychology*, vol. 43, pp. 26726–26735, 2024. https://doi.org/10.1007/s12144-024-06219-7

[7] D. Grewal, A. Guha, S. M. Noble, and K. Bentley, "The food production–consumption chain: Fighting food insecurity, loss, and waste with technology," *Journal of the Academy of Marketing Science*, vol. 52, no. 5, pp. 1412–1430, 2024. https://doi.org/10.1007/s11747-024-01040-x

[8] R. E. Sanders, "Dynamic Pricing and Organic Waste Bans: A Study of Grocery Retailers' Incentives to Reduce Food Waste," *Marketing Science*, vol. 43, no. 2, pp. 289–316, 2024. https://doi.org/10.1287/mksc.2020.0214

[9] K. Hansen, K. Misra, and R. E. Sanders, "Uninformed Choices in Perishables," *Marketing Science*, vol. 43, no. 4, pp. 751–777, 2024. https://doi.org/10.1287/mksc.2021.0264

[10] R. Haijema, L. Duijvestijn, R. Akkerman, and F. Cruijssen, "Dynamic expiration date-based discounting of fresh food products," *International Journal of Production Economics*, vol. 292, art. 109824, 2026. https://doi.org/10.1016/j.ijpe.2025.109824

[11] L. S. Macca, C. Rizzo, G. Baima, and Z. Musová, "Understanding the motivations behind consumers' adoption of food waste-reducing platforms: an investigation of economic and sustainable influences," *Review of Managerial Science*, vol. 20, pp. 4349–4373, 2026. https://doi.org/10.1007/s11846-026-01000-5

[12] A. Mazzucchelli, M. Gurioli, D. Graziano, B. Quacquarelli, and C. Aouina-Mejri, "How to fight against food waste in the digital era: Key factors for a successful food sharing platform," *Journal of Business Research*, vol. 124, pp. 47–58, 2021. https://doi.org/10.1016/j.jbusres.2020.11.055

[13] United Nations Environment Programme, *Food Waste Index Report 2024*. https://www.unep.org/resources/global-waste-management-outlook-2024 (For Food Waste Index specifically use https://www.unep.org/resources/report/food-waste-index-report-2024 .)

[14] Bureau of National Statistics, Republic of Kazakhstan, *Inflation in the Republic of Kazakhstan (September 2026)*. Official statistics portal: https://stat.gov.kz/en/

[15] Republic of Kazakhstan, *On Protection of Consumer Rights*, art. 32. Official legislation portal: https://adilet.zan.kz/eng/

[16] Republic of Kazakhstan, *On Food Products Safety*. Official legislation portal: https://adilet.zan.kz/eng/

[17] Too Good To Go, official marketplace and business solutions, including retailer discounting. https://www.toogoodtogo.com/

[18] OLIO, official sharing and business solutions / Reductions Feed. https://olioapp.com/

[19] Flashfood, official consumer and retailer product. https://flashfood.com/

[20] Karma, official surplus-food and merchant offering. https://karma.life/

**Source-use limitation:** Public company documentation can support stated product features, not independent proof of performance. The bibliography does not claim full-text access to every paywalled paper. No local user interviews were conducted.
