# UX Review Checklist

Run when auditing or redesigning any user-facing page or flow.

## User Intent
- [ ] Page purpose is clear within 3 seconds of landing
- [ ] Primary CTA is obvious and above the fold
- [ ] User knows what happens next after taking action
- [ ] No dead ends — every page has a next step or navigation back

## States Coverage
- [ ] **Empty state** — first-time user, no data yet (guidance, not blank)
- [ ] **Loading state** — skeleton or spinner with context ("Calculating your chart...")
- [ ] **Error state** — clear message + recovery action ("Try again" or "Contact support")
- [ ] **Success state** — confirmation + next step ("Report ready — View now")
- [ ] **Locked/Premium state** — clear paywall with value proposition
- [ ] **Offline state** — graceful degradation if applicable

## Navigation & Flow
- [ ] BottomNav highlights correct tab
- [ ] AppHeader shows appropriate title/back button
- [ ] Deep links work (sharing /report/:id opens correctly)
- [ ] Browser back button works as expected
- [ ] No infinite loops or redirect chains

## Forms & Input
- [ ] Labels are clear (not just placeholder text)
- [ ] Validation errors appear inline, not as alerts
- [ ] Required fields marked
- [ ] Auto-fill works where applicable (email, name)
- [ ] LocationSearch responsive and fast
- [ ] Birth time input handles "unknown" gracefully

## Mobile UX
- [ ] No horizontal scroll on any viewport ≤375px
- [ ] Tap targets ≥44px
- [ ] Modals/overlays dismissible (X button + backdrop tap)
- [ ] Keyboard doesn't obscure input fields
- [ ] PricingOverlay / PaywallBanner not covering critical content

## Consistency
- [ ] Matches existing app patterns (cosmic luxury design)
- [ ] Terminology consistent with `01_context/product/4_COPY_SYSTEM.md`
- [ ] Icons from same library (lucide or consistent set)
- [ ] Spacing and typography match design tokens

## Onboarding (if applicable)
- [ ] OnboardingFlow steps match `01_context/product/3_USER_FLOWS.md`
- [ ] Progress indicator visible
- [ ] Can go back to previous step
- [ ] Skip option available where appropriate
- [ ] Completion triggers analytics event
