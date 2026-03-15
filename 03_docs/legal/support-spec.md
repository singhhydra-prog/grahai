# Support & Contact Page Specification — GrahAI

## Overview
Comprehensive support page providing multiple contact channels, SLA commitments, and self-service resources. Displayed as `src/components/app/legal/SupportPage.tsx`. Balances responsive support with scalable self-service; reduces support volume through documentation and FAQ access.

## Support Channels

### 1. Email Support (Primary)

#### Support Email Address
- **Email:** support@grahai.com
- **Status:** Monitored 24/7; responses during business hours (Mon-Fri, 9 AM - 6 PM IST)
- **Backup Email:** help@grahai.com (if main email down)

#### When to Use Email
- General questions about features or usage
- Account/billing issues (order IDs, refunds, upgrades)
- Technical problems (crashes, errors, performance)
- Feature requests or feedback
- Complaints or escalations

#### Email Best Practices
1. **Subject Line:** Clear, specific description (e.g., "Report Generation Failed - Order #12345")
2. **Email Content:**
   - State issue clearly in first sentence
   - Include relevant order ID, email, device info
   - Describe steps you took to resolve (already tried restart, cleared cache, etc.)
   - Screenshot of error if applicable
3. **Attachments:** OK to include screenshots, error logs; avoid large files (>5MB)
4. **Response Time:** See SLA below

#### Response Time SLA (Service Level Agreement)

| Issue Type | Response Time | Resolution Time |
|-----------|--------------|-----------------|
| Billing/Payment Issues | 4 hours (urgent) | 24 hours |
| Account Access Problems | 4 hours (urgent) | 8 hours |
| Technical Issues | 24 hours | 48-72 hours |
| Refund Requests | 24 hours (review) | 5-10 business days |
| General Support | 24-48 hours | Varies |
| Feature Requests | 48-72 hours (acknowledgment only) | No timeline |

**"Response Time"** = First contact/acknowledgment (may ask for more details)
**"Resolution Time"** = Issue fully resolved or escalated with timeline

---

### 2. In-App Contact Form (Secondary)

#### Availability
- **Location:** Visible on SupportPage.tsx component
- **Accessibility:** Mobile-friendly form; accessible on web and tablets
- **Status:** Monitored 24/7 (async processing)

#### Form Fields
```
- Name (required): User's full name
- Email (required): Contact email for response
- Subject (required): Issue category dropdown:
    • Account & Login
    • Payment & Billing
    • Reports & Accuracy
    • Technical Issues
    • Privacy & Data
    • Other
- Priority (optional): Low / Medium / High / Urgent
- Description (required): 10-500 characters
- Attachment (optional): Upload screenshot (max 5MB, PNG/JPG only)
```

#### Processing
- **Submission:** Form data encrypted and stored securely
- **Confirmation:** Automated email confirming receipt with ticket ID
- **Routing:** Form auto-routes to appropriate team (billing, tech, etc.)
- **Response Time:** Same SLA as email support; ticket ID provided for tracking

#### Advantages Over Email
- ✓ Structured form reduces incomplete/unclear submissions
- ✓ Automatic ticket ID for tracking
- ✓ Built-in attachment upload for screenshots
- ✓ No need to type email address (pre-populated)
- ✓ Can track request status within app

---

### 3. Automated Contact/Notification API

#### Endpoint: `/api/contact`

**Purpose:** Backend API for in-app contact form submission and transactional notifications.

