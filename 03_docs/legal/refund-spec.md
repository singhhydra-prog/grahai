# Refund Policy Specification — GrahAI

## Overview
Clear, customer-friendly refund policy for digital astrology reports. Balances fairness to users while recognizing the digital goods nature of reports. Processed via Razorpay. Policy must be transparent, enforceable, and compliant with Indian Consumer Protection Act, 2019.

## Refundable Conditions

### 1. Non-Delivery of Report
**Condition:** Report not generated or delivered within 48 hours of successful payment.

**Eligible Scenarios:**
- Payment processed but no report generated in system
- Report generated but delivery email never received (bounce, spam filter)
- Report URL inaccessible or broken for more than 24 hours after delivery

**Request Process:**
- Email `support@grahai.com` within 48 hours of purchase with order ID
- Provide screenshot of payment confirmation and any delivery attempts
- Support verifies non-delivery in database

**Timeline:** Refund issued within 5 business days of verification

**Exceptions (Not Refundable):**
- User email marked as spam/bounced; user responsible for checking spam folder
- Report generated and accessible; user didn't attempt download

---

### 2. Technical Failure (Service Error)
**Condition:** Report generation fails due to platform error (not user error).

**Eligible Scenarios:**
- Server error during report generation (500 error, timeout, crash)
- Birth data calculation error caused by system bug (not user input error)
- Payment charged but system error prevents report generation
- Database corruption or data loss affecting report

**Request Process:**
- Email `support@grahai.com` within 7 days of purchase with order ID
- Support team checks server logs and error tracking (Sentry logs)
- Verification determines if system error or user input error

**Timeline:** Refund issued within 5 business days of verification

**Exceptions (Not Refundable):**
- User input error (incorrect birth date, invalid location)
- User-triggered cancellation mid-generation
- Network issues on user's side (internet disconnect)

---

### 3. Duplicate/Erroneous Charges
**Condition:** User charged multiple times for single purchase or charged without authorization.

**Eligible Scenarios:**
- Accidentally charged twice for same report
- Charged for failed transaction (should not occur with Razorpay, but possible)
- Unauthorized transaction (fraudulent charge on account)

**Request Process:**
- Contact `support@grahai.com` with evidence (screenshot of duplicate charges)
- Support verifies with Razorpay transaction logs
- No waiting period; immediate refund processing

**Timeline:** Refund issued within 5-7 business days (Razorpay processing)

---

### 4. Payment Cancellation Request (Grace Period)
**Condition:** User requests cancellation within 24 hours of purchase; report not yet accessed.

**Eligible Scenarios:**
- User changes mind within 24 hours
- User doesn't want report after seeing preview
- Accidental purchase (misclick, wrong selection)

**Request Process:**
- Email `support@grahai.com` within 24 hours of purchase
- State reason for cancellation
- Verification: Check if report downloaded/viewed

**Timeline:** Refund issued within 2-3 business days if report not accessed

**Exceptions (Not Refundable After 24 Hours):**
- Request after 24 hours
- Report already downloaded and viewed
- User simply changed mind after viewing report

---

## Non-Refundable Conditions

### 1. Report Downloaded & Viewed
**Policy:** Once user downloads and accesses report content, report is considered **consumed digital good** and non-refundable.

**Rationale:**
- Digital goods (PDFs, ebooks, music) are non-refundable once consumed
- User has full access to content; no way to "return" downloaded file
- Prevents abuse (user reads report, requests refund, keeps content)

**Evidence of Consumption:**
- Download logged in system (user downloads report)
- Report PDF opened/viewed (tracked via access logs if available)
- User accessed report content on mobile/web app

---

