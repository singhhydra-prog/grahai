# CURRENT_STATE — GrahAI

**Last updated:** 2026-03-16 (Session 3)

## Project Overview
GrahAI is a Vedic astrology web app built with Next.js App Router + TypeScript. Uses Swiss Ephemeris (sweph native module, Moshier mode) for real planetary calculations. Supabase for auth/profiles, Razorpay for payments, Claude API for chat + typed reports only.

## What Changed This Session

### 1. Dead code cleanup
- Removed `generateTodayTheme()` (~60 lines) and `generateCategoryInsights()` (~60 lines) from `daily-horoscope/route.ts` — these were only used by the template fallback path that was removed in commit `811c347`
- Removed `getApproxMoonLongitude()` and `calculateRahuKaal()` — dead after template removal
- Removed unused imports: `NAKSHATRAS`, `NAKSHATRA_SPAN`, `DAY_LORDS`, `PLANET_SANSKRIT` from daily-horoscope route

### 2. Final hardcoded fallback elimination
- Changed `placeOfBirth || "India"` → `placeOfBirth || "Unknown"` in daily-horoscope response
- Replaced inline `resolveTz()` in `astrology-tools.ts` with shared `resolveTimezoneOffset()` from `timezone-utils.ts`
- Replaced hardcoded fallback day names in WeeklyGuidancePage (`|| "Wednesday"`, `|| "Tuesday"` etc.) with `|| "—"`
- Replaced generic filler text for unavailable days with "Forecast unavailable for this day"

### 3. Full app audit confirmed
- Zero `personalized: false` paths remain
- Zero mock/sample data arrays in any component
- Zero `|| "Aries"`, `|| "12:00"`, `|| "Ashwini"` silent defaults in API routes
- All timezone conversion uses shared `resolveTimezoneOffset()` utility
- WeeklyGuidancePage properly shows error UI when API returns errors

## Commits on main (recent)
- `811c347` — "fix: eliminate all silent fallbacks — return errors for missing data"
- Pending: dead code cleanup + final hardcoded fallback fixes (this session)

## Current Architecture
- `BirthData` (client, `src/types/app.ts`): `timezone?: string` — IANA string like "Asia/Kolkata"
- `BirthDetails` (server, ephemeris): `timezone: number` — numeric UTC offset like 5.5
- `resolveTimezoneOffset()` in `src/lib/timezone-utils.ts` bridges the gap everywhere
- Daily horoscope API: returns real chart-based data or explicit error — NO template fallback
- All API routes validate required fields and return specific error codes

## Live Status
- TypeScript compiles cleanly (`tsc --noEmit` exit 0)
- All API routes handle IANA timezone strings correctly
- WeeklyGuidancePage shows error UI with retry for API failures
- BillingHistory, SavedLibrary use empty state UIs (no mock data)
- MyChartTab shows "—" placeholders until real data loads

## To Deploy
User needs to push from local machine:
```
cd C:\Users\vijas\OneDrive\Desktop\AstraAI\grahai
git push origin main
```
