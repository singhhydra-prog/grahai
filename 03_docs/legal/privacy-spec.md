# Privacy Policy Specification — GrahAI

## Overview
Comprehensive privacy policy governing data collection, storage, usage, and user rights on the GrahAI platform. Must be legally compliant with Indian IT Act 2000 and international privacy standards. Displayed as `src/components/app/legal/PrivacyPolicyPage.tsx`.

## Data Collection & Storage

### Personal Data Collected
1. **Identity Information:**
   - Full name (required for account creation)
   - Email address (required; used for account access and notifications)
   - Phone number (optional; used for OTP-based authentication)

2. **Astrology-Specific Data:**
   - Date of birth (required; core for chart generation)
   - Birth time (required for accurate chart calculations)
   - Birth location/coordinates (required; affects planetary positions)

3. **Account & Transaction Data:**
   - Payment information (processed via Razorpay; GrahAI does not store card details)
   - Order history and generated report IDs
   - Subscription status and billing address (if provided)

4. **Device & Usage Data:**
   - Device type, OS, browser type
   - Unique device identifiers
   - IP address (for fraud detection)
   - Usage patterns: pages visited, reports accessed, features used
   - Session timestamps and duration

### Storage Infrastructure
- **Primary:** Supabase PostgreSQL database (secure, encrypted at rest)
- **Backup:** Automated daily backups; 30-day retention
- **Access:** Restricted to authenticated backend services; role-based access control (RBAC)
- **Encryption:** TLS 1.3 for data in transit; encrypted columns for sensitive birth data

### Cookie Usage
- **Session Cookies:** Maintain user login state (non-persistent)
- **Analytics Cookies:** Track user behavior for UX improvements (Supabase analytics, optional consent required)
- **Preference Cookies:** Store user theme, language, notification settings
- **Third-Party Cookies:** None; no integration with third-party tracking services
- **User Control:** Cookie preference manager; users can disable non-essential cookies

## Data Sharing & Third Parties

### No Sharing Policy
- **GrahAI DOES NOT sell, rent, or share personal data with third parties.**
- User birth details (name, DOB, birth time/location) **never** shared with other users or external parties.
- Exception: Service providers (Razorpay for payments, Vercel for hosting) under strict Data Processing Agreements (DPA).
- Legal exceptions: Court orders, law enforcement requests, or regulatory compliance (with user notification where legally permissible).

### Birth Data Confidentiality
- Birth time and location visible only to the authenticated user and AI generation engine.
- Reports generated using birth data are private to the user unless user explicitly shares.
- No public profile pages exposing birth details.

## Analytics & Tracking

### Analytics Implementation
- **Service:** Supabase analytics and optional Vercel Web Analytics
- **Data Tracked:** Page views, feature usage (e.g., report generation), conversion events
- **Anonymization:** No personal identifiers linked to analytics events
- **User Consent:** Opt-in consent banner on first visit; can be withdrawn in settings
- **Retention:** Analytics data retained for 90 days; aggregated summaries retained 1 year

### No Invasive Tracking
- No session replay or heatmap tools
- No behavioral profiling for advertising
- No integration with Google Analytics or Facebook Pixel

## Data Retention Policy

### Active Accounts
- Personal data: Retained as long as account is active
- Transaction history: Retained for 7 years (tax/regulatory compliance)
- Usage logs: Retained for 90 days; older logs deleted automatically
- Cookies: Session cookies deleted on logout; preference cookies persist 1 year

### Inactive/Deleted Accounts
- **Soft Delete:** Account marked as inactive if no login for 2 years
- **Hard Delete:** User can request permanent deletion via `support@grahai.com`
- **Deletion Timeline:** Complete deletion within 30 days of verified request
- **Exceptions:** Transaction records retained 7 years per tax law; anonymized for privacy

### GDPR Alignment (for international users)
- Personal data not shared across borders without explicit consent
- Data storage primarily in India; no automated transfers to EU without legal basis

## User Rights & Deletion

### Right to Access
- Users can download their personal data in JSON format via account settings
- Includes: profile info, birth data, reports generated, payment history, activity logs
- Request processed within 5 business days

### Right to Deletion
- Users can delete their own account immediately via settings
- Triggers: Profile deletion, birth data anonymization, transaction data anonymization
- Irreversible for generated reports (non-recovery); other data deleted permanently
- Support team can assist via `support@grahai.com` with verification

### Right to Rectification
- Users can update name, email, phone, and birth data anytime
- Updates reflected immediately in new reports; old reports not regenerated

