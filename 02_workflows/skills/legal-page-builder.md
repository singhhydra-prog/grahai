# Skill: Legal Page Builder

## Trigger
When creating or auditing legal/trust pages: Privacy Policy, Terms of Service, Disclaimer, Refund Policy, FAQ, or Support.

## Outcome
Production-ready page content (markdown or HTML) with Indian e-commerce compliance, astrology-specific disclaimers, and clear refund terms.

## Context Files
Read first:
- `01_context/product/6_TRUST_PAGES_PLAN.md` — Compliance checklist, live deployment status
- `03_docs/legal/*.md` — 6 legal page specs (privacy, terms, refund, disclaimer, FAQ, support)
- `01_context/product/4_COPY_SYSTEM.md` — Tone (warm, clear, authoritative)

## Checklist Enforcement
Before marking any legal page work complete → run `02_workflows/checklists/legal-publishing.md`.
**Work is not complete until every item passes.**

## Steps
1. **Identify page type**: Privacy, Terms, Disclaimer, Refund, FAQ, or Support
2. **Read TRUST_PAGES_PLAN.md**: Confirm all required sections and compliance points for India
3. **Draft content** (or audit existing):
   - **Privacy**: Data collection, use, retention, user rights per GDPR-equivalent India standards
   - **Terms**: Payment terms, usage rights, content ownership, liability limits
   - **Disclaimer**: Astrology not a substitute for professional advice (medical, financial, legal); results are for guidance only
   - **Refund**: Conditions (30 days, chart-specific, subscription tiers), processing (Razorpay API), exceptions
   - **FAQ**: Onboarding Q&As, chart accuracy, data privacy, payment/billing, technical issues
   - **Support**: Contact email, response SLA, escalation path
4. **Add astrology-specific disclaimers**:
   - Vedic astrology is not science or medical advice
   - Results should not replace professional consultation
   - Data accuracy depends on birth details provided by user
   - No refunds for "disappointing results"
5. **Check Razorpay compliance**: Refund policy must align with payment gateway terms
6. **Review with COPY_SYSTEM.md**: Ensure warm, clear, non-mystical tone
7. **Format for web**: Use heading hierarchy (H1, H2, H3); break into scannable sections
8. **Output**: Markdown file ready to convert to route (`/privacy`, `/terms`, `/refund`, etc.)

## Quality Gates
- All pages must have explicit disclaimer re: astrology limitations
- Refund policy must specify: conditions, timeline (30 days?), method (to original payment source)
- Privacy policy must disclose all data sources (birth date, IP, usage patterns) and retention periods
- No page can make medical, financial, or legal claims without "not a substitute for professional advice"
- Terms must reference Razorpay ToS for payment processing

## Edge Cases
- **International users**: Clarify which laws apply (India first, then clarify for other regions)
- **Subscription vs. one-time**: Different refund terms for each; document both
- **Chart computation data**: Clarify how long results are stored and whether user can request deletion
- **Free trial conversions**: Document what happens at trial end (payment attempted, account frozen, etc.)
