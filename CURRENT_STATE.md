# CURRENT_STATE — GrahAI

**Last updated:** 2026-03-16 04:33 UTC

## Project Overview
GrahAI is a Vedic astrology web app built with Next.js App Router + TypeScript. Uses Swiss Ephemeris (sweph native module, Moshier mode) for real planetary calculations. Supabase for auth/profiles, Razorpay for payments, Claude API for chat + typed reports only.

## What Changed This Session
**Critical bug fix: IANA timezone → NaN crashing personalized horoscopes**

- **Root cause**: `BirthData.timezone` (client type in `src/types/app.ts`) stores IANA strings like `"Asia/Kolkata"`. The ephemeris engine expects numeric UTC offsets (e.g. `5.5`). `Number("Asia/Kolkata")` = `NaN` → `generateDailyInsight()` crashes silently → API falls back to generic template output for ALL users.
- **Fix applied to 5 files**:
  1. `src/app/api/daily-horoscope/route.ts` — added `resolveTimezoneOffset()` function (IANA → numeric), changed `hasFullBirthData` to check only lat/lng (not timezone)
  2. `src/app/api/reports/generate-code/route.ts` — added `resolveTimezoneOffset()` + `normalizeBirthDetails()` wrapper
  3. `src/app/api/reports/generate-typed/route.ts` — added inline `resolveTz()` function
  4. `src/components/app/tabs/CompatibilityTab.tsx` — removed `parseFloat(timezone)`, passes raw value
  5. `src/components/app/tabs/ProfileTab.tsx` — removed `parseFloat(timezone)`, passes raw value

## Current Commit
- `9dc1db1` on `main` — "fix: resolve IANA timezone string causing non-personalized horoscopes"
- **NOT PUSHED** — git credentials not available in this environment. User needs to run `git push origin main` from `C:\Users\vijas\OneDrive\Desktop\AstraAI\grahai`

## Blockers
- **Push pending**: Commit exists locally but hasn't been pushed to GitHub/Vercel yet.

## Live Status
- TypeScript compiles cleanly (`tsc --noEmit` exit 0)
- All 3 API routes handle IANA timezone strings correctly
- No `parseFloat(timezone)` or `Number(timezone)` remains in frontend components
- WeeklyGuidancePage verified — passes raw timezone, server handles conversion

## Next Steps
1. Push commit to trigger Vercel deploy
2. Test on live app: create account with birth details → verify daily horoscope shows `personalized: true` in API response
3. Check WeeklyGuidancePage catch block (lines 218-231) still has generic fallback data — consider replacing with error state for consistency with DailyInsightPage
4. Full end-to-end test of all 6 report types + kundli match with real birth data

## Resume Point
**Commit `9dc1db1` needs to be pushed.** After push, verify on deployed app that daily horoscope returns personalized content (check `personalized: true` in API response JSON). If still generic, add console.log in `daily-horoscope/route.ts` inside the `hasFullBirthData` block to trace the exact failure point.

## Key Architecture Notes
- `BirthData` (client, `src/types/app.ts`): `timezone?: string` — IANA string like "Asia/Kolkata"
- `BirthDetails` (server, ephemeris): `timezone: number` — numeric UTC offset like 5.5
- `resolveTimezoneOffset()` bridges this gap in all 3 API routes
- `LocationSearch.tsx` provides `CityData.tz` as IANA string — this is where the IANA strings originate
- Daily horoscope has a template fallback system that silently catches ephemeris errors — makes debugging hard because the app "works" but shows generic content