### Right to Data Portability
- Users can export personal data and all generated reports in portable formats (JSON, PDF)
- Export processed within 10 business days via email

## Indian IT Act 2000 Compliance

### Applicability
- GrahAI operates under Indian law (Bengaluru, India jurisdiction)
- Complies with Information Technology Act, 2000 and Rules 2011
- Implements Information Security Manual (ISM) guidelines for data protection

### Compliance Measures
1. **Sensitive Personal Data (SPDI):** Birth data classified as SPDI; stored in encrypted database
2. **Reasonable Security:** Multi-layered security: encryption, firewalls, access controls, audit logs
3. **Privacy Officer:** Designated Data Protection Officer (DPO) available at `dpo@grahai.app`
4. **Grievance Redressal:** Formal grievance mechanism; response within 30 days
5. **Audit & Monitoring:** Annual security audits; penetration testing; intrusion detection

### Data Localization
- Personal data of Indian users stored in India-based servers (Supabase in India region)
- Backup servers geographically distributed within India
- No cross-border transfers without explicit legal mandate

## Children's Data Policy

### Age Restrictions
- **Minimum Age:** 13 years old (compliant with Children's Online Privacy Protection Act equivalent)
- **Account Creation:** Users under 18 require parental consent form (email + digital signature)
- **Data Collection:** Minimal for users under 18; no marketing communications without parental opt-in

### Parental Controls
- Parents can request deletion of child's account at any time
- Parents can request access to child's data and usage reports
- GrahAI reserves right to terminate accounts of minors; no account recovery guaranteed

### Enforcement
- Age verification during signup (email domain, phone OTP)
- If minor's data discovered, immediate notification and account suspension
- Support escalation for parental consent forms

## Third-Party Integrations

### Razorpay (Payment Processing)
- Handles card payments only; GrahAI never stores card data
- Data shared: Order amount, user email, user name
- No sharing of birth data or health history
- Razorpay complies with PCI-DSS Level 1 security

### Supabase (Backend/Database)
- Hosts database and authentication
- Data shared: All personal and usage data (required for service operation)
- Supabase Privacy Policy governs their processing: https://supabase.com/privacy

### Vercel (Hosting)
- Hosts frontend application; can see anonymized usage patterns
- No personal data intentionally shared; Vercel privacy policy applies

### Email Service (SendGrid or SES)
- Transactional emails only (OTP, password reset, payment confirmation)
- No promotional emails without opt-in consent

## Security Practices

### Encryption
- **In Transit:** TLS 1.3 for all data transmission; secure WebSockets for real-time data
- **At Rest:** AES-256 encryption for birth data columns in database
- **Key Management:** Encrypted keys stored in secure vaults; rotated quarterly

### Access Control
- **Role-Based Access Control (RBAC):** Backend services access only required data
- **User Authentication:** JWT tokens with 24-hour expiry; refresh tokens with 30-day expiry
- **OTP Verification:** Optional two-factor authentication (2FA) for high-security accounts
- **Audit Logs:** All data access logged and monitored; suspicious access triggers alerts

### Vulnerability Management
- **Penetration Testing:** Annual third-party security audits
- **Code Review:** Static analysis tools (SonarQube) integrated in CI/CD
- **Dependency Scanning:** Automated checks for vulnerable packages
- **Bug Bounty:** Community vulnerability disclosure program (external researchers welcome)

### Incident Response
- **Response Time:** Security incidents assessed within 1 hour
- **Notification:** Users notified within 72 hours if personal data breached (or legally required timeline)
- **Documentation:** All incidents logged and reported to regulatory authorities if required

## Policy Updates & Communication

### Notification of Changes
- Major privacy changes notified 30 days in advance via email
- Minor clarifications published immediately with notification
- Users must agree to updated policy on next login; continued use indicates acceptance

### Contact Information
- **Privacy Questions:** support@grahai.com
- **Data Protection Officer:** dpo@grahai.app
- **Grievance Redressal:** legal@grahai.app
- **Response Time:** All inquiries answered within 5 business days

## Effective Date & Revision History
- **Effective Date:** March 2026
- **Last Updated:** March 15, 2026
- **Next Review:** March 2027 (annual)

---

**Regulatory References:**
- Information Technology Act, 2000 (India)
- Information Technology Rules, 2011 (India)
- GDPR (where applicable to EU users)
- Children's Online Privacy Protection Act (where applicable)

