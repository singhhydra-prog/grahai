# GrahAI Pricing Model

## Current Pricing Structure (Pay-Per-Report)

All prices in **Indian Rupees (₹)**, payments via **Razorpay**.

### Report Catalog

| Report Type | Price | Primary Use Case | Status |
|---|---|---|---|
| **Love Compatibility** | ₹199 | Two-person horoscope matching (dating/engagement) | Live |
| **Kundli Match** | ₹199 | Marriage suitability analysis | Live |
| **Career Blueprint** | ₹499 | Career path, optimal timing for job/business moves | Live |
| **Marriage Timing** | ₹299 | Auspicious marriage windows, life ceremony timing | Live |
| **Annual Forecast** | ₹399 | Year-ahead predictions, quarterly breakdowns | Live |
| **Wealth Growth** | ₹599 | Financial cycles, investment timing, wealth indicators | Live |
| **Dasha Deep Dive** | ₹999 | 15+ year planetary period analysis (premium tier) | Live |

### Pricing Strategy Rationale

**Entry-level (₹199):** Love & Kundli Match
- Viral potential (couple sharing → partner signs up)
- Low barrier-to-try for new users
- Fits dating/engagement use case

**Mid-tier (₹299-₹499):** Marriage Timing, Annual Forecast, Career Blueprint
- Sweet spot for engaged users wanting depth
- Higher perceived value (life decisions are big)

**Premium (₹599-₹999):** Wealth Growth, Dasha Deep Dive
- For committed users seeking 5-10+ year planning
- Dasha (planetary period) is astrology's most sophisticated analysis

### Free Tier Features

**Included without payment:**
- Daily horoscope (1/day, sign-based)
- Basic kundli generation & viewing (MyChartTab)
- 1 "Ask One Question" per month
- Compatibility quick-check (match % only, no breakdown)
- Report library access (view all owned reports)

**Gating logic:**
- Full compatibility report → PaywallBanner (₹199)
- Multi-report bundles → PaywallBanner (future)
- Advanced features (e.g., synastry nodes) → Premium tier (future)

---

## Revenue Model Breakdown

### Current Model: Transactional

```
User Flow: Free horoscope → Discover report need → PaywallBanner
           → Purchase via Razorpay → Report generated → Delivered

Revenue per user:
• Average order value (AOV): ₹400 (estimate: mix of ₹199-₹999)
• Repeat purchase rate: 2-3 reports per engaged user (30-day cohort)
• Razorpay fees: ~2.36% + ₹10 per transaction
  → GrahAI net per ₹400 order: ₹400 - (₹9.44 + ₹10) = ₹380.56

Lifetime Value (LTV) target:
• 30% of free users → paid purchaser (conversion rate)
• Avg 2.5 purchases/user/year
• Repeat rate: 25% buy again next 12 months
• LTV = (0.30 * 400 * 2.5) + (0.075 * 400 * 2.5) = ₹300 / free user
```

### Razorpay Integration

**Payment flow:**
1. User clicks "Unlock Report (₹299)"
2. Backend: POST /api/payment/create-order
   - Creates Razorpay order_id
   - Stores in DB pending verification
3. Frontend: Razorpay modal opens
   - UPI, Cards, NetBanking, Wallet options
   - User submits payment
4. Razorpay webhook: POST /api/payment/verify
   - Validates payment_id + order_id + signature
   - Backend marks payment as "verified"
   - Triggers report generation async
5. Email + in-app: "Report ready" → /report/:id

**Fees:**
- **Standard:** 2.36% + ₹10/transaction
- **Example:** ₹400 order = ₹9.44 + ₹10 = ₹19.44 fee (4.9% effective)
- **Volume discounts:** Available at >₹50k/month revenue (negotiate with Razorpay)

---

## Future Pricing Models (Roadmap)

> **Commitment levels:** Items below are labelled as:
> - **COMMITTED** — actively being built or funded
> - **TARGET** — planned for this quarter, dependent on metrics
> - **ASPIRATIONAL** — directional goal, not committed until prerequisites met

### Option 1: Freemium Subscription
**Tier structure:**
```
Free              Basic              Premium
------            -----              -------
₹0/month          ₹399/month         ₹799/month

• Daily horoscope  • Daily horoscope  • Daily horoscope
• 1 free Q/mo      • 4 reports/month  • Unlimited reports
• Basic kundli     • Basic kundli     • Full kundli + nodes
                   • 12 Q/month       • 24/7 support
                   • Share w/ family  • Astro coaching call
                                        (quarterly)
```

**Adoption plan:**
- Phase 1 (Q2 2026): Introduce annual subscription **[TARGET]**
  - Pay ₹3,999 upfront → 2 months free
  - Target: Early adopters, high-engagement users
  - Prerequisite: 500+ paying users on transactional model
- Phase 2 (Q3 2026): Monthly subscriptions **[ASPIRATIONAL]**
  - Upgrade prompts after 2nd purchase
  - Prerequisite: Phase 1 shows >5% adoption
- Phase 3 (Q4 2026): Family plans **[ASPIRATIONAL]**
  - ₹649/mo for up to 3 family members
  - Prerequisite: Subscription model validated

**Revenue impact:**
- If 10% of paid users convert to ₹399/month sub:
  - Annual recurring revenue (ARR) boost: +₹47,880/10k users
  - Reduces churn vs. transactional

### Option 2: Bundle Pricing
```
"Starter Bundle" (3 reports)
• Love Compatibility + Kundli Match + Annual Forecast
• Save ₹100: ₹499 instead of ₹599
• Triggers after 1st purchase

"Complete Life Plan" (6 reports)
• All except Dasha Deep Dive
• Save ₹500: ₹1,999 instead of ₹2,495
• Triggers after 3+ purchases or lapsed user reactivation

"Dasha Master" (2 reports)
• Dasha Deep Dive + Wealth Growth
• Save ₹200: ₹1,398 instead of ₹1,598
• For users interested in long-term planning
```

