# OPEN QUESTIONS — GrahAI

---

## OQ-1: WeeklyGuidancePage catch block still has hardcoded fallback
**Priority**: Low
**Why it matters**: DailyInsightPage was updated to show an error state on failure, but WeeklyGuidancePage (lines 218-231) still falls back to generic hardcoded section data. Inconsistent UX.
**Status**: Not started
**Next action**: Replace catch block with error state UI similar to DailyInsightPage
**Note**: This only triggers on network/parsing errors, not the timezone bug (which is fixed at API level). Low priority since it's a graceful degradation.

---

## OQ-2: KundliChart SAMPLE_PLANETS export still exists
**Priority**: Low
**Why it matters**: `src/components/ui/KundliChart.tsx` still exports `SAMPLE_PLANETS` but nothing imports it anymore. Dead code.
**Status**: Not started
**Next action**: Remove export to clean up codebase

---

## OQ-3: End-to-end verification on deployed app
**Priority**: HIGH
**Why it matters**: The timezone fix has been committed but not pushed/deployed. Need to verify on live app that daily horoscope returns `personalized: true`.
**Status**: Blocked on git push
**Next action**: After push, test with a real user account (Harendra Singh, 12 Oct 1990, 06:30 AM, Mumbai). Check API response for `personalized: true` field.

---

## OQ-4: Template fallback system — should it be more visible?
**Priority**: Medium
**Why it matters**: The daily-horoscope API silently falls back to template output when personalized generation fails. This made the timezone bug invisible for a long time. Consider adding logging or a response flag like `fallbackReason: "ephemeris_error"`.
**Status**: Not started
**Next action**: Add structured error logging in the catch block of the personalized generation path
