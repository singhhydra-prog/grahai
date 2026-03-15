# Section 2 — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Next.js     │  │  API Routes │  │  Cron Functions     │ │
│  │  App Router  │  │  (30 routes)│  │  (4 scheduled jobs) │ │
│  │  (SSR/CSR)   │  │             │  │                     │ │
│  └──────┬───────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼─────────────────┼────────────────────┼────────────┘
          │                 │                    │
          ▼                 ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│  Supabase    │  │  Claude API  │  │  Razorpay API        │
│  - Auth      │  │  (Sonnet 4)  │  │  - Order creation    │
│  - Postgres  │  │  - Chat      │  │  - Payment verify    │
│  - Storage   │  │  - Reports   │  │  - HMAC-SHA256 sig   │
│  - RLS       │  │              │  │                      │
└──────────────┘  └──────────────┘  └──────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Swiss Ephemeris Engine (Server)     │
│  - sweph native module (primary)    │
│  - Meeus approximation (fallback)   │
│  - 18 calculation modules           │
│  - Sidereal / Lahiri ayanamsa       │
└──────────────────────────────────────┘
```

## Frontend Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js App Router | TypeScript strict mode |
| Styling | Tailwind CSS v4 | Custom "cosmic luxury" design tokens |
| Animation | Framer Motion | Page transitions, micro-interactions |
| State | localStorage + React state | No Redux/Zustand — local-first |
| PWA | next-pwa manifest | Installable on mobile |
| Icons | Lucide React | Consistent icon set |

## Backend Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Vercel Serverless Functions | Node.js, edge-compatible |
| API | Next.js Route Handlers | 30 routes across 8 categories |
| AI/LLM | Claude Sonnet 4 (Anthropic API) | Streaming SSE for chat |
| Ephemeris | Swiss Ephemeris (sweph npm) | C++ native module via indirect require |
| Email | Resend API | Transactional emails |
| Push | Web Push (VAPID) | Browser notifications |

## Database / Storage

| Service | Usage |
|---------|-------|
| Supabase Postgres | 22+ tables: profiles, conversations, messages, memories, kundlis, horoscopes, compatibility, agents, gamification |
| Supabase Auth | Phone OTP, email magic link, Google OAuth |
| Supabase Storage | PDF report storage with 7-day signed URLs |
| Row Level Security | Enforced on all tables — users see only their data |

## Auth Flow

```
User → Login page → Choose method:
  ├─ Phone OTP → /api/auth/otp → Supabase signInWithOtp → verify code → session
  ├─ Email Magic Link → Supabase sendMagicLink → click link → session
  └─ Google OAuth → Supabase signInWithOAuth → redirect → session
→ JWT stored in Supabase client → auto-refresh
→ All API routes check auth via getUser() or getSession()
```
**Status: LIVE** — Real Supabase Auth

## Payments Flow

```
User selects plan → PricingOverlay → handleSubscribe()
→ POST /api/payment/create-order { plan_id, email, phone, name }
  ├─ If RAZORPAY keys present: Creates real Razorpay order
  └─ If keys missing: Returns mock order (testMode: true)
→ Opens Razorpay checkout modal
→ On success: POST /api/payment/verify { razorpay_order_id, payment_id, signature }
  → HMAC-SHA256 signature verification
  → Store subscription in localStorage
  → Reload page
```
**Status: PARTIAL** — Real Razorpay integration but env-var dependent. Price discrepancy: UI shows ₹199/₹499 but API charges ₹499/₹1499.

## Astrology Engine Flow

```
Birth details (date, time, place, lat, lng, tz)
→ birthDetailsToJD() — Julian Day conversion
→ Swiss Ephemeris (or Meeus fallback)
  → 9 planet positions (Sun through Ketu) in sidereal zodiac
  → House cusps (Whole Sign system)
  → Nakshatra calculation (27 stars)
→ Post-processing:
  → Vimshottari Dasha (120-year timeline)
  → Divisional charts (D1, D9, D10)
  → 35+ Yoga detection
  → 8+ Dosha analysis
  → Ashtakavarga (SAV scores)
  → Shadbala (6-fold planet strength)
  → Retrograde + Combustion flags
→ Output: Complete ReportData object (~200 fields)
```
**Status: LIVE** — Real calculations. Primary accuracy: ~0.1 arcsecond. Fallback: ~1-2°.

## Report Generation Flow

```
Path 1: PDF Kundli
  → /api/reports/generate → assembleReportData() → renderKundliPDF() → Supabase upload → signed URL

Path 2: AI-Enhanced Typed Reports
  → /api/reports/generate-typed → assembleReportData() → buildChartSummary()
  → Claude API with specialized prompt → JSON parse → TypedReport

Path 3: Code-Based Generators (7 types)
  → /api/reports/generate-code → assembleReportData() → generateReport(type, data)
  → Pure code, no AI dependency → structured JSON sections
```
**Status: LIVE** — All 3 paths functional

## AI/LLM Flow

```
Chat:
  User message → /api/chat → CEO Orchestrator agent
  → Detects vertical (astrology/numerology/tarot/vastu)
  → Loads DB prompt version for chosen agent
  → Executes tools: getNatalChart, calculateDasha, getDailyHoroscope, etc.
  → Streams response as SSE text_delta events
  → Memory: auto-extracts birth data from messages

Reports:
  Chart data → buildChartSummary() → Claude API (Sonnet 4)
  → System prompt: specialized per report type (500-1000 chars)
  → All calculated data serialized into prompt
  → Returns structured JSON (sections + remedies)
```
**Status: LIVE** — Requires ANTHROPIC_API_KEY. Returns 503 without it.

## Analytics / Logging

| What | Status |
|------|--------|
| GA4 / Google Analytics | NOT IMPLEMENTED |
| Event tracking (frontend) | NOT IMPLEMENTED |
| /api/analytics endpoint | LIVE — accepts 24 event types, stores in Supabase |
| Server-side logging | Console only — no structured logging service |
| Error tracking (Sentry etc.) | NOT IMPLEMENTED |
| Admin dashboard | LIVE — basic metrics at /admin/dashboard |

## Deployment

| Aspect | Detail |
|--------|--------|
| Platform | Vercel |
| Branch | main → auto-deploy |
| CI/CD | Vercel auto-build (no custom CI) |
| Preview deploys | Via Vercel PR previews |
| Environment | Production only (no staging) |
| Regions | Default Vercel (US East) |

## Environment Dependencies

See section-03-code/ENV_REQUIREMENTS.md for full list.
