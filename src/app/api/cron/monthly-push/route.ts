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
// Uses the Vedic solar ingress calendar: the Sun enters a new sign
// at roughly the same dates every year. Maps each ingress to dasha themes.
//
// Vedic Solar Ingress Calendar:
// Aries: ~April 14 | Taurus: ~May 15 | Gemini: ~June 15 | Cancer: ~July 16
// Leo: ~August 17 | Virgo: ~September 17 | Libra: ~October 17 | Scorpio: ~November 16
// Sagittarius: ~December 16 | Capricorn: ~January 14 | Aquarius: ~February 12 | Pisces: ~March 14

function getMajorTransitForMonth(): {
  dasha: string
  transit: string
  theme: string
  advice: string
} {
  const today = new Date()
  const month = today.getMonth() // 0=January, 11=December
  const date = today.getDate()

  // Determine which Vedic sign the Sun is currently in (transiting)
  // Using approximate ingress dates
  let vedicSign = ""
  let dashaPhase = ""
  let theme = ""
  let advice = ""

  if ((month === 0 && date >= 14) || (month === 1 && date < 12)) {
    // January 14 - February 11: Capricorn
    vedicSign = "Capricorn"
    dashaPhase = "Saturn-ruled Period"
    theme = "Discipline & Mastery"
    advice =
      "Practice patience and long-term vision — steady effort yields lasting results"
  } else if ((month === 1 && date >= 12) || (month === 2 && date < 14)) {
    // February 12 - March 13: Aquarius
    vedicSign = "Aquarius"
    dashaPhase = "Saturn-Mercury Period"
    theme = "Innovation & Intellect"
    advice =
      "Embrace new ideas and humanitarian pursuits — this is a month for pioneering thought"
  } else if ((month === 2 && date >= 14) || (month === 3 && date < 14)) {
    // March 14 - April 13: Pisces
    vedicSign = "Pisces"
    dashaPhase = "Moon-Neptune Period"
    theme = "Spirituality & Intuition"
    advice =
      "Deepen meditation and spiritual practices — trust your inner wisdom"
  } else if ((month === 3 && date >= 14) || (month === 4 && date < 15)) {
    // April 14 - May 14: Aries
    vedicSign = "Aries"
    dashaPhase = "Mars-ruled Period"
    theme = "Courage & Initiative"
    advice =
      "Channel pioneering energy into new ventures — bold action brings rewards"
  } else if ((month === 4 && date >= 15) || (month === 5 && date < 15)) {
    // May 15 - June 14: Taurus
    vedicSign = "Taurus"
    dashaPhase = "Venus-ruled Period"
    theme = "Stability & Abundance"
    advice =
      "Focus on building solid material and relationship foundations this month"
  } else if ((month === 5 && date >= 15) || (month === 6 && date < 16)) {
    // June 15 - July 15: Gemini
    vedicSign = "Gemini"
    dashaPhase = "Mercury-ruled Period"
    theme = "Communication & Connection"
    advice =
      "Engage in meaningful conversations and collaborative projects — ideas flow freely"
  } else if ((month === 6 && date >= 16) || (month === 7 && date < 17)) {
    // July 16 - August 16: Cancer
    vedicSign = "Cancer"
    dashaPhase = "Moon-ruled Period"
    theme = "Family & Emotion"
    advice =
      "Prioritize emotional security and family bonds — nurture your inner world"
  } else if ((month === 7 && date >= 17) || (month === 8 && date < 17)) {
    // August 17 - September 16: Leo
    vedicSign = "Leo"
    dashaPhase = "Sun-ruled Period"
    theme = "Confidence & Leadership"
    advice =
      "Step into your power and lead with authentic purpose — your gifts are needed"
  } else if ((month === 8 && date >= 17) || (month === 9 && date < 17)) {
    // September 17 - October 16: Virgo
    vedicSign = "Virgo"
    dashaPhase = "Mercury-ruled Period"
    theme = "Analysis & Service"
    advice =
      "Perfect your skills and serve others — attention to detail brings distinction"
  } else if ((month === 9 && date >= 17) || (month === 10 && date < 16)) {
    // October 17 - November 15: Libra
    vedicSign = "Libra"
    dashaPhase = "Venus-ruled Period"
    theme = "Balance & Relationships"
    advice =
      "Seek harmony in partnerships and creative endeavors — beauty and justice matter"
  } else if ((month === 10 && date >= 16) || (month === 11 && date < 16)) {
    // November 16 - December 15: Scorpio
    vedicSign = "Scorpio"
    dashaPhase = "Mars-Pluto Period"
    theme = "Transformation & Depth"
    advice =
      "Embrace deep research and personal transformation — hidden truths emerge"
  } else {
    // December 16 - January 13: Sagittarius
    vedicSign = "Sagittarius"
    dashaPhase = "Jupiter-ruled Period"
    theme = "Expansion & Wisdom"
    advice =
      "Pursue higher learning and philosophical growth — wisdom expands your horizons"
  }

  return {
    dasha: dashaPhase,
    transit: `Sun in ${vedicSign}`,
    theme,
    advice,
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
