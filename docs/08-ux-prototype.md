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
