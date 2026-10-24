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
