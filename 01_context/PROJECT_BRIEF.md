# GrahAI — Project Brief

## What Is GrahAI?

GrahAI is an AI-powered Vedic astrology platform that generates personalized astrological reports, daily insights, and guidance using Swiss Ephemeris calculations and code-based interpretation engines. It covers four verticals: **Astrology**, **Numerology**, **Tarot**, and **Vastu Shastra**.

## Business Model

- **Free tier**: Birth chart + basic daily horoscope
- **Paid reports** (₹199–₹999 / $5–$15): 7 specialized report types
- **Subscription** (planned): Monthly transit + guidance package
- **Target market**: India (primary) + NRI (secondary)
- **Payments**: Razorpay (INR), Stripe (global, planned)

## Core Value Proposition

"3-click clarity" — User enters birth details → selects a life area → gets an instant, chart-specific Vedic analysis. No human astrologer wait times, no generic horoscopes.

## Competitive Positioning

| Astrotalk (competitor) | GrahAI (us) |
|------------------------|-------------|
| Human-expert marketplace | AI-first, self-serve |
| ₹20/min call rate | Fixed report pricing |
| 10-min avg session | Instant generation (<2s) |
| Generic chart display | Deep code-based analysis |
| Emotional human touch | Data-precise, chart-specific |

## Key Metrics to Track

- **Conversion**: Free chart → paid report purchase rate
- **Report quality**: Uniqueness % (target: >60% chart-specific content)
- **Speed**: Report generation time (target: <3s)
- **Retention**: DAU/MAU ratio, repeat report purchases
- **Revenue**: MRR, ARPU, report mix

## Tech Stack Summary

Next.js 16 (App Router) → Supabase (auth/db) → Swiss Ephemeris (calculations) → Code-based generators (reports) → Razorpay (payments) → Vercel (deploy)