### Option 3: Tiered Dasha Reports
```
Dasha Deep Dive variants:
• Standard (₹999): 20 years of period analysis
• Extended (₹1,499): 30 years + remedies
• Astrology Coaching (₹2,999): Dasha + 1 60-min consultant call

(Premium tier targeting serious users)
```

---

## Pricing Psychology & Testing

### Current Copy Effectiveness
```
"₹199 report" vs "₹199 Marriage Compatibility"
→ Latter performs better (specificity)

"Limited time: 30% off" vs "Unlock Full Report ₹299"
→ A/B test needed (scarcity vs. direct value)

"Annual payment saves ₹1,200" vs "₹399/month, cancel anytime"
→ Annual anchors high price; monthly feels accessible
```

### Discount Strategy
**When to use:**
- Lapsed user reactivation: "20% off, 7 days only"
- Post-refund: "50% off next purchase"
- Viral referral: "Both get 15% off"
- High DAU periods (Diwali, New Year): "New Year, New Cosmic You" sale

**Avoid:**
- Chronic discounting (trains users to wait for sales)
- First-purchase discounts (capture full AOV on initial conversion)

---

## Indian Market Context

### Payment Preferences
- **UPI adoption:** 70% of users prefer UPI/PhonePe/Google Pay
  - Razorpay supports all; default to UPI on mobile
- **Trust signals:**
  - "Razorpay Verified Merchant" badge on checkout
  - "SSL Secured Payment"
  - "Money-back guarantee" in copy
- **Price sensitivity:**
  - ₹200-300 impulse buy sweet spot
  - ₹500+ requires stronger value prop
  - ₹1000+ needs long-term ROI framing

### Statutory Requirements
- **Invoice generation:** All payments issue invoice (Razorpay auto-generates)
- **GST:** If >₹40L revenue/year:
  - 18% GST on digital services
  - TDS (Tax Deducted at Source) if B2B
  - Current: Likely <₹40L so GST optional (can opt-in)
  - Include in pricing or absorb?
- **Refund policy:** Must honor within 7 days of purchase (Indian e-commerce norm)

---

## Revenue Projections Framework

### Baseline Model (12-month horizon)

**Assumptions:**
```
Month 1-3 (Launch): Cold start
• 500 signups/month (marketing)
• 5% payment conversion (conservative)
• 25 purchasers × ₹400 AOV = ₹10,000 MRR

Month 4-6 (Traction):
• 1,500 signups/month (product-market fit + word-of-mouth)
• 8% payment conversion (improved UX, testimonials)
• 120 purchasers × ₹400 AOV = ₹48,000 MRR

Month 7-12 (Growth):
• 3,000 signups/month (viral loop: compatibility sharing)
• 12% payment conversion (habit loop: daily horoscope)
• 360 purchasers × ₹400 AOV = ₹144,000 MRR

Year 1 revenue: ₹10k + ₹48k + (₹144k × 6) = ₹1,002,000
```

### Waterfall (What GrahAI Keeps)

```
₹1,000,000 Year 1 gross
-  ₹47,600 Razorpay fees (2.36% + ₹10/txn × ~360 orders/mo avg)
-  ₹200,000 Server/Claude API costs (report generation)
-  ₹150,000 Marketing (paid ads)
-  ₹100,000 Team (1 FTE + contractor)
___________________________________________
    ₹502,400 Gross Profit (50% margin)
-  ₹50,000  Compliance/legal
___________________________________________
    ₹452,400 Net (pre-tax)
```

### KPIs to Track

- **CAC (Customer Acquisition Cost):** Total marketing spend / new payers
  - Target: ₹50-100 CAC (if ₹400 AOV)
- **LTV:CAC ratio:** ₹300 LTV / ₹75 CAC = 4:1 (healthy target: >3:1)
- **AOV (Average Order Value):** Sum(all purchases) / # of purchasers
  - Current target: ₹400
- **Repeat purchase rate:** # users with 2+ purchases / # all purchasers
  - Target: 35% (2nd report bought within 30 days)
- **Conversion rate (free → paid):** # payers / # free users
  - Target: 8-12%
- **Churn rate:** # lapsed users (30+ days inactive) / DAU
  - Target: <5% weekly

---

## Pricing Experiment Roadmap

**Q2 2026 [TARGET]:**
- Test price elasticity: Show different cohorts ₹199 vs ₹249 vs ₹149
- Measure: Conversion %, AOV, repeat rate
- Winner → Roll out platform-wide
- Prerequisite: GA4 conversion tracking live

**Q3 2026 [ASPIRATIONAL]:**
- Beta test ₹399/month subscription with 500 power users
- Measure: MRR growth, churn vs. transactional users
- Prerequisite: Q2 price experiment completed + 500 payers

**Q4 2026 [ASPIRATIONAL]:**
- Launch bundle pricing if bundles increase AOV by >20%
- Scale whatever model shows best LTV:CAC
- Prerequisite: Subscription model validated or rejected

---

## Financial Health Checkpoints

| Metric | Target | Red Flag |
|---|---|---|
| Monthly revenue growth | >15% MoM | <5% MoM (retention issue) |
| Conversion rate | 8-12% | <5% (paywall too high or UX broken) |
| Repeat purchase rate | 35%+ | <20% (users not finding value) |
| Refund rate | <2% | >5% (product/trust issue) |
| AOV | ₹400+ | <₹300 (low engagement) |