### 2. User Dissatisfaction with Content
**Policy:** Reports are non-refundable based on user dissatisfaction with:
- Accuracy of predictions
- Quality of writing or presentation
- Lack of specific life answers
- User disagreement with astrological interpretation
- Negative predictions (user doesn't like what report says)

**Rationale:**
- Astrology is interpretive; accuracy subjective
- Content quality is matter of opinion
- GrahAI disclaims accuracy guarantees in Terms
- Reports are custom AI-generated; no refund for subjective dissatisfaction

**User Recourse (Alternative to Refund):**
- Contact support with feedback; GrahAI may provide personalized insights via email
- No automatic refund; support response is discretionary

---

### 3. User Misunderstanding of Service Scope
**Policy:** Non-refundable if user misunderstood what report covers.

**Eligible Scenario (Not Refundable):**
- User expected medical diagnosis; report provides astrological perspective
- User expected specific career prediction; report provides general guidance
- User expected relationship outcome certainty; report provides insights
- User misunderstood that report is AI-generated (not human astrologer)

**User Recourse:**
- Pre-purchase FAQ clarifies report contents and scope
- Product description explicitly states "AI-generated readings"
- Support available for questions before purchase

---

### 4. Third-Party Refund Requests
**Policy:** Refunds issued only to original payment method (Razorpay). Non-refundable if:
- Third party initiates refund on user's behalf
- User transferred payment to another person
- Corporate/bulk purchase with non-refund agreement

---

### 5. Refund Window Exceeded
**Policy:** Refund requests must be submitted within specified timeframe.

**Timelines:**
- Non-delivery: 48 hours from purchase
- Technical failure: 7 days from purchase
- Duplicate charges: Immediate (no timeframe)
- Cancellation (24-hour grace): 24 hours from purchase

**Non-Refundable After Deadlines:** No exceptions; late requests automatically denied

---

## Refund Process & Timeline

### Step 1: Request Submission
**Channel:** Email to `support@grahai.com`

**Required Information:**
- Full name and email address associated with account
- Order ID (from payment email/invoice)
- Reason for refund (select from eligible conditions)
- Brief explanation (1-2 sentences)
- Relevant screenshots or evidence

**Email Template:**
```
Subject: Refund Request - Order [ORDER_ID]

Name: [Your Name]
Email: [Your Email]
Order ID: [From Invoice]
Purchase Date: [Date]
Reason: [Non-Delivery / Technical Failure / Duplicate Charge / Cancellation]

Details: [Brief explanation]

Attachment: [Screenshot if applicable]
```

---

### Step 2: Verification (1-3 Business Days)
Support team verifies:
- Order exists and payment processed
- Refund reason is eligible
- Timeframe requirement met
- Evidence (if provided) confirms claim

**Verification Methods:**
- Check Razorpay transaction logs
- Verify report generation status in database
- Review server error logs (for technical failures)
- Check email delivery logs (for non-delivery)

---

### Step 3: Approval/Denial Decision (3-5 Business Days)
Support responds via email with:
- **If Approved:** "Your refund has been approved. It will appear in your account within 7-14 business days via Razorpay."
- **If Denied:** Reason for denial and contact for appeal

**Appeal Process:**
- User can reply to denial email with additional evidence
- Management reviews within 5 business days
- Final decision is binding

---

### Step 4: Refund Processing (Razorpay)
- Support initiates refund via Razorpay merchant dashboard
- Razorpay processes refund to original payment method
- Timeline: **7-14 business days** (bank-dependent)

**Payment Method Refund Times:**
- **Credit Card:** 7-10 business days
- **Debit Card:** 7-10 business days
- **UPI:** 2-5 business days
- **Net Banking:** 5-10 business days
- **Wallets:** 3-7 business days

**Note:** GrahAI not responsible for Razorpay delays; user may follow up with bank if refund not received after 15 business days.

---

## Refund Status & Tracking

### Check Refund Status
1. **From Original Payment Confirmation:** Invoice email shows order details; check Razorpay portal
2. **Email Inquiry:** Email `support@grahai.com` with order ID; support provides status update
3. **Razorpay Receipts:** Log into Razorpay account (if created) to view refund transaction ID

### Partial Refunds
- **GST Consideration:** Refunds issued as full amount paid (including GST); user responsible for GST filing if applicable
- **No Deductions:** GrahAI does not deduct processing fees from refunds
- **Proration:** Subscription cancellations refund unused days (pro-rated)

---

## Special Cases

### Chargeback & Dispute Claims
**Policy:** If user files payment dispute/chargeback with bank without attempting GrahAI refund process:
- GrahAI account flagged; future payments may be declined
- Chargeback fees charged to account if applicable
- Support does not process refunds for disputed transactions

**Recommended Process:** Always contact GrahAI support first; chargeback is last resort

---

### Subscription Cancellation Refunds
**If Subscription Enabled:**
- User cancels before renewal; remaining days refunded pro-rated
- **Proration Example:** Monthly subscription ₹999; cancelled after 10 days of 30-day month = (20/30) × ₹999 = ₹666 refund
- Refund processed within 5-7 business days
- No cancellation fees or penalties

---

### Refund Denial & Escalation

**If Refund Denied:**
- User receives denial email with specific reason
- User can appeal within 7 days with additional evidence
- Management review (not automated)
- Final decision communicated within 5 business days

**Final Recourse:**
- If dissatisfied after internal escalation, user can file complaint with:
  - **Consumer Protection Authority** (under Consumer Protection Act, 2019)
  - **Grievance Officer:** compliance@grahai.app
  - **Arbitration** (per Terms of Service)

---

## Refund Statistics & Transparency

### Publicly Available Metrics (Monthly)
GrahAI publishes anonymized refund data:
- Total refunds issued (%)
- Refund reasons breakdown (%)
- Average refund processing time (days)
- Customer satisfaction score (post-refund survey)

**Purpose:** Demonstrate transparency and policy fairness

---

## FAQ — Refunds

**Q: Can I get a refund because predictions didn't come true?**
A: No. Astrology is interpretive; outcomes are not guaranteed. GrahAI disclaims accuracy warranties in Terms of Service.

**Q: What if I want a different astrologer's interpretation?**
A: GrahAI does not offer re-generations as refund. However, you can contact support; they may provide supplementary email insights (discretionary).

**Q: Can I get a refund if I changed my mind after downloading?**
A: No. Once downloaded, the digital good is consumed and non-refundable (like ebooks, music, movies).

**Q: How do I know my refund was processed?**
A: Check your bank account or email from Razorpay confirming refund. If refund approved by GrahAI but not in bank after 15 days, contact your bank.

**Q: What if Razorpay refund takes too long?**
A: GrahAI not responsible for Razorpay processing delays. Contact Razorpay support or your bank if refund not received after stated timeline.

**Q: Can I request a refund multiple times for same order?**
A: No. Only one refund request accepted per order. Multiple requests treated as abuse of policy.

---

## Policy Compliance

### Statutory Requirements Met
- **Consumer Protection Act, 2019:** No unreasonable restrictions on consumer rights
- **E-Commerce Rules, 2020:** Refund policy clear, accessible, non-deceptive
- **RBI Guidelines:** Payment refunds comply with banking regulations
- **Razorpay Standards:** Policy aligns with merchant guidelines

### Effective Date & Updates
- **Current Version:** March 2026
- **Last Updated:** March 15, 2026
- **Review Cycle:** Annually or upon regulatory changes
- **Notification:** Material changes communicated 14 days in advance

---

## Contact & Support

**Refund Inquiries:**
- Email: `support@grahai.com`
- Response Time: 24-48 hours
- Subject Line: `Refund Request - Order [ID]`

**Grievance Escalation:**
- Email: `legal@grahai.app`
- Response Time: 5 business days

