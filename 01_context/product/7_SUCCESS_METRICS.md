# GrahAI Success Metrics (KPIs & Measurement)

## KPI Framework by Domain

---

## 0. REPORT QUALITY (Internal Engineering Metric)

### Report Uniqueness (aka "Generic %")
**Definition:** Percentage of sentences in a generated report that are identical across 3 different birth charts. Measured by `npx tsx test-uniqueness.ts`.
- **"Generic %"** = sentences that appear word-for-word in 2+ of 3 test outputs. Lower is better.
- **"Unique %"** = 100 - Generic %. Higher is better. This is the "chart-specific" content.
- When we say ">60% chart-specific", we mean Generic % < 40%.

**Target:** Generic % < 40% per report type (i.e., >60% chart-specific content).

**Current (as of 2026-03-15):**
| Report | Generic % | Status |
|--------|-----------|--------|
| annual-forecast | 35.4% | PASS |
| career-blueprint | 39.5% | PASS |
| marriage-timing | 40.3% | BORDERLINE |
| dasha-deep-dive | 40.8% | BORDERLINE |
| love-compat | 48.3% | NEEDS WORK |
| kundli-match | 53.3% | NEEDS WORK |
| wealth-growth | 54.6% | NEEDS WORK |

**Test charts used:** Aries Asc (Sun exalted, Jupiter MD), Libra Asc (Sun debilitated, Saturn MD), Capricorn Asc (Moon exalted, Venus MD).

**How to improve:** Use `auto-research` skill (RRL loop) — replace static sentences with data-driven ones that reference actual chart data (planet dignities, house strengths, dasha periods).

---

## 1. ACQUISITION (Top of Funnel)

### Monthly Users Visiting
**Definition:** Unique visitors to grahai.com / (landing page) in a month
**Target:** 5,000 → 25,000 (by Month 12)
**Measurement:** Google Analytics 4 (GA4) → Acquisition → Overview
**Current:** TBD (baseline needed)

### Signup Rate (Visitors → Signups)
**Definition:** (New signups) / (unique visitors to /)
**Target:** 8-15% (industry avg: 3-5%)
**Why high:** High intent (astrology seeker) + low friction (OTP login)
**Measurement:** GA4 event: sign_up / landing_page_session
**Optimization lever:**
- Landing page copy → "Discover Your Cosmic Blueprint"
- Mobile UX (test button placement)
- Trust signals (testimonials, ratings)

### Cost Per Signup (CPS)
**Definition:** Marketing spend / new signups acquired
**Target:** ₹20-50 per signup (if using paid ads)
**Current model:** Organic (word-of-mouth, viral share)
**If paid campaigns (Google Ads, Instagram):**
  - ₹100 campaign spend ÷ 5 signups = ₹20 CPS
  - Acceptable if LTV ≥ ₹200 (target 10x payback)
**Measurement:** UTM tracking (utm_source, utm_medium, utm_campaign)

### Traffic Source Mix
**Target by Month 12:**
```
Organic (SEO):     60%  ← Long-term compounding (kundli + reports)
Direct:            20%  ← Brand awareness, word-of-mouth
Referral (viral):  15%  ← Compatibility sharing, friend invites
Paid (if active):   5%  ← Ads retargeting
```
**Measurement:** GA4 → Acquisition → Traffic acquisition

---

## 2. ACTIVATION (First Engagement)

### Onboarding Completion Rate
**Definition:** (Users who complete kundli calculation) / (signup starts)
**Target:** 70% (within 24 hours of signup)
**Critical dropoff points:**
- Birth date input (user hesitates due to data concern) → Add reassurance copy
- Birth time input (unsure) → Add "optional" toggle with explanation
- Location input (slow search) → Optimize LocationSearch component
- Kundli calculation (impatient, takes >5 sec) → Show spinner + ETA
**Measurement:**
- Event: onboarding_started (page load)
- Event: birth_date_entered
- Event: birth_location_entered
- Event: kundli_generated (success)
**Report metric:** Funnel visualization in GA4 or custom dashboard

