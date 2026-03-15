# SECTION 11 — Deployment and Operational Truth

**Status:** DEPLOYED on Vercel — Production URL live, multiple subsystems at varying readiness

---

## Deployment Infrastructure

| Component | Value | Status |
|-----------|-------|--------|
| Platform | Vercel | **LIVE** |
| Production URL | https://grahai.vercel.app | **LIVE** |
| Framework | Next.js 16 (App Router) | **LIVE** |
| Runtime | Node.js (Vercel Serverless) | **LIVE** |
| SSL/HTTPS | Automatic via Vercel | **LIVE** |
| Project ID | prj_fGnx2dEWEjmTRz2PiGtpP5lO6BVl | Configured |
| Custom domain | Not configured | PENDING |
| CDN | Vercel Edge Network | **LIVE** |

### Build Configuration
- TypeScript strict mode: **ON** (zero errors via `tsc --noEmit`)
- ESLint: Configured
- PostCSS/Tailwind: Configured
- Turbopack: Compatible (sweph, pdfkit externalized)

### PWA / Mobile
- TWA manifest: `twa-manifest.json` configured for Android Play Store
- Digital asset links: `.well-known/assetlinks.json` served via Next.js config
- PWA manifest: Present in `public/`
- Status: **CONFIGURED** (Play Store listing not yet published)

---

## Subsystem Status Matrix

### Frontend (Client-Side)

| Feature | Status | Evidence |
|---------|--------|----------|
| Landing page | **LIVE** | Redirects to /app |
| Onboarding flow | **LIVE** | 5-step wizard with birth data collection |
| Home tab (daily insight) | **LIVE** | AI-generated daily content |
| Ask tab (AI chat) | **LIVE** | Claude Sonnet 4 responses with birth chart context |
| Compatibility tab | **MOCKED** | UI renders, scores are hardcoded percentages |
| Reports tab | **PARTIAL** | Report cards display, generation works, purchase flow incomplete |
| Profile tab | **LIVE** | User settings, subscription status, legal links |
| Bottom navigation | **LIVE** | 5-tab PWA navigation |
| Pricing overlay | **LIVE** | Tier display works, payment flow in test mode |
| Purchase success overlay | **LIVE** | Animation + legal links |
| Global footer | **LIVE** | 6 legal links rendered |
| Legal pages (6) | **LIVE** | All routes return real content |

### Backend (API Routes)

| Route Category | Count | Status |
|----------------|-------|--------|
| Auth routes | 3 | **LIVE** (Supabase OAuth + OTP) |
| AI/Chat routes | 4 | **LIVE** (Claude Sonnet integration) |
| Report generation | 3 | **LIVE** (code-based generators) |
| Payment routes | 2 | **PARTIAL** (test mode, pricing bug) |
| User data routes | 5 | **LIVE** (profile, history, entitlements) |
| Admin routes | 2 | **LIVE** (no auth gate) |
| Cron routes | 4 | **LIVE** (Vercel crons configured) |
| Contact route | 1 | **LIVE** (support form backend) |
| Analytics route | 1 | **LIVE** (event ingestion) |
| Horoscope routes | 3 | **LIVE** (daily/weekly/monthly) |
| Kundli routes | 2 | **LIVE** (chart + report generation) |

### Data Layer (Supabase)

| Component | Status |
|-----------|--------|
| Auth (email OTP + Google OAuth) | **LIVE** |
| Postgres database | **LIVE** |
| Row-Level Security | **LIVE** (policies configured) |
| profiles table | **LIVE** |
| analytics_events table | **LIVE** |
| user_daily_limits table | **LIVE** |
| memory_threads table | **LIVE** |
| entitlements table | **LIVE** (schema ready, mostly empty) |
| Storage buckets | **LIVE** |
| Email templates | **LIVE** (confirmation + magic link) |

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Auth + DB + Storage | **LIVE** |
| Anthropic (Claude) | AI chat + reports | **LIVE** (API key configured) |
| Razorpay | Payments | **MOCKED** (keys commented out) |
| Resend | Transactional email | **LIVE** (API key configured) |
| Swiss Ephemeris | Astronomical calculations | **LIVE** (native module) |

---

## What's LIVE vs MOCKED vs BROKEN vs DOCS ONLY

### LIVE (Fully Operational)
1. User authentication (OTP + Google OAuth)
2. Onboarding flow (5-step birth data collection)
3. Birth chart calculation (Swiss Ephemeris, Lahiri ayanamsa)
4. AI-powered chat (Claude Sonnet, 28-agent routing)
5. 7 code-based report generators (career, love, annual, kundli, marriage, wealth, dasha)
6. Daily/weekly/monthly horoscope generation (cron-driven)
7. User profile management
8. Question history (save/retrieve)
9. Daily usage limiting (soft paywall)
10. 6 legal pages with real content
11. Support contact form
12. Founder admin dashboard
13. Custom analytics infrastructure
14. Email notifications (Resend)

### PARTIAL (Works with Limitations)
1. Payment flow — code complete, running in test mode (Razorpay keys not active)
2. Entitlement enforcement — checker exists, free tier has a feature-grant bug
3. Analytics instrumentation — 2/25 events firing
4. Report purchase UI — cards display, no purchase flow connected
5. PDF export — generator exists, not wired to purchase flow

### MOCKED (UI Only, No Real Backend)
1. Compatibility tab scores — hardcoded percentages
2. One-time report pack purchases — buttons exist, no onClick handler
3. Notification preferences — toggle UI, no push notification service

### BROKEN (Code Exists but Will Fail)
1. Payment verification without Razorpay keys → 503 error
2. Free tier entitlement check grants ALL features (copy-paste bug)
3. Pricing mismatch: UI ₹199/₹499 vs API ₹499/₹1,499

### DOCS ONLY (Planned but Not Built)
1. GA4/Google Analytics integration
2. Sentry error monitoring
3. A/B testing framework
4. Play Store listing (TWA configured, not published)
5. Custom domain (no domain configured yet)
6. Automated report delivery via email after purchase

---

## Environment Variables Required

| Variable | Purpose | Current State |
|----------|---------|--------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | **SET** |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase public key | **SET** |
| SUPABASE_SERVICE_ROLE_KEY | Supabase admin key | **SET** |
| ANTHROPIC_API_KEY | Claude AI access | **SET** |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay public key | **COMMENTED OUT** |
| RAZORPAY_KEY_SECRET | Razorpay secret key | **COMMENTED OUT** |
| RESEND_API_KEY | Email service | **SET** |
| CRON_SECRET | Vercel cron auth | **SET** |

---

## URL Redirects (vercel.json)

| Source | Destination | Purpose |
|--------|-------------|---------|
| /numerology | /app | Feature not yet built |
| /vastu-shastra | /app | Feature not yet built |
| /tarot-reading | /app | Feature not yet built |
| /blog/ | /app | Blog not yet created |

These redirects prevent 404s for planned-but-unbuilt features.

---

## Operational Health Summary

| Metric | Assessment |
|--------|------------|
| Core product (chart + AI + reports) | **HEALTHY** — all working |
| Authentication | **HEALTHY** — Supabase OTP + OAuth |
| Data persistence | **HEALTHY** — Supabase Postgres with RLS |
| Monetization | **NOT READY** — test mode + pricing bugs |
| Observability | **WEAK** — no error monitoring, sparse analytics |
| Security | **MODERATE** — admin dashboard unprotected, no rate limiting on AI endpoints |
| Scalability | **UNKNOWN** — no load testing, Swiss Ephemeris concurrency untested |
