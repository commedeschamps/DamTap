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
