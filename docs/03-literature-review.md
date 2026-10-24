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
