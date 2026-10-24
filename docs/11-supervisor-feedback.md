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
