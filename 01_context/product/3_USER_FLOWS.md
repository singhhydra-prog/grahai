# GrahAI User Flows & State Transitions

## Flow 1: First-Time User Journey (Acquisition → Activation)

```
Landing Page (/)
  ↓
  [CTA: "Get Your Kundli"]
  ↓
Login Page (/auth/login)
  ├─ State: Phone input ready
  ├─ Input: Phone number
  ├─ Action: Submit → /api/auth/otp
  └─ State change: "OTP Sent"
  ↓
  [User receives OTP via SMS]
  ↓
  ├─ State: OTP input ready
  ├─ Input: 6-digit OTP
  ├─ Action: Verify → /auth/callback (Supabase exchange)
  └─ State change: "Authenticated"
  ↓
Auth Callback (/auth/callback)
  ├─ Backend: Exchange OTP for JWT
  ├─ Store: Session token
  └─ Redirect: → OnboardingFlow
  ↓
Onboarding Flow (Component: OnboardingFlow)
  ├─ Step 1: Welcome message
  ├─ Step 2: Birth date input (date picker)
  ├─ Step 3: Birth time input (if known) OR "Unknown"
  ├─ Step 4: Birth location (LocationSearch component)
  │   └─ Action: Geocoding to lat/lng
  ├─ Step 5: Confirm + Calculate kundli
  │   └─ Action: POST /api/reports/generate-typed
  │   └─ State: "Calculating..."
  └─ Step 6: Display kundli (KundliChart)
  ↓
App Main Page (/app - MainApp)
  ├─ Initial Tab: HomeTab
  ├─ Display: Daily horoscope
  ├─ Gamification: +50 XP for onboarding completion
  ├─ CTAs: "Explore Reports" (PricingOverlay), "Ask a Question"
  └─ Free tier features unlocked:
      ├─ Daily horoscope (1x/day)
      ├─ Basic kundli view (MyChartTab)
      ├─ 1 free question/month (AskTab)
      └─ Compatibility matching (CompatibilityTab - limited)
  ↓
State: "Free User - Onboarded"
```

**KPIs Tracked:** Signup → OTP completion rate, onboarding completion %, first kundli generation time

---

## Flow 2: First Report Purchase (Monetization Entry)

```
HomeTab (/app)
  ├─ User sees: "Marriage Timeline (₹299)"
  ├─ Sees: "See when your marriage window opens"
  └─ Action: Click "View Report"
  ↓
PricingOverlay / PaywallBanner (Modal)
  ├─ Display: Report preview (teaser)
  ├─ Price: ₹299
  ├─ Show: Report highlights
  ├─ CTA: "Unlock Report"
  └─ Action: Click → Razorpay payment
  ↓
Payment Creation
  ├─ Action: POST /api/payment/create-order
  ├─ Payload: { userId, reportType: "marriage-timing", price: 299 }
  ├─ Razorpay: Returns order_id
  └─ State: "Payment initiated"
  ↓
Razorpay Payment Modal
  ├─ User enters: Card/UPI/NetBanking
  ├─ Razorpay handles: PCI compliance
  └─ Callback: Success/Failed
  ↓
Payment Verification
  ├─ Razorpay webhook: POST /api/payment/verify
  ├─ Backend: Validate payment signature
  ├─ Database: Record purchase (order_id, userId, reportType)
  ├─ Action: POST /api/reports/generate (async report generation)
  └─ State: "Payment verified, report generating"
  ↓
PurchaseSuccess Component
  ├─ Display: "Payment successful!"
  ├─ Show: Order details
  ├─ CTA: "View Your Report"
  └─ Action: Redirect → /report/:reportId
  ↓
Report Detail Page (/report/:reportId)
  ├─ Display: Full report (no paywall)
  ├─ Actions available:
  │  ├─ Share (ShareCard component)
  │  ├─ Save to library (/library)
  │  ├─ Rate reading (POST /api/gamification/rate-reading) → +25 XP
  │  └─ Mark complete (POST /api/gamification/complete-reading) → +10 XP
  └─ SourceDrawer: Show data sources (vedic references)
  ↓
State: "Paid User, First purchaser"
```

**KPIs Tracked:** Paywall view → purchase conversion %, average order value (AOV), time-to-purchase, failed payment rate

---

## Flow 3: Daily Horoscope Habit Loop (Retention Driver)

```
Returning User Opens App
  ├─ State: Authenticated, morning
  └─ Engagement status: "Streaky" or "Lapsed"
  ↓
HomeTab (Daily horoscope feed)
  ├─ Display: New daily horoscope for their sign
  ├─ Feature: StreakBadge (showing day count: "Day 23 streak")
  ├─ XP reward: Pending (10 XP for viewing)
  └─ CTA: "Read more → /daily"
  ↓
/daily Page (DailyInsightPage)
  ├─ Full daily horoscope
  ├─ Streak counter: "23 days"
  ├─ Milestone badge: "🔥 7-day streak unlocked!" at day 7
  ├─ Action: POST /api/gamification/award-xp (10 XP)
  └─ Next insight at: Tomorrow (same time)
  ↓
Push Notification (Cron job: POST /api/cron/daily-push)
  ├─ Scheduled: 6:00 AM (user preference)
  ├─ Content: "Your daily horoscope is ready, 📈 23-day streak!"
  ├─ Link: Opens /daily
  ├─ Delivery: Via /api/push/subscribe (Firebase/OneSignal)
  └─ Frequency: Daily if opted in
  ↓
State: "Regular DAU"

Weekly Bonus Flow:
  Weekly insight email (POST /api/cron/weekly-push)
  ├─ Sent: Every Sunday
  ├─ Content: 7-day forecast summary
  ├─ XP: 25 XP for opening (tracked via /api/gamification/stats)
  ↓
Monthly Engagement Summary:
  POST /api/cron/monthly-push
  ├─ Content: "You had 28 horoscope readings this month!"
  ├─ Incentive: "Get 30% off marriage timeline report"
  └─ Drives: Upsell to paid reports
```

