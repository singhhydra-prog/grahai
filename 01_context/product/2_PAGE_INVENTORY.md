# GrahAI Page Inventory

## Complete Page Checklist

### PUBLIC PAGES

#### / (Landing Page)
- **Component:** LandingPage
- **Auth Required:** No
- **States:** Empty (default), CTAs visible
- **Mobile Responsive:** Yes (BottomNav on mobile)
- **SEO:** Title/description needed, OG tags for social
- **Design System Compliance:** CosmicBackground + SpaceParticles (✓)
- **Key Elements:** GrahAILogo, CTA to /auth/login
- **Status:** ✓ Implemented

#### /auth/login
- **Component:** LoginPage
- **Auth Required:** No
- **States:** Empty (form), Loading (OTP sent), Error (invalid OTP)
- **Mobile Responsive:** Yes (centered form)
- **SEO:** Noindex recommended
- **Design System Compliance:** ✓
- **Key Elements:** Phone input, OTP input, Error messages
- **Status:** ✓ Implemented

#### /privacy-policy
- **Component:** PrivacyPolicyPage
- **Auth Required:** No
- **States:** Default (scrollable legal document)
- **Mobile Responsive:** Yes
- **SEO:** Title, indexable for compliance
- **Design System Compliance:** Basic text styling
- **Status:** ✓ Implemented - **FLAG: Needs Indian GDPR alignment**

#### /terms
- **Component:** TermsPage
- **Auth Required:** No
- **States:** Default
- **Mobile Responsive:** Yes
- **SEO:** Indexable
- **Design System Compliance:** Basic text
- **Status:** ✓ Implemented - **FLAG: Needs SaaS T&C specifics**

#### /disclaimer
- **Component:** DisclaimerPage
- **Auth Required:** No
- **States:** Default
- **Mobile Responsive:** Yes
- **SEO:** Indexable
- **Design System Compliance:** Basic text
- **Status:** ✓ Implemented - **FLAG: Critical for astrology liability - audit required**

#### /faq
- **Component:** FAQPage
- **Auth Required:** No
- **States:** Expandable Q&A, search filter
- **Mobile Responsive:** Yes
- **SEO:** Schema markup (FAQSchema)
- **Design System Compliance:** ✓
- **Status:** ✓ Implemented - **FLAG: Content thin? Astrology-specific FAQs?**

#### /support
- **Component:** SupportPage
- **Auth Required:** No
- **States:** Form empty, Loading (submit), Success
- **Mobile Responsive:** Yes
- **SEO:** Title + description
- **Design System Compliance:** ✓
- **Key Elements:** /api/contact submission
- **Status:** ✓ Implemented

#### /refund-policy
- **Component:** RefundPolicyPage
- **Auth Required:** No
- **States:** Default
- **Mobile Responsive:** Yes
- **SEO:** Indexable
- **Design System Compliance:** Basic text
- **Status:** ✓ Implemented - **FLAG: Need Razorpay alignment, statutory time-limits**

---

### AUTHENTICATED PAGES (Tab Layout)

#### /app (MainApp with Tabs)
- **Component:** MainApp (5 tabs via BottomNav)
- **Auth Required:** Yes
- **Tab 1 - HomeTab:**
  - States: Loading (daily horoscope), Empty (first user), Loaded (horoscope + CTAs)
  - Key Elements: Daily horoscope summary, Report teasers (PricingOverlay/PaywallBanner)
  - Status: ✓ Implemented
- **Tab 2 - AskTab:**
  - States: Input ready, Loading (API /api/ask-one-question), Result displayed
  - Free tier: 1 free question monthly
  - Premium: Unlimited
  - Status: ✓ Implemented
- **Tab 3 - CompatibilityTab:**
  - States: Date input empty, Loading, Match result (PaywallBanner if premium)
  - Requires two birth charts
  - Status: ✓ Implemented
- **Tab 4 - MyChartTab:**
  - States: Loading (chart calc), Rendered (KundliChart component)
  - Shows: Birth details, planetary positions, houses
  - Status: ✓ Implemented
- **Tab 5 - ProfileTab:**
  - States: Loaded (user data), Settings, Logout
  - Shows: XP balance (gamification), subscription tier
  - Status: ✓ Implemented
- **Design System:** AppHeader + BottomNav (✓)
- **Mobile Responsive:** Yes (tab nav at bottom)

