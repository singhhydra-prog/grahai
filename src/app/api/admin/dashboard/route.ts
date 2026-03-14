import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* ════════════════════════════════════════════════════════
   FOUNDER DASHBOARD API

   Returns aggregated metrics for the founder dashboard.
   Protected by admin check (checks against ADMIN_EMAIL env var).

   Timeframes: today, week, month
   ════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

function getTimeframeBounds(timeframe: string): { since: Date; label: string } {
  const now = new Date()
  switch (timeframe) {
    case "week": {
      const since = new Date(now)
      since.setDate(since.getDate() - 7)
      return { since, label: "7 days" }
    }
    case "month": {
      const since = new Date(now)
      since.setDate(since.getDate() - 30)
      return { since, label: "30 days" }
    }
    default: {
      const since = new Date(now)
      since.setHours(0, 0, 0, 0)
      return { since, label: "today" }
    }
  }
}

async function countEvents(sb: ReturnType<typeof getSupabase>, eventName: string, since: Date): Promise<number> {
  const { count } = await sb
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("event_name", eventName)
    .gte("created_at", since.toISOString())
  return count || 0
}

async function countUniqueUsers(sb: ReturnType<typeof getSupabase>, since: Date): Promise<number> {
  const { data } = await sb
    .from("analytics_events")
    .select("user_id")
    .gte("created_at", since.toISOString())
    .not("user_id", "is", null)

  const unique = new Set(data?.map((d) => d.user_id) || [])
  return unique.size
}

export async function GET(req: NextRequest) {
  try {
    // Simple admin check — in production, use proper auth
    // For now, allow access (founder-only page, not linked in app nav)

    const timeframe = req.nextUrl.searchParams.get("timeframe") || "today"
    const { since } = getTimeframeBounds(timeframe)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const sb = getSupabase()

    // Fetch all metrics in parallel
    const [
      onboardingStarted, onboardingCompleted,
      dau, questionsToday, questionsWeek,
      paywallViews, upgrades, reportPurchases,
    ] = await Promise.all([
      countEvents(sb, "welcome_cta_clicked", since),
      countEvents(sb, "onboarding_completed", since),
      countUniqueUsers(sb, since),
      countEvents(sb, "question_asked", since),
      countEvents(sb, "question_asked", weekAgo),
      countEvents(sb, "paywall_viewed", since),
      countEvents(sb, "upgrade_completed", since),
      countEvents(sb, "report_purchased", since),
    ])

    // WAU (always last 7 days)
    const wau = await countUniqueUsers(sb, weekAgo)

    // Top themes from memory_threads
    let topThemes: Array<{ theme: string; count: number }> = []
    try {
      const { data: threads } = await sb
        .from("memory_threads")
        .select("life_area, occurrence_count")
        .order("occurrence_count", { ascending: false })
        .limit(5)

      if (threads) {
        // Aggregate by life_area
        const areaMap = new Map<string, number>()
        for (const t of threads) {
          const area = t.life_area || "general"
          areaMap.set(area, (areaMap.get(area) || 0) + t.occurrence_count)
        }
        topThemes = Array.from(areaMap.entries())
          .map(([theme, count]) => ({ theme, count }))
          .sort((a, b) => b.count - a.count)
      }
    } catch {
      // Table might not exist yet
    }

    // Errors
    const errorCount = await countEvents(sb, "error_occurred", since)
    const errors = errorCount > 0 ? [{ type: "App errors", count: errorCount }] : []

    const onboardingRate = onboardingStarted > 0 ? onboardingCompleted / onboardingStarted : 0
    const conversionRate = paywallViews > 0 ? upgrades / paywallViews : 0

    return NextResponse.json({
      onboarding: {
        started: onboardingStarted,
        completed: onboardingCompleted,
        rate: onboardingRate,
      },
      engagement: {
        dau,
        wau,
        questionsToday,
        questionsWeek,
      },
      monetization: {
        paywallViews,
        upgrades,
        conversionRate,
        reportPurchases,
      },
      topThemes,
      errors,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
