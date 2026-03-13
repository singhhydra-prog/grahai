/* ════════════════════════════════════════════════════════
   GrahAI — Monthly Push Notification Cron Job

   Runs on the 1st of each month at 9:00 AM IST (3:30 UTC).
   Sends month-ahead overview with dasha and transit context.

   Vercel cron config (vercel.json):
   { "path": "/api/cron/monthly-push", "schedule": "30 3 1 * *" }
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendBatchPush, getSupabaseAdmin } from "@/lib/push/sender"
import { createMonthlyPushContent } from "@/lib/push/content-templates"

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

// ─── Get Month Name ───────────────────────────────────

function getMonthName(): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[new Date().getMonth()]
}

// ─── Determine Major Transit for Month ──────────────────

function getMajorTransitForMonth(): {
  dasha: string
  transit: string
  theme: string
  advice: string
} {
  // Simplified — in production, this would check ephemeris for actual
  // Saturn, Jupiter, Rahu/Ketu ingresses this month

  const dayOfMonth = new Date().getDate()

  const monthlyTransits = [
    {
      dasha: "Sun-Mercury Period",
      transit: "Mercury in Aquarius",
      theme: "Intellectual Growth",
      advice:
        "Embrace learning and communication — this is a month for sharing ideas",
    },
    {
      dasha: "Sun-Venus Period",
      transit: "Venus in Pisces",
      theme: "Harmony & Creativity",
      advice:
        "Nurture relationships and creative pursuits — magic happens in connection",
    },
    {
      dasha: "Moon-Mercury Period",
      transit: "Mercury Retrograde",
      theme: "Reflection & Review",
      advice:
        "Revisit past projects, clarify intentions, and plan for the future",
    },
    {
      dasha: "Mars-Sun Period",
      transit: "Mars in Aries",
      theme: "Courage & Action",
      advice: "Channel your energy into bold moves and pioneering ventures",
    },
    {
      dasha: "Jupiter-Venus Period",
      transit: "Venus enters Taurus",
      theme: "Abundance & Stability",
      advice:
        "Focus on building solid foundations in finance and relationships",
    },
    {
      dasha: "Saturn-Mercury Period",
      transit: "Saturn in Pisces",
      theme: "Discipline & Spiritual Growth",
      advice:
        "Practice patience and long-term vision — steady effort yields results",
    },
  ]

  return monthlyTransits[
    (dayOfMonth + new Date().getMonth()) % monthlyTransits.length
  ]
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
  const monthName = getMonthName()

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

    // Get dominant dasha and transit info
    const transitInfo = getMajorTransitForMonth()

    // Generate monthly push content
    const pushContent = createMonthlyPushContent({
      userName: "Friend",
      monthName,
      dominantDasha: transitInfo.dasha,
      majorTransit: transitInfo.transit,
      monthTheme: transitInfo.theme,
      keyAdvice: transitInfo.advice,
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
        job_name: "monthly_push",
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
      month: monthName,
      processed,
      sent,
      failed,
      dominantDasha: transitInfo.dasha,
      majorTransit: transitInfo.transit,
      theme: transitInfo.theme,
      errors: errors.length > 0 ? errors : "No errors",
      durationMs: Date.now() - startTime,
    })
  } catch (error) {
    console.error("Monthly push cron fatal error:", error)
    return NextResponse.json(
      {
        error: "Cron job failed",
        details: String(error),
      },
      { status: 500 }
    )
  }
}
