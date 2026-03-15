# GrahAI Trust Pages Audit & Improvement Plan

## Executive Summary

Current status: 6/6 trust pages exist but need audit for Indian e-commerce compliance, astrology-specific disclaimers, and trust signals. **Priority: Disclaimer and Refund Policy (legal risk)**

---

## 1. DISCLAIMER PAGE (/disclaimer)

### Current State
Status: ✓ Exists | Component: DisclaimerPage | Mobile: ✓

### What It Should Contain (Critical for Astrology)

**Section 1: Astrology is Not Medical/Financial Advice**
```
"GrahAI provides astrological guidance for self-reflection and planning
purposes only. Astrology is not a substitute for professional medical,
financial, legal, or psychological advice.

For important life decisions—marriage, career change, financial investment,
health matters—always consult qualified professionals (doctor, lawyer,
financial advisor, therapist)."
```

**Section 2: No Guarantees or Predictions**
```
"Vedic astrology is a traditional wisdom system, not a predictive science.
GrahAI does not guarantee any outcomes or predict the future with certainty.
Your free will and actions are the ultimate determinants of your life path."
```

**Section 3: Birth Time Accuracy**
```
"Report accuracy depends on the precision of your birth time. If you don't
know your exact birth time:
• GrahAI offers 'uncertain time' calculations
• Margin of error: ±4 hours in planetary positions possible
• Consider rectification consultations with a Vedic astrologer"
```

**Section 4: No Liability for Decisions**
```
"GrahAI is not responsible for any decisions made based on our reports or
guidance. You use this service at your own risk and discretion."
```

**Section 5: Limitation of Liability**
```
"To the fullest extent permitted by law, GrahAI's liability for any damages
arising from your use of this service shall not exceed the amount you paid
for the report (if any)."
```

### Audit Checklist
- [ ] Explicitly states astrology ≠ medical/financial advice
- [ ] Clear "no guarantees" on outcomes
- [ ] Birth time accuracy disclaimer included
- [ ] Links to Terms, Privacy, Refund Policy
- [ ] Language clear to non-astrology users
- [ ] Updated within last 6 months
- [ ] Linked from checkout (PurchaseSuccess)
- [ ] Linked from payment flow (Razorpay modal footnote)

### Action Items
1. **HIGH PRIORITY:** Audit current disclaimer against above checklist
2. Add "Vedic Astrology Is Not Predictive Science" header
3. Add birth time accuracy section
4. Link from /billing, /report pages (legal footer)
5. Have lawyer review for Indian Consumer Protection Act (2019) compliance

---

## 2. PRIVACY POLICY PAGE (/privacy-policy)

### Current State
Status: ✓ Exists | Component: PrivacyPolicyPage | Mobile: ✓

### What It Should Contain (GDPR + India-Specific)

**Indian Compliance Additions:**
```
Section: Data Localization
"As per India's Information Technology Rules (2011), we store personal
data on servers located within India or with adequate security safeguards."

Section: Withdrawal of Consent
"You may withdraw consent to process your data at any time by emailing
privacy@grahai.app. We will delete your data within 30 days, except where
required to retain for legal/payment purposes."

Section: Data Retention
"Birth chart data: Retained indefinitely (user's choice for future readings)
Payment data: Retained 7 years (statutory tax requirement)
Cookies: Cleared on logout or 30-day inactivity"
```

**Astrology-Specific Section:**
```
Section: Birth Chart Data
"Your birth date, time, and location are sensitive personal information.
GrahAI:
• Never sells or shares this data with third parties
• Uses it only to generate your personalized reports
• Encrypts it in transit and at rest
• You can request deletion at any time (reports deleted, data anonymized)"
```

### Audit Checklist
- [ ] Lists all data collected (birth date/time/location, email, payment info)
- [ ] Explains use case for each data point
- [ ] States data retention periods
- [ ] Mentions encryption/security measures
- [ ] Links to cookie policy (if used)
- [ ] Includes data deletion request process
- [ ] References Supabase (auth provider) privacy terms
- [ ] Mentions Razorpay PCI compliance (payment handler)
- [ ] Indian data localization clause present
- [ ] GDPR mention (if targeting EU)
- [ ] Last updated date shown

### Action Items
1. Add "Data Localization" section (India requirement)
2. Add "Withdrawal of Consent" process with contact email
3. Audit data retention periods against legal requirements
4. Link from footer + login page
5. Have lawyer review for Information Technology Act (2000) + Rules (2011)

---

## 3. TERMS OF SERVICE PAGE (/terms)

### Current State
Status: ✓ Exists | Component: TermsPage | Mobile: ✓

### What It Should Contain (SaaS + Astrology)