**Request Parameters:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Account & Login",
  "priority": "High",
  "description": "Cannot log in to my account",
  "attachmentUrl": "https://cdn.grahai.app/uploads/screenshot.png"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "TKT-20260315-001234",
  "message": "Your message has been received. Response time: 24 hours.",
  "confirmationEmailSent": true
}
```

**Error Handling:**
- Invalid email → 400 Bad Request
- Rate limiting (>5 submissions per hour per IP) → 429 Too Many Requests
- Server error → 500 Internal Server Error (with fallback email)

**Fallback:** If API fails, form auto-sends email to support@grahai.com with all details.

---

## Support Response Workflow

### Ticket Lifecycle

**Step 1: Intake (< 4 hours)**
- User submits support request (email, form, or chat)
- Automated ticket created; unique ID assigned
- Confirmation email sent with ticket ID and expected response time
- Ticket assigned to support queue

**Step 2: Triage (< 24 hours)**
- Support agent reviews ticket
- Categorizes issue: Billing, Technical, Account, Other
- Determines if self-service solution available (FAQ link sent)
- If urgency high: escalated to management team
- User receives update if more information needed

**Step 3: Investigation (< 48 hours)**
- Support agent investigates:
  - Check database for account/order info
  - Review error logs and system status
  - Consult with engineering team if technical
- May request additional info from user

**Step 4: Resolution (< 5 business days)**
- Issue resolved or escalated:
  - ✓ **Resolved:** Solution provided; ticket closed
  - ✓ **Refund Approved:** Refund initiated; user notified with timeline
  - ✓ **Escalated:** Transferred to management or engineering; user notified with new timeline
  - ✗ **Cannot Resolve:** User offered alternative solutions or compensation

**Step 5: Follow-Up (Optional)**
- If issue involved financial impact (failed payment, refund): Follow-up email after 7 days
- If technical issue: Check if issue resurfaces; offer preventative tips
- User satisfaction survey (optional): "Was this helpful?" email

---

## Self-Service Resources (First Response)

### FAQ Page
- **Link Provided:** In every support response; first-line resolution
- **Coverage:** 25+ common questions across account, reports, payments, privacy, technical
- **Effective Resolution:** ~30-40% of issues resolved via FAQ without support contact
- **Location:** grahai-app.vercel.app/faq or linked from support emails

### Onboarding Guides
- **Video Tutorials:** (if available)
  - How to sign up
  - How to generate your first report
  - How to download report PDF
  - How to manage account settings
- **Text Guides:** Step-by-step instructions for common tasks
- **Location:** Help section in app or Support page

### Status Page (Optional)
- **URL:** status.grahai.app (if implemented)
- **Info Provided:**
  - Current system status (Operational / Degraded / Down)
  - Scheduled maintenance windows
  - Incident history and resolution
  - Estimated time to resolution for active incidents
- **Transparency:** Builds trust; users know when issues are known and being worked on

### Help Center/Knowledge Base (Optional Future)
- **Articles:** 50+ articles covering common issues
- **Search:** Full-text search for quick answers
- **Categorized:** By topic (Account, Payments, Technical, Privacy, etc.)
- **Community:** User-generated Q&A forum (if moderated)

---

## Escalation Path

### Level 1: Tier 1 Support (Automated + Junior Support)
- **Handles:** 70% of issues (FAQs, password resets, basic account issues)
- **Tools:** Automated responses, form routing, knowledge base scripts
- **Response:** "Here's your answer..." or "Let me connect you with someone who can help"

### Level 2: Tier 2 Support (Specialized Support Agents)
- **Handles:** Billing, refunds, technical troubleshooting, account access
- **Credentials:** Product-trained; access to customer database and payment systems
- **Response Time:** 24-48 hours
- **Authority:** Can approve refunds up to ₹5,000; escalate larger issues
- **Example:** "Your refund has been approved. You'll see it in 7-14 days."

### Level 3: Senior Support / Escalation
- **Handles:** Complex technical issues, legal disputes, complaint escalations
- **Credentials:** Senior engineers, product leads, management
- **Response Time:** 48-72 hours (or as stated in escalation)
- **Authority:** Can approve large refunds, override policies (rare), coordinate engineering fixes
- **Example:** "We identified a bug in our system. Here's what we'll do..."

### Level 4: Management & Executive Escalation
- **Handles:** Formal complaints, media inquiries, regulatory issues
- **Contact:** legal@grahai.app (formal complaints) or compliance@grahai.app
- **Response Time:** Within 5 business days (per legal requirements)
- **Authority:** Legal decisions, public statements, policy changes

---

## Support SLA Commitments (Promised to Users)

### Availability
- **Support Hours:** 24/7 intake (emails received anytime)
- **Response Hours:** Monday-Friday, 9 AM - 6 PM IST (business hours)
- **Holiday Coverage:** Holidays observed per Indian national calendar; responses resume next business day

### Response Time Guarantees
- **Urgent Issues:** 4-hour response (payment, account access) → Best effort; not guaranteed
- **Standard Issues:** 24-48 hour response
- **Feature Requests:** 48-72 hour acknowledgment (no resolution commitment)

### Resolution Targets
- **Billing Issues:** 24 hours
- **Account Access:** 8 hours
- **Technical Issues:** 48-72 hours (varies by complexity)
- **Refund Processing:** 5-10 business days (after approval)

### SLA Penalties (Internal Only)
- If support misses SLA: Compensation tracked (bonus adjustments for support team)
- Users not entitled to service credits for SLA miss (disclosed in support policy)
- If repeated SLA misses: Engineering/product team notified

---

## Common Issues & Self-Service Solutions

### Issue: "I can't log in"
**Self-Service Solution (Before Contacting Support):**
1. Verify email address is spelled correctly
2. Click "Forgot Password?" and reset password
3. Check email spam folder for password reset link
4. Try different browser (clear cache first)
5. If phone number signup: Try OTP login instead

**If Still Unresolved:** Contact support with browser/device info.

---

### Issue: "Report generation failed"
**Self-Service Solution:**
1. Wait 5 minutes; try generating report again
2. Verify birth data is entered correctly (date format DD/MM/YYYY; time in 24-hour format)
3. Check that location is recognized (try city name instead of coordinates)
4. Refresh browser; clear cache
5. Try different browser

**If Still Unresolved:** Contact support with error message or screenshot.

---

### Issue: "Payment declined"
**Self-Service Solution:**
1. Verify card details are correct (no typos in card number, expiry)
2. Ensure card has sufficient balance for transaction amount
3. Check if card is international; some banks block international transactions
4. Try a different payment method (UPI, net banking, different card)
5. Contact your bank to authorize transaction if repeatedly declined

**If Still Unresolved:** Contact support with payment method and error received.

---

### Issue: "I didn't receive my report"
**Self-Service Solution:**
1. Check email spam/promotions folder (report email may be filtered)
2. Log into GrahAI account; check "My Reports" section (report may be there even if email failed)
3. Verify email address is correct in account settings
4. Wait 1 hour; email delivery may be delayed

**If Still Unresolved:** Contact support within 48 hours with order ID; eligible for refund if non-delivery confirmed.

---

## Communication Standards

### Tone & Language
- **Tone:** Friendly, empathetic, professional
- **Language:** Plain English; avoid jargon and technical terms (unless necessary)
- **Clarity:** Short paragraphs; bullet points for step-by-step instructions
- **Respect:** Acknowledge user frustration; take responsibility for errors

### Response Template (Standard)

```
Hi [Name],

