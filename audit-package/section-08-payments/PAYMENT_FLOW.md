# SECTION 8 — Payments and Unlock Logic

**Status:** PARTIAL — Infrastructure built, Razorpay integration in test mode, critical pricing bug

---

## Pricing Structure (UI-Displayed)

| Tier | Name | Price | Billing | Target |
|------|------|-------|---------|--------|
| Free | Free | ₹0 | — | Casual explorers |
| Plus | Graha | ₹199 | /month | Regular users |
| Premium | Rishi | ₹499 | /month | Serious practitioners |

### One-Time Report Packs (UI-Displayed)

| Pack | Price | Description |
|------|-------|-------------|
| Kundli Matching | ₹499 | 36 Guna compatibility |
| Annual Forecast | ₹599 | Month-by-month guidance |
| Career Blueprint | ₹299 | Professional direction |
| Dasha Deep Dive | ₹499 | Current period analysis |

---

## CRITICAL BUG: Pricing Mismatch (UI vs API)

| Tier | UI Price | API Charge | Discrepancy |
|------|----------|------------|-------------|
| Graha | ₹199/mo | ₹499 (49,900 paise) | **₹300 overcharge** |
| Rishi | ₹499/mo | ₹1,499 (1,49,900 paise) | **₹1,000 overcharge** |

**Location:** `src/app/api/payment/create-order/route.ts` — hardcoded amounts don't match PricingOverlay.tsx display prices.

**Severity:** CRITICAL — Users would see one price but be charged a different (higher) amount. Must be fixed before going live with payments.

---

## Feature Gating by Tier

### Entitlement System (`src/lib/entitlements/checker.ts`)

| Feature | Free | Graha (Plus) | Rishi (Premium) |
|---------|------|--------------|-----------------|
| Daily insights | ✓ | ✓ | ✓ |
| Birth chart overview | ✓ | ✓ | ✓ |
| Ask questions | ✓ (1/day) | ✓ (2/day) | ✓ (Unlimited) |
| Saved history | ✗ | ✓ | ✓ |
| Fuller explanations | ✗ | ✓ | ✓ |
| Weekly guidance | ✗ | ✓ | ✓ |
| Career Blueprint report | ✗ | ✓ | ✓ |
| Wealth & Growth report | ✗ | ✓ | ✓ |
| PDF export | ✗ | ✓ | ✓ |
| Love & Compat reports | ✗ | ✗ | ✓ |
| Marriage Timing report | ✗ | ✗ | ✓ |
| Annual Forecast | ✗ | ✗ | ✓ |
| Dasha Deep Dive | ✗ | ✗ | ✓ |
| Kundli Match | ✗ | ✗ | ✓ |
| Deeper timing analysis | ✗ | ✗ | ✓ |
| Priority insights | ✗ | ✗ | ✓ |

### Usage Limits (`src/lib/agents/usage-limiter.ts`)

| Tier | Daily Limit | Welcome Period |
|------|-------------|----------------|
| Free | 1 msg/day | 3/day for first 3 days |
| Plus | 2 msg/day | — |
| Premium | Unlimited | — |

**Bug:** UI promises "30 AI questions per month" for Graha tier, but code allows 2/day = 60/month. Overpromise in UI, over-deliver in code (minor, but inconsistent).

### Soft Paywall Behavior
- Free tier responses truncated after limit with "Upgrade to see full analysis" message
- `shouldShowUpsell()` triggers on: high-intent follow-ups, after 3 questions, after source viewing

---

## Payment Flow (Step by Step)

### Subscription Purchase

```
1. User opens PricingOverlay (triggered from profile, reports, compatibility, or paywall banner)
2. User selects plan (Graha or Rishi)
3. User clicks "Subscribe" → handleSubscribe(planId)
4. Client POST → /api/payment/create-order
   Body: { plan_id, email, phone, name }
5. Server creates Razorpay order (or returns mock in test mode)
6. If testMode: true → alert("Payment system in test mode") → STOP
7. If Razorpay SDK loaded → opens Razorpay checkout modal
8. User completes payment in Razorpay
9. Razorpay callback → Client POST → /api/payment/verify
   Headers: { x-plan-id: "plus" | "premium" }
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
10. Server validates HMAC-SHA256 signature
11. Server updates profiles.subscription_tier in Supabase
12. Client saves tier to localStorage
13. Page reloads → features unlocked
```

