# GrahAI — Open Questions

## Q001: Should we add Stripe for NRI payments?
**Context**: Currently only Razorpay (INR). NRI market pays 3-5x more per report.
**Options**: Add Stripe, use Razorpay international, or both
**Priority**: High (revenue impact)

## Q002: How to handle sweph binary on Vercel?
**Context**: Meeus fallback works but is less accurate. Options: pre-built WASM binary, dedicated compute server for ephemeris, or accept Meeus accuracy.
**Priority**: Medium (accuracy vs. simplicity tradeoff)

## Q003: Subscription model design?
**Context**: Currently one-time report purchases only. Monthly transit + guidance subscription planned.
**Options**: Monthly (₹299/mo), Annual (₹1999/yr), or tiered (Basic/Pro)
**Priority**: High (recurring revenue)

## Q004: Should we add more occult verticals?
**Context**: Numerology, Tarot, Vastu agents exist in code but are basic.
**Options**: Deep-build one at a time, or basic versions of all three
**Priority**: Medium

## Q005: Trading scanner integration?
**Context**: Doc 2 describes an NSE gap-reversal scanner. Could be a separate product or a GrahAI "financial astrology" feature.
**Options**: Separate project, GrahAI feature, or deferred
**Priority**: Low (separate domain)

## Q006: Content/SEO pipeline automation?
**Context**: Docs recommend AI agent-driven content production (blog posts, YouTube scripts, social media). Could drive organic traffic.
**Options**: Build in-house automation, use external tools, or manual for now
**Priority**: Medium (growth)