### First Kundli Generation Time
**Definition:** Time from signup → kundli chart displayed
**Target:** <3 minutes for 80% of users
**Measurement:** Event timestamps
```
const startTime = performance.now();
// ...form completion...
const generateTime = performance.now() - startTime;
analytics.event('kundli_generation_time', { duration_ms: generateTime });
```
**Optimization:** Claude API latency + DB query optimization

### Daily Horoscope Open (1st Day)
**Definition:** % of activated users who open /daily within 24h of signup
**Target:** 40%
**Measurement:** GA4 event: page_view (path: /daily)
**Optimization lever:** Push notification sent immediately post-signup

---

## 3. ENGAGEMENT (Daily/Weekly Habit)

### Daily Active Users (DAU)
**Definition:** Unique users who open app or visit app/:tab in a day
**Target:** 100 DAU (Month 1) → 2,000 DAU (Month 6) → 5,000 DAU (Month 12)
**Measurement:** GA4 → Users → Active Users (daily)
**Health check:** DAU / WAU ratio
- Healthy: DAU/WAU > 0.25 (25% of weekly users are daily)
- Unhealthy: DAU/WAU < 0.15 (low frequency)

### Weekly Active Users (WAU)
**Definition:** Unique users in a 7-day rolling window
**Target:** 500 WAU (Month 1) → 7,000 WAU (Month 6)
**Measurement:** GA4 → Users → Active Users (weekly)

### Monthly Active Users (MAU)
**Definition:** Unique users in a 30-day window
**Target:** 1,000 MAU (Month 1) → 15,000 MAU (Month 6)
**Measurement:** GA4 → Overview

### Engagement Rate (DAU/MAU)
**Definition:** DAU / MAU
**Target:** 20-30% (healthy SaaS avg: 10-20%)
**Calculation example:**
- 5,000 DAU ÷ 20,000 MAU = 25% engagement rate
**Optimization:** Habit loop (daily horoscope push notifications)

### Daily Horoscope Habit Completion
**Definition:** % of users who open /daily or HomeTab daily
**Target:** 40% of DAU
**Measurement:**
```
Event: horoscope_view (fired on /daily page load)
Metric: consecutive_days (streak counter)
```
**Sub-metrics:**
- 3+ day streak: 60% of activated users
- 7+ day streak: 35% of activated users
- 30+ day streak: 15% of activated users

### Streak Completion Rate (7+ Days)
**Definition:** % of users reaching 7+ consecutive daily horoscope reads
**Target:** 35% of signup cohort (by Day 30)
**Measurement:** /api/gamification/stats endpoint
**Optimization:** StreakBadge visibility + milestone notifications

### Weekly Guidance Open Rate
**Definition:** % of users who click /weekly report (Cron: /api/cron/weekly-push)
**Target:** 25% of WAU
**Measurement:** Event: weekly_guidance_open
**Note:** Depends on /api/cron/weekly-push delivery + push notification CTR

### Session Duration (Average)
**Definition:** Avg time spent in app per visit
**Target:** 4-6 minutes (comfortable browsing + reading)
**Measurement:** GA4 → Engagement → Session duration
**Too low (<2 min):** UX issue (hard to find content)
**Too high (>15 min):** Content stickiness (good) OR waiting for report generation

### Report View Time
**Definition:** Avg time reading a purchased report (/report/:id)
**Target:** 3-5 minutes (thorough engagement)
**Measurement:**
```
Event on page_load: report_view_start (page_path: /report/:id)
Event on exit: report_view_end (time_on_report_seconds)
```
**Optimization:** Improve report formatting + add interactive elements

