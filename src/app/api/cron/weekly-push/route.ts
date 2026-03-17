/* ════════════════════════════════════════════════════════
   GrahAI — Weekly Push Notification Cron Job

   Runs every Sunday at 8:00 AM IST (2:30 UTC).
   Sends week-ahead summary to all subscribed users.

   Vercel cron config (vercel.json):
   { "path": "/api/cron/weekly-push", "schedule": "30 2 * * 0" }
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendBatchPush, getSupabaseAdmin } from "@/lib/push/sender"
import { createWeeklyPushContent } from "@/lib/push/content-templates"

// ─── Cron Auth ────────────────────────────────────────

function verifyCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`
  }

  const vercelCron = req.headers.get("x-vercel-cron")
  if (vercelCron === "true" && process.env.VERCEL === "1") return true

  return false
}

// ─── Get Dominant Transit for Week Ahead ───────────────
// Uses Vedic day-lord (vara) concept: each weekday has a ruling planet
// Sunday=Sun, Monday=Moon, Tuesday=Mars, Wednesday=Mercury, Thursday=Jupiter,
// Friday=Venus, Saturday=Saturn

function getDominantTransitForWeek(): {
  planet: string
  theme: string
  recommendation: string
  dasha?: string
} {
  const today = new Date()
  const weekday = today.getDay() // 0=Sunday, 1=Monday, etc.
  const month = today.getMonth() // 0=January, 11=December

  // Vedic day-lords mapped to their themes and advice
  const dayLords = [
    {
      // Sunday - Sun (day 0)
      planet: "Sun",
      theme: "Confidence & Clarity",
      recommendation: "Step into your power and lead with purpose",
      dasha: "Sun brings clarity and vitality",
    },
    {
      // Monday - Moon (day 1)
      planet: "Moon",
      theme: "Emotions & Intuition",
      recommendation: "Trust your inner wisdom and nurture emotional connections",
      dasha: "Moon supports emotional balance and receptivity",
    },
    {
      // Tuesday - Mars (day 2)
      planet: "Mars",
      theme: "Energy & Action",
      recommendation: "Channel energy into physical activity and goal-setting",
      dasha: "Mars empowers action and courage",
    },
    {
      // Wednesday - Mercury (day 3)
      planet: "Mercury",
      theme: "Communication & Mind",
      recommendation: "Engage in planning, writing, and meaningful conversations",
      dasha: "Mercury favors intellectual and communicative pursuits",
    },
    {
      // Thursday - Jupiter (day 4)
      planet: "Jupiter",
      theme: "Expansion & Growth",
      recommendation: "Pursue new opportunities in career and learning",
      dasha: "Jupiter transits support growth phases",
    },
    {
      // Friday - Venus (day 5)
      planet: "Venus",
      theme: "Harmony & Relationships",
      recommendation: "Focus on strengthening connections and creative work",
      dasha: "Venus enhances social and artistic endeavors",
    },
    {
      // Saturday - Saturn (day 6)
      planet: "Saturn",
      theme: "Discipline & Structure",
      recommendation: "Build strong foundations through sustained effort",
      dasha: "Saturn rewards patience and responsibility",
    },
  ]

  // Get base transit for today's day-lord
  const dayLordTransit = dayLords[weekday]

  // Rotate emphasis through different angles per month (deterministic)
  // This adds seasonal variation without randomness
  const monthRotation = month % 3 // 0, 1, or 2
  const emphasisAngles = [
    "personal growth",
    "relationships and community",
    "spiritual development",
  ]

  return {
    ...dayLordTransit,
    recommendation: `${dayLordTransit.recommendation} — Focus on ${emphasisAngles[monthRotation]} this week.`,
  }
}

// ─── GET Handler (Vercel Cron) ────────────────────────

export async function GET(req: NextRequest) {
  const startTime = Date.now()

  // Verify cron auth
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split("T")[0]

  let processed = 0
  let sent = 0
  let failed = 0
  const errors: Array<{ userId: string; error: string }> = []

  try {
    // Get all push subscriptions with kundli info
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select(
        `
        id,
        user_id,
        endpoint,
        keys,
        timezone,
        kundlis (
          id,
          user_id,
          name,
          is_primary
        )
      `
      )

    if (fetchError) {
      console.error("Fetch subscriptions error:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", details: String(fetchError) },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        date: today,
        processed: 0,
        sent: 0,
        failed: 0,
        reason: "No push subscriptions found",
        durationMs: Date.now() - startTime,
      })
    }

    // Filter to users who have a kundli (saved chart)
    const subsWithKundli = subscriptions.filter((sub) => {
      const kundlis = (sub as any).kundlis || []
      return Array.isArray(kundlis) && kundlis.length > 0
    })

    if (subsWithKundli.length === 0) {
      return NextResponse.json({
        success: true,
        date: today,
        processed: subscriptions.length,
        sent: 0,
        failed: 0,
        skipped: subscriptions.length,
        reason: "No subscriptions with saved kundlis",
        durationMs: Date.now() - startTime,
      })
    }

    // Get dominant transit for this week
    const transit = getDominantTransitForWeek()

    // Generate weekly push content
    const pushContent = createWeeklyPushContent({
      userName: "Friend",
      dominantPlanet: transit.planet,
      weekTheme: transit.theme,
      keyRecommendation: transit.recommendation,
      dashaPhase: transit.dasha,
    })

    // Prepare subscriptions for batch send
    const webPushSubs = subsWithKundli.map((sub) => ({
      endpoint: sub.endpoint,
      keys: sub.keys,
      user_id: sub.user_id,
    }))

    // Send batch
    const result = await sendBatchPush(webPushSubs, {
      title: pushContent.title,
      body: pushContent.body,
      url: pushContent.url,
      tag: pushContent.tag,
    })

    processed = subsWithKundli.length
    sent = result.sent
    failed = result.failed

    if (result.errors.length > 0) {
      errors.push(
        ...result.errors.slice(0, 10).map((err) => ({
          userId: "unknown",
          error: `${err.endpoint}: ${err.error}`,
        }))
      )
    }

    // Log cron execution
    try {
      await supabase.from("cron_logs").insert({
        job_name: "weekly_push",
        date: today,
        processed,
        emailed: sent,
        errors: failed,
        duration_ms: Date.now() - startTime,
      })
    } catch (logErr) {
      console.error("Cron log insert error:", logErr)
    }

    return NextResponse.json({
      success: true,
      date: today,
      processed,
      sent,
      failed,
      dominantTransit: transit.planet,
      weekTheme: transit.theme,
      errors: errors.length > 0 ? errors : "No errors",
      durationMs: Date.now() - startTime,
    })
  } catch (error) {
    console.error("Weekly push cron fatal error:", error)
    return NextResponse.json(
      {
        error: "Cron job failed",
        details: String(error),
      },
      { status: 500 }
    )
  }
}
