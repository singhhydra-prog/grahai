# SECTION 9 — Trust and Legal Status

**Status:** LIVE — All 6 legal pages deployed with real content; linking partially complete

---

## Legal Pages Inventory

| Page | Route | Content Status | Quality |
|------|-------|---------------|---------|
| Disclaimer | `/disclaimer` | **LIVE** | Real astrology-specific content (limitation of liability, indemnity) |
| Terms & Conditions | `/terms` | **LIVE** | Comprehensive T&C (acceptance, services, payment, IP, disputes) |
| Privacy Policy | `/privacy-policy` | **LIVE** | Real content (data handling, user rights, GDPR-aligned) |
| Refund Policy | `/refund-policy` | **LIVE** | Specific policy (24-hour refund window, 5-7 day processing) |
| FAQ | `/faq` | **LIVE** | 5 sections, 20+ Q&As (astrology, payments, privacy) |
| Support | `/support` | **LIVE** | Contact form + email (support@grahai.app) |

### Implementation Architecture
- Each route (`src/app/{page}/page.tsx`) thin-wraps a component in `src/components/app/legal/`
- Components: `DisclaimerPage.tsx`, `TermsPage.tsx`, `PrivacyPolicyPage.tsx`, `RefundPolicyPage.tsx`, `FAQPage.tsx`, `SupportPage.tsx`
- Contact form backend: `/api/contact` route

---

## Content Gaps (Per 6_TRUST_PAGES_PLAN.md Audit)

| Page | Missing Content | Severity |
|------|-----------------|----------|
| Disclaimer | Birth-time accuracy disclaimer, explicit "no guarantee" header | MODERATE |
| Privacy Policy | Data localization clause (India IT Rules 2011 requirement) | HIGH |
| Refund Policy | Consumer Protection Act 2019 compliance note | MODERATE |
| Refund Policy | Plan says 7-day window, code says 24-hour window | LOW (stricter is fine) |
| All Pages | No evidence of legal counsel review | HIGH |

---

## Legal Link Placement

### GlobalFooter Component (`src/components/ui/GlobalFooter.tsx`)
- **Status:** LIVE — Component created, renders all 6 links
- **Links:** Disclaimer, Terms & Conditions, Privacy Policy, Cancellation & Refund, FAQ, Support
- **Integration:** Rendered in main app shell (`src/app/app/page.tsx`) before BottomNav

### PricingOverlay (`src/components/app/PricingOverlay.tsx`)
- **Status:** PARTIAL — 4/6 links
- ✓ Disclaimer, Terms, Refund Policy, Privacy
- ✗ FAQ, Support
- **Location:** Below sticky CTA button (lines 335-341)

### PurchaseSuccess (`src/components/ui/PurchaseSuccess.tsx`)
- **Status:** PARTIAL — 3/6 links
- ✓ Terms, Refund Policy, Disclaimer
- ✗ Privacy, FAQ, Support
- **Location:** Below CTA with delayed fade-in animation (lines 197-201)

### ProfileTab (`src/components/app/tabs/ProfileTab.tsx`)
- **Status:** COMPLETE — 6/6 links
- All legal links in dedicated "Legal & Info" section
- Additional FAQ and Support CTA buttons in profile header area

---

## Link Coverage Matrix

| Page | GlobalFooter | PricingOverlay | PurchaseSuccess | ProfileTab |
|------|-------------|----------------|-----------------|------------|
| Disclaimer | ✓ | ✓ | ✓ | ✓ |
| Terms | ✓ | ✓ | ✓ | ✓ |
| Privacy | ✓ | ✓ | ✗ | ✓ |
| Refund | ✓ | ✓ | ✓ | ✓ |
| FAQ | ✓ | ✗ | ✗ | ✓ |
| Support | ✓ | ✗ | ✗ | ✓ |

---

## Trust Signals

| Signal | Status | Evidence |
|--------|--------|----------|
| Legal pages accessible | **LIVE** | All 6 routes return real content |
| Payment page legal links | **PARTIAL** | 4/6 in PricingOverlay, 3/6 in PurchaseSuccess |
| Global footer with legal links | **LIVE** | GlobalFooter component in app shell |
| Support email visible | **LIVE** | support@grahai.app in Support page and components |
| Razorpay security badge | **MISSING** | No badge/logo displayed |
| SSL indicator | **LIVE** | Vercel provides automatic HTTPS |
| Indian jurisdiction clause | **LIVE** | Terms mention Indian law, arbitration seat in India |
| Contact form functional | **LIVE** | Form with validation (min 10 chars, valid email) |
| Response time stated | **LIVE** | "Usually within 24 hours" on Support page |

---

## Regulatory Compliance Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| IT Act 2000 compliance | **PARTIAL** | Privacy policy exists but missing data localization clause |
| IT Rules 2011 (SPDI Rules) | **PARTIAL** | Missing explicit consent language for sensitive personal data |
| Consumer Protection Act 2019 | **MISSING** | No CPA compliance note in Refund Policy |
| RBI guidelines (digital payments) | **LIVE** | Razorpay handles compliance; refund policy exists |
| GDPR alignment | **PARTIAL** | User rights section present (access, rectification, erasure, portability) |

---

## Recommendations

1. **Add missing links** to PricingOverlay (FAQ, Support) and PurchaseSuccess (Privacy, FAQ, Support)
2. **Add birth-time accuracy disclaimer** to Disclaimer page
3. **Add data localization clause** to Privacy Policy (India IT Rules 2011)
4. **Add CPA 2019 compliance note** to Refund Policy
5. **Get legal counsel review** before accepting real payments
6. **Add Razorpay security badge** to payment surfaces

**Overall trust assessment:** The foundation is solid — all pages exist with substantive content, links are distributed across key surfaces, and the contact system works. The gaps are refinement-level (missing clauses, incomplete link coverage on checkout surfaces) rather than structural.