### Push Notification Click-Through Rate (CTR)
**Definition:** (Push notification opens) / (Push notifications sent)
**Target:** 35-50%
**Calculation example:**
- 1,000 daily push notifications sent
- 400 opened → 40% CTR (good)
**Measurement:**
```
Event: push_notification_sent (Firebase/OneSignal)
Event: push_notification_clicked (deep link: /daily)
```
**Optimization by message:**
- "Your horoscope awaits": 45% CTR (action-oriented)
- "Cosmic guidance for you": 25% CTR (generic)
- "🔥 28-day streak! Keep going": 60% CTR (social proof + gamification)

---

## 4. REVENUE (Monetization)

### Number of Payers
**Definition:** Unique users who made ≥1 purchase
**Target:** 50 (Month 1) → 500 (Month 3) → 2,000 (Month 6)
**Measurement:** Database query: SELECT COUNT(DISTINCT user_id) FROM orders WHERE status='completed'
**Health check:** Payers / MAU ratio
- Target: 8-12% (8-12 out of 100 users convert to paid)

### Payment Conversion Rate
**Definition:** (Payers) / (Users who see paywall)
**Target:** 8-12%
**Calculation:**
- 10,000 users see PaywallBanner (after 2nd report view)
- 1,000 complete purchase → 10% conversion
**Measurement:**
```
Event: paywall_banner_shown
Event: purchase_started (clicked "Unlock Report")
Event: purchase_completed (Razorpay verified)
```
**Optimization levers:**
- Paywall copy clarity (see COPY_SYSTEM.md)
- Price anchoring (show ₹399 vs. ₹599 reports to different cohorts)
- Trust signals (testimonials, refund guarantee)

### Average Order Value (AOV)
**Definition:** Total revenue / # of orders
**Target:** ₹400-450
**Calculation:**
- Month 1: ₹20,000 revenue ÷ 50 orders = ₹400 AOV
- Month 3: ₹240,000 revenue ÷ 500 orders = ₹480 AOV
**Measurement:** Database: SUM(order_amount) / COUNT(order_id)
**Optimization:**
- Bundle pricing (save ₹100 for 3-report bundle)
- Upsell higher-tier reports (Dasha Deep Dive: ₹999)
- Cross-sell: "Complement with Wealth Growth report"

### Report Purchase Breakdown (by type)
**Definition:** % of total purchases by report type
**Target:**
```
Love Compatibility:  20% (impulse buy, low price)
Kundli Match:        20% (marriage consideration)
Annual Forecast:     18% (popular, mid-price)
Career Blueprint:    18% (life planning)
Marriage Timing:     15% (specific need)
Wealth Growth:       7%  (niche)
Dasha Deep Dive:     2%  (premium/rare)
```
**Measurement:** Pivot: Orders by report_type
**Insight:** If Dasha <1%, consider price reduction or better marketing
**Insight:** If Love >30%, users are novelty-driven (low repeat rate?)

### Repeat Purchase Rate
**Definition:** % of users who make 2+ purchases within 30 days
**Target:** 35%
**Calculation:**
- Cohort of 100 first-time purchasers
- 35 go on to buy a 2nd report within 30 days
**Measurement:**
```
SELECT COUNT(DISTINCT user_id) FROM orders
WHERE user_id IN (SELECT user_id FROM orders WHERE purchase_date BETWEEN DATE_SUB(TODAY(), INTERVAL 30 DAY) AND TODAY())
AND COUNT(DISTINCT order_id) >= 2 /
SELECT COUNT(DISTINCT user_id) FROM orders WHERE purchase_date BETWEEN DATE_SUB(TODAY(), INTERVAL 30 DAY) AND TODAY()
```
**Optimization:**
- Post-report upsell (ReportDetailPage: "Explore Wealth Growth")
- Email: "You loved X? Try Y" (personalized recommendation)
- Discount: 20% off 2nd report