**Key Sections:**
```
1. Acceptance of Terms
   → Using the site means you accept these terms

2. Services Description
   → GrahAI provides astrological reports for personal use
   → Reports are digital deliverables, non-refundable after delivery
      (except as per refund policy)

3. User Responsibilities
   → You must provide accurate birth information
   → You are responsible for keeping login credentials confidential
   → You agree not to misrepresent yourself

4. Intellectual Property
   → Report content ©GrahAI. You may view/share but not republish.
   → You may not reverse-engineer calculations or extract data for
      commercial use.

5. Limitation of Liability
   → GrahAI is provided "as is" without warranties
   → We are not liable for indirect/consequential damages

6. Dispute Resolution
   → Disputes shall be resolved under Indian law (specify state: Delhi/Mumbai)
   → Arbitration preferred; jurisdiction: [City] courts

7. Termination
   → GrahAI can terminate service for violation of terms
   → User can terminate by deleting account (data retained per privacy policy)
```

### Audit Checklist
- [ ] Astrology-specific language (not generic SaaS)
- [ ] Links to Disclaimer and Refund Policy
- [ ] Mentions Razorpay as payment processor (liability)
- [ ] Prohibits commercial scraping/API misuse
- [ ] States digital goods are non-refundable (except as noted)
- [ ] Includes jurisdiction clause (Indian law)
- [ ] Last updated date shown
- [ ] Clear language (avoid dense legal jargon)

### Action Items
1. Add specific "Astrology Services" section
2. Add IP/content usage restrictions
3. Add Razorpay liability clause
4. Specify dispute jurisdiction (Delhi court preferred for all-India service)
5. Have lawyer review for e-commerce compliance

---

## 4. REFUND POLICY PAGE (/refund-policy)

### Current State
Status: ✓ Exists | Component: RefundPolicyPage | Mobile: ✓
**FLAG: Critical—must align with Razorpay + Indian Consumer Protection Act**

### What It Should Contain

**Clear Refund Windows & Process:**
```
Refund Eligibility:
• 7 days from purchase date: Full refund if report not viewed
• After viewing report: No refund (digital good delivered)
• Exception: Technical failure (report unreadable, generation error)
  → Full refund within 7 days of report delivery

Refund Process:
1. Email support@grahai.app with order ID
2. Provide reason (optional, but helps us improve)
3. We verify delivery status & process refund
4. Razorpay processes refund to original payment method
5. Refund timeline: 3-5 business days to bank/wallet

Partial Refunds:
• 50% refund if report viewed but found unsuitable
• Valid only within 48 hours of purchase
• Requires support ticket explaining reason

Non-Refundable Scenarios:
• Report viewed in full
• Subscription plans (if launched) - different terms
• Refund requested after 7 days (statute barred)
```

**Indian Consumer Law Compliance:**
```
Important Note (Consumer Protection Act, 2019):
"Under the Consumer Protection Act, you have the right to lodge a complaint
with a consumer authority if unsatisfied. GrahAI resolves issues within
30 days; if unresolved, you may escalate to:
• District Consumer Disputes Commission
• State Consumer Disputes Commission
• National Consumer Disputes Commission

Complaint contact: grievances@grahai.app"
```

### Audit Checklist
- [ ] 7-day refund window clearly stated
- [ ] "View" definition clarified (full view = no refund)
- [ ] Technical failure exception included
- [ ] Refund method stated (original payment method)
- [ ] Refund timeline (3-5 business days)
- [ ] Links to CPA 2019 compliance note
- [ ] Support contact email visible
- [ ] Razorpay refund policy aligned
- [ ] Order ID provided in all receipts (for refund requests)
- [ ] No promise of instant refunds (manage expectations)

### Action Items
1. **URGENT:** Verify current policy matches Razorpay refund terms
2. Add "Report not viewed" verification logic (track /report/:id first visit)
3. Add Consumer Protection Act (2019) compliance note
4. Create refund request form in support flow
5. Set up admin dashboard flag for "pending refunds"
6. Have lawyer review for CPA 2019 + Razorpay alignment

---

## 5. FAQ PAGE (/faq)

### Current State
Status: ✓ Exists | Component: FAQPage | Mobile: ✓
**FLAG: Content may be thin; needs astrology-specific FAQs**

### What It Should Contain

**Astrology-Specific FAQs:**

Q: How accurate is Vedic astrology?
A: Vedic astrology is a traditional wisdom system, not a predictive science.
   Accuracy depends on birth time precision and the astrologer's skill.
   GrahAI uses precise calculations but recommends consulting a Vedic
   astrologer for life-changing decisions.

Q: What if I don't know my exact birth time?
A: GrahAI offers calculations for uncertain birth times (±4 hour margin).
   For accuracy, consult a Vedic astrologer for "chart rectification."

