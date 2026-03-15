# Skill: payment-flow

## Trigger
Use this skill when working on Razorpay payment integration, pricing, entitlements, or billing.

## Outcome
Working payment flow: user selects report → creates Razorpay order → pays → server verifies signature → entitlement granted → report generates.

## Dependencies
- `src/app/api/payment/create-order/route.ts` — Order creation
- `src/app/api/payment/verify/route.ts` — Payment verification
- `src/lib/entitlements/checker.ts` — Entitlement validation
- `src/components/app/PricingOverlay.tsx` — Pricing UI
- `src/components/app/PaywallBanner.tsx` — Paywall component
- Supabase tables: payments, entitlements, user_profiles
- Reference docs: `03_docs/payments/RAZORPAY_SETUP.md`, `03_docs/payments/RAZORPAY_REFERENCE.md`

## Steps
1. **Understand the flow**: UI → create-order API → Razorpay checkout → verify API → grant entitlement → redirect to report
2. **Verify signature**: ALWAYS verify Razorpay payment signature server-side before granting access
3. **Update entitlements**: Write to Supabase entitlements table
4. **Handle failures**: Network errors, expired sessions, duplicate payments

## Edge Cases
- **Duplicate payment**: Check if entitlement already exists before creating
- **Webhook vs redirect**: Razorpay can send webhook OR redirect — handle both
- **INR only currently**: Stripe integration planned for USD/global
- **Refunds**: Must be processed manually through Razorpay dashboard
- **Free tier**: Some features are free — check entitlements/checker.ts for logic
