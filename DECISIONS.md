# DECISIONS — GrahAI

Append-only log of architectural and implementation decisions.

---

## 2026-03-18: Chat engine switched from Anthropic Claude to MiniMax M1

**Decision**: Replace `@anthropic-ai/sdk` with raw `fetch()` to MiniMax OpenAI-compatible API.

**Reason**: User provided MiniMax API key. MiniMax M1 supports streaming SSE and function calling in OpenAI format. Cheaper than Claude for high-volume chat.

**Implementation**:
- Tool definitions converted from Anthropic `input_schema` to OpenAI `parameters` via `convertToolsToOpenAI()`
- Tool-use loop uses sync calls (`callMiniMaxSync`) for reliability, up to 5 rounds
- System prompt composition: `agentPrompt + subAgentAugment + GRAHAI_TONE_RULES + wordGuide + memoryContext`
- Same SSE event format preserved — frontend needs zero changes

**Risk**: MiniMax account needs balance. Anthropic key kept in `.env.local` as `ANTHROPIC_API_KEY` for fallback if needed.

---

## 2026-03-18: All text generation must use birth chart data — zero generic outputs

**Decision**: Every user-visible text output must incorporate birth chart specifics. No static dictionaries keyed only by planet name or element.

**Reason**: Audit found 27 generic patterns where personalized data was computed but thrown away at the text generation layer. Users with same dasha/trend/element saw identical text.

**Implementation**:
- `getDashaInterpretation()` now accepts `NatalChart` — uses house lordship + dignity
- `selectDailyRemedy()` now accepts `NatalChart` — finds weakest planet first
- `generateThemeTitle()` seeds with `hash(date + birthDate + dasha + moonSign + house)`
- Category generators check specific transit houses, not just planet name
- Lucky elements seed includes birth data, not just date

**Impact**: 20+ files modified, 470+ lines changed across engine, API, and components.

---

## 2026-03-18: Kundli chart moved from Profile to Home hero

**Decision**: Birth chart (Kundli diamond) displayed on Home tab hero section, removed from Profile.

**Reason**: Home is the primary screen users see. The chart is the core identity of a Vedic astrology app — it should be front and center, not buried in Profile.

**Implementation**: HomeTab loads chart data from `localStorage("grahai-chart-cache")` first (instant), falls back to `/api/reports/generate-code` API. ProfileTab caches chart data after successful fetch.

---

## 2026-03-18: Onboarding flow restructured to 6 steps

**Decision**: New step order: Splash → Trust → Intent → Birth → Reveal → First Question

**Reason**: Previous flow had language as step 0 with a full grid, then welcome+trust merged into step 1. New flow leads with brand impact (big logo + tagline), then trust credibility, then intent.

**Implementation**: STEPS array rewritten, all step number references updated, language selection moved to dropdown on splash page.

---

## 2026-03-18: Payment verify queries Razorpay API for plan ID

**Decision**: Plan ID determined from Razorpay order notes (server-side), not client `x-plan-id` header.

**Reason**: Client header is spoofable — user could pay for "plus" tier but set header to "premium". Now the server queries `razorpay.orders.fetch(order_id)` and reads `notes.plan_id`.

**Fallback**: If Razorpay fetch fails (missing `RAZORPAY_KEY_ID`), falls back to header with security warning logged.

---

## 2026-03-18: Text brightness increased globally

**Decision**: CSS theme variables `--color-text-secondary` from #ACB8C4 → #C8D0DA, `--color-text-dim` from #8892A3 → #A0AAB8.

**Reason**: Dark theme text was too dim on mobile screens. Applied across OnboardingFlow and HomeTab via bulk replace.

---

## Previous Decisions (Sessions 1-3)

### 2026-03-16: Timezone conversion at server level, not client
All IANA-to-numeric timezone conversion happens in API routes via shared `resolveTimezoneOffset()`.

### 2026-03-16: hasFullBirthData check relaxed (no timezone requirement)
Only requires `latitude && longitude`. Timezone always resolvable with IST default.

### Previous: Hardcoded data removal
- Removed SAMPLE_PLANETS, fake compatibility scores, fake fallback data
- OnboardingFlow fallback changed from fake signs to "Calculating..." (now further improved to partial reading)
- AskTab topic chips made chart-context-aware
