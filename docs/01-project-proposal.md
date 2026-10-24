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
