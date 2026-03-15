# Legal/Trust Page Publishing Checklist

Run before publishing or updating any legal page (privacy, terms, disclaimer, refund, FAQ, support).

## Content Accuracy
- [ ] Content matches spec in `03_docs/legal/` (privacy-spec, terms-spec, etc.)
- [ ] All GrahAI-specific language included (astrology disclaimers, birth data handling)
- [ ] Indian compliance clauses present:
  - Information Technology Act 2000
  - IT Rules 2011 (data localization)
  - Consumer Protection Act 2019 (refund/grievance rights)
- [ ] Contact emails correct: support@grahai.com, grievances@grahai.com
- [ ] No placeholder text or generic SaaS boilerplate left

## Cross-Linking
- [ ] Page linked from global footer (ALL pages)
- [ ] Disclaimer linked from checkout/payment flow
- [ ] Disclaimer linked from report detail pages
- [ ] Privacy policy linked from signup/login page
- [ ] Refund policy linked from billing page
- [ ] Support linked from error pages and report pages
- [ ] FAQ linked from support page

## Technical
- [ ] "Last Updated" date shown and accurate
- [ ] Page renders correctly on mobile (scrollable, readable)
- [ ] No broken internal links
- [ ] `useSearchParams` wrapped in `<Suspense>` if used
- [ ] Component matches registered route in `src/app/{page}/page.tsx`

## Trust Signals (on payment/checkout surfaces)
- [ ] "Razorpay Verified Merchant" badge visible
- [ ] "SSL Encrypted" indicator present
- [ ] "7-day refund guarantee" statement near purchase button
- [ ] Privacy/terms links within 1 scroll of payment button

## Approval
- [ ] Content reviewed against `01_context/product/6_TRUST_PAGES_PLAN.md` audit checklist
- [ ] Lawyer review completed (or flagged as pending)
- [ ] `TRUST_PAGES_PLAN.md` audit checkboxes updated