### Monthly Recurring Revenue (MRR)
**Definition:** Predictable revenue recurring each month (if subscription model)
**Target (if subscription launches in Q3):**
- Month 1 of subscription: ₹20,000 MRR (50 users × ₹399)
- Month 6: ₹150,000 MRR (375 users × ₹399)
**Measurement:** SUM(subscription_price) for active subs
**Note:** Transactional model (current) doesn't have MRR; use total monthly revenue instead

### Total Revenue (Transactional Model)
**Definition:** Sum of all successful Razorpay orders in a month
**Target:**
```
Month 1:  ₹25,000  (50 orders × ₹500 avg)
Month 2:  ₹45,000  (90 orders × ₹500 avg) [45% MoM growth]
Month 3:  ₹75,000  (150 orders × ₹500 avg) [67% MoM growth]
Month 6:  ₹200,000 [stabilizing growth]
Month 12: ₹800,000 [annualized: ₹9.6M]
```
**Measurement:** Razorpay dashboard + custom analytics

### Gross Profit Margin
**Definition:** (Revenue - Razorpay fees - COGS) / Revenue
**Target:** 50%+
**Calculation:**
```
Revenue: ₹100,000
- Razorpay fees (2.36% + ₹10): ₹2,400
- Claude API cost (₹5/report): ₹500
= Gross Profit: ₹97,100 (97% margin)
- Operating costs (staff, servers): ₹30,000
= Net: ₹67,100
```
**Health check:** If margin <40%, review pricing or API costs

### Customer Lifetime Value (LTV)
**Definition:** Total revenue a user generates over their lifetime
**Target:** ₹500-800
**Calculation (Year 1 proxy):**
- 30% of free users convert to paid (₹300 LTV / free user)
- Repeat rate: 35% buy 2nd report
- Additional revenue: 35% × 50% of AOV = +₹70
- Total LTV: ₹370 (conservative)
**Measurement:** Cohort analysis
```
SELECT AVG(total_spent)
FROM (SELECT user_id, SUM(amount) as total_spent
      FROM orders
      WHERE created_at BETWEEN '2026-01-01' AND '2026-03-15'
      GROUP BY user_id)
```

### LTV:CAC Ratio
**Definition:** Customer Lifetime Value ÷ Customer Acquisition Cost
**Target:** 5:1 or higher
**Calculation:**
- CAC: ₹75 (if paying for ads)
- LTV: ₹500
- Ratio: 500/75 = 6.7:1 (healthy)
**Health benchmark:**
- <3:1 = Unsustainable (spending too much to acquire)
- 3:1-5:1 = Acceptable
- >5:1 = Excellent

---

## 5. RETENTION (Stickiness)

### Day 1 Retention (D1)
**Definition:** % of users active on Day 1 who return on Day 2
**Target:** 60%
**Calculation:**
- 100 users sign up on Day 1
- 60 return on Day 2 → 60% D1 retention
**Measurement:**
```
Cohort: users created on 2026-01-01
Event on 2026-01-01: sign_up
Event on 2026-01-02: any_app_open
```
**Optimization:** Onboarding + Day 1 push notification (kundli ready)

### Day 7 Retention (D7)
**Definition:** % active Day 1 cohort still active Day 7
**Target:** 35%
**Calculation:**
- 100 Day 1 signups
- 35 return within Day 7 window → 35% D7 retention
**Measurement:** GA4 Cohort Analysis → 7-day retention
**Optimization:** Habit loop (daily horoscope push)

### Day 30 Retention (D30)
**Definition:** % active Day 1 cohort still active Day 30
**Target:** 15%
**Calculation:**
- 100 Day 1 signups
- 15 active within Day 30 → 15% D30 retention
**Measurement:** GA4 Cohort Analysis
**Optimization:** Weekly digest + win-back campaigns