Thank you for contacting GrahAI. I'm [Agent Name], and I'm here to help.

[ACKNOWLEDGE THE ISSUE]
I understand you're experiencing [brief description of issue].
I'm sorry for the inconvenience.

[INVESTIGATE]
I've checked your account and found [relevant info].

[SOLUTION]
Here's what we can do:
1. [Step 1]
2. [Step 2]
3. [Step 3]

[FOLLOW-UP]
If this doesn't resolve the issue, please let me know and
I'll escalate to our technical team.

Best regards,
[Agent Name]
Support Team
support@grahai.com
Ticket ID: TKT-20260315-001234
Response Time: 24 hours
```

---

## Privacy & Security in Support

### Data Protection
- Support agents only access customer data necessary to resolve issue
- Sensitive information (passwords, card details) never requested via email
- All support interactions logged; kept confidential
- Data retention: Support tickets stored for 2 years; deleted on request

### Password & Credential Handling
- ✗ **Never** ask users for password via email or form
- ✓ Use password reset flow (automated, secure)
- ✗ **Never** ask for full credit card number
- ✓ Ask for last 4 digits of card + order ID only

### GDPR Compliance (for EU users)
- Support requests processed per GDPR privacy standards
- User can request deletion of support ticket (right to erasure)
- Support data not shared with third parties (except as legally required)

---

## Performance & Analytics

### Metrics Tracked
1. **Response Time:** Average response time per ticket category
2. **Resolution Time:** Time from ticket open to resolution
3. **Customer Satisfaction:** "Helpful?" survey (1-5 scale)
4. **First-Contact Resolution:** % of issues resolved in first response
5. **Escalation Rate:** % of tickets escalated to higher levels
6. **FAQ Effectiveness:** % of users who found FAQ helpful (avoid support contact)

### Improvement Process
- **Monthly Review:** Support lead reviews metrics; identifies gaps
- **Quarterly Training:** Support team trained on new issues/policies
- **Customer Feedback:** User satisfaction surveys inform response improvements
- **Knowledge Base Updates:** FAQ and guides updated based on support trends

---

## Support Page Content

### Header Section
- **Title:** "We're here to help"
- **Tagline:** "Get quick answers or connect with our support team"
- **Visual:** Icon or illustration representing helpful support

### Contact Options Section
**Email Support**
- Icon: Envelope
- Label: "support@grahai.com"
- Description: "For account, billing, technical, and general questions"
- Button: "Send Email" (opens default email client)

**In-App Contact Form**
- Icon: Chat bubble
- Label: "Contact Form"
- Description: "Submit issue directly through this form"
- Button: "Open Form" (or embedded form)

**FAQ Page**
- Icon: Question mark
- Label: "Frequently Asked Questions"
- Description: "Find answers to 25+ common questions"
- Button: "View FAQ"

**Status Page** (if available)
- Icon: Server/status
- Label: "System Status"
- Description: "Check GrahAI platform status and incident updates"
- Button: "Check Status"

### Response Time & Hours Section
- **Support Hours:** 24/7 intake; Mon-Fri 9 AM - 6 PM IST response
- **Holidays:** Observed per Indian national calendar
- **Response Targets:**
  - Urgent (payment/account access): 4 hours
  - Standard: 24-48 hours
  - Feature requests: 48-72 hours

### Common Issues Section
- **Linked to:** 5-6 most common issues with self-service solutions
- **Link to FAQ:** Full list of self-service resources

### Self-Service Resources Section
- **FAQ Link:** Primary resource
- **Onboarding Guides:** Video tutorials and step-by-step guides
- **Knowledge Base:** (if available)

### Contact Information (Footer)
```
GrahAI Support
Email: support@grahai.com
Escalation: legal@grahai.app
Compliance: compliance@grahai.app

Address: [Office address, if available]
Phone: [Phone number, if available]

Ticket tracking: Use ticket ID from confirmation email
```

---

## Accessibility & Mobile Optimization

### Desktop Support Page
- **Layout:** 2-3 column layout; contact options on left; resources on right
- **Responsive:** Works on screen sizes 1024px+
- **Searchable:** CTRL+F (browser search) functional; FAQ searchable

### Mobile Support Page
- **Layout:** Single column stack; contact options prominent at top
- **Touch-Friendly:** Large buttons (48px min); readable font (16px+)
- **Performance:** Fast load (< 2 seconds)
- **Forms:** Auto-fill for email and name (from logged-in user)

### Accessibility Standards
- ✓ WCAG 2.1 AA compliant
- ✓ Keyboard navigable (tabs, enter key)
- ✓ Screen reader compatible (alt text, semantic HTML)
- ✓ Color contrast ratio 4.5:1 minimum

---

## Version & Review

### Current Version
- **Effective Date:** March 15, 2026
- **Last Updated:** March 15, 2026
- **Next Review:** June 15, 2026

### Update History
- Will track changes as support process evolves

