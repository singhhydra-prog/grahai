# Monetization / Pricing Page Checklist

Run before launching or changing any pricing surface (PricingOverlay, PaywallBanner, billing page, report purchase flow).

## Pricing Accuracy
- [ ] Prices match `01_context/product/5_PRICING_MODEL.md`
- [ ] All 7 report types have correct prices displayed
- [ ] GST/tax handling clear ("All prices inclusive of GST" or explicit breakdown)
- [ ] Bundle pricing (if any) shows per-item savings
- [ ] No stale prices from previous iteration

## Value Proposition
- [ ] Each report type has 1-line benefit (not just name)
- [ ] "What you get" is specific (e.g., "20-page personalized PDF", not "a report")
- [ ] Social proof present where available (# of reports generated, ratings)
- [ ] Comparison to alternatives implied ("Instant delivery" vs. waiting for human astrologer)

## Trust & Conversion
- [ ] Refund guarantee visible near purchase button ("7-day money-back")
- [ ] Razorpay trust badge displayed
- [ ] Disclaimer link accessible ("For guidance purposes only")
- [ ] Privacy reassurance ("Your birth data stays encrypted")
- [ ] Price anchoring used where relevant (show original vs. discounted)

## Payment Flow
- [ ] Razorpay modal opens correctly
- [ ] Test mode verified (use Razorpay test keys)
- [ ] Success callback triggers PurchaseSuccess component
- [ ] Failure callback shows clear error + retry option
- [ ] Payment verification hits `/api/payment/verify`
- [ ] Entitlement granted immediately after verification
- [ ] Receipt/confirmation email sends (or is planned)

## Upsell & Cross-Sell
- [ ] Post-purchase upsell present ("Complement with Wealth Growth report")
- [ ] ReportDetailPage shows related reports
- [ ] PricingOverlay shows multiple tiers if applicable
- [ ] Subscription CTA present (if subscription model launched)

## Analytics
- [ ] `paywall_banner_shown` event fires
- [ ] `purchase_started` event fires (clicked "Unlock")
- [ ] `purchase_completed` event fires (Razorpay verified)
- [ ] `purchase_failed` event fires (with error reason)
- [ ] Conversion funnel trackable in GA4

## Compliance
- [ ] Pricing matches what Razorpay order creates (no mismatch)
- [ ] "Digital goods" disclaimer present (non-refundable after delivery)
- [ ] Link to full refund policy visible
- [ ] No misleading claims ("guaranteed results", "100% accurate")
