# OPEN QUESTIONS — GrahAI

---

## OQ-1: MiniMax API balance depleted — chat non-functional
**Priority**: CRITICAL
**Why it matters**: Chat is the core feature. MiniMax returns `insufficient_balance_error (1008)`. No chat responses until balance is topped up.
**Status**: Blocked on user action
**Next action**: Top up MiniMax account at platform.minimax.io OR switch back to Anthropic Claude as fallback
**Workaround**: Anthropic API key still in `.env.local` — could add fallback logic to try Anthropic when MiniMax fails

---

## OQ-2: Kundli chart may not load on Home if user hasn't visited Profile first
**Priority**: HIGH
**Why it matters**: HomeTab loads chart from `localStorage("grahai-chart-cache")` → API fallback. If localStorage is empty AND the `/api/reports/generate-code` API fails on Vercel (sweph native module), no chart shows.
**Status**: Partially fixed — HomeTab now makes its own API call with correct format
**Next action**: Test on deployed app. If chart still doesn't show, consider computing chart data during onboarding and caching it then.

---

## OQ-3: End-to-end verification on deployed app
**Priority**: HIGH
**Why it matters**: All changes are local — need to verify on live app after push. Key things to test:
1. Home page shows personalized title/headline (not generic)
2. Lucky elements at top, chart below
3. Onboarding flow: splash → trust → intent → birth → reveal → question
4. "What brings you here today?" visible and aligned on mobile
5. Trust cards show updated Swiss Ephemeris / BPHS text
**Status**: Blocked on git push
**Next action**: Push, then test on mobile browser

---

## OQ-4: Weekly/monthly cron routes still don't use per-user birth data
**Priority**: MEDIUM
**Why it matters**: Weekly and monthly push notifications use day-lord/solar-ingress (same for all users on same day). They're grounded in Vedic astronomy now, but still not personalized per-user.
**Status**: Improved but not fully personalized
**Next action**: In the cron handler, fetch each user's kundli data from Supabase and inject dasha/moon sign into the push content template.

---

## OQ-5: SAMPLE_PLANETS export still exists in KundliChart.tsx
**Priority**: LOW
**Why it matters**: Dead code. Nothing imports it.
**Status**: Not started
**Next action**: Remove export

---

## OQ-6: Anthropic SDK still imported in tool definition files
**Priority**: LOW
**Why it matters**: `@anthropic-ai/sdk` is still imported in 6 files under `src/lib/agents/tools/` for the `Anthropic.Messages.Tool` type. The chat route no longer uses it, but the type is used for tool definitions. These get converted to OpenAI format by `convertToolsToOpenAI()` at runtime.
**Status**: Works fine — just adds unused dependency weight
**Next action**: Create a local `ToolDefinition` type to replace the Anthropic type import. Low priority.
