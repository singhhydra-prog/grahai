# Skill: Page Auditor

## Trigger
When you need to audit an existing page/route for quality, compliance, and consistency.

## Outcome
A scorecard PDF/markdown report rating the page across 8 dimensions (1-5 stars each), with actionable fixes for each gap.

## Context Files
Read first:
- `01_context/product/2_PAGE_INVENTORY.md` — All routes and current state
- `03_docs/design/DESIGN_TOKENS.md` — Cosmic luxury tokens, color palette, typography

## Steps
1. **Identify the page**: Get route name from user (e.g., `/dashboard`, `/pricing`, `/profile/birth-chart`)
2. **Check PAGE_INVENTORY.md**: Confirm page exists and current ownership/status
3. **Audit design system compliance**:
   - Verify all colors use cosmic-token names (e.g., `bg-void-900`, `text-gold-400`)
   - Check typography: heading scales, font weights follow DESIGN_SYSTEM.md
   - Validate spacing uses Tailwind scale (4px base)
4. **Accessibility audit**:
   - All images have alt text describing Vedic context
   - Form labels linked to inputs via `htmlFor`
   - Color contrast passes WCAG AA (test with axe DevTools)
   - Keyboard navigation works (tab order, focus visible)
5. **Mobile responsiveness**: Test at 375px, 768px, 1024px; verify touch targets ≥44px
6. **SEO metadata**: Check `<title>`, `<meta description>` (max 160 chars), Open Graph tags for sharing
7. **State coverage**: Verify loading skeleton, empty state, error state all present and styled
8. **Auth guards**: Confirm page checks `user` from context/hook; redirects to `/login` if needed
9. **Performance**: Check Lighthouse (target: LCP <2.5s, FID <100ms, CLS <0.1)
10. **Generate scorecard**: Create table with dimensions, star ratings, specific fix URLs

## Checklist Enforcement
Before marking any page work complete, run the relevant checklist:
- New/redesigned pages → `02_workflows/checklists/page-launch.md`
- Legal pages → `02_workflows/checklists/legal-publishing.md`
- UX changes → `02_workflows/checklists/ux-review.md`
- Pricing surfaces → `02_workflows/checklists/pricing-page.md`

**Work is not complete until the relevant checklist passes.**

## Quality Gates
- Report must cite specific file paths and line numbers for each issue
- Recommendations must be atomic (one change per bullet)
- Every 1-star dimension must have at least one fix example
- Report must note if page is not yet in PAGE_INVENTORY.md (flag for coverage)

## Edge Cases
- **Draft pages** (not in inventory): Flag as risk; suggest adding to inventory before launch
- **Routes with dynamic segments** (e.g., `/chart/[id]`): Audit both empty and populated states
- **Auth-only pages** (e.g., `/dashboard`): Test both logged-in and logged-out redirects
- **Payment flows** (e.g., `/checkout`): Verify Razorpay integration doesn't break compliance
