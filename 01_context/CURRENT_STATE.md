# GrahAI — Current State
> Last updated: 2026-03-15 (Session 3 — Live Parity Audit)

## What's Working
- Swiss Ephemeris calculations with Meeus fallback for Vercel
- 7 code-based report generators (love-compat, kundli-match, career-blueprint, marriage-timing, annual-forecast, wealth-growth, dasha-deep-dive)
- Code-based API route at /api/reports/generate-code (no AI dependency, <2s generation)
- Claude AI backup route at /api/reports/generate-typed
- Supabase auth (email/OTP)
- Razorpay payment integration (create-order + verify)
- Daily horoscope generation via /api/daily-horoscope
- Cron jobs for daily/weekly/monthly insights
- Push notification system
- Gamification engine (XP, streaks, achievements)
- Admin dashboard
- Full Vedic calculation pipeline: natal chart, divisional charts, Vimshottari Dasha, yogas, doshas, Ashtakavarga, Shadbala, Bhava Chalit, SAV transit timing
- 6 legal page routes exist with styled components (/disclaimer, /privacy-policy, /terms, /refund-policy, /faq, /support)
- 4 of 6 legal pages linked from ProfileTab

## What Needs Improvement

### Highest Priority (Live Parity Gaps)
1. **No global footer** — Legal links only accessible from ProfileTab. Not on public pages, checkout, or non-tab views.
2. **Checkout has no legal links** — PricingOverlay and PurchaseSuccess have zero links to disclaimer/refund/terms.
3. **FAQ + Support missing from ProfileTab** — Only 4 of 6 legal pages linked there.
4. **No GA4 / analytics instrumentation** — Zero event tracking in the codebase. Cannot measure any KPI.
5. **No landing page** — Root `/` redirects to `/app`. No conversion surface for unauthenticated visitors.
6. **Legal page content gaps** — Disclaimer missing birth-time accuracy and no-guarantee sections. FAQ missing payment-specific Q&As. Other pages need audit against specs in `03_docs/legal/`.

### Medium Priority
- Report uniqueness: 3 of 7 generators still >40% generic (love-compat 48.3%, kundli-match 53.3%, wealth-growth 54.6%)
- Meeus fallback accuracy: ~1-2° vs Swiss Ephemeris sub-arcsecond precision
- No subscription/recurring payment flow yet
- No Stripe integration for NRI/global payments
- Test coverage is minimal

### Lower Priority
- No automated marketing/content pipeline
- Evaluation suite exists but needs regular use
- No ticket system for support

## Recent Changes (Session 3)
- Added 4 customer-facing checklists (page-launch, legal-publishing, ux-review, pricing-page)
- Expanded memory-updater to cover CLAUDE.md sync + product files + weekly logs
- Added live deployment tracking table to TRUST_PAGES_PLAN with code audit results
- Added instrumentation status table to SUCCESS_METRICS (most KPIs show "NO — not implemented")
- Relabelled roadmap goals as COMMITTED/TARGET/ASPIRATIONAL with prerequisites
- Added Project Prime (mandatory session-start preflight) to CLAUDE.md
- Wired checklist enforcement into 4 skills (page-auditor, legal-page-builder, ux-wireframer, pricing-analyst)
- Fixed stale context paths in 4 skill files

## Next 3 Priorities
1. **Create global footer component** + add to layout.tsx + add legal links to checkout surfaces
2. **Install GA4** + fire core events (sign_up, page_view, purchase_completed, report_shared)
3. **Audit legal page content** against specs + fix gaps (run `legal-publishing.md` checklist per page)

## Architecture Status
- Workspace restructuring: COMPLETE (57 files across 4 tiers)
- Business OS: COMPLETE (5 domains, 18 skills, 7 checklists, 7 product files)
- Code bug fixes: COMPLETE (7 fixes across 4 generators + test suite)
- Live parity: GAPS IDENTIFIED (see Highest Priority above)
- Analytics: NOT STARTED
