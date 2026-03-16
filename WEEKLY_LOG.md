# WEEKLY LOG — GrahAI

---

## Week of 2026-03-16

### Focus
Eliminating all hardcoded/mocked data and fixing personalization — making GrahAI generate real, per-user Vedic astrology outputs based on actual birth details.

### Progress
- **All hardcoded data removed**: CompatibilityTab fake scores, ProfileTab SAMPLE_PLANETS, DailyInsightPage fake fallback, AskTab generic suggestions, OnboardingFlow fake snapshot → all replaced with real API calls or proper error states
- **Root cause found and fixed**: IANA timezone strings (e.g. "Asia/Kolkata") caused `NaN` in ephemeris calculations, silently falling back to generic template output for every user. Added `resolveTimezoneOffset()` to all 3 API routes.
- **Real data generated**: All GrahAI outputs (natal chart, 6 report types, kundli match, daily insight) generated with real birth data via Swiss Ephemeris
- **Notion template created**: Comprehensive real-output template page in Notion with all GrahAI outputs for Harendra Singh's birth data
- **TypeScript clean**: `tsc --noEmit` passes with zero errors

### Blockers
- Git push pending — commit `9dc1db1` exists locally but hasn't been pushed to GitHub/Vercel. User needs to push manually.
- No live verification yet — can't test deployed app until push happens.

### Key Decisions
- Timezone conversion centralized at server (API routes), not client components
- `hasFullBirthData` relaxed to require only lat/lng, not timezone
- Swiss Ephemeris Moshier mode — no API key needed for calculations

### Next Priorities
1. **Push and deploy** — `git push origin main` from local machine
2. **Live verification** — test daily horoscope returns `personalized: true` with real birth data
3. **Clean up remaining issues** — WeeklyGuidancePage catch fallback, dead SAMPLE_PLANETS export, add structured error logging to template fallback system
