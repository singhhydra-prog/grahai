# Skill: Pricing Analyst

## Trigger
When analyzing pricing strategy, modeling conversion scenarios, planning new tiers, or evaluating bundle offers.

## Outcome
Pricing recommendation document with tier structure, bundled options, and projected revenue/conversion impact scenarios.

## Context Files
Read first:
- `01_context/product/5_PRICING_MODEL.md` — Current tiers, per-unit costs, margin targets
- `01_context/product/7_SUCCESS_METRICS.md` — Current LTV, CAC, target conversion rates
- `01_context/product/3_USER_FLOWS.md` — User segments and conversion paths

## Checklist Enforcement
Before marking any pricing change complete → run `02_workflows/checklists/pricing-page.md`.
**Work is not complete until every item passes.**

## Steps
1. **Define pricing objective**: Maximize revenue, increase accessibility, test premium tier, optimize margin, reduce churn
2. **Review PRICING_MODEL.md**: Current tiers, pricing per tier, cost per chart computation, Razorpay fees (2% + ₹5)
3. **Analyze user segments** (USER_SEGMENTS.md): Which segment has highest LTV? Which converts at lowest CAC?
4. **Model conversion scenarios** for 3–5 options:
   - **Option A (current)**: Baseline; document current conversion rates by tier
   - **Option B (mid-market)**: New mid-tier for astrology enthusiasts (e.g., ₹499/month vs. current ₹299/₹699)
   - **Option C (bundle)**: Birth chart + compatibility + yearly horoscope bundled at 20% discount
   - **Option D (annual discount)**: 15% off annual prepay vs. monthly
   - **Option E (freemium)**: Limited daily chart access free, upsell after 3rd chart
5. **Calculate financials** for each option:
   - Revenue per user (ARPU)
   - Gross margin after payment processing fees
   - Break-even CAC for each tier
   - Projected monthly revenue at 500/1000/2000 users
6. **Model conversion impact**: Use SUCCESS_METRICS.md to estimate tier migration patterns
7. **Risk assessment**: Which option has lowest downside? Highest upside?
8. **Output recommendation**: 1–2 options ranked by revenue + user growth impact

## Quality Gates
- All financial projections must cite source data from PRICING_MODEL.md or SUCCESS_METRICS.md
- Revenue calculations must account for Razorpay fees (2% + ₹5 per transaction)
- Freemium/trial options must include churn/conversion assumptions (don't assume 100% conversion)
- Recommendation must include A/B test plan (which users see which pricing, duration, metric)

## Edge Cases
- **Seasonal pricing**: Astrology demand peaks during new year, monsoon season; adjust projections
- **Regional pricing**: Consider lower willingness-to-pay in tier-2 cities; test localized tiers
- **Cohort vs. one-time**: Cohort classes (group learning) have different CAC/LTV than one-time charts
- **Enterprise/B2B**: If adding B2B tier, document minimum seat count and volume discounts separately
