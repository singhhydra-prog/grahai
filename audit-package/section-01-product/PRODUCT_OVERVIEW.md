# Section 1 — Product Overview

## What GrahAI Is

GrahAI is a Vedic astrology PWA (Progressive Web App) that provides personalized Jyotish readings, reports, and daily guidance using a combination of real Swiss Ephemeris calculations and AI interpretation (Claude Sonnet 4).

**Live URL:** https://grahai.vercel.app
**Platform:** Mobile-first web app (no native apps yet)
**Stage:** Early product — core engine working, some flows mocked

## Target User

- Primary: Indian millennials (25-40) curious about Vedic astrology
- Secondary: NRI diaspora seeking Jyotish guidance in English
- Tertiary: Astrology-curious users globally

## Core User Journeys

1. **Onboarding → First Insight**: Enter birth details → get cosmic snapshot → see daily horoscope
2. **Ask a Question**: Type any life question → receive structured 7-section Vedic answer (streamed)
3. **Generate Report**: Select report type → system calculates chart → generates personalized PDF/text
4. **Check Compatibility**: Enter partner details → get compatibility score (CURRENTLY MOCKED)
5. **Daily Ritual**: Open app → see daily horoscope + lucky elements → act on guidance

## Main Features & Status

| Feature | Status | Notes |
|---------|--------|-------|
| Birth chart calculation | LIVE | Real Swiss Ephemeris, Lahiri ayanamsa |
| Daily horoscope | LIVE | Real API, real calculations |
| AI chat (ask anything) | LIVE | Claude Sonnet 4 streaming, 28-agent system |
| 7 typed reports | LIVE | Code-based generators + optional AI enhancement |
| PDF kundli report | LIVE | Real chart data → PDF → Supabase storage |
| Compatibility matching | MOCKED | Returns hardcoded score 76, fake 2.5s delay |
| Gamification (XP/streaks) | LIVE | Real Supabase tracking |
| Razorpay payments | PARTIAL | Real integration, but env-var dependent; price discrepancy found |
| Legal pages (6) | LIVE | Full content, all linked |
| Saved library | MOCKED | UI only, hardcoded data |
| Billing history | MOCKED | UI only, hardcoded transactions |
| Weekly guidance | PARTIAL | Real API for theme, hardcoded structure |
| Google Analytics | NOT IMPLEMENTED | No GA4, no event tracking in frontend |
| Landing page | NOT IMPLEMENTED | Root "/" just redirects to /app |

## Paid vs Free

| Tier | Price | What's Unlocked |
|------|-------|-----------------|
| Free | ₹0 | 1 question/day, daily horoscope, birth chart overview |
| Graha | ₹199/mo | 30 questions/mo, career + wealth reports, saved history |
| Rishi | ₹499/mo | Unlimited questions, all reports, compatibility, priority insights |
| One-time packs | ₹299–599 | Individual reports without subscription |

## Environments

| Environment | URL | Status |
|-------------|-----|--------|
| Production | https://grahai.vercel.app | LIVE |
| Staging | None | NOT SET UP |
| Local dev | localhost:3000 | Works with `npm run dev` |

## Known Limitations

1. **No landing page** — root URL redirects to app shell immediately
2. **Compatibility is 100% mocked** — no real calculations despite UI
3. **Library and Billing are mocked** — show hardcoded data
4. **No analytics** — zero GA4, no event tracking
5. **Payment price discrepancy** — API charges differ from UI display (₹199 shown, ₹499 charged for Graha)
6. **Report coordinates hardcoded** — catalog sends Delhi coords regardless of user location
7. **No staging environment** — changes go straight to production
8. **No automated tests in CI** — tests exist but no CI pipeline