### One-Time Report Purchase
- UI displays pack buttons in "One-Time Reports" tab of PricingOverlay
- **Status: MOCKED** — Pack buttons exist but have no `onClick` handler
- No API endpoint for one-time purchases exists yet
- Entitlement checker has `canAccessReport()` that checks one-time purchases in `entitlements` table, but no purchase flow creates these entries

---

## API Routes

### POST /api/payment/create-order
- **Status:** PARTIAL (test mode fallback)
- **Live behavior:** Creates real Razorpay order with `razorpay.orders.create()`
- **Test behavior:** Returns mock order `{ id: "order_test_...", amount, currency, testMode: true }`
- **Current state:** Razorpay keys commented out in `.env.local` → always returns test mode
- **No input validation:** Doesn't verify plan_id matches known plans

### POST /api/payment/verify
- **Status:** LIVE (real cryptographic verification)
- **Validation:** HMAC-SHA256 signature check using `RAZORPAY_KEY_SECRET`
- **Database update:** Sets `profiles.subscription_tier` via Supabase service role
- **Auth required:** Reads JWT from Supabase auth cookies
- **Fallback bug:** If `x-plan-id` header missing → defaults to "plus" tier (line 86)
- **Current state:** Will return 503 if Razorpay keys not configured

---

## Data Storage

| Table | Purpose | Status |
|-------|---------|--------|
| `profiles.subscription_tier` | Current active tier (free/plus/premium) | LIVE |
| `entitlements` | Subscription + one-time purchase records | LIVE (schema), UNUSED (no writes yet) |
| `user_daily_limits` | Daily usage tracking per vertical | LIVE |

**Client-side storage:** `localStorage("grahai-subscription-tier")` mirrors server tier for fast UI gating.

---

## Bugs and Discrepancies

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | **CRITICAL** | UI shows ₹199/₹499 but API charges ₹499/₹1,499 | create-order/route.ts vs PricingOverlay.tsx |
| 2 | **CRITICAL** | Free tier code grants ALL features (copy-paste error) | checker.ts lines 62-82 |
| 3 | **CRITICAL** | Verify endpoint returns 503 without Razorpay keys | verify/route.ts |
| 4 | **MAJOR** | One-time report packs have no purchase flow | PricingOverlay.tsx — no onClick handler |
| 5 | **MAJOR** | UI says "30 questions/month" but code allows 2/day (60/month) | PricingOverlay vs usage-limiter.ts |
| 6 | **MODERATE** | Verify falls back to "plus" if x-plan-id header missing | verify/route.ts line 86 |
| 7 | **MODERATE** | No plan_id validation in create-order | create-order/route.ts |
| 8 | **MINOR** | incrementUsage() silently fails without logging | usage-limiter.ts |

---

## Current Deployment Status

| Component | Status |
|-----------|--------|
| Razorpay SDK loaded in client | LIVE (script tag in layout) |
| Razorpay API keys configured | MOCKED (commented out in .env.local) |
| Payment order creation | MOCKED (returns test orders) |
| Payment verification | LIVE (code ready, blocked by missing keys) |
| Subscription tier update | LIVE (Supabase profiles table) |
| One-time purchase flow | MOCKED (UI exists, no backend) |
| Entitlement enforcement | PARTIAL (checker exists, free tier bug) |
| Usage limiting | LIVE (daily limits tracked) |

**Bottom line:** The payment infrastructure is architecturally sound — Razorpay integration, signature verification, entitlement checking, and usage limiting are all coded. But it's currently running in test mode with a critical pricing mismatch that must be fixed before accepting real money.
