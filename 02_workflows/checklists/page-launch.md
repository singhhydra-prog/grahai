# Page Launch Checklist

Run through before shipping any new or redesigned customer-facing page.

## Content & Copy
- [ ] Page copy reviewed against `01_context/product/4_COPY_SYSTEM.md` (voice, tone, DO/DON'T)
- [ ] No placeholder text ("Lorem ipsum", "TBD", "TODO")
- [ ] All CTAs have clear action verbs ("Get Your Report", not "Click Here")
- [ ] Error states have helpful messages (not technical jargon)
- [ ] Empty states have guidance ("No reports yet — explore your chart")
- [ ] Loading states show skeleton or spinner with context

## Design Compliance
- [ ] Deep-space background (#0A0E1A) — no white/light backgrounds
- [ ] Cosmic-white text (#E8E6F0) — no pure white (#FFFFFF)
- [ ] Saffron-gold accents (#D4A843) for CTAs and highlights
- [ ] Glass-morphic surfaces where appropriate
- [ ] Fonts match design system (check `03_docs/design/DESIGN_TOKENS.md`)
- [ ] No default Next.js or Tailwind colors

## Responsive & Accessibility
- [ ] Tested at 320px (smallest mobile)
- [ ] Tested at 375px (iPhone SE)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1440px (desktop)
- [ ] Touch targets ≥44px on mobile
- [ ] All images have alt text
- [ ] Keyboard navigable (Tab/Enter/Escape)
- [ ] Color contrast ratio ≥4.5:1 for body text

## SEO & Meta
- [ ] Page has `<title>` tag (unique, ≤60 chars)
- [ ] Page has `<meta description>` (unique, ≤155 chars)
- [ ] Open Graph tags set (og:title, og:description, og:image)
- [ ] Canonical URL set
- [ ] No `noindex` unless intentional

## Performance
- [ ] No Spline without lazy loading
- [ ] Images optimized (Next.js `<Image>` component)
- [ ] No blocking scripts in `<head>`
- [ ] Lighthouse mobile score ≥70

## Integration
- [ ] Page listed in `01_context/product/1_APP_MAP.md`
- [ ] Page audited in `01_context/product/2_PAGE_INVENTORY.md`
- [ ] User flow updated in `01_context/product/3_USER_FLOWS.md` if applicable
- [ ] Analytics events fire (page_view at minimum)
- [ ] Footer links present (Privacy, Terms, Disclaimer, Support)
- [ ] Navigation/BottomNav updated if page is primary

## Final
- [ ] Tested logged-in AND logged-out states
- [ ] Tested premium/locked state (if behind paywall)
- [ ] Peer review or `qa-reviewer` skill run
- [ ] Screenshot taken for documentation