#### /daily
- **Component:** DailyInsightPage
- **Auth Required:** Yes
- **States:** Loading, Loaded (with StreakBadge), Empty (new user)
- **Engagement:** Streak counter, XP reward on open
- **Mobile Responsive:** Yes
- **SEO:** Noindex (user-specific)
- **Status:** ✓ Implemented - **FLAG: Verify streak logic**

#### /weekly
- **Component:** WeeklyGuidancePage
- **Auth Required:** Yes
- **States:** Loading, Loaded (7-day forecast)
- **Mobile Responsive:** Yes
- **SEO:** Noindex
- **Status:** ✓ Implemented - **FLAG: Content thin?**

#### /report/:reportId
- **Component:** ReportDetailPage
- **Auth Required:** Yes
- **States:** Loading, Locked (paywall), Unlocked (purchased), Error (not found)
- **Paywall Trigger:** PaywallBanner if not purchased
- **Actions:** Share (ShareCard), Save to library, Rate (gamification/rate-reading)
- **Mobile Responsive:** Yes
- **Design System:** Full cosmic theme (✓)
- **Status:** ✓ Implemented

#### /library
- **Component:** SavedLibraryPage
- **Auth Required:** Yes
- **States:** Empty (no purchases), Loaded (list of purchased reports), Loading
- **Sorting/Filtering:** By type, date, rating
- **Mobile Responsive:** Yes
- **Status:** ✓ Implemented

#### /billing
- **Component:** BillingHistoryPage
- **Auth Required:** Yes
- **States:** Loading, Loaded (Razorpay order history)
- **Display:** Order ID, report type, price, date, status
- **Mobile Responsive:** Yes
- **Status:** ✓ Implemented

#### /admin/dashboard
- **Component:** AdminDashboard
- **Auth Required:** Yes (admin role only)
- **States:** Loading, Loaded (KPI cards)
- **Data:** Revenue, user count, top reports, refund rate
- **Mobile Responsive:** Partial
- **Status:** Partial - **FLAG: Missing endpoints details, role validation**

---

## Component Audit

| Component | Used In | Responsive | Audit Status |
|---|---|---|---|
| AppHeader | All /app routes | Yes | ✓ |
| BottomNav | All /app routes | Yes | ✓ |
| CosmicBackground | Landing, modals | Yes | ✓ |
| KundliChart | /app/MyChartTab, /report | Yes | ✓ |
| LocationSearch | Login, onboarding | Yes | ✓ |
| PurchaseSuccess | /payment/callback | Yes | ✓ |
| ShareCard | /report details | Yes | Verify UX |
| SourceDrawer | Report modals | Yes | ✓ |
| SpaceParticles | Landing, /app | Yes (perf?) | ⚠ Heavy on mobile |
| SplineStar | Brand hero | Yes | ✓ |
| StreakBadge | /daily, HomeTab | Yes | ✓ |
| TierBadge | ProfileTab, paywalls | Yes | ✓ |
| GrahAILogo | NavBar, footer | Yes | ✓ |
| OnboardingFlow | First-time signup | Yes | Verify completion |
| PricingOverlay | Report teaser | Yes | Verify dismissal |
| PaywallBanner | Premium features | Yes | Verify accuracy |
| DailyInsightPage | /daily, /app | Yes | ✓ |
| WeeklyGuidancePage | /weekly | Yes | Content audit |
| ReportDetailPage | /report/:id | Yes | ✓ |
| SavedLibraryPage | /library | Yes | ✓ |
| BillingHistoryPage | /billing | Yes | ✓ |
| ReferralPage | ProfileTab? | ? | **Missing documentation** |

## Design System Compliance

- **Colors:** All pages using #0A0E1A, #D4A843, #E8E6F0? ⚠ Some legal pages need audit
- **Typography:** Cosmic font stack applied? Need verification
- **Spacing:** Design system units followed? Needs audit
- **Mobile-first:** Bottom nav layout yes, but verify tablet/desktop

## Thin/Stub Pages

- /faq - Content may be placeholder
- /weekly - Possible minimal implementation
- Admin dashboard - Partial feature set
- ReferralPage - Undocumented if exists

## High-Priority Audits

1. Disclaimer page (astrology liability critical)
2. Refund policy (Razorpay/Indian law alignment)
3. Privacy policy (GDPR + Indian data residency)
4. PaywallBanner accuracy (premium feature gating)
5. SpaceParticles performance on mobile
6. OnboardingFlow completion % tracking
