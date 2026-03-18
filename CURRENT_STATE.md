# CURRENT_STATE — GrahAI

**Last updated:** 2026-03-18 (Session 4)

## Project Overview
GrahAI is a Vedic astrology web app built with Next.js App Router + TypeScript. Uses Swiss Ephemeris (sweph native module, Moshier mode) for real planetary calculations. Supabase for auth/profiles, Razorpay for payments. Chat powered by MiniMax M1 API (OpenAI-compatible). All daily horoscope/report content generated via pure code (no AI API).

## What Changed This Session

### 1. Chat Engine: Anthropic → MiniMax M1
- Rewrote `src/app/api/chat/route.ts` — removed `@anthropic-ai/sdk` dependency
- Uses raw `fetch()` to `https://api.minimax.io/v1/chat/completions`, model `MiniMax-M1`
- Tool format conversion: Anthropic `input_schema` → OpenAI `parameters` via `convertToolsToOpenAI()`
- GrahAI tone rules + word limits (from OUTPUT_VOICE_RULES.md) injected into every system prompt
- Same SSE event format (`sseEvent()`) — frontend AskTab needs zero changes
- **STATUS**: Code deployed, but MiniMax account has insufficient balance (needs top-up)

### 2. Zero Generic Outputs — 27 Patterns Fixed
Every user-visible text output now uses birth chart data:

**Core Engine (insight-generator.ts):**
- `DASHA_THEMES` → uses natal chart house lordship + dignity per user
- `BPHS_DAILY_VERSES` → seeded by mahadasha + nakshatra (not day-of-year)
- `selectDailyRemedy()` → prioritizes user's weakest/debilitated planet
- `generateHeadline()` → birth-data-hashed, user-specific rotation
- `getActivityRecommendations()` → per-dasha + per-house + per-antardasha activities

**Transit Engine (transit-engine.ts):**
- `TRANSIT_HOUSE_EFFECTS` → checks natal planets in transit house + dignity
- `checkSadeSati()` → Moon strength + Gaja Kesari yoga detection

**Daily Horoscope API (daily-horoscope/route.ts):**
- Theme titles → 30 templates (10 per trend), user-specific hash seed
- Headlines → 5 varied templates with nakshatra/house/dasha woven in
- Categories (wealth/love/career/self) → dedicated chart-specific generators
- Action/Caution → dasha lord activities + moon house activities
- Lucky elements → seed includes birthDate + dasha + moonHouse
- Auspicious time → lat/lng-based sunrise/sunset calculation

**Other Routes:**
- cosmic-snapshot → moon-sign-specific vibes, element + nakshatra + life path cross-reference
- ask-one-question → house lord per category, deterministic verse selection
- Push notifications → dasha lord + moon sign templating

**Frontend Components:**
- MyChartTab strengths → nakshatra + ruling planet + moon/rising combo
- OnboardingFlow fallback → partial reading from birth date (sun sign + life path)
- DailyInsightPage → clean error states, no fake guidance

### 3. Home Page Hero Redesign
- Lucky elements moved to TOP of hero
- Vedic/Western toggle + sign chips moved from Profile → Home
- Kundli birth chart added to Home (localStorage cache → API fallback)
- Chart removed from Profile tab
- Expanded colour map (20+ colours)

### 4. Onboarding Flow Rewrite
- Page 1: Splash — GrahAI logo (5rem/6rem) + "Your Stars, Your Path" + language dropdown
- Page 2: Trust cards — Swiss Ephemeris/NASA credibility, BPHS/Saravali/Phaladeepika
- Page 3: "What brings you here today?" — compact mobile layout
- Pages 4-6: Birth details → Reveal → First question (unchanged)
- Mobile-optimized: `justify-start`, compact buttons, brighter text

### 5. Design System
- Text brightness: `--color-text-secondary` #ACB8C4 → #C8D0DA, `--color-text-dim` #8892A3 → #A0AAB8
- Applied across OnboardingFlow + HomeTab

### 6. Security & Bug Fixes
- Payment verify: plan ID queried from Razorpay API (not client header)
- Weekly/monthly cron: Vedic day-lord / solar ingress calendar (not Math.random)
- Silent catch blocks fixed across 5 components
- HomeTab chart fetch: fixed wrong API format (was sending `reportType: "birth-chart"` with flat params)

## Current Architecture
- `BirthData` (client): `timezone?: string` — IANA string
- `BirthDetails` (server): `timezone: number` — numeric UTC offset
- `resolveTimezoneOffset()` bridges the gap everywhere
- Chat: MiniMax M1 via OpenAI-compatible API
- Daily horoscope: pure code (Swiss Ephemeris + transit/dasha/panchang engines)
- Reports: pure code via `generate-code` route, Claude via `generate-typed` route

## Live Status
- TypeScript: zero errors
- All 27 generic output patterns eliminated
- Chart on Home: loads from localStorage cache (set by Profile or HomeTab API call)
- Onboarding: 6 steps (splash → trust → intent → birth → reveal → first question)

## To Deploy
```
cd "C:\Users\vijas\OneDrive\Desktop\AstraAI\grahai"
git add -A
git commit -m "v3.0: MiniMax chat + zero generic outputs + home hero redesign + onboarding rewrite"
git push
```