Q: Can I use GrahAI for medical/financial decisions?
A: No. Astrology complements professional advice but never replaces it.
   Always consult doctors, lawyers, financial advisors for major decisions.

Q: Are my reports accessible forever?
A: Yes. All purchased reports are available in your library indefinitely.
   If you delete your account, reports are archived (email us for recovery).

Q: Can I share my report with others?
A: Yes. Use the Share button to send via WhatsApp, Instagram, or link.
   Recipients see report preview but need a purchase to view full details.

**Payment/Refund FAQs:**

Q: Which payment methods do you accept?
A: Razorpay processes all payments: UPI (PhonePe, Google Pay, BHIM),
   Cards (Visa/Mastercard/Amex), NetBanking, Wallet. GST included in pricing.

Q: What happens if my payment fails?
A: Check your payment method, then retry. Your report will be ready
   immediately upon successful payment. No hidden charges.

Q: Can I get a refund?
A: Yes. Full refund within 7 days if report not viewed. After viewing,
   see our refund policy for partial refund eligibility. Email support.

Q: Is my payment data safe?
A: Razorpay is PCI-DSS certified and handles all payment security.
   GrahAI never sees your card details.

**Technical FAQs:**

Q: Why is my report taking long to generate?
A: Most reports generate in <1 minute. If delayed (>5 min), try refreshing
   or contact support. Report generation uses AI + Vedic calculations.

Q: I can't see my kundli. What's wrong?
A: Clear browser cache, try a different browser, or update the app.
   For birth times near sunrise/sunset, try adjusting by ±30 minutes.

Q: How do I delete my account?
A: In Settings → Account → Delete Account. Your birth chart is permanently
   deleted; payment history retained for 7 years (tax requirement).

### Audit Checklist
- [ ] 15+ FAQs covering astrology, payment, technical, refund topics
- [ ] Search/filter functionality (searchable FAQs)
- [ ] Clear, non-technical language
- [ ] Links to detailed pages (Privacy, Disclaimer, Refund)
- [ ] Contact support CTA if FAQ doesn't answer
- [ ] Schema markup for SEO (FAQSchema)
- [ ] Updated within last 3 months
- [ ] Mobile-responsive (expandable Q&A)

### Action Items
1. Audit current FAQ for completeness
2. Add 5-10 astrology-specific Q&As above
3. Add Payment/Technical sections if missing
4. Implement search/filter if not present
5. Add "Didn't find your answer? Contact support" footer
6. Set up analytics to track FAQ view patterns (gap identification)

---

## 6. SUPPORT PAGE (/support)

### Current State
Status: ✓ Exists | Component: SupportPage | Mobile: ✓
**FLAG: Verify form submission working (POST /api/contact)**

### What It Should Contain

**Support Categories:**
```
I'm having a technical issue
→ Kundli not loading, report download failed, login OTP issues, etc.

I have a billing/payment question
→ Payment failed, refund request, invoice, subscription, etc.

I'd like to provide feedback
→ Feature suggestions, report quality, UX feedback

I have a general question about astrology/GrahAI
→ How accurate is this? How do dashas work? etc.
```

**Contact Options:**
```
1. Submit form (recommended): support@grahai.app
   → Tracked in support ticket system
   → Expected response: 24-48 hours

2. Email directly: support@grahai.app
   → For urgent issues, mention [URGENT] in subject

3. WhatsApp (optional if set up): [Link to WhatsApp Business]
   → Faster for simple questions

4. Escalation: grievances@grahai.app (for unresolved issues > 30 days)
   → Triggers management review
```

**Form Fields:**
```
- Email (auto-filled if logged in)
- Subject (required)
- Category (dropdown: Technical / Billing / Feedback / General)
- Message (required, min 20 chars)
- Attachments (screenshot, invoice, etc.)
- Order ID (optional, auto-fill if from report page)
- Preferred response method (email / WhatsApp)
```

**Support Tone Example:**
```
"Hi [Name],

Thank you for contacting GrahAI. We received your request about [subject].

[2-3 sentence solution or next steps]

If you have further questions, feel free to reply to this email.

Best,
GrahAI Support Team
support@grahai.app
"
```

### Audit Checklist
- [ ] Form submission working (test /api/contact endpoint)
- [ ] Support email visible + monitored
- [ ] 24-48 hour SLA stated
- [ ] Support categories clear
- [ ] Mobile-friendly form
- [ ] Error messages helpful (not technical)
- [ ] Confirmation email sent upon form submission
- [ ] Support ticket number provided to user
- [ ] Escalation process documented
- [ ] CTA links to from error pages, /report pages, /billing

### Action Items
1. Test form submission + email delivery (no spam folder)
2. Set up support ticket system (Zendesk, Freshdesk, or simple email)
3. Create SLA response times (24-48h first response, <7 days resolution)
4. Add "Order ID" auto-population for in-app support links
5. Add WhatsApp business link if set up
6. Audit response templates (consistency, tone, helpfulness)

