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
