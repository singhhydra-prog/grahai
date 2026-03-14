import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics/tracker"

/* ════════════════════════════════════════════════════════
   ANALYTICS API — Client-side event tracking endpoint
   POST /api/analytics
   Body: { event: string, payload?: object }
   ════════════════════════════════════════════════════════ */

const VALID_EVENTS: Set<string> = new Set([
  "welcome_cta_clicked", "intent_selected", "birth_details_completed",
  "chart_generated", "instant_reveal_viewed", "first_question_asked",
  "onboarding_completed", "onboarding_skipped",
  "answer_viewed", "source_opened", "follow_up_clicked",
  "home_opened", "ask_tab_opened", "chart_tab_opened", "reports_tab_opened",
  "question_asked", "question_saved",
  "report_detail_viewed", "report_generated", "report_downloaded",
  "paywall_viewed", "upgrade_started", "upgrade_completed",
  "report_purchased", "payment_failed",
  "notification_opened", "streak_incremented",
  "daily_insight_viewed", "weekly_digest_viewed", "app_opened",
  "error_occurred",
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, payload, sessionId } = body

    if (!event || !VALID_EVENTS.has(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 })
    }

    // Try to get authenticated user (optional — anonymous events allowed)
    let userId: string | null = null
    try {
      const sb = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return req.cookies.getAll() },
            setAll() { /* API route */ },
          },
        }
      )
      const { data: { user } } = await sb.auth.getUser()
      userId = user?.id || null
    } catch {
      // Anonymous event — that's fine
    }

    // Fire-and-forget tracking
    await trackEvent(
      event as AnalyticsEvent,
      userId,
      payload || {},
      sessionId
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
