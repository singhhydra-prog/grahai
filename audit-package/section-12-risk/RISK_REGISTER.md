# SECTION 12 — Risk Register

**Status:** 23 risks identified across 7 categories. 5 critical, 7 high, 6 moderate, 5 low.

---

## Risk Severity Definitions

| Level | Meaning |
|-------|---------|
| **CRITICAL** | Must fix before accepting real money or launching publicly |
| **HIGH** | Should fix before marketing push or scaling |
| **MODERATE** | Fix within first month of operation |
| **LOW** | Track and address as resources allow |

---

## PRODUCT RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| P1 | Compatibility tab is 100% mocked (hardcoded scores) — users expect real calculations | **HIGH** | Scores are static; Kundli Match report works but quick-compatibility doesn't | Wire Kundli Match engine to compatibility tab OR clearly label as "preview" |
| P2 | Daily question limit (1/day free) may frustrate users before they see value | **MODERATE** | Welcome period allows 3/day for first 3 days | Monitor churn at day 4; consider extending welcome period |
| P3 | Report library shows purchasable items with no working purchase flow | **HIGH** | One-time pack buttons have no onClick handler | Either hide packs or complete purchase flow before launch |
| P4 | No onboarding analytics — can't measure where users drop off | **MODERATE** | 8 onboarding events defined but never fire | Instrument onboarding funnel (highest-priority analytics work) |

---

## ML / PERSONALIZATION RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| M1 | Career Blueprint shows 50.68% similarity between two male profiles — borderline template-heavy | **LOW** | A vs C pair is weakest; others are <27% | Improve career generator to factor in more chart variables |
| M2 | AI chat quality depends entirely on Claude Sonnet availability and cost | **HIGH** | No fallback if Anthropic API is down or rate-limited | Add graceful degradation: cached responses or code-based fallback for common questions |
| M3 | Hardcoded Delhi coordinates in report catalog as default location | **MODERATE** | If user doesn't provide location, Delhi (28.61°N, 77.21°E) is used | Add warning when using default coordinates; require location in onboarding |
| M4 | No semantic similarity testing — current metric is character-based | **LOW** | 25.38% bigram similarity doesn't capture same-meaning-different-words | Add TF-IDF or embedding-based similarity for deeper validation |

---

## ENGINEERING RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| E1 | Swiss Ephemeris native module — single point of failure for all calculations | **HIGH** | Meeus fallback exists but accuracy is lower (~1 arcminute vs ~0.1 arcsecond) | Ensure fallback is tested regularly; document accuracy differences |
| E2 | No error monitoring (no Sentry, no LogRocket) — production errors invisible | **HIGH** | Only console.error logging; no alerts, no aggregation | Integrate Sentry before launch (free tier sufficient) |
| E3 | Admin dashboard has no authentication — anyone with URL can view metrics | **MODERATE** | Comment says "founder-only, not linked in nav" | Add Supabase auth check for admin role |
| E4 | No rate limiting on AI endpoints — vulnerable to abuse | **HIGH** | Usage limiter exists per user but no IP-level rate limiting | Add middleware rate limiting (Vercel Edge or custom) |
| E5 | TypeScript strict mode ON with zero errors — good, but no automated test suite in CI | **LOW** | Vitest configured, tests exist, but no CI pipeline | Add GitHub Actions workflow for test + type check on PR |

---

## PAYMENT RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| PAY1 | **CRITICAL pricing mismatch** — UI shows ₹199/₹499 but API charges ₹499/₹1,499 | **CRITICAL** | Hardcoded amounts in create-order/route.ts don't match PricingOverlay.tsx | Fix API amounts to match UI immediately |
| PAY2 | **Free tier grants ALL features** — copy-paste bug in entitlement checker | **CRITICAL** | checker.ts lines 62-82 give free tier every premium feature | Fix TIER_FEATURES to correctly restrict free tier |
| PAY3 | Payment verification returns 503 without Razorpay keys | **CRITICAL** | Keys commented out in .env.local; verify route requires them | Ensure keys are configured before enabling payments |
| PAY4 | Verify endpoint falls back to "plus" if x-plan-id header missing | **MODERATE** | A user paying for Rishi could get Plus tier if header is lost | Make x-plan-id required; reject request if missing |
| PAY5 | No webhook for subscription lifecycle (cancellation, renewal, failure) | **HIGH** | Only handles initial payment; no ongoing subscription management | Implement Razorpay webhook handler for subscription events |

---

## TRUST / LEGAL RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| T1 | No legal counsel review of terms, privacy, disclaimer | **CRITICAL** | Content written by AI/developer, not reviewed by lawyer | Get legal review before accepting payments |
| T2 | Missing data localization clause in Privacy Policy (India IT Rules 2011) | **MODERATE** | Privacy policy exists but lacks this specific requirement | Add clause specifying data storage location |
| T3 | Missing Consumer Protection Act 2019 note in Refund Policy | **LOW** | Refund policy exists with 24-hour window | Add CPA 2019 compliance language |

---

## UX RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| U1 | Pricing overlay shows ₹199 but actual charge would be ₹499 — trust destruction | **CRITICAL** | Directly tied to PAY1 | Fix pricing immediately |
| U2 | PurchaseSuccess only shows 3/6 legal links; PricingOverlay shows 4/6 | **LOW** | Partial legal coverage at checkout | Add missing links |

---

## SCALABILITY RISKS

| # | Risk | Severity | Current State | Mitigation |
|---|------|----------|---------------|------------|
| S1 | Swiss Ephemeris concurrent access untested — native module may have thread safety issues | **MODERATE** | Works in single-user testing; no load test performed | Run load test with 50+ concurrent chart generations |
| S2 | Claude AI cost scales linearly with users — no caching of common queries | **HIGH** | Every question triggers a new Claude API call | Implement response caching for identical chart + question combinations |

---

## Risk Summary by Category

| Category | Critical | High | Moderate | Low | Total |
|----------|----------|------|----------|-----|-------|
| Product | 0 | 2 | 2 | 0 | 4 |
| ML/Personalization | 0 | 1 | 1 | 2 | 4 |
| Engineering | 0 | 3 | 1 | 1 | 5 |
| Payments | 3 | 1 | 1 | 0 | 5 |
| Trust/Legal | 1 | 0 | 1 | 1 | 3 |
| UX | 1 | 0 | 0 | 1 | 2 |
| Scalability | 0 | 1 | 1 | 0 | 2 |
| **TOTAL** | **5** | **8** | **7** | **5** | **25** |

---

## Top 5 Fix-Before-Launch Items

1. **PAY1/U1:** Fix pricing mismatch (UI vs API amounts)
2. **PAY2:** Fix free tier feature gating bug
3. **T1:** Get legal counsel review of all 6 legal pages
4. **PAY3:** Configure Razorpay keys for live environment
5. **E2:** Integrate Sentry for error visibility

These five items, if unaddressed, would result in either legal liability, financial harm to users, or invisible production failures. Everything else can be addressed post-launch.