### Churn Rate (7-Day Inactivity)
**Definition:** % of WAU who become inactive (no activity for 7 days)
**Target:** <10% per week
**Calculation:**
- Week of 2026-03-01 to 2026-03-07: 1,000 WAU
- Not active 2026-03-08 to 2026-03-14: 80 users churned
- Churn rate: 8%
**Measurement:** Date-based cohort (last_activity_date < 7 days ago)

### Reactivation Rate
**Definition:** % of churned users (7+ days inactive) who return
**Target:** 15%
**Trigger:** Win-back email at Day 14 inactivity
**Measurement:** Email open rate + app re-open within 3 days of email

### Lapsed User Recovery
**Definition:** Users with 0 activity for 30+ days
**Target:** Re-engage 10% of lapsed users/month
**Campaign:**
- Email: "We miss you—here's 30% off any report"
- In-app: "Your cosmic forecast has shifted—see what's new"
**Measurement:** Tracked via UTM (utm_campaign=reactivation_30day)

---

## 6. TRUST & SUPPORT

### Support Ticket Volume
**Definition:** Number of support requests received per month
**Target:** <50 tickets / 5,000 MAU (1% support rate)
**Measurement:** Ticket system (Zendesk/email count)
**Categories:**
- Technical issues (30%): OTP, kundli not loading
- Billing issues (40%): Payment failed, refund request
- General Q (20%): How accurate? How does this work?
- Feedback (10%): Feature suggestions

### Average Support Resolution Time
**Definition:** Mean time from support request → resolution
**Target:** <24 hours for 80% of tickets
**Measurement:** Ticket timestamp - resolution timestamp
**SLA targets:**
- Critical (payment failed): <1 hour
- High (kundli broken): <4 hours
- Medium (billing question): <24 hours
- Low (feedback): <48 hours

### Support Satisfaction (CSAT)
**Definition:** % of users rating support interaction 4/5 or 5/5
**Target:** 85%+
**Measurement:** Post-resolution survey (email: "Was this helpful? 👍👎")
**Optimization:** Track low ratings + improve response templates

### Refund Rate
**Definition:** # of refunds processed / # of total purchases
**Target:** <3%
**Calculation:**
- Month 1: 150 orders, 3 refunds requested, 2 approved → 1.3% refund rate
**Measurement:** Database: (refunds_approved) / (total_orders)
**Health check:**
- >5% = Product quality issue or false expectations (fix paywall copy)
- 1-3% = Normal (acceptable)
- <1% = Users highly satisfied

### Chargeback Rate
**Definition:** # of chargebacks / # of total transactions
**Target:** <0.5%
**Measurement:** Razorpay dashboard → Disputes
**Prevention:**
- Clear product description
- No misleading claims
- Easy refund process (reduces chargebacks)

---

## 7. BRAND & VIRAL METRICS

### Share Rate (Compatibility Reports)
**Definition:** # of report shares (via ShareCard) / # of reports generated
**Target:** 15%
**Calculation:**
- 100 compatibility reports generated
- 15 clicked "Share" → 15% share rate
**Measurement:** Event: report_shared (social_platform: whatsapp, instagram, copy_link)
**Optimization:** ShareCard copy + native share (iOS/Android)

### Viral Coefficient
**Definition:** # of signups from shared reports / # of reports shared
**Target:** 0.25 (1 shared report generates 0.25 new signups)
**Calculation:**
- 150 reports shared in Month 1
- Tracking link shows 40 new signups → coefficient = 40/150 = 0.27
**Measurement:** UTM tracking (utm_source=shared_report)
**Health benchmark:**
- <0.1 = Low viral potential
- 0.1-0.25 = Moderate (sustainable)
- >0.25 = High (fast growth)

### Net Promoter Score (NPS)
**Definition:** "How likely are you to recommend GrahAI?" (0-10 scale)
**Target:** 50+
**Calculation:** (Promoters 9-10) - (Detractors 0-6) / (Total respondents) × 100
**Measurement:** In-app or email survey (quarterly)
**Sample sizes:** 30+ responses for statistical significance

