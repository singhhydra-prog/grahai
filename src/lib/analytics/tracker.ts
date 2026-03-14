import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   ANALYTICS EVENT TRACKER

   Lightweight event tracking for founder dashboard.
   Tracks all events from Section 8 Module I:
   - Onboarding funnel
   - Engagement events
   - Monetization events
   - Retention signals

   Server-side: uses service role key
   Client-side: fire-and-forget via /api/analytics endpoint
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   EVENT NAMES — Typed event catalog
   ──────────────────────────────────────────────────── */
export type AnalyticsEvent =
  // Onboarding funnel
  | "welcome_cta_clicked"
  | "intent_selected"
  | "birth_details_completed"
  | "chart_generated"
  | "instant_reveal_viewed"
  | "first_question_asked"
  | "onboarding_completed"
  | "onboarding_skipped"
  // Engagement
  | "answer_viewed"
  | "source_opened"
  | "follow_up_clicked"
  | "home_opened"
  | "ask_tab_opened"
  | "chart_tab_opened"
  | "reports_tab_opened"
  | "question_asked"
  | "question_saved"
  // Reports
  | "report_detail_viewed"
  | "report_generated"
  | "report_downloaded"
  // Monetization
  | "paywall_viewed"
  | "upgrade_started"
  | "upgrade_completed"
  | "report_purchased"
  | "payment_failed"
  // Retention
  | "notification_opened"
  | "streak_incremented"
  | "daily_insight_viewed"
  | "weekly_digest_viewed"
  | "app_opened"
  // System
  | "error_occurred"

/* ────────────────────────────────────────────────────
   TRACK EVENT — Server-side (service role)
   ──────────────────────────────────────────────────── */
export async function trackEvent(
  eventName: AnalyticsEvent,
  userId?: string | null,
  payload: Record<string, unknown> = {},
  sessionId?: string
): Promise<void> {
  try {
    const sb = getSupabase()
    await sb.from("analytics_events").insert({
      event_name: eventName,
      user_id: userId || null,
      session_id: sessionId || null,
      payload_json: payload,
    })
  } catch (err) {
    // Never block the user flow for analytics
    console.warn("Analytics track failed:", err)
  }
}

/* ────────────────────────────────────────────────────
   BATCH TRACK — Multiple events at once
   ──────────────────────────────────────────────────── */
export async function trackEvents(
  events: Array<{
    eventName: AnalyticsEvent
    userId?: string | null
    payload?: Record<string, unknown>
    sessionId?: string
  }>
): Promise<void> {
  try {
    const sb = getSupabase()
    await sb.from("analytics_events").insert(
      events.map((e) => ({
        event_name: e.eventName,
        user_id: e.userId || null,
        session_id: e.sessionId || null,
        payload_json: e.payload || {},
      }))
    )
  } catch (err) {
    console.warn("Analytics batch track failed:", err)
  }
}

/* ────────────────────────────────────────────────────
   QUERY HELPERS — For founder dashboard
   ──────────────────────────────────────────────────── */

export async function getEventCount(
  eventName: AnalyticsEvent,
  since?: Date
): Promise<number> {
  const sb = getSupabase()
  let query = sb
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("event_name", eventName)

  if (since) {
    query = query.gte("created_at", since.toISOString())
  }

  const { count } = await query
  return count || 0
}

export async function getConversionRate(
  startEvent: AnalyticsEvent,
  endEvent: AnalyticsEvent,
  since?: Date
): Promise<{ startCount: number; endCount: number; rate: number }> {
  const [startCount, endCount] = await Promise.all([
    getEventCount(startEvent, since),
    getEventCount(endEvent, since),
  ])

  return {
    startCount,
    endCount,
    rate: startCount > 0 ? endCount / startCount : 0,
  }
}

export async function getDailyActiveUsers(since?: Date): Promise<number> {
  const sb = getSupabase()
  const sinceDate = since || new Date(Date.now() - 24 * 60 * 60 * 1000)

  const { data } = await sb
    .from("analytics_events")
    .select("user_id")
    .gte("created_at", sinceDate.toISOString())
    .not("user_id", "is", null)

  // Count unique user_ids
  const uniqueUsers = new Set(data?.map((d) => d.user_id) || [])
  return uniqueUsers.size
}

/* ────────────────────────────────────────────────────
   CLIENT-SIDE HELPER — For use in browser
   Posts to /api/analytics endpoint
   ──────────────────────────────────────────────────── */
export function trackClientEvent(
  eventName: AnalyticsEvent,
  payload: Record<string, unknown> = {}
): void {
  // Fire-and-forget — don't await, don't block UI
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: eventName, payload }),
  }).catch(() => {
    // Silently fail — analytics should never interrupt UX
  })
}
