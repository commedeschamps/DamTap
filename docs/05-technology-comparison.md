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