**KPIs Tracked:** DAU (daily active users), streak completion %, push notification CTR, lapsed user reactivation

---

## Flow 4: Compatibility Check (Social Feature)

```
CompatibilityTab (/app)
  ├─ State: Date input empty
  ├─ Form: "Their Birth Date" input
  ├─ Action: Click "Check Compatibility"
  └─ State: "Waiting for their chart"
  ↓
Second Chart Entry
  ├─ Input: Partner's birth date/time/location
  ├─ Feature: LocationSearch for partner's birthplace
  └─ Action: Submit
  ↓
Compatibility Calculation
  ├─ Action: POST /api/reports/generate ({ type: "kundli-match" })
  ├─ Processing: AI generates match report
  └─ State: "Report generating..."
  ↓
Result Display
  ├─ Free tier: Quick match score (0-100)
  ├─ Paywall: Full compatibility breakdown (₹199)
  ├─ Show: PricingOverlay modal
  ├─ CTA: "Unlock Full Report"
  └─ Fallback: "See basic compatibility without purchasing"
  ↓
Share Flow (if matched)
  ├─ Action: Click "Share"
  ├─ Component: ShareCard
  ├─ Options: WhatsApp, Instagram, Link copy
  ├─ Shared link: Reports back with match score preview
  └─ Social acquisition: Partner sees GrahAI, may sign up
```

**KPIs Tracked:** Compatibility checks/DAU, share rate, viral coefficient (shares → new signups)

---

## Flow 5: Billing & Subscription Management

```
ProfileTab → /billing CTA
  ↓
/billing (BillingHistoryPage)
  ├─ Display: Order history table
  ├─ Columns: Order ID, Report Type, Price, Date, Status
  ├─ Filters: By date range, report type
  ├─ Example row:
  │  ├─ Order: RZP_0123
  │  ├─ Report: Career Blueprint
  │  ├─ Price: ₹499
  │  ├─ Date: 2026-03-10
  │  └─ Status: "Delivered"
  └─ CTA: "Buy another report"
  ↓
Reorder Flow
  ├─ User clicks "Buy another report"
  ├─ Redirects: HomeTab with report suggestions
  └─ Repeat: Flow 2 (purchase)
  ↓
Future: Subscription Model
  ├─ Option: Monthly plan (₹399/mo for unlimited reports)
  ├─ Option: Annual plan (₹3,999/yr)
  └─ Display: Current usage vs. plan limits
```

**KPIs Tracked:** Repeat purchase rate, customer lifetime value (CLV), revenue retention

---

## Flow 6: Support & Refund

```
Support (/support page)
  ├─ Form: Subject, message, attachments
  ├─ Action: POST /api/contact
  └─ Confirmation: Email receipt
  ↓
Refund Request
  ├─ User initiates via support
  ├─ Backend: Flag in admin dashboard
  ├─ Razorpay API: Process refund (reverse transaction)
  ├─ Timeline: Per /refund-policy (max 7 days)
  └─ Email: Refund confirmation
  ↓
Admin Review (/admin/dashboard)
  ├─ Display: Pending refunds
  ├─ Action: Approve/Reject
  ├─ KPI: Refund rate tracking
  └─ Alert: If >5% refund rate this month
```

**KPIs Tracked:** Support ticket volume, resolution time, refund rate, CSAT (if survey)

---

## Flow 7: Admin Oversight

```
/admin/dashboard
  ├─ Metrics displayed:
  │  ├─ DAU, MAU, signup rate
  │  ├─ Revenue (daily, weekly, monthly)
  │  ├─ Top reports (by sales count)
  │  ├─ Refund rate (flag if >5%)
  │  ├─ Stripe/Razorpay status
  │  ├─ Error tracking (failed reports, payment failures)
  │  └─ User support tickets (unresolved count)
  ├─ Actions:
  │  ├─ Approve refunds
  │  ├─ Mark reports as "featured"
  │  └─ View live analytics
  └─ API endpoints: /api/admin/* (TBD - need auth validation)
```

---

## Key State Machine Summary

| State | Triggered By | Actions Available | Next States |
|---|---|---|---|
| **Visitor** | Landing page | Signup (→Login), Read legal pages | Free User |
| **Free User** | Onboarding complete | View horoscope, Ask 1 Q/mo, Basic kundli | Paid User |
| **Paid User** | First purchase | View reports, Share, Rate, Reorder | Paid User, Lapsed |
| **Lapsed** | 7+ days no activity | Reactivation email, Discount CTA | Regular DAU |
| **Regular DAU** | Daily horoscope open | Streak bonus, Weekly summary, Report upsells | Regular DAU, Churn |
| **Admin** | Role flag in DB | Dashboard access, Refund approvals, Analytics | Admin |

---

## Critical Transition Points

1. **Auth → Onboarding:** Must complete within 5 mins (track dropout)
2. **Onboarding → Free features:** Automatic; track first horoscope view time
3. **Free → Paywall:** PricingOverlay triggers on 2nd+ report view (conversion rate KPI)
4. **Payment → Report delivery:** <5 min report generation time (target)
5. **Weekly engagement:** Email/push click → daily app open (habit loop)
6. **Churn reactivation:** 14-day lapse → win-back email with 20% discount
