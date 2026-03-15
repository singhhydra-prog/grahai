# SECTION 10 — Monitoring and Analytics

**Status:** PARTIAL — Custom analytics system built, only 2/25 events actively firing

---

## What Exists

### Custom Analytics System (Supabase-Based)

**Infrastructure:** LIVE
- Tracker library: `src/lib/analytics/tracker.ts`
- API endpoint: `src/app/api/analytics/route.ts` (POST, fire-and-forget)
- Database table: `analytics_events` with indexes on event_name, user_id, created_at
- Row-level security: Service role writes, users can read own events

**Functions available:**
| Function | Purpose | Status |
|----------|---------|--------|
| `trackEvent()` | Server-side event capture | LIVE |
| `trackEvents()` | Bulk event batch | LIVE |
| `trackClientEvent()` | Client-side fire-and-forget to /api/analytics | LIVE |
| `getEventCount()` | Query event counts by name + timeframe | LIVE |
| `getConversionRate()` | Calculate conversion between two events | LIVE |
| `getDailyActiveUsers()` | Unique user_ids in timeframe | LIVE |

### Event Catalog (25 Defined Events)

| Category | Events | Actively Firing? |
|----------|--------|-----------------|
| **Onboarding** | welcome_cta_clicked, intent_selected, birth_details_completed, chart_generated, instant_reveal_viewed, first_question_asked, onboarding_completed, onboarding_skipped | NO |
| **Engagement** | answer_viewed, source_opened, follow_up_clicked, home_opened, ask_tab_opened, chart_tab_opened, reports_tab_opened, question_asked, question_saved | PARTIAL (2/9) |
| **Monetization** | paywall_viewed, upgrade_started, upgrade_completed, report_purchased, payment_failed | NO (commented out) |
| **Retention** | notification_opened, streak_incremented, daily_insight_viewed, weekly_digest_viewed, app_opened | NO |
| **System** | error_occurred | NO |

**Active instrumentation:**
- `question_asked` — fires in `/api/user/history` when question is processed
- `question_saved` — fires in `/api/user/history` when user saves a question
- `paywall_viewed` — **COMMENTED OUT** in PricingOverlay.tsx (lines 169-171)

**Result: 2 out of 25 events are actively firing. The other 23 exist as TypeScript types and tracker functions but have no call sites in component code.**

---

## Founder Dashboard

**Location:** `src/app/admin/dashboard/page.tsx`
**API:** `src/app/api/admin/dashboard/route.ts`
**Status:** LIVE (code complete, data sparse due to low instrumentation)

### Dashboard Sections

| Section | Metrics Shown | Data Source |
|---------|--------------|-------------|
| Onboarding | Started, Completed, Conversion Rate | analytics_events (welcome_cta_clicked, onboarding_completed) |
| Engagement | DAU, WAU, Questions Today, Questions This Week | analytics_events (unique user_ids) |
| Monetization | Paywall Views, Upgrades, Conversion Rate, Report Sales | analytics_events (paywall_viewed, upgrade_completed, report_purchased) |
| Top Themes | Life area distribution | memory_threads table |
| Issues | Error count | analytics_events (error_occurred) |

**Timeframe selector:** Today, Week, Month with real-time refresh button.

**Auth:** No authentication check — comment says "founder-only page, not linked in app nav." This is a security gap if the URL is discovered.

---

## What's Missing

### No Third-Party Analytics
| Service | Status |
|---------|--------|
| Google Analytics (GA4) | **MISSING** — No gtag, no GA4 measurement ID |
| PostHog | **MISSING** |
| Mixpanel | **MISSING** |
| Amplitude | **MISSING** |

### No Error Monitoring
| Service | Status |
|---------|--------|
| Sentry | **MISSING** |
| LogRocket | **MISSING** |
| DataDog | **MISSING** |
| Cloudflare Analytics | **MISSING** |

**Error handling:** Manual `console.warn`/`console.error` only. No centralized aggregation, no alerts, no error-rate dashboards.

### No Performance Monitoring
- No Web Vitals tracking (LCP, FID, CLS)
- No API latency monitoring
- No ephemeris calculation timing
- No AI response time tracking

---

## Cron Jobs (Scheduled)

Configured in `vercel.json`:

| Endpoint | Schedule | Purpose | Status |
|----------|----------|---------|--------|
| `/api/cron/daily-insights` | 12:30 AM UTC daily | Generate daily insights | LIVE |
| `/api/cron/daily-push` | 6:00 AM UTC daily | Push notifications | LIVE |
| `/api/cron/weekly-push` | 2:30 AM UTC Sundays | Weekly digest | LIVE |
| `/api/cron/monthly-push` | 3:30 AM UTC 1st of month | Monthly notifications | LIVE |

**Note:** Cron endpoints exist and are scheduled, but their success/failure is not tracked in the analytics system.

---

## Instrumentation Gap Analysis

### What's Needed for Product Decisions

| Decision | Required Events | Status |
|----------|----------------|--------|
| Is onboarding effective? | welcome_cta_clicked → onboarding_completed funnel | NOT INSTRUMENTED |
| Are users engaging? | Tab opens, answer views, follow-ups | NOT INSTRUMENTED |
| Is the paywall converting? | paywall_viewed → upgrade_completed | COMMENTED OUT |
| Which reports sell? | report_purchased with report_type | NOT INSTRUMENTED |
| Are errors happening? | error_occurred | NOT INSTRUMENTED |
| What brings users back? | app_opened, daily_insight_viewed | NOT INSTRUMENTED |

### Priority Fixes

**Priority 1 (Before launch):**
1. Uncomment paywall_viewed tracking in PricingOverlay.tsx
2. Add onboarding funnel events (8 events)
3. Add error tracking or integrate Sentry
4. Add admin dashboard authentication

**Priority 2 (First month):**
1. Add tab navigation tracking (5 events)
2. Add report generation tracking
3. Add notification open tracking
4. Consider GA4 as secondary source

**Priority 3 (Growth phase):**
1. Web Vitals monitoring
2. API latency dashboards
3. A/B test framework
4. Cohort analysis queries

---

## Summary

| Component | Status |
|-----------|--------|
| Analytics infrastructure | **LIVE** — Supabase table, tracker, API endpoint all working |
| Event instrumentation | **2/25 ACTIVE** — 92% of defined events never fire |
| Founder dashboard | **LIVE** — Built and functional, shows zeros for uninstrumented events |
| Third-party analytics | **MISSING** — No GA4, no Sentry, no performance monitoring |
| Admin auth | **MISSING** — Dashboard accessible to anyone with URL |

**Bottom line:** The analytics architecture is well-designed and production-ready. The gap is purely in instrumentation — the tracker functions exist, the event types are defined, but call sites haven't been added to most components yet. This is a wiring problem, not a design problem.
