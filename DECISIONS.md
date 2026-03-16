# DECISIONS — GrahAI

Append-only log of architectural and implementation decisions.

---

## 2026-03-16: Timezone conversion at server level, not client

**Decision**: All IANA-to-numeric timezone conversion happens in API routes, not frontend components.

**Reason**: The `BirthData` type stores timezone as `string` (IANA like "Asia/Kolkata"). Multiple frontend components were independently doing `parseFloat(timezone)` which always returns NaN for IANA strings. Centralizing conversion in the 3 API routes (`daily-horoscope`, `generate-code`, `generate-typed`) means:
- Single source of truth for conversion logic
- Frontend simply passes raw timezone value
- No risk of different components converting differently

**Alternatives considered**:
- Change `BirthData.timezone` type to `number` — too invasive, breaks existing stored data in localStorage and Supabase profiles
- Add a client-side utility function — still duplicates logic, and some components pass timezone to APIs that could handle it

**Impact**: 5 files changed. All personalized horoscope/report generation now works with IANA timezone strings.

---

## 2026-03-16: hasFullBirthData check relaxed (no timezone requirement)

**Decision**: `hasFullBirthData` in daily-horoscope route now checks only `latitude && longitude`, not `timezone !== undefined`.

**Reason**: Timezone is always resolvable via `resolveTimezoneOffset()` with a default of 5.5 (IST). Requiring timezone in the check meant that even when lat/lng were available, a missing or malformed timezone would skip personalization entirely.

**Impact**: More users get personalized horoscopes even if timezone data is incomplete.

---

## Previous sessions (from context summary):

### Hardcoded data removal
- Removed `SAMPLE_PLANETS` import from ProfileTab — now fetches real chart data from API
- Removed fake compatibility scores from CompatibilityTab — now calls `/api/reports/generate-code` with `reportType: "kundli-match"`
- Removed fake fallback data from DailyInsightPage — shows error state instead
- OnboardingFlow fallback snapshot changed from fake signs to "Calculating..." placeholders
- AskTab topic chips made chart-context-aware from localStorage cosmic snapshot

### Tech stack
- Swiss Ephemeris with Moshier mode — no external API key needed for planetary calculations
- Claude API used ONLY for chat responses and typed report generation, NOT for daily horoscopes or code-based reports
- Supabase for auth/profiles, Razorpay for payments