---

## Trust Signals Implementation Checklist

**On Payment/Checkout Pages:**
- [ ] "Razorpay Verified Merchant" badge visible
- [ ] "SSL Encrypted" lock icon present
- [ ] "Money-back guarantee within 7 days" statement
- [ ] Link to privacy policy, disclaimer, refund policy
- [ ] Support email footer

**On Report/Library Pages:**
- [ ] Disclaimer link ("This is not financial/medical advice")
- [ ] Share button with social proof (e.g., "1000+ shares this week")
- [ ] "Delete anytime" for account/data control

**In Footer (All Pages):**
- [ ] Privacy Policy link
- [ ] Terms of Service link
- [ ] Disclaimer link
- [ ] Refund Policy link
- [ ] Contact/Support link
- [ ] Address (if required by Indian law)
- [ ] Copyright year

**In Header/Navigation:**
- [ ] Support link visible
- [ ] FAQ link visible (mobile: in menu)

---

## Live Deployment Status

Specs exist in `03_docs/legal/`. This section tracks whether each page is **actually live and linked**.

| Page | Route | Component | Content vs Spec | In Profile | In Footer | In Checkout | Lawyer |
|------|-------|-----------|----------------|-----------|----------|------------|--------|
| Disclaimer | `/disclaimer` | DisclaimerPage.tsx | PARTIAL — missing birth-time accuracy + no-guarantee sections | YES | NO — no footer exists | NO | NO |
| Privacy | `/privacy-policy` | PrivacyPolicyPage.tsx | NEEDS AUDIT vs privacy-spec.md | YES | NO | N/A | NO |
| Terms | `/terms` | TermsPage.tsx | NEEDS AUDIT vs terms-spec.md | YES | NO | N/A | NO |
| Refund | `/refund-policy` | RefundPolicyPage.tsx | NEEDS AUDIT vs refund-spec.md | YES | NO | NO | NO |
| FAQ | `/faq` | FAQPage.tsx | PARTIAL — has 5 sections, missing payment Q&As | NO | NO | N/A | N/A |
| Support | `/support` | SupportPage.tsx | NEEDS AUDIT vs support-spec.md | NO | NO | N/A | N/A |

### Critical Gaps Found (Code Audit 2026-03-15)
1. **No global footer component** — Legal links only in ProfileTab → Legal section. Not on public pages, checkout, or non-tab views.
2. **Checkout has no legal links** — PricingOverlay (339 lines) and PurchaseSuccess (194 lines) have zero links to disclaimer/refund/terms.
3. **FAQ + Support not in ProfileTab** — Only 4 of 6 legal pages linked there (Disclaimer, Terms, Privacy, Refund).
4. **No GA4 installed** — Zero analytics instrumentation in the codebase. layout.tsx only loads Razorpay script.
5. **Root `/` redirects to `/app`** — No landing page for unauthenticated visitors.

### Priority Actions
1. **Create global footer** with all 6 legal links → add to layout.tsx or app shell
2. **Add legal links to checkout** — disclaimer + refund in PricingOverlay, terms in PurchaseSuccess
3. **Add FAQ + Support to ProfileTab** Legal section
4. **Install GA4** — add gtag to layout.tsx, fire core events
5. **Audit each page's content** against its spec in `03_docs/legal/`
6. **Run `legal-publishing.md` checklist** on each page after fixes

**Publishing is not the same as spec completeness.** Until every column above says "YES", the trust layer is incomplete.

---

## Compliance Audit Timeline

**Week 1:**
- Disclaimer: Lawyer review + updates
- Refund Policy: Razorpay alignment + Indian CPA compliance

**Week 2:**
- Privacy Policy: Data localization + consent withdrawal process
- Terms of Service: Dispute resolution + astrology specifics

**Week 3:**
- FAQ: Content expansion (15+ items)
- Support: Form testing + SLA setup

**Week 4:**
- All pages: Footer links + legal polish
- Trust signals: Badge/icon placement verification
- Final legal review with compliance attorney

---

## Risk Mitigation by Page

| Page | Risk | Mitigation |
|---|---|---|
| Disclaimer | Liability for bad decisions | Clear "not advice" language + link from checkout |
| Privacy | Data breach / privacy violation | Encryption + retention policy + data deletion option |
| Refund Policy | Chargeback disputes / poor refund flow | Clear 7-day window + manual review process |
| Terms | Dispute escalation / service termination | Jurisdiction clause + fair termination policy |
| FAQ | User confusion / low satisfaction | Search feature + astrology education + support link |
| Support | Unresolved complaints | SLA targets + escalation to grievances email |
