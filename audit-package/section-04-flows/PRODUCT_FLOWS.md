# Section 4 — Product Flow Evidence

## Flow Status Summary

| # | Flow | Status | Verdict |
|---|------|--------|---------|
| 1 | Signup/Login | LIVE | Real Supabase Auth (OTP, email, Google) |
| 2 | Onboarding | LIVE | 6-step flow, real cosmic snapshot API |
| 3 | Home/Dashboard | LIVE | Real daily horoscope API |
| 4 | Daily Insight | LIVE | Real API with detailed mode |
| 5 | Chat/Ask | LIVE | Claude streaming, 28-agent system |
| 6 | Reports Catalog | PARTIAL | Hardcoded catalog, Delhi coordinates |
| 7 | Report Generation | LIVE | Real chart → real PDF/text output |
| 8 | Compatibility | **MOCKED** | Hardcoded score=76, fake 2.5s delay |
| 9 | Pricing/Paywall | LIVE | Real UI, real plan selection |
| 10 | Checkout/Payment | PARTIAL | Real Razorpay but price discrepancy |
| 11 | Profile/Settings | LIVE | Edit birth data, language, legal links |
| 12 | Legal Pages | LIVE | All 6 pages with full content |
| 13 | Error States | LIVE | Error boundaries, empty states |
| 14 | Gamification | LIVE | Real XP, streaks, achievements |
| 15 | Library | **MOCKED** | Hardcoded data, no API |
| 16 | Billing | **MOCKED** | Hardcoded transactions, broken receipts |
| 17 | Weekly | PARTIAL | Real API for theme, hardcoded structure |

---

## Detailed Flow Walkthroughs

### FLOW 1: Signup/Login — LIVE
**What should happen:** User authenticates via phone OTP, email magic link, or Google OAuth.
**What actually happens:** All 3 methods work via Supabase Auth. Phone OTP normalizes +91 prefix, validates 6-digit code. JWT session stored and auto-refreshed.
**Known issues:** None.

### FLOW 2: Onboarding — LIVE
**What should happen:** 6-step flow: language → consent → intent → birth details → reveal → first question.
**What actually happens:** Collects real birth data. Calls /api/cosmic-snapshot with actual coordinates. Falls back to mock snapshot if API fails. Stores in localStorage.
**Known issues:** Falls back to mock if API unreachable. LocationSearch geocoding dependency unclear.

### FLOW 3: Home/Dashboard — LIVE
**What should happen:** Daily horoscope with theme, headline, life area cards, lucky elements.
**What actually happens:** Fetches /api/daily-horoscope POST daily. Returns real calculated content. Framer Motion animations. Falls back to mock if API fails.
**Known issues:** None significant.

### FLOW 4: Daily Insight — LIVE
**What should happen:** Full-page detailed daily horoscope with 8+ sections.
**What actually happens:** Calls API with `detailed: true`. Displays 8 structured sections. Includes panchang info and feedback buttons.
**Known issues:** None.

### FLOW 5: Chat/Ask — LIVE
**What should happen:** User asks question → streamed response with 7 structured sections.
**What actually happens:** POST /api/chat → CEO Orchestrator detects vertical → loads agent prompt → executes tools (getNatalChart, calculateDasha, etc.) → streams SSE. Custom regex parser extracts sections. Awards XP. Saves to history.
**Known issues:** Requires ANTHROPIC_API_KEY. Returns 503 without it. Regex parser has fallback for unexpected formats.

### FLOW 6: Reports Catalog — PARTIAL
**What should happen:** User browses reports with correct pricing and their location.
**What actually happens:** 6 hardcoded categories with pricing tiers. **Coordinates hardcoded to Delhi (28.6139, 77.209)** regardless of user's actual birth place.
**Known issues:** CRITICAL — all reports generated for Delhi, not user's actual location.

### FLOW 7: Report Generation — LIVE
**What should happen:** User selects report → system generates personalized output.
**What actually happens:** 3 paths work: PDF kundli, AI-enhanced typed, pure code-based. All use real Swiss Ephemeris calculations. Reports contain chart-specific content (verified: 75% unique across different charts).
**Known issues:** Inherits Delhi coordinate issue from catalog. Report detail page /report?id= works.

### FLOW 8: Compatibility — **MOCKED**
**What should happen:** User enters partner details → real compatibility analysis.
**What actually happens:** Despite collecting real partner data (name, date, time, place), the system returns a **hardcoded mock**: score=76, 6 fixed sections, after an artificial 2.5-second delay simulating calculation.
**Known issues:** CRITICAL — zero real functionality. Complete fake with delay to simulate work. Premium sections marked but not restricted.

### FLOW 9: Pricing/Paywall — LIVE
**What should happen:** Modal with plan comparison and checkout flow.
**What actually happens:** 2 tabs (Monthly Plans, One-Time Packs). 3 tiers displayed. Plan selection works. Legal links now added below CTA.
**Known issues:** None for UI. Checkout has issues (see Flow 10).

### FLOW 10: Checkout/Payment — PARTIAL
**What should happen:** Razorpay checkout → payment verification → feature unlock.
**What actually happens:** Creates Razorpay order via API. Opens checkout modal. Verifies HMAC-SHA256 signature. Stores tier in localStorage.
**Known issues:**
- **PRICE DISCREPANCY**: UI shows Graha=₹199, Rishi=₹499. API charges Graha=₹499, Rishi=₹1,499.
- Falls to test mode if RAZORPAY keys missing.
- No auth on /api/payment/create-order.
- x-plan-id header from client not validated against order.

### FLOW 11: Profile/Settings — LIVE
**What should happen:** View/edit profile, change language, view balance, access legal pages.
**What actually happens:** All functional. Edit birth details saves to localStorage. Language picker works. Balance cards show from localStorage. 6 legal links (all working). Sign out clears storage.
**Known issues:** KundliChart shows hardcoded sample planets, not user's actual chart.

### FLOW 12: Legal Pages — LIVE
**What should happen:** 6 legal pages with comprehensive content.
**What actually happens:** All exist with real content. Disclaimer (3 notices), Terms (9 sections), Privacy (8 sections), Refund (5 sections), FAQ (collapsible), Support (contact form).
**Known issues:** None. Now linked in GlobalFooter, PricingOverlay, PurchaseSuccess, and ProfileTab.

### FLOW 13: Error/Loading/Empty States — LIVE
**What should happen:** Graceful handling throughout.
**What actually happens:** Root error.tsx with "Cosmic Disturbance" message. Empty states with CTAs for library/billing/history. Loading spinners on payment CTA.
**Known issues:** Some components (HomeTab, ReportsTab) lack loading indicators during API calls. No skeleton screens anywhere.

### FLOW 14: Gamification — LIVE
**What should happen:** XP awards, streaks, achievements, daily challenges.
**What actually happens:** /api/gamification routes handle XP calculation, streak tracking, achievement unlocking, and daily challenges. All stored in Supabase user_stats table.
**Known issues:** Only Ask tab triggers award-xp; other verticals unclear.

### FLOW 15-17: Library / Billing / Weekly
- **Library: MOCKED** — 3 sample answers, 2 sample reports, 2 sample matches. All hardcoded. Delete buttons non-functional.
- **Billing: MOCKED** — Shows "Graha Plan ₹199/month" and 5 hardcoded transactions. Receipt downloads href="#" (broken).
- **Weekly: PARTIAL** — Fetches real API for theme. Day structure and life area forecasts hardcoded.
