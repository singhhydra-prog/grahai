# GrahAI Application Map

## Route Tree Overview

```
grahai.com
├── PUBLIC PAGES (No auth required)
│   ├── / (Landing Page)
│   ├── /auth/login (OTP Login)
│   ├── /auth/callback (Supabase Auth Handler)
│   ├── /privacy-policy (Legal)
│   ├── /terms (Legal)
│   ├── /disclaimer (Astrology/Legal)
│   ├── /faq (Support)
│   ├── /support (Contact)
│   └── /refund-policy (Trust)
│
├── AUTHENTICATED APP (After OTP login)
│   ├── /app (MainApp with Tab Layout)
│   │   ├── HomeTab (Primary feed/horoscope)
│   │   ├── AskTab (Ask one question)
│   │   ├── CompatibilityTab (Horoscope matching)
│   │   ├── MyChartTab (Kundli viewer)
│   │   └── ProfileTab (User settings)
│   ├── /daily (Daily Horoscope Page)
│   ├── /weekly (Weekly Guidance Page)
│   ├── /report/:reportId (Report Detail View)
│   ├── /library (Saved Reports)
│   ├── /billing (Billing History)
│   └── /admin/dashboard (Admin Only)
│
└── API ROUTES
    ├── CORE AI/GENERATION
    │   ├── POST /api/chat (Generic chat)
    │   ├── POST /api/reports/generate (Main report generator)
    │   ├── POST /api/reports/generate-code (TypeScript generation)
    │   ├── POST /api/reports/generate-typed (Typed report output)
    │   ├── GET /api/daily-horoscope (Daily horoscope feed)
    │   ├── GET /api/cosmic-snapshot (Quick snapshot)
    │   └── POST /api/ask-one-question (Single Q&A)
    │
    ├── PAYMENTS (Razorpay)
    │   ├── POST /api/payment/create-order (Create Razorpay order)
    │   └── POST /api/payment/verify (Webhook verification)
    │
    ├── USER DATA
    │   ├── GET /api/user/profile (Auth user profile)
    │   ├── GET /api/user/history (Purchased reports)
    │   └── GET /api/user/entitlements (Access control)
    │
    ├── ENGAGEMENT
    │   ├── POST /api/gamification/award-xp (XP system)
    │   ├── POST /api/gamification/complete-reading (Mark complete)
    │   ├── POST /api/gamification/rate-reading (Rating)
    │   ├── GET /api/gamification/stats (User stats)
    │   ├── POST /api/push/subscribe (Push notifications)
    │   └── POST /api/push/preferences (Notification settings)
    │
    ├── AUTOMATION (Cron jobs)
    │   ├── POST /api/cron/daily-insights (Send daily horoscope)
    │   ├── POST /api/cron/daily-push (Daily notification)
    │   ├── POST /api/cron/weekly-push (Weekly notification)
    │   └── POST /api/cron/monthly-push (Monthly summary)
    │
    ├── ADMIN
    │   └── /* (Multiple admin endpoints - TBD)
    │
    ├── MONITORING
    │   ├── GET /api/analytics (Event tracking)
    │   └── GET /api/usage (System usage)
    │
    └── PUBLIC
        └── POST /api/contact (Support form)
```

## Report Types (Purchasable via Razorpay)

| Report Type | Price | Status | Description |
|---|---|---|---|
| Love Compatibility | ₹199 | Implemented | Two-person horoscope match |
| Kundli Match | ₹199 | Implemented | Marriage suitability |
| Career Blueprint | ₹499 | Implemented | Career path & timing |
| Marriage Timing | ₹299 | Implemented | Auspicious marriage windows |
| Annual Forecast | ₹399 | Implemented | Year-ahead predictions |
| Wealth Growth | ₹599 | Implemented | Financial guidance |
| Dasha Deep Dive | ₹999 | Implemented | Planetary period analysis |

## Page Status & Implementation

| Route | Component | Auth | Status | Notes |
|---|---|---|---|---|
| / | LandingPage | ✗ | Implemented | Marketing entry |
| /auth/login | LoginPage | ✗ | Implemented | OTP via Supabase |
| /app | MainApp + Tabs | ✓ | Implemented | 5-tab layout: Home/Ask/Compat/Chart/Profile |
| /daily | DailyInsightPage | ✓ | Implemented | From HomeTab |
| /weekly | WeeklyGuidancePage | ✓ | Implemented | Weekly horoscope |
| /report/:id | ReportDetailPage | ✓ | Implemented | Purchased report view |
| /library | SavedLibraryPage | ✓ | Implemented | My purchased reports |
| /billing | BillingHistoryPage | ✓ | Implemented | Order history + Razorpay |
| /admin/dashboard | AdminDashboard | ✓ Admin only | Partial | Revenue/user metrics |

## Key Components Used

**Layout:** AppHeader, BottomNav, CosmicBackground, SpaceParticles
**Core:** KundliChart, LocationSearch, PurchaseSuccess, ShareCard
**Engagement:** StreakBadge, TierBadge, SourceDrawer
**Brand:** GrahAILogo, SplineStar

## Design System Reference

- **Primary dark:** #0A0E1A (deep space)
- **Accent:** #D4A843 (saffron-gold)
- **Text:** #E8E6F0 (cosmic white)
- **Theme:** Luxury cosmic astrology UI

## Missing / Stub Routes

- Admin endpoints incomplete (generic /api/admin/*)
- Weekly guidance page might be thin
- Report sharing flow (ShareCard exists but implementation unclear)

## Authentication Flow

1. User lands on / (public landing)
2. Clicks login → /auth/login (OTP form)
3. Submits phone → Supabase sends OTP
4. Confirms OTP → /auth/callback (server exchange)
5. Redirects to /app (authenticated)

## Next Steps

- Map OnboardingFlow component (shown after first signup?)
- Clarify PricingOverlay behavior (paywall trigger point?)
- Verify PaywallBanner placement across routes
- Document ReferralPage if exists
