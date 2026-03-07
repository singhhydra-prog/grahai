/* ════════════════════════════════════════════════════════
   GrahAI — Daily Insights Cron Job

   Runs daily at 6:00 AM IST (00:30 UTC) via Vercel Cron.
   Generates personalized daily horoscopes for all premium
   users with saved Kundlis, stores in DB, sends via email.

   Vercel cron config (vercel.json):
   { "crons": [{ "path": "/api/cron/daily-insights", "schedule": "30 0 * * *" }] }
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateDailyInsight } from "@/lib/daily-insights/insight-generator"
import { renderDailyInsightEmail, renderDailyInsightPlainText } from "@/lib/daily-insights/email-template"
import type { BirthDetails } from "@/lib/ephemeris/types"

// ─── Config ─────────────────────────────────────────────

const BATCH_SIZE = 10 // Process users in batches
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = "GrahAI <insights@grahai.vercel.app>"

// ─── Supabase Admin ─────────────────────────────────────

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Send Email via Resend ──────────────────────────────

async function sendEmail(to: string, subject: string, html: string, text: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send")
    return false
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`Resend error for ${to}:`, err)
      return false
    }
    return true
  } catch (err) {
    console.error(`Email send failed for ${to}:`, err)
    return false
  }
}

// ─── Cron Auth Verification ─────────────────────────────

function verifyCronAuth(req: NextRequest): boolean {
  // Vercel Cron sends a special header
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`
  }

  // In development, allow without auth
  if (process.env.NODE_ENV === "development") return true

  // Check Vercel cron header
  const vercelCron = req.headers.get("x-vercel-cron")
  return vercelCron === "true"
}

// ─── GET Handler (Vercel Cron uses GET) ─────────────────

export async function GET(req: NextRequest) {
  const startTime = Date.now()

  // Verify this is a legitimate cron call
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split("T")[0]

  let processed = 0
  let emailed = 0
  let errors = 0
  let offset = 0

  try {
    // Process in batches
    while (true) {
      // Get premium users with saved kundlis who haven't received today's insight
      const { data: users, error: fetchError } = await supabase
        .from("kundlis")
        .select(`
          id,
          user_id,
          name,
          birth_date,
          birth_time,
          latitude,
          longitude,
          timezone,
          birth_place,
          profiles!inner (
            email,
            subscription_status,
            daily_email_enabled
          )
        `)
        .in("profiles.subscription_status", ["premium", "pro", "trial"])
        .eq("is_primary", true) // Only primary kundli per user
        .range(offset, offset + BATCH_SIZE - 1)

      if (fetchError) {
        console.error("Fetch users error:", fetchError)
        break
      }

      if (!users || users.length === 0) break

      // Process each user
      for (const kundli of users) {
        try {
          const profile = (kundli as any).profiles
          if (!profile?.email) continue

          // Check if insight already generated today
          const { data: existing } = await supabase
            .from("daily_insights")
            .select("id")
            .eq("user_id", kundli.user_id)
            .eq("date", today)
            .single()

          if (existing) {
            // Already generated today
            continue
          }

          // Build birth details
          const birthDetails: BirthDetails = {
            date: kundli.birth_date,              // "YYYY-MM-DD" string from DB
            time: kundli.birth_time || "12:00",   // default to noon if missing
            place: kundli.birth_place || "Unknown",
            latitude: kundli.latitude,
            longitude: kundli.longitude,
            timezone: kundli.timezone || 5.5,
          }

          // Generate insight
          const insight = await generateDailyInsight(
            kundli.user_id,
            birthDetails,
            kundli.name || "Friend"
          )

          // Store in DB
          const { error: insertError } = await supabase
            .from("daily_insights")
            .insert({
              user_id: kundli.user_id,
              date: today,
              panchang: insight.panchang,
              moon_transit: insight.moonTransit,
              key_transits: insight.keyTransits,
              dasha_context: insight.dashaContext,
              daily_remedy: insight.dailyRemedy,
              bphs_verse: insight.bphsVerse,
              activities: insight.activities,
              headline: insight.headline,
              overall_trend: insight.overallTrend,
              sade_sati_active: insight.sadeSatiActive,
              sade_sati_phase: insight.sadeSatiPhase,
            })

          if (insertError) {
            console.error(`DB insert error for ${kundli.user_id}:`, insertError)
            errors++
            continue
          }

          processed++

          // Send email if enabled
          if (profile.daily_email_enabled !== false) {
            const subject = `${insight.panchang.vara} — ${insight.headline}`
            const html = renderDailyInsightEmail(insight)
            const text = renderDailyInsightPlainText(insight)
            const sent = await sendEmail(profile.email, subject, html, text)
            if (sent) emailed++
          }
        } catch (userError) {
          console.error(`Error processing user ${kundli.user_id}:`, userError)
          errors++
        }
      }

      offset += BATCH_SIZE

      // Safety: stop after 200 users to stay within Vercel function timeout
      if (offset >= 200) {
        console.warn("Reached batch limit of 200 users")
        break
      }
    }

    const duration = Date.now() - startTime

    // Log cron execution
    // Log cron execution (non-fatal)
    try {
      await supabase.from("cron_logs").insert({
        job_name: "daily_insights",
        date: today,
        processed,
        emailed,
        errors,
        duration_ms: duration,
      })
    } catch { /* ignore logging failures */ }

    return NextResponse.json({
      success: true,
      date: today,
      processed,
      emailed,
      errors,
      durationMs: duration,
    })
  } catch (error) {
    console.error("Cron job fatal error:", error)
    return NextResponse.json(
      { error: "Cron job failed", details: String(error) },
      { status: 500 }
    )
  }
}

// ─── POST Handler (Manual trigger) ─────────────────────

export async function POST(req: NextRequest) {
  // Allow manual trigger for specific user (admin or self)
  try {
    const body = await req.json()
    const { userId, kundliId } = body

    if (!userId || !kundliId) {
      return NextResponse.json(
        { error: "userId and kundliId required" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Get kundli
    const { data: kundli, error } = await supabase
      .from("kundlis")
      .select("*")
      .eq("id", kundliId)
      .eq("user_id", userId)
      .single()

    if (error || !kundli) {
      return NextResponse.json({ error: "Kundli not found" }, { status: 404 })
    }

    const birthDetails: BirthDetails = {
      date: kundli.birth_date,
      time: kundli.birth_time || "12:00",
      place: kundli.birth_place || "Unknown",
      latitude: kundli.latitude,
      longitude: kundli.longitude,
      timezone: kundli.timezone || 5.5,
    }

    const insight = await generateDailyInsight(userId, birthDetails, kundli.name || "Friend")

    return NextResponse.json({ insight })
  } catch (err) {
    console.error("Manual insight error:", err)
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 })
  }
}