### App Store Rating
**Definition:** Average rating on iOS App Store + Google Play
**Target:** 4.5+ stars (>1000 reviews)
**Measurement:** App Store Connect, Google Play Console
**Optimization:**
- Prompt happy users to rate (after Day 7)
- Respond to 1-star reviews (address concerns)

---

## Dashboard & Reporting Schedule

### Real-Time Dashboard (Daily Check)
- DAU, horoscope views, purchase count
- Revenue (daily MRR run-rate)
- Active support tickets
- App crash rate (if applicable)

### Weekly Report (Every Monday)
- DAU/WAU/MAU trends
- Conversion funnel (signup → onboarding → first horoscope → paywall → purchase)
- Top-performing reports (by purchase count)
- Support ticket summary
- Refund requests (any patterns?)

### Monthly Report (End of Month)
- Cohort analysis (D1/D7/D30 retention by signup date)
- LTV:CAC analysis
- Repeat purchase cohorts
- Revenue breakdown (by report type)
- Churn analysis + reactivation results
- Roadmap impact (what drove the metrics?)

### Quarterly Review (Every 3 Months)
- KPI progress vs. targets
- Pricing effectiveness (AOV, conversion rate)
- Market size estimate (TAM/SAM)
- Competitive analysis
- Strategic adjustments needed

---

## Instrumentation Status

Each KPI above is only useful if it's actually measured. This table tracks implementation status.

| KPI | Event/Source | Implemented | Owner | Review Frequency | Dashboard |
|-----|-------------|-------------|-------|-----------------|-----------|
| Monthly Visitors | GA4 page_view | NO — GA4 not yet configured | Harendra | Weekly | GA4 |
| Signup Rate | GA4 sign_up event | NO — event not firing | Harendra | Weekly | GA4 |
| Onboarding Completion | GA4 funnel events | NO — events not firing | Harendra | Weekly | GA4 |
| DAU/WAU/MAU | GA4 active users | NO — GA4 not yet configured | Harendra | Weekly | GA4 |
| Streak Completion | /api/gamification/stats | YES — endpoint exists | Harendra | Weekly | Custom |
| Report Uniqueness | npx tsx test-uniqueness.ts | YES — test suite exists | Harendra | Per-change | CLI |
| Payment Conversion | paywall_shown → purchase_completed | NO — events not firing | Harendra | Weekly | GA4 |
| AOV | DB: SUM(amount)/COUNT(orders) | PARTIAL — Razorpay dashboard only | Harendra | Monthly | Razorpay |
| Refund Rate | DB: refunds/total_orders | NO — no refund tracking | Harendra | Monthly | Custom |
| Support Tickets | Email count | NO — no ticket system | Harendra | Weekly | Email |
| Push CTR | push_sent → push_clicked | NO — events not firing | Harendra | Weekly | GA4 |
| Share Rate | report_shared event | NO — event not firing | Harendra | Monthly | GA4 |

**Priority:** Set up GA4 property + fire core events (sign_up, page_view, purchase_completed, report_shared). This unblocks 80% of KPI tracking.

**Risk:** Over-documenting KPIs without implementing measurement makes this a strategy file, not an operating file. Each entry above must move from "NO" to "YES" to be useful.

---

## Alert Thresholds (Red Flags)

| Metric | Alert Level | Action |
|---|---|---|
| D7 Retention | <25% | Review onboarding UX + habit loop |
| Conversion Rate | <6% | Audit paywall copy + pricing |
| Refund Rate | >5% | Quality review + false expectations check |
| DAU/MAU | <20% | Engagement issue—boost push notifications |
| AOV | <₹350 | Users buying cheap reports—upsell premium |
| Support CSAT | <70% | Response templates need improvement |
| Chargeback Rate | >1% | Product misalignment with expectations |
| Support tickets | >5% of MAU | Scalability issue—need self-service docs |

